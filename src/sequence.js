import {clamp,progressToFrame,containSize} from './data.js';
let manifestPromise;
export const getManifest = () => manifestPromise ??= fetch('/assets/frames/manifest.json').then(r=>{if(!r.ok)throw new Error('Sequence manifest unavailable');return r.json();});

/** Native scroll → frame renderer. Compressed blobs are progressive; decoded LRU is capped. */
export class ScrollSequence {
  constructor(section, model) {
    this.section=section;this.canvas=section.querySelector('canvas');this.ctx=this.canvas.getContext('2d',{alpha:false});
    this.poster=section.querySelector('.sequence-poster');this.status=section.querySelector('.sequence-status');
    this.slider=section.querySelector('input[type=range]');this.counter=section.querySelector('.frame-counter');
    this.toggle=section.querySelector('.motion-toggle');this.progressBar=section.querySelector('.film-progress span');
    this.motion=matchMedia('(prefers-reduced-motion: reduce)');this.generation=0;this.progress=0;this.visible=false;this.paused=false;this.raf=0;this.drawn=-1;this.maxDecoded=20;
    this.onScroll=()=>{this.manual=false;this.schedule();};this.onResize=()=>{this.resize();this.drawn=-1;this.schedule();};
    this.onMotion=()=>{this.setModel(this.model);};this.onGlobalMotion=()=>{this.updateStatus();this.schedule();};
    this.onSlider=()=>{this.progress=Number(this.slider.value)/1000;this.manual=true;this.schedule();};
    this.onToggle=()=>{this.paused=!this.paused;this.toggle.textContent=this.paused?'Resume motion':'Pause motion';this.toggle.setAttribute('aria-pressed',String(this.paused));this.manual=false;this.schedule();};
    this.slider.addEventListener('input',this.onSlider);this.toggle.addEventListener('click',this.onToggle);
    window.addEventListener('scroll',this.onScroll,{passive:true});window.addEventListener('resize',this.onResize,{passive:true});
    this.motion.addEventListener('change',this.onMotion);document.addEventListener('pravah-motion-change',this.onGlobalMotion);
    this.resizeObserver=new ResizeObserver(this.onResize);this.resizeObserver.observe(this.canvas.parentElement);
    this.observer=new IntersectionObserver(entries=>{this.visible=entries[0].isIntersecting;if(this.visible)this.schedule();},{rootMargin:'0px'});this.observer.observe(section);
    this.setModel(model);
  }
  async setModel(model){
    this.model=model;const generation=++this.generation;this.abort?.abort();this.abort=new AbortController();
    this.release();this.blobs=new Map();this.bitmaps=new Map();this.pendingDecode=new Set();this.failed=new Set();this.requested=new Set();this.queue=[];this.active=0;this.loaded=0;this.errorCount=0;this.frames=[];this.drawn=-1;
    this.canvas.dataset.model=model;this.canvas.dataset.frame='';this.canvas.dataset.state='loading';this.canvas.style.opacity='0';
    this.poster.src=`/assets/models/${model}/hero.webp`;this.poster.hidden=false;
    this.slider.disabled=true;this.status.textContent='Preparing the film…';this.counter.textContent='— / —';this.toggle.hidden=this.motion.matches;
    this.section.classList.toggle('is-reduced',this.motion.matches);this.resize();
    if(this.motion.matches){this.canvas.dataset.state='reduced';this.status.textContent='Reduced motion · still image shown';return;}
    try {
      const manifest=await getManifest();if(generation!==this.generation)return;
      const sequence=manifest[model];if(!sequence?.frames?.length)throw new Error('No sequence frames');
      this.frames=sequence.frames;this.sourceWidth=sequence.width;this.sourceHeight=sequence.height;
      this.poster.src=sequence.poster;this.slider.disabled=false;
      this.queue=[...this.frames.keys()];this.pump(generation);this.schedule();
    } catch(error){if(generation===this.generation&&!this.abort.signal.aborted)this.unavailable();}
  }
  unavailable(){this.canvas.dataset.state='unavailable';this.canvas.style.opacity='0';this.poster.hidden=false;this.slider.disabled=true;this.status.textContent='Film unavailable. Still image shown; scroll animation is unavailable.';}
  pump(generation){
    if(generation!==this.generation)return;
    while(this.active<3&&this.queue.length&&(this.visible||this.requested.size<4)){
      const index=this.queue.shift();if(this.requested.has(index))continue;
      this.requested.add(index);this.active++;
      fetch(this.frames[index],{signal:this.abort.signal}).then(r=>{if(!r.ok)throw new Error('Frame unavailable');return r.blob();}).then(async blob=>{
        if(generation!==this.generation)return;
        this.blobs.set(index,blob);this.loaded++;
        // Decode only around the viewport target. Other frames stay compressed.
        if(Math.abs(index-this.target())<4||index===0)await this.decode(index,generation);
      }).catch(e=>{if(generation===this.generation&&e.name!=='AbortError'){this.failed.add(index);this.errorCount++;}}).finally(()=>{
        if(generation!==this.generation)return;
        this.active--;this.updateStatus();this.pump(generation);this.schedule();
        if(this.requested.size===this.frames.length&&this.active===0&&this.loaded===0)this.unavailable();
      });
    }
  }
  async decode(index,generation=this.generation){
    if(this.bitmaps.has(index)||this.pendingDecode.has(index)||!this.blobs.has(index)||generation!==this.generation)return;
    this.pendingDecode.add(index);
    try {
      const blob=this.blobs.get(index);let bitmap;
      if(typeof createImageBitmap==='function')bitmap=await createImageBitmap(blob);
      else {const url=URL.createObjectURL(blob);try{bitmap=new Image();bitmap.src=url;await bitmap.decode();}finally{URL.revokeObjectURL(url);}}
      if(generation!==this.generation){bitmap.close?.();return;}
      this.bitmaps.set(index,bitmap);
      while(this.bitmaps.size>this.maxDecoded){const key=[...this.bitmaps.keys()].sort((a,b)=>Math.abs(b-this.target())-Math.abs(a-this.target()))[0];this.bitmaps.get(key).close?.();this.bitmaps.delete(key);}
      this.schedule();
    } catch {if(generation===this.generation){this.failed.add(index);this.blobs.delete(index);this.errorCount++;this.updateStatus();}}
    finally{if(generation===this.generation)this.pendingDecode.delete(index);}
  }
  target(){return progressToFrame(this.progress,this.frames.length);}
  resize(){const rect=this.canvas.parentElement.getBoundingClientRect();this.width=rect.width;this.height=rect.height;const dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(rect.width*dpr);this.canvas.height=Math.round(rect.height*dpr);this.ctx.setTransform(dpr,0,0,dpr,0,0);}
  schedule(){if(!this.raf)this.raf=requestAnimationFrame(()=>{this.raf=0;this.render();});}
  render(){
    if(this.motion.matches||!this.frames.length)return;
    if(!this.manual&&!this.paused&&this.visible&&!document.documentElement.classList.contains('motion-paused')){const rect=this.section.getBoundingClientRect();const sticky=this.section.querySelector('.film-sticky');this.progress=clamp((parseFloat(getComputedStyle(sticky).top)-rect.top)/Math.max(1,rect.height-sticky.offsetHeight));}
    this.slider.value=String(Math.round(this.progress*1000));this.progressBar.style.width=`${this.progress*100}%`;
    this.section.querySelectorAll('[data-chapter]').forEach((el,i)=>el.classList.toggle('active',i===Math.min(2,Math.floor(this.progress*3))));
    const target=this.target();this.canvas.dataset.target=String(target);this.counter.textContent=`${String(target+1).padStart(2,'0')} / ${this.frames.length}`;
    // Put a rapidly scrubbed-to frame ahead of background prefetch work.
    for(const i of [target,target-1,target+1,target-2,target+2]){
      if(i<0||i>=this.frames.length||this.failed.has(i))continue;
      if(this.blobs.has(i))this.decode(i);else if(!this.requested.has(i)){this.queue=this.queue.filter(x=>x!==i);this.queue.unshift(i);}
    }
    this.pump(this.generation);
    let index=target;
    if(!this.bitmaps.has(index)){const keys=[...this.bitmaps.keys()];if(!keys.length){const available=[...this.blobs.keys()].filter(i=>!this.failed.has(i)).sort((a,b)=>Math.abs(a-target)-Math.abs(b-target));if(available.length)this.decode(available[0]);return;}index=keys.reduce((a,b)=>Math.abs(b-target)<Math.abs(a-target)?b:a);}
    if(index===this.drawn)return;
    const frame=this.bitmaps.get(index);if(!frame)return;
    const box=containSize(this.width,this.height,frame.width||frame.naturalWidth,frame.height||frame.naturalHeight);
    this.ctx.fillStyle='#0c1921';this.ctx.fillRect(0,0,this.width,this.height);this.ctx.drawImage(frame,box.x,box.y,box.width,box.height);
    this.drawn=index;this.canvas.dataset.frame=String(index);this.canvas.dataset.state=this.errorCount?'partial':'ready';this.canvas.style.opacity='1';this.poster.hidden=true;
    this.canvas.dataset.decoded=String(this.bitmaps.size);this.canvas.dataset.loaded=String(this.loaded);
    this.updateStatus();
  }
  updateStatus(){this.canvas.dataset.loaded=String(this.loaded);this.canvas.dataset.decoded=String(this.bitmaps.size);if(this.canvas.dataset.state==='unavailable')return;if(document.documentElement.classList.contains('motion-paused')){this.status.textContent='Motion paused · use the slider to explore manually';return;}this.status.textContent=this.errorCount?`${this.errorCount} frame${this.errorCount===1?'':'s'} unavailable · showing nearest available frame`:this.loaded<this.frames.length?'Loading the film progressively…':'Scroll to explore · or use the film slider';}
  release(){this.bitmaps?.forEach(b=>b.close?.());this.bitmaps?.clear();this.blobs?.clear();}
  destroy(){++this.generation;this.abort?.abort();cancelAnimationFrame(this.raf);this.release();this.observer.disconnect();this.resizeObserver.disconnect();window.removeEventListener('scroll',this.onScroll);window.removeEventListener('resize',this.onResize);this.motion.removeEventListener('change',this.onMotion);document.removeEventListener('pravah-motion-change',this.onGlobalMotion);this.slider.removeEventListener('input',this.onSlider);this.toggle.removeEventListener('click',this.onToggle);}
}
