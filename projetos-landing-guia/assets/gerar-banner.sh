#!/usr/bin/env bash
# gerar-banner.sh — banner promocional 16:9 pro hero do guia + topo do README,
# gerado pelo Codex CLI (image_gen), que escreve texto em português corretamente.
#
# Uso:
#   gerar-banner.sh --repo <pasta> --title "OPENAI DOTS" [--destaque "DOTS"] --sub "VALE A PENA?" \
#     --line "frase curta de apoio" --tiles "AUDITORIA,AGENTS.MD,NÚCLEO PORTÁTIL,SKILLS" \
#     [--sides "cena/elementos visuais"] [--estilo live|opus] [--slug <repo>] [--dry-run]
#
# Estilos (padrão desde 2026-10-01: live):
#   live — como o banner "Hoje tem live" do portal: sans geométrica limpa, contraste de peso
#          (extra-bold × fino) em branco, a palavra de destaque enorme em dourado metálico chanfrado,
#          texto à esquerda e cena cinematográfica escura/dourada à direita. --tiles vira rótulos discretos.
#   opus — como o banner do guia claude-opus55: título em dourado metálico limpo, tiles com ícones.
#   Nunca fonte "de jogo" (condensada, inflada, cartunesca) — era o padrão antigo, abandonado.
#
# Saída: <repo>/guia/assets/banner.jpg (JPG 1400px de largura, ~400-500 KB).
# Fallback: se codex não existir ou falhar, sai com 1 e NÃO cria o arquivo — o guia usa hero.png
# (a arte crua da capa, gerada pelo Codex desde 2026-09-21; flux só se o Codex falhar lá também).
# Custo: uma geração de imagem na conta OpenAI do Codex por chamada.
set -uo pipefail
while [ $# -gt 0 ]; do case "$1" in
  --repo) REPO="$2"; shift 2;; --title) TITLE="$2"; shift 2;; --sub) SUB="$2"; shift 2;;
  --line) LINE="$2"; shift 2;; --tiles) TILES="$2"; shift 2;; --sides) SIDES="$2"; shift 2;;
  --slug) SLUG="$2"; shift 2;; --destaque) DESTAQUE="$2"; shift 2;; --estilo) ESTILO="$2"; shift 2;; --dry-run) DRY=1; shift;;
  *) echo "arg desconhecido: $1"; exit 2;; esac; done
: "${REPO:?--repo obrigatório}" "${TITLE:?--title obrigatório}" "${SUB:?--sub obrigatório}"
REPO="$(realpath "$REPO")"  # evita SLUG "." com --repo .
LINE="${LINE:-}"; TILES="${TILES:-}"; SLUG="${SLUG:-$(basename "$REPO")}"
ESTILO="${ESTILO:-live}"; DESTAQUE="${DESTAQUE:-${TITLE##* }}"  # default: última palavra do título
case "$ESTILO" in live|opus) ;; *) echo "--estilo deve ser live ou opus"; exit 2;; esac
if [ "$ESTILO" = live ]; then
  SIDES="${SIDES:-um objeto 3D brilhante que representa o tema, sobre uma mesa ou pedestal num ambiente de estúdio escuro}"
else
  SIDES="${SIDES:-à esquerda um ícone 3D dourado representando o tema, à direita um ícone 3D azul-ciano complementar, ligados por um fluxo luminoso}"
fi
command -v codex >/dev/null || { echo "[banner] codex não instalado — fallback pro hero.png"; exit 1; }
command -v ffmpeg >/dev/null || { echo "[banner] ffmpeg ausente"; exit 1; }
PNG="$REPO/guia/assets/banner.png"; JPG="$REPO/guia/assets/banner.jpg"

HEAD_TXT="Use sua ferramenta de geração de imagem (image_gen) para criar UM banner promocional 16:9 no maior formato horizontal disponível e salve o PNG em guia/assets/banner.png dentro deste diretório. Não edite nenhum outro arquivo."
TAIL_TXT="Todo o texto em português, sem erros de grafia, sem texto extra inventado. Ao terminar, responda só com o caminho do arquivo e o tamanho em pixels."
if [ "$ESTILO" = live ]; then
  RESTO="$(printf '%s' "$TITLE" | sed "s/$(printf '%s' "$DESTAQUE" | sed 's/[][\\/.*^$]/\\&/g')//" | sed 's/  */ /g;s/^ //;s/ $//')"
  TILES_TXT=""; [ -n "$TILES" ] && TILES_TXT="- Abaixo do filete, uma linha discreta de rótulos pequenos em branco fino, separados por ' · ': $(printf '%s' "$TILES" | sed 's/,/ · /g'). Sem caixas, sem ícones."
  PROMPT="$HEAD_TXT

Estilo (igual ao banner 'HOJE TEM LIVE' do INEMA): thumbnail cinematográfica premium, fundo quase preto com luz dourada quente e bokeh suave, sem neon azul, sem partículas exageradas, sem foto de pessoa.
Tipografia: sans-serif geométrica limpa e moderna (tipo Montserrat / Gotham), NUNCA fonte de jogo, condensada, inflada ou cartunesca. Contraste de pesos: palavras em branco alternando extra-bold e fino (thin), como 'HOJE' extra-bold e 'TEM' thin. A palavra de destaque em caixa alta, enorme, em dourado metálico chanfrado com brilho sutil e reflexo de luz, ocupando a maior parte da largura do bloco de texto.
Layout: bloco de texto alinhado à esquerda ocupando cerca de 55% da largura; à direita, cena fotorrealista com profundidade de campo: $SIDES, iluminação dourada quente.

Conteúdo:
$( [ -n "$RESTO" ] && echo "- Acima do destaque, em branco (misturando extra-bold e thin): '$RESTO'." )
- Destaque enorme em dourado: '$DESTAQUE'.
- Abaixo, em branco extra-bold menor: '$SUB'.
$( [ -n "$LINE" ] && echo "- Uma linha em branco thin: '$LINE'." )
- Um filete dourado fino horizontal sob o bloco de texto.
$TILES_TXT
- No canto inferior esquerdo, pequeno e discreto, em branco thin: 'INEMA.CLUB · inematds.github.io/$SLUG'.
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
LOG="$REPO/guia/assets/banner.codex.log"
( cd "$REPO" && timeout 600 codex exec --skip-git-repo-check --dangerously-bypass-approvals-and-sandbox "$PROMPT" >"$LOG" 2>&1 )
[ -s "$PNG" ] && rm -f "$LOG" || { echo "[banner] codex não gerou guia/assets/banner.png — veja $LOG"; }
[ -s "$PNG" ] || { echo "[banner] codex não gerou guia/assets/banner.png — fallback pro hero.png"; exit 1; }
ffmpeg -y -loglevel error -i "$PNG" -vf scale=1400:-1 -q:v 3 "$JPG" && rm -f "$PNG"
echo "[banner] ok -> $JPG ($(du -h "$JPG" | cut -f1)). Confira o texto na imagem antes de publicar."
