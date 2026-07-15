---
name: formato-curso-v2
description: Template e padroes de design para criar paginas HTML de cursos no formato INEMA.CLUB COM camada de aprendizagem por cima — progresso/marcar-lido, duvida, anotacoes/highlight no proprio texto, painel "minha jornada" (continuar de onde parei), export/import .json, sistema de temas trocavel (data-theme ortogonal ao .dark) + preferencias de leitura (tamanho/largura/entrelinha/fonte/acento). Tudo self-contained (HTML+Tailwind CDN+JS inline, sem build/backend, abre em file://), baseado no formato-curso v1 (dark premium ambar/ciano, SVG futurista, profundidade de modulos). Use esta skill SEMPRE que o usuario pedir para criar, editar ou revisar paginas HTML de curso — incluindo index de trilhas, paginas de modulos, componentes como navegacao, cards, topicos expansiveis, modais e slides — e tambem quando pedir os recursos de aprendizagem (progresso, marcar lido, duvida, anotacao, highlight, minha jornada, export/import, temas, modo leitura/sepia/foco/alto-contraste). Acione tambem quando o usuario mencionar trilhas, modulos, topicos, INEMA.CLUB, ou quando pedir para seguir o "formato de curso" ou "template de curso". Nao deixe de usar esta skill se o usuario mencionar qualquer coisa relacionada a paginas HTML de cursos ou ao projeto skillx.
---

# Formato Curso v2 - INEMA.CLUB (com camada de aprendizagem)

Esta skill garante que todas as paginas de curso sigam o design system padronizado do INEMA.CLUB.

A **v2 NAO e um redesign** do v1: e a v1 (dark premium ambar/ciano, SVG futurista, profundidade dos modulos, Erros Criticos #1-#17) com uma **camada de aprendizagem e aparencia por cima** — progresso/marcar-lido, duvida, anotacao/highlight, painel "minha jornada", export/import e sistema de temas trocavel + preferencias de leitura. A camada e **enhancement progressivo**: se o JS quebrar ou o `localStorage` estiver bloqueado, o curso continua 100% legivel. Tudo continua self-contained (HTML + Tailwind via CDN + JS inline, sem build/backend/framework, abre em `file://`).

## Referencias

Sempre leia estes arquivos antes de criar ou editar qualquer pagina:

1. **`references/MASTER_COMPLETO.md`** — Templates HTML completos, sistema de cores, componentes, CSS e JavaScript obrigatorios. Contem tudo que voce precisa para construir qualquer pagina.
2. **`references/CHECKLIST_REVISAO.md`** — Checklist para verificar a pagina antes de entregar ao usuario.
3. **`references/DESIGN-SYSTEM.md`** — Vocabulario, filosofia e decisoes visuais. Consulte quando precisar **decidir** qual elemento visual usar (SVG vs tabela vs card), **explicar** o estilo para alguem (cliente, agente, colega), ou **buscar inspiracao** mantendo coerencia. Complementa o MASTER (que diz "como") com o "porque" e o "quando".
4. **`references/SVG-FUTURISTA.md`** — Biblioteca de diagramas SVG ilustrativos no estilo do curso (fan-out, escada, profundidade×largura, malha×solo, aninhamento, equação, fluxo de decisão, monitor mock). Leia SEMPRE que for criar um modulo de conteudo ou index de trilha — cada modulo de conteudo precisa de **≥1 SVG** e cada index de trilha de **1 hero SVG** (ver erro critico #17).
5. **`references/LEARN-LAYER.md`** — Fonte-de-verdade tecnica da **camada de aprendizagem**: modelo de dados `localStorage` (namespace `inema.<courseId>.*`, persistir so a verdade minima, derivar % no render), API `window.INEMA` (init/applyPrefs, markRead/progress/renderMeters, toggleDoubt, highlight/notas via TreeWalker, openJourney/renderJourney, resume/saveCheckpoint, exportJSON/importJSON, setPref), schema do export/import `.json`, sistema de temas (`data-theme` ortogonal ao `.dark`, CSS vars de leitura) e os **snippets de markup `data-*`** (copia-e-cola: IDs estaveis, atributos que ativam features, a11y). Leia SEMPRE que for plugar qualquer recurso novo (progresso, duvida, anotacao, jornada, temas, prefs).

## Arquivos da camada de aprendizagem (assets/)

A camada nova vive em **dois assets** + **dois snippets** que voce pluga em cada pagina:

| Arquivo / snippet | O que e | Onde vai na pagina |
|---|---|---|
| **`assets/learn.css`** | CSS vars + temas (`data-theme`: claro/sepia/foco/alto-contraste), `.inema-prose` (medida/tamanho/entrelinha/fonte/acento), estilos dos controles novos (marcar-lido, popover de selecao, jornada, anel/barra de progresso). | No `<head>` (dentro do `<style>` ou como `<link>` relativo), **depois** do CSS base do v1. |
| **`assets/learn.js`** | Modulo IIFE `window.INEMA` (toda a API de §2 do LEARN-LAYER). Idempotente e feature-detect: so ativa o que existe na pagina (via presenca de `data-*`). | Inline antes de `</body>` (ou `<script src>` relativo), **depois** do JS-nucleo do v1 (`toggleTopic`, theme toggle, `openModal/closeModal`). |
| **Snippet anti-FOUC** | Script bloqueante minusculo e SEPARADO, com try/catch: le `inema.prefs` e seta `.dark` **E** `data-theme` **E** as classes de leitura ANTES do primeiro paint. Default dark no erro (preserva a marca). | **PRIMEIRO no `<head>`**, ACIMA do Tailwind e do `learn.css`. Nunca depois. |
| **Snippet init** | `INEMA.init()` em `DOMContentLoaded` — hidrata estado, pinta lidos/duvidas/highlights, monta toggles/TOC/scrollspy/jornada/seletor de aparencia. | No FIM da pagina, depois de `learn.js` ter carregado. |

**Como plugar (regra de ouro):**
1. **Anti-FOUC PRIMEIRO** no `<head>`, antes de tudo (evita flash de tema a cada navegacao).
2. `learn.css` no `<head>` depois do CSS base.
3. `learn.js` antes de `</body>` depois do JS-nucleo do v1.
4. `INEMA.init()` por ultimo (no `DOMContentLoaded`).

Voce pode **colar tudo inline** (mantendo o padrao snippet copia-e-cola do baseline — preferido para `file://` 100% offline) **OU referenciar os assets por caminho relativo** (`<link href="../../assets/learn.css">` / `<script src="../../assets/learn.js"></script>`) quando o curso compartilha os assets. O anti-FOUC e o `init` sao sempre **snippets inline** (curtos); o que pode ser inline-ou-referenciado e o par `learn.css`/`learn.js`.

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

## Aprendizagem visual e didatica (orientacao obrigatoria)

**Principio:** o curso ensina pelo OLHO e pela MAO, nao so pelo texto. Um aluno que aprende visual tem que conseguir entender o modulo pelos apoios visuais + legendas, sem ler todo o corpo; e um aluno pratico tem que conseguir COPIAR E RODAR um exemplo. Sao tres regras (viram os erros criticos #29-#31):

### 1. Visual-first — ilustre cada conceito-chave (SVG / hyperframe / inemaimg, uso ILIMITADO)

- O minimo do erro #17 (≥1 SVG por modulo de conteudo, 1 hero SVG por index) e **PISO, nao teto**. Em modulo profundo, ilustre **CADA conceito-chave** / cada secao que introduz uma ideia nova. Quantidade de visuais e **ilimitada** — use a vontade.
- Tres meios, escolha o que melhor EXPLICA aquele ponto (pode misturar no mesmo modulo):
  - **SVG futurista inline** (backbone, sempre offline) — diagramas conceituais: ciclo, fan-out, escada, fluxo de decisao, comparacao, aninhamento. Continua sendo o meio **obrigatorio** do diagrama conceitual. Ver erro #17 + `references/SVG-FUTURISTA.md`.
  - **inemaimg** (PNG raster, local, default `flux2-klein`) — heros, cenas tematicas, metaforas visuais, texturas. Pode usar **generosamente e de forma didatica** (nao so decorativo). Ver a secao acima.
  - **hyperframe** (visual animado) — quando o MOVIMENTO ensina (um ciclo girando, um antes/depois, um loop rodando passo a passo): um clipe curto renderizado via **HyperFrames (HTML->MP4)** embutido por caminho relativo com `<video muted loop playsinline class="w-full h-auto rounded-xl">`, OU uma mini-animacao **SVG/CSS inline** self-contained. Sempre sob `prefers-reduced-motion` (parar/estatico se o usuario pediu menos movimento).
- **Toda ilustracao precisa de legenda/`alt` que ENSINA** (uma frase dizendo o que olhar e o que aquilo significa), nunca decorativa-muda. O par **"visual + legenda"** e a unidade de aprendizado visual: o aluno visual segue o modulo so por esses pares.

### 2. Exemplos praticos copy-run em cada modulo pratico (prompt/codigo pronto)

- Todo modulo pratico traz **≥1 exemplo copia-e-cola que o aluno roda de verdade** (prompt pronto pro Claude Code, comando de terminal, trecho de codigo), em **code box** (ver Sec. 7.x do MASTER), com tres coisas: **objetivo** (o que isso faz) · **o bloco copiavel** · **como verificar** o resultado.
- Prompts/codigo **reais e completos** — o aluno cola e funciona, nao "exemplo de prompt: voce poderia pedir...". Marque o que e variavel com `<isto voce troca>`.

### 3. Fundamento define os termos inline (base de verdade)

- Modulo/topico de **FUNDAMENTO** esclarece **CADA termo tecnico na PRIMEIRA vez que aparece**, ali na propria explicacao — nunca assume que o aluno ja sabe. Estilo **"Novo aqui?"**: frase curta e concreta (ex.: *"Um LLM e so um modelo de IA, do tipo que roda atras do ChatGPT. 'Ferramentas' sao coisas que ele faz sozinho: buscar na web, rodar codigo, editar um arquivo."*).
- Use um **glossario-inline** (tip box / aside "O que e X?") pro termo nao quebrar a leitura. A secao "Conceitos-chave" (erro #3) LISTA; o fundamento DEFINE na hora. **Sem jargao orfao** — nenhum termo novo aparece sem definicao antes ou junto.

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

### Erros Criticos da camada de aprendizagem (v2) — #18 a #28

Estes 11 erros sao especificos da camada nova. Os #1-#17 acima continuam valendo intactos.

| # | Regra | Correto | Errado |
|---|-------|---------|--------|
| 18 | **Anti-FOUC presente** | Script bloqueante minusculo e SEPARADO no `<head>`, ACIMA do Tailwind/`learn.css`, com try/catch: le `inema.prefs` e seta `.dark` + `data-theme` + classes de leitura ANTES do primeiro paint. Default dark no erro. Ver §3.2 do LEARN-LAYER. | Tema aplicado so no `init` (flash a cada navegacao); anti-FOUC depois do Tailwind; sem try/catch; sem default dark |
| 19 | **IDs/`data-*` estaveis OBRIGATORIOS** | `<meta name="inema-course">`; `data-inema-topic="modulo-X-Y#topico-N"` (id estavel de progresso/notas), `data-inema-module`/`-track`/`-block` deterministicos. Mudar o layout visual NAO pode quebrar o estado. Ver §4.1. | Ids baseados em texto/ordem visual; faltam `data-inema-*`; sem `<meta>` courseId; bloco anotavel sem `data-inema-block` |
| 20 | **Marcar-lido acessivel** | `<button aria-pressed>` (ou `role=switch aria-checked`), `justify-start` (NAO viola #1), Space alterna, estado por icone+texto+cor. Persiste boolean, deriva %. Ver §4.3. | `justify-center` (viola #1); `<div>` clicavel sem `aria-pressed`; estado so por cor; persistir % no storage |
| 21 | **Contraste verificado POR TEMA** | Cada par `--text`/`--text-muted` sobre `--bg` passa AA 4.5:1 (mirar AAA 7:1 leitura longa) em TODOS os temas; bordas/foco/icones ≥3:1. Ambar NUNCA como TEXTO em superficie clara (1.35:1 sepia) — so fill/borda; texto de acento cai p/ `-700/-800`. Ver §3.7. | Muted ilegivel no claro/sepia; ambar de texto em fundo claro; testar so o dark default |
| 22 | **Popover de selecao correto (TreeWalker)** | Highlight/nota renderizado por **`TreeWalker`** envolvendo text nodes pedaco a pedaco. `quote` SEMPRE gravado. Popover posicionado por `getBoundingClientRect()` (+`scrollX/scrollY`), fecha fora/selecao vazia. Ver §2.4. | `Range.surroundContents()` cego (lanca `InvalidStateError` em selecao cross-node); nao gravar `quote`; popover sem reposicionar no transbordo |
| 23 | **Jornada acessivel** | Painel global `role=dialog aria-modal=true aria-labelledby`, foco preso, ESC fecha, `inert` no resto, devolucao de foco ao gatilho. Reusa `openModal/closeModal` do v1. So leitura do estado (nunca dessincroniza). Ver §2.5/§4.3. | Drawer sem `role=dialog`; foco escapa; sem `inert`; sem devolver foco; jornada duplica/edita conteudo |
| 24 | **Export/Import round-trip LOSSLESS** | `exportJSON` sempre produz arquivo valido; `importJSON` valida `schemaVersion` em var temporaria, so commita se valido, **merge nao-destrutivo por default**, preserva campos desconhecidos de versoes futuras. Arquivo invalido = no-op. Ver §1.5. | Round-trip perde dados; import destrutivo por default; muta estado antes de validar; descarta campos desconhecidos; arquivo invalido quebra a pagina |
| 25 | **`scroll-margin-top` nos alvos** | `scroll-margin-top` (= altura do nav sticky) em TODOS os alvos focaveis/ancoras de topico — senao o nav obscurece o foco e o "continuar de onde parei". `resume()` por ancora de id (`scrollIntoView`), nunca `scrollY` cru. Ver §2.6/§4.3. | Alvos sem `scroll-margin-top` (foco escondido sob o nav); restaurar por `scrollY` cru (quebra com accordions colapsados) |
| 26 | **ARIA nos accordions** | `<button aria-expanded aria-controls="painel-id">` + `id` no `.topic-explanation`. Preserva `onclick="toggleTopic(this)"` do v1, mas o estado ARIA acompanha o aberto/fechado. Ver §4.3. | Accordion sem `aria-expanded`/`aria-controls`; estado ARIA dessincronizado do visual |
| 27 | **Modos efemero/orfa de degradacao** | Probe de storage no boot: indisponivel ⇒ **modo efemero** (estado em memoria) + aviso discreto nao-bloqueante, curso segue legivel. Nota que nao re-ancora vira **orfa** (`quote` preservado, listada na jornada) e NAO derruba as outras. Ver §1.6/§2.4. | Storage indisponivel quebra a pagina; aviso bloqueante; uma nota que nao ancora derruba todas; texto da nota se perde |
| 28 | **Manifesto do curso presente em TODAS as paginas** (progresso cross-pagina depende dele) | `<script type="application/json" data-inema-manifest>` com a estrutura COMPLETA do curso (course + tracks[].modules[] com `id`/`title`/`topics`/`href`) no `<head>` de TODA pagina. `progress()` agrega `done` (read-map persistido) sobre `total` (manifesto); `topics` bate com os `data-inema-topic` reais de cada modulo. Ver §1.7/§3.9 do LEARN-LAYER + Sec. 11.5.h do MASTER. | Sem manifesto (progresso curso/trilha so conta o modulo da pagina atual e a "minha jornada" nao mostra o curso inteiro); `topics` divergindo do DOM (% errado); manifesto so em algumas paginas |

### Erros Criticos didaticos (v2) — #29 a #31

Estes 3 erros sao a orientacao de **aprendizagem visual + base de fundamentos** (ver secao "Aprendizagem visual e didatica"). Os #1-#28 acima continuam valendo intactos.

| # | Regra | Correto | Errado |
|---|-------|---------|--------|
| 29 | **Visual-first — ilustrar cada conceito-chave (uso ILIMITADO de SVG/inemaimg/hyperframe)** | O minimo do #17 e PISO: em modulo profundo, CADA conceito/secao que introduz ideia nova ganha apoio visual (SVG inline, PNG inemaimg, ou hyperframe animado), sem limite de quantidade. Toda ilustracao tem legenda/`alt` que ENSINA (diz o que olhar e o que significa). Aluno visual entende o modulo pelos pares visual+legenda. Hyperframe = clipe HTML->MP4 (`<video muted loop playsinline>`) ou animacao SVG/CSS inline, sob `prefers-reduced-motion`. | Um unico SVG no modulo inteiro tratado como teto; imagens decorativas-mudas sem legenda; blocos longos de texto sem apoio visual do conceito; video sem `prefers-reduced-motion` |
| 30 | **Exemplos praticos copy-run em cada modulo pratico (prompt/codigo pronto)** | ≥1 exemplo copia-e-cola REAL que o aluno roda (prompt pronto pro Claude Code, comando, codigo) em code box, com objetivo + bloco copiavel + como verificar. Partes variaveis marcadas (`<isto voce troca>`). | "Exemplo de prompt: voce poderia pedir..." (descrito, nao colavel); code box sem o que rodar nem como verificar; modulo pratico so com teoria |
| 31 | **Fundamento define os termos inline (base de verdade)** | Modulo/topico de fundamento esclarece CADA termo tecnico na 1a vez que aparece, ali na explicacao, estilo "Novo aqui?": frase curta e concreta + glossario-inline (aside/tip "O que e X?") pra nao quebrar a leitura. Sem jargao orfao. | Usar "ReAct", "harness", "tool-calling", "ground truth" etc. sem definir; assumir que o aluno ja sabe; jogar a definicao so num glossario no fim |

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
├── index.html                    # Landing page (com botao "minha jornada" + seletor de aparencia + "continuar de onde parei")
├── assets/                       # OPCIONAL: learn.css / learn.js compartilhados (se referenciar por caminho relativo em vez de colar inline)
│   ├── learn.css
│   └── learn.js
└── curso/
    ├── trilha1/
    │   ├── index.html            # Index da trilha (cards de modulos + aneis de progresso)
    │   ├── modulo-1-1.html       # Modulo completo (marcar-lido por secao, TOC+scrollspy, duvida, highlight/nota)
    │   ├── modulo-1-2.html
    │   ├── assets/img/           # Imagens geradas (inemaimg) — hero, thumbs, fundos
    │   └── ...
    ├── trilha2/
    └── ...
```

Toda pagina precisa: `<meta name="inema-course" content="...">` no `<head>`, o **anti-FOUC PRIMEIRO** no `<head>`, `learn.css` (inline ou `<link>` relativo) depois do CSS base, `learn.js` (inline ou `<script src>` relativo) antes de `</body>`, e `INEMA.init()` por ultimo. Quando o curso roda 100% offline em `file://`, prefira **colar tudo inline**.

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

### Camada de aprendizagem (v2) — itens novos #18-#28

17. **ANTI-FOUC PRESENTE**: script bloqueante separado, com try/catch, PRIMEIRO no `<head>` (acima do Tailwind/`learn.css`); seta `.dark` + `data-theme` + classes de leitura antes do primeiro paint; default dark no erro.
18. **IDs/`data-*` ESTAVEIS**: `<meta name="inema-course">` + `data-inema-topic`/`-module`/`-track`/`-block` deterministicos. Mudar o layout NAO quebra o estado.
19. **MARCAR-LIDO ACESSIVEL**: `<button aria-pressed>` com `justify-start` (nao viola #1), Space alterna, estado por icone+texto+cor; persiste boolean, deriva %.
20. **CONTRASTE POR TEMA**: cada par `--text`/`--text-muted` sobre `--bg` passa AA 4.5:1 em TODOS os temas; ambar nunca como texto em superficie clara (so fill/borda).
21. **POPOVER DE SELECAO (TreeWalker)**: highlight via `TreeWalker` (nunca `surroundContents` cego); `quote` sempre gravado; popover posicionado por rect + scroll, fecha fora/selecao vazia.
22. **JORNADA ACESSIVEL**: `role=dialog aria-modal=true`, foco preso, ESC fecha, `inert` no resto, devolve foco ao gatilho; so leitura do estado.
23. **EXPORT/IMPORT ROUND-TRIP LOSSLESS**: import valida schema em var temporaria, merge nao-destrutivo por default, preserva campos desconhecidos; arquivo invalido = no-op.
24. **`scroll-margin-top` NOS ALVOS**: = altura do nav em todos os alvos de topico; `resume()` por ancora de id, nunca `scrollY` cru.
25. **ARIA NOS ACCORDIONS**: `<button aria-expanded aria-controls>` + `id` no painel; estado ARIA acompanha aberto/fechado (mantendo `toggleTopic(this)`).
26. **MODOS EFEMERO/ORFA**: probe de storage no boot → modo efemero + aviso nao-bloqueante se indisponivel (curso segue legivel); nota sem ancora vira orfa (texto preservado, listada na jornada) e nao derruba as outras.
27. **MANIFESTO DO CURSO EM TODAS AS PAGINAS**: `<script type="application/json" data-inema-manifest>` com a estrutura completa (tracks/modules/topics/href) no `<head>` de TODA pagina; `topics` bate com os `data-inema-topic` reais de cada modulo. Sem ele, progresso curso/trilha so conta o modulo da pagina atual e a "minha jornada" nao mostra o curso inteiro.

### Aprendizagem visual e didatica (v2) — itens novos #29-#31

28. **VISUAL-FIRST**: cada conceito-chave do modulo tem apoio visual (SVG inline / inemaimg / hyperframe), uso ILIMITADO — o ≥1 SVG do #17 e piso, nao teto. Toda ilustracao com legenda/`alt` que ensina. Hyperframe (clipe HTML->MP4 ou animacao SVG/CSS inline) sob `prefers-reduced-motion`. Aluno visual entende o modulo so pelos pares visual+legenda.
29. **EXEMPLOS COPY-RUN**: cada modulo pratico tem ≥1 exemplo colavel que roda de verdade (prompt/comando/codigo) com objetivo + bloco + como verificar; partes variaveis marcadas (`<isto voce troca>`).
30. **FUNDAMENTO DEFINE OS TERMOS**: em modulo de fundamento, todo termo tecnico e definido inline na 1a aparicao (estilo "Novo aqui?", com glossario-inline), sem jargao orfao.

## Capa oficial — SEMPRE gerar (via skill `capa-inema`)

Ao terminar de montar o curso, gere a capa 1280×720 chamando a engine da skill `capa-inema`:

```bash
node ~/.claude/skills/capa-inema/assets/gerar-capa.cjs --repo <pasta-do-repo> \
  --title "<título do curso>" --cat "<categoria>"
```

- **Layout default = `split`** (texto à esquerda + imagem à direita). Se o usuário pediu **"capa fb"** (full-bleed), acrescente `--layout fb`.
- Requer o **inemaimg** no ar (`localhost:8000`). A capa é gravada em `<repo>/capa/capa.png`.
- Detalhes, opções e uso em lote: skill `capa-inema`.
