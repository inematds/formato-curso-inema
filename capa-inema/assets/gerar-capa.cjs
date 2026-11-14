#!/usr/bin/env node
/* gerar-capa.cjs — capa INEMA 1280x720 pra um repo de curso/projeto.
 * Dois layouts: split (default) e fb (full-bleed). A ARTE vem do gerador de
 * imagem do Codex CLI (image_gen) por padrão desde 2026-09-21; o inemaimg local
 * (flux2-klein) só entra como FALLBACK se o Codex falhar. Título/marca são
 * renderizados por cima via Playwright.
 *
 * Uso:
 *   node gerar-capa.cjs --repo <caminho> [--title "..."] [--cat "..."] \
 *        [--layout split|fb] [--cena "descrição visual"] [--catalog <catalog.json>]
 *        [--raw-in <arte.png>] [--gerador auto|codex|flux]
 *
 * --gerador: auto (default) = Codex e cai pro flux se falhar; codex = só Codex
 * (falha dura); flux = só o inemaimg local (comportamento antigo).
 *
 * Resolução de título/categoria: --title/--cat vencem; senão tenta catalog.json
 * pelo slug (basename do repo); senão lê <title>/<h1> do index.html do repo.
 * Saída: <repo>/capa/capa.png
 *
 * Requer: codex CLI (arte) e Playwright/chromium; inemaimg no ar
 * (IMG_API, default http://localhost:8000/generate) só pro fallback. Playwright (tenta node_modules local, depois o do timesmkt3). */
const fs = require('fs');
const path = require('path');
const os = require('os');

const IMG_API = process.env.IMG_API || 'http://localhost:8000/generate';
const W = 1280, H = 720;
const AMBER = '#f5a623';

// ── Playwright: tenta resolver de vários lugares ────────────────────────────
function loadChromium() {
  const cands = [
    'playwright',
    path.join(os.homedir(), 'projetos/timesmkt3/node_modules/playwright'),
    path.join(os.homedir(), 'projetos/formato-curso-inema/capa-inema/node_modules/playwright'),
  ];
  for (const c of cands) { try { return require(c).chromium; } catch {} }
  throw new Error('Playwright não encontrado. Instale com: npm i -D playwright && npx playwright install chromium');
}

// ── args ────────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const a = {};
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k.startsWith('--')) { a[k.slice(2)] = (argv[i+1] && !argv[i+1].startsWith('--')) ? argv[++i] : true; }
  }
  return a;
}

// ── cena visual por categoria (assunto pro flux, SEM texto) ─────────────────
// Só o ASSUNTO. Nada de luz, humor, paleta ou acabamento — a imagem é uma imagem normal
// do contexto (decidido em 2026-08-13). Adjetivos como "bright", "radiant golden light",
// "luminous", "optimistic" já moraram aqui e eram a razão de toda capa sair âmbar mesmo
// depois de o sufixo de estilo ser removido. Não recoloque: se quiser mudar o resultado,
// mude o ASSUNTO, não a iluminação.
const CENA = {
  'design':     'concept art characters and design boards in an illustration studio',
  'vídeo':      'a film set with a movie camera on a dolly and a director monitor',
  'video':      'a film set with a movie camera on a dolly and a director monitor',
  'marketing':  'advertising campaign materials and audience reach spreading outward',
  'agentes':    'an operations room of AI agents with dashboards and a network of nodes',
  'ia':         'an artificial intelligence core with a neural network and data streams',
  'conteúdo':   'short-form video content creation on phone screens',
  'conteudo':   'short-form video content creation on phone screens',
  'produtividade':'a workspace with task boards and an organized workflow',
  'negócios':   'business strategy with growth charts and a city skyline',
  'negocios':   'business strategy with growth charts and a city skyline',
  'código':     'software architecture with code on terminals and screens',
  'codigo':     'software architecture with code on terminals and screens',
};
function cenaFor(cat, title) {
  const key = String(cat || '').trim().toLowerCase();
  return CENA[key] || `an image about "${title}"`;
}

// ── resolver título/categoria ────────────────────────────────────────────────
function resolveMeta(repo, args) {
  let title = args.title, cat = args.cat;
  const slug = path.basename(path.resolve(repo));
  if ((!title || !cat) && args.catalog && fs.existsSync(args.catalog)) {
    try {
      const cj = JSON.parse(fs.readFileSync(args.catalog, 'utf8'));
      const all = [...(cj.courses||[]), ...(cj.projects||[])];
      const m = /inematds\.github\.io\/([^\/]+)/;
      const e = all.find(x => (String(x.url||'').match(m)||[])[1] === slug);
      if (e) { title = title || e.title; cat = cat || e.cat; }
    } catch {}
  }
  if (!title) {
    const idx = path.join(repo, 'index.html');
    if (fs.existsSync(idx)) {
      const html = fs.readFileSync(idx, 'utf8');
      const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[])[1];
      const tt = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[])[1];
      title = (h1 || tt || slug).replace(/<[^>]+>/g,'').split(/[|—–]|&mdash;/)[0].trim();
    } else title = slug;
  }
  cat = cat || 'IA';
  return { title, cat, slug };
}

function seedFrom(s){ let h=0; for(const c of String(s)) h=(h*31+c.charCodeAt(0))>>>0; return h%2000000; }
function splitTitle(t){ const p=String(t).split(/\s+—\s+|\s+–\s+|\s+-\s+/); return p.length>=2?{main:p[0].trim(),sub:p.slice(1).join(' — ').trim()}:{main:String(t).trim(),sub:''}; }

// ATENÇÃO: o flux2-klein IGNORA `negative_prompt` — o pipeline FLUX.2 não suporta (ver
// inemaimg/loaders/flux2_klein.py, que recebe o campo e não repassa). Mandar negative
// aqui é no-op: verificado em 2026-08-13, a mesma seed com e sem negative gerou imagens
// byte a byte idênticas. Por isso TODA restrição — sem texto, sem escuro/triste, sem
// estouro — precisa estar no prompt POSITIVO abaixo.
async function gerarImagem(cena, seed, w, h) {
  // SEM direção de estilo (decidido em 2026-08-13): nada de "editorial premium", luz,
  // fundo claro, humor ou paleta. A imagem é só o CONTEXTO do projeto — o modelo escolhe
  // o resto. A única restrição que fica é a técnica: sem texto e sem virar screenshot,
  // porque a camada de texto INEMA entra por cima depois.
  // A ÚNICA licença artística permitida é ÓPTICA, não de estilo: lente clara e foco raso.
  // Dá profundidade e destaca o sujeito (a capa é vista pequena, num card ao lado do texto)
  // sem ditar luz, cor nem humor. Não acrescente nada além disto aqui.
  const prompt = `${cena}, shot with a fast prime lens, shallow depth of field, `
    + `the subject sharp in focus and the background softly out of focus. `
    + `NO TEXT of any kind: no words, no letters, no captions, no watermark, no logo, `
    + `no user interface, not a screenshot.`;
  const body = { model:'flux2-klein', prompt, width:w, height:h, seed };
  const r = await fetch(IMG_API, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(body) });
  if (!r.ok) throw new Error(`inemaimg ${r.status}: ${(await r.text()).slice(0,180)}`);
  return (await r.json()).image; // base64 PNG
}

// ── arte via Codex CLI (image_gen) — DEFAULT desde 2026-09-21 ───────────────
// O usuário pediu que a arte da capa/hero do guia saia do gerador de imagem do
// Codex (a mesma via já usada pelo gerar-banner.sh do projetos-landing-guia), e
// que o flux2-klein local só entre quando o Codex falhar.
// Detalhes:
// - --dangerously-bypass-approvals-and-sandbox: o bwrap do Codex não roda neste
//   host (AppArmor restringe user namespaces) e a gravação do PNG falha mesmo
//   com -s workspace-write (visto 2026-09-13 no gerar-banner.sh).
// - O image_gen tem tamanhos fixos (não aceita 1024x768 arbitrário). Não é
//   problema: htmlSplit e htmlFB usam object-fit:cover, então o corte é
//   inofensivo. Só pedimos a ORIENTAÇÃO certa (paisagem).
// - Sem seed: o image_gen não expõe seed. Capa do mesmo repo não é mais
//   reprodutível byte a byte pelo caminho Codex (é pelo fallback flux).
function gerarImagemCodex(cena, w, h) {
  const { spawnSync } = require('child_process');
  const which = spawnSync('bash', ['-c', 'command -v codex'], { encoding:'utf8' });
  if (which.status !== 0) throw new Error('codex não instalado');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'capa-codex-'));
  const orient = w >= h ? 'horizontal (paisagem, 3:2 ou 16:9)' : 'vertical (retrato)';
  const prompt = `Use sua ferramenta de geração de imagem (image_gen) para criar UMA imagem `
    + `${orient} e salve o PNG como arte.png neste diretório. Não crie nem edite nenhum outro arquivo.\n\n`
    + `Conteúdo da imagem: ${cena}.\n`
    + `Fotografada com lente prime clara, profundidade de campo rasa, o sujeito nítido em foco `
    + `e o fundo suavemente desfocado.\n`
    + `SEM TEXTO de qualquer tipo: sem palavras, sem letras, sem legendas, sem marca d'água, `
    + `sem logo, sem interface de usuário, não é uma captura de tela.\n`
    + `Ao terminar, responda só com o caminho do arquivo e o tamanho em pixels.`;
  const png = path.join(dir, 'arte.png');
  const r = spawnSync('codex', ['exec', '--skip-git-repo-check',
    '--dangerously-bypass-approvals-and-sandbox', prompt],
    { cwd: dir, encoding:'utf8', timeout: 600000 });
  if (!fs.existsSync(png) || fs.statSync(png).size === 0) {
    const log = path.join(dir, 'codex.log');
    try { fs.writeFileSync(log, (r.stdout||'') + '\n' + (r.stderr||'')); } catch {}
    throw new Error(`codex não gerou arte.png (log: ${log})`);
  }
  const b64 = fs.readFileSync(png).toString('base64');
  fs.rmSync(dir, { recursive:true, force:true }); // /tmp é apertado neste host
  return b64;
}

function htmlSplit(meta, b64){
  const {main,sub}=splitTitle(meta.title);
  const fsz = main.length>22 ? 58 : 72;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${W}px;height:${H}px;overflow:hidden;font-family:'Montserrat',sans-serif}
  .stage{position:relative;width:${W}px;height:${H}px;
    background:radial-gradient(1100px 700px at 78% 12%, rgba(245,166,35,.14), transparent 60%),
               radial-gradient(900px 600px at 10% 100%, rgba(60,120,160,.12), transparent 55%),
               linear-gradient(135deg,#0b0c11 0%, #0e0f16 55%, #0a0b10 100%)}
  .grid{position:absolute;inset:0;display:grid;grid-template-columns:1fr 588px;align-items:center;gap:44px;padding:0 60px}
  .eyebrow{display:inline-flex;align-items:center;gap:12px;margin-bottom:26px}
  .brand{font-weight:900;letter-spacing:2px;font-size:20px;color:#fff}.brand b{color:${AMBER}}
  .chip{font-weight:700;font-size:15px;letter-spacing:1px;color:#0b0b0d;background:${AMBER};padding:6px 14px;border-radius:999px;text-transform:uppercase}
  .main{font-weight:900;color:#fff;font-size:${fsz}px;line-height:1.03;letter-spacing:-1px}
  .sub{margin-top:20px;font-weight:600;font-size:27px;color:#c9cdd6;max-width:560px;line-height:1.3}
  .bar{width:80px;height:7px;background:${AMBER};border-radius:6px;margin-top:30px}
  .card{width:588px;height:441px;border-radius:22px;overflow:hidden;position:relative;box-shadow:0 30px 80px rgba(0,0,0,.55),0 0 0 1px rgba(245,166,35,.22)}
  .card img{width:100%;height:100%;object-fit:cover;display:block}
  .card::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 60%,rgba(8,8,12,.3))}
  </style></head><body><div class="stage"><div class="grid">
    <div><div class="eyebrow"><span class="brand">INEMA<b>.CLUB</b></span><span class="chip">${meta.cat}</span></div>
      <div class="main">${main}</div>${sub?`<div class="sub">${sub}</div>`:''}<div class="bar"></div></div>
    <div class="card"><img src="data:image/png;base64,${b64}"/></div>
  </div></div></body></html>`;
}

function htmlFB(meta, b64){
  const {main,sub}=splitTitle(meta.title);
  const fsz = main.length>26 ? 68 : main.length>18 ? 84 : 96;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;800;900&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${W}px;height:${H}px;overflow:hidden;font-family:'Montserrat',sans-serif}
  .stage{position:relative;width:${W}px;height:${H}px;background:#0b0b0d}
  .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
  .scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,8,12,.35) 0%,rgba(8,8,12,0) 28%),linear-gradient(0deg,rgba(6,6,10,.92) 0%,rgba(6,6,10,.5) 34%,rgba(6,6,10,0) 64%)}
  .eyebrow{position:absolute;top:52px;left:64px;display:flex;align-items:center;gap:14px}
  .brand{font-weight:900;letter-spacing:3px;font-size:25px;color:#fff}.brand b{color:${AMBER}}
  .chip{font-weight:700;font-size:17px;letter-spacing:1px;color:#0b0b0d;background:${AMBER};padding:7px 15px;border-radius:999px;text-transform:uppercase}
  .titlewrap{position:absolute;left:64px;right:64px;bottom:70px}
  .bar{width:90px;height:8px;background:${AMBER};border-radius:6px;margin-bottom:24px}
  .main{font-weight:900;color:#fff;font-size:${fsz}px;line-height:1.02;letter-spacing:-1px;text-shadow:0 4px 30px rgba(0,0,0,.6);max-width:1120px}
  .sub{margin-top:18px;font-weight:600;font-size:32px;color:#e7e2d8;opacity:.92;max-width:1000px}
  </style></head><body><div class="stage">
    <img class="bg" src="data:image/png;base64,${b64}"/><div class="scrim"></div>
    <div class="eyebrow"><span class="brand">INEMA<b>.CLUB</b></span><span class="chip">${meta.cat}</span></div>
    <div class="titlewrap"><div class="bar"></div><div class="main">${main}</div>${sub?`<div class="sub">${sub}</div>`:''}</div>
  </div></body></html>`;
}

async function main(){
  const args = parseArgs(process.argv);
  if (!args.repo) { console.error('faltou --repo <caminho>'); process.exit(2); }
  const repo = path.resolve(args.repo);
  if (!fs.existsSync(repo)) { console.error('repo não existe:', repo); process.exit(2); }
  const layout = (args.layout === 'fb') ? 'fb' : 'split';
  const meta = resolveMeta(repo, args);
  const cena = args.cena && args.cena !== true ? args.cena : cenaFor(meta.cat, meta.title);
  const seed = seedFrom(meta.slug);

  console.log(`[capa] ${meta.slug} | layout=${layout} | cat=${meta.cat} | "${meta.title}"`);
  const [iw, ih] = layout === 'fb' ? [W, H] : [1024, 768];
  // --raw-in: a arte ja existe (gerada por outro modelo/ferramenta) e so falta a
  // camada de texto INEMA por cima. Sem a flag nada muda: gera no inemaimg.
  const rawIn = args['raw-in'] && args['raw-in'] !== true ? path.resolve(String(args['raw-in'])) : null;
  if (rawIn && !fs.existsSync(rawIn)) { console.error('--raw-in nao existe:', rawIn); process.exit(2); }
  // Ordem da arte com --gerador auto: --raw-in > Codex (image_gen) > flux2-klein (fallback).
  // Default = flux (comportamento historico), porque esta engine tambem faz as capas de
  // CURSO em lote e cada chamada ao Codex custa uma geracao na conta OpenAI. Quem quer o
  // Codex pede: a skill projetos-landing-guia passa --gerador auto desde 2026-09-21.
  const gerador = (args.gerador && args.gerador !== true) ? String(args.gerador) : 'flux';
  let b64, fonte;
  if (rawIn) { b64 = fs.readFileSync(rawIn).toString('base64'); fonte = `raw-in (${rawIn})`; }
  else if (gerador === 'flux') { b64 = await gerarImagem(cena, seed, iw, ih); fonte = 'flux2-klein'; }
  else {
    try { b64 = gerarImagemCodex(cena, iw, ih); fonte = 'codex/image_gen'; }
    catch (e) {
      if (gerador === 'codex') { console.error('[capa] codex falhou:', e.message); process.exit(1); }
      console.warn(`[capa] codex falhou (${e.message}) — fallback pro flux2-klein local`);
      b64 = await gerarImagem(cena, seed, iw, ih); fonte = 'flux2-klein (fallback)';
    }
  }
  console.log(`[capa] arte: ${fonte}`);

  const chromium = loadChromium();
  const browser = await chromium.launch({ headless:true, args:['--no-sandbox','--disable-dev-shm-usage'] });
  try {
    const page = await browser.newPage({ viewport:{ width:W, height:H }, deviceScaleFactor:1 });
    await page.setContent(layout === 'fb' ? htmlFB(meta,b64) : htmlSplit(meta,b64), { waitUntil:'networkidle' });
    await page.waitForTimeout(300);

    // O tamanho do titulo era escolhido por CONTAGEM DE CARACTERES, sem saber a
    // largura da coluna: "Bench Studio BR" (15 chars) ganhava 72px e quebrava em
    // duas linhas num espaco de ~528px. Aqui a pagina MEDE e encolhe ate caber
    // numa linha so — nunca aumenta, entao capa que ja cabia nao muda.
    await page.evaluate(() => {
      const el = document.querySelector('.main');
      if (!el) return;
      // A largura disponivel e medida ANTES do nowrap e virada em teto fixo. Sem
      // isso a conta e circular: numa coluna `1fr`, o nowrap faz a propria
      // coluna crescer, o texto "cabe" em qualquer tamanho e quem paga e a
      // imagem ao lado, que sai empurrada para fora da capa.
      const disponivel = el.parentElement.clientWidth;
      el.style.maxWidth = disponivel + 'px';
      el.style.whiteSpace = 'nowrap';
      let px = parseFloat(getComputedStyle(el).fontSize);
      while (px > 34 && el.scrollWidth > disponivel) {
        px -= 2;
        el.style.fontSize = px + 'px';
      }
      // Titulo longo demais para caber inteiro numa linha: solta a quebra de
      // volta, porque duas linhas legiveis batem uma linha ilegivel.
      if (el.scrollWidth > disponivel) el.style.whiteSpace = 'normal';
    });
    await page.waitForTimeout(120);
    const capaDir = path.join(repo, 'capa');
    fs.mkdirSync(capaDir, { recursive:true });
    const out = path.join(capaDir, 'capa.png');
    await page.screenshot({ path: out, type:'png' });
    console.log(`[capa] gravada -> ${out}`);

    // Mesma imagem-base (SEM texto), reaproveitada como hero da página de guia —
    // evita gerar uma segunda imagem e mantém a mesma identidade visual da capa.
    if (args['save-raw']) {
      const rawOut = path.resolve(String(args['save-raw']));
      fs.mkdirSync(path.dirname(rawOut), { recursive:true });
      fs.writeFileSync(rawOut, Buffer.from(b64, 'base64'));
      console.log(`[capa] imagem crua (hero) -> ${rawOut}`);
    }
  } finally { await browser.close(); }
}
main().catch(e => { console.error('[capa] ERRO', e.message); process.exit(1); });
