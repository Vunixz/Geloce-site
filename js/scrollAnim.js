/* ============================================================
   SCROLLANIM.JS — Animação de Scroll 3D (Troca de Imagens)
   ============================================================ */

(function () {
  'use strict';

  /* ----- ELEMENTOS DOM ----- */
  const section     = document.getElementById('scroll-anim');
  const gelato3D    = document.getElementById('gelato3D');
  const fullCup     = document.getElementById('fullCupLayer');
  const iceCream    = document.getElementById('iceCreamLayer');
  const emptyCup    = document.getElementById('cupLayer');
  
  if (!section || !gelato3D || !fullCup || !iceCream || !emptyCup) return;

  /* ----- UTILIDADES ----- */
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
  
  function easeInCubic(t) {
    return t * t * t;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function mapRange(value, inMin, inMax, outMin, outMax) {
    const mapped = ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
    return Math.max(Math.min(outMin, outMax), Math.min(Math.max(outMin, outMax), mapped));
  }

  /* ----- HANDLER DE SCROLL ----- */
  function onScroll() {
    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight;
    const viewportHeight = window.innerHeight;

    const scrolled = -rect.top;
    const totalScroll = sectionHeight - viewportHeight;
    const progress = Math.max(0, Math.min(1, scrolled / totalScroll));
    
    // --- 1. MUDANÇA DE COR DO FUNDO ---
    if (progress > 0.4) {
      document.body.classList.add('bg-yellow-mode');
    } else {
      document.body.classList.remove('bg-yellow-mode');
    }

    // --- 2. TROCA DE IMAGENS INICIAL ---
    // Aumentado para 0.2 para dar mais tempo com a taça completa
    if (progress > 0.2) {
      fullCup.style.opacity = 0;
      iceCream.style.opacity = 1;
      emptyCup.style.opacity = 1;
    } else {
      fullCup.style.opacity = 1;
      iceCream.style.opacity = 0;
      emptyCup.style.opacity = 0;
    }


    // --- 3. ANIMAÇÃO DE ZOOM E QUEDA ---
    const easeProgress = easeInOutQuad(progress);

    // Rotação geral
    const rotateY = mapRange(easeProgress, 0, 0.4, 0, -10);
    const rotateX = mapRange(easeProgress, 0, 0.4, 0, 5);
    gelato3D.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    // A Taça Vazia: Começa a descer apenas após 0.2
    const cupTranslateY = mapRange(progress, 0.2, 0.5, 0, 500); 
    const cupScale = mapRange(progress, 0.2, 0.5, 1, 0.4); 
    const cupOpacity = 1 - mapRange(progress, 0.2, 0.7, 0, 1); 
    
    emptyCup.style.transform = `translateY(${cupTranslateY}px) scale(${cupScale})`;
    // Apenas aplica opacidade se já fizemos a troca das imagens
    if (progress > 0.2) emptyCup.style.opacity = cupOpacity;


    // O Sorvete: Levanta ligeiramente e dá um Zoom brutal no centro
    // Retornado para easeInCubic original
    // O Sorvete: Começa a crescer após 0.2
    const zoomProgress = easeInCubic(Math.max(0, (progress - 0.2) / 0.75));
    
    const iceTranslateY = mapRange(easeOutCubic(progress), 0.2, 0.7, 0, 180);
    
    // Escalar de 1x para 6x 
    const iceScale = 1 + (5 * zoomProgress);
    
    const iceFinalOpacity = 1 - mapRange(progress, 0.7, 0.85, 0, 1);

    iceCream.style.transform = `translateY(${iceTranslateY}px) scale(${iceScale})`;
    if (progress > 0.2) iceCream.style.opacity = iceFinalOpacity;

    
    // Evita bloqueio de ponteiro sobre o cardápio
    if (progress >= 0.85) {
      iceCream.style.visibility = 'hidden';
      gelato3D.style.pointerEvents = 'none';
    } else {
      iceCream.style.visibility = 'visible';
      gelato3D.style.pointerEvents = 'auto';
    }
  }

  /* ----- INICIALIZAÇÃO ----- */
  function init() {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
