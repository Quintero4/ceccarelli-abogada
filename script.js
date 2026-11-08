/* ============================================================
   script.js · Cristina Ceccarelli – Abogada · abogadacristinac.com
   Sin dependencias externas. Compatible con CSP (script-src 'self').
   ============================================================ */

(function () {
  'use strict';

  const header  = document.querySelector('.site-header');
  const toggle  = document.getElementById('navToggle');
  const nav     = document.getElementById('mainNav');
  const links   = document.querySelectorAll('.nav-list a');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Menú hamburguesa ---------- */
  function setMenu(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Smooth scroll con compensación del header fijo ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight + 1;
      window.scrollTo({ top: id === '#quien-soy' ? 0 : top, behavior: reduceMotion ? 'auto' : 'smooth' });
      setMenu(false);
    });
  });

  /* ---------- Resaltar en el menú la sección visible ---------- */
  const sections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => observer.observe(s));
  }

  /* ---------- Tarjetas: voltear al tocar (móvil / teclado) ---------- */
  const cards = document.querySelectorAll('.flip-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const willFlip = !card.classList.contains('is-flipped');
      cards.forEach(c => c.classList.remove('is-flipped')); // solo una abierta a la vez
      card.classList.toggle('is-flipped', willFlip);
// ↓↓ AÑADIR: en tablet y móvil, al abrir, centra la tarjeta cuando termina la animación
    });
  });
  cards.forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  });
  // Tocar fuera de las tarjetas las vuelve a cerrar
  document.addEventListener('click', e => {
    if (!e.target.closest('.flip-card')) cards.forEach(c => c.classList.remove('is-flipped'));
  });

  /* ---------- Aviso legal ---------- */
  const dialog = document.getElementById('legalDialog');
  document.getElementById('openLegal').addEventListener('click', () => dialog.showModal());
  document.getElementById('closeLegal').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

  /* ---------- Año automático en el copyright ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Imágenes opcionales: si faltan, se ocultan sin romper el diseño ----------
     (sustituye a los antiguos onerror="" inline, que la CSP bloquearía) */
  function hideIfBroken(img, prop, value) {
    if (!img) return;
    const hide = () => { img.style[prop] = value; };
    if (img.complete && img.naturalWidth === 0) hide();
    img.addEventListener('error', hide);
  }
  hideIfBroken(document.querySelector('.brand-logo'), 'display', 'none');
  hideIfBroken(document.querySelector('.photo-frame img'), 'opacity', '0');

})();
