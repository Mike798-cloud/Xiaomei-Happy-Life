/* cipher.js — ROT5 / 摩斯 / 解码器界面 */
window.MEI = window.MEI || {};

MEI.Cipher = {
  /* 凯撒位移 */
  rot(s,n){
    return s.replace(/[a-z]/gi,c=>{
      const k=c<='Z'?65:97;
      return String.fromCharCode((c.charCodeAt(0)-k+n+26*4)%26+k);
    });
  },
  encrypt:s=>MEI.Cipher.rot(s,5),
  decrypt:s=>MEI.Cipher.rot(s,-5),

  /* 摩斯 */
  MORSE:{A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',
    H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',
    P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',
    X:'-..-',Y:'-.--',Z:'--..'},
  morseEncode(s){ return s.toUpperCase().split('').map(c=>MEI.Cipher.MORSE[c]||'').join(' '); },

  /* 字母转盘解码器
     onResult(plain) 解码成功回调 */
  renderDecoder(container,cipherText,onResult){
    container.innerHTML='';
    const wheel=MEI.el('div',{class:'cipher-wheel'});
    /* 26 字母双环 */
    for(let i=0;i<26;i++){
      const ang=i/26*Math.PI*2;
      const rO=96,rI=58;
      const plain=String.fromCharCode(65+i);
      const cipher=MEI.Cipher.encrypt(plain);
      wheel.appendChild(MEI.el('span',{class:'cw-letter outer',
        style:{left:(110+Math.sin(ang)*rO)+'px',top:(110-Math.cos(ang)*rO)+'px'}},cipher));
      wheel.appendChild(MEI.el('span',{class:'cw-letter inner',
        style:{left:(110+Math.sin(ang)*rI)+'px',top:(110-Math.cos(ang)*rI)+'px'}},plain));
    }
    wheel.appendChild(MEI.el('div',{class:'cw-center'},
      MEI.el('div',{style:{'font-size':'12px','color':'#555'}},'密文'),
      MEI.el('div',{style:{'font-size':'17px','font-weight':'bold','color':'#7a2222','font-family':'var(--f-mo)'}},cipherText),
      MEI.el('div',{id:'cw-out',style:{'font-size':'15px','color':'#1a4a8a','min-height':'20px','font-family':'var(--f-mo)'}},'')));

    let clicks=0;
    const wrap=MEI.el('div',{class:'cipher-decoder'},
      wheel,
      MEI.el('div',{class:'cipher-actions'},
        MEI.el('button',{class:'btn',id:'cw-step'},'转动一格（−1）'),
        MEI.el('button',{class:'btn btn-primary',id:'cw-auto'},'解码（−5）'),
        MEI.el('button',{class:'btn',id:'cw-cancel'},'先不解了')));
    container.appendChild(wrap);

    MEI.$('#cw-step').onclick=()=>{
      clicks++; MEI.Audio.click();
      const p=MEI.Cipher.rot(cipherText,-(clicks%26));
      MEI.$('#cw-out').textContent=p;
      if(clicks%26===5){ MEI.Audio.unlock(); success(p); }
    };
    MEI.$('#cw-auto').onclick=()=>{
      clicks=5; MEI.Audio.unlock();
      const p=MEI.Cipher.decrypt(cipherText);
      MEI.$('#cw-out').textContent=p;
      MEI.Clock.setTimeout(()=>success(p),450);
    };
    MEI.$('#cw-cancel').onclick=()=>onResult(null);

    let done=false;
    function success(p){ if(done)return; done=true;
      MEI.Clock.setTimeout(()=>onResult(p),700); }
  }
};
