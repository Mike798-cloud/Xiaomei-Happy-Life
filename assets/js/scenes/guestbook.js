/* guestbook.js — P2 留言本（翻页 / M3 拼字 / M4 计数器密码） */
window.MEI = window.MEI || {};

MEI.registerScene({
  id:'guestbook',
  label:'第二幕 · 留言本',

  render(root){
    const world=MEI.el('div',{class:'surface-world'});
    root.appendChild(world);
    const m3done=MEI.Puzzles.isSolved('M3');
    this.page=0; this.perPage=4; this.flippedAll=m3done;
    this.buildWindow(world);
    MEI.Audio.setBgm('musicbox-slow');
    /* 读档恢复：M3 已解 → 不重弹拼字，直接回到 afterPuzzle 状态（跳转框保持激活） */
    if(m3done) this.afterPuzzle();
  },

  buildWindow(world){
    const win=MEI.el('div',{class:'win98',style:{'max-width':'780px'}});
    win.appendChild(MEI.el('div',{class:'win98-titlebar'},
      MEI.el('span',{},'留言本 — 小美の快乐家园'),
      MEI.el('div',{class:'win-btns'},
        MEI.el('span',{},'—'),MEI.el('span',{},'□'),
        MEI.el('span',{id:'gb-close-x',title:'关闭'},'×'))));

    /* 留言纸张 */
    this.paper=MEI.el('div',{class:'gb-paper scroll',id:'gb-paper'});
    this.gbHead=MEI.el('div',{class:'gb-head'},
      MEI.el('span',{class:'gbh-l'},'※ 小美の快乐家园 · 留言本 ※'),
      MEI.el('span',{id:'gb-stat'}));
    win.appendChild(MEI.el('div',{class:'guestbook-wrap'},this.gbHead,this.paper));

    /* 翻页 + 跳转 */
    const nav=MEI.el('div',{class:'gb-nav',style:{'margin':'6px 8px'}});
    nav.appendChild(MEI.el('button',{class:'btn',id:'gb-prev'},'◀ 上一页'));
    nav.appendChild(MEI.el('button',{class:'btn',id:'gb-next'},'下一页 ▶'));
    nav.appendChild(MEI.el('span',{class:'small',id:'gb-page-ind',style:{margin:'0 10px'}}));
    nav.appendChild(MEI.el('span',{style:{flex:'1'}}));
    this.jumpInput=MEI.el('input',{placeholder:'编号跳转',disabled:true,
      style:{width:'110px','font-family':'var(--f-mono)'}});
    this.jumpBtn=MEI.el('button',{class:'btn',disabled:true,id:'gb-jump'},'跳转');
    nav.appendChild(this.jumpInput);nav.appendChild(this.jumpBtn);
    win.appendChild(nav);

    /* M3 拼字（翻完才出现） */
    this.m3zone=MEI.el('div',{id:'m3-zone',class:'hidden',
      style:{'margin':'4px 8px 10px'}});
    win.appendChild(this.m3zone);

    win.appendChild(MEI.el('div',{class:'win98-statusbar'},
      MEI.el('div',{class:'sb-cell',id:'gb-hint'},'最后更新：2003·08·15 深夜'),
      MEI.el('div',{class:'sb-cell'},'她一直在等你')));
    world.appendChild(win);

    this.renderPage();
    this.bindNav();
    this.bindClose();
  },

  /* ---------- 分页 ---------- */
  totalPages(){ return Math.ceil(MEI.Data.guestbook.length/this.perPage); },
  avaColor(i){const cols=['#c05a6a','#5a8ac0','#6aa86a','#c0924a','#8a6ac0','#4aa8a8','#c06a92','#7a8ac0','#a87a4a','#5aa07a'];return cols[i%cols.length];},
  fakeIp(i){return `61.144.${(20+i*7)%240+8}.${(3+i*13)%240+8}`;},
  renderPage(){
    const p=this.paper;p.innerHTML='';
    const start=this.page*this.perPage;
    MEI.Data.guestbook.slice(start,start+this.perPage).forEach((g,k)=>{
      const idx=start+k;
      const entry=MEI.el('div',{class:'gb-entry'+(idx===0?' pinned':'')+(g.struck?' struck':'')});
      entry.appendChild(MEI.el('div',{class:'gb-ava',
        style:{background:this.avaColor(idx)}},g.name.slice(0,1)));
      const main=MEI.el('div',{class:'gb-main'});
      main.appendChild(MEI.el('div',{class:'gb-meta'},
        MEI.el('span',{class:'gb-name'},g.name),
        '　'+g.ts,
        MEI.el('span',{class:'gb-ip'},'来自 '+this.fakeIp(idx))));
      if(g.home||g.sign){
        main.appendChild(MEI.el('div',{class:'small gb-sub'},
          g.home?('主页：'+g.home):'',
          g.home&&g.sign?'　':'',
          g.sign?('签名：'+g.sign):''));
      }
      main.appendChild(MEI.el('div',{class:'gb-body'},g.body));
      if(g.reply) main.appendChild(MEI.el('div',{class:'gb-reply'},g.reply));
      entry.appendChild(main);
      p.appendChild(entry);
    });
    /* M3 已解时，“她认出你”的留言固定渲染在最后一页末尾，
       翻页再翻回不会消失（随页重建，而非一次性 append）。 */
    if(this.page===this.totalPages()-1 && MEI.Puzzles.isSolved('M3'))
      p.appendChild(this.recognitionEntry());
    MEI.$('#gb-page-ind').textContent=`${this.page+1}/${this.totalPages()}`;
    const stat=MEI.$('#gb-stat');
    if(stat) stat.textContent=`共 ${MEI.Data.guestbook.length} 条留言 · 第 ${this.page+1} / ${this.totalPages()} 页`;
    MEI.$('#gb-prev').disabled=this.page===0;
    MEI.$('#gb-next').disabled=this.page===this.totalPages()-1;
  },
  bindNav(){
    MEI.$('#gb-prev').onclick=()=>{ MEI.Audio.click();this.page--;this.renderPage(); };
    MEI.$('#gb-next').onclick=()=>{
      MEI.Audio.click();this.page++;this.renderPage();
      if(this.page===this.totalPages()-1 && !this.flippedAll){
        this.flippedAll=true;
        setTimeout(()=>this.buildPuzzle(),500);
      }
    };
    this.jumpBtn.onclick=()=>{
      const v=this.jumpInput.value.trim();
      if(v==='000113'||v==='113') this.showHidden113();
      else { MEI.Audio.error();MEI.Hint.flash('跳转框只接受一个 6 位数字……'); }
    };
  },

  /* ---------- M3 拼字（健壮排序组件，覆盖不丢字） ---------- */
  buildPuzzle(){
    const zone=this.m3zone;
    zone.classList.remove('hidden');zone.innerHTML='';
    MEI.$('#gb-hint').textContent='拼出被划改前的两个字';
    this._m3=MEI.makeOrderPuzzle(zone,{
      items:[{id:'kuai',label:'快'},{id:'lai',label:'来'},{id:'tao',label:'逃'}],
      slotCount:2,
      correct:['kuai','lai'],
      positional:false,
      puzzleId:'M3',
      intro:'最新的留言被人划改过。碎纸片压在下面，还能拼回去。',
      wrongLine:'「快逃」是后来改的，下面还压着别的。',
      onComplete:()=>{
        MEI.Puzzles.solve('M3',{flash:'碎纸片拼出了最早的两个字：「快来」。',
          onSolve:()=>this.afterPuzzle()});
      }
    });
  },

  /* “她认出你”留言节点（随最后一页渲染，可被反复重建而不丢失） */
  recognitionEntry(){
    const g=MEI.Data.guestbookRecognition;
    const e=MEI.el('div',{class:'gb-entry recognition'});
    e.appendChild(MEI.el('div',{class:'gb-ava',style:{background:'#3a1a2a'}},'她'));
    const m=MEI.el('div',{class:'gb-main'});
    m.appendChild(MEI.el('div',{class:'gb-meta'},
      MEI.el('span',{class:'gb-name'},g.name),
      '　'+g.ts,
      MEI.el('span',{class:'gb-ip'},'来自 127.0.0.1')));
    m.appendChild(MEI.el('div',{class:'gb-body'},g.body));
    e.appendChild(m);
    return e;
  },

  afterPuzzle(){
    MEI.flag('meiRecognized',true);
    /* 激活跳转框（M3 已解/M4 相关态不回退） */
    this.jumpInput.disabled=false;this.jumpBtn.disabled=false;
    /* 落最后一页：识别留言由 renderPage 追加，翻页后再翻回仍在 */
    this.page=this.totalPages()-1;
    this.renderPage();
    this.paper.scrollTop=this.paper.scrollHeight;
    MEI.Hint.flash('……她认出你了。',3600);
    MEI.$('#gb-hint').textContent='第 113 条留言，藏在编号跳转里。';
  },

  /* ---------- M4 隐藏留言 ---------- */
  showHidden113(){
    MEI.Puzzles.solve('M4');
    const layer=MEI.$('#modal-layer');
    const bd=MEI.el('div',{class:'modal-backdrop'});
    const faces=MEI.el('div',{style:{'font-size':'38px',textAlign:'center',
      'letter-spacing':'10px',animation:'scarePop .3s'}},'● ● ● ● ●');
    bd.appendChild(MEI.el('div',{class:'modal-win'},
      MEI.el('div',{class:'modal-titlebar'},MEI.el('span',{},'第 113 条留言')),
      MEI.el('div',{class:'modal-body'},
        faces,
        MEI.el('div',{class:'small',style:{'text-align':'center','margin':'8px 0'}},
          '（所有头像同时转向了你）'),
        MEI.el('div',{style:{'margin-top':'8px','line-height':'2'}},MEI.Data.hidden113.body)),
      MEI.el('div',{class:'modal-footer'},
        MEI.el('button',{class:'btn btn-primary',
          onclick:()=>{bd.remove();this.beginDarken();}},'……'))));
    layer.appendChild(bd);
  },

  /* ---------- 关窗失败 S5 ---------- */
  bindClose(){
    MEI.$('#gb-close-x').addEventListener('click',()=>{
      MEI.Audio.error();
      MEI.$('#gb-close-x').classList.add('buggy');
      MEI.Hint.flash('窗口……关不掉。',2000);
      setTimeout(()=>MEI.Audio.breath(MEI.choice([-.8,.8])),400);
      if(!MEI.Puzzles.isSolved('M4'))
        setTimeout(()=>MEI.Hint.flash('你自己的编号，好像就写在主页计数器上。'),2400);
    });
  },

  /* ---------- 变暗、焦黄 → 蜕皮 ---------- */
  beginDarken(){
    const world=MEI.$('.surface-world');
    world.classList.add('dimming');
    const burn=MEI.el('div',{style:{position:'absolute',inset:'0',pointerEvents:'none',zIndex:'30',
      boxShadow:'inset 0 0 120px rgba(180,80,20,.75)',border:'3px solid rgba(120,50,10,.6)'}});
    world.appendChild(burn);
    MEI.Audio.ghostCry();
    setTimeout(()=>{
      MEI.SceneController.goto('molting',{transition:'molt',mx:70,my:60});
    },3000);
  }
});
