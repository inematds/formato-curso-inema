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
font = ImageFont.truetype(str(FONTE), int(62 * k))
font.set_variation_by_name("ExtraBold")
xy = (int(44 * k), int(48 * k))
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
