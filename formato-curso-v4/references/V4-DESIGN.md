# V4-DESIGN — Design Language do formato-curso INEMA v4

> **Status:** spec aprovada (brainstorming) em 2026-07-03. Fatia inicial = **página de aula**.
> **Prova viva (mockup descartável):** `mockups/v4-aula/ab-blend.html` (compare com `a-`, `b-`, `c-`).
> **Antecessores:** `V3-DESIGN.md` (editorial papel-first) e `formato-curso-v2` (dark premium + camada de aprendizagem). O v4 **costura os dois**.

---

## 0. Resumo executivo

O v4 é a página de curso que **fisga e é gostosa de estudar**. O v3 acertou a leitura calma (serifa, coluna medida, profundidade na margem) mas **perdeu a atração** que o v1/v2 tinham; o v1/v2 fisgavam mas **cansavam pra estudar** (dark chrome-heavy, tudo em caixa). O v4 resolve os dois de uma vez com uma espinha nova: **dark editorial com movimento**.

A página de aula tem duas zonas em sequência: um **cold-open enxuto** que dá o "uau" na entrada (fit em ~1 tela), e um **corpo de margem viva** onde se estuda (coluna de leitura calma + trilho lateral com uma figura-âncora que se transforma por seção). Por cima, a **camada de aprendizagem nível 3**: tudo do v2 (progresso, lido, dúvida, nota, highlight, "minha jornada", export/import, temas) **+ retenção** (teste-se, flashcards, revisão espaçada). Tudo self-contained, offline, sem backend.

---

## 1. Tese e princípios v4

**Problema.** v3 é calmo mas sóbrio demais (não puxa). v1/v2 puxam mas cansam. Nenhum entrega *atração + estudo* junto.

- **P1 — Atração na entrada, calma no corpo.** O drama fica concentrado no cold-open; o corpo é leitura calma e viva-mas-discreta. Fisga sem cansar.
- **P2 — Movimento que ajuda a ler, não que distrai.** O scrollytelling do trilho é ancorado ao texto (a figura acompanha a seção que você lê). Todo movimento morre sob `prefers-reduced-motion`, preservando o estado final.
- **P3 — Figuras composáveis.** Trilho (âncora da seção, opcional) **+** figuras inline na coluna (uma ou várias). Coexistem — nunca "um visual por vez".
- **P4 — Dark editorial quente.** Fundo ink escuro + texto creme + serifa + 1 acento água-menta. Rompe com âmbar/ciano (v1/v2) **e** com o papel-first (v3), sem voltar ao chrome de dev-doc.
- **P5 — Estudar > ler.** Retenção embutida (teste-se, flashcards a partir dos grifos, revisão espaçada) transforma "li" em "aprendi".
- **P6 — Self-contained.** HTML + Tailwind CDN + JS inline, abre em `file://`, zero raster, sem backend/IA em runtime.

---

## 2. Tokens

### 2.1 Cor — tema DEFAULT (dark editorial)

```
--bg:#0E0D14  --bg2:#15131d  --panel:#1a1824  --panel2:#221f2e
--ink:#ECE6D9 (creme quente)  --ink-soft:#C7C2D0  --muted:#948DA6  --faint:#6C6580
--line:#2A2637  --line2:#37324a
--accent:#7CE0C6 (água-menta, assinatura)  --accent-dim:#4FB79E
--warm:#F2B45C (âmbar — só figuras/segundo destaque, nunca texto de corpo)
```

Fundo com profundidade por radial-gradients suaves (água-menta + âmbar sobre ink), não por caixas. Acento saturado **fora do campo de leitura** — no texto ele só marca link/ênfase pontual.

### 2.2 Temas alternativos — 1 toggle

- **papel** (claro quente) e **sépia** para leitura longa / ambiente claro / preferência. Remapeiam os mesmos tokens semânticos (arquitetura de tokens herdada do v2, `data-theme` ortogonal ao eixo claro/escuro).
- Default é sempre **dark editorial** (o contrato de marca). Tema desconhecido cai pro default.

### 2.3 Tipografia (3 fontes, papéis rígidos)

- **Newsreader** (serifa, optical-sizing `opsz 6..72`, itálico) → h1/h2, lead, **corpo de leitura**, acento em itálico.
- **Inter** (sans) → UI, controles, chips, painel de jornada.
- **Space Mono** (mono) → kicker/eyebrow, labels, legendas de figura, números.

Assinatura: palavra-chave em *itálico + cor de acento* dentro dos títulos (`h1 em`, `h2 em`).

### 2.4 Escala e ritmo

- h1 `clamp(40px,6.6vw,74px)`, line-height ~1.0, letter-spacing -.025em, peso 500.
- h2 `clamp(27px,3.6vw,38px)`.
- lead serif `clamp(19px,2.1vw,24px)`.
- corpo 18px, **line-height 1.75**, **medida ~60ch** (clampa só a prosa; code/figuras/tabelas têm geometria própria).
- Respiro abundante entre seções (`.step` ~80vh, centralizada).

### 2.5 Movimento (tokens de motion)

- Durations curtas (250–600ms), easing suave. Tipos permitidos: drift do fundo do cold-open, scan/enche da figura-âncora, cross-fade do trilho por seção, breathe sutil, reveal de entrada (fade+rise).
- **Proibido:** bounce/rotate/scale no hover, confete, streak, parallax pesado. Nada que manipule — só que informe/ambiente.
- **`prefers-reduced-motion: reduce` zera/encurta tudo e preserva o estado final.**

---

## 3. Arquitetura da página de aula (o blend)

### 3.1 Cold-open enxuto (contrato)

- Ocupa ~1 tela (`min-height ~92vh`), conteúdo num **container centralizado** (max-width ≈1040px) — encaixado, não "espalhado".
- Elementos: kicker (mono) · h1 serifão com itálico-acento · lead · figura-âncora com micro-motion (ex.: a "janela" enchendo de tokens + scan) · cue "↓ role para estudar".
- É o gancho e o tom — **não** carrega conteúdo denso.

### 3.2 Corpo: coluna de leitura + trilho vivo

- Grid `minmax(0,60ch) 360px`, gap generoso, container centralizado.
- Cada seção (`.step`, `data-fig`) = **uma ideia**; ao entrar no centro da viewport (IntersectionObserver, `rootMargin -45%/-45%`), ativa a figura correspondente no trilho e o indicador de passo.
- **Trilho sticky** (`top: calc(50vh - Xpx)`): `figstage` com as figuras empilhadas em cross-fade + legenda mono + indicador de passos + sidenotes.
- **Barra de progresso** fina no topo (scroll da página).
- **Responsivo (≤940px):** trilho some; cada figura-âncora vira figura inline antes/depois da sua seção (clonada via JS). Cold-open colapsa pra 1 coluna.

### 3.3 Sistema de figuras composável

- **Trilho** = figura-âncora da seção (opcional; use quando faz sentido "segurar" um conceito enquanto lê).
- **Coluna** = figuras inline (`.colfig`), **uma ou várias** por seção.
- As duas **coexistem** (provado na seção 1 do mockup: janela no trilho + "contexto → con·texto" inline).
- Todas em SVG inline (dataviz/diagrama/ilustração conceitual). Zero raster.

### 3.4 Sidenotes, profundidade e âncoras

- **Sidenotes** de autor na margem/trilho (CSS, estáticas).
- **"Indo mais fundo"** = `<details>` (divulgação progressiva sob demanda).
- Âncoras estáveis por seção (deep-link, "continuar de onde parei").

---

## 4. Camada de aprendizagem — nível 3 (completa + retenção)

Self-contained, estado em `localStorage`, **sem backend/IA em runtime**. Reaproveita o motor `learn.js` (v2/v3), estendido.

### 4.1 Base (herdada do v2/v3)

Progresso **silencioso** (sem 3 barras) · marcar lido · dúvida e nota **ancoradas na margem** · **highlight no próprio texto** · painel **"minha jornada"** (continuar de onde parei, consolidado) · **export/import `.json`** · temas + preferências de leitura (tamanho/largura/entrelinha/fonte/acento, clampando só a prosa).

### 4.2 Retenção (o "até mais")

- **Teste-se** — checagem rápida ao fim de cada seção + recap ao fim da aula. Perguntas **escritas pelo autor** no markup (múltipla escolha ou resposta revelável), feedback inline. Sem geração por IA.
- **Flashcards** — o autor marca frases-chave como cartão (`data-card`) **e** todo **grifo do aluno** vira cartão de revisão automaticamente (frente = conceito/cloze, verso = trecho).
- **Revisão espaçada leve** — cada cartão tem agenda simples (de novo / bom / fácil → intervalos crescentes, tipo SM-2-lite). "Revisar hoje: N" aparece na jornada.
- **Resumo ativo** — pontos-chave recolhidos no fim pra auto-teste.

### 4.3 Persistência e honestidade

- Tudo em `localStorage`, chave global do aluno (cross-curso onde fizer sentido). Export/import inclui cartões + agenda.
- **Honestidade de contrato:** cartões e "teste-se" são **autorais** (parte do conteúdo) + derivados dos **grifos do aluno**. Geração automática por IA exigiria servidor — fora de escopo.

---

## 5. Técnico

- Self-contained: HTML + Tailwind CDN + JS inline; abre em `file://`; zero PNG/JPG (motion e dataviz em CSS/SVG).
- **Reúso:** motor `learn.js` do v2/v3 + módulo novo de retenção (`retain`/flashcards/agenda).
- Fontes via Google Fonts (Newsreader/Inter/Space Mono) com fallback (Georgia/system/ui-mono).
- Acessibilidade como **portão**: contraste AAA no texto em todos os temas; movimento sob reduce-motion; foco visível.

---

## 6. Escopo — o que o `demo4` prova, e o que fica pra depois

- **Agora (fatia vertical):** **uma aula completa** no blend, com o nível 3 ligado, como `demo4/`. Vira a régua do resto.
- **Ciclos seguintes (cada um com seu spec):** landing · índice de trilha · "mapa da trilha" na margem · empacotar como skill `formato-curso-v4` (SKILL.md + assets + references).

---

## 7. Checklist de aceitação (travas objetivas)

1. Cold-open **cabe em ~1 tela** e é composto/centralizado (não "espalhado").
2. Corpo lê calmo em **medida ≤60ch**; prosa em serifa.
3. Trilho **troca a figura certa** por seção (âncora ↔ `data-fig`), com progresso e indicador.
4. **Dois+ visuais simultâneos** possíveis (trilho + inline).
5. **Contraste AAA** do texto sobre o fundo em **todos os temas** (dark/papel/sépia); acento saturado nunca vira texto em superfície clara.
6. **Offline em `file://`** — tudo funciona sem servidor; estado persiste em `localStorage`.
7. **Reduce-motion** zera o movimento e **preserva o estado** (lido continua lido, trilho ainda mostra a figura da seção).
8. Retenção: teste-se autoral funciona; grifo do aluno vira cartão; agenda de revisão persiste e aparece na jornada.
9. Responsivo: ≤940px o trilho vira figuras inline; cold-open colapsa pra 1 coluna.

---

## 8. Anexo — decisões e referências

- **Por que dark editorial (e não papel do v3):** o usuário sinalizou que "o v3 perde a atração". A referência **reel-edita** (Angel Aparicio) provou que serifa editorial + escuro + figura por ideia é impactante **e** legível — a ponte que o v4 adota. Ver memória `reel-edita-design-ref`.
- **Por que o blend (A+B) e não A/B/C puros:** A concentra drama no topo e o corpo fica parado; B estuda bem mas abre modesto; C é difuso. O blend dá gancho imediato (A) + estudo vivo o resto todo (B). Escolhido após comparar os quatro mockups.
- **Paleta e conteúdo dos mockups** ("janela de contexto", água-menta/creme/âmbar) são candidatos ajustáveis, não travados byte-a-byte.

---

**Última revisão:** 2026-07-03 (v4.0 — spec da fatia aula, aprovada no brainstorming)
