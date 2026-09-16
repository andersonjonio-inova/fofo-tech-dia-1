(() => {
  const legacy = location.hash.match(/^#(\d{1,2})$/);
  const legacyIndex = legacy ? Math.max(0, Number(legacy[1]) - 1) : null;
  document.querySelectorAll('.reveal .slides > section').forEach(section => {
    if (section.dataset.note && !section.querySelector('aside.notes')) {
      const notes = document.createElement('aside');
      notes.className = 'notes';
      notes.textContent = section.dataset.note;
      section.append(notes);
    }
  });

  Reveal.initialize({
    width: 1600,
    height: 900,
    margin: 0,
    minScale: 0.2,
    maxScale: 2,
    controls: true,
    controlsTutorial: false,
    progress: true,
    slideNumber: 'c/t',
    hash: true,
    hashOneBasedIndex: true,
    history: true,
    center: false,
    touch: true,
    overview: true,
    navigationMode: 'linear',
    transition: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'none' : 'fade',
    backgroundTransition: 'none',
    plugins: [RevealNotes]
  }).then(() => {
    if (legacyIndex !== null) Reveal.slide(legacyIndex);
    updateTitle();
  });

  function updateTitle() {
    const slide = Reveal.getCurrentSlide();
    document.title = `${slide?.dataset.title || 'Dia 1'} · FOFO TECH`;
    const status = document.querySelector('#slideStatus');
    if (status) {
      const indices = Reveal.getIndices();
      status.textContent = `Slide ${indices.h + 1} de ${Reveal.getTotalSlides()}: ${slide?.dataset.title || 'Dia 1'}`;
    }
  }
  Reveal.on('slidechanged', updateTitle);

  const tools = document.querySelector('.facilitator-tools');
  const timerToggle = document.querySelector('#timerToggle');
  const timerDisplay = document.querySelector('#timerDisplay');
  const timerReset = document.querySelector('#timerReset');
  const timerDialog = document.querySelector('#timerDialog');
  const timerMinutes = document.querySelector('#timerMinutes');
  const timerSeconds = document.querySelector('#timerSeconds');
  const notesOpen = document.querySelector('#notesOpen');
  const prevSlide = document.querySelector('#prevSlide');
  const nextSlide = document.querySelector('#nextSlide');
  const fullscreenToggle = document.querySelector('#fullscreenToggle');
  let duration = 300;
  let remaining = duration;
  let running = false;
  let interval = null;

  const format = value => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
  function paint() {
    timerDisplay.textContent = format(remaining);
    timerToggle.textContent = running ? 'Ⅱ' : '▶';
    tools.classList.toggle('running', running);
    tools.classList.toggle('done', !running && remaining === 0);
  }
  function pause() { running = false; clearInterval(interval); paint(); }
  function toggleTimer() {
    if (running) { pause(); return; }
    if (remaining <= 0) remaining = duration;
    running = true;
    interval = setInterval(() => {
      remaining = Math.max(0, remaining - 1);
      if (!remaining) pause();
      paint();
    }, 1000);
    paint();
  }
  function resetTimer() { pause(); remaining = duration; paint(); }
  function openTimer() {
    timerMinutes.value = Math.floor(duration / 60);
    timerSeconds.value = duration % 60;
    timerDialog.showModal();
    timerMinutes.focus();
    timerMinutes.select();
  }
  function applyTimer() {
    const minutes = Math.max(0, Math.min(180, Number(timerMinutes.value) || 0));
    const seconds = Math.max(0, Math.min(59, Number(timerSeconds.value) || 0));
    duration = minutes * 60 + seconds;
    remaining = duration;
    pause();
  }
  timerToggle.addEventListener('click', toggleTimer);
  timerDisplay.addEventListener('click', openTimer);
  timerReset.addEventListener('click', resetTimer);
  timerDialog.addEventListener('close', () => { if (timerDialog.returnValue === 'default') applyTimer(); });
  timerDialog.querySelectorAll('[data-min]').forEach(button => button.addEventListener('click', () => {
    timerMinutes.value = button.dataset.min;
    timerSeconds.value = 0;
  }));
  notesOpen.addEventListener('click', () => Reveal.getPlugin('notes')?.open());
  prevSlide.addEventListener('click', () => Reveal.prev());
  nextSlide.addEventListener('click', () => Reveal.next());

  const getFullscreenElement = () => document.fullscreenElement || document.webkitFullscreenElement;
  const canFullscreen = Boolean(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen);
  function syncFullscreenButton() {
    const active = Boolean(getFullscreenElement());
    fullscreenToggle.textContent = active ? '⤡' : '⛶';
    fullscreenToggle.setAttribute('aria-pressed', String(active));
    fullscreenToggle.setAttribute('aria-label', active ? 'Sair da tela cheia' : 'Entrar em tela cheia');
    fullscreenToggle.title = active ? 'Sair da tela cheia · tecla F ou Esc' : 'Tela cheia · tecla F';
    requestAnimationFrame(() => Reveal.layout());
  }
  async function toggleFullscreen() {
    if (!canFullscreen) return;
    try {
      if (getFullscreenElement()) {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        await exit?.call(document);
      } else {
        const request = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
        await request?.call(document.documentElement);
      }
    } catch (error) {
      console.warn('Não foi possível alternar a tela cheia.', error);
    }
  }
  fullscreenToggle.addEventListener('click', toggleFullscreen);
  fullscreenToggle.hidden = !canFullscreen;
  document.addEventListener('fullscreenchange', syncFullscreenButton);
  document.addEventListener('webkitfullscreenchange', syncFullscreenButton);
  syncFullscreenButton();

  addEventListener('keydown', event => {
    if (timerDialog.open) return;
    const interactive = event.target instanceof Element && event.target.closest('input, textarea, select, button, a, [contenteditable="true"]');
    if (!interactive) {
      const nextKeys = ['PageDown', 'ArrowRight', 'ArrowDown', ' ', 'Enter', 'MediaTrackNext'];
      const prevKeys = ['PageUp', 'ArrowLeft', 'ArrowUp', 'Backspace', 'MediaTrackPrevious'];
      if (nextKeys.includes(event.key)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        Reveal.next();
        return;
      }
      if (prevKeys.includes(event.key)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        Reveal.prev();
        return;
      }
    }
    if (event.key.toLowerCase() === 't') { event.preventDefault(); toggleTimer(); }
    if (event.key.toLowerCase() === 'r') { event.preventDefault(); resetTimer(); }
    if (event.key.toLowerCase() === 'n') { event.preventDefault(); Reveal.getPlugin('notes')?.open(); }
    if (event.key.toLowerCase() === 'f') {
      event.preventDefault();
      toggleFullscreen();
    }
  }, true);
  paint();
})();
