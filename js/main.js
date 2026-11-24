document.addEventListener('DOMContentLoaded', () => {
  // 1. Menu mobile accessible
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('#main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Bouton d'impression / export PDF
  document.querySelectorAll('.js-print-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.print();
    });
  });

  // 3. Onglets d'activités par tranche d'âge
  const tabs = Array.from(document.querySelectorAll('.age-tab'));
  const panels = Array.from(document.querySelectorAll('.age-panel'));

  function activateTab(tab) {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.classList.toggle('is-active', selected);
      t.setAttribute('aria-selected', String(selected));
    });

    const targetId = tab.getAttribute('aria-controls');
    panels.forEach((panel) => {
      const match = panel.id === targetId;
      panel.classList.toggle('is-active', match);
      panel.hidden = !match;
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        const next = tabs[(index + 1) % tabs.length];
        next.focus();
        activateTab(next);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const prev = tabs[(index - 1 + tabs.length) % tabs.length];
        prev.focus();
        activateTab(prev);
      }
    });
  });

  // 4. Lightbox pour les photos des espaces
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  let lastFocused = null;

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    if (lightboxImg) lightboxImg.src = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.js-lightbox').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      if (!lightbox || !lightboxImg || !lightboxCaption) return;
      lastFocused = trigger;
      lightboxImg.src = trigger.dataset.src || '';
      lightboxImg.alt = trigger.dataset.caption || '';
      lightboxCaption.textContent = trigger.dataset.caption || '';
      lightbox.hidden = false;
      const closeBtn = lightbox.querySelector('.lightbox-close');
      if (closeBtn) closeBtn.focus();
    });
  });

  document.querySelectorAll('.js-lightbox-close').forEach((el) => {
    el.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });

  // 5. Surlignage du lien actif au défilement
  const navLinks = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = `#${entry.target.id}`;
            navLinks.forEach((link) => {
              link.classList.toggle('is-active', link.getAttribute('href') === id);
            });
          }
        });
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }
});
