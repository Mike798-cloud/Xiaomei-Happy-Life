/* utils.js — DOM / 事件 / 数学 工具 */
window.MEI = window.MEI || {};

MEI.$  = (sel,root)=> (root||document).querySelector(sel);
MEI.$$ = (sel,root)=> Array.from((root||document).querySelectorAll(sel));

/* 创建元素：el('div',{class:'x',onclick:fn},'文本'|元素|数组) */
MEI.el = function(tag,props,...kids){
  const e = document.createElement(tag);
  if(props){
    for(const k in props){
      const v = props[k];
      if(v==null) continue;
      if(k==='class'||k==='className') e.className=v;
      else if(k==='html') e.innerHTML=v;
      else if(k==='text') e.textContent=v;
      else if(k.slice(0,2)==='on' && typeof v==='function')
        e.addEventListener(k.slice(2).toLowerCase(),v);
      else if(k==='dataset') Object.assign(e.dataset,v);
      else if(k==='style' && typeof v==='object') Object.assign(e.style,v);
      else e.setAttribute(k,v);
    }
  }
  const append=c=>{
    if(c==null) return;
    if(Array.isArray(c)) c.forEach(append);
    else e.appendChild(typeof c==='string'?document.createTextNode(c):c);
  };
  kids.forEach(append);
  return e;
};

/* 事件委托 */
MEI.delegate = function(root,selector,type,handler){
  root.addEventListener(type,ev=>{
    const node=ev.target.closest(selector);
    if(node && root.contains(node)) handler(ev,node);
  });
};

MEI.escapeHtml = s=> String(s==null?'':s)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;');

MEI.clamp = (v,a,b)=> Math.max(a,Math.min(b,v));
MEI.rand  = (a,b)=> a+Math.random()*(b-a);
MEI.choice= arr=> arr[Math.floor(Math.random()*arr.length)];
MEI.shuffle= arr=>{ for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));
  [arr[i],arr[j]]=[arr[j],arr[i]];} return arr; };

/* 简单 tween */
MEI.tween = function(duration, onUpdate, easing){
  return new Promise(res=>{
    const t0=performance.now();
    easing = easing||(t=>t);
    (function frame(t){
      const p=MEI.clamp((t-t0)/duration,0,1);
      onUpdate(easing(p),p);
      if(p<1) requestAnimationFrame(frame); else res();
    })(t0);
  });
};
MEI.easeInOut = t=> t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;

/* 等待 */
MEI.wait = ms=> new Promise(r=>setTimeout(r,ms));

/* 拖拽（统一指针事件，支持触屏） */
MEI.makeDraggable = function(piece,{onDrop,root}={}){
  piece.addEventListener('pointerdown',e=>{
    e.preventDefault();
    piece.setPointerCapture&&piece.setPointerCapture(e.pointerId);
    piece.classList.add('dragging');
    const move=ev=>{ piece.style.pointerEvents='none';
      const under=document.elementFromPoint(ev.clientX,ev.clientY);
      piece.style.pointerEvents='';
      const zone=under&&under.closest('.drop-zone');
      MEI.$$('.drop-zone',root).forEach(z=>z.classList.toggle('over',z===zone));
    };
    const up=ev=>{
      piece.classList.remove('dragging');
      window.removeEventListener('pointermove',move);
      window.removeEventListener('pointerup',up);
      piece.style.pointerEvents='none';
      const under=document.elementFromPoint(ev.clientX,ev.clientY);
      piece.style.pointerEvents='';
      const zone=under&&under.closest('.drop-zone');
      MEI.$$('.drop-zone',root).forEach(z=>z.classList.remove('over'));
      if(onDrop) onDrop(zone,ev);
    };
    window.addEventListener('pointermove',move);
    window.addEventListener('pointerup',up);
  });
};
