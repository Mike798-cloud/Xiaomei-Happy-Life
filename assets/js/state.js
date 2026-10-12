/* state.js — 全局状态 / 场景控制器（状态机） */
window.MEI = window.MEI || {};

/* ---------- 默认状态 ---------- */
MEI.defaultState = function(){
  return {
    scene:'prologue',
    flags:{ meiRecognized:false, enteredDepth:false, remembered:false,
            accompanied:false, reducedScares:false, trueEndingReady:false },
    inventory:[],
    collectibles:{ diary:[], files:[], memory:[] },
    purification:0,
    readTexts:[],
    settings:{ master:.85, music:.7, sfx:.9, voice:.9,
               photosafe:true, crt:false, noise:false, vignette:false,
               textSpeed:'normal', lessScare:false, softHint:'normal' },
    stats:{ playSeconds:0, held:0, hintsUsed:0 },
    saveMeta:{}
  };
};

MEI.state = MEI.defaultState();
const S = ()=>MEI.state;

/* ---------- 便捷访问 ---------- */
MEI.flag = (k,v)=>{ if(v===undefined) return S().flags[k]; S().flags[k]=v; };
MEI.item = (name)=> S().inventory.includes(name);
MEI.addItem = name=>{ if(!MEI.item(name)){ S().inventory.push(name); MEI.refreshBag&&MEI.refreshBag(); } };
MEI.removeItem = name=>{ S().inventory = S().inventory.filter(x=>x!==name); };
MEI.addDiary = id=>{ if(!S().collectibles.diary.includes(id)) S().collectibles.diary.push(id); };
MEI.addFile = id=>{ if(!S().collectibles.files.includes(id)){ S().collectibles.files.push(id); MEI.refreshBag&&MEI.refreshBag(); } };
MEI.addMemory = id=>{ if(!S().collectibles.memory.includes(id)) S().collectibles.memory.push(id); };
MEI.markRead = id=>{ if(!S().readTexts.includes(id)) S().readTexts.push(id); };
MEI.isRead = id=> S().readTexts.includes(id);

/* ---------- 场景注册 ---------- */
MEI.scenes = {};
MEI.registerScene = scene=>{ MEI.scenes[scene.id]=scene; };

/* ---------- 场景控制器 ---------- */
MEI.SceneController = {
  current:null,
  node:null,

  canEnter(id){
    const sc=MEI.scenes[id];
    if(!sc) return false;
    if(sc.canEnter && !sc.canEnter()) return false;
    return true;
  },

  /* 切换场景
     opts.transition: 'instant' | 'fade' | 'molt'
     opts.moltFrom / moltTo 角度 */
  async goto(id,opts={}){
    if(!MEI.scenes[id]){ console.error('场景不存在:',id); return false; }
    const sc=MEI.scenes[id];
    if(sc.canEnter && !sc.canEnter()){
      MEI.Hint && MEI.Hint.flash(sc.lockedMsg||'现在还不能去那里。');
      return false;
    }
    const tr=opts.transition||'fade';

    if(this.current && MEI.scenes[this.current].onExit)
      MEI.scenes[this.current].onExit();

    if(tr==='molt') await this.playMolt(opts);
    else if(tr==='fade') await this.fadeToBlack();

    /* 切换 */
    this.build(id);

    if(tr==='molt') await this.playMoltReveal(opts);
    else if(tr==='fade') await this.fadeFromBlack();

    if(sc.onEnter) sc.onEnter();
    MEI.SaveManager && MEI.SaveManager.autoSave();
    this.showChapterLabel(sc);
    return true;
  },

  build(id){
    const layer=MEI.$('#screen-layer');
    if(this.node){ const old=this.node; old.classList.add('leaving');
      /* 旧节点仅保留退场动画：不再拦截点击，且移除其 id，
         使 render() 内的全局 MEI.$('#id') 一定命中新节点，
         避免“返回/重访后新画面控件没绑上事件 / 被旧节点挡住”。 */
      old.style.pointerEvents='none';
      old.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));
      setTimeout(()=>old.remove(),420); }
    const node=MEI.el('div',{class:'scene',id:'scene-'+id});
    layer.appendChild(node);
    this.node=node; this.current=id; S().scene=id;
    MEI.scenes[id].render(node);
    requestAnimationFrame(()=>node.classList.add('active'));
  },

  async fadeToBlack(){
    const tl=MEI.$('#transition-layer');
    tl.classList.add('fade');
    await MEI.wait(430);
  },
  async fadeFromBlack(){
    const tl=MEI.$('#transition-layer');
    await MEI.wait(120);
    tl.classList.remove('fade');
  },

  async playMolt(opts){
    const tl=MEI.$('#transition-layer');
    let molt=MEI.$('.molt',tl);
    if(!molt){ molt=MEI.el('div',{class:'molt'},
      MEI.el('div',{class:'molt-burn'}), MEI.el('div',{class:'molt-flat'}));
      tl.appendChild(molt); }
    molt.style.setProperty('--mx',(opts.mx||28)+'%');
    molt.style.setProperty('--my',(opts.my||30)+'%');
    molt.classList.add('burning');
    MEI.Audio && MEI.Audio.moltSound();
    MEI.spawnMoltParticles && MEI.spawnMoltParticles(2600);
    await MEI.wait(2650);
    molt.classList.remove('burning'); molt.classList.add('flat');
  },
  async playMoltReveal(){
    const tl=MEI.$('#transition-layer');
    const molt=MEI.$('.molt',tl);
    await MEI.wait(150);
    molt.classList.remove('flat');
    molt.classList.add('reveal');
    await MEI.wait(2250);
    molt.classList.remove('reveal');
  },

  showChapterLabel(sc){
    if(!sc.label) return;
    const box=MEI.$('.chapter-label')||
      MEI.$('#hud').appendChild(MEI.el('div',{class:'chapter-label'}));
    box.textContent=sc.label;
    box.classList.add('show');
    clearTimeout(this._clT);
    this._clT=setTimeout(()=>box.classList.remove('show'),3200);
  }
};

/* ---------- 设置应用 ---------- */
MEI.applySettings = function(){
  const b=document.body, st=S().settings;
  b.classList.toggle('photosensitive',st.photosafe);
  b.classList.toggle('crt-on',st.crt);
  b.classList.toggle('noise-on',st.noise);
  b.classList.toggle('vignette-on',st.vignette);
  b.classList.toggle('reduced-scares',st.lessScare);
  b.classList.toggle('no-motion',false);
  if(MEI.Audio) MEI.Audio.applyVolumes();
};

/* ---------- 真结局条件检查 ---------- */
MEI.checkTrueEnding = function(){
  const c=S().collectibles;
  const ready = c.diary.length>=MEI.Data.diaryCount &&
                c.files.length>=MEI.Data.pcFileCount &&
                S().inventory.includes('candle') &&
                S().inventory.includes('flower') &&
                S().inventory.includes('letter');
  S().flags.trueEndingReady=ready;
  return ready;
};
