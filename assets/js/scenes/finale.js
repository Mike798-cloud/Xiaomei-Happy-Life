/* finale.js — P7 黎明终章：三选一 + M12 告别仪式 */
window.MEI = window.MEI || {};

MEI.registerScene({
  id:'finale',
  label:'终章 · 黎明',

  render(root){
    const world=MEI.el('div',{class:'finale-world'});
    root.appendChild(world);
    /* 干净的小美（含泪微笑写实照） */
    const fig=MEI.el('div',{class:'finale-figure'},
      MEI.el('img',{src:'assets/img/depth/mei_clean.jpg',alt:''}));
    const panel=MEI.el('div',{class:'finale-panel',id:'finale-panel'});
    world.appendChild(fig);world.appendChild(panel);
    MEI.Audio.setBgm('finale');
    this.intro();
  },

  intro(){
    const L=MEI.UI.lines;
    MEI.Dialogue.show([
      {speaker:'旁白',text:L.finale},
      {speaker:'小美',text:'天快亮啦。阿树，这一次，你要怎么走呀？'},
      {speaker:'小美',text:'不管你怎么选，我都不会怪你的。真的哦。'}
    ],()=>this.showChoices());
  },

  showChoices(){
    const p=MEI.$('#finale-panel');p.innerHTML='';
    const choices=MEI.UI.finaleChoices;
    const canTrue=MEI.checkTrueEnding();
    const handlers={
      run:()=>MEI.SceneController.goto('ending_run',{transition:'fade'}),
      stay:()=>MEI.SceneController.goto('ending_stay',{transition:'fade'}),
      talk:()=>this.beginRitual()
    };
    choices.forEach(c=>{
      const disabled=!!c.needTrue&&!canTrue;
      const btn=MEI.el('button',{class:'btn finale-choice'+(disabled?' disabled':''),
        style:{display:'block',width:'100%','margin-bottom':'10px',padding:'12px','text-align':'left','line-height':'1.6'}});
      btn.appendChild(MEI.el('div',{},c.label));
      btn.appendChild(MEI.el('div',{class:'small',style:{color:'#666'}},'　'+c.sub));
      if(disabled) btn.appendChild(MEI.el('div',{class:'small',style:{'margin-top':'6px',color:'#a55'}},
        '尚未达成，还差：'+this.missingList()));
      btn.onclick=()=>{ if(disabled){MEI.Hint.flash('完成网页、集齐蜡烛、花和信，才能好好告别。');return;}
        MEI.Audio.click();handlers[c.id](); };
      p.appendChild(btn);
    });
  },

  missingList(){
    const files=MEI.state.collectibles.files.length;
    const miss=[];
    if(files<10) miss.push(`修复全部文件（${files}/10）`);
    if(!MEI.item('candle'))miss.push('蜡烛');
    if(!MEI.item('flower'))miss.push('小花');
    if(!MEI.item('letter'))miss.push('未发的信');
    return miss.join('、')||'无';
  },

  /* ---------- M12 告别仪式 ---------- */
  beginRitual(){
    const p=MEI.$('#finale-panel');p.innerHTML='';
    p.appendChild(MEI.el('div',{class:'small',style:{'margin-bottom':'10px'}},
      '好好地，和她告别。按顺序完成四件事：'));
    this.ritual=0;
    this.ritualBox=MEI.el('div',{class:'ritual-box'});
    p.appendChild(this.ritualBox);
    this.ritualStep();
  },
  ritualStep(){
    const b=this.ritualBox;b.innerHTML='';
    const steps=[
      ()=>{ b.appendChild(MEI.el('button',{class:'btn btn-primary',
        onclick:()=>{MEI.Audio.matchStrike();setTimeout(()=>MEI.Audio.candleLit(),260);
          MEI.Hint.flash('蜡烛点燃了，光很暖。');this.nextRitual();}},'① 划一根火柴，点燃蜡烛')); },
      ()=>{ b.appendChild(MEI.el('div',{style:{width:'60px',height:'60px',margin:'0 auto'},
        html:MEI.pixelIcons.flower}));
        b.appendChild(MEI.el('button',{class:'btn btn-primary',
          onclick:()=>{MEI.removeItem('flower');MEI.Audio.candleLit();
            MEI.Hint.flash('你把小白花轻轻放在她面前。');this.nextRitual();}},'② 献上那朵小白花')); },
      ()=>{ b.appendChild(MEI.el('button',{class:'btn btn-primary',
        onclick:()=>{
          const f6=MEI.Data.pcFiles.find(x=>x.id==='f6');
          MEI.Dialogue.show([{speaker:'小美',text:f6.body}],()=>this.nextRitual());
        }},'③ 读一读她没能发出的信')); },
      ()=>{
        b.appendChild(MEI.el('div',{class:'small',style:{'margin-bottom':'8px'}},
          '替当年的阿树，写一封回信：'));
        const ta=MEI.el('textarea',{class:'text-input',rows:'4',placeholder:MEI.UI.replyTemplate});
        b.appendChild(ta);
        b.appendChild(MEI.el('button',{class:'btn btn-primary',style:{'margin-top':'8px'},
          onclick:()=>{
            if(!ta.value.trim()){ MEI.Hint.flash('写点什么吧，哪怕只有一句。');return; }
            MEI.Puzzles.solve('M12',{flash:'回信写好了，和信封、小花放在一起。',
              onSolve:()=>setTimeout(()=>MEI.SceneController.goto('ending_remember',
                {transition:'fade'}),1200)});
          }},'④ 写下回信，完成告别'));
      }
    ];
    steps[this.ritual]();
  },
  nextRitual(){ this.ritual++; setTimeout(()=>this.ritualStep(),900); }
});
