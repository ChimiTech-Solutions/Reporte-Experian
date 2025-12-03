// Enhancements: 3D hero, animations, sentiment gauge, chart styling extensions
// VERSIÓN MEJORADA CON ANIMACIONES TECNOLÓGICAS

// ---- ANIMACIONES AVANZADAS DE NÚMEROS ----
(function countUpAnimation(){
  const animateValue = (element, start, end, duration, prefix = '', suffix = '') => {
    const startTime = performance.now();
    const isDecimal = String(end).includes('.');
    const decimals = isDecimal ? String(end).split('.')[1].length : 0;
    
    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      const current = start + (end - start) * easeProgress;
      
      if (isDecimal) {
        element.textContent = prefix + current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
      } else {
        element.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
      }
      
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  // Observer para activar contadores cuando son visibles
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        const text = entry.target.textContent;
        const match = text.match(/([^\d]*)([0-9,.]+)([^\d]*)/);
        if (match) {
          const prefix = match[1];
          const numStr = match[2].replace(/,/g, '');
          const suffix = match[3];
          const num = parseFloat(numStr);
          if (!isNaN(num)) {
            animateValue(entry.target, 0, num, 2000, prefix, suffix);
          }
        }
      }
    });
  }, { threshold: 0.5 });

  // Aplicar a elementos con valores grandes
  document.querySelectorAll('.kpi-value, .metric-value, .big-number, [data-count-up]').forEach(el => {
    counterObserver.observe(el);
  });
})();

// ---- EFECTO TYPING PARA TÍTULOS ----
(function typewriterEffect(){
  const typewrite = (element) => {
    const text = element.textContent;
    element.textContent = '';
    element.style.borderRight = '2px solid var(--rosa-principal)';
    let i = 0;
    
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, 30 + Math.random() * 30);
      } else {
        setTimeout(() => {
          element.style.borderRight = 'none';
        }, 500);
      }
    };
    type();
  };

  const typeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.typed) {
        entry.target.dataset.typed = 'true';
        typewrite(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-typewriter]').forEach(el => {
    typeObserver.observe(el);
  });
})();

// ---- CURSOR PERSONALIZADO TECH ----
(function customCursor(){
  const cursor = document.createElement('div');
  cursor.className = 'tech-cursor';
  cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
  document.body.appendChild(cursor);

  const style = document.createElement('style');
  style.textContent = `
    .tech-cursor {
      position: fixed;
      pointer-events: none;
      z-index: 99999;
      mix-blend-mode: difference;
    }
    .cursor-dot {
      width: 8px;
      height: 8px;
      background: var(--rosa-principal, #F26398);
      border-radius: 50%;
      position: absolute;
      transform: translate(-50%, -50%);
      transition: transform 0.1s ease;
    }
    .cursor-ring {
      width: 40px;
      height: 40px;
      border: 2px solid var(--rosa-principal, #F26398);
      border-radius: 50%;
      position: absolute;
      transform: translate(-50%, -50%);
      transition: all 0.15s ease;
      opacity: 0.5;
    }
    .tech-cursor.hovering .cursor-ring {
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 0.3;
      border-color: var(--amarillo, #CBF291);
    }
    .tech-cursor.clicking .cursor-dot {
      transform: translate(-50%, -50%) scale(0.5);
    }
    @media (max-width: 768px) {
      .tech-cursor { display: none; }
    }
  `;
  document.head.appendChild(style);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

  const hoverTargets = 'a, button, .nav-btn, .action-small, .kpi-card, .index-item, .comparison-card, [role="button"]';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
})();

// ---- EFECTO MAGNETIC PARA BOTONES ----
(function magneticButtons(){
  const buttons = document.querySelectorAll('.nav-btn, .action-small');
  
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
})();

// ---- EFECTO RIPPLE EN CLICKS ----
(function rippleEffect(){
  const style = document.createElement('style');
  style.textContent = `
    .ripple-container {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      border-radius: inherit;
    }
    .ripple-wave {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      transform: scale(0);
      animation: rippleWave 0.6s ease-out forwards;
    }
    @keyframes rippleWave {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  document.querySelectorAll('.nav-btn, .action-small, button, .btn').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    
    btn.addEventListener('click', (e) => {
      let container = btn.querySelector('.ripple-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'ripple-container';
        btn.appendChild(container);
      }
      
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'ripple-wave';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      
      container.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
})();

// ---- PARALLAX SUAVE EN SCROLL ----
(function parallaxScroll(){
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        const yPos = (scrollY - el.offsetTop) * speed;
        el.style.transform = `translateY(${yPos}px)`;
      }
    });
  });
})();

// ---- PROGRESS INDICATOR EN SCROLL ----
(function scrollProgress(){
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress-bar';
  progressBar.innerHTML = '<div class="scroll-progress-fill"></div>';
  document.body.appendChild(progressBar);

  const style = document.createElement('style');
  style.textContent = `
    .scroll-progress-bar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: rgba(255, 255, 255, 0.1);
      z-index: 10000;
    }
    .scroll-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--rosa-principal, #F26398), var(--amarillo, #CBF291));
      width: 0%;
      transition: width 0.1s ease;
      box-shadow: 0 0 10px var(--rosa-principal, #F26398);
    }
  `;
  document.head.appendChild(style);

  const fill = progressBar.querySelector('.scroll-progress-fill');
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    fill.style.width = scrollPercent + '%';
  });
})();

// ---- HOVER EFFECT PARA TARJETAS CON SPOTLIGHT ----
(function spotlightCards(){
  const style = document.createElement('style');
  style.textContent = `
    .spotlight-card {
      position: relative;
      overflow: hidden;
    }
    .spotlight-card::before {
      content: '';
      position: absolute;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(242, 99, 152, 0.3) 0%, transparent 70%);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      transform: translate(-50%, -50%);
    }
    .spotlight-card:hover::before {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);

  document.querySelectorAll('.kpi-card, .comparison-card, .highlight-box').forEach(card => {
    card.classList.add('spotlight-card');
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--spotlight-x', x + 'px');
      card.style.setProperty('--spotlight-y', y + 'px');
      
      const before = window.getComputedStyle(card, '::before');
      card.style.cssText += `--mouse-x: ${x}px; --mouse-y: ${y}px;`;
    });
  });

  // Actualizar el estilo para usar las variables
  const dynamicStyle = document.createElement('style');
  dynamicStyle.textContent = `
    .spotlight-card::before {
      left: var(--mouse-x, 50%);
      top: var(--mouse-y, 50%);
    }
  `;
  document.head.appendChild(dynamicStyle);
})();

// ---- NOTIFICACIÓN DE CARGA COMPLETADA ----
(function loadingComplete(){
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Pequeña animación de "ready"
    const notification = document.createElement('div');
    notification.className = 'load-notification';
    notification.innerHTML = '✨ Presentación cargada';
    document.body.appendChild(notification);

    const style = document.createElement('style');
    style.textContent = `
      .load-notification {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: linear-gradient(135deg, var(--rosa-principal, #F26398), var(--rosa-claro, #E89BA0));
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(242, 99, 152, 0.4);
        z-index: 10001;
        animation: slideUpNotify 0.5s ease forwards, fadeOutNotify 0.5s ease 2.5s forwards;
      }
      @keyframes slideUpNotify {
        to { transform: translateX(-50%) translateY(0); }
      }
      @keyframes fadeOutNotify {
        to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => notification.remove(), 3500);
  });
})();

// ---- 3D Hero (Three.js) ----
(function initThreeHero(){
  const heroCanvas = document.getElementById('hero3d');
  if(!heroCanvas) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, heroCanvas.clientWidth/heroCanvas.clientHeight, 0.1, 1000);
  camera.position.z = 55;
  const renderer = new THREE.WebGLRenderer({canvas: heroCanvas, alpha:true, antialias:true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(heroCanvas.clientWidth, heroCanvas.clientHeight);
  const light = new THREE.PointLight(0xffffff, 1.1);
  light.position.set(40,40,60); scene.add(light);
  const amb = new THREE.AmbientLight(0xffffff, .55); scene.add(amb);
  const material = new THREE.MeshStandardMaterial({
    color: 0xF26398,
    roughness: .25,
    metalness: .65,
    emissive: 0xE89BA0,
    emissiveIntensity:.15
  });
  const geometry = new THREE.TorusKnotGeometry(12, 3.8, 220, 18);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  let last = performance.now();
  function animate(now){
    requestAnimationFrame(animate);
    const dt = (now - last)/1000; last = now;
    mesh.rotation.x += dt * 0.18;
    mesh.rotation.y += dt * 0.22;
    renderer.render(scene, camera);
  }
  animate(last);
  window.addEventListener('resize', ()=>{
    renderer.setSize(heroCanvas.clientWidth, heroCanvas.clientHeight);
    camera.aspect = heroCanvas.clientWidth/heroCanvas.clientHeight;
    camera.updateProjectionMatrix();
  });
})();

// ---- Intersection reveal for KPI & lists ----
(function addReveal(){
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, {threshold:.15});
  document.querySelectorAll('.kpi-card, .index-item, .comparison-card, .highlight-box, table.data-table').forEach(el => {
    el.classList.add('reveal'); observer.observe(el);
  });
})();

// ---- Interactive tilt for buttons and KPI cards ----
(function tiltInteractive(){
  const targets = document.querySelectorAll('.nav-btn, .action-small, .kpi-card, .comparison-card');
  targets.forEach(el => {
    el.classList.add('depth-3d');
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width; // 0-1
      const y = (e.clientY - r.top) / r.height; // 0-1
      const rotX = (y - 0.5) * 10; // tilt range
      const rotY = (x - 0.5) * -10;
      el.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    el.addEventListener('mouseleave', ()=>{
      el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
    });
    el.addEventListener('click', ()=>{
      el.classList.remove('ripple-active');
      void el.offsetWidth; // force repaint
      el.classList.add('ripple-active');
      setTimeout(()=> el.classList.remove('ripple-active'), 650);
    });
  });
})();

// ---- Background particles (subtle floating dots) ----
(function particles(){
  const canvas = document.createElement('canvas');
  canvas.id = 'particlesCanvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let w, h; const count = 55; const parts = [];
  function resize(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();
  for(let i=0;i<count;i++){
    parts.push({
      x: Math.random()*w,
      y: Math.random()*h,
      r: 2 + Math.random()*3,
      dx: (Math.random()-.5)*0.3,
      dy: (Math.random()-.5)*0.3,
      c: Math.random()<0.5 ? '#F26398' : '#E89BA0'
    });
  }
  function step(){
    ctx.clearRect(0,0,w,h);
    parts.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if(p.x<0||p.x>w) p.dx*=-1; if(p.y<0||p.y>h) p.dy*=-1;
      ctx.beginPath();
      ctx.fillStyle = p.c + 'AA';
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(step);
  }
  step();
})();

// ---- Radial Gauge Sentiment (Canvas manual) ----
function drawSentimentGauge(){
  const container = document.getElementById('gaugeSentiment');
  if(!container) return;
  const canvas = document.createElement('canvas');
  canvas.width = 340; canvas.height = 340; container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const percent = 1; // 100% positivo
  const start = -Math.PI/2;
  const end = start + percent * Math.PI * 2;
  // Background ring
  ctx.lineWidth = 34; ctx.lineCap='round';
  ctx.strokeStyle = '#FFD5DC';
  ctx.beginPath(); ctx.arc(170,170,120,start,start+Math.PI*2); ctx.stroke();
  // Gradient arc
  const grad = ctx.createLinearGradient(50,50,290,290);
  grad.addColorStop(0,'#F26398'); grad.addColorStop(1,'#E89BA0');
  ctx.strokeStyle = grad;
  ctx.beginPath(); ctx.arc(170,170,120,start,end); ctx.stroke();
  // Inner 3D shading to simulate depth
  const innerGrad = ctx.createRadialGradient(170,170,40,170,170,120);
  innerGrad.addColorStop(0,'rgba(255,255,255,0.35)');
  innerGrad.addColorStop(1,'rgba(255,213,220,0)');
  ctx.lineWidth = 20; ctx.strokeStyle = innerGrad;
  ctx.beginPath(); ctx.arc(170,170,110,start,end); ctx.stroke();
  // Value overlay already via DOM
  const label = document.createElement('div'); label.className='gauge-value'; label.textContent='100%';
  container.appendChild(label);
}

// Expose for app.js when slide 9 becomes active
window.drawSentimentGauge = drawSentimentGauge;

// ---- Chart.js global styling enhancements (shadows, gradients) ----
(function extendChart(){
  if(!window.Chart) return;
  const palette = ['#F26398','#CBF291','#E89BA0','#FFD5DC','#D9E875'];
  // Plugin: subtle shadow
  Chart.register({
    id: 'shadow',
    beforeDraw(chart, args, opts){
      const {ctx, chartArea, config} = chart;
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,.15)';
      ctx.shadowBlur = 12; ctx.shadowOffsetY = 6;
    },
    afterDraw(chart){ chart.ctx.restore(); }
  });
  // Helper to gradient fill dataset backgrounds
  function applyGradients(chart){
    const {ctx, chartArea} = chart; if(!chartArea) return;
    chart.data.datasets.forEach(ds => {
      if(ds.type === 'line' || chart.config.type === 'line'){ // line background fill
        const grad = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        grad.addColorStop(0, '#F26398AA'); grad.addColorStop(1,'#F2639800');
        ds.backgroundColor = grad;
      }
    });
  }
  Chart.register({ id:'gradientFill', afterLayout: applyGradients });

  // Plugin: 3D bar faces simulation
  Chart.register({
    id: 'bar3d',
    afterDatasetsDraw(chart, args, opts){
      const {ctx} = chart; const metaSets = chart.getSortedVisibleDatasetMetas();
      metaSets.forEach(meta => {
        if(meta.type !== 'bar') return;
        meta.data.forEach(bar => {
          const {x,y,width,height} = bar.getProps(['x','y','width','height'], true);
          const left = x - width/2; const top = y; const right = x + width/2; const bottom = bar.base;
          const depth = Math.min(16, width*0.6);
          // Front face already drawn; draw top + side with darker/lighter shades
          const frontColor = bar.options.backgroundColor || '#F26398';
          // Top face
          ctx.beginPath();
          ctx.moveTo(left, top);
          ctx.lineTo(right, top);
          ctx.lineTo(right+depth*0.6, top - depth);
          ctx.lineTo(left+depth*0.6, top - depth);
          ctx.closePath();
          ctx.fillStyle = shadeColor(frontColor, 12);
          ctx.fill();
          // Side face
          ctx.beginPath();
          ctx.moveTo(right, top);
          ctx.lineTo(right, bottom);
          ctx.lineTo(right+depth*0.6, bottom - depth);
          ctx.lineTo(right+depth*0.6, top - depth);
          ctx.closePath();
          ctx.fillStyle = shadeColor(frontColor, -10);
          ctx.fill();
        });
      });
      function shadeColor(col, amt){
        // col format #RRGGBB
        let c = col.replace('#','');
        if(c.length===3){ c = c.split('').map(x=>x+x).join(''); }
        const num = parseInt(c,16);
        let r = (num >> 16) + amt; let g = ((num >> 8) & 0xFF) + amt; let b = (num & 0xFF) + amt;
        r = Math.max(Math.min(255,r),0); g = Math.max(Math.min(255,g),0); b = Math.max(Math.min(255,b),0);
        return '#' + (r.toString(16).padStart(2,'0')) + (g.toString(16).padStart(2,'0')) + (b.toString(16).padStart(2,'0'));
      }
    }
  });
})();
