const PW = '/home/nmaldaner/.npm/_npx/e41f203b7505f1fb/node_modules/playwright';
const { chromium } = require(PW);
const B = 'http://127.0.0.1:8137';
(async () => {
  let br; try { br = await chromium.launch({ headless: true }); }
  catch (e) { br = await chromium.launch({ headless: true, executablePath: require('os').homedir() + '/.cache/ms-playwright/chromium-1223/chrome-linux/chrome' }); }
  const ctx = await br.newContext({ viewport: { width: 1280, height: 860 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const G = '/home/nmaldaner/projetos/formato-curso-inema/verify/';

  // seed de estado pra ficar realista (alguns lidos, 1 duvida, 2 highlights)
  async function seed() {
    await p.evaluate(() => {
      const ids = [...document.querySelectorAll('[data-inema-topic]')].map((e) => e.getAttribute('data-inema-topic'));
      if (window.INEMA && ids.length) { window.INEMA.markRead(ids[0], true); window.INEMA.markRead(ids[1], true); window.INEMA.markRead(ids[2], true); window.INEMA.toggleDoubt(ids[3]); }
      const blk = [...document.querySelectorAll('[data-inema-block]')];
      function hl(b, c, note) { if (!b) return; const tn = [...b.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim().length > 15) || b.firstChild; const r = document.createRange(); r.setStart(tn, 0); r.setEnd(tn, Math.min(34, tn.textContent.length)); window.INEMA.highlight(r, { color: c, note }); }
      if (blk[0]) hl(blk[0], 'yellow', null); if (blk[1]) hl(blk[1], 'doubt', 'revisar isso depois');
    });
  }

  // 1) landing (dark, default)
  await p.goto(B + '/index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  await p.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('inema.')).forEach((k) => localStorage.removeItem(k)));
  await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(400);
  await p.screenshot({ path: G + 'gallery-1-landing.png' });

  // 2) indice da trilha (mapa da trilha + hero SVG + cards)
  await p.goto(B + '/curso/trilha1/index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  await p.screenshot({ path: G + 'gallery-2-trilha.png' });

  // 3) modulo dark (default) — topo
  await p.goto(B + '/curso/trilha1/modulo-1-1.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  await seed();
  await p.screenshot({ path: G + 'gallery-3-modulo-dark.png' });

  // 4) modulo dark — secao de conteudo (SVG + marcar lido + highlight)
  await p.evaluate(() => { const s = document.querySelectorAll('[data-inema-topic]')[0]; if (s) s.scrollIntoView(); window.scrollBy(0, -90); });
  await p.waitForTimeout(400);
  await p.screenshot({ path: G + 'gallery-4-conteudo.png' });

  // 5) seletor de aparencia aberto (mostra os temas)
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(200);
  await p.evaluate(() => document.querySelector('[data-inema-appearance-toggle]').click());
  await p.waitForTimeout(450);
  await p.screenshot({ path: G + 'gallery-5-aparencia.png' });

  // 6) jornada aberta
  await p.evaluate(() => { const pop = document.querySelector('.inema-appearance-pop[data-open="true"]'); if (pop) pop.setAttribute('data-open', 'false'); window.INEMA.openJourney(); });
  await p.waitForTimeout(600);
  await p.screenshot({ path: G + 'gallery-6-jornada.png' });

  // 7) tema sepia (mesma pagina) — mostra a troca
  await p.evaluate(() => { window.INEMA.closeJourney && window.INEMA.closeJourney(); window.INEMA.setPref('theme', 'sepia'); });
  await p.waitForTimeout(700);
  await p.screenshot({ path: G + 'gallery-7-sepia.png' });

  await br.close();
  console.log('galeria capturada');
})().catch((e) => { console.log('ERR', e.stack); process.exit(1); });
