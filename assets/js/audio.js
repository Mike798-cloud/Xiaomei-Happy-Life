/* audio.js — Web Audio 实时合成全部音乐与音效（无音频文件） */
window.MEI = window.MEI || {};

/* 小美主题旋律（A 小调，32 音，0=休止）
   数字为相对 MIDI 偏移，以 A4=69 为基准 */
const NOTE={C:0,'C#':1,D:2,'D#':3,E:4,F:5,'F#':6,G:7,'G#':8,A:9,'A#':10,B:11};
function midi(oct,semi){ return 69 + (oct-4)*12 + semi; }
MEI.themeMelody = [
  ['A',4],['A',5],['G',5],['E',5],
  ['D',5],['E',5],['D',5],['C',5],
  ['A',4],['C',5],['D',5],['E',5],
  ['C',5],['A',4],['A',4],null,
  ['A',4],['A',5],['G',5],['E',5],
  ['D',5],['E',5],['G',5],['A',5],
  ['G',5],['E',5],['D',5],['C',5],
  ['D',5],['C',5],['A',4],['A',4]
].map(x=>x?midi(x[1],NOTE[x[0]]):null);

MEI.Audio = {
  ctx:null, ready:false,
  gains:{}, bgmGain:null,
  bgmMode:'off', step:0, nextT:0, fireNodes:null,

  init(){
    if(this.ready) { if(this.ctx.state==='suspended') this.ctx.resume(); return; }
    try{
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC) return;
      this.ctx=new AC();
      const c=this.ctx;
      const mk=()=>c.createGain();
      this.gains.master=mk(); this.gains.music=mk(); this.gains.sfx=mk(); this.gains.voice=mk();
      this.gains.music.connect(this.gains.master);
      this.gains.sfx.connect(this.gains.master);
      this.gains.voice.connect(this.gains.master);
      this.gains.master.connect(c.destination);
      this.applyVolumes();
      this.ready=true;
      this._scheduler=setInterval(()=>this.schedule(),30);
    }catch(e){ this.ready=false; }
  },

  applyVolumes(){
    if(!this.ready) return;
    const s=MEI.state.settings;
    this.gains.master.gain.value=s.master;
    this.gains.music.gain.value=s.music;
    this.gains.sfx.gain.value=s.sfx;
    this.gains.voice.gain.value=s.voice;
  },

  /* ---------- 基础发声 ---------- */
  tone(freq,dur,{type='sine',vol=.3,when=0,track='sfx',attack=.008,release=.12,pan=null}={}){
    if(!this.ready) return;
    const c=this.ctx,t=c.currentTime+when;
    const o=c.createOscillator(),g=c.createGain();
    o.type=type;o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(0,t);
    g.gain.linearRampToValueAtTime(vol,t+attack);
    g.gain.setValueAtTime(vol,t+dur);
    g.gain.linearRampToValueAtTime(0,t+dur+release);
    let out=g;
    if(pan!=null){ const p=c.createStereoPanner();g.connect(p);p.pan.value=pan;out=p; }
    o.connect(g); out.connect(this.gains[track]);
    o.start(t);o.stop(t+dur+release+.03);
  },

  slide(f0,f1,dur,{type='sine',vol=.25,track='sfx'}={}){
    if(!this.ready) return;
    const c=this.ctx,t=c.currentTime;
    const o=c.createOscillator(),g=c.createGain();
    o.type=type;o.frequency.setValueAtTime(f0,t);
    o.frequency.exponentialRampToValueAtTime(Math.max(30,f1),t+dur);
    g.gain.setValueAtTime(vol,t);
    g.gain.exponentialRampToValueAtTime(.001,t+dur);
    o.connect(g);g.connect(this.gains[track]);
    o.start(t);o.stop(t+dur+.05);
  },

  noiseBuffer(){
    if(this._nb) return this._nb;
    const c=this.ctx,len=c.sampleRate*1.5;
    const buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=Math.random()*2-1;
    return this._nb=buf;
  },
  noise(dur,{filterType='lowpass',freq=1200,vol=.25,when=0,track='sfx',q=1,pan=null}={}){
    if(!this.ready) return;
    const c=this.ctx,t=c.currentTime+when;
    const s=c.createBufferSource();s.buffer=this.noiseBuffer();s.loop=true;
    const f=c.createBiquadFilter();f.type=filterType;f.frequency.value=freq;f.Q.value=q;
    const g=c.createGain();
    g.gain.setValueAtTime(.0001,t);
    g.gain.exponentialRampToValueAtTime(vol,t+.03);
    g.gain.setValueAtTime(vol,t+dur-.08);
    g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    let out=g;
    if(pan!=null){const p=c.createStereoPanner();g.connect(p);p.pan.value=pan;out=p;}
    s.connect(f);f.connect(g);out.connect(this.gains[track]);
    s.start(t);s.stop(t+dur+.05);
  },

  /* ---------- BGM 调度 ---------- */
  setBgm(mode){ this.bgmMode=mode; this.step=0; if(this.ready) this.nextT=this.ctx.currentTime+.08; },

  schedule(){
    if(!this.ready||this.bgmMode==='off') return;
    const c=this.ctx;
    while(this.nextT<c.currentTime+.25){
      this.playStep(this.step,this.nextT);
      this.nextT += this.beatDur();
      this.step=(this.step+1)%MEI.themeMelody.length;
    }
  },
  beatDur(){
    return {musicbox:.34,'musicbox-slow':.46,warm:.36,piano:.62,finale:.58,drone:.5,chaos:.3}[this.bgmMode]||.4;
  },
  playStep(i,t){
    const m=MEI.themeMelody[i];
    const mode=this.bgmMode;
    if(mode==='drone'){
      if(i%8===0) this.tone(110,1.6,{type:'sine',vol:.10,track:'music',when:t-this.ctx.currentTime});
      if(m && i%4===2) this.pianoNote(m,t,.12);
      return;
    }
    if(mode==='chaos'){
      if(m) this.tone(440+Math.random()*200,.18,{type:'sawtooth',vol:.07,track:'music',
        when:t-this.ctx.currentTime});
      return;
    }
    if(m==null) return;
    const freq=440*Math.pow(2,(m-69)/12);
    const off=t-this.ctx.currentTime;
    if(mode==='piano'||mode==='finale'){ this.pianoNote(m,t,mode==='finale'?.26:.22); }
    else {
      const type=mode==='musicbox'?'square':'triangle';
      this.tone(freq*2,.14,{type,vol:.055,track:'music',when:off,release:.18});
      this.tone(freq,.3,{type:'sine',vol:.12,track:'music',when:off,release:.3});
    }
  },
  pianoNote(m,t,vol){
    const freq=440*Math.pow(2,(m-69)/12),off=t-this.ctx.currentTime;
    this.tone(freq,.5,{type:'triangle',vol,track:'music',when:off,release:.8});
    this.tone(freq*2,.25,{type:'sine',vol:vol*.4,track:'music',when:off,release:.5});
  },

  /* ---------- 循环火焰 ---------- */
  startFire(){
    if(!this.ready||this.fireNodes) return;
    const c=this.ctx;
    const s=c.createBufferSource();s.buffer=this.noiseBuffer();s.loop=true;
    const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=480;
    const g=c.createGain();g.gain.value=.16;
    s.connect(f);f.connect(g);g.connect(this.gains.sfx);s.start();
    this.fireNodes={s,g};
  },
  stopFire(){ if(this.fireNodes){ try{this.fireNodes.snd=this.fireNodes.s;
    this.fireNodes.s.stop();}catch(e){} this.fireNodes=null; } },

  /* ---------- 具体音效 ---------- */
  click(){ this.tone(880,.03,{type:'square',vol:.08}); },
  hover(){ this.tone(1320,.015,{type:'sine',vol:.03}); },
  countBeep(){ this.tone(660,.07,{type:'square',vol:.12});
    setTimeout(()=>this.tone(880,.09,{type:'square',vol:.1}),70); },
  typ(){ this.tone(500+Math.random()*300,.018,{type:'square',vol:.035}); },
  error(){ this.tone(220,.15,{type:'square',vol:.1});
    setTimeout(()=>this.tone(180,.2,{type:'square',vol:.1}),120); },
  knock(pan){ this.noise(.08,{freq:300,vol:.3,pan}); },
  doorCreak(){ this.noise(1.1,{filterType:'bandpass',freq:500,vol:.14,q:6});
    this.slide(180,320,1.1,{type:'sawtooth',vol:.05}); },
  candleBlow(){ this.noise(.4,{filterType:'bandpass',freq:700,vol:.18});
    this.slide(900,200,.4,{vol:.06}); },
  matchStrike(){ this.noise(.25,{filterType:'highpass',freq:2200,vol:.12}); },
  candleLit(){ this.tone(523,.5,{type:'sine',vol:.08});
    setTimeout(()=>this.tone(659,.6,{type:'sine',vol:.07}),120); },

  winBoot(){
    [523,659,784,1047].forEach((f,i)=>this.tone(f,.25,{type:'triangle',vol:.1,when:i*.12}));
  },
  dialup(){
    const seq=[[350,440,.5],[480,620,.5],[350,440,.4],[590,750,.6]];
    let t=0;
    seq.forEach(x=>{this.tone(x[0],x[2],{type:'sine',vol:.08,when:t});
      this.tone(x[1],x[2],{type:'sine',vol:.08,when:t});t+=x[2]+.1;});
    this.noise(1.2,{freq:900,vol:.05,when:t});
  },

  ghostCry(pan){
    this.slide(620,180,1.6,{type:'sine',vol:.14});
    this.noise(1.4,{filterType:'bandpass',freq:600,vol:.07,pan});
  },
  ghostLaugh(){
    for(let i=0;i<6;i++) this.tone(300+i*40,.12,{type:'sine',vol:.06,when:i*.13});
  },
  breath(pan){ this.noise(.9,{filterType:'lowpass',freq:500,vol:.12,pan}); },

  moltSound(){
    this.startFire();
    this.noise(2.6,{filterType:'lowpass',freq:700,vol:.2});
    this.slide(120,45,2.4,{type:'sine',vol:.2,track:'music'});
  },

  /* 摩斯敲击（玩家操作反馈） */
  morseDot(){ this.tone(700,.06,{type:'sine',vol:.12}); },
  morseDash(){ this.tone(700,.2,{type:'sine',vol:.12}); },
  unlock(){ [523,659,784,1047].forEach((f,i)=>this.tone(f,.3,
    {type:'sine',vol:.1,when:i*.1})); }
};

/* 蜕皮粒子（供 state 调用，实际粒子在场景层） */
MEI.spawnMoltParticles=function(dur){
  const layer=MEI.$('#transition-layer');
  for(let i=0;i<26;i++){
    const p=MEI.el('div',{class:'particle '+(Math.random()<.5?'ember':'ash'),
      style:{left:MEI.rand(5,92)+'%',top:MEI.rand(40,95)+'%',
        '--dx':MEI.rand(-60,60)+'px',animationDuration:MEI.rand(1.4,2.6)+'s'}});
    layer.appendChild(p);
    setTimeout(()=>p.remove(),dur+400);
  }
};
