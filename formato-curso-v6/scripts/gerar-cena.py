#!/usr/bin/env python3
"""Gera a cena ilustrada de uma aula (formato-curso v6) e salva em WebP leve (1280x720, <= 150 KB).

Uso:
  python3 gerar-cena.py <saida.webp> "<descrição da cena>" [--gerador auto|codex|flux] [--seed 7] [--estilo editorial]

Gerador (desde 2026-09-24, pedido do usuário):
  auto  (padrão) = Codex CLI image_gen (imagem 2.5 da conta OpenAI); se falhar (sem crédito, erro, timeout)
                   cai no inemaimg local com o modelo padrão (flux2-klein).
  codex = só Codex (falha se não gerar).   flux = só inemaimg local (usa --seed, reprodutível).

Regras v6 (V6-DESIGN.md §3.4): pessoa real da profissão-alvo na situação do exemplo, NENHUM texto legível na
imagem (o PT/EN/ES traduz só o HTML), sem robô/cérebro-circuito/aperto de mão com robô, 16:9, WebP <= 150 KB.
O estilo fica fixo no curso inteiro (mesmo --estilo). A descrição pode ser em português ou inglês.
"""
import argparse, base64, io, json, os, shutil, subprocess, sys, tempfile, urllib.request
from PIL import Image

ESTILOS = {
    "editorial": ("warm editorial illustration, soft gouache and colored pencil texture, muted natural palette "
                  "(cream, sage green, terracotta, soft blue), gentle daylight, calm and human, realistic proportions, "
                  "adults aged 30 to 60, diverse Brazilian people, clean uncluttered composition"),
    "foto": ("natural documentary photograph, soft window light, shallow depth of field, real Brazilian office or school, "
             "adults aged 30 to 60, warm neutral colors"),
}
NEG = ("no text, no letters, no words, no numbers, no logos, no brand marks on devices, no watermark, no signature, "
       "screens show only blurred abstract shapes, no robots, no glowing brain, no circuit patterns, no holograms")

def via_codex(cena, estilo):
    if not shutil.which("codex"):
        raise RuntimeError("codex não instalado")
    d = tempfile.mkdtemp(prefix="cena-codex-")
    prompt = ("Use sua ferramenta de geração de imagem (image_gen) para criar UMA imagem horizontal (paisagem, 16:9 ou 3:2) "
              "e salve o PNG como arte.png neste diretório. Não crie nem edite nenhum outro arquivo.\n\n"
              f"Cena: {cena}.\nEstilo: {ESTILOS[estilo]}.\nRestrições: {NEG}. "
              "Nenhum texto legível em papéis, telas, quadros ou livros.\n"
              "Ao terminar, responda só com o caminho do arquivo e o tamanho em pixels.")
    try:
        r = subprocess.run(["codex", "exec", "--skip-git-repo-check", "--dangerously-bypass-approvals-and-sandbox", prompt],
                           cwd=d, capture_output=True, text=True, timeout=600)
        png = os.path.join(d, "arte.png")
        if not os.path.exists(png) or os.path.getsize(png) == 0:
            msg = (r.stdout + r.stderr)[-400:].replace("\n", " ")
            raise RuntimeError(f"codex não gerou arte.png ({msg})")
        return Image.open(png).convert("RGB")
    finally:
        shutil.rmtree(d, ignore_errors=True)

def via_flux(cena, estilo, seed, url):
    body = json.dumps({"model": "flux2-klein", "prompt": f"{cena}. {ESTILOS[estilo]}, 16:9. {NEG}.",
                       "width": 1536, "height": 864, "steps": 4, "guidance_scale": 1.0, "seed": seed}).encode()
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=600) as r:
        return Image.open(io.BytesIO(base64.b64decode(json.load(r)["image"]))).convert("RGB")

def cover_16x9(img, w=1280, h=720):
    sw, sh = img.size; esc = max(w / sw, h / sh)
    img = img.resize((round(sw * esc), round(sh * esc)), Image.LANCZOS)
    l, t = (img.width - w) // 2, (img.height - h) // 2
    return img.crop((l, t, l + w, t + h))

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("saida"); ap.add_argument("cena")
    ap.add_argument("--gerador", default="auto", choices=["auto", "codex", "flux"])
    ap.add_argument("--seed", type=int, default=7); ap.add_argument("--estilo", default="editorial")
    ap.add_argument("--url", default="http://localhost:8000/generate"); ap.add_argument("--kb", type=int, default=150)
    a = ap.parse_args()
    fonte = None
    if a.gerador in ("auto", "codex"):
        try:
            img = via_codex(a.cena, a.estilo); fonte = "codex/image_gen"
        except Exception as e:
            if a.gerador == "codex":
                sys.exit(f"codex falhou: {e}")
            print(f"[cena] codex falhou ({str(e)[:160]}) — fallback inemaimg flux2-klein", file=sys.stderr)
    if fonte is None:
        img = via_flux(a.cena, a.estilo, a.seed, a.url); fonte = "flux2-klein" + (" (fallback)" if a.gerador == "auto" else "")
    img = cover_16x9(img)
    for q in (82, 76, 70, 64, 58, 50):
        buf = io.BytesIO(); img.save(buf, "WEBP", quality=q, method=6)
        if buf.tell() <= a.kb * 1024: break
    open(a.saida, "wb").write(buf.getvalue())
    print(f"{a.saida}  {buf.tell()//1024} KB  q={q}  fonte={fonte}")

if __name__ == "__main__":
    sys.exit(main())
