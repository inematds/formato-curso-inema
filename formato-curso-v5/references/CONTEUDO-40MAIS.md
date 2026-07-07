# CONTEUDO-40MAIS.md — A alma da v5: linguagem, princípios pedagógicos e anti-genérico

> **Dono único de:** PP1–16 (princípios pedagógicos), linguagem 40+, jargão domínio×plataforma + lista-sentinela, rampa de acesso, analogias, regra de clímax, racional da estrutura canônica. O SKILL.md carrega as regras duras (versão executável); este documento tem o **porquê** e o detalhe fino.
>
> **Por que este arquivo pesa igual ao design (v4 só exigia ler 1 reference; v5 exige 2):** a v4 tem markup e design de primeira classe, mas nenhuma regra de escrita para leigos — o glossário `.gterm` é mecanismo sem critério editorial de uso. Um curso v5 pode acertar 100% do markup e ainda assim excluir o público-alvo se o conteúdo presumir vocabulário técnico. Conteúdo tem contrato próprio, com o mesmo peso do markup (spec §0).

---

## Os 16 princípios pedagógicos (PP1–16)

Cada princípio é uma lei — não uma preferência de estilo. Quando um princípio parecer conflitar com outro (ex.: densidade visual vs. apoio por step), releia: eles foram desenhados para serem simultaneamente satisfazíveis; um conflito aparente é sinal de execução ruim, não de regra incompatível.

**PP1 — Promessa verificável antes de qualquer conceito.** Toda aula abre dizendo, em 1 frase, o que o aluno vai **conseguir fazer** ao final — nunca "vamos entender X" (vago), sempre "ao fim desta aula você consegue [ação observável]". Um profissional ocupado decide em segundos se vale continuar; a promessa é o contrato que justifica o tempo pedido.

**PP2 — Por que agora.** Logo após a promessa, 2–4 linhas conectam o conceito ao problema real do profissional, no presente — não "isso é importante para o futuro da sua carreira" (abstrato), mas o incômodo concreto que ele sente hoje. Sem isso, o conceito flutua sem gravidade.

**PP3 — Uma ideia por seção (herdada do v4, elevada a lei).** Cada `.step` carrega exatamente uma ideia nova. Empilhar duas ideias no mesmo step é a causa mais comum de "parede de texto" — mesmo com prosa curta.

**PP4 — Exemplo aplicado a profissão real em 100% dos conceitos.** Todo conceito, sem exceção, tem um exemplo com uma das profissões nomeadas no protocolo de descoberta — nunca "imagine uma empresa X" (achado F9: um piloto com 2 de 4 steps sem exemplo reprovou o portão). É contável: se um auditor consegue contar os steps sem exemplo, o item falhou.

**PP5 — Fundamento × Ferramenta.** Todo step é classificado (`data-kind`). Fundamentos são o que não muda quando a interface do software muda; ferramenta é o que muda — e por isso é carimbada com data/versão (`data-versao="ChatGPT, jul/2026"`). Sem essa separação, o curso inteiro "apodrece" junto com a próxima atualização de tela.

**PP6 — Rampa de acesso antes de todo artefato técnico opaco.** Antes de mostrar código, uma tela de configuração ou qualquer coisa visualmente "de programador", 1 frase traduz para o mundo do leitor ("isto é uma receita: quando X, faça Y"). Sem rampa, o leitor trava no primeiro olhar e não lê o que vem depois, mesmo que o texto seguinte explique tudo.

**PP7 — Jargão de domínio se define; jargão de plataforma nunca se presume.** Ver seção dedicada abaixo — é a distinção mais importante deste documento.

**PP8 — Analogia profissional obrigatória por conceito abstrato, nunca analogia sobre analogia.** Todo conceito sem correspondente físico direto ganha 1 âncora do mundo real (um "estagiário que não lembra de nada", um "molde de costura reutilizável"). Empilhar uma segunda analogia sobre a primeira confunde mais do que ajuda — 1 âncora por conceito, não mais.

**PP9 — Tempo é fonte única e cobertura total.** `data-tempo` é a única fonte de verdade, renderizada em 3 lugares (card da trilha, cold-open, statcards). Cobertura parcial (só algumas aulas com tempo) é **pior** que ausência total — cria a expectativa de que toda aula tem tempo e depois quebra a confiança quando uma não tem. Arredondar para cima: prometer 15 e custar 12 constrói confiança; o inverso destrói.

**PP10 — Prática multi-modo é pré-condição de acesso, nunca terminal para leigo.** Para o público-alvo da v5, "pratique agora" com terminal/config é uma barreira de entrada, não um refinamento pedagógico — é a diferença entre a aula servir ou excluir o aluno. O modo é escolhido no protocolo de descoberta, nunca por padrão.

**PP11 — Reassurance (`.psafe`) proporcional ao risco percebido.** Quanto mais consequente a prática parecer ao aluno, mais concreta e explícita precisa ser a garantia de que nada quebra (regra **inversa** ao padrão encontrado no v4/demo4, onde a reassurance cobria só as práticas de baixo risco e faltava exatamente nas de alto risco).

**PP12 — Retenção por utilidade, nunca por gamificação.** Nada de pontos, badges, streaks, confete, mascote. O aluno volta porque a aula anterior valeu no trabalho dele, não porque um contador pisca. Isso não é estética — é a tese central de retenção da v5.

**PP13 — Dosagem: espinha sempre presente, pool com teto.** A espinha estrutural (recap-autor, prática, next-action, exemplo-por-profissão) está em 100% das aulas, sempre, fora de qualquer teto — não é opcional dosar o que sustenta a aula. O pool de mecanismos de fixação tem teto ≤5/aula justamente para não virar "tudo-sempre-ligado" (o erro do v4, que tem o melhor motor de fixação das versões mas sem nenhuma dosagem).

**PP14 — Resumo autoral é síntese, NUNCA recall.** `.recap-autor` resume a aula em linguagem humana, conectando as ideias ("o que isso significa") — nunca testa, nunca pergunta, nunca vira flashcard disfarçado. O recall vive exclusivamente nos cartões (PP15). Confundir os dois papéis foi a causa-raiz da falha crítica da Fase 9 (duplicação recap↔cartão nos 3/3 pilotos).

**PP15 — Cartões são recuperação ativa, nunca reafirmação.** Todo cartão nasce numa de 5 formas — pergunta, decisão, contraste, diagnóstico, aplicação — nunca como afirmação. Se a mesma ideia aparece no recap e num cartão, o cartão obrigatoriamente muda a operação cognitiva (o recap *afirma*; o cartão *exige recuperar ou aplicar*). Detalhe completo, com os 3 testes objetivos, em `RETENCAO-V5.md`.

**PP16 — Regra de clímax.** Os momentos de maior significado emocional de um curso (fim de prática, fim de aula, fim de trilha) são exatamente onde a disciplina de tom mais falha por padrão (achado real do v4: um único emoji de celebração em toda a trilha apareceu justamente no fim-de-trilha). Por isso o clímax recebe checagem **dedicada**, não incidental: celebração = constatação de capacidade em linguagem adulta, zero emoji, zero exclamação dupla.

---

## Jargão de domínio × jargão de plataforma (a distinção mais importante deste documento)

Existem duas categorias de termo técnico, e a v5 as trata de forma **oposta**:

**1. Jargão de domínio** — o assunto do próprio curso (ex.: "prompt" num curso de IA, "hook" num curso de automação). Esse termo *é* o conteúdo — não dá para eliminar. Regra: **define inline na 1ª aparição, em ≤2 frases concretas**, e reforça com `.gterm` para quem esquecer depois. Nunca presuma que o aluno já sabe, mesmo que o termo pareça óbvio para quem trabalha com tecnologia.

**2. Jargão de plataforma / computação geral** — vocabulário que vem "de brinde" com a tecnologia, mas não é o assunto do curso (ex.: "arquivo de configuração", "commit", "terminal"). Esse jargão **nunca se presume** — ou (a) define com uma analogia do mundo do leitor, ou (b) elimina e usa a palavra comum equivalente. Prefira eliminar sempre que possível: "instalar" pode virar "ativar" ou "ligar"; "configurações" (rótulo de menu real do software) é aceitável citar literalmente, mas nunca como conceito a explicar.

**Lista-sentinela (auditável por grep — extensível conforme o curso revelar novos termos):**

```
JSON · terminal · Git · repositório · commit · branch · pipeline ·
"arquivo de configuração" · instalar · script · servidor · API ·
deploy · CLI · diretório · plugin · encoding
```

Qualquer ocorrência desses termos no texto voltado ao aluno, sem definição-com-analogia ou substituição, é falha de portão (`success.md` §5.1 / SKILL.md checklist). **Achado real (Fase 9, duas tentativas):** o termo "instalar" escapou sem tratamento em pilotos diferentes em rodadas diferentes — não é suficiente eliminar uma ocorrência isolada; a auditoria precisa varrer o texto inteiro a cada nova aula, porque o mesmo tipo de escape reaparece em lugares diferentes.

**Regra de ouro para decidir a categoria de um termo:** pergunte "isso é o que o curso ensina, ou é só o jeito como a tecnologia por baixo funciona?". Se for o primeiro, é domínio (define e mantém). Se for o segundo, é plataforma (define com analogia ou elimina).

---

## Rampa de acesso — como escrever uma

Uma rampa de acesso tem 3 partes num movimento só: (1) nomeia o que o leitor está prestes a ver ("uma tela cheia de opções"), (2) traduz para uma metáfora do mundo dele ("isto é uma receita de bolo: quando o campo diz X, você escreve Y"), (3) devolve o controle ("você só vai mexer nesta parte aqui"). Sem as 3 partes, a rampa vira apenas um aviso de dificuldade, não uma ponte.

Exemplo: antes de mostrar uma tela de configuração de automação, "Isto parece complicado, mas funciona como um formulário de pedido: cada campo é uma pergunta que você responde uma vez — depois disso, ele se repete sozinho toda semana."

---

## Analogias profissionais — banco e regra

O banco de analogias/exemplos por profissão vive em `EXEMPLOS-PROFISSOES.md` — este documento define só a **regra de uso**: 1 âncora por conceito abstrato, adaptada (nunca copiada verbatim) ao tema específico do curso, e nunca duas analogias empilhadas para o mesmo conceito. Uma boa analogia profissional nomeia a profissão e a situação real ("a corretora de imóveis conferindo um valor de m² que a IA disse com toda confiança"), não uma generalização ("um profissional qualquer").

---

## Racional da estrutura canônica (por que 4 movimentos, nesta ordem)

A aula segue **Abertura → Núcleo → Prática → Fecho** porque cada movimento resolve uma pergunta distinta do aluno ocupado, na ordem em que ele a faz:

1. **Abertura** responde "vale meu tempo?" (promessa + tempo + por-que-agora) antes de qualquer investimento de atenção.
2. **Núcleo** responde "o que eu preciso entender?" — sempre ancorado num exemplo da profissão dele, nunca abstrato.
3. **Prática** responde "eu consigo fazer isso?" — sem essa resposta, o núcleo vira teoria que evapora (achado da Fase 2: as 3 personas simuladas completavam ~40% da parte conceitual do v4 e 0% de qualquer prática, porque a prática exigia terminal).
4. **Fecho** responde "o que eu levo comigo?" — síntese (recap) + próximo passo (next-action) + memória de longo prazo (cartões), nesta ordem porque cada um depende do anterior estar completo: não dá para fixar o que ainda não foi sintetizado, e o próximo passo só faz sentido depois da síntese.

Inverter essa ordem (por exemplo, prática antes do núcleo, ou cartões antes do recap) quebra a dependência cognitiva que cada movimento constrói para o seguinte — por isso a ordem é contrato, não sugestão de estilo.

---

## Proibições de tom (detalhe do SKILL.md §"Linguagem 40+")

Infantilização ("parabéns, campeão!"), hype ("isso vai *revolucionar* seu trabalho"), condescendência etária (qualquer menção à idade como limitação), pré-requisito oculto ("como vimos" quando não foi mostrado no próprio curso), inglês desnecessário em rótulos de UI quando existe termo em português igualmente claro, referência de produto de nicho no onboarding ("revisão espaçada, como no Anki" — o aluno 40+ leigo não conhece Anki e a referência não ajuda em nada; troque por "as perguntas voltam sozinhas na hora certa de lembrar"). Frases ≤25 palavras, voz ativa, sempre "você", números concretos em vez de vagos ("3 minutos", não "rapidinho"), e admita os limites reais da tecnologia em vez de prometer perfeição.
