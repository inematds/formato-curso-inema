# CHECKLIST-V6.md — a rubrica 9/10 e o portão

A nota de uma aula é o número de critérios aprovados (0–10). **Aula entregue = ≥9/10 e sem falha em 7, 8 ou 10.**
`scripts/auditar-curso.cjs` mede tudo no navegador (celular 390px, 3 temas) e lista o que falhou.

| # | Critério | Como o script mede | Meta |
|---|---|---|---|
| 1 | **Teste dos 5 segundos** | proxy: todo `.step` tem um visual (`.tela`, `.lado`, `.janela`, `.terminal`, `figure`, `.diag`) — confirmar com o leitor simulado | 100% dos steps |
| 2 | **Mostrar, não simbolizar** | ≥2 visuais reais (`.tela`/`.lado`/`.janela`/`.terminal`) + `figure.cena` com alt >20 caracteres e ≤150 KB | sim |
| 3 | **Vitória rápida** | `data-tempo` ≤18 min e `.pgoal` declara ≤12 min | sim |
| 4 | **Primeira tela leve** | 1ª visita no celular: ≤3 controles na barra, nenhum painel/modal aberto (trilha e aula 1) | sim |
| 5 | **Aula enxuta** | palavras em `.step > p`, `.why`, `.promise` ≤900 (aula 1 ≤700); 3–5 steps | sim |
| 6 | **Texto sem armadilha** | frases >22 palavras ≤5% e nenhuma >30; no teste-se a certa não é >35% mais longa que as outras | sim |
| 7 | **Legível nos 3 temas** | todo texto visível ≥14px, contraste ≥4,5:1 (3:1 para ≥24px), mono só em `pre/code` | 0 violações |
| 8 | **Zero jargão e zero "à direita"** | lista-sentinela no texto e nos cartões; "à direita/esquerda" (no celular os cartões empilham). **Perfil técnico:** todo termo da sentinela + `termos` presente na aula tem um `.gterm` que o define nessa aula | 0 |
| 9 | **Momento humano** | ≥1 `.calma` + `.psafe` na prática | sim |
| 10 | **Espinha** | `.promise`, `.em1min`, 1 `.practice`, `.cola`, `.next-action`, 3–4 cartões com "?", `data-tempo` | sim |

## O que o script NÃO mede (confira lendo)

- A promessa é verificável e a prática a cumpre de verdade.
- Cada visual mostra **a coisa real** (não tracinhos/símbolos) e a legenda diz o que olhar.
- O exemplo de cada step cita uma profissão-alvo numa situação nova (sem repetir cena).
- Cartões: nenhum repete ≥6 palavras da `.cola`; a forma é pergunta/decisão/contraste/diagnóstico/aplicação.
- Telas de "resposta boa" não inventam fato (data, hora, local, número) ausente do pedido; dia da semana confere com o ano.
- Um nome só por conceito; cada aula diz onde está o que veio de aula anterior e dá saída para quem pulou.
- Tom: sem hype, sem emoji, sem "!!", sem infantilizar; vitória em linguagem adulta.
- Anti-clone contra o último curso v6 (personagens, cenas, sequência de visuais).

## Comportamento do motor

`scripts/testar-motor.cjs <curso.html>` confere, num navegador limpo: tema papel, sem modal, "revisar" escondido
na 1ª visita, progresso automático por rolagem, alternância da tela simulada, definição inline do termo,
teste-se com feedback, concluir aula → cartões no revisar, revisão (mostrar resposta / avaliar), menu, jornada,
Aa (tamanho e tema), práticas do curso, zero erro de JavaScript.

## Verificação final (ordem)

1. `montar-curso.py` → 2. `auditar-curso.cjs` (todas ≥9) → 3. `testar-motor.cjs` (tudo OK) →
4. leitor simulado por aula (`TESTE-HUMANO.md` §1) e correções → 5. capturas de tela no celular e no desktop
nos 3 temas, olhadas uma a uma → 6. teste humano quando houver pessoas (`TESTE-HUMANO.md` §2).
