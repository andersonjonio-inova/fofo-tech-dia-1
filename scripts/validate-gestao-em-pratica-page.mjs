import fs from 'node:fs/promises';

const cdpEndpoint = process.env.CDP_ENDPOINT || 'http://127.0.0.1:9225';
const site = process.env.SITE_URL || 'http://127.0.0.1:8765';
const route = '/gestao-em-pratica-cjf/';
const out = process.env.VALIDATION_OUT || '/tmp/gestao-em-pratica-page-validation';
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

async function viewport(width, height, mobile = false) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile, screenWidth: width, screenHeight: height });
  await send('Emulation.setTouchEmulationEnabled', { enabled: mobile, maxTouchPoints: mobile ? 5 : 1 });
}
async function navigate() {
  const loaded = once('Page.loadEventFired');
  await send('Page.navigate', { url: `${site}${route}` });
  await Promise.race([loaded, wait(8000)]);
  await wait(700);
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
let state = await evaluate(`({
  title: document.title,
  numbered: [...document.querySelectorAll('.eyebrow')].map(e => e.textContent.trim()).filter(t => /^(0[1-9]|1[01]) ·/.test(t)),
  pdf: document.querySelector('a[href="../materiais/newsletter-delegacao.pdf"]')?.href,
  assets: [...document.querySelectorAll('link[rel="stylesheet"],script[src],img[src]')].map(element => ({tag: element.tagName, url: element.href || element.src, loaded: element.tagName === 'LINK' ? Boolean(element.sheet) : element.tagName === 'IMG' ? element.complete && element.naturalWidth > 0 : true})),
  overflow: document.documentElement.scrollWidth <= innerWidth + 1,
  h1: document.querySelector('h1')?.innerText,
  phases: document.querySelectorAll('.gep-phase').length,
  risks: document.querySelectorAll('.gep-risk-grid article').length
})`);
check('Título e identificação CJF', state.title === 'Gestão na Prática CJF' && state.h1.includes('Prática CJF'), JSON.stringify({ title: state.title, h1: state.h1 }));
check('Onze blocos do documento', state.numbered.length === 11, JSON.stringify(state.numbered));
check('Arquitetura em duas fases e oito riscos', state.phases === 2 && state.risks === 8, JSON.stringify({ phases: state.phases, risks: state.risks }));
check('PDF da newsletter preservado', Boolean(state.pdf?.endsWith('/materiais/newsletter-delegacao.pdf')), state.pdf);
check('Ativos principais carregados', state.assets.every(item => item.loaded), JSON.stringify(state.assets.filter(item => !item.loaded)));
check('Desktop sem rolagem horizontal', state.overflow, `scrollWidth <= ${1920}`);
await screenshot('01-hero-1920x1080.png');
await evaluate(`document.querySelector('#fases').scrollIntoView()`); await wait(500); await screenshot('02-fases-1920x1080.png');
await evaluate(`document.querySelector('#piloto').scrollIntoView()`); await wait(500); await screenshot('03-piloto-1920x1080.png');

await viewport(390, 844, true);
await navigate();
await evaluate(`document.querySelector('.gep-nav-toggle').click()`); await wait(150);
state = await evaluate(`({
  overflow: document.documentElement.scrollWidth <= innerWidth + 1,
  menuOpen: document.querySelector('#gep-nav').classList.contains('open'),
  menuExpanded: document.querySelector('.gep-nav-toggle').getAttribute('aria-expanded'),
  clipped: [...document.querySelectorAll('main section')].filter(section => section.getBoundingClientRect().right > innerWidth + 1).map(section => section.id)
})`);
check('Menu móvel abre e informa estado', state.menuOpen && state.menuExpanded === 'true', JSON.stringify(state));
check('Celular sem rolagem horizontal', state.overflow && state.clipped.length === 0, JSON.stringify(state));
await screenshot('04-mobile-390x844.png');

const uniqueErrors = [...new Set(browserErrors)];
const report = { generatedAt: new Date().toISOString(), site, route, checks, browserErrors: uniqueErrors, passed: checks.every(item => item.passed) && uniqueErrors.length === 0 };
await fs.writeFile(`${out}/validation.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await send('Target.closeTarget', { targetId: target.id });
socket.close();
if (!report.passed) process.exitCode = 1;
