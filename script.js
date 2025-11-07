// Final site script: fades, stars, fireflies, petals, cake + confetti
document.addEventListener('DOMContentLoaded', ()=>{

  // Fade-in paragraphs
  const fades = document.querySelectorAll('.fade');
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
  },{threshold:0.25});
  fades.forEach(f=>obs.observe(f));

  // Stars canvas
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
  window.addEventListener('resize', resize);
  resize();
  const stars = [];
  for(let i=0;i<260;i++){
    stars.push({x: Math.random()*canvas.width, y: Math.random()*canvas.height, r: Math.random()*1.4, a: Math.random()*Math.PI*2, tw: Math.random()*0.8+0.2});
  }
  function render(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    stars.forEach((s,i)=>{
      const glow = 0.5 + 0.5*Math.sin((Date.now()/1000)*(0.5 + s.tw) + s.a);
      ctx.globalAlpha = 0.4 + 0.6*glow;
      ctx.beginPath();
      ctx.fillStyle = '#cfe9ff';
      ctx.arc(s.x + Math.sin(Date.now()/6000 + s.x)*3, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(render);
  }
  render();

  // Fireflies
  const firefliesWrap = document.getElementById('fireflies');
  const fireflies = [];
  for(let i=0;i<24;i++){
    const el = document.createElement('div');
    el.className = 'firefly';
    el.style.left = (Math.random()*100) + 'vw';
    el.style.top = (Math.random()*100) + 'vh';
    firefliesWrap.appendChild(el);
    fireflies.push({el, x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight, vx:(Math.random()-0.5)*0.3, vy:(Math.random()-0.5)*0.3, tw: Math.random()*2+1});
  }
  function animateFireflies(){
    fireflies.forEach(f=>{
      f.x += f.vx; f.y += f.vy;
      if(f.x < -30) f.x = window.innerWidth + 30;
      if(f.x > window.innerWidth + 30) f.x = -30;
      if(f.y < -30) f.y = window.innerHeight + 30;
      if(f.y > window.innerHeight + 30) f.y = -30;
      f.el.style.transform = `translate(${f.x}px, ${f.y}px) scale(${0.6 + 0.4*Math.sin(Date.now()/800 + f.tw)})`;
      f.el.style.opacity = 0.5 + 0.5*Math.abs(Math.sin(Date.now()/1000 + f.tw));
    });
    requestAnimationFrame(animateFireflies);
  }
  animateFireflies();

  // Petals
  const petalsWrap = document.getElementById('petals');
  const petals = [];
  for(let i=0;i<18;i++){
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.left = Math.random()*100 + 'vw';
    p.style.top = (-10 - Math.random()*20) + 'vh';
    p.style.opacity = 0.9;
    petalsWrap.appendChild(p);
    petals.push({el:p, x:parseFloat(p.style.left), y: -Math.random()*window.innerHeight/3, rot:Math.random()*360, vx:(Math.random()-0.5)*0.25, vy: 0.6 + Math.random()*0.6, rotSpeed: (Math.random()-0.5)*2});
  }
  function animatePetals(){
    petals.forEach(pt=>{
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.rot += pt.rotSpeed;
      if(pt.y > window.innerHeight + 60){
        pt.y = -20 - Math.random()*60;
        pt.x = Math.random()*window.innerWidth;
      }
      pt.el.style.transform = `translate(${pt.x}px, ${pt.y}px) rotate(${pt.rot}deg)`;
    });
    requestAnimationFrame(animatePetals);
  }
  animatePetals();

  // Celebrate: cake + confetti
  const celebrateBtn = document.getElementById('celebrateBtn');
  const cakeWrap = document.getElementById('cakeWrap');
  celebrateBtn.addEventListener('click', ()=>{ triggerCelebrate(); });

  function triggerCelebrate(){
    // add cake
    cakeWrap.innerHTML = `
      <svg class="cake" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gA" x1="0" x2="1"><stop offset="0" stop-color="#ffd9f0"/><stop offset="1" stop-color="#ffecff"/></linearGradient>
          <linearGradient id="gB" x1="0" x2="1"><stop offset="0" stop-color="#fff3d9"/><stop offset="1" stop-color="#fff7ee"/></linearGradient>
        </defs>
        <g transform="translate(20,20)">
          <rect x="20" y="90" width="120" height="40" rx="10" fill="url(#gB)" stroke="#ffd6a8" stroke-width="2"/>
          <rect x="30" y="60" width="100" height="40" rx="10" fill="url(#gA)" stroke="#ffb6d6" stroke-width="2"/>
          <g transform="translate(70,48)">
            <path d="M0 0 Q10 -10 20 0" fill="#ffb6d6"/>
          </g>
          <rect x="60" y="40" width="6" height="18" rx="2" fill="#ffdca8"/>
          <rect x="80" y="40" width="6" height="18" rx="2" fill="#ffdca8"/>
          <rect x="100" y="40" width="6" height="18" rx="2" fill="#ffdca8"/>
          <g fill="#ffb84d">
            <path d="M63 36 Q66 30 69 36 Z"/>
            <path d="M83 36 Q86 30 89 36 Z"/>
            <path d="M103 36 Q106 30 109 36 Z"/>
          </g>
        </g>
      </svg>`;
    const cake = cakeWrap.querySelector('.cake');
    setTimeout(()=> cake.classList.add('show'), 40);

    // confetti pieces
    const confettiCount = 120;
    const confettiEls = [];
    for(let i=0;i<confettiCount;i++){
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.left = Math.random()*100 + 'vw';
      c.style.background = ['#8b5cf6','#6ad1ff','#ffd28f','#ff9bd4'][Math.floor(Math.random()*4)];
      const delay = Math.random()*300;
      c.style.animationDelay = (delay) + 'ms';
      document.body.appendChild(c);
      confettiEls.push(c);
    }
    // remove confetti after duration
    setTimeout(()=>{
      confettiEls.forEach(el=> el.remove());
    }, 3200);

    // sparkles
    for(let i=0;i<8;i++){
      const sp = document.createElement('div');
      sp.className = 'sparkle';
      sp.style.left = (window.innerWidth*0.5 - 90 + Math.random()*180) + 'px';
      sp.style.top = (window.innerHeight*0.5 - 40 + Math.random()*80) + 'px';
      document.body.appendChild(sp);
      // remove later
      setTimeout(()=> sp.remove(), 2200);
    }

    // auto remove cake
    setTimeout(()=>{ cake.classList.remove('show'); cakeWrap.innerHTML = ''; }, 5200);
  }

});