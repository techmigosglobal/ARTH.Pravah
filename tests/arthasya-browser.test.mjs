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
  const page=await context.newPage(),errors=[],requests=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  page.on('request',request=>requests.push(request.url()));
  assert.equal((await page.goto(base)).status(),200);
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForLoadState('networkidle');
  assert.equal(await page.locator('h1').innerText(),'Connecting\ntrade, energy\nand mobility.');
  assert.equal(await page.locator('.arth-business').count(),4);
  assert.equal(await page.locator('.arth-logo').count(),2);
  assert.equal(await page.locator('img').evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0)),true);
  const photos=await page.locator('.arth-photo').evaluateAll(elements=>elements.map(e=>getComputedStyle(e).backgroundImage).filter(s=>s!=='none'));
  assert.ok(photos.every(s=>s.includes('businesses.png')||s.includes('hero.png')));
  assert.ok(!requests.some(url=>/frame-\d|\.glb$|\/src\/app.js/.test(url)),'parent must not load EV films or 3D');
  await page.screenshot({path:output+'/homepage-desktop.png',fullPage:true});
  await page.getByRole('link',{name:'Explore our businesses',exact:true}).click();
  await page.waitForFunction(()=>location.hash==='#businesses');
  for(const [name,title] of [['Explore exports','Export'],['Explore charging','arth.urja'],['Explore fleet services','arth.gati']]){
    const opener=page.getByRole('button',{name,exact:true});
    await opener.click();
    assert.equal(await page.locator('dialog').evaluate(d=>d.open),true);
    assert.equal(await page.locator('#arth-dialog-title').innerText(),title);
    assert.match(await page.locator('.arth-dialog-note').innerText(),/not yet available/);
    await page.keyboard.press('Escape');
    assert.equal(await opener.evaluate(e=>e===document.activeElement),true);
  }
  await page.getByRole('button',{name:'Get in touch',exact:true}).first().click();
  assert.equal(await page.locator('#arth-dialog-title').innerText(),'Let’s start a conversation.');
  await page.getByRole('button',{name:'Back to exploring'}).click();
  await page.getByRole('link',{name:'Explore EV bikes',exact:true}).click();
  await page.waitForURL(base+'/arth.pravah');
  assert.equal(await page.locator('.home-hero').count(),1);
  assert.equal(await page.locator('.film-section').count(),1);
  await page.goto(base+'/models/aero');
  await page.locator('.site-header .wordmark').click();
  await page.waitForURL(base+'/arth.pravah');
  assert.equal(await page.locator('.home-hero').count(),1);
  await page.locator('.site-footer').getByRole('link',{name:'Arthasya home',exact:true}).click();
  await page.waitForURL(base+'/');
  assert.equal(await page.locator('.arth-hero').count(),1);
  await page.goBack();
  assert.equal(await page.locator('.home-hero').count(),1);
  console.log('PASS desktop layout, all business actions, dialog focus, EV round trip and browser history');
  for(const width of [320,390,760,768,1024]){
    await page.setViewportSize({width,height:844});
    await page.goto(base);
    await page.evaluate(()=>document.fonts.ready);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`);
    if(width<=760){
      const menu=page.getByRole('button',{name:'Open navigation'});
      await menu.click();
      assert.equal(await page.locator('#arth-mobile-nav').isVisible(),true);
      await page.keyboard.press('Escape');
      assert.equal(await menu.getAttribute('aria-expanded'),'false');
      await menu.click();
      await page.locator('#arth-mobile-nav').getByRole('link',{name:'Our businesses'}).click();
      assert.equal(await menu.getAttribute('aria-expanded'),'false');
    }
    if(width===390){await page.goto(base);await page.screenshot({path:output+'/homepage-mobile.png',fullPage:true});}
  }
  await page.setViewportSize({width:899,height:1750});
  await page.goto(base);await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:output+'/homepage-reference-size.png',fullPage:true});
  const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:1000}}),staticPage=await noJS.newPage();
  await staticPage.goto(base);
  assert.equal(await staticPage.locator('.arth-business').count(),4);
  assert.equal(await staticPage.locator('h1').count(),1);
  assert.equal((await staticPage.getByRole('link',{name:'Explore EV bikes'}).getAttribute('href')),'/arth.pravah');
  await noJS.close();
  const reduced=await browser.newContext({reducedMotion:'reduce'}),reducedPage=await reduced.newPage();
  await reducedPage.goto(base);
  assert.equal(await reducedPage.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
  await reduced.close();
  assert.deepEqual(errors,[]);
  console.log('PASS mobile and tablet layouts, navigation, static HTML, reduced motion and clean console');
}finally{await browser.close();}
