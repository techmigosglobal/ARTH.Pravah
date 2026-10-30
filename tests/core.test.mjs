import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {models,progressToFrame,containSize,calculateCosts} from '../src/data.js';
test('frame mapping clamps boundaries, moves forward and reverses exactly',()=>{
  assert.equal(progressToFrame(-1,84),0);assert.equal(progressToFrame(0,84),0);assert.equal(progressToFrame(1,84),83);assert.equal(progressToFrame(2,84),83);
  const forward=[0,.25,.5,.75,1].map(p=>progressToFrame(p,84));
  assert.deepEqual([...forward].reverse(),[1,.75,.5,.25,0].map(p=>progressToFrame(p,84)));
  assert.equal(progressToFrame(.8,0),0);assert.equal(progressToFrame(.8,1),0);
});
test('contain sizing preserves aspect and centres landscape frames in portrait canvas',()=>{
  const b=containSize(360,600,960,540);assert.equal(b.width,360);assert.equal(b.height,202.5);assert.equal(b.x,0);assert.equal(b.y,198.75);
  const w=containSize(1000,400,960,540);assert.ok(Math.abs(w.width/w.height-16/9)<1e-10);assert.ok(w.x>0);assert.equal(w.y,0);
});
test('cost fixture, zero distance and negative savings are honest',()=>{
  const input={distance:30,days:26,electricity:8,petrol:100,mileage:50,consumption:3};
  assert.deepEqual(calculateCosts(input),{km:780,ev:187.2,fuel:1560,difference:1372.8,evPerKm:.24,petrolPerKm:2});
  assert.equal(calculateCosts({...input,distance:0}).difference,0);
  assert.ok(calculateCosts({...input,electricity:100,consumption:20}).difference<0);
  for(const change of [{consumption:''},{mileage:0},{days:32},{days:1.5},{distance:-1},{petrol:Infinity},{consumption:NaN}])assert.throws(()=>calculateCosts({...input,...change}));
});
test('six real manifests contain unique existing frames and all model views exist',async()=>{
  const manifest=JSON.parse(await readFile(new URL('../assets/frames/manifest.json',import.meta.url),'utf8'));
  assert.deepEqual(Object.keys(manifest),models.map(m=>m.id));
  for(const model of models){const seq=manifest[model.id];assert.ok(seq.frames.length>2);assert.equal(new Set(seq.frames).size,seq.frames.length);assert.equal(seq.width/seq.height,16/9);
    for(const p of seq.frames)assert.ok((await stat(new URL('..'+p,import.meta.url))).size>0);
    for(const view of ['hero','front','side','back'])await stat(new URL(`../assets/models/${model.id}/${view}.webp`,import.meta.url));
  }
});
test('application has no runtime npm dependencies or prohibited animation libraries',async()=>{
 const pkg=JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8'));assert.equal(Object.keys(pkg.dependencies||{}).length,0);assert.equal(Object.keys(pkg.devDependencies||{}).length,0);
 for(const path of ['app.js','sequence.js','data.js']){const src=await readFile(new URL('../src/'+path,import.meta.url),'utf8');assert.doesNotMatch(src,/from\s+['"](?:gsap|three|@react-three|framer-motion|motion|lenis)/);}
});

import {parseGLB,identity,multiply} from '../src/glb.js';
import {fixtureGLB} from './glb-fixture.mjs';
test('static GLB parser reads and centres real triangle geometry',()=>{
  const mesh=parseGLB(fixtureGLB());assert.equal(mesh.primitives.length,1);assert.equal(mesh.vertices,8);assert.equal(mesh.primitives[0].indices.length,36);
  assert.ok([...mesh.primitives[0].positions].every(Number.isFinite));assert.ok(Math.abs(Math.max(...mesh.primitives[0].positions)-1.3)<1e-6);
  assert.ok([...mesh.primitives[0].normals].some(n=>n!==0));
  const moved=parseGLB(fixtureGLB(j=>{j.nodes[0].translation=[5,2,-1];j.nodes[0].scale=[2,2,2];return j;}));
  moved.primitives[0].positions.forEach((n,i)=>assert.ok(Math.abs(n-mesh.primitives[0].positions[i])<1e-6));
  const m=identity();m[12]=3;assert.equal(multiply(identity(),m)[12],3);
});
test('GLB parser rejects malformed, compressed, out-of-bounds and cyclic scenes',()=>{
  assert.throws(()=>parseGLB(new ArrayBuffer(12)));
  const invalid=fixtureGLB();new DataView(invalid).setUint32(0,0,true);assert.throws(()=>parseGLB(invalid));
  for(const alter of [j=>{j.extensionsRequired=['KHR_draco_mesh_compression'];return j;},j=>{j.accessors[0].count=999999;return j;},j=>{j.nodes[0].children=[0];return j;},j=>{j.accessors[0].sparse={count:1};return j;}])assert.throws(()=>parseGLB(fixtureGLB(alter)));
});
test('3D bike content is explicitly pending, with no invented model URLs',async()=>{
  const manifest=JSON.parse(await readFile(new URL('../assets/3d/manifest.json',import.meta.url),'utf8'));
  for(const model of models){assert.equal(manifest[model.id].approved,false);assert.equal(manifest[model.id].modelUrl,null);}
});
