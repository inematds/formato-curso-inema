# Pesquisa — Formato de curso INEMA v2 ("aprendizado agradável")

- **Data:** 2026-06-14
- **Fase:** F1 (benchmark/pesquisa) → síntese
- **Escopo do alvo:** página HTML **self-contained**, sem build, sem backend — Tailwind via CDN, JS inline, estado em `localStorage` (ver `PLANO-FORMATO-CURSO-V2.md` §6, `BASELINE.md`).
- **Ângulos sintetizados:** (1) docs/textbooks interativos, (2) leitura/tipografia, (3) tracking de progresso, (4) notas/highlight, (5) acessibilidade, (6) visual & temas.

> **Como ler este relatório.** Cada achado traz: a recomendação, a evidência (e o que foi **descartado** por ser marketing/folclore), e a aplicabilidade concreta num HTML self-contained. Onde o achado colide com a realidade da baseline INEMA (Tailwind via CDN, utilitários `dark:`, paleta fixa), o conflito está marcado como **CAVEAT INEMA**. A seção final prioriza por **alto valor / baixo custo**.

---

## A. Filtro de credibilidade (o que NÃO citar)

A verificação adversarial removeu números de marketing que circulam como se fossem ciência. Não usar, nem na skill nem em copy do curso:

- "Brilliant é 6x mais eficaz que vídeo" — claim de marketing da própria Brilliant, não revisado por pares.
- "Retenção +200% / +300% com gamificação" — blog de e-learning, sem metodologia.
- "Streaks aumentam DAU em 40–60% / engajamento 3.6x" — figuras de vendor (Plotline/Duolingo), sem método verificável.
- "OpenDyslexic melhora a leitura" — evidência fraca/contestada; tamanho, espaçamento e contraste pesam mais (Rello & Baeza-Yates 2013).
- Mecanismo de "halação por astigmatismo afeta ~50%" como fato — é folclore de design; a recomendação (evitar `#000`/`#fff` puros) continua válida por boa prática, não pelo mecanismo.

O que **fica** e sustenta as recomendações são princípios robustos de ciência cognitiva e do design: Cognitive Load Theory (Sweller), princípios multimídia de Mayer (segmentação, contiguidade espacial), efeito de teste/recuperação, efeito de exemplo trabalhado, efeito de espaçamento, e os critérios WCAG 2.1/2.2.

---

## B. Didática e learnability (formato de leitura/aprendizado)

### B1. Aprender fazendo: um micro-demo interativo por conceito
Demos manipuláveis inline batem leitura/vídeo passivos. Modelo: Josh Comeau (CSS) e o posicionamento da Brilliant em "learning by doing" — o princípio geral (aprendizagem ativa/generativa) é bem sustentado pela pesquisa, ainda que o "6x" seja descartado.
**Aplicação self-contained:** ao lado de cada conceito-chave, um demo minúsculo — slider que atualiza ao vivo uma propriedade CSS numa caixa-resultado, toggle que troca dois estados, um input "experimente" que recalcula uma saída via JS vanilla. Sem backend; estado vive no DOM + event listeners.
Fontes: <https://brilliant.org/help/why-brilliant/>; <https://www.joshwcomeau.com/css/>. **Confiança: alta.**

### B2. Modelo mental primeiro (diagrama/metáfora antes da sintaxe)
"Just JavaScript" (Dan Abramov + Maggie Appleton) reconstrói o modelo interno com ilustrações e exercícios de "diagrame as relações". Concrete-before-abstract e dar um schema antes do detalhe são sustentados por schema theory.
**Aplicação:** abrir cada tópico com um diagrama/SVG rotulado (metáfora visual: caixas-e-setas) + uma frase em linguagem simples, **antes** do código. Interação barata "preveja, depois revele" com JS vanilla. Encaixa no SVG futurista já existente da baseline.
Fonte: <https://justjavascript.com/>. **Confiança: alta.**

### B3. Chunking — uma ideia por seção (Cognitive Load Theory)
Quebrar em seções curtas de conceito único respeita a memória de trabalho (Sweller; princípio de segmentação de Mayer). web.dev/Learn CSS é modular.
**Aplicação:** página como menu de seções curtas (leitura de poucos minutos cada). `<details>` colapsáveis ou seções ancoradas para o aluno encarar **um chunk por vez**. Receita por seção: **um conceito + um demo + uma checagem**.
Fontes: <https://web.dev/learn/css/>; <https://www.csun.edu/science/ref/learning/cognitive_load.html>. **Confiança: alta.**

### B4. Contiguidade espacial — texto colado ao gráfico/código
Princípio de contiguidade espacial de Mayer (um dos mais replicados): rótulos sobre/ao lado do gráfico, anotações inline no código.
**Aplicação:** legendas/anotações imediatamente adjacentes (ou sobrepostas) ao diagrama, nunca num parágrafo distante. Para código, callouts inline apontando linhas específicas. Layout duas colunas (prosa + visual/código) com CSS grid/flex, sem JS.
Fonte: <https://www.csun.edu/science/ref/learning/cognitive_load.html>. **Confiança: alta.**

### B5. Layout de docs multi-coluna + títulos como tarefas
Padrão de três colunas (nav sticky / explicação / exemplo ao vivo) e títulos orientados a resultado (Stripe: "aceite seu primeiro pagamento") são convenções de DX consolidadas (não "resultado de aprendizagem provado").
**Aplicação:** nav esquerda `position:sticky` com âncoras + scroll-spy via `IntersectionObserver`; coluna central de prosa; coluna direita com exemplo/código visível. Títulos como tarefa ("Faça a caixa seguir o cursor"). **Caveat:** três colunas apertam no mobile → colapsar para uma coluna responsivamente.
Fontes: <https://stripe.com/docs>; <https://apidog.com/blog/stripe-docs/>. **Confiança: alta.**

### B6. Feedback imediato e explicativo (nunca bloquear progresso)
Feedback elaborado por opção (não "certo/errado" cru) melhora aprendizagem; tom de assistência, não acusação.
**Aplicação:** self-checks inline (múltipla escolha / preencher) que, ao enviar, revelam explicação por opção a partir de um objeto JS, alternando uma div de dica. Errar **não** trava o avanço. Puro HTML/JS.
Fontes: <https://brilliant.org/help/why-brilliant/>; <https://www.nngroup.com/articles/error-message-guidelines/>. **Confiança: alta.**

### B7. Intercalar checagens de conhecimento (efeito de teste)
Recuperação melhora retenção — dos achados mais robustos da ciência da aprendizagem. web.dev (autoavaliações), MDN ("test your skills" vs "challenge"), Odin (knowledge checks que linkam de volta à fonte).
**Aplicação:** após cada seção, bloco "Verifique-se" (1–3 perguntas) cujas respostas **ancoram de volta** ao parágrafo explicativo (vira índice de revisão). Um desafio cumulativo no fim da página. Âncoras + show/hide.
Fontes: <https://web.dev/learn/css/>; <https://developer.mozilla.org/en-US/docs/Learn_web_development>; <https://www.theodinproject.com/lessons/foundations-how-this-course-will-work>. **Confiança: alta.**

### B8. Retenção por recuperação espaçada (parcial num arquivo estático)
Efeito de espaçamento é sólido — **mas uma página estática não agenda lembretes**, então SRS de verdade é só parcialmente alcançável (números de "+200%/+300%" descartados).
**Aplicação realista:** (1) terminar seções com 1 pergunta de recuperação de uma seção **anterior**; (2) revisão de fim de página repondo checagens antigas; (3) `localStorage` para lembrar o que foi respondido e **ressurgir as erradas** na próxima visita; (4) enquadrar a página como algo a revisitar. Calibrar expectativa: benefício menor que um SRS agendado.
Fonte: <https://www.executeprogram.com/> (mote "Learn it. Code it. Remember it.") + literatura de espaçamento. **Confiança: média.**

### B9. Scaffolding por exemplo trabalhado → variação guiada → desafio
Worked-example effect (CLT) é bem estabelecido; progressão exemplo trabalhado → orientação esmaecida (fading/completion) → prática independente é sustentada (Odin, freeCodeCamp).
**Aplicação:** exemplo anotado → variação guiada (aluno muda **uma** coisa num editor inline) → desafio de build no fim com checklist. `<textarea>`/`contenteditable` + botão "Rodar" atualizando um preview. **Caveat de segurança:** rodar código do aluno só é fácil/seguro para HTML/CSS/JS renderizado em **iframe com `sandbox`** (evitar `eval` na página principal); outras linguagens exigiriam backend/WASM — limitar execução ao web-native.
Fontes: <https://www.theodinproject.com/>; <https://www.freecodecamp.org/> + literatura CLT. **Confiança: alta.**

### B10. Voz quente, levemente lúdica, com encorajamento genuíno
Whimsy de bom gosto (Comeau) e microcopy empático (Duolingo) ajudam experiência/persistência — heurística de UX sólida, ligação direta com retenção é mais fraca que os princípios cognitivos.
**Aplicação:** intros, labels de botão e feedback numa voz amigável consistente. Celebrar conclusão, normalizar o esforço ("isso pega todo mundo"), rotular CTAs pelo benefício ("Ver mexer") não pela mecânica ("Enviar"). Whimsy contido: micro-animação CSS de sucesso, toast de parabéns. **Caveat INEMA:** a marca é sóbria e anti-manipulação — manter contido. **Confiança: média.**

### B11. Reduzir fricção até o primeiro resultado + divulgação progressiva
Progressive disclosure (NN/g) e "early win / fast time-to-first-result" reduzem abandono.
**Aplicação:** primeira interação trivial (exemplo pré-preenchido que **já funciona**; o aluno só ajusta). Aprofundamentos atrás de `<details>` rotulado ("Indo mais fundo (opcional)"). Cópia em um clique via `navigator.clipboard` **com fallback** (a API exige secure context / gesto do usuário). Sem passo de setup antes do primeiro "aha".
Fontes: <https://www.nngroup.com/articles/progressive-disclosure/>; <https://www.theodinproject.com/>; <https://stripe.com/docs>. **Confiança: alta.**

### B12. Orientação e sinalização de progresso
"Como usar esta página", TOC sticky que destaca a seção atual, indicador de progresso, bloco "próximos passos" — wayfinding clássico (NN/g, visibilidade do estado do sistema).
**Aplicação:** nota curta no topo + TOC sticky com scroll-spy (`IntersectionObserver`) + barra fina ou "Seção 3 de 8" (de scroll e/ou checks concluídos em `localStorage`) + bloco "Próximos passos" no fim. Tudo vanilla.
Fontes: <https://www.nngroup.com/articles/progress-indicators/>; web.dev; Odin. **Confiança: alta.**

---

## C. Leitura e tipografia

> **Princípio-mestre (C-final):** centralizar TODOS os parâmetros de leitura (medida, tamanho, entrelinha, espaçamento, fonte, cores de tema) em **CSS variables** aplicadas por **um único wrapper de conteúdo**, trocáveis por classe/atributo no `<html>`, persistidas em `localStorage` sob `inema.prefs`. Esse é o ponto único de afinação do curso inteiro e o lar natural dos controles de aparência do plano (§3, §4). (Butterick "Typography in ten minutes"; CSS custom properties / MDN.) **Confiança: alta.**

### C1. Medida (comprimento de linha): ~45–90 caracteres, alvo ~66ch
Butterick recomenda 45–90 caracteres; Bringhurst ~45–75ch com 66ch confortável; WCAG 1.4.8 (AAA) limita a 80 (40 para CJK).
**Aplicação:** restringir prosa em **`ch`, não px**, para a medida sobreviver ao zoom: `:root{ --measure:68ch; }` e `max-width:var(--measure); margin-inline:auto`. Tailwind: `max-w-prose` (~65ch) ou `max-w-[68ch]`. Hero/headings full-width; **clampar só o bloco de corpo**. Em duas colunas, cada uma ≤ ~75ch. Encaixe direto na preferência "largura de linha" do plano (trocar `--measure`).
Fontes: <https://practicaltypography.com/line-length.html>; <https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation.html>. **Confiança: alta.**

### C2. Tamanho de corpo: 16–20px (16px piso; 18–20 melhor p/ texto longo)
Butterick ~15–25px; Material 3 "Body Large" 16px; Apple HIG escala via Dynamic Type.
**Aplicação:** `--fs-body: clamp(1rem, 0.95rem + 0.4vw, 1.25rem)` (fluido 16→20px). **Regra de acessibilidade que importa:** nunca fixar `font-size` do `:root` em px (quebra zoom e a preferência de tamanho); manter root em rem e dimensionar tudo em rem/em. Suporta direto a preferência "tamanho de fonte ajustável" (mexer no rem base ou num `--fs-scale`).
Fontes: <https://practicaltypography.com/point-size.html>; <https://m3.material.io/styles/typography/type-scale-tokens>; <https://developer.apple.com/design/human-interface-guidelines/foundations/typography/>. **Confiança: alta.**

### C3. Entrelinha: corpo ~1.4–1.6 (piso 1.5 de acessibilidade); títulos ~1.1–1.25
Butterick 120–145%; WCAG 1.4.8 (AAA) ≥1.5 dentro de parágrafos; 1.4.12 exige funcionar com line-height forçada a 1.5.
**Aplicação:** `--lh-body:1.6; --lh-tight:1.2`. Usar **multiplicadores sem unidade** (não px/em) para herdar e sobreviver a overrides do usuário (1.4.12). Casa com a preferência "densidade": modo compacto ~1.45, confortável ~1.7.
Fontes: <https://practicaltypography.com/line-spacing.html>; WCAG 1.4.8 e 1.4.12. **Confiança: alta.**

### C4. Ritmo vertical: espaço de parágrafo > espaço de linha
WCAG 1.4.8 (AAA): espaço de parágrafo ≥ 1.5× o de linha; whitespace ao redor de títulos/seções é o principal motor de hierarquia e chunking.
**Aplicação:** escala de espaçamento atada à entrelinha: `--space-para:1.5em; --space-section:3rem`. Títulos com **mais margem em cima** que embaixo (grudam no texto que segue). **Caveat INEMA:** o plugin `prose` oficial do Tailwind exige build — **não usar** no setup CDN; replicar o espaçamento à mão (`space-y-6` no artigo, `mt-12/mt-16` em headings de seção).
Fonte: WCAG 1.4.8 + guias de hierarquia (NN/g e similares). **Confiança: alta.**

### C5. Hierarquia por escala modular pequena e consistente
Hierarquia por tamanho + peso + espaçamento + cor; limitar a ~2–3 níveis visíveis de heading no corpo. Material Design comunica hierarquia por diferenças de peso/tamanho/tracking/caixa.
**Aplicação:** definir a escala uma vez em variáveis e reusar em todas as páginas. Diferenciar níveis por **tamanho E peso/cor**, não só tamanho. Tracking só em eyebrow/kicker em caixa-alta. **Caveat INEMA:** a baseline já tem escala fixa em utilitários Tailwind (hero `text-4xl/5xl` → seção `text-2xl` → card `text-xl` → corpo `text-base`); **alinhar os nomes de variável à escala existente**, não criar uma concorrente.
Fontes: <https://m2.material.io/design/typography/the-type-system.html>; <https://m3.material.io/styles/typography/type-scale-tokens>. **Confiança: alta.**

### C6. Contraste de texto: AA 4.5:1 (3:1 grande); mirar AAA 7:1 p/ leitura sustentada
WCAG 1.4.3 (AA) e 1.4.6 (AAA); 1.4.11 = 3:1 para UI/bordas.
**Aplicação:** dirigir todas as cores por CSS variables e verificar cada par num checker. Light: `--bg:#ffffff; --text:#1a1a1a` (~16:1, AAA); texto "muted" no piso seguro ~`#6e6e6e` sobre branco. **Texto muted/legenda é a falha AA mais comum — checar sempre.** Como o curso terá vários temas (dark/claro/sépia/foco), **cada `--text` e `--text-muted` precisa ser verificado por tema**, não assumido por herança.
Fontes: <https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html>; 1.4.6; <https://webaim.org/resources/contrastchecker/>. **Confiança: alta.**

### C7. Dark mode: nada de `#000`+`#fff` puros
Cinza muito escuro (não preto puro) com off-white. Evitar contraste máximo é prática consolidada (NN/g). O mecanismo "halação" é folclore — a recomendação fica de pé como boa prática.
**Aplicação:** `--bg:#121212` (ou o dark-900 `#111827` da baseline), `--surface:#1f2937`, `--text:#e6e6e6`, `--text-muted:#a8a8b3`. A baseline **já** usa near-black, então isto confirma a prática INEMA + vira regra para temas novos. Implementar todos os temas com os **mesmos nomes de variável** e trocar via classe/`data-theme` no `<html>`, persistindo em `localStorage`.
Fonte: <https://www.nngroup.com/articles/dark-mode-users-issues/>. **Confiança: média.**

### C8. Sans-serif legível; "modo dislexia" é opção, não default
British Dyslexia Association recomenda sans com counters abertos + espaçamento generoso, sem eleger uma fonte; evidência **não** estabelece que OpenDyslexic supera bons sans mainstream.
**Aplicação:** stack sans numa variável: `--font-body:'Inter', system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`. **Inter (default da baseline) já atende** — expor alternativas só pela preferência "tipografia (família)". Modo "conforto/dislexia" opcional troca `--font-body` por um sans estilo BDA e aumenta espaçamento (letter-spacing ~0.03–0.05em, line-height ≥1.5) — **sem forçar OpenDyslexic em todos**. Prosa **left-aligned, ragged-right** (nunca justificada); evitar blocos longos em itálico/caixa-alta.
Fontes: BDA (resumida por <https://www.audioeye.com/post/10-best-fonts-for-dyslexia/>); <https://en.wikipedia.org/wiki/OpenDyslexic>. **Confiança: alta.**

### C9. Left-aligned, sem justificar; unidades relativas que sobrevivem a zoom/overrides
WCAG 1.4.8 (AAA) exige não-justificado; 1.4.12 (AA) exige funcionar com overrides de espaçamento; 1.4.4 (AA) = zoom 200%; 1.4.10 (AA) = reflow a 320px. (Atenção: o "200%" é 1.4.4, **não** 1.4.8.)
**Aplicação:** `text-align:left` na prosa; nunca `text-justify`. rem/em/ch em tudo; nunca `font-size` fixa em px no root. Não pôr `max-height`/`overflow:hidden` em containers de texto. **Verificar** o arquivo a 200% (sem scroll horizontal na coluna de leitura) e aplicar os overrides de 1.4.12 via devtools para confirmar que nada corta — vira **item de CHECKLIST_REVISAO** da skill nova.
Fontes: WCAG 1.4.8, 1.4.12, 1.4.4, 1.4.10. **Confiança: alta.**

---

## D. Tracking de progresso

### D1. Progresso em 3 granularidades; persistir só booleans, DERIVAR percentuais
**O padrão mais importante deste ângulo.** Mostrar tópico/módulo/curso com medidor de %; persistir apenas os booleans de conclusão e derivar as % no render, para os totais se autocorrigirem se o conteúdo mudar.
**Aplicação:** `inema.<courseId>.read = {"modulo-1-1#topico-3": true, …}`. No render: `módulo% = concluídosNoMódulo/totalNoMódulo`, `curso% = concluídosTotal/totalTotal`. **Nunca persistir a % derivada, só o conjunto de booleans.** Casa com o modelo do `PLANO-FORMATO-CURSO-V2.md` (§6).
Fonte: <https://ui-patterns.com/patterns/CompletenessMeter>. **Confiança: alta.**

### D2. "Marcar como lido" explícito é o caminho confiável
Check para concluído; "Começar"/"Continuar"/feito como estados. Modelo de 3 estados (não iniciado / em progresso / concluído) é barato.
**Caveat para esta skill:** "auto-completar ao vídeo chegar a 90%" **não se aplica** (conteúdo é texto/SVG, sem vídeo). Auto-completar por scroll-até-o-fim é frágil (tópicos longos, accordions colapsados) — manter marcação explícita como primária, scroll só como assist opcional. Trocar "minutos restantes de vídeo" por **estimativa estática de tempo de leitura**.
Fonte: <https://medium.com/amsterdam-standard/ux-design-for-e-learning-f70ea302e75a>. **Confiança: média.**

### D3. "Continuar de onde parei" — última lição + (opcional) posição de scroll
**Caveat de correção específico deste formato:** as páginas usam **accordions** de tópico, então restaurar `scrollY` cru pode cair errado. Preferir restaurar para a **âncora do último tópico aberto** (`scrollIntoView` num id), com pixel-offset só como fallback. Debounce de scroll (~300ms); escrever em **`visibilitychange`** (não `beforeunload`, melhor no mobile); namespace por curso+página.
**Aplicação:** duas camadas — (1) nível-curso "último módulo visitado" (`meta`) alimentando um botão global "Continuar de onde parei" no index; (2) restauração de posição dentro da lição.
Fonte: <https://css-tricks.com/memorize-scroll-position-across-page-loads/>. **Confiança: alta.**

### D4. Endowed Progress (opcional, só honesto)
Semear o medidor com um primeiro passo **real** (Nunes & Dreze 2006) — ex.: contar "abriu o módulo / leu a introdução" como 1/N em vez de 0/N. **Caveat INEMA:** marca sóbria, anti-manipulação — aplicar levemente, **nunca inflar a barra**. "Nice to have".
Fonte: <https://learningloop.io/plays/psychology/endowed-progress-effect>. **Confiança: média.**

### D5. Goal-Gradient como lógica de render
Quando faltam poucos itens, enfatizar o quanto resta ("Falta 1 tópico para concluir o módulo") e destacar a barra quase cheia. É um condicional sobre contagens derivadas do mesmo mapa `read` (`restante = total − feito`; quando ≤1–2, troca a copy). Sem storage extra; tom factual, não hypey.
Fonte: <https://learningloop.io/plays/psychology/goal-gradient-effect>. **Confiança: alta.**

### D6. Gamificação leve, adulta e intrínseca (se houver)
Progresso/conclusão + marcador discreto de marco (anel de conclusão estilo LinkedIn, badge sutil ao concluir trilha/curso) em vez de pontos/confete. Cada marco **derivado de uma conclusão real** no mapa `read` (resetar progresso recalcula/limpa). **Caveat INEMA:** o design system **proíbe animação exuberante e neon** — celebração = check/banner sutil, não confete. "Considerar", não requisito.
Fonte: <https://medium.com/design-bootcamp/the-zeigarnik-effect-in-ux-why-unfinished-tasks-keep-users-hooked-3330b398321b>. **Confiança: média.**

### D7. Streaks diários: provavelmente NÃO encaixam — preferir marcos cumulativos
Curso de leitura é consumido em rajadas, não diariamente; streak pune o uso normal e bate de frente com o tom sóbrio. Marcos cumulativos ("X tópicos concluídos") entregam o benefício motivacional sem pressão de data. Se algum dia usar streak, **exigir mecânica de perdão** (freeze/repair). (Figuras de "+60%/3.6x" descartadas.)
Fonte: <https://www.plotline.so/blog/streaks-for-gamification-in-mobile-apps>. **Confiança: baixa (recomendação: pular).**

### D8. Progresso sempre visível + micro-feedback imediato
Widget persistente (curso/trilha % + checks por tópico no index; indicador sticky no header da lição). `localStorage` é **síncrono** → virar um tópico para "feito" e re-renderizar o medidor no mesmo tick é genuinamente instantâneo, sem latência a mascarar. Manter a animação do check **sutil** e respeitar `prefers-reduced-motion`. (Embelezamentos não verificáveis do blog descartados.)
Fonte: <https://www.uxpin.com/studio/blog/design-progress-trackers/>. **Confiança: alta.**

### D9. Estado concluído real-time, celebração só em 100% genuíno
Re-renderizar no mesmo tick (síncrono = real-time de graça). Liberar o banner/badge **estritamente** quando `curso% === 100` (ou `trilha% === 100`). Persistir `completedAt` em `meta` para o estado e a data sobreviverem ao reload. Celebração sutil (design system).
Fonte: <https://ui-patterns.com/patterns/CompletenessMeter>. **Confiança: alta.**

### D10. NÃO travar a espinha sequencial por conclusão
Usar stepper/"continuar" para o próximo da fila, mas manter o **completeness meter informativo, não como portão**. A própria `ui-patterns` desaconselha o padrão para fluxos estritamente sequenciais/críticos. A estrutura INEMA permite abrir qualquer coisa — gatear quebraria isso e o princípio "abre e lê offline". Modelar tanto o próximo (lista ordenada de módulos + mapa `read`) quanto o medidor livre da trilha/curso.
Fonte: <https://ui-patterns.com/patterns/CompletenessMeter>. **Confiança: média.**

---

## E. Notas e highlights

### E1. Fluxo de criação: seleção → popover flutuante (a interação mais importante a copiar)
Convenção observável em Kindle, Notion, Hypothesis, Medium, Google Docs: o usuário seleciona, solta, e um popover aparece perto da seleção com os verbos. O verbo decide se é **highlight puro** (só cor) ou **highlight + nota**.
**Aplicação:** em `mouseup`/`touchend`, ler `window.getSelection()`; se o range não for vazio/colapsado, `range.getBoundingClientRect()` e posicionar (absolute) um popover acima/centralizado (considerar `scrollX/scrollY`). Botões: **Highlight** (cor, sem nota) e **Nota** (cor + input). Fechar em mousedown fora ou seleção vazia. **Atenção:** handles de seleção variam entre browsers mobile; reposicionar se o popover transbordar a viewport.
Fonte: <https://web.hypothes.is/help/whats-the-difference-between-an-annotation-and-a-highlight/>. **Confiança: alta.**

### E2. Dois níveis: highlight (rápido, só cor) vs nota (opt-in, com texto)
Não bloquear o caminho rápido com textarea obrigatório.
**Aplicação:** uma forma de dado: `{id, color, quote, note: string|null, tags:[], created}`. Highlight = registro com `note===null`. Permitir **promover** highlight a nota depois, clicando no span existente.
Fonte: Hypothesis (idem E1). **Confiança: alta.**

### E3. Cor como canal semântico (uma cor = "dúvida")
Paleta fixa pequena (4–5 swatches) no popover. **Reservar uma cor explicitamente como "dúvida/pergunta"** → atende o requisito "marcar dúvida" do plano com zero digitação. Guardar a cor como hex/classe no span e no registro `localStorage` para round-trip, e uma classe tipo `.hl-doubt` alimentar um filtro "revisar minhas dúvidas". (Mapeamentos específicos de cor de blogs são exemplos, não fato.)
Fonte: <https://super.so/blog/how-to-highlight-text-in-notion-4-simple-steps>. **Confiança: alta.**

### E4. Onde mora o corpo da nota: marcador inline + painel toggle (não drawer sempre-ligado)
Trade-off de intrusividade: inline (Genius/Medium) vs marcador+sticky (Kindle) vs sidebar sempre-ligada (Hypothesis, a mais poderosa porém a mais intrusiva).
**Aplicação:** highlights inline (span com bg); quando `note!==null`, adicionar um **marcador/superscript** (um span colorido sozinho não sinaliza que há nota atrás). Corpo da nota em popover por clique ou painel direito **toggle (não sempre-ligado)**. Um drawer colapsável listando todas as notas serve de superfície de "revisitar" sem a intrusão.
Fonte: <https://tomcritchlow.com/2019/02/12/annotations/>. **Confiança: alta.**

### E5. Mobile: docar a nota como bottom sheet
Em telas estreitas, não espremer num side drawer; docar no rodapé (`position:fixed; bottom:0`) para texto destacado e nota visíveis juntos (padrão Google Docs mobile). Em telas largas: painel/popover à direita. `@mention` é irrelevante numa página single-user e deve ser pulado.
Fonte: Critchlow (idem). **Confiança: média.**

### E6. "Revisar" como modo de primeira classe (Readwise)
Uma view de Review distinta da leitura: ler todos os registros do `localStorage` e renderizar como lista/cards (quote + nota + cor/tag), **filtrável por cor/tag** (ex.: só "dúvida"), com navegação por teclado. SRS completo é exagero; um filtro "perguntas a revisitar" + toggle "resolvido" por item captura a maior parte do valor. **Tags são o mecanismo barato** que alimenta review temático.
Fontes: <https://docs.readwise.io/readwise/docs/faqs/reviewing-highlights>; <https://blog.readwise.io/adding-intention-to-spaced-repetition/>. **Confiança: média.**

### E7. Persistência/anchoring: descritor de range + quote como fallback
Ranges crus não são serializáveis; offset puro quebra com mutação do DOM. Solução padrão (Rangy/annotator/Hypothesis): descritor (path do container + offsets) **+ o texto citado** como fallback.
**Aplicação (favorável aqui):** num arquivo **estático e congelado**, o DOM não muda entre sessões, então a fragilidade quase não morde. Dar a cada bloco anotável um `id` estável, guardar `{blockId, startOffset, endOffset, quote, color, note, tags, id}` como JSON. No load, percorrer os text nodes do bloco, localizar offsets, construir o Range e envolver. **Sempre guardar o quote** para re-achar por busca textual se os offsets driftarem.
Fontes: <https://github.com/timdown/rangy/wiki/Highlighter-Module>; <https://eve.gd/2016/06/26/selecting-specified-text-ranges-in-a-browser-using-javascript-and-xpath/>. **Confiança: alta.**

### E8. Renderizar highlight: NÃO usar `surroundContents()` cego
`Range.surroundContents()` lança `InvalidStateError` em seleção que cruza nós/elementos (restrição DOM documentada).
**Aplicação:** para seleção multi-nó, iterar os text nodes que o range cruza (`TreeWalker`) e envolver cada pedaço num `<span class="hl" data-id=…>`, **compartilhando um id lógico** entre os pedaços (clique/hover/delete operam no grupo todo). Escopar o `TreeWalker` ao container do artigo. **Atalho de MVP:** proibir seleção cross-element, ou `splitText()` no início/fim e envolver o text node do meio. Clique no `.hl` abre o popover de nota/editar/excluir.
Fonte: <https://github.com/timdown/rangy/wiki/Highlighter-Module> + MDN `Range.surroundContents`. **Confiança: alta.**

### E9. Editar/remover clicando no próprio highlight
Ciclo: criar → clicar para reabrir → editar nota / trocar cor / excluir.
**Aplicação:** listener de clique nos spans abrindo o popover ancorado **(reusar o de criação)** com: trocar cor, adicionar/editar nota, trocar/limpar tag (toggle "dúvida"), excluir. No delete, **desfazer** cada span (substituir pelo text node + `parent.normalize()`) e remover o registro do array. Persistir a cada mutação (`JSON.stringify` do array completo) → refresh sem perda.
Fontes: Hypothesis; Readwise. **Confiança: alta.**

### E10. "Highlight + copiar/exportar" reusa o mesmo popover (opcional)
Bolt-on barato: um botão "Copiar" ou "Exportar meus destaques" no mesmo popover. **`navigator.clipboard.writeText`** só funciona em secure context — quando o arquivo abre via `file://`, precisa de fallback (textarea oculto + `document.execCommand('copy')`). `highlight-share` é referência limpa, sem dependências, do loop de posicionamento.
Fontes: Critchlow; <https://github.com/anythingcodes/highlight-share>. **Confiança: média.**

---

## F. Acessibilidade

### F1. Tudo operável por teclado (WCAG 2.1.1, A) — base de tudo
`<button>`/`<a href>` nativos já são focáveis e respondem a Enter/Space; `div/span` com `onclick` não.
**Aplicação:** o `toggleTopic()` atual já usa `<button onclick>` → **manter `<button>` nativo** (nunca trocar por div clicável). Qualquer controle novo (marcar lido, abrir nota, seletor de tema) = `<button>` nativo. `tabindex=0` + handler de Enter **e** Space só se não puder usar `<button>`. Testar a página inteira só com Tab/Shift+Tab/Enter/Space. **Confiança: alta.**

### F2. Indicador de foco visível (WCAG 2.4.7, AA)
Nunca `outline:none` sem foco próprio. (Geometria detalhada é 2.4.13, AAA — bônus.)
**Aplicação:** `:focus-visible { outline:3px solid #38bdf8; outline-offset:2px; }` (anel só no teclado). No dark âmbar, garantir contraste do anel ≥3:1 contra o fundo do card. **Confiança: alta.**

### F3. Foco não obscurecido (WCAG 2.4.11, AA — novo na 2.2)
**Risco real:** a baseline tem nav **sticky com backdrop-blur**. Ao tabular pelos botões de tópico logo abaixo, o item focado pode ficar atrás do nav. **Aplicar `scroll-margin-top` (= altura do nav)** nos alvos focáveis/âncoras. **Confiança: alta.**

### F4. Contraste: 4.5:1 normal / 3:1 grande (1.4.3); UI/bordas 3:1 (1.4.11)
**Pares de maior risco no dark âmbar:** cinzas secundários (`text-sm` de meta/legenda, placeholders) sobre dark-900/800 — frequentemente falham 4.5:1. Âmbar/sky saturado sobre escuro costuma passar. Bordas de card, ícones de toggle e o anel de foco precisam de ≥3:1. **Rodar checker em cada par cor/fundo, por tema** (claro/sépia/foco inclusos) antes de publicar. **Confiança: alta.**

### F5. `prefers-reduced-motion`
Reduzir/eliminar movimento não-essencial em interações (abrir tópico, modal, hover). (2.3.3 é AAA, mas barato e alto valor; já é padrão na skill atual.)
**Aplicação:** `@media (prefers-reduced-motion: reduce){ *,::before,::after{ animation-duration:.01ms!important; transition-duration:.01ms!important; scroll-behavior:auto!important; } }`. **Preservar o estado final** (painel abre/fecha) — cortar só o movimento. **Confiança: alta.**

### F6. Toggle "lido" = `role=switch`+`aria-checked` (ou `<button aria-pressed>`)
APG Switch: `aria-checked` alterna; **Space** alterna. Estado refletido também por **ícone/texto, não só cor** (1.4.1).
**Aplicação:** "marcar tópico/módulo como lido" (persistente em `localStorage`): `role=switch aria-checked` com label "Marcar como lido", ou `<button aria-pressed>`. Garantir Space, não só clique. **Confiança: alta.**

### F7. Tópicos sanfonados = padrão Disclosure
`<button aria-expanded>` + `aria-controls` apontando para o id da região; alternar `aria-expanded` ao abrir/fechar.
**Aplicação:** o `toggleTopic()` já é `<button>` mas (pela baseline) **sem ARIA de estado** — adicionar `aria-expanded="false"` e `aria-controls="painel-id"`, com `id="painel-id"` no `.topic-explanation`. Sem isso, o leitor de tela não sabe que expandiu. Enter/Space já funcionam por ser `<button>` nativo. **Confiança: alta.**

### F8. Modais: mover foco para dentro, prender, Escape fecha, devolver foco
APG Dialog. Os modais do template (iframe do módulo, zoom de imagem) **já** fecham no ESC e travam `body.overflow` — **falta o resto:** `role=dialog aria-modal=true aria-labelledby`; focar o primeiro focável ao abrir; guardar o gatilho e devolver o foco ao fechar; aplicar **`inert`** ao resto da página enquanto aberto (suporte amplo, funciona self-contained, sem polyfill). **Confiança: alta.**

### F9. Popovers/tooltips por hover/foco (1.4.13, AA) — só se houver
Devem ser dismissable (Esc), hoverable e persistent. `title=` nativo **não** atende. Só aplica **se** o curso usar tooltips (glossário/dica inline). Tornar robustamente hoverable exige JS — **se não quiser o custo, prefira informação inline no texto**. **Confiança: média.**

### F10. Zoom 200% (1.4.4) e reflow 400%/320px (1.4.10), AA
Tailwind já usa rem, o que ajuda — conferir que nenhum tamanho crítico esteja em px e que containers não tenham altura fixa cortando texto. Para a opção "tamanho de fonte", ajustar `font-size` do `:root` (100%/112%/125%) e o resto em rem escala junto. Testar a 200% e 400%. **Confiança: alta.**

### F11. Opção de espaçamento (1.4.12, AA)
A opção "espaçamento" pode aplicar `line-height:1.5+`, `letter-spacing:0.12em`, `word-spacing:0.16em`, parágrafo 2em — os exatos limites de teste do critério. Garantir que blocos de texto não tenham altura fixa nem `overflow:hidden` cortando ao aumentar (usar `min-height`/auto). **Confiança: alta.**

### F12. "Fonte para dislexia": opção, nunca default nem promessa
Priorizar tamanho (≥16px/1rem), entrelinha 1.5 e contraste. **Caveat self-contained:** Inter já serve; fontes extras (Atkinson Hyperlegible, OpenDyslexic) são arquivos externos/CDN — se a regra de ouro exige zero dependência externa, usar fontes já presentes ou embutir via `@font-face` base64 (pesa o HTML). Não forçar OpenDyslexic nem prometer que "resolve" dislexia. **Confiança: alta.**

### F13. Modo de alto contraste próprio (toggle); `forced-colors` é polish
O caminho principal é o **próprio toggle de tema** "alto contraste" (texto quase-branco sobre preto, realces saturados, bordas visíveis), persistido. `@media (forced-colors: active)` garantindo `border:1px solid` em toggles/cards/foco é **bônus** de robustez (no Forced Colors o SO remove backgrounds/box-shadow; botão só com bg colorido some). Safari não implementa forced-colors. Tratar como polish (média prioridade), depois do contraste base AA correto. **Confiança: média.**

### F14. Skip link (2.4.1, A) + ordem de foco = ordem visual (2.4.3, A)
A baseline **repete o nav completo em todas as páginas** (regra crítica #13) → skip link tem alto valor: `<a class="skip" href="#conteudo">Pular para o conteúdo</a>` como primeiro focável, escondido até `:focus`, apontando para `<main id="conteudo">`. Ordem DOM = ordem visual; evitar `tabindex>0`. Só adiciona, não mexe em regra crítica existente. **Confiança: alta.**

---

## G. Visual e temas trocáveis

### G1. Arquitetura de tokens em 3 níveis
(1) **PRIMITIVOS** = canais HSL crus em vars separadas; (2) tokens de **TEMA/semânticos** construídos dos canais; (3) **SEMÂNTICOS GENÉRICOS** que a página consome (`--bg`, `--surface`, `--text`, `--accent`). A página referencia **só** o nível genérico e não sabe qual tema está ativo. (web.dev "Building a color scheme".)
**CAVEAT INEMA (crítico):** o INEMA renderiza via **Tailwind Play CDN** e o markup está saturado de classes `dark:` e utilitários literais (`dark:bg-dark-800`, `text-amber-400`). Um nível de CSS variable **não alcança** esses utilitários — "refatorar tudo para consumir só genéricos" seria reescrever quase todas as classes para arbitrary-values (`bg-[var(--surface)]`), **um refactor grande, não um swap de token**. **Caminho realista:** definir primitivos + genéricos e aplicá-los ao bloco `<style>` de light-mode escrito à mão e a componentes novos, mantendo os utilitários `dark:` funcionando pela classe `.dark`. "Tema novo = ~10 linhas" só vale para as partes já dirigidas por CSS vars.
HSL verificado localmente: `#FACC15 = hsl(48 96% 53%)`, `#38bdf8 = hsl(198 93% 60%)`; dark-900..600 mapeiam num único hue ~215–221.
Fonte: <https://web.dev/articles/building/a-color-scheme>. **Confiança: média.**

### G2. `color-scheme` por tema + (com cuidado) `[data-theme]`
`color-scheme: dark|light` faz a UI nativa (scrollbars, form controls, seleção) seguir o tema. **Win barato e de alto valor** (conserta scrollbars/inputs claros no curso dark), 100% sem framework.
**AVISO sobre migração para `[data-theme]`:** **não é drop-in** no INEMA. A variante `dark:` do Tailwind chaveia pela classe `.dark`; mover o root para `data-theme` sem reconfigurar `darkMode` quebraria **todo** `dark:` do markup. **Mais seguro:** **manter o toggle de `.dark`** para o Tailwind, e **adicionar** um `data-theme`/`data-variant` ortogonal só para os temas extras (sépia/foco/alto-contraste) tratados por CSS vars à mão, com `color-scheme` em cada. Tratar "N temas só por atributo" como aspiracional. (`:has()` no-JS é real mas desnecessário aqui.)
Fontes: <https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme>; web.dev; <https://squidfunk.github.io/mkdocs-material/setup/changing-the-colors/>. **Confiança: média.**

### G3. Script bloqueante no `<head>` contra FOUC de tema (o item mais seguro)
Inline um script minúsculo, **acima do stylesheet**, que lê `localStorage` e seta o tema antes do primeiro paint. Só DOM nativo (nada carregou ainda), com `try/catch`.
**Aplicação:** se os utilitários `dark:` ficam (recomendado), o script deve **adicionar/remover a CLASSE `.dark`** (não só um atributo) para não ter FOUC das partes Tailwind; se há temas nomeados, setar ambos. Default para dark no erro preserva a marca.
Fontes: <https://cybercafe.dev/prevent-flash-of-default-style/>; <https://github.com/picocss/examples/issues/18>. **Confiança: alta.**

### G4. Acento como token swappable, ortogonal ao tema de superfície
Acento (cor por trilha) e tema claro/escuro são dois eixos independentes (MkDocs Material). O INEMA já tem acento por trilha (T1 emerald … T6 rose) + âmbar/ciano. Modelar `--accent-h/-s/-l` + `--accent` genérico é limpo **para CSS à mão**. **Mesmo caveat de G1:** as cores por trilha hoje são utilitários (`text-emerald-400`), então acento "de verdade" swappable por uma variável exige migrar essas para estilos baseados em var. Manter âmbar como `--primary` default (logo/CTA/dica) e ciano como `--accent-2` fixo (diagramas), conforme papéis reservados na baseline.
Fonte: <https://squidfunk.github.io/mkdocs-material/setup/changing-the-colors/>. **Confiança: média.**

### G5. Modo sépia/leitura: creme quente + marrom escuro (não preto puro)
Valores canônicos ~bg `#FBF0D9` / texto `#5F4B32`. **Verificado: 7.31:1 (passa AAA normal).**
**Aplicação:** `[data-theme="sepia"]` com bg `#FBF0D9` / surface `#F4E8CE` / text `#5F4B32` / muted `#7A6650` / border `#E0D2B0`.
**CORREÇÃO importante:** "âmbar harmoniza como acento" é enganoso para **âmbar como TEXTO**. Verificado: âmbar `#FACC15` sobre `#FBF0D9` = **1.35:1** (falha AA feio) e sobre branco = 1.53:1 — **âmbar é ilegível como texto em superfícies claras** (por isso a baseline cai para `-800` no light). No sépia, usar âmbar **só** como fill/borda decorativo grande, e trocar texto/links de acento por âmbar escurecido (amber-700/-800) ou pelo marrom sépia. Harmonia de hue é real; contraste não — **não deixar o argumento de hue passar por cima do contraste**.
Fonte: <https://medium.com/greatnote/kindle-sepia-color-code-1fed14b1a5ef> + verificação local 7.31:1. **Confiança: média.**

### G6. Medida ~45–75ch (alvo ~66) + entrelinha ~1.5–1.6
(Reforça C1/C3.) `max-width:~68ch` (`max-w-prose` ou `max-w-[68ch]`) + `line-height:~1.6` (`leading-relaxed`) na prosa dos módulos; expor `--measure`/`--leading` se o modo foco for ajustar. **NOTA:** em módulos densos com blocos de código, tabelas largas e grids de 4 colunas de stats, **a coluna dura de 68ch é errada para esses elementos** — clampar **só a coluna de prosa**, não o layout todo.
Fontes: <https://www.uxpin.com/studio/blog/optimal-line-length-for-readability/>; <https://pimpmytype.com/line-length-line-height/>. **Confiança: alta.**

### G7. Densidade (confortável vs compacto) — DROPAR por ora
Conceito real (Fluent), mas **impraticável no INEMA como está:** o espaçamento na baseline é utilitário Tailwind fixo (`mb-16`, `p-8`, `gap-6`), **não** CSS variable — um `[data-density]` não tem o que multiplicar. Tornar densidade um toggle real exigiria migrar a maioria dos utilitários de espaçamento (refactor pesado, feature de baixa prioridade num curso de leitura). **Recomendação: dropar agora**, ou escopar só a font-size (bem mais barato e ajuda mais a11y).
Fonte: <https://learn.microsoft.com/en-us/windows/apps/design/style/spacing>. **Confiança: baixa.**

### G8. Tema "alto-contraste" baseado em escuro (verificado)
WCAG AA (4.5/3:1), idealmente AAA (7:1), com near-black/near-white (não `#000`/`#fff`). **Verificado local:** texto `#F5F7FA` sobre `#0A0E14` = **18.02:1**; âmbar `#FACC15` sobre `#0A0E14` = **12.63:1**; ciano `#38bdf8` sobre `#0A0E14` = **9.03:1** — todos passam AAA.
**Correção de escopo:** o "garanta âmbar/ciano ≥4.5:1 em cada superfície" só é alcançável em superfícies **escuras** — âmbar **não chega** a 4.5:1 como texto em nenhuma superfície clara (1.5:1 no branco). Então: ou manter alto-contraste **baseado em dark** (recomendado, acentos na marca e passam), ou, para variante clara, trocar acentos por amber-700/-800 e ciano mais escuro. Ajustar o canal L do primitivo por tema e re-checar num checker real.
Fonte: <https://webaim.org/articles/contrast/> + verificações locais. **Confiança: alta.**

### G9. Variar paleta por HSL (L/S do mesmo hue) + escada de 4 superfícies
Derivar dark/dim/sépia mexendo principalmente em lightness/saturation de um hue compartilhado; escada de 4 superfícies para profundidade; opcionalmente tingir sombras com o hue da marca. Verificado: dark-900..600 do INEMA já formam uma escada quase mono-hue (~215–221), mapeando direto. Um tema "dim" é um extra quase de graça.
**Caveats:** (1) as fórmulas do web.dev (`hsl(hue, sat/2, lightness/1.5)`) são ilustrativas — **conferir e checar contraste de cada resultado, não publicar a saída cega**. (2) Sombras tingidas pelo hue são quase imperceptíveis sobre near-black — reservar sombra tingida para light/sépia; no dark, preferir borda sutil ou superfície mais clara (elevação). Mesmo caveat Tailwind: as superfícies mapeiam para o layer CSS à mão; os `dark:bg-dark-*` precisariam apontar para as vars para se beneficiar.
Fonte: <https://web.dev/articles/building/a-color-scheme>. **Confiança: média.**

---

## H. Onde a realidade da baseline aperta (síntese dos caveats)

Três tensões recorrentes que a skill nova precisa resolver de propósito:

1. **Tailwind CDN vs tokens CSS.** Boa parte das cores/espaçamentos vive em utilitários (`dark:bg-dark-800`, `text-amber-400`, `mb-16`), que CSS variables **não alcançam**. Decisão recomendada: **dois layers convivem** — Tailwind/`.dark` segue dirigindo o que já está em utilitário; CSS variables (`inema.prefs`) governam os **parâmetros de leitura** (medida, fonte, tamanho, entrelinha) e os **temas extras** (sépia/foco/alto-contraste) no `<style>` à mão e em componentes novos. Não prometer "tema novo em 10 linhas" para as partes Tailwind.
2. **Estático congelado = anchoring fácil.** O DOM não muda entre sessões, então highlight por offset + quote é tratável (E7/E8) e SRS de verdade é impossível (B8). Calibrar ambos.
3. **Tom sóbrio anti-manipulação.** Endowed progress, goal-gradient, badges e celebração entram **leves e honestos** (derivados de conclusão real), sem confete/neon/streak (design system + marca).

---

## I. Recomendações priorizadas para a skill nova

Ordenado por **alto valor / baixo custo primeiro**. "Custo" considera a realidade Tailwind-CDN/self-contained.

### Nível 1 — Fazer já (alto valor, baixo custo, sem refactor)
1. **Script anti-FOUC bloqueante no `<head>`** que seta a classe `.dark` (+ `data-theme`) a partir de `localStorage` antes do paint. (G3) — o item mais seguro e de maior confiança.
2. **`color-scheme` por tema** (`dark`/`light`/sépia). (G2) — conserta scrollbars/inputs, uma linha por tema.
3. **Parâmetros de leitura centralizados em CSS variables** num único wrapper `.prose`: `--measure:68ch`, `--fs-body: clamp(1rem,0.95rem+0.4vw,1.25rem)`, `--lh-body:1.6`, `--space-para:1.5em`, `--font-body` (Inter). Clampar **só a prosa**, não o layout. (C-final, C1–C4, G6)
4. **`localStorage` síncrono: persistir só booleans, derivar % no render**, em 3 granularidades (tópico→módulo→trilha→curso). Re-render no mesmo tick = progresso instantâneo. (D1, D8)
5. **"Marcar como lido" explícito** como `<button aria-pressed>`/`role=switch`, estado por ícone+texto+cor. (D2, F6)
6. **Skip link + `scroll-margin-top` nos alvos focáveis** (nav sticky obscurece foco). (F14, F3)
7. **ARIA nos accordions** existentes: `aria-expanded` + `aria-controls`. (F7)
8. **`:focus-visible` visível** + `@media (prefers-reduced-motion)` envolvendo transições. (F2, F5)
9. **Chunking — 1 conceito + 1 demo + 1 check por seção**, títulos como tarefa. (B3, B5, B12)
10. **Verificar contraste de cada par cor/fundo, por tema** (muted é a falha comum), incl. sépia AAA-verificado e alto-contraste dark verificado. (C6, F4, G5, G8)

### Nível 2 — Implementar na sequência (alto valor, custo médio)
11. **Highlight + nota via popover de seleção** (`mouseup` → `getBoundingClientRect`), com **uma cor reservada a "dúvida"** (atende "marcar dúvida" sem digitar). Dado: `{id,color,quote,note,tags,created}`; anchoring por `{blockId,startOffset,endOffset,quote}`; render por `TreeWalker` (não `surroundContents`); editar/excluir clicando no span. (E1–E3, E7–E9)
12. **Painel "minha jornada" / modo Review**: lista de lidos, dúvidas e notas filtrável por cor/tag, com "perguntas a revisitar" e toggle "resolvido". (E6)
13. **Export/Import `.json`** (round-trip lossless, schema do §6, forward-compatible com sync v2). (Plano §6; E10 para o botão)
14. **"Continuar de onde parei"** restaurando para **âncora do tópico** (não scrollY cru), escrito em `visibilitychange`, namespaced por curso+página. (D3)
15. **TOC sticky + scroll-spy** (`IntersectionObserver`) + indicador "Seção X de N". (B12, B5)
16. **Self-checks inline com feedback explicativo por opção** que ancoram de volta ao parágrafo; nunca travam o avanço; desafio cumulativo no fim. (B6, B7)
17. **Temas extras (sépia/foco/alto-contraste)** como `[data-theme]` ortogonal à classe `.dark`, governados por CSS vars à mão; cada um com contraste verificado e `color-scheme`. (G2, G5, G8, C7)
18. **Modais acessíveis**: `role=dialog aria-modal`, foco preso, devolução de foco, `inert` no resto. (F8)
19. **Demos manipuláveis inline + modelo mental primeiro (diagrama antes da sintaxe)** por conceito-chave; reusar o SVG futurista da baseline. (B1, B2, B4)
20. **Recall espaçado parcial**: pergunta de seção anterior no fim de cada seção + revisão de fim de página + `localStorage` ressurgindo as erradas. (B8)

### Nível 3 — Considerar / opcional (valor situacional, ou polish)
21. **Goal-gradient como copy condicional** ("Falta 1 tópico…") + **endowed progress honesto** (1 passo real). Tom sóbrio, sem inflar. (D5, D4)
22. **Marco/badge sutil só em 100% genuíno** (sem confete/streak), com `completedAt`. (D6, D9, D7→pular streaks)
23. **Scaffolding worked-example → variação guiada → desafio** com editor em **iframe `sandbox`** (só web-native; sem `eval`). (B9, B11)
24. **Preferência "tipografia/tamanho/espaçamento"** (família opcional, `:root` 100/112/125%, limites de 1.4.12) — modo "conforto/dislexia" como **escolha, nunca default ou promessa**; fontes extras só se embutidas/permitidas. (C2, C8, F11, F12)
25. **`@media (forced-colors: active)`** com bordas sólidas em toggles/cards/foco — polish após o AA base. (F13)
26. **Bottom sheet de nota no mobile** + drawer de notas toggle (não sempre-ligado). (E4, E5)

### Não fazer agora (custo alto / desalinhado)
- **Toggle de densidade real** — espaçamento é utilitário Tailwind fixo, sem o que multiplicar; dropar ou escopar só a font-size. (G7)
- **Streaks diários** — punem o uso em rajadas e batem no tom sóbrio; preferir marcos cumulativos. (D7)
- **Migrar todo o markup para `[data-theme]`/tokens genéricos** — quebraria os `dark:` e é refactor grande; manter os dois layers. (G1, G2, H1)
- **Gatear a espinha sequencial por conclusão** — quebra "abre e lê offline"; medidor é informativo, não portão. (D10)
- **SRS agendado de verdade** — impossível num arquivo estático; só recall espaçado parcial. (B8)

---

## J. Itens para o CHECKLIST_REVISAO da skill nova (verificações testáveis)
- Persiste no reload; **Export → Import faz round-trip sem perda** (schema §6).
- **Zoom 200%** sem scroll horizontal na coluna de leitura (1.4.4); **reflow a 320px/400%** (1.4.10).
- Overrides de **1.4.12** (line-height 1.5 / letter 0.12em / word 0.16em / parágrafo 2em) aplicados via devtools sem cortar texto.
- Navegação **só por teclado** (Tab/Shift+Tab/Enter/Space) cobre tudo; foco **visível** e **não obscurecido** pelo nav sticky.
- **Contraste verificado por tema** (incl. muted/legenda) — dark, claro, sépia (texto AAA), foco, alto-contraste (dark verificado 18:1).
- `prefers-reduced-motion` corta movimento mas **preserva estado** dos painéis/modais.
- Troca de tema **aplica e persiste** entre páginas e reloads; **sem FOUC** (script bloqueante).
- Progresso **agrega corretamente** (tópico→módulo→trilha→curso); celebração só em 100% real.
- **Self-contained**: nenhuma dependência externa além do CDN permitido; abre via `file://` (clipboard com fallback).
- Regras Críticas #1–#17 e link **INEMA.CLUB** intactos; `formato-curso` original **byte-a-byte intacta**.
