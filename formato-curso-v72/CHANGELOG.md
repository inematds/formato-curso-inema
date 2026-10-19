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
