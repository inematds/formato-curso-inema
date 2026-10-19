#!/usr/bin/env bash
# capturar-kit.sh — roda os blocos "Terminal" de um curso técnico (kit/blocos/*.sh), um por vez, e grava a saída
# em kit/saidas/<bloco>.txt. É daqui que saem as abas "Saída capturada"; depois rode resolver-kit.py --conferir.
#
#   bash capturar-kit.sh <curso>              # todos os blocos, em ordem alfabética (a1a, a1b, a2a…)
#   bash capturar-kit.sh <curso> a2a-render   # só os blocos citados
#
# Os blocos usam ${TMPDIR:-/tmp}: a captura roda com um TMPDIR próprio (CAPTURA_TMP, ou um mktemp) e troca esse
# caminho por /tmp e o $HOME por ~ na saída, para a aba mostrar o que o aluno vê sem sujar o /tmp da máquina.
# Teto por bloco: timeout ${CAPTURA_TIMEOUT:-600} s e MemoryMax=${CAPTURA_MEM:-8G} (systemd-run --user --scope),
# para render de vídeo numa máquina carregada. Criado no piloto formacao-cinema-ia-motion-v72 (19/10/2026).
set -uo pipefail
C=$(cd "${1:?uso: capturar-kit.sh <curso> [bloco…]}" && pwd); shift
K="$C/kit"; [ -d "$K/blocos" ] || { echo "sem $K/blocos"; exit 2; }
T=${CAPTURA_TMP:-$(mktemp -d)}
mkdir -p "$K/saidas" "$T"
alvos=("$@"); [ ${#alvos[@]} -eq 0 ] && alvos=($(cd "$K/blocos" && ls *.sh | sed 's/\.sh$//'))
teto=(); command -v systemd-run >/dev/null && teto=(systemd-run --user --scope -q -p "MemoryMax=${CAPTURA_MEM:-8G}")
for b in "${alvos[@]}"; do
  ( cd /tmp && TMPDIR="$T" timeout "${CAPTURA_TIMEOUT:-600}" "${teto[@]}" bash "$K/blocos/$b.sh" ) 2>&1 \
    | sed "s#$T#/tmp#g; s#$HOME#~#g" > "$K/saidas/$b.txt"
  echo "$b: $(wc -l < "$K/saidas/$b.txt") linhas"
done
