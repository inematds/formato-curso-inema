# Esquema do conteúdo — INEMA Learning v7.2

Tudo que o aluno vê sai de JSON. Campos de texto aceitam `<b>`, `<code>`, `<a>` e `<br>`; o conteúdo dos blocos de código é escapado pelo gerador. Exemplos reais completos em `examples/`.

## `conteudo/pt/curso.json`

| campo | o que é |
|---|---|
| `id` | = nome da pasta/repo; prefixo das chaves do navegador (progresso, notas) |
| `lang` | `pt-BR` |
| `url` | `https://inematds.github.io/<id>/` (com barra no fim) |
| `nome`, `sub`, `icone` | nome no topo e na barra lateral; `icone` = chave de `ICONES` em `gerar.py` |
| `volta` | `{t, href}` — link "voltar" no alto da barra lateral (área do eventos, curso-mãe…) |
| `lado_card` | `{rot, t, texto, link, href}` — cartão no pé da barra lateral |
| `rodape` | HTML do rodapé (manter "INEMA.CLUB · conteúdo aberto e gratuito · formato INEMA Learning v7.2") |
| `videos` | `{chave: {titulo, duracao, mp4, poster, vtt, pagina}}` — `mp4` é URL publicada (release do GitHub); `poster` e `vtt` são caminhos locais em `assets/` |
| `inicio` | página inicial: `kicker`, `titulo`, `lead`, `cta`, `cta2 {t, href}`, `capa_alt`, `numeros [{v, t}]`, `aulas_titulo`, `aulas_sub`, `blocos [{t, itens[]}]` (ex.: "Para quem é" / "O que você sai fazendo") |
| `ui` | textos de interface — copiar do modelo e não mexer (só traduzir em EN/ES) |

## `conteudo/pt/aulas/NN-<slug>.json` (uma aula por arquivo, ordem pelo nome)

| campo | regra |
|---|---|
| `slug` | pasta da aula (`aulas/<slug>/`) e nome da foto `assets/img/hero/<slug>.jpg` |
| `num`, `menu` | número; rótulo curto no menu do topo (1–2 palavras) |
| `titulo`, `titulo_curto` | título da aula; versão curta da barra lateral |
| `minutos` | duração honesta (10–20) |
| `lead` | ≤ 70 palavras — o porquê da aula |
| `objetivo` | **uma linha, ≤ 160 caracteres**, começa com verbo ("montar…", "decidir…") |
| `competencias` | lista de 2–4 competências (vira `data-competencias`) |
| `aprende` | `[{t}]` 3–4 itens "Nesta aula você vai" |
| `hero_alt` | texto alternativo da foto |
| `secoes` | lista de seções (abaixo). Toda seção tem `tipo`, `titulo` e opcional `sub` |

## Tipos de seção

**`diagrama`** — sempre a 1ª seção. `nos` (≥ 3) `[{titulo, sub?, icone, forte?, detalhe, itens? [{t, sub?, icone}]}]`; `detalhe` aparece ao clicar. Opcionais: `estilo` (`fluxo` padrão, `escada`), `volta` (texto da seta de retorno, para ciclos), `legenda`, `dica`. `rolagem: true` = rolagem guiada (diagrama preso no topo, cada nó vira uma etapa); `rolagem_fim {titulo, texto, curto}` acende tudo no fim. Nó com `icone: "usuario"` mostra a foto `assets/img/voce.jpg` se existir.

**`passos`** — `passos [{titulo, sub?, texto [parágrafos], exemplo? {rot, texto}}]`, abas numeradas (até 4 por linha).

**`codigo`** — `blocos [{rot, icone?, conteudo}]` cada um com botão copiar. Opcional `saida {selo: "simulacao"|"real", abas [{rot, html}]}` mostra o resultado ao lado. Use `selo: "real"` só se a saída foi capturada de verdade.

**`pratica`** — `exercicios [{id, titulo, min, dias?, texto, pronto}]`; `pronto` = "pronto quando" verificável (o aluno consegue conferir sozinho). Opcional `fonte`. Checkbox conta na barra "prática".

**`simfila`** — simulação de fila (entrada/rodando/feito/falhou) com interromper e retomar: `tarefas[]`, `falha` (índice que falha na 1ª execução), `rot {...}`, `msg {...}`, `legenda`. Ver `examples/aula-com-simulacao.json`.

**`video`** — `chave` de `curso.videos`.

**`quiz`** — `perguntas [{p, opcoes[], certa (índice), explica, ref? (tipo de seção para "rever"), cert?}]`. 3–5 perguntas; `explica` comenta por que a certa é certa e o erro comum.

**`resumo`** — `itens [{t, texto}]`.

**`texto`** — `paragrafos[]` (use pouco; prefira visual).

**`mapa`** e **`gerador`** — aula de plano/fechamento: `mapa.degraus [{aula, titulo, sub, quando, icone, passo, saida}]` lê a prática das aulas citadas; `gerador` monta plano datado (.md + .ics). Ver `examples/aula-mapa-gerador.json`.

**`links`** — `links [{t, href, icone?}]`; sai como "Para ir além" no fim, sem número.

## Precisa de uma simulação nova?

Só existe `simfila`. Se a aula pede outra interação (ex.: montar um roteiro, conferir um portão), acrescente um tipo novo no `gerar.py` do curso (`sec_<tipo>`) + o comportamento em JS num arquivo próprio (`assets/<curso>.js`), sem editar `v71.js`/`v72.js`. Se ficar bom, traga para o motor da skill e registre no CHANGELOG.
