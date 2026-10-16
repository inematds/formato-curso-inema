#!/usr/bin/env python3
"""selo-banner.py — escreve o nome do projeto/produto em azul acima do título do banner.

Uso: selo-banner.py <imagem.jpg|webp> "<Nome>" [--titulo "TÍTULO DO BANNER"]
Regra (inema-design V11, 13/10/2026): o selo só entra quando o banner cita o projeto
e o NOME NÃO ESTÁ NO TÍTULO da imagem; se estiver (ex.: título "INEMASEO"), não faz nada.
Sora ExtraBold, azul #3B9EFF com brilho leve, canto superior esquerdo (alinhado ao título live).
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

AZUL = (59, 158, 255)
FONTE = Path(__file__).resolve().parent / "fontes" / "Sora.ttf"

args = sys.argv[1:]
titulo = ""
if "--titulo" in args:
    i = args.index("--titulo"); titulo = args[i + 1]; del args[i:i + 2]
if len(args) != 2:
    sys.exit(__doc__)
img, nome = Path(args[0]), args[1].strip()
if not nome:
    sys.exit("nome vazio")
if nome.casefold() in titulo.casefold():
    print(f"[selo] '{nome}' já está no título — selo não aplicado"); sys.exit(0)

im = Image.open(img).convert("RGBA")
k = im.size[0] / 1400
W, H = im.size

# Topo do título medido na imagem: o Codex não põe o título sempre na mesma altura e o selo
# fixo em y=48 encostava no acento de "VÍDEO" (LongCat-Video, 16/10/2026).
def topo_titulo():
    # conta só pixel BRANCO (a 1ª linha do título live é branca); luz de palco/bokeh é laranja
    # e enganava a medição (topo y=20 no PT do LongCat-Video). Exige 8 linhas seguidas.
    x0, x1 = int(30 * k), int(W * .30)  # só o começo do título; luzes ficam mais à direita
    px = im.load()
    seguidas = 0
    for y in range(int(20 * k), int(H * .45)):
        brancos = sum(1 for x in range(x0, x1, 2) if min(px[x, y][:3]) > 200)
        seguidas = seguidas + 1 if brancos > (x1 - x0) / 2 * .05 else 0
        if seguidas >= 8:
            return y - 7
    return None

def fonte(tam):
    f = ImageFont.truetype(str(FONTE), tam)
    f.set_variation_by_name("ExtraBold")
    return f

topo, folga = topo_titulo(), int(14 * k)
tam = int(62 * k)
font = fonte(tam)
if topo is None:
    xy = (int(44 * k), int(48 * k))
else:
    # encolhe até caber acima do título (mínimo 34px); se nem assim couber, cola no alto
    while True:
        l, t, r, b = font.getbbox(nome)
        y = topo - folga - b
        if y >= int(12 * k) or tam <= int(34 * k):
            break
        tam -= 2; font = fonte(tam)
    xy = (int(44 * k), max(int(12 * k) - t, y))
    print(f"[selo] topo do título y={topo}, selo {tam}px em y={xy[1]}")
glow = Image.new("RGBA", im.size, (0, 0, 0, 0))
ImageDraw.Draw(glow).text(xy, nome, font=font, fill=AZUL + (170,))
im.alpha_composite(glow.filter(ImageFilter.GaussianBlur(14 * k)))
ImageDraw.Draw(im).text(xy, nome, font=font, fill=AZUL + (255,))
out = im.convert("RGB")
if img.suffix.lower() == ".webp":
    out.save(img, "WEBP", quality=88, method=6)
else:
    out.save(img, "JPEG", quality=90, optimize=True)
print(f"[selo] '{nome}' aplicado em {img}")
