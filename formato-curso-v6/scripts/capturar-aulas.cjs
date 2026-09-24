#!/usr/bin/env node
/* Capturas por aula em blocos (para revisão visual e para o leitor simulado).
   Uso: node capturar-aulas.cjs <curso.html> <pasta-saida> [--largura 390] [--tema papel] [--aulas 1,2]
   Saída: <pasta>/aula-N/NN.png (blocos de 1 tela) + trilha/NN.png */
const path = require('path'), fs = require('fs');
let pw; for (const p of [process.env.PLAYWRIGHT_PATH, 'playwright', '/home/nmaldaner/projetos/agent-browser/node_modules/playwright']) { try { if (p) { pw = require(p); break; } } catch (e) {} }
const a = process.argv.slice(2), file = path.resolve(a[0]), out = path.resolve(a[1]);
const opt = k => { const i = a.indexOf('--' + k); return i > 0 ? a[i + 1] : null; };
const W = parseInt(opt('largura') || '390', 10), H = W < 700 ? 844 : 900, tema = opt('tema') || 'papel';
(async () => {
  const b = await pw.chromium.launch({ args: ['--disable-gpu', '--disable-software-rasterizer'] }); const ctx = await b.newContext({ viewport: { width: W, height: H }, reducedMotion: 'reduce' });
  const p = await ctx.newPage(); await p.goto('file://' + file + '#trilha'); await p.waitForTimeout(500);
  const keys = opt('aulas') ? opt('aulas').split(',') : await p.$$eval('.view[data-aula]', v => v.map(x => x.dataset.aula));
  for (const r of ['trilha', ...keys.map(k => 'aula-' + k)]) {
    await p.evaluate(([r, t]) => { location.hash = r; document.documentElement.dataset.theme = t; document.querySelectorAll('.dica').forEach(d => d.remove()); }, [r, tema]);
    await p.waitForTimeout(300);
    const dir = path.join(out, r); fs.mkdirSync(dir, { recursive: true });
    const total = await p.evaluate(() => document.documentElement.scrollHeight);
    let i = 0; for (let y = 0; y < total; y += H - 80) { await p.evaluate(v => window.scrollTo(0, v), y); await p.waitForTimeout(120); await p.screenshot({ path: path.join(dir, String(++i).padStart(2, '0') + '.png') }); }
    console.log(r + ': ' + i + ' telas');
  }
  await b.close();
})();
