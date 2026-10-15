/* dialogue.js — 打字机对话 / 三级提示 / 背包 */
window.MEI = window.MEI || {};

/* 道具元数据 */
MEI.itemMeta = {
 candle:{icon:'🕯️',name:'蜡烛',tip:'阿树说怕黑就给我点根蜡烛。'},
 flower:{icon:'🌼',name:'小白花',tip:'江边采的，本想见面时送给他。'},
 letter:{icon:'✉️',name:'未发的信',tip:'写好却没能发出，红得像血，其实是爱心。'},
 floppy:{icon:'💾',name:'软盘',tip:'存着整个快乐家园。'},
 diaryKey:{icon:'📓',name:'日记本',tip:'扉页写着密码游戏：往后数 5 个。'},
 'note-birthday':{icon:'🗒️',name:'生日纸条',tip:'小美生日：3 月 14 日。'},
 'note-promise':{icon:'🗒️',name:'约定纸条',tip:'约定：8 月 15 日晚 8 点。'},
 'note-come':{icon:'🗒️',name:'拼好的纸条',tip:'底层原文：「快来」。'}
};

/* ================= 对话 ================= */
MEI.Dialogue = {
  queue:[], idx:0, typing:false, done:null, el:null, full:'', shown:0, timer:null,

  /* lines: 字符串 / {speaker,text,id} / 数组 */
  show(lines,onDone){
    MEI.Clock.clearInterval(this.timer);
    this.queue=(Array.isArray(lines)?lines:[lines]).map(l=>
      typeof l==='string'?{text:l}:l);
    this.idx=0; this.done=onDone||null;
    this.el=MEI.$('#dialogue-box');
    this.el.classList.remove('hidden');
    this.render();
  },
  render(){
    const item=this.queue[this.idx];
    const box=this.el;
    box.innerHTML='';
    box.appendChild(MEI.el('div',{class:'dlg-window'},
      MEI.el('div',{class:'dlg-titlebar'},
        MEI.el('span',{},item.speaker||'小美'),
        MEI.el('span',{},'')),
      MEI.el('div',{class:'dlg-content',id:'dlg-content'}),
      MEI.el('div',{class:'dlg-footer'},
        MEI.el('span',{},item.id?item.id:''),
        MEI.el('span',{class:'dlg-next-mark'},'▼'))
    ));
    this.full=item.text||'';
    this.shown=0;
    const already=item.id&&MEI.isRead(item.id);
    if(already){ this.finishTyping(); }
    else this.typeLoop();
  },
  typeLoop(){
    this.typing=true;
    const speed=({slow:80,normal:50,fast:25,instant:0})[MEI.state.settings.textSpeed]??50;
    MEI.Clock.clearInterval(this.timer);
    if(speed===0){ this.finishTyping(); return; }
    this.timer=MEI.Clock.setInterval(()=>{
      const ch=this.full[this.shown];
      this.shown++;
      if(ch&&/[，。、！？～…]/.test(ch)) MEI.Audio.typ();
      this.paint();
      if(this.shown>=this.full.length){ MEI.Clock.clearInterval(this.timer);this.afterTyped(); }
    },speed);
  },
  paint(){
    const c=MEI.$('#dlg-content'),item=this.queue[this.idx];
    const text=this.full.slice(0,this.shown).replace(/\n/g,'<br>');
    c.innerHTML=(item.speaker?`<span class="dlg-speaker">${item.speaker}：</span>`:'')
      +text+(this.typing&&this.shown<this.full.length?'<span class="type-cursor"></span>':'');
  },
  afterTyped(){
    this.typing=false;
    const item=this.queue[this.idx];
    if(item.id) MEI.markRead(item.id);
    this.paint();
    const c=MEI.$('#dlg-content');
    c.innerHTML=(item.speaker?`<span class="dlg-speaker">${item.speaker}：</span>`:'')
      +this.full.replace(/\n/g,'<br>');
  },
  finishTyping(){
    MEI.Clock.clearInterval(this.timer); this.shown=this.full.length; this.typing=false;
    const item=this.queue[this.idx];
    if(item.id) MEI.markRead(item.id);
    const c=MEI.$('#dlg-content');
    c.innerHTML=(item.speaker?`<span class="dlg-speaker">${item.speaker}：</span>`:'')
      +this.full.replace(/\n/g,'<br>');
  },
  click(){
    if(this.typing){ this.finishTyping(); return; }
    this.idx++;
    if(this.idx>=this.queue.length){ this.hide(); const d=this.done;
      this.done=null; d&&d(); }
    else this.render();
  },
  hide(){ if(this.el)this.el.classList.add('hidden'); MEI.Clock.clearInterval(this.timer);this.typing=false; },
  cancel(){this.hide();this.queue=[];this.done=null;this.el=null;}
};
document.addEventListener('click',ev=>{
  if(!MEI.Dialogue.el||MEI.Dialogue.el.classList.contains('hidden')) return;
  if(ev.target.closest('#dialogue-box')) MEI.Dialogue.click();
});

/* ================= 提示 ================= */
MEI.Hint = {
  counts:{},
  flash(text,dur=3200){
    const box=MEI.$('#hint-box');
    box.innerHTML='';
    box.appendChild(MEI.el('div',{class:'hint-bubble'},text));
    box.classList.remove('hidden');
    MEI.Clock.clearTimeout(this._t);
    this._t=MEI.Clock.setTimeout(()=>box.classList.add('hidden'),dur);
  },
  /* 三级谜题提示 */
  puzzle(id){
    const cfg=MEI.Data.puzzles[id];
    if(!cfg) return;
    const n=(this.counts[id]||0);
    MEI.state.stats.hintsUsed++;
    this.flash(cfg.hints[Math.min(n,2)],4200);
    this.counts[id]=n+1;
  },
  /* 卡关自动计时；返回清理函数 */
  autoTimer(id,resetSignal){
    let elapsed=0;
    const iv=MEI.Clock.setInterval(()=>{
      const mode=MEI.state.settings.softHint;
      if(mode==='off'||MEI.Puzzles.isSolved(id)){elapsed=0;return;}
      if(!MEI.$('#dialogue-box').classList.contains('hidden')||MEI.$('#modal-layer').children.length)return;
      elapsed++;
      const limit=mode==='low'?150:90;
      if(elapsed>=limit){this.puzzle(id);elapsed=0;}
    },1000);
    return ()=>MEI.Clock.clearInterval(iv);
  }
};

/* ================= 背包 ================= */
MEI.toggleBag=function(){
  const p=MEI.$('#inventory-panel');
  if(p.classList.contains('hidden')){ this.refreshBag();p.classList.remove('hidden'); }
  else p.classList.add('hidden');
};
MEI.refreshBag=function(){
  const p=MEI.$('#inventory-panel');
  if(!p) return;
  const inv=MEI.state.inventory;
  const slots=[];
  for(let i=0;i<9;i++){
    const key=inv[i];
    const meta=key&&MEI.itemMeta[key];
    slots.push(MEI.el('div',{class:'bag-slot'+(meta?' filled':''),
      ...(meta?{}:{})},
      meta?[MEI.el('span',{},meta.icon),
            MEI.el('span',{class:'slot-tip'},meta.name+'：'+meta.tip)]:null));
  }
  const c=MEI.state.collectibles;
  p.innerHTML='';
  p.appendChild(MEI.el('div',{class:'bag-window'},
    MEI.el('div',{class:'bag-titlebar'},'我的收藏夹'),
    MEI.el('div',{class:'bag-grid'},slots),
    MEI.el('div',{class:'bag-progress'},
      MEI.el('div',{},`日记 ${c.diary.length}/${MEI.Data.diaryCount}`),
      MEI.el('div',{class:'bar'},MEI.el('i',{style:{width:(c.files.length/MEI.Data.pcFileCount*100)+'%'}})),
      MEI.el('div',{},`文件 ${c.files.length}/${MEI.Data.pcFileCount}`))
  ));
};
