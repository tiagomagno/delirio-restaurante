// =============================================
//   DELÍRIO TROPICAL — Main JS
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ——— Menu Mobile ———
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('nav-mobile');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Fechar ao clicar em link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ——— Popup Cardápio ———
  const popupOverlay = document.getElementById('popup-cardapio');
  const btnOpenPopup = document.querySelectorAll('[data-popup="cardapio"]');
  const btnClosePopup = document.getElementById('popup-close');

  btnOpenPopup.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      popupOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (btnClosePopup) {
    btnClosePopup.addEventListener('click', () => {
      popupOverlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  if (popupOverlay) {
    popupOverlay.addEventListener('click', (e) => {
      if (e.target === popupOverlay) {
        popupOverlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ESC fecha popup e mobile nav
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (popupOverlay) {
        popupOverlay.classList.remove('open');
      }
      if (mobileNav) {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
      }
      document.body.style.overflow = '';
    }
  });

  // ——— Scroll to Top ———
  const scrollBtn = document.getElementById('scroll-top');

  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 500);
    });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ——— Header shrink on scroll ———
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 50
        ? '0 4px 20px rgba(0,0,0,0.3)'
        : '0 2px 12px rgba(0,0,0,0.2)';
    });
  }

  // ——— Hero parallax ———
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.25}px)`;
    });
  }

  // ——— Reveal on scroll (Intersection Observer) ———
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  // ——— Active nav link based on scroll ———
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');

  if (sections.length && navLinks.length) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }

  // ——— Lazy load images (fallback for older browsers) ———
  if ('loading' in HTMLImageElement.prototype) {
    // Nativo — nada a fazer
  } else {
    // Polyfill simples
    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    const imgObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imgObserver.unobserve(img);
        }
      });
    });
    lazyImgs.forEach(img => imgObserver.observe(img));
  }

});
