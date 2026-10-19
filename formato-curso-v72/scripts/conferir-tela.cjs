#!/usr/bin/env node
/* Portão de tela do curso v7.2: serve a pasta por HTTP local (nunca file://), abre a página inicial e
   cada aula em 1366 e 390 px e confere: sem transbordo horizontal, diagrama responde ao clique,
   quiz mostra a resposta, botão copiar existe, simconversa vai do início ao placar e recomeça (7.5.1),
   conferidor aceita o exemplo que passa e recusa o exemplo com erro (7.9.12),
   sem erro de JavaScript. Salva capturas (a simconversa ganha captura própria: <aula>-conversa-<W>.png).
   Uso: node conferir-tela.cjs <pasta-do-curso> [--saida <pasta>]   → sai 0 se tudo OK */
const http = require('http'), fs = require('fs'), path = require('path');
let pw; for (const p of [process.env.PLAYWRIGHT_PATH, 'playwright', '/home/nmaldaner/projetos/agent-browser/node_modules/playwright']) { try { if (p) { pw = require(p); break; } } catch (e) {} }
if (!pw) { console.error('playwright não encontrado (defina PLAYWRIGHT_PATH)'); process.exit(2); }
const a = process.argv.slice(2), raiz = path.resolve(a[0] || '.');
const iS = a.indexOf('--saida'), saida = path.resolve(iS > 0 ? a[iS + 1] : path.join(raiz, '.telas'));
const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.vtt': 'text/vtt', '.json': 'application/json', '.mp4': 'video/mp4', '.webm': 'video/webm' };
const srv = http.createServer((q, r) => {
  let f = path.join(raiz, decodeURIComponent(q.url.split('?')[0]));
  if (!f.startsWith(raiz)) { r.writeHead(403); return r.end(); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': TIPOS[path.extname(f)] || 'application/octet-stream' }); r.end(d); });
});
srv.listen(0, '127.0.0.1', async () => {
  const base = `http://127.0.0.1:${srv.address().port}/`;
  const aulas = fs.readdirSync(path.join(raiz, 'aulas')).filter(d => fs.existsSync(path.join(raiz, 'aulas', d, 'index.html'))).sort();
  const paginas = ['', ...aulas.map(s => `aulas/${s}/`)];
  for (const lg of ['en', 'es']) if (fs.existsSync(path.join(raiz, lg, 'index.html'))) paginas.push(`${lg}/`, ...aulas.map(s => `${lg}/aulas/${s}/`));
  fs.mkdirSync(saida, { recursive: true });
  const erros = []; const b = await pw.chromium.launch({ args: ['--disable-gpu'] });
  try {
    for (const W of [1366, 390]) {
      const ctx = await b.newContext({ viewport: { width: W, height: W < 700 ? 844 : 900 } });
      for (const pg of paginas) {
        const nome = (pg.replace(/aulas\//, '').replace(/\/$/, '').replace(/\//g, '-')) || 'inicio';
        const p = await ctx.newPage(); const jsErr = [];
        p.on('pageerror', e => jsErr.push(e.message));
        await p.goto(base + pg, { waitUntil: 'load' }); await p.waitForTimeout(300);
        const sw = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
        if (sw[0] > sw[1]) erros.push(`${nome} @${W}: transbordo horizontal (${sw[0]} > ${sw[1]})`);
        if (pg.includes('aulas/')) {
          const no = await p.$('button.dg-no');
          if (no) { await no.click({ force: true }); await p.waitForTimeout(150);
            if (!(await p.$eval('.dg-detalhe, .sc-cap', el => el.textContent.trim().length > 0).catch(() => false))) erros.push(`${nome} @${W}: diagrama não mostrou detalhe`); }
          const op = await p.$('.q-op');
          if (op) { await op.scrollIntoViewIfNeeded(); await op.click(); await p.waitForTimeout(150);
            if (!(await p.$eval('.q-fb', el => el.textContent.trim().length > 0).catch(() => false))) erros.push(`${nome} @${W}: quiz sem resposta`); }
          if (!(await p.$('.copiar'))) erros.push(`${nome} @${W}: sem botão copiar`);
          // 7.5.1: simconversa — percorre escolhendo a 1ª opção até o fim; exige placar e "recomeçar"; captura a seção
          const convs = await p.$$('.conv');
          for (let ci = 0; ci < convs.length; ci++) {
            const cv = convs[ci]; let passos = 0;
            while (passos < 30) { const b = await cv.$('.conv-op'); if (!b) break; await b.scrollIntoViewIfNeeded(); await b.click(); await p.waitForTimeout(120); passos++; }
            const fimOk = await cv.$eval('.conv-fim', el => !el.hidden && /\d/.test(el.querySelector('.conv-placar')?.textContent || '') && !!el.querySelector('.conv-recomecar')).catch(() => false);
            if (!passos) erros.push(`${nome} @${W}: simconversa sem opções`);
            else if (!fimOk) erros.push(`${nome} @${W}: simconversa não chegou ao placar/recomeçar`);
            const salvo = await p.evaluate(() => Object.keys(localStorage).some(k => k.includes(':conv:')));
            if (!salvo) erros.push(`${nome} @${W}: simconversa não gravou a conclusão`);
            // captura maior que a tela desenha os fixos (.topo, .skip) por cima: esconde só durante a foto
            const oculta = await p.addStyleTag({ content: '.topo,.skip{visibility:hidden!important}' });
            await cv.screenshot({ path: path.join(saida, `${nome}-conversa${ci ? ci + 1 : ''}-${W}.png`) });
            await oculta.evaluate(el => el.remove());
            await (await cv.$('.conv-recomecar'))?.click(); await p.waitForTimeout(100);
            if (!(await cv.$('.conv-op'))) erros.push(`${nome} @${W}: simconversa não recomeçou`);
          }
          // 7.9.12: conferidor — o exemplo que passa responde com o prefixo do "ok" (classe ok) e o exemplo com erro falha
          const confs = await p.$$('.confer');
          for (let ci = 0; ci < confs.length; ci++) {
            const cf = confs[ci], pref = await cf.getAttribute('data-ok-prefixo');
            // 7.12.15: no modo vídeo a resposta chega depois do loadedmetadata (classe "carregando" até lá)
            const roda = async (q) => { const b = await cf.$(`[data-cf-ex="${q}"]`); await b.scrollIntoViewIfNeeded(); await b.click(); await p.waitForTimeout(120);
              await cf.$eval('.cf-res', el => new Promise(ok => { const t0 = Date.now(); (function v() { if ((!el.hidden && !el.classList.contains('carregando')) || Date.now() - t0 > 15000) ok(); else setTimeout(v, 100); })(); }));
              return cf.$eval('.cf-res', el => [el.className, el.querySelector('.cf-msg')?.textContent || '', el.hidden]); };
            const [c1, m1, h1] = await roda('errado');
            if (h1 || !/\bfalha\b/.test(c1)) erros.push(`${nome} @${W}: conferidor aceitou o exemplo com erro`);
            const [c2, m2, h2] = await roda('ok');
            if (h2 || !/\bok\b/.test(c2) || !m2.startsWith(pref)) erros.push(`${nome} @${W}: conferidor recusou o exemplo que passa ("${m2.slice(0, 60)}")`);
            const oculta = await p.addStyleTag({ content: '.topo,.skip{visibility:hidden!important}' });
            await cf.screenshot({ path: path.join(saida, `${nome}-conferidor${ci ? ci + 1 : ''}-${W}.png`) });
            await oculta.evaluate(el => el.remove());
          }
          const sw2 = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
          if (sw2[0] > sw2[1]) erros.push(`${nome} @${W}: transbordo depois de interagir (${sw2[0]} > ${sw2[1]})`);
        }
        const quebradas = await p.$$eval('img', is => is.filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src')));
        quebradas.forEach(src => erros.push(`${nome} @${W}: imagem quebrada ${src}`));
        jsErr.forEach(m => erros.push(`${nome} @${W}: erro JS ${m}`));
        await p.evaluate(() => scrollTo(0, 0));
        await p.screenshot({ path: path.join(saida, `${nome}-${W}.png`) });
        await p.close();
      }
      await ctx.close();
    }
  } finally { await b.close(); srv.close(); }
  console.log(`${paginas.length} páginas × 2 larguras conferidas; capturas em ${saida}`);
  if (erros.length) { console.log('FALHOU:'); erros.forEach(e => console.log(' - ' + e)); process.exit(1); }
  console.log('OK: telas');
});
