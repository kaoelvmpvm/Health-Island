import * as THREE from 'three';

// Coordinates are world-space. The original Health Island remains centered at (0,0).
export const TOPIC_ISLANDS = Object.freeze({
  '不染色': {x:-16.8,z:-11.3,color:0x39aa86,light:0xb4e6b1,soil:0x9db39a,icon:'🌿'},
  '不炫耀': {x: 16.8,z:-11.3,color:0x9478d1,light:0xc8b4ec,soil:0xa7a2b3,icon:'✦'},
  '不迷路': {x: 0.0,z: 19.6,color:0xe4a35b,light:0xf1d29c,soil:0xb7a693,icon:'🧭'}
});
// Coordinates within each *individual* satellite island.
export const LOCAL_STATIONS=Object.freeze([
  {x:-1.92,z:-.12}, // cognitive pavilion
  {x: 1.92,z:-.12}, // affective house
  {x: 0.0,z: 2.12}  // skills tower
]);

const TAU=Math.PI*2;
const mat=(hex,props={})=>new THREE.MeshStandardMaterial({
  color:hex,flatShading:true,roughness:.89,...props
});
const faceted=new THREE.DodecahedronGeometry(1,0);
const cone=(r,h,n=6)=>new THREE.ConeGeometry(r,h,n);
const add=(root,geo,material,x=0,y=0,z=0,shadow=true)=>{
  const obj=new THREE.Mesh(geo,material);
  obj.position.set(x,y,z);
  obj.castShadow=shadow;
  obj.receiveShadow=true;
  root.add(obj);
  return obj;
};
function tinted(hex,factor){return new THREE.Color(hex).multiplyScalar(factor)}
function terrain(root,info,variation){
  const layers=[
    {r:4.23,y:.63},{r:4.53,y:.24},{r:4.27,y:-.37},
    {r:3.75,y:-1.12},{r:2.79,y:-2.14},
    {r:1.52,y:-3.11},{r:.21,y:-3.72}
  ];
  const count=14;
  const angles=Array.from({length:count},(_,i)=>i*TAU/count+.16);
  const jitter=Array.from({length:count},(_,i)=>.95+.06*Math.sin(i*2.3+variation));
  const point=(layer,i)=>{
    const k=(i+count)%count;
    return new THREE.Vector3(
      Math.cos(angles[k])*layer.r*jitter[k],
      layer.y,
      Math.sin(angles[k])*layer.r*jitter[k]
    );
  };
  const pos=[],colors=[];
  const vertex=(p,c)=>{
    pos.push(p.x,p.y,p.z);
    colors.push(c.r,c.g,c.b);
  };
  const tri=(a,b,c,col)=>{vertex(a,col);vertex(b,col);vertex(c,col)};
  for(let level=0;level<layers.length-1;level++){
    for(let i=0;i<count;i++){
      const a=point(layers[level],i),b=point(layers[level],i+1);
      const c=point(layers[level+1],i),d=point(layers[level+1],i+1);
      const base=new THREE.Color(info.soil).lerp(
        new THREE.Color(level<2?0xd6c4aa:0x617a78),Math.min(1,level/6));
      const colA=tinted(base,.94+((i+level)%5)*.03);
      const colB=tinted(base,.89+((i+level+2)%5)*.033);
      tri(a,c,b,colA);tri(b,c,d,colB);
    }
  }
  const top=new THREE.Vector3(0,.644,0);
  for(let i=0;i<count;i++){
    const a=point(layers[0],i),b=point(layers[0],i+1);
    const col=new THREE.Color(info.light).lerp(new THREE.Color(info.color),.38+(i%4)*.065);
    tri(top,new THREE.Vector3(b.x,.644,b.z),new THREE.Vector3(a.x,.644,a.z),col);
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  geo.computeVertexNormals();
  add(root,geo,new THREE.MeshStandardMaterial({vertexColors:true,flatShading:true,roughness:1,side:THREE.DoubleSide}));
  // Thin grassy rim helps articulate a separate island from the main landmass.
  const rim=add(root,new THREE.TorusGeometry(4.18,.075,4,56),mat(info.light),0,.59,0,false);
  rim.rotation.x=Math.PI/2;
}
function decoration(root,topic,info,index){
  let state=(20531+index*93131)>>>0;
  const rnd=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296};
  const stem=mat(0x886e5e);
  const shades={
    '不染色':[0x2f8b70,0x4aa278,0x68ad79,0x8ecb9a],
    '不炫耀':[0x876ab5,0xa18ccf,0xc2aadf,0x609e92],
    '不迷路':[0x91b67d,0xd6a56f,0xe8c083,0x85b59a]
  }[topic];
  function safe(x,z,margin){
    if(Math.hypot(x,z)>3.77)return false;
    if(Math.hypot(x,z+2.72)<1.1)return false;
    return LOCAL_STATIONS.every(s=>Math.hypot(x-s.x,z-s.z)>1.07+margin);
  }
  for(let i=0,tries=0;i<16&&tries<400;tries++){
    const a=rnd()*TAU,r=Math.sqrt(rnd())*3.8;
    const x=Math.cos(a)*r,z=Math.sin(a)*r;
    if(!safe(x,z,.23))continue;
    if(topic==='不炫耀'){
      const h=.65+rnd()*.8,crystal=add(root,cone(.22,h,5),mat(shades[Math.floor(rnd()*3)]),x,.67+h/2,z);
      crystal.rotation.z=(rnd()-.5)*.22;crystal.rotation.y=rnd()*TAU;
      const small=add(root,cone(.12,h*.65,5),mat(0xd8c5f3),x+.20,.67+h*.31,z-.15);
      small.rotation.z=.18;
    }else if(topic==='不迷路'){
      add(root,new THREE.CylinderGeometry(.075,.10,.63,5),stem,x,.93,z);
      const crown=add(root,new THREE.DodecahedronGeometry(.47,0),mat(shades[Math.floor(rnd()*shades.length)]),x,1.34,z);
      crown.scale.y=.74;
    }else{
      add(root,new THREE.CylinderGeometry(.075,.095,.64,5),stem,x,.94,z);
      for(let k=0;k<2;k++){
        const crown=add(root,new THREE.IcosahedronGeometry(.42-k*.08,0),mat(shades[Math.floor(rnd()*shades.length)]),
          x+(k?-.16:.10),1.3+k*.27,z+(k?.11:0));
        crown.scale.set(1.1,.85,1);
      }
    }
    i++;
  }
  for(let i=0,tries=0;i<26&&tries<400;tries++){
    const a=rnd()*TAU,r=Math.sqrt(rnd())*3.93;
    const x=Math.cos(a)*r,z=Math.sin(a)*r;
    if(!safe(x,z,.05))continue;
    if(rnd()<.5){
      const rock=add(root,faceted,mat(topic==='不炫耀'?0xb9acd0:0xb3b4a4),x,.69,z);
      rock.scale.set(.17+rnd()*.18,.13+rnd()*.1,.18+rnd()*.16);
    }else{
      add(root,new THREE.IcosahedronGeometry(.065,0),mat(topic==='不迷路'?0xffe19a:0xf3f1dc),x,.73,z);
    }
    i++;
  }
}
function path(root,a,b,color){
  const length=Math.hypot(b.x-a.x,b.z-a.z),steps=Math.ceil(length/.34);
  const pale=mat(0xe8dec7),accent=mat(color);
  for(let i=1;i<steps;i++){
    const t=i/steps,x=a.x+(b.x-a.x)*t,z=a.z+(b.z-a.z)*t;
    const rock=add(root,new THREE.CylinderGeometry(.11,.13,.044,6),i%4===0?accent:pale,x,.682,z,false);
    rock.rotation.y=i*.53;
  }
}
function bridge(scene,info){
  const root=new THREE.Group();
  root.name='通往'+(info.icon||'主題島')+'的踏石';
  scene.add(root);
  const from=new THREE.Vector2(0,0);
  const to=new THREE.Vector2(info.x,info.z);
  const unit=to.clone().normalize(),length=to.length();
  // Bridge now begins at the edge of the smaller central Padlet guide island.
  const start=5.4,end=length-4.6;
  const bridgeMat=mat(0xf5ece3);
  const brightMat=new THREE.MeshBasicMaterial({color:info.color,transparent:true,opacity:.65,depthWrite:false});
  for(let d=start+.15;d<end;d+=.64){
    const x=unit.x*d,z=unit.y*d;
    const disc=add(root,new THREE.CylinderGeometry(.26,.32,.15,8),bridgeMat,x,.25,z,false);
    disc.rotation.y=d*.4;
    const glow=add(root,new THREE.CylinderGeometry(.14,.17,.018,8),brightMat,x,.335,z,false);
  }
  return root;
}
// Returns three separate floating landmasses in the world, *not*
// three colored districts on the original center island.
export function buildSatelliteIslands(scene){
  const roots={};
  Object.entries(TOPIC_ISLANDS).forEach(([topic,info],i)=>{
    const group=new THREE.Group();
    group.position.set(info.x,0,info.z);
    group.name=topic+'島';
    scene.add(group);
    terrain(group,info,i);
    decoration(group,topic,info,i);
    path(group,LOCAL_STATIONS[0],LOCAL_STATIONS[2],info.color);
    path(group,LOCAL_STATIONS[1],LOCAL_STATIONS[2],info.color);
    group.userData.bridge=bridge(scene,info);
    roots[topic]=group;
  });
  return roots;
}
