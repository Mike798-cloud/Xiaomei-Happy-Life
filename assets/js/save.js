/* save.js — localStorage 存档管理 */
window.MEI = window.MEI || {};
const KEY_AUTO='mei_save_auto';
const KEY_SLOT=n=>'mei_save_'+n;
const KEY_SETTINGS='mei_settings';

MEI.SaveManager = {
  _pack(slot){
    const s=MEI.state;
    const sc=MEI.scenes[s.scene];
    const data={
      state:JSON.parse(JSON.stringify(s)),
      meta:{
        slot, ts:Date.now(),
        label:sc&&sc.label||s.scene,
        diaries:s.collectibles.diary.length,
        files:s.collectibles.files.length,
        playSeconds:s.stats.playSeconds
      }
    };
    return data;
  },

  autoSave(){
    /* 标题为安全枢纽：任何在标题态的自动保存都不覆盖真实存档点
       （返回标题后内存态是“中期数据+scene=title”，不能写成存档点）。 */
    try{ if(MEI.state.scene==='title') return; }catch(e){}
    try{ localStorage.setItem(KEY_AUTO,JSON.stringify(this._pack('auto'))); }
    catch(e){ /* 存储满或被禁用，静默 */ }
  },
  save(slot){
    try{
      localStorage.setItem(KEY_SLOT(slot),JSON.stringify(this._pack(slot)));
      return true;
    }catch(e){ return false; }
  },
  _read(key){
    try{ const d=localStorage.getItem(key); return d?JSON.parse(d):null; }
    catch(e){ return null; }
  },
  load(slot){
    const data=this._read(slot==='auto'?KEY_AUTO:KEY_SLOT(slot));
    if(!data || !data.state) return false;
    if(MEI.SceneController.transitioning)return false;
    MEI.SceneController.cleanup();
    const d=MEI.defaultState(), st=data.state;
    /* 嵌套对象逐键补全，防止旧档/损坏档字段缺失 */
    ['flags','collectibles','settings','stats','solved'].forEach(k=>{
      if(st[k] && typeof st[k]==='object') st[k]=Object.assign({},d[k],st[k]);
    });
    if(!st.solved||typeof st.solved!=='object') st.solved={};
    if(!Array.isArray(st.inventory)) st.inventory=d.inventory.slice();
    if(!Array.isArray(st.readTexts)) st.readTexts=d.readTexts.slice();
    st.collectibles=Object.assign({},d.collectibles,st.collectibles||{});
    ['diary','files','memory'].forEach(k=>{if(!Array.isArray(st.collectibles[k]))st.collectibles[k]=[];});
    MEI.state = Object.assign(d,st);
    MEI.applySettings();
    const sc=MEI.scenes[MEI.state.scene];
    if(!sc){ /* 场景已失效，安全回退标题 */
      MEI.state.scene='title';
      MEI.SceneController.build('title');
      return false;
    }
    MEI.SceneController.build(MEI.state.scene);
    if(sc.onEnter) sc.onEnter();
    MEI.SceneController.showChapterLabel(sc);
    return true;
  },
  continueLatest(){
    const slots=['auto',1,2,3].filter(s=>this.meta(s));
    slots.sort((a,b)=>(this.meta(b).ts||0)-(this.meta(a).ts||0));
    return slots.length?this.load(slots[0]):false;
  },
  meta(slot){
    const data=this._read(slot==='auto'?KEY_AUTO:KEY_SLOT(slot));
    return data?data.meta:null;
  },
  hasAny(){
    return !!(this._read(KEY_AUTO)||this._read(KEY_SLOT(1))||
      this._read(KEY_SLOT(2))||this._read(KEY_SLOT(3)));
  },
  /* 设置独立持久化（标题页改设置也会落盘）。只写设置键，
     不触碰进度档，因此“标题态不写进度”的守卫仍然成立。 */
  persistSettings(){
    try{ localStorage.setItem(KEY_SETTINGS,JSON.stringify(MEI.state.settings)); }catch(e){}
  },
  loadSettings(){
    try{
      const d=localStorage.getItem(KEY_SETTINGS);
      if(!d)return;
      const o=JSON.parse(d);
      if(o&&typeof o==='object')
        MEI.state.settings=Object.assign({},MEI.state.settings,o);
    }catch(e){}
  },
  clearAll(){
    [KEY_AUTO,KEY_SLOT(1),KEY_SLOT(2),KEY_SLOT(3)]
      .forEach(k=>localStorage.removeItem(k));
  }
};

/* 定时累计游玩时间 + 周期自动存档 */
MEI.Clock.setInterval(()=>{
  if(MEI.state.scene==='title'||MEI.state.scene.startsWith('ending')||MEI.SceneController.transitioning)return;
  MEI.state.stats.playSeconds+=1;
  if(MEI.state.stats.playSeconds%5===0)MEI.SaveManager.autoSave();
},1000,'global');
