import {businesses} from './arthasya.js';

const toggle=document.querySelector('.arth-menu-toggle');
const nav=document.querySelector('#arth-mobile-nav');
const dialog=document.querySelector('.arth-dialog');
function setMenu(open){
  nav.hidden=!open;
  toggle.setAttribute('aria-expanded',String(open));
  toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
}
toggle.addEventListener('click',()=>setMenu(nav.hidden));
document.addEventListener('click',event=>{
  const business=event.target.closest('[data-business]');
  const contact=event.target.closest('[data-contact]');
  if(business||contact){
    setMenu(false);
    const entry=businesses.find(b=>b.id===business?.dataset.business);
    document.querySelector('#arth-dialog-title').textContent=entry?.name||'Let’s start a conversation.';
    document.querySelector('#arth-dialog-copy').textContent=entry?.detail||'Connect with Arthasya to explore exports, electric mobility, charging infrastructure and fleet services.';
    dialog.showModal();
  }
  if(event.target.closest('.arth-dialog-close,.arth-dialog-done'))dialog.close();
  if(event.target.closest('a[href^="#"]'))setMenu(false);
});
dialog.addEventListener('click',event=>{if(event.target===dialog){const bounds=dialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close();}});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!nav.hidden){setMenu(false);toggle.focus();}
  if(event.key==='Tab'&&!nav.hidden){
    const items=[toggle,...nav.querySelectorAll('a,button')],first=items[0],last=items.at(-1);
    if(event.shiftKey&&document.activeElement===first){last.focus();event.preventDefault();}
    else if(!event.shiftKey&&document.activeElement===last){first.focus();event.preventDefault();}
  }
});
matchMedia('(min-width: 761px)').addEventListener('change',event=>{if(event.matches)setMenu(false);});
