import * as THREE from 'three';
import {MAX_STAGE,PASSCODE_GATES,verifyActivityCode} from './quest-rules.js?v=0.6.0';

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
 try{
   const saved=JSON.parse(localStorage.getItem(KEY)||'null');
   return Number.isInteger(saved?.stage)?Math.min(MAX_STAGE,Math.max(0,saved.stage)):0;
 }catch{return 0}
}
function persist(stage){
 try{localStorage.setItem(KEY,JSON.stringify({version:2,stage,updatedAt:new Date().toISOString()}))}
 catch(err){console.warn('Cannot save quest progress locally',err)}
}
const READING=[
 {title:'學習不必比較高低',body:'親密關係的成熟，不是用經驗多少來競爭。面對同儕的比較與起鬨，我們可以獨立思考，也應尊重自己與他人的界線。'},
 {title:'從認知、情意到技能',body:'先透過「青春補給」學會辨識觀念，再透過「青春心語 Yes」創作倡議徽章，最後在「青春練功」的情境裡練習做決定與表達立場。'},
 {title:'讓島嶼與塔樓甦醒',body:'完成行前檢核，第一座不炫耀島就會升起。完成每座塔的原始教材、找到通關密碼，再返回導覽員輸入，才能逐步解鎖下一座塔與新的主題島。'}
];
const STAGE_HINTS=[
 '歡迎來到健康島！請先閱讀序章並完成兩題檢核，喚醒不炫耀島。',
 '不炫耀島已經升起。先挑戰 1-2「青春補給」，完成遊戲取得青春密碼，再回來輸入。',
 '你已解鎖 2-2「青春心語 Yes」。完成徽章提示語的製作流程，取得通關密碼後，就能喚醒技能塔。',
 '你已解鎖 3-2「青春練功」。請嘗試不同的故事路徑，只有成功通關才會顯示最後的青春密碼。',
 '恭喜完成不炫耀島的認知、情意與技能三項挑戰！第二座「不染色島」已升起，1-1 認知塔也已開放。'
];
const STAGE_TITLES=['行前閱讀','1-2 認知塔','2-2 情意塔','3-2 技能塔','不染色島'];
function dom(tag,attrs={},text){
 const n=document.createElement(tag);
 Object.entries(attrs).forEach(([key,value])=>{
   if(key==='className')n.className=value;
   else if(key==='hidden')n.hidden=Boolean(value);
   else if(key==='dataset')Object.assign(n.dataset,value);
   else n.setAttribute(key,String(value));
 });
 if(text!==undefined)n.textContent=text;
 return n;
}
function action(label,id,variant='primary'){
 return '<button type="button" class="guide-btn '+variant+'" data-action="'+id+'">'+label+'</button>';
}
function questRow(label,unlockAt,finishAt,stage){
 const status=stage>=finishAt?'done':stage>=unlockAt?'current':'locked';
 const symbol=status==='done'?'✓':status==='current'?'➜':'🔒';
 const suffix=status==='done'?'已完成':status==='current'?'進行中':'未開放';
 return '<div class="guide-quest-row '+status+'">'+symbol+' '+label+' <span class="guide-row-state">'+suffix+'</span></div>';
}
export function createGuide({island,camera,renderer}){
 const sceneModel=model(island),app=document.getElementById('app');
 let stage=storedStage(),view='home',listeners=[],navigation=null,down=null,priorFocus=null;
 let bannerTimeout=null;
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
 const canvas=renderer.domElement;
 const raycaster=new THREE.Raycaster(),mouse=new THREE.Vector2(),projected=new THREE.Vector3();

 function getStage(){return stage}
 function onChange(callback){
   listeners.push(callback);callback(stage,stage);
   return ()=>{listeners=listeners.filter(fn=>fn!==callback)};
 }
 function setNavigator(nav){navigation=nav}
 function shortcutText(){
   shortcut.textContent='🧭 '+STAGE_TITLES[stage]+' · '+stage+'/'+MAX_STAGE;
 }
 function announce(message){
   clearTimeout(bannerTimeout);
   banner.textContent='✦ '+message;banner.hidden=false;
   bannerTimeout=setTimeout(()=>{banner.hidden=true},4700);
 }
 function setStage(next){
   const bounded=Math.max(0,Math.min(MAX_STAGE,next));
   if(stage===bounded)return;
   const previous=stage;stage=bounded;
   persist(stage);shortcutText();
   for(const callback of listeners)callback(stage,previous);
   if(stage===1)announce('不炫耀島升起！1-2 認知塔已開放');
   if(stage===2)announce('密碼正確！2-2 情意塔升起');
   if(stage===3)announce('密碼正確！3-2 技能塔升起');
   if(stage===4)announce('三座塔皆完成！不染色島與 1-1 認知塔升起');
 }
 function open(page='home'){
   if(overlay.hidden)priorFocus=document.activeElement;
   view=page;overlay.hidden=false;render();
   dialog.querySelector('button,[tabindex],input')?.focus();
 }
 function close(){
   if(overlay.hidden)return;
   overlay.hidden=true;
   const old=priorFocus;priorFocus=null;
   if(old?.isConnected && typeof old.focus==='function')old.focus();
   else shortcut.focus();
 }
 function nextAfterSuccess(previousStage){
   // Close the dialog before moving the camera so users can observe the 3D rise.
   close();
   if(previousStage===0||previousStage===3)navigation?.goOverview?.();
   else navigation?.goTo?.('不炫耀');
 }
 function applyCode(){
   const config=PASSCODE_GATES[stage];
   if(!config)return;
   const field=dialog.querySelector('#questCode');
   const feedback=dialog.querySelector('#codeFeedback');
   const code=field?.value??'';
   if(!verifyActivityCode(stage,code)){
     feedback.textContent='密碼不正確。請先完成 '+config.lessonId+' 原始教材，從通關畫面取得正確密碼。';
     field?.focus();
     return;
   }
   const previous=stage;
   setStage(config.nextStage);
   nextAfterSuccess(previous);
 }
 function homeHTML(){
   const rows=[
     questRow('中央主島 · 行前閱讀與檢核',0,1,stage),
     questRow('不炫耀島 · 1-2 認知塔',1,2,stage),
     questRow('不炫耀島 · 2-2 情意塔',2,3,stage),
     questRow('不炫耀島 · 3-2 技能塔',3,4,stage),
     questRow('不染色島 · 1-1 認知塔',4,5,stage)
   ].join('');
   let buttons='';
   if(stage===0)buttons=action('閱讀行前教材','reading');
   if(stage===1)buttons=action('前往 1-2 認知塔','lesson12')+action('輸入 1-2 青春密碼','password','secondary');
   if(stage===2)buttons=action('前往 2-2 情意塔','lesson22')+action('輸入 2-2 通關密碼','password','secondary');
   if(stage===3)buttons=action('前往 3-2 技能塔','lesson32')+action('輸入 3-2 成功密碼','password','secondary');
   if(stage===4)buttons=action('探索不染色島','visitClear')+action('前往 1-1 認知塔','lesson11','secondary');
   return '<div class="guide-step">目前任務 / '+STAGE_TITLES[stage]+'</div>'+
     '<p class="guide-p">'+STAGE_HINTS[stage]+'</p>'+
     '<div class="guide-quest-map">'+rows+'</div>'+
     '<div class="guide-actions">'+buttons+action('關閉導覽','close','quiet')+
     '<button class="guide-reset" type="button" data-action="reset">↻ 重設本機闖關進度（測試用）</button></div>';
 }
 function render(){
   dialog.replaceChildren();
   const exit=dom('button',{className:'guide-close',type:'button','aria-label':'關閉導覽員視窗'},'×');
   exit.addEventListener('click',close);
   dialog.appendChild(exit);
   const header=dom('div',{className:'guide-header'});
   header.innerHTML='<span class="guide-portrait">🧭</span><div><small>HEALTH ISLAND · YOUR GUIDE</small><h2 id="guideTitle">健康島導覽員</h2><p>完成任務，一步一步讓世界甦醒！</p></div>';
   dialog.appendChild(header);
   const content=dom('div',{className:'guide-body'});dialog.appendChild(content);
   if(view==='reading'){
     content.innerHTML='<div class="guide-step">序章 / 行前閱讀（流程示範）</div>'+
       '<p class="guide-p">這是測試闖關流程的暫定教材，正式教材區尚未連結。</p>'+
       READING.map((item,i)=>'<article class="guide-reading-item"><span>0'+(i+1)+'</span><div><h3>'+item.title+'</h3><p>'+item.body+'</p></div></article>').join('')+
       '<div class="guide-actions">'+action('我已閱讀，開始檢核','quiz')+action('返回導覽','home','quiet')+'</div>';
   }else if(view==='quiz'){
     content.innerHTML='<div class="guide-step">行前檢核 / 2 題</div>'+
       '<p class="guide-p">請回答兩個問題，全部答對後喚醒第一座主題島。</p>'+
       '<form id="guideQuiz" class="guide-quiz">'+
       '<fieldset><legend>1. 當同學比較親密經驗時，最適當的態度是？</legend>'+
       '<label><input type="radio" name="q1" value="0"> 跟著比較，避免被看不起</label>'+
       '<label><input type="radio" name="q1" value="1"> 尊重界線，不必用經驗多少評斷成熟</label>'+
       '<label><input type="radio" name="q1" value="2"> 嘲笑不願意參與比較的人</label></fieldset>'+
       '<fieldset><legend>2. 完成塔樓的互動教材後，應如何解鎖下一關？</legend>'+
       '<label><input type="radio" name="q2" value="0"> 重新整理，等待塔樓出現</label>'+
       '<label><input type="radio" name="q2" value="1"> 跳過前面的塔樓直接前往下一島</label>'+
       '<label><input type="radio" name="q2" value="2"> 找到通關密碼，回到導覽員驗證</label></fieldset>'+
       '<div id="quizFeedback" class="guide-feedback" role="status" aria-live="polite"></div>'+
       '<div class="guide-actions"><button type="submit" class="guide-btn primary">檢查答案，喚醒島嶼</button>'+
       action('返回閱讀','reading','quiet')+'</div></form>';
     content.querySelector('#guideQuiz').addEventListener('submit',event=>{
       event.preventDefault();
       const answers=new FormData(event.currentTarget);
       const feedback=content.querySelector('#quizFeedback');
       if(!answers.has('q1')||!answers.has('q2')){
         feedback.textContent='請先完成兩題，再送出檢核。';return;
       }
       if(answers.get('q1')!=='1'||answers.get('q2')!=='2'){
         feedback.textContent='還有答案需要調整。可以重新閱讀，思考尊重界線和密碼解鎖的意義。';return;
       }
       const previous=stage;
       setStage(1);
       nextAfterSuccess(previous);
     });
   }else if(view==='password' && PASSCODE_GATES[stage]){
     const gate=PASSCODE_GATES[stage];
     content.innerHTML='<div class="guide-step">闖關密碼驗證 / '+gate.title+'</div>'+
       '<p class="guide-p">請先完成 '+gate.lessonId+' 原始教材，找到通關畫面上的'+gate.codeLabel+'。驗證成功後將解鎖'+gate.nextDescription+'。</p>'+
       '<form id="passwordForm" class="guide-code-form">'+
       '<label for="questCode">'+gate.codeLabel+'</label>'+
       '<input id="questCode" type="text" name="code" inputmode="numeric" maxlength="8" autocomplete="off" placeholder="請輸入'+gate.code.length+'位數密碼" required>'+
       '<div id="codeFeedback" class="guide-feedback" role="status" aria-live="polite"></div>'+
       '<div class="guide-actions"><button class="guide-btn primary" type="submit">驗證並解鎖下一關</button>'+
       action('返回任務','home','quiet')+'</div></form>';
     content.querySelector('#passwordForm').addEventListener('submit',event=>{event.preventDefault();applyCode()});
   }else{
     content.innerHTML=homeHTML();
   }
   dialog.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',event=>{
     const a=event.currentTarget.dataset.action;
     if(a==='home'){view='home';render()}
     else if(a==='reading'||a==='quiz'||a==='password'){view=a;render()}
     else if(a==='close')close();
     else if(a==='reset'){
       if(!window.confirm('確定重設這個瀏覽器的健康島闖關紀錄，讓所有主題島重新沉入海面嗎？'))return;
       setStage(0);navigation?.goOverview?.();view='home';render();
     }else{
       const targets={lesson12:'1-2',lesson22:'2-2',lesson32:'3-2',lesson11:'1-1'};
       close();
       if(a==='visitClear')navigation?.goTo?.('不染色');
       else if(targets[a])navigation?.openLesson?.(targets[a]);
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
     marker.classList.remove('hidden');
     marker.style.left=x+'px';marker.style.top=y+'px';
   }
 }
 shortcut.addEventListener('click',()=>open());
 marker.addEventListener('click',()=>open());
 overlay.addEventListener('click',event=>{if(event.target===overlay)close()});
 document.addEventListener('keydown',event=>{
   if(event.key==='Escape'&&!overlay.hidden){
     event.preventDefault();event.stopImmediatePropagation();close();
   }
 },true);
 canvas.addEventListener('pointerdown',event=>{down={x:event.clientX,y:event.clientY}});
 canvas.addEventListener('pointerup',event=>{
   if(!down)return;
   const distance=Math.hypot(event.clientX-down.x,event.clientY-down.y);down=null;
   if(distance>9||!overlay.hidden)return;
   const rect=canvas.getBoundingClientRect();
   mouse.x=((event.clientX-rect.left)/rect.width)*2-1;
   mouse.y=-((event.clientY-rect.top)/rect.height*2-1);
   raycaster.setFromCamera(mouse,camera);
   if(raycaster.intersectObject(sceneModel.hit,false).length)open();
 });
 shortcutText();
 try{
   if(stage===0&&!sessionStorage.getItem('healthIslandGuideWelcomeV1')){
     sessionStorage.setItem('healthIslandGuideWelcomeV1','1');
     setTimeout(()=>{if(overlay.hidden)open()},900);
   }
 }catch{}
 return {getStage,onChange,setNavigator,update,open};
}
