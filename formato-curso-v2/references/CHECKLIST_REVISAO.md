# CHECKLIST DE REVISAO

> **Use este documento para verificar se tudo foi implementado corretamente**
> **Versao:** 1.5 | **Data:** 2026-01-21

---

## COMO USAR

1. Copie este checklist para cada pagina que criar/revisar
2. Marque cada item conforme for verificando
3. NAO publique ate todos os itens estarem marcados

---

# CHECKLIST PAGINA DE TRILHA (INDEX)

## 1. ERROS CRITICOS (OBRIGATORIO)

- [ ] **Botoes a ESQUERDA** - Verificar `justify-start` (NAO center)
- [ ] **Numeros em circulo** - NAO esta usando setas nos topicos
- [ ] **3 secoes por topico** - Cada topico tem: O que e / Por que aprender / Conceitos-chave
- [ ] **INEMA.CLUB presente** - Link com `text-sky-400` ao lado do logo
- [ ] **PRO presente** - Link ao lado do INEMA.CLUB (separado por `-`), linkando `https://inema.pro`, dourado no light (`text-amber-700`) / prateado no dark (`dark:text-slate-300`)
- [ ] **Light mode CSS** - Bloco completo: base + cores acento da trilha + sem gradiente + especiais + nav (ver Sec. 1.5)
- [ ] **Titulo modulo** - Usando `text-2xl font-bold`
- [ ] **TODOS modulos completos** - TODOS os modulos (1.1 a 1.8) devem ter topicos expandiveis, NAO apenas header+botao
- [ ] **Modal presente** - Botao "Ver em Modal" + HTML dos modais + JavaScript (openModal/closeModal)
- [ ] **Modal com iframe** - Modal deve usar `<iframe src="modulo-X-X.html">` para carregar a pagina completa (NAO conteudo duplicado)
- [ ] **2 secoes de modulos** - Primeiro cartoes simples (grid 2 cols), depois cartoes detalhados com topicos
- [ ] **Cartoes simples clicaveis** - Secao 1 usa `<a>` clicavel (SEM botoes), com hover na borda e titulo
- [ ] **MAPA DA TRILHA OBRIGATORIO** - h2 `Mapa da trilha` (NUNCA "Navegacao Rapida") + grid de cards-ancora (#modulo-X-Y) ANTES do "Conteudo detalhado". Ver Sec. 7.4b do MASTER.
- [ ] **Cards do Mapa SEM circulo numerado** - header `justify-between` com X.Y (esq) e duracao (dir). NUNCA `w-8 h-8 rounded-full` extra
- [ ] **Cards do Mapa com EMOJI no titulo + subtitulo PUNCHY** - "🎯 Titulo" + frase-marca de 3-5 palavras, nao descritivo
- [ ] **IDs nos cards de modulo** - Cada card grande tem `id="modulo-X-Y"` para a navegacao por ancora funcionar
- [ ] **Divisor "Conteudo detalhado" simples** - `<h2 class="text-2xl font-bold mb-6">Conteudo detalhado</h2>`. NAO usar 2 linhas horizontais (`flex-1 h-px`) com span no meio
- [ ] **Nav completo em TODAS paginas** - Logo + INEMA.CLUB + PRO + 4-6 botoes de trilha + theme toggle em landing, curso/index, trilhas e modulos. NUNCA simplificar para `← Trilha X | Curso`
- [ ] **Bordas suavizadas (dark)** - duas regras CSS: `.dark .border-dark-600 { border-color: #374151 }` + `.dark .divide-dark-600 > :not([hidden]) ~ :not([hidden]) { border-color: #374151 }`
- [ ] **Profundidade dos modulos** - 500-800 linhas, 6-8 secoes com VARIEDADE de componentes (≥2 ✓/✗ grids, ≥1 timeline, ≥2 tip boxes). NUNCA template uniforme repetido 6x

## 2. NAVIGATION

- [ ] Logo com emoji correto do projeto
- [ ] Nome do curso visivel (hidden sm:inline em mobile)
- [ ] Separador `|` entre logo e INEMA.CLUB
- [ ] Link INEMA.CLUB com `text-sky-400 hover:text-sky-300`
- [ ] Separador `-` entre INEMA.CLUB e PRO
- [ ] Link PRO com `text-amber-700 hover:text-amber-600 dark:text-slate-300 dark:hover:text-slate-200`, linkando `https://inema.pro`
- [ ] Todas as trilhas listadas com nomes completos
- [ ] Trilha atual com cor ativa (`text-[cor]-400 bg-[cor]-500/10`)
- [ ] Outras trilhas com hover correto
- [ ] Theme toggle presente com icones SVG
- [ ] Nav sticky com `backdrop-blur-sm`

## 3. HEADER

- [ ] Gradiente correto da trilha (`from-[cor]-900/30`)
- [ ] Badge "TRILHA X" com cor correta
- [ ] Titulo com emoji
- [ ] Descricao da trilha
- [ ] Stats Grid com 4 colunas:
  - [ ] Modulos
  - [ ] Topicos
  - [ ] Duracao
  - [ ] Nivel

## 4. CARDS DE MODULO

**ATENCAO:** Verificar se TODOS os 8 modulos estao completos (nao apenas alguns com topicos e outros so com header+botao)

Para cada modulo verificar:

- [ ] Numero do modulo (X.X) com cor da trilha
- [ ] Duracao (~XX min)
- [ ] Titulo com emoji e `text-2xl`
- [ ] Descricao breve
- [ ] 6-8 topicos expansiveis
- [ ] Cada topico com numero em circulo (NAO seta)
- [ ] Cada topico com emoji + titulo + subtitulo
- [ ] Conteudo expansivel com 3 secoes
- [ ] Botoes alinhados a ESQUERDA

## 5. FUNCIONALIDADE

- [ ] Toggle de topicos funcionando (abre/fecha)
- [ ] Apenas 1 topico aberto por modulo
- [ ] Theme toggle alterando dark/light
- [ ] Light mode renderizando corretamente
- [ ] Links dos botoes corretos

## 6. RESPONSIVIDADE

- [ ] Mobile: Trilhas mostram T1, T2, T3...
- [ ] Desktop: Trilhas mostram nomes completos
- [ ] Stats grid responsivo
- [ ] Cards empilham em mobile

---

# CHECKLIST PAGINA DE MODULO

## 1. ERROS CRITICOS (OBRIGATORIO)

- [ ] **Botoes navegacao** - Verificar alinhamento
- [ ] **Numeros em circulo GRANDE** - `w-12 h-12` nas secoes
- [ ] **INEMA.CLUB presente** - Link com `text-sky-400`
- [ ] **PRO presente** - Link ao lado do INEMA.CLUB, linkando `https://inema.pro`, dourado no light / prateado no dark
- [ ] **Light mode CSS** - Bloco completo: base + cores acento da trilha + sem gradiente + especiais + nav (ver Sec. 1.5)

## 2. NAVIGATION

- [ ] Identica a pagina de trilha
- [ ] Trilha correspondente marcada como ativa

## 3. BREADCRUMB

- [ ] Presente abaixo da navigation
- [ ] Formato: Inicio / Trilha X / Modulo X.X
- [ ] Links funcionando
- [ ] Modulo atual destacado com cor da trilha

## 4. HEADER

- [ ] Gradiente correto da trilha
- [ ] Badge "MODULO X.X"
- [ ] Titulo com emoji
- [ ] Descricao do modulo
- [ ] Stats Grid com 4 colunas:
  - [ ] Topicos
  - [ ] Minutos
  - [ ] Nivel
  - [ ] Tipo

## 5. TOPICOS (SECOES)

Para cada topico (1-6) verificar:

- [ ] Numero em circulo GRANDE (`w-12 h-12`)
- [ ] Titulo h2 com emoji
- [ ] Paragrafo introdutorio
- [ ] Espacamento `mb-16` entre secoes

### Boxes de Conteudo (verificar variedade):

- [ ] Box Conceito Principal (gradiente da trilha)
- [ ] Box Dados/Pesquisa (blue)
- [ ] Box Dica Pratica (primary/yellow)
- [ ] Grid Fazer vs Evitar (emerald/red)
- [ ] Timeline (se aplicavel)
- [ ] Box Alerta (red, se aplicavel)

## 6. RESUMO FINAL

- [ ] Titulo com emoji
- [ ] Checklist do que foi aprendido (itens com ✓)
- [ ] Indicacao do proximo modulo
- [ ] Botao "Voltar para Trilha"
- [ ] Botao "Proximo Modulo"
- [ ] Gradiente correto da trilha no container

## 7. FUNCIONALIDADE

- [ ] Theme toggle funcionando
- [ ] Light mode renderizando corretamente
- [ ] Links de navegacao corretos
- [ ] IDs dos topicos para ancora (#topico-1, #topico-2, etc)

---

# CHECKLIST CORES POR TRILHA

Verificar se a trilha usa as cores corretas conforme o numero:

## Trilha 1 (Emerald)

- [ ] `text-emerald-400`
- [ ] `bg-emerald-500/20`
- [ ] `border-emerald-500/30`
- [ ] `from-emerald-900/30`

## Trilha 2 (Blue)

- [ ] `text-blue-400`
- [ ] `bg-blue-500/20`
- [ ] `border-blue-500/30`
- [ ] `from-blue-900/30`

## Trilha 3 (Purple)

- [ ] `text-purple-400`
- [ ] `bg-purple-500/20`
- [ ] `border-purple-500/30`
- [ ] `from-purple-900/30`

## Trilha 4 (Amber)

- [ ] `text-amber-400`
- [ ] `bg-amber-500/20`
- [ ] `border-amber-500/30`
- [ ] `from-amber-900/30`

## Trilha 5 (Teal)

- [ ] `text-teal-400`
- [ ] `bg-teal-500/20`
- [ ] `border-teal-500/30`
- [ ] `from-teal-900/30`

## Trilha 6 (Rose)

- [ ] `text-rose-400`
- [ ] `bg-rose-500/20`
- [ ] `border-rose-500/30`
- [ ] `from-rose-900/30`

---

# CHECKLIST JAVASCRIPT

- [ ] Funcao `toggleTopic()` presente
- [ ] Funcao fecha outros topicos do mesmo modulo
- [ ] Theme toggle inicializa icone correto
- [ ] Theme toggle salva preferencia no localStorage
- [ ] Theme toggle alterna classe `dark` no html
- [ ] Funcao `openModal()` presente (pagina de trilha)
- [ ] Funcao `closeModal()` presente (pagina de trilha)
- [ ] Modal fecha com tecla ESC

---

# CHECKLIST CSS

- [ ] Font Inter importada
- [ ] `body { font-family: 'Inter', sans-serif; }`
- [ ] `.topic-explanation { display: none; }`
- [ ] `.topic-explanation.active { display: block; }`
- [ ] Bloco completo de Light mode overrides (base + cores acento + sem gradiente + especiais + nav)

---

# CHECKLIST PAGINA DE SLIDES

## Estrutura
- [ ] Pasta `/curso/trilhaX/slides/` criada
- [ ] Arquivo `slides-X-X.html` para cada modulo com imagens
- [ ] Imagens referenciadas de `/doc/XX/` (pasta corresponde ao modulo)

## Layout
- [ ] Header com badge "SLIDES DO MODULO X.X"
- [ ] Stats: quantidade de slides, tempo estimado, tipo "Visual"
- [ ] Cards de slide com numero em circulo + titulo
- [ ] Imagem clicavel para zoom (modal)
- [ ] Navegacao entre slides e voltar ao modulo

## Conteudo
- [ ] **TEXTO COMPLETO E DETALHADO** - Cada slide deve ter descricao rica explicando o conteudo visual
- [ ] Contextualizacao do que esta sendo mostrado
- [ ] Conceitos-chave destacados em negrito
- [ ] Conexao com o conteudo do modulo

## Funcionalidade
- [ ] Modal de zoom funcionando (clique na imagem)
- [ ] Fechar modal com ESC
- [ ] Theme toggle funcionando
- [ ] Light mode renderizando

## Botoes (onde adicionar)
- [ ] Botao roxo "📊 Ver Slides" na pagina do modulo (ao lado de navegacao)
- [ ] Botao roxo "📊 Slides" no card detalhado do index da trilha

## Mapeamento de Pastas
| Pasta doc | Modulo |
|-----------|--------|
| doc/11 | 1.1 |
| doc/12 | 1.2 |
| doc/13 | 1.3 |

---

# VERIFICACAO FINAL

Antes de publicar, responda:

1. [ ] Abri a pagina no navegador?
2. [ ] Testei o dark mode?
3. [ ] Testei o light mode?
4. [ ] Cliquei em todos os topicos expansiveis?
5. [ ] Verifiquei todos os links?
6. [ ] Testei em mobile (ou redimensionei a janela)?
7. [ ] Comparei visualmente com uma pagina existente que esta correta?

---

# TEMPLATE RAPIDO PARA COPIAR

```
## Revisao: [Nome da Pagina]
Data: ____/____/____

### Erros Criticos
- [ ] Botoes ESQUERDA
- [ ] Numeros em circulo
- [ ] 3 secoes por topico
- [ ] INEMA.CLUB
- [ ] PRO (ao lado do INEMA.CLUB, linkando `https://inema.pro`)
- [ ] Light mode CSS completo (4 partes)
- [ ] Titulo text-2xl
- [ ] Modulos completos (index)
- [ ] Modal funcionando (index)
- [ ] Cartoes simples clicaveis (index)

### Estrutura
- [ ] Navigation completa
- [ ] Header com stats
- [ ] Conteudo correto
- [ ] Resumo/navegacao

### Funcional
- [ ] Dark mode OK
- [ ] Light mode OK
- [ ] Links OK
- [ ] Responsivo OK

### Status: [ ] APROVADO / [ ] PENDENTE
```

---

# ERROS MAIS COMUNS (REVISAR ESPECIALMENTE)

| Erro | O que verificar |
|------|-----------------|
| Botoes centralizados | Procurar por `justify-center` nos botoes de modulo |
| Setas em vez de numeros | Procurar por `▶` ou `→` nos topicos |
| Faltando INEMA.CLUB | Verificar navigation |
| Faltando PRO | Verificar se o link `https://inema.pro` esta ao lado do INEMA.CLUB no nav |
| Light mode quebrado | Testar alternando o tema |
| Titulo pequeno | Verificar se h3 do modulo tem `text-2xl` |
| Cor errada | Comparar com tabela de cores da trilha |
| Topico sem 3 secoes | Abrir cada topico e verificar |
| Modulos incompletos no index | Verificar se TODOS os modulos tem topicos expandiveis (nao apenas header+botao) |
| Modal faltando | Verificar botao "Ver em Modal", HTML dos modais e funcoes openModal/closeModal |
| Modal sem iframe | Modal DEVE usar `<iframe src="modulo-X-X.html">` para carregar pagina completa |
| Faltando secao de cartoes simples | Index deve ter: 1) Cartoes simples (grid 2 cols) 2) Cartoes detalhados com topicos |
| Cartoes simples com botoes | Secao 1 deve usar `<a>` clicavel, SEM botoes - apenas hover na borda/titulo |

---

# CHECKLIST DA CAMADA DE APRENDIZAGEM (v2) — ERROS #18-#28

> **Escopo:** itens NOVOS da v2 (camada de aprendizagem + temas + a11y). NAO substituem
> os Erros Criticos #1-#17 acima — apenas se SOMAM. Recursos novos so podem ADICIONAR;
> se algum quebrar #1-#17 (botao `justify-center`, seta perto de topico, nav/INEMA.CLUB/
> mapa-da-trilha/SVG/profundidade), reprovar. Espelhado na skill irma `revisar-curso`.
>
> Cada item abaixo e TESTAVEL: descreve a verificacao manual (DevTools / teclado / reload)
> que prova que o recurso funciona. Referencias: DESIGN-SPEC Secs. 1.5, 3.7, 7.

---

## ERRO #18 — Anti-FOUC (sem flash de tema entre paginas)

- [ ] **Script bloqueante SEPARADO no topo do `<head>`** - existe um `<script>` curto com try/catch ACIMA do Tailwind/CDN, distinto do bloco grande `window.INEMA`
- [ ] **Aplica antes do primeiro paint** - o script seta `.dark` no `<html>` E o atributo `data-theme` E as classes de leitura ANTES de qualquer `<link>`/`<style>` pesado
- [ ] **TESTE sem flash** - navegando de uma pagina (ex.: index da trilha) para outra (modulo) em tema claro/sepia/foco/contraste, NAO ha flash escuro/branco no carregamento
- [ ] **Default dark no erro** - se `inema.prefs` estiver corrompido/ausente, o `catch` aplica dark (marca preservada), nunca pagina sem tema
- [ ] **Independente do modulo grande** - desabilitando (comentando) o bloco `window.INEMA`, o tema correto AINDA e aplicado pelo script anti-FOUC

## ERRO #19 — IDs / `data-*` estaveis presentes (contrato de ancoragem)

- [ ] **`<meta name="inema-course" content="...">`** presente no `<head>` de TODA pagina (define o `courseId`; fallback = slug da pasta)
- [ ] **Modulo** - elemento exterior com `id="modulo-X-Y"` + `data-inema-module="X-Y"` + `data-inema-track="N"`
- [ ] **Topico/secao** - `<section id="topico-N" data-inema-topic="modulo-X-Y#topico-N">` (o `data-inema-topic` e o id ESTAVEL de progresso/notas)
- [ ] **Bloco anotavel** - paragrafos de prosa com `data-inema-block="mX-Y-tN-pK"` (deterministico); sem `blockId` o bloco apenas NAO e anotavel (degrada, nao quebra)
- [ ] **Hooks de controle** - `data-inema-read-toggle`, `data-inema-doubt-toggle`, `data-inema-meter="scope"`, `data-inema-toc`, `data-inema-journey-open` presentes onde a feature existe
- [ ] **TESTE de estabilidade** - os `data-inema-topic` NAO dependem de classe visual; trocar de tema/layout NAO altera o id de estado

## ERRO #20 — Marcar-lido acessivel (aria-pressed, justify-start, teclado)

- [ ] **`<button aria-pressed>`** (ou `role=switch aria-checked`) em cada secao - NAO `<div onclick>` sem semantica
- [ ] **Alinhado a ESQUERDA** - `justify-start` (NUNCA `justify-center` — nao regride o Erro #1)
- [ ] **Teclado** - botao recebe foco por Tab e alterna com Space/Enter; `:focus-visible` com anel visivel (≥3:1 no tema)
- [ ] **Estado por icone+texto+cor** - lido/nao-lido distinguivel SEM depender so de cor (1.4.1); `aria-pressed` reflete o estado
- [ ] **TESTE de instantaneidade** - clicar marca lido e os medidores re-renderizam no MESMO tick (sem recarregar)
- [ ] **Nunca seta perto de topico** - o controle de lido nao introduz `▶`/`→` ao lado do topico (nao regride o Erro #2)

## ERRO #21 — Progresso DERIVADO agrega topico->modulo->trilha->curso e bate "N de M"

- [ ] **Persistir so booleans** - `inema.<courseId>.read` guarda apenas `id:true`; ausencia = nao-lido (nunca grava `false`)
- [ ] **Percentual DERIVADO do DOM** - nenhum percentual/contagem persistido; `progress(scope)` conta itens reais via `domTotals(scope)`
- [ ] **Agrega 3+ granularidades** - anel/barra por `modulo:X-Y`, por `trilha:N` e por `curso`, todos via `data-inema-meter="scope"`
- [ ] **Soma sobe ao marcar** - marcar 1 topico lido sobe o medidor do modulo, da trilha E do curso na mesma acao
- [ ] **Exibe "N de M" alem do %** - cada medidor mostra "N de M" (ex.: "3 de 8") junto do percentual
- [ ] **TESTE de auto-correcao** - removendo um `data-inema-topic` do DOM, o "de M" diminui e o % se recalcula (nada hardcoded)
- [ ] **Marcar TODOS = 100% genuino** - so atinge 100% quando todos os itens reais do escopo estao lidos (alimenta `completedAt`/celebracao)
- [ ] **MANIFESTO presente em TODA pagina** - `<script type="application/json" data-inema-manifest>` no `<head>` de cada pagina (landing, index de trilha e modulos), identico, com `course` + `tracks[].modules[]` (`id`/`title`/`topics`/`href`)
- [ ] **`topics` bate com o DOM real** - o `topics` de cada modulo no manifesto = a CONTAGEM de `[data-inema-topic]` reais daquele modulo na sua pagina (se divergir, o % do curso fica errado)
- [ ] **TESTE de agregacao cross-modulo** - numa pagina de modulo, marcar topicos lidos em modulos diferentes (via navegacao) e confirmar que `data-inema-meter="curso"` e `="trilha:N"` somam o curso INTEIRO (do read-map persistido sobre o total do manifesto), nao so o modulo da pagina atual
- [ ] **TESTE de degradacao sem manifesto** - removendo o `<script data-inema-manifest>`, o progresso de curso/trilha CAI para o DOM da pagina atual (so o modulo corrente) — confirma que a agregacao cross-pagina depende do manifesto
- [ ] **Manifesto e DADO, nao estado** - nao persiste no `localStorage` nem entra no export/import

## ERRO #22 — Export -> Import faz round-trip SEM perda; merge nao-destrutivo

- [ ] **Export sempre valido** - `exportJSON()` produz `.json` com `schemaVersion`, `courseId`, `exportedAt` + blocos `read/doubts/notes/checks/meta` (mesmo com estado vazio)
- [ ] **`inema.prefs` separado** - prefs globais NAO entram no export por-curso (bloco separado/opcional)
- [ ] **TESTE round-trip lossless** - export -> reset -> import do MESMO arquivo restaura EXATAMENTE lidos, duvidas, notas (quote+nota+cor+tag), checks e meta
- [ ] **Campos desconhecidos preservados** - chaves de versoes futuras sobrevivem ao round-trip (nao sao descartadas)
- [ ] **Import defensivo** - parse em var TEMPORARIA -> valida `schemaVersion` -> so commita se valido; arquivo invalido = NO-OP com mensagem, estado atual intacto
- [ ] **Retorno estruturado** - `importJSON` devolve `{ok, applied, skipped, errors}`
- [ ] **Merge nao-destrutivo (default)** - `mode:'merge'` une lidos/notas/duvidas; NADA e apagado; importar um subconjunto NAO remove o que ja existia
- [ ] **`replace` pede confirmacao** - `mode:'replace'` so substitui apos confirmacao explicita
- [ ] **`migrate()` puro** - recebe qualquer `schemaVersion <= atual` e devolve o shape corrente com defaults para campos faltantes

## ERRO #23 — Contraste AA por tema (muted incluso; ambar nunca texto em superficie clara)

- [ ] **AA 4.5:1 em todos os temas** - `--text` e `--text-muted` sobre `--bg` passam AA em inema-dark, claro, sepia, foco e alto-contraste (mirar AAA 7:1 na leitura longa)
- [ ] **`--text-muted` testado** - o par muted/legenda (o que mais falha) verificado em CADA tema, nao so o texto principal
- [ ] **Bordas/anel/icones ≥3:1** - `--border`, anel de foco e icones atingem 3:1 por tema
- [ ] **AMBAR NUNCA como TEXTO em superficie clara** - em claro/sepia, texto de acento cai para `amber-700/-800` (ou marrom escurecido); ambar saturado SO em fill/borda decorativa
- [ ] **TESTE no claro** - nenhum texto ambar-400/-500 sobre `--bg` branco/`#FBF0D9` (reprovar: 1.53:1 no branco, 1.35:1 no sepia)
- [ ] **Sem `#000`/`#fff` puros** - dark usa `#111827`/`#e6e6e6`, nao preto/branco cravados
- [ ] **Alto-contraste = caminho a11y principal** - tema `contraste` com pares AAA (texto ~18:1, ambar ~12:1, ciano ~9:1) e bordas visiveis em todos os cards/toggles
- [ ] **Bridge de chrome (sepia/contraste pintam a PAGINA inteira)** - trocar para "sepia"/"contraste" recolore tambem o chrome v1 (body/nav/cards via `bg-dark-*`/`text-neutral-*`/`border-dark-*`), nao so a `.inema-prose`; a `learn.css` mapeia essas classes para os tokens sob `html[data-theme="sepia"]`/`[contraste"]` (secao "3b. BRIDGE DE CHROME"). `claro`/`inema-dark` continuam pelo mecanismo v1 intacto (nao tocados — Erro #5)

## ERRO #24 — Popover / highlight nao quebra em selecao cross-node

- [ ] **`TreeWalker`, NAO `surroundContents`** - highlight envolve text nodes pedaco a pedaco; NUNCA `Range.surroundContents()` cego (lanca `InvalidStateError` cross-node)
- [ ] **TESTE selecao cross-node** - selecionar texto que atravessa 2+ elementos (ex.: do fim de um `<strong>` ate o proximo paragrafo) NAO lanca erro e aplica o highlight
- [ ] **Popover posicionado** - `mouseup`/`touchend` em range nao-colapsado abre popover via `getBoundingClientRect()` considerando `scrollX/scrollY`; reposiciona se transbordar a viewport
- [ ] **Swatches + 1 reservado "duvida"** - cores yellow/green/blue/pink + a reservada `doubt`, alem de "Adicionar nota" e "Copiar"
- [ ] **Clipboard com fallback `file://`** - "Copiar" funciona em `file://` (textarea + `execCommand`), nao depende so de `navigator.clipboard` (secure context)
- [ ] **`quote` SEMPRE gravado** - todo highlight/nota grava o texto selecionado como seguro de re-ancoragem
- [ ] **Fallback de ancoragem em camadas** - offsets exatos -> busca do quote no bloco -> no `<main>` -> nota `orphan:true` (texto NUNCA se perde)
- [ ] **Re-hidratacao tolerante** - `renderHighlights` re-aplica do storage no load; uma nota que nao ancora vira orfa e NAO derruba as outras
- [ ] **Remover limpa o DOM** - `removeNote` substitui o span por text node + `parent.normalize()` e remove o registro
- [ ] **Fecha corretamente** - popover fecha em mousedown fora ou selecao vazia

## ERRO #25 — Jornada `role=dialog` com foco preso, ESC e `inert`

- [ ] **`role=dialog aria-modal=true aria-labelledby`** - o painel "minha jornada" tem os atributos ARIA de dialogo
- [ ] **Foco preso** - Tab/Shift+Tab circulam SO dentro do dialogo enquanto aberto
- [ ] **ESC fecha** - tecla ESC fecha a jornada (reusa o padrao `openModal`/`closeModal` do v1)
- [ ] **`inert` no resto** - o conteudo fora do dialogo recebe `inert` (ou equivalente) e nao e focavel/lido por leitor de tela
- [ ] **Devolucao de foco** - ao fechar, o foco volta ao botao gatilho (`data-inema-journey-open`)
- [ ] **View pura / so leitura** - a jornada AGREGA `read/doubts/notes/meta` + progresso sem mutar estado; nao duplica conteudo nem dessincroniza
- [ ] **Conteudo da jornada** - barras (curso/trilhas/modulos), duvidas filtraveis com link de volta (via `scroll-margin-top`), notas filtraveis por cor "duvida", CTA "continuar de onde parei", Export/Import/Reset

## ERRO #26 — Storage indisponivel cai em modo efemero (curso continua legivel)

- [ ] **Probe de storage no boot** - try set/get/remove de chave-sonda em `INEMA.init`
- [ ] **Modo efemero** - storage bloqueado (modo privado/cota/`file://` restrito) => estado em memoria + aviso DISCRETO e NAO-bloqueante
- [ ] **TESTE curso legivel sem storage** - com localStorage desabilitado (DevTools) ou bloqueado, a pagina abre, le-se 100% do conteudo, navegacao e topicos funcionam
- [ ] **Toda I/O em wrappers no-throw** - `storageGet`/`storageSet` com try/catch + `JSON.parse` defensivo; excecao nunca chega a UI (no maximo `console.warn`)
- [ ] **Corrompido reseta so a chave** - JSON invalido numa chave reseta SO aquela chave (nao quebra a pagina) + `console.warn`
- [ ] **`QuotaExceededError` silencioso** - set falha sem quebrar, mantem estado anterior, sugere export
- [ ] **Enhancement progressivo** - desabilitando todo o JS, o curso continua 100% legivel (camada interativa e bonus)
- [ ] **Anti-XSS** - texto de nota/quote renderizado por `textContent`, nunca `innerHTML` de input do usuario

## ERRO #27 — `prefers-reduced-motion` honrado

- [ ] **Bloco `@media (prefers-reduced-motion: reduce)`** presente, zerando/encurtando transicoes (vars de cor, check que preenche, highlight que cresce, toast de conclusao)
- [ ] **Estado final preservado** - com motion reduzido, o ESTADO FINAL e o mesmo (lido fica lido, highlight aparece); so a animacao some
- [ ] **TESTE com reduce ligado** - ativando "Reduce motion" no OS/DevTools, nenhuma transicao/animacao perceptivel dispara; sem regressao de funcionalidade
- [ ] **Anti-padroes do baseline mantidos** - nada de scale/translate no hover, bounce, rotate, `shadow-2xl`, neon saturado, confete ou streak (marca sobria)
- [ ] **`reducedMotionOverride` opcional** - se existir override em `inema.prefs`, respeita-o sem ferir o default do sistema

## ERRO #28 — Manifesto do curso presente (progresso cross-pagina depende dele)

- [ ] **`<script type="application/json" data-inema-manifest>` em TODA pagina** - landing, index de trilha e modulos, identico, no `<head>`
- [ ] **Estrutura completa** - `course` (== `<meta name="inema-course">`) + `tracks[]` com `n`/`title` + `modules[]` com `id` (== `data-inema-module`), `title`, `topics` (inteiro) e `href` (opcional)
- [ ] **`topics` bate com os topicos reais** - o `topics` de cada modulo = a CONTAGEM de `[data-inema-topic]` daquele modulo na sua pagina; divergencia => % do curso errado
- [ ] **TESTE de agregacao cross-modulo** - lidos marcados em modulos diferentes somam no `data-inema-meter="curso"`/`="trilha:N"` (read-map persistido sobre o total do manifesto), nao so o modulo da pagina atual
- [ ] **TESTE de degradacao** - sem o `<script data-inema-manifest>`, progresso curso/trilha cai para o DOM da pagina atual (so o modulo corrente) — confirma a dependencia
- [ ] **"Minha jornada" enumera o curso inteiro** - com manifesto, o painel lista todas as trilhas/modulos do curso (nao so os do DOM da pagina); sem ele, lista so o que esta no DOM
- [ ] **Manifesto e DADO** - nao persiste no `localStorage` nem entra no export/import

---

## TEMPLATE RAPIDO — CAMADA DE APRENDIZAGEM (v2)

```
## Revisao v2: [Nome da Pagina]
Data: ____/____/____

### Erros #18-#28
- [ ] #18 Anti-FOUC sem flash (script separado no head)
- [ ] #19 data-* estaveis (meta course, topic/module/track/block)
- [ ] #20 Marcar-lido aria-pressed + justify-start + teclado
- [ ] #21 Progresso derivado agrega e bate "N de M"
- [ ] #22 Export->Import round-trip + merge nao-destrutivo
- [ ] #23 Contraste AA por tema (muted; ambar nunca texto claro) + bridge de chrome (sepia/contraste pintam a pagina)
- [ ] #24 Popover/highlight cross-node sem quebrar (TreeWalker)
- [ ] #25 Jornada role=dialog (foco preso/ESC/inert)
- [ ] #26 Storage off => modo efemero, curso legivel
- [ ] #27 prefers-reduced-motion honrado (estado final preservado)
- [ ] #28 Manifesto do curso em TODA pagina (progresso cross-pagina; topics bate com o DOM)

### Nao-regressao
- [ ] #1-#17 intactos (botoes ESQUERDA, numeros em circulo, INEMA.CLUB, mapa, SVG, profundidade)

### Status: [ ] APROVADO / [ ] PENDENTE
```

---

# ERROS v2 MAIS COMUNS (REVISAR ESPECIALMENTE)

| Erro | O que verificar |
|------|-----------------|
| Flash de tema ao navegar | Anti-FOUC nao esta no `<head>` acima do Tailwind, ou esta dentro do modulo grande (#18) |
| `data-*` ausentes/instaveis | Faltou `<meta name="inema-course">` ou `data-inema-topic`; id depende de classe visual (#19) |
| Marcar-lido sem semantica | `<div onclick>` em vez de `<button aria-pressed>`, ou `justify-center` (#20) |
| Percentual hardcoded | % persistido em vez de derivado do DOM; nao mostra "N de M" (#21) |
| Import destrutivo | Merge apaga estado existente, ou import invalido muta estado (#22) |
| Ambar como texto no claro | Texto ambar-400/-500 sobre superficie clara/sepia (#23) |
| Highlight quebra | Uso de `Range.surroundContents()` lanca em selecao cross-node (#24) |
| Jornada sem foco preso | Tab escapa do dialogo, ESC nao fecha, falta `inert` (#25) |
| Quebra sem storage | Pagina trava em modo privado/`file://` em vez de cair em efemero (#26) |
| Animacao ignora reduce | Sem bloco `@media prefers-reduced-motion` (#27) |
| Progresso curso/trilha so conta o modulo atual | Falta `<script data-inema-manifest>` (ou esta so em algumas paginas); progresso degrada para o DOM da pagina (#28) |
| % do curso errado | `topics` do manifesto nao bate com a contagem real de `data-inema-topic` do modulo (#28) |
| Sepia/contraste so recoloram a prosa | `learn.css` ausente ou bridge de chrome (secao 3b) faltando — chrome v1 nao consome os tokens de tema (#23) |

---

**Ultima atualizacao:** 2026-06-14
**Versao:** 2.0 (camada de aprendizagem — Erros #18-#28 somados aos #1-#17 herdados)
