// Fade-in on scroll for paragraphs + stars background + cake animation
document.addEventListener('DOMContentLoaded', ()=>{
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

  // Cake + sparkles
  const confettiBtn = document.getElementById('confettiBtn');
  const cakeWrap = document.getElementById('cakeWrap');
  confettiBtn.addEventListener('click', ()=>{
    showCake();
  });

  function showCake(){
    cakeWrap.innerHTML = '';
    cakeWrap.setAttribute('aria-hidden','false');
    // simple SVG cake
    const svg = `
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
        <!-- candles -->
        <rect x="60" y="40" width="6" height="18" rx="2" fill="#ffdca8"/>
        <rect x="80" y="40" width="6" height="18" rx="2" fill="#ffdca8"/>
        <rect x="100" y="40" width="6" height="18" rx="2" fill="#ffdca8"/>
        <g fill="#ffb84d">
          <path d="M63 36 Q66 30 69 36 Z"/>
          <path d="M83 36 Q86 30 89 36 Z"/>
          <path d="M103 36 Q106 30 109 36 Z"/>
        </g>
      </g>
    </svg>
    `;
    cakeWrap.innerHTML = svg;
    const cake = cakeWrap.querySelector('.cake');
    // show animation
    setTimeout(()=>{ cake.classList.add('show'); }, 60);
    // add sparkles
    for(let i=0;i<8;i++){
      const sp = document.createElement('div');
      sp.className = 'sparkle';
      sp.style.left = (30 + Math.random()*140) + 'px';
      sp.style.top = (20 + Math.random()*80) + 'px';
      sp.style.animationDelay = (Math.random()*600) + 'ms';
      cakeWrap.appendChild(sp);
    }
    // remove after a while
    setTimeout(()=>{ cake.classList.remove('show'); cakeWrap.innerHTML = ''; cakeWrap.setAttribute('aria-hidden','true'); }, 6000);
  }

});