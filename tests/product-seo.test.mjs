import {test} from 'node:test';
import assert from 'node:assert/strict';
import {models} from '../src/data.js';
import {renderPage} from '../src/pages.js';
import {siteSettings,pageSEO,publicPaths,allPaths} from '../src/seo.js';
import {documentFor,sitemap,robots} from '../scripts/site.mjs';
test('confirmed identities and distinct catalogue values remain mapped correctly',()=>{
 assert.deepEqual(models.map(m=>[m.specs.reference,m.specs.page,m.specs.payload]),[['B2+',2,150],['B1',3,150],['B2',4,175],['B4',5,200],['B5',7,220],['B5 Pro',9,250]]);
 assert.equal(models[3].specs.tyres,'10/12 inch');assert.equal(models[4].specs.brakes,'Front / rear disc brakes');
 for(const m of models){assert.ok(m.specs.headlineRange);assert.ok(m.specs.lithiumRange);assert.equal(m.specs.rangeStatus,'Requires confirmation');assert.equal(m.specs.warrantyStatus,'Requires confirmation');}
});
test('all six product pages have complete static content and honest claims',async()=>{
 for(const m of models){const html=await documentFor('/models/'+m.id);assert.match(html,new RegExp(m.specs.payload+' kg'));assert.match(html,/data-battery="lead"/);assert.match(html,/The full specification/);assert.match(html,/Request a quote/);assert.match(html,/Range details require confirmation/);assert.match(html,/Understanding the catalogue figures/);assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.doesNotMatch(html,/Awaiting confirmation<\/dd>/);}
});
test('SEO has unique descriptions, safe production settings, and truthful structured data',()=>{
 const production=siteSettings({origin:'https://arthpravah.in',indexable:true});
 assert.throws(()=>siteSettings({indexable:true}));assert.throws(()=>siteSettings({origin:'https://example.com/path'}));assert.throws(()=>siteSettings({origin:'http://localhost',indexable:true}));
 const titles=publicPaths.map(p=>pageSEO(p).title);assert.equal(new Set(titles).size,titles.length);
 for(const p of publicPaths){const seo=pageSEO(p,production);assert.equal(seo.robots,'index,follow');assert.equal(seo.canonical,'https://arthpravah.in'+p);assert.doesNotMatch(JSON.stringify(seo.schema),/"offers"|"aggregateRating"|"availability"/);}
 assert.equal(pageSEO('/admin',production).robots,'noindex,nofollow');assert.equal(pageSEO('/models/aero/extra',production).robots,'noindex,nofollow');
});
test('sitemap includes canonical public routes and excludes unavailable workflows',()=>{
 const xml=sitemap();for(const p of publicPaths)assert.ok(xml.includes('https://example.com'+p+'</loc>'));assert.doesNotMatch(xml,/\/admin|\/support|\/test-ride/);assert.ok(xml.includes('https://example.com/contact</loc>'));for(const match of xml.matchAll(/<loc>(.*?)<\/loc>/g))assert.ok(!match[1].includes('?'));assert.equal(robots(),'User-agent: *\nDisallow: /\n');
});
test('comparison uses the same catalogue records and nested unknown routes are 404 pages',()=>{
 const html=renderPage('/compare',{compare:['aero','vega']}).comparison;assert.match(html,/150 kg/);assert.match(html,/250 kg/);assert.match(html,/Front \/ rear disc brakes/);assert.equal(renderPage('/models/aero/extra').heading,'Page not found');
 for(const path of allPaths)assert.ok(renderPage(path).html.length>100);
});
