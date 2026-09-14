#!/usr/bin/env bash
# gerar-banner.sh — banner promocional 16:9 (estilo INEMA.PRO) pro hero do guia + topo do README,
# gerado pelo Codex CLI (image_gen), que escreve texto em português corretamente.
#
# Uso:
#   gerar-banner.sh --repo <pasta> --title "AGENTE CLAUDE → CODEX" --sub "MIGRE OU FIQUE AGNÓSTICO" \
#     --line "frase curta de apoio" --tiles "AUDITORIA,AGENTS.MD,NÚCLEO PORTÁTIL,SKILLS,READBACK,HANDOFF" \
#     [--sides "elemento à esquerda | elemento à direita | elemento central"] [--slug <repo>]
#
# Saída: <repo>/guia/assets/banner.jpg (JPG 1400px de largura, ~400-500 KB).
# Fallback: se codex não existir ou falhar, sai com 1 e NÃO cria o arquivo — o guia usa hero.png (flux).
# Custo: uma geração de imagem na conta OpenAI do Codex por chamada.
set -uo pipefail
while [ $# -gt 0 ]; do case "$1" in
  --repo) REPO="$2"; shift 2;; --title) TITLE="$2"; shift 2;; --sub) SUB="$2"; shift 2;;
  --line) LINE="$2"; shift 2;; --tiles) TILES="$2"; shift 2;; --sides) SIDES="$2"; shift 2;;
  --slug) SLUG="$2"; shift 2;; *) echo "arg desconhecido: $1"; exit 2;; esac; done
: "${REPO:?--repo obrigatório}" "${TITLE:?--title obrigatório}" "${SUB:?--sub obrigatório}"
LINE="${LINE:-}"; TILES="${TILES:-}"; SLUG="${SLUG:-$(basename "$REPO")}"
SIDES="${SIDES:-à esquerda um ícone 3D dourado representando o tema, à direita um ícone 3D azul-ciano complementar, ligados por um fluxo luminoso}"
command -v codex >/dev/null || { echo "[banner] codex não instalado — fallback pro hero.png"; exit 1; }
command -v ffmpeg >/dev/null || { echo "[banner] ffmpeg ausente"; exit 1; }
mkdir -p "$REPO/guia/assets"
PNG="$REPO/guia/assets/banner.png"; JPG="$REPO/guia/assets/banner.jpg"; rm -f "$PNG"

TILES_TXT=""; [ -n "$TILES" ] && TILES_TXT="- Grade de tiles quadrados com ícone 3D e legenda, um por item: $TILES."
PROMPT="Use sua ferramenta de geração de imagem (image_gen) para criar UM banner promocional 16:9 no maior formato horizontal disponível e salve o PNG em guia/assets/banner.png dentro deste diretório. Não edite nenhum outro arquivo.

Estilo (igual aos banners do INEMA.CLUB / INEMA.PRO): fundo preto-azulado profundo com partículas e brilho neon, tipografia 3D grande em dourado metálico e azul-ciano com contorno luminoso, tiles quadrados com ícones 3D brilhantes em molduras neon azul, aparência premium, alto contraste, sem foto de pessoa.

Conteúdo:
- Título grande no topo: '$TITLE'.
- Subtítulo: '$SUB'.
$( [ -n "$LINE" ] && echo "- Linha menor: '$LINE'." )
$TILES_TXT
- Elementos: $SIDES.
- Faixa inferior: 'INEMA.CLUB · inematds.github.io/$SLUG'.
Todo o texto em português, sem erros de grafia, sem texto extra inventado. Ao terminar, responda só com o caminho do arquivo e o tamanho em pixels."

echo "[banner] gerando via codex exec em $REPO ..."
( cd "$REPO" && timeout 600 codex exec --skip-git-repo-check "$PROMPT" >/dev/null 2>&1 )
[ -s "$PNG" ] || { echo "[banner] codex não gerou guia/assets/banner.png — fallback pro hero.png"; exit 1; }
ffmpeg -y -loglevel error -i "$PNG" -vf scale=1400:-1 -q:v 3 "$JPG" && rm -f "$PNG"
echo "[banner] ok -> $JPG ($(du -h "$JPG" | cut -f1)). Confira o texto na imagem antes de publicar."
