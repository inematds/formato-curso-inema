---
name: formato-curso-v71
disable-model-invocation: true
description: >-
  curso INEMA Learning v7.1 — layout de plataforma (barra lateral com aulas e progresso de estudo e de
  prática, área central larga, tema escuro/papel) com a didática v7: objetivo em uma linha, diagrama
  clicável primeiro (rolagem guiada opcional), texto curto, simulação onde ensina, modelos com botão
  copiar, prática com "pronto quando" e teste com resposta comentada. Conteúdo em JSON → gerar.py.
  Base da v7.2, SEM a camada de estudo (gaveta de desempenho/anotações/cópia .json, foto do "Você",
  foto por aula, botão sol/lua). Para curso novo prefira a v7.2; use esta quando pedirem "v7.1"
  ou para manter cursos v7.1.
---

# Formato Curso v7.1 — INEMA Learning

**Curso de referência:** https://inematds.github.io/do-chat-ao-agente-v71/ — repo `~/projetos/do-chat-ao-agente-v71`.

Mesmo método da v7.2 (`~/.claude/skills/formato-curso-v72/SKILL.md`): leia de lá o passo a passo e as regras de escrita. Muda só isto:

| | v7.1 | v7.2 |
|---|---|---|
| CSS/JS | `v71.css` + `v71.js` | `v71.*` + `v72.*` por cima |
| Imagens obrigatórias | `assets/img/capa.jpg` | capa + `hero/inicio.jpg` + `hero/<slug>.jpg` por aula |
| Página inicial | cartões das aulas | abertura com foto, lista editorial com foto e ✓ |
| Barra lateral | progresso de estudo e prática | + gaveta "seu estudo" (desempenho nos testes, anotações no texto, exportar/importar .json) |
| Diagrama | ícone por nó | + número da etapa e foto `voce.jpg` no nó "Você" |
| Topo | Aa (tema e tamanho) | + botão sol/lua |

## Passo a passo resumido
1. `scripts/novo-curso.sh ~/projetos/<repo> "<Nome>"` (motor v7.1).
2. Conteúdo em `conteudo/pt/curso.json` + `conteudo/pt/aulas/NN-<slug>.json` — esquema em `references/ESQUEMA.md` (ignore `voce.jpg` e as fotos por aula, que são da v7.2). Exemplos reais em `examples/`.
3. Portão: `python3 gerar.py && python3 validar.py --links` e `node ~/.claude/skills/formato-curso-v71/scripts/conferir-tela.cjs .`.
4. Publicar: autor `inematds <inematds@gmail.com>`, repo `inematds/<pasta>`, Pages da raiz da main, URL → 200.

Lições: `references/LICOES.md` (valem para as duas versões).
