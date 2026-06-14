const PW = '/home/nmaldaner/.npm/_npx/e41f203b7505f1fb/node_modules/playwright';
const { chromium } = require(PW);
const M1 = 'http://127.0.0.1:8137/curso/trilha1/modulo-1-1.html';
const R = { pass: [], fail: [] };
const ok = (c, m) => (c ? R.pass : R.fail).push((c ? 'OK  ' : 'XX  ') + m);
(async () => {
  let b; try { b = await chromium.launch({ headless: true }); }
  catch (e) { b = await chromium.launch({ headless: true, executablePath: require('os').homedir() + '/.cache/ms-playwright/chromium-1223/chrome-linux/chrome' }); }
  const p = await (await b.newContext()).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(M1, { waitUntil: 'networkidle' });
  await p.waitForTimeout(300);
  await p.evaluate(() => Object.keys(localStorage).filter(k=>k.startsWith('inema.')).forEach(k=>localStorage.removeItem(k)));

  // cada tema aplica os atributos/classe esperados no <html>
  const themes = {
    'inema-dark': { dark: true,  dt: null },
    'claro':      { dark: false, dt: null },
    'sepia':      { dark: false, dt: 'sepia' },
    'foco':       { dark: null,  dt: 'foco' },     // foco herda eixo claro/escuro; so checa data-theme
    'contraste':  { dark: true,  dt: 'contraste' },
  };
  for (const [t, exp] of Object.entries(themes)) {
    const got = await p.evaluate((th) => { window.INEMA.setPref('theme', th); const h = document.documentElement; return { dark: h.classList.contains('dark'), dt: h.getAttribute('data-theme'), bg: getComputedStyle(document.body).backgroundColor }; }, t);
    const darkOk = exp.dark === null ? true : got.dark === exp.dark;
    const dtOk = (exp.dt || null) === (got.dt || null);
    ok(darkOk && dtOk, `tema "${t}": .dark=${got.dark} data-theme=${got.dt} bg=${got.bg}`);
  }

  // contraste muda o fundo de fato (sépia != dark)
  const bgs = {};
  for (const t of ['inema-dark','claro','sepia','contraste']) {
    await p.evaluate((th)=>window.INEMA.setPref('theme', th), t);
    await p.waitForTimeout(300); // deixa o recalc/observer do Tailwind CDN assentar
    bgs[t] = await p.evaluate(()=>getComputedStyle(document.body).backgroundColor);
  }
  ok(new Set(Object.values(bgs)).size >= 3, 'temas produzem fundos distintos (' + JSON.stringify(bgs) + ')');

  // skip link e o primeiro focavel
  const skip = await p.evaluate(() => {
    const f = document.querySelector('a[href^="#"], a.skip, .skip-link, [class*="skip"]');
    return { exists: !!f, href: f && f.getAttribute('href'), text: f && f.textContent.trim().slice(0,40) };
  });
  ok(skip.exists, 'skip link presente (' + JSON.stringify(skip) + ')');

  // <main id> landmark
  const main = await p.evaluate(() => { const m = document.querySelector('main[id], main#conteudo'); return m ? m.id : null; });
  ok(!!main, 'landmark <main id> presente (' + main + ')');

  // seletor de aparencia abre (role=dialog) e tem controles de tema
  const appe = await p.evaluate(() => {
    const t = document.querySelector('[data-inema-appearance-toggle]');
    if (t) t.click();
    const pop = document.querySelector('.inema-appearance-pop, [data-inema-appearance]');
    const setters = document.querySelectorAll('[data-inema-set-theme], [data-inema-set-accent], [data-inema-set-fontscale]').length;
    return { toggle: !!t, pop: !!pop, setters };
  });
  ok(appe.toggle && appe.pop && appe.setters >= 3, 'seletor de aparencia funcional (toggle/pop/setters=' + appe.setters + ')');

  ok(errs.length === 0, 'sem pageerror (' + errs.length + ')');
  await b.close();
  console.log(JSON.stringify(R, null, 2));
  console.log('\nRESUMO TEMAS: ' + R.pass.length + ' OK, ' + R.fail.length + ' FALHA');
  process.exit(R.fail.length ? 1 : 0);
})().catch(e => { console.log('FATAL ' + e.stack); process.exit(2); });
