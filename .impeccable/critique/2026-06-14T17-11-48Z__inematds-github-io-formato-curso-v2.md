---
target: "https://inematds.github.io/formato-curso-v2/ (curso-demo)"
total_score: 28
p0_count: 0
p1_count: 2
timestamp: 2026-06-14T17-11-48Z
slug: inematds-github-io-formato-curso-v2
---
## Design Health Score — formato-curso-v2 (curso-demo)

| # | Heurística | Score | Issue-chave |
|---|-----------|-------|-------------|
| 1 | Visibilidade do status | 3 | Progresso em 3 granularidades + "N de M" + jornada são fortes; mas o controle "marcar lido" (que move tudo isso) não é visível no cabeçalho da seção |
| 2 | Match com o mundo real | 3 | PT-BR natural (trilha/módulo/minha jornada/tenho dúvida); "trilha" é jargão INEMA mas fica claro |
| 3 | Controle e liberdade | 3 | ESC fecha painéis, tema reversível, reset com confirmação; "Excluir" nota é imediato sem undo |
| 4 | Consistência e padrões | 3 | Sistema coeso após reconciliação JS↔CSS; componentes previsíveis |
| 5 | Prevenção de erro | 3 | Import valida, merge não-destrutivo, reset confirma, modo efêmero; delete de nota sem rede |
| 6 | Reconhecimento vs memória | 3 | TOC + scrollspy + "Seção N de M" ótimos; ações de aparência/jornada atrás de popover |
| 7 | Flexibilidade e eficiência | 2 | Sem atalhos de teclado, sem busca no curso; power-user não tem acelerador |
| 8 | Estético e minimalista | 3 | Dark premium limpo; mas linha de 3 medidores quase idênticos + 4 chips de stat repetem padrão |
| 9 | Recuperação de erro | 3 | Toasts para cota/efêmero/import; mensagens claras |
| 10 | Ajuda e documentação | 2 | Zero onboarding: nada ensina que dá pra grifar selecionando, nem que "marcar lido" alimenta o progresso |
| **Total** | | **28/40** | **Bom — base sólida, corrigir os pontos fracos** |

## Anti-Patterns — parece feito por IA?

**Avaliação LLM:** Não grita "IA fez isto" — o dark premium âmbar/ciano tem identidade e a hierarquia é real. Mas há **3 tells** que puxam pro genérico: (1) **Inter em tudo**, sem par display/corpo; (2) a **fileira de 4 chips de stat** ("7 Tópicos / 35 Minutos / Básico / Teoria") é o padrão "métrica de herói" de SaaS; (3) **3 barras de progresso quase idênticas** lado a lado no topo de todo módulo. Nenhum é fatal, mas juntos tiram o ar de "feito sob medida".

**Scan determinístico (detector):** 23 achados, todos *warning* — `overused-font`/`single-font` (Inter, 12×), `gray-on-color` (9× — `text-neutral-400` sobre chips emerald/blue/purple), `pure-black-white` (2× — o tema **claro usa #ffffff puro**, que o detector e a própria lei INEMA desaconselham; tingir levemente). 0 erros bloqueantes.

**Overlay visual:** não injetado — alvo é URL remota (Pages, HTTPS); rodei o detector determinístico na fonte (`demo/*.html`) como fallback. Medições reais via Playwright na URL live.

## Impressão geral

A **engenharia de aprendizado é o ponto forte** (progresso agregado real, jornada, grifo/dúvida/nota, temas) e a tipografia de leitura está bem calibrada (coluna 680px≈68ch, entrelinha 1.7, contraste corpo **14.2:1**). O **calcanhar é a descoberta**: a camada que dá valor ao produto fica escondida — quem chega não sabe que existe. A maior oportunidade isolada: **um onboarding leve + tornar "marcar lido" óbvio**.

## O que está funcionando

- **Progresso honesto e agregado** (tópico→módulo→trilha→curso, "N de M"+%, persiste, jornada consolidada). Raro em curso estático.
- **Tipografia de leitura** de verdade: medida ~68ch, leading 1.7, contraste AAA, escala 1.5× entre níveis.
- **Acessibilidade acima da média**: skip link, foco preso, `prefers-reduced-motion` + override do aluno, contraste por tema.

## Priority Issues

- **[P1] A camada de aprendizado é invisível na chegada.** Nada sinaliza que dá pra grifar (selecionar texto), nem que "marcar lido" move as barras. O valor do produto fica oculto.
  - *Por que importa:* o aluno lê passivo e nunca ativa highlight/dúvida/jornada — exatamente o diferencial. Heurística 10 (ajuda) e 1 (status).
  - *Fix:* primeiro acesso com um coach-mark de 1 passo ("selecione um trecho para grifar / marque a seção como lida"), dica inline na 1ª seção, e botão "marcar lido" persistente no cabeçalho da seção (ao lado de "Tenho dúvida"). Referência: **web.dev/learn** (estado de lição claro) e **executeprogram.com** (afordância de interação imediata).
  - *Comando sugerido:* `/impeccable onboard`
- **[P1] Rolagem horizontal no mobile.** A nav densa (logo + INEMA.CLUB + trilhas + jornada + aparência ≈ 39 alvos) vaza pra largura do documento (664px num viewport de 390px).
  - *Por que importa:* rolagem horizontal é "smell" de mobile quebrado; o conteúdo treme lateralmente.
  - *Fix:* conter o overflow na própria nav (`overflow-x:auto` no trilho interno + `max-inline-size:100%`), ou colapsar trilhas num menu no mobile. Referência: barra de docs do **stripe.com/docs** (nav que vira menu no mobile).
  - *Comando sugerido:* `/impeccable adapt`
- **[P2] "Marcar lido" auto-reportado e pouco discreto = progresso frágil.** O único sinal de progresso é o clique manual; sem ele as 3 barras ficam em 0% mesmo lendo tudo.
  - *Por que importa:* progresso que não reflete leitura desmotiva (heurística 1).
  - *Fix:* tornar o toggle óbvio e, opcionalmente, marcar "lido" ao rolar até o fim da seção (assistência, nunca substituindo o explícito). Referência: **joshwcomeau.com** (sensação de avanço sem fricção).
  - *Comando sugerido:* `/impeccable shape`
- **[P2] Tipografia genérica (Inter em tudo).** Sem par display/corpo; é o tell de IA nº 1.
  - *Fix:* par com personalidade — ex.: títulos num display com caráter (serifa quente tipo **Newsreader/Fraunces** com parcimônia, ou um grotesk distinto) + corpo humanista legível. Referência: **joshwcomeau.com** e **Just JavaScript** (justjavascript.com) — type com identidade.
  - *Comando sugerido:* `/impeccable typeset`
- **[P2] Topo do módulo repete padrão SaaS.** 4 chips de stat + 3 barras quase iguais empilham "métrica de herói" + grade idêntica.
  - *Fix:* fundir as 3 barras num único medidor segmentado (módulo dentro de trilha dentro de curso) e enxugar os chips para 1–2 que importam (tempo restante, % do módulo). Referência: indicador de progresso de lição da **web.dev/learn**.
  - *Comando sugerido:* `/impeccable distill`

## Persona Red Flags

**Aluno iniciante (primeira vez):** abre o módulo, vê texto bonito — e não recebe nenhum sinal de que pode grifar selecionando, marcar dúvida, ou que "marcar lido" alimenta o progresso. Lê passivo, sai sem tocar na camada que é o produto. Abandono do diferencial no minuto 1.

**Aluno no celular:** rolagem horizontal pela nav que vaza; precisa beliscar/arrastar. Leitura em si ok, mas a primeira impressão é "quebrado".

**Leitor com baixa visão / teclado:** muito bem servido (contraste 14:1, foco visível, reduced-motion, skip link). Ressalva: criar grifo exige seleção com mouse; usuário de teclado não consegue grifar facilmente (P2).

## Observações menores

- Tema **claro usa #ffffff puro** e **sépia/claro** ficam parecidos à primeira vista — tingir o branco e reforçar o calor do sépia.
- `gray-on-color`: o `text-neutral-400` sobre chips coloridos lava o texto; usar tom mais escuro da própria cor ou near-white.
- "Continuar de onde parei" é ótimo mas compete por atenção com 2 CTAs no topo da landing; hierarquizar.
- Sem busca dentro do curso (a pesquisa apontou como alto valor).
- Notas/grifos só em `localStorage` deste device; export é manual. Para curso real, o risco de perder anotações é alto (mitigado, não resolvido — sync é v2).

## Perguntas que destravam

- E se a **primeira seção** já viesse com um grifo-exemplo e um "marque como lido" pulsando — ensinar fazendo, não com tour?
- As **3 barras** no topo de todo módulo ajudam ou viram ruído? Um medidor só, segmentado, não diria o mesmo com menos peso?
- O progresso deveria depender 100% de clique, ou "ler até o fim" poderia contar como assistência?
- A identidade ganharia mais com **uma fonte de personalidade** nos títulos do que com mais um efeito?
