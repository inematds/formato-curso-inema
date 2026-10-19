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
