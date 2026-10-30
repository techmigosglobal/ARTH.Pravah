import { mkdir, rm, cp, readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
const manifest=JSON.parse(await readFile('assets/frames/manifest.json','utf8'));
for (const [model,sequence] of Object.entries(manifest)) {
  if (sequence.frames.length<2) throw new Error(`Missing animation sequence: ${model}`);
  for(const frame of sequence.frames) await stat('.'+frame);
}
await rm('dist',{recursive:true,force:true});
await mkdir('dist');
for (const p of ['index.html','src','assets','robots.txt','_headers']) await cp(p,join('dist',p),{recursive:true});
await writeFile('dist/_redirects','/* /index.html 200\n');
async function count(dir){let bytes=0,files=0;for(const f of await readdir(dir,{withFileTypes:true})){const p=join(dir,f.name);if(f.isDirectory()){const c=await count(p);bytes+=c.bytes;files+=c.files;}else{bytes+=(await stat(p)).size;files++;}}return {bytes,files};}
console.log('Production build complete:',await count('dist'));
