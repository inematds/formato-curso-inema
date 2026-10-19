#!/usr/bin/env bash
# Cria um curso INEMA Learning v7.2 novo a partir do motor da skill.
# Uso: novo-curso.sh <pasta-do-curso> "<Nome do curso>"
# Ex.: novo-curso.sh ~/projetos/meu-curso-v72 "Meu curso"
set -euo pipefail
SKILL="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${1:?uso: novo-curso.sh <pasta> \"<nome>\"}"; NOME="${2:?falta o nome do curso}"
[ -e "$DEST/gerar.py" ] && { echo "já existe curso em $DEST — não sobrescrevo"; exit 1; }
SLUG="$(basename "$DEST")"
mkdir -p "$DEST/conteudo/pt/aulas" "$DEST/assets/img/hero" "$DEST/assets/vtt"
cp "$SKILL"/motor/gerar.py "$SKILL"/motor/validar.py "$SKILL"/motor/conferir.py "$SKILL"/motor/.gitignore "$DEST/"
cp "$SKILL"/motor/assets/*.css "$SKILL"/motor/assets/*.js "$DEST/assets/"
cp "$SKILL"/motor/assets/img/favicon.svg "$DEST/assets/img/"
python3 - "$SKILL/modelo/conteudo/pt/curso.json" "$DEST/conteudo/pt/curso.json" "$SLUG" "$NOME" <<'EOF'
import json, sys
src, dst, slug, nome = sys.argv[1:]
c = json.load(open(src))
c["id"], c["nome"], c["url"] = slug, nome, f"https://inematds.github.io/{slug}/"
c["videos"] = {}  # cada curso declara os seus vídeos
c["inicio"]["numeros"], c["inicio"]["blocos"] = [], []
json.dump(c, open(dst, "w"), ensure_ascii=False, indent=2)
EOF
cat > "$DEST/CLAUDE.md" <<EOF
# CLAUDE.md — $SLUG

Curso no formato INEMA Learning v7.2 (skill \`formato-curso-v72\`). Conteúdo em \`conteudo/<lang>/\`; nunca editar o HTML gerado à mão: editar o JSON e rodar \`python3 gerar.py && python3 validar.py --links\`. Conferir telas com \`node ~/.claude/skills/formato-curso-v72/scripts/conferir-tela.cjs .\` (HTTP local, 1366 e 390 px).
Autor dos commits: \`inematds <inematds@gmail.com>\`. Publicação = commit + push (GitHub Pages, raiz da main).

## Self-learning

When I correct you, or you catch yourself making a mistake: before continuing, add the lesson as a one-line rule at the TOP of the Lessons section below.

## Lessons

$(sed -n '/^- /p' "$SKILL/references/LICOES.md")
EOF
# repositório já na branch main: o Pages (source[branch]=main) recusa repo que subiu como master
[ -d "$DEST/.git" ] || git -C "$DEST" init -q -b main
echo "curso criado em $DEST (id $SLUG). Próximo: escrever conteudo/pt/curso.json + aulas/*.json; imagens em assets/img/ (capa.jpg, hero/inicio.jpg, hero/<slug>.jpg)."
