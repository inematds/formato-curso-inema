#!/usr/bin/env python3
"""Portão de qualidade do curso v7.2.

    python3 validar.py            # estrutura de cada aula
    python3 validar.py --links    # também confere os links externos (HTTP 200)
"""
import argparse, json, pathlib, re, sys, urllib.request

RAIZ = pathlib.Path(__file__).resolve().parent
ap = argparse.ArgumentParser(); ap.add_argument("--links", action="store_true"); ap.add_argument("--lang", default="pt")
args = ap.parse_args()
base = RAIZ if args.lang == "pt" else RAIZ / args.lang
erros = []
TAGS_HTML = set("""a abbr article aside audio b blockquote body br button canvas caption circle code col dd defs details dialog
div dl dt ellipse em fieldset figcaption figure footer form g h1 h2 h3 h4 h5 h6 head header hr html i iframe img input
kbd label legend li line lineargradient link main mark marker meta nav noscript ol optgroup option p path pattern
picture polygon polyline pre radialgradient rect script section select small source span stop strong style sub summary
sup svg symbol table tbody td template text textarea tfoot th thead time title tr track tspan u ul use var video wbr
q s cite del ins data output progress meter object embed map area base colgroup address bdi bdo dfn ruby rt rp samp slot
foreignobject clippath mask filter desc animate animatetransform""".split())

def confere_conversas(h):
    """7.5.1: cada simconversa — início existe, todo "vai" aponta para fala que existe, fala sem fim tem 2–4 opções
    completas, toda fala é alcançável, nenhum laço (todo caminho termina num fim com texto)."""
    out = []
    for bruto in re.findall(r'<script type="application/json" class="conv-dados">(.*?)</script>', h, re.S):
        try:
            d = json.loads(bruto)
        except ValueError as e:
            out.append(f"JSON inválido ({e})"); continue
        F, ini = d.get("falas") or {}, d.get("inicio")
        if ini not in F: out.append(f"início '{ini}' não existe"); continue
        for fid, f in F.items():
            if f.get("fim"):
                if not str(f.get("texto", "")).strip(): out.append(f"fim '{fid}' sem texto")
                continue
            if not str(f.get("cliente", "")).strip(): out.append(f"fala '{fid}' sem 'cliente'")
            ops = f.get("opcoes") or []
            if not 2 <= len(ops) <= 4: out.append(f"fala '{fid}' com {len(ops)} opções (precisa 2–4)")
            for o in ops:
                if o.get("vai") not in F: out.append(f"fala '{fid}': opção vai para '{o.get('vai')}', que não existe")
                if not str(o.get("t", "")).strip() or not str(o.get("comenta", "")).strip(): out.append(f"fala '{fid}': opção sem 't' ou 'comenta'")
                if not isinstance(o.get("nota"), int): out.append(f"fala '{fid}': opção sem 'nota' inteira")
        if out: continue
        vistos, pilha = set(), set()
        def anda(fid):
            if fid in pilha: out.append(f"laço passando por '{fid}'"); return
            if fid in vistos: return
            vistos.add(fid); pilha.add(fid)
            for o in F[fid].get("opcoes") or []: anda(o["vai"])
            pilha.discard(fid)
        anda(ini)
        sobra = set(F) - vistos
        if sobra: out.append(f"falas inalcançáveis: {', '.join(sorted(sobra))}")
        if not any(F[f].get("fim") for f in vistos): out.append("nenhum fim alcançável")
    return out
aulas = sorted((base / "aulas").glob("*/index.html"))
if not aulas: erros.append("nenhuma aula gerada")
for p in aulas:
    h = p.read_text(); nome = p.parent.name
    m = re.search(r'<p class="objetivo"><b>[^<]*</b>(.*?)</p>', h, re.S)
    if not m or len(re.sub("<[^>]+>", "", m.group(1)).strip()) > 160: erros.append(f"{nome}: objetivo ausente ou longo")
    nos = len(re.findall(r'class="[^"]*\bdg-no\b', h))
    if not nos: erros.append(f"{nome}: sem diagrama")
    elif nos < 3: erros.append(f"{nome}: diagrama com menos de 3 blocos")
    if 'class="copiar"' not in h: erros.append(f"{nome}: sem botão copiar")
    if 'class="q-op"' not in h or "<template class=\"ok\">" not in h: erros.append(f"{nome}: sem quiz com resposta oculta")
    if not re.search(r'data-competencias="[^"]+"', h): erros.append(f"{nome}: sem data-competencias")
    texto = re.sub(r"<(pre|script|template)[^>]*>.*?</\1>", "", h, flags=re.S)
    for ruim in ("[Nome", "[Resultado", "TODO", "lorem", "{a}", "undefined"):
        # TODO só como palavra inteira: "METODO.md" não é sobra (7.5.5)
        achou = re.search(r"\bTODO\b", texto) if ruim == "TODO" else ruim in texto
        if achou: erros.append(f"{nome}: sobra '{ruim}'")
    # placeholder tipo <o gatilho> fora de bloco de código vira tag e some na tela (7.5.2)
    for tag in sorted(set(re.findall(r"<([^\s/!>][^\s/>]*)", texto))):
        if tag.lower() not in TAGS_HTML and "-" not in tag:
            erros.append(f"{nome}: '<{tag}…>' fora de bloco de código vira tag invisível; use [colchetes] ou reescreva")
    for blk in re.findall(r'<p class="lead">(.*?)</p>', h):
        if len(re.sub("<[^>]+>", "", blk).split()) > 70: erros.append(f"{nome}: lead com mais de 70 palavras")
    for par in re.findall(r"<p>(.*?)</p>", texto, re.S):
        if len(re.sub("<[^>]+>", "", par).split()) > 75: erros.append(f"{nome}: parágrafo com mais de 75 palavras")
    erros += [f"{nome}: simconversa — {e}" for e in confere_conversas(h)]
    for src in re.findall(r'(?:src|poster)="(\.\./\.\./[^"]+)"', h):
        if not (p.parent / src).resolve().exists(): erros.append(f"{nome}: arquivo local ausente {src}")
if not (base / "index.html").exists(): erros.append("index.html ausente")

# viés do teste (7.7.9): a certa sempre na mesma posição, ou sempre a mais longa, deixa o aluno acertar sem ler
qs = []
for j in sorted((RAIZ / "conteudo" / args.lang / "aulas").glob("*.json")):
    for s in json.loads(j.read_text()).get("secoes", []):
        if s.get("tipo") == "quiz": qs += [q for q in s.get("perguntas", []) if q.get("opcoes")]
if len(qs) >= 8:
    pos = [q["certa"] for q in qs]
    topo = max(set(pos), key=pos.count)
    if pos.count(topo) / len(qs) > 0.5:
        erros.append(f"teste: a certa é a opção {topo + 1} em {pos.count(topo)} de {len(qs)} perguntas; varie a posição")
    longa = sum(1 for q in qs if len(q["opcoes"][q["certa"]]) > max(len(o) for i, o in enumerate(q["opcoes"]) if i != q["certa"]))
    if longa / len(qs) > 0.5:
        erros.append(f"teste: a certa é a opção mais longa em {longa} de {len(qs)} perguntas; deixe as erradas do mesmo tamanho")

# a capa da página inicial e a foto de cada aula são obrigatórias (o gerador usa sem conferir)
for img in ["assets/img/hero/inicio.jpg", *[f"assets/img/hero/{p.parent.name}.jpg" for p in aulas]]:
    if not (RAIZ / img).exists(): erros.append(f"imagem ausente: {img}")
if not (RAIZ / "assets/img/capa.jpg").exists(): erros.append("imagem ausente: assets/img/capa.jpg (og:image)")

if args.links:
    PROPRIO = json.loads((RAIZ / "conteudo" / "pt" / "curso.json").read_text())["url"]  # raiz: vale para PT, en/ e es/
    urls = set()
    for p in [base / "index.html", *aulas]:
        urls |= set(re.findall(r'(?:href|src)="(https://[^"]+)"', p.read_text()))
    urls = {u for u in urls if "fonts.g" not in u and not u.startswith(PROPRIO)}
    for u in sorted(urls):
        try:
            req = urllib.request.Request(u, method="HEAD" if u.endswith(".mp4") else "GET", headers={"User-Agent": "Mozilla/5.0"})
            st = urllib.request.urlopen(req, timeout=20).status
            if st != 200: erros.append(f"link {st}: {u}")
        except Exception as e:
            erros.append(f"link falhou ({e}): {u}")
    print(f"{len(urls)} links externos conferidos")

if erros:
    print("FALHOU:"); [print(" -", e) for e in erros]; sys.exit(1)
print(f"OK: {len(aulas)} aulas + index")
