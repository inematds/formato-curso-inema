#!/usr/bin/env node
/* Teste de comportamento do motor v6 num navegador limpo (celular 390px).
   Uso: node testar-motor.cjs <curso.html>   → imprime OK/FALHA por item; sai 1 se algo falhar. */
const path = require('path');
let pw; for (const p of [process.env.PLAYWRIGHT_PATH, 'playwright', '/home/nmaldaner/projetos/agent-browser/node_modules/playwright']) { try { if (p) { pw = require(p); break; } } catch (e) {} }
if (!pw) { console.error('Playwright não encontrado (defina PLAYWRIGHT_PATH).'); process.exit(2); }
const file = 'file://' + path.resolve(process.argv[2] || 'curso.html');
// Cliques via DOM: em alguns hosts o Chromium headless não gera quadros e o clique 'real' do Playwright trava.
const clk = (page, sel) => page.$eval(sel, e => e.click());
const res = []; const ok = (n, v, extra) => res.push([n, !!v, extra || '']);

(async () => {
  const browser = await pw.chromium.launch({ args: ['--disable-gpu', '--disable-software-rasterizer'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', e => errs.push(e.message)); page.on('dialog', d => d.dismiss());
  await page.goto(file + '#trilha'); await page.waitForTimeout(500);
  const CK = await page.$eval('meta[name=curso]', m => m.content);
  const st = () => page.evaluate(ck => JSON.parse(localStorage.getItem(ck) || '{}'), CK);
  ok('tema papel por padrão', await page.evaluate(() => document.documentElement.dataset.theme === 'papel'));
  ok('sem modal/painel na 1ª visita', await page.evaluate(() => !document.querySelector('.panel.on,.cedit.on,.welcome')));
  ok('"revisar" escondido na 1ª visita', await page.$eval('#revbtn', b => b.hidden));
  ok('trilha: botão continuar aponta para a aula 1', await page.$eval('.continuar', a => a.getAttribute('href') === '#aula-1'));
  const nAulas = await page.$$eval('.au', a => a.length); ok('trilha: cards gerados', nAulas > 0, nAulas + ' cards');

  await page.evaluate(() => { location.hash = 'aula-1'; }); await page.waitForTimeout(400);
  ok('aula: dica de 1 linha aparece', await page.$('#v-aula-1 .dica') !== null);
  ok('aula: kicker com tempo', await page.$eval('#v-aula-1 .kicker', k => /min/.test(k.textContent)));
  // rolagem até o fim marca os steps como lidos
  const nSteps = await page.$$eval('#v-aula-1 .step', s => s.length);
  for (let y = 0; y < 30000; y += 500) { await page.evaluate(v => { window.scrollTo(0, v); document.dispatchEvent(new Event('scroll')); }, y); await page.waitForTimeout(170); }
  await page.waitForTimeout(300);
  const lidos = Object.values((await st()).aulas['1'].read).filter(Boolean).length;
  ok('progresso automático por rolagem', lidos === nSteps, `${lidos}/${nSteps}`);
  // tela com alternância
  const tel = await page.$('#v-aula-1 .tela .alterna');
  if (tel) { await clk(page, '#v-aula-1 .tela .alterna button:nth-of-type(2)');
    ok('tela simulada alterna os casos', await page.evaluate(() => { const c = document.querySelectorAll('#v-aula-1 .tela')[0].querySelectorAll('.tela-caso'); return c[0].hidden && !c[1].hidden; })); }
  else ok('tela simulada alterna os casos', false, 'nenhuma .tela com 2 casos na aula 1');
  // termo
  const g = await page.$('#v-aula-1 .gterm');
  if (g) { await clk(page, '#v-aula-1 .gterm'); const aberto = await page.$('#v-aula-1 .defbox') !== null; await clk(page, '#v-aula-1 .gterm'); const fechado = await page.$('#v-aula-1 .defbox') === null; ok('termo abre e fecha a definição inline', aberto && fechado); }
  // teste-se
  const q = await page.$('#v-aula-1 .quiz');
  if (q) { const ans = await q.getAttribute('data-answer'); await clk(page, `#v-aula-1 .quiz .opt[data-k="${ans}"]`); ok('teste-se mostra feedback', await q.$eval('.qfb', f => f.classList.contains('on') && f.textContent.length > 10)); }
  // prática
  await page.$$eval('#v-aula-1 .practice input[data-ptask]', bs => bs.forEach(b => { if (!b.checked) b.click(); }));
  ok('prática: marcar os passos conclui', await page.$eval('#v-aula-1 .practice', p => p.classList.contains('done')));
  // concluir aula
  const nCards = await page.evaluate(() => { try { return JSON.parse(document.getElementById('cards-1').textContent).length; } catch (e) { return 0; } });
  await clk(page, '#v-aula-1 .fecho-motor .big'); await page.waitForTimeout(200);
  const s1 = await st();
  ok('concluir aula marca a aula', s1.aulas['1'].done === true);
  ok('cartões entram no revisar só agora', Object.keys(s1.aulas['1'].cards).length === nCards, nCards + ' cartões');
  ok('"revisar N" aparece na barra', await page.$eval('#revbtn', b => !b.hidden && /\d/.test(b.textContent)));
  // revisão
  await clk(page, '#revbtn'); await page.waitForTimeout(250);
  ok('painel revisar abre com pergunta', await page.$eval('#revisar', p => p.classList.contains('on') && !!p.querySelector('.card .side')));
  await clk(page, '#revbody .big'); await clk(page, '#revbody .grade button:nth-child(2)'); await page.waitForTimeout(150);
  ok('avaliar avança a revisão', await page.$eval('#revbody', b => /2 \/|Nada para revisar/.test(b.textContent)));
  await page.keyboard.press('Escape'); await page.waitForTimeout(250);
  // menu + jornada
  await clk(page, '#menubtn'); await page.waitForTimeout(250); ok('menu abre', await page.$eval('#menu', p => p.classList.contains('on')));
  await clk(page, '#m-jor'); await page.waitForTimeout(250);
  ok('jornada lista a capacidade da aula concluída', await page.$$eval('#jcap li', l => l.length === 1 && l[0].textContent.length > 20));
  await page.keyboard.press('Escape'); await page.waitForTimeout(250);
  await clk(page, '#menubtn'); await page.waitForTimeout(200); await clk(page, '#m-ex'); await page.waitForTimeout(200);
  ok('práticas do curso listadas', await page.$$eval('#exlist .exrow', r => r.length > 0));
  await page.keyboard.press('Escape'); await page.waitForTimeout(250);
  // Aa
  await clk(page, '#prefsbtn'); ok('Aa abre o painel', await page.$eval('#prefs', p => p.classList.contains('on')));
  await clk(page, '#prefs [data-pf="size"][data-d="1"]'); await clk(page, '#prefs [data-th="escuro"]');
  ok('Aa aumenta a letra', await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--prose-size').trim() === '20px'));
  ok('Aa troca o tema', await page.evaluate(() => document.documentElement.dataset.theme === 'escuro'));
  // persistência
  await page.reload(); await page.waitForTimeout(400);
  ok('tema e conclusão persistem após recarregar', await page.evaluate(ck => { const s = JSON.parse(localStorage.getItem(ck)); return document.documentElement.dataset.theme === 'escuro' && s.aulas['1'].done; }, CK));
  await page.evaluate(() => { location.hash = 'trilha'; }); await page.waitForTimeout(300);
  ok('trilha mostra a aula 1 como concluída', await page.$eval('.au[data-aula="1"] .meta', m => !!m.querySelector('.ok')));
  ok('zero erro de JavaScript', errs.length === 0, errs.join(' | '));
  await browser.close();
  let fail = 0; for (const [n, v, x] of res) { if (!v) fail++; console.log((v ? 'OK    ' : 'FALHA ') + n + (x ? '  (' + x + ')' : '')); }
  console.log(`\n${res.length - fail}/${res.length} comportamentos OK`); process.exit(fail ? 1 : 0);
})();
