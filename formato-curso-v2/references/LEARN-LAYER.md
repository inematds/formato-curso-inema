# LEARN-LAYER — contrato técnico da camada de aprendizagem (`formato-curso-v2`)

> Fonte-de-verdade do módulo `window.INEMA`. Este documento descreve a API, o
> modelo de dados e o markup **REAIS** implementados em
> `assets/learn.js` + `assets/learn.css` — não apenas a spec. Onde o código
> diverge do `DESIGN-SPEC.md` (§1/§2/§4), o **código manda** e a divergência
> está sinalizada.
>
> - Implementação: `formato-curso-v2/assets/learn.js` (IIFE, `window.INEMA`, sem build, sem deps).
> - Estilos: `formato-curso-v2/assets/learn.css` (tokens 3 níveis + `.inema-prose` + controles novos).
> - Snippets prontos: `assets/inema-head-snippet.html` e `assets/inema-init-snippet.html`.
> - Princípios herdados do `DESIGN-SPEC`: persistir só a verdade mínima, derivar o resto; toda I/O `no-throw`; falhar para o estado seguro; enhancement progressivo.

---

## 1. Modelo de dados `localStorage`

### 1.1 Dois escopos

| Escopo | Chave | Vida | Conteúdo |
|---|---|---|---|
| **Aprendizagem** (por curso) | `inema.<courseId>.*` | por `courseId` | lidos, dúvidas, notas, checks, meta |
| **Aparência/leitura** (global ao aluno) | `inema.prefs` | cross-curso | tema, fonte, escala, medida, entrelinha, acento |

`courseId` vem de `<meta name="inema-course" content="...">`. Sem o `<meta>`, o
fallback é o slug da pasta/arquivo da URL, saneado para `[a-z0-9-_]` minúsculo
(`detectCourseId()`); último recurso = `"curso"`. Override programático via
`INEMA.init({ courseId: "..." })`.

**Regras transversais (todas implementadas):**

- **Ausência = não-lido.** Só grava `read[id] = true`; ao desmarcar, **remove a chave** (nunca grava `false`).
- **Nunca persiste derivados.** Percentuais, contagens, badges e "próximo módulo" são funções puras de `read` + DOM. Conteúdo muda → as barras se autocorrigem.
- **Toda I/O `no-throw`.** `storageGet`/`storageSet` envolvem `localStorage` em try/catch + `JSON.parse` defensivo (`safeJSON`). Exceção nunca chega à UI — vira `console.warn`.
- **JSON corrompido = reset só daquela chave.** `storageGet` faz `rawRemove(key)` e devolve o fallback; a página não quebra.
- **`QuotaExceededError`** → o set falha silenciosamente, mantém o estado anterior e dispara um toast "Armazenamento cheio. Exporte sua jornada…".
- **Modo efêmero.** No boot, `probeStorage()` faz set/get/remove de `__inema_probe__`. Se falhar (aba privada, `file://` restrito, cota), `S.ephemeral = true`: todo estado vive num espelho em memória (`S.mem`), o curso permanece legível e um aviso discreto não-bloqueante é exibido. Em modo normal, escritas também espelham em `S.mem` para leitura rápida.
- **Anti-XSS auto-infligido.** Todo texto de aluno (quote/nota) é renderizado por `textContent` (helper `el()` / `notify()`), nunca `innerHTML`.

### 1.2 Chaves de aprendizagem (`inema.<courseId>.*`)

| Chave | Shape | Notas |
|---|---|---|
| `read` | `{ "modulo-1-1#topico-3": true, … }` | Só booleans `true`. Progresso tópico→módulo→trilha→curso é **derivado** contando ids no DOM. |
| `doubts` | `{ "modulo-1-1#topico-3": { ts, resolved }, … }` | Dúvida em **nível de tópico** (botão rápido). `ts` = `Date.now()`; `resolved` boolean. |
| `notes` | `{ "<blockId>": [ { id, ts, color, quote, note, anchor, tags, orphan }, … ], … }` | **Uma só forma** para highlight e nota: `note === null` ⇒ highlight puro. Indexado por `blockId`. Dúvida de **trecho** = nota com `color:"doubt"`. |
| `checks` | `{ "modulo-1-1#q1": { choice, correct, ts }, … }` | Respostas das checagens leves opcionais. Separado de `read` para não poluir o progresso. |
| `meta` | `{ lastTopicAnchor, lastModuleHref, lastScroll, lastVisitedTs, completedAt? }` | Alimenta "continuar de onde parei" e a celebração de 100%. `completedAt` (ISO) é gravado uma única vez em 100% genuíno. |

### 1.3 Registro de nota / highlight (forma única — exatamente o que `highlight()` grava)

```jsonc
{
  "id": "n_1718360000000_a1b2",   // genId(): "n_" + Date.now() + "_" + random(4)
  "ts": 1718360000000,            // Date.now()
  "color": "yellow",              // yellow | green | blue | pink | doubt  (SWATCHES)
  "quote": "texto exatamente selecionado",  // SEMPRE gravado (seguro de re-ancoragem)
  "note": "minha anotação",       // string OU null  (null ⇒ highlight puro, promovível)
  "anchor": {                     // sub-objeto, não campos soltos
    "blockId": "m1-1-t3-p2",
    "startOffset": 12,            // offset de CHAR dentro do bloco (TreeWalker)
    "endOffset": 47
  },
  "tags": ["duvida"],             // array; "duvida" é auto-adicionada quando color==="doubt"
  "orphan": false                 // true se nenhuma marca foi aplicada no DOM
}
```

Notas:
- `color === "doubt"` força `tags` a conter `"duvida"` (em `highlight()` e `editNote()`).
- `note` só é gravado se `opts.note != null && opts.note !== ''`; caso contrário `null`.
- `orphan` é recalculado a cada `renderHighlights()` (uma nota órfã não derruba as outras).

### 1.4 Anchoring em camadas de fallback (do mais preciso ao mais resiliente)

1. **`blockId` + offsets exatos.** `wrapRangeInBlock(block, startOffset, endOffset)` percorre os text nodes do bloco via `TreeWalker` (`NodeFilter.SHOW_TEXT`) e envolve `[start,end)` em `<mark>` pedaço a pedaço. **Nunca** usa `Range.surroundContents` (lança `InvalidStateError` em seleção cross-node). Text nodes já dentro de `mark.inema-hl` são pulados (não aninha highlights).
2. **Busca literal do `quote` dentro do bloco.** Se os offsets não produzem marca, `applyByQuote(block, rec)` faz `block.textContent.indexOf(quote)` e reaplica, **atualizando os offsets** do registro.
3. **Busca do `quote` em qualquer bloco do `<main>`.** Se o bloco sumiu, `applyByQuoteAnywhere(main, rec)` procura o primeiro `[data-inema-block]` cujo texto contém o `quote`.
4. **Órfã.** Se nada ancora, `rec.orphan = true`. A nota aparece na jornada como "nota sem âncora"; **o texto da nota nunca se perde.** `quote` é o seguro contra drift e é sempre gravado.

> O MVP restringe a seleção a **um** bloco anotável: se a seleção cruza blocos, é colapsada ao bloco inicial com aviso ("Seleção limitada a um parágrafo.").

### 1.5 Export / Import `.json`

`exportJSON()` produz (sempre válido, mesmo com estado vazio):

```jsonc
{
  "schemaVersion": 1,
  "courseId": "demo",
  "exportedAt": "<ISO>",
  "read":   { },
  "doubts": { },
  "notes":  { },
  "checks": { },
  "meta":   { }
}
```

- `inema.prefs` (global) **NÃO** entra neste export por-curso. É preferência cross-curso.
- `downloadJSON()` baixa via `Blob` + `objectURL`; nome `inema-<courseId>-<YYYY-MM-DD>.json`. Fallback `data:` URI se `Blob` falhar.
- **Import defensivo** (`importJSON(text, {mode})`): faz parse em variável temporária; **não muta o estado se inválido**. Valida `schemaVersion`:
  - ausente ⇒ no-op com erro `"schemaVersion ausente."`;
  - maior que a suportada ⇒ tenta `migrate` mas registra aviso (preserva campos desconhecidos).
- **Default `mode:"merge"`** (não-destrutivo, união): `read` une `true`; `doubts`/`checks` só adicionam ausentes; `notes` dedup por `id` dentro de cada `blockId`; `meta` pega o de `lastVisitedTs` mais recente. **Nada é apagado.**
- `mode:"replace"` pede `window.confirm()` (a menos que `opts.__confirmed`) e sobrescreve tudo.
- Retorno: `{ ok, applied, skipped, errors[] }`. Arquivo inválido = `{ ok:false, … }`, estado intacto.
- **Round-trip lossless.** `migrate(state)` preserva campos desconhecidos (forward-compat) e completa `read/doubts/notes/checks/meta` faltantes com `{}`. `schemaVersion` é normalizado para o atual (`SCHEMA_VERSION = 1`).

### 1.6 `inema.prefs` (global) e migração do legado

Shape completo (sempre saneado por `migratePrefs`, defaults garantidos):

```jsonc
{
  "schemaVersion": 1,
  "theme": "inema-dark",      // inema-dark | claro | sepia | foco | contraste
  "font": "inter",            // inter | system | leitura
  "fontScale": 100,           // 100 | 112 | 125  (number)
  "lineWidth": 68,            // 60 | 68 | 75  (ch, number)
  "leading": 1.7,             // 1.45 | 1.7  (number)
  "accent": "emerald",        // emerald | blue | purple | amber | teal | rose
  "reducedMotionOverride": null  // null | true | false
}
```

- Valores fora do domínio caem para o default (tema desconhecido ⇒ `inema-dark`).
- **Migração do v1:** na 1ª carga (sem `inema.prefs`), lê o `localStorage.theme` legado — `"light"` ⇒ `claro`, `"dark"` ⇒ `inema-dark`. Ao salvar, `savePrefs` re-escreve `localStorage.theme` (`dark`/`light`) para páginas v1 que só leem essa chave.

### 1.7 Manifesto do curso (OBRIGATÓRIO p/ progresso cross-página)

O `read`-map é persistido por curso (`inema.<courseId>.read`), então o estado de **lido**
de TODAS as páginas está sempre disponível. O que **não** atravessa páginas é o **total**:
`domTotals(scope)` só enxerga os `[data-inema-topic]` presentes no DOM da página atual
(quase sempre um único módulo). Sem uma fonte do "todo", `progress('curso')` e
`progress('trilha:N')` numa página de módulo só conseguiriam contar o módulo corrente.

O **manifesto** resolve isso: cada página embute a estrutura COMPLETA do curso, e o
`progress()` passa a **agregar** `done` (do `read`-map persistido, cross-página) sobre o
`total` (do manifesto). **Sem manifesto, o progresso DEGRADA para o DOM da página atual**
(só o módulo corrente) — por isso o manifesto é **obrigatório** para que os medidores de
curso/trilha e a "minha jornada" mostrem o curso inteiro em qualquer página.

**Onde colocar:** no `<head>` (ou em qualquer ponto do `<body>`) de **TODA** página do
curso, idêntico em todas. Forma canônica = `<script type="application/json"
data-inema-manifest>` (não executa, é só dado). Alternativa programática:
`window.INEMA_MANIFEST = {...}`. É lido uma única vez e memoizado (`getManifest()`).

**Formato JSON:**

```jsonc
{
  "course": "fep",                 // courseId (deve casar com <meta name="inema-course">)
  "tracks": [
    {
      "n": "1",                    // número/slug da trilha (== data-inema-track)
      "title": "Fundamentos",
      "modules": [
        {
          "id": "1-1",             // == data-inema-module / prefixo de data-inema-topic
          "title": "Modulo 1.1",
          "topics": 8,             // QUANTIDADE de tópicos reais do módulo (inteiro)
          "href": "curso/trilha1/modulo-1-1.html"  // link p/ navegar (opcional)
        }
        // … demais módulos da trilha
      ]
    }
    // … demais trilhas
  ]
}
```

- **`topics` é uma CONTAGEM**, não a lista — é o denominador "de M" daquele módulo. Deve
  bater com o número real de `[data-inema-topic]` daquele módulo na sua página (ver
  CHECKLIST). Se divergir, o % do curso fica errado.
- `n`/`id` são os mesmos slugs dos `data-inema-track` / `data-inema-module`; o `done` por
  trilha/módulo é casado por eles via `keyParts(id)` (parse de `modulo-X-Y#topico-N`).
- `href` alimenta a navegação da "minha jornada"; opcional.

**Como `progress()` o usa (código real):**

1. `getManifest()` lê o `<script data-inema-manifest>` (ou `window.INEMA_MANIFEST`),
   `safeJSON` defensivo, memoiza (`null` = ausente).
2. `manifestTotal(scope)` soma os `topics` do escopo (`curso` = todos; `trilha:N` = os da
   trilha; `modulo:X-Y` = o do módulo). `null` se não há manifesto.
3. `readDone(scope)` conta as chaves `true` do `read`-map **inteiro** (cross-página),
   filtradas por escopo via `keyParts`.
4. **Com manifesto:** `progress(scope)` = `{ done: readDone, total: manifestTotal, pct }`
   (clampa `done ≤ total` contra chaves órfãs). **Sem manifesto:** cai para
   `domTotals(scope)` — só o que está no DOM da página atual.
5. A **"minha jornada"** (`renderJourney`) enumera trilhas/módulos do **manifesto** quando
   presente (curso inteiro, em qualquer página); sem ele, lista só os `[data-inema-track]`
   / `[data-inema-module]` do DOM da página corrente.

> O manifesto é **dado**, não estado — não vai para `localStorage` nem para o export/import.
> É enhancement progressivo: ausente, o progresso por-módulo (página atual) continua exato;
> só a **agregação cross-página** depende dele.

---

## 2. API `window.INEMA`

IIFE inline, namespace único, idempotente (guard `window.INEMA.__core`) e
re-entrant (guard `S.bound` evita listeners duplicados). Feature-detect: só ativa
o que existe na página. Boot em `DOMContentLoaded` via `INEMA.init()`; o anti-FOUC
de tema roda **antes** (script bloqueante separado no `<head>`).

### 2.1 Boot / núcleo

| Método | Assinatura | Propósito |
|---|---|---|
| `INEMA.init` | `init(opts?) → INEMA` | `opts = { courseId?, autoResume? }`. Probe de storage (→ efêmero se bloqueado), lê `courseId`, `applyPrefs()`, monta delegação de eventos no `<main>`, hidrata lidos/dúvidas/highlights (`rehydrateAll`), monta TOC/scrollspy, badge da jornada. `autoResume:true` rola para o último ponto. Idempotente. |
| `INEMA.applyPrefs` | `applyPrefs() → prefs` | Aplica `inema.prefs` no `<html>`: classe `.dark`, `data-theme`, `data-font`, `data-accent`, `color-scheme` e CSS vars (`--inema-font-scale`, `font-size` em %, `--measure`, `--lh-body`, `--font-body`, `--accent-h/-s/-l`, `--accent`). Reforça o anti-FOUC; também roda sozinho no `DOMContentLoaded`. |

### 2.2 Progresso / lido (só derivado)

| Método | Assinatura | Propósito |
|---|---|---|
| `INEMA.markRead` | `markRead(itemId, bool?)` | Grava boolean (omitido ⇒ `true`), repinta controles do tópico **e** medidores no mesmo tick, salva checkpoint, celebra 100%, emite `inema:read` + `inema:progress`. |
| `INEMA.isRead` | `isRead(itemId) → bool` | Consulta `read[itemId] === true`. |
| `INEMA.progress` | `progress(scope?) → { done, total, pct }` | `scope` = `'curso'` (default) / `'trilha:N'` / `'modulo:X-Y'`. **Com manifesto** (§1.7): `done` = `readDone` (read-map persistido, cross-página) e `total` = `manifestTotal` — agrega o curso inteiro em qualquer página. **Sem manifesto:** degrada para `domTotals` (conta `[data-inema-topic]` do DOM da página atual = só o módulo corrente). |
| `INEMA.renderMeters` | `renderMeters()` | Repinta todo `[data-inema-meter]`: ARIA (`role=progressbar`, `aria-valuenow`, `aria-valuetext="N de M (P%)"`), `--inema-pct`/`--inema-pct-num`, slots de texto, fill da barra e `stroke-dashoffset` do anel SVG. |

### 2.3 Dúvida

| Método | Assinatura | Propósito |
|---|---|---|
| `INEMA.toggleDoubt` | `toggleDoubt(itemId) → bool` | Liga/desliga flag de dúvida do tópico (zero digitação). Repinta o botão, emite `inema:doubt`. |
| `INEMA.setDoubtResolved` | `setDoubtResolved(itemId, bool) → record` | Marca "resolvido" (usado na jornada). Cria o registro se ausente. Emite `inema:doubt`. |
| `INEMA.listDoubts` | `listDoubts() → []` | Unifica dúvidas de tópico **+** notas `color:"doubt"` (ou `tags` com `"duvida"`), ordenadas por `ts` desc. Itens: `{kind:'topic'|'note', id, ts, resolved, quote, note, … }`. |

### 2.4 Notas / highlight

| Método | Assinatura | Propósito |
|---|---|---|
| `INEMA.highlight` | `highlight(range, {color?, note?, tags?}) → id\|null` | Cria highlight/nota a partir de um `Range`. `color` ∈ SWATCHES (default `yellow`). Render por `TreeWalker` (§1.4). Persiste e emite `inema:note` (+ `inema:doubt` se `doubt`). Retorna o `id` ou `null`. |
| `INEMA.promoteToNote` | `promoteToNote(id, text) → bool` | Promove highlight puro a nota (grava `note`, marca o span com `data-inema-hasnote="1"`). |
| `INEMA.editNote` | `editNote(id, patch) → bool` | `patch = { note?, color?, tags? }`. Repinta classe/atributo da marca ao trocar cor. |
| `INEMA.removeNote` | `removeNote(id) → bool` | Desfaz os `<mark>` (substitui por text node + `parent.normalize()`) e remove o registro. Emite `inema:note {removed:true}`. |
| `INEMA.renderHighlights` | `renderHighlights(container?)` | Re-aplica os highlights do storage. **Tolerante por nota:** a que não ancora vira `orphan:true` e não derruba as outras. Re-entrante (pula marcas já presentes). |

**Popover de seleção (automático):** `mouseup`/`touchend` (debounce 10 ms) lê
`getSelection()`; se há range não-colapsado dentro de um `[data-inema-block]`,
posiciona `.inema-selpop` acima da seleção (corrige scroll e overflow do viewport).
Botões: swatches (`[data-inema-swatch]`, 1 reservado = `doubt` com glifo "?"),
`[data-inema-act="note"]` (prompt) e `[data-inema-act="copy"]`. **Copiar** usa
`navigator.clipboard` em secure context, com fallback `file://` (textarea +
`execCommand('copy')`). Clicar num `<mark>` abre mini-menu Nota/Excluir.

### 2.5 Jornada (view pura)

| Método | Assinatura | Propósito |
|---|---|---|
| `INEMA.openJourney` | `openJourney()` | Abre overlay `role=dialog aria-modal` com foco preso (trap de `Tab`), `inert`+`aria-hidden` no resto, ESC fecha, devolve foco ao gatilho. |
| `INEMA.closeJourney` | `closeJourney()` | Fecha, remove `inert`, restaura foco. |
| `INEMA.renderJourney` | `renderJourney(mountEl)` | Monta o conteúdo: progresso (curso + trilhas + módulos — do **manifesto** §1.7 quando presente, enumerando o curso inteiro em qualquer página; senão, só os `[data-inema-track]`/`[data-inema-module]` do DOM da página atual), "continuar de onde parei", dúvidas (filtro "só não resolvidas", link de volta), notas (filtro por cor, excluir), Export/Import/Reset. **Só leitura** do estado. |

### 2.6 Continuar de onde parei

| Método | Assinatura | Propósito |
|---|---|---|
| `INEMA.saveCheckpoint` | `saveCheckpoint(topicId?)` | Debounced (400 ms). Grava em `meta`: `lastTopicAnchor` (id passado ou tópico mais alto visível), `lastModuleHref`, `lastScroll`, `lastVisitedTs`. Chamado em `markRead` e em `visibilitychange`/`pagehide`. |
| `INEMA.resume` | `resume() → bool` | Rola até `meta.lastTopicAnchor` via `scrollIntoView` por id (abre accordions/`<details>` ancestrais antes); fallback best-effort por `lastScroll`. |

### 2.7 Export / Import

| Método | Assinatura | Propósito |
|---|---|---|
| `INEMA.exportJSON` | `exportJSON() → string` | String JSON indentada do estado por-curso (§1.5). Sempre válida. |
| `INEMA.importJSON` | `importJSON(text, {mode?}) → {ok,applied,skipped,errors}` | `mode` = `'merge'` (default) / `'replace'`. Valida em var temp; não muta se inválido. |
| `INEMA.downloadJSON` | `downloadJSON()` | Dispara o download do `.json` (Blob → fallback data-URI). |

### 2.8 Tema / preferências

| Método | Assinatura | Propósito |
|---|---|---|
| `INEMA.setPref` | `setPref(key, val) → prefs` | `key` ∈ `theme/font/fontScale/lineWidth/leading/accent/reducedMotionOverride`. Sanea, persiste, `applyPrefs()`, `syncAppearanceUI()`, emite `inema:progress {kind:'prefs'}`. |
| `INEMA.getPrefs` | `getPrefs() → prefs` | Lê com defaults completos (`migratePrefs`). |
| `INEMA.cyclePref` | `cyclePref(key) → prefs` | Avança ciclicamente em `theme/font/fontScale/lineWidth/leading/accent` (para seletor compacto / `[data-inema-cycle]`). |

### 2.9 Checagem leve opcional

| Método | Assinatura | Propósito |
|---|---|---|
| `INEMA.registerCheck` | `registerCheck(id, {q, options, answer, explain?})` | Declara a checagem em memória. `explain` = `{ <índice/valor>: "feedback" }`. |
| `INEMA.submitCheck` | `submitCheck(id, choice) → {correct}` | Grava em `checks`, pinta feedback explicativo por opção, **nunca bloqueia avanço**, emite `inema:progress {kind:'check'}`. |

### 2.10 Internos expostos (uso avançado / testes) — `INEMA._internal`

`storageGet`, `storageSet`, `safeJSON`, `probeStorage`, `migrate`, `domTotals`,
`coreVars` (nomes canônicos das CSS vars), `resetCourse`, `courseId()`.
Mais a flag `INEMA.__core` (idempotência).

### 2.11 Observabilidade — `CustomEvent`s (hook para sync v2)

Disparados em `document`, com `detail`:

| Evento | Quando | `detail` (campos principais) |
|---|---|---|
| `inema:read` | `markRead` | `{ id, read, progress }` |
| `inema:doubt` | toggle/resolve/dúvida-de-trecho | `{ id, active?\|resolved?, kind? }` |
| `inema:note` | criar/editar/promover/remover | `{ id, color?, hasNote?, blockId?, removed? }` |
| `inema:progress` | init / read / check / prefs | `{ kind, id?, progress?, prefs? }` |

A UI reage desacoplada (ex.: badge da jornada na nav). É o ponto de extensão do
sync v2 — sem cliente HTTP/auth agora.

---

## 3. Convenções de markup `data-*` (snippets copia-e-cola)

> O JS faz **feature-detect**: cada atributo abaixo ativa só o que existe. Sem o
> atributo, o elemento simplesmente não participa daquela feature (degrada).

### 3.1 IDs estáveis (contrato de ancoragem)

```html
<!-- no <head> de TODA página -->
<meta name="inema-course" content="demo">

<!-- card/header de módulo -->
<article id="modulo-1-1" data-inema-module="1-1" data-inema-track="1"> … </article>

<!-- tópico/seção: o data-inema-topic é o id ESTÁVEL de progresso/notas -->
<section id="topico-3" data-inema-topic="modulo-1-1#topico-3"> … </section>

<!-- bloco anotável: sem data-inema-block, o parágrafo NÃO é selecionável p/ nota -->
<p data-inema-block="m1-1-t3-p2"> … prosa anotável … </p>
```

`data-inema-topic` é o id de progresso (`modulo-X-Y#topico-N`). O escopo
`modulo:X-Y` casa pelo prefixo `modulo-X-Y#` desse id, **ou** por um ancestral
`[data-inema-module="X-Y"]`. O escopo `trilha:N` casa por ancestral
`[data-inema-track="N"]`.

### 3.2 Botão "marcar como lido"

```html
<section id="topico-3" data-inema-topic="modulo-1-1#topico-3">
  …
  <button type="button" data-inema-read-toggle aria-pressed="false">
    <span class="inema-ico-todo" aria-hidden="true"><!-- ícone "a ler" --></span>
    <span class="inema-ico-done" aria-hidden="true"><!-- ícone "lido" (svg path animável) --></span>
    <span class="inema-label-todo">Marcar como lido</span>
    <span class="inema-label-done">Lido</span>
  </button>
</section>
```

- O JS pega o id do `[data-inema-topic]` ancestral; se não houver, usa o valor de `data-inema-read-toggle` como id.
- Estado **por ícone + texto + cor** (a CSS revela `inema-ico-done`/`inema-label-done` quando `aria-pressed="true"` ou `.is-read`).
- Forma compacta (sem ícones/labels): o JS troca o `textContent` do botão para "Lido"/"Marcar como lido". Se houver um `[data-inema-read-label]`, ele atualiza só esse slot.
- **#1 (erro crítico):** o botão é `justify-content:flex-start`, nunca `center`.

### 3.3 Flag de dúvida rápida

```html
<button type="button" data-inema-doubt-toggle aria-pressed="false">Tenho uma dúvida</button>
```

Dentro de um `[data-inema-topic]`, usa o id do tópico; senão usa o valor do atributo. Liga `.is-doubt` no botão e `.has-doubt` na seção.

### 3.4 Medidores de progresso (barra / anel)

```html
<!-- BARRA (curso/trilha/módulo) -->
<div data-inema-meter="modulo-1-1">
  <span class="inema-meter-label" data-inema-meter-frac>0 de 0</span>
  <span data-inema-meter-pct>0%</span>
  <div class="inema-bar"><div class="inema-bar__fill" data-inema-meter-fill></div></div>
</div>

<!-- ANEL SVG (usa stroke-dashoffset) -->
<div data-inema-meter="trilha:1" class="inema-ring">
  <span class="inema-ring__value" data-inema-meter-pct>0%</span>
  <svg viewBox="0 0 36 36"><circle data-inema-ring r="16" cx="18" cy="18"/></svg>
</div>
```

`data-inema-meter` = escopo (`curso` / `trilha:N` / `modulo:X-Y`). Slots opcionais:
`data-inema-meter-pct`, `data-inema-meter-frac` ("N de M"), `data-inema-meter-fill`
(largura da barra), `data-inema-ring` (anel SVG). O JS escreve `--inema-pct` e o ARIA.

> **Nota de fidelidade CSS×JS:** a CSS pinta a barra/anel via
> `--inema-pct` (que o JS seta) usando `.inema-bar__fill` (largura `calc(var(--inema-pct) * 1%)`)
> e `.inema-ring` (conic-gradient). O JS **também** seta `fill.style.width` e o
> `stroke-dashoffset` do `[data-inema-ring]` diretamente — qualquer um dos dois
> caminhos funciona; use as classes `inema-bar`/`inema-ring` da `learn.css`.

### 3.5 TOC sticky + scrollspy + contador

```html
<nav data-inema-toc aria-label="Índice da página">
  <ol>
    <li><a href="#topico-1">1. Faça X</a></li>
    <li><a href="#topico-2">2. Faça Y</a></li>
  </ol>
</nav>
<span data-inema-section-counter></span>   <!-- "Seção N de M" -->
```

O scrollspy usa `IntersectionObserver` (degrada em silêncio se ausente). Marca o
link ativo com `.is-active` + `aria-current="true"` casando `href` ↔ `id` do tópico.

### 3.6 Jornada (gatilho + badge)

```html
<button type="button" data-inema-journey-open>Minha jornada</button>
<span class="inema-journey-badge" data-inema-journey-badge data-count="0"></span>
```

`data-inema-journey-open` abre o painel. `data-inema-journey-badge` recebe o
`textContent` "P%" e `data-doubts` (nº de dúvidas abertas).

### 3.7 Seletor de aparência

```html
<button type="button"
        data-inema-appearance-toggle="[data-inema-appearance]"
        aria-expanded="false">Aparência</button>

<div data-inema-appearance class="inema-appearance-pop">
  <div class="inema-segment">
    <button data-inema-set-theme="inema-dark">Escuro</button>
    <button data-inema-set-theme="claro">Claro</button>
    <button data-inema-set-theme="sepia">Sépia</button>
    <button data-inema-set-theme="foco">Foco</button>
    <button data-inema-set-theme="contraste">Alto contraste</button>
  </div>
  <div class="inema-segment">
    <button data-inema-set-font="inter">Inter</button>
    <button data-inema-set-font="system">Sistema</button>
    <button data-inema-set-font="leitura">Leitura</button>
  </div>
  <div class="inema-segment">
    <button data-inema-set-fontscale="100">A</button>
    <button data-inema-set-fontscale="112">A+</button>
    <button data-inema-set-fontscale="125">A++</button>
  </div>
  <div class="inema-segment">
    <button data-inema-set-linewidth="60">Estreito</button>
    <button data-inema-set-linewidth="68">Médio</button>
    <button data-inema-set-linewidth="75">Largo</button>
  </div>
  <div class="inema-segment">
    <button data-inema-set-leading="1.45">Compacto</button>
    <button data-inema-set-leading="1.7">Confortável</button>
  </div>
  <div class="inema-accent-grid">
    <button data-inema-set-accent="emerald"></button>
    <button data-inema-set-accent="blue"></button>
    <button data-inema-set-accent="purple"></button>
    <button data-inema-set-accent="amber"></button>
    <button data-inema-set-accent="teal"></button>
    <button data-inema-set-accent="rose"></button>
  </div>
</div>
```

- Os botões `data-inema-set-*` chamam `setPref` (o JS converte tipos: `fontScale`/`lineWidth` → int, `leading` → float). `syncAppearanceUI()` reflete o estado ativo via `aria-pressed`/`.is-active`.
- `data-inema-appearance-toggle="<seletor>"` alterna `.is-open` no painel e `aria-expanded` no gatilho. Variante de ciclo: `<button data-inema-cycle="theme">`.
- O toggle sol/lua legado do v1 é **absorvido**: se existirem `#theme-toggle-dark-icon` / `#theme-toggle-light-icon`, o JS os mantém coerentes.

### 3.8 Checagem leve opcional

```html
<div data-inema-check="modulo-1-1#q1">
  <p class="inema-check__q">O que faz X?</p>
  <div class="inema-check__options">
    <button class="inema-check__option" data-inema-check-option="0">Opção A</button>
    <button class="inema-check__option" data-inema-check-option="1">Opção B</button>
  </div>
</div>
```

```js
// declarar a resposta + feedback explicativo por opção (opt-in)
INEMA.registerCheck("modulo-1-1#q1", {
  q: "O que faz X?",
  options: ["Opção A", "Opção B"],
  answer: "1",
  explain: { "0": "A não é, porque…", "1": "Isso. X faz…" }
});
```

O JS injeta `[data-inema-check-feedback]` com o feedback ao clicar. **Nunca bloqueia avanço.**

### 3.9 Manifesto do curso (OBRIGATÓRIO em toda página — §1.7)

```html
<!-- no <head> de TODA página do curso, idêntico em todas -->
<script type="application/json" data-inema-manifest>
{
  "course": "fep",
  "tracks": [
    { "n": "1", "title": "Fundamentos", "modules": [
      { "id": "1-1", "title": "Módulo 1.1", "topics": 8, "href": "curso/trilha1/modulo-1-1.html" },
      { "id": "1-2", "title": "Módulo 1.2", "topics": 6, "href": "curso/trilha1/modulo-1-2.html" }
    ]},
    { "n": "2", "title": "Aplicação", "modules": [
      { "id": "2-1", "title": "Módulo 2.1", "topics": 7, "href": "curso/trilha2/modulo-2-1.html" }
    ]}
  ]
}
</script>
```

Sem este bloco, `progress('curso')`/`progress('trilha:N')` só contam o módulo da página
atual e a "minha jornada" não enumera o curso inteiro. `topics` é a **contagem** de
`[data-inema-topic]` reais de cada módulo (o "de M"). É **dado**, não estado: não persiste
nem entra no export/import.

---

## 4. Como incluir numa página

Ordem obrigatória (mata o FOUC e respeita o enhancement progressivo). Snippets
prontos: `assets/inema-head-snippet.html` e `assets/inema-init-snippet.html`
(troque `REL` pelo caminho relativo da pasta `assets`: `.`, `..`, `../..`).

### 4.1 No `<head>` — anti-FOUC PRIMEIRO, depois a CSS

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="inema-course" content="demo">

  <!-- 1) ANTI-FOUC: script BLOQUEANTE, ANTES do Tailwind e de qualquer <style>/<link>.
        Lê inema.prefs e aplica .dark + data-theme + CSS vars ANTES do 1º paint.
        try/catch total: qualquer erro => default dark (preserva a marca). -->
  <script>/* … conteúdo de assets/inema-head-snippet.html … */</script>

  <!-- 2) Tailwind via CDN (depois do anti-FOUC) -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- 3) learn.css no <head> -->
  <link rel="stylesheet" href="REL/assets/learn.css">
</head>
```

Por que nessa ordem: o anti-FOUC precisa setar `.dark`/`data-theme` **antes** do
Tailwind avaliar `dark:` e antes de qualquer pintura; a `learn.css` no `<head>`
evita salto de layout dos controles novos.

> **Bridge de chrome (temas `sepia`/`contraste` pintam a PÁGINA inteira).** Os temas
> de leitura `sepia` e `contraste` chegam por `data-theme` no `<html>`, mas o chrome v1
> (body/nav/cards) usa classes utilitárias Tailwind (`bg-dark-*`, `text-neutral-*`,
> `border-dark-*`) e o override binário `html:not(.dark)` — que **não** consomem os
> tokens `var(--bg/--surface/--text/--border)`. Sem ajuda, ativar "sépia"/"contraste"
> só recoloria a prosa e o resto ficaria idêntico a claro/escuro. A `learn.css`
> resolve isso na seção **"3b. BRIDGE DE CHROME"**: mapeia essas classes-chave do
> chrome para os tokens semânticos **apenas sob `html[data-theme="sepia"]` /
> `html[data-theme="contraste"]`** (com `!important` para vencer o utilitário e o
> override binário). Assim a **troca de tema transforma a página toda**. **`claro` e
> `inema-dark` continuam pelo mecanismo v1 intacto** (não são tocados pelo bridge —
> Erro Crítico #5). Consequência prática: a `learn.css` **precisa** estar carregada na
> página para que sépia/contraste recolorem o chrome, não só a `.inema-prose`.

### 4.2 No fim do `<body>` — `learn.js` + `INEMA.init()` por último

```html
  <!-- … todo o conteúdo + as 3 funções-núcleo do v1
       (toggleTopic, theme toggle, openModal/closeModal) … -->

  <script src="REL/assets/learn.js"></script>
  <script>
    if (window.INEMA && typeof window.INEMA.init === "function") {
      window.INEMA.init();           // ou INEMA.init({ autoResume: true })
    }
  </script>
</body>
```

`init()` é idempotente: chamar duas vezes não duplica listeners. `opts` aceitos:
`{ courseId, autoResume }`.

### 4.3 Inline vs assets relativos

- **Self-contained (file:// / página única):** cole o conteúdo de `learn.css` dentro de um `<style>` no `<head>` e o de `learn.js` dentro de um `<script>` antes de `</body>`. É o padrão "snippet copia-e-cola" do baseline — abre offline, sem servidor. O bloco anti-FOUC é sempre inline (não pode ser um arquivo externo: precisa rodar bloqueante antes do paint).
- **Assets relativos (multi-página / curso):** use `<link rel="stylesheet" href="REL/assets/learn.css">` e `<script src="REL/assets/learn.js"></script>` (cache entre páginas). O anti-FOUC **permanece inline** em cada página. As prefs (`inema.prefs`) são globais, então tema/leitura persistem entre páginas no load.

---

## 5. Degradação graciosa e robustez

A camada é **enhancement progressivo**: se o JS quebrar ou o storage estiver
bloqueado, o curso continua 100% legível.

| Falha | Comportamento real |
|---|---|
| **JS não roda / `INEMA` ausente** | Conteúdo, navegação, accordions e tema (anti-FOUC já aplicou) seguem funcionando. Controles novos ficam inertes mas visíveis. |
| **`localStorage` bloqueado** (aba privada / `file://` / cota) | `probeStorage()` → **modo efêmero**: estado em memória (`S.mem`), curso legível, aviso não-bloqueante. Nada é perdido na sessão; só não persiste entre cargas. |
| **JSON corrompido numa chave** | `storageGet` reseta **só aquela chave** + `console.warn`; as outras seguem. |
| **`QuotaExceededError`** | set falha em silêncio, mantém o estado anterior, toast sugerindo export. |
| **Highlight não re-ancora** | Nota vira `orphan:true`, listada na jornada como "nota sem âncora"; **uma órfã não derruba as outras** (`renderHighlights` é tolerante por nota). |
| **Seleção cross-node** | Colapsada ao bloco inicial com aviso; nunca `Range.surroundContents` (sem `InvalidStateError`). |
| **Import inválido** | No-op com `{ ok:false, errors }`; estado atual intacto (parse em var temporária). |
| **Sem `IntersectionObserver`** | Scrollspy/contador degradam em silêncio; links do TOC continuam funcionando. |
| **`navigator.clipboard` indisponível** (`file://`) | Fallback textarea + `execCommand('copy')`. |
| **`prefers-reduced-motion` / override do aluno** | Animações zeram/encurtam preservando o **estado final** (CSS) e o JS troca `scrollIntoView` para `behavior:'auto'`. |
| **`CustomEvent` indisponível** | Fallback `document.createEvent('CustomEvent')`; emissão nunca derruba a ação. |

Garantias transversais: toda exceção é capturada (no máximo `console.warn`);
sem `setInterval`/polling; um único listener delegado no `<main>`; texto de aluno
sempre via `textContent` (anti-XSS); idempotência e re-entrância por guards
(`__core`, `S.bound`, `S.inited`).

---

### Divergências conhecidas código × `DESIGN-SPEC` (o código manda)

- **Marcas de highlight:** o JS escreve `<mark class="inema-hl inema-hl--<color>" data-inema-note data-inema-color data-inema-hasnote>`. A `learn.css` tinge as cores por `[data-hl="…"]` / `[data-has-note="true"]`. **O hook confiável de cor é a classe `inema-hl--<color>`** (sempre escrita pelo JS); ao estilizar, prefira a classe.
- **Popover de seleção:** o JS exibe via `display:flex/none` e usa `[data-inema-swatch]` / `[data-inema-act]`. A `learn.css` tem regras `[data-open="true"]` e `[data-hl]` para os swatches — visual base aplica; o estado de abertura é controlado por `style.display` no JS.
- **Painel da jornada:** o JS gera classes `inema-journey-overlay` / `inema-journey` / `inema-journey-head|title|close|body|sec` / `inema-journey-list|item|meter`. A `learn.css` define variantes BEM (`inema-journey__header`, `inema-journey-backdrop`, etc.). Ambos coexistem; o markup efetivo é o que o JS cria em runtime.

Ao evoluir `learn.css`/`learn.js`, alinhe esses pares ou mantenha os dois hooks —
nunca remova a classe/atributo do qual o outro arquivo depende.
