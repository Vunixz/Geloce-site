/* ============================================================
   CAROUSEL.JS — Lógica do Carrossel de Avaliações
   ============================================================ */

(function () {
  'use strict';

  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  
  if (!track || !prevBtn || !nextBtn) return;

  const cards = Array.from(track.children);
  let currentIndex = 0;

  // Atualizar a posição do carrossel
  function updateCarousel() {
    // Calcula a porcentagem de deslocamento baseado no índice
    // Cada card tem min-width: 100%, então deslocamos em blocos de 100%
    const translateX = -(currentIndex * 100);
    track.style.transform = `translateX(${translateX}%)`;
  }

  // Ir para o próximo
  function goNext() {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
    } else {
      currentIndex = 0; // Volta pro começo se chegar no final
    }
    updateCarousel();
  }

  // Ir para o anterior
  function goPrev() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = cards.length - 1; // Vai pro final se estiver no começo
    }
    updateCarousel();
  }

  // Event Listeners
  nextBtn.addEventListener('click', goNext);
  prevBtn.addEventListener('click', goPrev);

  // Opcional: auto-play do carrossel
  let autoPlayInterval = setInterval(goNext, 4000);

  // Pausar autoplay no hover
  track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
  track.addEventListener('mouseleave', () => {
    autoPlayInterval = setInterval(goNext, 4000);
  });

})();
