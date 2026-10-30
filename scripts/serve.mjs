import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(process.argv.includes('--dist') ? 'dist' : '.');
const port = Number(process.env.PORT || 4173);
const headerFile=await readFile(resolve(root,'_headers'),'utf8');
const headers=Object.fromEntries(headerFile.split('\n/assets/')[0].split('\n').filter(l=>l.startsWith('  ')).map(l=>{const i=l.indexOf(':');return [l.slice(0,i).trim(),l.slice(i+1).trim()];}));
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.ttf':'font/ttf','.txt':'text/plain','.xml':'application/xml','.glb':'model/gltf-binary'};
http.createServer(async (req,res) => {
  try {
    const path = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    // Only serve the explicit website surface, never the PRD, sources or original media.
    const allowed = path === '/' || path === '/index.html' || path.startsWith('/src/') || path.startsWith('/assets/') || path === '/robots.txt';
    let file;
    if (allowed) file = resolve(root,'.'+(path === '/' ? '/index.html' : path));
    else if (!extname(path) && !path.startsWith('/api/')) file = resolve(root,'index.html');
    else {res.writeHead(404);res.end('Not found');return;}
    if (!file.startsWith(root+sep)) {res.writeHead(403);res.end();return;}
    if (!(await stat(file)).isFile()) throw new Error('Not a file');
    const data=await readFile(file);
    res.writeHead(200,{...headers,'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`ARTH.Pravah ${root} → http://127.0.0.1:${port}`));
