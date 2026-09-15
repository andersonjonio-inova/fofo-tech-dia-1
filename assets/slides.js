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

  addEventListener('keydown', event => {
    if (timerDialog.open) return;
    if (event.key.toLowerCase() === 't') { event.preventDefault(); toggleTimer(); }
    if (event.key.toLowerCase() === 'r') { event.preventDefault(); resetTimer(); }
    if (event.key.toLowerCase() === 'n') { event.preventDefault(); Reveal.getPlugin('notes')?.open(); }
    if (event.key.toLowerCase() === 'f') {
      event.preventDefault();
      document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
    }
  }, true);
  paint();
})();
