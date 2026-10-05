import fs from 'node:fs/promises';

const cdpEndpoint = process.env.CDP_ENDPOINT || 'http://127.0.0.1:9224';
const site = process.env.SITE_URL || 'http://127.0.0.1:8765';
const route = '/gestao-na-pratica-apresentacao/';
const out = '/tmp/gestao-na-pratica-validation';
await fs.mkdir(out, { recursive: true });

const target = await fetch(`${cdpEndpoint}/json/new?about:blank`, { method: 'PUT' }).then(response => response.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
let sequence = 0;
const pending = new Map();
const listeners = new Map();
const browserErrors = [];

socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    message.error ? reject(new Error(message.error.message)) : resolve(message.result);
  }
  for (const handler of listeners.get(message.method) || []) handler(message.params);
});
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});
const once = method => new Promise(resolve => {
  const handler = params => {
    listeners.set(method, (listeners.get(method) || []).filter(item => item !== handler));
    resolve(params);
  };
  listeners.set(method, [...(listeners.get(method) || []), handler]);
});
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

await send('Page.enable');
await send('Runtime.enable');
await send('Log.enable');
listeners.set('Runtime.exceptionThrown', [params => browserErrors.push(`Exception: ${params.exceptionDetails.text}`)]);
listeners.set('Log.entryAdded', [params => { if (params.entry.level === 'error') browserErrors.push(`Log: ${params.entry.text}`); }]);
listeners.set('Runtime.consoleAPICalled', [params => {
  if (params.type === 'error') browserErrors.push(`Console: ${params.args.map(arg => arg.value || arg.description).join(' ')}`);
}]);

async function viewport(width, height, mobile = false) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile, screenWidth: width, screenHeight: height });
  await send('Emulation.setTouchEmulationEnabled', { enabled: mobile, maxTouchPoints: mobile ? 5 : 1 });
}
async function navigate() {
  const loaded = once('Page.loadEventFired');
  await send('Page.navigate', { url: `${site}${route}` });
  await Promise.race([loaded, wait(8000)]);
  await wait(500);
}
async function evaluate(expression) {
  const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
  return response.result.value;
}
async function screenshot(name) {
  const response = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false, fromSurface: true });
  await fs.writeFile(`${out}/${name}`, Buffer.from(response.data, 'base64'));
}
const checks = [];
const check = (name, passed, detail) => checks.push({ name, passed: Boolean(passed), detail });

await viewport(1920, 1080);
await navigate();
await evaluate(`new Promise(resolve => { if (window.Reveal?.isReady()) return resolve(true); Reveal?.on('ready', () => resolve(true)); setTimeout(() => resolve(false), 5000); })`);
let state = await evaluate(`({
  ready: Reveal.isReady(),
  total: Reveal.getTotalSlides(),
  notes: document.querySelectorAll('aside.notes').length,
  controls: Boolean(document.querySelector('#prevSlide') && document.querySelector('#nextSlide') && document.querySelector('#fullscreenToggle') && document.querySelector('#overviewToggle')),
  toolbar: (() => { const box = document.querySelector('.facilitator-tools').getBoundingClientRect(); return { left: box.left, right: box.right, within: box.left >= 0 && box.right <= innerWidth }; })(),
  missingAssets: [...document.querySelectorAll('link[rel="stylesheet"],script[src],img[src]')].filter(element => element.sheet === null && element.tagName === 'LINK' || element.tagName === 'IMG' && !element.complete).map(element => element.getAttribute('href') || element.getAttribute('src'))
})`);
check('Reveal inicializado com 22 slides', state.ready && state.total === 22, JSON.stringify(state));
check('Notas presentes em todos os slides', state.notes === 22, `notas: ${state.notes}`);
check('Controles completos e dentro da tela', state.controls && state.toolbar.within, JSON.stringify(state.toolbar));
check('Ativos principais carregados', state.missingAssets.length === 0, JSON.stringify(state.missingAssets));

const overflow = await evaluate(`(async () => {
  const bad = [];
  for (let index = 0; index < Reveal.getTotalSlides(); index += 1) {
    Reveal.slide(index);
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const slide = Reveal.getCurrentSlide();
    const box = slide.getBoundingClientRect();
    const children = [...slide.children].filter(element => !element.matches('aside.notes'));
    const cut = children.some(element => {
      const child = element.getBoundingClientRect();
      return child.bottom > box.bottom + 1 || child.right > box.right + 1 || child.top < box.top - 1 || child.left < box.left - 1;
    });
    if (cut) bad.push({ index: index + 1, title: slide.dataset.title });
  }
  Reveal.slide(0);
  return bad;
})()`);
check('Slides sem conteúdo cortado em 1920 × 1080', overflow.length === 0, JSON.stringify(overflow));

await evaluate('Reveal.slide(0)'); await wait(900); await screenshot('01-capa-1920x1080.png');
await evaluate('Reveal.slide(6)'); await wait(900);
const visualState = await evaluate(`(() => { const slide = Reveal.getCurrentSlide(); const style = getComputedStyle(slide); return { index: Reveal.getIndices().h, title: slide.dataset.title, text: slide.innerText.slice(0, 160), className: slide.className, opacity: style.opacity, visibility: style.visibility, display: style.display, transform: style.transform, rect: slide.getBoundingClientRect().toJSON(), children: [...slide.children].filter(element => !element.matches('aside.notes')).map(element => ({ tag: element.tagName, className: element.className, rect: element.getBoundingClientRect().toJSON(), opacity: getComputedStyle(element).opacity, visibility: getComputedStyle(element).visibility })).slice(0, 8) }; })()`);
check('Slide não inicial visualmente presente', visualState.index === 6 && visualState.visibility === 'visible' && Number(visualState.opacity) > 0 && visualState.text.includes('ecossistema') && Math.abs(visualState.rect.y) < 2, JSON.stringify(visualState));
await screenshot('02-ecossistema-1920x1080.png');
await evaluate('Reveal.slide(9)'); await wait(900); await screenshot('03-ciclo-1920x1080.png');
await evaluate('Reveal.slide(10)'); await wait(900); await screenshot('04-piloto-1920x1080.png');
await evaluate('Reveal.slide(15)'); await wait(900); await screenshot('05-decisao-1920x1080.png');

await evaluate(`Reveal.slide(1); document.querySelector('#nextSlide').click()`); await wait(120);
const nextIndex = await evaluate('Reveal.getIndices().h');
await evaluate(`document.querySelector('#prevSlide').click()`); await wait(120);
const previousIndex = await evaluate('Reveal.getIndices().h');
check('Botões anterior e próximo', nextIndex === 2 && previousIndex === 1, JSON.stringify({ nextIndex, previousIndex }));
await evaluate(`document.querySelector('#overviewToggle').click()`); await wait(120);
const overviewOpen = await evaluate('Reveal.isOverview()');
await evaluate(`document.querySelector('#overviewToggle').click()`); await wait(120);
check('Visão geral', overviewOpen && !(await evaluate('Reveal.isOverview()')), 'abriu e fechou');
await evaluate(`document.querySelector('#timerToggle').click()`); await wait(1100);
const timerMoved = await evaluate(`document.querySelector('#timerDisplay').textContent !== '15:00'`);
await evaluate(`document.querySelector('#timerReset').click()`);
check('Temporizador', timerMoved && (await evaluate(`document.querySelector('#timerDisplay').textContent`)) === '15:00', 'iniciou e reiniciou');

await viewport(1366, 768);
await navigate();
await evaluate(`new Promise(resolve => { if (window.Reveal?.isReady()) return resolve(true); Reveal?.on('ready', () => resolve(true)); setTimeout(() => resolve(false), 5000); })`);
state = await evaluate(`({ slide: Reveal.getCurrentSlide().getBoundingClientRect().toJSON(), overflow: document.documentElement.scrollWidth <= innerWidth + 1, toolbar: (() => { const box = document.querySelector('.facilitator-tools').getBoundingClientRect(); return box.left >= 0 && box.right <= innerWidth; })() })`);
check('Projeção em 1366 × 768', state.overflow && state.toolbar && state.slide.right <= 1367 && state.slide.bottom <= 769, JSON.stringify(state));
await screenshot('06-capa-1366x768.png');

await viewport(390, 844, true);
await navigate();
await evaluate(`new Promise(resolve => { if (window.Reveal?.isReady()) return resolve(true); Reveal?.on('ready', () => resolve(true)); setTimeout(() => resolve(false), 5000); })`);
state = await evaluate(`({ overflow: document.documentElement.scrollWidth <= innerWidth + 1, toolbar: (() => { const box = document.querySelector('.facilitator-tools').getBoundingClientRect(); return box.left >= 0 && box.right <= innerWidth; })(), slide: Reveal.getCurrentSlide().getBoundingClientRect().toJSON() })`);
check('Celular sem rolagem horizontal', state.overflow && state.toolbar && state.slide.right <= 391, JSON.stringify(state));

const uniqueErrors = [...new Set(browserErrors)];
const report = { generatedAt: new Date().toISOString(), route, checks, browserErrors: uniqueErrors, passed: checks.every(item => item.passed) && uniqueErrors.length === 0 };
await fs.writeFile(`${out}/validation.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await send('Target.closeTarget', { targetId: target.id });
socket.close();
if (!report.passed) process.exitCode = 1;
