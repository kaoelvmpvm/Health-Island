// Keep 3D projection (left/top) independent of the screen-space collision offset (translate).
const LABELS=[
  '#centralVaultMarker','.guide-world-marker','.knowledge-island-marker',
  '.satellite-marker','.island-marker'
];
const PANELS=[
  '.topbar .identity','.topbar .build-tag','.intro','.scene-note','.lesson-trail',
  '.quest-shortcut','.island-switcher','.toolbar','.hint'
].join(',');
const MODALS='.guide-overlay:not([hidden]),.central-vault-overlay:not([hidden]),.knowledge-pdf-overlay:not([hidden]),.learn-viewer:not([hidden])';

// Keep the last viable slot until another improves the score enough to justify moving.
const SWITCH_COST=26;
const GAP=8;
const MAX_SPEED=540;
const SLOTS=[
  [0,0],[0,-1],[-1,0],[1,0],[-1,-1],[1,-1],[0,1],[-1,1],[1,1],
  [0,-2],[-2,0],[2,0],[-2,-1],[2,-1],[-1,-2],[1,-2],[-2,1],[2,1],
  [0,2],[-1,2],[1,2],[-2,-2],[2,-2],[-2,2],[2,2]
];

const clamp=(value,min,max)=>Math.min(Math.max(value,min),Math.max(min,max));
function overlap(a,b){
  const w=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)+GAP;
  const h=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)+GAP;
  return w>0&&h>0?w*h:0;
}

export function createLabelLayout(app){
  const offsets=new WeakMap();
  let lastTime=null;

  function read(el,container){
    if(el.hidden||el.classList.contains('hidden'))return null;
    const r=el.getBoundingClientRect();
    if(!r.width||!r.height||getComputedStyle(el).visibility==='hidden')return null;
    return {x:r.left-container.left,y:r.top-container.top,w:r.width,h:r.height};
  }

  function update(elapsed){
    const dt=lastTime===null?0:clamp(elapsed-lastTime,0,.05);
    lastTime=elapsed;
    const container=app.getBoundingClientRect();
    if(!container.width||!container.height||app.querySelector(MODALS))return;

    const reserved=[...app.querySelectorAll(PANELS)]
      .map(el=>read(el,container)).filter(Boolean);
    const placed=[];
    const writes=[];
    const small=container.width<740;
    const ease=1-Math.exp(-18*dt);

    for(const selector of LABELS){
      for(const el of app.querySelectorAll(selector)){
        const r=read(el,container);
        let state=offsets.get(el);
        if(!r){
          if(state)state.visible=false;
          continue;
        }
        if(!state){
          state={x:0,y:0,slot:0,visible:false};
          offsets.set(el,state);
        }
        // DOM bounds include our previous translation. Remove it before scoring.
        r.x-=state.x;
        r.y-=state.y;
        const stepX=Math.max(small?48:65,r.w*.65);
        const stepY=Math.max(26,r.h+GAP);
        let best=null,previous=null;
        for(let slot=0;slot<SLOTS.length;slot++){
          const [dx,dy]=SLOTS[slot];
          const x=clamp(r.x+dx*stepX,9,container.width-r.w-9);
          const y=clamp(r.y+dy*stepY,9,container.height-r.h-12);
          const box={x,y,w:r.w,h:r.h,slot};
          let penalty=0;
          for(const b of reserved)penalty+=overlap(box,b)*2.5;
          for(const b of placed)penalty+=overlap(box,b)*3;
          box.score=penalty*6+Math.hypot(x-r.x,y-r.y);
          if(!best||box.score<best.score)best=box;
          if(slot===state.slot)previous=box;
        }
        const target=state.visible&&previous.score<=best.score+SWITCH_COST?previous:best;
        const targetX=target.x-r.x,targetY=target.y-r.y;
        const dx=targetX-state.x,dy=targetY-state.y;
        const distance=Math.hypot(dx,dy);
        const blend=!state.visible||distance<.25?1:Math.min(ease,MAX_SPEED*dt/distance);
        const x=Math.round((state.x+dx*blend)*100)/100;
        const y=Math.round((state.y+dy*blend)*100)/100;
        if(x!==state.x||y!==state.y)writes.push({el,x,y});
        state.x=x;
        state.y=y;
        state.slot=target.slot;
        state.visible=true;
        // Score against destinations, not animated bounds, so easing cannot trigger a feedback loop.
        placed.push(target);
      }
    }
    // Apply all writes after the layout reads to avoid forcing layout for each label.
    for(const {el,x,y} of writes)el.style.translate=x+'px '+y+'px';
  }
  return {update};
}
