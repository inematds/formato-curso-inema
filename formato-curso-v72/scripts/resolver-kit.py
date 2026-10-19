#!/usr/bin/env python3
"""resolver-kit.py: o bloco copiável e a saída capturada nascem do arquivo testado no kit/ do curso.

Escreva as aulas (conteudo/pt/aulas/*.json) com marcadores e resolva depois de capturar:
  "conteudo": "@@bloco:a3-ensaio@@"      → texto de kit/blocos/a3-ensaio.sh (o que você rodou)
  "conteudo": "@@arquivo:hooks/x.json@@" → texto de kit/hooks/x.json
  "html": "@@saida:a3-ensaio@@<p>…</p>"  → <pre> com kit/saidas/a3-ensaio.txt (ou .md), já escapado

  python3 resolver-kit.py <curso>            # troca os marcadores em lugar (guarde uma cópia antes)
  python3 resolver-kit.py <curso> --conferir # sem marcadores: confere bloco "Terminal …" × kit/blocos/*.sh
                                             # e "Arquivo · kit/X" × kit/X; saída 1 se divergir
Criado no curso loop-r-eng-seguranca-v72 (19/10/2026).
"""
import html
import json
import re
import sys
from pathlib import Path


def saida(k, nome):
    for ext in (".txt", ".md"):
        p = k / "saidas" / (nome + ext)
        if p.exists():
            return "<pre>" + html.escape(p.read_text(encoding="utf-8").strip("\n"), quote=False) + "</pre>"
    raise SystemExit(f"falta kit/saidas/{nome}.txt")


def troca(v, k):
    if isinstance(v, str):
        v = re.sub(r"@@bloco:([\w-]+)@@", lambda m: (k / "blocos" / (m.group(1) + ".sh")).read_text(encoding="utf-8").rstrip("\n"), v)
        v = re.sub(r"@@arquivo:([\w./-]+)@@", lambda m: (k / m.group(1)).read_text(encoding="utf-8").rstrip("\n"), v)
        return re.sub(r"@@saida:([\w-]+)@@", lambda m: saida(k, m.group(1)), v)
    if isinstance(v, list):
        return [troca(x, k) for x in v]
    if isinstance(v, dict):
        return {a: troca(x, k) for a, x in v.items()}
    return v


def conferir(aulas, k):
    blocos = {p.read_text(encoding="utf-8").rstrip("\n") for p in (k / "blocos").glob("*.sh")}
    ruins = total = 0
    for aula in sorted(aulas.glob("*.json")):
        for s in json.loads(aula.read_text(encoding="utf-8"))["secoes"]:
            for b in s.get("blocos", []):
                rot, c = b["rot"], b["conteudo"].rstrip("\n")
                if rot.startswith("Terminal"):
                    ok = c in blocos
                elif rot.startswith("Arquivo · kit/"):
                    arq = k / rot.split("Arquivo · kit/")[1].split(" ")[0]
                    ok = arq.exists() and arq.read_text(encoding="utf-8").rstrip("\n") == c
                else:
                    continue
                total += 1
                if not ok:
                    ruins += 1
                    print(f"DIVERGE  {aula.name} · {rot}")
    print(f"BLOCOS: {total - ruins}/{total} iguais ao kit testado")
    return 1 if ruins else 0


def main():
    if len(sys.argv) < 2:
        print(__doc__.strip()); return 2
    curso = Path(sys.argv[1]); k = curso / "kit"; aulas = curso / "conteudo/pt/aulas"
    if "--conferir" in sys.argv:
        return conferir(aulas, k)
    # Resolve tudo na memória antes de gravar: um kit/saidas/X.txt faltando na aula 5 não pode
    # deixar as aulas 1–4 já trocadas e as outras com marcador (estado misto, difícil de refazer).
    prontos = []
    for p in sorted(aulas.glob("*.json")):
        texto = p.read_text(encoding="utf-8")
        n = texto.count("@@") // 2
        if n:
            prontos.append((p, n, json.dumps(troca(json.loads(texto), k), ensure_ascii=False, indent=2) + "\n"))
    for p, n, novo in prontos:
        p.write_text(novo, encoding="utf-8")
        print(f"{p.name}: {n} marcador(es)")
    return conferir(aulas, k)


if __name__ == "__main__":
    sys.exit(main())
