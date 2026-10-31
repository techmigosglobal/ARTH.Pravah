import {renderPage} from './pages.js';
import {pageSEO,updateSEO} from './seo.js';
import {batteries} from './catalogue.js';
import {models,getModel,media,calculateCosts,money} from './data.js';
import {ScrollSequence} from './sequence.js';
import {BikeViewer} from './bike-viewer.js';
import {HeroCarousel} from './hero-carousel.js';
import {setupMotionControl,setupPageMotion} from './motion.js';
const main=document.querySelector('main');
const arrow='<span aria-hidden="true">↗</span>';
let selected='aero',sequence,heroCarousel,observer,cleanup=[];
let compare=[];try{compare=JSON.parse(sessionStorage.getItem('compare')||'[]').filter(id=>getModel(id)).slice(0,3);compare=[...new Set(compare)];}catch{}
const toast=document.querySelector('.toast');let toastTimer;
function notify(message){clearTimeout(toastTimer);toast.textContent=message;toast.classList.add('show');toastTimer=setTimeout(()=>toast.classList.remove('show'),4500);}
function saveCompare(){try{sessionStorage.setItem('compare',JSON.stringify(compare));}catch{}}
function render(){
  sequence?.destroy();heroCarousel?.destroy();heroCarousel=null;observer?.disconnect();cleanup.forEach(f=>f());cleanup=[];
  const url=new URL(location.href),path=url.pathname.replace(/\/$/,'')||'/';const model=getModel(path.split('/')[2]);const context=getModel(url.searchParams.get('model'));
  selected=path.startsWith('/models/')&&model?model.id:selected;
  const {html,heading}=renderPage(path,{selected,compare,context});
  main.innerHTML=html;updateSEO(pageSEO(path));document.body.classList.toggle('is-home',path==='/arth.pravah');document.querySelectorAll('.site-header nav a').forEach(a=>{if(new URL(a.href).pathname===path)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  const filmEl=main.querySelector('.film-section');if(filmEl)sequence=new ScrollSequence(filmEl,model?.id||selected);
  const homeHero=main.querySelector('.home-hero');if(homeHero)heroCarousel=new HeroCarousel(homeHero,{initial:selected,onChange:commitModel});
  cleanup.push(setupPageMotion(main));
  const viewer=main.querySelector('.bike3d-section');if(viewer){const bikeViewer=new BikeViewer(viewer,model.id);cleanup.push(()=>bikeViewer.destroy());}
  document.documentElement.classList.add('motion-ready');observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:0.08});main.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  const cost=main.querySelector('#cost-form');if(cost)cost.addEventListener('submit',e=>{e.preventDefault();try{const result=calculateCosts(Object.fromEntries(new FormData(cost)));main.querySelector('#calc-error').textContent='';main.querySelector('#cost-results').innerHTML=`<span class="cost-distance">${result.km.toLocaleString('en-IN')} km / month</span><h2>${money(result.difference)}</h2><p>${result.difference>=0?'Estimated monthly running-cost difference':'EV electricity costs exceed petrol costs by this amount'}</p><dl><div><dt>EV electricity</dt><dd>${money(result.ev)}</dd></div><div><dt>Petrol</dt><dd>${money(result.fuel)}</dd></div></dl>`;}catch(err){main.querySelector('#calc-error').textContent=err.message;}});
  // A changed assumption invalidates the old result instead of leaving misleading stale totals.
  if(cost)cost.addEventListener('input',()=>{main.querySelector('#cost-results').innerHTML='<h2>Your numbers.<br>Your estimate.</h2><p>Inputs changed. Calculate again to update the estimate.</p>';});
}
function switchModel(id){if(heroCarousel)heroCarousel.goTo(id,{manual:true});}
function commitModel(id){
  const model=getModel(id);if(!model)return;selected=id;
  main.querySelectorAll('[data-select-model]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.selectModel===id)));
  main.querySelector('[data-film-model]').textContent=model.name.toUpperCase();
  main.querySelector('[data-film-description]').textContent=model.scene;
  main.querySelectorAll('[data-chapter-text]').forEach((el,i)=>el.textContent=model.chapter[i]);
  const canvas=main.querySelector('canvas');canvas.setAttribute('aria-label',`Scroll-controlled ${model.name} product film`);
  main.querySelector('.sequence-poster').alt=`${model.name} film poster`;sequence.setModel(id);
  const story=main.querySelector('#story');if(story){story.querySelector('.eyebrow').textContent=`THE ${model.name.toUpperCase()} PERSPECTIVE`;story.querySelector('h2').textContent=model.story;story.querySelector('.editorial-text>p:not(.eyebrow)').textContent=model.detail;const link=story.querySelector('.text-link');link.href=`/contact?model=${id}`;link.innerHTML=`Ask about ${model.name} ${arrow}`;const image=story.querySelector('img');image.src=media(id,'side');image.alt=`${model.name}, side view`;}
}
function updateComparison(){main.querySelectorAll('[data-compare]').forEach(b=>{const id=b.dataset.compare,on=compare.includes(id);b.setAttribute('aria-pressed',String(on));if(b.classList.contains('compare-add')){b.textContent=on?'✓':'+';b.setAttribute('aria-label',`${on?'Remove':'Add'} ${getModel(id).name} ${on?'from':'to'} comparison`);}else b.querySelector('span').textContent=on?'✓':'+';});main.querySelectorAll('[data-compare-count]').forEach(el=>el.textContent=compare.length?`(${compare.length})`:'');if(main.querySelector('#compare-result'))main.querySelector('#compare-result').innerHTML=renderPage('/compare',{compare}).comparison;}
const dialog=document.querySelector('#gallery-dialog');dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
function menu(open){const nav=document.querySelector('#mobile-nav'),button=document.querySelector('.menu-toggle');nav.hidden=!open;button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close navigation':'Open navigation');document.body.classList.toggle('menu-open',open);document.dispatchEvent(new CustomEvent('pravah-menu-change'));}
document.querySelector('.menu-toggle').addEventListener('click',()=>menu(document.querySelector('#mobile-nav').hidden));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.querySelector('#mobile-nav').hidden){menu(false);document.querySelector('.menu-toggle').focus();}if(e.key==='Tab'&&!document.querySelector('#mobile-nav').hidden){const items=[document.querySelector('.menu-toggle'),...document.querySelectorAll('#mobile-nav a')];const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){last.focus();e.preventDefault();}else if(!e.shiftKey&&document.activeElement===last){first.focus();e.preventDefault();}}});
document.addEventListener('click',e=>{
  const battery=e.target.closest('[data-battery]');
  if(battery){const section=battery.closest('.battery-explorer'); const option=batteries[battery.dataset.battery];section.querySelectorAll('[data-battery]').forEach(b=>b.setAttribute('aria-pressed',String(b===battery)));section.querySelector('[data-charge-time]').textContent=option.charging;section.querySelector('[data-battery-name]').textContent=option.name;return;}
  const modelButton=e.target.closest('[data-select-model]');if(modelButton){switchModel(modelButton.dataset.selectModel);return;}
  const compareButton=e.target.closest('[data-compare]');if(compareButton){const id=compareButton.dataset.compare;if(compare.includes(id))compare=compare.filter(x=>x!==id);else if(compare.length<3)compare.push(id);else {notify('Compare up to three models. Remove one to add another.');return;}saveCompare();updateComparison();notify(`${getModel(id).name} ${compare.includes(id)?'added to':'removed from'} comparison.`);return;}
  if(e.target.closest('[data-clear-compare]')){compare=[];saveCompare();updateComparison();return;}
  const view=e.target.closest('[data-view]');if(view){const model=getModel(location.pathname.split('/')[2]);main.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===view)));const img=main.querySelector('#gallery-image');img.src=media(model.id,view.dataset.view);if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!document.documentElement.classList.contains('motion-paused')){img.getAnimations().forEach(a=>a.cancel());img.animate([{opacity:.25,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});}img.alt=`${model.name}, ${view.dataset.view==='back'?'rear':view.dataset.view==='hero'?'context':view.dataset.view} view`;return;}
  if(e.target.closest('.gallery-enlarge')){const img=main.querySelector('#gallery-image');dialog.querySelector('img').src=img.src;dialog.querySelector('img').alt=img.alt;dialog.querySelector('p').textContent=img.alt;dialog.showModal();return;}
  const a=e.target.closest('a');if(!a||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||a.target)return;
  const url=new URL(a.href,location.href);if(url.origin!==location.origin)return;
  // The parent homepage has its own lightweight document and navigation.
  if(url.pathname==='/')return;
  if(url.pathname===location.pathname&&url.search===location.search&&url.hash){menu(false);return;}
  e.preventDefault();menu(false);history.pushState(null,'',url);render();window.scrollTo({top:0,behavior:'instant'});main.focus({preventScroll:true});
});
window.addEventListener('popstate',()=>{menu(false);render();});
document.querySelector('#year').textContent=new Date().getFullYear();
setupMotionControl();
render();
