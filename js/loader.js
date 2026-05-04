/* ============================================================
   LOADER.JS — Tela de Carregamento
   
   Exibe o logo com animação durante o carregamento da página.
   Remove o overlay após todas as imagens carregarem (mín. 2.5s).
   ============================================================ */

(function () {
  'use strict';

  const loader = document.getElementById('loader');
  if (!loader) return;

  const MIN_DISPLAY_TIME = 2500; // Tempo mínimo de exibição (ms)
  const startTime = Date.now();

  /**
   * Esconde o loader com fade-out
   */
  function hideLoader() {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_DISPLAY_TIME - elapsed);

    setTimeout(function () {
      loader.classList.add('hidden');

      // Remove do DOM após a transição
      loader.addEventListener('transitionend', function () {
        loader.remove();
      }, { once: true });
    }, remaining);
  }

  // Aguarda todas as imagens carregarem
  window.addEventListener('load', hideLoader);

  // Fallback: esconde após 5s mesmo se algo falhar
  setTimeout(function () {
    if (!loader.classList.contains('hidden')) {
      hideLoader();
    }
  }, 5000);

})();
