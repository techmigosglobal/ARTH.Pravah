import {models,getModel,media} from './data.js';
export const publicPaths=['/','/arth.pravah','/models',...models.map(m=>`/models/${m.id}`),'/compare','/running-costs','/ownership','/about'];
export const utilityPaths=['/contact','/support','/showrooms','/test-ride','/privacy','/terms','/admin'];
export const allPaths=[...publicPaths,...utilityPaths];
export function siteSettings({origin='https://example.com',indexable=false}={}){
  const url=new URL(origin);
  if(!['http:','https:'].includes(url.protocol)||url.username||url.password||url.pathname!=='/'||url.search||url.hash) throw new Error('SITE_ORIGIN must be an HTTP(S) origin without a path, credentials, query or fragment.');
  if(indexable&&(url.protocol!=='https:'||/(^|\.)(example\.(com|org|net)|localhost|invalid|test)$/.test(url.hostname)||url.hostname==='127.0.0.1'||url.hostname==='[::1]')) throw new Error('Indexing requires a real HTTPS production SITE_ORIGIN.');
  return {origin:url.origin,indexable};
}
export function pageSEO(path,settings=siteSettings()){
  if(path==='/') return {title:'Arthasya | Exports, electric mobility, charging & fleet services',description:'Explore Arthasya’s four businesses: spices and turmeric exports, arth.pravah EV bikes, arth.urja charging stations and arth.gati fleet services.',canonical:settings.origin+'/',image:settings.origin+'/assets/arthasya/businesses.png',siteName:'Arthasya',robots:settings.indexable?'index,follow':'noindex,nofollow',schema:[{'@context':'https://schema.org','@type':'Organization',name:'Arthasya',url:settings.origin+'/',logo:settings.origin+'/assets/arthasya/logo.png'}]};
  const route=path;
  if(path==='/arth.pravah')path='/';
  const model=models.find(m=>path===`/models/${m.id}`);
  const titles={'/':'Electric scooters for a new everyday','/models':'Explore our six electric scooter models','/compare':'Compare electric scooter catalogue specifications','/running-costs':'Electric scooter running-cost calculator','/ownership':'Charging, ownership and support','/about':'Our story — An Arthasya Venture'};
  const descriptions={'/':'Meet Aero, Apex, Nova, Teja, Vayu and Vega. Explore electric scooter designs, catalogue details and battery options from ARTH.Pravah.','/models':'Explore all six ARTH.Pravah electric scooters. View model photography, catalogue specifications, battery options and comparison details.','/compare':'Compare two or three ARTH.Pravah models by tyres, dimensions, payload, braking equipment and catalogue battery options.','/running-costs':'Estimate monthly electricity and petrol running costs using your own distance, tariffs, mileage and EV consumption assumptions.','/ownership':'Explore electric scooter ownership questions, charging guidance, warranty qualifications and support availability.','/about':'Discover ARTH.Pravah, an Arthasya venture, and our six individual expressions of electric mobility.'};
  const known=allPaths.includes(route),indexable=settings.indexable&&publicPaths.includes(route);
  const title=(model?`${model.name} electric scooter — Specifications & battery options`:titles[path]|| (known?path.slice(1).replaceAll('-',' ')+' information':'Page not found'))+' | ARTH.Pravah';
  const description=model?`Explore ${model.name}: ${model.specs.tyres} tyres, ${model.specs.payload} kg catalogue payload, battery configurations, charging details and equipment. Request current pricing.`:descriptions[path]||'ARTH.Pravah website information and current service availability.';
  const canonical=settings.origin+(known?route:'/404'),image=settings.origin+media(model?.id||'aero');
  const schema=[{'@context':'https://schema.org','@type':'Organization',name:'ARTH.Pravah',url:settings.origin+'/arth.pravah'}];
  if(model) schema.push({'@context':'https://schema.org','@type':'Product',name:`ARTH.Pravah ${model.name}`,description,image:[image],url:canonical,brand:{'@type':'Brand',name:'ARTH.Pravah'},additionalProperty:[{'@type':'PropertyValue',name:'Catalogue tyre size',value:model.specs.tyres},{'@type':'PropertyValue',name:'Catalogue payload',value:model.specs.payload,unitText:'kg'}]},{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[['Home','/arth.pravah'],['Models','/models'],[model.name,path]].map(([name,p],i)=>({'@type':'ListItem',position:i+1,name,item:settings.origin+p}))});
  return {title,description,canonical,image,robots:indexable?'index,follow':'noindex,nofollow',schema:publicPaths.includes(path)?schema:[]};
}
export const escapeHTML=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export function seoHead(seo){return `<title>${escapeHTML(seo.title)}</title><meta name="description" content="${escapeHTML(seo.description)}"><meta name="robots" content="${seo.robots}"><link rel="canonical" href="${escapeHTML(seo.canonical)}"><meta property="og:type" content="website"><meta property="og:site_name" content="${escapeHTML(seo.siteName||'ARTH.Pravah')}"><meta property="og:title" content="${escapeHTML(seo.title)}"><meta property="og:description" content="${escapeHTML(seo.description)}"><meta property="og:url" content="${escapeHTML(seo.canonical)}"><meta property="og:image" content="${escapeHTML(seo.image)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHTML(seo.title)}"><meta name="twitter:description" content="${escapeHTML(seo.description)}"><meta name="twitter:image" content="${escapeHTML(seo.image)}"><script type="application/ld+json" id="page-schema">${JSON.stringify(seo.schema).replaceAll('<','\\u003c')}</script>`;}
export function updateSEO(seo){
  const origin=document.querySelector('meta[name="site-origin"]')?.content;
  const indexable=document.querySelector('meta[name="site-indexable"]')?.content==='true';
  if(origin) seo=pageSEO(location.pathname.replace(/\/$/,'')||'/',siteSettings({origin,indexable}));
  document.querySelectorAll('title,meta[name="description"],meta[name="robots"],link[rel="canonical"],meta[property^="og:"],meta[name^="twitter:"],#page-schema').forEach(el=>el.remove());
  document.head.insertAdjacentHTML('beforeend',seoHead(seo));
}
