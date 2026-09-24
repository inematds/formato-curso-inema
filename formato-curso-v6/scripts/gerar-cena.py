#!/usr/bin/env python3
"""Gera a cena ilustrada de uma aula (formato-curso v6) no inemaimg (flux2-klein) e salva em WebP leve.

Uso:
  python3 gerar-cena.py <saida.webp> "<descrição da cena em inglês>" [--seed 7] [--estilo editorial]

Regras v6 (V6-DESIGN.md §cena): pessoa real da profissão-alvo na situação do exemplo,
NENHUM texto legível na imagem (o PT/EN/ES traduz só HTML), sem robô/cérebro-circuito/aperto
de mão com robô, 16:9, WebP <= 150 KB. O estilo fica fixo no curso inteiro (mesmo --estilo e seeds próximas).
"""
import argparse, base64, io, json, sys, urllib.request
from PIL import Image

ESTILOS = {
    # ilustração editorial calorosa — padrão do v6
    "editorial": ("warm editorial illustration, soft gouache and colored pencil texture, muted natural palette "
                  "(cream, sage green, terracotta, soft blue), gentle daylight, calm and human, realistic proportions, "
                  "adults aged 30 to 60, diverse Brazilian people, clean uncluttered composition, 16:9"),
    "foto": ("natural documentary photograph, soft window light, shallow depth of field, real Brazilian office or school, "
             "adults aged 30 to 60, warm neutral colors, 16:9"),
}
NEG = ("no text, no letters, no words, no numbers, no logos, no watermark, screens show only blurred abstract shapes, "
       "no robots, no glowing brain, no circuit patterns, no holograms")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("saida"); ap.add_argument("cena")
    ap.add_argument("--seed", type=int, default=7); ap.add_argument("--estilo", default="editorial")
    ap.add_argument("--url", default="http://localhost:8000/generate"); ap.add_argument("--kb", type=int, default=150)
    a = ap.parse_args()
    prompt = f"{a.cena}. {ESTILOS[a.estilo]}. {NEG}."
    body = json.dumps({"model": "flux2-klein", "prompt": prompt, "width": 1536, "height": 864,
                       "steps": 4, "guidance_scale": 1.0, "seed": a.seed}).encode()
    req = urllib.request.Request(a.url, data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=600) as r:
        img = Image.open(io.BytesIO(base64.b64decode(json.load(r)["image"]))).convert("RGB")
    img = img.resize((1280, 720), Image.LANCZOS)
    for q in (82, 76, 70, 64, 58, 50):
        buf = io.BytesIO(); img.save(buf, "WEBP", quality=q, method=6)
        if buf.tell() <= a.kb * 1024: break
    open(a.saida, "wb").write(buf.getvalue())
    print(f"{a.saida}  {buf.tell()//1024} KB  q={q}")

if __name__ == "__main__":
    sys.exit(main())
