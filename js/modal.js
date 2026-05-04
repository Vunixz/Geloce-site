/* ============================================================
   MODAL.JS — Gerenciador do Pop-up do Cardápio
   ============================================================ */

(function () {
  'use strict';

  const modalOverlay = document.getElementById('flavorModal');
  const modalCloseBtn = document.getElementById('modalClose');
  const flavorCards = document.querySelectorAll('.flavor-card');

  // Elementos internos do modal
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalPrice = document.getElementById('modalPrice');

  if (!modalOverlay || !flavorCards.length) return;

  // Abrir Modal
  function openModal(card) {
    const flavor = card.getAttribute('data-flavor');
    const imgSrc = card.getAttribute('data-img');
    const desc = card.getAttribute('data-desc');
    const price = card.getAttribute('data-price');

    // Injetar dados no modal
    modalImg.src = imgSrc;
    modalTitle.textContent = flavor;
    modalDesc.textContent = desc;
    modalPrice.textContent = price;

    // Mostrar modal
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Evita scroll do fundo
  }

  // Fechar Modal
  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restaura scroll
  }

  // Event Listeners pros Cards
  flavorCards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
  });

  // Event Listener para fechar (botão X)
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  // Event Listener para fechar (clicando fora)
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Fechar com tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

})();
