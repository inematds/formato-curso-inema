#!/usr/bin/env python3
"""Monta curso.html (formato-curso v6) a partir de curso.json + aulas/aula-N.html.

Uso (na pasta do curso):  python3 montar-curso.py [pasta]
- curso.json: {"id","titulo","titulo_html","curso_curto","kicker","lead","rodape","landing":"landing.html",
               "imagem_trilha":"assets/img/aula-1.webp","alt_trilha":"..."}
- aulas/aula-N.html: cada arquivo é UM <section class="view" id="v-aula-N" data-aula="N" data-tempo="12min">…</section>
A trilha (cards com miniatura, tempo, status) é gerada a partir das próprias aulas — não se escreve à mão.
Idempotente: sempre reescreve curso.html inteiro.
"""
import html, json, pathlib, re, sys

base = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
cfg = json.loads((base / "curso.json").read_text(encoding="utf-8"))
aulas = sorted((base / "aulas").glob("aula-*.html"), key=lambda p: int(re.search(r"(\d+)", p.stem).group(1)))
if not aulas:
    sys.exit("nenhuma aula em aulas/")

def txt(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()

cards, corpos = [], []
for p in aulas:
    s = p.read_text(encoding="utf-8").strip()
    m = re.search(r'<section class="view" id="v-aula-(\d+)" data-aula="(\d+)" data-tempo="(\d+)\s*min"', s)
    if not m:
        sys.exit(f"{p.name}: abertura da view fora do contrato (id/data-aula/data-tempo)")
    n, tempo = m.group(1), m.group(3)
    h1 = txt(re.search(r"<h1[^>]*>(.*?)</h1>", s, re.S).group(1))
    prom = re.search(r'<p class="promise">(.*?)</p>', s, re.S)
    img = re.search(r'<figure class="cena[^"]*">\s*<img src="([^"]+)"', s)
    thumb = f'<img class="thumb" src="{img.group(1)}" alt="" loading="lazy" width="96" height="72">' if img else '<span class="thumb"></span>'
    cards.append(f'''    <a class="au" data-aula="{n}" href="#aula-{n}">
      {thumb}
      <div><span class="n">Aula {n}</span><h3>{html.escape(h1)}</h3><p class="meta">{tempo} min</p><div class="bar2"><i></i></div></div>
    </a>''')
    corpos.append(s)

c = cfg
img_trilha = c.get("imagem_trilha")
fig_trilha = f'<figure class="cena"><img src="{img_trilha}" alt="{html.escape(c.get("alt_trilha",""))}" width="1280" height="720"></figure>' if img_trilha else ""
out = f'''<!doctype html>
<html lang="pt-BR" data-theme="papel">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="curso" content="{c["id"]}">
<meta name="formato" content="formato-curso-v6">
<title>{html.escape(c["titulo"])} · INEMA.CLUB PRO</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/aula.css">
<script>(function(){{try{{var s=JSON.parse(localStorage.getItem("{c["id"]}"));if(s&&s.prefs&&s.prefs.theme)document.documentElement.setAttribute("data-theme",s.prefs.theme);}}catch(e){{}}}})();</script>
</head>
<body>
<header class="bar"><div class="bar-inner">
  <span class="brand"><a class="mark" href="https://inema.club" target="_blank" rel="noopener">INEMA.CLUB</a><a class="pro" href="https://inema.pro" target="_blank" rel="noopener">PRO</a><a class="course" href="{c.get("landing","landing.html")}">{html.escape(c.get("curso_curto",c["titulo"]))}</a></span>
  <a class="btn back" href="#trilha" hidden>← <span class="t">trilha</span></a>
  <button class="btn" id="revbtn" hidden>revisar</button>
  <button class="btn" id="prefsbtn" aria-label="Tamanho da letra e tema">Aa</button>
  <button class="btn" id="menubtn" aria-label="Menu">☰</button>
</div></header>

<section class="view" id="v-trilha">
  <div class="wrap">
    <header class="t-hero">
      <p class="kicker">{html.escape(c.get("kicker",""))}</p>
      <h1>{c.get("titulo_html",html.escape(c["titulo"]))}</h1>
      <p class="lead">{c.get("lead","")}</p>
      {fig_trilha}
    </header>
    <div class="statcards"></div>
    <a class="continuar" href="#aula-1"></a>
    <h2 class="sec-title">As aulas</h2>
    <div class="aulas">
{chr(10).join(cards)}
    </div>
  </div>
  <footer class="pe">{c.get("rodape","INEMA.CLUB PRO")}</footer>
</section>

{chr(10).join(corpos)}

<script src="assets/curso.js"></script>
</body>
</html>
'''
(base / "curso.html").write_text(out, encoding="utf-8")
print(f"curso.html montado: {len(aulas)} aulas")

# landing: a lista de aulas entre <!--AULAS--> e <!--/AULAS--> é regenerada (links para curso.html)
lp = base / c.get("landing", "landing.html")
if lp.exists():
    ls = lp.read_text(encoding="utf-8")
    if "<!--AULAS-->" in ls and "<!--/AULAS-->" in ls:
        lista = "\n".join(x.replace('href="#aula-', 'href="curso.html#aula-').replace('<div class="bar2"><i></i></div>', '') for x in cards)
        ls = re.sub(r"<!--AULAS-->.*?<!--/AULAS-->", "<!--AULAS-->\n" + lista.replace("\\", "\\\\") + "\n<!--/AULAS-->", ls, flags=re.S)
        lp.write_text(ls, encoding="utf-8")
        print(f"{lp.name}: lista de aulas atualizada")
