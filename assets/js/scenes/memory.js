/* memory.js — P6 回忆：2003-08-15（窗景照片随进程切换；M10 折纸船 / M11 火灾序列） */
window.MEI = window.MEI || {};

MEI.registerScene({
  id:'memory_day',
  label:'第六幕 · 那一天',

  render(root){
    const world=MEI.el('div',{class:'memory-world',id:'mem-world'});
    root.appendChild(world);
    this.stage=MEI.el('div',{class:'m-stage',id:'m-stage'});
    this.phaseBox=MEI.el('div',{class:'m-phasebox',id:'m-phasebox'});
    world.appendChild(this.stage);world.appendChild(this.phaseBox);
    world.appendChild(MEI.el('div',{class:'m-timeind',id:'m-timeind'},'2003 年 8 月 15 日 · 白天'));
    MEI.Audio.setBgm('warm');
    this.phaseDay();
  },

  /* 用真实窗景照片替换 CSS 渐变窗 */
  setStage(img,label,worldCls){
    const w=MEI.$('#mem-world');
    w.className='memory-world '+(worldCls||'');
    MEI.$('#m-timeind').textContent=label;
    const s=this.stage;s.innerHTML='';
    const bg=MEI.el('div',{class:'m-photobg',style:{backgroundImage:`url("${img}")`}});
    s.appendChild(bg);
  },

  /* ---------- 白天 ---------- */
  phaseDay(){
    this.setStage('assets/img/memory/memory_day.jpg','2003 年 8 月 15 日 · 白天','day');
    const s=this.stage;
    /* 桌上信封（透明投放区，叠在照片上） */
    s.appendChild(MEI.el('div',{class:'m-envelope drop-zone',id:'m-envelope'},'信封'));
    const b=this.phaseBox;b.innerHTML='';
    const write=MEI.el('button',{class:'btn btn-primary',id:'m-write'},'帮她在留言本上写一句欢迎');
    b.appendChild(write);
    write.onclick=()=>{
      MEI.Dialogue.show([
        {speaker:'小美',text:'阿树明天晚上要来啦，我要把留言本写得满满的！'},
        {speaker:'小美',text:'你帮我写：「欢迎来玩，我一直都在呀～」'}
      ],()=>{
        write.disabled=true;write.textContent='留言写好了 ✓';
        this.afterWrite();
      });
    };
  },
  afterWrite(){
    const b=this.phaseBox;
    const tip=MEI.el('div',{class:'small',style:{'margin-top':'10px'}},
      '把小白花拖进桌上的信封，一起寄给明天：');
    const flower=MEI.el('div',{class:'drag-piece',id:'m-flower',
      style:{width:'60px',height:'60px',padding:'0',background:'transparent','border':'none'},
      html:MEI.pixelIcons.flower});
    b.appendChild(tip);b.appendChild(flower);
    MEI.makeDraggable(flower,{root:b,onDrop:(z)=>{
      if(z&&z.id==='m-envelope'){
        MEI.Audio.candleLit();
        MEI.Hint.flash('小花夹进了信封。她小心地封好口。');
        setTimeout(()=>this.phaseDusk(),1200);
      }
    }});
  },

  /* ---------- 黄昏：折纸船 M10 ---------- */
  phaseDusk(){
    this.setStage('assets/img/memory/memory_dusk.jpg','2003 年 8 月 15 日 · 黄昏','dusk');
    const b=this.phaseBox;b.innerHTML='';
    b.appendChild(MEI.el('div',{class:'small',style:{'margin-bottom':'6px'}},
      '江边。把折纸步骤按顺序拖进数字框，折一只小船：'));
    const slots=MEI.el('div',{style:{display:'flex',gap:'6px','justify-content':'center',flexWrap:'wrap'}});
    this.boatSlots=[];
    for(let i=0;i<6;i++){
      const z=MEI.el('div',{class:'drop-zone',style:{width:'96px',minHeight:'50px',
        'font-size':'12px',padding:'5px'}});
      z.appendChild(MEI.el('div',{class:'small',style:{color:'#888'}},`第${i+1}步`));
      z.dataset.slot=i;this.boatSlots.push(z);slots.appendChild(z);
    }
    const tray=MEI.el('div',{class:'piece-tray','justify-content':'center'});
    MEI.shuffle(MEI.Data.paperBoatSteps.slice()).forEach(st=>{
      const p=MEI.el('div',{class:'drag-piece',style:{'font-size':'12px',padding:'6px 8px',
        width:'96px','text-align':'center'}},st.label);
      MEI.makeDraggable(p,{root:b,onDrop:(z)=>this.dropBoat(z,p,st)});
      tray.appendChild(p);
    });
    b.appendChild(slots);b.appendChild(tray);
    this._hintTimer=MEI.Hint.autoTimer('M10');
  },
  dropBoat(z,piece,st){
    if(!z){ piece.remove();this.phaseDusk();return; }
    z.textContent=st.label;z.dataset.n=st.n;piece.style.display='none';
    const vals=this.boatSlots.map(x=>x.dataset.n||'');
    if(vals.every(Boolean)){
      const correct=MEI.Data.paperBoatSteps.map(x=>String(x.n)).join(',');
      if(vals.join(',')===correct){
        this.boatSlots.forEach(x=>x.classList.add('correct'));
        MEI.Puzzles.solve('M10',{flash:'小船折好了，放进江里，它慢慢漂远。',
          onSolve:()=>{ if(this._hintTimer)this._hintTimer();this.phaseNight(); }});
      }else{
        this.boatSlots.forEach(x=>x.classList.add('wrong'));MEI.Audio.error();
        setTimeout(()=>this.phaseDusk(),900);
      }
    }
  },

  /* ---------- 晚 8：聊天室 ---------- */
  phaseNight(){
    this.setStage('assets/img/memory/memory_night.jpg','2003 年 8 月 15 日 · 晚 8:00','night');
    const b=this.phaseBox;b.innerHTML='';
    const avatar=MEI.el('div',{class:'m-avatar',id:'m-avatar',title:'阿树（离线）'},'●');
    b.appendChild(avatar);
    b.appendChild(MEI.el('div',{class:'small'},'阿树的头像一直灰着，点一点看'));
    let clicks=0;
    avatar.onclick=()=>{
      clicks++;MEI.Audio.click();
      if(clicks===1) MEI.Hint.flash(MEI.choice(MEI.UI.lines.wait),2200);
      if(clicks===2) MEI.Hint.flash('（头像没有亮起来）',1800);
      if(clicks===3){
        MEI.Dialogue.show([
          {speaker:'小美',text:'阿树是不是搬家太忙啦……没关系，我再等一会儿。'},
          {speaker:'旁白',text:'她等到很晚，头像始终没有亮。她不知道的是，那天阿树家搬去了另一个城市，来不及告别。'}
        ],()=>this.phaseBedtime());
      }
    };
  },

  /* ---------- 睡前 ---------- */
  phaseBedtime(){
    this.setStage('assets/img/memory/memory_night.jpg','2003 年 8 月 15 日 · 深夜','night');
    const b=this.phaseBox;b.innerHTML='';
    b.appendChild(MEI.el('button',{class:'btn btn-primary',
      onclick:()=>{
        MEI.Dialogue.show([
          {speaker:'小美',text:'阿树，晚安。明天见呀，一定哦。'}
        ],()=>this.phaseFire());
      }},'对着漆黑的屏幕，轻轻道一声晚安'));
  },

  /* ---------- 凌晨：火灾 M11（光敏友好：不高频闪烁） ---------- */
  phaseFire(){
    this.setStage('assets/img/memory/memory_fire.jpg','2003 年 8 月 15 日 · 凌晨','fire');
    MEI.Audio.startFire();
    const b=this.phaseBox;b.innerHTML='';
    b.appendChild(MEI.el('div',{class:'small',style:{'margin-bottom':'8px'}},
      '火光惊醒了她。你只能拼命指挥她，按顺序做能做的事：'));
    const actions=MEI.Data.fireActions;
    this.fireOrder=[];
    const row=MEI.el('div',{style:{display:'flex',gap:'8px','justify-content':'center',flexWrap:'wrap'}});
    MEI.shuffle(actions.slice()).forEach(a=>{
      row.appendChild(MEI.el('button',{class:'btn',
        onclick:ev=>this.fireStep(a,ev.currentTarget)},a.label));
    });
    b.appendChild(row);
    b.appendChild(MEI.el('div',{id:'fire-log',class:'small',style:{'margin-top':'10px','min-height':'20px'}}));
    this._hintTimer=MEI.Hint.autoTimer('M11');
  },
  fireStep(a,btn){
    const correct=MEI.Data.fireActions;
    const i=this.fireOrder.length;
    if(a.id===correct[i].id){
      this.fireOrder.push(a);btn.disabled=true;btn.classList.add('done');
      MEI.Audio.click();
      MEI.$('#fire-log').textContent='她照做了：'+this.fireOrder.map(x=>x.label).join(' → ');
      if(this.fireOrder.length===correct.length){
        MEI.Puzzles.solve('M11',{flash:'她做对了每一件事……可是火，太大了。',
          onSolve:()=>this.fireInevitability()});
      }
    }else{
      MEI.Audio.error();
      MEI.$('#fire-log').textContent='来不及了，顺序不对，重新来！';
      MEI.$('#m-phasebox').querySelectorAll('button').forEach(x=>{
        x.disabled=false;x.classList.remove('done');});
      this.fireOrder=[];
    }
  },
  fireInevitability(){
    if(this._hintTimer)this._hintTimer();
    MEI.Dialogue.show([
      {speaker:'旁白',text:MEI.UI.lines.fire},
      {speaker:'小美',text:'……外婆，小宇，你们快跑。我、我折回去拿那封要寄给阿树的信……'},
      {speaker:'小美',text:'就一下下，我马上就出来。'}
    ],()=>{
      MEI.Audio.stopFire();
      MEI.SceneController.goto('finale',{transition:'fade'});
    });
  }
});
