import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fixtureGLB} from './glb-fixture.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.TEST_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage(),errors=[],results=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await mkdir('.test-artifacts',{recursive:true});
async function check(name,run){try{await run();results.push({name,status:'pass'});console.log('PASS',name);}catch(e){results.push({name,status:'fail',error:e.message});console.error('FAIL',name,e.message);}}
async function modelIs(id){await page.waitForFunction(id=>document.querySelector('.home-hero')?.dataset.model===id,id);}
try{
 await check('hero automatically advances real imagery, title, description, link and selected model',async()=>{
   await page.goto(base);await page.waitForLoadState('networkidle');assert.equal(await page.locator('.home-hero').getAttribute('data-model'),'aero');
   await page.waitForFunction(()=>document.querySelector('.home-hero').dataset.model==='apex',{},{timeout:10000});
   assert.match(await page.locator('h1').innerText(),/A little presence/);assert.match(await page.locator('.hero-image.is-active').getAttribute('src'),/apex/);
   assert.equal(await page.locator('[data-select-model=apex]').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('[data-hero-discover]').getAttribute('href'),'/models/apex');
   await page.waitForTimeout(1350);await page.screenshot({path:'.test-artifacts/hero-autoplay-desktop.png'});
 });
 await check('hero controls, pause/resume, rapid selection and focus hold are consistent',async()=>{
   await page.getByRole('button',{name:'Pause slideshow',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Resume slideshow',exact:true}).count(),1);
   await page.locator('[data-hero-slide=teja]').click();await modelIs('teja');assert.match(await page.locator('.hero-slide-status').innerText(),/Teja/);
   await page.getByRole('button',{name:'Previous hero slide'}).click();await modelIs('nova');
   await page.locator('[data-hero-slide=vega]').click();await page.locator('[data-hero-slide=aero]').click();await modelIs('aero');
   await page.getByRole('button',{name:'Resume slideshow',exact:true}).click();await page.mouse.move(10,10);
   await page.waitForFunction(()=>document.querySelector('.home-hero').dataset.model==='apex',{},{timeout:10000});
   await page.locator('[data-hero-discover]').focus();assert.equal(await page.locator('.home-hero').getAttribute('data-running'),'false');
 });
 await check('offscreen hero stays fixed and does not change the film during scroll',async()=>{
   await page.goto(base);await page.locator('#film').scrollIntoViewIfNeeded();const id=await page.locator('.home-hero').getAttribute('data-model');
   await page.waitForTimeout(6500);assert.equal(await page.locator('.home-hero').getAttribute('data-model'),id);assert.equal(await page.locator('.home-hero').getAttribute('data-running'),'false');
 });
 await check('global pause freezes autoplay, graphics and scroll-driven film while manual controls work',async()=>{
   await page.goto(base);await page.getByRole('button',{name:'Pause animations',exact:true}).click();assert.ok(await page.locator('html').evaluate(e=>e.classList.contains('motion-paused')));
   assert.equal(await page.locator('.home-hero').getAttribute('data-running'),'false');
   assert.equal(await page.locator('.flow-pulse').evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
   assert.equal(await page.locator('.final-cta').evaluate(e=>getComputedStyle(e,'::after').animationPlayState),'paused');
   await page.locator('[data-hero-slide=vega]').click();await modelIs('vega');
   await page.locator('#film').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('.film-section canvas').dataset.state==='ready');
   const before=await page.locator('.film-section canvas').getAttribute('data-frame');await page.evaluate(()=>window.scrollBy({top:200,behavior:'instant'}));await page.waitForTimeout(100);assert.equal(await page.locator('.film-section canvas').getAttribute('data-frame'),before);
   await page.getByRole('button',{name:'Resume animations',exact:true}).click();
 });
 await check('motion graphics, mobile layout and reduced-motion manual carousel are usable',async()=>{
   await page.setViewportSize({width:375,height:844});await page.goto(base);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.waitForTimeout(1350);await page.screenshot({path:'.test-artifacts/hero-autoplay-mobile.png'});
   await page.locator('.motion-interlude').scrollIntoViewIfNeeded();await page.waitForTimeout(800);assert.equal(await page.locator('.flow-models a').count(),6);await page.screenshot({path:'.test-artifacts/motion-graphic-mobile.png'});
   const reduced=await browser.newContext({reducedMotion:'reduce',viewport:{width:375,height:844}}),p=await reduced.newPage();await p.goto(base);await p.waitForLoadState('networkidle');assert.equal(await p.locator('.home-hero').getAttribute('data-running'),'false');
   await p.locator('[data-hero-slide=nova]').click();await p.waitForFunction(()=>document.querySelector('.home-hero').dataset.model==='nova');assert.equal(await p.locator('canvas').first().getAttribute('data-state'),'reduced');await reduced.close();
 });
 await check('six product pages place an honest pending 3D viewer beside gallery with disabled controls',async()=>{
   for(const id of ['aero','apex','nova','teja','vayu','vega']){await page.goto(base+'/models/'+id);await page.waitForLoadState('networkidle');assert.equal(await page.locator('.bike3d-section').getAttribute('data-state'),'pending');assert.equal(await page.locator('.bike3d-canvas').isVisible(),false);assert.equal(await page.locator('[data-3d-action]:not(:disabled)').count(),0);assert.match(await page.locator('.bike3d-status').innerText(),/pending/);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
   await page.locator('#explore-3d').scrollIntoViewIfNeeded();await page.screenshot({path:'.test-artifacts/3d-pending-mobile.png'});
 });
 await check('native WebGL renders synthetic geometry and changes real pixels on rotation, zoom and reset',async()=>{
   const p=await context.newPage();
   await p.route('**/assets/3d/manifest.json',r=>r.fulfill({json:{aero:{approved:true,modelUrl:'/assets/3d/verification-fixture.glb'}}}));
   await p.route('**/assets/3d/verification-fixture.glb',r=>r.fulfill({contentType:'model/gltf-binary',body:Buffer.from(fixtureGLB())}));
   await p.goto(base+'/models/aero');await p.getByRole('button',{name:'Load 3D view'}).click();
   await p.waitForFunction(()=>document.querySelector('.bike3d-section').dataset.state==='ready');await p.waitForFunction(()=>Number(document.querySelector('.bike3d-canvas').dataset.draws)>0);
   const first=await p.locator('.bike3d-canvas').evaluate(c=>c.toDataURL());
   const pixels=await p.locator('.bike3d-canvas').evaluate(c=>{const g=c.getContext('webgl'),p=new Uint8Array(c.width*c.height*4);g.readPixels(0,0,c.width,c.height,g.RGBA,g.UNSIGNED_BYTE,p);let painted=0;for(let i=3;i<p.length;i+=4)if(p[i])painted++;return painted;});assert.ok(pixels>1000,'actual triangles must be visible');
   await p.getByRole('button',{name:'Rotate model right'}).click();await p.waitForFunction(()=>Number(document.querySelector('.bike3d-canvas').dataset.yaw)>.7);
   const rotated=await p.locator('.bike3d-canvas').evaluate(c=>c.toDataURL());assert.notEqual(rotated,first);
   await p.getByRole('button',{name:'Zoom in',exact:true}).click();await p.waitForFunction(()=>Number(document.querySelector('.bike3d-canvas').dataset.distance)<4.4);
   await p.locator('.bike3d-canvas').focus();await p.keyboard.press('ArrowLeft');await p.keyboard.press('Home');await p.waitForFunction(()=>document.querySelector('.bike3d-canvas').dataset.yaw==='0.65'&&document.querySelector('.bike3d-canvas').dataset.distance==='4.4');
   const box=await p.locator('.bike3d-canvas').boundingBox();await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.mouse.down();await p.mouse.move(box.x+box.width/2+80,box.y+box.height/2+25,{steps:5});await p.mouse.up();await p.waitForFunction(()=>Number(document.querySelector('.bike3d-canvas').dataset.yaw)>1);
   await p.close();
 });
 await check('bad 3D files produce explicit errors without a substitute model',async()=>{
   const p=await context.newPage();await p.route('**/assets/3d/manifest.json',r=>r.fulfill({json:{aero:{approved:true,modelUrl:'/assets/3d/invalid-fixture.glb'}}}));await p.route('**/assets/3d/invalid-fixture.glb',r=>r.fulfill({contentType:'model/gltf-binary',body:'invalid'}));await p.goto(base+'/models/aero');await p.getByRole('button',{name:'Load 3D view'}).click();await p.waitForFunction(()=>document.querySelector('.bike3d-section').dataset.state==='error');assert.match(await p.locator('.bike3d-placeholder').innerText(),/No substitute/);await p.close();
 });
 await check('new motion journeys have no browser console or uncaught JavaScript errors',async()=>assert.deepEqual(errors,[]));
}finally{await browser.close();await writeFile('.test-artifacts/motion-browser-results.json',JSON.stringify(results,null,2)+'\n');}
if(results.some(r=>r.status==='fail'))process.exitCode=1;
