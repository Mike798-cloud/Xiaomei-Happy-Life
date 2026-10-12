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
    if(i>=steps.length) setTimeout(()=>this.finishActions(),400);
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
    if(i>=steps.length) setTimeout(()=>this.finishActions(),400);
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

/* ---------- 片尾 ---------- */
MEI.doCredits=function(box){
  box.innerHTML='';box.className='ending-world credits';
  const c=MEI.UI.credits;
  box.appendChild(MEI.el('div',{class:'credits-box'},
    MEI.el('div',{class:'credits-line1'},c.line1),
    MEI.el('div',{class:'credits-line2'},c.line2),
    MEI.el('div',{class:'small',style:{'margin-top':'40px',color:'#888'}},
      '—— 全剧终 · 感谢你陪她玩 ——'),
    MEI.el('div',{class:'ending-actions',style:{'margin-top':'30px'}},
      MEI.el('button',{class:'btn',onclick:()=>MEI.SceneController.goto('title',
        {transition:'fade'})},'回到标题'))));
};
