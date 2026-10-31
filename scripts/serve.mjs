import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {documentFor,allPaths,settings,sitemap,robots} from './site.mjs';
const built=process.argv.includes('--dist'),root=resolve(built?'dist':'.'),port=Number(process.env.PORT||4173);
const headerFile=await readFile(resolve(root,'_headers'),'utf8');
const headers=Object.fromEntries(headerFile.split('\n/assets/')[0].split('\n').filter(l=>l.startsWith('  ')).map(l=>{const i=l.indexOf(':');return [l.slice(0,i).trim(),l.slice(i+1).trim()];}));
if(!built&&settings.indexable) delete headers['X-Robots-Tag'];
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.ttf':'font/ttf','.txt':'text/plain','.xml':'application/xml','.glb':'model/gltf-binary'};
http.createServer(async(req,res)=>{
  const send=(status,data,type)=>{res.writeHead(status,{...headers,'Content-Type':type,'Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:data);};
  try{
    const raw=new URL(req.url,'http://localhost').pathname,path=decodeURIComponent(raw).replace(/\/$/,'')||'/';
    if(path==='/index.html'||path.endsWith('/index.html')||raw.endsWith('/')&&path!=='/'){
      const target=path==='/index.html'?'/':path.replace(/\/index\.html$/,'');
      if(allPaths.includes(target)){res.writeHead(308,{Location:target+new URL(req.url,'http://localhost').search});res.end();return;}
    }
    if(allPaths.includes(path)) return send(200,built?await readFile(resolve(root,'.'+path,'index.html')):await documentFor(path),mime['.html']);
    if(path==='/sitemap.xml'||path==='/robots.txt') return send(200,built?await readFile(resolve(root,'.'+path)):path.endsWith('.xml')?sitemap():robots(),mime[extname(path)]);
    if(path.startsWith('/src/')||path.startsWith('/assets/')){
      const file=resolve(root,'.'+path);
      const surfaceRoot=resolve(root,path.startsWith('/assets/')?'assets':'src');
      if(!file.startsWith(surfaceRoot+sep)||!(await stat(file)).isFile()) throw new Error('Unavailable file');
      return send(200,await readFile(file),mime[extname(file)]||'application/octet-stream');
    }
    return send(404,built?await readFile(resolve(root,'404.html')):await documentFor('/404'),mime['.html']);
  }catch{return send(404,'Not found','text/plain');}
}).listen(port,'127.0.0.1',()=>console.log(`ARTH.Pravah ${root} → http://127.0.0.1:${port}`));
