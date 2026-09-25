#!/usr/bin/env python3
"""Monta curso.html (formato-curso v6) a partir de curso.json + aulas/aula-N.html.

Uso (na pasta do curso):  python3 montar-curso.py [pasta]
- curso.json: {"id","titulo","titulo_html","curso_curto","kicker","lead","rodape","landing":"landing.html",
               "imagem_trilha":"assets/img/aula-1.webp","alt_trilha":"..."}
- aulas/aula-N.html: cada arquivo é UM <section class="view" id="v-aula-N" data-aula="N" data-tempo="12min">…</section>
A trilha (cards com miniatura, tempo, status) é gerada a partir das próprias aulas — não se escreve à mão.
Idempotente: sempre reescreve curso.html inteiro.

Opcionais (6.2) — sem eles a saída é idêntica à 6.1:
- "modulos": [{"titulo","resumo"?, "aulas":[1,2,3]}]  agrupa os cards da trilha (e da landing) por módulo.
- "perfil": "tecnico"   curso de conteúdo técnico: jargão permitido desde que definido com .gterm na aula
                        (o auditor cobra) e glossário gerado. "termos": ["SSH","VPS",...] soma à lista do auditor.
- "glossario": true     gera o glossário mesmo fora do perfil técnico.
"""
import html, json, pathlib, re, sys, unicodedata

base = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
cfg = json.loads((base / "curso.json").read_text(encoding="utf-8"))
aulas = sorted((base / "aulas").glob("aula-*.html"), key=lambda p: int(re.search(r"(\d+)", p.stem).group(1)))
if not aulas:
    sys.exit("nenhuma aula em aulas/")

def txt(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()

def slug(s):
    s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")

tecnico = cfg.get("perfil") == "tecnico"
com_glossario = tecnico or bool(cfg.get("glossario"))
glos = {}  # slug -> {"termo","def","aulas":[n]}

def marca_gterm(m, n):
    attrs, inner = m.group(1), m.group(2)
    termo = txt(inner)
    d = re.search(r'data-def="([^"]*)"', attrs)
    g = re.search(r'data-gl="([^"]*)"', attrs)
    k = g.group(1) if g else slug(termo)
    e = glos.setdefault(k, {"termo": termo, "def": html.unescape(d.group(1)) if d else "", "aulas": []})
    if n not in e["aulas"]:
        e["aulas"].append(n)
    return m.group(0) if g else f'<span class="gterm"{attrs} data-gl="{k}">{inner}</span>'

cards, corpos, card_de, tempo_de = [], [], {}, {}
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
    card_de[int(n)] = cards[-1]
    tempo_de[int(n)] = int(tempo)
    if com_glossario:
        s = re.sub(r'<span class="gterm"([^>]*)>(.*?)</span>', lambda m: marca_gterm(m, n), s, flags=re.S)
    # rótulo do exemplo gravado no HTML (e não só gerado pelo motor) para o traduzir-curso.py alcançar
    s = re.sub(r'<p data-ex="([^"]+)"(?![^>]*data-exlbl)', lambda m: f'<p data-ex="{m.group(1)}" data-exlbl="Na prática · {m.group(1).capitalize()}"', s)
    corpos.append(s)

c = cfg

def lista_aulas(indent="    "):
    """Cards da trilha: planos (6.1) ou agrupados por módulo quando curso.json tem "modulos"."""
    mods = c.get("modulos")
    if not mods:
        return f'{indent}<h2 class="sec-title">As aulas</h2>\n{indent}<div class="aulas">\n' + "\n".join(cards) + f'\n{indent}</div>'
    usados, blocos = set(), []
    for i, md in enumerate(mods, 1):
        ns = [int(x) for x in md.get("aulas", [])]
        falta = [x for x in ns if x not in card_de]
        if falta:
            sys.exit(f'curso.json: módulo "{md.get("titulo")}" cita aulas inexistentes: {falta}')
        usados.update(ns)
        resumo = f'\n{indent}  <p class="mod-resumo">{md["resumo"]}</p>' if md.get("resumo") else ""
        blocos.append(f'{indent}<section class="modulo" id="modulo-{i}" data-modulo="{i}">\n{indent}  <h2 class="sec-title">{md["titulo"]}</h2>{resumo}\n'
                      f'{indent}  <div class="aulas">\n' + "\n".join(card_de[x] for x in ns) + f'\n{indent}  </div>\n{indent}</section>')
    sobra = sorted(set(card_de) - usados)
    if sobra:
        sys.exit(f"curso.json: aulas fora de qualquer módulo: {sobra}")
    return "\n".join(blocos)

gl_view, gl_link, meta_extra = "", "", ""
if tecnico:
    meta_extra += '\n<meta name="perfil" content="tecnico">'
    if c.get("termos"):
        meta_extra += f'\n<meta name="termos" content="{html.escape("|".join(c["termos"]))}">'
if com_glossario and glos:
    itens = []
    for k, e in sorted(glos.items(), key=lambda kv: slug(kv[1]["termo"])):
        links = " ".join(f'<a href="#aula-{a}">Aula {a}</a>' for a in e["aulas"])
        itens.append(f'      <div class="gl-item" id="g-{k}"><dt>{html.escape(e["termo"])}</dt><dd><p>{html.escape(e["def"])}</p><p class="gl-aulas">Aparece em: {links}</p></dd></div>')
    gl_view = f'''<section class="view" id="v-glossario">
  <div class="wrap">
    <header class="t-hero">
      <p class="kicker">{html.escape(c.get("curso_curto", c["titulo"]))}</p>
      <h1>Glossário</h1>
      <p class="lead">Os termos técnicos do curso em palavras simples. Cada termo leva às aulas em que aparece.</p>
    </header>
    <dl class="glossario">
{chr(10).join(itens)}
    </dl>
  </div>
  <footer class="pe">{c.get("rodape","INEMA.CLUB PRO")}</footer>
</section>

'''
    gl_link = f'\n    <a class="gl-link" href="#glossario">Glossário · {len(glos)} termos <span aria-hidden="true">→</span></a>'

img_trilha = c.get("imagem_trilha")
fig_trilha = f'<figure class="cena"><img src="{img_trilha}" alt="{html.escape(c.get("alt_trilha",""))}" width="1280" height="720"></figure>' if img_trilha else ""
out = f'''<!doctype html>
<html lang="pt-BR" data-theme="papel">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="curso" content="{c["id"]}">
<meta name="formato" content="formato-curso-v6">{meta_extra}
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
{lista_aulas()}{gl_link}
  </div>
  <footer class="pe">{c.get("rodape","INEMA.CLUB PRO")}</footer>
</section>

{gl_view}{chr(10).join(corpos)}

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
        def lp_card(x):
            return x.replace('href="#aula-', 'href="curso.html#aula-').replace('<div class="bar2"><i></i></div>', '')
        if c.get("modulos"):
            # 6.3: módulos fechados (<details>, sem JS para abrir); landing.html#modulo-N já chega com o N aberto
            def lp_mod(i, md):
                ns = [int(x) for x in md["aulas"]]
                minutos = sum(tempo_de[x] for x in ns)
                resumo = f'<div class="mod-r">{md["resumo"]}</div>' if md.get("resumo") else ""
                return (f'    <details class="mod-lp" id="modulo-{i}">\n'
                        f'      <summary><h3 class="mod-t">{md["titulo"]}</h3>{resumo}'
                        f'<div class="mod-m">{len(ns)} aulas · {minutos} min</div></summary>\n'
                        f'      <div class="aulas">\n' + "\n".join(lp_card(card_de[x]) for x in ns) + '\n      </div>\n    </details>')
            lista = ('    <div class="mods-lp" id="modulos">\n' + "\n".join(lp_mod(i, md) for i, md in enumerate(c["modulos"], 1)) +
                     '\n    </div>\n    <script>(function(){function abre(){var d=location.hash&&document.getElementById(location.hash.slice(1));'
                     'if(d&&d.tagName==="DETAILS"){d.open=true;d.scrollIntoView();}}abre();addEventListener("hashchange",abre);})();</script>')
        else:
            lista = "\n".join(lp_card(x) for x in cards)
        ls = re.sub(r"<!--AULAS-->.*?<!--/AULAS-->", "<!--AULAS-->\n" + lista.replace("\\", "\\\\") + "\n<!--/AULAS-->", ls, flags=re.S)
        lp.write_text(ls, encoding="utf-8")
        print(f"{lp.name}: lista de aulas atualizada")
