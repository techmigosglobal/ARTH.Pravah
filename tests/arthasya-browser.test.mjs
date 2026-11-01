import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true});
const base=process.env.TEST_URL||'http://127.0.0.1:4173';
const output=process.env.TEST_ARTIFACTS||'.test-artifacts/arthasya';
await mkdir(output,{recursive:true});
try{
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  assert.equal((await page.goto(base)).status(),200);await page.waitForLoadState('networkidle');
  assert.equal(await page.locator('.arth-slide').count(),4);
  assert.equal(await page.locator('.arth-slide.is-active h1').textContent(),'Trade that travels.');
  assert.equal(await page.locator('.arth-slide-image').evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0)),true);
  assert.equal(await page.locator('.arth-business-row').count(),4);
  const headerBounds=await page.locator('.arth-header').boundingBox(),logoBounds=await page.locator('.arth-header .arth-logo').boundingBox();assert.ok(headerBounds&&logoBounds&&logoBounds.y>=headerBounds.y&&logoBounds.y+logoBounds.height<=headerBounds.y+headerBounds.height+1);assert.equal(await page.locator('.arth-footer').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(20, 42, 50)');assert.equal(await page.locator('.arth-footer-link').count(),8);
  assert.equal(await page.getByRole('link',{name:'Explore Our Businesses'}).getAttribute('href'),'#businesses');
  assert.equal(await page.getByRole('link',{name:'Our Vision'}).getAttribute('href'),'/about#vision');
  await page.evaluate(()=>scrollTo(0,120));await page.waitForTimeout(80);assert.equal(await page.locator('.arth-header').evaluate(e=>e.classList.contains('is-scrolled')),true);assert.ok((await page.locator('.arth-header').evaluate(e=>getComputedStyle(e).backgroundColor)).startsWith('rgba(20, 42, 50'));
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:output+'/homepage-desktop.png',fullPage:true});
  await page.getByRole('button',{name:'Next slide'}).click();await page.waitForTimeout(100);
  assert.equal(await page.locator('.arth-slide.is-active h1').textContent(),'Electric, every day.');
  await page.getByRole('link',{name:'Explore EV bikes',exact:true}).first().click();await page.waitForURL(base+'/arth.pravah');
  assert.equal(await page.locator('.home-hero').count(),1);
  await page.goto(base);await page.waitForLoadState('networkidle');await page.getByRole('button',{name:'Show arth.urja'}).click();await page.waitForTimeout(100);assert.equal(await page.locator('.arth-slider').evaluate(e=>getComputedStyle(e).getPropertyValue('--slide-accent').trim()),'#4ddf8c');await page.getByRole('button',{name:'Show arth.gati'}).click();await page.waitForTimeout(100);assert.equal(await page.locator('.arth-slider').evaluate(e=>getComputedStyle(e).getPropertyValue('--slide-accent').trim()),'#f2c14e');
  assert.equal(await page.locator('.arth-slide.is-active h1').textContent(),'Fleet built to move.');
  await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('.arth-slide.is-active h1').textContent(),'Charge the next move.');
  await page.getByRole('button',{name:'Play'}).click();await page.getByRole('button',{name:'Pause'}).click();const paused=await page.locator('.arth-slide.is-active h1').textContent();await page.waitForTimeout(7000);assert.equal(await page.locator('.arth-slide.is-active h1').textContent(),paused);
  await page.getByRole('button',{name:'Play'}).click();await page.waitForTimeout(6700);assert.notEqual(await page.locator('.arth-slide.is-active h1').textContent(),paused);
  await page.goto(base+'/about#vision');await page.waitForLoadState('networkidle');assert.equal(await page.locator('#vision').count(),1);assert.match(await page.locator('h1').first().textContent(),/More than business/);
  for(const [path,heading] of [['arth.export','Spices with a sense of place.'],['arth.urja','Charge the next move.'],['arth.gati','Fleet built to move.']]){await page.goto(base+'/'+path);await page.waitForLoadState('networkidle');assert.equal(await page.locator('h1').first().textContent(),heading);assert.equal(await page.locator('.arth-page-media img').count(),1);}
  await page.goto(base+'/contact');await page.waitForLoadState('networkidle');assert.equal(await page.locator('[data-enquiry-form]').count(),4);const form=page.locator('[data-enquiry-form="urja-enquiry"]');await form.locator('[data-enquiry-submit]').click();assert.equal(await form.locator('input[name="name"]').evaluate(e=>e.matches(':invalid')),true);await form.locator('input[name="name"]').fill('Test visitor');await form.locator('input[name="email"]').fill('test@example.com');await form.locator('textarea[name="message"]').fill('Charging point enquiry');await form.locator('[data-enquiry-submit]').click();assert.match(await form.locator('[data-form-status]').textContent(),/Nothing was sent or stored/);assert.equal(await page.url(),base+'/contact');
  await page.goto(base);await page.locator('[data-slider]').focus();await page.mouse.move(700,450);await page.mouse.down();await page.mouse.move(400,450);await page.mouse.up();assert.equal(await page.locator('.arth-slide.is-active h1').textContent(),'Electric, every day.');
  for(const width of [320,390,760,1024]){await page.setViewportSize({width,height:844});await page.goto(base);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`);if(width<=680){const menuToggle=page.getByRole('button',{name:'Open navigation'});await menuToggle.click();assert.equal(await page.locator('#arth-mobile-nav').isVisible(),true);assert.equal(await page.locator('body').evaluate(e=>e.classList.contains('arth-menu-open')),true);assert.equal(await page.locator('#arth-mobile-nav a').first().evaluate(e=>document.activeElement===e),true);await page.keyboard.press('Escape');assert.equal(await page.getByRole('button',{name:'Open navigation'}).getAttribute('aria-expanded'),'false');assert.equal(await page.locator('body').evaluate(e=>e.classList.contains('arth-menu-open')),false);assert.equal(await page.getByRole('button',{name:'Open navigation'}).evaluate(e=>document.activeElement===e),true);}if(width===390)await page.screenshot({path:output+'/homepage-mobile.png',fullPage:true});}
  const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:1000}}),staticPage=await noJS.newPage();await staticPage.goto(base);assert.equal(await staticPage.locator('.arth-business-row').count(),4);assert.equal((await staticPage.getByRole('link',{name:'Explore EV bikes'}).getAttribute('href')),'/arth.pravah');await noJS.close();
  const reduced=await browser.newContext({reducedMotion:'reduce'}),reducedPage=await reduced.newPage();await reducedPage.goto(base);const first=await reducedPage.locator('.arth-slide.is-active h1').textContent();await reducedPage.waitForTimeout(7000);assert.equal(await reducedPage.locator('.arth-slide.is-active h1').textContent(),first);await reduced.close();
  assert.deepEqual(errors,[]);console.log('PASS Arthasya slider controls, EV round trip, responsive layouts, no-JS and reduced motion');
}finally{await browser.close();}
