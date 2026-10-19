# Lições do formato v7.x (reprovações reais — vão para o CLAUDE.md de todo curso novo)

- Marca-texto (anotação) dentro de elemento flex/grid vira item solto e abre espaço no meio da palavra: o texto anotável tem que estar num `span`/`p` próprio (ex.: `.nesta2 li > span`). Bloco anotável novo → conferir o `display` dele (18/10/2026).
- Rolagem guiada no desktop: o texto da etapa fica DENTRO do painel fixo (legenda que troca); cartões rolando por baixo do diagrama aparecem cortados e espiando no topo — o Nei viu na aula 1 (18/10/2026).
- Rolagem guiada: posição de destino calculada com o diagrama JÁ grudado no topo (top do sticky + altura), nunca pela posição atual; e a etapa só vira ativa quando o cartão está visível abaixo do diagrama (18/10/2026).
- Menu do topo de curso segue o padrão v2 (curso | INEMA.CLUB - PRO à esquerda; seções e Aa à direita); não inventar outro topo (18/10/2026).
- Simulação com falha proposital: amarrar a falha à primeira execução da tarefa, não à primeira rodada — senão interromper e retomar esconde a falha (18/10/2026).
- Validar por HTTP local, nunca `file://` (o progresso e os caminhos relativos se comportam diferente) (18/10/2026).
