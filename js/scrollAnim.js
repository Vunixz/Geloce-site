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
    // Atrasado para 0.12 para dar bastante tempo do usuário ver o início do scroll com a taça completa
    if (progress > 0.12) {
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

    // A Taça Vazia: Desce rápido, diminui e vai sumindo LENTAMENTE
    const cupTranslateY = mapRange(progress, 0.12, 0.45, 0, 500); 
    const cupScale = mapRange(progress, 0.12, 0.45, 1, 0.4); 
    const cupOpacity = 1 - mapRange(progress, 0.12, 0.7, 0, 1); // Esticado até 0.7 para sumir bem mais devagar 
    
    emptyCup.style.transform = `translateY(${cupTranslateY}px) scale(${cupScale})`;
    // Apenas aplica opacidade se já fizemos a troca das imagens
    if (progress > 0.12) emptyCup.style.opacity = cupOpacity;

    // O Sorvete: Levanta ligeiramente e dá um Zoom brutal no centro
    // Retornado para easeInCubic original
    const zoomProgress = easeInCubic(Math.max(0, (progress - 0.1) / 0.8));
    
    // Mover o sorvete um pouco para o centro (Y) para centralizar o zoom
    // Usamos transform-origin em CSS, mas aqui garantimos que a bola de sorvete fique no meio da tela
    const iceTranslateY = mapRange(easeOutCubic(progress), 0.1, 0.7, 0, 180);
    
    // Escalar de 1x para 6x (para não perder qualidade excessiva)
    const iceScale = 1 + (5 * zoomProgress);
    
    // O sorvete some totalmente no final (progress > 0.8) de forma mais suave e precoce
    const iceFinalOpacity = 1 - mapRange(progress, 0.7, 0.85, 0, 1);

    iceCream.style.transform = `translateY(${iceTranslateY}px) scale(${iceScale})`;
    if (progress > 0.12) iceCream.style.opacity = iceFinalOpacity;
    
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
