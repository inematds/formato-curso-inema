---
name: formato-curso-v72
disable-model-invocation: true
description: >-
  curso INEMA Learning v7.2 — layout de plataforma (barra lateral com aulas, progresso de estudo e de
  prática, gaveta "seu estudo" com desempenho nos testes, anotações e cópia .json; área central larga;
  tema escuro/papel) com a didática v7: objetivo em uma linha, diagrama clicável primeiro (com rolagem
  guiada opcional), texto curto, simulação onde ensina, modelos com botão copiar, prática com "pronto
  quando" e teste com resposta comentada. Conteúdo em JSON → gerar.py monta HTML estático (uma página
  por aula), validar.py + conferir-tela.cjs são o portão. Use quando o usuário pedir "curso v7.2",
  "formato v72", "curso no formato do do-chat-ao-agente". v7.1 é a base sem a camada de estudo.
---

# Formato Curso v7.2 — INEMA Learning

**Uma frase:** cada aula começa por um diagrama que o aluno clica para entender, lê pouco, copia o modelo pronto, faz a prática até o "pronto quando" ser verdade e confere no teste comentado — tudo num layout de plataforma que guarda o progresso no navegador.

**Curso de referência (publicado):** https://inematds.github.io/do-chat-ao-agente-v72/ — repo `~/projetos/do-chat-ao-agente-v72`. Na dúvida sobre como algo fica, abra lá.

## Antes de escrever
1. `references/ESQUEMA.md` — campos de `curso.json`, de cada aula e de cada tipo de seção.
2. `references/LICOES.md` — o que já foi reprovado.
3. `examples/*.json` — aulas reais (diagrama+código+prática, simulação de fila, conversa simulada com cliente, rolagem guiada, mapa+gerador).
4. `~/projetos/inema-design/DESIGN.md` — design INEMA (cores, fontes, imagem).

## Passo a passo
1. **Criar a pasta:** `scripts/novo-curso.sh ~/projetos/<repo> "<Nome>"` — copia o motor (`gerar.py`, `validar.py`, `assets/v71.*`, `assets/v72.*`, `assets/v72-conversa.*`), um `curso.json` modelo com `ui` pronto e o `CLAUDE.md` com as lições. Nome da pasta = nome do repo.
2. **Plano (curto, antes do conteúdo):** 6–8 aulas; para cada uma, objetivo em uma linha + que diagrama + qual prática com "pronto quando". Conteúdo vem da fonte (repo, guia, área do eventos) — não inventar fato, comando nem número.
3. **Escrever** `conteudo/pt/curso.json` e `conteudo/pt/aulas/NN-<slug>.json`. Ordem típica de uma aula: `diagrama` → `passos` → `codigo` → `simfila` ou `simconversa` (se ensina) → `pratica` → `video` → `quiz` → `resumo` → `links`.
4. **Imagens** (obrigatórias, o validador cobra): `assets/img/capa.jpg` (og:image; 1400×788 como no v72, ou 1200×630 se o texto da arte couber), `assets/img/hero/inicio.jpg` e `assets/img/hero/<slug>.jpg` por aula (1536×1024). A capa segue o padrão do curso do Terminal (DESIGN.md V15: foto calma, título em serifa branca, nada de letra grande amarela); anexe `do-chat-ao-agente-terminal-v72/assets/img/capa.jpg` como referência de estilo. Geradas pelo Codex na assinatura (`codex exec` com image_gen), luz neutra, sem texto na imagem (fora a capa); flux2-klein local só como reserva. Opcional `assets/img/voce.jpg` (foto do nó "Você").
5. **Vídeos:** só já publicados (MP4 em release do GitHub + poster e `.vtt` locais). Avatar novo só com pedido do dono.
6. **Portão:**
   ```bash
   python3 gerar.py && python3 validar.py --links
   node ~/.claude/skills/formato-curso-v72/scripts/conferir-tela.cjs .
   ```
   `validar.py` cobra: objetivo ≤ 160 caracteres, diagrama com ≥ 3 blocos, botão copiar, quiz com resposta oculta, `data-competencias`, lead ≤ 70 palavras, parágrafo ≤ 75, nenhum `TODO`/`[Nome`/`undefined`, arquivos locais e imagens presentes, links externos 200. `conferir-tela.cjs` serve por HTTP local e abre início + cada aula em 1366 e 390 px: sem transbordo horizontal, diagrama e quiz respondem, sem erro de JS; capturas em `.telas/` (olhe pelo menos a página inicial e uma aula no celular).
7. **Publicar:** autor local do repo `inematds <inematds@gmail.com>`; `gh repo create inematds/<repo> --public --source . --push`; Pages da raiz da main; conferir `https://inematds.github.io/<repo>/` → 200. Portal só quando pedido (skill `atualiza-portal`).

## Regras de escrita (didática v7)
- **Objetivo** em uma linha, com verbo, que o aluno consiga dizer se atingiu.
- **Diagrama primeiro**: o conceito inteiro numa figura clicável; o texto vem depois e é curto.
- **Texto curto**: parágrafos de 2–4 frases; nada de parede de texto. Jargão explicado na primeira vez.
- **Simulação só onde ensina** (ex.: interromper e retomar uma fila) — não decorativa.
- **Modelos com copiar**: todo comando/prompt/arquivo que o aluno vai usar está num bloco `codigo`.
- **Prática com "pronto quando"** verificável pelo próprio aluno (um arquivo existe, um comando responde X, um post saiu com fonte).
- **Teste comentado**: cada pergunta explica a certa e o erro comum; `ref` aponta a seção para rever.
- Conteúdo aberto e gratuito (INEMA.CLUB); nada de "compre", "oferta".

## Outros idiomas (EN/ES) — 7.3
PT fica na raiz; EN e ES em `en/` e `es/`, reaproveitando `assets/` da raiz. O topo ganha o seletor PT · EN · ES e cada página ganha `hreflang`; o progresso do aluno fica separado por idioma.
1. `python3 ~/.claude/skills/formato-curso-v72/scripts/traduzir.py . en es --publico "<quem lê, em inglês>"` — traduz só os textos do JSON pelo **tradutor central** (`inema-traduz`, variável `INEMA_TRADUCAO_*` em `~/.config/inema/modelos.env`, hoje Sonnet 5.5 da assinatura; `--motor`/`--modelo` só se pedido; nunca API), em lotes, com validação por texto (tags, links, comandos dos blocos de código) e cache em `i18n/<lang>.json`. Grava `conteudo/en/` e `conteudo/es/`. Glossário extra opcional em `i18n/glossario.json`.
2. Imagem com texto desenhado (a capa, às vezes a foto de abertura): versão por idioma `capa-en.jpg`, `hero/inicio-es.jpg`… pelo Codex image_gen editando a original; o gerador usa sozinho quando existir. Conferir o texto com zoom.
3. `python3 gerar.py && python3 gerar.py --lang en && python3 gerar.py --lang es`, depois `python3 validar.py --links` + `--lang en` + `--lang es` e `conferir-tela.cjs .` (ele abre também `en/` e `es/`).
4. Varredura de sobras: nenhuma palavra PT comum ("você", "não", "aula") no texto visível de `en/` e `es/`.
5. Seção nova com JS próprio (`assets/<curso>.js`): todo texto dela vem do JSON, nunca fixo no JS; e o caminho dos arquivos usa `ativo(prefixo)`, não `prefixo`.

## O que não fazer
- Editar HTML gerado à mão (some no próximo `gerar.py`).
- Editar `v71.css/js` ou `v72.css/js` dentro de um curso para resolver algo local — crie `assets/<curso>.css/js`; se for melhoria do formato, traga para `motor/` da skill e registre no `CHANGELOG.md`.
- Validar por `file://`.
