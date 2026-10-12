/* prologue.js — P0 序章：2026 深夜，旧邮箱 mail.oldmail.com/archive
   做成以假乱真的 2003 年前后网页邮箱/归档站体量 */
window.MEI = window.MEI || {};

/* ---------- 邮件数据（2026 收件箱：无关但真实） ---------- */
MEI.mailInbox = [
 {id:'i1', from:'中国电信 <10000@ctbilling.cn', sub:'【账单提醒】您 10 月宽带费待缴 129.00 元',
  date:'2026-10-10 09:12', read:true, star:false,
  body:'尊敬的客户：\n\n您名下宽带账号 AS55881234 本月账单 129.00 元，请于 10 月 20 日前通过网上营业厅缴纳。逾期将产生滞纳金。\n\n——中国电信临江市分公司'},
 {id:'i2', from:'招商银行 <service@cmbchina.com', sub:'您的信用卡 10 月账单已出，应还 ¥3,247.80',
  date:'2026-10-08 14:30', read:true, star:false,
  body:'亲爱的持卡人：\n\n您尾号 6688 的信用卡本期账单已生成，到期还款日为 10 月 25 日。可登录掌上生活查看明细。\n\n【安全提醒】我行不会向您索取验证码，谨防诈骗。'},
 {id:'i3', from:'知乎日报 <noreply@zhihu.com', sub:'知乎日报 · 每日 3 条 · 为什么 90 年代的拨号上网声音那么响？',
  date:'2026-10-09 07:00', read:true, star:false,
  body:'本期内容：\n1. 为什么 90 年代拨号上网的握手声那么有辨识度？\n2. 老网站是怎么在 56k 网速下活下来的？\n3. 你见过最早的个人主页长什么样？\n\n退订请回复 TD。'},
 {id:'i4', from:'豆瓣 <douban@douban.com', sub:'【豆瓣】你关注的「90 年代互联网考古」小组有新回复',
  date:'2026-10-07 22:18', read:true, star:false,
  body:'「老互联网痕迹打捞」小组里，有组员在你三年前发的帖子下面回复：\n\n> 我上个月也翻到一个 2003 年的儿童主页，黑白的，双马尾女孩，红眼。看了一晚上，没敢留言。'},
 {id:'i5', from:'退信系统 <mailer-daemon@oldmail.com', sub:'退信（无法投递）：你发送的邮件 2003-08-15 被退回',
  date:'2026-09-30 03:14', read:true, star:false,
  body:'--- 无法投递的邮件 ---\n\n收件人：xiaomei_1600@oldmail.com\n主题：Re: 你还在吗？\n错误信息：550 User unknown。该邮箱已于 2003-08-16 之后停止接收。\n\n（这是系统自动生成的退信。）'},
 {id:'i6', from:'工作邮箱 <hr@company.com', sub:'【自动回复】您的同事 林工 正在休假，10 月 20 日返岗',
  date:'2026-10-05 11:02', read:true, star:false,
  body:'自动回复：\n\n您好，我正在外地参加项目评审，10 月 20 日返岗。紧急事务请拨打我手机。\n\n——林工'},
 {id:'i7', from:'健康养生 <jkys@spam-ad.cn', sub:'【震惊】睡前一个动作，血管年轻 20 岁！（广告）',
  date:'2026-10-06 06:44', read:true, star:false, junk:true,
  body:'中老年朋友注意了！这个动作，医生自己都在做……\n（以下为广告内容）'},
 {id:'i8', from:'少儿英语培训 <kidsedu@edu-ad.cn', sub:'【限时优惠】少儿外教课 9.9 元试听（广告）',
  date:'2026-10-04 19:20', read:true, star:false, junk:true,
  body:'美国外教 1 对 1，9.9 元试听，名额有限。\n（以下为广告内容）'},
 {id:'i9', from:'临江市第一人民医院 <hospital@ljsyy.cn', sub:'【回访提醒】您预约的心内科复查时间为 10 月 28 日',
  date:'2026-10-09 16:00', read:true, star:false,
  body:'林先生：\n\n您 8 月在我院的心内科复查报告已归档，下次预约时间为 10 月 28 日上午。请携带既往病历。'},
 {id:'i10', from:'Steam <noreply@steampowered.com', sub:'您愿望单里的怀旧恐怖游戏《旧邮箱》已发售，首周 8 折',
  date:'2026-10-11 01:55', read:true, star:true,
  body:'你愿望单中的《旧邮箱》现已发售。\n\n游戏简介：深夜登录一个早已停服的旧邮箱，你翻到了一个 2003 年的儿童主页。她还在等你。'},
 {id:'i11', from:'旧邮箱助手 <helper@oldmail.com', sub:'【系统】你有一个归档文件夹超过 20 年未打开，建议清理',
  date:'2026-08-16 00:00', read:false, star:false,
  body:'尊敬的用户：\n\n您的邮箱自 2003 年以来有一个归档文件夹从未被打开过。为节省存储空间，系统将在 30 天后自动清理。\n\n【2003 年归档】— 含 9 封邮件，最后访问：从未。\n\n如需保留，请在此日期前打开一次。'},
 {id:'i12', from:'OICQ 怀旧版 <oicq@oicq-legacy.cn', sub:'【会员续费】你的 OICQ 1600-1200 头像仍是灰色',
  date:'2026-09-01 10:00', read:true, star:false,
  body:'尊敬的用户：\n\n你的 OICQ 账号 1600-1200 自 2003-08-15 之后再未上线过。头像一直是灰色的。\n\n要不要点亮它？'}
];

/* ---------- 2003 年归档邮件 ---------- */
MEI.mailArchive = [
 {id:'a1', from:'旧邮箱系统 <welcome@oldmail.com', sub:'欢迎使用 oldmail.com 免费邮箱',
  date:'2003-07-10 20:11', read:true, sig:'oldmail.com 邮件服务',
  body:'亲爱的小美：\n\n欢迎使用 oldmail.com 免费邮箱，容量 5MB。你的邮箱地址是：xiaomei_1600@oldmail.com。\n\n别忘了把你的邮箱写在主页上，好朋友就能给你写信啦！\n\n——oldmail 邮件助手'},
 {id:'a2', from:'少儿园地 <kids@children-site.cn', sub:'【少儿园地】你的主页已收录进儿童网页大全',
  date:'2003-07-13 09:30', read:true, sig:'儿童网页大全·编辑部',
  body:'小美小朋友：\n\n你的主页「小美の快乐家园」已通过审核，收录进儿童网页大全「江南地区·个人主页」分类。欢迎邀请同学来踩！'},
 {id:'a3', from:'爸爸 <father@sz-work.cn', sub:'小美，爸这个月不回去了，你好好听外婆的话',
  date:'2003-07-20 22:40', read:true, star:true, sig:'——爸爸',
  body:'小美：\n\n爸爸在深圳这边活儿多，这个月不回去了。你妈在厂里加班，让我跟你说，别老趴在窗边，外头冷。\n\n小宇乖不乖？你要让着他。\n\n钱外婆会寄给你。想吃啥跟外婆说。\n\n——爸爸'},
 {id:'a4', from:'妈妈 <mother@sz-work.cn', sub:'女儿，妈妈给你寄了新校服，还有一盒大白兔',
  date:'2003-07-28 21:15', read:true, sig:'——妈妈',
  body:'我的乖女儿：\n\n新校服寄到外婆那里了，是粉色的，你穿一定好看。大白兔奶糖藏在最下面那层，别让小宇偷吃光。\n\n妈妈想你。你要好好的，等开了刀，来深圳看妈妈。'},
 {id:'a5', from:'阿树 <ashu_1600@chatroom.cn', sub:'小美，我教你的密码游戏你学会了吗？',
  date:'2003-08-05 21:08', read:true, sig:'——阿树 OICQ 1600-1200',
  body:'小美：\n\n上次教你的那个往后数 5 个字母的密码，你练熟了吗？下次在聊天室，我用密码跟你说悄悄话，别人都看不懂。\n\n对了，我给你主页留了言，你翻一下。'},
 {id:'a6', from:'阿树 <ashu_1600@chatroom.cn', sub:'Re: 我们 8 月 15 号晚上见，对不对？',
  date:'2003-08-12 20:50', read:true, star:true, sig:'——阿树',
  body:'小美：\n\n8 月 15 号晚上 8 点，老地方聊天室，我等你。谁都不许迟到，不许爽约。\n\n我跟你说，那天我有一个小礼物要给你。你也准备一个好不好？\n\n——阿树'},
 {id:'a7', from:'儿童主页大赛 <contest@kidpage.cn', sub:'【通知】你的主页参选「2003 年度最温暖儿童主页」复赛',
  date:'2003-08-14 10:00', read:true, sig:'——大赛组委会',
  body:'小美小朋友：\n\n恭喜你的主页进入复赛！请于 8 月 20 日前登录填写参赛信息。\n\n（这封通知后来再也没人读过。）'},
 /* 未读异常邮件：入口 */
 {id:'a8', from:'=?gb2312?B?wfTDxMSjzPog?= <ashu_1600@chatroom.cn>',
  sub:'Re: 你还在吗？',
  date:'2003-08-15 22:31', read:false, star:false, anomaly:true,
  body:'阿树～你好久没来啦，我给你留了言哦。\n\n我把给你的信和软盘都准备好了，就放在桌上。\n\n你说 8 点来的，现在 10 点半了。\n\n聊天室里只剩我一个人。\n\n我在你身后。\n\n——小美',
  link:'http://xiaomei.home/1600-1200'},
 {id:'a9', from:'旧邮箱助手 <helper@oldmail.com', sub:'【失效通知】好友「阿树的小窝」主页已关闭',
  date:'2003-08-17 03:00', read:true, sig:'——oldmail',
  body:'系统通知：\n\n你收藏的好友主页「阿树的小窝」（ashu_1600.chatroom.cn）已于 2003-08-16 之后停止解析。\n\n该页无法显示。'}
];

MEI.registerScene({
  id:'prologue',
  label:'序章 · 旧邮箱',
  render(root){
    root.appendChild(MEI.el('div',{class:'prologue-world',
      style:{width:'100%',height:'100%',background:'#0e1116',
        display:'flex','flex-direction':'column'}}));
    this.renderLogin(root);
  },

  /* 1. 登录 */
  renderLogin(root){
    const world=MEI.$('.prologue-world',root);
    world.innerHTML='';
    const card=MEI.el('div',{class:'login-card'},
      MEI.el('div',{class:'login-brand'},'oldmail.com'),
      MEI.el('div',{class:'login-sub'},'— 免费邮箱 · 个人归档 —'),
      MEI.el('label',{class:'small'},'邮箱账号'),
      MEI.el('input',{class:'text-input',value:'ashu_tree@oldmail.com',disabled:true,
        style:{'margin':'4px 0 12px','background':'#0e1116','color':'#9aa3b0'}}),
      MEI.el('label',{class:'small'},'密码'),
      MEI.el('input',{class:'text-input',type:'password',value:'********',disabled:true,
        style:{'margin':'4px 0 18px','background':'#0e1116'}}),
      MEI.el('button',{class:'btn btn-primary',style:{width:'100%','padding':'8px'},
        onclick:()=>{ MEI.Audio.init(); MEI.Audio.click(); this.renderMailbox(root); }},
        '登录'));
    world.appendChild(card);
  },

  /* 2. 邮箱主界面 */
  renderMailbox(root){
    const world=MEI.$('.prologue-world',root);
    world.innerHTML='';
    this.root=root;
    this.currentFolder='inbox';
    this.openMailId=null;

    /* 顶部浏览器栏 */
    world.appendChild(MEI.el('div',{class:'mail-browserbar'},
      MEI.el('span',{class:'mb-btn'},'◀'),MEI.el('span',{class:'mb-btn'},'▶'),
      MEI.el('span',{class:'mb-btn'},'⟳'),
      MEI.el('div',{class:'mb-url'},'mail.oldmail.com/archive/')));

    /* 年代风格横幅 */
    world.appendChild(MEI.el('div',{class:'mail-banner'},
      MEI.el('div',{class:'mail-logo'},'oldmail.com'),
      MEI.el('div',{class:'mail-slogan'},'你 2003 年的信，我们替你留着'),
      MEI.el('div',{class:'mail-search'},
        MEI.el('input',{class:'mail-search-input',placeholder:'搜索邮件 / 联系人'}),
        MEI.el('button',{class:'mini-btn',onclick:()=>MEI.Hint.flash('搜索服务器已经停了，只剩本地的几封旧邮件。')},'搜索'))));

    /* 可横向滚动的老式广告条 */
    const ads=['临江市一小 · 课后辅导班','拨号上网 96163','小白花牌铅笔','江南儿童网页大全',
      '临江市中心医院','摩天轮游乐园门票','旧版聊天室 · 今晚八点'];
    const adTrack=MEI.el('div',{class:'mail-adtrack'});
    [0,1].forEach(()=>ads.forEach(a=>adTrack.appendChild(MEI.el('span',{},a))));
    world.appendChild(MEI.el('div',{class:'mail-adstrip'},adTrack));

    /* 主体三栏 */
    const body=MEI.el('div',{class:'mail-body'});
    const folders=this.buildFolders();
    const list=this.buildList();
    const view=this.buildView();
    body.appendChild(folders);body.appendChild(list);body.appendChild(view);
    world.appendChild(body);

    /* 底部状态栏 */
    world.appendChild(MEI.el('div',{class:'mail-statusbar'},
      MEI.el('span',{},'就绪'),
      MEI.el('span',{},'用户：ashu_tree@oldmail.com'),
      MEI.el('span',{},'存储空间：2.3MB / 5MB'),
      MEI.el('span',{class:'mail-ip'},'IP 218.94.160.202 · 临江')));

    this.refreshFolderCounts();
  },

  buildFolders(){
    const f=MEI.el('div',{class:'mail-folders'});
    const mk=(id,label,count,extra)=>MEI.el('div',{class:'mail-folder'+(extra?' '+extra:''),
        dataset:{folder:id},onclick:()=>this.selectFolder(id)},
      MEI.el('span',{class:'mf-icon'},'▸'),
      MEI.el('span',{class:'mf-label'},label),
      MEI.el('span',{class:'mf-count',id:'cnt-'+id},String(count||'')));
    f.appendChild(MEI.el('div',{class:'mf-head'},'文件夹'));
    f.appendChild(mk('inbox','收件箱',MEI.mailInbox.filter(m=>!m.junk).length));
    f.appendChild(mk('sent','已发送',2));
    f.appendChild(mk('draft','草稿箱',1));
    f.appendChild(mk('junk','垃圾邮件',MEI.mailInbox.filter(m=>m.junk).length));
    f.appendChild(MEI.el('div',{class:'mf-divider'}));
    f.appendChild(mk('archive','📁 2003 年归档',MEI.mailArchive.length,'archive-folder'));
    f.appendChild(mk('trash','回收站',0));
    f.appendChild(MEI.el('div',{class:'mf-hr'}));
    f.appendChild(MEI.el('div',{class:'mf-ads'},'【站长碎语】\n本邮箱自 2003 年起未清理。\n20 年了，欢迎回来看看。'));
    return f;
  },

  refreshFolderCounts(){
    const unreadA=MEI.mailArchive.filter(m=>!m.read).length;
    const el=MEI.$('#cnt-archive'); if(el) el.textContent=MEI.mailArchive.length+' ('+unreadA+' 未读)';
    const unreadI=MEI.mailInbox.filter(m=>!m.read).length;
    const el2=MEI.$('#cnt-inbox'); if(el2) el2.textContent=MEI.mailInbox.filter(m=>!m.junk).length+(unreadI?' ('+unreadI+' 未读)':'');
  },

  selectFolder(id){
    MEI.Audio.click();
    this.currentFolder=id;
    MEI.$$('.mail-folder').forEach(x=>x.classList.toggle('active',x.dataset.folder===id));
    this.openMailId=null;
    this.refreshList();
    this.refreshView();
  },

  currentMails(){
    if(this.currentFolder==='archive') return MEI.mailArchive;
    if(this.currentFolder==='junk') return MEI.mailInbox.filter(m=>m.junk);
    if(this.currentFolder==='inbox') return MEI.mailInbox.filter(m=>!m.junk);
    if(this.currentFolder==='sent') return [
      {id:'s1',from:'ashu_tree@oldmail.com',to:'xiaomei_1600@oldmail.com',sub:'Re: 你还在吗？',
       date:'2003-08-15 22:50',read:true,body:'小美，我刚下班，马上拨号上来。等我。——阿树'},
      {id:'s2',from:'ashu_tree@oldmail.com',to:'xiaomei_1600@oldmail.com',sub:'？？',
       date:'2003-08-15 23:12',read:true,body:'？'}];
    if(this.currentFolder==='draft') return [
      {id:'d1',from:'（草稿）',sub:'（未命名）',date:'2003-08-15 21:30',read:true,
       body:'小美，对不起，我今晚可能要加班……\n（草稿只写到这里，后面是空的）'}];
    if(this.currentFolder==='trash') return [
      {id:'t1',from:'（已删除）',sub:'2003-08-16 03:?? 的一封邮件',date:'2003-08-16 03:00',read:true,
       body:'（这封邮件在回收站里，但是打开是乱码：ÀÎÊÔ ······）'}];
    return [];
  },

  buildList(){
    this.listEl=MEI.el('div',{class:'mail-list'});
    this.refreshList();
    return this.listEl;
  },

  refreshList(){
    if(!this.listEl) return;
    const list=this.listEl;list.innerHTML='';
    list.classList.toggle('list-archived',this.currentFolder==='archive');
    list.appendChild(MEI.el('div',{class:'ml-head'},
      MEI.el('span',{class:'ml-star'},'★'),
      MEI.el('span',{class:'ml-ava'}),
      MEI.el('span',{class:'ml-from'},'发件人'),
      MEI.el('span',{class:'ml-sub'},'主题'),
      MEI.el('span',{class:'ml-date'},'日期')));
    const mails=this.currentMails();
    if(mails.length===0){
      list.appendChild(MEI.el('div',{class:'ml-empty'},'（这里什么都没有）'));
      return;
    }
    mails.forEach(m=>{
      const fromName=m.from.split('<')[0].trim();
      const ava=(fromName.charAt(0)||'·');
      const row=MEI.el('div',{class:'ml-row'+(m.read?'':' unread')+(m.anomaly?' anomaly':'')
          +(this.openMailId===m.id?' selected':'')},
        MEI.el('span',{class:'ml-star'+(m.star?' starred':'')},m.star?'★':'☆'),
        MEI.el('span',{class:'ml-ava'},ava),
        MEI.el('span',{class:'ml-from'},fromName),
        MEI.el('span',{class:'ml-sub'},m.sub),
        MEI.el('span',{class:'ml-date'},m.date));
      row.onclick=()=>this.openMail(m);
      list.appendChild(row);
    });
  },

  buildView(){
    this.viewEl=MEI.el('div',{class:'mail-view'});
    this.refreshView();
    return this.viewEl;
  },

  refreshView(){
    if(!this.viewEl) return;
    this.viewEl.classList.toggle('mv-archived',this.currentFolder==='archive');
    if(!this.openMailId){
      this.viewEl.innerHTML='';
      this.viewEl.appendChild(MEI.el('div',{class:'mv-empty'},
        MEI.el('span',{class:'mv-empty-glyph'},'✉'),
        this.currentFolder==='archive'
          ?'这里安静地躺着 2003 年。'
          :'没有选中的邮件。'));
      return;
    }
    const m=this.currentMails().find(x=>x.id===this.openMailId);
    if(!m){ this.viewEl.innerHTML='';return; }
    this.viewEl.innerHTML='';
    this.viewEl.appendChild(MEI.el('div',{class:'mv-head'},
      MEI.el('div',{class:'mv-subject'},m.sub),
      MEI.el('div',{class:'mv-meta'},
        MEI.el('div',{class:'mv-m-row'},MEI.el('b',{},'发件人'),MEI.el('span',{},m.from)),
        MEI.el('div',{class:'mv-m-row'},MEI.el('b',{},'收件人'),MEI.el('span',{},m.to||'xiaomei_1600@oldmail.com')),
        MEI.el('div',{class:'mv-m-row'},MEI.el('b',{},'时间'),MEI.el('span',{},m.date)),
        MEI.el('div',{class:'mv-m-row'},MEI.el('b',{},'IP'),MEI.el('span',{class:'mv-ip'},'218.94.160.202 · 临江市')))));
    this.viewEl.appendChild(MEI.el('div',{class:'mv-body',html:m.body.replace(/\n/g,'<br>')}));
    if(m.sig) this.viewEl.appendChild(MEI.el('div',{class:'mv-sig'},'———<br>'+m.sig));
    if(m.link){
      /* 入口邮件：点链接 → 拨号 */
      const link=MEI.el('a',{class:'mv-link',onclick:()=>this.dial(this.root)},m.link);
      this.viewEl.appendChild(MEI.el('div',{class:'mv-linkbox'},
        MEI.el('div',{class:'mv-link-label'},'你在 2003 年留下的地址'),link));
    }
    /* 已读 */
    m.read=true;
    this.refreshList();
    this.refreshFolderCounts();
  },

  openMail(m){
    MEI.Audio.click();
    this.openMailId=m.id;
    this.refreshList();
    this.refreshView();
  },

  /* 拨号 → 欢迎窗 → 主页 */
  dial(root){
    MEI.Audio.dialup();
    const ov=MEI.el('div',{class:'dial-overlay'},
      MEI.el('div',{class:'dial-title'},'正在建立连接…'),
      MEI.el('div',{class:'dial-bar'},
        MEI.el('i',{id:'dial-fill'})),
      MEI.el('div',{class:'dial-tip',id:'dial-tip'},'正在连接 16300 …'));
    root.appendChild(ov);
    const tips=['正在连接 16300 …','正在验证用户名和密码…','正在加载个人主页…','就快好了…'];
    let p=0;
    const iv=setInterval(()=>{
      p+=MEI.rand(6,16);
      const f=MEI.$('#dial-fill'); if(f) f.style.width=Math.min(p,100)+'%';
      const t=MEI.$('#dial-tip'); if(t) t.textContent=tips[Math.min(Math.floor(p/26),3)];
      if(p>=100){ clearInterval(iv); setTimeout(()=>this.welcome(root,ov),500); }
    },260);
  },

  welcome(root,ov){
    ov.remove();
    const w=MEI.el('div',{class:'welcome-overlay'});
    const win=MEI.el('div',{class:'welcome-win'},
      MEI.el('div',{class:'welcome-titlebar'},'欢迎'),
      MEI.el('div',{class:'welcome-body'},
        '欢迎来到小美の快乐家园～',MEI.el('br'),MEI.el('br'),
        '她等你很久啦。慢慢看，不着急。'),
      MEI.el('div',{class:'welcome-actions'},
        MEI.el('button',{class:'btn btn-primary',id:'welcome-enter',onclick:()=>{
          MEI.Audio.countBeep();
          MEI.SceneController.goto('homepage',{transition:'instant'});
        }},'进入')));
    w.appendChild(win);root.appendChild(w);
  }
});
