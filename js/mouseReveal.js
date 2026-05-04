/* ============================================================
   MOUSEREVEAL.JS — Efeito de Reveal Fluido com Partículas (Canvas)
   ============================================================ */

(function () {
  'use strict';

  /* ----- CONFIGURAÇÕES ----- */
  const CONFIG = {
    IMAGE_SRC:      'images/gelato_cup_full.png',
    BLUR_AMOUNT:    20,       // Desfoque da borda fluida
  };

  /* ----- ELEMENTOS DOM ----- */
  const wrap   = document.getElementById('revealWrap');
  const canvas = document.getElementById('revealCanvas');
  const cursor = document.getElementById('revealCursor');

  if (!canvas || !wrap) return;

  const ctx = canvas.getContext('2d');
  
  // Canvas offscreen para a máscara
  const maskCanvas = document.createElement('canvas');
  const maskCtx = maskCanvas.getContext('2d');

  /* ----- ESTADO ----- */
  let isHovering = false;
  let mouseX = -1000, mouseY = -1000;
  let image = null;
  let imageLoaded = false;
  let animFrameId = null;
  
  let particles = [];

  /* ----- CLASSE PARTÍCULA ----- */
  class Particle {
    constructor(x, y, isHover) {
      this.x = x + (Math.random() - 0.5) * 40; // Espalha um pouco
      this.y = y + (Math.random() - 0.5) * 40;
      // Hover cria manchas maiores e mais rápidas, idle cria pequenas bolhas lentas
      this.radius = isHover ? (Math.random() * 40 + 50) : (Math.random() * 30 + 10);
      this.life = 1;
      this.decay = isHover ? (Math.random() * 0.01 + 0.005) : (Math.random() * 0.005 + 0.002);
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
    }

    draw(context) {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, 255, 255, ${Math.max(0, this.life)})`;
      context.fill();
    }
  }

  /* ----- CARREGAR IMAGEM ----- */
  function loadImage() {
    image = new Image();
    image.crossOrigin = 'anonymous';

    image.onload = function () {
      imageLoaded = true;
      resizeCanvas();
      startLoop();
    };

    image.src = CONFIG.IMAGE_SRC;
  }

  /* ----- REDIMENSIONAR CANVAS ----- */
  function resizeCanvas() {
    const rect = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width  = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width  = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ----- CALCULAR DIMENSÕES DA IMAGEM ----- */
  function getImageDrawParams() {
    const cw = parseFloat(canvas.style.width);
    const ch = parseFloat(canvas.style.height);
    const iw = image.naturalWidth;
    const ih = image.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const w = iw * scale;
    const h = ih * scale;
    const x = (cw - w) / 2;
    const y = (ch - h) / 2;

    return { x, y, w, h };
  }

  /* ----- LOOP DE RENDERIZAÇÃO ----- */
  function draw() {
    if (!imageLoaded) return;

    animFrameId = requestAnimationFrame(draw);

    const cw = parseFloat(canvas.style.width);
    const ch = parseFloat(canvas.style.height);
    const params = getImageDrawParams();

    // 1. Atualizar e criar partículas
    if (isHovering) {
      // Cria várias partículas rápido para seguir o mouse como fluido
      particles.push(new Particle(mouseX, mouseY, true));
      particles.push(new Particle(mouseX, mouseY, true));
    } else {
      // Se estiver idle, cria partículas aleatórias esporadicamente na área da taça
      if (Math.random() < 0.08) {
        const randX = params.x + Math.random() * params.w;
        const randY = params.y + Math.random() * params.h;
        particles.push(new Particle(randX, randY, false));
      }
    }

    // Atualiza vida e remove mortas
    particles.forEach(p => p.update());
    particles = particles.filter(p => p.life > 0);

    // 2. Desenhar a máscara (manchas) no canvas offscreen
    maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    const dpr = window.devicePixelRatio || 1;
    maskCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    
    // Usar filtro no maskCtx para suavizar as bolhas (fluido)
    maskCtx.filter = `blur(${CONFIG.BLUR_AMOUNT}px)`;
    particles.forEach(p => p.draw(maskCtx));
    maskCtx.filter = 'none'; // reset

    // 3. Limpar canvas principal
    ctx.clearRect(0, 0, cw, ch);

    // 4. Desenhar a imagem colorida
    ctx.globalCompositeOperation = 'source-over';
    ctx.filter = 'none';
    ctx.globalAlpha = 1;
    ctx.drawImage(image, params.x, params.y, params.w, params.h);

    // 5. Aplicar a máscara fluida
    ctx.globalCompositeOperation = 'destination-in';
    // Desenhar o canvas de máscara por cima, considerando a densidade de pixel
    ctx.setTransform(1, 0, 0, 1, 0, 0); 
    ctx.drawImage(maskCanvas, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // reset dpr transform

    // 6. Desenhar a imagem P&B de fundo (sem transparência, 100% visível)
    ctx.globalCompositeOperation = 'destination-over';
    ctx.filter = 'grayscale(100%) brightness(1.2) contrast(0.8)';
    ctx.globalAlpha = 1; // Agora é 100% opaco conforme pedido
    ctx.drawImage(image, params.x, params.y, params.w, params.h);
  }

  function startLoop() {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    draw();
  }

  /* ----- EVENT LISTENERS ----- */
  function handleMouseMove(e) {
    const rect = wrap.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    isHovering = true;

    if (cursor) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
      cursor.classList.add('active');
    }
  }

  function handleMouseLeave() {
    isHovering = false;
    mouseX = -1000;
    mouseY = -1000;

    if (cursor) {
      cursor.classList.remove('active');
    }
  }

  function init() {
    wrap.addEventListener('mousemove', handleMouseMove);
    wrap.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', resizeCanvas);
    loadImage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
