/* endings.js — 三结局 + 片尾（严格对应 ui-text.js 数据） */
window.MEI = window.MEI || {};

function endingActions(sc){
  return MEI.el('div',{class:'ending-actions'},
    MEI.el('button',{class:'btn',onclick:()=>MEI.SceneController.goto('title',
      {transition:'fade'})},'回到标题'),
    MEI.el('button',{class:'btn btn-primary',
      onclick:()=>MEI.SceneController.goto('prologue',{transition:'fade'})},'再玩一次'));
}

function endingScene(id,label,build){
  MEI.registerScene({
    id,label,
    render(root){
      const sc=MEI.scenes[id];
      const box=MEI.el('div',{class:'ending-world',id:'ending-box'});
      root.appendChild(box);
      build.call(sc,box,root);
    },
    finishActions(){
      const box=MEI.$('#ending-box');
      box.appendChild(endingActions());
    },
    cemeteryInteract(box){ MEI.doCemetery(box); },
    credits(box){ MEI.doCredits(box); }
  });
}

/* ========== 结局一：逃走 ========== */
endingScene('ending_run','结局 · 离开',function(box){
  MEI.Audio.setBgm('off');
  const E=MEI.UI.endings.run;
  const steps=[
    {cls:'awake',text:E.wake},
    {cls:'stinger',text:E.stinger,beep:true,counter:'000114'}
  ];
  let i=0;
  const render=()=>{
    const st=steps[i];
    box.innerHTML='';box.className='ending-world '+st.cls;
    if(st.beep) MEI.Audio.countBeep();
    if(st.counter) box.appendChild(MEI.el('div',{class:'stinger-counter'},st.counter));
    box.appendChild(MEI.el('div',{class:'end-text'},st.text));
    i++;
    if(i>=steps.length) setTimeout(()=>MEI.doThanks(box,'run'),400);
  };
  box.onclick=()=>{ if(i<steps.length) render(); };
  render();
});

/* ========== 结局二：留下 ========== */
endingScene('ending_stay','结局 · 留下',function(box){
  MEI.Audio.setBgm('musicbox');
  const E=MEI.UI.endings.stay;
  const steps=[
    {cls:'bright',text:E.warm},
    {cls:'bright',text:E.note},
    {cls:'coma',text:E.reality}
  ];
  let i=0;
  const render=()=>{
    const st=steps[i];
    box.innerHTML='';box.className='ending-world '+st.cls;
    box.appendChild(MEI.el('div',{class:'end-text'+(st.cls==='bright'?' bright':'')},st.text));
    i++;
    if(i>=steps.length) setTimeout(()=>MEI.doThanks(box,'stay'),400);
  };
  box.onclick=()=>{ if(i<steps.length)render(); };render();
});

/* ========== 结局三：记得（真结局） ========== */
endingScene('ending_remember','结局 · 记得',function(box){
  MEI.Audio.setBgm('piano');
  const E=MEI.UI.endings.remember;
  let phase=0;
  const next=()=>{
    box.innerHTML='';
    if(phase===0){
      box.className='ending-world whitepage';
      box.appendChild(MEI.el('div',{class:'end-text'},E.line));
    }else if(phase===1){
      box.className='ending-world whitepage peace';
      box.appendChild(MEI.el('img',{class:'peace-img',src:'assets/img/depth/mei_peace.jpg',alt:''}));
      box.appendChild(MEI.el('div',{class:'end-text'},E.dissolve));
    }else if(phase===2){
      box.className='ending-world whitepage';
      box.appendChild(MEI.el('div',{class:'white-letter big'},E.whitePage));
    }else if(phase===3){
      box.className='ending-world cemetery';
      box.appendChild(MEI.el('div',{class:'cemetery-scene'},
        MEI.el('div',{class:'tomb'},
          MEI.el('div',{class:'tomb-stone'},'林美之墓'),
          MEI.el('div',{class:'tomb-offer',id:'tomb-offer'}))));
      box.appendChild(MEI.el('div',{class:'end-text'},E.cemetery));
      MEI.doCemetery(box);
      phase++;
      return;
    }else if(phase===4){
      box.className='ending-world awake';
      box.appendChild(MEI.el('div',{class:'end-text'},E.grandma));
      box.appendChild(MEI.el('div',{class:'screenshot-card'},
        MEI.el('div',{class:'ss-title'},'小美の快乐家园'),
        MEI.el('div',{class:'ss-complete'},E.complete)));
    }else{
      this.credits(box);return;
    }
    phase++;
  };
  box.onclick=()=>{ if(!box.classList.contains('cemetery-lock')) next(); };
  next();
});

/* ---------- 公墓互动：献花 + 点烛 ---------- */
MEI.doCemetery=function(box){
  box.classList.add('cemetery-lock');
  const offer=MEI.$('#tomb-offer');
  let flowerDone=false,candleDone=false;
  const flower=MEI.el('div',{class:'offer-item',html:MEI.pixelIcons.flower});
  const candle=MEI.el('div',{class:'offer-item',html:MEI.pixelIcons.candle});
  offer.appendChild(flower);offer.appendChild(candle);
  flower.onclick=()=>{ flowerDone=true;flower.classList.add('placed');
    MEI.Audio.candleLit();check(); };
  candle.onclick=()=>{ candleDone=true;candle.classList.add('placed');
    MEI.Audio.matchStrike();setTimeout(()=>MEI.Audio.candleLit(),200);check(); };
  function check(){ if(flowerDone&&candleDone){
    box.classList.remove('cemetery-lock');
    MEI.Hint.flash('花放好了，蜡烛也亮了。她不会再冷了。',3200); } }
};

/* ---------- 感谢游玩页（统一函数，按结局 kind 传入不同文案） ---------- */
/* 文案与作品内文字同质感：克制、具体，回扣访客编号 000113 与各结局事实。 */
MEI.thanksCopy = {
  remember:{
    eyebrow:'真结局 · 我记得',
    visitor:'访客 No.000113',
    title:'谢谢你，回来过',
    body:[
      '屏幕暗下去之前，她最后说的是——「谢谢你回来陪我玩」。',
      '这一次，你没有再走开。',
      '你是第 000113 个访客，也是第一个，真正回头的人。',
      '花我放下了，蜡烛也替你点着。截图寄到深圳那天，外婆终于哭了，也终于笑了。',
      '记得，就是另一种重逢。'
    ],
    sign:'—— 晚安，小美。',
    endrule:'全剧终 · 感谢你陪她玩到最后'
  },
  run:{
    eyebrow:'结局 · 离开',
    visitor:'访客 No.000113',
    title:'你又走了',
    body:[
      '门在身后合上。网页删了，邮件清了，像什么都没发生。',
      '可第二天深夜，那个文件自己回到了你的桌面。',
      '计数器从 000113，跳到了 000114。',
      '留言本上，她替你写下最后一行：「…你又走了」。',
      '你逃出来了。只是不知道，这一次换她，在门外继续等。'
    ],
    sign:'—— 谢谢你，来过。哪怕只是一小会儿。',
    endrule:'游戏结束'
  },
  stay:{
    eyebrow:'结局 · 留下',
    visitor:'访客 No.000113 · 停留中',
    title:'我不走了',
    body:[
      '你坐下的那一刻，快乐家园又亮成了 2003 年的样子。',
      '计数器永远停在 000113。你的头像，第一次没有再暗下去。',
      '留言本最后一行，是你替两个人写的：「…我来陪你了」。',
      '现实里的清晨，没人再能叫醒你。可在这里，她终于不是一个人了。',
      '谢谢你，选了留下来。'
    ],
    sign:'—— 这一次，换我们陪你。',
    endrule:'游戏结束'
  }
};

/* 底部按钮：再玩一次 / 回到标题 / 可选「给小美留盏灯」（仅派发事件，不直接引用赞赏模块） */
MEI.thanksButtons=function(){
  return MEI.el('div',{class:'ending-actions'},
    MEI.el('button',{class:'btn',
      onclick:()=>MEI.SceneController.goto('title',{transition:'fade'})},'回到标题'),
    MEI.el('button',{class:'btn btn-primary',
      onclick:()=>MEI.SceneController.goto('prologue',{transition:'fade'})},'再玩一次'),
    MEI.el('button',{class:'btn btn-lamp',title:'替小美把灯留着',
      onclick:()=>{ try{ window.dispatchEvent(new CustomEvent('mei:open-support')); }catch(e){} }},
      '给小美留盏灯'));
};

MEI.doThanks=function(box,kind){
  const C=MEI.thanksCopy[kind]||MEI.thanksCopy.remember;
  box.onclick=null;           /* 停止此前结局步进的点击推进 */
  box.innerHTML='';
  box.className='ending-world thanks thanks--'+kind;
  const body=C.body.map(line=>MEI.el('p',{},line));
  box.appendChild(MEI.el('div',{class:'thanks-card'},
    MEI.el('div',{class:'thanks-eyebrow'},C.eyebrow+'　·　'+C.visitor),
    MEI.el('div',{class:'thanks-title'},C.title),
    MEI.el('div',{class:'thanks-body'},body),
    MEI.el('div',{class:'thanks-sign'},C.sign),
    MEI.el('div',{class:'thanks-endrule'},'—— '+C.endrule+' ——'),
    MEI.thanksButtons()));
};

/* 片尾（真结局）= 完整感谢游玩页 */
MEI.doCredits=function(box){ MEI.doThanks(box,'remember'); };
