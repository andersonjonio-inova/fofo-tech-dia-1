import fs from 'node:fs/promises';

const cdpEndpoint = 'http://127.0.0.1:9223';
const site = 'http://127.0.0.1:8765';
const out = new URL('../previews/', import.meta.url);
await fs.mkdir(out, { recursive: true });

const target = await fetch(`${cdpEndpoint}/json/new?about:blank`, { method: 'PUT' }).then(r => r.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
let seq = 0;
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
  const id = ++seq;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});
const once = method => new Promise(resolve => {
  const handler = params => { listeners.set(method, (listeners.get(method) || []).filter(item => item !== handler)); resolve(params); };
  listeners.set(method, [...(listeners.get(method) || []), handler]);
});
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

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
async function navigate(path) {
  const loaded = once('Page.loadEventFired');
  await send('Page.navigate', { url: `${site}${path}` });
  await Promise.race([loaded, wait(8000)]);
  await wait(700);
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
async function screenshot(name) {
  const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false, fromSurface: true });
  await fs.writeFile(new URL(name, out), Buffer.from(result.data, 'base64'));
}

const checks = [];
function check(name, passed, detail) { checks.push({ name, passed: Boolean(passed), detail }); }

await viewport(1920, 1080);
await navigate('/');
let state = await evaluate(`({title:document.title,h1:document.querySelector('h1')?.textContent.trim(),overflow:document.documentElement.scrollWidth<=innerWidth+1,days:document.querySelectorAll('.day-card').length,lightboxes:document.querySelectorAll('.media-zoom').length,links:[...document.links].filter(a=>a.href).length})`);
check('Portal desktop', state.title.includes('FOFO TECH') && state.overflow && state.days === 3, JSON.stringify(state));
await screenshot('01-portal-1920x1080.png');
await evaluate(`document.querySelector('.media-zoom').click()`);
await wait(250);
state = await evaluate(`({open:document.querySelector('.lightbox').open,alt:document.querySelector('.lightbox img').alt})`);
check('Lightbox do diagrama', state.open && state.alt.length > 20, JSON.stringify(state));
await screenshot('04-diagrama-ampliado.png');
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' });
await wait(150);
check('Fechamento por Esc', !(await evaluate(`document.querySelector('.lightbox')?.open`)), 'dialog fechado');

await viewport(1366, 768);
await navigate('/dia-2/');
state = await evaluate(`({title:document.title,overflow:document.documentElement.scrollWidth<=innerWidth+1,chapters:document.querySelectorAll('#capitulos .outcome-card').length,diagram:!!document.querySelector('.media-zoom'),links:[...document.links].filter(a=>a.href).length})`);
check('Dia 2 desktop', state.title.includes('Dia 2') && state.overflow && state.chapters === 10 && state.diagram && state.links > 10, JSON.stringify(state));
await screenshot('13-dia-2-1366x768.png');

await viewport(1920, 1080);
await navigate('/encontro-2/');
await evaluate(`new Promise(resolve=>{if(window.Reveal?.isReady())return resolve(true); Reveal?.on('ready',()=>resolve(true)); setTimeout(()=>resolve(false),5000)})`);
state = await evaluate(`({ready:Reveal.isReady(),total:Reveal.getTotalSlides(),progress:!!document.querySelector('.reveal .progress'),number:!!document.querySelector('.slide-number'),notes:!!Reveal.getPlugin('notes'),toolbar:(()=>{const r=document.querySelector('.facilitator-tools').getBoundingClientRect();return {within:r.left>=0&&r.right<=innerWidth}})()})`);
check('Dia 2: Reveal.js e 78 slides', state.ready && state.total === 78 && state.progress && state.number && state.notes && state.toolbar.within, JSON.stringify(state));
const slideOverflowDay2 = await evaluate(`(async()=>{const bad=[];for(let i=0;i<Reveal.getTotalSlides();i++){Reveal.slide(i);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));const s=Reveal.getCurrentSlide(),box=s.getBoundingClientRect();const visible=[...s.children].filter(el=>!el.matches('aside.notes')).some(el=>{const r=el.getBoundingClientRect();return r.bottom>box.bottom+1||r.right>box.right+1||r.top<box.top-1||r.left<box.left-1});if(visible)bad.push(s.dataset.title)}Reveal.slide(0);return bad})()`);
check('Dia 2: slides sem conteúdo cortado', slideOverflowDay2.length === 0, JSON.stringify({ bad: slideOverflowDay2 }));
await evaluate(`Reveal.slide(4)`); await wait(600); await screenshot('14-dia-2-integracao.png');
await evaluate(`Reveal.slide(35)`); await wait(600); await screenshot('15-dia-2-modelo-whiteboard.png');
await evaluate(`Reveal.slide(72)`); await wait(600); await screenshot('16-dia-2-checklist.png');
await evaluate(`Reveal.slide(0)`);

await viewport(1366, 768);
await navigate('/dia-1/');
state = await evaluate(`({title:document.title,overflow:document.documentElement.scrollWidth<=innerWidth+1,activities:document.querySelectorAll('.activity-card').length,resources:document.querySelectorAll('.resource-card').length,external:[...document.querySelectorAll('a[target="_blank"]')].every(a=>a.rel.includes('noopener')&&a.rel.includes('noreferrer'))})`);
check('Dia 1 desktop', state.title.includes('Dia 1') && state.overflow && state.activities === 6 && state.resources === 3 && state.external, JSON.stringify(state));
await screenshot('02-dia-1-1366x768.png');
await evaluate(`document.querySelector('.resource-card').scrollIntoView({block:'start'})`);
await wait(250);
await screenshot('05-recursos-dia-1.png');
await evaluate(`document.querySelector('#recursos .media-zoom').click()`);
await wait(250);
check('Ampliação do recurso', await evaluate(`document.querySelector('.lightbox').open && document.querySelector('.lightbox img').src.includes('fofo-tech-aprendizagem-em-rede.png')`), 'imagem da aprendizagem em rede ampliada');
await screenshot('06-recurso-ampliado.png');
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' });

await viewport(1920, 1080);
await navigate('/encontro-1/');
await evaluate(`new Promise(resolve=>{if(window.Reveal?.isReady())return resolve(true); Reveal?.on('ready',()=>resolve(true)); setTimeout(()=>resolve(false),5000)})`);
state = await evaluate(`({ready:Reveal.isReady(),total:Reveal.getTotalSlides(),index:Reveal.getIndices().h,progress:!!document.querySelector('.reveal .progress'),number:!!document.querySelector('.slide-number'),notes:!!Reveal.getPlugin('notes'),fullscreen:!!document.querySelector('#fullscreenToggle')&&!document.querySelector('#fullscreenToggle').hidden,nav:!!document.querySelector('#prevSlide')&&!!document.querySelector('#nextSlide'),toolbar:(()=>{const r=document.querySelector('.facilitator-tools').getBoundingClientRect();return {left:r.left,right:r.right,width:r.width,within:r.left>=0&&r.right<=innerWidth}})(),metrics:[...document.querySelectorAll('.reveal .slides>section')].slice(0,3).map(s=>({title:s.dataset.title,client:[s.clientWidth,s.clientHeight],scroll:[s.scrollWidth,s.scrollHeight],rect:[s.getBoundingClientRect().width,s.getBoundingClientRect().height]}))})`);
check('Reveal.js e 54 slides', state.ready && state.total === 54 && state.progress && state.number && state.notes, JSON.stringify(state));
check('Botão de tela cheia visível', state.fullscreen, JSON.stringify(state));
check('Controles de navegação responsivos', state.nav && state.toolbar.within, JSON.stringify(state.toolbar));
const slideOverflow = await evaluate(`(async()=>{const bad=[];for(let i=0;i<Reveal.getTotalSlides();i++){Reveal.slide(i);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));const s=Reveal.getCurrentSlide(),box=s.getBoundingClientRect();const visible=[...s.children].filter(el=>!el.matches('aside.notes')).some(el=>{const r=el.getBoundingClientRect();return r.bottom>box.bottom+1||r.right>box.right+1||r.top<box.top-1||r.left<box.left-1});if(visible)bad.push(s.dataset.title)}Reveal.slide(0);return bad})()`);
check('Slides sem conteúdo cortado', slideOverflow.length === 0, JSON.stringify({ bad: slideOverflow, metrics: state.metrics }));
await evaluate(`Reveal.slide(14)`); await wait(900); await screenshot('10-mentimeter-dialogado.png');
await evaluate(`Reveal.slide(24)`); await wait(900); await screenshot('11-fontes-curadoria.png');
await evaluate(`Reveal.slide(32)`); await wait(900); await screenshot('12-prompts-dialogados.png');
await evaluate(`Reveal.slide(39)`); await wait(900); await screenshot('13-artefatos-dialogados.png');
await evaluate(`Reveal.slide(47)`); await wait(900); await screenshot('14-ciclo-integrado.png');
await evaluate(`Reveal.slide(0)`);
await evaluate(`Reveal.slide(2); document.querySelector('#nextSlide').click()`); await wait(180);
const nextButtonIndex = await evaluate(`Reveal.getIndices().h`);
await evaluate(`document.querySelector('#prevSlide').click()`); await wait(180);
const prevButtonIndex = await evaluate(`Reveal.getIndices().h`);
check('Botões anterior e próximo', nextButtonIndex === 3 && prevButtonIndex === 2, JSON.stringify({nextButtonIndex,prevButtonIndex}));
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'PageDown', code: 'PageDown' });
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'PageDown', code: 'PageDown' });
await wait(180);
const clickerNextIndex = await evaluate(`Reveal.getIndices().h`);
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'PageUp', code: 'PageUp' });
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'PageUp', code: 'PageUp' });
await wait(180);
const clickerPrevIndex = await evaluate(`Reveal.getIndices().h`);
check('Passador Page Down e Page Up', clickerNextIndex === 3 && clickerPrevIndex === 2, JSON.stringify({clickerNextIndex,clickerPrevIndex}));
await evaluate(`document.querySelector('#timerToggle').click()`); await wait(1200);
const timerChanged = await evaluate(`document.querySelector('#timerDisplay').textContent !== '05:00'`);
await evaluate(`document.querySelector('#timerReset').click()`);
check('Temporizador', timerChanged && (await evaluate(`document.querySelector('#timerDisplay').textContent`)) === '05:00', 'iniciou e reiniciou');
await screenshot('03-slide-1920x1080.png');

await viewport(1366, 768);
state = await evaluate(`({viewport:[innerWidth,innerHeight],slide:Reveal.getCurrentSlide().getBoundingClientRect().toJSON(),overflow:document.documentElement.scrollWidth<=innerWidth+1})`);
check('Slides em 1366 × 768', state.overflow && state.slide.right <= 1367 && state.slide.bottom <= 769, JSON.stringify(state));
await screenshot('07-slide-1366x768.png');

await viewport(820, 1180, true);
await navigate('/dia-1/');
state = await evaluate(`({overflow:document.documentElement.scrollWidth<=innerWidth+1,header:document.querySelector('.site-header').getBoundingClientRect().width<=innerWidth+1})`);
check('Tablet', state.overflow && state.header, JSON.stringify(state));
await screenshot('08-dia-1-tablet-820x1180.png');

await viewport(390, 844, true);
await navigate('/');
state = await evaluate(`({overflow:document.documentElement.scrollWidth<=innerWidth+1,h1:document.querySelector('h1').getBoundingClientRect().toJSON(),menuVisible:getComputedStyle(document.querySelector('.nav-toggle')).display!=='none'})`);
check('Celular', state.overflow && state.h1.right <= 391 && state.menuVisible, JSON.stringify(state));
await screenshot('09-portal-mobile-390x844.png');

const report = { generatedAt: new Date().toISOString(), checks, browserErrors: [...new Set(browserErrors)], passed: checks.every(item => item.passed) && browserErrors.length === 0 };
await fs.writeFile(new URL('validation.json', out), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await send('Target.closeTarget', { targetId: target.id });
socket.close();
if (!report.passed) process.exitCode = 1;
