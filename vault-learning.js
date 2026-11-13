// Guide Island · Padlet collaborative board and quest route. PDFs are on the three separate knowledge islands.
const PADLET_URL='https://padlet.com/caose29103970/115-11-14-ai-s023z1hlike9bytgguh2?lang=zh-TW';
const PADLET_EMBED='https://padlet.com/embed/s023z1hlike9bytgguh2';
function node(tag,cls,txt){
 const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;
}
function link(label,url,cls){
 const a=node('a',cls,label);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;
}
function button(label,cls,fn){
 const b=node('button',cls,label);b.type='button';b.addEventListener('click',fn);return b;
}
export function createVaultLibrary(dialog,{onClose}={}){
 const root=node('div','vault-library');dialog.appendChild(root);
 const eyebrow=node('div','vault-library-eyebrow','導覽島 / PADLET HUB');
 root.appendChild(eyebrow);
 const lead=node('p','vault-library-intro','這裡是旅程的導航與交流中心。Padlet 共創看板在此開啟；三份原始 PDF 分別放在周圍的「知識寶庫」小島。');
 root.appendChild(lead);
 const tabs=node('div','vault-library-tabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','教材寶庫分頁');root.appendChild(tabs);
 const panes=new Map();const tabButtons=new Map();
 const body=node('div','vault-library-body');root.appendChild(body);
 for(const [id,title] of [['padlet','💬 Padlet 共創看板'],['roadmap','🧭 闖關路線']]){
   const b=button(title,'vault-library-tab',()=>switchTab(id));
   b.setAttribute('role','tab');b.setAttribute('aria-selected','false');
   tabs.appendChild(b);tabButtons.set(id,b);
   const pane=node('section','vault-library-pane');pane.id='vaultTab-'+id;
   pane.setAttribute('role','tabpanel');pane.hidden=true;body.appendChild(pane);panes.set(id,pane);
 }
 const padlet=panes.get('padlet');
 padlet.appendChild(node('h3','vault-padlet-title','115.11.14 AI · Padlet 共創與延伸交流'));
 padlet.appendChild(node('p','vault-padlet-intro','你可以在下方直接瀏覽共創看板；如果無法載入或在手機上操作不順，可開啟完整 Padlet 網頁。請勿張貼任何人的私密影像或可辨識的親密經驗。'));
 const frameBox=node('div','vault-padlet-wrap');padlet.appendChild(frameBox);
 const frame=node('iframe','vault-padlet-frame');frame.title='Padlet 研習交流看板';frame.loading='lazy';
 frame.referrerPolicy='strict-origin-when-cross-origin';frame.src=PADLET_EMBED;
 frame.setAttribute('allowfullscreen','');frameBox.appendChild(frame);
 const padletActions=node('div','vault-padlet-actions');padlet.appendChild(padletActions);
 padletActions.append(link('↗ 另開完整 Padlet',PADLET_URL,'vault-turn primary'));
 padletActions.appendChild(node('span','vault-padlet-warning','若嵌入畫面要求登入或無法顯示，請由看板管理者確認 Padlet 的分享與嵌入權限。'));
 const roadmap=panes.get('roadmap');
 roadmap.appendChild(node('h3','vault-roadmap-title','從閱讀教材到喚醒島嶼'));
 const steps=[
 ['01','探索知識寶庫','在不染色、不炫耀、不迷路三座知識小島，選讀對應主題的完整 PDF 教材'],
 ['02','回到導覽島交流','中央 Padlet 用於研習交流與補充資源；是否留言由教師活動安排決定'],
 ['03','完成行前檢核','開啟導覽小人完成原有兩題檢核，讓不炫耀主題島升起'],
 ['04','解鎖教材塔','在遊戲下方輸入通關密碼，逐步解鎖下一座塔；不需返回導覽小人']
 ];
 for(const [num,title,detail] of steps){
   const item=node('div','vault-roadmap-item');item.append(node('span','vault-roadmap-num',num),node('div','vault-roadmap-text'));
   item.lastChild.append(node('strong','',title),node('p','',detail));roadmap.appendChild(item);
 }
 roadmap.appendChild(node('p','vault-source-note','三份 PDF 可直接閱讀，不受塔樓解鎖限制；互動教材與密碼驗證仍依原有闖關進度進行。'));
 const actions=node('div','vault-library-bottom');root.appendChild(actions);
 actions.appendChild(button('🧭 開啟導覽員任務','vault-turn primary',()=>{
   onClose?.();
   const guide=document.getElementById('questShortcut');
   if(guide)guide.click();
 }));
 actions.appendChild(button('關閉寶庫，回健康島','vault-turn secondary',()=>onClose?.()));
 function switchTab(id){
   for(const [k,p] of panes){p.hidden=k!==id;tabButtons.get(k).classList.toggle('active',k===id);tabButtons.get(k).setAttribute('aria-selected',k===id?'true':'false')}
   
   root.scrollTo?.({top:0,behavior:'instant'});
 }
 switchTab('padlet');
 return {openTab:switchTab};
}