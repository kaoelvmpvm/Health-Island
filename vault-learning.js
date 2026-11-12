// Health Island · 不炫耀學習基地
// 九頁的編排依據使用者提供之《不需炫耀、不是比較》PDF；「想一想」為本站延伸提問。
const PADLET_URL='https://padlet.com/caose29103970/115-11-14-ai-s023z1hlike9bytgguh2?lang=zh-TW';
const PADLET_EMBED='https://padlet.com/embed/s023z1hlike9bytgguh2';
const READER_KEY='healthIslandNoBragReaderPageV1';
const chapters=[
 {tag:'啟程',title:'不需炫耀、不是比較',sub:'青少年同儕性炫耀、比較壓力與理性思考',lead:'不必靠與他人比較來證明自己的價值。',body:[
 '這份教材聚焦青少年同儕間的性炫耀，以及這類訊息如何影響對自己的看法、親密關係與行動抉擇。',
 '旅程由三個迷思開始，逐步探討性炫耀的影響、性與愛的三項定心術，最後回到自己的關係節奏。'
 ],focus:'先辨認：別人的經驗，真的能決定我的價值嗎？',question:'當別人用經驗多少比較成熟度時，我最容易受到什麼影響？'},
 {tag:'迷思一',title:'這樣才是有魅力？',sub:'真正成熟——獨立思考',lead:'成熟不靠性經驗炫耀，而靠判斷力與價值觀。',body:[
 '疑問：炫耀性經驗真的能讓人更成熟、更受歡迎，或在同儕中得到更高地位嗎？',
 '破解：這種炫耀可能被視為幼稚、不真誠，長久下來反而損害人際信任，留下「愛吹牛」的印象。',
 '青春心語：我有堅定的態度與價值觀，不輕易跟風，知道自己的意願，並能做出明智決定。'
 ],focus:'真正成熟——獨立思考。',question:'如果有人以性經驗炫耀，我可以用什麼標準辨識一個人的成熟？'},
 {tag:'迷思二',title:'這樣才比較成熟？',sub:'健康的性與愛',lead:'親密關係從來就不是打怪升級。',body:[
 '疑問：把親密關係當成打怪遊戲，「解鎖」越多身體接觸，等級就越高、越有魅力嗎？',
 '破解：性經驗如何，與一個人的價值、魅力，以及能否幸福快樂，沒有絕對關係。學習如何愛與被愛才是重要關鍵。',
 '青春心語：健康的性與真正的愛，來自了解自己、尊重他人的身體與感受，而不是靠性經驗刷存在感或獲得按讚。'
 ],focus:'學習愛與被愛，比比較經驗重要。',question:'一段親密關係的品質，可以從哪些非身體接觸的面向評估？'},
 {tag:'迷思三',title:'這樣才不會落伍？',sub:'STOP！從性炫耀競賽中登出',lead:'你的身體和心靈，不是追趕同儕進度的工具。',body:[
 '疑問：大家都在談性經驗，跟不上話題就會成為圈外人、被排擠或邊緣化嗎？',
 '破解：青少年常高估同儕的性經驗程度；盲目從眾既不是潮流，也可能增加比較焦慮。',
 '青春心語：一段關係的價值，在於情感的溫度、深度與真誠度，而不是速度。'
 ],focus:'情感的溫度、深度與真誠度，重於速度。',question:'「大家都在做」與「我也應該做」之間，隱含哪些沒有被證實的假設？'},
 {tag:'理解影響',title:'性炫耀的影響',sub:'性，它不是勳章',lead:'炫耀不只影響自己，也可能傷害親密關係。',body:[
 '第一種影響：以性經驗數字肯定自己的價值，容易將自己的身體與情感窄化成物品。',
 '第二種影響：把伴侶當成炫耀工具，破壞信任與尊重，傷害彼此的感受。',
 '第三種影響：只在意博取關注與聲量，可能錯失情感分享、心靈連結等有意義的互動。',
 '青春心語：健康的親密關係應由兩人共同呵護，而不是拿來公開展覽。'
 ],focus:'不因炫耀，傷害親密。',question:'分享自己的故事與將他人當作炫耀工具，兩者的界線在哪裡？'},
 {tag:'定心術一',title:'性，不是愛的證明題',sub:'面對性與愛的考驗',lead:'完整的愛，無法只靠性經驗證明。',body:[
 '愛情的價值來自彼此的關懷與尊重，而不是透過性行為滿足自己或取悅別人。',
 '性經驗無法驗證真正完整的愛。',
 '青春心語：健康的親密關係，是用愛讓性變得有意義，而不是用性來驗證愛。'
 ],focus:'性不是愛的證明題。',question:'如果伴侶要求用身體接觸證明愛，我能如何回應？'},
 {tag:'定心術二',title:'性，是愛的選擇題',sub:'真愛，值得等待',lead:'你的意願應該被重視。',body:[
 '性應該是一種自主的選擇；「現在還不是時候」是成熟、明智且值得被接納的答案。',
 '「我還沒準備好」、「我覺得我們還太小」都是有力量的話。',
 '這不代表不行或很遜，而是了解自己、尊重自己，並有能力為自己的關係按下暫停。'
 ],focus:'自主選擇，尊重意願。',question:'一個清楚的「我還沒準備好」，為什麼不等於不成熟？'},
 {tag:'定心術三',title:'性，需要用愛來準備',sub:'你的愛情，不是別人的 KPI',lead:'把關注從「他們」調回「我」。',body:[
 '當你擔心別人都有經驗、自己是不是也該跟上時，可以改問：「那我呢？」「我想要的關係是什麼？」「我準備好了嗎？」',
 '這份準備不只是生理成熟，也包括心理穩定，以及對性健康知識的充分了解，例如避孕方法與性病防治。',
 '青春心語：性應該建立在愛、尊重、承諾與充分準備上，而不是用來炫耀或比較的任務。'
 ],focus:'充分準備，不必趕進度。',question:'若要做出成熟的親密決定，我還需要了解哪些資訊？'},
 {tag:'學習統整',title:'當自己愛情世界的 CEO',sub:'打造獨一無二的幸福',lead:'情感發展時序不一樣，關係品質大於進度。',body:[
 '談戀愛的進度沒有標準答案，也不需要和別人比較。',
 '追求尊重、有溝通的關係，比追求快速的戀愛進度更有價值與意義。',
 '與其花精力炫耀比較，不如提升自己的價值、經營情感關係。',
 '青春心語：你的愛情故事是專屬於自己的原創劇本，不需要刻意模仿別人的劇情。'
 ],focus:'不炫耀、不比較，打造自己的幸福。',question:'完成這份教材後，我最想帶走的一句價值宣言是什麼？'}
];
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
 const lead=node('p','vault-library-intro','先閱讀「不需炫耀、不是比較」九頁教材，再到 Padlet 延伸交流；完成後回到導覽員進行行前檢核。');
 root.appendChild(lead);
 const tabs=node('div','vault-library-tabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','教材寶庫分頁');root.appendChild(tabs);
 const panes=new Map();const tabButtons=new Map();
 const body=node('div','vault-library-body');root.appendChild(body);
 for(const [id,title] of [['reading','📖 九頁教材'],['padlet','💬 Padlet 交流'],['roadmap','🧭 闖關路線']]){
   const b=button(title,'vault-library-tab',()=>switchTab(id));
   b.setAttribute('role','tab');b.setAttribute('aria-selected','false');
   tabs.appendChild(b);tabButtons.set(id,b);
   const pane=node('section','vault-library-pane');pane.id='vaultTab-'+id;
   pane.setAttribute('role','tabpanel');pane.hidden=true;body.appendChild(pane);panes.set(id,pane);
 }
 const reading=panes.get('reading');
 const pageNav=node('div','vault-page-nav');reading.appendChild(pageNav);
 const pageMeta=node('span','vault-page-count');pageNav.appendChild(pageMeta);
 const chapterDots=node('div','vault-chapter-dots');chapterDots.setAttribute('aria-label','選擇教材頁');reading.appendChild(chapterDots);
 const paper=node('article','vault-paper');reading.appendChild(paper);
 const readerFoot=node('div','vault-reader-foot');reading.appendChild(readerFoot);
 const mark=node('p','vault-source-note','教材內文依上傳的九頁《不需炫耀、不是比較》重新編排；「想一想」為本站新增之延伸提問。原 PDF 的插畫未在此重製。');
 reading.appendChild(mark);
 const pageBtns=[];
 let page=0;
 try{const old=Number(localStorage.getItem(READER_KEY));if(Number.isInteger(old)&&old>=0&&old<chapters.length)page=old}catch(e){}
 chapters.forEach((c,i)=>{
   const b=button(String(i+1),'vault-page-dot',()=>showPage(i));
   b.setAttribute('aria-label','第 '+(i+1)+' 頁：'+c.title);chapterDots.appendChild(b);pageBtns.push(b);
 });
 function showPage(i){
   page=Math.min(chapters.length-1,Math.max(0,i));
   const c=chapters[page];paper.replaceChildren();
   const stamp=node('div','vault-paper-stamp','PAGE '+String(page+1).padStart(2,'0')+' / '+c.tag);paper.appendChild(stamp);
   paper.appendChild(node('h3','vault-paper-title',c.title));
   paper.appendChild(node('p','vault-paper-subtitle',c.sub));
   paper.appendChild(node('div','vault-paper-lead',c.lead));
   const paragraphs=node('div','vault-paper-paragraphs');paper.appendChild(paragraphs);
   c.body.forEach(t=>paragraphs.appendChild(node('p','',t)));
   paper.appendChild(node('div','vault-paper-focus','青春心語｜'+c.focus));
   const q=node('aside','vault-reflect');
   q.append(node('strong','','想一想（延伸提問）'),node('p','',c.question));paper.appendChild(q);
   pageMeta.textContent='教材閱讀 · 第 '+(page+1)+' / '+chapters.length+' 頁';
   pageBtns.forEach((b,n)=>{b.classList.toggle('active',n===page);b.setAttribute('aria-current',n===page?'page':'false')});
   readerFoot.replaceChildren();
   readerFoot.append(
     button('← 上一頁','vault-turn secondary',()=>showPage(page-1)),
     button(page===chapters.length-1?'已讀完九頁 · 前往 Padlet →':'下一頁 →','vault-turn primary',()=>page===chapters.length-1?switchTab('padlet'):showPage(page+1))
   );
   readerFoot.firstElementChild.disabled=page===0;
   try{localStorage.setItem(READER_KEY,String(page))}catch(e){}
   paper.scrollIntoView?.({block:'nearest',behavior:'auto'});
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
 ['01','開啟教材寶庫','閱讀九頁《不需炫耀、不是比較》，理解迷思、影響與三項定心術'],
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
   if(id==='reading')showPage(page);
   root.scrollTo?.({top:0,behavior:'instant'});
 }
 switchTab('reading');
 return {openTab:switchTab};
}