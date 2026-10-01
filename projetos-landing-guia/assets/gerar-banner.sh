#!/usr/bin/env bash
# gerar-banner.sh — banner promocional 16:9 pro hero do guia + topo do README,
# gerado pelo Codex CLI (image_gen), que escreve texto em português corretamente.
#
# Uso:
#   gerar-banner.sh --repo <pasta> --title "OPENAI DOTS" [--destaque "DOTS"] --sub "VALE A PENA?" \
#     --line "frase curta de apoio" --tiles "AUDITORIA,AGENTS.MD,NÚCLEO PORTÁTIL,SKILLS" \
#     [--sides "cena/elementos visuais"] [--estilo live|grade|opus] [--saida banner] [--lang pt|en|es] [--slug <repo>] [--dry-run]
#
# Estilos (padrão desde 2026-10-01: live):
#   live — como o banner "Hoje tem live" do portal: sans geométrica limpa, contraste de peso
#          (extra-bold × fino) em branco, a palavra de destaque enorme em dourado/âmbar,
#          texto à esquerda e cena cinematográfica com luz quente à direita. --tiles vira rótulos discretos.
#   grade — layout do banner antigo (título no topo, fileira de tiles com ícones, faixa INEMA.CLUB
#          embaixo) com cor/luz/tipografia das referências (ícones em traço dourado, como a capa do musicavideo).
#   live e grade anexam assets/referencias/ref-live.jpg e ref-musicavideo.jpg (codex exec -i) como referência de estilo.
#   opus — como o banner do guia claude-opus55: título em dourado metálico limpo, tiles com ícones.
#   Nunca fonte "de jogo" (condensada, inflada, cartunesca) — era o padrão antigo, abandonado.
#
# Saída: <repo>/guia/assets/<saida>.jpg (default banner.jpg) (JPG 1400px de largura, ~400-500 KB).
# Fallback: se codex não existir ou falhar, sai com 1 e NÃO cria o arquivo — o guia usa hero.png
# (a arte crua da capa, gerada pelo Codex desde 2026-09-21; flux só se o Codex falhar lá também).
# Custo: uma geração de imagem na conta OpenAI do Codex por chamada.
set -uo pipefail
while [ $# -gt 0 ]; do case "$1" in
  --repo) REPO="$2"; shift 2;; --title) TITLE="$2"; shift 2;; --sub) SUB="$2"; shift 2;;
  --line) LINE="$2"; shift 2;; --tiles) TILES="$2"; shift 2;; --sides) SIDES="$2"; shift 2;;
  --slug) SLUG="$2"; shift 2;; --destaque) DESTAQUE="$2"; shift 2;; --estilo) ESTILO="$2"; shift 2;; --saida) SAIDA="$2"; shift 2;; --lang) LANGB="$2"; shift 2;; --dry-run) DRY=1; shift;;
  *) echo "arg desconhecido: $1"; exit 2;; esac; done
: "${REPO:?--repo obrigatório}" "${TITLE:?--title obrigatório}" "${SUB:?--sub obrigatório}"
REPO="$(realpath "$REPO")"  # evita SLUG "." com --repo .
LINE="${LINE:-}"; TILES="${TILES:-}"; SLUG="${SLUG:-$(basename "$REPO")}"
ESTILO="${ESTILO:-live}"; DESTAQUE="${DESTAQUE:-${TITLE##* }}"  # default: última palavra do título
case "$ESTILO" in live|grade|opus) ;; *) echo "--estilo deve ser live, grade ou opus"; exit 2;; esac
SAIDA="${SAIDA:-banner}"; LANGB="${LANGB:-pt}"
case "$LANGB" in pt) IDIOMA="português";; en) IDIOMA="inglês";; es) IDIOMA="espanhol";; *) echo "--lang deve ser pt, en ou es"; exit 2;; esac
if [ "$ESTILO" = live ] || [ "$ESTILO" = grade ]; then
  SIDES="${SIDES:-um objeto 3D brilhante que representa o tema, sobre uma mesa ou pedestal num ambiente de estúdio escuro}"
else
  SIDES="${SIDES:-à esquerda um ícone 3D dourado representando o tema, à direita um ícone 3D azul-ciano complementar, ligados por um fluxo luminoso}"
fi
command -v codex >/dev/null || { echo "[banner] codex não instalado — fallback pro hero.png"; exit 1; }
command -v ffmpeg >/dev/null || { echo "[banner] ffmpeg ausente"; exit 1; }
PNG="$REPO/guia/assets/$SAIDA.png"; JPG="$REPO/guia/assets/$SAIDA.jpg"

HEAD_TXT="Use sua ferramenta de geração de imagem (image_gen) para criar UM banner promocional 16:9 no maior formato horizontal disponível e salve o PNG em guia/assets/$SAIDA.png dentro deste diretório. Não edite nenhum outro arquivo."
TAIL_TXT="Todo o texto da imagem em $IDIOMA, exatamente como dado acima (os textos já vêm traduzidos), sem erros de grafia, sem texto extra inventado. Ao terminar, responda só com o caminho do arquivo e o tamanho em pixels."
if [ "$ESTILO" = live ]; then
  RESTO="$(printf '%s' "$TITLE" | sed "s/$(printf '%s' "$DESTAQUE" | sed 's/[][\\/.*^$]/\\&/g')//" | sed 's/  */ /g;s/^ //;s/ $//')"
  TILES_TXT=""; [ -n "$TILES" ] && TILES_TXT="- Abaixo do filete, uma linha discreta de rótulos pequenos em branco fino, separados por ' · ': $(printf '%s' "$TILES" | sed 's/,/ · /g'). Sem caixas, sem ícones."
  PROMPT="$HEAD_TXT

As duas imagens anexadas são a REFERÊNCIA DE ESTILO aprovada (cores, luz, tipografia e acabamento): copie o estilo, NUNCA o conteúdo, as pessoas, os logos ou os textos delas.
Estilo: thumbnail cinematográfica premium como 'HOJE TEM LIVE' e a capa do INEMA MUSICAVIDEO. Cor e luz como nas referências: fundo preto com luz cinematográfica quente âmbar e laranja (luzes de palco, bokeh, reflexos), cena com cor viva e contraste alto, podendo ter pontos de cor do tema (telas, luzes) — nem monocromática cinza, nem toda dourada. Letras brancas limpas e letras em dourado/âmbar com gradiente suave e brilho leve, como 'MUSICAS' e 'ESCALA' na referência; nada de letras cromadas, neon ou supersaturadas, sem neon azul, sem foto de pessoa.
Tipografia: sans-serif geométrica limpa e moderna (tipo Montserrat / Gotham), NUNCA fonte de jogo, condensada, inflada ou cartunesca. Contraste de pesos: palavras em branco alternando extra-bold e fino (thin), como 'HOJE' extra-bold e 'TEM' thin. A palavra de destaque em caixa alta, enorme, em dourado metálico chanfrado com brilho sutil e reflexo de luz, ocupando a maior parte da largura do bloco de texto.
Layout: bloco de texto alinhado à esquerda ocupando cerca de 55% da largura; à direita, cena fotorrealista com profundidade de campo: $SIDES, iluminação quente âmbar/laranja de palco ou estúdio.

Conteúdo:
$( [ -n "$RESTO" ] && echo "- Acima do destaque, em branco (misturando extra-bold e thin): '$RESTO'." )
- Destaque enorme em dourado: '$DESTAQUE'.
- Abaixo, em branco extra-bold menor: '$SUB'.
$( [ -n "$LINE" ] && echo "- Uma linha em branco thin: '$LINE'." )
- Um filete dourado fino horizontal sob o bloco de texto.
$TILES_TXT
- No canto inferior esquerdo, pequeno e discreto, em branco thin: 'INEMA.CLUB · inematds.github.io/$SLUG'.
$TAIL_TXT"
elif [ "$ESTILO" = grade ]; then
  TILES_TXT=""; [ -n "$TILES" ] && TILES_TXT="- Fileira horizontal de cartões, um por item, como a fileira de ícones da referência MUSICAVIDEO: cartões escuros semitransparentes com borda fina dourada/âmbar, ícone em traço dourado com leve brilho e legenda em branco (sans bold limpa): $TILES."
  PROMPT="$HEAD_TXT

As duas imagens anexadas são a REFERÊNCIA DE ESTILO aprovada (cores, luz, tipografia e acabamento): copie o estilo, NUNCA o conteúdo, as pessoas, os logos ou os textos delas.
Estilo: mesmo layout dos banners clássicos do INEMA (título no topo, subtítulo, fileira de cartões com ícones, faixa inferior), com o acabamento da capa INEMA MUSICAVIDEO e do 'HOJE TEM LIVE'.
Cor e luz como nas referências: fundo preto com luz cinematográfica quente âmbar e laranja (luzes de palco, bokeh, reflexos), cena com cor viva e contraste alto, podendo ter pontos de cor do tema (telas, luzes) — nem monocromática cinza, nem toda dourada. Letras brancas limpas e letras em dourado/âmbar com gradiente suave e brilho leve, como 'MUSICAS' e 'ESCALA' na referência; nada de letras cromadas, neon ou supersaturadas, sem neon azul, sem foto de pessoa.
Tipografia: sans-serif geométrica limpa e moderna (tipo Montserrat / Gotham), NUNCA fonte de jogo, condensada, inflada ou cartunesca. Título centralizado no topo com contraste de pesos: a palavra de destaque enorme em dourado metálico chanfrado com brilho sutil, as demais palavras do título em branco extra-bold ou thin. Subtítulo em branco extra-bold; linha de apoio em branco thin.

Conteúdo:
- Título no topo: '$TITLE', com '$DESTAQUE' em dourado e o resto em branco.
- Subtítulo: '$SUB'.
$( [ -n "$LINE" ] && echo "- Linha menor: '$LINE'." )
- Elementos de fundo nas laterais: $SIDES, com luz quente âmbar/laranja e profundidade de campo, sem competir com o texto.
$TILES_TXT
- Faixa inferior escura com borda fina dourada, como a da referência MUSICAVIDEO, com o texto 'INEMA.CLUB · inematds.github.io/$SLUG' em branco bold.
$TAIL_TXT"
else
  TILES_TXT=""; [ -n "$TILES" ] && TILES_TXT="- Fileira de tiles quadrados com ícone 3D e legenda, um por item: $TILES."
  PROMPT="$HEAD_TXT

Estilo (igual ao banner do guia Claude Opus 5.5 do INEMA): fundo azul-escuro profundo com partículas e fluxos de luz dourada e azul, aparência premium, alto contraste, sem foto de pessoa.
Tipografia: título em caixa alta, dourado metálico polido com chanfro limpo e sombra, sans-serif bold de desenho limpo; NUNCA fonte de jogo, inflada ou cartunesca, e sem misturar azul no título. Subtítulo em branco bold; linha de apoio em branco regular. Tiles quadrados com ícones 3D brilhantes em molduras neon azul e legenda branca.

Conteúdo:
- Título grande no topo: '$TITLE'.
- Subtítulo: '$SUB'.
$( [ -n "$LINE" ] && echo "- Linha menor: '$LINE'." )
$TILES_TXT
- Elementos: $SIDES.
- Faixa inferior com moldura dourada: 'INEMA.CLUB · inematds.github.io/$SLUG'.
$TAIL_TXT"
fi

[ -n "${DRY:-}" ] && { printf '%s\n' "$PROMPT"; exit 0; }
mkdir -p "$REPO/guia/assets"; rm -f "$PNG"
echo "[banner] gerando via codex exec em $REPO ..."
# --dangerously-bypass-approvals-and-sandbox: o sandbox bwrap do Codex não roda neste host
# (AppArmor restringe user namespaces) e, mesmo com -s workspace-write, a gravação do PNG
# falha com "Operation not permitted" — a imagem é gerada e jogada fora (visto 2026-09-13).
LOG="$REPO/guia/assets/$SAIDA.codex.log"
REFDIR="$(dirname "$(realpath "$0")")/referencias"; IMGS=()
[ "$ESTILO" != opus ] && for r in "$REFDIR"/ref-live.jpg "$REFDIR"/ref-musicavideo.jpg; do [ -f "$r" ] && IMGS+=(-i "$r"); done
# o prompt vai pela entrada padrão: com -i <FILE>... um argumento posicional seria lido como mais uma imagem
( cd "$REPO" && printf '%s' "$PROMPT" | timeout 600 codex exec --skip-git-repo-check --dangerously-bypass-approvals-and-sandbox "${IMGS[@]}" >"$LOG" 2>&1 )
[ -s "$PNG" ] && rm -f "$LOG" || { echo "[banner] codex não gerou guia/assets/$SAIDA.png — veja $LOG"; }
[ -s "$PNG" ] || { echo "[banner] codex não gerou guia/assets/$SAIDA.png — fallback pro hero.png"; exit 1; }
ffmpeg -y -loglevel error -i "$PNG" -vf scale=1400:-1 -q:v 3 "$JPG" && rm -f "$PNG"
echo "[banner] ok -> $JPG ($(du -h "$JPG" | cut -f1)). Confira o texto na imagem antes de publicar."
