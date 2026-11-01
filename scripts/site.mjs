import {readFile} from 'node:fs/promises';
import {renderPage} from '../src/pages.js';
import {allPaths,pageSEO,seoHead,siteSettings,publicPaths} from '../src/seo.js';
import {parentHeader,parentHome,parentFooter} from '../src/arthasya.js';
import {parentPage} from '../src/arthasya-pages.js';
export const settings=siteSettings({origin:process.env.SITE_ORIGIN||'https://example.com',indexable:process.env.SITE_INDEXABLE==='true'});
export {allPaths};
const parentPaths=new Set(['/arth.export','/arth.urja','/arth.gati','/about','/contact']);
const parentPreload=path=>path==='/arth.urja'?'/assets/arthasya/slide-urja.png':path==='/arth.gati'?'/assets/arthasya/slide-gati.png':path==='/arth.export'?'/assets/arthasya/slide-export.png':'/assets/arthasya/slide-export.png';
export async function documentFor(path){
  if(path==='/'||parentPaths.has(path)) return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#142a32">${seoHead(pageSEO(path,settings))}<link rel="icon" type="image/png" href="/assets/arthasya/logo-transparent.png"><link rel="preload" as="image" href="${parentPreload(path)}"><link rel="stylesheet" href="/src/arthasya.css"><script type="module" src="/src/arthasya-client.js"></script></head><body class="arthasya-home">${path==='/'?`${parentHeader()}<main id="main" tabindex="-1">${parentHome()}</main>${parentFooter()}`:parentPage(path)}</body></html>`;
  let template=await readFile(new URL('../index.html',import.meta.url),'utf8');
  template=template.replace(/<title>[\s\S]*?<\/title>/,'').replace(/<meta name="(?:description|robots)"[^>]*>/g,'').replace(/<noscript>[\s\S]*?<\/noscript>/,'');
  template=template.replace('</head>',`${seoHead(pageSEO(path,settings))}<meta name="site-origin" content="${settings.origin}"><meta name="site-indexable" content="${settings.indexable}"></head>`);
  template=template.replace('<main id="main" tabindex="-1"></main>',`<main id="main" tabindex="-1">${renderPage(path).html}</main>`).replace('<body>',`<body${path==='/arth.pravah'?' class="is-home"':''}>`).replace('<span id="year"></span>',`<span id="year">${new Date().getFullYear()}</span>`);
  return template;
}
export function sitemap(){return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicPaths.map(path=>`  <url><loc>${settings.origin}${path}</loc></url>`).join('\n')}\n</urlset>\n`;}
export function robots(){return settings.indexable?`User-agent: *\nAllow: /\n${['/admin','/support','/showrooms','/test-ride','/privacy','/terms'].map(p=>`Disallow: ${p}`).join('\n')}\nSitemap: ${settings.origin}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n';}
