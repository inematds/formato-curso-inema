# RETENCAO-V5.md — Cadeia de retenção, dosagem e contrato do fecho

> **Dono único de:** cadeia promessa→entrega→microvitória→gancho, matriz de dosagem completa (espinha×pool), regras "quando NÃO usar" cada recurso, contrato do fecho + não-duplicação (o antigo §11 da spec), anti-gamificação, e o detalhe da prática multi-modo. O SKILL.md carrega só o teto e a divisão espinha×pool resumidos; este documento tem a matriz inteira e o racional.

---

## 1. A cadeia de retenção (por que o aluno volta)

**Promessa → entrega → microvitória nomeada → gancho.** Essa é a cadeia que substitui gamificação como motor de retenção da v5 (PP12, `CONTEUDO-40MAIS.md`):

1. **Promessa** (`.promise`, cold-open) — o que a aula entrega, dito de forma verificável.
2. **Entrega** — o núcleo + a prática cumprem exatamente o que a promessa disse; se a prática não realiza a promessa, uma das duas está escrita errada (regra dura, SKILL.md §prática multi-modo).
3. **Microvitória nomeada** (`.next-action`) — o aluno recebe, em palavras, o nome do que acabou de conquistar ("você acabou de conseguir X"), não um "progresso" silencioso.
4. **Gancho** — a mesma seção aponta a próxima dor que será resolvida, criando motivo concreto para abrir a próxima aula (não "continue aprendendo", mas "na próxima aula você resolve Y, que é exatamente o que trava quando Z acontece").

Essa cadeia inteira depende de a **entrega ser real** — é aqui que a retenção quebra estruturalmente quando a prática exige terminal/config para um público sem base técnica (achado Fase 4): sem entrega possível, não existe microvitória para nomear, e o gancho vira promessa vazia.

## 2. Anti-gamificação (o que a v5 nunca faz)

Zero pontos, badges, streaks, confete, mascote, barra de XP, "nível", ranking. A distinção que sustenta essa escolha (importante para um revisor futuro não confundir): **recall ativo com feedback ≠ gamificação.** Teste-se com feedback elaborado, flashcards com revisão espaçada e o painel de jornada **são** retenção legítima — eles fixam conhecimento e mostram progresso real, mas nunca em estética de jogo (nunca troféu, nunca confete, nunca "combo"). A v3 (versão anterior) rejeitou quiz/flashcard como gamificação por princípio; a v4 e a v5 os mantêm porque a operação cognitiva (recuperar da memória) é diferente da operação de um jogo (acumular pontos por repetição).

## 3. Matriz de dosagem completa

**Espinha estrutural** — obrigatória em 100% das aulas, sempre exatamente 1×, **fora de qualquer teto**:
- `.recap-autor` (síntese de fim de aula)
- `.practice` (a prática única da aula)
- `.next-action` (microação + gancho)
- exemplo-por-profissão em prosa (em cada step, não só 1× por aula)

Automáticos do motor (reflexão por seção, recap ativo, mapa da aula, grifo→cartão, SM-2-lite, jornada) **também** ficam fora de qualquer teto e nunca são desligados — são parte do contrato herdado da v4, não do teto de dosagem autoral.

**Pool dosado** — teto: obrigatórios do pool + opcionais escolhidos **≤ 5 por aula**:

| Recurso | FUNDAMENTO | FERRAMENTA | PRÁTICA/INTEGRAÇÃO |
|---|---|---|---|
| Teste-se (quiz `data-fb`) | ✅ obrigatório, 1–2 | ⚪ opcional, 0–1 | ⚪ opcional, 0–1 |
| Cartões autorais novos | ✅ obrigatório, 3–6 | ⚪ opcional, 2–4 | — (só revisão automática dos já existentes) |
| Erro comum `.qerr` | ⚪ opcional, 0–1 | ✅ obrigatório, 1–2 | ⚪ opcional, 0–1 |
| Antes/depois `.qbefore-after` | ✅ obrigatório, 1 | ⚪ opcional, 0–1 | ⚪ opcional, 0–1 |
| Frase-âncora `.qanchor` | ✅ obrigatório, 1 | ⚪ opcional, 0–1 | ⚪ opcional, 0–1 |
| Checklist `.qsteps` | — | ✅ obrigatório, 1 | ✅ obrigatório, 1 |
| `.qapply` (≥2 profissões) | ⚪ opcional, 0–1 | ⚪ opcional, 0–1 | ⚪ opcional, 0–1 |
| Mini-caso (técnica de prosa) | ⚪ opcional, 0–1 | ⚪ opcional, 0–1 | ✅ obrigatório, 1 (integrador) |

**Contagem por tipo de aula:** FUNDAMENTO = 4 obrigatórios + máx 1 opcional = teto 5. FERRAMENTA = 2 obrigatórios + máx 3 opcionais = teto 5. PRÁTICA/INTEGRAÇÃO = 2 obrigatórios + máx 3 opcionais = teto 5.

**Duas réguas independentes, ambas obrigatórias (achado F9):** esta matriz limita a **variedade** de mecanismos por aula (teto ≤5, quantos tipos diferentes). A regra de densidade visual (`V5-DESIGN.md` §5: ≤1 quadro funcional a cada 2 steps) limita a **concentração por posição** (onde na aula esses mecanismos caem). Uma aula pode respeitar o teto ≤5 e mesmo assim violar a densidade se os poucos tipos escolhidos se empilharem nos mesmos steps — as duas réguas são checadas **juntas**, nunca uma no lugar da outra.

**Teste-se em aula FUNDAMENTO é obrigatório, não opcional** — é item autônomo do checklist-portão (SKILL.md), não apenas uma célula desta tabela. Achado real (Fase 9, duas tentativas em pilotos diferentes): quando a obrigatoriedade fica "escondida" só dentro da matriz, o gerador esquece — por isso o manifesto de completude (`CHECKLIST-V5.md`) trata este item como linha própria, auditável separadamente.

## 4. Regras "quando NÃO usar" cada recurso (condições objetivas)

- **Quiz** cuja resposta já está na frase imediatamente anterior — não testa nada, só confirma leitura recente.
- **Cartão** que duplica um procedimento que a prática já exercitou de forma idêntica.
- **`.qerr`** inventado só para preencher a dosagem — se não houver um erro comum real e frequente, não force o quadro.
- **`.qbefore-after`** sem um saldo mensurável em 1 linha — sem o saldo, é só um antes/depois decorativo.
- **Uma 2ª `.qanchor`** na mesma aula — a frase-âncora perde força se repetida; máx. 1 por aula é regra dura, não sugestão.
- **`.qsteps`** em conteúdo puramente conceitual, sem nenhuma ação sequencial real a listar.
- **Mini-caso** com mais de 5 frases, ou usado em 2 lugares da mesma aula — mini-caso é uma técnica de prosa leve, não um estudo de caso longo.
- **`.qapply`** com menos de 2 profissões nomeadas dentro do bloco — com 1 só, vira prosa comum; nunca um quadro genérico "para qualquer profissão".

## 5. Prática multi-modo — detalhe e critério de pronto

| Modo | Para quem | Anatomia | Critério de pronto |
|---|---|---|---|
| **prompt** | qualquer profissional com acesso a uma IA de chat | bloco colável (`.pcode` + botão copiar já herdado do motor) + variáveis marcadas (`<isto você troca>`) + "o que você deve ver" como referência | "a resposta ficou parecida com isto? pronto." |
| **tarefa** | qualquer profissional, no próprio ambiente de trabalho | passos profissionais numerados, sem terminal e sem tela de configuração, + exemplo de resultado aceitável | "ficou pronto quando [condição observável, nomeada]." |
| **análise** | conteúdo onde fazer de verdade é impossível ou arriscado demais para a prática | mini-caso (3–5 frases, personagem com nome e função) + 2–3 perguntas + gabarito comentado dentro de um `<details>` | "comparou a própria resposta com o gabarito." |
| **código** | só cursos técnicos — herança direta do `.practice` da v4, sem alteração | ver `formato-curso-v4/SKILL.md` | igual ao v4 |

**Regras duras:** exatamente 1 prática por aula (nunca 2, mesmo em aulas mais longas) · 5–15 minutos sempre declarados no `.pgoal` · o modo é escolhido pelo protocolo de descoberta, nunca por padrão do autor — público sem base técnica **nunca** recebe modo `codigo` · toda prática precisa realizar a `.promise` da abertura da mesma aula (se terminada a prática o aluno não conseguiu o que a promessa dizia, uma das duas está errada — corrija a que estiver desalinhada, nunca ignore a discrepância) · o modo `análise` só se justifica onde fazer de verdade é impossível/perigoso — usá-lo como atalho para fugir de uma prática real é falha de portão (mesma classe de erro que gerar prática decorativa).

## 6. Contrato do fecho — ordem fixa e não-duplicação (o antigo §11, portão duro)

**Ordem fixa no DOM do Movimento 4:** `.recap-autor` → `.next-action` → `<script id="cards-N">` → só então as injeções do motor (recap ativo/mapa/reflexão, sempre por último).

### 6.1 Papéis cognitivos distintos e não-intercambiáveis

| Artefato | Operação cognitiva | O que faz | O que NUNCA faz |
|---|---|---|---|
| `.recap-autor` | **síntese / compreensão** | resume a aula em linguagem humana ("o que isso significa"), conectando as ideias | não testa, não pergunta, não vira flashcard |
| `cards-N` | **recuperação ativa (retrieval)** | força o aluno a *produzir* a resposta de memória ou aplicá-la a um cenário novo | **nunca resume, nunca reafirma o recap** |
| botão `.recap` do motor | **ação** | dispara a revisão dos `cards-N` já criados (mecanismo automático) | não é conteúdo do autor — é botão, não texto |

### 6.2 Contrato de geração dos cartões (`cards-N`)

**Todo cartão DEVE tomar uma destas 5 formas, nenhuma outra:**
1. **Pergunta** — pede um fato/definição de volta ("O que a IA faz quando você não dá contexto?"); resposta no verso.
2. **Decisão** — dá um contexto e exige uma escolha ("Cliente novo manda mensagem às 22h: saudação ou ausência?").
3. **Contraste** — força distinguir dois casos próximos ("Qual a diferença entre mensagem de saudação e de ausência?").
4. **Diagnóstico** — apresenta um sintoma/erro e pede a causa ("A legenda saiu genérica demais — o que faltou no pedido?").
5. **Aplicação** — dá um cenário do trabalho do aluno e pede o que ele faria ("Você tem 3 imóveis novos para anunciar: como reusa o modelo de prompt?").

**Proibições duras (cada uma reprova a aula em Fixação):**
- Cartão que **repete uma frase** do `.recap-autor` (sobreposição de ≥6 palavras consecutivas).
- Cartão que é **paráfrase superficial** do resumo (mesma frase com sinônimos; mesma operação de só "reconhecer que é verdade").
- Cartão cuja **frente é uma afirmação** em vez de pergunta/tarefa — afirmação é restatement, não retrieval.
- **Regra da operação diferente:** se a mesma ideia aparece no recap E num cartão, o cartão obrigatoriamente muda a operação cognitiva. O recap *afirma* a ideia ("a IA erra com confiança"); o cartão *exige recuperar ou aplicar* essa ideia ("Você recebeu um número da IA num relatório — antes de enviar, o que você faz e por quê?"). Mesma ideia + operação diferente: permitido e desejável. Mesma ideia + mesma operação: proibido.

**Achado real, importante para calibrar o rigor (Fase 9-T2/T3):** mesmo passando a letra dos 3 testes abaixo, auditores encontraram cartões em "zona de fronteira" — recall barato de uma lista recém-enumerada no recap, ou eco quase-verbatim da prosa de um step (não do recap). Isso não viola a letra do portão, mas é o sinal de qualidade mais fino a vigiar: um cartão-pergunta que apenas pede de volta a mesma lista que o recap acabou de enumerar é tecnicamente "pergunta", mas pedagogicamente barato. Prefira cartões que exijam aplicar a ideia a um cenário novo (Decisão/Diagnóstico/Aplicação) sempre que possível, especialmente quando o recap já usou uma enumeração explícita.

### 6.3 Teste objetivo anti-duplicação (portão duro)

Para cada aula, com o `.recap-autor` e os `cards-N` lado a lado, os 3 testes:
1. **Substring:** nenhuma sequência de ≥6 palavras consecutivas de um cartão aparece no recap (grep automatizável — template em `CHECKLIST-V5.md`).
2. **Forma:** 100% dos cartões têm a frente em forma de pergunta/decisão/contraste/diagnóstico/aplicação — zero cartões-afirmação.
3. **Operação:** para cada ideia presente nos dois, a operação cognitiva do cartão difere da do recap (síntese vs. recuperação/aplicação).

**Qualquer falha nos 3 testes ⇒ a aula REPROVA na dimensão Fixação, independentemente de todos os outros critérios passarem.** Não é ajuste opcional; é portão duro — a falha que motivou a correção mais importante do War Game (Fase 10) veio justamente daqui: os 3 testes existiam como regra de *revisão* ("se notar duplicação, corte") e nenhum gerador notou. A regra vale como contrato de *geração*: o cartão nasce correto, não é corrigido depois de escrito errado.

## 7. Mapa mental de fim de trilha

Não é componente de aula — a visão-do-todo vive dentro do painel D-09 (`V5-DESIGN.md` §6), nunca como elemento solto no corpo ou na barra global.
