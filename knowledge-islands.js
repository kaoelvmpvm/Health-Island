import * as THREE from 'three';

// Three independent PDF libraries around the central Padlet guide island.
// Knowledge libraries are available before game gates; towers retain existing unlock rules.
const BOOKS=Object.freeze([
 {id:'clear',topic:'不染色',title:'悸動青春頌',subtitle:'色情訊息識讀與性衝動健康因應',count:9,
  x:-9.1,z:6.0,color:0x55ad8d,light:0xe5f7dc,drive:'1c3werbYfxxOa96fY8EoQ3uqAWHLDLd40'},
 {id:'brag',topic:'不炫耀',title:'不需炫耀、不是比較',subtitle:'同儕比較壓力與獨立思考',count:9,
  x:0,z:-11.4,color:0xa18ed8,light:0xf2ddff,drive:'1v7zTXRnUN52NvD7glko0eig8pxpQxRA4'},
 {id:'lost',topic:'不迷路',title:'青春不迷路，幸福不MISS',subtitle:'性誘惑風險覺察與健康決策',count:10,
  x:9.1,z:6.0,color:0xdfad66,light:0xffedc6,drive:'1fedgmtF8YBZJ_tnu1I_YfDd2rLejY7Xk'}
]);
const stone=new THREE.MeshStandardMaterial({color:0xd1c5a8,roughness:.92,flatShading:true});
const paper=new THREE.MeshStandardMaterial({color:0xfff9e9,roughness:.78,flatShading:true});
const ink=new THREE.MeshStandardMaterial({color:0x325961,roughness:.75,flatShading:true});
const gold=new THREE.MeshStandardMaterial({color:0xf2bd5f,roughness:.62,flatShading:true});
function part(parent,geo,mat,x=0,y=0,z=0){
 const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
}
function placard(topic){
 const c=document.createElement('canvas');c.width=512;c.height=170;
 const x=c.getContext('2d');x.fillStyle='#fff6e4';x.fillRect(0,0,512,170);
 x.fillStyle='#32535a';x.textAlign='center';x.textBaseline='middle';
 x.font='bold 53px "Microsoft JhengHei","Noto Sans TC",sans-serif';
 x.fillText('知識寶庫',256,59);
 x.font='bold 31px "Microsoft JhengHei","Noto Sans TC",sans-serif';
 x.fillText(topic,256,125);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function libraryStructure(scene,book){
 const root=new THREE.Group();root.position.set(book.x,0,book.z);root.name=book.topic+'知識寶庫';scene.add(root);
 const accent=new THREE.MeshStandardMaterial({color:book.color,roughness:.88,flatShading:true});
 const base=new THREE.MeshStandardMaterial({color:book.light,roughness:1,flatShading:true});
 part(root,new THREE.CylinderGeometry(2.47,2.26,.36,14),base,0,.48,0);
 part(root,new THREE.CylinderGeometry(2.33,2.47,.37,14),accent,0,.14,0);
 part(root,new THREE.CylinderGeometry(2.21,1.42,.75,12),stone,0,-.40,0);
 part(root,new THREE.ConeGeometry(1.42,1.65,10),stone,0,-1.54,0);
 const rim=part(root,new THREE.TorusGeometry(2.3,.08,5,48),paper,0,.69,0);
 rim.rotation.x=Math.PI/2;
 // The central open book is a visible, clickable landmark.
 const dais=part(root,new THREE.CylinderGeometry(.92,.98,.24,10),ink,0,.78,0);
 const left=part(root,new THREE.BoxGeometry(.82,.12,1.14),paper,-.40,1.12,0);
 const right=part(root,new THREE.BoxGeometry(.82,.12,1.14),paper,.40,1.12,0);
 left.rotation.z=-.17;right.rotation.z=.17;
 part(root,new THREE.BoxGeometry(.06,.13,1.20),gold,0,1.09,0);
 for(const side of [-1,1]){
   for(let i=0;i<3;i++){const stripe=part(root,new THREE.BoxGeometry(.43,.009,.025),ink,side*.43,1.20,-.33+i*.26);stripe.rotation.z=side*.17;}
 }
 const sign=part(root,new THREE.PlaneGeometry(1.89,.65),new THREE.MeshBasicMaterial({
   map:placard(book.topic),side:THREE.DoubleSide}),0,2.47,.09);
 const signBack=part(root,new THREE.BoxGeometry(2.04,.79,.13),ink,0,2.45,-.01);
 for(const x of [-.88,.88])part(root,new THREE.CylinderGeometry(.055,.06,1.13,6),gold,x,1.80,-.06);
 const hit=part(root,new THREE.CylinderGeometry(2.47,2.45,2.50,14),new THREE.MeshBasicMaterial({visible:false,depthWrite:false}),0,1.45,0);
 return {root,hit};
}
const make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
export function createKnowledgeIslands({scene,camera,renderer}){
 const app=document.getElementById('app'),canvas=renderer.domElement;
 const ray=new THREE.Raycaster(),p=new THREE.Vector2(),v=new THREE.Vector3();
 const entries=BOOKS.map(book=>{
   const visual=libraryStructure(scene,book);
   const mark=make('button','knowledge-island-marker','📚 '+book.topic+'知識寶庫');
   mark.type='button';mark.id='knowledgeVaultMarker-'+book.id;mark.setAttribute('aria-label','閱讀'+book.title+'原始教材');
   mark.style.setProperty('--knowledge-accent','#'+book.color.toString(16).padStart(6,'0'));
   app.appendChild(mark);
   return {...book,...visual,mark};
 });
 const overlay=make('div','knowledge-pdf-overlay');overlay.hidden=true;
 const dialog=make('section','knowledge-pdf-dialog');dialog.setAttribute('role','dialog');
 dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-labelledby','knowledgePdfTitle');
 const header=make('header','knowledge-pdf-header'),heading=make('div','knowledge-pdf-heading');
 const eyebrow=make('span','knowledge-pdf-eyebrow','HEALTH ISLAND / 知識寶庫');
 const title=make('h2','', '完整教材');title.id='knowledgePdfTitle';heading.append(eyebrow,title);
 const close=make('button','knowledge-pdf-close','×');close.type='button';close.setAttribute('aria-label','關閉知識寶庫');
 header.append(heading,close);
 const description=make('p','knowledge-pdf-description');
 const viewer=make('iframe','knowledge-pdf-frame');viewer.title='原始 PDF 教材閱讀器';viewer.setAttribute('allowfullscreen','');
 const actions=make('div','knowledge-pdf-actions');
 const external=make('a','knowledge-pdf-link','↗ 另開完整 PDF');external.target='_blank';external.rel='noopener noreferrer';
 const back=make('button','knowledge-pdf-return','返回島嶼');back.type='button';
 const note=make('p','knowledge-pdf-note','PDF 已保留原始圖文與排版。若顯示「需要存取權」，請由檔案擁有者開放 Google Drive 連結檢視權限。');
 actions.append(external,back);
 dialog.append(header,description,viewer,actions,note);overlay.appendChild(dialog);app.appendChild(overlay);
 let active=null,lastFocus=null,down=null;
 function open(topic){
   const book=entries.find(b=>b.topic===topic);if(!book)return;
   lastFocus=document.activeElement;active=book;
   title.textContent=book.topic+'｜'+book.title;
   description.textContent=book.subtitle+' · 原始完整 '+book.count+' 頁 PDF';
   const base='https://drive.google.com/file/d/'+book.drive+'/';
   viewer.src=base+'preview';external.href=base+'view';
   overlay.hidden=false;close.focus();
 }
 function hide(){
   if(overlay.hidden)return;
   overlay.hidden=true;viewer.src='about:blank';active=null;
   if(lastFocus?.isConnected)lastFocus.focus();
 }
 entries.forEach(e=>e.mark.addEventListener('click',()=>open(e.topic)));
 close.addEventListener('click',hide);back.addEventListener('click',hide);
 overlay.addEventListener('click',e=>{if(e.target===overlay)hide();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden){e.preventDefault();e.stopImmediatePropagation();hide();}},true);
 canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY}});
 canvas.addEventListener('pointerup',e=>{
   if(!down)return;const distance=Math.hypot(e.clientX-down.x,e.clientY-down.y);down=null;
   if(distance>9||!overlay.hidden)return;
   const rect=canvas.getBoundingClientRect();
   p.set((e.clientX-rect.left)/rect.width*2-1,-((e.clientY-rect.top)/rect.height*2-1));
   ray.setFromCamera(p,camera);
   const hits=ray.intersectObjects(entries.map(e=>e.hit),false);
   if(hits.length){const entry=entries.find(e=>e.hit===hits[0].object);if(entry)open(entry.topic);}
 });
 function update(){
   for(const e of entries){
     v.set(e.x,3.85,e.z).project(camera);
     const x=(v.x*.5+.5)*canvas.clientWidth,y=(-v.y*.5+.5)*canvas.clientHeight;
     if(v.z< -1||v.z>1||x<30||x>canvas.clientWidth-30||y<55||y>canvas.clientHeight-55)e.mark.classList.add('hidden');
     else{e.mark.classList.remove('hidden');e.mark.style.left=x+'px';e.mark.style.top=y+'px';}
   }
 }
 return {open,update,isOpen:()=>!overlay.hidden};
}