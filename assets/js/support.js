/* ============================================================
   support.js — 自愿赞赏层《小美の快乐家园》
   纯前端 / 零外链 / 自包含 IIFE。收款码已本地化。
   形式参考 xu-yuan（右下角常驻 chip + 旧纸片花窗），
   细节按本作基调调整：一支不会灭的蜡烛、替她续一盏灯。
   事件契约：window 监听 'mei:open-support' 开窗（感谢页派发）。
   ============================================================ */
(function(){
  'use strict';
  var body=document.body;
  if(!body)return;

  var PaycodeSrc='assets/img/support/paycode.jpg';
  var STORAGE_KEY='mei_support_paid';
  var SESSION_KEY='mei_support_paid_session';
  var COOKIE_KEY='mei_support_flag';
  var AUTO_SEEN_KEY='mei_support_auto_seen';

  /* ---------- 存储 ---------- */
  function getCookie(name){
    try{
      var key=name+'=';
      var parts=document.cookie.split(';');
      for(var i=0;i<parts.length;i++){
        var v=parts[i].trim();
        if(v.indexOf(key)===0)return v.slice(key.length);
      }
    }catch(e){}
    return '';
  }
  function setCookie(name,value,days){
    try{
      var d=new Date();d.setTime(d.getTime()+days*86400000);
      document.cookie=name+'='+value+';expires='+d.toUTCString()+';path=/;SameSite=Lax';
    }catch(e){}
  }
  function hasPaid(){
    try{
      if(localStorage.getItem(STORAGE_KEY))return true;
      if(sessionStorage.getItem(SESSION_KEY))return true;
    }catch(e){}
    return !!getCookie(COOKIE_KEY);
  }
  function hasAutoSeen(){
    try{return localStorage.getItem(AUTO_SEEN_KEY)==='1';}catch(e){return false;}
  }
  function markAutoSeen(){try{localStorage.setItem(AUTO_SEEN_KEY,'1');}catch(e){}}
  function markPaid(){
    var raw=Date.now()+'_'+Math.random().toString(36).slice(2,10)+'_abc_studio';
    var token=raw;
    try{token=btoa(unescape(encodeURIComponent(raw)));}catch(e){}
    try{localStorage.setItem(STORAGE_KEY,token);}catch(e){}
    try{sessionStorage.setItem(SESSION_KEY,token);}catch(e){}
    setCookie(COOKIE_KEY,token,365);
    document.body.classList.add('mei-support-done');
  }

  /* ---------- 当前场景（防御式读取，不依赖 MEI 也能跑） ---------- */
  function currentScene(){
    try{
      if(window.MEI && MEI.SceneController)return MEI.SceneController.current;
    }catch(e){}
    return null;
  }

  /* ---------- 常驻 chip ---------- */
  var chip=null;
  function ensureChip(){
    if(chip)return;
    chip=document.createElement('button');
    chip.type='button';
    chip.id='meiSupportChip';
    chip.className='mei-support-chip';
    chip.setAttribute('aria-label','给小美留盏灯');
    chip.innerHTML='<span class="msc-moon">🕯</span><span class="msc-text">给小美留盏灯</span>';
    chip.addEventListener('click',function(){show({manual:true});});
    document.body.appendChild(chip);
    if(hasPaid())document.body.classList.add('mei-support-done');
  }

  /* ---------- 赞赏花窗（旧信纸质感） ---------- */
  var overlay=null;
  function buildOverlay(){
    overlay=document.createElement('div');
    overlay.className='mei-support-overlay';
    overlay.id='meiSupportOverlay';
    overlay.hidden=true;
    overlay.innerHTML=
      '<section class="mei-support-card" role="dialog" aria-modal="true" aria-labelledby="meiSupportTitle">'+
        '<button type="button" class="mei-support-close" aria-label="关闭">×</button>'+
        '<div class="msc-inner">'+
          '<header class="msc-head">'+
            '<div class="msc-eyebrow">abc studio · 完全自愿的小小心意</div>'+
            '<h2 id="meiSupportTitle">替她，留一盏灯</h2>'+
            '<p class="msc-sub">自愿赞赏 · 不影响任何剧情、谜题与结局</p>'+
          '</header>'+
          '<div class="msc-body">'+
            '<figure class="msc-qr">'+
              '<img src="'+PaycodeSrc+'" alt="微信收款码 · 替她续一盏灯">'+
              '<figcaption>扫码，替她续一盏灯</figcaption>'+
            '</figure>'+
            '<div class="msc-copy">'+
              '<p>你好呀。谢谢你愿意点进这个旧旧的主页，一页一页地看下去。</p>'+
              '<p>这是小美一个人趴在窗边慢慢做完的小世界。她最在意的，其实只是有没有人来过、有没有人愿意留下一句话。</p>'+
              '<p>如果在这些照片、留言和点歌里，有哪一刻你心里轻轻动了一下——愿意随手扫一下，替她续上那支不会灭的蜡烛，我会替她记很久很久。</p>'+
              '<p>不方便也完全没关系。关掉这张纸条继续玩就好，后面的内容一点都不会少，一个谜题也不会少。</p>'+
              '<p class="msc-note">这一块钱买不到摩天轮，也改不了什么；只是让漫长的等待，多一点点回响。</p>'+
            '</div>'+
          '</div>'+
          '<footer class="msc-foot">'+
            '<button type="button" class="msc-done">我支持了一下</button>'+
            '<button type="button" class="msc-later">先继续</button>'+
          '</footer>'+
        '</div>'+
      '</section>';
    document.body.appendChild(overlay);

    overlay.querySelector('.mei-support-close').addEventListener('click',hide);
    overlay.querySelector('.msc-later').addEventListener('click',hide);
    overlay.querySelector('.msc-done').addEventListener('click',function(){
      markPaid();
      hide();
      toast('收到啦，谢谢你。那盏灯，我替她点上了。');
    });
    overlay.addEventListener('click',function(e){if(e.target===overlay)hide();});
  }

  function show(opts){
    opts=opts||{};
    if(hasPaid()){
      if(opts.manual)toast('已经收到你的心意了，谢谢你。继续陪她逛逛吧。');
      return;
    }
    if(!overlay)buildOverlay();
    overlay.hidden=false;
    if(window.MEI&&MEI.Clock)MEI.Clock.setPaused('support',true);
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){overlay.classList.add('is-open');});
    });
    var c=overlay.querySelector('.mei-support-close');
    if(c)c.focus({preventScroll:true});
  }
  function hide(){
    if(!overlay)return;
    overlay.classList.remove('is-open');
    setTimeout(function(){overlay.hidden=true;if(window.MEI&&MEI.Clock)MEI.Clock.setPaused('support',false);},380);
  }
  function isOpen(){
    return !!overlay&&!overlay.hidden&&overlay.classList.contains('is-open');
  }

  /* ---------- toast ---------- */
  function toast(text){
    var old=document.querySelector('.mei-support-toast');
    if(old)old.remove();
    var el=document.createElement('div');
    el.className='mei-support-toast';
    el.textContent=text;
    document.body.appendChild(el);
    requestAnimationFrame(function(){el.classList.add('show');});
    setTimeout(function(){
      el.classList.remove('show');
      setTimeout(function(){el.remove();},360);
    },3200);
  }

  /* ---------- 自动仅弹一次：进入 homepage + 约 3 次真实点击 ---------- */
  var homeClicks=0;
  var prevScene=null;

  function maybeFireAuto(){
    if(hasPaid()||hasAutoSeen())return;
    if(isOpen())return;
    if(document.hidden){
      var onVis=function(){
        if(document.hidden)return;
        document.removeEventListener('visibilitychange',onVis);
        maybeFireAuto();
      };
      document.addEventListener('visibilitychange',onVis);
      return;
    }
    markAutoSeen();
    show({auto:true});
  }

  function onDocClick(e){
    if(hasPaid()||hasAutoSeen())return;
    if(currentScene()!=='homepage')return;
    if(overlay&&!overlay.hidden)return;                 // 开窗期间不计
    if(e.target&&e.target.closest&&
       e.target.closest('.mei-support-chip,.mei-support-overlay'))return;
    homeClicks++;
    if(homeClicks>=3)maybeFireAuto();
  }

  /* 轮询场景：刚进入 homepage 时复位计数，避免标题/序章点击被累计 */
  setInterval(function(){
    var sc=currentScene();
    if(sc!==prevScene){
      if(sc==='homepage'&&prevScene!=='homepage')homeClicks=0;
      prevScene=sc;
    }
  },500);

  /* ---------- 外部事件开窗（感谢页派发） ---------- */
  window.addEventListener('mei:open-support',function(){show({manual:true});});

  /* ---------- Escape：窗开着时优先关窗，并拦截游戏暂停键 ---------- */
  window.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&isOpen()){
      e.stopPropagation();
      e.preventDefault();
      hide();
    }
  },true);

  /* ---------- init ---------- */
  ensureChip();
  document.addEventListener('click',onDocClick,true);

  /* 轻量调试接口 */
  window.MeiSupport={show:show,hide:hide,hasPaid:hasPaid};
})();
