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
      else if(['disabled','checked','selected','multiple','readOnly','required','hidden'].includes(k)) e[k]=Boolean(v);
      else e.setAttribute(k,v);
    }
  }
  const append=c=>{
    if(c==null) return;
    if(Array.isArray(c)) c.forEach(append);
    else e.appendChild(typeof c==='string'||typeof c==='number'?document.createTextNode(String(c)):c);
  };
  kids.forEach(append);
  return e;
};


/* Scene timers stop on pause and are discarded on navigation/load. */
MEI.Clock={
  jobs:new Map(), reasons:new Set(), nextId:1, scope:0, last:performance.now(),
  get paused(){return this.reasons.size>0;},
  add(fn,ms,repeat,scope){
    const id=this.nextId++,delay=Math.max(1,Number(ms)||1);
    this.jobs.set(id,{fn,left:delay,delay,repeat,scope:scope==='global'?'global':this.scope});return id;
  },
  setTimeout(fn,ms,scope){return this.add(fn,ms,false,scope);},
  setInterval(fn,ms,scope){return this.add(fn,ms,true,scope);},
  clearTimeout(id){this.jobs.delete(id);},clearInterval(id){this.jobs.delete(id);},
  clearScene(){for(const [id,j] of this.jobs)if(j.scope!=='global')this.jobs.delete(id);this.scope++;},
  setPaused(reason,on){
    const was=this.paused;
    if(on)this.reasons.add(reason);else this.reasons.delete(reason);
    this.last=performance.now();
    document.body.classList.toggle('game-paused',this.paused);
    const a=MEI.Audio;
    if(was!==this.paused&&a&&a.ready){
      if(this.paused)a.ctx.suspend().catch(()=>{});
      else {a.nextT=a.ctx.currentTime+.08;a.ctx.resume().catch(()=>{});}
    }
  },
  tick(){
    const now=performance.now(),dt=Math.min(250,now-this.last);this.last=now;
    if(this.paused)return;
    for(const [id,j] of Array.from(this.jobs)){
      if(!this.jobs.has(id))continue;
      j.left-=dt;if(j.left>0)continue;
      if(j.repeat)j.left=j.delay;else this.jobs.delete(id);
      try{j.fn();}catch(e){window.setTimeout(()=>{throw e;},0);}
      if(this.paused)break;
    }
  }
};
window.setInterval(()=>MEI.Clock.tick(),16);
document.addEventListener('visibilitychange',()=>MEI.Clock.setPaused('hidden',document.hidden));
MEI.Clock.setPaused('hidden',document.hidden);

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

/* ============================================================
   makeOrderPuzzle — 健壮的“排序/拼字”谜题组件（M10/M9/M3 共用）
   杜绝死锁：每槽至多一件，占用时拖入=交换（步骤永不丢失）；
   点槽取回；卡片点击→点槽（或再点卡片自动填空）等价输入；
   常驻“重排/帮助”；positional 模式下放对即时变绿。
   items:[{id,label}]；slotCount；correct:[id...]（长度=slotCount）
   返回 {reset, setState, el}
   ============================================================ */
MEI.makeOrderPuzzle = function(container,opts){
  opts = opts||{};
  const items=opts.items, slotCount=opts.slotCount, correct=opts.correct;
  let loc={};                       // slotIndex -> itemId
  let selected=null, done=false, wrongShown=false;
  const byId=id=>items.find(x=>x.id===id);

  const controls=MEI.el('div',{class:'pz-controls'},
    MEI.el('button',{class:'btn pz-reset',type:'button'},opts.resetLabel||'重排一次'),
    MEI.el('button',{class:'btn pz-help',type:'button'},'？ 帮助'));
  const slotsRow=MEI.el('div',{class:'pz-slots'});
  const slots=[];
  for(let i=0;i<slotCount;i++){
    const z=MEI.el('div',{class:'drop-zone pz-slot','data-slot':i},
      MEI.el('span',{class:'pz-tag'},opts.slotTag?opts.slotTag(i+1):('第'+(i+1)+'步')));
    slots.push(z);slotsRow.appendChild(z);
  }
  const tray=MEI.el('div',{class:'pz-tray'});
  const cards={};
  items.forEach(it=>{
    const c=MEI.el('div',{class:'pz-card','data-id':it.id},it.label);
    cards[it.id]=c; tray.appendChild(c);
    MEI.makeDraggable(c,{root:container,onDrop:(z)=>{
      if(done)return;
      if(z){ place(it.id,+z.dataset.slot); }
      render();
    }});
    c.addEventListener('click',()=>{
      if(done)return;
      if(selected===it.id){ /* 再点一次：自动填下一个空槽 */
        const empty=firstEmpty(); if(empty!=null){ place(it.id,empty); selected=null; render(); }
      }else{ selected=it.id; render(); }
    });
  });

  slots.forEach((z,i)=>z.addEventListener('click',()=>{
    if(done)return;
    const cur=loc[i];
    if(selected!=null){ place(selected,i); selected=null; }
    else if(cur){ delete loc[i]; }   /* 点已放置 → 取回 */
    render();
  }));

  function firstEmpty(){ for(let i=0;i<slotCount;i++) if(loc[i]==null)return i; return null; }
  /* 放置：若该槽已有，自动把被替换者退回（交换，永不丢失） */
  function place(id,slot){
    /* 若该步骤原本在别的槽，先清掉旧槽 */
    for(let k in loc) if(loc[k]===id) delete loc[k];
    loc[slot]=id;
    if(!opts.positional) return;
  }
  function vals(){ const a=[];for(let i=0;i<slotCount;i++)a.push(loc[i]||null);return a; }

  function check(){
    const v=vals();
    if(opts.positional){
      slots.forEach((z,i)=>z.classList.toggle('pz-fixed',v[i]===correct[i]));
    }
    if(v.every(x=>x!=null)){
      if(v.join('|')===correct.join('|')){
        done=true; slots.forEach(z=>z.classList.add('pz-fixed'));
        selected=null;
        Object.values(cards).forEach(c=>c.classList.add('pz-done'));
        MEI.Audio.candleLit();
        if(opts.onComplete) MEI.Clock.setTimeout(opts.onComplete,350);
      }else{
        if(!opts.positional) slots.forEach(z=>z.classList.add('pz-bad'));
        MEI.Audio.error();
        if(!wrongShown){ wrongShown=true;
          MEI.Hint.flash(opts.wrongLine||'顺序还差一点，点错的那一步可以拿回来重放。',2600);
          MEI.Clock.setTimeout(()=>{wrongShown=false;slots.forEach(z=>z.classList.remove('pz-bad'));},1200);
        }
      }
    }
  }

  function render(){
    /* 清槽内容（保留 tag） */
    slots.forEach((z,i)=>{
      Array.from(z.querySelectorAll('.pz-in')).forEach(n=>n.remove());
      z.classList.remove('pz-bad','pz-fixed');
      const id=loc[i];
      if(id!=null){
        z.classList.add('pz-filled');
        z.appendChild(MEI.el('span',{class:'pz-in'},byId(id).label));
      }else z.classList.remove('pz-filled');
    });
    /* 卡片：在槽里的从托盘移走（视觉上），其余在托盘 */
    items.forEach(it=>{
      const inSlot=Object.values(loc).includes(it.id);
      const c=cards[it.id];
      c.classList.toggle('pz-placed',inSlot);
      c.classList.toggle('pz-selected',selected===it.id);
      c.style.display=inSlot?'none':'';
      if(!inSlot && c.parentNode!==tray) tray.appendChild(c);
    });
    check();
  }

  function reset(preshuffle){
    loc={};selected=null;done=false;wrongShown=false;
    if(preshuffle!==false){ MEI.shuffle(items); }
    /* 重建卡片标签顺序（DOM 重排） */
    items.forEach(it=>tray.appendChild(cards[it.id]));
    render();
  }
  /* 直接恢复（读档用）：传入槽位 id 数组 */
  function setState(v){
    loc={};v.forEach((id,i)=>{if(id)loc[i]=id;});
    render();
  }
  function isDone(){return done;}

  controls.querySelector('.pz-reset').addEventListener('click',()=>{ if(!done){MEI.Audio.click();reset();} });
  controls.querySelector('.pz-help').addEventListener('click',()=>{
    MEI.Audio.click();
    if(opts.puzzleId&&MEI.Hint.puzzle) MEI.Hint.puzzle(opts.puzzleId);
  });

  if(opts.intro) container.appendChild(MEI.el('div',{class:'pz-intro small'},opts.intro));
  container.appendChild(controls);
  container.appendChild(slotsRow);
  container.appendChild(tray);
  reset(true);
  return {reset,setState,isDone,el:container,get loc(){return loc;}};
};
