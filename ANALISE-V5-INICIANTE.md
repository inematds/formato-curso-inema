# Análise v5 (e v2): da nota 6 para a nota 9 para iniciantes 30+

> 24/09/2026. Foram lidas as skills `formato-curso-v5` e `formato-curso-v2` (SKILL.md, references e assets).
> Medi **36 cursos v5** publicados em `~/projetos` e **98 cursos v2 distintos** (1.009 módulos, sem contar as pastas duplicadas).
> Capturei telas do curso `ia-do-zero-curso`, o curso v5 mais "iniciante", em desktop e celular.
> Nada foi alterado nas skills: este documento é **análise + plano**.

---

## 1. Resumo

O v5 **escreve bem e mostra mal**. O texto das aulas é humano, concreto e cheio de gente de verdade ("Beatriz, dona de uma clínica de fisioterapia…").
O que segura a nota em 6 é o resto:

1. **O visual simboliza em vez de mostrar.** Os 36 cursos têm zero imagens no corpo da aula, e a regra D-01 proíbe.
   Todo apoio visual é SVG abstrato: tracinhos cinza representando "texto", zigue-zague representando "caminho".
   O iniciante tem de decodificar a figura lendo uma legenda de 11,5px em fonte mono.
2. **A primeira tela pesa demais.** Antes de ler uma linha, o aluno recebe:
   - um modal com 6 recursos para aprender (grifar, revisar, jornada…);
   - 8 botões na barra, que ocupam 3 linhas no celular;
   - um contador **"revisar 9+"**, que já aparece no primeiro acesso por causa de um bug (ver §3.4).
3. **A skill foi feita para auditor, não para aluno.** São 13 itens de manifesto, greps e siglas internas (DV-1, AD-7, PP12, D-09, "Fase 9-T3").
   Tudo mede **conformidade**. Nada mede se um iniciante **entende de relance**.
   O teste de persona existe, mas é um parágrafo, não um portão.

A distância até o 9 é principalmente **visual + leveza + teste com gente**. Não é reescrever o método: a espinha pedagógica do v5 (promessa → prática → microvitória → gancho) é boa e fica.

---

## 2. Placar atual → meta

| Dimensão | Hoje | Evidência | Meta | O que muda a nota |
|---|---|---|---|---|
| Conteúdo e voz | **7,5** | Exemplos com nome, profissão e número; promessa verificável; prática sem terminal. Frases com média de 13,7 palavras, 9% acima de 25. | 9 | Aula mais curta, "Em 1 minuto" no topo, 1 ideia = 1 tela no celular |
| Visual para iniciante | **4** | 0 imagem em 36 cursos. Figuras abstratas que dependem da legenda. Legenda do trilho em 11,5px mono (6,1:1: passa AA, mas não o AAA que a skill declara). Textos em `--faint` (`figcaption`, rótulos, dicas) com **3,5:1 no escuro e 2,8:1 no papel**: reprovam AA | 9 | "Mostre, não simbolize": tela real simulada, antes/depois real, cena ilustrada, passo a passo anotado |
| Carga da primeira tela | **4,5** | Modal com 6 recursos + 8 botões + "revisar 9+" antes da 1ª linha; no celular, 3 linhas de botões fixas no topo | 9 | 3 controles visíveis, recursos revelados aos poucos, nada pendente no 1º acesso |
| Interface e leitura | **6** | Corpo legível (serifa, 60ch), mas rótulos-chave em mono caixa-alta espaçada ("PROMESSA", "REFLITA — …", "ROLE PARA ESTUDAR") | 9 | Rótulos em sans ≥14px, contraste ≥4,5:1 em todo texto, mono só para prompt/código |
| Tom humano | **7** | Prosa acolhedora, `.psafe` e regra de clímax. Mas o "Resumo", os cartões, o "Reflita" e o "marcar como lido" repetem por seção um ritual de escola | 9 | Menos ritual, momentos de empatia ("se travou aqui, é normal"), autor presente |
| Processo da skill | **5,5** | SKILL.md cheio de siglas; depende de ler o v4; greps manuais; nenhuma métrica de leveza ou visual; nenhum teste com pessoas | 9 | Script de auditoria automática + rubrica de 10 pontos + pré-teste com leitor simulado e humano |
| **Média** | **≈ 5,8** | | **≥ 9** | |

---

## 3. Diagnóstico do v5 (detalhado)

### 3.1 O que está forte (não mexer)

- **Cadeia promessa → entrega → microvitória → gancho.** É a melhor ideia do v5 e explica "por que voltar" sem gamificação.
- **Prática sem terminal**, com modos prompt, tarefa ou análise, e `.psafe` ("nada aqui quebra nada").
- **Exemplo por profissão em todo step.** Deixa o texto humano de verdade.
- **Anti-gamificação** (sem troféu, confete ou badge) e **regra de clímax** (sem emoji e sem "!!" nos fechos).
- **Tempo declarado** em toda aula ("16 min").
- **Assets copiados por curso.** Cada curso tem o próprio `assets/curso.js` e `aula.css`, então mudar o template **não quebra** os 36 cursos existentes.

### 3.2 Visual: o maior problema

- A regra **D-01 "zero-raster"** (V5-DESIGN §9) proíbe imagem no corpo da aula e só permite raster no hero da landing.
- A mesma seção **proíbe FLUX por licença non-commercial**. Isso contradiz o CLAUDE.md: o conteúdo INEMA é aberto e gratuito e o `flux2-klein` é o padrão. A v2 já corrigiu isso, a v5 não.
- O resultado foram **36 de 36 cursos sem nenhuma imagem**.
- Os dois registros visuais (metáfora no hero, diagrama no trilho) são bons em teoria. Na prática, o diagrama vira **abstração geométrica**: caixas, tracinhos no lugar de texto, pontos e setas.
  Na aula 1 do IA do Zero, a figura "sem 'quem sou' × com 'quem sou'" mostra caixas com riscos cinza. A figura **deveria mostrar o pedido real e a resposta real**, lado a lado. O conteúdo existe no texto, e o visual joga fora.
- O **`.termdemo`** (demo de terminal com `$ comando`) é o "terceiro registro" numa skill cuja lei é **sem terminal**. Ele aparece em 3 cursos (ssh-basico, agentes-harness, agentes-office).
  O mecanismo (clicar para revelar, alternar certo/erro) é ótimo, mas está no lugar errado.
- No desktop, a figura vive no trilho da direita, longe do parágrafo. Para quem aprende pelo olho, a imagem precisa estar **colada no texto que explica**, como já acontece no celular.
- A legenda do trilho (`.railcap`) usa 11,5px em mono (cor `--muted`, 6,1:1). É a parte que explica a figura, e está entre as menos legíveis da página.
- Já `.colfig figcaption`, `.block .lbl`, `.cedit label` e `.revhint` (10,5–11px) usam `--faint`, com 3,5:1 no escuro e 2,8:1 no papel: **reprovam AA**. Os valores foram conferidos também na cópia local do `ia-do-zero-curso`.

### 3.3 Leveza e carga cognitiva

- A prosa tem mediana de ~800 palavras por aula. O IA do Zero, o curso mais iniciante, é **um dos mais pesados: 1.236 palavras de prosa por aula**, fora quiz, cartões e prática.
- **Rituais por seção:** "marcar como lido" + "Reflita — explique com suas palavras" + figura + indicador de steps em **todo** step. Para iniciante, isso vira dever de casa a cada 3 parágrafos.
- **Pool de fixação de até 5 mecanismos por aula**, mais a espinha, mais os automáticos do motor (reflexão, recap ativo, mapa, grifo→cartão, SM-2). É muita coisa para quem está aprendendo **a matéria** e, ao mesmo tempo, **a ferramenta do curso**.
- O **onboarding** ensina 6 recursos antes do conteúdo. O iniciante não sabe o que é "grifar e virar cartão de revisão", e não precisa saber na aula 1.

### 3.4 Interface (evidências das telas)

- A **barra tem 8 botões**: trilha, lido, revisar, exercícios, jornada, ?, Aa, tema. No celular, ocupa **3 linhas fixas** e come ~15% da tela o tempo todo.
- **Bug "revisar 9+":** `allDue()` conta todos os cartões de todas as aulas como vencidos no 1º acesso. O aluno abre o curso e já tem "9+ pendências". Isso contraria o próprio V5-DESIGN §6 ("tom acolhedor, nunca urgência").
- **Tema escuro como padrão.** Funciona como marca, mas para leitura longa de iniciante o "papel" costuma render mais. Essa decisão é sua (§7).
- Os **rótulos mono em caixa alta** (Space Mono espaçado) passam uma estética "técnica/terminal". Para um leigo, isso comunica "isto é coisa de programador".

### 3.5 Olhar humano

- A persona da skill é "a gestora de 52 anos" e o público declarado é 40+. **O público agora é 30+ iniciante**: a persona e a landing ("40+") precisam mudar.
  A legibilidade deve ser justificada por "iniciante no celular, com pressa", não por idade.
- **Não existe nenhum teste com pessoa real** no processo. Todo o portão é grep e autoavaliação do próprio gerador.
- **Falta o "companheiro":** momentos de "se travou aqui, é normal", "isso aqui confunde todo mundo na primeira vez", "pode pular isto se…". O `.psafe` faz isso só na prática; precisa aparecer também nos pontos difíceis do núcleo.

### 3.6 A skill em si

- O SKILL.md exige ler `CONTEUDO-40MAIS` + `V5-DESIGN` + o **V4-DESIGN de outra skill**. Tem siglas sem legenda (DV-1..5, AD-7/8, PP1..16, D-01/02/08/09, "Fase 9-T3").
  O agente gasta atenção em conformidade e sobra menos para "isto está claro?".
- As réguas (teto de dosagem, densidade, ≥60% prosa) medem **quantidade de componentes**, e nenhuma mede **clareza**.
- A auditoria é feita por **grep manual**. Falta um script que dê a nota sozinho.

---

## 4. A rubrica do 9/10 (o que toda aula precisa passar)

Esta rubrica vira o portão novo. Cada item vale 1 ponto, e **aula abaixo de 9 volta para ajuste**.

| # | Critério | Como medir | Meta |
|---|---|---|---|
| 1 | **Teste dos 5 segundos**: tapando a prosa, só visual + rótulo passam a ideia de cada step | leitor simulado (subagente "leigo 30+") + humano no piloto | 100% dos steps |
| 2 | **Mostrar, não simbolizar**: cada aula tem ≥1 visual "real" (tela simulada, antes/depois real, cena ou passo a passo anotado) | script: contagem de `.tela`/`.cena`/`.passo-a-passo` | ≥2 por aula |
| 3 | **Primeira vitória rápida**: minutos até o aluno fazer algo que funciona | leitura cronometrada | ≤8 min na aula 1 |
| 4 | **Primeira tela leve**: controles visíveis antes do conteúdo | script (conta botões visíveis no 1º paint, celular 390px) | ≤3, sem modal na 1ª visita |
| 5 | **Aula enxuta**: palavras de prosa por aula | script (só `<p>` dos steps, `.why` e `.promise`) | ≤900 (aula 1: ≤700) |
| 6 | **Sem frase-monstro**: a média já está boa (13,7), o problema é a cauda | script | ≤5% das frases acima de 22 palavras e nenhuma acima de 30 (hoje: 17% acima de 20 e 9% acima de 25) |
| 7 | **Legível**: todo texto ≥14px, contraste ≥4,5:1 nos 3 temas, mono só em prompt/código | script de contraste sobre os tokens + checagem de font-size | 0 violações |
| 8 | **Zero jargão sem ponte** (lista-sentinela + inglês desnecessário, sem contar "prompt") | script | 0 |
| 9 | **Momento humano**: ≥1 "se travou, é normal" ou equivalente no ponto mais difícil + `.psafe` na prática | script + leitura | ≥1 por aula |
| 10 | **Espinha v5 intacta**: promessa, tempo, prática, microvitória e gancho | manifesto atual (enxugado) | 100% |

**Validação humana (o "olhar humano" literal):** no piloto, 2–3 pessoas reais iniciantes de 30+ fazem a aula 1 pensando em voz alta, por 15 minutos, no celular delas.
Anota-se onde travaram, o que pularam e se chegaram à microvitória. **Só depois disso o template muda para todos.**

---

## 5. Plano de implementação (por arquivo)

### Fase 0: correções rápidas (1 sessão, sem decisão de marca)

| Arquivo | Mudança |
|---|---|
| `assets/curso.js` | **Bug "revisar 9+":** cartões de autor só entram na fila quando a aula dele é concluída (ou lida ≥50%). Isso exige **levantar a proibição do SKILL.md** "não tocar estado/SM-2" só para a semeadura; o algoritmo SM-2 continua igual. |
| `assets/curso.js` | Onboarding: o modal de 6 itens vira **1 faixa discreta** ("Dica: toque em **Aa** para aumentar a letra"). Os outros recursos são apresentados **quando aparecem** (o 1º grifo, o 1º cartão, o fim da aula 1). |
| `assets/aula.css` | `.railcap` passa a **sans 15px** (já usa `--muted`). `figcaption` e os demais textos em `--faint` passam para `--muted` e ≥14px. `--faint` fica proibido para texto; só vale para linha ou borda. Rótulos (`.kicker`, `.pk`, `.qk`, `.cue`, "PROMESSA") passam a sans 13–14px com espaçamento leve. |
| `SKILL.md` + `V5-DESIGN.md` §9 + `EXEMPLOS-PROFISSOES.md` | Remover a proibição de FLUX por licença (conteúdo aberto e gratuito, `flux2-klein` padrão). |
| `SKILL.md` | Mover o `.termdemo` de terminal para a v4 (cursos técnicos). Na v5, o slot é reaproveitado (Fase 1). |
| `SKILL.md`, `CONTEUDO-40MAIS.md`, landing | Público de **40+ para "iniciante 30+"**; persona rotativa (ex.: "o dono de oficina de 34", "a professora de 47", "a gerente de loja de 58"). O arquivo passa a se chamar `CONTEUDO-INICIANTE.md`. |

### Fase 1: sistema visual "mostre, não simbolize" (coração do 9)

Quatro registros novos, em ordem de prioridade. Os três primeiros são **HTML/CSS/SVG**, traduzíveis e sem servidor.

1. **Tela simulada (`.tela`)**, que substitui o `.termdemo` na v5.
   - É um mock HTML/CSS de um chat de IA genérico (caixa de mensagem, balão do usuário, balão da resposta), com **o pedido real e a resposta real** do exemplo.
   - Reaproveita a mecânica que já existe: "ver o que acontece →" revela, e o toggle alterna **vago × bom**.
   - É o maior ganho com o menor custo: **nenhuma mudança de motor**, só markup e CSS novos.
2. **Antes/depois visual (`.lado-a-lado`)**: os dois resultados reais lado a lado (texto, post ou planilha), com um carimbo do saldo ("4 rodadas → 1").
   Evolui o `.qbefore-after`, que hoje é só texto.
3. **Passo a passo anotado (`.passo-a-passo`)**: tela simulada com **números em círculo sobre ela** (1 clique aqui, 2 cole ali) e a lista ao lado.
   Serve para "onde fica o botão", a dor nº 1 do iniciante.
4. **Cena ilustrada (`.cena`)**, raster com `flux2-klein`, ou Magnific quando precisar do **mesmo personagem recorrente**.
   - 1 por aula, no cold-open, no lugar da metáfora SVG. Mostra a pessoa da profissão na situação real do exemplo.
   - Regras: **nenhum texto dentro da imagem**, porque os rótulos vão em HTML por cima ou abaixo, senão quebra o fluxo PT/EN/ES que traduz só texto.
   - Formato: webp ≤150KB, `alt` que ensina, arquivo local em `assets/img/`, para funcionar em `file://`.
   - Custo: ~9 imagens por curso, ~90 créditos Magnific ou grátis no inemaimg.
   - Proibidos continuam: robô, cérebro-circuito e aperto de mão com robô.

**Regras que entram no `V5-DESIGN.md`:**
- **O visual fica colado ao parágrafo** que ele explica, no corpo e não só no trilho. O trilho vira índice e progresso.
- **É proibido "tracinho no lugar de texto"** quando o texto real cabe. Se a figura mostra um pedido, mostra **o pedido**.
- **Diagrama abstrato só para mecanismo** que não tem tela (ex.: "a IA não lembra da conversa anterior"), com rótulos em palavras comuns, sans ≥14px **dentro** do SVG.
- **Cola da aula (`.cola`)** no fecho: 1 cartão visual com os 3 pontos da aula (ícone + frase), pensado para print no celular. Substitui o `.recap-autor` em prosa, com a mesma função de síntese.

### Fase 2: leveza

| Arquivo | Mudança |
|---|---|
| `SKILL.md` (limites) | Aula: **8–12 min de leitura + 5–10 de prática**. Prosa ≤900 palavras (aula 1 ≤700). **3 steps por padrão** (máx. 5). Cauda de frases longas conforme a rubrica (critério 6). |
| `SKILL.md` + template | **"Em 1 minuto"** no topo de toda aula: 3 linhas com ícone. Quem só lê isso já leva algo. |
| `SKILL.md` + template | **"Quer saber mais?"** em `<details>` para nuance, exceção e "por que funciona". O caminho principal fica curto. |
| `RETENCAO-V5.md` | Pool de fixação de ≤5 para **≤3 por aula**. Sai o `.qanchor` como obrigatório. `.qapply` vira opcional raro. Cartões: 3 por aula (não 3–6). |
| `curso.js` + template | "Reflita" deixa de ser por seção: **1 por aula**, no fecho. O "marcar como lido" por seção vira progresso automático por rolagem, com botão só no fim da aula. **Isso também levanta um contrato do SKILL.md** (não tocar trilho/progresso), então entra como decisão no §7. |
| `curso.js` + `aula.css` | Barra: **← trilha · Aa · ☰ (menu)**. Revisar, exercícios, jornada, tema e ajuda vão para o menu. "Revisar" só aparece na barra quando houver cartão vencido de verdade. |

### Fase 3: olhar humano

| Arquivo | Mudança |
|---|---|
| `CONTEUDO-INICIANTE.md` | Novo componente **`.calma`** ("Se travou aqui, é normal: …"): 1 por aula, no ponto mais difícil, com a saída concreta. |
| `CONTEUDO-INICIANTE.md` | **Voz do autor** (opcional, decisão sua): 1 "nota do Nei" por curso, na abertura, usando o `PERFIL-NEI-MALDANER.md`. |
| `CONTEUDO-INICIANTE.md` | Checagem **"ler em voz alta"**: se soa como apostila, reescreve como conversa. |
| novo `references/TESTE-HUMANO.md` | Roteiro de pensar em voz alta com 2–3 pessoas (15 min, celular delas, 5 perguntas fixas) e a planilha do que anotar. |
| novo: subagente "leitor leigo 30+" | Antes de entregar, um subagente lê cada aula **como iniciante**, aplica o teste dos 5 segundos e devolve onde travou. Substitui o "teste de persona" de 1 parágrafo. |

### Fase 4: a skill enxuta e o auditor automático

| Arquivo | Mudança |
|---|---|
| `SKILL.md` | Reescrita em linguagem simples, **sem siglas** e **sem depender do v4**: tokens e motion copiados para o `V5-DESIGN.md`. Alvo de ~110 linhas. |
| `CHECKLIST-V5.md` | Os greps viram **`auditar-aula.cjs`** (Node + Playwright do agent-browser). O script calcula os critérios 2 e 4–8 da rubrica sozinho, e também o contraste real dos tokens, fontes <14px e botões no 1º paint no celular. Devolve a nota por aula. |
| manifesto de completude | Enxugado: continua como portão da espinha, e a rubrica (§4) vira o portão de qualidade. |

### Fase 5: piloto e medição

1. Refazer a **aula 1 do `ia-do-zero-curso`** no formato novo (cópia em `ia-do-zero-curso/piloto-v51/`, sem tocar o publicado).
2. Rodar `auditar-aula.cjs` **antes e depois** e comparar as notas.
3. Rodar o teste humano com 2–3 pessoas e registrar o resultado em `TESTE-HUMANO.md`.
4. Ajustar e só então consolidar no template e nas references da skill.
5. Decidir se algum curso existente recebe retrofit. O IA do Zero é o candidato natural, e os outros ficam como estão, porque os assets são locais e nada quebra.

---

## 6. v2: o que tem de bom, o que tem de ruim

**Perfil:** multipágina, Tailwind CDN, camada de aprendizagem (progresso, dúvida, anotação, jornada, temas), 6+ tópicos por módulo em "O que é / Por que aprender / Conceitos-chave".
É mais para intermediário e para cursos grandes. **Não é o formato de iniciante, nem deve virar.**

**O v5 deve pegar da v2:**
- **Visual-first ilimitado** (erro crítico #29): "o mínimo é piso, não teto". Inclui vídeo curto (HyperFrames) e imagem gerada quando pedida.
- **Licença de imagem já correta** (conteúdo aberto, `flux2-klein` padrão).
- **"Tenho uma dúvida"**: botão humano simples, que o v5 não tem.
- **"Novo aqui?"**: caixa de definição inline, mais amigável que o sublinhado `.gterm`.

**Problemas da própria v2 (medidos em 98 cursos distintos e 1.009 módulos):**
- **90 de 98 cursos sem nenhuma imagem.** A regra "visual-first" existe, mas imagem raster fica "só se pedido". Um curso inteiro **sobre imagem** (`olhar-treinado`) não tem nenhuma imagem em nenhum dos 4 módulos.
- **72 módulos (~7%) têm ≥1 parágrafo repetido.** Parte é texto de interface repetido ("Deslize a ilustração…"). Parte é enchimento de verdade ("Na prática, este ponto influencia a forma como…"; "Comece com seis referências…" duas vezes no mesmo tópico). O molde rígido e o piso de linhas **provavelmente** empurram isso, mas a causa não foi provada módulo a módulo.
- **Módulos de 1.000–2.000 palavras** e a regra "500–800 linhas mínimo", que premia volume.
- **Centenas de emoji por curso** (wat7d 574, mundo-apos-claude 655), no mapa da trilha e nos títulos.
- **31 "erros críticos" misturando o cosmético com o pedagógico.** "Botões à esquerda" pesa igual a "definir termos".

**Se a v2 for revisada (opcional, depois do v5):** trocar o piso de linhas por teto de palavras; o molde de 3 seções vira opcional; adotar a imagem real que se propõe aqui para a v5; reduzir emoji.

---

## 7. Decisões que são suas (responder em texto)

1. **Tema padrão para iniciante:** manter o escuro (marca aprovada, D-02) ou abrir no **papel** com o escuro a 1 toque? Minha recomendação é papel, que lê melhor em texto longo e no celular sob luz do dia.
2. **Imagem no corpo da aula** (derruba a D-01 "zero-raster"): 1 cena ilustrada por aula, com `flux2-klein` padrão e Magnific quando precisar de personagem recorrente. Minha recomendação é sim.
3. **Nome da versão:** evoluir a **v5 no lugar** (v5.1; os cursos antigos não quebram porque têm assets próprios) ou abrir uma **v6**? Minha recomendação é v5.1: o gatilho `/formato-curso-v5` continua sendo "o de iniciante".
4. **Voz do autor:** incluir a "nota do Nei" na abertura de cada curso?
5. **Mexer no motor:** posso levantar as proibições do SKILL.md sobre o `curso.js`? São duas mudanças: semear cartões só depois da aula (bug 9+) e trocar o "marcar como lido" por seção por progresso automático. O SM-2 e o roteador continuam intocados.
6. **Teste humano:** você consegue 2–3 pessoas iniciantes de 30+ para o piloto (15 min cada, no celular)? Sem isso, o "olhar humano" fica só no leitor simulado.

---

## 8. Ordem sugerida e esforço

| Fase | Entrega | Esforço |
|---|---|---|
| 0 | Bug do 9+, onboarding leve, legendas legíveis, licença, 30+ | 1 sessão |
| 1 | `.tela`, `.lado-a-lado`, `.passo-a-passo`, `.cena`, `.cola` + regras visuais | 1–2 sessões |
| 2 | Limites novos, "Em 1 minuto", "Quer saber mais?", barra enxuta, pool ≤3, progresso automático | 1–2 sessões |
| 3 | `.calma`, voz, leitor simulado, roteiro de teste humano | 1 sessão |
| 4 | SKILL.md enxuto + `auditar-aula.cjs` | 1 sessão |
| 5 | Piloto IA do Zero aula 1 + medição + teste humano + consolidação | 1 sessão + o teste com pessoas |

Nota esperada: **~7,5 depois das Fases 0–1**, **~8,5 com a 2–3**, e **9+ só depois do piloto com gente real**, porque é o teste humano que confirma o 9.
