# MASTER COMPLETO - Template de Cursos

> **DOCUMENTO UNICO DEFINITIVO** - Tudo que precisa saber para criar paginas
> **Versao:** 2.0 | **Data:** 2026-01-20

---

## INDICE

1. [ERROS CRITICOS - NUNCA COMETER](#1-erros-criticos---nunca-cometer)
2. [ESTRUTURA DO PROJETO](#2-estrutura-do-projeto)
3. [SISTEMA DE CORES](#3-sistema-de-cores)
4. [TIPOGRAFIA E TOM DE VOZ](#4-tipografia-e-tom-de-voz)
5. [NAVEGACAO GLOBAL](#5-navegacao-global)
6. [ESTRUTURA DE PAGINAS](#6-estrutura-de-paginas)
7. [COMPONENTES](#7-componentes)
8. [TEMPLATES HTML COMPLETOS](#8-templates-html-completos)
9. [JAVASCRIPT](#9-javascript)
10. [CSS OBRIGATORIO](#10-css-obrigatorio)

---

# 1. ERROS CRITICOS - NUNCA COMETER

## 1.1 BOTOES SEMPRE A ESQUERDA

```html
<!-- CORRETO -->
<div class="flex justify-start space-x-3">

<!-- ERRADO - NUNCA USAR -->
<div class="flex justify-center space-x-3">
```

## 1.2 TOPICOS COM NUMEROS EM CIRCULO (NAO SETAS!)

```html
<!-- CORRETO - Numero em circulo -->
<span class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold flex items-center justify-center">1</span>

<!-- ERRADO - Seta -->
<span class="text-emerald-400">▶</span>
```

## 1.3 TRES SECOES OBRIGATORIAS POR TOPICO

Cada topico expansivel DEVE ter estas 3 secoes:
- **O que e:** Definicao clara
- **Por que aprender:** Justificativa e beneficios
- **Conceitos-chave:** Pontos principais

## 1.4 INEMA.CLUB EM TODAS AS PAGINAS

```html
<a href="https://inema.club" target="_blank" class="text-sky-400 hover:text-sky-300 text-sm font-medium">INEMA.CLUB</a>
```
- **COR:** `text-sky-400` (azul claro)
- **POSICAO:** Ao lado do logo, separado por `|`
- **OBRIGATORIO:** Index, trilhas E modulos

## 1.5 LIGHT MODE CSS OBRIGATORIO

Adicionar em TODAS as paginas (index, trilhas E modulos). O bloco tem 4 partes:

### Parte 1 - Base (igual em todas as paginas)
```css
/* Light mode overrides - OBRIGATORIO */
html:not(.dark) body {
  background-color: #f8fafc;
}
html:not(.dark) .bg-dark-900 { background-color: #ffffff; }
html:not(.dark) .bg-dark-800 { background-color: #f9fafb; }
html:not(.dark) .bg-dark-700 { background-color: #f3f4f6; }
html:not(.dark) .bg-dark-600 { background-color: #e5e7eb; }
html:not(.dark) .text-neutral-100 { color: #111827; }
html:not(.dark) .text-neutral-300 { color: #4b5563; }
html:not(.dark) .text-neutral-400 { color: #6b7280; }
html:not(.dark) .text-neutral-500 { color: #9ca3af; }
html:not(.dark) .border-dark-600 { border-color: #d1d5db; }
html:not(.dark) .border-dark-700 { border-color: #e5e7eb; }
```

**IMPORTANTE:** Fundo do body e cor SOLIDA `#f8fafc`. NAO usar gradiente — causa manchas desiguais.

### Parte 2 - Cores de acento da trilha (variam por trilha)

Cada pagina deve incluir overrides para a cor da sua trilha. Usar versoes mais escuras para contraste adequado em fundo claro:

| Trilha | Cor dark | Cor light mode | rgb para bg/border |
|--------|----------|----------------|-------------------|
| T1 Emerald | `emerald-400` | `#059669` (emerald-600) | `5, 150, 105` |
| T2 Blue | `blue-400` | `#2563eb` (blue-600) | `37, 99, 235` |
| T3 Purple | `purple-400` | `#7c3aed` (violet-600) | `124, 58, 237` |
| T4 Amber | `amber-400` | `#92400e` (amber-800) | `217, 119, 6` |
| T5 Teal | `teal-400` | `#0d9488` (teal-600) | `13, 148, 136` |
| T6 Rose | `rose-400` | `#9f1239` (rose-800) | `225, 29, 72` |

Exemplo para trilha emerald (T1):
```css
/* Light mode - cores de acento (trilha emerald) */
html:not(.dark) .text-emerald-400 { color: #059669; }
html:not(.dark) .bg-emerald-500\/20 { background-color: rgba(5, 150, 105, 0.12); }
html:not(.dark) .bg-emerald-500\/10 { background-color: rgba(5, 150, 105, 0.08); }
html:not(.dark) .border-emerald-500\/30 { border-color: rgba(5, 150, 105, 0.25); }
html:not(.dark) .hover\:bg-emerald-500\/30:hover { background-color: rgba(5, 150, 105, 0.18); }
```

Para as outras trilhas, substituir emerald pela cor correspondente e usar os valores rgb da tabela acima.

### Parte 3 - Remove gradientes e cores especiais (igual em todas)
```css
/* Light mode - remove gradientes (fundo uniforme) */
html:not(.dark) [class*="bg-gradient-to"] { background-image: none !important; }

/* Light mode - cores especiais */
html:not(.dark) .text-primary { color: #a16207; }
html:not(.dark) .bg-primary\/10 { background-color: rgba(161, 98, 7, 0.08); }
html:not(.dark) .border-primary\/40 { border-color: rgba(161, 98, 7, 0.25); }
html:not(.dark) .text-sky-400 { color: #0369a1; }
html:not(.dark) .text-yellow-400 { color: #a16207; }
html:not(.dark) .hover\:text-sky-300:hover { color: #0284c7; }
html:not(.dark) .hover\:text-yellow-300:hover { color: #854d0e; }
```

### Parte 4 - Navbar (igual em todas)
```css
/* Light mode - nav */
html:not(.dark) .bg-dark-900\/95 { background-color: rgba(255, 255, 255, 0.95); }
```

### Parte 5 - Bordas suavizadas no DARK MODE (OBRIGATORIO)

Sem isso, `border-dark-600` (`#4b5563`) fica ofuscante contra `bg-dark-800` (`#1f2937`). Aplicar em TODAS as paginas:

```css
/* Dark mode - bordas e linhas divisorias mais suaves */
.dark .border-dark-600 { border-color: #374151; }
.dark .divide-dark-600 > :not([hidden]) ~ :not([hidden]) { border-color: #374151; }
```

`divide-dark-600` afeta as linhas entre topicos dentro dos cards (`divide-y divide-dark-600`). Sem essa segunda regra, as bordas dos cards ficam suaves mas as linhas internas continuam fortes — inconsistente.

**NAO mexer em `bg-dark-600`** — esta classe e usada para fundos de elementos (theme toggle hover, etc.) e deve manter `#4b5563`.

### Landing page (index.html principal)

A landing page usa cores de TODAS as trilhas. Incluir overrides de todas as 6 cores, mais hover e group-hover:
```css
html:not(.dark) .hover\:text-emerald-400:hover { color: #059669; }
html:not(.dark) .hover\:bg-emerald-500\/10:hover { background-color: rgba(5, 150, 105, 0.08); }
html:not(.dark) .group:hover .group-hover\:text-emerald-400 { color: #059669; }
/* Repetir para blue, purple, amber, teal, rose com seus valores */
```

## 1.6 NAV COMPLETO EM TODAS AS PAGINAS (NUNCA SIMPLIFICAR)

O `<nav>` do landing tem o menu completo: Logo + INEMA.CLUB + 4-6 botoes de trilha + theme toggle. Esse nav DEVE aparecer IDENTICO em:
- `index.html` (landing)
- `curso/index.html`
- TODOS os `curso/trilhaX/index.html`
- TODOS os `curso/trilhaX/modulo-X-Y.html`

NUNCA usar nav simplificado tipo `← Trilha X | Curso` nas paginas internas. O usuario perde a navegacao lateral entre trilhas. A trilha ATIVA fica destacada na cor dela; as demais ficam neutras com hover.

## 1.7 DIVISOR "Conteudo detalhado" — H2 SIMPLES

Usar `<h2 class="text-2xl font-bold mb-6">Conteudo detalhado</h2>`.

NAO usar o divisor ornado de 2 linhas + span:
```html
<!-- ERRADO -->
<div class="flex items-center space-x-4 mb-10">
  <div class="flex-1 h-px bg-dark-600"></div>
  <span class="text-sm text-neutral-400 font-medium">Conteudo detalhado</span>
  <div class="flex-1 h-px bg-dark-600"></div>
</div>
```

## 1.8 PROFUNDIDADE MINIMA DOS MODULOS

Pagina de modulo (`modulo-X-Y.html`) DEVE ter conteudo denso, nao template repetido:
- 500-800 linhas HTML
- 6-8 secoes (`<section id="topico-N">`)
- VARIEDADE de componentes ao longo das secoes:
  - ≥2 secoes com grid ✓/✗ (`bg-red-900/20` vs `bg-emerald-900/20`)
  - ≥1 secao com timeline (`w-10 h-10 rounded-full + card`)
  - ≥2 secoes com tip box (`bg-primary/10 border-primary/30`)
  - ≥1 secao com codigo/monospace box (`font-mono text-sm`) quando relevante
  - Cada secao termina com grid "Conceitos-chave" (4 mini-cards)

NUNCA gerar 6 secoes identicas com o mesmo padrao "O que é / Por que / Conceitos-chave" como template repetido — isso e o sintoma de modulo raso. Variar componentes.

## 1.9 TITULO DO MODULO COM TEXT-2XL

```html
<!-- CORRETO -->
<h3 class="text-2xl font-bold mb-2">Titulo do Modulo</h3>

<!-- ERRADO - muito pequeno -->
<h3 class="text-lg font-bold mb-2">Titulo do Modulo</h3>
```

## 1.10 SVG FUTURISTA OBRIGATORIO

Cada **pagina de modulo de conteudo** (`modulo-X-Y.html`, exceto exercicios e prompts) DEVE conter **pelo menos 1 diagrama SVG inline** que ilustre um conceito do modulo. Cada **index de trilha** DEVE conter **1 hero SVG** no header.

- **Estilo:** limpo, futurista — cantos arredondados, glow neon, grid de pontos. NAO usar estilo "hand-drawn" (fonte cursiva, filtro de rabisco).
- **Cores:** cor PRIMARIA = a cor da trilha; cor SECUNDARIA (agentes, ramo paralelo, fluxo de volta) = ciano `#38bdf8`.
- **Tecnica:** SVG **inline** (nunca `<img>` externo), `viewBox` + `class="w-full h-auto"`, `role="img"` + `aria-label`, `font-family="Inter,sans-serif"`, `id`s de defs prefixados por modulo. Envolver em painel `rounded-2xl border border-<cor>-500/30 bg-dark-900/40`.
- **Animacao:** opcional, e SOMENTE dentro de `@media (prefers-reduced-motion: no-preference)`.
- **Intensidade contida (PADRAO):** glow leve `feGaussianBlur stdDeviation="1.8"` e SO na caixa-foco; titulos do SVG `font-weight="600"` (nao 700 em massa); caixas `stroke-width="2"`; e adaptar ao tema claro com `html:not(.dark) svg[role="img"] { filter: saturate(0.82) brightness(0.96); }`. Ver Principio 8 em `references/SVG-FUTURISTA.md`.
- **Tela/dashboard:** representar com **mock HTML** estilizado rotulado como "ilustrativo", NUNCA como screenshot real.

**Catalogo de primitivos e snippets copia-e-cola:** `references/SVG-FUTURISTA.md`. Exemplos canonicos renderizados: `curso/trilha4/` do projeto opus48.

Exercicios (`-6`) e prompts (`-7`): SVG e opcional (use quando agregar, ex.: fluxo de decisao).

---

# 2. ESTRUTURA DO PROJETO

## 2.1 Estrutura Padrao

```
[NOME DO CURSO]
├── [EMOJI DO CURSO]
├── X Trilhas (definir quantidade)
│   ├── T1: [Nome] (Emerald) - X modulos
│   ├── T2: [Nome] (Blue) - X modulos
│   ├── T3: [Nome] (Purple) - X modulos
│   ├── T4: [Nome] (Amber) - X modulos (opcional)
│   ├── T5: [Nome] (Teal) - X modulos (opcional)
│   └── T6: [Nome] (Rose) - X modulos (opcional)
├── Total de Modulos
├── EXATAMENTE 6 Topicos por Modulo
└── Total de Topicos
```

## 2.2 Estrutura de Arquivos

```
projeto/
├── index.html                    # Landing page
├── curso/
│   ├── trilha1/                  # Primeira trilha
│   │   ├── index.html            # Index da trilha
│   │   ├── modulo-1-1.html       # Modulo completo
│   │   ├── modulo-1-2.html
│   │   └── ...
│   ├── trilha2/
│   ├── trilha3/
│   └── ...
├── doc/                          # Documentacao
└── ref/                          # Referencias detalhadas
```

---

# 3. SISTEMA DE CORES

## 3.1 Cores por Trilha

| Trilha | Cor | text-* | bg-*/20 | border-*/30 | from-*/30 |
|--------|-----|--------|---------|-------------|-----------|
| T1 | Emerald | `text-emerald-400` | `bg-emerald-500/20` | `border-emerald-500/30` | `from-emerald-900/30` |
| T2 | Blue | `text-blue-400` | `bg-blue-500/20` | `border-blue-500/30` | `from-blue-900/30` |
| T3 | Purple | `text-purple-400` | `bg-purple-500/20` | `border-purple-500/30` | `from-purple-900/30` |
| T4 | Amber | `text-amber-400` | `bg-amber-500/20` | `border-amber-500/30` | `from-amber-900/30` |
| T5 | Teal | `text-teal-400` | `bg-teal-500/20` | `border-teal-500/30` | `from-teal-900/30` |
| T6 | Rose | `text-rose-400` | `bg-rose-500/20` | `border-rose-500/30` | `from-rose-900/30` |

## 3.2 Cores Especiais

| Cor | Codigo | Classe | Uso |
|-----|--------|--------|-----|
| Primary (Yellow) | `#FACC15` | `text-primary`, `bg-primary` | Logo, CTAs, destaques, dicas |
| Sky | `#38bdf8` | `text-sky-400` | Link INEMA.CLUB |
| Red | `#f87171` | `text-red-400` | "Nao fazer", erros, alertas |
| Neutral 300 | `#d4d4d4` | `text-neutral-300` | Texto principal |
| Neutral 400 | `#a3a3a3` | `text-neutral-400` | Texto secundario |

## 3.3 Paleta Dark Mode

| Nome | Codigo | Classe | Uso |
|------|--------|--------|-----|
| dark-900 | `#111827` | `bg-dark-900` | Fundo principal |
| dark-800 | `#1f2937` | `bg-dark-800` | Cards, containers |
| dark-700 | `#374151` | `bg-dark-700` | Elementos internos |
| dark-600 | `#4b5563` | `bg-dark-600` | Bordas, divisores |

## 3.4 Paleta Light Mode

### Base
| Nome | Codigo | Uso |
|------|--------|-----|
| slate-50 | `#f8fafc` | Fundo body (cor SOLIDA, sem gradiente) |
| white | `#ffffff` | Fundo principal (dark-900) |
| gray-50 | `#f9fafb` | Cards (dark-800) |
| gray-100 | `#f3f4f6` | Elementos (dark-700) |
| gray-200 | `#e5e7eb` | Bordas (dark-600) |

### Cores de acento (versoes escuras para light mode)
| Trilha | Dark mode | Light mode | Nota |
|--------|-----------|------------|------|
| T1 Emerald | `#34d399` | `#059669` | emerald-600 |
| T2 Blue | `#60a5fa` | `#2563eb` | blue-600 |
| T3 Purple | `#c084fc` | `#7c3aed` | violet-600 |
| T4 Amber | `#fbbf24` | `#92400e` | amber-800 (laranja muito intenso em -600) |
| T5 Teal | `#2dd4bf` | `#0d9488` | teal-600 |
| T6 Rose | `#fb7185` | `#9f1239` | rose-800 (vermelho muito forte em -600) |

### Cores especiais (versoes escuras para light mode)
| Cor | Dark mode | Light mode |
|-----|-----------|------------|
| Primary (Yellow) | `#FACC15` | `#a16207` (amber-700) |
| Sky (INEMA.CLUB) | `#38bdf8` | `#0369a1` (sky-700) |
| Yellow (logo) | `#facc15` | `#a16207` (amber-700) |

### Gradientes
Gradientes sao REMOVIDOS no light mode com: `html:not(.dark) [class*="bg-gradient-to"] { background-image: none !important; }`

---

# 4. TIPOGRAFIA E TOM DE VOZ

## 4.1 Fonte

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

```css
body { font-family: 'Inter', sans-serif; }
```

## 4.2 Hierarquia

| Elemento | Classes | Uso |
|----------|---------|-----|
| H1 (Hero) | `text-4xl sm:text-5xl font-bold` | Titulo principal da pagina |
| H2 (Section) | `text-2xl font-bold` | Titulos de secao, topicos |
| H3 (Subsection) | `text-xl font-bold` ou `text-lg font-semibold` | Subtitulos, boxes |
| Body | `text-neutral-300` | Texto principal |
| Secondary | `text-neutral-400` | Texto secundario |
| Small | `text-sm text-neutral-400` | Legendas, metadados |

## 4.3 Tom de Voz

- **Direto e pratico:** Sem enrolacao, vai ao ponto
- **Profissional:** Foco em aplicacao empresarial
- **Confiante:** Afirmacoes claras, sem "talvez" ou "pode ser"
- **Didatico:** Explicacoes passo a passo

## 4.4 Estrutura de Paragrafos

- **Maximo 3-4 linhas** por paragrafo
- **Primeira frase:** Conceito principal
- **Destaque:** Palavra-chave em **negrito** ou cor da trilha

## 4.5 Uso de Listas

- **Bullets:** Para itens sem ordem especifica
- **Numeros (1, 2, 3):** Para passos sequenciais
- **Check/X:** Para fazer/nao fazer

---

# 5. NAVEGACAO GLOBAL

## 5.1 Elementos Obrigatorios

1. **Logo** (emoji + nome) - `text-yellow-400`
2. **Link INEMA.CLUB** - `text-sky-400`
3. **Trilhas** com nomes completos (mobile: T1, T2, T3...)
4. **Theme Toggle** - botao dark/light

## 5.2 Template Navigation

```html
<nav class="sticky top-0 z-50 bg-dark-900/95 backdrop-blur-sm border-b border-dark-600">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-14">
      <!-- Logo + INEMA.CLUB -->
      <div class="flex items-center space-x-4">
        <a href="../../index.html" class="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300">
          <span class="text-2xl">[EMOJI]</span>
          <span class="font-bold text-lg hidden sm:inline">[NOME DO CURSO]</span>
        </a>
        <span class="text-neutral-600">|</span>
        <a href="https://inema.club" target="_blank" class="text-sky-400 hover:text-sky-300 text-sm font-medium">INEMA.CLUB</a>
      </div>

      <!-- Trilhas + Theme Toggle -->
      <div class="flex items-center space-x-1 sm:space-x-2">
        <!-- Trilha 1 (ativa) -->
        <a href="index.html" class="px-3 py-1.5 rounded-lg text-sm font-semibold text-emerald-400 bg-emerald-500/10">
          <span class="sm:hidden">T1</span>
          <span class="hidden sm:inline">[Nome Trilha 1]</span>
        </a>
        <!-- Trilha 2 (inativa) -->
        <a href="../trilha2/index.html" class="px-3 py-1.5 rounded-lg text-sm font-semibold text-neutral-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
          <span class="sm:hidden">T2</span>
          <span class="hidden sm:inline">[Nome Trilha 2]</span>
        </a>
        <!-- Adicionar mais trilhas conforme necessario -->

        <!-- Theme Toggle -->
        <button id="theme-toggle" class="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors ml-2">
          <svg id="theme-toggle-dark-icon" class="hidden w-5 h-5 text-neutral-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
          </svg>
          <svg id="theme-toggle-light-icon" class="hidden w-5 h-5 text-neutral-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</nav>
```

## 5.3 Cores dos Links de Trilha

| Estado | Classes |
|--------|---------|
| Ativo | `text-[cor]-400 bg-[cor]-500/10` |
| Inativo | `text-neutral-400 hover:text-[cor]-400 hover:bg-[cor]-500/10 transition-colors` |

---

# 6. ESTRUTURA DE PAGINAS

## 6.1 Pagina de Trilha (Index)

```
TRILHA INDEX
├── Navigation Global
│   ├── Logo (emoji + nome) - yellow-400
│   ├── INEMA.CLUB - sky-400
│   ├── Trilhas (nomes completos, cor da ativa)
│   └── Theme Toggle
├── Header com Gradiente
│   ├── Badge (TRILHA X) - cor da trilha
│   ├── Titulo + emoji
│   ├── Descricao
│   └── Stats Grid (4 colunas: Modulos, Topicos, Duracao, Nivel)
├── Mapa da trilha (grid de cards-ancora) - OBRIGATORIO (ver 7.4b)
├── h2 "Conteudo detalhado" (text-2xl font-bold mb-6) - SEM divisor ornado
├── Cards de Modulo (repetido)
│   ├── Header
│   │   ├── Numero do modulo (X.X) - cor da trilha
│   │   ├── Duracao (~XX min)
│   │   ├── Titulo com emoji - TEXT-2XL
│   │   └── Descricao
│   ├── Topicos Expansiveis (6-8 por modulo)
│   │   ├── NUMERO em circulo (NAO seta)
│   │   ├── Emoji + titulo + subtitulo
│   │   └── 3 secoes: O que e / Por que / Conceitos
│   └── Botoes (ESQUERDA - justify-start)
│       ├── Ver em Modal
│       └── Ver Completo
├── Navegacao (Voltar | Proxima Trilha)
└── Footer
```

## 6.2 Pagina de Modulo

```
MODULO COMPLETO
├── Navigation Global (identico ao index)
├── Breadcrumb (Inicio / Trilha X / Modulo X.X)
├── Header
│   ├── Badge (MODULO X.X)
│   ├── Titulo + emoji
│   ├── Descricao
│   └── Stats (Topicos, Minutos, Nivel, Tipo)
├── Topicos (6 secoes ricas)
│   └── Section por topico
│       ├── Numero em circulo GRANDE (w-12 h-12)
│       ├── Titulo h2
│       ├── Paragrafo introdutorio
│       └── Boxes variados:
│           ├── Conceito Principal (gradiente da trilha)
│           ├── Dados/Pesquisa (blue)
│           ├── Dica Pratica (primary/yellow)
│           ├── Grid Fazer vs Evitar (emerald/red)
│           ├── Timeline de casos/passos
│           └── Box de alerta (red) - quando necessario
├── Resumo Final
│   ├── Checklist do que aprendemos
│   ├── Proximo modulo
│   └── CTAs de navegacao
└── Footer
```

## 6.3 Espacamento Padrao

| Classe | Uso |
|--------|-----|
| `mb-16` | Entre secoes principais (topicos) |
| `mb-12` | Antes do resumo final |
| `mb-8` | Entre grupos de conteudo |
| `mb-6` | Entre boxes dentro de secao |
| `mb-4` | Entre elementos menores |
| `p-8` | Padding de cards principais |
| `p-6` | Padding de boxes internos |
| `p-4` | Padding de elementos menores |
| `gap-4` | Grid de stats |
| `gap-6` | Grid de comparacao |

---

# 7. COMPONENTES

## 7.1 Numero em Circulo

**Pequeno (topicos expansiveis):**
```html
<span class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold flex items-center justify-center flex-shrink-0">1</span>
```

**Grande (secoes de modulo):**
```html
<span class="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xl">1</span>
```

## 7.2 Topico Expansivel com 3 Secoes

```html
<div class="topic-item">
  <button onclick="toggleTopic(this)" class="w-full px-6 py-4 flex items-center space-x-3 hover:bg-dark-700/50 transition-colors text-left">
    <span class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold flex items-center justify-center flex-shrink-0">1</span>
    <span class="text-lg">[EMOJI]</span>
    <div>
      <span class="font-medium">Titulo do Topico</span>
      <span class="text-neutral-500 text-sm ml-2">- Subtitulo</span>
    </div>
  </button>
  <div class="topic-explanation px-6 pb-4">
    <div class="bg-dark-700/50 rounded-lg p-4 space-y-3 ml-9">
      <div>
        <span class="text-emerald-400 font-semibold">O que e:</span>
        <p class="text-neutral-300 text-sm">Definicao clara e objetiva.</p>
      </div>
      <div>
        <span class="text-emerald-400 font-semibold">Por que aprender:</span>
        <p class="text-neutral-300 text-sm">Justificativa e beneficios praticos.</p>
      </div>
      <div>
        <span class="text-emerald-400 font-semibold">Conceitos-chave:</span>
        <p class="text-neutral-300 text-sm">Pontos principais a memorizar.</p>
      </div>
    </div>
  </div>
</div>
```

## 7.3 Card do Modulo

```html
<div class="bg-dark-800 rounded-xl border border-dark-600 mb-6">
  <!-- Header do Modulo -->
  <div class="p-6 border-b border-dark-600">
    <div class="flex items-center justify-between mb-2">
      <span class="text-emerald-400 font-bold">1.1</span>
      <span class="text-xs text-neutral-500">~30 min</span>
    </div>
    <h3 class="text-2xl font-bold mb-2">[EMOJI] Titulo do Modulo</h3>
    <p class="text-neutral-400 text-sm">Descricao breve do modulo.</p>
  </div>

  <!-- Topicos Expansiveis -->
  <div class="divide-y divide-dark-600">
    <!-- Topicos aqui -->
  </div>

  <!-- Botoes (ESQUERDA!) -->
  <div class="p-4 bg-dark-700/30 flex justify-start space-x-3">
    <button onclick="openModal('modal-1-1')" class="px-4 py-2 text-sm bg-dark-600 hover:bg-dark-500 rounded-lg transition-colors">
      Ver em Modal
    </button>
    <a href="modulo-1-1.html" class="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors">
      Ver Completo
    </a>
  </div>
</div>
```

## 7.4 Header de Trilha

```html
<header class="bg-gradient-to-br from-emerald-900/30 via-dark-800 to-dark-800 py-12 border-b border-dark-600">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <span class="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full mb-4">
      TRILHA 1
    </span>
    <h1 class="text-3xl sm:text-4xl font-bold mb-4">[EMOJI] [Nome da Trilha]</h1>
    <p class="text-lg text-neutral-400 max-w-3xl">
      Descricao da trilha aqui...
    </p>

    <!-- Stats Grid -->
    <div class="grid grid-cols-4 gap-4 mt-8 max-w-2xl">
      <div class="bg-dark-800/50 rounded-lg p-3 border border-dark-600">
        <div class="text-xl font-bold text-emerald-400">8</div>
        <div class="text-xs text-neutral-400">Modulos</div>
      </div>
      <div class="bg-dark-800/50 rounded-lg p-3 border border-dark-600">
        <div class="text-xl font-bold text-emerald-400">48</div>
        <div class="text-xs text-neutral-400">Topicos</div>
      </div>
      <div class="bg-dark-800/50 rounded-lg p-3 border border-dark-600">
        <div class="text-xl font-bold text-emerald-400">~4h</div>
        <div class="text-xs text-neutral-400">Duracao</div>
      </div>
      <div class="bg-dark-800/50 rounded-lg p-3 border border-dark-600">
        <div class="text-xl font-bold text-emerald-400">Basico</div>
        <div class="text-xs text-neutral-400">Nivel</div>
      </div>
    </div>
  </div>
</header>
```

## 7.4b Mapa da trilha (OBRIGATORIA no index da trilha)

**Nome OFICIAL:** "Mapa da trilha". NUNCA usar "Navegacao Rapida" ou variantes — alinhamento com padrao Agentic OS / INEMA.CLUB.

**Localizacao:** entre o header da trilha e a secao "Conteudo detalhado".

**Por que e obrigatoria:** sem esse sumario visual, o usuario tem que rolar tudo para ver o que a trilha cobre. E o "indice" da trilha. Esquecer este componente e o erro mais comum em paginas de trilha.

**Estrutura:** grid responsivo de cards-ancora (1 por modulo). Cada card e um link `<a href="#modulo-X-Y">` para a secao correspondente abaixo. Card MENOR que o card grande de modulo.

**Layout do card (REGRAS RIGIDAS):**
- Header com `justify-between`: numero "X.Y" (cor da trilha) na ESQUERDA, duracao "~XX min" (text-neutral-500) na DIREITA
- NUNCA usar circulo numerado adicional (`w-8 h-8 rounded-full ...`) — o "X.Y" ja indica posicao, circulo extra e info duplicada
- h3 com EMOJI prefixado: `🎯 Titulo curto`
- Subtitulo PUNCHY / FRASE-MARCA (3-5 palavras max), nao descritivo. Ex: "Persistência vs sessão", "90,2% melhor que solo", "Uma chave, todos os modelos" — NAO: "Instalação, setup inicial e verificação"

```html
<section class="mb-12">
  <h2 class="text-2xl font-bold mb-6">Mapa da trilha</h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <a href="#modulo-1-1" class="group bg-dark-800 rounded-xl border border-dark-600 hover:border-emerald-500/30 p-5 transition-all">
      <div class="flex items-center justify-between mb-2">
        <span class="text-emerald-400 font-bold text-sm">1.1</span>
        <span class="text-xs text-neutral-500">~50 min</span>
      </div>
      <h3 class="font-semibold mb-1 group-hover:text-emerald-400 transition-colors">[EMOJI] Titulo curto do modulo</h3>
      <p class="text-xs text-neutral-400">Subtitulo de 1 linha</p>
    </a>
    <!-- repetir para cada modulo da trilha -->
  </div>
</section>
```

**IMPORTANTE:** Cada card grande de modulo abaixo precisa ter `id="modulo-X-Y"` no elemento exterior para a ancora funcionar.

```html
<div id="modulo-1-1" class="bg-dark-800 rounded-xl border border-dark-600 mb-6">
  <!-- ... -->
</div>
```

## 7.5 Header de Modulo

```html
<header class="bg-gradient-to-br from-emerald-900/30 via-dark-800 to-dark-800 py-12 border-b border-dark-600">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <span class="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full mb-4">
      MODULO 1.1
    </span>
    <h1 class="text-3xl sm:text-4xl font-bold mb-4">[EMOJI] Titulo do Modulo</h1>
    <p class="text-lg text-neutral-400 max-w-3xl">Descricao do modulo...</p>

    <!-- Stats Banner -->
    <div class="grid grid-cols-4 gap-4 mt-8 max-w-2xl">
      <div class="bg-dark-800/50 rounded-lg p-3 border border-dark-600">
        <div class="text-xl font-bold text-emerald-400">6</div>
        <div class="text-xs text-neutral-400">Topicos</div>
      </div>
      <div class="bg-dark-800/50 rounded-lg p-3 border border-dark-600">
        <div class="text-xl font-bold text-emerald-400">30</div>
        <div class="text-xs text-neutral-400">Minutos</div>
      </div>
      <div class="bg-dark-800/50 rounded-lg p-3 border border-dark-600">
        <div class="text-xl font-bold text-emerald-400">Basico</div>
        <div class="text-xs text-neutral-400">Nivel</div>
      </div>
      <div class="bg-dark-800/50 rounded-lg p-3 border border-dark-600">
        <div class="text-xl font-bold text-emerald-400">Teoria</div>
        <div class="text-xs text-neutral-400">Tipo</div>
      </div>
    </div>
  </div>
</header>
```

## 7.6 Breadcrumb

```html
<nav class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
  <div class="flex items-center space-x-2 text-sm text-neutral-400">
    <a href="../../index.html" class="hover:text-emerald-400">Inicio</a>
    <span>/</span>
    <a href="index.html" class="hover:text-emerald-400">Trilha 1</a>
    <span>/</span>
    <span class="text-emerald-400">Modulo 1.1</span>
  </div>
</nav>
```

## 7.7 Secao de Topico (Pagina de Modulo)

```html
<section id="topico-1" class="mb-16">
  <div class="flex items-center space-x-4 mb-6">
    <span class="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xl">1</span>
    <h2 class="text-2xl font-bold">[EMOJI] Titulo do Topico</h2>
  </div>

  <p class="text-neutral-300 mb-6 leading-relaxed">
    Paragrafo introdutorio com <strong class="text-emerald-400">destaque</strong> nas palavras importantes...
  </p>

  <!-- Boxes de conteudo aqui -->
</section>
```

## 7.8 Box Conceito Principal

```html
<div class="bg-gradient-to-br from-emerald-900/30 to-dark-800 rounded-xl border border-emerald-500/30 p-6 mb-6">
  <h3 class="text-lg font-semibold text-emerald-400 mb-4 flex items-center">
    <span class="mr-2">[EMOJI]</span> Titulo
  </h3>
  <p class="text-neutral-300 mb-4">Texto explicativo...</p>
  <ul class="space-y-2 text-neutral-300">
    <li class="flex items-start space-x-2">
      <span class="text-emerald-400 mt-1">•</span>
      <span>Item da lista</span>
    </li>
  </ul>
</div>
```

## 7.9 Box Dados/Pesquisa

```html
<div class="bg-blue-900/20 rounded-xl border border-blue-500/30 p-6 mb-6">
  <h3 class="text-lg font-semibold text-blue-400 mb-4 flex items-center">
    <span class="mr-2">[EMOJI]</span> Dados de Pesquisa
  </h3>
  <ul class="space-y-2 text-neutral-300">
    <li><strong>XX%</strong> - Estatistica importante</li>
  </ul>
</div>
```

## 7.10 Box Dica Pratica

```html
<div class="bg-primary/10 rounded-xl border border-primary/30 p-6 mb-6">
  <h3 class="text-lg font-semibold text-primary mb-3 flex items-center">
    <span class="mr-2">[EMOJI]</span> Dica Pratica
  </h3>
  <p class="text-neutral-300">Texto da dica...</p>
</div>
```

## 7.11 Grid Fazer vs Evitar

```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  <div class="bg-emerald-900/20 rounded-xl border border-emerald-500/30 p-6">
    <h4 class="font-bold text-emerald-400 mb-4">✓ O que FAZER</h4>
    <ul class="space-y-3 text-neutral-300">
      <li class="flex items-start space-x-2">
        <span class="text-emerald-400">✓</span>
        <span>Item positivo</span>
      </li>
    </ul>
  </div>
  <div class="bg-red-900/20 rounded-xl border border-red-500/30 p-6">
    <h4 class="font-bold text-red-400 mb-4">✗ O que NAO fazer</h4>
    <ul class="space-y-3 text-neutral-300">
      <li class="flex items-start space-x-2">
        <span class="text-red-400">✗</span>
        <span>Item negativo</span>
      </li>
    </ul>
  </div>
</div>
```

## 7.12 Timeline

```html
<div class="space-y-6 mb-6">
  <div class="flex items-start space-x-4">
    <div class="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
      <span class="text-emerald-400 font-bold">1</span>
    </div>
    <div class="flex-1 bg-dark-800 rounded-xl p-6 border border-dark-600">
      <h4 class="font-semibold text-white mb-2">Titulo do Passo</h4>
      <p class="text-sm text-neutral-400 mb-3">Contexto</p>
      <p class="text-neutral-300 text-sm">Descricao detalhada...</p>
    </div>
  </div>
</div>
```

## 7.13 Box de Alerta

```html
<div class="bg-red-900/20 rounded-xl border border-red-500/30 p-6 mb-6">
  <h3 class="text-lg font-semibold text-red-400 mb-3 flex items-center">
    <span class="mr-2">[EMOJI]</span> Atencao
  </h3>
  <p class="text-neutral-300">Texto de alerta...</p>
</div>
```

## 7.14 Resumo do Modulo

```html
<section class="mb-12">
  <div class="bg-gradient-to-br from-emerald-900/40 via-dark-800 to-dark-800 rounded-xl border border-emerald-500/30 p-8">
    <h2 class="text-2xl font-bold mb-6 flex items-center">
      <span class="mr-3">[EMOJI]</span> Resumo do Modulo
    </h2>

    <div class="space-y-4 mb-8">
      <div class="flex items-start space-x-3">
        <span class="text-emerald-400 mt-1">✓</span>
        <div>
          <strong class="text-white">Ponto principal</strong>
          <span class="text-neutral-400"> - Explicacao breve</span>
        </div>
      </div>
      <!-- Mais pontos... -->
    </div>

    <div class="bg-dark-800/50 rounded-lg p-4 mb-8">
      <h3 class="font-semibold text-emerald-400 mb-2">Proximo Modulo:</h3>
      <p class="text-neutral-300">1.2 - Titulo do Proximo Modulo</p>
    </div>

    <div class="flex flex-col sm:flex-row gap-4">
      <a href="index.html" class="flex-1 text-center px-6 py-3 bg-dark-700 text-neutral-300 rounded-lg font-semibold hover:bg-dark-600 transition-colors">
        ← Voltar para Trilha
      </a>
      <a href="modulo-1-2.html" class="flex-1 text-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-500 transition-colors">
        Proximo Modulo →
      </a>
    </div>
  </div>
</section>
```

---

# 8. TEMPLATES HTML COMPLETOS

## 8.1 Base HTML (usar em TODAS as paginas)

```html
<!DOCTYPE html>
<html lang="pt-BR" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Titulo] | [Nome do Curso]</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: '#FACC15',
            dark: { 900: '#111827', 800: '#1f2937', 700: '#374151', 600: '#4b5563' }
          }
        }
      }
    }
  </script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
    .dark body { background-color: #111827; }
    .topic-explanation { display: none; }
    .topic-explanation.active { display: block; }

    /* Light mode overrides - OBRIGATORIO */
    html:not(.dark) body { background-color: #f8fafc; }
    html:not(.dark) .bg-dark-900 { background-color: #ffffff; }
    html:not(.dark) .bg-dark-800 { background-color: #f9fafb; }
    html:not(.dark) .bg-dark-700 { background-color: #f3f4f6; }
    html:not(.dark) .bg-dark-600 { background-color: #e5e7eb; }
    html:not(.dark) .text-neutral-100 { color: #111827; }
    html:not(.dark) .text-neutral-300 { color: #4b5563; }
    html:not(.dark) .text-neutral-400 { color: #6b7280; }
    html:not(.dark) .text-neutral-500 { color: #9ca3af; }
    html:not(.dark) .border-dark-600 { border-color: #d1d5db; }
    html:not(.dark) .border-dark-700 { border-color: #e5e7eb; }

    /* Light mode - cores de acento (SUBSTITUIR pela cor da trilha - ver Sec. 1.5) */
    html:not(.dark) .text-COR-400 { color: VALOR_LIGHT; }
    html:not(.dark) .bg-COR-500\/20 { background-color: rgba(R, G, B, 0.12); }
    html:not(.dark) .bg-COR-500\/10 { background-color: rgba(R, G, B, 0.08); }
    html:not(.dark) .border-COR-500\/30 { border-color: rgba(R, G, B, 0.25); }
    html:not(.dark) .hover\:bg-COR-500\/30:hover { background-color: rgba(R, G, B, 0.18); }

    /* Light mode - remove gradientes (fundo uniforme) */
    html:not(.dark) [class*="bg-gradient-to"] { background-image: none !important; }

    /* Light mode - cores especiais */
    html:not(.dark) .text-primary { color: #a16207; }
    html:not(.dark) .bg-primary\/10 { background-color: rgba(161, 98, 7, 0.08); }
    html:not(.dark) .border-primary\/40 { border-color: rgba(161, 98, 7, 0.25); }
    html:not(.dark) .text-sky-400 { color: #0369a1; }
    html:not(.dark) .text-yellow-400 { color: #a16207; }
    html:not(.dark) .hover\:text-sky-300:hover { color: #0284c7; }
    html:not(.dark) .hover\:text-yellow-300:hover { color: #854d0e; }

    /* Light mode - nav */
    html:not(.dark) .bg-dark-900\/95 { background-color: rgba(255, 255, 255, 0.95); }
  </style>
</head>
<body class="bg-dark-900 text-neutral-100 min-h-screen">

  <!-- NAVIGATION -->
  <nav class="sticky top-0 z-50 bg-dark-900/95 backdrop-blur-sm border-b border-dark-600">
    <!-- Ver secao 5.2 -->
  </nav>

  <!-- CONTEUDO -->
  <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Conteudo aqui -->
  </main>

  <!-- FOOTER -->
  <footer class="border-t border-dark-600 py-8 mt-16">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-neutral-500 text-sm">
      <p>[Nome do Curso] - [Ano]</p>
    </div>
  </footer>

  <!-- SCRIPTS -->
  <script>
    // Ver secao 9
  </script>

</body>
</html>
```

---

# 9. JAVASCRIPT

## 9.1 Toggle de Topicos

```javascript
function toggleTopic(button) {
  const topicItem = button.closest('.topic-item');
  const explanation = topicItem.querySelector('.topic-explanation');
  const moduleCard = button.closest('.bg-dark-800');

  // Fecha outros topicos do mesmo modulo
  moduleCard.querySelectorAll('.topic-explanation.active').forEach(exp => {
    if (exp !== explanation) {
      exp.classList.remove('active');
    }
  });

  // Toggle do topico atual
  explanation.classList.toggle('active');
}
```

## 9.2 Theme Toggle

```javascript
const themeToggle = document.getElementById('theme-toggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
const html = document.documentElement;

// Inicializa icone correto
if (localStorage.getItem('theme') === 'light' || (!localStorage.getItem('theme') && !html.classList.contains('dark'))) {
  themeToggleDarkIcon.classList.remove('hidden');
  html.classList.remove('dark');
} else {
  themeToggleLightIcon.classList.remove('hidden');
}

// Click handler
themeToggle.addEventListener('click', () => {
  themeToggleDarkIcon.classList.toggle('hidden');
  themeToggleLightIcon.classList.toggle('hidden');
  html.classList.toggle('dark');
  localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
});
```

## 9.3 Modal com Iframe

**IMPORTANTE:** O modal deve carregar a pagina do modulo via iframe para garantir que o conteudo seja IDENTICO ao da pagina de destino. NAO crie conteudo duplicado ou resumido.

### Template HTML do Modal

```html
<div id="modal-1-1" class="modal hidden fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80" onclick="if(event.target === this) closeModal()">
  <div class="bg-dark-800 rounded-xl w-full max-w-6xl h-[95vh] flex flex-col border border-dark-600">
    <!-- Header -->
    <div class="p-4 border-b border-dark-600 flex justify-between items-center flex-shrink-0">
      <div class="flex items-center space-x-3">
        <span class="text-emerald-400 font-bold">1.1</span>
        <span class="font-semibold">Titulo do Modulo</span>
      </div>
      <button onclick="closeModal()" class="text-neutral-400 hover:text-white text-2xl leading-none">&times;</button>
    </div>
    <!-- Iframe carrega a pagina completa do modulo -->
    <iframe src="modulo-1-1.html" class="flex-1 w-full rounded-b-xl"></iframe>
  </div>
</div>
```

**Vantagens do iframe:**
- Conteudo sempre sincronizado com a pagina do modulo
- Sem duplicacao de codigo/conteudo
- Manutencao simplificada (atualiza em um lugar so)

### JavaScript do Modal

```javascript
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.add('hidden');
  });
  document.body.style.overflow = 'auto';
}

// Fechar com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
```

---

# 10. CSS OBRIGATORIO

## 10.1 CSS Base

```css
body { font-family: 'Inter', sans-serif; }
.dark body { background-color: #111827; }
```

## 10.2 Topicos Expansiveis

```css
.topic-explanation { display: none; }
.topic-explanation.active { display: block; }
```

## 10.3 Light Mode (OBRIGATORIO em TODAS as paginas)

Bloco completo com 4 partes. Ver Secao 1.5 para detalhes e tabela de cores por trilha.

```css
/* Parte 1 - Base */
html:not(.dark) body { background-color: #f8fafc; }
html:not(.dark) .bg-dark-900 { background-color: #ffffff; }
html:not(.dark) .bg-dark-800 { background-color: #f9fafb; }
html:not(.dark) .bg-dark-700 { background-color: #f3f4f6; }
html:not(.dark) .bg-dark-600 { background-color: #e5e7eb; }
html:not(.dark) .text-neutral-100 { color: #111827; }
html:not(.dark) .text-neutral-300 { color: #4b5563; }
html:not(.dark) .text-neutral-400 { color: #6b7280; }
html:not(.dark) .text-neutral-500 { color: #9ca3af; }
html:not(.dark) .border-dark-600 { border-color: #d1d5db; }
html:not(.dark) .border-dark-700 { border-color: #e5e7eb; }

/* Parte 2 - Cores de acento da trilha (ver tabela Sec. 1.5) */
html:not(.dark) .text-COR-400 { color: VALOR_LIGHT; }
html:not(.dark) .bg-COR-500\/20 { background-color: rgba(R, G, B, 0.12); }
html:not(.dark) .bg-COR-500\/10 { background-color: rgba(R, G, B, 0.08); }
html:not(.dark) .border-COR-500\/30 { border-color: rgba(R, G, B, 0.25); }
html:not(.dark) .hover\:bg-COR-500\/30:hover { background-color: rgba(R, G, B, 0.18); }

/* Parte 3 - Remove gradientes e cores especiais */
html:not(.dark) [class*="bg-gradient-to"] { background-image: none !important; }
html:not(.dark) .text-primary { color: #a16207; }
html:not(.dark) .bg-primary\/10 { background-color: rgba(161, 98, 7, 0.08); }
html:not(.dark) .border-primary\/40 { border-color: rgba(161, 98, 7, 0.25); }
html:not(.dark) .text-sky-400 { color: #0369a1; }
html:not(.dark) .text-yellow-400 { color: #a16207; }
html:not(.dark) .hover\:text-sky-300:hover { color: #0284c7; }
html:not(.dark) .hover\:text-yellow-300:hover { color: #854d0e; }

/* Parte 4 - Navbar */
html:not(.dark) .bg-dark-900\/95 { background-color: rgba(255, 255, 255, 0.95); }
```

---

# LEMBRETE FINAL

**SEMPRE verificar antes de finalizar qualquer pagina:**

1. ✓ Botoes a ESQUERDA (justify-start)
2. ✓ Numeros em circulo (nao setas)
3. ✓ 3 secoes por topico
4. ✓ INEMA.CLUB presente (sky-400)
5. ✓ Light mode CSS incluido
6. ✓ Titulo do modulo com text-2xl
7. ✓ Cores corretas da trilha
8. ✓ Theme toggle funcionando

---

**Ultima atualizacao:** 2026-03-10
**Versao:** 1.0

---
---

# 11. CAMADA DE APRENDIZAGEM (markup data-*)

> Tudo nesta secao **ADICIONA** sobre o v1. Os Erros Criticos #1-#17 continuam valendo
> integralmente. A camada de aprendizagem (progresso, duvida, notas, jornada, checagem)
> e **enhancement progressivo**: se o JS quebrar ou o `localStorage` estiver bloqueado,
> o curso continua 100% legivel. Persistir so a **verdade minima** (booleans + quotes);
> **derivar** percentuais no render. Falhar sempre para o estado seguro.

## 11.1 IDs estaveis (contrato de ancoragem — pre-requisito de TUDO)

Antes de plugar qualquer controle novo, a pagina precisa destes hooks. Eles sao o
**contrato de ancoragem**: o estado (lido/duvida/nota) gruda nesses IDs, nao no layout
visual. Mudar a aparencia de um topico **nao** pode quebrar o estado salvo.

- `<meta name="inema-course" content="fep">` no `<head>` de **toda** pagina → deriva o
  `courseId`. Fallback = slug da pasta. Toda chave de aprendizagem e namespaced por ele
  (`inema.<courseId>.*`) → estados de cursos diferentes nunca colidem.
- **Modulo:** elemento exterior com `id="modulo-X-Y"` (ja existe no baseline) +
  `data-inema-module="X-Y"` + `data-inema-track="N"`.
- **Topico/secao:** `<section id="topico-N" data-inema-topic="modulo-X-Y#topico-N">`.
  O `data-inema-topic` e o **id estavel de progresso/notas** (ex.: `modulo-1-1#topico-3`).
- **Bloco anotavel:** `data-inema-block="m1-1-t3-p2"` (modulo-topico-paragrafo,
  deterministico). **Sem `blockId`, o elemento simplesmente nao e anotavel** (degrada,
  nao quebra).
- **Manifesto do curso (OBRIGATORIO em TODA pagina):** `<script type="application/json"
  data-inema-manifest>` com a estrutura COMPLETA do curso. E o que permite ao progresso
  AGREGAR entre paginas — `progress('curso')`/`progress('trilha:N')` usam o `done` do
  read-map persistido sobre o `total` do manifesto. **Sem manifesto, o progresso degrada
  para o DOM da pagina atual** (so o modulo corrente). Ver snippet em 11.5.h.
- O acordeao de topico (no index) **preserva** `onclick="toggleTopic(this)"` do v1.

## 11.2 Atributos que ativam features (feature-detect)

O modulo JS (`window.INEMA`) e **idempotente e re-entrant**: roda em qualquer pagina
(landing/trilha/modulo) e so ativa o que existe ali, detectando a presenca destes
`data-*`. Nenhum atributo presente ⇒ nenhuma feature ativa; a pagina segue valida.

| Atributo | Onde | Ativa |
|---|---|---|
| `data-inema-course` *(via `<meta>`)* | `<head>` | namespace de estado (`courseId`) |
| `data-inema-manifest` *(em `<script type="application/json">`)* | `<head>` | estrutura completa do curso → **progresso cross-pagina** (curso/trilha) e "minha jornada" do curso inteiro |
| `data-inema-module="X-Y"` | card/header de modulo | progresso do modulo |
| `data-inema-track="N"` | header de trilha/modulo | progresso da trilha, acento |
| `data-inema-topic="…"` | `<section>` de topico | marcar lido, scrollspy |
| `data-inema-block="…"` | paragrafo/bloco de prosa | selecao/highlight/nota |
| `data-inema-read-toggle` | `<button>` em cada secao | controle "marcar como lido" |
| `data-inema-doubt-toggle` | `<button>` por topico | flag de duvida rapida |
| `data-inema-meter="scope"` | barra/anel | onde `renderMeters` pinta (`curso`/`trilha:N`/`modulo:X-Y`) |
| `data-inema-toc` | `<nav>` lateral | TOC sticky + scrollspy |
| `data-inema-journey-open` | botao na nav | abre "minha jornada" |
| `data-inema-check="id"` | bloco de checagem | quiz leve opcional |

## 11.3 Acessibilidade no markup (parte do contrato, nao bonus)

- `<a class="skip" href="#conteudo">` como **primeiro focavel**; `<main id="conteudo">`
  (landmark).
- `scroll-margin-top` (= altura do nav) em **todos** os alvos focaveis/ancoras — o nav
  sticky obscurece o foco (WCAG 2.4.11).
- Accordions: `<button aria-expanded aria-controls="painel-id">` + `id` no
  `.topic-explanation`.
- "Marcar lido": `<button aria-pressed>` (ou `role=switch aria-checked`), **Space**
  alterna, estado comunicado por **icone + texto + cor** (nunca so cor — WCAG 1.4.1).
- Modais/jornada: `role=dialog aria-modal=true aria-labelledby`, **foco preso**,
  devolucao de foco ao gatilho, `inert` no resto.
- `:focus-visible { outline:3px solid var(--accent-2); outline-offset:2px }` (anel so no
  teclado, ≥3:1 por tema).

## 11.4 Regra de NAO-REGRESSAO dos Erros Criticos

Os controles novos **nao podem** violar #1-#17. Eles so **adicionam**:

- "Marcar lido" **nao** vira botao `justify-center` — segue a regra #1.1 (botoes a
  esquerda, `justify-start`).
- Marcador de nota/duvida **nao** vira seta perto de topico — segue #1.2 (numeros em
  circulo, nunca setas).
- Nav completo / INEMA.CLUB (sky-400) / Mapa da trilha / SVG futurista / profundidade
  minima dos modulos permanecem **intactos** (#1.4 / #1.6 / #1.8 / #1.10 / #7.4b).
- As 3 secoes obrigatorias por topico (#1.3) seguem; a checagem leve e **opcional** e
  vem **alem** delas.

## 11.5 Snippets copia-e-cola

### a) Botao "marcar como lido" (por secao)

```html
<!-- dentro de cada <section data-inema-topic="..."> -->
<div class="flex justify-start mt-6">
  <button type="button"
          data-inema-read-toggle
          aria-pressed="false"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                 bg-COR-500/20 border border-COR-500/30 text-COR-400
                 hover:bg-COR-500/30 transition-colors">
    <span class="inema-read-icon" aria-hidden="true">○</span>
    <span class="inema-read-label">Marcar como lido</span>
  </button>
</div>
```

Quando lido, o JS troca `aria-pressed="true"`, o icone para `●` e o label para
"Lido" (icone + texto + cor — nunca so cor). `justify-start` cumpre #1.1.

### b) Flag de duvida (rapida, zero digitacao)

```html
<!-- no header do topico, ao lado do titulo -->
<button type="button"
        data-inema-doubt-toggle
        aria-pressed="false"
        title="Marcar duvida neste topico"
        class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg
               bg-dark-700 border border-dark-600 text-neutral-300
               hover:bg-dark-600 transition-colors text-sm">
  <span aria-hidden="true">?</span>
  <span>Tenho duvida</span>
</button>
```

Alimenta "revisar minhas duvidas" na jornada. Duvida em nivel de **trecho** vive nas
notas com `color:"doubt"` (canal unificado).

### c) Bloco anotavel (selecao → highlight/nota)

```html
<p data-inema-block="m1-1-t3-p2">
  Texto do paragrafo que o aluno pode selecionar para grifar ou anotar.
  O popover de selecao aparece no mouseup/touchend quando ha texto selecionado.
</p>
```

Render do highlight via **`TreeWalker`** (nunca `Range.surroundContents()` cego — lanca
`InvalidStateError` em selecao cross-node). Texto da nota/quote renderizado SEMPRE por
`textContent` (anti-XSS). Sem `data-inema-block` ⇒ paragrafo nao e anotavel (degrada).

### d) Medidores de progresso (anel/barra — so derivado)

> Slots de texto: o `learn.js` aceita **atributo** (`data-inema-meter-pct` / `data-inema-meter-frac`)
> **ou** as classes deste snippet (`.inema-meter-pct` / `.inema-meter-count`). Os dois funcionam —
> escolha um. O mesmo vale no botao "marcar como lido": o padrao canonico sao os 4 spans
> `.inema-ico-todo/.inema-ico-done/.inema-label-todo/.inema-label-done` (regidos por CSS via
> `aria-pressed`); o par legado `.inema-read-icon` + `.inema-read-label` tambem e atualizado.

```html
<!-- Curso (na landing) -->
<div data-inema-meter="curso" class="inema-meter" role="progressbar"
     aria-valuemin="0" aria-valuemax="100" aria-label="Progresso do curso">
  <span class="inema-meter-pct">0%</span>
  <span class="inema-meter-count">0 de 0</span>
</div>

<!-- Trilha -->
<div data-inema-meter="trilha:1" class="inema-meter" role="progressbar"
     aria-valuemin="0" aria-valuemax="100" aria-label="Progresso da trilha 1"></div>

<!-- Modulo -->
<div data-inema-meter="modulo:1-1" class="inema-meter" role="progressbar"
     aria-valuemin="0" aria-valuemax="100" aria-label="Progresso do modulo 1.1"></div>
```

`renderMeters()` conta os itens **reais no DOM** e deriva `{done, total, pct}`.
**Nunca** persistir percentuais — conteudo muda, as barras se autocorrigem. Sempre
exibir **"N de M" alem do %**.

### e) TOC sticky + scrollspy

```html
<nav data-inema-toc aria-label="Indice da pagina"
     class="hidden lg:block sticky top-24 self-start">
  <p class="text-sm text-neutral-400 mb-2">Secao <span class="inema-toc-pos">1</span>
     de <span class="inema-toc-total">6</span></p>
  <ul class="space-y-1">
    <li><a href="#topico-1" class="inema-toc-link">1. Faca X</a></li>
    <li><a href="#topico-2" class="inema-toc-link">2. Faca Y</a></li>
    <!-- ... um por <section data-inema-topic> ... -->
  </ul>
</nav>
```

Scrollspy via `IntersectionObserver` marca o link ativo e atualiza "Secao N de M".
Colapsa para uma coluna no mobile. Alvos com `scroll-margin-top` = altura do nav.

### f) Botao "minha jornada" (na nav)

```html
<button type="button"
        data-inema-journey-open
        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
               text-neutral-300 hover:text-neutral-100 transition-colors">
  <span aria-hidden="true">◷</span>
  <span>Minha jornada</span>
  <span class="inema-journey-badge hidden" aria-hidden="true"></span>
</button>
```

Abre o painel global (`role=dialog`, foco preso, ESC fecha, `inert` no resto — reusa
`openModal`/`closeModal` do v1). Agrega progresso + duvidas + notas; CTA "continuar de
onde parei"; Export/Import/Reset. **So leitura do estado** (view pura).

### g) Checagem leve (NAO-bloqueante, opcional)

As opcoes sao **markup real** (`learn.js` NAO as gera a partir do `registerCheck`): cada
opcao e um `<button data-inema-check-option="N">` e o feedback vai num `[data-inema-check-feedback]`.

```html
<div data-inema-check="modulo-1-1#q1" class="inema-check mt-8
     bg-dark-800 border border-dark-600 rounded-xl p-6">
  <p class="font-medium mb-4">Pergunta de auto-recuperacao (opcional)</p>
  <div class="inema-check-options space-y-2">
    <button type="button" data-inema-check-option="0" class="block w-full text-left px-4 py-2 rounded-lg bg-dark-700 border border-dark-600 hover:bg-dark-600 transition-colors text-sm">Alternativa A</button>
    <button type="button" data-inema-check-option="1" class="block w-full text-left px-4 py-2 rounded-lg bg-dark-700 border border-dark-600 hover:bg-dark-600 transition-colors text-sm">Alternativa B (correta)</button>
    <button type="button" data-inema-check-option="2" class="block w-full text-left px-4 py-2 rounded-lg bg-dark-700 border border-dark-600 hover:bg-dark-600 transition-colors text-sm">Alternativa C</button>
  </div>
  <div data-inema-check-feedback class="mt-4 text-sm" role="status" aria-live="polite"></div>
</div>
```

E no JS da pagina (depois do `learn.js`), declare a resposta + explicacao por opcao:

```html
<script>
  window.addEventListener('DOMContentLoaded', function () {
    if (window.INEMA && INEMA.registerCheck) {
      INEMA.registerCheck('modulo-1-1#q1', {
        answer: 1,                                   // indice da opcao correta
        explain: { 0: 'Por que A erra...', 1: 'Por que B acerta...', 2: 'Por que C erra...' }
      });
    }
  });
</script>
```

Feedback **imediato e explicativo por opcao**; **NUNCA bloqueia avanco**; grava em
`checks` (separado de `read` pra nao poluir o progresso). Erradas podem ressurgir na
proxima visita (recall espacado parcial).

### h) Manifesto do curso (OBRIGATORIO — inclua em TODA pagina, identico)

O read-map (`inema.<courseId>.read`) atravessa as paginas, mas o **total** nao: o DOM de
uma pagina de modulo so tem os topicos daquele modulo. O **manifesto** declara a estrutura
COMPLETA do curso para que `progress('curso')` e `progress('trilha:N')` AGREGUEM o `done`
(read-map persistido) sobre o `total` (manifesto). **Sem ele, o progresso degrada para o
DOM da pagina atual (so o modulo corrente) e a "minha jornada" nao mostra o curso inteiro.**
Por isso **inclua o MESMO bloco no `<head>` de TODA pagina** (landing, index de trilha e
modulos). E **dado** (nao executa, nao persiste, nao entra no export/import).

```html
<!-- no <head> de TODA pagina, identico em todas -->
<script type="application/json" data-inema-manifest>
{
  "course": "fep",
  "tracks": [
    { "n": "1", "title": "Fundamentos", "modules": [
      { "id": "1-1", "title": "Modulo 1.1", "topics": 8, "href": "curso/trilha1/modulo-1-1.html" },
      { "id": "1-2", "title": "Modulo 1.2", "topics": 6, "href": "curso/trilha1/modulo-1-2.html" }
    ]},
    { "n": "2", "title": "Aplicacao", "modules": [
      { "id": "2-1", "title": "Modulo 2.1", "topics": 7, "href": "curso/trilha2/modulo-2-1.html" }
    ]}
  ]
}
</script>
```

- `course` casa com `<meta name="inema-course">`; `n`/`id` casam com `data-inema-track` /
  `data-inema-module`. `topics` e a **CONTAGEM** de `[data-inema-topic]` reais de cada
  modulo (o "de M") — se divergir do DOM, o % do curso fica errado. `href` (opcional)
  alimenta a navegacao da "minha jornada".

---

# 12. SISTEMA DE TEMAS E PREFS DE LEITURA

## 12.1 Arquitetura: DOIS LAYERS ortogonais (decisao travada)

- **Eixo 1 — claro/escuro = classe `.dark` do Tailwind** (preservada **intacta**).
  Continua dirigindo todos os `dark:bg-dark-800`, `dark:text-amber-400`. **Mover o root
  para `data-theme` quebraria TODO `dark:` do markup — VETADO.**
- **Eixo 2 — variante de leitura = `data-theme` no `<html>`** (ortogonal), governado por
  **CSS variables** no `<style>` a mao + componentes novos. `sepia`, `foco`,
  `contraste` (alto-contraste) vivem aqui. **Convivem sem colidir** com o eixo 1.
- **Cor em 3 niveis:** (1) **primitivos** = canais HSL crus; (2) **tokens de tema** por
  `data-theme`; (3) **semanticos genericos** que a pagina consome (`--bg`, `--surface`,
  `--surface-2`, `--text`, `--text-muted`, `--border`, `--primary`, `--accent`,
  `--accent-2`). A pagina referencia **so o nivel 3**.
- **Promessa honesta:** "tema novo barato" vale **so** para o Layer B (CSS vars). As
  partes em utilitario Tailwind **nao** trocam por variavel sem refactor.

### Conjunto de temas (default = identidade INEMA)

| `data-theme` | Nome | `color-scheme` |
|---|---|---|
| *(none)* + `.dark` | **inema-dark** *(DEFAULT, = baseline intacta)* | dark |
| *(none, `.dark` off)* | **claro** | light |
| `sepia` | **sepia / leitura** | light |
| `foco` | **foco** (so densidade/medida/visibilidade — nao mexe na cor) | herda |
| `contraste` | **alto-contraste** (dark, caminho a11y principal) | dark |

Regra de cor critica: **ambar NUNCA como TEXTO em superficie clara** (1.35:1 no sepia,
1.53:1 no branco) — so fill/borda; texto de acento cai para `amber-700`/`-800`.

### Bridge de chrome — `sepia`/`contraste` pintam a PAGINA inteira

O chrome v1 (body/nav/cards) usa classes utilitarias Tailwind (`bg-dark-*`,
`text-neutral-*`, `border-dark-*`) e o override binario `html:not(.dark)` — que **nao**
consomem os tokens de tema (`var(--bg/--surface/--text/--border)`). Sem ajuda, ativar
"sepia"/"contraste" so recoloraria a `.inema-prose` e o restante ficaria identico a
claro/escuro. A `learn.css` resolve isso na secao **"3b. BRIDGE DE CHROME"**: mapeia
essas classes-chave do chrome para os tokens semanticos **apenas sob
`html[data-theme="sepia"]` / `html[data-theme="contraste"]`** (com `!important` para
vencer o utilitario e o override binario). Resultado: a **troca de tema transforma a
pagina toda**. **`claro` e `inema-dark` continuam pelo mecanismo v1 intacto** (o bridge
nao os toca — Erro Critico #5). Consequencia: a `learn.css` **precisa** estar carregada
para que sepia/contraste recolorem o chrome, nao so a prosa.

## 12.2 Como incluir numa pagina (ordem importa)

Tres pecas, nesta ordem:

**1. Anti-FOUC bloqueante — PRIMEIRA coisa no `<head>`, ACIMA do Tailwind:**

```html
<head>
  <meta charset="utf-8">
  <meta name="inema-course" content="fep">
  <!-- ANTI-FOUC: script minusculo, bloqueante, SEPARADO, antes do Tailwind -->
  <script>
    (function () {
      try {
        var p = JSON.parse(localStorage.getItem('inema.prefs') || '{}');
        var d = document.documentElement;
        // fallback ao theme legado do v1 para nao "resetar" dark/light
        var dark = p.theme ? p.theme !== 'claro' : (localStorage.getItem('theme') !== 'light');
        if (dark) d.classList.add('dark'); else d.classList.remove('dark');
        if (p.theme && p.theme !== 'inema-dark' && p.theme !== 'claro')
          d.setAttribute('data-theme', p.theme);          // sepia | foco | contraste
        if (p.fontScale) d.style.setProperty('--fs-root', p.fontScale + '%');
      } catch (e) { document.documentElement.classList.add('dark'); } // default dark no erro
    })();
  </script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style> /* ... cole aqui learn.css: CSS vars + temas + .inema-prose ... */ </style>
</head>
```

Aplica `.dark` **E** `data-theme` **E** `--fs-root` **antes do primeiro paint**.
Independente do modulo grande — se ele falhar, o tema ja foi aplicado. **Default dark no
erro** preserva a marca.

**2. `learn.css`** — colado inline no `<style>` do `<head>`: CSS vars (3 niveis), blocos
`[data-theme="…"]` com seus tokens + `color-scheme`, o wrapper `.inema-prose` (clampa
**so** a prosa: `max-width:var(--measure); margin-inline:auto`) e os estilos dos
controles novos (read-toggle, meters, popover, jornada). Micro-interacoes **todas** sob
`@media (prefers-reduced-motion: reduce)` (zera/encurta, preserva estado final).

**3. `learn.js`** — colado inline **antes de `</body>`**: o IIFE `window.INEMA`. Boot em
`DOMContentLoaded`; chama `INEMA.init()`. Idempotente: so ativa o que tem `data-*`.

```html
  <script> /* ... cole aqui learn.js: IIFE window.INEMA ... */ </script>
  <script>document.addEventListener('DOMContentLoaded', function(){ window.INEMA && INEMA.init(); });</script>
</body>
```

## 12.3 Seletor de aparencia

> **Contrato real do `learn.js`:** o painel de aparencia **NAO e gerado automaticamente**.
> A pagina precisa conter o **markup do painel** com os botoes `data-inema-set-theme`,
> `data-inema-set-font`, `data-inema-set-fontscale`, `data-inema-set-leading`,
> `data-inema-set-accent` dentro de um container `[data-inema-appearance]`, e um gatilho
> `data-inema-appearance-toggle="<seletor-do-painel>"` para abri-lo/fecha-lo. Um botao
> avulso `data-inema-appearance-open` **sem** esse painel nao faz nada. Se voce nao for
> montar o painel completo, **omita o botao** e mantenha so o toggle sol/lua (que ja
> funciona pelo nucleo v1).

- **`<button>`-based** (nao `<select>` fragil), na nav, **ao lado** do toggle sol/lua
  existente — que e **absorvido** (o eixo claro/escuro continua funcionando).
- Abre painel com: **4-5 temas** + **tipografia** (fonte) + **tamanho** (`fontScale`
  100/112/125%) + **entrelinha** (`leading` compacto/confortavel) + **medida** (largura
  de linha, via `foco`) + **paleta de acento** (6 cores de trilha INEMA, travado na
  familia — nao color-picker livre).
- Reflete estado por **icone + texto, nao so cor** (WCAG 1.4.1).
- Tudo salvo em `inema.prefs` (GLOBAL, cross-curso) e **re-aplicado em todas as paginas
  no load, antes do paint** (via anti-FOUC).

```html
<button type="button" data-inema-appearance-open
        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
               text-neutral-300 hover:text-neutral-100 transition-colors">
  <span aria-hidden="true">◑</span>
  <span>Aparencia</span>
</button>
```

### Prefs de leitura (todas em CSS vars, unidades relativas — sobrevivem a zoom 200%)

| Pref | CSS var / mecanica | Valores |
|---|---|---|
| **Tamanho** | `:root` font-size 100/112/125% (resto em rem escala junto). **Nunca** px fixo no `:root`. | 100 \| 112 \| 125 |
| **Largura de linha** | `--measure` clampa **so** a prosa, nunca code/tabelas/grids. | `60ch` \| `68ch` \| `75ch` |
| **Entrelinha** | `--lh-body` multiplicador **sem unidade**. | compacto `1.45` \| confortavel `1.7` |
| **Fonte** | `--font-body`. Default Inter. Alternativa "conforto" e **escolha, nunca default** nem promessa de "resolve dislexia". | inter \| system \| leitura |
| **Acento** | `--accent-h/-s/-l` + `--accent`. 6 cores de trilha INEMA. So componentes novos. | slug de trilha |

> **Densidade real NAO entra no MVP** — espacamento da baseline e utilitario Tailwind
> fixo (`mb-16`, `p-8`), nada a multiplicar sem refactor. "Densidade" = so `fontScale`
> + `leading`. Espacamento real → backlog.

---

# 13. DIDATICA (aprendizado agradavel)

Aplicada **por cima** do MASTER da baseline, **mantendo** 6-8 secoes por modulo
(regra #1.8) e as 3 secoes obrigatorias por topico (#1.3). Os 13 itens:

1. **Chunking — "uma ideia por secao".** Receita por secao: **um conceito + um
   demo/SVG + uma checagem leve opcional**. Reduz carga cognitiva; a checagem vem
   **alem** das 3 secoes obrigatorias.
2. **Contiguidade espacial.** Legenda/SVG **colados** ao paragrafo que ilustram (ao
   lado/abaixo), nunca soltos num paragrafo distante. Callouts inline apontando linhas
   de codigo.
3. **Modelo mental primeiro.** Abrir cada topico com diagrama/SVG rotulado + frase
   simples **antes** da sintaxe (reusa o SVG futurista do #1.10). Interacao barata
   "preveja, depois revele".
4. **Titulos como tarefa/resultado.** "Faca X", nao rotulos genericos ("Introducao").
   O leitor sabe o que vai conseguir ao fim da secao.
5. **TOC sticky + scrollspy** (`IntersectionObserver`) dentro da pagina de modulo +
   indicador **"Secao N de M"** — preenche a lacuna "sem TOC lateral" do baseline.
   Colapsa para uma coluna no mobile.
6. **Marcar lido explicito por secao** — **caminho primario** de conclusao. Scroll-spy
   e "continuar de onde parei" sao assistencias que **NUNCA** escrevem conclusao
   sozinhas. So o clique do aluno marca lido.
7. **Progresso em 3 granularidades** visivel: anel/barra por **modulo**, por **trilha**
   e por **curso**; sempre **"N de M" + %**. Tudo **derivado do DOM** (conta itens
   reais), nunca persistido.
8. **Checagem de conhecimento leve e NAO-bloqueante** (opt-in por modulo): 1 pergunta
   de auto-recuperacao ao fim de secoes-chave, **feedback explicativo por opcao**,
   ancora de volta ao paragrafo, **nunca trava o avanco**. Resolve "sem quiz" sem virar
   LMS.
9. **Recall espacado parcial:** pergunta de secao **anterior** no fim de cada secao +
   revisao de fim de pagina; o `localStorage` ressurge as **erradas**. Calibrar
   expectativa — **nao** e SRS agendado (impossivel num arquivo estatico).
10. **Friccao minima ate o 1o resultado + divulgacao progressiva:** exemplo
    pre-preenchido que **ja funciona**; aprofundamentos atras de `<details>` ("Indo mais
    fundo (opcional)").
11. **Voz quente contida:** celebrar conclusao, normalizar esforco, CTAs pelo beneficio
    — **sem coachzinho**, coerente com a marca sobria. Nada de confete/streak.
12. **Anotacao/duvida no proprio texto como didatica** (nao so feature): marcar duvida
    com a cor reservada alimenta "revisar minhas duvidas" na jornada — fecha o ciclo de
    estudo.
13. **Acessibilidade como contrato** (WCAG): todos os itens da secao 11.3 entram como
    regra do MASTER, **verificados por tema** (contraste de `--text`/`--text-muted` sobre
    cada `--bg`, incluindo o ambar so como fill em superficie clara).

---

**Acrescimo v2 (camada de aprendizagem + temas + didatica):** 2026-06-14
**Versao da extensao:** 2.0 (sobre o MASTER v1.0, sem editar/remover o conteudo v1)
