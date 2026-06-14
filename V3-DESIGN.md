# V3-DESIGN — Design Language do formato-curso INEMA v3

> **Tese norte:** SIMPLICIDADE RADICAL + CONTEUDO PROFUNDO.
> Leitura-primeiro, calma, foco. A profundidade aparece SEM poluir — por **camadas
> sob demanda** (sidenotes de margem, divulgacao progressiva, "indo mais fundo",
> definicoes inline), nunca por densidade visual simultanea.
> Auto-contido: **1 `.html`**, Google Fonts/Tailwind via CDN, JS inline opcional,
> sem build, sem backend, abre em `file://`.

**Status:** especificacao de direcao (design language). A base tecnica do rail de
margem e da cor de papel ja existe em `mockups/editorial-textbook.html` — o v3
formaliza, calibra e estende esse caminho.

---

## 0. Resumo executivo (8-12 linhas)

O v3 rompe com o "dashboard de curso" e vira uma **pagina de leitura editorial**: a
pagina de aula ja **abre parecendo um reader-mode** (Safari Reader / Gwern), nao um
painel. Trocamos o **dark premium ambar/ciano + Inter + chips de stat + 3 barras de
progresso** por **papel quente tingido** (nunca branco/preto puros), um par
**display-serif + body-serif com caracter** (Spectral + Source Serif 4, fora do
Inter generico) e **um unico acento de tinta** reservado a estados, nunca a
decoracao. A estrutura e uma **coluna unica de leitura de 62-70ch** com **margem
larga a direita** — e essa margem liberada que VIRA a camada de profundidade
(sidenotes a la Tufte, CSS puro, zero JS). Cada secao carrega **uma ideia por tela**
(uma figura por ideia, estilo ciechanow.ski / 3Blue1Brown): fenomeno/visual ->
intuicao -> formalizacao, e o detalhe formal **desce** para a margem ou para um
`<details>` "indo mais fundo". A profundidade e **iceberg**: superficie calma,
detalhe dobrado, revelado so quando o leitor pede (Nielsen, progressive disclosure).
A camada de aprendizado e **minima e calma**: um marcador de percurso silencioso
("N de M", estilo mastery do Khan, nao 3 barras), "marcar lido", "duvida" e "nota"
ancoradas na margem (nao em modal/drawer), tudo em `localStorage`. **Zero
gamificacao** (sem streak/XP/badge — anti-Duolingo). Premium nasce da **quietude**,
nao do enfeite (MasterClass): muito respiro, tipografia como protagonista, cor que
quase nao aparece. Acessibilidade e embutida, nao enxerto: toggle para **Atkinson
Hyperlegible**, `prefers-reduced-motion`/`prefers-color-scheme` respeitados.

---

## 1. Tese e os 5 principios v3

Cada principio nomeia a tecnica concreta (nao "mais blocos") e a fonte que o ancora.

### P1 — Reading-mode como DEFAULT, nao modo extra
A pagina de aula abre **ja** como uma coluna unica de leitura, papel quente, serif de
corpo, controles minimos e familiares (tema, tamanho, fonte). Um tema escuro, se
existir, e **apenas mais um tema**, nunca a base. Calma vem do **layout quieto**
(poucos elementos, tipografia generosa), nao de esconder o chrome — navegacao e "indo
mais fundo" permanecem sempre **descobriveis** (anti zen-mode dogmatico).
- *Inspira:* Safari Reader Mode — https://support.apple.com/guide/safari/ ·
  iA, "Web Design is 95% Typography" — https://ia.net/topics/the-web-is-all-about-typography-period ·
  contrapeso: NN/g, "Why Zen Mode Isn't the Answer to Everything" — https://www.nngroup.com/articles/zen-mode/

### P2 — Uma ideia por tela = uma figura por ideia
Cada secao isola **um** conceito e, no maximo, **uma** figura/metafora visual forte. A
sequencia interna e sempre **fenomeno/visual concreto -> intuicao em palavras simples
-> formalizacao** (a formalizacao pode morar na margem ou na camada sob demanda).
Densidade de **pensamento** no lugar de densidade visual — isso elimina chips de
stat, 3 barras e muros de texto.
- *Inspira:* Bartosz Ciechanowski — https://ciechanow.ski/ ·
  3Blue1Brown — https://www.3blue1brown.com/ ·
  Just JavaScript (Dan Abramov) — https://justjavascript.com/

### P3 — Profundidade por CAMADAS sob demanda (iceberg), nunca por densidade
A coluna central fica **enxuta**. Nuance, definicao, citacao, exemplo extra, fonte e
"por que" vivem em camadas reveladas **quando o leitor pede**: sidenote na margem
(desktop), toggle inline (mobile), `<details>` "indo mais fundo" para blocos maiores.
O default **ja conta a historia**; o aprofundamento e **opt-in**. Regra de ouro:
**nunca esconder o essencial** — esconder o que se usa com frequencia so realoca a
complexidade. Limitar a poucas camadas (1-2 niveis); alem disso, **reorganizar** o
conteudo, nao aninhar.
- *Inspira:* NN/g, "Progressive Disclosure" (Nielsen, 2006) — https://www.nngroup.com/articles/progressive-disclosure/ ·
  Gwern, "Design Of This Website" (iceberg / semantic zoom) — https://gwern.net/design ·
  Stripe Docs (layered UX) — https://docs.stripe.com/

### P4 — Sidenotes de margem como motor da divulgacao progressiva (CSS puro)
A largura de linha restrita **cria** a margem; a margem **vira** a camada de detalhe.
A nota secundaria mora **ao lado** do trecho que referencia (mesma altura), fora do
caminho do olho — nunca em footnote, popover, drawer ou modal. No mobile colapsa para
**inline expansivel** abaixo do paragrafo (toggle por simbolo), **sem JavaScript**
(checkbox-hack + `<label>`, acessivel por teclado). Cabe em 1 `.html`.
- *Inspira:* Tufte CSS — https://edwardtufte.github.io/tufte-css/ ·
  Gwern, "Sidenotes In Web Design" — https://gwern.net/sidenote ·
  `<details>`/`<summary>` nativo — https://web.dev/learn/html/details/ · https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details

### P5 — Distintividade por tipografia + ilustracao + ritmo, nao por cromo escuro
A assinatura memoravel vem do **par display-serif + body-serif**, da **ilustracao
autoral sobria** (uma por ideia) e do **ritmo calmo** (respiro abundante, sem
urgencia, sem placar). Papel quente, paleta monocromatica + um acento. Romper com o
dark ambar/ciano **nao** custa o ar premium — premium e **menos elementos, mais
respiro**. Subtitulos **descritivos** e distintos sao a 1a camada de leitura
(layer-cake), o paragrafo e a 2a.
- *Inspira:* Quanta Magazine — https://www.quantamagazine.org/ ·
  MasterClass (premium = quietude) — https://masterclass.com ·
  NN/g, "The Layer-Cake Pattern of Scanning" (Pernice, 2019) — https://www.nngroup.com/articles/layer-cake-pattern-scanning/

---

## 2. Tokens

Cor em **OKLCH** (espaco perceptual: lightness previsivel, croma controlado). **Nada
de `#000` / `#fff` puros** — papel tingido quente e tinta quente quase-preta (rebaixa
o contraste agressivo, padrao Tufte/Safari sepia). Hex listado como fallback para
quem precisa colar rapido; o token-fonte e o OKLCH.

### 2.1 Cor — tema CLARO (default, "paper")

Paleta **monocromatica quente + UM acento de tinta** reservado a estado/figura. O
acento quase nunca aparece.

| Token | OKLCH | ~hex | Uso |
|---|---|---|---|
| `--paper` | `oklch(0.971 0.012 86)` | `#f4efe4` | Fundo da pagina (papel quente, nunca branco) |
| `--paper-raised` | `oklch(0.985 0.010 86)` | `#faf6ec` | Superficie levemente elevada (cartao raso) |
| `--paper-margin` | `oklch(0.962 0.012 88)` | `#efe8da` | Gutter da margem (levemente distinto) |
| `--paper-deep` | `oklch(0.935 0.014 86)` | `#ece5d6` | Borda de pagina / sombra de papel |
| `--ink` | `oklch(0.255 0.012 70)` | `#26211b` | Tinta de corpo (quase-preta, quente) |
| `--ink-soft` | `oklch(0.455 0.012 70)` | `#5b5347` | Texto secundario |
| `--ink-faint` | `oklch(0.610 0.013 75)` | `#8a8073` | Metadados, rotulos, "N de M" |
| `--rule` | `oklch(0.855 0.012 82)` | `#d8cfbc` | Hairline 1px (regras, divisores) |
| `--rule-soft` | `oklch(0.900 0.011 84)` | `#e3dccb` | Regra ainda mais leve |
| `--accent` | `oklch(0.385 0.075 255)` | `#243a63` | **Acento unico**: figura/codigo, estado "duvida", link foco. Reservado. |
| `--accent-soft` | `oklch(0.470 0.070 258)` | `#3a527e` | Variante do acento (hover/segundo nivel) |
| `--accent-wash` | `oklch(0.945 0.010 80)` | `#e7e2d8` | Fundo de bloco do acento, **usado muito raramente** |
| `--mark` | `oklch(0.560 0.105 35)` | `#7a2230` | Oxblood: "nao fazer"/atencao (raro, semantico) |
| `--highlight` | `oklch(0.905 0.105 100)` | `#f0e08c` | Marca-texto editorial (sobre 1 termo, nao paragrafos) |

**Regra de cor:** a cor tem **um proposito funcional** por vez (destacar figura/codigo,
sinalizar UM estado). Nunca decoracao. O default visivel e **monocromatico**.

#### Acento por trilha (substitui as 6 cores neon do v2)
A trilha **nao** colore a pagina inteira. Identidade de trilha = **rotulo + 1 filete +
o tom de `--accent`** girado em **hue** (croma baixo, lightness travada ~0.39). Some
um fio, nao um banho de cor.

| Trilha | OKLCH (accent) | ~hex | Hue |
|---|---|---|---|
| T1 Fundamentos | `oklch(0.40 0.07 150)` | `#2f5641` | verde |
| T2 Disciplina | `oklch(0.40 0.07 255)` | `#243a63` | azul (default) |
| T3 Frontend | `oklch(0.40 0.07 300)` | `#43345e` | violeta |
| T4 Backend | `oklch(0.40 0.07 70)` | `#54442a` | ocre |
| T5 Multiagente | `oklch(0.40 0.07 200)` | `#1f4a52` | teal |
| T6 Escala | `oklch(0.40 0.07 20)` | `#5e3334` | oxblood |

### 2.2 Cor — tema SEPIA e tema ESCURO (opcionais, 1 toggle)
Tres temas no mesmo conjunto minimo de controles do reader-mode. **Escuro NAO e a
base** — e so mais um tema, e NAO volta a ser o dark premium ambar/ciano do v2.

- **Sepia:** `--paper oklch(0.945 0.030 75)` (~`#efe2cc`), `--ink oklch(0.290 0.020 60)`.
- **Escuro (calmo, sem ambar):** `--paper oklch(0.245 0.010 70)` (~`#211f1c`),
  `--paper-raised oklch(0.285 0.010 70)`, `--ink oklch(0.900 0.008 80)` (~`#e6e2da`,
  off-white quente, **nunca** `#fff`), `--accent oklch(0.700 0.060 255)`.
  Contraste rebaixado de proposito; zero glow.

### 2.3 Tipografia
Par com **caracter**, fora do Inter. Display-serif para titulos, body-serif de
leitura para corpo, mono para codigo/rotulos.

| Papel | Familia | Fallback | Pesos | Por que |
|---|---|---|---|---|
| **Display** | **Spectral** | Georgia, serif | 300-700 + italico | Serif de display com contraste e personalidade editorial (estilo Quanta) |
| **Corpo** | **Source Serif 4** | Georgia, serif | 400/500/600 + italico | Serif de leitura otica-variavel, confortavel para sessao longa |
| **Mono / rotulo** | **IBM Plex Mono** | ui-monospace | 400/500 | Codigo, kicker, metadados, "N de M", letterspacing em rotulos |
| **A11y (toggle)** | **Atkinson Hyperlegible** | sans | 400/700 | Modo legibilidade maxima; OFL permite embutir |

```html
<link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

**Numeros duros (Butterick — travar como teste de qualidade, nao gosto):**
- corpo **18-19px** (faixa 15-25)
- line-height **1.62-1.70** (faixa 120-145%)
- **measure 62-70ch** (alvo da tese; dentro de 45-90). E essa restricao que libera a margem.

```css
:root{
  --serif-disp:"Spectral",Georgia,serif;
  --serif-body:"Source Serif 4",Georgia,serif;
  --mono:"IBM Plex Mono",ui-monospace,monospace;
  --measure: 66ch;        /* 62-70ch */
  --leading: 1.66;
  --size-body: clamp(1.05rem, 0.6rem + 0.7vw, 1.18rem);
}
.column{ max-width: var(--measure); }
body{ font-family:var(--serif-body); font-size:var(--size-body);
  line-height:var(--leading); color:var(--ink); background:var(--paper); }
```

**Craft tipografico (baixo custo, alto sinal — anti "IA-default"):** aspas curvas,
travessao (—) != hifen, **um unico** estilo de enfase (bold OU italico, nunca juntos,
nunca sublinhar exceto links), **espaco entre paragrafos OU indent** (nunca os dois),
all-caps so abaixo de 1 linha com leve letterspacing. Links: sublinhado discreto que
basta; **nao** mudar de cor no hover.

### 2.4 Escala tipografica (editorial, hierarquia por TAMANHO/PESO, nao por cor)
Escala ~1.25 (major third), ancorada no corpo.

| Nivel | Tamanho | Familia | Uso |
|---|---|---|---|
| Kicker | 0.72rem, `0.22em` tracking, caps | mono | rotulo de secao/modulo |
| h1 / titulo de aula | `clamp(2.0rem, 1.2rem+2.4vw, 3.0rem)` | display | abertura |
| h2 / secao | `clamp(1.5rem, 1.1rem+1.2vw, 1.95rem)` | display | "uma ideia" |
| h3 / subtitulo descritivo | 1.22rem, peso 600 | display | **1a camada de leitura** (layer-cake) |
| corpo | `--size-body` | body | 2a camada |
| sidenote / nota de margem | 0.85rem, line-height 1.45 | body | camada de profundidade |
| legenda / metadata | 0.78rem | mono | figura, "X min de leitura", "N de M" |

### 2.5 Espaco (ritmo calmo, respiro abundante)
Base **8px**. O respiro e o que faz a profundidade caber sem peso.

```
--s1 4 · --s2 8 · --s3 12 · --s4 16 · --s5 24 · --s6 32 · --s7 48 · --s8 64 · --s9 96
```
- Gap entre paragrafos: `--s5` (24px).
- Gap entre secoes ("uma ideia por tela"): `--s9` (96px) — cada secao **respira**.
- Padding lateral mobile: `--s5`. Desktop: a coluna + rail somam ~1100-1180px max.
- Grid de leitura (desktop): `grid-template-columns: minmax(0, var(--measure)) clamp(220px, 26vw, 320px)` — **coluna de leitura + rail de margem**.

### 2.6 Elevacao (minima — papel, nao material)
Premium = quietude. Quase **sem sombra**; profundidade vem de **hairlines** e do tom
do papel, nao de drop-shadow.

- **Nivel 0 (corpo):** sem sombra, sem borda. O default.
- **Nivel 1 (figura/aside/callout):** `1px solid var(--rule)` + fundo `--paper-raised`. Sombra opcional `0 1px 0 var(--paper-deep)` (filete de papel, nao glow).
- **Nivel 2 (nav sticky):** hairline inferior `1px var(--rule)` + leve `backdrop` no fundo papel. Sem blur pesado, sem dark glass.
- **Raio:** `--radius: 4px` (editorial, quase reto). Nada de `rounded-xl` generico.
- **Foco-visivel:** outline `2px var(--accent)` offset 2px (acessivel, sobrio).

---

## 3. Modelo de LEITURA + PROFUNDIDADE (o coracao do v3)

Como o conteudo profundo aparece **sem poluir**. Cinco mecanismos, todos
self-contained, a maioria **sem JS**.

### 3.1 Layout-base: coluna de leitura + rail de margem
```
┌──────────────────────────────────────────────┐
│ kicker · titulo (display)                      │
│                                                │
│  [ coluna de leitura 62-70ch ]   [ margem ]    │
│   paragrafo calmo, 1 ideia    →   sidenote     │
│   subtitulo descritivo            figura peq.   │
│   paragrafo                       "ver fonte"   │
│                                                │
│   [ figura grande: 1 por ideia, no fluxo ]     │
│                                                │
│   ▸ Indo mais fundo (<details>)                │
└──────────────────────────────────────────────┘
```
A largura restrita da coluna **cria** o rail. No mobile o rail desmonta e as notas
viram inline expansivel.

### 3.2 Sidenotes / notas de margem (Tufte, CSS puro)
- Aside curto **ancorado ao lado** do paragrafo que referencia (mesma altura),
  via margem/posicionamento — **sem footnote, sem popover**.
- **Colapso mobile sem JS** (copiar verbatim o padrao Tufte):
  `<input type="checkbox" class="margin-toggle">` + `<label>` com simbolo clicavel;
  em `@media (max-width: 1080px)` a `.sidenote/.marginnote` vira `display:none` e
  `:checked + .sidenote` vira `display:block` inline. Acessivel por teclado via label.
- Conteudo tipico do rail: glosa, citacao curta, "por que isto importa", **duvida** e
  **nota do aluno** (camada de aprendizado — secao 4).

### 3.3 "Indo mais fundo" — divulgacao progressiva por `<details>`
- Caminho-feliz **calmo e visivel** no corpo; edge cases, prova, derivacao, referencia
  densa ficam **dobrados** em `<details><summary>Indo mais fundo</summary>…`.
- Nativo, acessivel por teclado/leitor de tela, **sem JS**, suportado desde 2020.
- A **mesma pagina** serve iniciante (le o corpo e segue) e avancado (abre as camadas)
  — layered UX (Stripe). **Maximo 1-2 niveis**; mais que isso, reorganizar.

### 3.4 Definicao inline (glossario sob demanda)
- O termo fica **limpo** no texto; a definicao **curta** aparece sob demanda, junto ao
  gatilho (sidenote, ou `<details>`/`<dfn>` com toggle), acessivel a teclado e leitor
  de tela. E a camada de profundidade **mais leve** — *information scent*: a pista no
  texto deixa o leitor decidir se aprofunda **sem sair do fluxo**.
- *Fonte:* NN/g, "Information Scent" — https://www.nngroup.com/articles/information-scent/

### 3.5 Foco da secao atual (calmo, sem pulse) + reading time
- **Foco** (estilo iA Focus, opcional, respeitando `prefers-reduced-motion`):
  esmaecer levemente o que **nao** e a secao/paragrafo atual — calmo, **sem** pulse
  nem animacao chamativa. Substitui medidores competindo.
- **Reading time:** rotulo `X min de leitura` (palavras / ~225 wpm) — microcopy de
  respeito ao tempo, calculo trivial inline. *Fonte:* Craig Abbott —
  https://www.craigabbott.co.uk/blog/2016/how-to-calculate-reading-time-like-medium/
- **Recall ativo embutido (sem motor):** quando couber, "**pare e preveja antes de
  revelar**" (Just JavaScript) antes da resposta; e um **knowledge check** curto ao
  fim da aula (3-4 perguntas de auto-checagem, estilo Odin) — leitura passiva vira
  pratica ativa, **sem gamificacao**.
  *Fontes:* https://justjavascript.com/ · https://www.theodinproject.com/

### 3.6 Sequencia de cada secao (contrato de conteudo)
1. **Visual/fenomeno concreto** (uma figura) ->
2. **Intuicao** em palavras simples (corpo enxuto) ->
3. **Formalizacao/detalhe** -> que **desce** para a margem (sidenote) ou para o
   `<details>`. Nunca tudo na cara de uma vez (3Blue1Brown / ciechanow.ski).
**Separar generos:** o "porque" (explainer calmo) vem **antes e separado** do "como"
(passo a passo); referencia densa e **camada a parte**, nunca no meio da narrativa
(MDN). Cada modulo abre com **3-4 objetivos** ("o que voce vai entender").

---

## 4. Camada de aprendizado reimaginada — MINIMA

Coerente com a simplicidade radical: **calma, ancorada no texto, sem ansiedade**.
Persistencia em **`localStorage`** (o curso abre `file://`, sem backend). Tudo e
**progressive enhancement**: a aula le perfeita com JS desligado.

### 4.1 Progresso — silencioso e acionavel (mata as 3 barras)
- **NAO** ha 3 barras, nem anel, nem percentual gritante, nem chips de stat.
- **Um** marcador discreto de percurso: rotulo `N de M` (mono, `--ink-faint`) + uma
  **grade silenciosa de quadradinhos** por modulo/aula (estilo *mastery* do Khan):
  visao de profundidade sem barra, sem texto gritante.
- **UMA proxima acao clara** por tela ("continuar -> proxima aula"). Engajamento por
  **clareza** ("onde estou / o que faco agora"), nao por contagem.
- *Fonte:* Khan Academy (mastery grid) — https://khanacademy.org

### 4.2 Marcar lido
- Um **check sobrio** ao fim da aula ("Marcar como lida"). Alterna o quadradinho da
  grade de percurso. Sem confete, sem som, sem streak.

### 4.3 Duvida — ancorada na margem
- O aluno marca um trecho e abre uma **duvida** que vive na **margem** (rail), ao lado
  do ponto exato — **nao** em modal/drawer. Usa o **acento** (`--accent`) como UNICO
  estado colorido da pagina. Persistida local; reaparece ao reabrir.

### 4.4 Nota
- **Nota** do aluno tambem na **margem**, no mesmo rail dos sidenotes — onde se le,
  fora do caminho do olho. Sem painel lateral separado competindo. No mobile: inline
  expansivel sob o paragrafo.

### 4.5 O que **fica de fora** (deliberado)
- **Zero gamificacao:** sem streak, XP, badge, leaderboard, placar (anti-Duolingo —
  produzem pressao e poluicao, o oposto de calma/foco).
- **Sem motor de exercicios, sem quiz pontuado, sem backend.** Recall e por
  "pare e preveja" + knowledge check estatico (4.x acima).
- **Onboarding contextual:** nada de manual no topo; dica/definicao aparece **no
  momento do uso**, mantendo a tela inicial limpa (Duolingo, so o que sobrevive
  estatico).
- *Fontes:* Duolingo (granularidade SIM, ansiedade NAO) — https://duolingo.com ·
  Brilliant (uma ideia por vez, detalhe sob demanda) — https://brilliant.org

---

## 5. O que muda vs v2 — e por que rompe

| Eixo | **v2 (atual)** | **v3** | Por que rompe |
|---|---|---|---|
| **Base de cor** | Dark premium `#111827`, body | **Papel quente** `oklch(0.971…)` (~`#f4efe4`), claro/sepia/escuro | Reading-mode como default; rebaixa contraste agressivo (Tufte/Safari). Escuro vira so 1 tema. |
| **Acento** | Ambar `#FACC15` + ciano `#38bdf8` (glow, banho de cor) | **Um** acento de tinta `oklch(0.385 0.075 255)`, reservado a estado/figura | Cor = 1 proposito funcional, nunca decoracao. Calma vem da ausencia de cor competindo. |
| **Trilhas** | 6 cores neon banhando a pagina | Rotulo + filete + `--accent` girado em **hue** (croma baixo) | Identidade por fio, nao por banho. Monocromatico domina. |
| **Tipografia** | **Inter** unica (sans) | **Spectral + Source Serif 4** (+ IBM Plex Mono, Atkinson a11y) | Leitura e a decisao no.1; serif de corpo para sessao longa; assinatura editorial (Quanta). |
| **Largura** | coluna variavel / cards largos | **62-70ch** travado | A restricao **cria** a margem onde a profundidade vive. |
| **Profundidade** | tudo na dobra (chips, FAQs, blocos) | **camadas** sidenote + `<details>` + def inline | Iceberg: superficie calma, detalhe sob demanda (Nielsen/Gwern/Tufte). |
| **Progresso** | **3 barras** + percentuais | `N de M` + grade silenciosa + 1 proxima acao | Progresso calmo e acionavel (Khan), nao contagem ansiosa. |
| **Notas/duvida** | inexistente / exigiria modal | **na margem**, ancorada ao texto, `localStorage` | Onde se le, fora do caminho — nunca modal/drawer. |
| **Engajamento** | (n/a) — risco de gamificar | "pare e preveja" + knowledge check, **zero** streak/XP | Recall sem ansiedade; calma > placar (anti-Duolingo). |
| **Elevacao** | cards, `rounded-xl`, glow | hairlines 1px, raio 4px, quase sem sombra | Premium = quietude (MasterClass), papel nao material. |
| **Forma visual** | "dashboard de curso" | **pagina de leitura editorial** | Densidade e a media do mercado; simplicidade e a diferenciacao. |
| **Sucesso medido por** | densidade de controles na tela | **tempo calmo de leitura e retomada** | A tese: leitura-primeiro, profundidade no conteudo, leveza no layout. |

**Restricao tecnica mantida (regra de ouro):** 1 `.html` auto-contido, Google
Fonts/Tailwind via CDN, JS inline opcional, **sem build, sem backend**, abre em
`file://`. Tudo acima e implementavel assim — sidenotes e progressive disclosure sao
CSS puro (`<details>` + checkbox-hack); progresso/notas/duvida em `localStorage`;
animacao/foco como **progressive enhancement** respeitando `prefers-reduced-motion`.

---

## 6. Checklist de aceitacao (travas objetivas)

- [ ] Fundo **nunca** `#fff`/`#000`; papel tingido (OKLCH) em claro/sepia/escuro.
- [ ] Corpo em **serif** (Source Serif 4), **nao** Inter; titulo em Spectral.
- [ ] Measure de leitura **62-70ch**; line-height **1.62-1.70**; corpo **18-19px**.
- [ ] **Zero** chip de stat, **zero** barra de progresso, **zero** anel, **zero** glow ambar/ciano.
- [ ] No maximo **1 figura por ideia**; gap de secao ~96px (respira).
- [ ] Profundidade **sempre** em camada (sidenote / `<details>` / def inline), nunca empilhada na dobra.
- [ ] Sidenote funciona no desktop (margem) **e** colapsa inline no mobile **sem JS**.
- [ ] Essencial **nunca** escondido atras de clique (so o raro/aprofundamento).
- [ ] Progresso = `N de M` + grade silenciosa + 1 proxima acao; **sem** gamificacao.
- [ ] Duvida e nota vivem na **margem**, nao em modal/drawer; `localStorage`.
- [ ] Toggle de tema (claro/sepia/escuro), tamanho e **Atkinson Hyperlegible** presentes.
- [ ] `prefers-reduced-motion` e `prefers-color-scheme` respeitados; foco-visivel acessivel.
- [ ] Pagina **le perfeita com JS desligado** (tudo e progressive enhancement).
- [ ] 1 `.html`, sem build, sem backend, abre em `file://`.

---

## Anexo — Landing/entrada v3 + validacao externa (Behance, Landingfolio)

Consolidacao das duas pesquisas visuais paralelas. Ambas convergiram na MESMA
direcao do v3 (forte sinal de que nao e chute). Behance e Landingfolio sao
INUTEIS via fetch (client-rendered / 404) e, quando carregam, mostram em sua
maioria o que EVITAR — os agentes pivotaram para referencias reais.

### Principio da landing (tom)
> **O produto parece uma OBRA que o autor precisava escrever, nao um PRODUTO que
> o autor precisava vender.** A landing explica *o que e* e *por que existe* — nao
> convence a forca. (Refs: Stripe Press, Just JavaScript, Refactoring UI, CSS-for-JS.)

### Estrutura da landing/index v3
- **Hero tipografico puro**, sem mockup 3D/screenshot isometrico. No maximo uma
  ilustracao conceitual. Headline = **diagnostico preciso da dor**, nunca promessa
  de transformacao ("domine X em 30 dias" esta PROIBIDO).
- **Curriculo como indice real**: cada trilha/modulo com titulo + 1 paragrafo do
  "porque" (densidade = prova de seriedade), nao bullets de beneficio com check verde.
- **Prova social sobria**: citacao textual estatica (nome + contexto), sem carrossel,
  sem estrelinhas, sem "+10.000 alunos".
- **CTA unico** sem urgencia fabricada + uma saida de baixo risco ("ler o Modulo 1").

### Paleta v3 (consolidada — rompe com ambar/ciano)
| Token | Hex | Origem |
|---|---|---|
| Fundo papel (light) | `#F7F4EF` / `#F8F5EF` | CSS-for-JS, Gwern, Tufte off-white |
| Texto principal | `#1A1A1A` (off-black `#111111`) | preto real tingido, nunca #000 |
| Superficie/cartao (so catalogo) | `#FFFFFF` tingido | contraste sutil |
| Borda/divisor | `#E0DACE` | creme escurecido |
| Acento UNICO (tinta) | azul-ardosia `#2C5282`/`#2D5F8A` **ou** verde-salva `#2D6A4F` | Linear, Learn UI, Tufte (cor so funcional) |
| Tema escuro (opcional, 1 entre temas) | grafite `#1C1C1E` | nunca a base |

### Tipografia (consolidada)
Display+corpo SERIF com caracter (Spectral + Source Serif 4; alternativas Lora /
Merriweather / Newsreader) — **nunca Inter sozinho**. UI/labels em sans pequeno
(Inter/DM Sans). Mono so em codigo (IBM Plex Mono / JetBrains Mono). Hierarquia por
**peso/tamanho**, nao por cor. Corpo 17-18px, line-height ~1.7, coluna 62-70ch.
Toggle de acessibilidade: **Atkinson Hyperlegible**.

### EVITAR (consolidado — o anti-padrao de "curso online")
Dashboard de XP/streak/ranking · mascote/confete/badges · cards coloridos dentro da
licao (cards = so catalogo/indice) · sidebar fixa roubando largura na leitura · hero
3D isometrico de estudante · mockup de produto flutuante · contador de alunos · selos
de garantia · carrossel de depoimentos com estrelinhas · gradiente roxo/ambar · CTA com
countdown · "voce vai aprender" com 12 checks · FAQ que e objecao de venda · paleta
dark premium ambar+ciano (= o v2, ja virou slop) · display ultra-bold em todo heading.

### Referencias-norte (verificadas, ao vivo)
- **gwern.net** + **edwardtufte.github.io/tufte-css** — leitura profunda self-contained + sidenotes (a espinha tecnica).
- **justjavascript.com** — uma ideia por tela + "pare e preveja" (recall sem quiz).
- **ciechanow.ski** / **3blue1brown.com** — uma figura forte por ideia.
- **stripe.press** / **every.to** — tom editorial premium pela quietude.
- **refactoringui.com** / **css-for-js.dev** — landing de autor sem infoproduto.
