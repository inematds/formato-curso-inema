# Padrão de guia v2 (Nei, 27/11/2026: "gostei, agora documente o padrão da mudança"; "vale a partir de agora")

Vale para todo guia novo e para todo guia que for mexido a partir de 27/11/2026. Quando conflitar com regra
mais antiga do SKILL.md (ordem de 17/11, "O ganho", "No seu dia", nav antiga), **vale este arquivo**.

**Referência viva:** `inematds/espera-sem-voce` → `guia/index.html` (PT), `guia/en/`, `guia/es/`.
O `assets/template.html` está desatualizado: até ser refeito, **parta da referência** e troque o conteúdo.

## Por que mudou

O guia antigo contava a mesma história 4–5 vezes ("em uma frase", "o ganho", "no seu dia", "um dia por
horário"), tinha título de 20+ palavras com o nome no meio e a ação lá embaixo (~4.000 palavras). Duas análises
independentes (Fable e Astra) e três rodadas com o Nei chegaram a este formato (~2.500 palavras).
Comparação antes × depois: `~/projetos/output/explica-tYBXBUG0g0g/analise/espera/comparar/`.

## O teste dos 5 segundos (topo)

Lendo só o topo, a pessoa sabe: o que é, se é para ela, o que ganha, o que faz agora.

## Ordem da página

1. **Topo (hero), grade 2×2:**
   - esquerda em cima: **nome forte** (ex.: `VIGIA` grande na cor do banner + nome do kit menor ao lado),
     **título de 3 batidas** (frases curtas de quem faz o quê; a última em amarelo — ex.: "Você sai da tela. A IA
     termina. O aviso chega."), e o **resumo** (≤ 60 palavras: a dor, o que você faz, o que ele faz, o resultado);
   - direita em cima: **`banner.jpg`** (a imagem padrão com o nome), com o **topo alinhado ao topo do nome** (CSS `.hero .f2{align-self:start}`, nunca `center`; Nei, 27/11/2026, apps-do-claude: "a imagem da direita ao lado tem alinhar no topo");
   - **título de 3 batidas = frases completas** que se entendem sozinhas (sujeito + o quê + sobre o quê). Reprovado: "O Claude virou app. Você não precisa de trinta. O filtro deixa os que trabalham por você." (Nei: "o q quer dizer"). Aprovado no lugar: "As páginas que o Claude faz agora viram app no seu computador. Criar app para tudo vira bagunça. O filtro do app mostra quais valem a pena criar."
   - **…e curtas: cada batida em UMA linha no computador (≤ ~30 caracteres, 3–6 palavras), o título inteiro em 3 linhas ao lado do banner** (Nei, 27/11/2026, triagem-do-claude: "olha como ficou feio a manchete… não podemos ter assim"). Reprovado: "A Anthropic lançou doze novidades no Claude em duas semanas. Quem tenta testar tudo acaba não testando nada. A triagem das novidades mostra as três que valem para a sua semana." (8 linhas, buraco embaixo do banner). Aprovado: "Doze novidades no Claude. Você não precisa de todas. A triagem acha as suas três." Completa (dá para entender sozinha) E curta; o fato longo e a dor vão para o resumo logo abaixo. Vale também para EN/ES.
   - **Conferir pelo print**, não só a rolagem: `chromium --headless --window-size=1366,900 --screenshot=<pasta em ~>/h.png file://…/guia/index.html` (o chromium snap não grava em /tmp) e olhar se o título tem 3 linhas e não deixa buraco ao lado do banner.
   - esquerda embaixo: botão principal = **a ação** ("Copiar o pedido e começar" → `#comecar`) + secundário
     ("Ver os vídeos"), e 3 fatos curtos com ✓ (grátis/sem programar; o que precisa; um número medido);
   - direita embaixo: **`hero.jpg`** (foto sem texto), com o topo alinhado aos botões.
   - celular: título → resumo → botões → fatos → banner → foto (o texto vem antes das imagens).
2. **EM UMA FRASE** (`#resumo`): ~60 palavras que explicam o projeto — o desejo em negrito, o que o kit traz,
   as partes que o definem numa lista curta (uma linha cada), a condição de uso ("o computador fica ligado;
   quem sai é você").
3. **PARA QUEM** (`#quem`): "É para você se…" — 3 cartões com foto (regra das imagens de perfil), 2–3 linhas
   cada e "Usa: <qual parte>".
4. **COMO FUNCIONA** (`#passos`): abre com `banner-grade.jpg` largo + uma **linha divisória com respiro**; os
   passos **um abaixo do outro**, todos com a mesma forma (número, título, quem faz — etiquetas Você / A IA /
   O programa —, "Por quê"). Sem animação aqui se a mesma animação aparece na seção seguinte.
5. **AS PARTES / OS N JEITOS** (`#jeitos`): **cada parte numa faixa própria, animação à esquerda e texto à
   direita** (número, nome, "para quê" em negrito, explicação, analogia "Como no dia a dia", prazos em chips,
   de onde vem). Espaço e linha entre as faixas. **Tabela de comparação no fim**, com pista de arrastar no
   celular. Cada animação aparece **uma vez só** na página.
6. **QUESTÕES IMPORTANTES** (`#importantes`): as dúvidas que travam a decisão, **numeradas** (1, 2…) dentro de
   uma seção só, cada uma com imagem, os blocos de resposta e a analogia (ex.: "E se o trabalho nunca voltar?",
   "Como a IA nova sabe o que já foi feito?").
7. **ANTES DE INSTALAR** (`#precisa`): "Você precisa de" × "O kit não promete".
8. **NA PRÁTICA** (`#comecar`): 3 passos curtos + o **pedido para copiar** (botão Copiar) + 3 cartões:
   "Quer só entender, sem instalar?", "Onde baixar?", "É técnico?" (→ README).
9. **VÍDEOS** (`#video`): capas dos vídeos com play (abrem o YouTube).
10. **MEDIDO** (`#prova`): números grandes com a fonte e a data; nada sem medição.
11. **PERGUNTAS** (`#perguntas`): FAQ em `<details>`.
12. **Fecho:** pergunta de verdade + "grátis no inema.club, direto na internet" + botão para o pedido.

## Regras de forma

- **Cada seção abre com um rótulo grande** (Sora 800, caixa alta, amarelo, traço embaixo): EM UMA FRASE,
  PARA QUEM, COMO FUNCIONA, OS 3 JEITOS, QUESTÕES IMPORTANTES, ANTES DE INSTALAR, NA PRÁTICA, VÍDEOS, MEDIDO,
  PERGUNTAS — e o `h2` com a frase logo abaixo. Dividir bem as partes.
- **Imagens padrão do projeto nunca saem:** `banner.jpg` e `hero.jpg` no topo, `banner-grade.jpg` em Como
  funciona, fotos dos perfis, imagens das questões.
- **As partes que definem o projeto nunca saem** (ex.: os 3 jeitos); o topo vende uma, o meio explica todas.
- **Animação/fluxo:** os diagramas animados do projeto (um loop rAF, pausa fora da tela, botão Pausar/Repetir,
  `prefers-reduced-motion` = estado final parado). Fluxo em diagrama é bem-vindo onde ilustra melhor que texto
  (a evoluir para modelos que ajudem a compreender).
- **Cada coisa dita uma vez.** Saem: "O ganho" com antes/depois, "Como isso muda o seu dia", dia por horário,
  "Três sistemas que rodam todo dia" (a origem vai dentro de cada parte), números sem fonte.
- **Menu do topo:** só as seções de decisão (ex.: 3 jeitos · Questões · Na prática · Vídeos · Medido) + idiomas.
- **Jargão:** termo técnico só com a explicação ao lado (ex.: "o número do pedido com 'continue de onde
  parou' (o comando /job)").
- **Tamanho-alvo:** ~2.000–2.600 palavras com tudo; o topo cabe em uma tela.
- 3 idiomas como sempre (en/es com `banner-en/-es`, `banner-grade-en/-es`, `../assets/`).

## Revisão

Revisor independente (runbook `revisor-independente.md`) com persona leiga e a lista fixa: teste da chamada,
ação principal no topo, números × fonte, repetição/jargão, celular, links/botões, fecho, português.
Nota do revisor e do Nei em `revisor-nota.py`.
