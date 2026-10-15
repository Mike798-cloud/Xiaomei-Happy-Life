/* softhint.js — 卡关软提示（环境化、分级、克制，不剧透答案）
   触发：①同场景停留超过阈值且谜题无进展；②同一区域/物件被无效点击≥阈值。
   做法：先让“该去看看”的物件轻微亮起，再用一句小美的耳语旁白带过；
   逐级递进，绝不直接给答案。频率可在设置里 关闭/少/正常。 */
window.MEI = window.MEI || {};

(function(){
  if(!MEI) return;

  /* 每场景的分级环境线索：sel=需要轻微亮起的元素，line=小美的耳语 */
  const CUES = {
    prologue:[
      {sel:'.mail-folder[data-folder="archive"]', line:'“……更旧、更旧的那个小抽屉里，好像还有东西。”'},
      {sel:'.mail-folder[data-folder="archive"]', line:'“你找的信，不在这些新邮件里呀。”'}],
    homepage:[
      {sel:'.nav-col a', line:'“一间一间，都推开看看好不好？”'},
      {sel:'.construction-sign, .under-construction, #construction', line:'“那个‘建设中’的小牌子……你有没有凑近看看？”'},
      {sel:'.nav-col a', line:'“关于我、照片、好朋友，还有留言，都翻一翻，线索就藏在里面。”'}],
    guestbook:[
      {sel:'#gb-jump, .gb-jump, .jump-box', line:'“那个跳转框，好像在等一个访客编号。”'},
      {sel:'#m3-zone, .drop-zone', line:'“留言里那些散开的字，好像……能拼回一句话。”'}],
    molting:[
      {sel:'.room-light', line:'“太黑了……有没有什么，是可以点亮的？”'},
      {sel:'.room-light', line:'“一盏，两盏……摸到灯，就没那么怕了。”'}],
    burnt_room:[
      {sel:'#hot-desk, .rh-desk, #pc-overlay', line:'“那台旧电脑……还能再开一次吗？”'},
      {sel:'#hot-nightstand, #hot-ash, .room-hot', line:'“烧剩下的东西里，也许还有没烧完的。”'},
      {sel:'.morse-lock, #pc-overlay', line:'“纸上那些一点一横……你见过的，对不对？”'}],
    truth:[
      {sel:'#m9-zone, .m9-slot', line:'“日记读完了……可还有什么，没有放回原位。”'},
      {sel:'#m9-zone, .m9-slot', line:'“把散开的那几块，拖回它们该在的地方。”'}],
    memory_day:[
      {sel:'#m-flower, #m-write, #m-avatar', line:'“桌上还有东西没放好，你再看看呀。”'},
      {sel:'#m-phasebox button, #m-avatar', line:'“我想把这一天慢慢过完，你陪着我好不好。”'}],
    finale:[
      {sel:'.ritual-item, [class*="ritual"], .offer-item', line:'“最后了……把该带的，都带到她面前吧。”'}]
  };

  const cfg = {
    off:    {idle:Infinity, clicks:Infinity},
    low:    {idle:150000, clicks:6, cooldown:110000},
    normal: {idle:90000,  clicks:4, cooldown:80000}
  };

  const SH = {
    scene:null, level:0, regionClicks:{}, lastRegion:null,
    lastHintAt:0, active:false, solvedSnapshot:'', whisperEl:null,

    setting(){ return (MEI.state&&MEI.state.settings&&MEI.state.settings.softHint)||'normal'; },

    /* 区域归类：优先热点 id，否则用较粗的网格单元，避免把不同点击都算成同一处 */
    regionOf(target){
      const hot = target&&target.closest&&target.closest('[id], .room-hot, .ml-row, .room-light, .nav-col a, button, a');
      if(hot&&hot.id) return '#'+hot.id;
      if(hot){
        const r=hot.getBoundingClientRect();
        if(r.width&&r.height) return 'cell@'+Math.floor(r.left/160)+'x'+Math.floor(r.top/160);
      }
      return 'unknown';
    },

    solvedSet(){ try{ return Object.keys(MEI.Puzzles.solved||{}).filter(k=>MEI.Puzzles.isSolved(k)).sort().join(','); }catch(e){ return ''; } },

    resetForScene(id){
      this.idle=0;this.scene=id; this.level=0; this.regionClicks={}; this.lastRegion=null;
      this.solvedSnapshot=this.solvedSet(); this.active=!!CUES[id];
    },

    /* 任何“进展”都清空计数：谜题被解、读到新文本、切场景 */
    noteProgress(){this.idle=0;this.regionClicks={};this.lastRegion=null;},

    onPointerDown(e){
      const st=cfg[this.setting()]||cfg.normal;
      if(st.idle===Infinity) return;
      const cur=MEI.SceneController&&MEI.SceneController.current;
      if(!cur||!CUES[cur]) return;
      const reg=this.regionOf(e.target);
      if(MEI.Clock.paused)return;
      if(reg!=='unknown'){
        this.regionClicks[reg]=(this.regionClicks[reg]||0)+1;
        if(this.regionClicks[reg]>=st.clicks && this.canFire(st)) this.fire(cur);
      }
    },

    canFire(st){
      const now=Date.now();
      if(now-this.lastHintAt < (st.cooldown||80000)) return false;
      return true;
    },

    fire(sceneId){
      const cues=CUES[sceneId]; if(!cues||!cues.length) return;
      const cue=cues[Math.min(this.level,cues.length-1)];
      this.level++; this.lastHintAt=Date.now();
      this.pulse(cue.sel);
      if(cue.line) this.whisper(cue.line);
      this.regionClicks={};
      try{ MEI.state.stats.hintsUsed=(MEI.state.stats.hintsUsed||0)+1; }catch(e){}
    },

    pulse(sel){
      if(!sel) return;
      let nodes=[]; try{ nodes=MEI.$$(sel); }catch(e){ return; }
      nodes.slice(0,6).forEach((n,i)=>{
        n.classList.add('sh-attention');
        setTimeout(()=>n.classList.remove('sh-attention'),3600+i*200);
      });
    },

    whisper(text){
      let el=document.getElementById('sh-whisper');
      if(!el){
        el=MEI.el('div',{id:'sh-whisper'});
        (MEI.$('#ui-layer')||document.body).appendChild(el);
      }
      el.textContent=text;
      el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
      clearTimeout(this._wT);
      this._wT=setTimeout(()=>el.classList.remove('show'),5200);
    },

    tick(){
      const mode=this.setting(); const st=cfg[mode]||cfg.normal;
      if(st.idle===Infinity) return;
      const cur=MEI.SceneController&&MEI.SceneController.current;
      if(cur!==this.scene){ this.resetForScene(cur); return; }
      /* 谜题有进展 → 计数归零、提示等级回退 */
      const ss=this.solvedSet();
      if(ss!==this.solvedSnapshot){this.solvedSnapshot=ss;this.noteProgress();this.level=Math.max(0,this.level-1);}
      if(MEI.$('#modal-layer').children.length||!MEI.$('#dialogue-box').classList.contains('hidden'))return;
      this.idle=(this.idle||0)+1000;
      if(this.idle>=st.idle&&this.canFire(st)){this.fire(cur);this.idle=0;}
    },

    init(){
      document.addEventListener('pointerdown',e=>this.onPointerDown(e),true);
      MEI.Clock.setInterval(()=>this.tick(),1000,'global');
      ['pointerdown','keydown'].forEach(ev=>document.addEventListener(ev,()=>{this.idle=0;},true));
    }
  };

  MEI.SoftHint=SH;
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>SH.init());
  else SH.init();
})();
