/* main.js — 启动 / 标题 / HUD / 暂停 / 设置 / 存读档 */
window.MEI = window.MEI || {};

/* ============ 标题场景 ============ */
MEI.registerScene({
  id:'title',
  label:'标题',
  render(root){
    const t=MEI.el('div',{class:'title-world'});
    t.appendChild(MEI.el('div',{class:'title-split',
      style:{position:'absolute',inset:'0',
        background:'linear-gradient(rgba(6,5,14,.42),rgba(6,5,14,.58)), url(assets/img/ui/title_bg.jpg) center/cover no-repeat'}}));
    const card=MEI.el('div',{class:'title-card'},
      MEI.el('div',{class:'title-logo'},'小美の快乐家园'),
      MEI.el('div',{class:'title-sub'},'—— 一个关于等待与告别的故事 ——'),
      MEI.el('div',{class:'title-menu',id:'title-menu'},
        MEI.el('button',{class:'btn title-btn',id:'btn-new'},'新游戏'),
        MEI.el('button',{class:'btn title-btn',id:'btn-continue'},'继续游戏'),
        MEI.el('button',{class:'btn title-btn',id:'btn-settings'},'设置'),
        MEI.el('button',{class:'btn title-btn',id:'btn-about'},'关于 / 警告')),
      MEI.el('div',{class:'title-ver'},'v1.0 · 建议佩戴耳机 · 全程约 70–95 分钟'));
    t.appendChild(card);
    root.appendChild(t);
    MEI.Audio.setBgm('off');
    this.bindTitle();
  },
  bindTitle(){
    const cont=MEI.$('#btn-continue');
    cont.classList.toggle('disabled',!MEI.SaveManager.hasAny());
    MEI.$('#btn-new').onclick=()=>{ MEI.Audio.init();MEI.Audio.click();
      this.firstWarning(()=>{
        MEI.Puzzles.reset();
        MEI.state=MEI.defaultState();MEI.applySettings();
        MEI.SceneController.goto('prologue',{transition:'fade'});
      }); };
    cont.onclick=()=>{ if(cont.classList.contains('disabled')){
      MEI.Hint.flash('还没有存档。');return; }
      MEI.Audio.init();MEI.Audio.click();
      MEI.SaveManager.load('auto'); };
    MEI.$('#btn-settings').onclick=()=>{ MEI.Audio.init();MEI.Audio.click();
      MEI.openSettings(); };
    MEI.$('#btn-about').onclick=()=>{ MEI.Audio.click();MEI.openAbout(); };
  },
  firstWarning(then){
    if(MEI.state._warningSeen){ then();return; }
    MEI.openWarning(()=>{ MEI.state._warningSeen=true;then(); });
  }
});

/* ============ 首屏警告 / 关于 ============ */
MEI.openWarning=function(onAgree){
  const layer=MEI.$('#modal-layer');
  const W=MEI.UI.warning;
  const bd=MEI.el('div',{class:'modal-backdrop'});
  bd.appendChild(MEI.el('div',{class:'modal-win',style:{width:'430px'}},
    MEI.el('div',{class:'modal-titlebar'},MEI.el('span',{},W.title)),
    MEI.el('div',{class:'modal-body',style:{'line-height':'2'}},
      MEI.el('div',{},W.body),
      MEI.el('div',{class:'small',style:{'margin-top':'10px'}},W.modes)),
    MEI.el('div',{class:'modal-footer'},
      MEI.el('button',{class:'btn btn-primary',onclick:()=>{bd.remove();onAgree&&onAgree();}},
        '我已知晓，开始游戏'))));
  layer.appendChild(bd);
};
MEI.openAbout=function(){
  const layer=MEI.$('#modal-layer');
  const bd=MEI.el('div',{class:'modal-backdrop'});
  bd.appendChild(MEI.el('div',{class:'modal-win',style:{width:'440px'}},
    MEI.el('div',{class:'modal-titlebar'},MEI.el('span',{},'关于本作'),
      MEI.el('span',{class:'modal-close',onclick:()=>bd.remove()},'×')),
    MEI.el('div',{class:'modal-body',style:{'line-height':'1.9'}},
      MEI.el('div',{},'《小美の快乐家园》是一部原创叙事恐怖网页游戏。'),
      MEI.el('div',{},'前期以氛围与惊吓为主，后期转向哀伤与告别。'),
      MEI.el('div',{class:'small',style:{'margin-top':'10px'}},
        '全部画面由 HTML/CSS/SVG 绘制，全部音乐音效由 Web Audio 实时合成，无任何第三方素材。'),
      MEI.el('div',{class:'small',style:{'margin-top':'8px'}},
        '共 12 个谜题、3 种结局。修好网页、集齐蜡烛·花·信，可抵达真结局。')),
    MEI.el('div',{class:'modal-footer'},
      MEI.el('button',{class:'btn',onclick:()=>bd.remove()},'关闭'))));
  layer.appendChild(bd);
};

/* ============ 设置 ============ */
MEI.openSettings=function(){
  const layer=MEI.$('#modal-layer');
  const s=MEI.state.settings;
  const slider=(label,key)=>{
    const inp=MEI.el('input',{type:'range',min:0,max:1,step:.05,value:s[key]});
    inp.addEventListener('input',()=>{ s[key]=parseFloat(inp.value);
      MEI.applySettings(); });
    return MEI.el('div',{class:'setting-row'},
      MEI.el('label',{},label),inp);
  };
  const check=(label,key,extra)=>{
    const inp=MEI.el('input',{type:'checkbox'});inp.checked=s[key];
    inp.addEventListener('change',()=>{ s[key]=inp.checked;MEI.applySettings(); });
    return MEI.el('div',{class:'setting-row'},MEI.el('label',{},label),inp);
  };
  const radios=(label,key,opts)=>{
    const wrap=MEI.el('div',{class:'setting-row'},MEI.el('label',{},label));
    const rw=MEI.el('div',{});
    opts.forEach(o=>{
      const label=Array.isArray(o)?o[0]:o,val=Array.isArray(o)?o[1]:o;
      const r=MEI.el('label',{class:'radio-inline'},
        MEI.el('input',{type:'radio',name:key,value:val,
          ...(s[key]===val?{checked:true}:{}),
          onchange:()=>{s[key]=val;MEI.applySettings();}}),label);
      rw.appendChild(r);
    });
    wrap.appendChild(rw);return wrap;
  };

  const bd=MEI.el('div',{class:'modal-backdrop'});
  bd.appendChild(MEI.el('div',{class:'modal-win',style:{width:'460px'}},
    MEI.el('div',{class:'modal-titlebar'},MEI.el('span',{},'设置'),
      MEI.el('span',{class:'modal-close',onclick:()=>bd.remove()},'×')),
    MEI.el('div',{class:'modal-body scrollbox',style:{'max-height':'60vh'}},
      slider('主音量','master'),slider('音乐','music'),
      slider('音效','sfx'),slider('语音','voice'),
      radios('文字速度','textSpeed',[['慢','slow'],['正常','normal'],['快','fast']]),
      check('CRT 扫描线','crt'),check('画面噪点','noise'),
      check('暗角效果','vignette'),check('光敏警告（闪烁减弱）','photosafe'),
      check('减少惊吓（弱化突脸）','lessScare')),
    MEI.el('div',{class:'modal-footer'},
      MEI.el('button',{class:'btn btn-primary',onclick:()=>{
        MEI.SaveManager.autoSave();bd.remove();}},'完成'))));
  layer.appendChild(bd);
};

/* ============ 存读档 ============ */
MEI.openSlots=function(mode){
  const layer=MEI.$('#modal-layer');
  const bd=MEI.el('div',{class:'modal-backdrop'});
  const list=MEI.el('div',{});
  const refresh=()=>{
    list.innerHTML='';
    [1,2,3].forEach(n=>{
      const meta=MEI.SaveManager.meta(n);
      const info=meta?`${meta.label} · 日记${meta.diaries} · ${fmtTime(meta.ts)}`
        :'（空槽）';
      const row=MEI.el('div',{class:'slot-row'},
        MEI.el('div',{},`💾 槽位 ${n}`),
        MEI.el('div',{class:'small',style:{flex:'1'}},info),
        MEI.el('button',{class:'btn',
          onclick:()=>{ if(MEI.SaveManager.save(n)){ MEI.Hint.flash('已保存到槽位 '+n);
            refresh(); } }},'保存'),
        MEI.el('button',{class:'btn btn-primary',disabled:!meta,
          style:meta?{}:{opacity:.4},
          onclick:()=>{ if(meta){bd.remove();MEI.SaveManager.load(n);} }},'读取'));
      list.appendChild(row);
    });
  };
  refresh();
  bd.appendChild(MEI.el('div',{class:'modal-win',style:{width:'480px'}},
    MEI.el('div',{class:'modal-titlebar'},MEI.el('span',{},'保存 / 读取'),
      MEI.el('span',{class:'modal-close',onclick:()=>bd.remove()},'×')),
    MEI.el('div',{class:'modal-body'},list,
      MEI.el('div',{class:'small',style:{'margin-top':'8px'}},
        '游戏同时会在切换场景时自动存档（“继续游戏”读取自动存档）。')),
    MEI.el('div',{class:'modal-footer'},
      MEI.el('button',{class:'btn',onclick:()=>bd.remove()},'关闭'))));
  layer.appendChild(bd);
};
function fmtTime(ts){ const d=new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`; }

/* ============ 暂停菜单 ============ */
MEI.togglePause=function(force){
  const m=MEI.$('#pause-menu');
  const show=force!=null?force:m.classList.contains('hidden');
  if(show){
    if(MEI.state.scene==='title')return;
    m.classList.remove('hidden');
  }else m.classList.add('hidden');
};

/* ============ HUD ============ */
MEI.updateHUD=function(){
  const hud=MEI.$('#hud');
  const sc=MEI.state.scene;
  const inGame=sc!=='title'&&!sc.startsWith('ending');
  hud.classList.toggle('hidden',!inGame);
};

/* ============ 启动 ============ */
document.addEventListener('DOMContentLoaded',()=>{
  /* 绑定 HUD */
  MEI.$('#hud-pause').onclick=()=>MEI.togglePause(true);
  MEI.$('#hud-bag').onclick=()=>MEI.toggleBag();
  /* 暂停菜单 */
  MEI.$('#pm-resume').onclick=()=>MEI.togglePause(false);
  MEI.$('#pm-save').onclick=()=>MEI.openSlots();
  MEI.$('#pm-settings').onclick=()=>MEI.openSettings();
  MEI.$('#pm-title').onclick=()=>{ MEI.togglePause(false);
    MEI.SceneController.goto('title',{transition:'fade'}); };
  /* ESC 暂停 */
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      if(!MEI.$('#pause-menu').classList.contains('hidden')) MEI.togglePause(false);
      else MEI.togglePause(true);
    }
  });

  /* 场景切换后刷新 HUD（包裹 showChapterLabel） */
  const orig=MEI.SceneController.showChapterLabel;
  MEI.SceneController.showChapterLabel=function(sc){
    orig.call(this,sc);MEI.updateHUD();
  };

  /* 隐藏 boot loading，进入标题 */
  const bl=MEI.$('#boot-loading');if(bl)bl.remove();
  MEI.applySettings();
  MEI.SceneController.goto('title',{transition:'instant'});
});
