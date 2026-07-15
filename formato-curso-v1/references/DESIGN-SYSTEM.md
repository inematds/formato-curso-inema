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
