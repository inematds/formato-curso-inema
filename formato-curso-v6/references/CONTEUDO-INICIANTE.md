# CONTEUDO-INICIANTE.md — voz, estrutura e linguagem do v6

> Público: **iniciante de 30+**, ocupado, que usa celular e computador no trabalho e nunca
> programou. Não é "leigo lento": é alguém competente na profissão dele, com pouco tempo e zero
> paciência para jargão. Escreva para o **dono de oficina de 34**, a **professora de 47** e a
> **gerente de loja de 58** — os três precisam entender na primeira leitura, no celular.

## 1. As 8 leis de escrita

1. **Mostre antes de explicar.** Se existe uma tela, um pedido ou um resultado real, ele vai na figura.
   O texto só comenta o que a figura mostra.
2. **Uma ideia por step, três ou quatro steps por aula.** Nuance, exceção e "por que funciona" vão
   para `details.mais` ("Quer saber mais?"). O caminho principal fica curto.
3. **Frases curtas.** Média abaixo de 15 palavras; no máximo 1 frase em 20 passa de 22; nenhuma passa de 30.
   Quebre enumerações longas em duas frases.
4. **Você, voz ativa, verbo concreto.** "Cole o texto", não "é recomendável que o material seja fornecido".
5. **Número concreto** ("cinco minutos", "quatro colunas"), nunca "rapidinho" ou "alguns".
6. **Exemplo com gente de verdade** em todo step: profissão-alvo + situação do dia de trabalho +
   o que mudou. `p[data-ex="gestora"]` — o motor escreve "Na prática · Gestora" em cima.
7. **Honestidade sobre o limite.** A IA erra com confiança; diga isso onde importa, sem alarme.
8. **Nada de hype, nada de infantilizar.** Sem "revolucionar", sem "campeão", sem emoji, sem "!!",
   sem mencionar idade como limitação.

## 1b. Regras aprendidas com o leitor simulado (piloto OSWork, 24/09/2026)

9. **Nunca "à direita / à esquerda / em cima ao lado".** No celular os cartões empilham. Refira-se pelo
   rótulo: "o cartão **Critério**", "o caso **Com contexto**". O auditor barra.
10. **A resposta "boa" da IA numa tela simulada nunca inventa fato** (data, horário, local, número) que não
    esteja no pedido ou no material mostrado. Se a resposta precisa de um dado, ele aparece no pedido — ou a IA
    escreve "[data]". Dia da semana tem de bater com o ano do curso.
11. **Um nome só por conceito**, no curso inteiro. Se o termo é do assunto ("frente de trabalho", "nível"),
    defina com `.gterm` e um exemplo das DUAS profissões na primeira vez que aparece em CADA aula que o usa.
12. **Cada aula se sustenta sozinha.** Ao citar algo de outra aula, diga onde está fisicamente ("a pasta que você
    criou na aula 3, em Documentos") e dê a saída para quem pulou ("Não fez a aula 3? Use qualquer documento seu").
13. **Caminho principal = o mais simples.** Copiar e colar no chat vem antes de "anexar". Ações de arquivo
    (duplicar, renomear, criar pasta) vêm com o gesto exato: "botão direito › Renomear".
14. **Prática que exige computador avisa no `.pgoal`** ("no computador") e oferece o caminho do celular quando existir
    (Notas, Drive, papel e caneta). Prática de análise tem onde escrever: "anote no papel ou no bloco de notas".
15. **Moldes e exemplos colados alternam as profissões-alvo.** Se o step usa a gestora, o molde da prática traz
    também o preenchimento de um caso do professor (ou vice-versa).
16. **Teste-se justo:** a alternativa certa não é a mais longa nem a mais detalhada; as três têm tamanho parecido.
17. **Rótulo de cor coerente:** vermelho (`.antes`, `.falha`) só para o que está errado ou é pior. Se os dois
    lados estão certos (ex.: "o que a IA faz" × "o que é seu"), use dois rótulos neutros/verdes, não "antes/depois".

## 2. Jargão

- **Jargão do assunto** (o que o curso ensina: "contexto", "critério de pronto"): defina na primeira vez
  com `<span class="gterm" data-def="…">termo</span>` — a definição abre embaixo do parágrafo ao tocar.
  Definição em ≤2 frases concretas.
- **Jargão de plataforma**: nunca presuma. Troque pela palavra comum. Lista-sentinela (o script barra):
  `JSON · terminal · Git/GitHub · repositório · commit · branch · pipeline · arquivo de configuração ·
  instalar · script · servidor · API · deploy · CLI · diretório · plugin · encoding · workflow · output ·
  input · setup · framework · upload · download · login · backup`.
  Trocas: pasta (diretório), abrir/ativar (instalar), cópia datada (commit/backup), entrar (login),
  enviar/baixar (upload/download), ficha de orientação (arquivo de configuração).
- "Prompt" é aceitável em curso de IA, mas prefira "pedido" no texto corrido.

## 3. A aula em 4 movimentos (por que nesta ordem)

1. **Abertura — "vale meu tempo?"** Cena (a pessoa na situação), promessa verificável, a dor de hoje
   em 2–3 frases, e o **Em 1 minuto**: 3 linhas que já ensinam algo para quem parar ali.
2. **Núcleo — "o que eu preciso entender?"** 3–4 steps. Cada um com um visual real.
3. **Prática — "eu consigo?"** A prática realiza exatamente a promessa. Modos:
   - `prompt` — bloco copiável com `<isto você troca>` + "o que você deve ver".
   - `tarefa` — passos no próprio trabalho, sem tela técnica; "fica pronto quando…".
   - `analise` — só quando fazer de verdade é impossível ou arriscado: mini-caso (3–5 frases) +
     2–3 perguntas + gabarito em `<details class="gabarito">`.
   Sempre `.psafe`: por que é seguro + o que fazer se sair estranho.
4. **Fecho — "o que eu levo?"** `.cola` (3 itens, formato de cartão para print), `.next-action`
   (vitória nomeada + microação de ≤15 min no trabalho real + gancho para a próxima aula).
   O motor adiciona a reflexão única e o "concluir aula".

## 4. Momentos humanos (obrigatório ≥1 por aula)

- **`.calma`** no ponto mais difícil da aula: "Se travou aqui, é normal" + a saída concreta.
  Exemplo: "A lista do que falta às vezes vem longa. Responda o que sabe e escreva 'o resto, pode supor
  e me avisar o que supôs'."
- **`.psafe`** na prática.
- **`.qerr`** (erro comum) só se o erro for real e frequente; máximo 1 por aula.
- Na vitória (`.pdone`, `.na-win`): constatação adulta de capacidade, sem festa.

## 5. Cadeia de retenção

Promessa → entrega (núcleo + prática cumprem a promessa) → **vitória nomeada** ("Você já sabe…") →
**gancho** (a próxima dor concreta, não "continue aprendendo"). Sem pontos, badges, troféus, streaks ou confete.

## 6. Cartões (`cards-N`) e teste-se

- **3 ou 4 cartões por aula**, só nas formas: pergunta · decisão · contraste · diagnóstico · aplicação.
  A frente **sempre termina em "?"**. Nunca repita frase da `.cola` nem do texto (≥6 palavras seguidas).
  Prefira decisão/diagnóstico/aplicação: "Você recebeu X — o que faz primeiro?".
- Os cartões só entram na revisão quando o aluno conclui a aula (o motor cuida disso).
- **Teste-se** (`.quiz`): 1 por aula em aula de fundamento; opcional nas outras. Toda alternativa
  com `data-fb` curto explicando por que sim ou por que não. A resposta não pode estar na frase anterior.

## 7. Tempo

`data-tempo` no `<section class="view">` = palavras/200 + minutos da prática + 1, arredondado para cima.
Alvo 12–15 min; teto 18. A prática declara o tempo no `.pgoal` ("Cerca de 10 minutos.").

## 8. Anti-clone

Antes de escrever, leia o último curso v6 gerado: não repita personagens, cenas de exemplo nem a
sequência de visuais. Use nomes e situações novas; máximo 1 exemplo copiado de `EXEMPLOS-PROFISSOES.md`.
