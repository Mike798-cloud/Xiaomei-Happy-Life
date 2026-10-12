/* save.js — localStorage 存档管理 */
window.MEI = window.MEI || {};
const KEY_AUTO='mei_save_auto';
const KEY_SLOT=n=>'mei_save_'+n;

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
    const d=MEI.defaultState(), st=data.state;
    /* 嵌套对象逐键补全，防止旧档/损坏档字段缺失 */
    ['flags','collectibles','settings','stats'].forEach(k=>{
      if(st[k] && typeof st[k]==='object') st[k]=Object.assign({},d[k],st[k]);
    });
    if(!Array.isArray(st.inventory)) st.inventory=d.inventory.slice();
    if(!Array.isArray(st.readTexts)) st.readTexts=d.readTexts.slice();
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
  meta(slot){
    const data=this._read(slot==='auto'?KEY_AUTO:KEY_SLOT(slot));
    return data?data.meta:null;
  },
  hasAny(){
    return !!(this._read(KEY_AUTO)||this._read(KEY_SLOT(1))||
      this._read(KEY_SLOT(2))||this._read(KEY_SLOT(3)));
  },
  clearAll(){
    [KEY_AUTO,KEY_SLOT(1),KEY_SLOT(2),KEY_SLOT(3)]
      .forEach(k=>localStorage.removeItem(k));
  }
};

/* 定时累计游玩时间 + 周期自动存档 */
setInterval(()=>{
  MEI.state.stats.playSeconds+=5;
  if(MEI.state.scene!=='title') MEI.SaveManager.autoSave();
},5000);
