# SVG FUTURISTA — Biblioteca de Diagramas Ilustrativos

> Diagramas vetoriais no estilo do curso para ilustrar conceitos. Um bom diagrama explica em 2 segundos o que um parágrafo não explica.
> **Regra:** cada **módulo de conteúdo** tem **≥1 SVG** ilustrativo; cada **índice de trilha** tem **1 hero SVG**. Exercícios e prompts: opcional.

---

## 1. Princípios

1. **SVG inline, nunca imagem externa.** Vetorial, nítido, leve, combina com dark/light, e você controla 100%.
2. **Estilo do curso, não "hand-drawn".** Traços limpos, cantos arredondados, glow neon, grid de pontos. NÃO copiar decks com fonte cursiva/filtro de rabisco.
3. **Recriar o conceito, não colar a fonte.** Se o material de origem tem um diagrama, recrie-o com estes primitivos.
4. **Responsivo:** sempre `class="w-full h-auto"` + `viewBox`. Nunca largura/altura fixas em px no elemento.
5. **Acessível:** `role="img"` + `aria-label="<descrição do que o diagrama mostra>"`.
6. **Movimento opcional e seguro:** animações só dentro de `@media (prefers-reduced-motion: no-preference)`.
7. **Envolver num painel:** `<div class="rounded-2xl border border-<cor>-500/30 bg-dark-900/40 p-3 sm:p-4 mb-8 overflow-hidden">…</div>`.
8. **Intensidade contida (PADRÃO — não "neon gritante").** O diagrama deve apoiar a leitura, não competir com ela. Regras fixas:
   - **Glow leve:** `feGaussianBlur stdDeviation="1.8"` (nunca 3+). E aplicar `filter="url(#ID-glow)"` **só na caixa-foco** de cada diagrama (origem/resultado/nível em destaque), nunca em todas as caixas ao mesmo tempo.
   - **Texto em peso médio:** títulos do SVG `font-weight="600"` (não 700). Negrito 700 só se for um único rótulo-chave isolado.
   - **Traço fino:** `stroke-width="2"` nas caixas (não 2.5); conectores `stroke-width="1.8"` com `opacity` ~0.5.
   - **Tom suave:** prefira a coluna "Primária (stroke)" da paleta (ex. emerald `#34d399`), reservando a "Primária forte" só para o gradiente de 1 caixa-foco.
   - **Adaptar ao tema claro (OBRIGATÓRIO):** sem isso o neon-sobre-fundo-escuro fica gritante no light mode. Adicione no `<style>` da página:
     ```css
     html:not(.dark) svg[role="img"] { filter: saturate(0.82) brightness(0.96); }
     ```
     (atinge só os diagramas — os ícones do nav não têm `role="img"`.)

---

## 2. Paleta dos diagramas

**Cor primária = a cor da trilha. Cor secundária (= "agentes", fluxo de volta, ramo paralelo) = ciano.**

| Trilha | Primária (stroke) | Primária forte | Fill da caixa primária |
|--------|-------------------|----------------|------------------------|
| T1 Emerald | `#34d399` | `#10b981` | `#0e2018` |
| T2 Blue | `#60a5fa` | `#3b82f6` | `#0e1622` |
| T3 Purple | `#c084fc` | `#a855f7` | `#1a1230` |
| T4 Amber | `#fbbf24` | `#f59e0b` | `#1f1604` |
| T5 Teal | `#2dd4bf` | `#14b8a6` | `#0c1f1c` |
| T6 Rose | `#fb7185` | `#f43f5e` | `#2a0f16` |

- **Secundária (ciano):** stroke `#38bdf8`, fill `#0e1b26`, texto `#9ad6ff`/`#bfe6ff`.
- **Neutro:** stroke `#9ca3af`, fill `#26201a`, texto `#e5e7eb`.
- **Texto sobre primária:** use a própria cor primária (títulos) + um tom claro dela para legendas.

> Nos snippets abaixo as cores estão em **amber (T4)**. Para outra trilha, **troque `#fbbf24`/`#f59e0b`/`#1f1604`** pelos valores da tabela. O ciano permanece.

---

## 3. Tokens compartilhados (defs + CSS)

Coloque os `defs` dentro do primeiro `<svg>` da página (ou repita por SVG com `id` único por arquivo para evitar colisão). Prefixe os `id` com o nº do módulo (ex.: `m41-glow`).

```html
<defs>
  <linearGradient id="ID-grad" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fbbf24"/><stop offset="1" stop-color="#f59e0b"/>
  </linearGradient>
  <filter id="ID-glow" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <pattern id="ID-grid" width="32" height="32" patternUnits="userSpaceOnUse">
    <circle cx="1.3" cy="1.3" r="1.3" fill="#f59e0b" opacity="0.12"/>
  </pattern>
  <marker id="ID-ah"  markerWidth="9" markerHeight="9" refX="6.5" refY="4.5" orient="auto"><path d="M0,0 L8,4.5 L0,9 L2.4,4.5 Z" fill="#fbbf24"/></marker>
  <marker id="ID-ahc" markerWidth="9" markerHeight="9" refX="6.5" refY="4.5" orient="auto"><path d="M0,0 L8,4.5 L0,9 L2.4,4.5 Z" fill="#38bdf8"/></marker>
</defs>
```

CSS de pulso (uma vez por página, no `<style>`):

```css
@keyframes wf-pulse { 0%,100% { opacity:.55 } 50% { opacity:1 } }
@media (prefers-reduced-motion: no-preference) {
  .wf-a { animation: wf-pulse 2.6s ease-in-out infinite; }
  .wf-a:nth-child(2){animation-delay:.25s} .wf-a:nth-child(3){animation-delay:.5s}
  .wf-a:nth-child(4){animation-delay:.75s} .wf-a:nth-child(5){animation-delay:1s}
}
```

Texto SVG: sempre `font-family="Inter,sans-serif"`. Títulos `font-weight="600"` (médio — ver Princípio 8; evite 700 em massa).

---

## 4. Catálogo de primitivos

Escolha pelo que o módulo precisa **mostrar**. Os exemplos canônicos renderizados estão em `curso/trilha4/` do projeto opus48 (referência viva).

### 4.1 Fan-out / orquestração (A → N → 1) — bom para HERO
Um nó de origem → vários nós paralelos (ciano, pulsando) → um nó de resultado. Use como hero do índice e em módulos sobre paralelismo/pipeline.

```html
<svg viewBox="0 0 1000 240" class="w-full h-auto" role="img" aria-label="Um orquestrador dispara vários agentes em paralelo que convergem num único resultado">
  <!-- defs: ID-grad, ID-glow, ID-grid, ID-ah, ID-ahc (ver Sec. 3) -->
  <rect x="0" y="0" width="1000" height="240" fill="url(#ID-grid)"/>
  <g fill="none" stroke="#fbbf24" stroke-width="2" opacity="0.65">
    <path d="M196,120 C300,120 320,38 452,38" marker-end="url(#ID-ah)"/>
    <path d="M196,120 C300,120 320,79 452,79" marker-end="url(#ID-ah)"/>
    <path d="M196,120 L452,120" marker-end="url(#ID-ah)"/>
    <path d="M196,120 C300,120 320,161 452,161" marker-end="url(#ID-ah)"/>
    <path d="M196,120 C300,120 320,202 452,202" marker-end="url(#ID-ah)"/>
  </g>
  <g fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.55">
    <path d="M588,38  C700,38 720,120 800,120" marker-end="url(#ID-ahc)"/>
    <path d="M588,79  C700,79 720,120 800,120" marker-end="url(#ID-ahc)"/>
    <path d="M588,120 L800,120" marker-end="url(#ID-ahc)"/>
    <path d="M588,161 C700,161 720,120 800,120" marker-end="url(#ID-ahc)"/>
    <path d="M588,202 C700,202 720,120 800,120" marker-end="url(#ID-ahc)"/>
  </g>
  <g filter="url(#ID-glow)"><rect x="40" y="88" width="156" height="64" rx="14" fill="#1f1604" stroke="url(#ID-grad)" stroke-width="2.5"/></g>
  <text x="118" y="114" text-anchor="middle" fill="#fbbf24" font-family="Inter,sans-serif" font-weight="700" font-size="20">Origem</text>
  <text x="118" y="134" text-anchor="middle" fill="#fcd9a0" font-family="Inter,sans-serif" font-size="12.5">orquestrador</text>
  <g font-family="Inter,sans-serif" font-size="13" font-weight="600">
    <g class="wf-a"><rect x="452" y="22"  width="136" height="32" rx="9" fill="#0e1b26" stroke="#38bdf8" stroke-width="2"/><text x="520" y="43"  text-anchor="middle" fill="#bfe6ff">agente</text></g>
    <g class="wf-a"><rect x="452" y="63"  width="136" height="32" rx="9" fill="#0e1b26" stroke="#38bdf8" stroke-width="2"/><text x="520" y="84"  text-anchor="middle" fill="#bfe6ff">agente</text></g>
    <g class="wf-a"><rect x="452" y="104" width="136" height="32" rx="9" fill="#0e1b26" stroke="#38bdf8" stroke-width="2"/><text x="520" y="125" text-anchor="middle" fill="#bfe6ff">agente</text></g>
    <g class="wf-a"><rect x="452" y="145" width="136" height="32" rx="9" fill="#0e1b26" stroke="#38bdf8" stroke-width="2"/><text x="520" y="166" text-anchor="middle" fill="#bfe6ff">agente</text></g>
    <g class="wf-a"><rect x="452" y="186" width="136" height="32" rx="9" fill="#0e1b26" stroke="#38bdf8" stroke-width="2"/><text x="520" y="207" text-anchor="middle" fill="#bfe6ff">agente …</text></g>
  </g>
  <g filter="url(#ID-glow)"><rect x="800" y="88" width="156" height="64" rx="14" fill="#1f1604" stroke="url(#ID-grad)" stroke-width="2.5"/></g>
  <text x="878" y="118" text-anchor="middle" fill="#fbbf24" font-family="Inter,sans-serif" font-weight="700" font-size="16">Resultado</text>
</svg>
```

### 4.2 Escada de degraus (progressão crescente)
Caixas em diagonal ascendente + linha tracejada. Bom para "níveis", "maturidade", "do simples ao complexo". Cada degrau pode ter um sub-rótulo (custo `$→$$$$$`, nível, etc.).

Estrutura: 4–5 `<rect>` subindo (y decrescente, x crescente) sobre um `<path>` tracejado `stroke-dasharray="9 9"`; o último degrau com `filter="url(#ID-glow)"`. Ver `modulo-4-3.html` (escada $→$$$$$).

### 4.3 Profundidade × largura (dois painéis comparativos)
Linha divisória tracejada vertical no meio (`x=500`). Esquerda: cadeia **vertical** (profundidade — 1 nó, vários turnos, seta pra baixo até um nó "final"). Direita: **fan-out** horizontal (largura — 1 plano → N agentes → 1 resultado). Ver `modulo-4-4.html`.

### 4.4 Malha × solo (colaboração × isolamento)
Esquerda: 4 círculos totalmente interligados (malha — todos os pares conectados). Direita: N caixas isoladas convergindo num único resultado. Bom para "conversam × não conversam", "acoplado × desacoplado". Ver `modulo-4-2.html`.

### 4.5 Aninhamento (caixa-contém-caixas)
Uma caixa grande (cor da trilha, `filter glow`) rotulada, contendo N caixas menores (ciano) lado a lado. Bom para "X roda dentro de Y", "composição", "camadas". Ver `modulo-4-2.html`.

### 4.6 Equação A + B = C
Três caixas em linha separadas por `+` e `=` grandes (cor primária, `font-size:30`). A caixa-resultado maior e com glow. Bom para "combinação de recursos/conceitos". Ver `modulo-4-5.html` (UltraCode).

### 4.7 Fluxo de decisão (diamante/sim-não)
Caixa-pergunta → duas setas rotuladas "sim"/"não" (verde/vermelho) → caixas-destino; encadear para árvores curtas. Bom para "quando usar X". Ver `modulo-4-6.html`.

### 4.8 Monitor / painel (HTML, não SVG)
Para representar uma tela/terminal/dashboard, use um **mock HTML** estilizado (barra de título com 3 bolinhas, linhas mono com barras de progresso animáveis) — mais legível que SVG e honesto (rotule "recriação ilustrativa, não screenshot real"). Ver `modulo-4-5.html` (monitor `/workflows`).

---

## 5. Checklist do SVG (antes de entregar)

- [ ] `viewBox` + `class="w-full h-auto"` (sem px fixos)
- [ ] `role="img"` + `aria-label` descritivo
- [ ] `id`s de defs únicos por página (prefixados, ex.: `m41-glow`)
- [ ] Cor primária = cor da trilha; ciano = secundária
- [ ] Envolto em painel `rounded-2xl border border-<cor>-500/30 bg-dark-900/40`
- [ ] Animação (se houver) só sob `prefers-reduced-motion: no-preference`
- [ ] `font-family="Inter,sans-serif"` em todo `<text>`
- [ ] **Intensidade contida (Princípio 8):** glow `stdDeviation="1.8"` e só na caixa-foco · títulos `font-weight="600"` · caixas `stroke-width="2"` · regra `html:not(.dark) svg[role="img"]{filter:saturate(.82) brightness(.96)}` no `<style>`
- [ ] Legível no light mode (fills escuros funcionam nos dois; evite texto branco puro sobre primária clara)
- [ ] Mock de tela rotulado como "ilustrativo", nunca passado como screenshot real
