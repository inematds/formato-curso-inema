# Changelog — formato-curso-v6

## 6.0.0 — 2026-09-24

Nova skill para iniciante 30+, a partir da análise `../ANALISE-V5-INICIANTE.md`. v5 e v2 ficam intocadas.

- **Visual "mostre, não simbolize":** tela de chat simulada com alternância entre casos, antes/depois com
  resultado real, passo a passo sobre a tela (`.janela` + `.pin`), cena ilustrada por aula (flux2-klein, sem texto,
  WebP ≤150 KB), cola da aula. Diagrama abstrato só para mecanismo sem tela. Sem trilho lateral: visual colado ao texto.
- **Leveza:** aula ~15 min, 3–4 steps, prosa ≤900 palavras, "Em 1 minuto", "Quer saber mais?" para nuance,
  pool de fixação reduzido (1 teste-se, 3–4 cartões, 1 reflexão por aula).
- **Primeira tela:** tema papel por padrão; barra com 3 botões (← trilha · Aa · ☰); dica de 1 linha no lugar do
  modal; "revisar" só aparece quando há pergunta vencida.
- **Motor:** progresso automático por rolagem; cartões entram na revisão só ao concluir a aula; termos abrem a
  definição abaixo do parágrafo (funciona no toque); textos do motor em `L` (traduzíveis).
- **Olhar humano:** `.calma` ("Se travou aqui, é normal"), `.psafe`, regras 9–17 aprendidas com o leitor simulado.
- **Portão medido:** `auditar-curso.cjs` (rubrica de 10 critérios, 3 temas, celular), `testar-motor.cjs`
  (26 comportamentos), `capturar-aulas.cjs`, leitor simulado e roteiro de teste humano (`TESTE-HUMANO.md`).
- **Montagem:** `montar-curso.py` gera `curso.html` e a lista de aulas da trilha e da landing a partir de `aulas/`.
- Piloto: `~/projetos/oswork-v6` (7 aulas, 10/10 no auditor, 26/26 no motor).
