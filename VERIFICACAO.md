# VERIFICACAO FINAL — skill `formato-curso-v2` + curso-demo

Data: 2026-06-14
Escopo: skill `formato-curso-v2` (`/home/nmaldaner/projetos/formato-curso-inema/formato-curso-v2/`) e curso-demo (`/home/nmaldaner/projetos/formato-curso-inema/demo/`).
Metodo: testes de runtime em navegador real (Playwright/Chromium, HTTP local) + revisao adversarial de codigo + auditoria dos Erros Criticos #1-#17 + checagem de sincronia de docs.

---

## 1. Sumario executivo

**Esta pronto? SIM — apos as correcoes de contrato aplicadas e re-verificadas (ver §6 e §9).**

> **ATUALIZACAO (14/06 11:40):** o cluster de contrato JS↔CSS descrito nas secoes 4 e 7 abaixo **FOI CORRIGIDO** (reconciliacao do `learn.js` ao contrato do `learn.css`: A1–A6, M1–M4, B1) e **re-verificado em navegador real** com uma nova suite que assere ESTADO CSS renderizado (`verify/contract.cjs`: **12/12 OK**). As secoes 4 e 7 ficam como REGISTRO do que foi encontrado e corrigido. Estado final: smoke **23/23**, temas **10/10**, contrato **12/12** — total **45/45**, 0 erros de console.

_Resumo historico (pre-correcao):_

- A **camada de dados, robustez e logica** da `learn.js` esta **genuinamente solida** e passou em todos os testes de runtime (smoke 23/23, temas 10/10, agregacao cross-modulo via manifesto, import round-trip, anti-XSS, highlight por TreeWalker sem `surroundContents`, jornada com foco preso/inert/ESC). Esses eixos **nao tem defeito real**.
- O curso-demo **nao viola nenhum dos Erros Criticos #1-#17** (0 violacoes criticas; 1 ressalva cosmetica nao-critica no #1).
- **PORÉM** ha um **cluster grande de defeitos REAIS de contrato JS↔CSS**: a `learn.js` emite atributos/classes/mecanismos de abertura que a `learn.css` nao casa. A logica roda certo, mas **recursos VISUAIS prometidos na spec ficam sem estilo ou sem efeito**: cor dos highlights, ponto "tem nota", abertura/animacao do popover de selecao, popover de aparencia, drawer da jornada, toast, largura de linha/entrelinha, override de reduced-motion do aluno, barras/estado-100% dos medidores e badge da jornada.
- **Importante:** estes bugs estao na skill canonica E no demo — confirmei que `formato-curso-v2/assets/learn.js|css` sao **byte-identicos** aos `demo/assets/learn.js|css` (`diff -q` = IDENTICAL). Logo afetam todo curso futuro gerado pela skill.
- O smoke test passou apesar disso porque ele exercita a **API/camada de dados** (estado, persistencia, manifesto) e **nunca assere sobre o estado CSS renderizado** (cor de fundo do mark, `data-open` do popover, etc.). Nao ha contradicao: dado funciona, apresentacao quebra.

**Veredito:** bloquear ate alinhar nomes de atributo/classe e mecanismos de abertura entre `learn.js` e `learn.css`. A correcao e mecanica (renomear / adicionar `setAttribute('data-open', ...)`), mas e necessaria — sao defeitos visuais reais, nao falso-positivos.

---

## 2. Testes de runtime (navegador real)

| Suite | Resultado | Cobertura |
|---|---|---|
| Smoke (Playwright/Chromium, HTTP local) | **23/23 OK** | `window.INEMA` existe; API completa (19 metodos); 7 topicos/modulo; manifesto total curso=14 cross-modulo; `read-toggle` marca lido + alterna `aria-pressed` + persiste `.read`; lidos persistem apos reload (done=3); `toggleDoubt` registra duvida; `highlight()` cria `<mark>` via TreeWalker e persiste nota sem erro; jornada `.inema-journey role=dialog` lista modulo 1-2 estando no 1-1; `exportJSON` valido; tema sepia aplicado+persistido; cross-modulo done=3/14 e trilha:1 done=3/14; `importJSON` round-trip (0→3); **0 erros de console** |
| Temas | **10/10 OK** | `inema-dark` `.dark`; `claro` #fff; `sepia` #fbf0d9; `contraste` #0a0e14; foco herda; fundos distintos; skip link `#conteudo`; `<main id>`; seletor de aparencia funcional (14 setters) |

Observacao: as suites validam **API + dados + temas (que usam variaveis de token, nao o contrato quebrado)**. Nao cobrem o estado CSS dos componentes interativos cujo contrato esta rompido (ver secao 4). Por isso passaram verdes apesar dos defeitos visuais.

---

## 3. Erros Criticos #1-#17 — auditoria do curso-demo (4 paginas)

**criticalViolations = 0. APROVADO.**

| # | Status | Nota |
|---|---|---|
| 1 | **parcial (nao-critico)** | Botoes de acao funcionais (topico 7/modulo, card, nav, action-row da trilha) usam `justify-start` corretamente. Unica excecao: 4 CTAs de hero/CTA-final em `index.html` usam `justify-center`, em contexto de hero/secao centralizada deliberada — nao e o caso-falha de fileira de acao. Ajuste cosmetico opcional. |
| 2 | ok | Zero setas ▶; indicadores de topico sao numeros em circulo (`rounded-full` flex center). |
| 3 | ok | Modulos na via "estrutura rica" (permitida); index da trilha no template classico 3 secoes. |
| 4 | ok | Link `https://inema.club` com `text-sky-400` nas 4 paginas (nav+footer) + override light `#0369a1`. |
| 5 | ok | Light mode CSS completo nas 4 (~34-39 regras `:not(.dark)`), sem-gradiente forcado. |
| 6 | ok | h1 `text-3xl sm:text-4xl`; h2 topico `text-2xl font-bold`. Nenhum h1/h2 em `text-lg`. |
| 8 | ok | Cartoes de modulo na landing sao `<a>` simples clicaveis, sem botoes internos. |
| 10 | ok | "Ver Completo" `<a href>` em cada um dos 2 cards de modulo do index. |
| 11 | ok | 7 topicos em 1-1 e 7 em 1-2 (>=6). |
| 12 | ok | "Mapa da trilha" h2 + grid de cards-ancora; "Navegacao Rapida" ausente. |
| 13 | ok | Nav completo/consistente nas 4 paginas; 3 botoes de trilha (refletem 3 trilhas reais); `aria-current`. |
| 14 | ok | Modulos profundos (~1135 e ~1134 linhas); 7 secoes com variedade (16 SVG, 4 grids, tip/red boxes, code box). |
| 17 | ok | >=1 diagrama SVG futurista inline por modulo (16/modulo, role=img + aria-label); hero SVG na landing e no index da trilha. |

(#7, #9, #15, #16 nao listados pelo auditor — sem violacao reportada.)

---

## 4. Achados de codigo por severidade (apenas defeitos REAIS, confirmados no arquivo)

Todos confirmados em `formato-curso-v2/assets/learn.js` e `learn.css` (= identicos no demo).

### Alta — contrato JS↔CSS rompido (recursos visuais sem efeito)

| # | Area | Defeito | Evidencia |
|---|---|---|---|
| A1 | Cor dos highlights | JS grava `data-inema-color` + classe `inema-hl--<cor>`; CSS so pinta via `.inema-hl[data-hl="..."]`. Nenhum highlight recebe cor; ficam invisiveis/iguais p/ yellow/green/blue/pink/doubt. Mesmo problema no swatch. | JS `learn.js:830,832,955,956`; CSS `learn.css:614-626,679-683` |
| A2 | Indicador "tem nota" | JS marca `data-inema-hasnote="1"`; CSS desenha o ponto via `.inema-hl[data-has-note="true"]::after`. Nomes/valores divergem; ponto nunca aparece. | JS `learn.js:833,939`; CSS `learn.css:629` |
| A3 | Popover de selecao | CSS gateia por `.inema-selpop[data-open="true"]` (base `opacity:0; pointer-events:none`); JS abre so via `style.display='flex'` e nunca seta `data-open`. Popover fica `display:flex` mas invisivel e nao-clicavel. | CSS `learn.css:646,664`; JS abre por `style.display` |
| A4 | Drawer "Minha jornada" | CSS usa BEM + `[data-open]` (`.inema-journey[data-open="true"]`→`translateX(0)`, `.inema-journey-backdrop[data-open]`, filhos `__header/__body/...`). JS cria classes flat (`inema-journey-overlay`, `-head`, `-body`, ...) e nunca seta `data-open`. Drawer preso em `translateX(100%)` / sem visual; backdrop sem estilo. Logica (foco/ESC/inert) OK; apresentacao quebra. | JS `learn.js:1208,1274,...`; CSS `learn.css:722,731,752,758,778` |
| A5 | Largura de linha / entrelinha | `applyPrefs` seta `--measure`/`--lh-body` inline no `<html>`, mas `.inema-prose` REDECLARA `--measure:68ch`/`--lh-body:1.7` (declaracao local vence herdado). CSS so muda via `html[data-line-width]`/`[data-leading]`, atributos que o JS nunca seta. `setPref('lineWidth'/'leading')` nao altera a prosa. | JS `learn.js:396-397`; CSS `learn.css:307,326-331` |
| A6 | Override reduced-motion do aluno | `applyPrefs` adiciona `.inema-reduce-motion` no `<html>`; CSS so reduz via `html[data-reduced-motion="reduce"]`. Preferencia explicita do aluno nao tem efeito. | JS `learn.js:413-414`; CSS `learn.css:479-481` |

### Media — contrato JS↔CSS rompido (feedback/estado secundario)

| # | Area | Defeito | Evidencia |
|---|---|---|---|
| M1 | Popover de aparencia | `handleAppearanceClick` abre via `classList.toggle('is-open')`; CSS gateia por `.inema-appearance-pop[data-open="true"]`. `is-open` nao casa nada; painel fica invisivel/nao-interativo. | JS `learn.js:1950`; CSS `learn.css:1107` |
| M2 | Barras + estado 100% dos medidores | `meterRow` cria `.inema-meter-bar`/`.inema-meter-fill`; CSS usa `.inema-bar`/`.inema-bar__fill` (sem regra p/ -meter-*). Alem disso `paintMeter` nunca seta `data-complete`, entao a "celebracao contida" `[data-inema-meter][data-complete="true"]` jamais dispara. | JS `learn.js:1469,1475` (`data-complete`=0 ocorr.); CSS `learn.css:924,975-979` |
| M3 | Toast | CSS revela via `.inema-toast[data-open="true"]` (base `opacity:0`); JS cria com classe `inema-toast`, nunca seta `data-open`, e na saida adiciona `inema-toast--out` (inexistente no CSS). Todos os avisos ficam invisiveis. | JS `learn.js:230`; CSS `learn.css:1002` |
| M4 | Badge da jornada | JS escreve `[data-inema-journey-badge]` + `data-doubts`; CSS estiliza `.inema-journey-badge` e esconde via `[data-count="0"]`. JS nao seta `data-count` nem garante a classe; badge zero nunca some e estilo pode nao aplicar. | JS `learn.js:2094`; CSS `learn.css:892,906` |

### Baixa

| # | Area | Defeito | Evidencia |
|---|---|---|---|
| B1 | Botoes sem estilo base | JS usa `inema-btn` (+`--primary/--ghost/--danger`) e `inema-selpop-act`; nenhuma existe no CSS (que tem `.inema-selpop__action`, `.inema-filter-chip`, `.inema-journey__footer button`). Botoes saem com aparencia default do navegador. | `grep inema-btn` no CSS = 0; CSS `learn.css:700` |
| B2 | `innerHTML=''` no repaint | `paintDoubts/paintNotes/renderJourney/paintCheckFeedback` limpam com `innerHTML=''`. Hoje seguro (so string vazia; conteudo do usuario entra via `el()/textContent`), mas mistura o padrao "sem innerHTML" do resto, abrindo porta a regressao. **Nao e bug ativo.** Trocar por `replaceChildren()`. | `learn.js:1271,1342,1387,1813` |
| B3 | Highlight cross-node | `highlight()` corretamente NUNCA usa `surroundContents` e restringe ao bloco via TreeWalker; selecao cross-node colapsada com aviso. Ressalva menor: `endOffset` fallback usa `startOffset+quote.length`, mas o clamp por `textContent.length` impede estouro — degradacao aceitavel. **Sem correcao obrigatoria.** | `learn.js:855-872,801-841`; zero `surroundContents` no arquivo |

---

## 5. Eixos verificados OK (sem defeito real — NAO mexer)

- Probe de storage + modo efemero (`init`).
- `QuotaExceededError` tratado sem derrubar a UI (`rawSet`).
- `JSON.parse` defensivo com reset so-da-chave (`safeJSON`, `storageGet`).
- Anti-XSS por `textContent` em toda renderizacao de quote/nota.
- Highlight por TreeWalker **sem** `Range.surroundContents` (confirmado: zero ocorrencias).
- Import defensivo em var temporaria + validacao de `schemaVersion` + merge nao-destrutivo + round-trip preservando campos desconhecidos.
- Jornada com foco preso + `inert` nos irmaos + ESC + devolucao de foco.

---

## 6. Correcoes aplicadas durante a verificacao

1. **Agregacao de progresso cross-pagina via manifesto do curso** — `learn.js` (`progress`/`readDone`/`manifestTotal` + jornada por manifesto) + `<script type="application/json" data-inema-manifest>` inserido nas 4 paginas do demo. Verificado em runtime: total do curso=14 cross-modulo; navegar 1-1→1-2 mantem done=3/14.
2. **Bridge de chrome `learn.css` §3b** — mapeia `bg-dark-*`/`text-neutral-*`/`border-dark-*` para os tokens sob `data-theme=sepia/contraste`, com `claro`/`inema-dark` intactos, para sepia/contraste pintarem a pagina toda. Verificado no teste de temas (10/10).
3. **Sincronia de docs (4 arquivos da skill)** — manifesto do curso + bridge de chrome documentados; consistentes com o implementado.
   - `formato-curso-v2/references/LEARN-LAYER.md` (nova §1.7 manifesto; tabela API §2.2/§2.5; markup §3.9; nota bridge §4.1)
   - `formato-curso-v2/references/MASTER_COMPLETO.md` (§11.1, §11.2, snippet §11.5.h, §12.1 bridge)
   - `formato-curso-v2/SKILL.md` (novo Erro Critico #28; contagem #18-#28)
   - `formato-curso-v2/references/CHECKLIST_REVISAO.md` (itens testaveis manifesto/ERRO #28/bridge ERRO #23; tabela #18-#28)
4. **Reconciliacao do contrato JS↔CSS** (corrige todo o cluster da §4) — `learn.js` conformado ao `learn.css`: `data-hl` na cor do highlight + swatch; `data-has-note="true"`; `data-open` no popover de selecao/aparencia/jornada/toast; classes BEM da jornada (`__header/__body/__list/__item/__quote/__note/__footer/__resume/__section-title/__filters/__tag`) + backdrop + slide-in via `requestAnimationFrame`; `data-line-width`/`data-leading` no `<html>`; `data-reduced-motion`; `.inema-bar`/`.inema-bar__fill` + `data-complete`; badge `.inema-journey-badge`+`data-count`; estilo base `.inema-btn` (+`--primary/--ghost/--danger`) adicionado ao `learn.css`. `learn.js`/`learn.css` re-sincronizados byte-a-byte skill↔demo. Re-verificado: ver §9.

---

## 7. Pendencias / backlog (bloqueadores antes de "pronto")

Prioridade por severidade. **Todos afetam a skill canonica e o demo (assets identicos).**

**Bloqueadores (alta) — alinhar contrato JS↔CSS:**
- [ ] A1 — Unificar atributo de cor do highlight: `mark.setAttribute('data-hl', color)` no JS (ou CSS passa a `[data-inema-color]`). Idem swatch.
- [ ] A2 — Padronizar `mark.setAttribute('data-has-note','true')` no JS (ou CSS `[data-inema-hasnote]`).
- [ ] A3 — Popover de selecao: `setAttribute('data-open','true'/'false')` ao mostrar/esconder; ler `data-open` no `mousedown`.
- [ ] A4 — Drawer da jornada: alinhar nomes (overlay→backdrop, BEM `__` nos filhos) e setar `data-open='true'` no overlay e no dialog ao abrir (proximo frame, p/ transicao) e `'false'` ao fechar.
- [ ] A5 — `applyPrefs` setar `data-line-width`/`data-leading` no `<html>` (ou remover a redeclaracao de `--measure`/`--lh-body` em `.inema-prose`).
- [ ] A6 — `applyPrefs` setar `data-reduced-motion='reduce'` (ou adicionar `.inema-reduce-motion` ao seletor CSS).

**Media — feedback/estado secundario:**
- [ ] M1 — Painel de aparencia: `data-open` em vez de `is-open`.
- [ ] M2 — `meterRow` usar `.inema-bar`/`.inema-bar__fill`; `paintMeter` setar `data-complete`.
- [ ] M3 — Toast: `data-open='true'` no proximo frame; `'false'` na saida.
- [ ] M4 — Badge: unificar hook (`[data-inema-journey-badge]` vs `.inema-journey-badge`) e setar `data-count`.

**Baixa — robustez/cosmetico:**
- [ ] B1 — Criar `.inema-btn` (+modificadores) e `inema-selpop-act` no CSS, ou trocar pelas classes existentes.
- [ ] B2 — Trocar `innerHTML=''` por `replaceChildren()` (preservar invariante "sem innerHTML"). Nao e bug ativo.
- [ ] #1 (cosmetico) — Trocar `justify-center` por `justify-start` nas 4 CTAs de hero/CTA-final do `index.html` do demo, para aderencia literal.
- [ ] B3 — Opcional: calcular o pedaco do quote contido no bloco inicial. Sem correcao obrigatoria.

**Recomendacao de processo:** apos os fixes de contrato, **adicionar asserts de estado CSS renderizado** ao smoke (ex.: `getComputedStyle(mark).backgroundColor !== 'rgba(0,0,0,0)'` apos highlight; `selpop` com `data-open=true` e `pointer-events:auto`; drawer em `translateX(0)`). Sem isso, esta classe de bug volta a passar verde.

---

## 8. Veredito final (atualizado 14/06 11:40)

**PRONTO.** O cluster de contrato JS↔CSS foi corrigido e re-verificado.

- Logica/dados/robustez/temas: **solidos, aprovados, sem defeito real.**
- Erros Criticos #1-#17: **0 violacoes** (1 ressalva cosmetica nao-critica no #1 — `justify-center` em CTAs de hero, nao em controles de aprendizagem).
- Apresentacao e feedback ao usuario: **corrigidos** — `learn.js` reconciliado ao contrato do `learn.css` (cor de highlight, `data-has-note`, `data-open` no popover de selecao/aparencia/jornada/toast, BEM da jornada, `data-line-width`/`data-leading`, `data-reduced-motion`, `.inema-bar`/`data-complete`, badge `data-count`, `.inema-btn` base).
- Re-verificado em navegador real com asserts de ESTADO CSS RENDERIZADO (ver §9).

---

## 9. Re-verificacao final (apos correcoes)

Suite nova `verify/contract.cjs` (Playwright/Chromium) — assere o estado CSS computado, nao so a API:

| Check | Resultado |
|---|---|
| highlights em blocos distintos criados | OK (2) |
| highlight verde TEM cor de fundo | OK (`rgba(59,222,119,.3)`) |
| highlight com nota → `data-has-note=true` | OK |
| jornada `data-open=true` e deslizou PARA A TELA (`translateX(0)`, dentro do viewport) | OK |
| popover de aparencia visivel (`opacity=1`, `pointer-events:auto`) | OK |
| popover de selecao visivel/clicavel (`data-open=true`, `opacity=1`) | OK |
| `data-line-width` no `<html>` e largura da prosa muda (600px↔750px) | OK |
| reduced-motion override → `data-reduced-motion=reduce` | OK |
| sem `pageerror` | OK |

**Suites finais:** `smoke.cjs` 23/23 · `themes.cjs` 10/10 · `contract.cjs` 12/12 — **45/45**, 0 erros de console. Scripts em `verify/`.

**Pendencias remanescentes (nao-bloqueantes):** B2 (`innerHTML=''`→`replaceChildren()`, nao e bug ativo); #1 cosmetico (`justify-center`→`justify-start` em CTAs de hero do `index.html`, fora dos controles de aprendizagem); B3 (opcional). Backlog v2: sync com portal (schema + CustomEvents ja prontos).
