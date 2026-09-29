#!/usr/bin/env python3
"""Traduz um curso v6 montado (curso.html + landing.html + textos do motor) para EN/ES.

Uso (depois do montar-curso.py):
  python3 traduzir-curso.py <pasta-do-curso> [en es] [--so-montar] [--modelo <id>] [--reserva-groq]

Padrão INEMA trilíngue (RELATORIO-CURSOS-TRILINGUES.md): PT na raiz, <lang>/ ao lado; só TEXTO vai para a API
(blocos com as tags inline preservadas, atributos, cartões e o bloco L do motor); CSS/JS/imagens são reaproveitados.
Motor padrão (6.4): Codex pela ASSINATURA (`codex exec`, sessão do `codex login`), modelo gpt-6-luna — sem chave de API.
Todo GPT só pela assinatura. Reserva Groq (modelo que não é GPT, chave GROQ_API_KEY) DESLIGADA: só com `--reserva-groq`
ou RESERVA_GROQ=1, por pedido explícito do usuário; entra só no lote em que o Codex falhou 3 vezes. Cache em <curso>/i18n/<lang>.json: unidade já traduzida nunca é reenviada. Unidade inválida
(tags, {n}, espaços de borda, vazio) volta sozinha até 3 vezes; depois o build para e diz qual.
Glossário opcional do curso: <curso>/i18n/glossario.json {"en": {"pt": "en"}, "es": {...}}.
Custo e tokens de cada chamada: <curso>/i18n/usage.jsonl.
Saída: <lang>/curso.html, <lang>/landing.html, <lang>/index.html, <lang>/assets/curso.js; PT ganha os <link hreflang>.
Estado do aluno separado por idioma (meta curso + "-<lang>"). Imagens e CSS compartilhados (../assets/).
"""
import copy, html, json, os, re, subprocess, sys, tempfile, time, urllib.error, urllib.request
from concurrent.futures import ThreadPoolExecutor
from bs4 import BeautifulSoup, NavigableString, Comment

GROQ_MODELO = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")   # reserva (não é GPT)
CODEX_MODELO = "gpt-6-luna"       # motor codex (assinatura); troque com --modelo
PARALELO = 4                      # lotes simultâneos no motor codex
URL = "https://api.groq.com/openai/v1/chat/completions"   # só a reserva Groq
NOMES = {"en": "English (United States)", "es": "Spanish (Latin America)"}
ROTULO = {"pt": "Português", "en": "English", "es": "Español"}
HTMLLANG = {"pt": "pt-BR", "en": "en", "es": "es"}
CAPRE = {"en": "^(by the end of this lesson,? )?you (can|will be able to|have|will have) ",
         "es": "^(al final de esta lección,? )?(ya )?(puedes|podrás|tienes|tendrás) "}
INLINE = {"b", "strong", "i", "em", "span", "a", "br", "code", "small", "mark", "sup", "sub", "kbd", "abbr"}
ATTRS = ["alt", "title", "aria-label", "placeholder", "data-def", "data-rotulo", "data-fb", "data-exlbl", "data-cap"]
GLOSS_V6 = {
    "en": {"aula": "lesson", "trilha": "track", "Pratique agora": "Practice now", "Teste-se": "Test yourself",
           "Em 1 minuto": "In 1 minute", "Cola da aula": "Lesson cheat sheet", "Se travou aqui, é normal": "Stuck here? That's normal",
           "Quer saber mais?": "Want to know more?", "Seu próximo passo": "Your next step", "Na prática": "In practice",
           "Erro comum": "Common mistake", "Antes": "Before", "Depois": "After", "Saldo": "Net gain", "Chat de IA": "AI chat",
           "Você": "You", "IA": "AI", "pedido": "request", "gestora": "manager", "professor": "teacher",
           "roteiro": "worksheet (never script)", "roteiro de laboratório": "lab worksheet", "cópia": "copy (never backup)"},
    "es": {"aula": "lección", "trilha": "ruta", "Pratique agora": "Practica ahora", "Teste-se": "Ponte a prueba",
           "Em 1 minuto": "En 1 minuto", "Cola da aula": "Resumen de bolsillo", "Se travou aqui, é normal": "Si te trabaste aquí, es normal",
           "Quer saber mais?": "¿Quieres saber más?", "Seu próximo passo": "Tu próximo paso", "Na prática": "En la práctica",
           "Erro comum": "Error común", "Antes": "Antes", "Depois": "Después", "Saldo": "Balance", "Chat de IA": "Chat de IA",
           "Você": "Tú", "IA": "IA", "pedido": "pedido", "gestora": "gestora", "professor": "profesor",
           "roteiro": "guía (nunca script ni guion)", "roteiro de laboratório": "guía de laboratorio"},
}
SYS = """You are a careful professional educational translator. Translate the Brazilian Portuguese strings into {nome}.
Input: a JSON object {{id: string}}. Output: a JSON object with EXACTLY the same ids, each mapped to its translation. No other keys.
HARD RULES
- Never summarize, omit or add content. Keep numbers, times, dates, weekdays, money values, names of people and file/folder names as they are.
- Strings may contain inline HTML. Keep EVERY tag and attribute exactly (same tags, same order, same class/href/data-* values);
  translate only the human text. Keep HTML entities like &lt; &gt; &amp; as entities.
- Keep leading/trailing spaces and line breaks exactly. Keep placeholders like {{n}} untouched.
- Text between &lt; and &gt; is a fill-in hint for the student: translate the words inside, keep the &lt; &gt;.
- Brand/product names stay: INEMA.CLUB, INEMA.PRO, PRO, OSWork, ChatGPT, Word, Google Drive.
- Audience: adult beginners (30+) who never programmed, reading on a phone. Plain, warm, adult, direct language; short sentences;
  address the reader as "you" ({tu}). No hype, never infantilize.
- Do not introduce platform jargon: terminal, install, script, server, repository, commit, branch, Git, JSON, pipeline,
  config file, API, deploy, CLI, directory, plugin, encoding, workflow, input, output, setup, framework, upload, download, login, backup.
  Say "folder" (never "directory"), "copy with the date" (never "backup"), "sign in" (never "login").
- Never say "on the right/left" — the layout stacks on phones; refer to cards by their labels.
GLOSSARY (use consistently):
{glossario}"""

def chave():
    for p in ("~/projetos/openpcbotv2/.env", "~/projetos/wifi/.env"):
        f = os.path.expanduser(p)
        if os.path.exists(f):
            for linha in open(f, encoding="utf-8"):
                m = re.match(r"\s*GROQ_API_KEY\s*=\s*(.+)", linha)
                if m: return m.group(1).strip().strip("'\"")
    sys.exit("GROQ_API_KEY não encontrada nos dois .env conhecidos (pedida a reserva Groq).")

def via_codex(sistema, lote, modelo):
    """Um lote pelo `codex exec` da assinatura: só leitura, sem sessão salva, resposta final num arquivo."""
    pedido = (sistema + "\n\nReturn ONLY the JSON object (no code fences, no comments). INPUT JSON:\n"
              + json.dumps(lote, ensure_ascii=False))
    with tempfile.TemporaryDirectory() as d:
        out = os.path.join(d, "out.txt")
        r = subprocess.run(["codex", "exec", "-m", modelo, "--skip-git-repo-check", "--ephemeral", "--sandbox", "read-only",
                            "-C", d, "-o", out, "-"], input=pedido, capture_output=True, text=True, timeout=900)
        if r.returncode or not os.path.exists(out): raise RuntimeError(f"codex exec rc={r.returncode}: {r.stderr[-300:]}")
        txt = open(out, encoding="utf-8").read().strip()
    txt = re.sub(r"^```(?:json)?\s*|\s*```$", "", txt)
    return json.loads(txt[txt.index("{"):txt.rindex("}") + 1])

# 6.2 — perfil técnico: o público APRENDE os termos técnicos; o prompt troca a regra "sem jargão" por esta.
SYS_TECNICO = """- Audience: adults learning technical skills (terminal, Git, servers) step by step, reading on a phone. Plain, warm,
  adult, direct language; short sentences; address the reader as "you" ({tu}). No hype, never infantilize.
- Technical terms are part of the lesson: keep them in their standard technical form in {nome} (terminal, Git, commit,
  repository, SSH, VPS, systemd, token, API, Markdown, AGENTS.md...). Never replace them with lay paraphrases.
- Commands, code, flags, paths, file names and environment variables stay EXACTLY as written; translate only the prose around them.
- Never introduce a technical term that is not in the source: translate everyday Portuguese words with everyday words
  (e.g. "entrar" -> "sign in", not "login"; "cópia datada" -> "dated copy", not "backup"; "saída" -> "result", not "output").
- Never say "on the right/left" — the layout stacks on phones; refer to cards by their labels."""
_SYS_LEIGO = SYS[SYS.index("- Audience:"):SYS.index("GLOSSARY")].rstrip("\n")

def perfil_tecnico(base):
    p = os.path.join(base, "curso.html")
    return os.path.exists(p) and '<meta name="perfil" content="tecnico">' in open(p, encoding="utf-8").read()

def sem_traducao(tag):
    """Bloco de comando: <pre class="cmd"> ou <pre> dentro de .terminal — fica igual em todo idioma."""
    pre = tag if tag.name == "pre" else tag.find_parent("pre")
    return pre is not None and ("cmd" in (pre.get("class") or []) or pre.find_parent(class_="terminal") is not None)

def fixa_ids(src, tr):
    """data-gl (âncora do glossário) nunca muda de idioma: o modelo às vezes traduz o valor; restaura na ordem do PT."""
    ids = re.findall(r'data-gl="([^"]*)"', src)
    if not ids: return tr
    it = iter(ids)
    return re.sub(r'data-gl="[^"]*"', lambda m: f'data-gl="{next(it, "")}"', tr) if len(re.findall(r'data-gl="', tr)) == len(ids) else tr

def is_leaf(tag):
    if tag.name in ("script", "style", "svg", "head", "html", "body", "br"): return False
    has_text = False
    for c in tag.children:
        if isinstance(c, Comment): continue
        if isinstance(c, NavigableString):
            if c.strip(): has_text = True
            continue
        if c.name not in INLINE: return False
        if c.get_text(strip=True): has_text = True
    return has_text

def leaves(soup):
    out = []
    def walk(t):
        for c in t.children:
            if getattr(c, "name", None) is None: continue
            if c.name in ("script", "style", "svg"): continue
            if c.name == "pre" and sem_traducao(c): continue
            if is_leaf(c): out.append(c)
            else: walk(c)
    walk(soup.body)
    folhas = set(id(x) for x in out)
    def dentro(n):
        p = n.parent
        while p is not None:
            if id(p) in folhas: return True
            p = p.parent
        return False
    orf = [s for s in soup.body.find_all(string=True) if s.strip() and not isinstance(s, Comment)
           and s.parent.name not in ("script", "style") and not s.find_parent("svg") and not dentro(s) and not sem_traducao(s.parent)]
    if orf: print(f"  aviso: {len(orf)} trechos de texto fora de bloco traduzível, ex.: {orf[0].strip()[:60]!r}", file=sys.stderr)
    if soup.title and soup.title.string: out.append(soup.title)
    return out

def inner(t): return "".join(html.escape(str(c), quote=False) if isinstance(c, NavigableString) and not isinstance(c, Comment) else str(c) for c in t.contents)
def tagsig(s): return re.findall(r"</?([a-z0-9]+)(?:\s[^>]*?(?:class=\"([^\"]*)\")?[^>]*)?>", s)
def valida(src, tr):
    if not isinstance(tr, str) or not tr.strip(): return "vazio"
    if tagsig(src) != tagsig(tr): return "tags"
    if src.count("{n}") != tr.count("{n}"): return "{n}"
    if (src[:1].isspace(), src[-1:].isspace()) != (tr[:1].isspace(), tr[-1:].isspace()): return "espaço de borda"
    if src.count("&lt;") != tr.count("&lt;"): return "&lt;"
    return None

def ler_L(js):
    m = re.search(r"/\*L-INICIO.*?\*/\s*var L=(\{.*?\});\s*/\*L-FIM\*/", js, re.S)
    if not m: sys.exit("bloco L-INICIO/L-FIM não encontrado em assets/curso.js")
    return m, json.loads(m.group(1))

def unidades(base):
    us = []
    for nome in ("curso.html", "landing.html"):
        p = os.path.join(base, nome)
        if not os.path.exists(p): continue
        soup = BeautifulSoup(open(p, encoding="utf-8").read(), "html.parser")
        us += [inner(t) for t in leaves(soup)]
        for a in ATTRS:
            us += [t[a] for t in soup.find_all(attrs={a: True}) if t[a].strip()]
        md = soup.find("meta", attrs={"name": "description"})
        if md and md.get("content"): us.append(md["content"])
        for sc in soup.find_all("script", id=re.compile(r"^cards-")):
            for c in json.loads(sc.string): us += [c["front"], c["back"]]
    _, L = ler_L(open(os.path.join(base, "assets", "curso.js"), encoding="utf-8").read())
    for k, v in L.items():
        if k == "capRe": continue
        us += list(v.values()) if isinstance(v, dict) else [v]
    vistos, out = set(), []
    for u in us:
        if u not in vistos and re.search(r"[A-Za-zÀ-ú]", u): vistos.add(u); out.append(u)
    return out

def via_groq(sistema, lote, api):
    """Reserva: só quando o usuário ativou (--reserva-groq). Modelo que não é GPT."""
    corpo = {"model": GROQ_MODELO, "temperature": 0.15, "max_completion_tokens": 8000, "response_format": {"type": "json_object"},
             "messages": [{"role": "system", "content": sistema}, {"role": "user", "content": json.dumps(lote, ensure_ascii=False)}]}
    req = urllib.request.Request(URL, data=json.dumps(corpo).encode(), headers={"Authorization": f"Bearer {api}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=240) as r: res = json.loads(r.read())
    return json.loads(res["choices"][0]["message"]["content"]), res.get("usage", {})

def traduz(base, lang, api, fonte, modelo=CODEX_MODELO):
    os.makedirs(os.path.join(base, "i18n"), exist_ok=True)
    dest = os.path.join(base, "i18n", f"{lang}.json")
    cache = json.load(open(dest, encoding="utf-8")) if os.path.exists(dest) else {}
    gl = dict(GLOSS_V6[lang]); gp = os.path.join(base, "i18n", "glossario.json")
    if os.path.exists(gp): gl.update(json.load(open(gp, encoding="utf-8")).get(lang, {}))
    sistema = SYS.format(nome=NOMES[lang], tu="informal 'tú'" if lang == "es" else "you",
                         glossario="\n".join(f"  {a} -> {b}" for a, b in gl.items()))
    if perfil_tecnico(base):
        gl = {a: b for a, b in gl.items() if "never" not in b and "nunca" not in b}   # "never script/backup" não vale aqui
        sistema = SYS.format(nome=NOMES[lang], tu="informal 'tú'" if lang == "es" else "you",
                             glossario="\n".join(f"  {a} -> {b}" for a, b in gl.items()))
        sistema = sistema.replace(_SYS_LEIGO.format(nome=NOMES[lang], tu="informal 'tú'" if lang == "es" else "you"),
                                  SYS_TECNICO.format(nome=NOMES[lang], tu="informal 'tú'" if lang == "es" else "you"))
        assert "Technical terms are part of the lesson" in sistema, "troca do prompt técnico falhou"
    for rodada in range(4):
        falta = [u for u in fonte if u not in cache]
        if not falta: break
        lotes, lote, tam = [], {}, 0
        for u in falta:
            lote[str(len(lote))] = u; tam += len(u)
            if tam > 3000 or len(lote) >= 40 or rodada > 0 and len(lote) >= 8: lotes.append(lote); lote, tam = {}, 0
        if lote: lotes.append(lote)
        def grava(i, lote, saida, extra):
            ok = ruins = 0
            for k, src in lote.items():
                tr = saida.get(k)
                if valida(src, tr) is None: cache[src] = tr; ok += 1
                else: ruins += 1
            with open(os.path.join(base, "i18n", "usage.jsonl"), "a") as fh:
                fh.write(json.dumps({"t": time.strftime("%Y-%m-%dT%H:%M:%S"), "lang": lang, "ok": ok, "rejeitadas": ruins, **extra}) + "\n")
            json.dump(cache, open(dest, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
            print(f"  {lang} rodada {rodada+1} lote {i}/{len(lotes)}: {ok} ok, {ruins} rejeitadas", flush=True)
        def um(par):
            i, lote = par
            for tent in range(3):
                t0 = time.time()
                try: return i, lote, via_codex(sistema, lote, modelo), {"motor": "codex-assinatura", "modelo": modelo, "seg": round(time.time() - t0)}
                except (RuntimeError, subprocess.TimeoutExpired, ValueError, json.JSONDecodeError) as e:
                    erro = e; time.sleep(5 * (tent + 1))
            if api:
                try:
                    saida, u = via_groq(sistema, lote, api)
                    print(f"  {lang} lote {i}: Codex falhou 3x; usada a reserva Groq ({GROQ_MODELO})", file=sys.stderr)
                    return i, lote, saida, {"motor": "groq-reserva", "modelo": GROQ_MODELO, "in": u.get("prompt_tokens"), "out": u.get("completion_tokens")}
                except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, json.JSONDecodeError, KeyError) as e2: erro = e2
            print(f"  {lang} lote {i}: falhou ({str(erro)[:160]}); fica para a próxima rodada", file=sys.stderr)
            return i, lote, {}, {"motor": "falhou"}
        with ThreadPoolExecutor(PARALELO) as ex:
            for i, lote, saida, extra in ex.map(um, enumerate(lotes, 1)):
                grava(i, lote, saida, extra)
    falta = [u for u in fonte if u not in cache]
    fp = os.path.join(base, "i18n", f"{lang}-faltando.json")
    if falta:
        # não aborta o idioma: monta o resto (o trecho fica em PT) e lista o que faltou para traduzir à mão no cache
        json.dump(falta, open(fp, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print(f"  ATENÇÃO {lang}: {len(falta)} unidades sem tradução válida após 4 rodadas (ficam em PT). "
              f"Lista em {fp} — traduza no cache i18n/{lang}.json e rode de novo com --so-montar. Ex.: {falta[0][:120]!r}", file=sys.stderr)
    elif os.path.exists(fp): os.remove(fp)
    return cache

def alternates(soup, pagina, lang, langs):
    for l in soup.find_all("link", rel="alternate"): l.decompose()
    for alvo in ["pt"] + langs:
        if alvo == lang: href = pagina
        elif lang == "pt": href = f"{alvo}/{pagina}"
        elif alvo == "pt": href = f"../{pagina}"
        else: href = f"../{alvo}/{pagina}"
        tag = soup.new_tag("link", rel="alternate", hreflang=HTMLLANG[alvo], href=href); tag["data-nome"] = ROTULO[alvo]
        soup.head.append(tag)

def langnav(soup, pagina, lang, langs):
    for n in soup.find_all(class_="langs"): n.decompose()
    bar = soup.select_one(".bar-inner")
    if not bar or pagina != "landing.html": return
    nav = soup.new_tag("nav"); nav["class"] = "langs"; nav["aria-label"] = "Idioma"
    for alvo in ["pt"] + langs:
        a = soup.new_tag("a", href=(pagina if alvo == lang else (f"{alvo}/{pagina}" if lang == "pt" else (f"../{pagina}" if alvo == "pt" else f"../{alvo}/{pagina}"))))
        a.string = alvo.upper()
        if alvo == lang: a["aria-current"] = "true"
        nav.append(a)
    bar.insert(len(bar.contents) - 1, nav)

def monta(base, lang, tr, langs):
    os.makedirs(os.path.join(base, lang, "assets"), exist_ok=True)
    for pagina in ("curso.html", "landing.html"):
        p = os.path.join(base, pagina)
        if not os.path.exists(p): continue
        soup = BeautifulSoup(open(p, encoding="utf-8").read(), "html.parser")
        for t in leaves(soup):
            src = inner(t)
            if src not in tr: continue
            novo = BeautifulSoup(fixa_ids(src, tr[src]), "html.parser")
            t.clear()
            for c in list(novo.contents): t.append(c)
        for a in ATTRS:
            for t in soup.find_all(attrs={a: True}):
                if t[a] in tr: t[a] = tr[t[a]]
        md = soup.find("meta", attrs={"name": "description"})
        if md and md.get("content") in tr: md["content"] = tr[md["content"]]
        for sc in soup.find_all("script", id=re.compile(r"^cards-")):
            cs = json.loads(sc.string); sc.string = "\n" + json.dumps([{"front": tr.get(c["front"], c["front"]), "back": tr.get(c["back"], c["back"])} for c in cs], ensure_ascii=False, indent=1) + "\n"
        soup.html["lang"] = HTMLLANG[lang]
        mc = soup.find("meta", attrs={"name": "curso"})
        if mc: mc["content"] = mc["content"] + "-" + lang
        for t in soup.find_all(["img", "link", "script"]):
            k = "src" if t.name in ("img", "script") else "href"
            v = t.get(k)
            if v and v.startswith("assets/") and not v.endswith("curso.js"): t[k] = "../" + v
        for s in soup.find_all("script"):
            if s.string and "localStorage.getItem(" in s.string and mc:
                s.string = re.sub(r'getItem\("([^"]+)"\)', lambda m: f'getItem("{m.group(1)}-{lang}")' if not m.group(1).endswith("-" + lang) else m.group(0), s.string)
        alternates(soup, pagina, lang, langs); langnav(soup, pagina, lang, langs)
        open(os.path.join(base, lang, pagina), "w", encoding="utf-8").write(str(soup))
    js = open(os.path.join(base, "assets", "curso.js"), encoding="utf-8").read()
    m, L = ler_L(js)
    L2 = {k: ({kk: tr.get(vv, vv) for kk, vv in v.items()} if isinstance(v, dict) else (CAPRE[lang] if k == "capRe" else tr.get(v, v))) for k, v in L.items()}
    js2 = js[:m.start(1)] + json.dumps(L2, ensure_ascii=False) + js[m.end(1):]
    open(os.path.join(base, lang, "assets", "curso.js"), "w", encoding="utf-8").write(js2)
    try: nome = html.escape(json.load(open(os.path.join(base, "curso.json"), encoding="utf-8")).get("curso_curto", "Curso"))
    except Exception: nome = "Curso"
    open(os.path.join(base, lang, "index.html"), "w").write(f'<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=landing.html"><a href="landing.html">{nome}</a>\n')

def pt_alternates(base, langs):
    for pagina in ("curso.html", "landing.html"):
        p = os.path.join(base, pagina)
        if not os.path.exists(p): continue
        soup = BeautifulSoup(open(p, encoding="utf-8").read(), "html.parser")
        alternates(soup, pagina, "pt", langs); langnav(soup, pagina, "pt", langs)
        open(p, "w", encoding="utf-8").write(str(soup))

def main():
    argv = sys.argv[1:]
    def opt(nome, padrao):
        if nome in argv:
            i = argv.index(nome); v = argv[i + 1]; del argv[i:i + 2]; return v
        return padrao
    modelo = opt("--modelo", CODEX_MODELO)
    args = [a for a in argv if not a.startswith("--")]
    base = os.path.abspath(args[0]); langs = args[1:] or ["en", "es"]
    fonte = unidades(base)
    so_montar = "--so-montar" in sys.argv
    reserva = "--reserva-groq" in sys.argv or os.environ.get("RESERVA_GROQ") == "1"
    print(f"{len(fonte)} unidades de texto ({sum(len(u) for u in fonte)} caracteres) · Codex pela assinatura ({modelo})"
          + (f" · reserva Groq LIGADA ({GROQ_MODELO})" if reserva else " · reserva Groq desligada"))
    api = chave() if (reserva and not so_montar) else None
    for lang in langs:
        if not so_montar: tr = traduz(base, lang, api, fonte, modelo)
        else: tr = json.load(open(os.path.join(base, "i18n", f"{lang}.json"), encoding="utf-8"))
        monta(base, lang, tr, langs); print(f"{lang}/: curso.html, landing.html, index.html, assets/curso.js")
    pt_alternates(base, langs)
    us = [json.loads(l) for l in open(os.path.join(base, "i18n", "usage.jsonl"))] if os.path.exists(os.path.join(base, "i18n", "usage.jsonl")) else []
    print(f"chamadas pela assinatura do Codex: {sum(1 for u in us if u.get('motor') == 'codex-assinatura')}; "
          f"reserva Groq usada: {sum(1 for u in us if u.get('motor') == 'groq-reserva')} lote(s)")

if __name__ == "__main__":
    main()
