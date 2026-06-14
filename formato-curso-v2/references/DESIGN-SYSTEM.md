# DESIGN SYSTEM — Vocabulário, Filosofia e Decisões Visuais

> **Documento complementar.** O `MASTER_COMPLETO.md` diz **o que** e **como** (especificações técnicas). Este documento diz **o quê é** (vocabulário) e **quando usar** (decisões). Leia este aqui quando precisar:
> - Explicar o estilo para um cliente, agente ou colega
> - Decidir qual elemento visual usar em um tópico
> - Buscar inspiração em outras fontes mantendo coerência
> - Justificar escolhas de design

---

## 1. NOME E IDENTIDADE DO SISTEMA

### 1.1 O nome técnico
**"Design system próprio em Tailwind CSS, estética dark-mode tipo Linear/Vercel, com diagramas SVG inline em vez de imagens raster."**

### 1.2 As 3 camadas que compõem o sistema

| Camada | O que é | Onde vive |
|---|---|---|
| **Estrutural** | Design system com tokens, componentes e padrões | `MASTER_COMPLETO.md` |
| **Estética** | Visual dark-mode SaaS, "Linear-style" | Aplicada em todas as páginas |
| **Ilustrativa** | Diagramas SVG inline (não imagens) | Codificados direto no HTML |

### 1.3 Como descrever em 1 frase
- **Para cliente leigo:** "Visual moderno tipo aplicativo SaaS, com modo escuro e ilustrações vetoriais codificadas."
- **Para designer:** "Design system Tailwind-based, dark-first, com diagramas SVG hand-coded."
- **Para dev:** "Tailwind utility-first + inline SVG dataviz, sem framework de componentes."

---

## 2. FILOSOFIA VISUAL

### 2.1 Princípios não-negociáveis

1. **Dark mode primeiro** — toda decisão visual nasce em dark; light é override.
2. **Zero imagens raster** — sem PNG/JPG. Tudo é texto, SVG inline, ou CSS.
3. **Acentos de cor por contexto** — cada trilha tem sua cor; nunca misturar trilhas em uma página.
4. **Bordas finas, cantos arredondados** — `border` (1px) + `rounded-xl` (12px). Sem sombras pesadas.
5. **Tipografia generosa, sem decoração** — Inter, sem serifs, sem itálicos cosméticos.
6. **Hover sutil** — mudança de cor de borda + background levíssimo. Nunca scale, nunca translate.
7. **Espaçamento consistente** — `mb-6`, `p-4`, `gap-6` predominantes. Múltiplos de 4.

### 2.2 Anti-padrões (NUNCA)

- ❌ Sombras pesadas (`shadow-2xl`) — quebra a estética flat
- ❌ Gradientes sobre gradientes — usar só no hero da página
- ❌ Animações exuberantes (rotate, bounce) — só transitions de cor
- ❌ Ícones de Font Awesome / bibliotecas raster
- ❌ Imagens stock genéricas
- ❌ Cantos retos (`rounded-none`) — sempre arredondar
- ❌ Texto centralizado em parágrafos longos
- ❌ Cores neon ou saturadas demais (manter paleta calibrada)

### 2.3 Por quê dark-first

Razões pedagógicas e estéticas:
- Cursos técnicos são lidos em sessões longas — dark cansa menos a vista
- Comunica "ferramenta para devs/profissionais" (não "blog post")
- Acentos de cor explodem visualmente sobre fundo escuro
- Diagramas SVG ficam mais impactantes em dark
- Light mode existe para acessibilidade, não como padrão

---

## 3. INSPIRAÇÃO E REFERÊNCIAS

### 3.1 Sites para consultar quando travar

| Site | O que copiar | Quando consultar |
|---|---|---|
| [linear.app](https://linear.app) | Tipografia, espaçamento, hierarquia em dark | Sempre que dúvida geral |
| [vercel.com](https://vercel.com) | Hero, cards, gradientes sutis no header | Hero da landing |
| [tailwindcss.com](https://tailwindcss.com) | Documentação como design | Layout de doc/curso |
| [stripe.com/docs](https://stripe.com/docs) | Diagramas técnicos inline | Diagramas SVG |
| [supabase.com](https://supabase.com) | Dark UI com acento esverdeado | Estética geral |
| [planetscale.com](https://planetscale.com) | Dark + roxo, cards de feature | Cards de trilhas |
| [railway.app](https://railway.app) | Hero animado com gradient | Hero de landing |
| [excalidraw.com](https://excalidraw.com) | Estilo "hand-drawn" | Variação para diagramas mais informais |

### 3.2 O que NÃO usar como referência

- Material Design (Google) — pesado demais, denso de sombras
- iOS / Apple — minimalista demais, perde personalidade
- Bootstrap — datado, genérico
- WordPress themes — comerciais, sem identidade

---

## 4. DECISÕES VISUAIS POR CONTEXTO

### 4.1 Qual elemento visual usar em cada tópico de módulo?

Cada tópico DEVE ter pelo menos 1 elemento visual além do parágrafo introdutório. **Nunca repita o mesmo tipo em 6 tópicos seguidos** — alterne. Use a tabela abaixo como guia de decisão:

| Tipo de conteúdo | Elemento visual ideal | Quando preferir |
|---|---|---|
| Comparação histórica/temporal | **SVG line chart** | Mostrar evolução, antes/depois ao longo do tempo |
| Comparar 2-3 abordagens | **Grid de cards 2-3 colunas** | "Vibe coding vs Agentic dev" |
| Comparar muitos critérios | **Tabela** | Plano A vs Plano B vs Plano C com 5+ atributos |
| Mostrar arquitetura/sistema | **SVG diagrama com caixas e setas** | Fluxo de dados, componentes |
| Mostrar métricas/dados | **Caixa destacada com números grandes** | "70%, 4 itens, 400x" |
| Lista do que fazer/não fazer | **Comparação 2 colunas (verde/vermelho)** | "✓ O que faz / ✗ O que não substitui" |
| Código/configuração | **Bloco `<pre>` estilizado** | Snippets, comandos, JSON, YAML |
| Insight ou dica | **Caixa colorida com ícone** | Alertas, notas, tips importantes |
| Mockup de interface | **HTML estilizado (não SVG)** | Mostrar telas/interfaces do produto |
| Hierarquia ou pirâmide | **SVG geométrico simples** | Camadas, níveis, prioridade |

### 4.2 Quando usar SVG vs HTML estilizado

**Use SVG quando:**
- Precisa de geometria precisa (linhas, círculos, formas)
- Vai mostrar dados (gráficos, charts)
- Diagrama com setas e conexões
- Ícones decorativos não-emoji
- Algo que "parece imagem" mas não é raster

**Use HTML/Tailwind quando:**
- Mockup de UI (cards, botões, headers)
- Tabelas e listas
- Comparações lado-a-lado
- Tudo que tem texto longo dentro

### 4.3 Quando usar emoji vs SVG vs ícone

- **Emoji nativo** (🎯 🚀 ⚙️) — para títulos de seção, headers, indicadores rápidos. Funciona em qualquer device.
- **SVG inline** — para ilustrações conceituais, gráficos, diagramas técnicos. Customizável.
- **Ícone como SVG path** — para UI (theme toggle, setas, fechar). Sempre stroke-based, nunca filled-only.

---

## 5. PALETA E CORES

### 5.1 Hierarquia de cores

```
Yellow (primary #FACC15) ─ Brand, CTAs, logo, dicas
  │
  ├─ Trilha 1 Emerald  ─ Fundamentos / Iniciantes
  ├─ Trilha 2 Blue     ─ Disciplina / Implementação
  ├─ Trilha 3 Purple   ─ Design / Criativo
  ├─ Trilha 4 Amber    ─ Backend / Integração
  ├─ Trilha 5 Teal     ─ Multiagente / Paralelismo
  └─ Trilha 6 Rose     ─ Escala / Negócio
  │
  ├─ Sky               ─ Links externos (INEMA.CLUB)
  ├─ Red               ─ Erros, "não fazer", alertas
  └─ Neutrals          ─ Texto, fundos, bordas
```

### 5.2 Lógica de cor por trilha

Não é aleatório. Cada cor traz uma psicologia:

- **Emerald (T1):** crescimento, base, natureza → fundamentos
- **Blue (T2):** confiança, ordem, técnica → disciplina dos agentes
- **Purple (T3):** criatividade, design, inovação → frontend
- **Amber (T4):** energia, motor, infraestrutura → backend
- **Teal (T5):** equilíbrio, fluxo, equipe → multiagente
- **Rose (T6):** conquista, valor, negócio → escala

Quando criar um novo curso com 6 trilhas, **mantenha a mesma sequência cromática** — ela vira identidade do INEMA.CLUB.

### 5.3 Light mode: por que cor mais escura?

Em fundo claro (`#f8fafc`), as cores `-400` (que ficam ótimas em dark) viram pasteis sem contraste. Por isso o light mode usa `-600` ou `-800`:

| Cor | Dark (`-400`) | Light (mais escuro) | Razão |
|---|---|---|---|
| Emerald | `#34d399` | `#059669` (-600) | Equilíbrio |
| Blue | `#60a5fa` | `#2563eb` (-600) | Equilíbrio |
| Purple | `#a78bfa` | `#7c3aed` (-600) | Equilíbrio |
| Amber | `#fbbf24` | `#92400e` (**-800**) | Mais escuro pq fica neon em -600 |
| Teal | `#2dd4bf` | `#0d9488` (-600) | Equilíbrio |
| Rose | `#fb7185` | `#9f1239` (**-800**) | Mais escuro pq fica neon em -600 |

---

## 6. TIPOGRAFIA E TOM DE VOZ

### 6.1 Hierarquia tipográfica

```
text-4xl/5xl ─ Hero h1 da landing
text-3xl/4xl ─ Hero h1 de trilha/módulo
text-2xl     ─ Título de seção principal (módulo, h2)
text-xl      ─ Título de card, subtítulo
text-lg      ─ Parágrafo de destaque, hero subtitle
text-base    ─ Parágrafo padrão (16px)
text-sm      ─ Texto secundário, metadata
text-xs      ─ Pills, labels, microtypografia
```

### 6.2 Pesos
- `font-bold` (700) — títulos
- `font-semibold` (600) — labels, números importantes
- `font-medium` (500) — itens de menu
- Default (400) — corpo

### 6.3 Tom de voz da copy

- **Direto.** Frases curtas. Sujeito + verbo + complemento.
- **Brasileiro.** "Você" não "tu" nem "vocês".
- **Concreto.** Números, exemplos, R$, %. Nunca abstrações vazias.
- **Sem coachzinho.** Nada de "vamos juntos", "você consegue", "incrível!".
- **Sem floreio.** "AGENTS.md é o manual do projeto" > "AGENTS.md é uma ferramenta poderosa que pode revolucionar sua experiência".
- **Pontuação sóbria.** Pontos finais. Sem exclamações em série.

---

## 7. COMPONENTES RECORRENTES E SEUS NOMES

Use esta nomenclatura ao discutir o design com agentes/devs/clientes:

| Nome | O que é | Onde aparece |
|---|---|---|
| **Hero gradient** | Header com `bg-gradient-to-br` da cor da trilha | Topo de cada landing/trilha/módulo |
| **Pill** | Tag pequena com `inline-block px-3 py-1 rounded-full` | "TRILHA 1", "MÓDULO 1.1", badges |
| **Stat card** | Caixa com número grande + label pequeno | "6 / Trilhas", "30 / Minutos" |
| **Trilha card** | Card grande clicável com ícone, pill, título, descrição | Landing principal |
| **Module card simples** | Card pequeno só com número + título + tempo | Topo do índice de trilha |
| **Module section** | Bloco extenso com header + tópicos expansíveis | Conteúdo detalhado do índice de trilha |
| **Topic accordion** | Item expansível com number circle + título + 3 seções | Cada tópico no índice |
| **Number circle** | Círculo colorido com número dentro (`w-6 h-6 rounded-full`) | Indicador de tópico |
| **Insight box** | Caixa com `bg-{color}/10 border border-{color}/40` + ícone | Dicas, alertas, citações |
| **Comparison grid** | Grid 2 colunas com verde (✓) vs vermelho (✗) | "O que faz / O que não substitui" |
| **Code block** | `<pre>` com fundo `bg-dark-700/50` | Snippets, configurações |
| **Theme toggle** | Botão SVG sun/moon canto direito | Topo de toda página |
| **Breadcrumb** | "Início / Trilha X / Módulo X.Y" | Nas páginas de módulo |
| **Resumo section** | Bloco gradient final com checklist + próximo + nav | Última seção antes do footer |

---

## 8. FLUXO DE DECISÃO RÁPIDO

Usuário pediu uma página nova? Siga esta árvore:

```
┌─ É landing principal?
│  └─ Yellow brand + 6 trilhas + método 5 pilares + CTA
│
├─ É índice de trilha?
│  ├─ Aplicar cor da trilha
│  ├─ Hero gradient + 4 stat cards
│  ├─ Module cards simples (4 colunas)
│  └─ Module sections detalhadas (4 com 6 tópicos cada)
│
└─ É página de módulo?
   ├─ Aplicar cor da trilha
   ├─ Breadcrumb + hero pill + stats
   └─ 6 seções com number circle + título + 1 visual variado + insight box
   └─ Resumo final com bullets + próximo módulo
```

---

## 9. AO ENCONTRAR ALGO NÃO-DOCUMENTADO

Se aparecer um caso não coberto pelo `MASTER_COMPLETO.md` nem por este documento:

1. **Olhe o 2cerebro** (`/home/nmaldaner/projetos/2cerebro/`) — primeira referência viva do sistema
2. **Olhe o mastercodex** (`/home/nmaldaner/projetos/mastercodex/`) — referência mais recente e robusta
3. **Pergunte ao usuário** antes de inventar um padrão novo
4. **Documente aqui** se virar regra recorrente

---

## 10. PALAVRAS-CHAVE PARA BUSCAR REFERÊNCIAS NA WEB

Quando precisar achar inspiração externa nessa estética, use estes termos:

- `tailwind dark UI`
- `SaaS landing dark mode`
- `developer documentation dark theme`
- `linear app clone`
- `inline SVG illustrations`
- `dataviz SVG tailwind`
- `dark mode design system`
- `awwwards dark mode 2025`

---

**Última revisão:** 2026-05-01 (v1.0)
**Aplicado em:** 2cerebro, mastercodex

---

# PARTE II — CAMADA v2 (TEMAS, TOKENS, LEITURA, MICRO-INTERAÇÕES)

> **O que muda na v2.** Tudo acima (Parte I) continua valendo byte-a-byte: é a estética dark premium âmbar/ciano, o vocabulário de componentes e as decisões visuais herdadas. A v2 **não redesenha** — ela coloca **uma camada de aprendizagem e aparência por cima**. As seções abaixo documentam o **vocabulário visual novo**: como as cores viram tokens em 3 níveis, quais temas existem e quando usar cada um, o que o aluno pode ajustar na leitura, e como as micro-interações ficam sóbrias. Fonte técnica completa: `DESIGN-SPEC.md` §3 e `LEARN-LAYER.md`. Aqui é o "o quê é / quando usar", como na Parte I.

---

## 11. ARQUITETURA DE TOKENS (3 NÍVEIS)

### 11.1 O problema que os tokens resolvem

Na Parte I, a cor é dita "na mão" em utilitário Tailwind (`dark:bg-dark-800`, `text-amber-400`). Isso é ótimo para o que é estrutural e fixo, mas **não troca de tema** sem reescrever markup. A v2 quer **temas de leitura trocáveis** (claro, sépia, foco, alto-contraste) sem tocar em cada classe. A saída é uma **escada de cor em 3 níveis** (padrão web.dev), onde só o topo da escada é o que a página enxerga.

### 11.2 Os 3 níveis

```
Nível 1 — PRIMITIVOS        canais HSL crus, sem significado
  --h-amber: 48;  --s-amber: 96%;  --l-amber: 53%;   (ex.)
        │
Nível 2 — TOKENS DE TEMA    valores por data-theme (dark / claro / sépia / contraste…)
  [data-theme=sepia] --token-bg: #FBF0D9;  --token-text: #5F4B32;
        │
Nível 3 — SEMÂNTICOS        nomes que a PÁGINA consome (só estes!)
  --bg  --surface  --surface-2  --text  --text-muted
  --border  --primary  --accent  --accent-2
```

**Regra de ouro dos tokens:** a página (CSS à mão, componentes novos) referencia **só o Nível 3**. Nunca escreve um hex cru nem um primitivo direto. Trocar de tema = trocar o Nível 2; o Nível 3 e a página nem percebem.

### 11.3 Os 9 tokens semânticos (o vocabulário que você usa)

| Token | O que pinta | Análogo na Parte I |
|---|---|---|
| `--bg` | fundo da página | `dark-800` / `#111827` |
| `--surface` | card, caixa, painel | `dark-700` / `#1f2937` |
| `--surface-2` | card aninhado, hover, borda de card | `dark-600` / `#374151` |
| `--text` | corpo do texto | `#e6e6e6` |
| `--text-muted` | legenda, metadata, secundário | `#a8a8b3` |
| `--border` | bordas finas (1px) | `#374151` |
| `--primary` | marca, CTA, logo (âmbar) | `amber-400` / `#FACC15` |
| `--accent` | acento da trilha ativa (varia por trilha) | cor da trilha |
| `--accent-2` | acento secundário / links / foco (ciano) | `sky-400` / `#38bdf8` |

### 11.4 Onde os tokens valem — e onde NÃO valem (promessa honesta)

A v2 vive em **dois layers que não colidem** (decisão travada):

- **Layer Tailwind (`.dark`)** — tudo que já é utilitário (`dark:bg-dark-800`). Continua intacto, dirigido pela classe `.dark`. **Não troca por variável sem refactor.**
- **Layer CSS-vars (`data-theme`)** — bloco `<style>` à mão + componentes novos (prosa, controles de leitura, painel jornada, callouts). É **aqui** que os 9 tokens governam, e é **aqui** que "tema novo é barato" vale.

> **Não prometa "tema novo em 10 linhas" para o markup Tailwind.** Os temas de leitura extras (sépia/foco/alto-contraste) afetam **a prosa e os componentes novos**, não cada `dark:` espalhado. Diga isso ao cliente como está: a identidade INEMA é o **default e o contrato**; os temas extras são **conforto de leitura sobre a prosa**.

### 11.5 Por que `.dark` e `data-theme` são ORTOGONAIS

São **dois eixos independentes**, nunca o mesmo seletor:

- **Eixo 1 — claro/escuro:** classe `.dark` do Tailwind (preservada). Mover o root para `data-theme` quebraria TODO `dark:` do markup — **VETADO**.
- **Eixo 2 — variante de leitura:** atributo `data-theme` no `<html>` (sépia, foco, alto-contraste). Convive com `.dark` sem conflito.

Pensar assim: `.dark` responde "fundo claro ou escuro?"; `data-theme` responde "qual modo de leitura?". Um não pisa no outro.

---

## 12. TEMAS — INVENTÁRIO E QUANDO USAR CADA UM

### 12.1 Os 5 temas

| Tema | `data-theme` / classe | Base | Para que serve |
|---|---|---|---|
| **inema-dark** *(DEFAULT, = a identidade)* | `.dark`, sem `data-theme` | escuro | A marca. Tudo nasce aqui. É o contrato visual INEMA. |
| **claro** | `.dark` off | claro | Ambiente muito iluminado, impressão, preferência pessoal por light. |
| **sépia** | `data-theme="sepia"` | claro quente | Leitura longa e confortável; menos azul, menos cansaço em sessões extensas. |
| **foco** | `data-theme="foco"` | herda dark/claro | "Modo concentração": coluna estreita, prosa centralizada, cromo lateral escondido. |
| **alto-contraste** | `data-theme="contraste"` | escuro | Acessibilidade: caminho a11y principal. Texto e acentos todos AAA, bordas visíveis. |

### 12.2 Quando escolher cada tema (árvore de decisão)

```
┌─ É a experiência padrão / a marca? ............... inema-dark (não mexe)
│
├─ Aluno num ambiente claro / quer light / vai imprimir? ... claro
│
├─ Vai ler por muito tempo e quer descansar a vista? ....... sépia
│
├─ Quer eliminar distração e mergulhar num módulo? ......... foco
│
└─ Precisa de contraste máximo (baixa visão / a11y)? ....... alto-contraste
```

### 12.3 Caráter de cada tema (o "o quê é")

- **inema-dark** — premium, sóbrio, técnico. Âmbar (`--primary`) explode sobre escuro; ciano (`--accent-2`) nos links/foco. **Nunca `#000`/`#fff` puros** — sempre os cinzas calibrados (`#111827`, `#1f2937`, `#e6e6e6`). É o que comunica "ferramenta de profissional".
- **claro** — limpo, neutro, de dia. Surfaces **sólidas** (`#f8fafc`/`#f3f4f6`, **nunca gradiente** — regra de light-mode da Parte I). **Âmbar de TEXTO vira amber-700/-800**; âmbar saturado fica só decorativo (fill/borda).
- **sépia** — papel quente, baixo glare. Fundo `#FBF0D9`, texto marrom `#5F4B32`. Acento de texto = marrom escurecido ou amber-800; âmbar saturado **só** preenchimento/borda, nunca como texto.
- **foco** — mesmo esquema de cor do tema-base, **muda densidade não cor**: reduz `--measure` (coluna estreita), aumenta `--leading`, esconde stats decorativos e nav cheia, centraliza a prosa. É um recorte, não uma paleta nova.
- **alto-contraste** — escuro extremo (`--bg #0A0E14`, `--text #F5F7FA`, 18:1), âmbar e ciano em degraus AAA, **bordas visíveis em todos os cards/toggles** e anel de foco reforçado. É o caminho de acessibilidade — mais confiável que depender de `forced-colors`.

### 12.4 Regras de tema que não se quebram

- **Default é sempre inema-dark.** Tema desconhecido/erro ⇒ cai para dark (preserva a marca).
- **Cada tema declara `color-scheme: dark|light`** — conserta scrollbars, inputs e selects nativos de graça (1 linha por tema).
- **Âmbar NUNCA como TEXTO em superfície clara** (1.35:1 no sépia, 1.53:1 no branco). Vira fill/borda; texto de acento cai para `-700/-800`. (Ver §15.)
- Os temas extras **não recriam a paleta da Parte I** — herdam o vocabulário de cor de trilha; só ajustam tokens e densidade.

---

## 13. PREFERÊNCIAS DE LEITURA (o que o aluno ajusta)

Independente do tema, o aluno afina **como o texto se comporta** na prosa. Tudo vive em **CSS variables** num wrapper `.inema-prose`, em **unidades relativas** (sobrevive a zoom 200% e overrides do usuário). São 5 controles + 1 rebaixado:

| Pref | O que faz | Opções | Mecânica (resumo) |
|---|---|---|---|
| **Medida** (largura de linha) | Quão larga é a coluna de texto | `60ch` · `68ch` · `75ch` | `--measure` clampa **só a prosa** (`max-width` + `margin-inline:auto`). **Nunca** afeta code/tabelas/grids/SVG. |
| **Tamanho** (escala da fonte) | Texto maior/menor sem zoom do navegador | `100%` · `112%` · `125%` | `:root` font-size em %; o resto em `rem` escala junto. **Nunca** fixar `:root` em px. |
| **Entrelinha** | Respiro entre linhas | compacto `1.45` · confortável `1.7` | `--lh-body` multiplicador **sem unidade** (herda e sobrevive a override). |
| **Fonte** | Família do corpo | inter · system · leitura | `--font-body`. Default **Inter** (já atende). "leitura" = sans de counters abertos + spacing maior — **escolha, não default, sem prometer "resolve dislexia"**; só fontes embutidas/permitidas. |
| **Acento** | Cor de destaque dos componentes novos | 6 cores de trilha INEMA (emerald/blue/purple/amber/teal/rose) | `--accent` via `--accent-h/-s/-l`. **Travado na família INEMA** (sem color-picker livre). Em claro/sépia usa o degrau `-700/-800` p/ passar contraste. |
| ~~Densidade~~ *(rebaixado)* | espaçamento entre blocos | — | Espaçamento da Parte I é Tailwind fixo (`mb-16`,`p-8`) — não há o que multiplicar sem refactor. No MVP "densidade" = só Tamanho + Entrelinha. |

### 13.1 Princípios das preferências

- **Clampam só a prosa.** Medida e entrelinha tocam `.inema-prose`, nunca code blocks, tabelas, grids de card ou SVG (que têm geometria própria).
- **Relativas, não absolutas.** Tudo em `ch`/`rem`/multiplicador. Zoom do navegador e overrides do aluno continuam funcionando (1.4.12).
- **Globais ao aluno, não por curso.** Vivem em `inema.prefs` (cross-curso): ajustou uma vez, vale em todos os cursos. Aplicadas no load **antes do paint** (anti-FOUC).
- **Acento é escolha contida.** Só as 6 cores de trilha, nunca paleta aberta — mantém a identidade e garante contraste pré-verificado.
- **Onde o acento pega:** só componentes novos e o `<style>` à mão. Não repinta o markup Tailwind da Parte I.

### 13.2 Onde isso aparece para o aluno

Seletor de aparência **`<button>`-based** (não `<select>` frágil) na nav, **ao lado** do toggle sol/lua existente (que é **absorvido** — o eixo claro/escuro continua). Abre um painel com: os 4–5 temas + tipografia/tamanho/entrelinha + medida + paleta de acento. Estado refletido por **ícone + texto, não só cor** (1.4.1). Tudo salvo em `inema.prefs` e re-aplicado em todas as páginas.

---

## 14. MICRO-INTERAÇÕES CONTIDAS (marca sóbria, anti-manipulação)

A v2 ganha interatividade (marcar lido, highlight, jornada, conclusão), mas o movimento **não pode trair a sobriedade da Parte I**. A régua: a animação **comunica estado**, nunca **manipula** o aluno.

### 14.1 O que PODE (movimento que informa)

- **Transição curta nas CSS vars de cor** ao trocar tema — suaviza, não chama atenção.
- **Check de "lido" que preenche** — feedback de que a ação valeu.
- **Highlight que cresce no select** — confirma a seleção marcada.
- **Toast discreto de conclusão** — reconhece o marco, some sozinho.

### 14.2 O que NÃO PODE (anti-manipulação + anti-padrões herdados)

- ❌ **Confete, streak diário, badges berrantes** — gamificação infantil, pune uso em rajadas, não combina com a marca.
- ❌ **Goal-gradient agressivo / endowed progress falso** — celebração sóbria só em **100% genuíno** (`completedAt`), sem inflar barra artificialmente.
- ❌ **Scale, translate, bounce, rotate no hover** — proibidos na Parte I, continuam proibidos. Hover = só mudança de cor de borda + background levíssimo.
- ❌ **`shadow-2xl`, neon saturado, gradiente sobre gradiente** — quebram a estética flat calibrada.

### 14.3 Acessibilidade do movimento (não-negociável)

**Toda micro-interação fica sob `@media (prefers-reduced-motion: reduce)`**: zera ou encurta a animação, mas **preserva o estado final** (o "lido" ainda fica lido, o tema ainda troca — só sem a transição). Quem pediu menos movimento recebe a mesma informação, sem o movimento.

### 14.4 A régua em uma frase

> Se a animação existe para **avisar** o aluno do que aconteceu, fica. Se existe para **fazê-lo voltar/insistir** (streak, contagem regressiva, fomo), não entra. Voz quente e contida — celebra conclusão e normaliza esforço, **sem coachzinho** (coerente com o tom de voz da §6.3).

---

## 15. CONTRASTE POR TEMA (portão de qualidade)

Contraste não é polish — é **portão**. Um tema só publica depois de passar a tabela de pares. Vira item testável no `CHECKLIST_REVISAO.md`.

### 15.1 As metas

- **Texto de corpo (`--text`) sobre `--bg`:** mira **AAA 7:1** (leitura longa); piso absoluto AA 4.5:1.
- **Texto secundário (`--text-muted`):** o par que **mais falha** — verificar SEMPRE, é o primeiro a cair abaixo de 4.5:1.
- **Bordas, anel de foco, ícones:** ≥ **3:1** (componentes não-textuais, 1.4.11).

### 15.2 Valores verificados por tema

| Tema | `--text` / `--bg` | Contraste | Acentos |
|---|---|---|---|
| **inema-dark** | `#e6e6e6` / `#111827` | AAA | âmbar `#FACC15`, ciano `#38bdf8` sobre escuro |
| **claro** | `#1a1a1a` / `#ffffff` | ~16:1 (AAA) | muted piso `#6e6e6e`; **âmbar-texto → amber-700/-800** |
| **sépia** | `#5F4B32` / `#FBF0D9` | 7.31:1 (AAA) | muted `#7A6650`; acento-texto = marrom escuro/amber-800 |
| **alto-contraste** | `#F5F7FA` / `#0A0E14` | 18.02:1 | âmbar `#FACC15` (12.63:1), ciano `#38bdf8` (9.03:1) — todos AAA |

### 15.3 A regra que mais pega: âmbar como texto em superfície clara

**Âmbar saturado NUNCA é texto sobre fundo claro.** Reprovado: 1.35:1 no sépia, 1.53:1 no branco — ilegível. Nesses temas o âmbar fica **só fill/borda** (decorativo); o **texto de acento cai para `-700`/`-800`**. Em dark o âmbar-texto está liberado.

### 15.4 O portão na prática

1. Para **cada tema**, conferir `--text` e `--text-muted` sobre cada `--bg`.
2. Conferir bordas/foco/ícones ≥ 3:1.
3. Conferir que nenhum acento virou texto ilegível em superfície clara (regra §15.3).
4. **Só então** o tema entra. Falhou um par ⇒ ajusta o degrau de cor, não publica.

> Acessibilidade aqui é **contrato, não bônus** — o mesmo espírito da §4.3 do `DESIGN-SPEC.md`. Um tema bonito que reprova no contraste **não é um tema**; é um bug visual.

---

**Última revisão (Parte II):** 2026-06-14 (v2.0 — camada de temas/tokens/leitura)
**Fonte técnica:** `DESIGN-SPEC.md` §3, `LEARN-LAYER.md`
**Aplicado em:** skill `formato-curso-v2`, curso-demo
