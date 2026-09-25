#!/usr/bin/env node
/* Auditor da rubrica 9/10 do formato-curso v6.
   Uso: node auditar-curso.cjs <curso.html> [--json saida.json]
   Mede no navegador de verdade (Playwright), aula por aula, os 10 critérios da rubrica
   (references/CHECKLIST-V6.md). Critério 1 (teste dos 5 segundos) é medido por proxy
   (todo step tem um visual) e SEMPRE precisa da confirmação do leitor simulado/humano.
   Nota da aula = critérios aprovados (0–10). Portão: aula >= 9 e nenhuma reprovação em 7, 8 ou 10.
   6.2 — perfil técnico (<meta name="perfil" content="tecnico">, gerado pelo montar-curso.py): o critério 8 deixa de
   ser "zero jargão" e passa a ser "todo termo técnico da aula tem um .gterm que o define NESSA aula". A lista é a
   sentinela + <meta name="termos"> (curso.json "termos"). O details.complementar é aberto na checagem de legibilidade. */
const path = require('path'), fs = require('fs');
let pw; for (const p of [process.env.PLAYWRIGHT_PATH, 'playwright', '/home/nmaldaner/projetos/agent-browser/node_modules/playwright']) { try { if (p) { pw = require(p); break; } } catch (e) {} }
if (!pw) { console.error('Playwright não encontrado (defina PLAYWRIGHT_PATH).'); process.exit(2); }
const file = path.resolve(process.argv[2] || 'curso.html');
const jsonOut = process.argv.includes('--json') ? process.argv[process.argv.indexOf('--json') + 1] : null;
const SENTINELA = /\b(JSON|terminal|Git|GitHub|reposit[óo]rio|commit|branch|pipeline|arquivo de configura\w*|instala(r|ção|do)|script|servidor|API|deploy|CLI|diret[óo]rio|plugin|encoding|workflow|output|input|setup|framework|upload|download|login|backup)\b/gi;

(async () => {
  const browser = await pw.chromium.launch({ args: ['--disable-gpu', '--disable-software-rasterizer'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('file://' + file + '#trilha'); await page.waitForTimeout(600);
  const keys = await page.$$eval('.view[data-aula]', vs => vs.map(v => v.getAttribute('data-aula')));
  // critério 4 (primeira visita, celular): controles na barra, modal, revisar escondido
  const first = {};
  for (const route of ['trilha', 'aula-' + keys[0]]) {
    await page.evaluate(r => { location.hash = r; }, route); await page.waitForTimeout(300);
    first[route] = await page.evaluate(() => {
      const vis = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && r.top < innerHeight; };
      return { barControls: [...document.querySelectorAll('.bar button,.bar a.btn')].filter(vis).length,
        modal: !!document.querySelector('.panel.on,.cedit.on,.welcome.on'), revVisivel: vis(document.getElementById('revbtn') || document.body) && !!document.getElementById('revbtn') };
    });
  }
  const themes = ['papel', 'escuro', 'sepia'];
  const res = [];
  for (const k of keys) {
    await page.evaluate(r => { location.hash = r; }, 'aula-' + k); await page.waitForTimeout(250);
    const m = await page.evaluate(({ k, sent }) => {
      const perfil = (document.querySelector('meta[name="perfil"]') || {}).content || '';
      const extra = ((document.querySelector('meta[name="termos"]') || {}).content || '').split('|').map(x => x.trim()).filter(Boolean);
      const v = document.getElementById('v-aula-' + k), T = e => (e ? e.textContent.replace(/\s+/g, ' ').trim() : '');
      const prose = [...v.querySelectorAll('.step > p, .why, .promise')].map(T);
      const words = prose.join(' ').split(/\s+/).filter(Boolean).length;
      const sentT = prose.flatMap(p => p.split(/(?<=[.!?:;])\s+/)).filter(s => s.split(/\s+/).filter(Boolean).length >= 3); const sents = sentT.map(s => s.split(/\s+/).filter(Boolean).length); const longas = sentT.filter(s => s.split(/\s+/).filter(Boolean).length > 22);
      const steps = [...v.querySelectorAll('.step')];
      const VIS = '.tela,.lado,.janela,.terminal,figure,.diag';
      const stepsSemVisual = steps.filter(s => !s.querySelector(VIS)).map((s, i) => i + 1);
      const reais = v.querySelectorAll('.tela,.lado,.janela,.terminal').length;
      const cena = v.querySelector('figure.cena img');
      const cards = (() => { try { return JSON.parse((document.getElementById('cards-' + k) || {}).textContent || '[]'); } catch (e) { return null; } })();
      const txtAll = T(v.querySelector('.aula')) + ' ' + (cards || []).map(c => c.front + ' ' + c.back).join(' ');
      let jarg = [...new Set((txtAll.match(new RegExp(sent, 'gi')) || []).map(s => s.toLowerCase()))];
      let jargDef = [];
      if (perfil === 'tecnico') {
        const escRe = x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const B = '(?<![\\p{L}\\p{N}_])', A = '(?![\\p{L}\\p{N}_])';
        extra.forEach(t => { if (new RegExp(B + escRe(t) + A, 'iu').test(txtAll)) jarg.push(t.toLowerCase()); });
        jarg = [...new Set(jarg)];
        const defs = [...v.querySelectorAll('.gterm')].map(g => T(g));
        jargDef = jarg.filter(t => defs.some(d => new RegExp(B + escRe(t) + A, 'iu').test(d)));
        jarg = jarg.filter(t => !jargDef.includes(t));   // sobra só o que aparece sem definição na aula
      }
      const tempo = parseInt(v.getAttribute('data-tempo') || '0', 10);
      const pgoal = T(v.querySelector('.pgoal')); const pmin = parseInt((pgoal.match(/(\d+)\s*min/) || [])[1] || '0', 10);
      const espacial = [...new Set((T(v.querySelector('.aula')).match(/\b(à|a|na|no|da|do) (direita|esquerda)\b/gi) || []).map(x => x.toLowerCase()))];
      const quizInjusto = [...v.querySelectorAll('.quiz')].filter(q => { const ans = q.dataset.answer, ops = [...q.querySelectorAll('.opt')].map(o => ({ k: o.dataset.k, n: T(o).length })); const c = ops.find(o => o.k === ans), outros = ops.filter(o => o.k !== ans); return c && outros.length && c.n > 1.35 * Math.max(...outros.map(o => o.n)); }).length;
      return { espacial, quizInjusto, longas, words, nS: sents.length, gt22: sents.filter(n => n > 22).length, gt30: sents.filter(n => n > 30).length, steps: steps.length, stepsSemVisual, reais,
        cena: !!cena, cenaAlt: cena ? (cena.getAttribute('alt') || '').length : 0, cenaSrc: cena ? cena.getAttribute('src') : null,
        promise: !!v.querySelector('.promise'), em1: !!v.querySelector('.em1min'), practice: v.querySelectorAll('.practice').length, psafe: !!v.querySelector('.practice .psafe'),
        calma: v.querySelectorAll('.calma').length, cola: !!v.querySelector('.cola'), next: !!v.querySelector('.next-action'),
        cardsN: cards ? cards.length : -1, cardsPerg: cards ? cards.every(c => /\?\s*$/.test(c.front.trim())) : false, tempo, pmin, jarg, jargDef, perfil };
    }, { k, sent: SENTINELA.source });
    // critério 7: legibilidade nos 3 temas
    m.leg = {};
    await page.evaluate(k => document.querySelectorAll('#v-aula-' + k + ' details.complementar').forEach(d => { d.open = true; }), k);
    for (const th of themes) {
      await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), th);
      m.leg[th] = await page.evaluate(k => {
        const v = document.getElementById('v-aula-' + k);
        const parse = c => { const x = c.match(/[\d.]+/g).map(Number); return { r: x[0], g: x[1], b: x[2], a: x.length > 3 ? x[3] : 1 }; };
        const lum = c => { const f = u => { u /= 255; return u <= .03928 ? u / 12.92 : Math.pow((u + .055) / 1.055, 2.4); }; return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b); };
        const over = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 });
        const bgOf = e => { const layers = []; for (let n = e; n && n.nodeType === 1; n = n.parentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c.a > 0) { layers.push(c); if (c.a >= 1) break; } } let b = { r: 255, g: 255, b: 255, a: 1 }; if (!layers.length || layers[layers.length - 1].a < 1) b = parse(getComputedStyle(document.body).backgroundColor); for (let i = layers.length - 1; i >= 0; i--) b = over(layers[i], b); return b; };
        const out = { small: [], contrast: [], mono: [] };
        v.querySelectorAll('.aula *').forEach(e => {
          if (!e.offsetParent && getComputedStyle(e).position !== 'fixed') return;
          if (e.closest('[hidden],details:not([open]) > :not(summary),script,style,svg')) return;
          const direct = [...e.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim().length > 1); if (!direct) return;
          const s = getComputedStyle(e), fs = parseFloat(s.fontSize), label = (e.className || e.tagName) + ': ' + e.textContent.trim().slice(0, 40);
          if (fs < 14) out.small.push(fs + 'px ' + label);
          if (/mono/i.test(s.fontFamily) && !e.closest('pre,code')) out.mono.push(label);
          const fg = parse(s.color), bg = bgOf(e), f = fg.a < 1 ? over(fg, bg) : fg;
          const L1 = lum(f), L2 = lum(bg), cr = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
          const need = (fs >= 24 || (fs >= 18.66 && parseInt(s.fontWeight) >= 700)) ? 3 : 4.5;
          if (cr < need) out.contrast.push(cr.toFixed(2) + ' ' + label);
        });
        return out;
      }, k);
    }
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'papel'));
    // imagem
    m.cenaKB = m.cenaSrc && fs.existsSync(path.join(path.dirname(file), m.cenaSrc)) ? Math.round(fs.statSync(path.join(path.dirname(file), m.cenaSrc)).size / 1024) : null;
    const lim = k === keys[0] ? 700 : 900;
    const leg = themes.reduce((a, t) => a + m.leg[t].small.length + m.leg[t].contrast.length + m.leg[t].mono.length, 0);
    const c = {
      '1 cinco-segundos (proxy)': m.stepsSemVisual.length === 0,
      '2 mostrar-nao-simbolizar': m.reais >= 2 && m.cena && m.cenaAlt > 20 && m.cenaKB !== null && m.cenaKB <= 150,
      '3 vitoria-rapida': m.tempo > 0 && m.tempo <= 18 && m.pmin > 0 && m.pmin <= 12,
      '4 primeira-tela-leve': first['aula-' + keys[0]].barControls <= 3 && !first['aula-' + keys[0]].modal && first.trilha.barControls <= 3 && !first.trilha.modal,
      '5 aula-enxuta': m.words <= lim && m.steps >= 3 && m.steps <= 5,
      '6 texto-sem-armadilha': m.nS > 0 && m.gt22 / m.nS <= 0.05 && m.gt30 === 0 && m.quizInjusto === 0,
      '7 legivel-3-temas': leg === 0,
      '8 zero-jargao-e-direita': m.jarg.length === 0 && m.espacial.length === 0,
      '9 momento-humano': m.calma >= 1 && m.psafe,
      '10 espinha': m.promise && m.em1 && m.practice === 1 && m.cola && m.next && m.cardsN >= 3 && m.cardsN <= 4 && m.cardsPerg && m.tempo > 0,
    };
    const nota = Object.values(c).filter(Boolean).length;
    const duro = c['7 legivel-3-temas'] && c['8 zero-jargao-e-direita'] && c['10 espinha'];
    res.push({ aula: k, nota, aprovada: nota >= 9 && duro, criterios: c, medidas: m });
  }
  await browser.close();
  const pad = (s, n) => String(s).padEnd(n);
  console.log(`\nAuditoria v6 — ${path.basename(path.dirname(file))}/${path.basename(file)}   (celular 390px, 3 temas)`);
  console.log(`1ª visita: trilha ${first.trilha.barControls} controles${first.trilha.modal ? ' + MODAL' : ''} · aula ${first['aula-' + keys[0]].barControls} controles${first['aula-' + keys[0]].modal ? ' + MODAL' : ''}`);
  for (const r of res) {
    const m = r.medidas;
    console.log(`\nAula ${r.aula}: ${r.nota}/10 ${r.aprovada ? 'APROVADA' : 'REPROVADA'}  · ${m.words} palavras de prosa · ${m.steps} steps · frases >22: ${m.gt22}/${m.nS} · visuais reais ${m.reais} · cena ${m.cenaKB ?? '—'} KB · ${m.tempo} min`);
    for (const [n, ok] of Object.entries(r.criterios)) if (!ok) console.log('   ✗ ' + n);
    if (m.stepsSemVisual.length) console.log('     steps sem visual: ' + m.stepsSemVisual.join(', '));
    if (m.jarg.length) console.log((m.perfil === 'tecnico' ? '     termo técnico sem .gterm nesta aula: ' : '     jargão: ') + m.jarg.join(', '));
    if (m.espacial.length) console.log('     referência espacial (celular empilha): ' + m.espacial.join(', '));
    if (m.quizInjusto) console.log('     teste-se: a alternativa certa é bem mais longa que as outras (' + m.quizInjusto + ')');
    if (!r.criterios['6 texto-sem-armadilha']) m.longas.slice(0, 6).forEach(x => console.log('     frase longa: ' + x));
    for (const t of themes) { const L = m.leg[t]; [...L.small.slice(0, 3).map(x => 'fonte ' + x), ...L.contrast.slice(0, 3).map(x => 'contraste ' + x), ...L.mono.slice(0, 2).map(x => 'mono ' + x)].forEach(x => console.log(`     [${t}] ${x}`)); }
  }
  const media = res.reduce((a, r) => a + r.nota, 0) / res.length;
  console.log(`\nMédia: ${media.toFixed(1)}/10 · aprovadas ${res.filter(r => r.aprovada).length}/${res.length}` + (errors.length ? `\nERROS JS: ${errors.join(' | ')}` : ''));
  console.log('Lembrete: o critério 1 é proxy — confirme com o leitor simulado (TESTE-HUMANO.md) antes de dar a aula por aprovada.');
  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify({ arquivo: file, primeiraVisita: first, media, aulas: res, errosJS: errors }, null, 2));
  process.exit(res.every(r => r.aprovada) && !errors.length ? 0 : 1);
})();
