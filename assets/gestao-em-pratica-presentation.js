(() => {
  const slides = [...document.querySelectorAll('[data-presentation-slide]')];
  const startButton = document.querySelector('#startPresentation');
  const controls = document.querySelector('#presentationControls');
  const previousButton = document.querySelector('#previousSlide');
  const nextButton = document.querySelector('#nextSlide');
  const fullscreenButton = document.querySelector('#toggleFullscreen');
  const exitButton = document.querySelector('#exitPresentation');
  const counter = document.querySelector('#presentationCounter');
  const title = document.querySelector('#presentationTitle');
  const progress = document.querySelector('#presentationProgress');
  if (!slides.length || !startButton || !controls) return;

  let currentIndex = 0;
  let scrollPosition = 0;
  let touchStartX = 0;
  let touchStartY = 0;

  const isPresenting = () => document.body.classList.contains('gep-presenting');
  const nearestSlideIndex = () => {
    const center = window.scrollY + window.innerHeight / 2;
    return slides.reduce((best, slide, index) => {
      const slideCenter = slide.offsetTop + slide.offsetHeight / 2;
      const distance = Math.abs(slideCenter - center);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Number.POSITIVE_INFINITY }).index;
  };

  function refreshIcons() {
    if (window.lucide?.createIcons) window.lucide.createIcons();
  }

  function updateFullscreenButton() {
    const fullscreen = Boolean(document.fullscreenElement);
    fullscreenButton.innerHTML = `<i data-lucide="${fullscreen ? 'minimize' : 'maximize'}"></i>`;
    fullscreenButton.setAttribute('aria-label', fullscreen ? 'Sair da tela cheia' : 'Entrar em tela cheia');
    fullscreenButton.title = fullscreen ? 'Sair da tela cheia' : 'Tela cheia';
    refreshIcons();
  }

  function showSlide(index, direction = 1) {
    currentIndex = Math.max(0, Math.min(index, slides.length - 1));
    document.body.dataset.slideDirection = direction < 0 ? 'previous' : 'next';
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === currentIndex;
      slide.classList.toggle('is-presentation-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      slide.inert = !active;
      if (active) slide.scrollTop = 0;
    });
    const activeSlide = slides[currentIndex];
    counter.textContent = `${currentIndex + 1} / ${slides.length}`;
    title.textContent = activeSlide.dataset.slideTitle || `Tela ${currentIndex + 1}`;
    progress.style.width = `${((currentIndex + 1) / slides.length) * 100}%`;
    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === slides.length - 1;
    activeSlide.focus({ preventScroll: true });
  }

  async function enterPresentation() {
    if (isPresenting()) return;
    scrollPosition = window.scrollY;
    currentIndex = nearestSlideIndex();
    document.body.classList.add('gep-presenting');
    controls.setAttribute('aria-hidden', 'false');
    slides.forEach(slide => slide.setAttribute('tabindex', '-1'));
    showSlide(currentIndex);
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    } catch (_) {
      updateFullscreenButton();
    }
  }

  async function exitPresentation() {
    if (!isPresenting()) return;
    document.body.classList.remove('gep-presenting');
    document.body.removeAttribute('data-slide-direction');
    controls.setAttribute('aria-hidden', 'true');
    slides.forEach(slide => {
      slide.classList.remove('is-presentation-active');
      slide.removeAttribute('aria-hidden');
      slide.removeAttribute('tabindex');
      slide.inert = false;
    });
    if (document.fullscreenElement) {
      try { await document.exitFullscreen(); } catch (_) {}
    }
    window.scrollTo({ top: scrollPosition, behavior: 'instant' });
    startButton.focus({ preventScroll: true });
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch (_) {}
  }

  startButton.addEventListener('click', enterPresentation);
  previousButton.addEventListener('click', () => showSlide(currentIndex - 1, -1));
  nextButton.addEventListener('click', () => showSlide(currentIndex + 1, 1));
  fullscreenButton.addEventListener('click', toggleFullscreen);
  exitButton.addEventListener('click', exitPresentation);
  document.addEventListener('fullscreenchange', updateFullscreenButton);

  document.addEventListener('keydown', event => {
    if (!isPresenting()) return;
    if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
      event.preventDefault();
      showSlide(currentIndex + 1, 1);
    } else if (['ArrowLeft', 'PageUp'].includes(event.key)) {
      event.preventDefault();
      showSlide(currentIndex - 1, -1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      showSlide(0, -1);
    } else if (event.key === 'End') {
      event.preventDefault();
      showSlide(slides.length - 1, 1);
    } else if (event.key === 'Escape' && !document.fullscreenElement) {
      event.preventDefault();
      exitPresentation();
    }
  });

  document.addEventListener('touchstart', event => {
    if (!isPresenting() || event.touches.length !== 1) return;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', event => {
    if (!isPresenting() || !event.changedTouches.length) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX;
    const deltaY = event.changedTouches[0].clientY - touchStartY;
    if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
      showSlide(currentIndex + (deltaX < 0 ? 1 : -1), deltaX < 0 ? 1 : -1);
    }
  }, { passive: true });

  updateFullscreenButton();
})();
