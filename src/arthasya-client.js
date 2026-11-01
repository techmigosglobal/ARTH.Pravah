import {businesses} from './arthasya.js';

const toggle=document.querySelector('.arth-menu-toggle');
const nav=document.querySelector('#arth-mobile-nav');
const dialog=document.querySelector('.arth-dialog');
const setMenu=open=>{if(!toggle||!nav)return;nav.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');};
if(toggle)toggle.addEventListener('click',()=>setMenu(nav.hidden));

const header=document.querySelector('.arth-header');
const syncHeader=()=>header?.classList.toggle('is-scrolled',window.scrollY>32);
syncHeader();
window.addEventListener('scroll',syncHeader,{passive:true});

const slider=document.querySelector('[data-slider]');
if(slider){
  const slides=[...slider.querySelectorAll('[data-slide]')];
  const tabs=[...slider.querySelectorAll('[data-slide-select]')];
  const current=slider.querySelector('[data-slide-current]');
  const progress=slider.querySelector('[data-slide-progress]');
  const pauseButton=slider.querySelector('[data-slider-pause]');
  const pauseLabel=slider.querySelector('[data-pause-label]');
  const rows=[...document.querySelectorAll('[data-business-row]')];
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let index=Math.max(0,slides.findIndex(s=>s.classList.contains('is-active')));
  let timer=null, playing=!reduceMotion.matches, wasPlaying=playing, pointerStart=null;
  const render=()=>{const activeId=slides[index]?.dataset.slide;slider.dataset.theme=activeId;slides.forEach((slide,i)=>{const active=i===index;slide.classList.toggle('is-active',active);slide.setAttribute('aria-hidden',String(!active));const link=slide.querySelector('.arth-slide-link');if(link)link.tabIndex=active?0:-1;});tabs.forEach((tab,i)=>{const active=i===index;tab.classList.toggle('is-active',active);tab.setAttribute('aria-current',String(active));});rows.forEach(row=>row.classList.toggle('is-featured',row.dataset.theme===activeId));if(current)current.textContent=String(index+1).padStart(2,'0');if(progress)progress.style.width=`${((index+1)/slides.length)*100}%`;};
  const stop=()=>{if(timer){clearInterval(timer);timer=null;}};
  const start=()=>{stop();if(reduceMotion.matches||!playing||document.hidden)return;timer=setInterval(()=>go(index+1),6500);};
  const go=next=>{index=(next+slides.length)%slides.length;render();start();};
  const setPlaying=next=>{playing=next;pauseButton?.setAttribute('aria-pressed',String(!playing));if(pauseLabel)pauseLabel.textContent=playing?'Pause':'Play';if(pauseButton)pauseButton.querySelector('.arth-pause-icon').textContent=playing?'Ⅱ':'▶';if(playing)start();else stop();};
  slider.querySelector('[data-slider-prev]')?.addEventListener('click',()=>{setPlaying(false);go(index-1);});
  slider.querySelector('[data-slider-next]')?.addEventListener('click',()=>{setPlaying(false);go(index+1);});
  pauseButton?.addEventListener('click',()=>setPlaying(!playing));
  tabs.forEach((tab,i)=>tab.addEventListener('click',()=>{setPlaying(false);go(i);}));
  slider.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();setPlaying(false);go(index+1);}if(event.key==='ArrowLeft'){event.preventDefault();setPlaying(false);go(index-1);}if((event.key===' '||event.key==='Enter')&&event.target===slider){event.preventDefault();setPlaying(!playing);}});
  slider.addEventListener('pointerdown',event=>{if(event.target.closest('button,a'))return;pointerStart={x:event.clientX,y:event.clientY};});
  slider.addEventListener('pointerup',event=>{if(!pointerStart)return;const dx=event.clientX-pointerStart.x;const dy=event.clientY-pointerStart.y;pointerStart=null;if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)){setPlaying(false);go(index+(dx<0?1:-1));}});
  slider.addEventListener('pointermove',event=>{if(reduceMotion.matches||event.target.closest('button,a'))return;const rect=slider.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width-.5;const y=(event.clientY-rect.top)/rect.height-.5;slider.classList.toggle('is-pointer-left',x<-.12);slider.classList.toggle('is-pointer-right',x>.12);slider.classList.toggle('is-pointer-up',y<-.12);slider.classList.toggle('is-pointer-down',y>.12);});
  slider.addEventListener('pointerleave',()=>slider.classList.remove('is-pointer-left','is-pointer-right','is-pointer-up','is-pointer-down'));
  rows.forEach(row=>{row.addEventListener('pointermove',()=>{if(!reduceMotion.matches)row.classList.add('is-pointer-hover');});row.addEventListener('pointerleave',()=>row.classList.remove('is-pointer-hover'));});
  const observer=new IntersectionObserver(entries=>{const visible=entries[0].isIntersecting;if(!visible){wasPlaying=playing;stop();}else if(wasPlaying&&!reduceMotion.matches){playing=true;start();}},{threshold:.15});observer.observe(slider);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){wasPlaying=playing;stop();}else if(wasPlaying&&!reduceMotion.matches){playing=true;start();}});
  reduceMotion.addEventListener?.('change',event=>{if(event.matches){wasPlaying=playing;setPlaying(false);}else if(wasPlaying){setPlaying(true);}});
  render();start();
}

document.addEventListener('click',event=>{
  const business=event.target.closest('[data-business]');
  const contact=event.target.closest('[data-contact]');
  if(business||contact){setMenu(false);if(!dialog)return;const entry=businesses.find(b=>b.id===business?.dataset.business);document.querySelector('#arth-dialog-title').textContent=entry?.name||'Let’s start a conversation.';document.querySelector('#arth-dialog-copy').textContent=entry?.detail||'Connect with Arthasya to explore exports, electric mobility, charging infrastructure and fleet services.';dialog.showModal();}
  if(event.target.closest('.arth-dialog-close,.arth-dialog-done'))dialog?.close();
  if(event.target.closest('a[href^="#"]'))setMenu(false);
});
dialog?.addEventListener('click',event=>{if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav&&!nav.hidden){setMenu(false);toggle.focus();}if(event.key==='Tab'&&nav&&!nav.hidden){const items=[toggle,...nav.querySelectorAll('a,button')],first=items[0],last=items.at(-1);if(event.shiftKey&&document.activeElement===first){last.focus();event.preventDefault();}else if(!event.shiftKey&&document.activeElement===last){first.focus();event.preventDefault();}}});
window.matchMedia('(min-width: 681px)').addEventListener?.('change',event=>{if(event.matches)setMenu(false);});

document.querySelectorAll('[data-enquiry-submit]').forEach(button=>button.addEventListener('click',()=>{
  const form=button.closest('[data-enquiry-form]');
  if(!form?.checkValidity()){form?.reportValidity();return;}
  form.classList.add('is-unavailable');
  const status=form.querySelector('[data-form-status]');
  if(status)status.textContent='Verified enquiry channels are being confirmed. Nothing was sent or stored.';
}));
