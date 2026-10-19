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
| `videos` | `{chave: {titulo, duracao, mp4, poster, vtt, pagina}}` — `mp4` é URL publicada (release do GitHub); `poster` e `vtt` são caminhos locais em `assets/`; opcional `idiomas {en: {mp4, vtt, duracao, pagina}, es: {…}}` (7.6.7) troca o vídeo e a legenda em `en/`/`es/`; opcional `formato: "9:16"` (7.10.12) para short/reel vertical: player estreito e centrado em vez de faixas pretas no 16:9 |
| `inicio` | página inicial: `kicker`, `titulo`, `lead`, `cta`, `cta2 {t, href}`, `capa_alt`, `numeros [{v, t}]`, `aulas_titulo`, `aulas_sub`, `blocos [{t, itens[]}]` (ex.: "Para quem é" / "O que você sai fazendo"); opcional `cursos {titulo, sub, abrir, itens [{rot, t, l, href, href_idioma, img}]}` — cartões para os cursos completos de uma formação, logo depois dos números (7.5.4; `href_idioma: true` leva `en/`/`es/` ao curso irmão traduzido; `img` 16:9, aceita `-en`/`-es`) |
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

**`simconversa`** (7.5.1) — conversa com cliente simulado: o cliente fala, o aluno escolhe uma de 2–4 respostas, vê o comentário (com rótulo "Boa escolha" / "Dá para melhorar" / "Escolha fraca", não só cor) e o caminho segue conforme a escolha, até um fim com placar, lição e "recomeçar". Campos: `personagem {nome, papel?}`, `inicio` (id da 1ª fala), `falas {id: {...}}`, `licao`. Fala comum: `{cliente, opcoes: [{t, vai, nota, comenta}]}` — `vai` = id da próxima fala, `nota` inteiro (0 = fraca, a maior da fala = boa, o meio = "dá para melhorar"). Fala final: `{fim: true, titulo?, texto}`. Ids das falas: minúsculas, `-` ou `_` (o tradutor pula). O placar é a soma das notas do caminho sobre o **melhor caminho possível**. Grava no navegador `<id do curso>:conv:<slug>-s<N>` (`{feito, pontos (melhor), max, ultimo, data}`). `validar.py` cobra: início existe, todo `vai` existe, 2–4 opções completas por fala, nota inteira, toda fala alcançável, sem laço, fim com texto. `conferir-tela.cjs` percorre até o placar, testa "recomeçar" e captura `<aula>-conversa-<W>.png`. JS/CSS em `assets/v72-conversa.js|css`, incluídos só nas aulas que usam o tipo. Textos de interface: chaves `conv_*` do `ui` (padrões em `CONV_UI` do `gerar.py`). Ver `examples/aula-simconversa.json`. Dica: a fala do cliente é ficção rotulada como simulação; o que ela ensina tem de vir da fonte.

**`conferidor`** (7.9.12) — o aluno cola (ou carrega o `.txt`) o arquivo que escreveu (ficha, cartão, decupagem) e a página confere; para curso **sem terminal**, é o que torna o "pronto quando" verificável. Campos: `arquivo` (nome sugerido, botão "baixar"), `rot?` (rótulo da caixa), `modelo?` (placeholder), `regras []`, `ok` (resposta quando passa, com `{n}` = nº de planos ou de campos e `{s}` = segundos somados; ex.: `"OK: {n} planos com tamanho, ângulo, movimento e som · {s} s"`), `exemplo` (texto que passa = ensaio sem custo) e `exemplo_errado` (texto que falha). Regras: `{tipo:"campos", campos:[rótulos], min}` (linha `Rótulo: texto` com ≥ min letras) · `{tipo:"planos", min, max}` (linhas que começam por número: `1 | …`, `2. …`) · `{tipo:"cada_plano", grupos:[{rot, termos, um_so?, variar?}]}` (cada plano cita um termo de cada grupo; `min: N` num grupo-rótulo (`"som:"`) exige N letras depois dele até o próximo `|`, desde 7.11.14; a duração do plano é a coluna que é só `N s`, se houver; `"close / close-up / primeiro plano"` = sinônimos, contam como um; termo dentro de termo maior não conta; `um_so` reprova 2+ do grupo no mesmo plano; `variar: N` exige N famílias diferentes no conjunto) · `{tipo:"duracao", min, max}` (cada plano tem `N s`; soma entre min e max) · `{tipo:"termos", grupos:[{rot, termos}]}` (o texto todo cita um de cada grupo). Mensagens: chaves `conf_*` do `ui` (padrões em `CONF_UI` do `gerar.py`; marcadores de uma letra `{c} {g} {i} {n} {s} {x} {y}`, que o `traduzir.py` preserva). `validar.py` roda as regras em Python (`conferir.py`, copiado para a raiz do curso) e exige: exemplo passa, exemplo com erro falha, vazio falha. `conferir-tela.cjs` clica nos dois exemplos e captura `<aula>-conferidor-<W>.png`. Quem tem terminal confere o mesmo arquivo com `python3 conferir.py <aula> meu-arquivo.txt` (sai 0 quando passa). O "pronto quando" cita a resposta literal (`OK: 6 planos com …`). Dica: escreva os termos em PT e, quando o uso comum for o inglês, junte o termo inglês na mesma família (`"plongée / câmera alta / high angle"`); depois de traduzir, o conferir-tela em `en/` e `es/` prova que os rótulos e termos sobreviveram.

**`video`** — `chave` de `curso.videos`.

**`quiz`** — `perguntas [{p, opcoes[], certa (índice), explica, ref? (tipo de seção para "rever"), cert?}]`. 3–5 perguntas; `explica` comenta por que a certa é certa e o erro comum.

**`resumo`** — `itens [{t, texto}]`.

**`texto`** — `paragrafos[]` (use pouco; prefira visual).

**`mapa`** e **`gerador`** — aula de plano/fechamento: `mapa.degraus [{aula, titulo, sub, quando, icone, passo, saida}]` lê a prática das aulas citadas; `gerador` monta plano datado (.md + .ics). Ver `examples/aula-mapa-gerador.json`.

**`links`** — `links [{t, href, icone?}]`; sai como "Para ir além" no fim, sem número.

## Precisa de uma simulação nova?

Existem `simfila` e `simconversa`. Se a aula pede outra interação (ex.: montar um roteiro, conferir um portão), acrescente um tipo novo no `gerar.py` do curso (`sec_<tipo>`) + o comportamento em JS num arquivo próprio (`assets/<curso>.js`), sem editar `v71.js`/`v72.js`. Se ficar bom, traga para o motor da skill e registre no CHANGELOG.
