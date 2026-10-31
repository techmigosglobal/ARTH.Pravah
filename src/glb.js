/** Deliberately bounded static GLB 2.0 subset. Unsupported exports fail explicitly. */
export const identity = () => new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
export function multiply(a,b) {
  const out=new Float32Array(16);
  for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)out[c*4+r]+=a[k*4+r]*b[c*4+k];
  return out;
}
function nodeMatrix(node) {
  if(node.matrix) { if(node.matrix.length!==16)throw new Error('Invalid node matrix.'); return new Float32Array(node.matrix); }
  const [x,y,z,w]=node.rotation||[0,0,0,1], [sx,sy,sz]=node.scale||[1,1,1], [tx,ty,tz]=node.translation||[0,0,0];
  return new Float32Array([(1-2*y*y-2*z*z)*sx,(2*x*y+2*z*w)*sx,(2*x*z-2*y*w)*sx,0,
    (2*x*y-2*z*w)*sy,(1-2*x*x-2*z*z)*sy,(2*y*z+2*x*w)*sy,0,
    (2*x*z+2*y*w)*sz,(2*y*z-2*x*w)*sz,(1-2*x*x-2*y*y)*sz,0,tx,ty,tz,1]);
}
function normalMatrix(m) {
  const [a,b,c,d,e,f,g,h,i]=[m[0],m[4],m[8],m[1],m[5],m[9],m[2],m[6],m[10]];
  const out=[e*i-f*h,f*g-d*i,d*h-e*g,c*h-b*i,a*i-c*g,b*g-a*h,b*f-c*e,c*d-a*f,a*e-b*d];
  const det=a*out[0]+b*out[1]+c*out[2];
  if(Math.abs(det)<1e-12)throw new Error('A model transform has zero scale.');
  return out.map(n=>n/det);
}
function normalsFromTriangles(positions,indices) {
  const normals=new Float32Array(positions.length);
  for(let i=0;i<indices.length;i+=3){
    const a=indices[i]*3,b=indices[i+1]*3,c=indices[i+2]*3;
    const ux=positions[b]-positions[a],uy=positions[b+1]-positions[a+1],uz=positions[b+2]-positions[a+2];
    const vx=positions[c]-positions[a],vy=positions[c+1]-positions[a+1],vz=positions[c+2]-positions[a+2];
    const n=[uy*vz-uz*vy,uz*vx-ux*vz,ux*vy-uy*vx];
    for(const p of [a,b,c])for(let j=0;j<3;j++)normals[p+j]+=n[j];
  }
  for(let i=0;i<normals.length;i+=3){const l=Math.hypot(...normals.subarray(i,i+3))||1;for(let j=0;j<3;j++)normals[i+j]/=l;}
  return normals;
}
export function parseGLB(buffer) {
  if(!(buffer instanceof ArrayBuffer)||buffer.byteLength<20||buffer.byteLength>25*1024*1024)throw new Error('Use an embedded GLB smaller than 25 MB.');
  const view=new DataView(buffer);
  if(view.getUint32(0,true)!==0x46546c67||view.getUint32(4,true)!==2||view.getUint32(8,true)!==buffer.byteLength)throw new Error('A valid GLB 2.0 file is required.');
  let json,bin;
  for(let offset=12;offset<buffer.byteLength;){
    if(offset+8>buffer.byteLength)throw new Error('Truncated GLB chunk.');
    const size=view.getUint32(offset,true),type=view.getUint32(offset+4,true);offset+=8;
    if(offset+size>buffer.byteLength)throw new Error('Invalid GLB chunk length.');
    if(type===0x4e4f534a){if(json)throw new Error('Multiple JSON chunks.');json=JSON.parse(new TextDecoder().decode(new Uint8Array(buffer,offset,size)).replace(/[\0\s]+$/,''));}
    if(type===0x004e4942){if(bin)throw new Error('Multiple binary chunks.');bin=new DataView(buffer,offset,size);}
    offset+=size;
  }
  if(!json||!bin||json.asset?.version!=='2.0')throw new Error('GLB JSON and embedded geometry are required.');
  if(json.buffers?.length!==1||json.buffers[0].uri)throw new Error('Export a single embedded GLB buffer.');
  if((json.extensionsRequired||[]).some(name=>name!=='KHR_materials_unlit'))throw new Error('Compressed or extended GLB requires a supported uncompressed export.');
  if(json.skins?.length)throw new Error('Export a static model without skeletal animation.');
  const types={SCALAR:1,VEC2:2,VEC3:3,VEC4:4};
  const components={5120:[1,'getInt8',127],5121:[1,'getUint8',255],5122:[2,'getInt16',32767],5123:[2,'getUint16',65535],5125:[4,'getUint32',4294967295],5126:[4,'getFloat32',1]};
  function accessor(index,expected) {
    const a=json.accessors?.[index],bv=json.bufferViews?.[a?.bufferView];
    if(!a||!bv||a.sparse||a.type!==expected||!Number.isInteger(a.count)||a.count<1||a.count>3000000)throw new Error('Unsupported or invalid mesh accessor.');
    if(!Number.isInteger(bv.byteLength)||bv.byteLength<1||(bv.byteOffset!==undefined&&(!Number.isInteger(bv.byteOffset)||bv.byteOffset<0)))throw new Error('Invalid buffer view.');
    if(bv.buffer!==0||bv.extensions?.EXT_meshopt_compression)throw new Error('Export uncompressed embedded mesh buffers.');
    const format=components[a.componentType],channels=types[a.type];if(!format||!channels)throw new Error('Unsupported vertex format.');
    const [bytes,method,max]=format,stride=bv.byteStride||channels*bytes,start=(bv.byteOffset||0)+(a.byteOffset||0);
    if(stride<channels*bytes||start<0||start+(a.count-1)*stride+channels*bytes>(bv.byteOffset||0)+bv.byteLength||start+(a.count-1)*stride+channels*bytes>bin.byteLength)throw new Error('Mesh accessor exceeds its buffer.');
    const output=new Float32Array(a.count*channels);
    for(let row=0;row<a.count;row++)for(let col=0;col<channels;col++){
      let value=bin[method](start+row*stride+col*bytes,true);
      if(a.normalized&&a.componentType!==5126)value=Math.max(-1,value/max);
      if(!Number.isFinite(value))throw new Error('Invalid non-finite vertex.');
      output[row*channels+col]=value;
    }
    return output;
  }
  function embeddedTexture(material) {
    const info=material.pbrMetallicRoughness?.baseColorTexture;
    if(!info)return null;
    if(info.extensions?.KHR_texture_transform||info.texCoord>0)throw new Error('Use base-colour texture coordinates TEXCOORD_0 without transforms.');
    const texture=json.textures?.[info.index],image=json.images?.[texture?.source],bv=json.bufferViews?.[image?.bufferView];
    if(!image||!bv||image.uri||!['image/png','image/jpeg','image/webp'].includes(image.mimeType))throw new Error('Use embedded PNG, JPEG or WebP base-colour textures.');
    const offset=bv.byteOffset||0;if(offset<0||offset+bv.byteLength>bin.byteLength)throw new Error('Invalid texture buffer.');
    return {bytes:buffer.slice(bin.byteOffset+offset,bin.byteOffset+offset+bv.byteLength),mime:image.mimeType};
  }
  const primitives=[],bounds={min:[Infinity,Infinity,Infinity],max:[-Infinity,-Infinity,-Infinity]};
  let vertices=0;
  function walk(index,parent,ancestors=new Set()) {
    if(ancestors.size>100||ancestors.has(index))throw new Error('Invalid scene hierarchy.');
    const node=json.nodes?.[index];if(!node)throw new Error('Missing scene node.');
    if(node.skin!==undefined||node.weights)throw new Error('Use a static model without morph targets.');
    const world=multiply(parent,nodeMatrix(node));if([...world].some(n=>!Number.isFinite(n)))throw new Error('Invalid scene transform.');
    if(node.mesh!==undefined){
      const mesh=json.meshes?.[node.mesh];if(!mesh)throw new Error('Missing mesh.');
      for(const primitive of mesh.primitives||[]){
        if((primitive.mode??4)!==4||primitive.targets||primitive.extensions?.KHR_draco_mesh_compression)throw new Error('Use uncompressed triangle meshes without morph targets.');
        const positions=accessor(primitive.attributes?.POSITION,'VEC3');vertices+=positions.length/3;
        if(vertices>1000000)throw new Error('Optimise the model to at most one million rendered vertices.');
        let indices=primitive.indices===undefined?Float32Array.from({length:positions.length/3},(_,i)=>i):accessor(primitive.indices,'SCALAR');
        if(indices.length%3||indices.some(i=>!Number.isInteger(i)||i<0||i>=positions.length/3))throw new Error('Invalid triangle indices.');
        const maxIndex=indices.reduce((a,b)=>Math.max(a,b),0);indices=maxIndex>65535?new Uint32Array(indices):new Uint16Array(indices);
        for(let i=0;i<positions.length;i+=3){const x=positions[i],y=positions[i+1],z=positions[i+2];for(let r=0;r<3;r++){const value=world[r]*x+world[r+4]*y+world[r+8]*z+world[r+12];positions[i+r]=value;bounds.min[r]=Math.min(bounds.min[r],value);bounds.max[r]=Math.max(bounds.max[r],value);}}
        let normals;
        if(primitive.attributes.NORMAL!==undefined){normals=accessor(primitive.attributes.NORMAL,'VEC3');if(normals.length!==positions.length)throw new Error('Normal count mismatch.');const n=normalMatrix(world);for(let i=0;i<normals.length;i+=3){const x=normals[i],y=normals[i+1],z=normals[i+2];for(let r=0;r<3;r++)normals[i+r]=n[r*3]*x+n[r*3+1]*y+n[r*3+2]*z;}}
        else normals=normalsFromTriangles(positions,indices);
        const material=json.materials?.[primitive.material]||{},texture=embeddedTexture(material);
        const uv=primitive.attributes.TEXCOORD_0!==undefined?accessor(primitive.attributes.TEXCOORD_0,'VEC2'):new Float32Array(positions.length/3*2);
        if(uv.length!==positions.length/3*2||texture&&primitive.attributes.TEXCOORD_0===undefined)throw new Error('Texture coordinates are missing or invalid.');
        const color=material.pbrMetallicRoughness?.baseColorFactor||[.62,.7,.75,1];
        if(color.length!==4||color.some(n=>!Number.isFinite(n)||n<0||n>1))throw new Error('Invalid material colour.');
        if(material.alphaMode==='BLEND')throw new Error('Export opaque or alpha-mask materials for this viewer.');
        const metallic=material.pbrMetallicRoughness?.metallicFactor??1,roughness=material.pbrMetallicRoughness?.roughnessFactor??1;
        if(![metallic,roughness].every(n=>Number.isFinite(n)&&n>=0&&n<=1))throw new Error('Invalid material surface factors.');
        primitives.push({positions,normals,indices,uv,color,texture,metallic,roughness,unlit:!!material.extensions?.KHR_materials_unlit,alphaCutoff:material.alphaMode==='MASK'?(material.alphaCutoff??.5):0});
      }
    }
    const next=new Set(ancestors);next.add(index);for(const child of node.children||[])walk(child,world,next);
  }
  const children=new Set((json.nodes||[]).flatMap(n=>n.children||[]));
  const roots=json.scenes?.[json.scene??0]?.nodes||(json.nodes||[]).map((_,i)=>i).filter(i=>!children.has(i));
  roots.forEach(i=>walk(i,identity()));
  if(!primitives.length)throw new Error('The GLB contains no supported visible geometry.');
  const center=bounds.min.map((v,i)=>(v+bounds.max[i])/2),size=Math.max(...bounds.max.map((v,i)=>v-bounds.min[i]));
  if(!Number.isFinite(size)||size<=0)throw new Error('The model has empty bounds.');
  for(const primitive of primitives)for(let i=0;i<primitive.positions.length;i++)primitive.positions[i]=(primitive.positions[i]-center[i%3])*2.6/size;
  return {primitives,bounds,vertices};
}
