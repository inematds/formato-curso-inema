# Falhas — formato-curso-inema

Uma linha por falha. Mais recente no topo. Regra em `~/.claude/CLAUDE.md`.

| data | o que quebrou | menor correção | prompt/infra |
|---|---|---|---|
| 2026-09-24 | v6 tradutor: o modelo traduziu o valor de `data-gl` e quebrou o link "ver no glossário" em EN | `fixa_ids()` restaura as âncoras do PT na montagem | prompt |
| 2026-09-24 | v6 auditor técnico reprovou EN/ES por "input/output" (traduções revisadas do v2) e "LLM" singular | plural tolerado + lista de palavras comuns só na edição EN | prompt |
| 2026-09-24 | Piloto v6 (OSWork): telas de "resposta boa" com a IA inventando data/horário/prazo ausentes do pedido (aulas 4 e 5) | regra 10 em CONTEUDO-INICIANTE §1b + item manual no CHECKLIST-V6 | prompt |
| 2026-09-24 | Piloto v6: "à direita/à esquerda" em cartões que empilham no celular; teste-se com a certa sempre a mais longa | auditor barra referência espacial (critério 8) e alternativa certa >35% mais longa (critério 6) | prompt |
| 2026-09-24 | v6: progresso por IntersectionObserver não registrava no Chromium headless do host (sem quadros) | checagem direta de posição no evento de rolagem, sem IO | infra |
| 2026-09-24 | v5: aluno novo via "revisar 9+" antes de ler qualquer aula (todos os cartões semeados como vencidos no 1º acesso) | v6 semeia os cartões só ao concluir a aula (v5 mantido intocado) | prompt |
