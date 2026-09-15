(() => {
  const legacySlide = location.pathname.endsWith('/') && location.pathname.split('/').filter(Boolean).at(-1) === 'fofo-tech-dia-1' && location.hash.match(/^#(\d{1,2})$/);
  if (legacySlide) {
    location.replace(`./encontro-1/${location.hash}`);
    return;
  }

  const icons = () => window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
  icons();

  const header = document.querySelector('[data-sticky-header]');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  const closeMenu = () => { nav?.classList.remove('open'); toggle?.setAttribute('aria-expanded', 'false'); };
  toggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(Boolean(open)));
  });
  addEventListener('scroll', () => header?.classList.toggle('scrolled', scrollY > 12), { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const selector = link.getAttribute('href');
      if (!selector || selector === '#') return;
      const target = document.querySelector(selector);
      if (!target) return;
      event.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      history.pushState(null, '', selector);
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  const dialog = document.querySelector('.lightbox');
  const dialogImage = dialog?.querySelector('img');
  const dialogCaption = dialog?.querySelector('p');
  const closeButton = dialog?.querySelector('.lightbox-close');
  let opener = null;

  function openLightbox(trigger) {
    if (!dialog || !dialogImage) return;
    opener = trigger;
    dialogImage.src = trigger.dataset.lightboxSrc || trigger.querySelector('img')?.src || '';
    dialogImage.alt = trigger.dataset.lightboxAlt || trigger.querySelector('img')?.alt || '';
    if (dialogCaption) dialogCaption.textContent = dialogImage.alt;
    dialog.showModal();
    closeButton?.focus();
  }
  function closeLightbox() {
    if (!dialog?.open) return;
    dialog.close();
    opener?.focus();
  }
  document.querySelectorAll('.media-zoom').forEach(item => {
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `${item.dataset.lightboxAlt || 'Imagem'}. Ampliar.`);
    item.addEventListener('click', event => {
      if (event.target.closest('a')) return;
      openLightbox(item);
    });
    item.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openLightbox(item); }
    });
  });
  closeButton?.addEventListener('click', closeLightbox);
  dialog?.addEventListener('click', event => { if (event.target === dialog) closeLightbox(); });
  dialog?.addEventListener('cancel', event => { event.preventDefault(); closeLightbox(); });
  addEventListener('keydown', event => { if (event.key === 'Escape') { closeLightbox(); closeMenu(); } });
})();
