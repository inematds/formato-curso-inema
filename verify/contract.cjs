/* Verifica o CONTRATO VISUAL: componentes ficam realmente visiveis/estilizados. */
const PW = '/home/nmaldaner/.npm/_npx/e41f203b7505f1fb/node_modules/playwright';
const { chromium } = require(PW);
const M1 = 'http://127.0.0.1:8137/curso/trilha1/modulo-1-1.html';
const R = { pass: [], fail: [] };
const ok = (c, m) => (c ? R.pass : R.fail).push((c ? 'OK  ' : 'XX  ') + m);
const transparent = (c) => !c || c === 'rgba(0, 0, 0, 0)' || c === 'transparent';

(async () => {
  let b; try { b = await chromium.launch({ headless: true }); }
  catch (e) { b = await chromium.launch({ headless: true, executablePath: require('os').homedir() + '/.cache/ms-playwright/chromium-1223/chrome-linux/chrome' }); }
  const p = await (await b.newContext({ viewport: { width: 1100, height: 800 } })).newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(M1, { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  await p.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('inema.')).forEach((k) => localStorage.removeItem(k)));

  // 1) HIGHLIGHT com cor visivel — blocos DIFERENTES (evita range obsoleto pos-mutacao)
  const hl = await p.evaluate(() => {
    const blocks = [...document.querySelectorAll('[data-inema-block]')];
    function hlIn(blk, color, note) {
      const tn = [...blk.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim().length > 12) || blk.firstChild;
      const r = document.createRange(); r.setStart(tn, 0); r.setEnd(tn, 10);
      return window.INEMA.highlight(r, { color, note });
    }
    hlIn(blocks[0], 'green', null);
    hlIn(blocks[1], 'doubt', 'tenho duvida aqui');
    const marks = [...document.querySelectorAll('mark.inema-hl')];
    const g = marks.find((m) => m.getAttribute('data-hl') === 'green');
    const d = marks.find((m) => m.getAttribute('data-hl') === 'doubt');
    return { n: marks.length, greenBg: g && getComputedStyle(g).backgroundColor, doubtHasNote: d && d.getAttribute('data-has-note') };
  });
  ok(hl.n >= 2, 'highlights criados em blocos distintos (' + hl.n + ')');
  ok(!transparent(hl.greenBg), 'highlight verde TEM cor de fundo (' + hl.greenBg + ')');
  ok(hl.doubtHasNote === 'true', 'highlight com nota marca data-has-note=true (' + hl.doubtHasNote + ')');

  // 2) JORNADA visivel (na tela, nao translateX off) — espera a transicao terminar
  await p.evaluate(() => window.INEMA.openJourney());
  await p.waitForTimeout(450);
  const jr = await p.evaluate(() => {
    const d = document.querySelector('.inema-journey'); const cs = getComputedStyle(d);
    return { open: d.getAttribute('data-open'), transform: cs.transform, rightEdge: Math.round(d.getBoundingClientRect().right), vw: window.innerWidth };
  });
  ok(jr.open === 'true', 'jornada data-open=true (' + jr.open + ')');
  ok(jr.transform === 'none' || /matrix\(1, 0, 0, 1, 0, 0\)/.test(jr.transform), 'jornada deslizou PARA A TELA (transform=' + jr.transform + ')');
  ok(jr.rightEdge <= jr.vw + 2, 'jornada dentro do viewport (right=' + jr.rightEdge + ' vw=' + jr.vw + ')');
  await p.evaluate(() => window.INEMA.closeJourney && window.INEMA.closeJourney());
  await p.waitForTimeout(400);

  // 3) POPOVER DE APARENCIA visivel apos toggle — espera a transicao
  await p.evaluate(() => document.querySelector('[data-inema-appearance-toggle]').click());
  await p.waitForTimeout(350);
  const ap = await p.evaluate(() => {
    const pop = document.querySelector('.inema-appearance-pop, [data-inema-appearance]'); const cs = getComputedStyle(pop);
    return { open: pop.getAttribute('data-open'), opacity: cs.opacity, pe: cs.pointerEvents };
  });
  ok(ap.open === 'true' && parseFloat(ap.opacity) > 0.5 && ap.pe !== 'none', 'popover de aparencia VISIVEL (open=' + ap.open + ' opacity=' + ap.opacity + ' pe=' + ap.pe + ')');

  // 4) POPOVER DE SELECAO aparece ao selecionar texto + mouseup
  const sp = await p.evaluate(() => {
    const blk = document.querySelectorAll('[data-inema-block]')[1] || document.querySelector('[data-inema-block]');
    const tn = [...blk.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim().length > 15) || blk.firstChild;
    const r = document.createRange(); r.setStart(tn, 0); r.setEnd(tn, 14);
    const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
    const rect = r.getBoundingClientRect();
    blk.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: rect.left + 5, clientY: rect.top + 5 }));
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: rect.left + 5, clientY: rect.top + 5 }));
    return new Promise((res) => setTimeout(() => {
      const pop = document.querySelector('.inema-selpop');
      const cs = pop ? getComputedStyle(pop) : null;
      res({ has: !!pop, open: pop && pop.getAttribute('data-open'), opacity: cs && cs.opacity, pe: cs && cs.pointerEvents });
    }, 120));
  });
  ok(sp.has && sp.open === 'true' && parseFloat(sp.opacity) > 0.5 && sp.pe !== 'none', 'popover de SELECAO visivel/clicavel (open=' + sp.open + ' opacity=' + sp.opacity + ' pe=' + sp.pe + ')');

  // 5) PREF largura de linha muda a prosa
  const lw = await p.evaluate(() => {
    function measure(v) { window.INEMA.setPref('lineWidth', v); const pr = document.querySelector('.inema-prose'); return { attr: document.documentElement.getAttribute('data-line-width'), maxw: getComputedStyle(pr).maxWidth }; }
    const a = measure(60); const c = measure(75);
    return { narrow: a, wide: c };
  });
  ok(lw.narrow.attr === '60' && lw.wide.attr === '75', 'data-line-width seta no <html> (' + lw.narrow.attr + '/' + lw.wide.attr + ')');
  ok(lw.narrow.maxw !== lw.wide.maxw, 'largura da prosa MUDA entre 60ch e 75ch (' + lw.narrow.maxw + ' vs ' + lw.wide.maxw + ')');

  // 6) reduced-motion override do aluno
  const rm = await p.evaluate(() => { window.INEMA.setPref('reducedMotion', true); window.INEMA.setPref('reducedMotionOverride', true); return document.documentElement.getAttribute('data-reduced-motion'); });
  ok(rm === 'reduce', 'reduced-motion override aplica data-reduced-motion=reduce (' + rm + ')');

  ok(errs.length === 0, 'sem pageerror (' + errs.length + ': ' + errs.slice(0, 2).join(' | ') + ')');
  await p.screenshot({ path: '/home/nmaldaner/projetos/formato-curso-inema/verify/contract-state.png' });
  await b.close();
  console.log(JSON.stringify(R, null, 2));
  console.log('\nRESUMO CONTRATO: ' + R.pass.length + ' OK, ' + R.fail.length + ' FALHA');
  process.exit(R.fail.length ? 1 : 0);
})().catch((e) => { console.log('FATAL ' + e.stack); process.exit(2); });
