import * as THREE from 'three';

// Health Island quest prototype: all progress is local to this browser.
// No user accounts, external gradebooks, or remote verification are implied.
const KEY='healthIslandQuestPrototypeV1';
const NPC={x:2.72,z:-2.12};
export const GUIDE_POSITION=Object.freeze(NPC);
const mat=(color,opts={})=>new THREE.MeshStandardMaterial({color,flatShading:true,roughness:.82,...opts});
const face=mat(0xffd2a7),hair=mat(0x493c39),coat=mat(0x38a78d),darkCoat=mat(0x27786c),
    pants=mat(0x486778),shoe=mat(0x344c54),cream=mat(0xf5edd4),gold=mat(0xf4c467);
function mesh(group,geo,material,x=0,y=0,z=0){
 const o=new THREE.Mesh(geo,material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;group.add(o);return o;
}
function model(island){
 const root=new THREE.Group();
 root.position.set(NPC.x,.64,NPC.z);root.name='健康島導覽員';island.add(root);
 mesh(root,new THREE.CylinderGeometry(.70,.76,.17,10),mat(0xe7e3bf),0,.08,0);
 mesh(root,new THREE.CylinderGeometry(.61,.67,.08,10),darkCoat,0,.19,0);
 for(const x of [-.19,.19]){
   mesh(root,new THREE.CylinderGeometry(.105,.12,.60,6),pants,x,.62,0);
   mesh(root,new THREE.BoxGeometry(.25,.13,.37),shoe,x,.30,.13);
 }
 const torso=mesh(root,new THREE.CylinderGeometry(.34,.30,.78,7),coat,0,1.25,0);
 torso.rotation.y=.14;
 mesh(root,new THREE.BoxGeometry(.14,.41,.065),cream,0,1.26,.315);
 mesh(root,new THREE.IcosahedronGeometry(.33,1),face,0,1.94,.015);
 // hair cap and front fringe
 mesh(root,new THREE.SphereGeometry(.345,10,6,0,Math.PI*2,0,Math.PI/2),hair,0,2.115,.0);
 mesh(root,new THREE.BoxGeometry(.21,.11,.105),hair,-.13,2.07,.27);
 for(const x of [-.12,.12])mesh(root,new THREE.SphereGeometry(.031,6,4),hair,x,1.96,.325);
 mesh(root,new THREE.BoxGeometry(.11,.028,.016),mat(0xa8665b),0,1.825,.34);
 // hat brim + compass feather
 const brim=mesh(root,new THREE.CylinderGeometry(.44,.46,.07,12),cream,0,2.225,0);
 mesh(root,new THREE.CylinderGeometry(.31,.35,.27,10),darkCoat,0,2.38,0);
 mesh(root,new THREE.CylinderGeometry(.32,.32,.045,10),gold,0,2.43,0);
 const plume=mesh(root,new THREE.ConeGeometry(.095,.32,5),gold,.21,2.65,0);
 plume.rotation.z=-.3;
 const handRight=new THREE.Group();handRight.position.set(.34,1.50,0);root.add(handRight);
 const arm=mesh(handRight,new THREE.CylinderGeometry(.085,.105,.53,6),coat,.12,-.26,0);
 arm.rotation.z=.32;
 mesh(handRight,new THREE.SphereGeometry(.10,8,6),face,.25,-.52,0);
 const left=mesh(root,new THREE.CylinderGeometry(.088,.105,.55,6),coat,-.42,1.24,0);
 left.rotation.z=-.25;
 mesh(root,new THREE.SphereGeometry(.10,8,6),face,-.49,.99,0);
 const badge=mesh(root,new THREE.IcosahedronGeometry(.11,0),gold,.18,1.46,.295);
 // subtle base ring and light
 const ring=mesh(root,new THREE.TorusGeometry(.62,.025,5,38),gold,0,.22,0);
 ring.rotation.x=Math.PI/2;
 const light=new THREE.PointLight(0xfee2a3,.44,4);light.position.set(0,2.3,.5);root.add(light);
 // Invisible, generous click target independent of detailed mesh geometry.
 const hit=mesh(root,new THREE.CylinderGeometry(.57,.62,2.7,10),
   new THREE.MeshBasicMaterial({visible:false,depthWrite:false}),0,1.45,0);
 return {root,handRight,ring,hit};
}
function storedStage(){
 try {
   const value=JSON.parse(localStorage.getItem(KEY)||'null');
   return Number.isInteger(value?.stage)?Math.min(2,Math.max(0,value.stage)):0;
 }catch{return 0;}
}
function save(stage){
 try{localStorage.setItem(KEY,JSON.stringify({version:1,stage,updatedAt:new Date().toISOString()}))}
 catch(e){console.warn('Progress storage unavailable',e)}
}
const readText=[
  {title:'學習不是比誰更厲害',body:'當同學比較感情或親密經驗時，成熟不是「我比你更有經驗」，而是能認識自己的感受、尊重每個人的界線，不因同學的話勉強做決定。'},
  {title:'三座塔，三種能力',body:'認知塔幫你辨識資訊與想法；情意塔讓你表達重視的價值；技能塔讓你在真實情境中練習選擇與回應。每一座塔都會有不同的挑戰。'},
  {title:'健康島的探索規則',body:'先完成行前閱讀與小檢核，喚醒不炫耀島。接著進入 1-2 青春補給，完成遊戲取得青春密碼。回到導覽員這裡輸入密碼，才會解鎖 2-2 情意塔。'}
];
function dom(tag,attrs={},text){
 const n=document.createElement(tag);
 Object.entries(attrs).forEach(([k,v])=>{
   if(k==='className')n.className=v;
   else if(k==='hidden')n.hidden=!!v;
   else if(k==='dataset')Object.assign(n.dataset,v);
   else n.setAttribute(k,String(v));
 });
 if(text!==undefined)n.textContent=text;
 return n;
}
export function createGuide({island,camera,renderer}){
 const sceneModel=model(island),app=document.getElementById('app');
 let stage=storedStage(),view='home',listeners=[],navigation=null;
 let bannerTimer=null,openBefore=null,down=null;
 const shortcut=dom('button',{className:'quest-shortcut',type:'button','aria-label':'開啟導覽員的闖關任務'});
 shortcut.id='questShortcut';app.appendChild(shortcut);
 const marker=dom('button',{className:'guide-world-marker',type:'button','aria-label':'與健康島導覽員對話'});
 marker.innerHTML='<span class="guide-marker-avatar">🧭</span><span><strong>導覽小人</strong><small>點我查看闖關任務</small></span>';
 app.appendChild(marker);
 const overlay=dom('div',{className:'guide-overlay',hidden:true});
 overlay.id='guideOverlay';
 const dialog=dom('section',{className:'guide-dialog',role:'dialog','aria-modal':'true','aria-labelledby':'guideTitle'});
 overlay.appendChild(dialog);app.appendChild(overlay);
 const banner=dom('div',{className:'quest-banner',hidden:true,role:'status','aria-live':'polite'});
 app.appendChild(banner);
 const raycaster=new THREE.Raycaster(),mouse=new THREE.Vector2(),canvas=renderer.domElement;
 const projected=new THREE.Vector3();
 function getStage(){return stage}
 function notify(prev){
   save(stage);updateShortcut();
   for(const fn of listeners)fn(stage,prev);
 }
 function setStage(next){
   next=Math.min(2,Math.max(0,next));
   if(next===stage)return;
   const prev=stage;stage=next;
   notify(prev);
   if(stage===1)announce('不炫耀島正在升起！第一座認知塔已開放');
   if(stage===2)announce('密碼正確！2-2 情意塔已解鎖');
 }
 function onChange(fn){
   listeners.push(fn);
   fn(stage,stage);
   return ()=>{listeners=listeners.filter(x=>x!==fn)};
 }
 function setNavigator(nav){navigation=nav}
 function updateShortcut(){
   const text=stage===0?'閱讀任務':stage===1?'認知塔 1-2':'情意塔 2-2';
   shortcut.textContent='🧭 '+text+' · '+stage+'/2';
 }
 function announce(text){
   clearTimeout(bannerTimer);
   banner.textContent='✦ '+text;banner.hidden=false;
   bannerTimer=setTimeout(()=>banner.hidden=true,4700);
 }
 function goHome(){view='home';render()}
 function open(page='home'){
   openBefore=document.activeElement;
   view=page;overlay.hidden=false;render();
   dialog.querySelector('button,[tabindex],input')?.focus();
 }
 function close(){
   overlay.hidden=true;
   const restore=openBefore;openBefore=null;
   if(restore && restore.isConnected && typeof restore.focus==='function')restore.focus();
   else shortcut.focus();
 }
 function actionButton(label,id,kind='primary'){
   return '<button type="button" class="guide-btn '+kind+'" data-action="'+id+'">'+label+'</button>';
 }
 function render(){
   dialog.replaceChildren();
   const exit=dom('button',{className:'guide-close',type:'button','aria-label':'關閉導覽員視窗'},'×');
   exit.addEventListener('click',close);
   dialog.appendChild(exit);
   const top=dom('div',{className:'guide-header'});
   top.innerHTML='<span class="guide-portrait">🧭</span><div><small>HEALTH ISLAND · YOUR GUIDE</small><h2 id="guideTitle">健康島導覽員</h2><p>跟著我，一步一步讓世界甦醒！</p></div>';
   dialog.appendChild(top);
   const content=dom('div',{className:'guide-body'});
   dialog.appendChild(content);
   if(view==='reading'){
     content.innerHTML='<div class="guide-step">序章 / 行前閱讀（示範教材）</div>'+
       '<p class="guide-p">以下是用來測試闖關流程的暫定閱讀內容，不是正式教材區的課程。</p>'+
       readText.map((a,i)=>'<article class="guide-reading-item"><span>0'+(i+1)+'</span><div><h3>'+a.title+'</h3><p>'+a.body+'</p></div></article>').join('')+
       '<div class="guide-actions">'+actionButton('我已閱讀，開始檢核','quiz')+actionButton('返回導覽','home','quiet')+'</div>';
   }else if(view==='quiz'){
     content.innerHTML='<div class="guide-step">行前檢核 / 2 題</div>'+
       '<p class="guide-p">閱讀後請回答兩個問題，答對才能喚醒不炫耀島。</p>'+
       '<form id="guideQuiz" class="guide-quiz">'+
       '<fieldset><legend>1. 當同學用親密經驗互相比較，最合適的態度是？</legend>'+
       '<label><input type="radio" name="q1" value="0"> 跟著比較，避免被別人看不起</label>'+
       '<label><input type="radio" name="q1" value="1"> 尊重界線，不用經驗多少判斷成熟</label>'+
       '<label><input type="radio" name="q1" value="2"> 嘲笑不願參與比較的人</label></fieldset>'+
       '<fieldset><legend>2. 完成 1-2 認知塔的遊戲後，應該怎麼解鎖下一座塔？</legend>'+
       '<label><input type="radio" name="q2" value="0"> 重新整理網頁，等它自己出現</label>'+
       '<label><input type="radio" name="q2" value="1"> 直接跳到不迷路島</label>'+
       '<label><input type="radio" name="q2" value="2"> 找到青春密碼，回導覽員輸入</label></fieldset>'+
       '<div id="quizFeedback" class="guide-feedback" role="status" aria-live="polite"></div>'+
       '<div class="guide-actions"><button type="submit" class="guide-btn primary">檢查答案，喚醒島嶼</button>'+
       actionButton('返回閱讀','reading','quiet')+'</div></form>';
     content.querySelector('#guideQuiz').addEventListener('submit',e=>{
       e.preventDefault();
       const form=new FormData(e.currentTarget),feedback=content.querySelector('#quizFeedback');
       if(!form.has('q1')||!form.has('q2')){
         feedback.textContent='請先完成兩題，再進行檢核。';return;
       }
       if(form.get('q1')!=='1'||form.get('q2')!=='2'){
         feedback.textContent='尚有答案需要調整。可以返回閱讀，再思考「尊重界線」和「密碼解鎖」的意義。';
         return;
       }
       // Reveal the world before showing another dialogue so the rise can be seen.
       setStage(1);close();
       navigation?.goOverview?.();
       // Players can inspect the rising island without an unexpected modal.
     });
   }else if(view==='raised'){
     content.innerHTML='<div class="guide-success-icon">✦</div>'+
       '<h3 class="guide-feature-title">不炫耀島，升起！</h3>'+
       '<p class="guide-p">閱讀檢核已完成。前往不炫耀島，你會看到第一座「1-2 認知塔」。完成那裡的原始互動遊戲，取得青春密碼後，再回來找我。</p>'+
       '<div class="guide-actions">'+actionButton('前往不炫耀島','visit')+
       actionButton('開始 1-2 認知練習','lesson12','secondary')+'</div>';
   }else if(view==='password'){
     content.innerHTML='<div class="guide-step">解鎖下一座塔 / 1-2 → 2-2</div>'+
       '<p class="guide-p">請輸入完成「1-2 青春補給－不炫耀」後取得的四位數青春密碼。</p>'+
       '<form id="passwordForm" class="guide-code-form">'+
       '<label for="questCode">青春密碼</label><input id="questCode" name="code" type="text" inputmode="numeric" maxlength="8" autocomplete="off" placeholder="輸入四位數密碼" required>'+
       '<div id="codeFeedback" class="guide-feedback" role="status" aria-live="polite"></div>'+
       '<div class="guide-actions"><button class="guide-btn primary" type="submit">驗證並解鎖 2-2</button>'+
       actionButton('返回任務','home','quiet')+'</div></form>';
     content.querySelector('#passwordForm').addEventListener('submit',e=>{
       e.preventDefault();
       const code=content.querySelector('#questCode').value.trim().replace(/[^\d]/g,'');
       if(code!=='2499'){
         content.querySelector('#codeFeedback').textContent='密碼不正確。請先完成 1-2 遊戲，在通關畫面找尋青春密碼。';
         return;
       }
       // The new tower has a rising animation; don't cover it with the dialog.
       setStage(2);close();
       navigation?.goTo?.('不炫耀');
       // Keep the newly raised second tower unobstructed.
     });
   }else if(view==='unlocked'){
     content.innerHTML='<div class="guide-success-icon">✧</div>'+
       '<h3 class="guide-feature-title">第二座塔已出現！</h3>'+
       '<p class="guide-p">2-2 青春心語的情意塔已經升起。你可以進入這座塔體驗徽章提示語產生器。第三座技能塔與下一座主題島，會在後續版本接上。</p>'+
       '<div class="guide-actions">'+actionButton('前往 2-2 情意塔','lesson22')+
       actionButton('返回島嶼','close','quiet')+'</div>';
   }else{
     const next=stage===0?'請先閱讀行前教材並完成兩題檢核。':'';
     content.innerHTML='<div class="guide-step">目前任務 · '+(stage===0?'行前準備':stage===1?'第一座塔':'第二座塔')+'</div>'+
       '<p class="guide-p">'+(stage===0?
       '歡迎來到健康島！現在只有中央主島。閱讀序章並完成檢核後，不炫耀島才會從海面升起。':
       stage===1?
       '不炫耀島已開放。先進入 1-2 認知塔，完成原本的互動遊戲，取得青春密碼。回來輸入正確密碼，情意塔就會出現。':
       '你已經成功解鎖 2-2 情意塔！可進入原本的徽章提示語教材。下一階段的技能塔與後續島嶼仍在規劃中。')+'</p>'+
       '<div class="guide-quest-map">'+
       '<div class="guide-quest-row done">◉ 中央主島 · 導覽員</div>'+
       '<div class="guide-quest-row '+(stage>=1?'done':'locked')+'">'+(stage>=1?'✓':'🔒')+' 不炫耀島 · 1-2 認知塔</div>'+
       '<div class="guide-quest-row '+(stage>=2?'done':'locked')+'">'+(stage>=2?'✓':'🔒')+' 不炫耀島 · 2-2 情意塔</div>'+
       '<div class="guide-quest-row locked">🔒 3-2 技能塔與下一座島（未開放）</div>'+
       '</div>'+
       '<div class="guide-actions">'+
       (stage===0?actionButton('閱讀行前教材','reading'):
       stage===1?actionButton('前往 1-2 認知塔','lesson12')+actionButton('輸入通關密碼','password','secondary'):
       actionButton('前往 2-2 情意塔','lesson22'))+
       actionButton('關閉導覽','close','quiet')+
       '<button class="guide-reset" type="button" data-action="reset">↻ 重設本機闖關進度（測試用）</button></div>';
   }
   dialog.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',e=>{
     const action=e.currentTarget.dataset.action;
     if(action==='home')goHome();
     else if(action==='reading'||action==='quiz'||action==='password'){view=action;render()}
     else if(action==='close')close();
     else if(action==='visit'){close();navigation?.goTo?.('不炫耀')}
     else if(action==='lesson12'){close();navigation?.openLesson?.('1-2')}
     else if(action==='lesson22'){close();navigation?.openLesson?.('2-2')}
     else if(action==='reset'){
       if(!window.confirm('確定要清除這個瀏覽器的闖關進度，讓不炫耀島重新沉入海面嗎？'))return;
       setStage(0);navigation?.goOverview?.();goHome();
     }
   }));
 }
 function update(dt,elapsed){
   sceneModel.handRight.rotation.z=-.22+Math.sin(elapsed*2.15)*.36;
   sceneModel.root.rotation.y=.045*Math.sin(elapsed*.9);
   sceneModel.ring.material.emissiveIntensity=.1+.08*Math.sin(elapsed*2);
   projected.set(NPC.x,3.59,NPC.z).project(camera);
   const x=(projected.x*.5+.5)*canvas.clientWidth;
   const y=(-projected.y*.5+.5)*canvas.clientHeight;
   if(projected.z< -1||projected.z>1||x<30||x>canvas.clientWidth-30||y<60||y>canvas.clientHeight-70){
     marker.classList.add('hidden');
   }else{
     marker.classList.remove('hidden');marker.style.left=x+'px';marker.style.top=y+'px';
   }
 }
 shortcut.addEventListener('click',()=>open());
 marker.addEventListener('click',()=>open());
 overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden){e.preventDefault();e.stopImmediatePropagation();close()}},true);
 canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY}});
 canvas.addEventListener('pointerup',e=>{
   if(!down)return;
   const dist=Math.hypot(e.clientX-down.x,e.clientY-down.y);down=null;
   if(dist>9||!overlay.hidden)return;
   const box=canvas.getBoundingClientRect();
   mouse.x=((e.clientX-box.left)/box.width)*2-1;
   mouse.y=-((e.clientY-box.top)/box.height)*2+1;
   raycaster.setFromCamera(mouse,camera);
   if(raycaster.intersectObject(sceneModel.hit,false).length)open();
 });
 updateShortcut();
 try {
   if(stage===0&&!sessionStorage.getItem('healthIslandGuideWelcomeV1')){
     sessionStorage.setItem('healthIslandGuideWelcomeV1','1');
     setTimeout(()=>{if(overlay.hidden)open()},900);
   }
 }catch{}
 return {getStage,onChange,setNavigator,update,open};
}