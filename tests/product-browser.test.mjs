import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true});
const base=process.env.TEST_URL||'http://127.0.0.1:4173',results=[],errors=[];
await mkdir('.test-artifacts',{recursive:true});
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 for(const [id,payload] of [['aero',150],['apex',150],['nova',175],['teja',200],['vayu',220],['vega',250]]){
  const response=await page.goto(base+'/models/'+id);assert.equal(response.status(),200);await page.waitForSelector('[data-battery="lead"]');
  assert.equal(await page.locator('h1').count(),1);assert.match(await page.locator('.fact-strip').innerText(),new RegExp(payload+' kg'));
  await page.locator('[data-battery="lead"]').click();assert.equal(await page.locator('[data-charge-time]').innerText(),'4–5 hours*');assert.equal(await page.locator('[data-battery="lead"]').getAttribute('aria-pressed'),'true');
  await page.locator('[data-battery="lithium"]').click();assert.equal(await page.locator('[data-charge-time]').innerText(),'3–4 hours*');
  const summary=page.locator('.technical-specs details').nth(1).locator('summary');await summary.click();assert.equal(await page.locator('.technical-specs details').nth(1).getAttribute('open'),'');
  await page.locator('[data-view=side]').click();assert.match(await page.locator('#gallery-image').getAttribute('src'),new RegExp(id+'/side'));await page.locator('.gallery-enlarge').click();assert.equal(await page.locator('dialog').evaluate(e=>e.open),true);await page.keyboard.press('Escape');
  assert.equal(await page.locator('link[rel=canonical]').count(),1);assert.ok((await page.title()).includes(id[0].toUpperCase()+id.slice(1)));
  results.push(id+' battery, specifications, gallery and metadata passed');
 }
 await page.goto(base+'/models/aero');await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0);});await page.screenshot({path:'.test-artifacts/product-desktop.png',fullPage:true});
 for(const width of [320,375,768,1024,1440]){await page.setViewportSize({width,height:900});await page.goto(base+'/models/vega');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`);if(width===375){await page.screenshot({path:'.test-artifacts/product-mobile.png',fullPage:true});await page.locator('a[href="#battery"]').first().click();await page.waitForTimeout(100);await page.screenshot({path:'.test-artifacts/product-mobile-battery.png'});}}
 await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/models/aero');await page.locator('.product-quote a[href="/compare"]').click();assert.match(await page.title(),/Compare/);assert.doesNotMatch(await page.locator('link[rel=canonical]').getAttribute('href'),/aero/);for(const id of ['aero','vega'])await page.locator(`[data-compare="${id}"]`).click();assert.match(await page.locator('table').innerText(),/250 kg/);
 const mobileContext=await browser.newContext({viewport:{width:375,height:900}});const mobile=await mobileContext.newPage();await mobile.goto(base+'/models/aero');await mobile.locator('[data-battery="lead"]').focus();await mobile.keyboard.press('Space');assert.equal(await mobile.locator('[data-charge-time]').innerText(),'4–5 hours*');
 const motion=await mobile.locator('.site-motion-toggle').boundingBox(),bar=await mobile.locator('.mobile-product-action').boundingBox(),quote=await mobile.locator('.mobile-product-action a').boundingBox();assert.ok(motion.y>=bar.y&&motion.y+motion.height<=bar.y+bar.height+1);assert.ok(quote.y+quote.height<=motion.y);await mobileContext.close();
 const staticContext=await browser.newContext({javaScriptEnabled:false});const staticPage=await staticContext.newPage();await staticPage.goto(base+'/models/aero');assert.equal(await staticPage.locator('h1').count(),1);assert.match(await staticPage.locator('main').innerText(),/The full specification/);await staticContext.close();
 assert.equal((await page.request.get(base+'/models/aero/extra')).status(),404);assert.equal((await page.request.get(base+'/missing')).status(),404);assert.match((await page.request.get(base+'/sitemap.xml')).headers()['content-type'],/xml/);assert.deepEqual(errors,[]);
 results.push('Responsive widths, client navigation, no-JS content, comparison, sitemap and 404 passed');
 console.log(results.join('\n'));
}finally{await browser.close();await writeFile('.test-artifacts/product-results.json',JSON.stringify({results,errors},null,2));}
