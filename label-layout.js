// Dynamically separate floating 3D labels from each other and from fixed interface panels.
// All marks remain clickable; no guessing of island positions or changes to game logic.
export function createLabelLayout(app){
  const selectors=[
    '#centralVaultMarker',
    '.guide-world-marker',
    '.knowledge-island-marker',
    '.satellite-marker',
    '.island-marker'
  ];
  const avoidSelectors=[
    '.topbar','.intro','.scene-note','.lesson-trail',
    '.quest-shortcut','.island-switcher','.toolbar','.hint'
  ];
  let lastTime=-Infinity;

  function rectInside(rect,container){
    return {
      x:rect.left-container.left,y:rect.top-container.top,
      w:rect.width,h:rect.height
    };
  }
  function visible(el){
    if(!el||el.hidden||el.classList.contains('hidden'))return false;
    const computed=getComputedStyle(el);
    return computed.display!=='none'&&computed.visibility!=='hidden'&&el.getBoundingClientRect().width>0;
  }
  function overlap(a,b,margin=7){
    const width=Math.max(0,Math.min(a.x+a.w+margin,b.x+b.w+margin)-Math.max(a.x-margin,b.x-margin));
    const height=Math.max(0,Math.min(a.y+a.h+margin,b.y+b.h+margin)-Math.max(a.y-margin,b.y-margin));
    return width*height;
  }

  function update(elapsed){
    // Limited to ~8 layouts/s: camera continues to render smoothly between checks.
    if(elapsed-lastTime<.125)return;
    lastTime=elapsed;
    const container=app.getBoundingClientRect();
    if(container.width<220||container.height<240)return;
    if(app.querySelector('.guide-overlay:not([hidden]),.central-vault-overlay:not([hidden]),.knowledge-pdf-overlay:not([hidden]),.learn-viewer:not([hidden])'))return;

    const reserved=avoidSelectors.flatMap(selector=>
      [...app.querySelectorAll(selector)]
        .filter(visible)
        .map(el=>rectInside(el.getBoundingClientRect(),container))
    );
    const placed=[];
    const width=container.width,height=container.height;
    const small=width<740;
    const all=selectors.flatMap(selector=>[...app.querySelectorAll(selector)]).filter(visible);

    for(const el of all){
      const r=rectInside(el.getBoundingClientRect(),container);
      const offsetX=Math.max(small?45:65,r.w*.65);
      const offsetY=Math.max(26,r.h+13);
      // Prefer an unobstructed position above the actual island marker.
      // Displacements are bounded, so labels stay associated with their island.
      const possibilities=[
        [0,0],[0,-offsetY],
        [-offsetX,0],[offsetX,0],
        [-offsetX,-offsetY],[offsetX,-offsetY],
        [0,-offsetY*2],
        [-offsetX*1.8,0],[offsetX*1.8,0],
        [-offsetX*1.8,-offsetY],[offsetX*1.8,-offsetY],
        [0,offsetY],[-offsetX,offsetY],[offsetX,offsetY],
        [-offsetX*2.4,-offsetY],[offsetX*2.4,-offsetY]
      ];
      let best=null,bestScore=Infinity;
      for(const [dx,dy] of possibilities){
        // Keep the label on-screen even near the edge of a rotated view.
        const x=Math.max(9,Math.min(width-r.w-9,r.x+dx));
        const y=Math.max(9,Math.min(height-r.h-12,r.y+dy));
        if(x<0||y<0)continue;
        const box={x,y,w:r.w,h:r.h};
        const obstruction=reserved.reduce((sum,b)=>sum+overlap(box,b)*2.5,0);
        const collision=placed.reduce((sum,b)=>sum+overlap(box,b)*3,0);
        const distance=Math.hypot(x-r.x,y-r.y);
        // Overlap is strongly penalized, but a shorter move wins for clear spots.
        const score=(obstruction+collision)*60+distance;
        if(score<bestScore){best=box;bestScore=score}
      }
      if(!best)continue;
      // Preserve the original CSS translate(-50%, -112% / -115%).
      const factor=el.matches('.knowledge-island-marker,.satellite-marker')?1.15:
        el.matches('.central-vault-marker,.guide-world-marker')?1.12:1.0;
      el.style.left=(best.x+r.w/2)+'px';
      el.style.top=(best.y+r.h*factor)+'px';
      placed.push(best);
    }
  }
  return {update};
}
