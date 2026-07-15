---
name: formato-curso
description: Template e padroes de design para criar paginas HTML de cursos no formato INEMA.CLUB. Use esta skill SEMPRE que o usuario pedir para criar, editar ou revisar paginas HTML de curso — incluindo index de trilhas, paginas de modulos, componentes como navegacao, cards, topicos expansiveis, modais e slides. Acione tambem quando o usuario mencionar trilhas, modulos, topicos, INEMA.CLUB, ou quando pedir para seguir o "formato de curso" ou "template de curso". Nao deixe de usar esta skill se o usuario mencionar qualquer coisa relacionada a paginas HTML de cursos ou ao projeto skillx.
---

# Formato Curso - INEMA.CLUB

Esta skill garante que todas as paginas de curso sigam o design system padronizado do INEMA.CLUB.

## Referencias

Sempre leia estes arquivos antes de criar ou editar qualquer pagina:

1. **`references/MASTER_COMPLETO.md`** — Templates HTML completos, sistema de cores, componentes, CSS e JavaScript obrigatorios. Contem tudo que voce precisa para construir qualquer pagina.
2. **`references/CHECKLIST_REVISAO.md`** — Checklist para verificar a pagina antes de entregar ao usuario.
3. **`references/DESIGN-SYSTEM.md`** — Vocabulario, filosofia e decisoes visuais. Consulte quando precisar **decidir** qual elemento visual usar (SVG vs tabela vs card), **explicar** o estilo para alguem (cliente, agente, colega), ou **buscar inspiracao** mantendo coerencia. Complementa o MASTER (que diz "como") com o "porque" e o "quando".
4. **`references/SVG-FUTURISTA.md`** — Biblioteca de diagramas SVG ilustrativos no estilo do curso (fan-out, escada, profundidade×largura, malha×solo, aninhamento, equação, fluxo de decisão, monitor mock). Leia SEMPRE que for criar um modulo de conteudo ou index de trilha — cada modulo de conteudo precisa de **≥1 SVG** e cada index de trilha de **1 hero SVG** (ver erro critico #17).

## Fluxo de Trabalho

### 1. Entender o que sera criado
- E uma pagina de **trilha** (index com cards de modulos) ou **modulo** (pagina de conteudo completo)?
- Qual trilha? (define a cor — veja tabela abaixo)
- Quantos modulos/topicos?

### 2. Ler o MASTER_COMPLETO.md

Consulte as secoes relevantes para o que esta criando:

| O que criar | Secoes do MASTER |
|-------------|-----------------|
| Qualquer pagina | Sec. 8 (base HTML), Sec. 9 (JS), Sec. 10 (CSS) |
| Pagina de trilha (index) | Sec. 6.1, 7.3, 7.4, 7.2 |
| Pagina de modulo | Sec. 6.2, 7.5, 7.6, 7.7, 7.14 |
| Navegacao | Sec. 5 |
| Cores | Sec. 3 |
| Diagrama SVG ilustrativo | Sec. 1.10 + `references/SVG-FUTURISTA.md` |

### 3. Criar a pagina seguindo os templates do MASTER

### 4. Verificar com CHECKLIST_REVISAO.md

Antes de entregar, percorra o checklist correspondente a pagina criada. Confirme todos os itens obrigatorios.

---

## Imagens geradas com inemaimg (complementar)

Para deixar os cursos mais ricos, voce PODE gerar imagens incriveis com o **inemaimg** — servidor de imagem local (FastAPI) que roda na maquina, em `http://localhost:8000` (server em `~/projetos/inemaimg`).

**Quando usar:** hero/banner de landing e index de trilha, ilustracoes tematicas de modulo, thumbnails de card, fundos/texturas, imagens de apoio conceitual.

**NAO substitui o SVG inline obrigatorio (erro #17).** Cada modulo de conteudo continua precisando de **≥1 diagrama SVG futurista inline** e cada index de trilha de **1 hero SVG**. As imagens do inemaimg sao um EXTRA decorativo/tematico (PNG raster), nunca o diagrama conceitual do curso.

### Modelos e licenca (importante)

| Modelo | Passos | Qualidade/uso | Licenca |
|--------|--------|---------------|---------|
| `flux2-klein` (default) | 4 | mais rapido, otimo p/ rascunho e hero | **FLUX Non-Commercial** |
| `flux2-dev` | 28 | premium | **FLUX Non-Commercial** |
| `qwen-edit-2511` | 40 | edicao + multi-imagem (refs) | Apache 2.0 (**comercial OK**) |
| `ernie` | 50 | T2I puro | Aberta |

- **Default = `flux2-klein`** (regra global do usuario), salvo orientacao em contrario.
- ⚠️ **Curso comercial?** FLUX.2 (klein/dev) e **non-commercial** — para uso comercial prefira `qwen-edit-2511` ou `ernie`. Ver `~/projetos/inemaimg/MODELOS.md`.

### Como chamar

Health antes de um lote grande: `GET http://localhost:8000/health` (ve `prewarm_status`).

**Via API** — `POST http://localhost:8000/generate`, resposta tem `image` (PNG em base64):
```json
{ "model": "flux2-klein", "prompt": "...", "width": 1536, "height": 1024, "steps": 4, "guidance_scale": 1.0, "seed": 12345 }
```

**Via helper Node** (ja existe em varios projetos, ex.: `~/projetos/imkt4/pipeline/generate-image-inemaimg.js`):
```bash
node generate-image-inemaimg.js <output.png> "<prompt>" [model] [aspect_ratio]
# ex.: node generate-image-inemaimg.js curso/trilha1/assets/hero.png "data center futurista, ciano e roxo, glow" flux2-klein 16:9
```

Aspect ratios prontos (high): `1:1`=1024², `16:9`=1536×1024, `9:16`=1024×1536, `4:3`=1216×896, `3:4`=896×1216. `width`/`height` devem ser multiplos de 32.

**Onde salvar:** dentro do curso, em `assets/img/` (ver estrutura abaixo). Use caminho relativo no HTML, com `alt` descritivo e `class="w-full h-auto rounded-xl"`. Prompts no estilo do curso: paleta da trilha + ciano, dark premium, glow/grid futurista.

---

## Erros Criticos — NUNCA Cometer

Estes sao os erros mais frequentes. Verifique sempre antes de entregar:

| # | Regra | Correto | Errado |
|---|-------|---------|--------|
| 1 | Botoes | `justify-start` | `justify-center` |
| 2 | Indicador de topico | Numero em circulo `<span class="w-6 h-6 rounded-full ...">1</span>` | Seta `▶` |
| 3 | Secoes por topico | 3 secoes: "O que e / Por que aprender / Conceitos-chave" | Menos de 3 |
| 4 | Link INEMA.CLUB | Presente em TODAS as paginas com `text-sky-400` | Ausente |
| 4b | Link PRO | Presente ao lado do INEMA.CLUB (separado por `-`), linkando `https://inema.pro`, dourado no light (`text-amber-700`) / prateado no dark (`dark:text-slate-300`) | Ausente |
| 5 | Light mode CSS | Bloco completo: base + cores acento + sem gradiente + especiais + nav | Apenas base sem cores de acento |
| 6 | Titulo do modulo | `text-2xl font-bold` | `text-lg` |
| 7 | Modal | Usa `<iframe src="modulo-X-X.html">` | Conteudo duplicado |
| 8 | Cartoes simples (index) | `<a>` clicavel sem botoes | Com botoes internos |
| 9 | Modulos no index | TODOS com topicos expansiveis | Alguns apenas com header+botao |
| 11 | Quantidade de topicos | MINIMO 6 topicos por modulo | Menos de 6 |
| 10 | Botao "Ver Completo" no index | CADA card de modulo no index da trilha DEVE ter `<a href="modulo-X-X.html" ...>Ver Completo</a>` | Card sem link para a pagina do modulo |
| 12 | **Mapa da trilha no index** | OBRIGATORIA: secao com h2 `Mapa da trilha` + grid de cards-ancora (#modulo-X-Y). Cada card: header `justify-between` (X.Y esq + duracao dir) + emoji+titulo + subtitulo PUNCHY. Ver Sec. 7.4b do MASTER. | "Navegacao Rapida" (nome errado), circulo numerado extra, subtitulo descritivo, ausencia da secao |
| 13 | **Nav completo em todas paginas** | TODAS as paginas (landing + curso/index + trilhas + modulos) tem o mesmo nav: Logo + INEMA.CLUB + PRO + 4-6 botoes de trilha + theme toggle. Trilha ativa destacada. Ver Sec. 1.6 do MASTER. | Nav simplificado tipo `← Trilha X | Curso` nas paginas internas |
| 14 | **Profundidade dos modulos** | 500-800 linhas, 6-8 secoes com VARIEDADE de componentes (≥2 grids ✓/✗, ≥1 timeline, ≥2 tip boxes, ≥1 code box quando pratico). Ver Sec. 1.8 do MASTER. | 428 linhas com template repetido 6x; mesma estrutura "O que é/Por que/Conceitos" em todas secoes |
| 15 | **Bordas suavizadas (dark)** | CSS dark mode: `.dark .border-dark-600 { border-color: #374151 }` E `.dark .divide-dark-600 > :not([hidden]) ~ :not([hidden]) { border-color: #374151 }`. Ver Sec. 1.5 Parte 5 do MASTER. | Apenas border, esquece divide — linhas entre topicos ficam fortes |
| 16 | **Divisor "Conteudo detalhado"** | `<h2 class="text-2xl font-bold mb-6">Conteudo detalhado</h2>` simples | 2 linhas horizontais (`flex-1 h-px`) com span no meio |
| 17 | **SVG futurista ilustrativo** | Cada **modulo de conteudo** tem ≥1 diagrama SVG inline no estilo do curso (cor da trilha + ciano, glow, grid, `role="img"`+`aria-label`, `w-full h-auto`); cada **index de trilha** tem 1 hero SVG. Ver Sec. 1.10 do MASTER + `references/SVG-FUTURISTA.md`. Exercicios/prompts: opcional. | Modulo de conteudo sem nenhuma ilustracao; SVG hand-drawn/cursivo; cores fora da paleta; imagem PNG externa em vez de SVG inline |

---

## Cores por Trilha

| Trilha | Cor | Classes Tailwind |
|--------|-----|-----------------|
| T1 | Emerald | `text-emerald-400`, `bg-emerald-500/20`, `border-emerald-500/30`, `from-emerald-900/30` |
| T2 | Blue | `text-blue-400`, `bg-blue-500/20`, `border-blue-500/30`, `from-blue-900/30` |
| T3 | Purple | `text-purple-400`, `bg-purple-500/20`, `border-purple-500/30`, `from-purple-900/30` |
| T4 | Amber | `text-amber-400`, `bg-amber-500/20`, `border-amber-500/30`, `from-amber-900/30` |
| T5 | Teal | `text-teal-400`, `bg-teal-500/20`, `border-teal-500/30`, `from-teal-900/30` |
| T6 | Rose | `text-rose-400`, `bg-rose-500/20`, `border-rose-500/30`, `from-rose-900/30` |

Cores especiais:
- **Primary (Yellow):** `#FACC15` / `text-primary` — Logo, CTAs, dicas (light mode: `#a16207`)
- **Sky:** `text-sky-400` — Link INEMA.CLUB (light mode: `#0369a1`)
- **PRO:** `text-amber-700 dark:text-slate-300` — Link PRO ao lado do INEMA.CLUB, linkando `https://inema.pro` (dourado no light, prateado no dark)
- **Red:** `text-red-400` — "Nao fazer", erros, alertas
- **Ciano (diagramas):** `#38bdf8` — cor SECUNDARIA dos SVGs futuristas (agentes, ramo paralelo, fluxo de volta). A cor PRIMARIA do diagrama e sempre a cor da trilha. Ver `references/SVG-FUTURISTA.md`.

**Light mode:** Cada cor de acento tem uma versao mais escura para contraste em fundo claro. Amber e Rose usam tons -800 (mais escuros que as demais) porque ficam intensos demais em -600. Ver Sec. 1.5 do MASTER para tabela completa.

---

## Estrutura de Arquivos do Projeto

```
[nome-do-curso]/
├── index.html                    # Landing page
└── curso/
    ├── trilha1/
    │   ├── index.html            # Index da trilha (cards de modulos)
    │   ├── modulo-1-1.html       # Modulo completo
    │   ├── modulo-1-2.html
    │   ├── assets/img/           # Imagens geradas (inemaimg) — hero, thumbs, fundos
    │   └── ...
    ├── trilha2/
    └── ...
```

---

## Verificacao Final Rapida

Antes de entregar qualquer pagina, confirmar:

1. Botoes a ESQUERDA (`justify-start`)
2. Numeros em circulo (nao setas)
3. 3 secoes por topico (O que e / Por que / Conceitos-chave)
4. INEMA.CLUB presente (`text-sky-400`)
4b. PRO presente ao lado do INEMA.CLUB, linkando `https://inema.pro` (dourado no light / prateado no dark)
5. Light mode CSS completo (base + cores acento + sem gradiente + especiais + nav)
6. Titulo do modulo com `text-2xl`
7. Cores corretas da trilha
8. Theme toggle funcionando
9. Botao "Ver Completo" em CADA card de modulo no index da trilha
10. MINIMO 6 topicos por modulo — nunca menos de 6
11. **MAPA DA TRILHA OBRIGATORIO** no index da trilha — h2 `Mapa da trilha` (NAO "Navegacao Rapida") + grid de cards. Cards com `justify-between` (X.Y esq + duracao dir), emoji no titulo, subtitulo PUNCHY. SEM circulo numerado adicional.
12. **NAV COMPLETO** em TODAS paginas: Logo + INEMA.CLUB + PRO + 4-6 botoes de trilha + theme toggle. Nunca simplificar.
13. **PROFUNDIDADE**: 500-800 linhas por modulo com VARIEDADE de componentes — nao template repetido 6x.
14. **BORDAS SUAVIZADAS no dark**: 2 regras CSS (`border-dark-600` E `divide-dark-600 > :not...`) ambas com `#374151`.
15. **"Conteudo detalhado"**: h2 simples, NAO divisor ornado de 2 linhas com span.
16. **SVG FUTURISTA**: ≥1 diagrama SVG por modulo de conteudo + 1 hero SVG no index da trilha (cor da trilha + ciano, glow, `role="img"`+`aria-label`, `w-full h-auto`, animacao sob `prefers-reduced-motion`). Ver `references/SVG-FUTURISTA.md`.

## Capa oficial — SEMPRE gerar (via skill `capa-inema`)

Ao terminar de montar o curso, gere a capa 1280×720 chamando a engine da skill `capa-inema`:

```bash
node ~/.claude/skills/capa-inema/assets/gerar-capa.cjs --repo <pasta-do-repo> \
  --title "<título do curso>" --cat "<categoria>"
```

- **Layout default = `split`** (texto à esquerda + imagem à direita). Se o usuário pediu **"capa fb"** (full-bleed), acrescente `--layout fb`.
- Requer o **inemaimg** no ar (`localhost:8000`). A capa é gravada em `<repo>/capa/capa.png`.
- Detalhes, opções e uso em lote: skill `capa-inema`.
