# BASELINE — Skill `formato-curso` (INEMA.CLUB)

> Mapa estruturado do estado atual (baseline) da skill `formato-curso` localizada em
> `/home/nmaldaner/.claude/skills/formato-curso/`. Documento de leitura/analise — nada foi editado na skill.
>
> Arquivos analisados:
> - `SKILL.md` (entrypoint, ~173 linhas)
> - `references/MASTER_COMPLETO.md` (v2.0, ~1137 linhas — fonte de verdade tecnica)
> - `references/DESIGN-SYSTEM.md` (v1.0, vocabulario/filosofia)
> - `references/CHECKLIST_REVISAO.md` (v1.5, QA)
> - `references/SVG-FUTURISTA.md` (biblioteca de diagramas)

---

## 1. O QUE A SKILL FAZ HOJE

A skill e um **design system documental** (nao um gerador de codigo nem um tema CSS empacotado) para
produzir **paginas HTML estaticas de curso** no padrao visual INEMA.CLUB. Saida = HTML self-contained
com **Tailwind via CDN** (`cdn.tailwindcss.com`), dark-mode por classe, sem framework de componentes,
sem build step.

**Tres tipos de pagina** que ela sabe gerar:
1. **Landing principal** (`index.html`) — brand amarelo + N trilhas + metodo + CTA.
2. **Index de trilha** (`curso/trilhaX/index.html`) — header com gradiente + stats + **Mapa da trilha** +
   cards de modulo com topicos expansiveis + modais com iframe.
3. **Pagina de modulo** (`curso/trilhaX/modulo-X-Y.html`) — conteudo denso, 6-8 secoes ricas + resumo final.
   (Variantes secundarias: pagina de **slides** e modulos de **exercicios** `-6` / **prompts** `-7`.)

**Modelo mental**: dark-first (light e override CSS), zero imagens raster no conteudo conceitual
(tudo e texto, SVG inline ou CSS), uma cor de acento por trilha, Inter como fonte unica.

**Fluxo de trabalho prescrito** (SKILL.md):
1. Entender se e trilha ou modulo, qual trilha (define a cor), quantos modulos/topicos.
2. Ler as secoes relevantes do `MASTER_COMPLETO.md` (tabela de roteamento secao→pagina).
3. Construir a partir dos templates do MASTER.
4. Revisar com `CHECKLIST_REVISAO.md`.

**Complemento opcional — `inemaimg`**: servidor local FastAPI (`localhost:8000`, modelo default
`flux2-klein`) para gerar PNGs decorativos (hero/banner/thumbs/texturas). **Nunca** substitui o
SVG inline obrigatorio (erro #17). Aviso de licenca: FLUX.2 e non-commercial; cursos comerciais
usam `qwen-edit-2511` ou `ernie`.

**Referencias vivas** (exemplos canonicos): projeto `opus48` (`curso/trilha4/` para SVGs),
`2cerebro`, `mastercodex`.

---

## 2. COMPONENTES DE UI / MARKUP DEFINIDOS

Inventario completo dos componentes que a skill especifica (com a secao-fonte no MASTER).

### 2.1 Estrutura global / navegacao
| Componente | Descricao | Fonte |
|---|---|---|
| **Base HTML** | Documento completo: `<head>` com Tailwind config (cores `primary`+`dark.900-600`), Inter, bloco `<style>` de light-mode; `<body>` com nav + main + footer + scripts | MASTER 8.1 |
| **Nav global (completo)** | Sticky, `backdrop-blur`, Logo (emoji+nome, yellow) + `\|` + INEMA.CLUB (sky) + 4-6 botoes de trilha (ativa destacada) + theme toggle SVG sun/moon. IDENTICO em todas as paginas | MASTER 5.2 |
| **Theme toggle** | Botao com 2 SVGs (sol/lua), `localStorage`, alterna classe `.dark` no `<html>` | MASTER 5.2 / 9.2 |
| **Breadcrumb** | "Inicio / Trilha X / Modulo X.Y" (so em paginas de modulo) | MASTER 7.6 |
| **Footer** | Borda superior + nome do curso + ano, centralizado | MASTER 8.1 |

### 2.2 Cards e headers
| Componente | Descricao | Fonte |
|---|---|---|
| **Hero gradient (header trilha)** | `bg-gradient-to-br from-COR-900/30` + badge "TRILHA X" + h1 emoji + descricao + **Stats grid 4 col** (Modulos/Topicos/Duracao/Nivel) | MASTER 7.4 |
| **Header de modulo** | Igual, badge "MODULO X.Y" + Stats (Topicos/Minutos/Nivel/Tipo) | MASTER 7.5 |
| **Stat card** | Caixa `bg-dark-800/50` numero grande + label | MASTER 7.4 |
| **Pill / badge** | `inline-block px-3 py-1 rounded-full` ("TRILHA 1") | DESIGN-SYSTEM 7 |
| **Trilha card** (landing) | Card grande clicavel: icone, pill, titulo, descricao | DESIGN-SYSTEM 7 |
| **Module card simples** | Card pequeno clicavel (`<a>`, sem botoes) — grid 2 col no topo do index | MASTER 7.x / CHECKLIST |
| **Card do modulo (detalhado)** | `bg-dark-800 rounded-xl border`, header (X.Y + duracao) + h3 `text-2xl` + topicos expansiveis + botoes a esquerda. `id="modulo-X-Y"` para ancora | MASTER 7.3 |

### 2.3 Topicos / accordions
| Componente | Descricao | Fonte |
|---|---|---|
| **Topic accordion (expansivel)** | `.topic-item` com `<button onclick="toggleTopic()">` + number circle + emoji + titulo + subtitulo; corpo `.topic-explanation` com **3 secoes** (O que e / Por que aprender / Conceitos-chave) | MASTER 7.2 |
| **Number circle (pequeno)** | `w-6 h-6 rounded-full bg-COR-500/20` com numero (NUNCA seta) | MASTER 7.1 |
| **Number circle (grande)** | `w-12 h-12` para secoes de modulo | MASTER 7.1 |
| **Secao de topico (modulo)** | `<section id="topico-N">` number circle grande + h2 emoji + paragrafo + boxes variados, `mb-16` entre secoes | MASTER 7.7 |

### 2.4 Boxes de conteudo (variedade obrigatoria nos modulos)
| Componente | Descricao | Fonte |
|---|---|---|
| **Box Conceito Principal** | `bg-gradient-to-br from-COR-900/30` border COR, titulo + lista bullets | MASTER 7.8 |
| **Box Dados/Pesquisa** | `bg-blue-900/20` border blue, estatisticas | MASTER 7.9 |
| **Box Dica Pratica (tip box)** | `bg-primary/10 border-primary/30` (amarelo) | MASTER 7.10 |
| **Grid Fazer vs Evitar (check/x)** | 2 col: verde `bg-emerald-900/20` (✓) vs vermelho `bg-red-900/20` (✗) | MASTER 7.11 |
| **Timeline** | `space-y-6` + circulo `w-10/12` + card passo a passo | MASTER 7.12 |
| **Box de Alerta** | `bg-red-900/20 border-red-500/30` | MASTER 7.13 |
| **Code block** | `<pre>` fundo `bg-dark-700/50`, `font-mono text-sm` | DESIGN-SYSTEM 7 / MASTER 1.8 |
| **Mock de tela/monitor (HTML, nao SVG)** | Barra de titulo 3 bolinhas + linhas mono; rotular "ilustrativo" | SVG-FUTURISTA 4.8 |

### 2.5 Navegacao de fim / resumo / modal
| Componente | Descricao | Fonte |
|---|---|---|
| **Mapa da trilha** | OBRIGATORIO. h2 `Mapa da trilha` (nome fixo) + grid de cards-ancora `<a href="#modulo-X-Y">`; cada card `justify-between` (X.Y esq + duracao dir), emoji no titulo, subtitulo PUNCHY 3-5 palavras. SEM circulo numerado extra | MASTER 7.4b |
| **Resumo do modulo** | Bloco gradiente final: checklist ✓ do aprendido + "Proximo Modulo" + 2 CTAs (Voltar trilha / Proximo) | MASTER 7.14 |
| **Modal (iframe)** | `<div class="modal hidden ...">` carrega `<iframe src="modulo-X-Y.html">` (conteudo NUNCA duplicado); `openModal`/`closeModal`, fecha no ESC | MASTER 9.3 |
| **Pagina de slides** | `slides-X-X.html`, cards de slide com imagem clicavel (zoom modal), texto rico por slide | CHECKLIST (secao slides) |

### 2.6 SVG futurista (biblioteca ilustrativa)
Biblioteca dedicada (`SVG-FUTURISTA.md`) — diagramas vetoriais inline, cor primaria = cor da trilha,
secundaria = ciano `#38bdf8`, glow contido, grid de pontos, `role="img"`+`aria-label`, animacao so sob
`prefers-reduced-motion: no-preference`. **Defs compartilhados**: gradient, filtro glow (`stdDeviation 1.8`),
pattern grid, markers de seta (cor + ciano).

Catalogo de primitivos:
- **4.1 Fan-out / orquestracao** (A→N→1) — recomendado para HERO.
- **4.2 Escada de degraus** (progressao crescente, custo/nivel).
- **4.3 Profundidade × largura** (2 paineis comparativos).
- **4.4 Malha × solo** (colaboracao × isolamento).
- **4.5 Aninhamento** (caixa-contem-caixas).
- **4.6 Equacao A + B = C**.
- **4.7 Fluxo de decisao** (diamante sim/nao).
- **4.8 Monitor/painel** (mock HTML, nao SVG).

---

## 3. REGRAS CRITICAS (#1-#17) — DEVEM SER PRESERVADAS

Tabela "Erros Criticos — NUNCA Cometer" do SKILL.md (e MASTER secao 1). Estas sao o nucleo
de conformidade da skill — qualquer evolucao precisa mante-las intactas.

| # | Regra | Correto | Errado |
|---|---|---|---|
| 1 | **Botoes** | `justify-start` (esquerda) | `justify-center` |
| 2 | **Indicador de topico** | Numero em circulo `w-6 h-6 rounded-full` | Seta `▶` / `→` |
| 3 | **Secoes por topico** | 3 secoes: O que e / Por que aprender / Conceitos-chave | Menos de 3 |
| 4 | **Link INEMA.CLUB** | Presente em TODAS as paginas, `text-sky-400`, ao lado do logo | Ausente |
| 5 | **Light mode CSS** | Bloco completo: base + cores acento + sem gradiente + especiais + nav (+ Parte 5 bordas dark) | So base, sem cores de acento |
| 6 | **Titulo do modulo** | `text-2xl font-bold` | `text-lg` |
| 7 | **Modal** | `<iframe src="modulo-X-X.html">` | Conteudo duplicado |
| 8 | **Cartoes simples (index)** | `<a>` clicavel sem botoes | Com botoes internos |
| 9 | **Modulos no index** | TODOS com topicos expansiveis | Alguns so header+botao |
| 10 | **Botao "Ver Completo"** | CADA card de modulo tem `<a href="modulo-X-X.html">Ver Completo</a>` | Card sem link |
| 11 | **Qtd de topicos** | MINIMO 6 topicos por modulo | Menos de 6 |
| 12 | **Mapa da trilha no index** | OBRIGATORIO: h2 `Mapa da trilha` + grid cards-ancora (header justify-between, emoji, subtitulo PUNCHY) | "Navegacao Rapida", circulo numerado extra, subtitulo descritivo, ausencia |
| 13 | **Nav completo em todas paginas** | Mesmo nav (logo + INEMA.CLUB + 4-6 trilhas + toggle), trilha ativa destacada | Nav simplificado `← Trilha X \| Curso` |
| 14 | **Profundidade dos modulos** | 500-800 linhas, 6-8 secoes com VARIEDADE (≥2 grids ✓/✗, ≥1 timeline, ≥2 tip boxes, ≥1 code box) | 428 linhas, template repetido 6x |
| 15 | **Bordas suavizadas (dark)** | 2 regras: `.dark .border-dark-600 {#374151}` E `.dark .divide-dark-600 > ...{#374151}` | So border, esquece divide |
| 16 | **Divisor "Conteudo detalhado"** | `<h2 class="text-2xl font-bold mb-6">Conteudo detalhado</h2>` simples | 2 linhas horizontais com span no meio |
| 17 | **SVG futurista ilustrativo** | ≥1 SVG inline por modulo de conteudo + 1 hero SVG por index de trilha (cor trilha + ciano, glow, `role="img"`+`aria-label`, `w-full h-auto`) | Modulo sem ilustracao; SVG hand-drawn; cores fora da paleta; PNG externo |

> Nota: a tabela do SKILL.md lista a regra 10 fisicamente apos a 11 (ordem trocada na fonte), mas
> ambas existem e estao numeradas. Nao ha "#18+".

**Reforco em outras camadas**:
- MASTER 1.1-1.10 detalha cada erro com snippet.
- "Verificacao Final Rapida" do SKILL.md repete os 16 pontos como checklist de saida.
- `CHECKLIST_REVISAO.md` operacionaliza tudo em listas marcaveis (trilha, modulo, slides, JS, CSS, cores).

---

## 4. LACUNAS DIDATICAS / DE "LEARNABILITY"

O que a skill **NAO** oferece hoje para o aluno aprender melhor. (Foco em pedagogia/UX de
aprendizagem, nao em estetica — a estetica ja e forte.)

### 4.1 Acompanhamento de progresso (ausente)
- **Sem barra/percentual de progresso** por trilha ou por curso. O aluno nao ve "quanto falta".
- **Sem marcacao de modulo/topico concluido** (checkbox persistente, check no card). Nada em `localStorage`
  alem do tema.
- **Sem estado "continuar de onde parei"** (resume) / ultimo modulo visitado.
- **Sem indicador visual de "visitado vs nao visitado"** nos cards do Mapa da trilha.

### 4.2 Anotacoes e interacao do aluno (ausente)
- **Sem notas/anotacoes** do aluno por modulo ou topico (highlight, comentario pessoal).
- **Sem marcacao de duvida** ("nao entendi isto" / flag para revisar depois).
- **Sem favoritos / bookmark** de topicos.
- **Sem destaque (highlight) de trecho** de texto.

### 4.3 Verificacao de aprendizagem (parcial/ausente)
- **Sem quiz / auto-avaliacao** interativo. Existe "Resumo do Modulo" (checklist passivo de leitura),
  mas nao ha perguntas que o aluno responda.
- **Sem flashcards / recall ativo** dos "Conceitos-chave".
- **Sem exercicios verificaveis** com feedback (os modulos `-6` de exercicios sao conteudo estatico).

### 4.4 Personalizacao / temas (parcial)
- **So 2 temas** (dark/light), sem mais opcoes (ex.: alto contraste, sepia, tamanho de fonte ajustavel).
- **Sem controle de densidade/tipografia** pelo aluno (a11y: aumentar fonte, espacamento).
- **Cor de acento e fixa por trilha** — nao ha tema/skin alternativo do curso inteiro.

### 4.5 Navegacao e orientacao (parcial)
- **Sem busca** dentro do curso/trilha (encontrar um topico por palavra).
- **Sem "tempo restante" dinamico** (so duracao estatica nos stats).
- **Sem sumario flutuante / TOC lateral** dentro da pagina de modulo (so o Mapa da trilha no index).
- **Sem "proximo/anterior" global** consistente alem dos CTAs do resumo.
- **Sem indicacao de pre-requisitos** entre modulos/trilhas (a ordem cromatica sugere progressao,
  mas nao ha gating nem aviso).

### 4.6 Acessibilidade alem do basico (parcial)
- SVGs tem `role="img"`+`aria-label` e ha `prefers-reduced-motion` — bom baseline.
- **Falta**: foco visivel/keyboard nav nos accordions e modal (trap de foco no modal nao especificado),
  `aria-expanded` nos toggles de topico, skip-link, landmarks ARIA explicitos.

### 4.7 Engajamento / motivacao (ausente)
- **Sem gamificacao leve** (streak, badge de trilha concluida, XP) — coerente com o tom sobrio,
  mas e uma lacuna de "learnability" a considerar.
- **Sem feedback de conclusao** (celebracao discreta ao terminar trilha).

### 4.8 Persistencia / dados
- Unico estado persistido = **tema** (`localStorage`). Nao ha camada de estado de aprendizagem
  (progresso, notas, duvidas) — qualquer feature acima exige introduzir essa camada (provavelmente
  `localStorage`/IndexedDB, mantendo o padrao self-contained sem backend).

---

## 5. ASSETS REUTILIZAVEIS / CONVENCOES

### 5.1 Paleta por trilha (identidade fixa INEMA.CLUB — manter a sequencia cromatica)
| Trilha | Cor | text / bg-20 / border-30 / from-900 (dark) | Light mode (acento) | Psicologia |
|---|---|---|---|---|
| T1 | **Emerald** | `text-emerald-400` `bg-emerald-500/20` `border-emerald-500/30` `from-emerald-900/30` | `#059669` (-600) | crescimento / fundamentos |
| T2 | **Blue** | `text-blue-400` ... `from-blue-900/30` | `#2563eb` (-600) | confianca / disciplina |
| T3 | **Purple** | `text-purple-400` ... `from-purple-900/30` | `#7c3aed` (violet-600) | criatividade / frontend |
| T4 | **Amber** | `text-amber-400` ... `from-amber-900/30` | `#92400e` (**-800**) | energia / backend |
| T5 | **Teal** | `text-teal-400` ... `from-teal-900/30` | `#0d9488` (-600) | fluxo / multiagente |
| T6 | **Rose** | `text-rose-400` ... `from-rose-900/30` | `#9f1239` (**-800**) | conquista / escala |

> Amber e Rose usam `-800` no light mode (ficam neon demais em `-600`).

### 5.2 Cores especiais
| Cor | Dark | Light | Uso |
|---|---|---|---|
| **Primary (Yellow)** | `#FACC15` / `text-primary` | `#a16207` (amber-700) | Logo, CTAs, dicas/tip box |
| **Sky** | `#38bdf8` / `text-sky-400` | `#0369a1` (sky-700) | Link INEMA.CLUB |
| **Red** | `#f87171` / `text-red-400` | — | Erros, "nao fazer", alertas |
| **Ciano (diagramas)** | `#38bdf8` | — | Cor SECUNDARIA dos SVGs (agentes, ramo paralelo) |

### 5.3 Paleta neutra (dark scale customizada no Tailwind config)
`dark-900 #111827` (fundo) · `dark-800 #1f2937` (cards) · `dark-700 #374151` (internos) ·
`dark-600 #4b5563` (bordas — suavizada p/ `#374151` via Parte 5).
Light: body `#f8fafc` (cor SOLIDA, nunca gradiente), `#ffffff`/`#f9fafb`/`#f3f4f6`/`#e5e7eb`.

### 5.4 Tipografia
Fonte unica **Inter** (400-800). Escala: hero `text-4xl/5xl` → secao `text-2xl` → card `text-xl` →
destaque `text-lg` → corpo `text-base` → meta `text-sm` → pill `text-xs`. Pesos: bold(700) titulos,
semibold(600) labels, medium(500) menu, 400 corpo.

### 5.5 Espacamento (multiplos de 4)
`mb-16` entre secoes · `mb-12` antes do resumo · `mb-8` grupos · `mb-6` boxes · `mb-4` menores ·
`p-8` cards · `p-6` boxes · `p-4` menores · `gap-4` stats · `gap-6` comparacao.

### 5.6 JavaScript reutilizavel (3 funcoes nucleo)
- `toggleTopic(button)` — abre/fecha topico, fecha os outros do mesmo modulo (1 aberto por vez).
- Theme toggle — init de icone + `localStorage` + alterna `.dark`.
- `openModal(id)` / `closeModal()` + fechar no ESC + `body.overflow` lock.

### 5.7 Convencoes de projeto / arquivos
```
[curso]/
├── index.html                       # landing
└── curso/
    ├── trilhaN/
    │   ├── index.html               # index da trilha (Mapa + cards)
    │   ├── modulo-N-1.html ...       # modulos (-6 exercicios, -7 prompts)
    │   ├── slides/slides-N-X.html    # opcional
    │   └── assets/img/               # PNGs do inemaimg (decorativo)
    ├── doc/  ref/
```
- Nomes de pagina: `modulo-X-Y.html`. Ancoras: `#modulo-X-Y`, `#topico-N`.
- Mapeamento doc→modulo para slides: `doc/11`→1.1, `doc/12`→1.2, etc.
- Estrutura ideal: 6 trilhas, 6+ modulos/trilha, **min 6 topicos/modulo** (o MASTER 2.1 menciona
  "exatamente 6", mas as regras criticas pedem "minimo 6 / 6-8" — leve tensao a observar).

### 5.8 Filosofia visual (DESIGN-SYSTEM) — principios nao-negociaveis
Dark-first · zero raster no conteudo conceitual · acento por contexto (nunca misturar trilhas numa
pagina) · bordas finas 1px + `rounded-xl` · Inter sem decoracao · hover sutil (so cor de borda/bg,
nunca scale/translate) · espacamento multiplo de 4. **Anti-padroes**: `shadow-2xl`, gradiente sobre
gradiente, animacoes exuberantes (rotate/bounce), Font Awesome/icones raster, stock generico,
`rounded-none`, texto centralizado em paragrafo longo, neon saturado.
**Tom de voz**: direto, brasileiro ("voce"), concreto (numeros/%/R$), sem "coachzinho", sem floreio.

---

## 6. OBSERVACOES PARA EVOLUCAO

- A skill e **100% documental** (markdown que instrui o agente). Nao ha CSS/JS empacotado nem
  componentes reutilizaveis em arquivo — tudo vive como snippet copia-e-cola no MASTER. Uma evolucao
  de "learnability" provavelmente exige introduzir **um bundle JS/CSS de progresso/notas** (ou snippets
  novos no MASTER) sem quebrar o padrao self-contained (Tailwind CDN, sem build).
- O unico estado persistido hoje e o **tema**; qualquer feature de progresso/notas/duvida precisa de
  uma nova camada de `localStorage`/IndexedDB.
- As **regras #1-#17 sao o contrato de conformidade** — toda mudanca deve preserva-las e, se adicionar
  componentes (progresso, quiz, notas, TOC, busca, temas extras), idealmente vira **novas regras
  numeradas (#18+)** com entrada correspondente no `CHECKLIST_REVISAO.md`, mantendo a coerencia da skill.
- A skill irma `revisar-curso` (auditoria) consome o mesmo `CHECKLIST_REVISAO.md` — manter os dois
  documentos em sincronia ao evoluir.

---

_Baseline levantado em 2026-06-14. Somente leitura da skill; nenhum arquivo da skill foi modificado._
