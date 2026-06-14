# DESIGN-SPEC — Skill `formato-curso-v2` (INEMA.CLUB · "aprendizado agradável")

- **Data:** 2026-06-14
- **Fase:** F2 (síntese / design) — funde 3 propostas (Learnability-first, Visual/Temas-first, Robustez-first) numa única especificação implementável.
- **Skill de REFERÊNCIA (não editar, byte-a-byte intacta):** `/home/nmaldaner/.claude/skills/formato-curso/`
- **Skill NOVA (dev-source):** `/home/nmaldaner/projetos/formato-curso-inema/formato-curso-v2/`
- **Curso-demo (dev-source):** `/home/nmaldaner/projetos/formato-curso-inema/demo/`
- **Insumos:** `BASELINE.md`, `PESQUISA.md`, `PLANO-FORMATO-CURSO-V2.md`.

---

## 0. Tese de design (a fusão)

A v2 **NÃO é um redesign** da `formato-curso`. É a v1 (dark premium âmbar/ciano, SVG futurista, profundidade dos módulos, Erros Críticos #1–#17) com **uma camada de aprendizagem e aparência por cima**, governada por **três princípios não-negociáveis**, herdados um de cada proposta:

1. **LEARNABILITY primeiro, identidade depois** (Proposta 1). O eixo é reduzir carga cognitiva e dar sensação de avanço: chunking (1 ideia/seção, contiguidade texto-gráfico), progressão visível (tópico→módulo→trilha→curso), marcação explícita de lido/dúvida, anotação no próprio texto, e um painel **"minha jornada"** como casa do progresso e do "continuar de onde parei".
2. **VISUAL premium com temas trocáveis sobre DOIS LAYERS que não colidem** (Proposta 2). Decisão arquitetural travada: o Tailwind/`.dark` continua dirigindo o que já é utilitário; **CSS variables** governam parâmetros de leitura e temas extras (`data-theme` **ortogonal** à classe `.dark`). Identidade INEMA = **tema default** e contrato. Nada de prometer "tema novo em 10 linhas" para as partes em utilitário Tailwind.
3. **ROBUSTEZ e SIMPLICIDADE acima de tudo** (Proposta 3). A camada interativa é **enhancement progressivo**: se o JS quebrar ou o `localStorage` estiver bloqueado, o curso continua 100% legível. Persistir só a **verdade mínima** (booleans + quotes), **derivar** percentuais no render. Toda I/O em wrappers `no-throw`. Falhar sempre para o estado seguro.

**Regra de ouro herdada (inegociável):** HTML self-contained, Tailwind via CDN, JS inline, sem build, sem backend, sem framework. Abre em `file://`, funciona offline. Erros Críticos **#1–#17 preservados**; recursos novos viram **regras #18–#27** no SKILL.md e no CHECKLIST_REVISAO.md (espelhados na skill irmã `revisar-curso`).

---

## 1. Modelo de dados `localStorage`

### 1.1 Princípios

- **Dois escopos.** Estado de **aprendizagem** = por curso (`inema.<courseId>.*`). Preferências de **aparência/leitura** = globais ao aluno (`inema.prefs`, cross-curso).
- **`courseId`** derivado de `<meta name="inema-course" content="fep">`; fallback = slug da pasta. Toda chave de aprendizagem é namespaced por ele → estados de cursos diferentes não colidem.
- **Persistir só a verdade mínima.** Guardar booleans de "lido" e registros de nota/dúvida. **NUNCA persistir valores derivados** (percentuais, contagens, badges, "próximo módulo"): tudo derivado é função pura do estado + do DOM atual. Conteúdo mudou → as barras se autocorrigem.
- **Ausência = não-lido.** Só persistir `read[id] = true`; nunca gravar `false` (remover a chave).
- **Toda I/O via wrappers no-throw** (`storageGet`/`storageSet` com try/catch + `JSON.parse` defensivo). Exceção nunca chega à UI — no máximo vira `console.warn`.

### 1.2 Chaves (namespace `inema.<courseId>.*`)

| Chave | Shape | Notas |
|---|---|---|
| `inema.<courseId>.read` | `{ "modulo-1-1#topico-3": true, … }` | Só booleans `true`. Topico→módulo→trilha→curso **tudo derivado** contando ids presentes no DOM. |
| `inema.<courseId>.doubts` | `{ "modulo-1-1#topico-3": { ts, resolved:false }, … }` | Flag de dúvida em **nível de tópico** (botão rápido). Dúvida em nível de **trecho** vive em `notes` com `color:"doubt"` — canal unificado. |
| `inema.<courseId>.notes` | `{ "<blockId>": [ { id, ts, color, quote, note, anchor, tags, orphan? }, … ], … }` | **Uma só forma** para highlight e nota: `note===null` ⇒ highlight puro. Indexado por `blockId` para localizar rápido na re-hidratação. |
| `inema.<courseId>.checks` | `{ "modulo-1-1#q1": { choice, correct, ts }, … }` | Respostas das checagens leves **opcionais**. Separado de `read` pra não poluir o progresso. |
| `inema.<courseId>.meta` | `{ lastTopicAnchor, lastModuleHref, lastScroll, lastVisitedTs, completedAt? }` | Alimenta "continuar de onde parei" e a celebração de 100%. |
| `inema.prefs` *(GLOBAL)* | `{ schemaVersion, theme, font, fontScale, lineWidth, leading, accent, reducedMotionOverride? }` | Preferências visuais, **compartilhadas entre todos os cursos**. Detalhe em §3. |

### 1.3 Registro de nota / highlight (forma única)

```jsonc
{
  "id": "n_1718360000000_a1b2",   // único; gerado com ts + random
  "ts": 1718360000000,
  "color": "yellow",               // yellow | green | blue | pink | doubt
  "quote": "texto exatamente selecionado",  // SEMPRE gravado (fallback de re-ancoragem)
  "note": "minha anotação" | null, // null ⇒ highlight puro (promovível a nota depois)
  "anchor": { "blockId": "m1-1-t3-p2", "startOffset": 12, "endOffset": 47 },
  "tags": ["duvida"],              // tag "duvida" também alimenta o filtro da jornada
  "orphan": false                  // true se a re-ancoragem falhou (texto preservado, listado na jornada)
}
```

### 1.4 Anchoring em camadas de fallback (do mais preciso ao mais resiliente)

1. `blockId` + offsets exatos.
2. Se offsets não baterem: busca literal do `quote` **dentro do bloco**.
3. Se o bloco sumiu: busca do `quote` no `<main>` inteiro.
4. Se nada: marca a nota `orphan:true` → aparece na jornada como "nota sem âncora". **O texto da nota nunca se perde.**

`quote` é SEMPRE gravado — é o seguro contra drift. Como o arquivo é **congelado** (DOM não muda entre sessões), a fragilidade quase não morde, mas a rede de fallback fica para conteúdo editado.

### 1.5 Export / Import `.json` (forward-compatible com sync v2 do portal)

```jsonc
{
  "schemaVersion": 1,
  "courseId": "fep",
  "exportedAt": "<iso>",
  "read":   { },
  "doubts": { },
  "notes":  { },
  "checks": { },
  "meta":   { }
}
```

- `inema.prefs` é **global** → exportado em bloco **separado/opcional**, não dentro do export por-curso.
- **Import defensivo (rede de segurança central):** parse em variável temporária → valida `schemaVersion` → só commita se válido. **Merge não-destrutivo por default** (união de lidos/notas/dúvidas; nada é apagado); `replace` exige confirmação. Arquivo inválido = **no-op** com mensagem; estado atual intacto. Retorna `{ok, applied, skipped, errors}`.
- **Round-trip lossless** é critério de sucesso. Campos desconhecidos de versões futuras são **preservados** no round-trip (não descartar o que não se reconhece).
- `migrate(state)` puro: recebe qualquer `schemaVersion <= atual`, devolve o shape corrente com defaults para campos faltantes.

### 1.6 Robustez (regras transversais)

- **Probe de storage no boot** (try set/get/remove de chave-sonda). Indisponível (modo privado/cota/`file://` restrito) ⇒ **modo efêmero** (estado em memória) + aviso discreto **não-bloqueante**. O curso permanece legível.
- `JSON.parse` defensivo: estado corrompido ⇒ reset **só daquela chave** (não quebra a página) + `console.warn`.
- Gravação com **debounce** em eventos de alto volume (scroll, seleção).
- Cap de tamanho por nota e aviso perto da cota (~5MB). `QuotaExceededError` ⇒ set falha silenciosamente, mantém estado anterior, sugere export.
- **Anti-XSS auto-infligido:** texto de nota/quote renderizado SEMPRE por `textContent` (nunca `innerHTML` de input do usuário).
- Migração do legado: na primeira carga, `applyPrefs()` faz fallback ao `localStorage.theme` (chave do v1) para não "resetar" a preferência de dark/light do aluno.

---

## 2. API do módulo JS reutilizável

Namespace único **`window.INEMA`** (IIFE inline), para não colidir com as 3 funções-núcleo do v1 (`toggleTopic`, theme toggle, `openModal/closeModal`, que continuam existindo). **Idempotente e re-entrant:** pode rodar em qualquer página (landing/trilha/módulo) e só ativa o que existe ali (feature-detect por presença de `data-*`). Guard por flag evita listeners duplicados. Boot em `DOMContentLoaded`; o **anti-FOUC de tema roda ANTES** (script bloqueante separado no `<head>`).

### 2.1 Boot / núcleo

| Método | Assinatura | Propósito |
|---|---|---|
| `INEMA.init` | `init(opts?)` | Probe de storage, lê `courseId` do `<meta>`, hidrata estado, pinta lidos/dúvidas/highlights existentes, monta toggles, TOC/scrollspy, jornada e seletor de aparência. Idempotente. |
| `INEMA.applyPrefs` | `applyPrefs()` | Aplica `inema.prefs` (tema/font/scale/lineWidth/leading/accent) via CSS vars + classe `.dark`/atributo `data-theme` no `<html>`. Chamado no anti-FOUC e no init. |

### 2.2 Progresso / lido (só derivado)

| Método | Assinatura | Propósito |
|---|---|---|
| `INEMA.markRead` | `markRead(itemId, bool)` | Escreve boolean e re-renderiza **no mesmo tick** (localStorage é síncrono ⇒ progresso instantâneo). Re-render toca só os medidores do escopo afetado. |
| `INEMA.isRead` | `isRead(itemId) → bool` | Consulta. |
| `INEMA.progress` | `progress(scopeId?) → {done,total,pct}` | `scope` = `'curso'`/`'trilha:N'`/`'modulo:X-Y'`. **Derivado do DOM** (conta itens reais). Exibe sempre "N de M" além do %. |
| `INEMA.renderMeters` | `renderMeters()` | Repinta todos os anéis/barras visíveis no mesmo tick. |

### 2.3 Dúvida

| Método | Assinatura | Propósito |
|---|---|---|
| `INEMA.toggleDoubt` | `toggleDoubt(itemId)` | Flag de dúvida em nível de tópico (botão rápido, zero digitação). |
| `INEMA.setDoubtResolved` | `setDoubtResolved(itemId, bool)` | Toggle "resolvido" usado na jornada. |
| `INEMA.listDoubts` | `listDoubts() → []` | Dúvidas de tópico **+** highlights `color:"doubt"`, unificados para a jornada. |

### 2.4 Notas / highlight

| Método | Assinatura | Propósito |
|---|---|---|
| `INEMA.highlight` | `highlight(range, {color, note?, tags?}) → id` | Cria highlight/nota. Render por **`TreeWalker`** envolvendo text nodes pedaço a pedaço — **NUNCA `Range.surroundContents()` cego** (lança `InvalidStateError` em seleção cross-node, E8). MVP pode restringir seleção ao bloco anotável. |
| `INEMA.promoteToNote` | `promoteToNote(id, text)` | Promove highlight puro (`note:null`) a nota. |
| `INEMA.editNote` | `editNote(id, patch)` | Edita nota/cor/tag. |
| `INEMA.removeNote` | `removeNote(id)` | Desfaz spans (substitui por text node + `parent.normalize()`) e remove o registro. |
| `INEMA.renderHighlights` | `renderHighlights(container)` | Re-aplica do storage no load. **Tolerante por nota:** uma que não ancora vira órfã e **não derruba as outras**. |

**Popover de seleção:** `mouseup`/`touchend` lê `getSelection()`; se range não-colapsado, `getBoundingClientRect()` posiciona popover (considerar `scrollX/scrollY`; reposicionar se transbordar viewport). Swatches (1 reservado = **"dúvida"**) + "Adicionar nota" + "Copiar". **Clipboard com fallback** `file://` (textarea + `execCommand`, porque `navigator.clipboard` exige secure context). Fecha em mousedown fora ou seleção vazia.

### 2.5 Jornada (view pura)

| Método | Assinatura | Propósito |
|---|---|---|
| `INEMA.openJourney` | `openJourney()` | Abre painel global (modal/drawer com `role=dialog`, foco preso, ESC fecha, `inert` no resto). Reusa o padrão `openModal`/`closeModal` do v1. |
| `INEMA.renderJourney` | `renderJourney(mountEl)` | Agrega `read`/`doubts`/`notes`/`meta` + progresso: barras (curso/trilhas/módulos), lista de dúvidas (filtrável, com link de volta via `scroll-margin-top`), notas (quote+nota+cor+tag, filtrável por cor "dúvida"), CTA "continuar de onde parei", Export/Import/Reset. **Só leitura do estado** — nunca dessincroniza, não duplica conteúdo. |

### 2.6 Continuar de onde parei

| Método | Assinatura | Propósito |
|---|---|---|
| `INEMA.saveCheckpoint` | `saveCheckpoint()` | Atualiza `meta` ao marcar lido / abrir tópico. Escrito em **`visibilitychange`** (não `beforeunload`; melhor no mobile), com debounce. |
| `INEMA.resume` | `resume()` | Restaura para a **âncora do último tópico** (`scrollIntoView` por id) — nunca `scrollY` cru (accordions colapsados). Pixel-offset só como fallback best-effort. |

### 2.7 Export / Import

| Método | Assinatura | Propósito |
|---|---|---|
| `INEMA.exportJSON` | `exportJSON() → string` | Sempre produz arquivo válido (mesmo com estado vazio). Download via Blob + objectURL, sem dependência. |
| `INEMA.importJSON` | `importJSON(text, {mode}) → {ok,applied,skipped,errors}` | `mode` = `'merge'` (default, não-destrutivo) / `'replace'` (pede confirmação). Valida em var temporária; **não muta estado se inválido**. |

### 2.8 Tema / preferências

| Método | Assinatura | Propósito |
|---|---|---|
| `INEMA.setPref` | `setPref(key, val)` | `theme`/`font`/`fontScale`/`lineWidth`/`leading`/`accent` → aplica CSS var + classe/atributo no `<html>` e persiste em `inema.prefs`. Tema desconhecido ⇒ dark default. |
| `INEMA.getPrefs` | `getPrefs() → obj` | Lê prefs com defaults. |
| `INEMA.cyclePref` | `cyclePref(key)` | Para o seletor compacto. |

### 2.9 Checagem leve opcional

| Método | Assinatura | Propósito |
|---|---|---|
| `INEMA.registerCheck` | `registerCheck(id, {q, options, answer})` | Declara uma checagem por seção-chave (opt-in). |
| `INEMA.submitCheck` | `submitCheck(id, choice)` | Feedback imediato **explicativo por opção**; **NUNCA bloqueia avanço** (D10/B6); grava em `checks`. Erradas podem ressurgir na próxima visita. |

### 2.10 Utilitários internos blindados (não-públicos, núcleo da resiliência)

`storageGet/storageSet` (try/catch + parse defensivo), `safeJSON(str, fallback)`, `probeStorage()`, `migrate(state)`, `domTotals(scope)` (conta itens reais p/ derivar %), `coreVars` (nomes canônicos das CSS vars). Delegação de eventos no `<main>` (um listener, não N). Sem `setInterval`/polling. Toda exceção capturada ⇒ no máximo `console.warn`.

### 2.11 Observabilidade barata (hook para sync v2)

`INEMA` dispara `CustomEvent`s: `inema:read`, `inema:note`, `inema:doubt`, `inema:progress`. UI reage desacoplada (badge da jornada na nav). São o **ponto de extensão** para o sync v2 (mesmos eventos → POST no portal) — nada de cliente HTTP/auth agora.

---

## 3. Sistema de temas (CSS custom properties + `data-theme`)

### 3.1 Arquitetura: DOIS LAYERS ortogonais (decisão travada)

- **Eixo 1 — claro/escuro = classe `.dark` do Tailwind** (preservado intacto). Continua dirigindo todos os `dark:bg-dark-800`, `dark:text-amber-400`. **Mover o root para `data-theme` quebraria TODO `dark:` do markup — VETADO.**
- **Eixo 2 — variante de leitura = `data-theme` no `<html>`** (ortogonal), governado por **CSS variables** no bloco `<style>` à mão + componentes novos. `sepia`, `foco`, `alto-contraste` vivem aqui.
- **Arquitetura de cor em 3 níveis** (web.dev): (1) **primitivos** = canais HSL crus; (2) **tokens de tema** por `data-theme`; (3) **semânticos genéricos** que a página consome (`--bg`, `--surface`, `--surface-2`, `--text`, `--text-muted`, `--border`, `--primary`, `--accent`, `--accent-2`). A página referencia **só o nível 3**.
- **Promessa honesta:** "tema novo barato" vale só para o Layer B. As partes em utilitário Tailwind **não** trocam por variável sem refactor.

### 3.2 Anti-FOUC (item de maior confiança)

Script **bloqueante minúsculo e SEPARADO** no `<head>`, **acima** do Tailwind, com try/catch: lê `inema.prefs` e seta `.dark` **E** `data-theme` **E** as classes de leitura **antes do primeiro paint**. Independente do módulo grande — se ele falhar, o tema ainda foi aplicado. Default dark no erro preserva a marca.

### 3.3 `color-scheme` por tema

Cada `data-theme` declara `color-scheme: dark|light` → conserta scrollbars, inputs e selects nativos de graça (uma linha por tema).

### 3.4 Conjunto de temas (default = identidade INEMA)

| `data-theme` | Nome | Valores-chave (verificados na PESQUISA) | `color-scheme` |
|---|---|---|---|
| *(none)* + `.dark` | **inema-dark** *(DEFAULT, = baseline intacta)* | `--bg #111827` · `--surface #1f2937` · `--surface-2 #374151` · `--text #e6e6e6` · `--text-muted #a8a8b3` · `--primary #FACC15` (âmbar) · `--accent-2 #38bdf8` (ciano) · `--border #374151`. Nunca `#000`/`#fff` puros. | dark |
| *(none, `.dark` off)* | **claro** | `--bg #ffffff` · `--text #1a1a1a` (~16:1 AAA) · `--text-muted #6e6e6e` (piso seguro) · surfaces `#f8fafc`/`#f3f4f6` **sólidas** (nunca gradiente — regra de light-mode do baseline). **Âmbar de TEXTO → amber-700/-800**; âmbar só decorativo. | light |
| `sepia` | **sépia / leitura** | `--bg #FBF0D9` · `--surface #F4E8CE` · `--text #5F4B32` (7.31:1 AAA) · `--text-muted #7A6650` · `--border #E0D2B0`. Acento de texto = marrom escurecido ou amber-800; âmbar saturado **só** fill/borda. | light |
| `foco` | **foco** | Parte de dark/claro mas **reduz `--measure`** (coluna estreita), **aumenta `--leading`**, esconde cromo lateral (nav minimal, esconde stats decorativos), centraliza a prosa. **Não mexe na cor** — só densidade/medida/visibilidade. | herda |
| `contraste` | **alto-contraste** (dark) | `--text #F5F7FA` sobre `--bg #0A0E14` (18.02:1) · âmbar `#FACC15` (12.63:1) · ciano `#38bdf8` (9.03:1) — todos AAA. Bordas visíveis em todos os cards/toggles; anel de foco reforçado. **Caminho a11y principal** (mais confiável que `forced-colors`). | dark |

*Extra quase-de-graça (backlog):* **dim** — variar só L/S do hue ~215–221 da escada dark do INEMA; publicar só após re-checar contraste (fórmulas do web.dev são ilustrativas).

### 3.5 Preferências de leitura (painel separado, mesma persistência `inema.prefs`)

Todas em **CSS variables** num wrapper de conteúdo `.inema-prose`, em **unidades relativas** (sobrevivem a zoom 200% / overrides 1.4.12):

| Pref | CSS var / mecânica | Valores | Fonte |
|---|---|---|---|
| **Tamanho** (`fontScale`) | `:root` font-size 100/112/125% (resto em rem escala junto). **Nunca** fixar `font-size` do `:root` em px. | 100 \| 112 \| 125 | C2, F10 |
| **Largura de linha** (`lineWidth`) | `--measure` clampa **só a prosa** (`max-width:var(--measure); margin-inline:auto`), nunca code/tabelas/grids. | `60ch` \| `68ch` \| `75ch` | C1, G6 |
| **Entrelinha** (`leading`) | `--lh-body` multiplicador **sem unidade** (herda/sobrevive a override). | compacto `1.45` \| confortável `1.7` | C3 |
| **Fonte** (`font`) | `--font-body`. Default **Inter** (já atende). Alternativa "conforto" = sans counters abertos + letter/line-spacing maior — **escolha, nunca default nem promessa de "resolve dislexia"**; fontes extras só se embutidas/permitidas. | inter \| system \| leitura | C8, F12 |
| **Acento** (`accent`) | `--accent-h/-s/-l` + `--accent`. Swatches = 6 cores de trilha INEMA (emerald/blue/purple/amber/teal/rose). **Travado na família INEMA** (não color-picker livre). Só afeta componentes novos / `<style>` à mão; em claro/sépia usa o degrau `-700/-800` para passar contraste. | slug de trilha | G4 |
| **Densidade** | **REBAIXADO** — espaçamento da baseline é utilitário Tailwind fixo (`mb-16`,`p-8`), nada a multiplicar sem refactor. No MVP "densidade" = só `fontScale`/`leading`. Espaçamento real → backlog. | — | G7 |

### 3.6 Tipografia: alinhar à escala existente (não criar concorrente)

Variáveis espelham a escala fixa da baseline (hero `text-4xl/5xl` → seção `text-2xl` → card `text-xl` → corpo `text-base`). `--space-para:1.5em`, `--space-section:3rem`; títulos com mais margem em cima que embaixo. **Não usar** o plugin `prose` oficial (exige build) — replicar à mão.

### 3.7 Contraste verificado POR TEMA (portão de qualidade)

Cada par `--text`/`--text-muted` sobre cada `--bg` passa AA 4.5:1 (mirar AAA 7:1 leitura longa); muted/legenda é o par que mais falha. Bordas/anel de foco/ícones ≥3:1. **Âmbar NUNCA como TEXTO em superfície clara** (1.35:1 no sépia, 1.53:1 no branco) — só fill/borda; texto de acento cai para `-700/-800`. Vira item testável no CHECKLIST.

### 3.8 Seletor de aparência

Botão/popover **`<button>`-based** (não `<select>` frágil) na nav, **ao lado** do toggle sol/lua existente (que é **absorvido**, eixo claro/escuro continua). Abre painel com: 4–5 temas + tipografia/tamanho/entrelinha + medida (foco) + paleta de acento. Reflete estado por **ícone+texto, não só cor** (1.4.1). Salvo em `inema.prefs`, re-aplicado em todas as páginas no load (antes do paint).

### 3.9 Micro-interações contidas (marca sóbria, anti-manipulação)

Transição curta nas CSS vars de cor, check de "lido" que preenche, toast discreto de conclusão, highlight que cresce no select. **Tudo sob `@media (prefers-reduced-motion: reduce)`** (zera/encurta, **preserva estado final**). Anti-padrões do baseline mantidos: nada de scale/translate no hover, bounce, rotate, `shadow-2xl`, neon saturado, confete, streak.

---

## 4. Convenções de markup (hooks que o JS procura)

### 4.1 IDs estáveis (contrato de ancoragem — pré-requisito de TUDO)

- `<meta name="inema-course" content="fep">` no `<head>` de toda página → `courseId`.
- **Módulo:** elemento exterior com `id="modulo-X-Y"` (já existe no baseline) + `data-inema-module="X-Y"` + `data-inema-track="N"`.
- **Tópico/seção:** `<section id="topico-N" data-inema-topic="modulo-X-Y#topico-N">` — o `data-inema-topic` é o **id estável de progresso/notas** (ex.: `modulo-1-1#topico-3`). Mudar o layout visual não quebra o estado.
- **Bloco anotável:** `data-inema-block="m1-1-t3-p2"` (modulo-topico-parágrafo, determinístico). Sem `blockId`, o elemento simplesmente **não é anotável** (degrada, não quebra).
- Acordeão de tópico (no index) preserva `onclick="toggleTopic(this)"` do v1.

### 4.2 Atributos que ativam features (feature-detect)

| Atributo | Onde | Ativa |
|---|---|---|
| `data-inema-course` *(via `<meta>`)* | `<head>` | namespace de estado |
| `data-inema-module="X-Y"` | card/header de módulo | progresso do módulo |
| `data-inema-track="N"` | header de trilha/módulo | progresso da trilha, acento |
| `data-inema-topic="…"` | `<section>` de tópico | marcar lido, scrollspy |
| `data-inema-block="…"` | parágrafo/bloco de prosa | seleção/highlight/nota |
| `data-inema-read-toggle` | `<button>` em cada seção | controle "marcar como lido" |
| `data-inema-doubt-toggle` | `<button>` por tópico | flag de dúvida rápida |
| `data-inema-meter="scope"` | barra/anel | onde `renderMeters` pinta (`curso`/`trilha:N`/`modulo:X-Y`) |
| `data-inema-toc` | `<nav>` lateral | TOC sticky + scrollspy |
| `data-inema-journey-open` | botão na nav | abre "minha jornada" |
| `data-inema-check="id"` | bloco de checagem | quiz leve opcional |

### 4.3 Acessibilidade no markup (parte do contrato)

- `<a class="skip" href="#conteudo">` como **primeiro focável**; `<main id="conteudo">` (landmark).
- `scroll-margin-top` (= altura do nav) em todos os alvos focáveis/âncoras (nav sticky obscurece foco — 2.4.11).
- Accordions: `<button aria-expanded aria-controls="painel-id">` + `id` no `.topic-explanation`.
- "Marcar lido": `<button aria-pressed>` (ou `role=switch aria-checked`), Space alterna, estado por ícone+texto+cor.
- Modais/jornada: `role=dialog aria-modal=true aria-labelledby`, foco preso, devolução de foco ao gatilho, `inert` no resto.
- `:focus-visible { outline:3px solid var(--accent-2); outline-offset:2px }` (anel só no teclado, ≥3:1 por tema).

### 4.4 Regra de não-regressão dos Erros Críticos

Os controles novos **não podem** violar #1–#17: "marcar lido" não vira botão `justify-center` (#1); marcador de nota não vira seta perto de tópico (#2); nav/INEMA.CLUB/mapa-da-trilha/SVG/profundidade intactos (#4/#12/#13/#14/#17). Recursos novos só **adicionam**.

---

## 5. Melhorias didáticas a aplicar no MASTER novo

Aplicadas por cima do MASTER da baseline (mantendo 6–8 seções/módulo, regra #14):

1. **Chunking — "uma ideia por seção"** (B3). Receita por seção: **um conceito + um demo/SVG + uma checagem leve opcional**.
2. **Contiguidade espacial** (B4): legenda/SVG **colados** ao parágrafo que ilustram (ao lado/abaixo), nunca soltos num parágrafo distante. Callouts inline apontando linhas de código.
3. **Modelo mental primeiro** (B2): abrir cada tópico com diagrama/SVG rotulado + frase simples **antes** da sintaxe (reusa o SVG futurista existente). Interação barata "preveja, depois revele".
4. **Títulos como tarefa/resultado** (B5): "Faça X", não rótulos genéricos.
5. **TOC sticky + scrollspy** (`IntersectionObserver`) dentro da página de módulo + indicador **"Seção N de M"** — preenche a lacuna "sem TOC lateral" do BASELINE. Colapsa para uma coluna no mobile.
6. **Marcar lido explícito por seção** (D2) — caminho primário; scroll-spy e "continuar" são assistências que **nunca** escrevem conclusão.
7. **Progresso em 3 granularidades** (D1) visível: anel/barra por módulo, por trilha, por curso; "N de M" + %.
8. **Checagem de conhecimento leve e NÃO-bloqueante** (B6/B7), opt-in por módulo: 1 pergunta de auto-recuperação ao fim de seções-chave, feedback explicativo por opção, ancora de volta ao parágrafo, nunca trava avanço. Resolve a lacuna "sem quiz" sem virar LMS.
9. **Recall espaçado parcial** (B8): pergunta de seção **anterior** no fim de cada seção + revisão de fim de página; `localStorage` ressurge as erradas. Calibrar expectativa (não é SRS agendado).
10. **Fricção mínima até o 1º resultado + divulgação progressiva** (B11): exemplo pré-preenchido que **já funciona**; aprofundamentos atrás de `<details>` ("Indo mais fundo (opcional)").
11. **Voz quente contida** (B10): celebrar conclusão, normalizar esforço, CTAs pelo benefício — **sem coachzinho**, coerente com a marca sóbria.
12. **Anotação/dúvida no próprio texto** como didática (não só feature): marcar dúvida com cor reservada alimenta "revisar minhas dúvidas".
13. **Acessibilidade como contrato** (F1–F14): todos os itens da §4.3 entram como regra do MASTER, verificados por tema.

---

## 6. Estrutura de arquivos

### 6.1 Skill nova — `/home/nmaldaner/projetos/formato-curso-inema/formato-curso-v2/`

```
formato-curso-v2/
├── SKILL.md                          # entrypoint: fluxo, Erros Críticos #1–#27, roteamento, quando colar learn.js/learn.css
├── references/
│   ├── MASTER_COMPLETO.md            # baseado no v1 + seções novas: camada de aprendizagem, temas, markup data-*, didática §5
│   ├── DESIGN-SYSTEM.md              # filosofia visual v1 + arquitetura de tokens 3 níveis, temas, prefs de leitura, micro-interações contidas
│   ├── CHECKLIST_REVISAO.md          # checklist v1 + itens novos (§J da PESQUISA): round-trip, contraste por tema, a11y, FOUC, progresso agrega
│   ├── SVG-FUTURISTA.md              # copiado do baseline (biblioteca de diagramas), intacto
│   └── LEARN-LAYER.md                # contrato detalhado: modelo de dados §1, API §2, snippets de markup §4 (copia-e-cola)
└── assets/
    ├── learn.js                      # módulo IIFE window.INEMA (§2) — bloco inline copia-e-cola, 1 por página
    └── learn.css                     # CSS vars + temas (§3) + .inema-prose + estilos dos controles novos
```

- `SKILL.md`: roteamento secao→pagina (como o v1) + **tabela de Erros Críticos #1–#27** (os 17 herdados + 10 novos: anti-FOUC, IDs estáveis obrigatórios, marcar-lido acessível, contraste por tema, popover de seleção, jornada acessível, export/import round-trip, scroll-margin nos alvos, ARIA nos accordions, modos efêmero/órfão de degradação). Instrui a **colar `learn.js` + `learn.css` inline** em cada página (mantém o padrão snippet copia-e-cola do baseline; agora há 1 bloco grande novo além das 3 funções-núcleo).
- `MASTER_COMPLETO.md`: herda todo o v1 e acrescenta seções: **Camada de aprendizagem** (markup `data-*`, onde plugar controles), **Sistema de temas** (3.x), **Didática** (§5), **Anti-FOUC e prefs**.
- `LEARN-LAYER.md`: a fonte-de-verdade técnica do módulo — modelo de dados, API, schema export/import, snippets de markup. Separa o "como aprende" do "como parece".
- Espelhar regras #18–#27 também no `CHECKLIST_REVISAO.md` (skill irmã `revisar-curso` consome o mesmo checklist).

### 6.2 Curso-demo — `/home/nmaldaner/projetos/formato-curso-inema/demo/`

```
demo/
├── index.html                                   # landing: brand + 1 trilha + CTA + botão "minha jornada" + seletor de aparência + "continuar de onde parei"
└── curso/
    └── trilha1/
        ├── index.html                           # index da trilha: hero SVG + stats + Mapa da trilha + cards de módulo c/ tópicos expansíveis + anéis de progresso + modais iframe
        ├── modulo-1-1.html                       # módulo completo: 6-8 seções, SVG inline, marcar-lido por seção, TOC sticky+scrollspy, dúvida, highlight/nota, 1 checagem leve
        └── modulo-1-2.html                       # 2º módulo idem — prova progresso agregando trilha→curso e "continuar de onde parei" cross-módulo
```

- `<meta name="inema-course" content="demo">` em todas as páginas.
- O demo **prova todos os recursos**: marcar lido/dúvida/notas, persiste no reload, export→import round-trip, jornada com progresso agregado real, troca de tema (claro/sépia/foco/alto-contraste) aplica e persiste entre páginas, progresso agrega tópico→módulo→trilha→curso.
- Cada página cola `learn.css` (no `<style>`/`<head>`) + `learn.js` (inline antes de `</body>`) + o **script anti-FOUC bloqueante** no topo do `<head>`. Acento da trilha 1 = emerald (T1).

---

## 7. Lista priorizada de features

### ALTA (fazer já — alto valor, baixo custo, sem refactor; Nível 1 da PESQUISA)

| Feature | Por quê |
|---|---|
| Script **anti-FOUC bloqueante** no `<head>` (classe `.dark` + `data-theme`) | item mais seguro; sem ele há flash a cada navegação (G3) |
| **CSS vars de leitura** em `.inema-prose` (`--measure`/`--fs-body`/`--lh-body`/`--font-body`), clampar só a prosa | ponto único de afinação (C-final) |
| `color-scheme` por tema | conserta scrollbars/inputs, 1 linha (G2) |
| **IDs/`data-*` estáveis** (`data-inema-topic/-module/-track/-block`, `<meta>` courseId) | pré-requisito de progresso/notas/retomar |
| **Marcar lido explícito** `<button aria-pressed>`; **persistir booleans, derivar %** | progresso confiável, instantâneo (D1, D2, D8, F6) |
| **Progresso 3 granularidades** (anel/barra módulo/trilha/curso, "N de M"+%) | sensação de avanço (D1) |
| **A11y base**: skip-link, `scroll-margin-top`, `aria-expanded`/`aria-controls`, `:focus-visible`, `prefers-reduced-motion` | contrato, não bônus (F2–F5, F7, F14) |
| **Chunking** (1 conceito + 1 demo + 1 check/seção), títulos como tarefa | carga cognitiva (B3, B5) |
| **Contraste verificado por tema** (muted incluso) | portão de qualidade (C6, F4, G5, G8) |
| **Modo efêmero / degradação graciosa** (probe de storage) | curso legível mesmo sem storage/JS |

### MÉDIA (na sequência — alto valor, custo médio; Nível 2 da PESQUISA)

| Feature | Por quê |
|---|---|
| **Highlight + nota via popover de seleção**, cor reservada "dúvida", `TreeWalker` (não `surroundContents`), editar/excluir no span | anotação no texto + marcar dúvida sem digitar (E1–E3, E7–E9) |
| **Painel "minha jornada" / Review** (lidos, dúvidas, notas filtráveis, "resolvido") | casa do progresso (E6) |
| **Export/Import `.json`** round-trip lossless, merge não-destrutivo | backup/portabilidade + base do sync v2 (§6 plano) |
| **"Continuar de onde parei"** por âncora do tópico, `visibilitychange` | retomar honesto (D3) |
| **TOC sticky + scrollspy** + "Seção X de N" | wayfinding (B12, B5) |
| **Self-checks inline** feedback explicativo, não-bloqueante, ancora de volta | efeito de teste (B6, B7) |
| **Temas extras** (sépia/foco/alto-contraste) `data-theme` ortogonal | personalização de leitura (G2, G5, G8) |
| **Seletor de aparência** `<button>`-based + prefs persistidas | aparência trocável (C-final) |
| **Modais acessíveis** (foco preso, `inert`, devolução) | a11y dos modais existentes (F8) |
| **CustomEvents** (`inema:read/note/progress`) | hook desacoplado p/ sync v2 |

### BAIXA (considerar / polish; Nível 3 da PESQUISA)

| Feature | Por quê |
|---|---|
| **Goal-gradient** copy condicional ("Falta 1 tópico…") + endowed progress honesto | motivação sóbria (D5, D4) |
| **Marco/badge sutil só em 100% genuíno** (`completedAt`, sem confete/streak) | celebração contida (D6, D9) |
| **Demos manipuláveis inline** (slider/toggle) por conceito | aprender fazendo (B1, B2) |
| **Recall espaçado parcial** (pergunta de seção anterior, erradas ressurgem) | retenção parcial (B8) |
| **Pref tipografia/tamanho/espaçamento** (modo conforto opcional) | a11y/escolha (C2, C8, F11, F12) |
| **Tema "dim"** (variar L/S do hue dark) | extra quase-de-graça (G9), re-checar contraste |
| **`@media (forced-colors: active)`** bordas sólidas | polish após AA base (F13) |
| **Bottom sheet de nota no mobile** + drawer de notas toggle | UX mobile de notas (E4, E5) |

### NÃO FAZER AGORA (custo alto / desalinhado)

- Toggle de **densidade real** (espaçamento Tailwind fixo — escopar só fontScale). (G7)
- **Streaks diários** (punem uso em rajadas, batem no tom sóbrio). (D7)
- **Migrar todo o markup para `data-theme`/tokens genéricos** (quebraria `dark:`, refactor grande — dois layers convivem). (G1, G2, H1)
- **Gatear a espinha sequencial** por conclusão (quebra "abre e lê offline"). (D10)
- **SRS agendado de verdade** (impossível num arquivo estático). (B8)
- **Backend/auth/sync** (= v2; só garantir schema + CustomEvents como ponto de extensão).

---

## 8. Riscos e mitigações (consolidado das 3 propostas)

| Risco | Mitigação |
|---|---|
| Quebrar Erros Críticos #1–#17 ao injetar a camada nova | Features só **adicionam**; viram regras #18–#27; `revisar-curso` testa ambos |
| `[data-theme]` quebrar todos os `dark:` do Tailwind | **Manter `.dark`** para Tailwind; `data-theme` ortogonal só p/ temas extras |
| Highlight cross-node lançar / âncora driftar | `TreeWalker` (não `surroundContents`), quote sempre gravado, nota órfã listada |
| Import corrompido / XSS | parse em var temp + valida schema antes de commitar; render por `textContent` |
| FOUC de tema | script bloqueante separado no `<head>`, default dark no erro |
| Contraste falhar por tema (muted, âmbar-texto claro) | tabela de pares verificada por tema no CHECKLIST; âmbar só fill em superfície clara |
| Storage indisponível (privado/`file://`/cota) | probe + modo efêmero + curso legível + aviso não-bloqueante |
| Foco obscurecido pelo nav sticky | `scroll-margin-top` = altura do nav em todos os alvos |
| Inflar para mini-LMS | tudo vanilla inline; quiz leve opt-in; SRS fora; sem gamificação infantil |
| `revisar-curso` cego aos recursos novos | espelhar #18–#27 no CHECKLIST no mesmo passo |
| Migração do `theme` legado do v1 | `applyPrefs()` faz fallback ao `localStorage.theme` na 1ª carga |
| Over-engineering p/ sync v2 | só schema versionado + CustomEvents como ponto de extensão; sem HTTP/auth agora |

---

_Spec de design F2 — funde Proposta 1 (learnability), Proposta 2 (visual/temas em 2 layers) e Proposta 3 (robustez/simplicidade) numa única especificação implementável. Guia a implementação F3 da skill `formato-curso-v2` e do curso-demo._
