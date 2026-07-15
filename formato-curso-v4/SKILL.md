---
name: formato-curso-v4
description: curso INEMA v4 — PÁGINA ÚNICA (trilha + aulas como views, roteamento por hash), dark editorial COM movimento (cold-open que fisga + corpo de leitura calmo com trilho vivo na margem) e camada de aprendizagem nível 3 com RETENÇÃO. Self-contained, offline, um só estado em localStorage. Use SEMPRE que o usuário pedir para criar, editar ou revisar um curso HTML no estilo v4 — landing, trilha ou aula — e ao mencionar "pratique agora / mão na massa", reflexão/"explique com suas palavras", flashcards do grifo, revisão espaçada, "minha jornada", teste-se com feedback, mapa da aula, preferências de leitura (Aa), glossário, onboarding, temas dark/papel/sépia, "página única", "formato de curso v4". Rompe com o v1/v2 (dark âmbar) e com o papel-first do v3, costurando os dois.
---

# Formato Curso v4 — INEMA (página única, dark editorial com retenção)

O v4 é a página de curso que **fisga e é gostosa de estudar**. Costura o que o v1/v2 e o v3 acertaram: **atração na entrada** (cold-open com "uau") + **leitura calma no corpo** (serifa, coluna medida, profundidade na margem) + **camada de aprendizagem nível 3 com retenção** (teste-se, flashcards do grifo, revisão espaçada, pratique-agora, reflexão). Tudo **self-contained**: 1 documento HTML, fontes via CDN, `aula.css`/`curso.js` por caminho relativo, sem build, sem backend, abre em `file://`.

## Referência obrigatória

**SEMPRE leia `references/V4-DESIGN.md` antes de criar ou editar.** É a fonte-de-verdade do design language: tese e princípios (P1–P6), tokens (ink `#0E0D14` · creme `#ECE6D9` · acento água-menta `#7CE0C6` · âmbar `#F2B45C` só figuras), tipografia (Newsreader serif / Inter sans / Space Mono), a arquitetura do blend (cold-open + corpo de margem viva), a camada nível 3 e o checklist de aceitação. Esta SKILL.md é o **contrato de markup**; o V4-DESIGN.md tem o **porquê**.

Exemplo vivo completo (5 aulas, todas as features): `../demo4/curso.html` (+ `demo4/landing.html`). Publicado em `https://inematds.github.io/cchooks/`.

## Por que PÁGINA ÚNICA (constraint que definiu a arquitetura)

Preview web / `file://` **isolam o `localStorage` por página** — cada arquivo é uma origem separada. Multi-página (trilha.html + aula-N.html), o progresso não cruza. Solução: **tudo num só `curso.html`** — trilha e aulas viram `<section class="view">`, roteamento por **hash** (`#trilha`, `#aula-1`…`#aula-N`), **um só estado**. Assim o progresso aparece na hora, robusto a qualquer preview.

## Os dois assets (assets/) — o que é AUTOMÁTICO vs AUTORADO

| Arquivo | O que é |
|---|---|
| **`assets/aula.css`** | Tokens + 3 temas (`data-theme` papel/sépia + default dark), estilos de tudo: bar/subnav, cold-open, `.layout` (coluna + trilho), `.step`, figstage, quiz, pratique, painéis, editor de cartão, prefs, glossário, reflexão, recap, mapa, a11y. |
| **`assets/curso.js`** | Motor SPA. **Injeta** a mobília (grain, barra de progresso, toolbar de grifo, painéis jornada/revisar, editor de cartão, popover de prefs, welcome, região aria-live). **Auto-liga**: roteador, progresso na trilha, marcar-lido, teste-se, trilho vivo (IntersectionObserver), grifo→flashcard, revisão espaçada (SM-2-lite), jornada, export/import, temas, **preferências de leitura, mapa da aula, onboarding, atalhos de teclado, foco/aria-live, copiar em todo `<pre>`, reflexão por seção, recap por aula**. |

**Chave de estado por curso:** o motor lê `<meta name="curso" content="ID-UNICO">`. Cada curso usa um ID próprio (ex.: `content="meucurso"`) → estado isolado. O mesmo ID vai no script anti-flash do `<head>`.

**O motor AUTO-INJETA (não escreva no HTML):** `.grain`, `.prog`, `#seltb`, `#scrim`, `#jornada`, `#revisar`, `#cedit`, `#prefs`, `#welcome`, `#routestatus`. E injeta por seção: o campo de **reflexão**; por aula: o **recap** e o **mapa**; em todo `<pre>`: o botão **copiar**. Você fornece só a **estrutura de conteúdo** abaixo.

## Contrato de markup (o que VOCÊ escreve)

### Esqueleto do documento
`<head>`: `<meta name="curso" content="ID">` (antes das fontes) · fontes Google (Newsreader+Inter+Space Mono) · `<link rel="stylesheet" href="assets/aula.css">` · script anti-flash lendo a mesma meta. `<body>`: a barra, as views, e `<script src="assets/curso.js">` no fim. Veja `assets/curso-template.html`.

### Barra (chrome global, estática)
```
<div class="bar"><div class="bar-inner">
  <span class="brand"><a class="mark" href="https://inema.club" ...>INEMA.CLUB</a><a class="pro" href="https://inema.pro" ...>PRO</a><a class="course" href="landing.html">Nome do curso</a></span>
  <a class="back" href="#trilha" style="display:none">← trilha</a>
  <button id="pill" class="pill" style="display:none">0 lido</button>
  <button id="revbtn">revisar <span id="revn">0</span></button>
  <button id="jorbtn">jornada</button>
  <button id="helpbtn" aria-label="Como funciona">?</button>
  <button id="prefsbtn" aria-label="Preferências de leitura">Aa</button>
  <button id="themebtn">tema: escuro</button>
</div><div class="subnav"><div class="subnav-inner"> ...chips de trilhas... </div></div></div>
```
`.back` e `#pill` começam com `display:none` (o motor mostra na aula, esconde na trilha).

### View da trilha — `<section class="view" id="v-trilha">`
Hero (`.t-hero`), e os cards de aula: um `<a class="au on" data-aula="N" href="#aula-N">` por aula, contendo `.num`, `<h3>`, `<p>`, `<div class="prog"><i></i></div>` e `<div class="meta">…</div>`. O motor pinta `.prog i` (largura via `scaleX`) e o texto do `.meta` a partir do progresso.

### Views de aula — `<section class="view" id="v-aula-N" data-aula="N">`
Uma por aula. Contém, nesta ordem:
1. **Cold-open** `<header class="hero"><div class="hero-inner">` — kicker (mono), `<h1>` serifão com `<em>` acento, `.lead`, `.cue` "↓ role para estudar", `.herofig` (SVG). Fit ~1 tela.
2. **Corpo** `<div class="layout">`:
   - `<div class="col">` com os `<section class="step" data-fig="K">` (uma ideia cada). Cada step: `<h2><span class="n">0K</span> Título</h2>`, prosa (`<p>`, `<ul><li>`, `<pre>`, `<details>`), `<div class="mobfig" data-mobfig="K"></div>`, opcional `.quiz`, e `<button class="readbtn" data-read="sK">marcar como lido</button>`. **Não** ponha ids nos steps (evita duplicados). Opcional: um `.practice` (pratique) e nada mais — o recap é injetado depois.
   - `<aside class="rail"><div class="railsticky"><div class="figstage">` com `<div class="fig[ on]" data-fig="K" data-cap="<b>Fig.</b> legenda">…SVG…</div>` (o `on` no fig 1). Depois `<p class="railcap"></p>`, `<div class="steps-ind"></div>` (o motor preenche), e `<p class="sidenote">…</p>`. O **mapa da aula** é injetado aqui.
3. **Navegação** `<nav class="lnav">` (← anterior / próxima →, via hash) e `<footer>`.
4. **Cartões do autor:** `<script type="application/json" id="cards-N">[{"front":"…","back":"…"}, …]</script>` (N = data-aula).

### Teste-se (quiz) — dentro de um step
```
<div class="quiz" data-answer="b">
  <p class="qk">Teste-se</p><p class="q">Pergunta?</p>
  <button class="opt" data-k="a">errada</button>
  <button class="opt" data-k="b" data-fb="Por que esta é a certa.">certa</button>
  <button class="opt" data-k="c">errada</button>
  <p class="qfb"></p>
</div>
```
Ponha **`data-fb` na opção certa** (feedback elaborado — o motor mostra o porquê ao acertar E ao errar). Opcional: `data-fb` nas erradas (explica o engano).

### Pratique agora (mão na massa) — no fim do `.col` da aula
```
<section class="practice" data-practice="pN">
  <p class="pk">Pratique agora <span class="pcount">0/4 feito</span></p>
  <h3 class="ph">Título da tarefa</h3>
  <p class="pgoal">Meta + tempo + "é seguro".</p>
  <div class="pcodewrap"><button class="pcopy" type="button">copiar</button><pre class="pcode">…código LIMPO, colável (sem // comentário se for JSON)…</pre></div>
  <ol class="psteps">
    <li><label><input type="checkbox" data-ptask="1"> Passo verificável.</label></li> … </ol>
  <p class="pdone">✓ Fechamento: o que você acabou de provar.</p>
</section>
```
Passos **verificáveis na máquina** (o aluno vê acontecer). Estado salvo; ao marcar tudo, revela `.pdone`.

### Glossário — inline, sob demanda
`<span class="gterm" tabindex="0" data-def="Definição curta.">termo</span>` (ou num `<b>`). Mostra a definição no hover/foco. Puro CSS.

### NÃO precisa escrever (o motor faz)
Reflexão por seção · recap de fim de aula · botão copiar nos blocos · mapa da aula · onboarding · prefs de leitura · atalhos · foco/aria-live · barra de progresso · painéis.

## Landing (página separada)
`landing.html` é uma página normal (hero + grid de trilhas), **auto-contida** (estilos inline), que aponta os CTAs para `curso.html#trilha`. Não usa o motor.

## Regras self-contained
- 1 `curso.html` + `assets/aula.css` + `assets/curso.js`. Zero raster (motion/figuras em CSS/SVG). Fontes via Google Fonts CDN com fallback.
- Contraste AAA do texto em todos os temas; acento saturado nunca vira texto de corpo em superfície clara.
- Todo movimento morre sob `prefers-reduced-motion` preservando o estado final.
- Publicar: repo próprio + GitHub Pages, com `index.html` (redirect → landing) e `.nojekyll`.

## Passo a passo para um curso novo
1. Leia `references/V4-DESIGN.md`. Defina trilha → aulas → seções (uma ideia por seção).
2. Copie `assets/` e o `assets/curso-template.html` como base do `curso.html`. Troque `<meta name="curso">` por um ID único.
3. Por aula: escreva os steps (h2+prosa+mobfig+quiz+readbtn), as `.fig` do trilho (SVG conceitual + `data-cap`), um `.practice`, e o `<script id="cards-N">`.
4. Ponha `data-fb` na opção certa de cada quiz; marque termos-chave com `.gterm[data-def]`.
5. Escreva a `landing.html` apontando para `curso.html#trilha`.
6. Valide no browser: progresso aparece na trilha, pratique/reflexão/recap presentes, temas AAA, `file://` ok, reduce-motion preserva estado.

## Checklist de aceitação
1. Cold-open cabe em ~1 tela. 2. Corpo lê calmo (≤60ch, serifa). 3. Trilho troca a fig certa por seção + mapa nomeado. 4. Progresso instantâneo na trilha (página única). 5. Teste-se com feedback elaborado. 6. Grifo → editor de cartão → revisão espaçada. 7. Pratique-agora verificável por aula. 8. Reflexão por seção salva. 9. Recap dispara revisão da aula. 10. Prefs de leitura (Aa), glossário, onboarding, mapa, atalhos, a11y (foco+aria-live) ligados. 11. Contraste AAA nos 3 temas. 12. Offline em `file://`, estado por `<meta name="curso">`.

## Capa oficial — SEMPRE gerar (via skill `capa-inema`)

Ao terminar de montar o curso, gere a capa 1280×720 chamando a engine da skill `capa-inema`:

```bash
node ~/.claude/skills/capa-inema/assets/gerar-capa.cjs --repo <pasta-do-repo> \
  --title "<título do curso>" --cat "<categoria>"
```

- **Layout default = `split`** (texto à esquerda + imagem à direita). Se o usuário pediu **"capa fb"** (full-bleed), acrescente `--layout fb`.
- Requer o **inemaimg** no ar (`localhost:8000`). A capa é gravada em `<repo>/capa/capa.png`.
- Detalhes, opções e uso em lote: skill `capa-inema`.
