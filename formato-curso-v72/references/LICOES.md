# Lições do formato v7.x (reprovações reais — vão para o CLAUDE.md de todo curso novo)

- Nó de diagrama com rolagem guiada não precisa de número no título: a aba já numera (o motor 7.5.5 tira o "N · " repetido). Com 6 nós em escada no desktop, títulos de uma ou duas palavras evitam quebra (19/10/2026).
- Placeholder com `<…>` só dentro de bloco `codigo`; em texto (passos, exemplo, falas) ele vira tag invisível e trava a tradução: use [colchetes] ou reescreva. O `validar.py` 7.5.3 acusa (19/10/2026).
- Tradução para espanhol: "del" (e "set", "type") é prosa comum; detector de comando só aceita essas palavras seguidas de caminho, opção ou variável (19/10/2026).
- simconversa: o placar máximo é o caminho de MAIOR soma, e um desvio (resposta "meio" que leva a uma fala extra) soma uma fala a mais; dê nota baixa à saída do desvio ou o placar máximo passa a premiar o desvio em vez da resposta direta. Some os caminhos à mão antes do portão (19/10/2026).
- Tradução de bloco de código: o detector de linha de comando tem de casar palavra inteira; "Entregue" → "Deliver" virava o comando `del` e a tradução era recusada 3 vezes (19/10/2026).
- `mapa` com mais de 4 degraus espreme as colunas no desktop: use 4 degraus (as entregas principais) e deixe o `gerador` listar todas as aulas (19/10/2026).
- Copie o motor para o curso de novo depois de qualquer ajuste no motor: o `novo-curso.sh` copia uma vez só, e o curso piloto ficou com o rótulo antigo da simconversa (19/10/2026).

- Marca-texto (anotação) dentro de elemento flex/grid vira item solto e abre espaço no meio da palavra: o texto anotável tem que estar num `span`/`p` próprio (ex.: `.nesta2 li > span`). Bloco anotável novo → conferir o `display` dele (18/10/2026).
- Rolagem guiada no desktop: o texto da etapa fica DENTRO do painel fixo (legenda que troca); cartões rolando por baixo do diagrama aparecem cortados e espiando no topo — o Nei viu na aula 1 (18/10/2026).
- Rolagem guiada: posição de destino calculada com o diagrama JÁ grudado no topo (top do sticky + altura), nunca pela posição atual; e a etapa só vira ativa quando o cartão está visível abaixo do diagrama (18/10/2026).
- Menu do topo de curso segue o padrão v2 (curso | INEMA.CLUB - PRO à esquerda; seções e Aa à direita); não inventar outro topo (18/10/2026).
- Simulação com falha proposital: amarrar a falha à primeira execução da tarefa, não à primeira rodada — senão interromper e retomar esconde a falha (18/10/2026).
- Validar por HTTP local, nunca `file://` (o progresso e os caminhos relativos se comportam diferente) (18/10/2026).
