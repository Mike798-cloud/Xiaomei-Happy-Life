/* molting.js — P3 蜕皮：深夜 2003 少儿聊天室（→ 氛围崩坏）→ 摸黑追逐 → 开机进烧焦房 */
window.MEI = window.MEI || {};

MEI.registerScene({
  id:'molting',
  label:'第三幕 · 蜕皮',

  render(root){
    this.root=root;
    const world=MEI.el('div',{class:'depth-world',id:'molting-world'});
    root.appendChild(world);
    this.world=world;
    MEI.Audio.setBgm('chaos');
    this.chatPhase();
  },
  onExit(){ this.clearChat(); if(this._iv)clearInterval(this._iv);
    if(this._cry)clearInterval(this._cry); MEI.Audio.stopFire(); },
  clearChat(){ if(this._chatT)this._chatT.forEach(clearTimeout); this._chatT=[]; },

  /* ================= 阶段一：深夜聊天室 ================= */
  chatUsers:[
    ['小美',true],['阿树',false],['快乐小猪',true],['糖果屋',true],['风一样的男子',true],
    ['小蜻蜓',true],['夜猫子',true],['猫猫',true],['老船长',true],['丁丁',true],
    ['棒棒糖',true],['阳光灿烂',true],['管理员-星星',true]
  ],
  chatScript:[
    ['sys','[20:00] 系统：欢迎来到「星星谷 · 月亮船」少儿聊天室。请文明聊天，不要告诉别人你家住哪儿哦。'],
    ['user','[20:01] 快乐小猪：大家晚上好呀 (^o^)'],
    ['user','[20:02] 糖果屋：作业写完了吗就来聊'],
    ['user','[20:03] 风一样的男子：早写完啦！明天去灌篮'],
    ['user','[20:04] 小蜻蜓：有人知道《魔力宝贝》怎么抓水龙蜥吗？急'],
    ['user','[20:05] 老船长：小朋友少玩网游，多看书'],
    ['user','[20:06] 夜猫子：（¯﹃¯）好无聊啊'],
    ['user','[20:14] 小美：阿树怎么还不上线呀……'],
    ['user','[20:30] 小美：他说今晚 8 点，要告诉人家一件很重要很重要的事'],
    ['user','[20:31] 快乐小猪：那个灰头像是谁呀？'],
    ['user','[20:32] 小美：是我最好的朋友。他会来的，他答应过。'],
    ['sys','[21:00] 系统：快乐小猪 离开了聊天室。'],
    ['user','[21:05] 糖果屋：我妈叫我睡觉了，886～'],
    ['sys','[21:05] 系统：糖果屋 离开了聊天室。'],
    ['user','[21:20] 风一样的男子：人怎么都走光了'],
    ['sys','[21:40] 系统：风一样的男子 离开了聊天室。'],
    ['sys','[22:00] 系统：小蜻蜓 夜猫子 老船长 丁丁 棒棒糖 阳光灿烂 离开了聊天室。'],
    ['user','[22:10] 小美：……没关系的。他一定是有很重要很重要的事。'],
    ['user','[22:31] 小美：那我把话留在这里，等你一上线就能看到。阿树晚安，明天见呀～']
  ],

  chatPhase(){
    const world=this.world;
    world.innerHTML='';
    /* Win9x 桌面底 */
    world.appendChild(MEI.el('div',{class:'chat-desktop'},
      MEI.el('div',{class:'chat-icon',style:{left:'6%',top:'12%'}},'💻\n我的电脑'),
      MEI.el('div',{class:'chat-icon',style:{left:'6%',top:'30%'}},'📁\n我的文档'),
      MEI.el('div',{class:'chat-icon',style:{left:'6%',top:'48%'}},'🗑\n回收站')));

    /* 聊天室窗口 */
    const win=MEI.el('div',{class:'chat-win',id:'chat-win'});
    win.appendChild(MEI.el('div',{class:'chat-titlebar'},
      MEI.el('span',{},'星星谷·月亮船 — 少儿聊天室（8 人在线）'),
      MEI.el('span',{class:'chat-mini'},'— □ ×')));
    win.appendChild(MEI.el('div',{class:'chat-menubar'},'聊天室(R)  用户(U)  动作(A)  好友(F)  帮助(H)'));
    const split=MEI.el('div',{class:'chat-split'});
    const body=MEI.el('div',{class:'chat-body',id:'chat-body'});
    body.appendChild(MEI.el('div',{class:'chat-sys'},'[20:00] 正在连接 chat.stargate.cn:16300 … 连接成功。'));
    split.appendChild(body);
    /* 在线用户列表 */
    const userlist=MEI.el('div',{class:'chat-users',id:'chat-users'});
    this.chatUsers.forEach(([n,on])=>{
      userlist.appendChild(MEI.el('div',{class:'cu'+(on?'':' off')},
        MEI.el('span',{class:'cu-dot'}),n));
    });
    split.appendChild(userlist);
    win.appendChild(split);
    win.appendChild(MEI.el('div',{class:'chat-inputbar'},
      MEI.el('span',{},'我对大家说：'),
      MEI.el('span',{class:'chat-input'},'（……你没有打字，只是看着）')));
    world.appendChild(win);

    /* 逐条把聊天打出来 */
    this._chatT=[];
    let delay=700;
    this.chatScript.forEach(([kind,txt])=>{
      this._chatT.push(setTimeout(()=>{
        if(!document.body.contains(world))return;
        const line=MEI.el('div',{class:'chat-line '+kind},txt);
        body.appendChild(line);
        body.scrollTop=body.scrollHeight;
        /* 用户随时间一个个灰掉 */
      },delay));
      delay+=640;
    });
    /* 聊完之后，房间开始「烂掉」 */
    this._chatT.push(setTimeout(()=>this.chatRot(),delay+500));
  },

  chatRot(){
    if(!document.body.contains(this.world))return;
    const body=MEI.$('#chat-body');
    if(body){
      body.appendChild(MEI.el('div',{class:'chat-line sys glitch'},
        '[??:??] 系统：……'));
      body.appendChild(MEI.el('div',{class:'chat-line user glitch'},
        '[???] 小美：阿树？是你回来了吗（）'));
      body.appendChild(MEI.el('div',{class:'chat-line user glitch'},
        '▓▓ ▓▓ ▓▓▓ 该用户不在 ▓▓'));
      body.scrollTop=body.scrollHeight;
    }
    /* 在线列表快速清空 */
    const ul=MEI.$('#chat-users');
    if(ul){ Array.from(ul.children).slice(2).forEach((c,i)=>
      setTimeout(()=>c.classList.add('off'),i*120)); }
    /* 黑屏降临按钮 */
    const world=this.world;
    const go=MEI.el('div',{class:'chat-go'},
      MEI.el('div',{class:'small',style:{'margin-bottom':'10px','color':'#cbb'}},
        '屏幕忽然发烫，灯一盏一盏地灭了。真正的房间，露了出来。'),
      MEI.el('button',{class:'btn btn-primary',onclick:()=>this.enterChase()},
        '摸黑，走到那张书桌前'));
    world.appendChild(go);
    MEI.Audio.ghostCry(-.5);
  },

  /* ================= 阶段二：摸黑追逐 ================= */
  enterChase(){
    this.clearChat();
    const world=this.world;
    world.classList.add('chasing');
    world.innerHTML='';
    world.appendChild(MEI.el('div',{class:'depth-floor'}));

    /* 焦洞黑影（写实照片压暗） */
    const hole=MEI.el('div',{class:'burnt-hole chase-hole'},
      MEI.el('div',{class:'hole-dark'}),
      MEI.el('div',{class:'mei-ghost',id:'chase-ghost'},
        MEI.el('img',{src:'assets/img/depth/mei_ghost.jpg',alt:''})));
    world.appendChild(hole);

    /* 三盏灯 */
    this.lights=[];
    [['12%','32%'],['46%','26%'],['72%','32%']].forEach((p,i)=>{
      const l=MEI.el('div',{class:'room-light',style:{left:p[0],top:p[1]},
        onclick:()=>this.lightSwitch(i)});
      const safe=MEI.el('div',{class:'light-safe',style:{left:p[0],top:p[1],
        width:'180px',height:'180px',transform:'translate(-40%,-30%)',opacity:0}});
      this.lights.push({l,safe});
      world.appendChild(safe);world.appendChild(l);
    });
    /* 书桌终点 */
    const desk=MEI.el('div',{class:'room-hot rh-desk',id:'chase-desk',
      onclick:()=>{ if(this.litCount>=3) this.bootPC(world);
        else MEI.Hint.flash('电脑太远太黑了。先把能摸到的灯都点亮。'); }},
      MEI.el('div',{class:'rh-label'},'旧电脑'));
    world.appendChild(desk);

    this.litCount=0; this.closeness=0; this.redEyeDone=false;
    MEI.Audio.startFire();
    setTimeout(()=>{const g=MEI.$('#chase-ghost');if(g)g.classList.add('show');},600);
    this._iv=setInterval(()=>this.tick(),700);
    this._cry=setInterval(()=>MEI.Audio.ghostCry(MEI.choice([-.7,.7])),4200);
  },

  lightSwitch(i){
    const o=this.lights[i];
    if(o.l.classList.contains('lit'))return;
    o.l.classList.add('lit'); o.safe.style.opacity='1';
    this.litCount++;
    MEI.Audio.matchStrike(); setTimeout(()=>MEI.Audio.candleLit(),200);
    this.closeness=Math.max(0,this.closeness-34);
    if(this.litCount>=3) MEI.Hint.flash('三盏灯都亮了。黑暗里，书桌那台旧电脑的方向，终于能看清了。',3400);
  },

  tick(){
    const rate=Math.max(1,7-this.litCount*2);
    this.closeness+=rate;
    const ghost=MEI.$('#chase-ghost');
    if(!ghost)return;
    const scale=1+this.closeness/160;
    ghost.style.transform=`translateX(-50%) scale(${scale})`;
    if(!this.redEyeDone&&this.closeness>40){
      this.redEyeDone=true;
      const f=MEI.el('div',{class:'red-eye-frame fire'},
        MEI.el('img',{src:'assets/img/depth/mei_ghost.jpg',
          style:{width:'min(600px,80%)','filter':'brightness(1.8) saturate(1.4) hue-rotate(-12deg)'}}));
      this.world.appendChild(f); setTimeout(()=>f.remove(),130);
    }
    if(this.closeness>=100) this.held();
  },

  held(){
    MEI.state.stats.held++;
    const black=MEI.el('div',{class:'chase-held'},
      MEI.el('div',{},'……'),
      MEI.el('div',{style:{'margin-top':'10px'}},MEI.UI.lines.held));
    this.world.appendChild(black);
    MEI.Audio.ghostCry();
    setTimeout(()=>{
      black.remove();
      this.closeness=10;
      const g=MEI.$('#chase-ghost'); if(g)g.style.transform='translateX(-50%) scale(1)';
    },2200);
  },

  bootPC(world){
    clearInterval(this._iv);clearInterval(this._cry);
    MEI.Audio.winBoot();
    const fl=MEI.el('div',{class:'chase-flash'},
      '（屏幕的反光里，她就站在你座椅的身后……）');
    world.appendChild(fl);
    MEI.Audio.doorCreak();
    setTimeout(()=>{ fl.remove();
      MEI.SceneController.goto('burnt_room',{transition:'instant'}); },2600);
  }
});
