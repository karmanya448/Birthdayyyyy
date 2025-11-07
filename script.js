// Simple ambient synth using WebAudio + scrolling animations + confetti
let audioCtx, masterGain, isPlaying=false;

function initAudio(){
  if(audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.025;
  masterGain.connect(audioCtx.destination);

  // create a gentle pad with 3 oscillators
  const freqs = [220, 277.18, 329.63]; // A, C#, E (A major-ish)
  freqs.forEach((f,i)=>{
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = i===1 ? 'sine' : 'triangle';
    o.frequency.value = f;
    g.gain.value = 0.0001;
    o.connect(g);
    g.connect(masterGain);

    // slow LFO for amplitude
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.05 + Math.random()*0.04;
    lfoGain.gain.value = 0.004 + Math.random()*0.006;
    lfo.connect(lfoGain);
    lfoGain.connect(g.gain);

    const now = audioCtx.currentTime;
    o.start(now);
    lfo.start(now);
  });

  // gentle reverb using convolver would be better, but keep it simple
}

document.getElementById('playAudio').addEventListener('click', async ()=>{
  if(!audioCtx) initAudio();
  if(audioCtx.state === 'suspended') await audioCtx.resume();
  isPlaying = true;
  document.getElementById('playAudio').hidden = true;
  document.getElementById('muteAudio').hidden = false;
});

document.getElementById('muteAudio').addEventListener('click', ()=>{
  if(audioCtx) audioCtx.suspend();
  isPlaying = false;
  document.getElementById('playAudio').hidden = false;
  document.getElementById('muteAudio').hidden = true;
});

// animate lines as they enter viewport
const lines = document.querySelectorAll('.line');
const obs = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const el = entry.target;
      const delay = Number(el.dataset.delay) || 0;
      setTimeout(()=>{
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
      }, delay);
      obs.unobserve(el);
    }
  });
},{threshold:0.2});
lines.forEach(l=>obs.observe(l));

// stars canvas
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
window.addEventListener('resize', resize);
resize();

const stars = [];
for(let i=0;i<220;i++){
  stars.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: Math.random()*1.2,
    a: Math.random(),
    vx: (Math.random()-0.5)*0.02
  });
}
function render(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  stars.forEach(s=>{
    ctx.globalAlpha = 0.6 + 0.4*Math.sin(Date.now()/1000 + s.a*10);
    ctx.beginPath();
    ctx.fillStyle = '#cfe9ff';
    ctx.arc(s.x + Math.sin(Date.now()/6000 + s.x)*4, s.y, s.r, 0, Math.PI*2);
    ctx.fill();
  });
  requestAnimationFrame(render);
}
render();

// confetti (simple)
document.getElementById('confettiBtn').addEventListener('click', ()=>{
  launchConfetti();
});

function launchConfetti(){
  const count = 120;
  const cvs = document.createElement('canvas');
  cvs.style.position='fixed';cvs.style.left=0;cvs.style.top=0;cvs.style.zIndex=9999;
  cvs.width = innerWidth; cvs.height = innerHeight;
  document.body.appendChild(cvs);
  const cctx = cvs.getContext('2d');
  const pieces = [];
  for(let i=0;i<count;i++){
    pieces.push({
      x: Math.random()*cvs.width,
      y: -Math.random()*cvs.height,
      vx: (Math.random()-0.5)*6,
      vy: 2 + Math.random()*4,
      w: 6 + Math.random()*8,
      h: 8 + Math.random()*8,
      r: Math.random()*360,
      color: ['#8b5cf6','#6ad1ff','#c18bff','#9be7ff'][Math.floor(Math.random()*4)]
    });
  }
  let t = setInterval(()=>{
    cctx.clearRect(0,0,cvs.width,cvs.height);
    pieces.forEach(p=>{
      p.x += p.vx; p.y += p.vy; p.vy += 0.05;
      cctx.save();
      cctx.translate(p.x,p.y);
      cctx.rotate(p.r*Math.PI/180);
      cctx.fillStyle = p.color;
      cctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      cctx.restore();
    });
  },1000/60);
  setTimeout(()=>{ clearInterval(t); document.body.removeChild(cvs); },4200);
}
