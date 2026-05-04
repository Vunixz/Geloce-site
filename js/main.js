/* ============================================================
   MAIN.JS — Inicialização e Funcionalidades Gerais
   
   - Header com efeito de scroll (background ao scrollar)
   - Menu mobile (hamburger toggle)
   - Animações de entrada com Intersection Observer
   - Smooth scroll para âncoras
   ============================================================ */

(function () {
  'use strict';

  /* =========================================================
     1. HEADER — Efeito de scroll
     ========================================================= */
  function initHeader() {
    var header = document.getElementById('header');
    if (!header) return;

    var SCROLL_THRESHOLD = 50;

    function checkScroll() {
      if (window.scrollY > SCROLL_THRESHOLD) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll(); // Estado inicial
  }


  /* =========================================================
     2. MENU MOBILE — Toggle hamburger
     ========================================================= */
  function initMobileMenu() {
    var toggle = document.getElementById('navToggle');
    var links  = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      links.classList.toggle('active');

      // Animar barras do hamburger
      var spans = toggle.querySelectorAll('span');
      var isOpen = links.classList.contains('active');

      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Fechar menu ao clicar em um link
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('active');
        var spans = toggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }


  /* =========================================================
     3. ANIMAÇÕES DE ENTRADA — Intersection Observer
     ========================================================= */
  function initScrollAnimations() {
    var elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return;

    // Verificar suporte ao IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      // Fallback: mostrar todos
      elements.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Só anima uma vez
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }


  /* =========================================================
     4. SMOOTH SCROLL — Links âncora
     ========================================================= */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        var targetId = this.getAttribute('href');
        var target = document.querySelector(targetId);

        if (target) {
          var headerHeight = document.getElementById('header').offsetHeight;
          var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }


  /* =========================================================
     5. INICIALIZAÇÃO GERAL
     ========================================================= */
  function init() {
    initHeader();
    initMobileMenu();
    initScrollAnimations();
    initSmoothScroll();
  }

  // Esperar o DOM carregar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
