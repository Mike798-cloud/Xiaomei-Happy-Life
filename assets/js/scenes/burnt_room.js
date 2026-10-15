/* burnt_room.js — P4 烧焦房间：写实照片底 + 透明热点层 + Win9x 文件管理器（M5–M8） */
window.MEI = window.MEI || {};

/* 焦边：保留不规则烧焦撕裂门洞的破边（仅作门洞边框叠加，非人物） */
function holeEdgeSVG(){
 const S="M48 16 C40 10 32 16 31 28 C27 44 30 58 26 74 C22 92 27 106 25 124 C23 142 28 158 26 176 C25 192 29 206 34 210 C42 215 52 213 58 211 C66 208 70 200 73 186 C77 168 72 152 75 134 C78 116 72 102 75 86 C78 70 72 54 68 40 C65 26 58 12 48 16 Z";
 const M="M48 6 C38 1 29 9 27 26 C23 44 25 60 21 78 C18 98 23 112 20 130 C17 150 22 166 20 184 C19 202 24 218 32 223 C42 229 54 226 62 222 C72 217 76 206 79 190 C84 170 78 150 81 132 C84 112 79 98 82 82 C85 64 79 46 75 32 C72 18 60 1 48 6 Z";
 return `<svg viewBox="0 0 100 228" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <path d="${S}" fill="#000"/>
  <path d="M28 0 L66 0 L70 18 C60 10 52 14 46 8 C40 14 34 9 28 18 Z" fill="#060403"/>
  <path d="${M} ${S}" fill="#060403" fill-rule="evenodd"/>
  <path d="${M}" fill="none" stroke="#150d06" stroke-width="1.2" opacity=".8"/>
  <g fill="#2c1c0a">
   <path d="M21 78 l-9 2 l7 6 Z"/><path d="M82 190 l7 6 l-9 -1 Z"/>
  </g>
  <g fill="#050302">
   <path d="M24 26 l-11 -2 l9 8 Z"/><path d="M84 82 l10 -3 l-7 9 Z"/>
   <path d="M20 130 l-10 4 l9 5 Z"/><path d="M84 132 l10 3 l-8 6 Z"/>
   <path d="M20 184 l-8 8 l9 0 Z"/><path d="M86 56 l8 -6 l-6 9 Z"/>
   <path d="M22 52 l-10 -4 l7 9 Z"/><path d="M58 214 l9 9 l-12 -4 Z"/>
   <path d="M38 212 l-9 8 l11 -2 Z"/>
  </g>
 </svg>`;
}

/* 资源管理器小图标（folder/file/check/dot） */
const EXP_ICON={
 folder:`<svg width="13" height="11" viewBox="0 0 13 11"><path d="M0 2 h4 l1.5 1.5 H13 v6.5 H0 Z" fill="#e8c33a" stroke="#7a6410"/></svg>`,
 file:`<svg width="11" height="12" viewBox="0 0 11 12"><path d="M1 0 h6 l3 3 v9 H1 Z" fill="#e8ecf2" stroke="#5a6678"/><path d="M7 0 v3 h3" fill="#c4ccd8"/></svg>`,
 check:`<svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="1" width="10" height="10" fill="#e8ecf2" stroke="#5a6678"/><path d="M2.5 6 l2.5 2.5 L9.5 3.5" stroke="#1a5e1a" stroke-width="1.6" fill="none"/></svg>`,
 dot:`<svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="1" width="10" height="10" fill="#e8ecf2" stroke="#5a6678"/></svg>`
};

MEI.registerScene({
  id:'burnt_room',
  label:'第四幕 · 烧焦的房间',

  render(root){
    this.pcOpen=false;this._demoBusy=false;this._ashN=0;this.current=null;
    const world=MEI.el('div',{class:'depth-world br-photo',id:'br-world'});
    root.appendChild(world);

    /* 标题（压低存在感） */
    world.appendChild(MEI.el('div',{class:'depth-header'},
      MEI.el('div',{class:'depth-title small'},'小美の快乐家园')));

    /* LED 计数 */
    world.appendChild(MEI.el('div',{class:'led-counter tl',id:'led-tl'},'000113'));
    world.appendChild(MEI.el('div',{class:'led-counter tr',id:'led-tr'},'000113'));

    /* 左侧乱码资源管理器窗 */
    world.appendChild(this.buildExplorer());

    /* 墙面焦洞 + 焦边 + 白衣女孩写实照（洞在照片底图中央偏右） */
    this.hole=MEI.el('div',{class:'burnt-hole',id:'br-hole'},
      MEI.el('div',{class:'hole-edge',html:holeEdgeSVG()}),
      MEI.el('div',{class:'hole-dark'}),
      MEI.el('div',{class:'mei-ghost show',id:'br-ghost'},
        MEI.el('img',{src:'assets/img/depth/mei_ghost.jpg',alt:''})));
    world.appendChild(this.hole);

    /* 半开旧门 + 门缝眼 + 警示牌 */
    this.door=this.buildDoor();world.appendChild(this.door);

    /* 可拾取透明热点层（视觉来自底图，这里只是热区） */
    world.appendChild(MEI.el('div',{class:'room-hot rh-nightstand',id:'hot-nightstand',
      onclick:()=>this.getNightstand(world)}));
    world.appendChild(MEI.el('div',{class:'room-hot rh-candle-floor',id:'hot-candle',
      onclick:()=>this.getCandle(world)}));
    world.appendChild(MEI.el('div',{class:'room-hot rh-dried-flower',id:'hot-flower',
      onclick:()=>this.getFlower(world)}));
    world.appendChild(MEI.el('div',{class:'room-hot rh-desk',id:'hot-desk',
      onclick:()=>this.openPC(world)}));

    /* 环境里额外的可点物：灰烬堆（遗物特写） */
    world.appendChild(MEI.el('div',{class:'room-hot rh-ash',id:'hot-ash',
      onclick:()=>this.pokeAsh(world)}));

    this.world=world;
    /* 读档恢复：从已收集文件重建“已解码/已打开”，避免文件树回退为乱码、
       通往真相的门把“已找回 N 份”重新算成 0。 */
    this.decoded={}; this.opened={};
    (MEI.state.collectibles.files||[]).forEach(id=>{
      this.decoded[id]=true; this.opened[id]=true;
    });
    if(MEI.state.collectibles.files.includes('f6')) MEI.addItem('letter');
    MEI.Audio.setBgm('drone');
    if(MEI.state.purification>=50)world.classList.add('purified');
    if(MEI.state.purification>=60)MEI.$('#br-ghost').classList.remove('show');
    if(MEI.state.purification>=80)MEI.Audio.setBgm('piano');
    if(MEI.flag('returnToFinale'))world.appendChild(MEI.el('button',{class:'btn room-return',onclick:()=>MEI.SceneController.goto('finale')},'回到她身边'));
    this._hintTimer=MEI.Hint.autoTimer('M5');
  },
  onExit(){ if(this._hintTimer)this._hintTimer();
    if(this.pcOpen) this.closePC(true); },

  /* ---------- 遗物特写弹窗 ---------- */
  showRelic(img,caption){
    const layer=MEI.$('#modal-layer');
    const bd=MEI.el('div',{class:'relic-backdrop',
      onclick:()=>bd.remove()},
      MEI.el('div',{class:'relic-card',onclick:e=>e.stopPropagation()},
        MEI.el('img',{src:img,alt:''}),
        MEI.el('div',{class:'relic-cap'},caption),
        MEI.el('div',{class:'relic-close',onclick:e=>{e.stopPropagation();bd.remove();}},'× 凑近看完了')));
    layer.appendChild(bd);
  },

  /* 左侧损坏系统资源管理器：大量真实感的乱码文件行（时间戳/大小/类型） */
  buildExplorer(){
    const rows=[
      ['folder','WINDOWS','','文件夹','2003-08-11 09:12'],
      ['file','system.ini','3 KB','配置设置','2003-08-03 22:40'],
      ['file','Aogitates few Sialdy.sys','?? KB','系统文件','2003-08-15 23:58'],
      ['folder','Program Files','','文件夹','2003-07-20 18:02'],
      ['file','Cexpirineter, Shen.dll','?? KB','应用程序扩展','2003-08-16 01:07'],
      ['folder','D expriate Gieer','','文件夹','2003-07-30 20:11'],
      ['file','Smale Glacoral Oeep.exe','? KB','应用程序','2003-08-12 21:33'],
      ['dot','A Yte Sleen.bmp','144 KB','位图图像','2003-08-09 19:40'],
      ['folder','JopialaDte Sier','','文件夹','2003-08-01 12:00'],
      ['check','Cecprialte Cierr.txt','? KB','文本文档','2003-08-15 22:31'],
      ['file','R Jicpirnaiee Sheep.chm','8 KB','帮助文件','2003-07-28 15:26'],
      ['file','C Spnalte Sicecon.dat','? KB','数据文件','2003-08-16 01:09'],
      ['folder','Sthtelt Sier','','文件夹','2003-08-05 07:55'],
      ['file','C Xprialte Oilar Stacrp.???','0 KB','文件丢失','2003-08-16 01:10'],
      ['check','Cexpridieit Yeur Shaer.tmp','? KB','临时文件','2003-08-16 01:11'],
      ['file','Q Xartbeit 113.url','1 KB','Internet 快捷方式','2003-08-15 22:31'],
      ['file','C Joprialte Stiitep.htm','4 KB','文档','2003-08-15 23:02'],
      ['file','C Ineram','? KB','文件已损坏','2003-08-16 01:12'],
      ['file','B Spnale Cewn Slacrp.chk','66 KB','还原文件片段','2003-08-16 01:13'],
      ['folder','Found.000','','碎片存放','2003-08-16 03:00']
    ];
    const head=MEI.el('div',{class:'de-head'},
      MEI.el('span',{class:'dh-name'},'名称'),
      MEI.el('span',{class:'dh-size'},'大小'),
      MEI.el('span',{class:'dh-type'},'类型'),
      MEI.el('span',{class:'dh-date'},'修改日期'));
    const body=MEI.el('div',{class:'de-body'},
      rows.map(([ic,nm,size,type,date])=>MEI.el('div',{class:'de-row'},
        MEI.el('span',{class:'fi',html:EXP_ICON[ic]}),
        MEI.el('span',{class:'dh-name'},nm),
        MEI.el('span',{class:'dh-size'},size),
        MEI.el('span',{class:'dh-type'},type),
        MEI.el('span',{class:'dh-date'},date))));
    return MEI.el('div',{class:'depth-explorer',id:'br-explorer',
      onclick:()=>MEI.Hint.flash('文件名都在火里扭曲了。只有一个数字在好几个地方反复出现：113。')},
      MEI.el('div',{class:'de-title'},'C:\\ documents and settings\\ 小美 — 损坏的文件列表'),
      head,body,
      MEI.el('div',{class:'de-scroll'}));
  },

  buildDoor(){
    /* 门缝里的眼睛：写实照替换 SVG */
    const gap=MEI.el('div',{class:'door-gap'},
      MEI.el('div',{class:'gap-img'},
        MEI.el('img',{src:'assets/img/depth/door_eye.jpg',alt:''})));
    const sign=MEI.el('div',{class:'depth-sign',id:'br-sign',
      onclick:e=>{e.stopPropagation();this.decodeSign();}},
      MEI.el('div',{class:'ds-chain'}),
      MEI.el('div',{class:'ds-body',id:'sign-body',html:
        '<div class="ds-tri">⚠</div><div>IANGUD</div><div>PRAUT NCTA</div>'}));
    return MEI.el('div',{class:'depth-door hot',id:'br-door',
      onclick:()=>this.tryDoor()},
      MEI.el('div',{class:'door-frame'},gap),
      sign);
  },

  /* ---------- 拾取 ---------- */
  getNightstand(world){
    MEI.$('#hot-nightstand').classList.add('taken');
    MEI.addItem('diaryKey');MEI.addItem('floppy');
    MEI.Audio.unlock();
    this.showRelic('assets/img/depth/relic_floppy.jpg',
      '床头柜的焦木抽屉里，压着一本边角烧焦的小日记本，和一张被火燎黑、边缘熔化的 3.5 寸软盘。\n日记本扉页画着一行小字：往后数 5 个字母。');
  },
  getCandle(world){
    if(MEI.item('candle')){ this.showRelic('assets/img/depth/relic_candle.jpg',
      '那截烧残的白蜡烛头。烛芯微凉，旁边凝着一圈蜡油。'); return; }
    MEI.$('#hot-candle').classList.add('taken');
    MEI.addItem('candle'); MEI.Audio.matchStrike();
    this.showRelic('assets/img/depth/relic_candle.jpg',
      '灰烬里一小截烧残的白蜡烛头。你把它捡起来——它好像会按某种节奏，一下一下地明灭。');
  },
  getFlower(world){
    if(MEI.item('flower')){ this.showRelic('assets/img/depth/relic_flower.jpg',
      '焦黑瓦砾中，那朵干枯却仍保持白色的江边小花。'); return; }
    MEI.$('#hot-flower').classList.add('taken');
    MEI.addItem('flower'); MEI.Audio.candleLit();
    this.showRelic('assets/img/depth/relic_flower.jpg',
      '焦黑的瓦砾里，竟然还开着一朵干枯的白色小花——江边的那种，命最硬的花。');
  },
  pokeAsh(world){
    /* 可选：拨弄灰烬，异常随探索升级 */
    this._ashN=(this._ashN||0)+1;
    if(this._ashN===1){ this.showRelic('assets/img/depth/relic_diary.jpg',
      '你拨开灰烬，里面是一本边角烧焦的小日记本，用细绳拴着。它的锁，要等更多东西找回来才打得开。'); }
    else if(this._ashN===2){ MEI.Hint.flash('灰烬里又翻出半张烧焦的照片，影像已经认不出了。'); }
    else { MEI.Audio.breath(.3); MEI.Hint.flash('……你身后，那扇门的门缝，好像比刚才开了一点点。'); }
  },

  /* ---------- M7 警示牌 ---------- */
  decodeSign(){
    if(MEI.Puzzles.isSolved('M7')){ MEI.Hint.flash('牌子上写着：危险 · 勿入。'); return; }
    if(!MEI.item('diaryKey')){ MEI.Hint.flash('牌子上的字是一种你还不认得的写法。');return; }
    MEI.Puzzles.solve('M7',{flash:'牌子解开了：危险 · 勿入。门把手……变得有点烫。'});
    MEI.$('#sign-body').innerHTML='<div class="ds-tri">⚠</div><div>危险</div><div>勿入</div>';
  },
  tryDoor(){
    if(MEI.flag('returnToFinale')){MEI.SceneController.goto('finale');return;}
    const opened=Object.keys(this.opened).length;
    if(opened>=7){
      MEI.SceneController.goto('truth',{transition:'fade'});
    }else{
      MEI.Audio.doorCreak();
      MEI.Hint.flash(`门后是回忆，还差一点……（已找回 ${opened} 份文件）`,3200);
    }
  },

  /* ========== 旧电脑（Win9x 资源管理器） ========== */
  openPC(world){
    if(!MEI.item('diaryKey')){ MEI.Hint.flash('这台旧电脑锁着。房间里好像还有什么没找。');return; }
    if(this.pcOpen)return;
    MEI.Audio.winBoot();
    const overlay=MEI.el('div',{class:'pc-overlay',id:'pc-overlay'});
    /* 标题栏 */
    overlay.appendChild(MEI.el('div',{class:'pc-titlebar'},
      MEI.el('span',{},'小美の快乐家园 — 资源管理器'),
      MEI.el('span',{class:'pc-winbtns'},
        MEI.el('span',{onclick:()=>this.closePC(),title:'关闭'},'×'))));
    /* 菜单条 */
    overlay.appendChild(MEI.el('div',{class:'pc-menubar'},
      ['文件(F)','编辑(E)','查看(V)','转到(G)','收藏(A)','帮助(H)']
        .map(m=>MEI.el('span',{class:'pc-menu'},m))));
    /* 工具栏 */
    overlay.appendChild(MEI.el('div',{class:'pc-toolbar'},
      MEI.el('button',{class:'btn pc-tree-toggle',onclick:()=>overlay.classList.toggle('tree-visible')},'文件列表'),
      MEI.el('button',{class:'btn',onclick:()=>MEI.Hint.puzzle('M5')},'? 帮助'),
      MEI.el('span',{class:'tb-sep'}),
      MEI.el('span',{class:'small'},'地址：C:\\我的文档\\快乐家园'),
      MEI.el('span',{class:'small',style:{'margin-left':'auto','color':'#333'}},
        '红色＝乱码待修复 · 绿色＝可打开')));
    const screen=MEI.el('div',{class:'pc-screen'});
    this.treeEl=MEI.el('div',{class:'pc-tree',id:'pc-tree'});
    this.viewEl=MEI.el('div',{class:'pc-view',id:'pc-view'},
      MEI.el('div',{class:'doc-meta'},'快乐家园 · 我的电脑'),
      MEI.el('div',{class:'small'},'这里是她攒了很久的文件。左边那些红色的名字，都在那一夜的火里扭成了一团。'));
    screen.appendChild(this.treeEl);screen.appendChild(this.viewEl);
    overlay.appendChild(screen);
    /* 状态栏 */
    overlay.appendChild(MEI.el('div',{class:'pc-statusbar'},
      MEI.el('span',{},`对象 ${MEI.Data.pcFileCount} 个`),
      MEI.el('span',{},'可用磁盘空间：14.2 MB')));
    world.appendChild(overlay);
    this.pcOpen=true;
    this.renderTree();
  },
  closePC(silent){
    const o=MEI.$('#pc-overlay'); if(o)o.remove();this.pcOpen=false;
  },

  /* 给每个文件编一组拟真的大小/类型/日期 */
  fileMeta(f){
    const sizes={f1:'482 KB',f2:'36 KB',f3:'12 KB',f4:'文件夹',f5:'210 KB',
      f6:'8 KB',f7:'4 KB',f8:'6 KB',f9:'15 KB',f10:'文件夹'};
    const types={f1:'扫描图像',f2:'扫描图像',f3:'聊天记录',f4:'文件夹',f5:'报纸剪报',
      f6:'信件',f7:'HTML 文档',f8:'图片 (.jpg)',f9:'笔录文本',f10:'文件夹'};
    return {size:sizes[f.id]||'? KB', type:types[f.id]||'文件'};
  },

  renderTree(){
    const t=this.treeEl;t.innerHTML='';
    /* 桌面 / 我的文档 / 回收站 骨架 */
    t.appendChild(MEI.el('div',{class:'tree-item root'},'💻 桌面'));
    t.appendChild(MEI.el('div',{class:'tree-item folder open'},'📁 我的文档'));
    t.appendChild(MEI.el('div',{class:'tree-item subfolder'},'　📂 快乐家园'));
    MEI.Data.pcFiles.forEach(f=>{
      const isDecoded=this.decoded[f.id];
      const mm=this.fileMeta(f);
      const cls='tree-item fileline '+(isDecoded?'decoded':'encrypted')+
        (this.current===f.id?' opened':'');
      const label=isDecoded?f.name:f.enc;
      const row=MEI.el('div',{class:cls,onclick:()=>this.selectFile(f)});
      row.appendChild(MEI.el('span',{class:'tl-name'},(isDecoded?'📄':'🔒')+' '+label));
      row.appendChild(MEI.el('span',{class:'tl-size'},mm.size));
      row.appendChild(MEI.el('span',{class:'tl-type'},mm.type));
      t.appendChild(row);
    });
    t.appendChild(MEI.el('div',{class:'tree-item subfolder'},'　📂 我的图片'));
    t.appendChild(MEI.el('div',{class:'tree-item folder'},'🗑 回收站（空）'));
  },

  selectFile(f){
    MEI.$('#pc-overlay')?.classList.remove('tree-visible');
    this.current=f.id;
    this.renderTree();
    const v=this.viewEl;
    if(f.id==='f8'&&MEI.Puzzles.isSolved('M6')){this.decoded.f8=true;this.showDoc(f);return;}
    if(this.opened[f.id]){if(f.kind==='source')this.showSource(f);else this.showDoc(f);return;}
    if(!this.decoded[f.id]){ this.showDecoder(f); return; }
    if(f.kind==='lock-source'){ return this.openSourceLocked(f); }
    if(f.kind==='lock-morse'){ return this.openMorseLocked(f); }
    if(f.kind==='source'){ return this.showSource(f); }
    this.showDoc(f);
  },

  /* M5 字母转盘解码器 */
  showDecoder(f){
    const v=this.viewEl;v.innerHTML='';
    const holder=MEI.el('div');
    v.appendChild(MEI.el('div',{class:'doc-meta'},'乱码文件 — 字母转盘（她把字母都挪了位置）'));
    v.appendChild(holder);
    MEI.Cipher.renderDecoder(holder,f.enc,plain=>{
      if(plain==null){ return; }
      this.decoded[f.id]=true;MEI.Puzzles.solve('M5');
      this.renderTree();
      MEI.Hint.flash(`文件名回来了：${f.name}`);
      this.afterDecode(f);
    });
  },

  afterDecode(f){
    if(f.kind==='lock-source') MEI.Hint.flash('这个文件夹还上着锁。她好像把口令藏在了网页源代码里。',3800);
    else if(f.kind==='lock-morse') MEI.Hint.flash('这张残纸上画着点和划，桌上的蜡烛能照着它的节奏亮。',3800);
    else if(f.kind==='source'){ this.current=f.id;this.renderTree();this.showSource(f); }
    else { this.current=f.id;this.renderTree();this.showDoc(f); }
  },

  /* 普通文档：纸底图 + DOM 文字 */
  showDoc(f){
    const v=this.viewEl;v.innerHTML='';
    const paper=MEI.el('div',{class:'doc-paper'});
    if(f.paper) paper.style.backgroundImage=`url("${f.paper}")`;
    paper.appendChild(MEI.el('div',{class:'doc-meta'},f.meta));
    paper.appendChild(MEI.el('div',{class:'doc-body',style:{'white-space':'pre-wrap'}},f.body));
    v.appendChild(paper);
    if(!this.opened[f.id]){
      this.opened[f.id]=true;
      MEI.addFile(f.id);
      this.purify(f);
    }
    if(f.id==='f6') MEI.addItem('letter');
    this.checkProgress();
  },

  /* M8 源代码 */
  showSource(f){
    const v=this.viewEl;v.innerHTML='';
    const code=MEI.el('div',{class:'source-view'});
    code.innerHTML=
`<span class="sv-tag">&lt;html&gt;</span>
<span class="sv-tag">&lt;head&gt;</span>
  <span class="sv-tag">&lt;title&gt;</span>小美の快乐家园<span class="sv-tag">&lt;/title&gt;</span>
<span class="sv-tag">&lt;/head&gt;</span>
<span class="sv-tag">&lt;body&gt;</span>
  <span class="sv-tag">&lt;h1&gt;</span>小美の快乐家园<span class="sv-tag">&lt;/h1&gt;</span>
  <span class="sv-tag">&lt;div class="photos"&gt;</span><span class="sv-tag">&lt;/div&gt;</span>

<span class="sv-comment">&lt;!-- 阿树，如果你看到这里，说明你真的回来啦～
     照片夹的口令是我们第一次聊天的日子：0712
     我把想和你一起去的地方都画进去了，不许笑我画得丑哦 --&gt;</span>

<span class="sv-tag">&lt;/body&gt;</span>
<span class="sv-tag">&lt;/html&gt;`;
    v.appendChild(code);
    if(!this.opened[f.id]){ this.opened[f.id]=true;MEI.addFile(f.id);this.purify(f); }
    MEI.Puzzles.solve('M8',{flash:'源代码的注释里写着照片夹口令：0712。'});
    this.checkProgress();
  },
  openSourceLocked(f){
    MEI.askCode({title:'照片夹口令',placeholder:'4 位数字',maxLen:4,
      soft:'口令是第一次聊天的日子，藏在网页源代码的绿色注释里。',
      expected:f.password,
      onResult:r=>{ if(r!=null){ this.decoded[f.id]=true;this.renderTree();
        MEI.Hint.flash('咔哒，锁开了。');this.current=f.id;this.renderTree();this.showDoc(f); } }});
  },

  /* ========== M6 摩斯锁（视觉化：蜡烛明灭 + 纸上看得见的点划） ========== */
  openMorseLocked(f){
    if(!MEI.item('candle')){ MEI.Hint.flash('需要先在地上捡到那截蜡烛头。');return; }
    const v=this.viewEl;v.innerHTML='';
    v.appendChild(MEI.el('div',{class:'doc-meta'},'火场残纸 — 看得见的求救节奏'));
    const lock=MEI.el('div',{class:'morse-lock'},
      MEI.el('div',{class:'morse-paper'},
        MEI.el('img',{src:'assets/img/depth/morse_signal.jpg',alt:''})),
      MEI.el('div',{class:'morse-candlewrap'},
        MEI.el('div',{class:'morse-candle',id:'morse-candle'}),
        MEI.el('div',{class:'flame',id:'morse-flame'})),
      MEI.el('div',{class:'small'},'纸上面是 ··· −−− ···。点蜡烛，短亮一下＝「·」，长亮一下＝「—」。'),
      MEI.el('button',{class:'btn',id:'morse-demo'},'点一遍蜡烛给你看'),
      MEI.el('div',{class:'morse-readout',id:'morse-out'},''),
      MEI.el('div',{class:'morse-key'},
        MEI.el('button',{class:'btn',id:'mk-dot'},'· 短亮'),
        MEI.el('button',{class:'btn',id:'mk-dash'},'— 长亮'),
        MEI.el('button',{class:'btn',id:'mk-clear'},'擦掉重敲')));
    v.appendChild(lock);
    this.morseBuf='';
    MEI.$('#mk-dot').onclick=()=>this.morseKey('.');
    MEI.$('#mk-dash').onclick=()=>this.morseKey('-');
    MEI.$('#mk-clear').onclick=()=>{ this.morseBuf='';
      MEI.$('#morse-out').textContent=''; };
    MEI.$('#morse-demo').onclick=()=>this.playMorseDemo();
  },
  /* 用蜡烛的明灭把 SOS「演」一遍——纯视觉，不依赖声音 */
  playMorseDemo(){
    if(this._demoBusy)return;this._demoBusy=true;
    const flame=MEI.$('#morse-flame'),symbols='...---...';
    let i=0;
    const next=()=>{
      if(!flame.isConnected){this._demoBusy=false;return;}
      if(i===symbols.length){this._demoBusy=false;return;}
      const symbol=symbols[i++];flame.classList.add('on');MEI.Audio.click();
      MEI.Clock.setTimeout(()=>{
        flame.classList.remove('on');
        MEI.Clock.setTimeout(next,i%3===0?620:180);
      },symbol==='.'?180:540);
    };next();
  },
  morseKey(k){
    const flame=MEI.$('#morse-flame');
    flame.classList.add('on');
    MEI.Clock.setTimeout(()=>flame.classList.remove('on'), k==='.'?180:460);
    if(k==='.')MEI.Audio.morseDot();else MEI.Audio.morseDash();
    this.morseBuf+=k;
    MEI.$('#morse-out').textContent=this.morseBuf.replace(/\./g,'·').replace(/-/g,'—');
    if(this.morseBuf==='...---...'){
      MEI.Puzzles.solve('M6',{flash:'纸上的节奏对上了。锁「咔」地一声弹开。',
        onSolve:()=>{ this.decoded['f8']=true;this.renderTree();
          this.current='f8';this.renderTree();this.showDoc(MEI.Data.pcFiles.find(x=>x.id==='f8')); }});
    }else if(this.morseBuf.length>=9){
      MEI.Audio.error();this.morseBuf='';
      MEI.$('#morse-out').textContent='';
      MEI.Hint.flash('节奏不对。照纸上看：短三下、长三下、再短三下。');
    }
  },

  /* ---------- 净化 ---------- */
  purify(f){
    MEI.state.purification=Math.min(100,MEI.state.purification+10);
    const p=MEI.state.purification;
    const world=MEI.$('#br-world');
    if(p>=50) world.classList.add('purified');
    if(p>=60){ const g=MEI.$('#br-ghost');
      if(g){ g.classList.remove('show'); } }
    if(p>=80){ MEI.Audio.setBgm('piano'); }
  },

  checkProgress(){
    const n=Object.keys(this.opened).length;
    MEI.checkTrueEnding();
    if(n>=7){
      MEI.Hint.flash('里屋那扇半开的门，锁「咔嗒」一声开了。',4200);
    }
  }
});
