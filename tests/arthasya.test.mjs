import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {documentFor} from '../scripts/site.mjs';
import {pageSEO,siteSettings,allPaths} from '../src/seo.js';

test('parent homepage is complete static HTML with its own branding and lightweight entrypoint',async()=>{
  const html=await documentFor('/');
  assert.equal((html.match(/<h1\b/g)||[]).length,4);
  for(const label of ['Trade that travels.','Electric, every day.','Charge the next move.','Fleet built to move.','Four ways forward.','Arthasya brings together exports, electric mobility, charging and fleet services.','Explore Our Businesses','Our Vision','Export','arth.pravah','arth.urja','arth.gati','Built around movement.'])assert.ok(html.includes(label),label);
  assert.match(html,/src="\/assets\/arthasya\/logo-transparent.png"/);
  assert.match(html,/alt="Arthasya — Value with purpose"/);
  for(const href of ['/arth.export','/arth.pravah','/arth.urja','/arth.gati','/about#vision','/contact'])assert.match(html,new RegExp(`href="${href.replace('#','\\#')}"`),href);
  assert.match(html,/src="\/src\/arthasya-client.js"/);
  assert.match(html,/slide-export\.png/);
  assert.doesNotMatch(html,/src="\/src\/app.js"|<canvas|<form|ARTH.Pravah home|A shared vision/);
});

test('parent business, about and contact routes render safe factual content',async()=>{
  for(const [path,heading,needle] of [['/arth.export','Spices with a sense of place.','Turmeric'],['/arth.urja','Charge the next move.','charging points'],['/arth.gati','Fleet built to move.','cargo boxes'],['/about','More than business. A belief in better.','Value with purpose.'],['/contact','Start with a question.','export-enquiry']]){
    const html=await documentFor(path);assert.match(html,new RegExp(`<h1[^>]*>${heading.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}</h1>`),path);assert.match(html,new RegExp(needle,'i'),path);assert.match(html,/href="\/#businesses"/);
  }
  const contact=await documentFor('/contact');assert.equal((contact.match(/data-enquiry-form=/g)||[]).length,4);assert.doesNotMatch(contact,/<form[^>]+action=/i);assert.match(contact,/Nothing is sent or stored/);
  assert.ok(allPaths.includes('/arth.export')&&allPaths.includes('/arth.urja')&&allPaths.includes('/arth.gati')&&allPaths.includes('/about')&&allPaths.includes('/contact'));
});

test('old EV homepage remains directly available with original features and separate canonical',async()=>{
  const html=await documentFor('/arth.pravah');
  assert.ok(allPaths.includes('/arth.pravah'));
  for(const feature of ['home-hero','film-section','selection-strip','data-select-model','/src/app.js'])assert.ok(html.includes(feature),feature);
  assert.match(html,/class="is-home"/);
  assert.match(html,/href="\/arth.pravah" class="wordmark"/);
  const settings=siteSettings({origin:'https://arthasya.biz',indexable:true});
  const parent=pageSEO('/',settings),ev=pageSEO('/arth.pravah',settings);
  assert.equal(parent.canonical,'https://arthasya.biz/');
  assert.equal(ev.canonical,'https://arthasya.biz/arth.pravah');
  assert.equal(parent.schema[0].name,'Arthasya');
  assert.equal(ev.schema[0].name,'ARTH.Pravah');
  assert.notEqual(parent.title,ev.title);
  assert.match(await documentFor('/'),/og:site_name" content="Arthasya"/);
  for(const path of ['/arth.export','/arth.urja','/arth.gati','/about','/contact']){const seo=pageSEO(path,settings);assert.equal(seo.canonical,`https://arthasya.biz${path}`);assert.equal(seo.siteName,'Arthasya');assert.ok(seo.title);}
});

test('owner-supplied logo retains its complete original dimensions',async()=>{
  const supplied=await readFile(new URL('../assets/arthasya/logo.png',import.meta.url));
  assert.equal(supplied.readUInt32BE(16),480);
  assert.equal(supplied.readUInt32BE(20),510);
});

test('transparent Arthasya logo is an RGBA asset with a cropped canvas',async()=>{
  const transparent=await readFile(new URL('../assets/arthasya/logo-transparent.png',import.meta.url));
  assert.equal(transparent.toString('ascii',1,4),'PNG');
  assert.equal(transparent[25],6);
  assert.ok(transparent.readUInt32BE(16)>0&&transparent.readUInt32BE(20)>0);
});
