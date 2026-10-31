import {readFile} from 'node:fs/promises';
import {renderPage} from '../src/pages.js';
import {allPaths,pageSEO,seoHead,siteSettings,publicPaths} from '../src/seo.js';
export const settings=siteSettings({origin:process.env.SITE_ORIGIN||'https://example.com',indexable:process.env.SITE_INDEXABLE==='true'});
export {allPaths};
export async function documentFor(path){
  let template=await readFile(new URL('../index.html',import.meta.url),'utf8');
  template=template.replace(/<title>[\s\S]*?<\/title>/,'').replace(/<meta name="(?:description|robots)"[^>]*>/g,'').replace(/<noscript>[\s\S]*?<\/noscript>/,'');
  template=template.replace('</head>',`${seoHead(pageSEO(path,settings))}<meta name="site-origin" content="${settings.origin}"><meta name="site-indexable" content="${settings.indexable}"></head>`);
  template=template.replace('<main id="main" tabindex="-1"></main>',`<main id="main" tabindex="-1">${renderPage(path).html}</main>`).replace('<body>',`<body${path==='/'?' class="is-home"':''}>`).replace('<span id="year"></span>',`<span id="year">${new Date().getFullYear()}</span>`);
  return template;
}
export function sitemap(){return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicPaths.map(path=>`  <url><loc>${settings.origin}${path}</loc></url>`).join('\n')}\n</urlset>\n`;}
export function robots(){return settings.indexable?`User-agent: *\nAllow: /\n${['/admin','/contact','/support','/showrooms','/test-ride','/privacy','/terms'].map(p=>`Disallow: ${p}`).join('\n')}\nSitemap: ${settings.origin}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n';}
