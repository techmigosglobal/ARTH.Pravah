import {parseGLB} from './glb.js';

const vertexShader = `
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUV;
uniform mat4 uProjection;
uniform mat4 uView;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUV;
void main(){vNormal=aNormal;vPosition=aPosition;vUV=aUV;gl_Position=uProjection*uView*vec4(aPosition,1.0);}`;
const fragmentShader = `
precision mediump float;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUV;
uniform vec4 uColor;
uniform vec3 uEye;
uniform bool uHasTexture;
uniform bool uUnlit;
uniform float uAlphaCutoff;
uniform float uMetallic;
uniform float uRoughness;
uniform sampler2D uTexture;
void main(){
  vec4 base=uColor;if(uHasTexture){vec4 tex=texture2D(uTexture,vUV);base*=vec4(pow(tex.rgb,vec3(2.2)),tex.a);}
  if(base.a<uAlphaCutoff)discard;
  vec3 n=normalize(vNormal);if(!gl_FrontFacing)n=-n;
  float key=max(dot(n,normalize(vec3(1.0,1.4,1.8))),0.0);
  float fill=max(dot(n,normalize(vec3(-1.5,.5,-.8))),0.0);
  vec3 viewDir=normalize(uEye-vPosition),halfDir=normalize(normalize(vec3(1.0,1.4,1.8))+viewDir);
  float gloss=mix(100.0,8.0,uRoughness);
  float spec=pow(max(dot(n,halfDir),0.0),gloss);
  vec3 reflected=reflect(-viewDir,n);
  float softbox=pow(max(dot(reflected,normalize(vec3(-.5,1.5,1.0))),0.0),12.0);
  vec3 specColor=mix(vec3(.08),base.rgb,uMetallic);
  vec3 lit=base.rgb*(.28+.65*key+.3*fill)+specColor*(spec*.8+softbox*.7);
  gl_FragColor=vec4(pow(max(uUnlit?base.rgb:lit,vec3(0.0)),vec3(1.0/2.2)),1.0);
}`;

function projection(aspect) {
  const near=.05,far=100,f=1/Math.tan(Math.PI/8);
  return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0]);
}
function camera(yaw,pitch,distance) {
  const eye=[Math.sin(yaw)*Math.cos(pitch)*distance,Math.sin(pitch)*distance,Math.cos(yaw)*Math.cos(pitch)*distance];
  const length=Math.hypot(...eye),z=eye.map(n=>n/length),xLength=Math.hypot(z[2],z[0]);
  const x=[z[2]/xLength,0,-z[0]/xLength],y=[z[1]*x[2],z[2]*x[0]-z[0]*x[2],-z[1]*x[0]];
  const dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0);
  return {eye,matrix:new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1])};
}
function compile(gl,type,source) {
  const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);throw new Error('WebGL shader compilation failed.');}
  return shader;
}

/** Lazy, user-initiated, true mesh viewer. Nothing is fabricated when a model is absent. */
export class BikeViewer {
  constructor(section, model) {
    this.section=section;this.model=model;this.canvas=section.querySelector('.bike3d-canvas');
    this.status=section.querySelector('.bike3d-status');this.placeholder=section.querySelector('.bike3d-placeholder');
    this.disclosure=document.createElement('p');this.disclosure.className='bike3d-disclosure small-note';this.disclosure.hidden=true;
    this.disclosure.textContent='Photo-based 3D preview. Proportions and hidden details are approximate. Compare with the original photos.';
    this.status.before(this.disclosure);
    this.loadButton=section.querySelector('[data-load-3d]');this.controls=[...section.querySelectorAll('[data-3d-action]')];
    this.events=new AbortController();this.controller=new AbortController();this.resources=[];this.frame=0;this.destroyed=false;this.busy=false;this.ready=false;
    this.yaw=-.65;this.pitch=.18;this.distance=4.4;
    this.canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();this.ready=false;this.showError('The 3D graphics context was interrupted. Use the photos or retry the model.');},{signal:this.events.signal});
    this.canvas.addEventListener('webglcontextrestored',()=>{this.resources=[];this.ready=false;this.showError('Graphics are available again. Load the model to continue.');},{signal:this.events.signal});
    this.loadButton.addEventListener('click',()=>this.load(),{signal:this.events.signal});
    this.controls.forEach(button=>button.addEventListener('click',()=>this.action(button.dataset['3dAction']),{signal:this.events.signal}));
    this.canvas.addEventListener('keydown',event=>{
      const actions={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down','+':'in','=':'in','-':'out',Home:'reset'};
      if(!this.ready||!actions[event.key])return;event.preventDefault();this.action(actions[event.key]);
    },{signal:this.events.signal});
    this.canvas.addEventListener('pointerdown',event=>{
      if(!this.ready||event.button!==0)return;
      this.drag={x:event.clientX,y:event.clientY,lastX:event.clientX,lastY:event.clientY,type:event.pointerType,locked:false};
      if(event.pointerType==='mouse'){this.canvas.setPointerCapture(event.pointerId);this.drag.locked=true;}
    },{signal:this.events.signal});
    this.canvas.addEventListener('pointermove',event=>{
      if(!this.drag||!this.ready)return;
      const dx=event.clientX-this.drag.x,dy=event.clientY-this.drag.y;
      if(!this.drag.locked){if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>8){this.drag=null;return;}if(Math.abs(dx)<8)return;this.drag.locked=true;this.canvas.setPointerCapture(event.pointerId);}
      this.yaw+=(event.clientX-this.drag.lastX)*.009;
      if(this.drag.type==='mouse')this.pitch=Math.max(-1.25,Math.min(1.25,this.pitch+(event.clientY-this.drag.lastY)*.006));
      this.drag.lastX=event.clientX;this.drag.lastY=event.clientY;this.schedule();
    },{signal:this.events.signal});
    for(const type of ['pointerup','pointercancel','lostpointercapture'])this.canvas.addEventListener(type,()=>{this.drag=null;},{signal:this.events.signal});
    this.resizeObserver=new ResizeObserver(()=>this.schedule());this.resizeObserver.observe(this.canvas.parentElement);
    this.checkManifest();
  }

  async checkManifest() {
    try{
      const response=await fetch('/assets/3d/manifest.json',{signal:this.controller.signal});if(!response.ok)throw new Error('manifest');
      const manifest=await response.json();if(this.destroyed)return;
      const item=manifest[this.model];
      const reconstruction=item?.available===true&&item.kind==='photo-reconstruction';
      if((!item?.approved&&!reconstruction)||!item.modelUrl){this.section.dataset.state='pending';this.status.textContent='Accurate 3D model pending. Photo views remain available.';return;}
      const url=new URL(item.modelUrl,location.origin);
      if(url.origin!==location.origin||!url.pathname.startsWith('/assets/3d/')||!url.pathname.endsWith('.glb'))throw new Error('model location');
      this.modelUrl=url.href;this.loadButton.hidden=false;this.section.dataset.state='available';
      this.section.dataset.modelKind=reconstruction?'photo-reconstruction':'approved';
      this.placeholder.querySelector('.pill').textContent=reconstruction?'PHOTO-BASED 3D PREVIEW':'APPROVED 3D MODEL';
      this.section.querySelector('.section-heading>p').textContent='Load the model. Drag to rotate, zoom and reset.';
      this.placeholder.querySelector('h3').textContent='A new perspective, in three dimensions.';
      this.placeholder.querySelector('p').textContent=reconstruction?'Explore a 3D reconstruction based on the supplied photos. Shape and details are approximate; use the gallery to see the actual scooter.':'Load the approved model, then drag to rotate. The 3D file loads only when you choose to open it.';
      this.disclosure.hidden=!reconstruction;
      this.status.textContent='3D model available. Choose Load 3D view to begin.';
    }catch(error){if(!this.destroyed&&error.name!=='AbortError'){this.section.dataset.state='pending';this.status.textContent='3D availability could not be checked. The photo gallery is still available.';}}
  }

  async load() {
    if(!this.modelUrl||this.busy||this.destroyed)return;
    this.busy=true;this.loadButton.disabled=true;this.section.setAttribute('aria-busy','true');this.section.dataset.state='loading';this.status.textContent='Loading the 3D model…';
    try{
      this.disposeGPU();
      this.gl=this.canvas.getContext('webgl',{alpha:true,antialias:true,preserveDrawingBuffer:true});
      if(!this.gl)throw new Error('WebGL is unavailable in this browser. Use the photo gallery instead.');
      const response=await fetch(this.modelUrl,{signal:this.controller.signal});if(!response.ok)throw new Error('The 3D file could not be loaded. Use the gallery or try again.');
      if(Number(response.headers.get('Content-Length'))>25*1024*1024)throw new Error('The 3D model is too large for this viewer.');
      const array=await response.arrayBuffer();if(this.destroyed)return;
      const model=parseGLB(array);await this.upload(model);if(this.destroyed){this.disposeGPU();return;}
      this.ready=true;this.section.dataset.state='ready';this.canvas.hidden=false;this.placeholder.hidden=true;this.loadButton.hidden=true;this.controls.forEach(b=>b.disabled=false);
      this.status.textContent='Drag left or right to rotate. Keyboard: arrows rotate, plus/minus zoom, Home resets. Vertical touch scrolling stays available.';
      this.canvas.dataset.draws='0';this.schedule();
    }catch(error){if(!this.destroyed&&error.name!=='AbortError')this.showError(error.message);}
    finally{this.busy=false;if(!this.destroyed){this.loadButton.disabled=false;this.section.setAttribute('aria-busy','false');}}
  }

  async upload(model) {
    const gl=this.gl;
    const vertex=compile(gl,gl.VERTEX_SHADER,vertexShader),fragment=compile(gl,gl.FRAGMENT_SHADER,fragmentShader);
    const program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);throw new Error('3D rendering is unsupported in this browser.');}
    this.program=program;
    this.fallbackTexture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,this.fallbackTexture);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([255,255,255,255]));
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    this.locations={};for(const name of ['uProjection','uView','uColor','uEye','uHasTexture','uTexture','uUnlit','uAlphaCutoff','uMetallic','uRoughness'])this.locations[name]=gl.getUniformLocation(program,name);
    this.attributes={};for(const name of ['aPosition','aNormal','aUV'])this.attributes[name]=gl.getAttribLocation(program,name);
    for(const primitive of model.primitives){
      if(this.destroyed)return;
      if(primitive.indices instanceof Uint32Array&&!gl.getExtension('OES_element_index_uint'))throw new Error('This browser cannot render the supplied mesh size. Use the photos instead.');
      const resource={buffers:[],count:primitive.indices.length,type:primitive.indices instanceof Uint32Array?gl.UNSIGNED_INT:gl.UNSIGNED_SHORT,color:primitive.color,metallic:primitive.metallic,roughness:primitive.roughness,unlit:primitive.unlit,alphaCutoff:primitive.alphaCutoff};
      this.resources.push(resource);
      for(const [data,target] of [[primitive.positions,gl.ARRAY_BUFFER],[primitive.normals,gl.ARRAY_BUFFER],[primitive.uv,gl.ARRAY_BUFFER],[primitive.indices,gl.ELEMENT_ARRAY_BUFFER]]){
        const buffer=gl.createBuffer();gl.bindBuffer(target,buffer);gl.bufferData(target,data,gl.STATIC_DRAW);resource.buffers.push(buffer);
      }
      if(primitive.texture){
        let image;try{image=await createImageBitmap(new Blob([primitive.texture.bytes],{type:primitive.texture.mime}));}
        catch{throw new Error('An embedded model texture could not be decoded.');}
        if(this.destroyed){image.close();return;}
        if(image.width>4096||image.height>4096){image.close();throw new Error('Optimise model textures to at most 4096 pixels per side.');}
        const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);image.close();resource.texture=texture;
      }
    }
  }

  action(action) {
    if(!this.ready)return;
    if(action==='left')this.yaw-=.18;if(action==='right')this.yaw+=.18;
    if(action==='up')this.pitch=Math.max(-1.25,this.pitch-.12);if(action==='down')this.pitch=Math.min(1.25,this.pitch+.12);
    if(action==='in')this.distance=Math.max(2.6,this.distance-.35);if(action==='out')this.distance=Math.min(8,this.distance+.35);
    if(action==='reset'){this.yaw=-.65;this.pitch=.18;this.distance=4.4;}
    this.schedule();
  }

  schedule() { if(!this.frame&&!this.destroyed)this.frame=requestAnimationFrame(()=>{this.frame=0;this.render();}); }
  render() {
    if(!this.ready||this.destroyed)return;
    const gl=this.gl,rect=this.canvas.parentElement.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.75);
    const width=Math.max(1,Math.round(rect.width*dpr)),height=Math.max(1,Math.round(rect.height*dpr));
    if(this.canvas.width!==width||this.canvas.height!==height){this.canvas.width=width;this.canvas.height=height;}
    gl.viewport(0,0,width,height);gl.clearColor(0,0,0,0);gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(this.program);
    const view=camera(this.yaw,this.pitch,this.distance);gl.uniformMatrix4fv(this.locations.uProjection,false,projection(width/height));gl.uniformMatrix4fv(this.locations.uView,false,view.matrix);gl.uniform3fv(this.locations.uEye,view.eye);
    for(const r of this.resources){
      for(const [i,name,size] of [[0,'aPosition',3],[1,'aNormal',3],[2,'aUV',2]]){gl.bindBuffer(gl.ARRAY_BUFFER,r.buffers[i]);gl.enableVertexAttribArray(this.attributes[name]);gl.vertexAttribPointer(this.attributes[name],size,gl.FLOAT,false,0,0);}
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,r.buffers[3]);gl.uniform4fv(this.locations.uColor,r.color);gl.uniform1i(this.locations.uUnlit,r.unlit);gl.uniform1f(this.locations.uAlphaCutoff,r.alphaCutoff);gl.uniform1i(this.locations.uHasTexture,!!r.texture);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,r.texture||this.fallbackTexture);gl.uniform1i(this.locations.uTexture,0);
      gl.uniform1f(this.locations.uMetallic,r.metallic);gl.uniform1f(this.locations.uRoughness,r.roughness);
      gl.drawElements(gl.TRIANGLES,r.count,r.type,0);
    }
    this.canvas.dataset.yaw=String(this.yaw);this.canvas.dataset.distance=String(this.distance);this.canvas.dataset.draws=String(Number(this.canvas.dataset.draws||0)+1);
  }

  showError(message) {
    this.ready=false;this.disposeGPU();this.section.dataset.state='error';this.canvas.hidden=true;this.placeholder.hidden=false;
    this.placeholder.querySelector('h3').textContent='The 3D view is unavailable.';
    this.placeholder.querySelector('p').textContent='You can still explore the supplied photo views. No substitute model is shown.';
    this.status.textContent=message;this.controls.forEach(button=>button.disabled=true);this.loadButton.hidden=!this.modelUrl;this.loadButton.textContent='Retry 3D view';
  }
  disposeGPU() {
    if(!this.gl)return;
    for(const resource of this.resources){resource.buffers.forEach(buffer=>this.gl.deleteBuffer(buffer));if(resource.texture)this.gl.deleteTexture(resource.texture);}
    this.resources=[];if(this.fallbackTexture)this.gl.deleteTexture(this.fallbackTexture);this.fallbackTexture=null;if(this.program)this.gl.deleteProgram(this.program);this.program=null;
  }
  destroy() { this.destroyed=true;this.ready=false;cancelAnimationFrame(this.frame);this.events.abort();this.controller.abort();this.resizeObserver.disconnect();this.disposeGPU(); }
}
