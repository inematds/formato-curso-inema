#!/usr/bin/env node
/* rodar-capas-lote.mjs — driver de lote pra capa-inema.
 * Itera cursos e/ou projetos do catalog.json, clona o que falta, roda
 * gerar-capa.cjs por repo (que auto-resolve título/categoria pelo catalog),
 * e commita+pusha cada repo com autor inematds.
 *
 * Uso:
 *   node rodar-capas-lote.mjs --fonte cursos|projetos|todos [--limite N] [--force] [--dry-run]
 *
 * --force   regenera mesmo repos que já têm capa/capa.png (default: pula).
 * --dry-run só lista o que faria, sem gerar/commitar nada.
 */
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync, spawnSync } from 'child_process';

const HOME = os.homedir();
const PROJETOS = path.join(HOME, 'projetos');
const CATALOG = path.join(PROJETOS, 'inemapro-mono/apps/pro/data/catalog.json');
const GERAR_CAPA = path.join(PROJETOS, 'formato-curso-inema/capa-inema/assets/gerar-capa.cjs');
const AUTOR_EMAIL = 'inematds@gmail.com';
const AUTOR_NOME = 'inematds';
const EXCLUDE_SLUGS = new Set(['book-genesis']); // não é repo do usuário

function parseArgs(argv) {
  const a = { fonte: 'todos', limite: Infinity, force: false, dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--fonte') a.fonte = argv[++i];
    else if (k === '--limite') a.limite = Number(argv[++i]);
    else if (k === '--force') a.force = true;
    else if (k === '--dry-run') a.dryRun = true;
  }
  return a;
}

function slugFromUrl(url) {
  const m = String(url || '').match(/inematds\.github\.io\/([^/]+)/);
  return m ? m[1] : null;
}

function loadTargets(fonte) {
  const cj = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
  const seen = new Set();
  const out = [];
  const add = (list, tipo) => {
    for (const e of list || []) {
      const slug = slugFromUrl(e.url);
      if (!slug || seen.has(slug) || EXCLUDE_SLUGS.has(slug)) continue;
      seen.add(slug);
      out.push({ slug, tipo, title: e.title || e.name || slug });
    }
  };
  if (fonte === 'cursos' || fonte === 'todos') add(cj.courses, 'curso');
  if (fonte === 'projetos' || fonte === 'todos') add(cj.projects, 'projeto');
  return out;
}

function sh(cmd, opts = {}) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts });
}

function garantirClone(slug) {
  const repoDir = path.join(PROJETOS, slug);
  if (fs.existsSync(repoDir)) {
    // Pasta existe mas pode não ser um repo git de verdade (achado no lote:
    // várias pastas em ~/projetos foram copiadas sem histórico git). Não dá
    // pra "consertar" isso automaticamente sem risco de perder conteúdo local
    // não commitado — reporta como erro claro em vez de tentar adivinhar.
    if (!fs.existsSync(path.join(repoDir, '.git'))) {
      return { repoDir: null, erro: 'pasta existe mas não é um repo git (sem .git) — precisa de re-clone manual' };
    }
    return { repoDir, clonado: false };
  }
  try {
    sh(`gh repo clone inematds/${slug} -- --quiet`, { cwd: PROJETOS });
    return { repoDir, clonado: true };
  } catch (e) {
    return { repoDir: null, erro: `clone falhou: ${e.message.split('\n')[0]}` };
  }
}

function garantirAutor(repoDir) {
  const email = sh('git config user.email', { cwd: repoDir }).trim();
  if (email !== AUTOR_EMAIL) {
    sh(`git config user.email ${AUTOR_EMAIL}`, { cwd: repoDir });
    sh(`git config user.name ${AUTOR_NOME}`, { cwd: repoDir });
  }
}

function branchDefault(repoDir) {
  try {
    const out = sh('git symbolic-ref --short HEAD', { cwd: repoDir }).trim();
    return out || 'main';
  } catch { return 'main'; }
}

function commitEPush(repoDir, slug, temHero) {
  const arquivos = temHero ? 'capa/ guia/assets/hero.png' : 'capa/';
  sh(`git add ${arquivos}`, { cwd: repoDir });
  const diff = spawnSync('git', ['diff', '--cached', '--quiet'], { cwd: repoDir });
  if (diff.status === 0) return { status: 'sem-mudanca' };

  sh(`git commit -q -m "chore: capa oficial do catalogo (capa-inema)"`, { cwd: repoDir });
  const branch = branchDefault(repoDir);
  try {
    sh(`git push origin ${branch}`, { cwd: repoDir });
    return { status: 'ok' };
  } catch (e1) {
    const rejeitadoNaoFastForward = /rejected|fetch first|non-fast-forward/i.test(e1.message);
    if (rejeitadoNaoFastForward) {
      // Local ficou atrás do remoto (outro processo pushou depois do clone) —
      // rebase e tenta de novo antes de desistir.
      try {
        sh(`git pull --rebase origin ${branch}`, { cwd: repoDir });
        sh(`git push origin ${branch}`, { cwd: repoDir });
        return { status: 'ok (apos rebase)' };
      } catch (eRebase) {
        return { status: 'push-falhou', erro: `rebase falhou: ${eRebase.message.split('\n')[0]}` };
      }
    }
    // fallback: push explícito via SSH (mesmo padrão usado no lote de guias) —
    // cobre o caso de bloqueio de escopo OAuth em push HTTPS.
    try {
      const remoteUrl = sh('git remote get-url origin', { cwd: repoDir }).trim();
      const sshUrl = remoteUrl.startsWith('git@')
        ? remoteUrl
        : `git@github.com:inematds/${slug}.git`;
      sh(`git push ${sshUrl} ${branch}`, { cwd: repoDir });
      return { status: 'ok (via ssh)' };
    } catch (e2) {
      return { status: 'push-falhou', erro: e2.message.split('\n')[0] };
    }
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const alvos = loadTargets(args.fonte).slice(0, args.limite);
  console.log(`[lote] fonte=${args.fonte} alvos=${alvos.length} force=${args.force} dry-run=${args.dryRun}`);

  const resumo = { ok: 0, pulado: 0, erro: 0, detalhes: [] };

  for (const [i, alvo] of alvos.entries()) {
    const prefixo = `[${i + 1}/${alvos.length}] ${alvo.slug}`;
    const { repoDir, clonado, erro: erroClone } = garantirClone(alvo.slug);
    if (erroClone) {
      console.log(`${prefixo} — ERRO: ${erroClone}`);
      resumo.erro++; resumo.detalhes.push({ slug: alvo.slug, erro: erroClone });
      continue;
    }

    const capaPath = path.join(repoDir, 'capa', 'capa.png');
    if (!args.force && fs.existsSync(capaPath)) {
      console.log(`${prefixo} — já tem capa, pulando (use --force pra regerar)`);
      resumo.pulado++;
      continue;
    }

    if (args.dryRun) {
      console.log(`${prefixo} — (dry-run) geraria capa${clonado ? ' [clonaria antes]' : ''}`);
      continue;
    }

    try {
      garantirAutor(repoDir);
      const temGuia = fs.existsSync(path.join(repoDir, 'guia'));
      const cmdArgs = ['--repo', repoDir, '--catalog', CATALOG];
      if (temGuia) cmdArgs.push('--save-raw', path.join(repoDir, 'guia', 'assets', 'hero.png'));
      const r = spawnSync('node', [GERAR_CAPA, ...cmdArgs], { encoding: 'utf8' });
      if (r.status !== 0) {
        console.log(`${prefixo} — ERRO na geração: ${(r.stderr || r.stdout || '').split('\n').slice(-3).join(' | ')}`);
        resumo.erro++; resumo.detalhes.push({ slug: alvo.slug, erro: 'geracao falhou' });
        continue;
      }
      const push = commitEPush(repoDir, alvo.slug, temGuia);
      console.log(`${prefixo} — capa gerada, push: ${push.status}`);
      if (push.status === 'push-falhou') {
        resumo.erro++; resumo.detalhes.push({ slug: alvo.slug, erro: `push: ${push.erro}` });
      } else {
        resumo.ok++;
      }
    } catch (e) {
      console.log(`${prefixo} — ERRO: ${e.message.split('\n')[0]}`);
      resumo.erro++; resumo.detalhes.push({ slug: alvo.slug, erro: e.message.split('\n')[0] });
    }
  }

  console.log(`\n[lote] FIM — ok=${resumo.ok} pulado=${resumo.pulado} erro=${resumo.erro}`);
  if (resumo.detalhes.length) {
    console.log('[lote] detalhes dos erros:');
    for (const d of resumo.detalhes) console.log(`  - ${d.slug}: ${d.erro}`);
  }
}

main().catch((e) => { console.error('[lote] ERRO FATAL', e); process.exit(1); });
