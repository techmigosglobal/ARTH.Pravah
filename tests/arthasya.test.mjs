import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {documentFor} from '../scripts/site.mjs';
import {pageSEO,siteSettings,allPaths} from '../src/seo.js';

test('parent homepage is complete static HTML with its own branding and lightweight entrypoint',async()=>{
  const html=await documentFor('/');
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  for(const label of ['Connecting','Four businesses. One Arthasya.','Export','arth.pravah','arth.urja','arth.gati','A shared vision.','Let’s start a conversation.'])assert.ok(html.includes(label),label);
  assert.match(html,/src="\/assets\/arthasya\/logo.png"/);
  assert.match(html,/alt="Arthasya — Value with purpose"/);
  assert.match(html,/href="\/arth.pravah"/);
  assert.match(html,/src="\/src\/arthasya-client.js"/);
  assert.doesNotMatch(html,/src="\/src\/app.js"|<canvas|<form|ARTH.Pravah home/);
  assert.match(html,/Online enquiries are not yet available/);
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
});

test('owner-supplied logo retains its complete original dimensions',async()=>{
  const supplied=await readFile(new URL('../assets/arthasya/logo.png',import.meta.url));
  assert.equal(supplied.readUInt32BE(16),480);
  assert.equal(supplied.readUInt32BE(20),510);
});
