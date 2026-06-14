# Ganhos da mudança v1 → v2 — análise balanceada

## 1. Bottom line

A v2 entrega **engenharia de plataforma real e, em boa parte, verificada em navegador** (45/45 testes), mas **não entrega nenhum ganho de aprendizagem medido**. O que é sólido — temas/personalização, rastreio de progresso, camada de estudo ativo (grifo/dúvida/revisão) e acessibilidade estrutural — vale principalmente **para o autor** (sistema reutilizável) e **para o aluno que usa os recursos** (UI mais rica que o v1). O que é especulativo — "retém mais", "abandona menos", "reduz carga cognitiva" — é **aposta apoiada em pesquisa cognitiva, sem teste com alunos neste conteúdo**. Valeu a pena como upgrade de produto; não está provado como upgrade de eficácia didática.

## 2. Ganhos por dimensão

| Dimensão | Principal ganho | Evidência | Veredito do cético |
|---|---|---|---|
| Didática | Títulos-como-tarefa + 7 seções/módulo como chunks ancorados | Verificado (markup + smoke conta tópicos) | **Parcial** — estrutura real; benefício cognitivo não medido; "1 ideia/seção" depende do autor |
| Progresso | Progresso em 3 granularidades persiste e agrega cross-módulo via manifesto | Verificado (smoke 23/23 em Chromium, reload, round-trip) | **Real** (tracking); especulativo no efeito motivacional |
| Estudo ativo | Grifo colorido que persiste, dúvida com cor reservada, painel de revisão consolidado | Verificado (contract+smoke; `<mark>` com rgba real) | **Real** no mecanismo; especulativo na retenção |
| Acessibilidade | Trap de foco real (inert+ESC+devolução), aria-pressed, skip link, reduced-motion override | Verificado em navegador | **Real** na estrutura; **parcial** no contraste por tema (calculado, não re-medido) |
| Visual / personalização | 2 → 5 temas que pintam a página toda + largura de prosa + tema "foco" | Verificado em runtime (fundos distintos, 600px↔750px) | **Real** no núcleo visual; **parcial/especulativo** nas alegações de a11y (FOUC, zoom 200%) |
| Arquitetura / custo | Bundle único reutilizável byte-idêntico, persistência robusta, zero build/backend | Verificado (diff, grep, código) | **Real** (5 de 6 claims); **parcial** só no hook de sync futuro |
| Checagem de conhecimento | Quiz opt-in, não-bloqueante, feedback por opção | Plausível (mecânica existe; fluxo não exercitado em teste) | **Parcial** — código presente, comportamento não asserido |
| Modelo-mental-primeiro / contiguidade | SVG ao lado do parágrafo antes da sintaxe | Pesquisa (Mayer/Sweller) | **Especulativo** — zero asserção de adjacência SVG↔parágrafo |
| Divulgação progressiva | Aprofundamentos atrás de `<details>` | Pesquisa | **Especulativo** — 1 único `<details>` por página de ~1135 linhas |

## 3. Ganhos sólidos (verificados ou claramente apoiados)

- **Rastreio de progresso funciona e persiste**: marcar lido sobrevive ao reload (`done=3`), agrega tópico→módulo→trilha→curso cross-módulo (`3/14`), round-trip export/import sem perda (0→3). Verificado em Chromium real.
- **Camada de estudo ativo existe e renderiza**: grifo vira `<mark>` colorido (rgba), dúvida grava com cor reservada e `data-has-note`, painel "minha jornada" abre como `role=dialog` acessível agregando o curso inteiro. v1 não tinha nada disso.
- **Acessibilidade estrutural de alto valor**: trap de foco real com `inert` nos irmãos, ESC e devolução de foco; `aria-pressed`; skip link; override de `prefers-reduced-motion` pelo aluno. São atributos no DOM, não efeitos a serem medidos.
- **Personalização visual aplicada e persistida**: 5 temas com fundos comprovadamente distintos em runtime (sepia `#fbf0d9`, contraste `#0a0e14`), largura de prosa mudando de fato, tema "foco" escondendo cromo.
- **Arquitetura limpa e self-contained**: bundle `learn.js`/`learn.css` byte-idêntico entre skill e demo, zero `fetch`/backend/build, persistência robusta (modo efêmero, parse defensivo, anti-XSS por `textContent`, `QuotaExceeded` não-fatal). Decisão correta de derivar % no render (auto-corrige se o conteúdo mudar).

## 4. Ganhos prováveis mas NÃO medidos

**Não houve nenhum teste de retenção, conclusão ou A/B com alunos.** Os ganhos abaixo são apostas apoiadas em pesquisa cognitiva (Sweller, Mayer, efeito de teste, wayfinding), não resultados observados neste curso:

- "Chunking respeita a memória de trabalho" → mecanismo de carga cognitiva apoiado, não medido.
- "Títulos-tarefa viram mapa do que você vai conseguir fazer" → hipótese de signaling/wayfinding.
- "Ver progresso e poder retomar reduz abandono" → a própria pesquisa **descarta** os números de gamificação/streaks como marketing; o efeito aqui é não-medido.
- "Grifar/marcar dúvida muda de passivo para ativo e melhora retenção" → transferência de eficácia de produtos como Readwise **por analogia**, não comprovada neste conteúdo.
- "Diagrama-antes-da-sintaxe" e "divulgação progressiva reduz carga" → diretrizes editoriais; cobertura simbólica (1 `<details>` por página) e zero auditoria tópico-a-tópico.
- Comportamentos **codados mas não exercitados por teste**: scrollspy "Seção N de M", quiz não-bloqueante (submeter→feedback→âncora) e "continuar de onde parei" existem no código e são plausíveis, mas nenhuma suíte os roda — a própria verificação pede esses asserts.

## 5. Custos e riscos que a mudança introduziu

- **Peso**: ~135 KB por par (`learn.js` ~88 KB + `learn.css` ~47 KB). Em modo inline (padrão file://) isso é duplicado por página — um curso 6×6 = 36 páginas chega a ~4,9 MB de código repetido, só amortizado pela rota de assets compartilhados.
- **Drift de contrato JS↔CSS — não é teórico, já aconteceu**: o cluster A1–A6/M1–M4 teve lógica "verde" enquanto a apresentação quebrava em silêncio (grifo sem cor, drawer preso fora da tela, largura de linha quebrada). Passou no smoke porque o smoke só testava dados; só o `contract.cjs` (criado depois, com `getComputedStyle`) pegou. Sem essa disciplina nova, regressões visuais voltam a passar verde.
- **Manutenção e superfície de erro de markup**: cada página exige meta + ids + toggles + `data-inema-*` + manifesto corretos. Esquecer um atributo **degrada o recurso silenciosamente** (ex.: sem manifesto a agregação cross-módulo não fecha — foi inclusive uma correção feita durante a verificação).
- **localStorage-only**: estado preso ao dispositivo. Em modo privado/efêmero o aluno pode achar que salvou e perder tudo. Não há sync; export/import é `.json` **manual** que a maioria nunca executará. "Não perde entre dispositivos" é overclaim.
- **Dependência de manifesto + assets re-sincronizados byte-a-byte** entre skill e cada curso é um custo recorrente de autoria.
- **Complexidade que não ajuda quem só lê**: o leitor passivo carrega ~135 KB de JS/CSS que nunca usa (mitigado, mas não eliminado, pelo enhancement progressivo).
- **Conformidade a11y vira responsabilidade do autor**: contraste por tema é **calculado na pesquisa, não re-medido no DOM**; o portão depende do autor rodar o checklist, não de teste automático.

## 6. Para quem NÃO vale (e quando o v1 ainda é a escolha certa)

- **Conteúdo curto / página única / one-off**: o overhead de ~135 KB + markup obrigatório não se paga. O v1 self-contained simples é melhor.
- **Público que só lê linearmente**: se ninguém vai grifar, marcar dúvida ou acompanhar progresso, a camada interativa é peso morto.
- **Autor sem disciplina de QA visual**: sem rodar `contract.cjs` (estado CSS renderizado), o padrão de dois arquivos copia-e-cola reintroduz bugs invisíveis. Quem não vai manter essa suíte fica mais seguro no v1.
- **Cenários file:// com muitas páginas inline**: a duplicação de código fica cara; sem a rota de assets compartilhados, o v1 é mais enxuto.
- **Quando o objetivo é provar aprendizagem**: a v2 não mede retenção/conclusão. Se a decisão depende de evidência de eficácia didática, nenhuma das duas versões a oferece — então o custo extra da v2 não se justifica só por isso.

## 7. Recomendação final

**Adotar a v2 para cursos multi-módulo reais, via assets compartilhados (não inline), e tornar o `contract.cjs` parte obrigatória do pipeline.** O ganho de plataforma é genuíno e o reuso para o autor é sólido; a UI para o aluno é claramente superior ao v1. Mas comunicar os ganhos **com honra à evidência**: dizer "a estrutura agora segue boas práticas citadas e o tracking de progresso funciona e é acessível", **não** "os alunos aprendem/retêm mais" nem "não perdem o avanço entre dispositivos". Antes de reivindicar impacto didático, fechar três lacunas: (1) asserts de runtime para scrollspy, quiz e resume; (2) re-medição de contraste por tema no DOM; (3) algum sinal real de retenção/conclusão (mesmo que pequeno coorte). Para conteúdo curto, página única ou público puramente leitor, **manter o v1**.
