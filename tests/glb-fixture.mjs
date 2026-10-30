/** Synthetic non-bike geometry used only by tests; never included in a public manifest. */
export function fixtureGLB(change = json => json) {
  const positions=new Float32Array([-1,-.6,-.35,1,-.6,-.35,1,.6,-.35,-1,.6,-.35,-1,-.6,.35,1,-.6,.35,1,.6,.35,-1,.6,.35]);
  const indices=new Uint16Array([0,2,1,0,3,2,4,5,6,4,6,7,0,1,5,0,5,4,3,7,6,3,6,2,1,2,6,1,6,5,0,4,7,0,7,3]);
  const bin=new Uint8Array(positions.byteLength+indices.byteLength);bin.set(new Uint8Array(positions.buffer));bin.set(new Uint8Array(indices.buffer),positions.byteLength);
  const json=change({asset:{version:'2.0'},buffers:[{byteLength:bin.byteLength}],bufferViews:[{buffer:0,byteOffset:0,byteLength:positions.byteLength},{buffer:0,byteOffset:positions.byteLength,byteLength:indices.byteLength}],accessors:[{bufferView:0,componentType:5126,count:8,type:'VEC3',min:[-1,-.6,-.35],max:[1,.6,.35]},{bufferView:1,componentType:5123,count:indices.length,type:'SCALAR'}],materials:[{pbrMetallicRoughness:{baseColorFactor:[.02,.55,.62,1]}}],meshes:[{primitives:[{attributes:{POSITION:0},indices:1,material:0}]}],nodes:[{mesh:0}],scenes:[{nodes:[0]}],scene:0});
  const encoded=new TextEncoder().encode(JSON.stringify(json)),jsonLength=Math.ceil(encoded.length/4)*4;
  const result=new ArrayBuffer(12+8+jsonLength+8+bin.byteLength),view=new DataView(result),bytes=new Uint8Array(result);
  view.setUint32(0,0x46546c67,true);view.setUint32(4,2,true);view.setUint32(8,result.byteLength,true);
  view.setUint32(12,jsonLength,true);view.setUint32(16,0x4e4f534a,true);bytes.fill(32,20,20+jsonLength);bytes.set(encoded,20);
  const offset=20+jsonLength;view.setUint32(offset,bin.byteLength,true);view.setUint32(offset+4,0x004e4942,true);bytes.set(bin,offset+8);
  return result;
}
