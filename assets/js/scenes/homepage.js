/* homepage.js — P1 表层主页：写实老照片 + 有真实体量的 2003 儿童主页 */
window.MEI = window.MEI || {};

/* ---------- 小物件图标（蜡烛/白花/血信封/纸船，非人物，保留） ---------- */
MEI.pixelIcons = {
 candle:`<svg viewBox="0 0 48 76" xmlns="http://www.w3.org/2000/svg">
  <defs>
   <radialGradient id="flame" cx="50%" cy="66%" r="70%">
    <stop offset="0" stop-color="#fff7c0"/><stop offset="40%" stop-color="#ffd24a"/><stop offset="78%" stop-color="#ff8a1e"/><stop offset="100%" stop-color="#ff5a1e" stop-opacity="0"/></radialGradient>
   <linearGradient id="cbody" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#d9d9d9"/><stop offset=".5" stop-color="#f6f6f6"/><stop offset="1" stop-color="#c6c6c6"/></linearGradient>
  </defs>
  <ellipse cx="24" cy="20" rx="15" ry="20" fill="#ffb43d" opacity=".28"/>
  <ellipse cx="24" cy="18" rx="8" ry="13" fill="url(#flame)" class="flame-flick"/>
  <ellipse cx="24" cy="20" rx="3.4" ry="7" fill="#fffbe0"/>
  <rect x="23" y="26" width="2.2" height="7" fill="#3a3328"/>
  <rect x="17" y="32" width="14" height="32" rx="2" fill="url(#cbody)"/>
  <ellipse cx="24" cy="32" rx="7" ry="3" fill="#efefef"/>
  <path d="M19 40 q1.5 8 -1 14" stroke="#cfcfcf" stroke-width="1.6" fill="none"/>
  <ellipse cx="24" cy="66" rx="13" ry="4" fill="#bdbdbd"/>
  <rect x="12" y="63" width="24" height="6" rx="2" fill="#d2d2d2" stroke="#8a8a8a" stroke-width=".8"/>
 </svg>`,
 flower:`<svg viewBox="0 0 64 72" xmlns="http://www.w3.org/2000/svg">
  <defs><radialGradient id="fctr" cx="50%" cy="45%" r="60%">
   <stop offset="0" stop-color="#fff0a0"/><stop offset="100%" stop-color="#f0b800"/></radialGradient></defs>
  <path d="M32 40 v28" stroke="#3c8a48" stroke-width="3.4"/>
  <path d="M32 52 C24 48 20 50 16 54 C22 56 28 55 32 52 Z" fill="#4aa357"/>
  <path d="M32 58 C40 54 44 56 48 60 C42 62 36 61 32 58 Z" fill="#439a50"/>
  <g stroke="#d7d7d7" stroke-width="1">
   <ellipse cx="32" cy="17" rx="8.4" ry="11.6" fill="#fdfdfd"/>
   <ellipse cx="20" cy="22" rx="8.4" ry="11.6" fill="#fdfdfd" transform="rotate(-32 20 22)"/>
   <ellipse cx="44" cy="22" rx="8.4" ry="11.6" fill="#fdfdfd" transform="rotate(32 44 22)"/>
   <ellipse cx="22" cy="35" rx="8.4" ry="11.6" fill="#f6f6f6" transform="rotate(-68 22 35)"/>
   <ellipse cx="42" cy="35" rx="8.4" ry="11.6" fill="#f6f6f6" transform="rotate(68 42 35)"/>
  </g>
  <circle cx="32" cy="27" r="8" fill="url(#fctr)"/>
  <g fill="#b98700"><circle cx="29" cy="25" r=".9"/><circle cx="35" cy="25" r=".9"/><circle cx="30" cy="29" r=".9"/><circle cx="34" cy="29" r=".9"/><circle cx="32" cy="27" r=".9"/></g>
 </svg>`,
 letter:`<svg viewBox="0 0 66 58" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="9" width="58" height="42" fill="#f4f2ef" stroke="#8a8a8a" stroke-width="1.2"/>
  <path d="M4 9 L33 33 L62 9" fill="none" stroke="#b7b2ab" stroke-width="2"/>
  <path d="M4 51 L25 28 M62 51 L41 28" stroke="#d9d4cd" stroke-width="1.6"/>
  <path d="M14 14 L52 46 M52 14 L14 46" stroke="#a01616" stroke-width="2.2" opacity=".85"/>
  <path d="M33 25 C27 25 24 30 27 35 C29 39 33 40 33 40 C33 40 37 39 39 35 C42 30 39 25 33 25 Z" fill="#c01818"/>
  <path d="M33 40 C32 45 34 49 31 53 C36 50 35 45 33 40 Z" fill="#a81414"/>
 </svg>`
};

/* ---------- 相册照片清单（IMAGE_MANIFEST 第3节 + 已有 photo_at_home） ---------- */
MEI.albumPhotos = [
 {src:'photo_at_home.jpg', cap:'我在家里的小床边，外婆说这张拍得最乖。', date:'7·15', back:null},
 {src:'photo_family.jpg',  cap:'全家福：外婆、我、小宇。三个人挤在照相馆的布幕前面。', date:'7·18', back:null,
   note:'（最边上的阴影里，好像还站着一个人……）'},
 {src:'photo_grandma.jpg',cap:'外婆和我。她笑起来满脸都是褶子，我最喜欢靠在她肩上。', date:'7·22', back:null},
 {src:'photo_birthday.jpg',cap:'今年的生日。就一小个蛋糕，没有客人，可蜡烛吹得很响。', date:'7·28', back:null},
 {src:'photo_hospital.jpg',cap:'住院的日子。床头柜上有纸和折了一半的小船，窗外月亮好圆。', date:'8·01', back:null},
 {src:'photo_window.jpg', cap:'从我房间望出去：江边的屋顶，灯一盏一盏亮起来。', date:'8·03', back:null},
 {src:'photo_river_day.jpg', cap:'江边的滩涂。我放了两只小纸船，一只给我，一只给阿树。', date:'8·05', back:null},
 {src:'photo_fireflies.jpg',cap:'江边的萤火虫。阿树说数满一百颗，我的病就全好了。', date:'8·07', back:null},
 {src:'photo_ferris.jpg',  cap:'城郊游乐园的摩天轮。等我病好了，阿树要带我去坐。', date:'8·09', back:null},
 {src:'photo_city.jpg',    cap:'要去开刀的地方。外婆说那里的楼好高好高，我有点怕。', date:'8·11', back:null},
 {src:'photo_school.jpg',  cap:'教室。我的座位空着，桌上没有人，椅子也没有摆好。', date:'8·12', back:null},
 {src:'photo_gift.jpg',    cap:'给阿树的小礼物：一朵小白花、两只纸船、一封没封口的信。', date:'8·13', back:'promise'},
 {src:'photo_boats_close.jpg', cap:'两只小纸船，被我捧在手心里。船上写了字，你别偷看哦。', date:'8·14', back:'promise'},
 {src:'photo_broken.jpg',  cap:'8·16。这张照片怎么也加载不出来了，半边是黑的。', date:'8·16', broken:true,
   note:'（文件已经损坏，只剩一个模糊的双马尾影子。）'}
];

MEI.registerScene({
  id:'homepage',
  label:'第一幕 · 快乐家园',

  render(root){
    const world=MEI.el('div',{class:'surface-world'});
    root.appendChild(world);
    this.clues={birthday:false,promise:false,doodle:false};
    this.buildWindow(world);
    this.scheduleAnomalies(world);
    MEI.Audio.setBgm('musicbox');
  },

  buildWindow(world){
    const win=MEI.el('div',{class:'win98'});
    win.appendChild(MEI.el('div',{class:'win98-titlebar'},
      MEI.el('span',{},'小美の快乐家园 — Microsoft Internet Explorer'),
      MEI.el('div',{class:'win-btns'},
        MEI.el('span',{},'—'),MEI.el('span',{},'□'),
        MEI.el('span',{class:'buggy',title:'关闭（无响应）'},'×'))));
    win.appendChild(MEI.el('div',{class:'rainbow-banner'},
      MEI.el('div',{class:'rb-text'},'小美の快乐家园')));

    const track=MEI.el('div',{class:'marquee-track',id:'marquee-track'},
      MEI.el('span',{},MEI.UI.marquee.p1),MEI.el('span',{},MEI.UI.marquee.p1));
    win.appendChild(MEI.el('div',{class:'marquee-bar'},
      MEI.el('div',{class:'marquee-mini'},MEI.el('i',{class:'tb-ico tb-win'}),MEI.el('i',{class:'tb-ico tb-candle'})),
      MEI.el('div',{class:'marquee-viewport'},track),
      MEI.el('div',{class:'marquee-num',id:'counter-num'},'1'),
      MEI.el('div',{class:'marquee-arrow'},MEI.el('span',{},'▲'),MEI.el('span',{},'▼'))));

    win.appendChild(this.buildHomeGrid());
    win.appendChild(this.buildToolStrip());

    win.appendChild(MEI.el('div',{class:'guestbook-wrap'},
      MEI.el('div',{class:'gb-titlebar'},'留言本 · 最新几条'),
      MEI.el('div',{class:'gb-paper',style:{'min-height':'64px','padding':'8px 16px'}},
        MEI.el('div',{},'…她一直在等你'),
        MEI.el('div',{class:'gb-entry struck'},MEI.el('span',{class:'gb-body'},'快逃')),
        MEI.el('div',{},'…'),
        MEI.el('div',{class:'gb-nav'},
          MEI.el('a',{style:{color:'#0000ee'},
            onclick:()=>MEI.SceneController.goto('guestbook')},'[ 查看全部留言 / 给我留言 ]'),
          MEI.el('span',{class:'small'},'')))));

    win.appendChild(MEI.el('div',{class:'win98-statusbar'},
      MEI.el('div',{class:'sb-cell'},'建议深夜独自浏览'),
      MEI.el('div',{class:'sb-cell',id:'clue-status'},'线索 0/3'),
      MEI.el('div',{class:'sb-cell',id:'online-clock'},'在线 00:00')));
    world.appendChild(win);
    this.tickClock();
  },

  tickClock(){
    const sec=MEI.state.stats.playSeconds||0;
    const mm=String(Math.floor(sec/60)).padStart(2,'0'),ss=String(sec%60).padStart(2,'0');
    const el=MEI.$('#online-clock'); if(el) el.textContent='在线 '+mm+':'+ss;
    this._clock=setInterval(()=>{ const e=MEI.$('#online-clock'); if(!e){clearInterval(this._clock);return;}
      const s=MEI.state.stats.playSeconds||0;
      e.textContent='在线 '+String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0'); },1000);
  },

  buildHomeGrid(){
    /* 写实老照片：双马尾红眼女孩 */
    const photo=MEI.el('div',{class:'photo-frame photo-frame-real'},
      MEI.el('div',{class:'photo-rim'}),
      MEI.el('img',{src:'assets/img/surface/mei_portrait.jpg',alt:'小美的照片',
        class:'portrait-img',draggable:false,onerror:e=>{e.currentTarget.parentNode.classList.add('img-missing');}}),
      MEI.el('div',{class:'photo-tape tape-l'}),
      MEI.el('div',{class:'photo-tape tape-r'}),
      MEI.el('div',{class:'photo-heart'},'♥'),
      MEI.el('div',{class:'photo-caption'},'小美 · 9 岁 · 临江市'));

    photo.addEventListener('click',()=>{
      MEI.Audio.hover();
      MEI.Hint.flash('照片里的女孩，眼睛红红的，像哭过。');
    });

    const nav=MEI.el('div',{class:'nav-col'},
      MEI.el('a',{onclick:()=>this.openSub('about')},'关于小美'),
      MEI.el('a',{class:'locked',onclick:()=>{MEI.Audio.error();
        MEI.Hint.flash('日记本合着，钥匙不知道放在哪里了。')}},'美の日记'),
      MEI.el('a',{onclick:()=>this.onPhotosNav()},'我的照片'),
      MEI.el('a',{onclick:()=>this.openSub('friends')},'好朋友们'),
      MEI.el('a',{onclick:()=>MEI.SceneController.goto('guestbook')},'给我留言'));

    const signInner=MEI.el('div',{class:'sign-text',id:'cons-text'},
      MEI.el('div',{},'建设中……'),MEI.el('div',{},'我在你身后'));
    const signBox=MEI.el('div',{class:'construction-sign',id:'cons-sign',
      onclick:()=>MEI.Puzzles.solve('M7',{flash:'警示牌背面有人用指甲刻了字：「危险，别进那扇门」。'})},
      MEI.el('div',{class:'sign-posts l'}),MEI.el('div',{class:'sign-posts r'}),signInner);
    const sign=MEI.el('div',{class:'construction-wrap'},signBox);

    const icons=MEI.el('div',{class:'pixel-icons'},
      MEI.el('div',{class:'px-icon',title:'一支不会灭的蜡烛',
        onclick:()=>{MEI.Audio.candleLit();MEI.Hint.flash('一支永远不会灭的蜡烛，像他答应的那样。');},
        html:MEI.pixelIcons.candle}),
      MEI.el('div',{class:'px-icon',title:'江边的小白花',
        onclick:()=>{MEI.Audio.hover();MEI.Hint.flash('江边的小白花，她最喜欢了。');},
        html:MEI.pixelIcons.flower}),
      MEI.el('div',{class:'px-icon',title:'一封没能发出的信',
        onclick:()=>{MEI.Audio.hover();MEI.Hint.flash('一封写满爱心、却没能发出的信。');},
        html:MEI.pixelIcons.letter}));

    const right=MEI.el('div',{class:'right-col'},
      MEI.el('div',{class:'counter-box'},
        MEI.el('div',{class:'counter-line'},
          MEI.el('span',{class:'mini-led'}),
          MEI.el('span',{},'你是第'),
          MEI.el('span',{class:'num-val',id:'counter-val'},'000113')),
        MEI.el('div',{class:'counter-sub',id:'counter-sub'},'个没能离开的人')),
      sign, icons);

    return MEI.el('div',{class:'home-grid',style:{'padding-top':'6px'}},
      MEI.el('div',{class:'photo-nav'},photo,nav),right);
  },

  /* ---------- 「我的照片」入口：M1 数字锁 ---------- */
  onPhotosNav(){
    MEI.Audio.click();
    if(MEI.Puzzles.isSolved('M1')){ this.openSub('photos'); return; }
    this.openNumberLock();
  },

  openNumberLock(){
    const layer=MEI.$('#modal-layer');
    const digits=[0,0,0];
    const rollers=[];
    const bd=MEI.el('div',{class:'modal-backdrop lock-backdrop'});
    const win=MEI.el('div',{class:'lock-win'});
    win.appendChild(MEI.el('div',{class:'lock-titlebar'},
      MEI.el('span',{},'🔒 小日记本 · 三位数字锁'),
      MEI.el('span',{class:'lock-close',onclick:()=>{bd.remove();}},'×')));
    win.appendChild(MEI.el('div',{class:'lock-body'},
      MEI.el('div',{class:'lock-hint'},'锁着一本贴满贴纸的小日记本。\n一位一位拨，对上了才能打开。'),
      MEI.el('div',{class:'lock-digits'},digits.map((_,i)=>{
        const r=MEI.el('div',{class:'lock-roller'},
          MEI.el('div',{class:'lock-up',onclick:()=>{digits[i]=(digits[i]+1)%10;
            rollers[i].textContent=digits[i];MEI.Audio.hover();}},'▲'),
          MEI.el('div',{class:'lock-num'},String(digits[i])),
          MEI.el('div',{class:'lock-down',onclick:()=>{digits[i]=(digits[i]+9)%10;
            rollers[i].textContent=digits[i];MEI.Audio.hover();}},'▼'));
        rollers.push(r.querySelector('.lock-num'));
        return r;
      })),
      MEI.el('div',{class:'lock-actions'},
        MEI.el('button',{class:'btn',onclick:()=>bd.remove()},'再想想'),
        MEI.el('button',{class:'btn btn-primary',id:'lock-ok'},'打开'))));
    bd.appendChild(win);
    layer.appendChild(bd);

    const tryOpen=()=>{
      if(digits.join('')==='100'){
        MEI.Puzzles.solve('M1',{flash:'「咔哒」一声，日记本翻开了。'});
        bd.remove();
        this.openSub('photos');
      }else{
        MEI.Audio.error();
        win.classList.add('lock-wrong');
        MEI.Hint.flash('锁没开……数字好像不对。');
        setTimeout(()=>win.classList.remove('lock-wrong'),420);
      }
    };
    win.querySelector('#lock-ok').onclick=tryOpen;
  },

  /* ---------- 工具条：MIDI 歌单 + 多投票 + 长友情链接 ---------- */
  buildToolStrip(){
    const strip=MEI.el('div',{class:'tool-strip'});

    /* MIDI 点歌 */
    const songs=['小美の八音盒.mid','小燕子（电子琴版）.mid','让我们荡起双桨.mid','听妈妈讲那过去的事情.mid',
      '萤火虫之光.mid','外婆的澎湖湾.mid','同一首歌（简版）.mid','回家.mid'];
    const midiCell=MEI.el('div',{class:'ts-cell ts-midi-list'},
      MEI.el('span',{class:'midi-title'},'♫ 点歌台：'));
    songs.forEach((s,i)=>{
      midiCell.appendChild(MEI.el('a',{class:'midi-song'+(i===0?' playing':''),
        onclick:e=>{MEI.Audio.click();
          MEI.$$('.midi-song',midiCell).forEach(x=>x.classList.remove('playing'));
          e.currentTarget.classList.add('playing');
          MEI.Hint.flash('正在播放：'+s);}},s));
    });
    strip.appendChild(midiCell);

    /* 投票 */
    const vote=MEI.el('div',{class:'ts-cell ts-vote'},
      MEI.el('span',{class:'midi-title'},'✉ 小投票：'));
    const mk=(q,opts,res)=>{
      const head=MEI.el('div',{class:'vote-q'},q);
      const body=MEI.el('div',{});
      opts.forEach(o=>body.appendChild(MEI.el('label',{},
        MEI.el('input',{type:'radio',name:'v-'+q.slice(0,4)}),o)));
      const r=MEI.el('div',{class:'vote-result',style:{display:'none'}},res);
      head.appendChild(body);head.appendChild(r);
      body.addEventListener('change',()=>{head.querySelector('.vote-q').style.display='none';
        r.style.display='block';MEI.Audio.unlock();});
      return head;
    };
    vote.appendChild(mk('小美会不会好起来？',['一定会','希望会'],
      '已有 112 人投了「一定会」，你是第 113 个。'));
    strip.appendChild(vote);

    /* 友情链接（多数已失效） */
    const links=[['阿树的小窝',false],['江边萤火虫观测站',true],['2003 儿童网页大全',true],
      ['外婆的菜园',true],['临江市一小·四年级（2）班',true],[' OICQ 皮肤下载站',true],
      ['江南校友录',true],['折纸船教程',true],['少儿聊天室·怀旧版',true],
      ['摩天轮游乐园门票',true],['临江市中心医院',true],['深圳打工同乡会',true],
      ['百度知道·临江',true],['开心网（内测）',true]];
    const linkCell=MEI.el('div',{class:'ts-cell ts-links'},
      MEI.el('span',{class:'links-label'},'友情链接▶'));
    links.forEach(([n,dead])=>{
      linkCell.appendChild(MEI.el('a',{class:dead?'dead':'',title:dead?'该页无法显示':'去看看',
        onclick:()=>dead?MEI.Hint.flash('「'+n+'」——该页无法显示。'):MEI.Hint.flash('链接早就失效了，只剩下一行褪色的字。')},n));
    });
    strip.appendChild(linkCell);
    return strip;
  },

  /* ================= 子页面 ================= */
  openSub(kind){
    MEI.Audio.click();
    const host=MEI.$('.win98')||MEI.$('.surface-world');
    /* 关掉旧的 */
    MEI.$$('.subpage',host).forEach(x=>x.remove());
    const titles={about:'关于小美',photos:'我的照片',friends:'好朋友们'};
    const sub=MEI.el('div',{class:'subpage'},
      MEI.el('div',{class:'subpage-titlebar'},
        MEI.el('span',{},titles[kind]),
        MEI.el('span',{class:'subpage-close',onclick:()=>sub.remove()},'×')),
      MEI.el('div',{class:'subpage-body scrollpage'},this.subContent(kind)));
    host.appendChild(sub);
  },

  subContent(kind){
    if(kind==='about') return this.aboutPage();
    if(kind==='photos') return this.photosPage();
    return this.friendsPage();
  },

  /* ---------- 关于小美 ---------- */
  aboutPage(){
    const f=document.createDocumentFragment();
    f.appendChild(MEI.el('div',{class:'page-welcome'},'✿ 欢迎来到小美的快乐家园 ✿'));

    const row=(k,v)=>MEI.el('tr',{},MEI.el('td',{class:'tk'},k),MEI.el('td',{},v));
    const table=MEI.el('table',{class:'profile-table'},
      row('昵称','小美'),
      row('真名','林美'),
      row('生日','1994 年 3 月 14 日（双鱼座）'),
      row('年龄','9 岁'),
      row('所在地','江边的小城 · 临江市老城坡筒子楼'),
      row('血型','A 型'),
      row('身体','先天性心脏病（医生说要去上海开刀）'),
      row('爱好','画画、折小纸船、趴在窗边看江、在聊天室等一个人'),
      row('最喜欢的颜色','白色'),
      row('最喜欢的花','江边的小白花'),
      row('最喜欢的人','外婆、小宇，还有阿树'),
      row('口头禅','「我在你身后」'),
      row('OICQ','1600-1200（头像常常是灰的）'),
      row('主页建立','2003 年 7 月 12 日'));
    f.appendChild(MEI.el('div',{class:'sub-h'},'★ 个人资料 ★'));
    f.appendChild(table);

    f.appendChild(MEI.el('div',{class:'sub-h'},'★ 站长的话 ★'));
    f.appendChild(MEI.el('div',{class:'prose'},
      '大家好呀，我是小美～欢迎来到我的快乐家园！',
      MEI.el('br'),MEI.el('br'),
      '我因为身体不好，不能像别的小朋友一样天天去学校，也很少能出门。大部分时间，我都趴在窗边，看外面的小朋友背着书包放学，看江边的灯一盏一盏亮起来。外婆说，我这病要去上海开刀，开完刀，我就能跑、能跳、能去坐摩天轮了。',
      MEI.el('br'),MEI.el('br'),
      '去年爸妈去深圳打工了，小宇还小，留在家里跟我和外婆过。我最想的就是妈妈打电话来的时候，能多叫我两声小美。',
      MEI.el('br'),MEI.el('br'),
      '后来外婆用攒下来的钱，给我买了一台可以拨号上网的电脑。我在网上认识了阿树。他是第一个说我名字好听的人，也是我最好的、唯一的好朋友。他教我写密码、折小船，还陪我在江边数萤火虫——他说，数满一百颗，病就全好了。',
      MEI.el('br'),MEI.el('br'),
      '如果你路过这里，记得给我留言哦。哪怕只写一个字也好——我会知道，有人来过，有人记得小美。'));

    /* 今日运势 / 心情 */
    f.appendChild(MEI.el('div',{class:'sub-h'},'★ 今日心情 · 3·14 双鱼座运势 ★'));
    f.appendChild(MEI.el('div',{class:'fortune-box'},
      MEI.el('div',{},'心情：' + (MEI.Puzzles.isSolved('M1')?'有点紧张，可是又有点开心':'在等阿树上线')),
      MEI.el('div',{},'幸运色：白色'),
      MEI.el('div',{},'幸运数字：' + (MEI.Puzzles.isSolved('M1')?'100（萤火虫的数目）':'？？？')),
      MEI.el('div',{},'今日宜：折纸船、数萤火虫、给阿树写信'),
      MEI.el('div',{},'今日忌：一个人走江边的夜路')));

    /* 贴纸 */
    f.appendChild(MEI.el('div',{class:'sub-h'},'★ 我的贴纸收藏 ★'));
    f.appendChild(MEI.el('div',{},
      MEI.el('span',{class:'sticker',id:'sticker-bd',
        onclick:e=>{ if(!this.clues.birthday){ this.clues.birthday=true;
          MEI.addItem('note-birthday'); MEI.Audio.unlock();
          this.updateClueStatus(); MEI.Hint.flash('贴纸背面写着：「生日 3·14，阿树不许忘」。');
          e.currentTarget.style.background='#cfe8cf'; } } },'🎂 生日贴纸'),
      MEI.el('span',{class:'sticker'},'⭐'),MEI.el('span',{class:'sticker'},'🧸'),
      MEI.el('span',{class:'sticker'},'✿'),MEI.el('span',{class:'sticker'},'🎀'),
      MEI.el('span',{class:'sticker'},'🌙'),MEI.el('span',{class:'sticker'},'🐳'),
      MEI.el('span',{class:'sticker'},'🎈')));

    /* 更新日志 */
    f.appendChild(MEI.el('div',{class:'sub-h'},'★ 更新日志 ★'));
    const logs=[
      ['07-12','NEW! 快乐家园建好啦，拨号上网的声音好好听～欢迎来玩！'],
      ['07-13','NEW! 加了「关于小美」，把我的小房间拍了照传上来。'],
      ['07-19','NEW! 学会了写密码！加了「好朋友们」栏目，阿树说我写得对。'],
      ['07-22','外婆给我煮了糖水蛋，她笑起来好暖。我偷偷把她拍下来了。'],
      ['08-02','重新装修！加了「我的照片」，把想去的地方都写在背面。'],
      ['08-08','今天去江边放了纸船，数到 63 颗萤火虫就累了，明天接着数。'],
      ['08-09','NEW! 和阿树约好啦，8 月 15 日晚 8 点，聊天室见，谁都不许迟到。'],
      ['08-12','老师说我的座位空着，让我早点回学校。上海的手术定在 18 号。'],
      ['08-14','给阿树的信写好了，折成小船放在礼物里。明天就能见到他了。'],
      ['08-15','（这一天的日志，只有一片焦黑的痕迹，字是用指甲划出来的）'],
      ['08-16','……（光标在这一行后面闪了很久，没有人再敲下一个字）']
    ];
    f.appendChild(MEI.el('ul',{class:'update-log'},
      logs.map(([d,t],i)=>MEI.el('li',{class:i>=9?'log-dark':''},MEI.el('b',{},d+'  '),t))));
    f.appendChild(MEI.el('div',{class:'small',style:{'margin-top':'10px'}},
      '（页面上的年龄数字，好像偶尔会自己变……）'));
    return f;
  },

  /* ---------- 我的照片（M1 解锁后） ---------- */
  photosPage(){
    const f=document.createDocumentFragment();
    f.appendChild(MEI.el('div',{class:'page-welcome'},'✿ 我的照片（都是家里拍的旧照片）✿'));
    f.appendChild(MEI.el('div',{class:'small',style:{'text-align':'center','margin-bottom':'10px'}},
      '（日记本翻开了，照片一张一张插在透明袋里。有些照片，能翻到背面看。）'));

    const grid=MEI.el('div',{class:'album-grid'});
    MEI.albumPhotos.forEach(p=>{
      const item=MEI.el('figure',{class:'photo-item'+(p.broken?' broken-item':'')});
      const polaroid=MEI.el('div',{class:'polaroid photo-polaroid'+(p.broken?' broken-photo':'')});
      const img=MEI.el('img',{src:'assets/img/surface/'+p.src,alt:p.cap,loading:'lazy',
        class:'album-img',draggable:false,
        onerror:e=>{e.currentTarget.style.display='none';
          e.currentTarget.parentNode.classList.add('img-missing');}});
      polaroid.appendChild(img);
      if(p.broken){
        polaroid.appendChild(MEI.el('div',{class:'broken-overlay'},'照片已烧毁'));
      }
      item.appendChild(polaroid);
      const cap=MEI.el('figcaption',{},
        MEI.el('b',{},p.date),MEI.el('br'),p.cap);
      if(p.note) cap.appendChild(MEI.el('div',{class:'small photo-note'},p.note));
      if(p.back==='promise'){
        const flip=MEI.el('button',{class:'btn btn-small flip-btn',
          onclick:()=>this.showPhotoBack(p)},'翻到背面');
        cap.appendChild(flip);
      }
      item.appendChild(cap);
      grid.appendChild(item);
    });
    f.appendChild(grid);
    return f;
  },

  showPhotoBack(p){
    MEI.Audio.hover();
    const layer=MEI.$('#modal-layer');
    const bd=MEI.el('div',{class:'modal-backdrop back-backdrop'});
    const card=MEI.el('div',{class:'photo-back-card'},
      MEI.el('div',{class:'photo-back-title'},'— 照片背面 · 手写 —'),
      MEI.el('div',{class:'photo-back-text'},
        '阿树：',MEI.el('br'),MEI.el('br'),
        '8 月 15 日，晚 8 点，老地方聊天室见。',MEI.el('br'),
        '谁都不许迟到，不许爽约。',MEI.el('br'),MEI.el('br'),
        '—— 小美',MEI.el('br'),
        MEI.el('span',{class:'small'},'（角落画着两只歪歪扭扭的小纸船）')));
    card.appendChild(MEI.el('button',{class:'btn btn-primary',style:{'margin-top':'12px'},
      onclick:()=>{bd.remove();}},'放回照片夹'));
    bd.appendChild(card);
    layer.appendChild(bd);
    if(!this.clues.promise){
      this.clues.promise=true;
      MEI.addItem('note-promise');
      this.updateClueStatus();
      MEI.Audio.unlock();
    }
  },

  /* ---------- 好朋友们 ---------- */
  friendsPage(){
    const f=document.createDocumentFragment();
    f.appendChild(MEI.el('div',{class:'page-welcome'},'✿ 我的好朋友们 ✿'));

    const friend=(name,sign,oicq,opt={})=>{
      const {dead=false,offline=false,avatar='○'}=opt;
      const gray=dead||offline;
      const status=dead?'该页无法显示 · 头像已灰':offline?'离线 · 最后上线 2003·08·15':'在线';
      return MEI.el('div',{class:'friend-row'},
        MEI.el('div',{class:'friend-avatar'+(gray?' dead':''),style:{
          'background':gray?'#e2e2e2':(opt.color||'#cfd8e6'),
          'color':gray?'#aaa':(opt.tcolor||'#5a7aa8')}},avatar),
        MEI.el('div',{},
          MEI.el('b',{},name),
          MEI.el('div',{class:'small'},'OICQ：'+oicq),
          MEI.el('div',{class:'small'},'签名：'+sign),
          MEI.el('div',{class:'small'+(gray?' dead':'')},status)));
    };

    const list=MEI.el('div',{});
    /* 阿树：灰色、伏笔 */
    list.appendChild(friend('阿树',
      '我最好的朋友。他说「我在你身后」，其实是「我想你啦」。（这行字现在是空的）',
      '1600-1200',{offline:true,avatar:'树',color:'#d8c8a8',tcolor:'#8a6a2a'}));
    list.appendChild(friend('小宇','我 4 岁的弟弟，姐姐陪我玩！','1600-0004',
      {dead:true,avatar:'宇',color:'#c8e0ff',tcolor:'#3a6aa8'}));
    list.appendChild(friend('江边萤火虫观测员','一闪一闪亮晶晶，今晚又看到 63 颗。','1600-2048',
      {dead:true,avatar:'萤',color:'#e8ffc8',tcolor:'#5a8a2a'}));
    list.appendChild(friend('摩天轮上的猫','今天也要开心哦。','1600-3366',
      {dead:true,avatar:'猫',color:'#ffd8e8',tcolor:'#a84a7a'}));
    list.appendChild(friend('江边卖花的婆婆','小白花送给乖囡囡。','1600-7788',
      {dead:true,avatar:'花',color:'#ffffff',tcolor:'#5a8a5a'}));
    list.appendChild(friend('临江市一小·四年级（2）班','班级主页，欢迎同学来踩。','1600-0202',
      {dead:true,avatar:'班',color:'#c8e8e8',tcolor:'#3a7a7a'}));
    list.appendChild(friend('折纸船教程站','教你折会漂的小纸船。','1600-5521',
      {dead:true,avatar:'纸',color:'#f0e8d8',tcolor:'#8a6a3a'}));
    f.appendChild(list);
    f.appendChild(MEI.el('div',{class:'small',style:{'margin-top':'8px'}},
      '整个好朋友页面，只有「阿树」是我亲手加的。其他人，我记不清是什么时候出现的了。'));

    /* 涂鸦板（暗号线索） */
    const doodle=MEI.el('div',{class:'doodle-board',
      onclick:e=>{ if(!this.clues.doodle){ this.clues.doodle=true;
        this.updateClueStatus(); MEI.Audio.unlock();
        MEI.Hint.flash('涂鸦写着：「阿树教我——我在你身后 ＝ 我想你啦」。');
        e.currentTarget.classList.add('found'); } } },
      MEI.el('div',{class:'doodle-title'},'～ 留言涂鸦板（点一点角落）～'),
      MEI.el('div',{class:'doodle-scrawl'},'小美到此一游 ✿　　阿树是大笨蛋～　　'),
      MEI.el('div',{class:'doodle-scrawl faint'},'（角落有一行被描了又描的小字……）'));
    f.appendChild(doodle);

    f.appendChild(MEI.el('div',{class:'sub-h'},'★ 最近访客 ★'));
    f.appendChild(MEI.el('ul',{class:'update-log'},
      ['访客 000110 · 2003-08-14','访客 000111 · 2003-08-14','访客 000112 · 2003-08-15',
       MEI.el('li',{},MEI.el('b',{style:{color:'#9c1f1f'}},'访客 000113 · 就是现在 · 就是你'))]
      .map(x=>typeof x==='string'?MEI.el('li',{},x):x)));
    return f;
  },

  updateClueStatus(){
    const n=(this.clues.birthday?1:0)+(this.clues.promise?1:0)+(this.clues.doodle?1:0);
    const el=MEI.$('#clue-status'); if(el) el.textContent='线索 '+n+'/3';
    if(n===3) MEI.Puzzles.solve('M2');
  },

  /* ---------- 异常演出（克制、随探索升级） ---------- */
  scheduleAnomalies(world){
    setTimeout(()=>{ const t=MEI.$('#marquee-track');
      if(t){ t.innerHTML='<span>'+MEI.UI.marquee.p1b+'</span><span>'+MEI.UI.marquee.p1b+'</span>';
        MEI.Audio.ghostLaugh(); } },20000);
    setTimeout(()=>{ const t=MEI.$('#cons-text');
      if(t){ t.innerHTML='<div>建设中……</div><div style="color:#9c1f1f">我在你身后</div>';
        MEI.Audio.doorCreak(); } },36000);
    /* 计数器轻微跳动 */
    setTimeout(()=>{ const v=MEI.$('#counter-val');
      if(v && !v.dataset.creep){ v.dataset.creep='1';
        v.textContent='000114';
        const sub=MEI.$('#counter-sub'); if(sub) sub.textContent='个没能离开的人（你走不掉的）'; } },50000);
  },

  onExit(){ if(this._clock) clearInterval(this._clock); }
});
