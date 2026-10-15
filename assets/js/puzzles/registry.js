/* registry.js — 谜题状态注册与完成判定 */
window.MEI = window.MEI || {};

MEI.Puzzles = {
  /* 完成状态存放在 MEI.state.solved，随存档持久化；保留 solved 直读接口 */
  get solved(){ return MEI.state.solved; },
  isSolved(id){ return !!MEI.state.solved[id]; },
  solve(id,opts={}){
    if(MEI.state.solved[id]){if(opts.onSolve)MEI.Clock.setTimeout(opts.onSolve,1);return;}
    MEI.state.solved[id]=true;
    MEI.Audio.unlock();
    if(opts.flash) MEI.Hint.flash(opts.flash,2600);
    MEI.SaveManager.autoSave();
    if(opts.onSolve) MEI.Clock.setTimeout(opts.onSolve,300);
  },
  reset(){ MEI.state.solved={}; }
};

/* 通用：数字/口令输入弹窗，返回用户输入 */
MEI.askCode = function({title,placeholder='',expected,maxLen=8,onResult,soft}={}){
  const layer=MEI.$('#modal-layer');
  const input=MEI.el('input',{class:'text-input',type:'text',maxlength:maxLen,
    placeholder,style:{'margin-top':'10px','font-family':'var(--f-mono)','text-align':'center','letter-spacing':'3px'}});
  const close=()=>{ bd.remove(); };
  const bd=MEI.el('div',{class:'modal-backdrop'},
    MEI.el('div',{class:'modal-win'},
      MEI.el('div',{class:'modal-titlebar'},
        MEI.el('span',{},title),
        MEI.el('span',{class:'modal-close',onclick:()=>{close();onResult(null);}},'×')),
      MEI.el('div',{class:'modal-body'},
        input,
        MEI.el('div',{class:'small',style:{'margin-top':'8px'}},soft||'')),
      MEI.el('div',{class:'modal-footer'},
        MEI.el('button',{class:'btn',onclick:()=>{close();onResult(null);}},'取消'),
        MEI.el('button',{class:'btn btn-primary',id:'code-ok'},'确定'))));
  layer.appendChild(bd);
  MEI.Clock.setTimeout(()=>input.focus(),80);
  const submit=()=>{
    const v=input.value.trim();
    if(expected!=null && String(v)!==String(expected)){
      MEI.Audio.error(); MEI.Hint.flash('好像不对……'); input.select(); return;
    }
    close(); onResult(v);
  };
  MEI.$('#code-ok').onclick=submit;
  input.addEventListener('keydown',e=>{ if(e.key==='Enter')submit(); });
};
