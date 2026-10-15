/* truth.js — P5 日记真相（M9 记忆碎片排序） */
window.MEI = window.MEI || {};

MEI.registerScene({
  id:'truth',
  label:'第五幕 · 真相',

  render(root){
    const world=MEI.el('div',{class:'depth-world faded',id:'tr-world'});
    root.appendChild(world);
    world.appendChild(MEI.el('div',{class:'depth-floor'}));
    world.appendChild(MEI.el('div',{class:'depth-header'},
      MEI.el('div',{class:'depth-title'},'小美の快乐家园')));

    /* 日记阅读器（居中大窗） */
    const reader=MEI.el('div',{class:'diary-reader',id:'diary-reader'});
    reader.appendChild(MEI.el('div',{class:'diary-titlebar'},'美の日记'));
    const body=MEI.el('div',{class:'diary-body'});
    this.tocEl=MEI.el('div',{class:'diary-toc',id:'diary-toc'});
    /* 残页碎片（可选，不影响真结局计数） */
    this.fragEl=MEI.el('div',{class:'diary-frags',id:'diary-frags'});
    this.fragEl.appendChild(MEI.el('div',{class:'frags-head'},
      MEI.el('img',{src:'assets/img/depth/relic_diary.jpg',alt:''}),
      MEI.el('span',{},'散页')));
    (MEI.Data.diaryFragments||[]).forEach(fr=>{
      this.fragEl.appendChild(MEI.el('div',{class:'frag-item',
        onclick:()=>this.readFragment(fr)},'▸ '+fr.title));
    });
    this.pageEl=MEI.el('div',{class:'diary-page scrollbox',id:'diary-page'},
      MEI.el('div',{},'锁开了。从第一篇开始读吧，她把所有事都写在了这里。'));
    body.appendChild(this.tocEl);
    this.tocEl.appendChild(this.fragEl);
    body.appendChild(this.pageEl);
    reader.appendChild(body);
    /* M9 区域 */
    this.m9zone=MEI.el('div',{class:'memory-sort hidden',id:'m9-zone'});
    reader.appendChild(this.m9zone);
    world.appendChild(reader);

    /* 门（回忆入口） */
    this.door=this.buildDoor();world.appendChild(this.door);

    this.readSet={};
    MEI.Audio.setBgm('piano');
    this.renderToc();
    /* 读档恢复 */
    if(MEI.Puzzles.isSolved('M9')){
      /* M9 已解：门保持明亮，可直接进入 memory（等同 flashbacks 后状态） */
      this.lightDoor();
    }else if(MEI.state.collectibles.diary.length>=MEI.Data.diaryCount){
      /* 日记已集齐但碎片未解：直接进入排序，不必重翻日记 */
      setTimeout(()=>this.showM9(),400);
    }
    this._hintTimer=MEI.Hint.autoTimer('M9');
  },
  onExit(){ if(this._hintTimer)this._hintTimer(); },

  buildDoor(){
    return MEI.el('div',{class:'depth-door',id:'tr-door',style:{opacity:'.45'},
      onclick:()=>this.enterMemory()},
      MEI.el('div',{class:'door-frame'},
        MEI.el('div',{class:'door-gap'},MEI.el('div',{class:'door-warm'})),
        MEI.el('div',{class:'door-slab'},MEI.el('div',{class:'door-handle'}))),
      MEI.el('div',{class:'rh-label',style:{position:'absolute',bottom:'-26px'}},
        '门后是她最想留住的一天'));
  },

  renderToc(){
    this.tocEl.innerHTML='';
    MEI.Data.diary.forEach(d=>{
      const read=this.readSet[d.id];
      this.tocEl.appendChild(MEI.el('div',{class:'toc-item'+(read?' read':''),
        onclick:()=>this.readDiary(d)},(read?'📖':'🔒')+' '+d.date));
    });
  },

  readDiary(d){
    this.readSet[d.id]=true;
    MEI.addDiary(d.id);
    this.renderToc();
    const p=this.pageEl;p.innerHTML='';
    p.appendChild(MEI.el('div',{class:'diary-date'},d.date));
    const text=d.body;
    p.appendChild(MEI.el('div',{class:'diary-content',html:text.replace(/\n/g,'<br>')}));
    if(d.broken) p.appendChild(MEI.el('div',{class:'small',style:{'margin-top':'10px'}},
      '（残页边缘焦黑，很多字再也看不清了）'));
    MEI.Audio.typ();
    /* 全部读完 → 记忆碎片 */
    if(Object.keys(this.readSet).length>=MEI.Data.diary.length)
      setTimeout(()=>this.showM9(),600);
  },

  /* 残页碎片（可选阅读） */
  readFragment(fr){
    const p=this.pageEl;p.innerHTML='';
    p.appendChild(MEI.el('div',{class:'diary-date frag-date'},fr.title));
    p.appendChild(MEI.el('div',{class:'diary-content',html:fr.text.replace(/\n/g,'<br>')}));
    p.appendChild(MEI.el('div',{class:'small',style:{'margin-top':'12px','color':'#9a8a66'}},
      '（从日记本里掉出来的边页，不影响主线。）'));
    MEI.Audio.typ();
  },

  /* ---------- M9 记忆碎片排序（健壮排序组件，覆盖不丢片） ---------- */
  showM9(){
    this.m9zone.classList.remove('hidden');
    const z=this.m9zone;z.innerHTML='';
    this._m9=MEI.makeOrderPuzzle(z,{
      items:MEI.Data.memoryPieces.map(mp=>({id:mp.id,label:mp.label})),
      slotCount:3,
      correct:MEI.Data.memoryPieces.map(mp=>mp.id),
      positional:false,
      puzzleId:'M9',
      intro:'读完日记，碎片浮了上来。按发生的先后，把它们排好：',
      wrongLine:'先后顺序还差一点，点错的那一步可以拿回来重放。',
      onComplete:()=>{
        MEI.Puzzles.solve('M9',{flash:'碎片归位了。那一天，重新浮现在眼前……',
          onSolve:()=>this.flashbacks()});
      }
    });
  },

  /* 门变亮（闪回结束 / 读档恢复共用） */
  lightDoor(){
    const d=MEI.$('#tr-door');if(!d)return;
    d.style.opacity='1';
    const w=d.querySelector('.door-warm');
    if(w) w.style.background='linear-gradient(#ffe9b0,#ffb86b)';
  },

  /* 三段闪回（纯对话，无惊吓） */
  flashbacks(){
    const L=MEI.UI.lines;
    MEI.Dialogue.show([
      {speaker:'旁白',text:L.truth},
      {speaker:'旁白',text:'搬家那天，你把写着快乐家园网址的纸条夹进了一本旧课本，再没翻开过。'},
      {speaker:'旁白',text:'断网那天，她在留言本上写了又删，删了又写，最后只留下「快逃」。'},
      {speaker:'旁白',text:'后来你慢慢长大，作业、考试、新的朋友……你把那个 9 岁的小女孩，忘了。'},
      {speaker:'小美',text:'没关系的，阿树。忘记，又不是你的错呀。'}
    ],()=>{
      /* 门变亮 */
      this.lightDoor();
      MEI.Hint.flash('门后，是她最想留住的那一天。',4000);
    });
  },

  enterMemory(){
    if(!MEI.Puzzles.isSolved('M9')){
      MEI.Hint.flash('先读完日记，把记忆碎片排好。');return;
    }
    MEI.SceneController.goto('memory_day',{transition:'fade'});
  }
});
