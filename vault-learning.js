// Health Island · 不炫耀學習基地
// 九頁的編排依據使用者提供之《不需炫耀、不是比較》PDF；「想一想」為本站延伸提問。
const PADLET_URL='https://padlet.com/caose29103970/115-11-14-ai-s023z1hlike9bytgguh2?lang=zh-TW';
const PADLET_EMBED='https://padlet.com/embed/s023z1hlike9bytgguh2';
const PDF_URL='https://drive.google.com/file/d/1v7zTXRnUN52NvD7glko0eig8pxpQxRA4/view';
const PDF_PREVIEW_URL='https://drive.google.com/file/d/1v7zTXRnUN52NvD7glko0eig8pxpQxRA4/preview';
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
 const eyebrow=node('div','vault-library-eyebrow','不炫耀學習基地 / LEARNING VAULT');
 root.appendChild(eyebrow);
 const lead=node('p','vault-library-intro','先在本站閱讀完整的九頁 PDF 原始教材，再到 Padlet 延伸交流；完成後回到導覽員進行行前檢核。');
 root.appendChild(lead);
 const tabs=node('div','vault-library-tabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','教材寶庫分頁');root.appendChild(tabs);
 const panes=new Map();const tabButtons=new Map();
 const body=node('div','vault-library-body');root.appendChild(body);
 for(const [id,title] of [['reading','📖 完整 PDF'],['padlet','💬 Padlet 交流'],['roadmap','🧭 闖關路線']]){
   const b=button(title,'vault-library-tab',()=>switchTab(id));
   b.setAttribute('role','tab');b.setAttribute('aria-selected','false');
   tabs.appendChild(b);tabButtons.set(id,b);
   const pane=node('section','vault-library-pane');pane.id='vaultTab-'+id;
   pane.setAttribute('role','tabpanel');pane.hidden=true;body.appendChild(pane);panes.set(id,pane);
 }
 const reading=panes.get('reading');
 reading.appendChild(node('h3','vault-pdf-title','《不需炫耀、不是比較》｜原始完整 PDF'));
 reading.appendChild(node('p','vault-pdf-intro','完整保留原始九頁教材的插畫、文字、顏色與排版。可以在下方閱讀、縮放或使用 PDF 閱讀器的頁面控制。'));
 const pdfBox=node('div','vault-pdf-wrap');reading.appendChild(pdfBox);
 const pdfFrame=node('iframe','vault-pdf-frame');
 pdfFrame.src=PDF_PREVIEW_URL;
 pdfFrame.title='不需炫耀、不是比較：九頁原始 PDF 閱讀器';
 pdfFrame.loading='lazy';
 pdfFrame.setAttribute('allowfullscreen','');
 pdfBox.appendChild(pdfFrame);
 const pdfActions=node('div','vault-pdf-actions');reading.appendChild(pdfActions);
 pdfActions.appendChild(link('↗ 另開完整 PDF',PDF_URL,'vault-turn primary'));
 pdfActions.appendChild(button('💬 閱讀後前往 Padlet →','vault-turn secondary',()=>switchTab('padlet')));
 reading.appendChild(node('p','vault-pdf-note','此閱讀器透過 Google Drive 顯示原始 PDF。若看到「需要存取權」或無法載入，請由檔案擁有者將 Google Drive 分享權限設定為「知道連結的任何人：檢視者」；在完成分享前，未獲授權的訪客無法閱讀。'));
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
 ['01','開啟教材寶庫','在原始 PDF 閱讀器閱讀完整九頁教材，保留插畫、文字、顏色及排版'],
 ['02','Padlet 延伸交流','在 Padlet 閱讀研習或討論內容；是否留言由教師活動安排決定'],
 ['03','導覽員行前檢核','返回健康島導覽員，完成原有兩題檢核，讓不炫耀島升起'],
 ['04','不炫耀島三座塔','依序完成 1-2 認知、2-2 情意、3-2 技能並輸入原教材通關密碼']
 ];
 for(const [num,title,detail] of steps){
   const item=node('div','vault-roadmap-item');item.append(node('span','vault-roadmap-num',num),node('div','vault-roadmap-text'));
   item.lastChild.append(node('strong','',title),node('p','',detail));roadmap.appendChild(item);
 }
 roadmap.appendChild(node('p','vault-source-note','本次沒有變更島嶼解鎖條件、三座塔的順序、密碼或既有紀錄。'));
 const actions=node('div','vault-library-bottom');root.appendChild(actions);
 actions.appendChild(button('🧭 返回導覽員檢核','vault-turn primary',()=>{
   onClose?.();
   const guide=document.getElementById('questShortcut');
   if(guide)guide.click();
 }));
 actions.appendChild(button('關閉寶庫，回健康島','vault-turn secondary',()=>onClose?.()));
 function switchTab(id){
   for(const [k,p] of panes){p.hidden=k!==id;tabButtons.get(k).classList.toggle('active',k===id);tabButtons.get(k).setAttribute('aria-selected',k===id?'true':'false')}
   if(id==='reading'){ /* PDF viewer maintains its own page position */ }
   root.scrollTo?.({top:0,behavior:'instant'});
 }
 switchTab('reading');
 return {openTab:switchTab};
}