import * as THREE from 'three';
import { createVaultLibrary } from './vault-learning.js?v=1.0.0';

// Central guide island: Padlet collaborative board and quest map.
// Full PDFs are read from three independent knowledge islands.
export const VAULT_LOCATION = Object.freeze({x:0,z:-2.75});

const stone=new THREE.MeshStandardMaterial({color:0xe9e0cf,roughness:.83,flatShading:true});
const stoneShade=new THREE.MeshStandardMaterial({color:0xc2c8b7,roughness:.92,flatShading:true});
const cream=new THREE.MeshStandardMaterial({color:0xffefd5,roughness:.65,flatShading:true});
const gold=new THREE.MeshStandardMaterial({color:0xe4b65c,metalness:.34,roughness:.35,flatShading:true});
const brightGold=new THREE.MeshStandardMaterial({color:0xffd881,metalness:.28,roughness:.28,flatShading:true,emissive:0x7b4b12,emissiveIntensity:.11});
const darkGold=new THREE.MeshStandardMaterial({color:0x9a703b,metalness:.25,roughness:.43,flatShading:true});
const darkTeal=new THREE.MeshStandardMaterial({color:0x275657,metalness:.19,roughness:.56,flatShading:true});
const innerDoor=new THREE.MeshStandardMaterial({color:0x27525a,metalness:.24,roughness:.4,flatShading:true});
const lineGold=new THREE.MeshBasicMaterial({color:0xfbe7a6,side:THREE.DoubleSide});
const glow=new THREE.MeshBasicMaterial({color:0xffebac,transparent:true,opacity:.8,depthWrite:false});
const hex=v=>new THREE.Color(v);
function part(group,geo,material,x=0,y=0,z=0,cast=true){
  const mesh=new THREE.Mesh(geo,material);
  mesh.position.set(x,y,z);
  mesh.castShadow=cast;
  mesh.receiveShadow=true;
  group.add(mesh);
  return mesh;
}
function placard(label){
  const canvas=document.createElement('canvas');
  canvas.width=768;canvas.height=210;
  const c=canvas.getContext('2d');
  c.fillStyle='#28474b';c.fillRect(0,0,768,210);
  c.strokeStyle='#f8de9c';c.lineWidth=10;c.strokeRect(13,13,742,184);
  c.fillStyle='#ffe1a1';c.font='900 95px "Microsoft JhengHei","Noto Sans TC",sans-serif';
  c.textAlign='center';c.textBaseline='middle';c.fillText(label,384,107);
  const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;
  return new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide});
}
function buildStructure(island){
  const root=new THREE.Group();
  root.name='中央導覽島：Padlet 共創看板';
  root.position.set(VAULT_LOCATION.x,.61,VAULT_LOCATION.z);
  island.add(root);
  // The base and forward steps are set above the grass, never below the water.
  part(root,new THREE.CylinderGeometry(1.73,1.91,.28,10),stoneShade,0,.13,0);
  part(root,new THREE.CylinderGeometry(1.63,1.71,.21,10),stone,0,.34,0);
  for(let k=0;k<3;k++){
    part(root,new THREE.BoxGeometry(1.48,.11,.41),k===0?stoneShade:stone,0,.17+k*.08,1.72+k*.27);
  }
  // Layered vaulted stone walls and domed golden roof.
  part(root,new THREE.CylinderGeometry(1.07,1.22,2.10,10),cream,0,1.43,-.13);
  const belt=part(root,new THREE.CylinderGeometry(1.27,1.27,.20,10),darkTeal,0,2.42,-.13);
  const overhang=part(root,new THREE.CylinderGeometry(1.43,1.43,.22,10),gold,0,2.58,-.13);
  const roof=part(root,new THREE.ConeGeometry(1.38,1.25,10),brightGold,0,3.29,-.13);
  roof.rotation.y=Math.PI/10;
  part(root,new THREE.SphereGeometry(.23,12,8),brightGold,0,3.99,-.13);
  part(root,new THREE.ConeGeometry(.13,.48,8),darkGold,0,4.38,-.13);

  // Flanking columns and gilded capitals facing the camera (+Z).
  for(const x of [-.86,.86]){
    part(root,new THREE.CylinderGeometry(.18,.20,1.70,8),stoneShade,x,1.39,.85);
    part(root,new THREE.CylinderGeometry(.29,.29,.17,8),gold,x,2.31,.85);
    part(root,new THREE.CylinderGeometry(.27,.29,.17,8),stone,x,.45,.85);
    const lantern=part(root,new THREE.OctahedronGeometry(.14,0),brightGold,x,2.55,.95);
    lantern.rotation.y=.48;
  }
  // Circular safe door, clearly closed / not a functioning portal.
  const threshold=part(root,new THREE.BoxGeometry(1.58,.17,.32),darkTeal,0,.42,1.045);
  const round=part(root,new THREE.CylinderGeometry(.81,.81,.18,32),darkGold,0,1.42,1.035);
  round.rotation.x=Math.PI/2;
  const disk=part(root,new THREE.CylinderGeometry(.67,.67,.19,32),innerDoor,0,1.42,1.166);
  disk.rotation.x=Math.PI/2;
  const rim=part(root,new THREE.TorusGeometry(.62,.038,8,40),brightGold,0,1.42,1.277);
  // A stylized radial treasury lock with crossed ornamental bars.
  const crossA=part(root,new THREE.BoxGeometry(.83,.055,.045),gold,0,1.42,1.292);
  const crossB=part(root,new THREE.BoxGeometry(.055,.83,.045),gold,0,1.42,1.294);
  const lockPlate=part(root,new THREE.CylinderGeometry(.22,.22,.07,16),brightGold,0,1.42,1.336);
  lockPlate.rotation.x=Math.PI/2;
  const keySlot=part(root,new THREE.SphereGeometry(.055,8,6),darkTeal,0,1.46,1.38);
  part(root,new THREE.BoxGeometry(.043,.19,.033),darkTeal,0,1.34,1.385);
  // Raised sign: expressly marks the central object as the curriculum vault.
  part(root,new THREE.BoxGeometry(1.5,.43,.10),darkTeal,0,2.60,1.03);
  const frontSign=part(root,new THREE.PlaneGeometry(1.37,.365),placard('Padlet'),0,2.60,1.086,false);
  // Treasure chest motif on the entry landing.
  const chest=new THREE.Group();chest.position.set(0,.48,2.35);root.add(chest);
  part(chest,new THREE.BoxGeometry(.79,.42,.48),darkTeal,0,.20,0);
  part(chest,new THREE.BoxGeometry(.85,.31,.57),gold,0,.51,0);
  const lid=part(chest,new THREE.CylinderGeometry(.32,.32,.83,10,1,false,0,Math.PI),darkGold,0,.67,0);
  lid.rotation.z=Math.PI/2;lid.rotation.y=Math.PI/2;
  part(chest,new THREE.BoxGeometry(.12,.79,.59),brightGold,0,.42,0);
  part(chest,new THREE.BoxGeometry(.85,.1,.58),brightGold,0,.40,0);
  part(chest,new THREE.BoxGeometry(.15,.19,.05),darkTeal,0,.43,.30);
  // Point lights make the treasure distinct at both day and night.
  const aura=new THREE.PointLight(0xffc86f,1.1,10,2);
  aura.position.set(0,2.35,1.65);root.add(aura);
  const orbiters=[];
  for(let i=0;i<9;i++){
    const orb=part(root,new THREE.IcosahedronGeometry(.055+(i%3)*.009,0),glow,0,0,0,false);
    orbiters.push({orb,phase:i*Math.PI*2/9});
  }
  const selection=part(root,new THREE.CylinderGeometry(1.57,1.79,4.3,12),
    new THREE.MeshBasicMaterial({visible:false,depthWrite:false}),0,2.15,0,false);
  selection.userData.centralVault=true;
  return {root,selection,orbiters,aura};
}
function makeInterface(){
  const app=document.getElementById('app');
  const mark=document.createElement('button');
  mark.id='centralVaultMarker';mark.type='button';mark.className='central-vault-marker';
  mark.setAttribute('aria-label','開啟導覽島 Padlet 共創看板');
  const emblem=document.createElement('span');emblem.className='vault-marker-emblem';emblem.textContent='◆';
  const words=document.createElement('span');words.className='vault-marker-words';
  const label=document.createElement('strong');label.textContent='導覽島 · Padlet';
  const sub=document.createElement('small');sub.textContent='中央導覽 · 研習共創';
  words.append(label,sub);mark.append(emblem,words);
  app.appendChild(mark);

  const overlay=document.createElement('div');
  overlay.id='centralVaultOverlay';overlay.className='central-vault-overlay';overlay.hidden=true;
  overlay.setAttribute('role','presentation');
  const dialog=document.createElement('section');
  dialog.className='central-vault-dialog vault-expanded';dialog.setAttribute('role','dialog');
  dialog.setAttribute('aria-modal','true');
  dialog.setAttribute('aria-labelledby','centralVaultHeading');
  const dismiss=document.createElement('button');
  dismiss.className='central-vault-close';dismiss.type='button';dismiss.textContent='×';
  dismiss.setAttribute('aria-label','關閉教材寶庫資訊');
  const crest=document.createElement('div');crest.className='central-vault-crest';crest.textContent='◆';
  const kicker=document.createElement('div');kicker.className='central-vault-kicker';
  kicker.textContent='HEALTH ISLAND · CENTRAL VAULT';
  const title=document.createElement('h2');title.id='centralVaultHeading';title.textContent='導覽島 · Padlet';
  const closeBtn=document.createElement('button');closeBtn.className='central-vault-confirm';closeBtn.type='button';closeBtn.textContent='返回健康島';
  dialog.append(dismiss,crest,kicker,title);
  createVaultLibrary(dialog,{onClose:()=>dismiss.click()});
  overlay.appendChild(dialog);app.appendChild(overlay);
  return {mark,overlay,dismiss,closeBtn};
}
export function createTreasureVault({island,camera,renderer}){
  const visual=buildStructure(island);
  const ui=makeInterface();
  const canvas=renderer.domElement;
  const mouse=new THREE.Vector2(),raycaster=new THREE.Raycaster(),project=new THREE.Vector3();
  let previousFocus=null,down=null;
  function show(){
    if(!ui.overlay.hidden)return;
    previousFocus=document.activeElement;
    ui.overlay.hidden=false;
    ui.dismiss.focus();
  }
  function hide(){
    if(ui.overlay.hidden)return;
    ui.overlay.hidden=true;
    if(previousFocus && previousFocus.isConnected && typeof previousFocus.focus==='function') previousFocus.focus();
    else ui.mark.focus();
  }
  ui.mark.addEventListener('click',show);
  ui.dismiss.addEventListener('click',hide);
  ui.closeBtn.addEventListener('click',hide);
  ui.overlay.addEventListener('click',e=>{if(e.target===ui.overlay)hide()});
  document.addEventListener('keydown',e=>{
    if(e.key!=='Escape'||ui.overlay.hidden)return;
    e.preventDefault();e.stopImmediatePropagation();hide();
  },true);
  canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY}});
  canvas.addEventListener('pointerup',e=>{
    if(!down)return;
    const distance=Math.hypot(e.clientX-down.x,e.clientY-down.y);
    down=null;
    if(distance>9||!ui.overlay.hidden)return;
    const box=canvas.getBoundingClientRect();
    mouse.x=((e.clientX-box.left)/box.width)*2-1;
    mouse.y=-((e.clientY-box.top)/box.height)*2+1;
    raycaster.setFromCamera(mouse,camera);
    if(raycaster.intersectObject(visual.selection,false).length)show();
  });
  function update(dt,elapsed,nightBlend=0){
    const b=visual;
    for(const each of b.orbiters){
      const a=elapsed*.44+each.phase;
      each.orb.position.set(Math.sin(a)*1.30,2.6+Math.sin(elapsed*1.5+each.phase)*.23,
        Math.cos(a)*1.23);
      each.orb.material.opacity=.5+.33*Math.sin(elapsed*2.1+each.phase);
    }
    b.aura.intensity=.95+nightBlend*.75+.16*Math.sin(elapsed*1.5);
    island.updateWorldMatrix(true,false);
    project.set(VAULT_LOCATION.x,5.24,VAULT_LOCATION.z).applyMatrix4(island.matrixWorld).project(camera);
    const x=(project.x*.5+.5)*canvas.clientWidth;
    const y=(-project.y*.5+.5)*canvas.clientHeight;
    if(project.z< -1||project.z>1||x<30||x>canvas.clientWidth-30||y<65||y>canvas.clientHeight-70){
      ui.mark.classList.add('hidden');
    }else{
      ui.mark.classList.remove('hidden');
      ui.mark.style.left=(x-(canvas.clientWidth<680?38:70))+'px';ui.mark.style.top=y+'px';
    }
  }
  return {update,open:show};
}
