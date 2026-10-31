import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const base=process.env.TEST_URL||'http://127.0.0.1:4174';
const output=process.env.TEST_ARTIFACTS||join(tmpdir(),'arth-pravah-3d');
await mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--enable-unsafe-swiftshader']});
const results=[];
const ids=(process.env.TEST_MODELS||'aero,apex,nova,teja,vayu,vega').split(',');
try {
 for(const width of [1440,390]) {
  const context=await browser.newContext({viewport:{width,height:width===390?844:1000},reducedMotion:'reduce',hasTouch:width===390,isMobile:width===390});
  for(const id of ids) {
   const p=await context.newPage(),errors=[],downloads=[];
   p.on('pageerror',e=>errors.push(e.message));
   p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
   p.on('request',r=>{if(r.url().endsWith('.glb'))downloads.push(r.url());});
   await p.goto(base+'/models/'+id);await p.waitForLoadState('networkidle');
   assert.match(await p.title(),new RegExp(id,'i'));assert.ok((await p.locator('h1').innerText()).length>0);
   await p.waitForFunction(()=>document.querySelector('.bike3d-section').dataset.state==='available');
   assert.equal(downloads.length,0,'meshes must not download before user chooses to load');
   await p.locator('#explore-3d').scrollIntoViewIfNeeded();
   await p.getByRole('button',{name:'Load 3D view'}).click();
   await p.waitForFunction(()=>document.querySelector('.bike3d-section').dataset.state==='ready',{},{timeout:30000});
   await p.waitForFunction(()=>Number(document.querySelector('.bike3d-canvas').dataset.draws)>0);
   assert.equal(downloads.length,1);assert.equal(await p.locator('.bike3d-disclosure').isVisible(),true);
   const canvas=p.locator('.bike3d-canvas'),first=await canvas.evaluate(c=>c.toDataURL());
   const pixels=await canvas.evaluate(c=>{const g=c.getContext('webgl'),data=new Uint8Array(c.width*c.height*4);g.readPixels(0,0,c.width,c.height,g.RGBA,g.UNSIGNED_BYTE,data);let count=0;for(let i=3;i<data.length;i+=4)if(data[i])count++;return count;});
   assert.ok(pixels>5000,'a visible mesh must be painted');
   await p.screenshot({path:join(output,`${id}-${width}.png`)});
   await p.getByRole('button',{name:'Rotate model right'}).click();
   await p.waitForFunction(()=>Number(document.querySelector('.bike3d-canvas').dataset.yaw)>-.6);
   assert.notEqual(await canvas.evaluate(c=>c.toDataURL()),first);
   await p.getByRole('button',{name:'Zoom in',exact:true}).click();
   await p.waitForFunction(()=>Number(document.querySelector('.bike3d-canvas').dataset.distance)<4.4);
   await canvas.focus();await p.keyboard.press('Home');
   await p.waitForFunction(()=>document.querySelector('.bike3d-canvas').dataset.yaw==='-0.65'&&document.querySelector('.bike3d-canvas').dataset.distance==='4.4');
   if(width===1440){
    const b=await canvas.boundingBox();await p.mouse.move(b.x+b.width/2,b.y+b.height/2);await p.mouse.down();await p.mouse.move(b.x+b.width/2+90,b.y+b.height/2+20,{steps:6});await p.mouse.up();
    await p.waitForFunction(()=>Number(document.querySelector('.bike3d-canvas').dataset.yaw)>0);
   }else{
    const b=await canvas.boundingBox(),cdp=await context.newCDPSession(p);
    const x=b.x+b.width/2,y=b.y+b.height/2;
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
    for(let step=1;step<=6;step++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+step*12,y}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await p.waitForFunction(()=>Number(document.querySelector('.bike3d-canvas').dataset.yaw)>-.3);
    const before=await p.evaluate(()=>scrollY);
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
    for(let step=1;step<=6;step++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-step*15}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await p.waitForFunction(before=>scrollY>before+20,before);
    await cdp.detach();
   }
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   assert.deepEqual(errors,[]);results.push({id,width,pixels,status:'pass'});console.log('PASS',id,width,pixels);
   await p.close();
  }
  await context.close();
 }
 const context=await browser.newContext(),p=await context.newPage();
 await p.route('**/assets/3d/aero.glb',r=>r.fulfill({contentType:'model/gltf-binary',body:'invalid'}));
 await p.goto(base+'/models/aero');await p.getByRole('button',{name:'Load 3D view'}).click();
 await p.waitForFunction(()=>document.querySelector('.bike3d-section').dataset.state==='error');
 assert.equal(await p.getByRole('button',{name:'Retry 3D view'}).isVisible(),true);
 assert.equal(await p.locator('.bike3d-canvas').isVisible(),false);
 assert.equal(await p.locator('.bike3d-placeholder a').getAttribute('href'),'#gallery');
 console.log('PASS malformed asset fallback');
 // Missing, unapproved, and disallowed asset URLs must retain the photo fallback.
 for(const item of [{approved:false,modelUrl:null},{approved:false,available:true,kind:'unknown',modelUrl:'/assets/3d/aero.glb'},{approved:true,modelUrl:'https://other.example/aero.glb'}]){
  await p.route('**/assets/3d/manifest.json',r=>r.fulfill({json:{aero:item}}));
  await p.reload();await p.waitForLoadState('networkidle');
  assert.equal(await p.locator('.bike3d-section').getAttribute('data-state'),'pending');
  assert.equal(await p.locator('[data-load-3d]').isVisible(),false);
 }
 console.log('PASS pending and untrusted manifest fallback');
 await context.close();
}finally{await browser.close();await writeFile(join(output,'results.json'),JSON.stringify(results,null,2));}
