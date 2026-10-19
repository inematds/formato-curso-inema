#!/usr/bin/env node
/* Portão de tela do curso v7.2: serve a pasta por HTTP local (nunca file://), abre a página inicial e
   cada aula em 1366 e 390 px e confere: sem transbordo horizontal, diagrama responde ao clique,
   quiz mostra a resposta, botão copiar existe, sem erro de JavaScript. Salva capturas.
   Uso: node conferir-tela.cjs <pasta-do-curso> [--saida <pasta>]   → sai 0 se tudo OK */
const http = require('http'), fs = require('fs'), path = require('path');
let pw; for (const p of [process.env.PLAYWRIGHT_PATH, 'playwright', '/home/nmaldaner/projetos/agent-browser/node_modules/playwright']) { try { if (p) { pw = require(p); break; } } catch (e) {} }
if (!pw) { console.error('playwright não encontrado (defina PLAYWRIGHT_PATH)'); process.exit(2); }
const a = process.argv.slice(2), raiz = path.resolve(a[0] || '.');
const iS = a.indexOf('--saida'), saida = path.resolve(iS > 0 ? a[iS + 1] : path.join(raiz, '.telas'));
const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.vtt': 'text/vtt', '.json': 'application/json' };
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
  fs.mkdirSync(saida, { recursive: true });
  const erros = []; const b = await pw.chromium.launch({ args: ['--disable-gpu'] });
  try {
    for (const W of [1366, 390]) {
      const ctx = await b.newContext({ viewport: { width: W, height: W < 700 ? 844 : 900 } });
      for (const pg of paginas) {
        const nome = (pg || 'inicio').replace(/aulas\/|\//g, '') || 'inicio';
        const p = await ctx.newPage(); const jsErr = [];
        p.on('pageerror', e => jsErr.push(e.message));
        await p.goto(base + pg, { waitUntil: 'load' }); await p.waitForTimeout(300);
        const sw = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
        if (sw[0] > sw[1]) erros.push(`${nome} @${W}: transbordo horizontal (${sw[0]} > ${sw[1]})`);
        if (pg) {
          const no = await p.$('button.dg-no');
          if (no) { await no.click({ force: true }); await p.waitForTimeout(150);
            if (!(await p.$eval('.dg-detalhe, .sc-cap', el => el.textContent.trim().length > 0).catch(() => false))) erros.push(`${nome} @${W}: diagrama não mostrou detalhe`); }
          const op = await p.$('.q-op');
          if (op) { await op.scrollIntoViewIfNeeded(); await op.click(); await p.waitForTimeout(150);
            if (!(await p.$eval('.q-fb', el => el.textContent.trim().length > 0).catch(() => false))) erros.push(`${nome} @${W}: quiz sem resposta`); }
          if (!(await p.$('.copiar'))) erros.push(`${nome} @${W}: sem botão copiar`);
          const sw2 = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
          if (sw2[0] > sw2[1]) erros.push(`${nome} @${W}: transbordo depois de interagir (${sw2[0]} > ${sw2[1]})`);
        }
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
