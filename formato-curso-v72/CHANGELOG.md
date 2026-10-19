# CHANGELOG — formato-curso-v72

## 7.2.0 — 19/10/2026
- Skill criada a partir do curso `do-chat-ao-agente-v72` (primeiro curso v7.2, publicado 18/10/2026).
- Motor: `gerar.py` igual ao do curso; `validar.py` lê a própria URL do `curso.json` (antes fixa) e passa a exigir `capa.jpg`, `hero/inicio.jpg` e `hero/<slug>.jpg`.
- Novos: `scripts/novo-curso.sh` (cria curso a partir do motor), `scripts/conferir-tela.cjs` (HTTP local, 1366 e 390 px, transbordo, diagrama, quiz, erros JS, capturas).
- Referências: `ESQUEMA.md`, `LICOES.md`; exemplos de aula reais em `examples/`.

## 7.2.1 — 19/10/2026
- `v71.js`: o `.ics` do gerador de plano sai como `plano-<id-do-curso>.ics` (antes fixo `plano-do-chat-ao-agente.ics`; achado no curso de Filas).
- SKILL.md: capa aceita 1400×788 (padrão do v72).

## 7.3.1 — 19/10/2026
- EN/ES: `gerar.py --lang` grava em `en/`/`es/` com os arquivos da raiz (`ativo()`), seletor PT · EN · ES no topo, `hreflang`, og:image e fotos por idioma quando existirem (`capa-en.jpg`), progresso separado por idioma.
- Novo `scripts/traduzir.py` (Codex da assinatura, por texto, com validação e cache).
- `conferir-tela.cjs` abre também `en/` e `es/` e acusa imagem quebrada; `validar.py` ignora links para o próprio site em qualquer idioma.
- Topo: nome do curso encurta com reticências em vez de passar por baixo dos botões.

## 7.4.1 — 19/10/2026
- `traduzir.py`: tradução pelo **Sonnet 5.5 da assinatura** (`claude -p --model claude-sonnet-5-5`, sem ferramentas) como padrão; `--motor codex` mantém o caminho antigo. Remove `ANTHROPIC_API_KEY` do ambiente do subprocesso (nunca API).
- `traduzir.py --publico "..."`: o público do pedido de tradução deixa de ser fixo no do-chat-ao-agente.
- `sec_video`: pôster também usa a versão por idioma quando existir (`seq1-oswork-en.jpg`).

## 7.4.2 — 19/10/2026
- `traduzir.py`: usa o **tradutor central** (`~/projetos/wifi/scripts/inema-traduz`); motor e modelo vêm de `INEMA_TRADUCAO_MOTOR`/`INEMA_TRADUCAO_MODELO` (ambiente → `~/.config/inema/modelos.env`, hoje Sonnet 5.5). `--motor`/`--modelo` só sobrescrevem quando passados. Fora da máquina do Nei, cai no `claude -p`/`codex exec` da assinatura com o mesmo padrão.

## 7.5.1 — 19/10/2026
- Tipo novo **`simconversa`** (conversa com cliente simulado, piloto no curso `formacao-vendas-ia-consultoria-v72`, aula 2): `sec_simconversa` no `gerar.py` + `assets/v72-conversa.js` e `v72-conversa.css` (só nas aulas que usam o tipo; tema escuro e papel pelas variáveis; botões de verdade e foco visível; placar sobre o melhor caminho; recomeçar; conclusão gravada em `<curso>:conv:<slug>-s<N>`).
- `gerar.py`: constante `VERSAO` e `<meta name="generator" content="INEMA Learning 7.5.1">`; `cabeca()` aceita CSS extra; textos da conversa em `ui.conv_*` com padrão em `CONV_UI`.
- `validar.py`: confere cada simconversa (início, destinos, 2–4 opções, nota inteira, alcançabilidade, sem laço, fim com texto).
- `conferir-tela.cjs`: percorre a simconversa até o placar, testa recomeçar e a gravação, e captura `<aula>-conversa-<W>.png`.
- `traduzir.py`: pula `vai` e `nota`, pula `inicio` quando é id; ids com `_` contam como slug; `UI_PADRAO` ganha as chaves `conv_*`; tradução que perde marcador `{p}`/`{m}`/`{n}` é recusada.
- Modelo: `ui` com as chaves `conv_*`. Novo `examples/aula-simconversa.json`. Regressão: `do-chat-ao-agente-v72` gera e valida em PT/EN/ES com o motor novo (só muda o meta generator).
- `traduzir.py`: linha de comando dos blocos de código só conta com o comando como palavra inteira (antes "Deliver" casava com `del` e a tradução era recusada).
- `conferir-tela.cjs`: esconde `.topo`/`.skip` só durante a captura da simconversa (a captura maior que a tela desenhava os elementos fixos por cima).

## 7.5.2 — 19/10/2026
- `traduzir.py`: `del`, `set`, `type`, `copy`, `export` e `dir` só contam como linha de comando se o próximo token parece caminho, opção ou variável (tem `. / \ - = $ % :` ou aspas). Em espanhol, uma linha de prompt começando por "del problema…" era lida como o comando `del` e a tradução era recusada 3 vezes (achado no curso `formacao-vendas-ia-primeiro-cliente-v72`).

## 7.5.3 — 19/10/2026
- `validar.py`: acusa tag desconhecida no texto visível fora de bloco de código (ex.: placeholder `<o gatilho>` num `exemplo.texto`). O navegador lê `<o gatilho>` como tag e o trecho some da tela; o tradutor também recusava a frase por "tags diferentes". Lista de tags HTML/SVG conhecidas em `TAGS_HTML`; elementos com `-` passam. Regressão: `do-chat-ao-agente-v72`, `formacao-vendas-ia-consultoria-v72`, `-fundamentos-v72` e `-primeiro-cliente-v72` continuam OK em PT/EN/ES (achado no `formacao-vendas-ia-masterclass-v72`).

## 7.5.4 — 19/10/2026
- `gerar.py` + `v72.css`: campo opcional `inicio.cursos` — seção "Os N cursos completos" na página inicial, logo depois dos números, com cartão (capa 16:9, rótulo, título, resumo, "Abrir o curso") para cada curso da formação. `href_idioma: true` faz `en/` e `es/` apontarem para a versão traduzida do curso irmão; `img` aceita `-en`/`-es`. Classes próprias (`.ini-curso`), sem conflito com o progresso das aulas. Pedido do Nei na visão geral `do-chat-ao-agente-v72` ("e o link para os cursos"): antes os cursos completos só apareciam no fim de cada aula.

## 7.5.5 — 19/10/2026
- `gerar.py` (`figura_rolagem`): a aba da rolagem guiada tira o "N · " do começo do título quando ele repete o número da própria aba. Antes, nó com título "2 · Recebe" virava a aba "2 · 2 · Recebe" (o exemplo `aula-rolagem-guiada.json` numera os nós). Achado no piloto `gestao-ia-agentes-v72` (Formação Gestão de IA 2027, G3). Regressão: `do-chat-ao-agente-v72` gera igual, exceto o meta generator e as abas numeradas.

## 7.5.6 — 19/10/2026
- `validar.py`: "TODO" só conta como sobra se for palavra inteira. Link para `docs/METODO.md` (método inemaSEO) dava "sobra 'TODO'" em 3 aulas (achado no piloto `formacao-inemaseo-fundacao-v72`). As outras sobras (`[Nome`, `lorem`, `undefined`…) continuam por trecho.

## 7.5.7 — 19/10/2026
- `v71.css`: saída de terminal dentro da aba de saída do `codigo` — `.saida-corpo pre` com rolagem horizontal, fonte mono e fundo escuro (antes o `<pre>` não tinha estilo e era cortado pelo `overflow:hidden` da `.saida`); `.saida-corpo table/th/td` para tabela de números medidos; `.saida-tabs` quebra linha com 3 abas no celular.
- `v71.css`: `code` inline com `overflow-wrap:anywhere`. Um "pronto quando" com one-liner longo (`python3 -c "import json,os;…"`) transbordava a página em 390 px (762 > 390) e em 1366 px. Achado no piloto `loop-r-eng-execucao-longa-v72` (Formação LOOP-R Engenharia, curso 2), que mostra saída real do kit em `<pre>`. Regressão: só CSS; `pre` com `white-space:pre` não muda.

## 7.6.7 — 19/10/2026
- `gerar.py` (`sec_video`): vídeo por idioma. Campo opcional `videos.<chave>.idiomas.<lang>` com `mp4`, `vtt`, `duracao` e `pagina`; em `en/` e `es/` o player usa a versão do idioma (legenda com `srclang`/rótulo certos) e, sem ela, continua no vídeo PT com legenda PT. O `traduzir.py` já pula `mp4`/`vtt` (PULA), então as URLs e caminhos ficam intactos. Antes o EN/ES tocava o vídeo PT com legenda PT mesmo quando havia versão traduzida publicada. Achado no curso `loop-r-eng-base-v72` (Formação LOOP-R Engenharia, curso 0: vídeos AI harness e LOOP-R trilha 2, ambos com EN/ES). Regressão: curso sem `idiomas` gera o mesmo HTML (só o meta generator).

## 7.6.8 — 19/10/2026
- `scripts/novo-curso.sh`: cria o repositório git do curso já na branch `main` (`git init -b main`, só se ainda não houver `.git`). Com `git init` sem `-b`, o `gh repo create --source . --push` subia `master` e o `POST .../pages` com `source[branch]=main` respondia 422 ("The main branch must exist"); era preciso renomear, trocar a branch padrão e apagar a `master` remota. Achado no curso `gestao-ia-processos-v72` (Formação Gestão de IA 2027, G2). Motor (`gerar.py`, `validar.py`, assets) sem mudança.

## 7.6.9 — 19/10/2026
- `scripts/traduzir.py` (`problema`): tradução igual ao original, com mais de 40 caracteres e palavra portuguesa ("não", "você", "está", "-ção"…), passa a ser recusada ("igual ao original") e vai para a nova tentativa, em vez de entrar no cache e sair em PT no `en/`/`es/` com "0 textos sem tradução". Achado duas vezes no mesmo dia: no `formacao-inemaseo-medicao-v72` (frase cheia de citações no ES) e no G4 `gestao-ia-recursos-v72` (os 3 blocos de código da aula 3 voltaram em PT no EN). Nomes próprios e textos curtos idênticos continuam aceitos. Motor (`gerar.py`, `validar.py`, assets) sem mudança.

## 7.6.10 — 19/10/2026
- `scripts/traduzir.py` (`problema`): em bloco de código, a regra "igual ao original" (7.6.9) só olha os comentários (`# …`, `// …`). Bloco de código puro com "não" numa string (ex.: `'sim' if escreve else 'não'`, que tem de ficar igual para bater com a saída capturada) era recusado 3 vezes e ficava "sem tradução válida" em EN e ES. Comentário em PT devolvido igual continua recusado; prosa não muda. Achado no `loop-r-eng-multiagente-v72` (Formação LOOP-R Engenharia, curso 3, aula 2).

## 7.7.10 — 19/10/2026
- Novo `scripts/resolver-kit.py`: em curso técnico com `kit/`, o JSON das aulas usa marcadores `@@bloco:<nome>@@` (texto de `kit/blocos/<nome>.sh`), `@@arquivo:<caminho>@@` (arquivo do kit) e `@@saida:<nome>@@` (`<pre>` escapado de `kit/saidas/<nome>.txt|.md`); o script troca em lugar e confere bloco "Terminal …" × `kit/blocos/*.sh` e "Arquivo · kit/X" × `kit/X` (`--conferir`, saída 1 se divergir). O bloco copiável e a saída capturada passam a nascer do arquivo rodado, em vez de colados à mão. SKILL.md (passo 4) cita o fluxo. Criado no `loop-r-eng-seguranca-v72` (Formação LOOP-R Engenharia, curso 4: 21 blocos). Motor (`gerar.py`, `validar.py`, assets) sem mudança.

## 7.8.10 — 19/10/2026
- `validar.py`: confere o viés do teste no curso inteiro (lê `conteudo/<lang>/aulas/*.json`, a partir de 8 perguntas). Erro quando a resposta certa está na mesma posição em mais de metade das perguntas, ou quando ela é a opção mais longa em mais de metade. Nos pilotos da Formação Gestão de IA a certa era a 2ª em 30 de 35 (G3) e 34 de 36 (G4), e a mais longa em 32 e 36: dava para acertar sem ler. Achado pelo revisor da formação durante o G5 `gestao-ia-governanca-v72` (certa em A/B/C/D 10/8/10/7; mais longa em 4 de 35). Cursos antigos que reprovarem: redistribuir as posições e igualar o tamanho das erradas.

## 7.7.11 — 19/10/2026
- `scripts/traduzir.py` (`problema`): a regra "igual ao original" (7.6.9) ignora o que está dentro de `<pre>` e `<code>` em texto HTML. Aba de saída que é só `<pre>` com a saída real em PT (ex.: "mudança não commitada preservada", que tem de ficar igual para bater com o terminal) era recusada 3 vezes e ficava "sem tradução válida" em EN e ES. Prosa em PT devolvida igual fora do `<pre>` continua recusada. Achado no `loop-r-eng-seguranca-v72` (Formação LOOP-R Engenharia, curso 4, aula 5). Motor (`gerar.py`, `validar.py`, assets) sem mudança.

## 7.8.11 — 19/10/2026
- `scripts/traduzir.py`: link para outro curso v7.x (`https://inematds.github.io/<repo>-v7N/…`) passa a levar à versão do mesmo idioma ao gravar `conteudo/<lang>/` (`…/<repo>-v72/en/`, `…/es/aulas/headless/`). O href continua igual dentro da tradução (a validação de links não muda); `assets/` e caminhos que já têm idioma ficam como estão. Antes, o aluno do EN/ES caía na raiz PT do curso irmão. O pedido de tradução também diz que placeholder `[…]` dentro de `<code>` é prosa e se traduz (`"[pedido]"` ficava em PT no EN/ES). Achado pela revisão da Formação LOOP-R Engenharia (cursos 1, 2 e 4). Motor (`gerar.py`, `validar.py`, assets) sem mudança.

## 7.8.12 — 19/10/2026
- `motor/gerar.py`: cartão de `inicio.cursos` com `href_idioma: true` não acrescenta `<lang>/` quando o href já termina em `/<lang>/` (o `traduzir.py` 7.8.11 já reescreve o link do curso irmão em `conteudo/<lang>/`; antes saía `…-v72/en/en/` → 404). Achado no loop-r-eng-aprende-v72.

## 7.9.12 — 19/10/2026
- Tipo novo **`conferidor`** (cursos sem terminal): o aluno cola ou carrega o arquivo de texto que escreveu (cartão, ficha, decupagem) e a própria página confere pelas regras do JSON — `campos`, `planos`, `cada_plano` (grupos de termos com sinônimos `a / b`, `um_so`, `variar`), `duracao`, `termos` — e responde `OK: …` ou a lista do que falta. Botões "Exemplo que passa" e "Exemplo com erro" (ensaio sem custo), carregar `.txt`, baixar o arquivo e rascunho guardado no navegador. `sec_conferidor` no `gerar.py` + `assets/v72-conferidor.js|css` (só nas aulas que usam o tipo); textos `conf_*` no `ui` (padrões em `CONF_UI`; o `traduzir.py` traduz).
- Novo `motor/conferir.py` (copiado para a raiz do curso pelo `novo-curso.sh`): o mesmo motor em Python — opção de terminal para o aluno (`python3 conferir.py <aula> arquivo.txt`, sai 0 quando passa) e base do `validar.py`, que agora exige em cada conferidor: exemplo passa, exemplo com erro falha, texto vazio falha.
- `conferir-tela.cjs`: clica nos dois exemplos de cada conferidor (o certo tem de responder com o prefixo do `ok`, o errado tem de falhar) e captura `<aula>-conferidor-<W>.png`.
- `gerar.py`: `VERSAO` passa a 7.9.12 (estava parada em 7.6.7). Piloto: `formacao-cinema-ia-direcao-v72` (Formação Cinema com IA, curso 0).

## 7.10.12 — 19/10/2026
- Vídeo vertical: `videos.<chave>.formato: "9:16"` põe a classe `vertical` no player (`sec_video`) e o `v71.css` desenha o vídeo em 9:16, até 360 px de largura e centrado, em vez de um short espremido no meio de uma caixa 16:9 (no celular de 390 px o short ficava com ~114 px de largura). Sem o campo, nada muda. Piloto: `formacao-webmcp-base-v72` (short WebMCP de 30 s, aula 1). `VERSAO` 7.10.12; ESQUEMA.md documenta o campo.

## 7.10.13 — 19/10/2026
- `scripts/resolver-kit.py`: resolve os marcadores de todas as aulas na memória e só depois grava. Antes, um `kit/saidas/<nome>.txt` faltando na aula 2 parava o script com as aulas anteriores já trocadas no disco e as seguintes ainda com `@@…@@` (estado misto: para refazer era preciso restaurar só parte dos JSON). Agora a falta aborta sem gravar nada (saída 1). Achado no `formacao-webmcp-mcp-v72` (Formação WebMCP, curso 1: a captura do `git clone` só existe depois de publicar). Motor (`gerar.py`, `validar.py`, assets) sem mudança.

## 7.10.14 — 19/10/2026
- `motor/assets/v71.css`: opção do teste (`.q-op`) quebra palavra longa (`overflow-wrap:anywhere`, `min-width:0`) e a grade `.q-ops` passa a `minmax(0,1fr)`. Uma opção com nome de API inteiro (`document.modelContext.unregisterTool(nome).`) esticava o botão para 418 px e a aula transbordava no celular de 390 px; o texto não quebrava porque o nó de texto é item flex com `min-width:auto`. Conferido com a mesma opção depois da correção: `conferir-tela.cjs` OK. `VERSAO` 7.10.14. Achado no piloto `formacao-webmcp-site-v72` (Formação WebMCP, curso 2, aula 4).

## 7.11.14 — 19/10/2026
- Conferidor: grupo de `cada_plano` aceita `min` — rótulo como `som:` ou `efeito:` só conta com pelo menos N letras depois dele, até o próximo `|` (antes, `som:` vazio passava). A duração do plano passa a ser lida primeiro na coluna que é só `N s`; "2 s de silêncio" na descrição deixa de ser somado no lugar dela. Mesma mudança em `conferir.py` e `assets/v72-conferidor.js`. Achado pelo revisor independente do `formacao-cinema-ia-direcao-v72`.
