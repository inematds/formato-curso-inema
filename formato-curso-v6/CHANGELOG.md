# Changelog — formato-curso-v6

## 6.2.1 — 2026-09-24

- Tradutor: o modelo traduzia o valor de `data-gl` (âncora do glossário) — agora é restaurado do PT na montagem
  (`fixa_ids`). Perfil técnico: não introduzir termo técnico ausente do original; glossário "never script/backup" desligado.
- Auditor, perfil técnico: `pre`/`code` ficam fora da varredura de jargão (o termo é cobrado na prosa).
- Landing com módulos: `h3.mod-tit` com estilo próprio.
- Verificado: tradução EN real do curso de teste → 10/10 em todas as aulas, motor 25/25, terminal idêntico, glossário ok.

## 6.2.0 — 2026-09-24

Tudo opcional pelo `curso.json`; sem os campos novos a montagem, o auditor e o tradutor dão o mesmo resultado da 6.1
(conferido em oswork-v6 e motion-rise: `curso.html`/`landing.html` idênticos, notas iguais, motor 26/26 e 25/25).
- **Sem limite de aulas.** O teto de 9 saiu; cada aula continua com ~15 min e ≤900 palavras.
- **Módulos** (`"modulos"`): trilha e landing agrupadas por módulo.
- **Material complementar** (`details.complementar`, depois do fecho): aprofundamento sem teto, fora do tempo e da
  contagem de palavras; aberto pelo auditor na checagem de legibilidade dos 3 temas.
- **Perfil técnico** (`"perfil": "tecnico"`, `"termos"`): critério 8 vira "todo termo técnico definido com `.gterm`
  na aula"; glossário gerado (`#glossario`, link "ver no glossário" na definição, item no menu); visual `.terminal`
  conta como visual real; prática pode ser no terminal; tradutor mantém termos técnicos e não traduz comandos.

## 6.1.0 — 2026-09-24

- Cenas pelo **Codex image_gen por padrão** (`gerar-cena.py --gerador auto`), fallback inemaimg/flux2-klein.
- Capa pela `capa-inema` com `--raw-in` da arte da trilha (evita cena inventada fora das regras).
- **Trilíngue:** `traduzir-curso.py` (EN/ES em `en/` e `es/`, nano via OpenRouter, cache, validação de tags/{n}/espaços,
  seletor de idioma no menu e na landing, estado separado por idioma). Textos do motor num bloco JSON único (`L-INICIO/L-FIM`),
  rótulo da promessa vindo do motor, rótulo "Na prática · X" gravado no HTML pela montagem.
- Versão no nome do curso em todas as superfícies.

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
