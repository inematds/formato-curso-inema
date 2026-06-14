/* Smoke test real do curso-demo via Playwright/Chromium. */
const PW = '/home/nmaldaner/.npm/_npx/e41f203b7505f1fb/node_modules/playwright';
const { chromium } = require(PW);
const BASE = 'http://127.0.0.1:8137';
const M1 = BASE + '/curso/trilha1/modulo-1-1.html';
const M2 = BASE + '/curso/trilha1/modulo-1-2.html';

const R = { pass: [], fail: [], consoleErrors: [] };
const ok = (c, m) => (c ? R.pass : R.fail).push((c ? 'OK  ' : 'XX  ') + m);

(async () => {
  let browser;
  try { browser = await chromium.launch({ headless: true }); }
  catch (e) {
    const ep = require('os').homedir() + '/.cache/ms-playwright/chromium-1223/chrome-linux/chrome';
    browser = await chromium.launch({ headless: true, executablePath: ep });
  }
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') R.consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => R.consoleErrors.push('PAGEERROR: ' + e.message));

  await page.goto(M1, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  // estado limpo
  await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('inema.')).forEach((k) => localStorage.removeItem(k)));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  const api = await page.evaluate(() => {
    const I = window.INEMA; if (!I) return { exists: false };
    const M = ['init','applyPrefs','markRead','isRead','progress','renderMeters','toggleDoubt','listDoubts','highlight','openJourney','renderJourney','saveCheckpoint','resume','exportJSON','importJSON','setPref','getPrefs','registerCheck','submitCheck'];
    return { exists: true, missing: M.filter((m) => typeof I[m] !== 'function') };
  });
  ok(api.exists, 'window.INEMA existe');
  if (api.exists) ok(api.missing.length === 0, 'API completa (faltando ' + JSON.stringify(api.missing) + ')');

  const topics = await page.evaluate(() => [...document.querySelectorAll('[data-inema-topic]')].map((e) => e.getAttribute('data-inema-topic')));
  ok(topics.length === 7, 'modulo-1-1 tem 7 topicos (' + topics.length + ')');

  // manifesto: total do curso = 14
  const totalCurso = await page.evaluate(() => window.INEMA.progress('curso').total);
  ok(totalCurso === 14, 'manifesto: total do CURSO = 14 cross-modulo (' + totalCurso + ')');

  // marca 2 topicos via API
  await page.evaluate((ids) => { window.INEMA.markRead(ids[0], true); window.INEMA.markRead(ids[1], true); }, topics);
  await page.waitForTimeout(120);
  const p2 = await page.evaluate(() => window.INEMA.progress('curso'));
  ok(p2.done === 2 && p2.total === 14, 'apos 2 lidos: done=2/total=14 (' + p2.done + '/' + p2.total + ')');

  // clica o botao de um topico AINDA NAO lido (testa event wiring sem desmarcar)
  const click = await page.evaluate((ids) => {
    const sec = document.querySelector('[data-inema-topic="' + ids[3] + '"]');
    const btn = (sec && sec.querySelector('[data-inema-read-toggle]')) || document.querySelectorAll('[data-inema-read-toggle]')[3];
    if (!btn) return { has: false };
    const before = btn.getAttribute('aria-pressed');
    btn.click();
    return { has: true, before, after: btn.getAttribute('aria-pressed'), nowRead: window.INEMA.isRead(ids[3]) };
  }, topics);
  ok(click.has, 'existe botao [data-inema-read-toggle]');
  if (click.has) ok(click.before !== click.after && click.nowRead === true, 'click marca lido + alterna aria-pressed (' + click.before + '->' + click.after + ')');

  const lsRead = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.includes('.read')));
  ok(lsRead.length >= 1, 'chave .read persistida (' + JSON.stringify(lsRead) + ')');

  // reload: persistencia (3 lidos sobrevivem)
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const after = await page.evaluate((ids) => ({ r0: window.INEMA.isRead(ids[0]), r3: window.INEMA.isRead(ids[3]), prog: window.INEMA.progress('curso') }), topics);
  ok(after.r0 === true && after.r3 === true, 'lidos persistem apos reload');
  ok(after.prog.done === 3, 'progresso persiste apos reload (done=' + after.prog.done + ')');

  // duvida
  const doubts = await page.evaluate((ids) => { window.INEMA.toggleDoubt(ids[2]); return window.INEMA.listDoubts().length; }, topics);
  ok(doubts >= 1, 'toggleDoubt registra duvida (' + doubts + ')');

  // highlight + nota
  const hl = await page.evaluate(() => {
    const blk = document.querySelector('[data-inema-block]'); if (!blk) return { ok: false, why: 'sem block' };
    const tn = [...blk.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim().length > 12) || blk.firstChild;
    if (!tn) return { ok: false, why: 'sem textnode' };
    const r = document.createRange(); r.setStart(tn, 0); r.setEnd(tn, Math.min(12, tn.textContent.length));
    let id; try { id = window.INEMA.highlight(r, { color: 'yellow', note: 'teste-nota' }); } catch (e) { return { ok: false, why: 'throw ' + e.message }; }
    return { ok: !!id, mark: !!document.querySelector('mark.inema-hl, mark[data-inema-note]'), stored: Object.keys(localStorage).some((k) => k.includes('.notes') && (localStorage.getItem(k) || '').includes('teste-nota')) };
  });
  ok(hl.ok, 'highlight() sem erro (' + (hl.why || '') + ')');
  ok(hl.mark && hl.stored, 'highlight cria <mark> e persiste nota');

  // jornada (role=dialog) + agrega curso inteiro mesmo em 1 modulo
  const jr = await page.evaluate(() => {
    window.INEMA.openJourney();
    const p = document.querySelector('.inema-journey');
    const txt = p ? p.textContent : '';
    const r = { found: !!p, role: p && p.getAttribute('role'), mentionsMod2: /Modulo\s*1\.2|1-2/i.test(txt) };
    if (window.INEMA.closeJourney) window.INEMA.closeJourney();
    return r;
  });
  ok(jr.found && jr.role === 'dialog', 'jornada .inema-journey role=dialog');
  ok(jr.mentionsMod2, 'jornada lista o modulo 1-2 (do manifesto) estando no modulo 1-1');

  // export
  const exp = await page.evaluate(() => window.INEMA.exportJSON());
  let expObj; try { expObj = JSON.parse(exp); } catch (e) {}
  ok(!!expObj && 'read' in expObj && 'notes' in expObj && 'doubts' in expObj, 'exportJSON valido com read/notes/doubts');

  // tema persiste
  await page.evaluate(() => window.INEMA.setPref('theme', 'sepia'));
  await page.waitForTimeout(80);
  const th = await page.evaluate(() => ({ dt: document.documentElement.getAttribute('data-theme'), prefs: localStorage.getItem('inema.prefs') || '' }));
  ok(th.dt === 'sepia' && th.prefs.includes('sepia'), 'tema sepia aplicado e persistido');

  // navega p/ modulo 2: tema persiste + AGREGACAO cross-modulo
  await page.goto(M2, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const m2 = await page.evaluate(() => ({ dt: document.documentElement.getAttribute('data-theme'), prog: window.INEMA.progress('curso'), trilha: window.INEMA.progress('trilha:1') }));
  ok(m2.dt === 'sepia', 'tema persiste ao navegar p/ modulo-1-2 (' + m2.dt + ')');
  ok(m2.prog.done === 3 && m2.prog.total === 14, 'CROSS-MODULO: progresso do curso agrega no modulo-1-2 (done=' + m2.prog.done + '/' + m2.prog.total + ')');
  ok(m2.trilha.done === 3 && m2.trilha.total === 14, 'CROSS-MODULO: progresso da trilha:1 agrega (done=' + m2.trilha.done + '/' + m2.trilha.total + ')');

  // round-trip import (no modulo 2)
  const rt = await page.evaluate((payload) => {
    Object.keys(localStorage).filter((k) => k.startsWith('inema.demo')).forEach((k) => localStorage.removeItem(k));
    const before = window.INEMA.progress('curso').done;
    const res = window.INEMA.importJSON(payload, { mode: 'merge' });
    const afterD = window.INEMA.progress('curso').done;
    return { before, afterD, res };
  }, exp);
  ok(rt.res && rt.res.ok !== false, 'importJSON aceita export (' + JSON.stringify(rt.res) + ')');
  ok(rt.before === 0 && rt.afterD === 3, 'round-trip restaura progresso cross-modulo (' + rt.before + '->' + rt.afterD + ')');

  await page.goto(M1, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/home/nmaldaner/projetos/formato-curso-inema/verify/shot-modulo1.png' });

  ok(R.consoleErrors.length === 0, 'sem erros de console (' + R.consoleErrors.length + ': ' + R.consoleErrors.slice(0, 3).join(' | ') + ')');

  await browser.close();
  console.log(JSON.stringify(R, null, 2));
  console.log('\nRESUMO: ' + R.pass.length + ' OK, ' + R.fail.length + ' FALHA');
  process.exit(R.fail.length ? 1 : 0);
})().catch((e) => { console.log('FATAL ' + e.stack); process.exit(2); });
