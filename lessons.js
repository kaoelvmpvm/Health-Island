import * as THREE from 'three';
import {isIslandUnlocked,isTowerUnlocked} from './quest-rules.js?v=0.6.0';
import { TOPIC_ISLANDS, LOCAL_STATIONS, buildSatelliteIslands } from './satellites.js?v=0.5.0';

// Each station lives on its own floating island; coordinates are world-space.
const world=(topic,n)=>({
 x: TOPIC_ISLANDS[topic].x+LOCAL_STATIONS[n].x,
 z: TOPIC_ISLANDS[topic].z+LOCAL_STATIONS[n].z
});
export const LEARNING_LOCATIONS=Object.freeze({
 '1-1':world('不染色',0),'2-1':world('不染色',1),'3-1':world('不染色',2),
 '1-2':world('不炫耀',0),'2-2':world('不炫耀',1),'3-2':world('不炫耀',2),
 '1-3':world('不迷路',0),'2-3':world('不迷路',1),'3-3':world('不迷路',2)
});
const TOPICS={
 '不染色':{hex:0x32a680,color:'#32a680',soft:'#e0f7ed',icon:'🌿'},
 '不炫耀':{hex:0x9872d5,color:'#9872d5',soft:'#f0e9fc',icon:'✦'},
 '不迷路':{hex:0xe3a35c,color:'#c7893e',soft:'#fff0db',icon:'🧭'}
};
const DIMS={
 '認知':{icon:'📖',model:'知識亭'},
 '情意':{icon:'♥',model:'心語屋'},
 '技能':{icon:'⚑',model:'練功塔'}
};
const TOPIC_ORDER=['不染色','不炫耀','不迷路'];
const groundY=.64;
const material=(hex,props={})=>new THREE.MeshStandardMaterial({color:hex,roughness:.82,flatShading:true,...props});
const cream=material(0xfff8e8),white=material(0xf7f6e9),wood=material(0xa47f5c);
function mesh(group,geo,mat,x=0,y=0,z=0,shadow=true){
 const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);o.castShadow=shadow;o.receiveShadow=true;group.add(o);return o;
}
function append(parent,tag,attrs={},text){
 const n=document.createElement(tag);
 Object.entries(attrs).forEach(([k,v])=>{
   if(k==='className')n.className=v;
   else if(k==='type'||k==='id'||k==='href'||k==='target'||k==='rel'||k==='title'||k==='role'||k.startsWith('aria-'))n.setAttribute(k,v);
   else if(k==='hidden')n.hidden=Boolean(v);
   else if(k==='style')Object.assign(n.style,v);
 });
 if(text!==undefined)n.textContent=text;
 parent.appendChild(n);
 return n;
}
function placardTexture(text,accent){
 const c=document.createElement('canvas');c.width=512;c.height=160;
 const ctx=c.getContext('2d');
 ctx.fillStyle='#fefdf6';ctx.fillRect(0,0,512,160);
 ctx.fillStyle=accent;ctx.fillRect(0,0,14,160);
 ctx.fillStyle='#264b4e';ctx.textAlign='center';ctx.textBaseline='middle';
 ctx.font='900 59px "Microsoft JhengHei","Noto Sans TC",sans-serif';
 ctx.fillText(text,265,80);
 const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
function districtSign(group,topic,x,z){
 const root=new THREE.Group();root.position.set(x,groundY,z);group.add(root);
 const accent=TOPICS[topic];
 if(!accent)throw new Error('未知的主題島：'+topic);
 mesh(root,new THREE.CylinderGeometry(.55,.60,.14,8),material(0xe1d7bc),0,.07,0);
 for(const dx of [-.86,.86])mesh(root,new THREE.CylinderGeometry(.04,.05,1.60,6),wood,dx,.87,0);
 mesh(root,new THREE.BoxGeometry(2.05,.73,.12),white,0,1.5,0);
 const signMat=new THREE.MeshBasicMaterial({map:placardTexture(topic+'島',accent.color),side:THREE.DoubleSide});
 mesh(root,new THREE.PlaneGeometry(1.89,.59),signMat,0,1.5,.067,false);
 const back=mesh(root,new THREE.PlaneGeometry(1.89,.59),signMat,0,1.5,-.067,false);back.rotation.y=Math.PI;
 const flag=mesh(root,new THREE.ConeGeometry(.31,.47,3),material(accent.hex),0,2.03,0);
 flag.rotation.z=Math.PI/2;root.rotation.y=-.2;
}
function makeStation(group,lesson,pickables,animated){
 const spot=LEARNING_LOCATIONS[lesson.id],topic=TOPICS[lesson.topic];
 const root=new THREE.Group();
 const origin=TOPIC_ISLANDS[lesson.topic];
 root.position.set(spot.x-origin.x,groundY,spot.z-origin.z);
 group.add(root);
 const accent=material(topic.hex);
 mesh(root,new THREE.CylinderGeometry(.81,.85,.16,10),material(0xf5e9d3),0,.05,0);
 mesh(root,new THREE.CylinderGeometry(.68,.72,.14,10),material(topic.hex),0,.18,0);
 const trim=mesh(root,new THREE.TorusGeometry(.665,.035,4,20),white,0,.265,0);
 trim.rotation.x=Math.PI/2;
 const kind=lesson.dimension;
 if(kind==='認知'){
   mesh(root,new THREE.CylinderGeometry(.42,.5,.94,6),cream,0,.75,0);
   mesh(root,new THREE.ConeGeometry(.72,.53,6),accent,0,1.35,0);
   const l=mesh(root,new THREE.BoxGeometry(.35,.43,.07),white,-.19,1.19,.42);l.rotation.y=-.32;
   const r=mesh(root,new THREE.BoxGeometry(.35,.43,.07),white,.19,1.19,.42);r.rotation.y=.32;
   mesh(root,new THREE.BoxGeometry(.045,.48,.09),wood,0,1.19,.44);
 }else if(kind==='情意'){
   mesh(root,new THREE.CylinderGeometry(.48,.53,.86,8),cream,0,.73,0);
   const dome=mesh(root,new THREE.SphereGeometry(.55,12,7,0,Math.PI*2,0,Math.PI/2),accent,0,1.14,0);
   dome.scale.y=.58;
   const heart=material(0xef93af);
   mesh(root,new THREE.SphereGeometry(.22,9,7),heart,-.17,1.39,.47);
   mesh(root,new THREE.SphereGeometry(.22,9,7),heart,.17,1.39,.47);
   const tip=mesh(root,new THREE.ConeGeometry(.34,.45,4),heart,0,1.22,.48);tip.rotation.z=Math.PI;
 }else{
   mesh(root,new THREE.CylinderGeometry(.38,.49,1.19,6),cream,0,.84,0);
   mesh(root,new THREE.CylinderGeometry(.55,.48,.18,6),accent,0,1.47,0);
   mesh(root,new THREE.ConeGeometry(.53,.5,6),material(new THREE.Color(topic.hex).multiplyScalar(.8)),0,1.8,0);
   mesh(root,new THREE.CylinderGeometry(.026,.026,.8,5),wood,.17,1.64,.29);
   const flag=mesh(root,new THREE.ConeGeometry(.27,.5,3),accent,.41,1.86,.29);flag.rotation.z=-Math.PI/2;
 }
 const beacon=mesh(root,new THREE.IcosahedronGeometry(.14,1),
    new THREE.MeshBasicMaterial({color:0xfff1c8,transparent:true,opacity:.9,depthWrite:false}),0,2.38,0,false);
 const halo=mesh(root,new THREE.TorusGeometry(.34,.024,4,32),
    new THREE.MeshBasicMaterial({color:topic.hex,transparent:true,opacity:.7,depthWrite:false,side:THREE.DoubleSide}),0,2.38,0,false);
 halo.rotation.x=Math.PI/2;
 const hitbox=mesh(root,new THREE.CylinderGeometry(.88,.9,2.7,8),
    new THREE.MeshBasicMaterial({visible:false,depthWrite:false}),0,1.33,0,false);
 hitbox.userData.lessonId=lesson.id;pickables.push(hitbox);
 animated.push({root,beacon,halo,spot,lesson});
}
function connectStations(group,topic,a,b,hex){
 const origin=TOPIC_ISLANDS[topic];
 const p=LEARNING_LOCATIONS[a],q=LEARNING_LOCATIONS[b];
 const dist=Math.hypot(q.x-p.x,q.z-p.z);
 const steps=Math.ceil(dist/.42);
 const color=material(0xdfd6bd),marked=material(hex);
 for(let i=1;i<steps;i++){
   const t=i/steps,x=p.x+(q.x-p.x)*t,z=p.z+(q.z-p.z)*t;
   const tile=mesh(group,new THREE.CylinderGeometry(.13,.145,.042,6),i%5===0?marked:color,x-origin.x,.69,z-origin.z,false);
   tile.rotation.y=i*.47;
 }
}
export async function setupLearningIsland({scene,camera,renderer,controls,quest}){
 const response=await fetch('./data/lessons.json',{cache:'no-cache'});
 if(!response.ok)throw Error('無法讀取教材清單 HTTP '+response.status);
 const payload=await response.json(),lessons=payload.lessons;
 if(!Array.isArray(lessons)||lessons.length!==9)throw Error('教材清單應有九個據點');
 const byId=Object.fromEntries(lessons.map(l=>[l.id,l]));
 const pickables=[],animated=[];
 const questStage=()=>quest?.getStage?.()??0;
 const unlockedTopic=topic=>isIslandUnlocked(topic,questStage());
 const unlockedLesson=id=>isTowerUnlocked(id,questStage());
 const cards=[];

 // Leave the original central island as an environmental hub and add
 // exactly three physical satellite landmasses for the nine youth lessons.
 const islands=buildSatelliteIslands(scene);
 lessons.forEach(l=>makeStation(islands[l.topic],l,pickables,animated));
 TOPIC_ORDER.forEach(t=>{
   const ids=lessons.filter(l=>l.topic===t).sort((a,b)=>a.id.localeCompare(b.id)).map(l=>l.id);
   connectStations(islands[t],t,ids[0],ids[1],TOPICS[t].hex);
   connectStations(islands[t],t,ids[1],ids[2],TOPICS[t].hex);
   districtSign(islands[t],t,0,-2.72);
 });

 const app=document.getElementById('app');
 const openDirectory=append(app,'button',{id:'openDirectory',className:'lesson-trail',type:'button','aria-label':'開啟青春探索教材地圖'},'▦ 四島探索地圖  9');
 const switcher=append(app,'nav',{className:'island-switcher','aria-label':'健康島分島導覽'});
 const overviewBtn=append(switcher,'button',{type:'button',className:'island-switch active','aria-pressed':'true'},'◈ 世界總覽');
 const islandBtns=new Map();
 for(const topic of TOPIC_ORDER){
   const btn=append(switcher,'button',{type:'button',className:'island-switch','aria-pressed':'false'},TOPICS[topic].icon+' '+topic+'島');
   btn.style.setProperty('--switch-accent',TOPICS[topic].color);
   islandBtns.set(topic,btn);
 }
 const islandLabels=new Map();
 for(const topic of TOPIC_ORDER){
   const node=append(app,'button',{type:'button',className:'satellite-marker','aria-label':'前往'+topic+'島'},TOPICS[topic].icon+' '+topic+'島');
   node.style.setProperty('--topic',TOPICS[topic].color);
   islandLabels.set(topic,node);
 }
 const scrim=append(app,'div',{id:'learnScrim',className:'learn-scrim',hidden:true});
 const panel=append(app,'aside',{id:'learnPanel',className:'learn-panel',hidden:true,role:'dialog','aria-modal':'true','aria-label':'教材資訊'});
 const panelClose=append(panel,'button',{className:'learn-close',type:'button','aria-label':'關閉教材資訊'},'×');
 const panelContent=append(panel,'div',{id:'learnPanelContent'});
 const backdrop=append(app,'div',{id:'learnBackdrop',className:'learn-backdrop',hidden:true});
 const directory=append(backdrop,'div',{className:'directory',role:'dialog','aria-modal':'true','aria-labelledby':'directoryTitle'});
 const dirClose=append(directory,'button',{className:'learn-close',type:'button','aria-label':'關閉教材地圖'},'×');
 append(directory,'div',{className:'eyebrow'},'THE LEARNING ARCHIPELAGO');
 append(directory,'h2',{id:'directoryTitle'},'青春探索地圖 · 9 個學習據點');
 const directoryDesc=append(directory,'p',{className:'directory-desc'},'完成導覽員的行前閱讀，才能讓不炫耀島升起。其餘島嶼與塔樓將依任務逐步開放。');
 const grid=append(directory,'div',{className:'directory-grid'});
 const viewer=append(app,'section',{id:'learnViewer',className:'learn-viewer',hidden:true,role:'dialog','aria-modal':'true','aria-label':'教材體驗視窗'});
 const viewerTop=append(viewer,'div',{className:'viewer-top'});
 const viewerTitle=append(viewerTop,'span',{className:'viewer-title'});
 const viewerExternal=append(viewerTop,'a',{className:'viewer-open',target:'_blank',rel:'noopener noreferrer'},'另開分頁 ↗');
 const viewerClose=append(viewerTop,'button',{className:'viewer-exit',type:'button','aria-label':'關閉教材，回到健康島'},'×');
 const iframe=append(viewer,'iframe',{id:'lessonFrame',title:'青春系列互動教材'});
 iframe.setAttribute('allowfullscreen','');
 append(viewer,'div',{className:'viewer-hint'},'教材由原始 GitHub Pages 網站提供。若無法嵌入顯示，請點選「另開分頁」。');
 const markers=new Map();
 const idToIcon={'認知':'📖','情意':'♥','技能':'⚑'};
 for(const lesson of lessons){
   const t=TOPICS[lesson.topic];
   const button=append(app,'button',{className:'island-marker',type:'button','aria-label':lesson.id+' '+lesson.topic+' '+lesson.dimension+' '+lesson.series});
   button.style.setProperty('--topic',t.color);
   append(button,'span',{className:'marker-dot'},lesson.id);
   const label=append(button,'span',{className:'marker-label'});
   append(label,'span',{className:'marker-name'},lesson.topic);
   append(label,'span',{className:'marker-tip'},lesson.dimension+' · '+DIMS[lesson.dimension].model);
   button.addEventListener('click',()=>select(lesson.id));
   markers.set(lesson.id,button);
 }
 for(const topic of TOPIC_ORDER){
   const t=TOPICS[topic];
   const col=append(grid,'section',{className:'district-column'});
   col.style.setProperty('--district-soft',t.soft);
   col.style.setProperty('--district-color',t.color);
   const head=append(col,'div',{className:'district-head'});
   append(head,'div',{className:'district-icon'},t.icon);
   const title=append(head,'div');
   append(title,'strong',{},topic);
   append(title,'small',{},'三個學習據點 · 獨立浮島');
   lessons.filter(l=>l.topic===topic).sort((a,b)=>a.id.localeCompare(b.id)).forEach(l=>{
     const card=append(col,'button',{className:'learning-card',type:'button'});
     append(card,'span',{className:'card-number'},l.id);
     const box=append(card,'span');
     append(box,'strong',{},l.series+' · '+l.dimension);
     const status=append(box,'small',{},l.format);
     cards.push({card,status,lesson:l});
     card.addEventListener('click',()=>{backdrop.hidden=true;select(l.id)});
   });
 }
 let selected=null,mode='overview',flight=null;
 const isMobile=()=>window.innerWidth<=680;
 const overviewPosition=()=>new THREE.Vector3(isMobile()?47:40,isMobile()?69:47,isMobile()?103:75);
 const focusedOffset=()=>new THREE.Vector3(isMobile()?12:9,isMobile()?20:13,isMobile()?22:19);
 function stopSpin(){
   controls.autoRotate=false;
   const b=document.getElementById('spinBtn');
   b.classList.remove('active');b.setAttribute('aria-pressed','false');
 }
 function moveTo(topic,instant=false){
   if(topic&&!unlockedTopic(topic)){quest?.open?.();return}
   mode=topic;
   stopSpin();
   const origin=topic?TOPIC_ISLANDS[topic]:{x:0,z:0};
   const target=new THREE.Vector3(origin.x,.38,origin.z);
   const destination=topic?target.clone().add(focusedOffset()):overviewPosition();
   flight={
     fromPos:camera.position.clone(),fromTarget:controls.target.clone(),
     toPos:destination,toTarget:target,t:0,duration:instant?0:.95
   };
   if(instant){camera.position.copy(destination);controls.target.copy(target);controls.update();flight=null}
   overviewBtn.classList.toggle('active',!topic);overviewBtn.setAttribute('aria-pressed',String(!topic));
   islandBtns.forEach((b,t)=>{
     b.classList.toggle('active',t===topic);
     b.setAttribute('aria-pressed',String(t===topic));
   });
 }
 function visit(topic){
   if(!unlockedTopic(topic)){quest?.open?.();return}
   closePanel();
   moveTo(topic);
 }
 function goOverview(instant=false){
   closePanel();
   moveTo(null,instant);
 }
 function select(id){
   const l=byId[id];if(!l)return;
   if(!unlockedLesson(id)){quest?.open?.();return}
   if(mode!==l.topic)moveTo(l.topic);
   selected=l;stopSpin();backdrop.hidden=true;
   const t=TOPICS[l.topic],d=DIMS[l.dimension];
   panelContent.replaceChildren();
   append(panelContent,'span',{className:'learn-kicker'},'HEALTH ISLAND / STATION '+l.id);
   append(panelContent,'h2',{},l.topic);
   append(panelContent,'p',{className:'learn-subtitle'},l.series+' · '+l.format);
   const hero=append(panelContent,'div',{className:'learn-hero'});
   hero.style.setProperty('--hero-color',t.color);hero.style.setProperty('--hero-soft',t.soft);
   append(hero,'span',{className:'learn-hero-glyph'},d.icon);
   const meta=append(panelContent,'div',{className:'learn-meta'});
   const m1=append(meta,'div');append(m1,'small',{},'學習面向');append(m1,'strong',{},l.dimension+'｜'+d.model);
   const m2=append(meta,'div');append(m2,'small',{},'教材編號');append(m2,'strong',{},l.id);
   const actions=append(panelContent,'div',{className:'learn-actions'});
   const launch=append(actions,'button',{className:'learn-button primary',type:'button'},'▶ 進入互動教材');
   const external=append(actions,'a',{className:'learn-button secondary',href:l.url,target:'_blank',rel:'noopener noreferrer'},'↗ 另開完整教材網頁');
   launch.addEventListener('click',()=>{
     viewerTitle.textContent=l.id+' · '+l.title+' · '+l.dimension;
     viewerExternal.href=l.url;
     iframe.src=l.url;viewer.hidden=false;viewerClose.focus();
   });
   panel.hidden=false;scrim.hidden=false;
   markers.forEach((b,key)=>b.classList.toggle('selected',key===id));
 }
 function closePanel(){panel.hidden=true;scrim.hidden=true;selected=null;markers.forEach(b=>b.classList.remove('selected'))}
 function closeDirectory(){backdrop.hidden=true;openDirectory.focus()}
 function closeViewer(){viewer.hidden=true;iframe.src='about:blank';panelContent.querySelector('.learn-button.primary')?.focus()}
 openDirectory.addEventListener('click',()=>{closePanel();backdrop.hidden=false;dirClose.focus()});
 overviewBtn.addEventListener('click',()=>goOverview());
 islandBtns.forEach((b,topic)=>b.addEventListener('click',()=>visit(topic)));
 islandLabels.forEach((b,topic)=>b.addEventListener('click',()=>visit(topic)));
 panelClose.addEventListener('click',closePanel);scrim.addEventListener('click',closePanel);
 dirClose.addEventListener('click',closeDirectory);
 backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeDirectory()});
 viewerClose.addEventListener('click',closeViewer);
 document.addEventListener('keydown',e=>{
   if(e.key!=='Escape')return;
   if(!viewer.hidden)closeViewer();
   else if(!backdrop.hidden)closeDirectory();
   else if(!panel.hidden)closePanel();
 });
 const canvas=renderer.domElement;
 let pointer=null;
 canvas.addEventListener('pointerdown',e=>{pointer={x:e.clientX,y:e.clientY}});
 const raycaster=new THREE.Raycaster(),mouse=new THREE.Vector2();
 canvas.addEventListener('pointerup',e=>{
   if(!pointer)return;
   const distance=Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y);pointer=null;
   if(distance>9||!panel.hidden||!backdrop.hidden||!viewer.hidden)return;
   const rect=canvas.getBoundingClientRect();
   mouse.set((e.clientX-rect.left)/rect.width*2-1, -((e.clientY-rect.top)/rect.height*2-1));
   raycaster.setFromCamera(mouse,camera);
   const allowed=pickables.filter(p=>unlockedLesson(p.userData.lessonId));
   const hit=raycaster.intersectObjects(allowed,false)[0];
   if(hit){select(hit.object.userData.lessonId);return;}
   // Clicking on a satellite's terrain focuses that island as well.
   const landMeshes=TOPIC_ORDER.filter(t=>unlockedTopic(t)).map(t=>islands[t].children[0]);
   const landHit=raycaster.intersectObjects(landMeshes,false)[0];
   if(landHit){
     const topic=TOPIC_ORDER.find(t=>islands[t].children[0]===landHit.object);
     if(topic)visit(topic);
   }
 });
 // A physical island is initially submerged. Only a completed reading quiz
 // can raise the first island; each password raises the next tower.
 const v=new THREE.Vector3(),forward=new THREE.Vector3();
 const risingIslands=new Set();
 const risingTowers=new Set();
 function syncQuest(stage,previousStage){
   const initial=stage===previousStage;
   // Maintain independent rise states so the second island cannot cancel
   // the animation of an existing island or previously unlocked tower.
   if(initial||stage===0)risingIslands.clear();
   for(const topic of TOPIC_ORDER){
     const root=islands[topic];
     const allowed=isIslandUnlocked(topic,stage);
     const wasAllowed=isIslandUnlocked(topic,previousStage);
     root.userData.bridge.visible=allowed;
     if(!allowed){
       root.visible=false;root.position.y=-11;risingIslands.delete(topic);
     }else if(initial){
       root.visible=true;root.position.y=0;risingIslands.delete(topic);
     }else if(wasAllowed){
       root.visible=true;
     }else{
       root.visible=true;root.position.y=-11;risingIslands.add(topic);
     }
     const b=islandBtns.get(topic);
     b.disabled=!allowed;b.classList.toggle('is-locked',!allowed);
     b.setAttribute('aria-label',allowed?'前往'+topic+'島':topic+'島尚未解鎖');
   }
   for(const entry of animated){
     const id=entry.lesson.id;
     const allowed=isTowerUnlocked(id,stage);
     const previously=isTowerUnlocked(id,previousStage);
     if(!allowed){
       entry.root.visible=false;entry.root.position.y=groundY;risingTowers.delete(id);
     }else if(initial){
       entry.root.visible=true;entry.root.position.y=groundY;risingTowers.delete(id);
     }else if(previously){
       entry.root.visible=true;
     }else{
       entry.root.visible=true;entry.root.position.y=groundY-2.75;risingTowers.add(id);
     }
   }
   for(const row of cards){
     const enabled=isTowerUnlocked(row.lesson.id,stage);
     row.card.disabled=!enabled;row.card.classList.toggle('is-locked',!enabled);
     row.card.setAttribute('aria-label',enabled?row.lesson.title:row.lesson.title+'，尚未解鎖');
     row.status.textContent=row.lesson.format+(enabled?' · 已開放':' · 🔒 未開放');
   }
   const explanations=[
     '先和導覽小人完成行前閱讀與兩題檢核，喚醒不炫耀島。',
     '不炫耀島已升起。完成 1-2 認知塔的遊戲並輸入密碼，解鎖 2-2。',
     '2-2 情意塔已開放。完成徽章提示語活動並輸入密碼，解鎖 3-2。',
     '3-2 技能塔已開放。取得成功通關密碼，即可喚醒不染色島。',
     '不炫耀島三塔通關！不染色島與 1-1 認知塔已開放。'
   ];
   directoryDesc.textContent=explanations[Math.min(stage,4)];
   if(mode!=='overview'&&!unlockedTopic(mode))goOverview(true);
 }
 function update(dt,elapsed){
   for(const topic of [...risingIslands]){
     const root=islands[topic];
     root.position.y=THREE.MathUtils.damp(root.position.y,0,1.45,dt);
     if(Math.abs(root.position.y)<.025){
       root.position.y=0;risingIslands.delete(topic);
     }
   }
   for(const id of [...risingTowers]){
     const tower=animated.find(item=>item.lesson.id===id);
     if(!tower){risingTowers.delete(id);continue}
     tower.root.position.y=THREE.MathUtils.damp(tower.root.position.y,groundY,2,dt);
     if(Math.abs(tower.root.position.y-groundY)<.025){
       tower.root.position.y=groundY;risingTowers.delete(id);
     }
   }
   if(flight){
     flight.t=Math.min(1,flight.t+dt/flight.duration);
     const k=1-Math.pow(1-flight.t,3);
     camera.position.lerpVectors(flight.fromPos,flight.toPos,k);
     controls.target.lerpVectors(flight.fromTarget,flight.toTarget,k);
     controls.update();
     if(flight.t===1)flight=null;
   }
   camera.getWorldDirection(forward);
   for(const [topic,node] of islandLabels){
     if(mode!=='overview'||!unlockedTopic(topic)){node.classList.add('hidden');continue;}
     const origin=TOPIC_ISLANDS[topic];
     v.set(origin.x,4.1,origin.z).project(camera);
     const x=(v.x*.5+.5)*canvas.clientWidth;
     const y=(-v.y*.5+.5)*canvas.clientHeight;
     if(x<30||x>canvas.clientWidth-30||y<60||y>canvas.clientHeight-80||v.z>1||v.z< -1){
       node.classList.add('hidden');
     }else{
       node.classList.remove('hidden');
       node.style.left=x+'px';node.style.top=y+'px';
     }
   }
   for(const a of animated){
     a.beacon.position.y=2.38+.09*Math.sin(elapsed*1.8);
     a.halo.position.y=a.beacon.position.y;
     a.halo.rotation.z+=dt*.5;
     a.halo.material.opacity=(selected?.id===a.lesson.id) ? .95 : .52+.17*Math.sin(elapsed*1.5);
     const b=markers.get(a.lesson.id);
     if(mode!==a.lesson.topic||!unlockedLesson(a.lesson.id)){b.classList.add('hidden');continue;}
     v.set(a.spot.x,3.05,a.spot.z);
     if(v.clone().sub(camera.position).dot(forward)<0){b.classList.add('hidden');continue}
     v.project(camera);
     const x=(v.x*.5+.5)*canvas.clientWidth;
     const y=(-v.y*.5+.5)*canvas.clientHeight;
     if(x<24||x>canvas.clientWidth-24||y<80||y>canvas.clientHeight-68||v.z>1)b.classList.add('hidden');
     else{b.classList.remove('hidden');b.style.left=x+'px';b.style.top=y+'px'}
   }
 }
 if(quest){
   quest.setNavigator({goTo:visit,goOverview,openLesson:select});
   quest.onChange(syncQuest);
 }else{
   syncQuest(0,0);
 }
 return {update,lessons,isViewerOpen:()=>!viewer.hidden,goOverview};
}
