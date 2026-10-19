#!/usr/bin/env python3
"""Traduz um curso v7.2 (conteudo/pt → conteudo/en e conteudo/es) pela ASSINATURA, pelo tradutor central do INEMA
(`inema-traduz`; motor/modelo em INEMA_TRADUCAO_MOTOR/MODELO, ambiente → ~/.config/inema/modelos.env; hoje Sonnet 5.5).
`--motor`/`--modelo` só sobrescrevem quando passados. Nunca API.

    python3 traduzir.py <pasta-do-curso> [en es] [--motor claude|codex] [--modelo ...] [--publico "..."]

Só os TEXTOS do JSON vão para o modelo: chaves, slugs, ícones, URLs, ids e números ficam iguais.
Cada texto é validado (mesmas tags HTML, mesmos links, linhas de comando idênticas, nada vazio);
o que falhar volta até 3 vezes; depois o script para e diz qual. Cache em <curso>/i18n/<lang>.json
(texto PT → tradução): texto já traduzido nunca é reenviado. Glossário opcional: <curso>/i18n/glossario.json
{"en": {"pt": "en"}, "es": {...}}. Nunca usa API: só os CLIs da assinatura (`claude -p` / `codex exec`).
"""
import argparse, json, os, pathlib, re, subprocess, sys, tempfile
from concurrent.futures import ThreadPoolExecutor

PULA = {"slug", "id", "tipo", "icone", "href", "url", "mp4", "poster", "vtt", "estilo", "selo", "lang",
        "foco", "dias", "certa", "falha", "num", "minutos", "horas_padrao", "data-ex",
        "vai", "nota"}  # 7.5.1: simconversa ("vai" = id da próxima fala; "fim" é booleano)
SE_SLUG = {"aula", "ref", "chave", "inicio"}  # pulados só quando o valor é slug ("filas", "fim_ruim"); "Aula" no ui traduz
UI_PADRAO = {"aula": "Aula", "comecar": "Começar a aula", "nesta_vai": "Nesta aula você vai",
             "trocar_tema": "Trocar tema claro/escuro",
             # 7.5.1: simconversa (mesmos padrões de CONV_UI no gerar.py)
             "conv_dica": "Escolha a sua resposta. O comentário aparece logo depois e a conversa segue conforme a escolha.",
             "conv_voce": "Você", "conv_escolha": "Sua resposta", "conv_boa": "Boa escolha", "conv_meio": "Dá para melhorar",
             "conv_ruim": "Escolha fraca", "conv_fim": "Fim da conversa", "conv_placar": "Você fez {p} de {m} pontos possíveis.",
             "conv_licao": "Lição:", "conv_recomecar": "Recomeçar a conversa", "conv_feita": "Seu melhor placar: {p} de {m} pontos."}
# padrões do gerar.py: entram no ui para serem traduzidos
CODIGO = {"conteudo"}            # blocos com botão copiar: comandos ficam, prosa/prompt traduz
NOMES = {"en": "English (United States)", "es": "Spanish (Latin America, neutral, use 'tú')"}
HTMLLANG = {"en": "en", "es": "es"}
# 7.5.1: comando só vale como palavra inteira ("Deliver" não é o comando del; "Cat" de "Categoria" não é cat)
# 7.5.2: del/set/type/copy/export/dir também são palavras de prosa ("del problema" em espanhol): só contam
# como comando se o próximo token parece caminho, opção ou variável (tem . / \ - = $ % : ou aspas)
CMD = re.compile(r"^\s*(?:(?:git|cd|ls|mkdir|python3?|pip3?|npm|npx|node|ssh|scp|curl|wget|gh|codex|claude|cp|mv|rm|cat|echo|"
                 r"chmod|sudo|systemctl|crontab|ollama|docker|uv)(?=\s|$)"
                 r"|(?:del|set|type|copy|export|dir)(?=\s*$|\s+\S*[./\\\-=$%:\"'])|\./|\$|>|#!)", re.I)
GLOSSARIO = {
    "en": {"Do chat ao agente": "From chat to agent", "degrau": "step", "pronto quando": "done when",
           "fila": "queue", "portão": "gate", "INEMA.CLUB": "INEMA.CLUB"},
    "es": {"Do chat ao agente": "Del chat al agente", "degrau": "nivel", "pronto quando": "listo cuando",
           "fila": "cola", "portão": "compuerta", "INEMA.CLUB": "INEMA.CLUB"},
}
SISTEMA = """You translate the text of an online course from Brazilian Portuguese to {nome}.
Rules:
- Audience: {publico}, reading on a phone.
  Plain, warm, direct, short sentences; address the reader as "you" ({tu}). Keep the same length and tone; no hype.
- Keep EXACTLY: HTML tags and attributes (<b>, <code>, <a href="...">, <br>, <pre>, <ul>...), URLs, numbers, emoji,
  product names (INEMA.CLUB, INEMA.PRO, OSWork, INTELECTO, Jarvis, inemaccbot, Claude Code, Codex, OpenRouter, Ollama,
  Telegram, GitHub, VPS, r7e, r7ex, promoavatar, finviral, advviral, saudeviral), file and folder names
  (README.md, AGENTS.md, .env, meu-jarvis.md, entrada/, rodando/, feito/, falhou/ ...), commands, flags, paths, variables.
- Text inside <code>...</code> stays as is unless it is plain Portuguese prose.
- Keys starting with "c:" are copyable blocks (terminal, files, prompts for the agent): translate ONLY comments,
  natural-language prompts and prose lines; every command line, path, file name, key and code stays byte-identical.
  Markdown headings/labels of a template may be translated.
- Glossary (use consistently): {glossario}
Return ONLY a JSON object with the same keys and the translated strings as values."""


PUBLICO_PADRAO = "adults learning to work with AI agents (terminal, Git, Telegram bots, queues, social media)"
_TRADUTOR = os.path.expanduser("~/projetos/wifi/scripts/inema-traduz")


def padrao_traducao():
    """(motor, modelo) de INEMA_TRADUCAO_MOTOR/MODELO: ambiente → ~/.config/inema/modelos.env → claude/Sonnet 5.5."""
    arq = {}
    f = pathlib.Path.home() / ".config/inema/modelos.env"
    if f.exists():
        for linha in f.read_text(encoding="utf-8").splitlines():
            m = re.match(r"\s*(INEMA_TRADUCAO_\w+)\s*=\s*([^#\s]*)", linha)
            if m:
                arq[m.group(1)] = m.group(2).strip("'\"")
    motor = os.environ.get("INEMA_TRADUCAO_MOTOR") or arq.get("INEMA_TRADUCAO_MOTOR") or "claude"
    modelo = os.environ.get("INEMA_TRADUCAO_MODELO") or arq.get("INEMA_TRADUCAO_MODELO") or ""
    if motor == "claude" and not modelo.startswith("claude-"):
        modelo = "claude-sonnet-5-5"
    elif motor == "codex" and (not modelo or modelo.startswith("claude-")):
        modelo = "gpt-6-luna"
    return motor, modelo


def chamar_tradutor(pedido, motor=None, modelo=None, timeout=900):
    """Tradução pelo tradutor central do INEMA (INEMA_TRADUCAO_* em ~/.config/inema/modelos.env). Assinatura, nunca API.
    motor/modelo só quando o usuário forçou (--motor/--modelo); senão vale a variável central."""
    env = {k: v for k, v in os.environ.items() if k not in ("ANTHROPIC_API_KEY", "OPENAI_API_KEY", "CLAUDECODE")}
    with tempfile.TemporaryDirectory() as d:
        if os.path.exists(_TRADUTOR):
            cmd = [_TRADUTOR] + (["--motor", motor] if motor else []) + (["--modelo", modelo] if modelo else [])
            r = subprocess.run(cmd, input=pedido, capture_output=True, text=True, timeout=timeout, cwd=d, env=env)
            txt = r.stdout
        else:  # fora da máquina do Nei: CLI da assinatura com o motor/modelo da variável (padrão Sonnet 5.5)
            m_pad, mod_pad = padrao_traducao()
            motor = motor or m_pad
            modelo = modelo or (mod_pad if motor == m_pad else {"claude": "claude-sonnet-5-5", "codex": "gpt-6-luna"}[motor])
            if motor == "claude":
                r = subprocess.run(["claude", "-p", "--model", modelo, "--output-format", "text", "--tools", ""],
                                   input=pedido, capture_output=True, text=True, timeout=timeout, cwd=d, env=env)
                txt = r.stdout
            else:
                out = os.path.join(d, "out.txt")
                r = subprocess.run(["codex", "exec", "-m", modelo, "--skip-git-repo-check", "--ephemeral", "--sandbox",
                                    "read-only", "-C", d, "-o", out, "-"], input=pedido, capture_output=True, text=True,
                                   timeout=timeout, env=env)
                txt = open(out, encoding="utf-8").read() if os.path.exists(out) else ""
    if r.returncode != 0 or not txt.strip():
        raise RuntimeError(f"tradutor falhou rc={r.returncode}: {(r.stderr or r.stdout)[-300:]}")
    return txt


def via_tradutor(pedido, motor=None, modelo=None):
    """Chama o tradutor central e devolve o JSON da resposta."""
    txt = re.sub(r"^```(?:json)?\s*|\s*```$", "", chamar_tradutor(pedido, motor, modelo).strip())
    return json.loads(txt[txt.index("{"):txt.rindex("}") + 1])


def textos(no, caminho=()):
    """Gera (caminho, texto, é_código) de cada string traduzível."""
    if isinstance(no, dict):
        for k, v in no.items():
            if k in PULA or (k in SE_SLUG and isinstance(v, str) and re.fullmatch(r"[a-z0-9_-]+", v)):
                continue
            yield from textos(v, caminho + (k,))
    elif isinstance(no, list):
        for i, v in enumerate(no):
            yield from textos(v, caminho + (i,))
    elif isinstance(no, str):
        t = no.strip()
        if not t or re.fullmatch(r"https?://\S+|[\d\s.,:/%+\-–—·×]+|#[\w-]+", t):
            return
        yield caminho, no, (caminho and caminho[-1] in CODIGO)


def por(no, caminho, valor):
    for k in caminho[:-1]:
        no = no[k]
    no[caminho[-1]] = valor


def problema(pt, tr, codigo):
    if not isinstance(tr, str) or not tr.strip():
        return "vazio"
    # 7.6.9: texto longo devolvido igual ao PT, com palavra portuguesa, é tradução que não aconteceu
    if tr.strip() == pt.strip() and len(pt) > 40 and re.search(r"\b(não|você|são|está|também|então|para o|para a)\b|ção\b|ções\b", pt):
        return "igual ao original (não traduzido)"
    tags = lambda s: sorted(re.findall(r"</?([a-zA-Z][a-zA-Z0-9]*)", s))
    if not codigo and tags(pt) != tags(tr):   # em bloco de código, <seu nome> é marcador, não tag
        return "tags diferentes"
    if sorted(re.findall(r'href="([^"]+)"', pt)) != sorted(re.findall(r'href="([^"]+)"', tr)):
        return "links diferentes"
    if sorted(re.findall(r"https?://[^\s\"'<)]+", pt)) != sorted(re.findall(r"https?://[^\s\"'<)]+", tr)):
        return "URLs diferentes"
    if codigo:
        # cada linha de comando continua começando pelo mesmo comando, na mesma ordem (o texto entre aspas pode traduzir)
        cab = lambda s: [l.split()[0] for l in s.splitlines() if l.strip() and CMD.match(l) and not l.lstrip().startswith("#")]
        if cab(pt) != cab(tr):
            return f"comandos diferentes: {cab(pt)[:4]} → {cab(tr)[:4]}"
    if sorted(re.findall(r"\{[a-z]\}", pt)) != sorted(re.findall(r"\{[a-z]\}", tr)):  # {p}, {m}, {n}, {a}
        return "marcadores {x} diferentes"
    if pt.startswith(" ") != tr.startswith(" ") or pt.endswith(" ") != tr.endswith(" "):
        return "espaço de borda"
    return None


def traduz_lote(itens, lang, modelo, glos, motor=None, publico=PUBLICO_PADRAO):
    """itens: {chave: texto_pt}. Devolve {chave: tradução válida}; tenta de novo só os inválidos."""
    sistema = SISTEMA.format(nome=NOMES[lang], tu="you" if lang == "en" else "tú",
                             glossario=json.dumps(glos, ensure_ascii=False), publico=publico)
    ok, pend = {}, dict(itens)
    for tentativa in range(3):
        if not pend:
            break
        try:
            r = via_tradutor(sistema + "\n\nINPUT JSON:\n" + json.dumps(pend, ensure_ascii=False), motor, modelo)
        except Exception as e:
            print(f"  [{lang}] lote falhou ({e}); nova tentativa", file=sys.stderr)
            continue
        for k, pt in list(pend.items()):
            erro = problema(pt, r.get(k), k.startswith("c:"))
            if not erro:
                ok[k] = r[k]; del pend[k]
            elif tentativa == 2:
                print(f"  [{lang}] inválido após 3 tentativas ({erro}): {pt[:80]!r}", file=sys.stderr)
    return ok, pend


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("pasta"); ap.add_argument("langs", nargs="*", default=["en", "es"])
    ap.add_argument("--motor", choices=["claude", "codex"], help="força o motor (padrão: INEMA_TRADUCAO_MOTOR)")
    ap.add_argument("--modelo", help="força o modelo (padrão: INEMA_TRADUCAO_MODELO)")
    ap.add_argument("--lote", type=int, default=45)
    ap.add_argument("--publico", default=PUBLICO_PADRAO, help="quem lê o curso (vai no pedido de tradução, em inglês)")
    a = ap.parse_args()
    m_pad, mod_pad = padrao_traducao()
    print(f"tradutor: {a.motor or m_pad} / {a.modelo or (mod_pad if (a.motor or m_pad) == m_pad else 'padrão do motor')}"
          + ("" if (a.motor or a.modelo) else " (variável central INEMA_TRADUCAO_*)"))
    raiz = pathlib.Path(a.pasta).resolve()
    pt = raiz / "conteudo" / "pt"
    arquivos = [pt / "curso.json", *sorted((pt / "aulas").glob("*.json"))]
    (raiz / "i18n").mkdir(exist_ok=True)
    glos_extra = {}
    if (raiz / "i18n" / "glossario.json").exists():
        glos_extra = json.loads((raiz / "i18n" / "glossario.json").read_text())
    falhas = 0
    for lang in a.langs:
        cache_f = raiz / "i18n" / f"{lang}.json"
        cache = json.loads(cache_f.read_text()) if cache_f.exists() else {}
        glos = {**GLOSSARIO[lang], **glos_extra.get(lang, {})}
        dados = {f: json.loads(f.read_text()) for f in arquivos}
        for k, v in UI_PADRAO.items():
            dados[arquivos[0]]["ui"].setdefault(k, v)
        unidades = {}  # texto_pt → é_código
        for d in dados.values():
            for _, t, cod in textos(d):
                if t not in cache:
                    unidades[t] = unidades.get(t, False) or cod
        lista = list(unidades.items())
        lotes = [lista[i:i + a.lote] for i in range(0, len(lista), a.lote)]
        print(f"[{lang}] {len(lista)} textos novos em {len(lotes)} lotes ({len(cache)} no cache)")
        def roda(lote):
            itens = {("c:" if cod else "t:") + str(i): t for i, (t, cod) in enumerate(lote)}
            ok, pend = traduz_lote(itens, lang, a.modelo, glos, a.motor, a.publico)
            return {itens[k]: v for k, v in ok.items()}, len(pend)
        with ThreadPoolExecutor(4) as ex:
            for novos, n_pend in ex.map(roda, lotes):
                cache.update(novos); falhas += n_pend
                cache_f.write_text(json.dumps(cache, ensure_ascii=False, indent=1) + "\n")
        destino = raiz / "conteudo" / lang
        (destino / "aulas").mkdir(parents=True, exist_ok=True)
        faltou = 0
        for f, d in dados.items():
            for cam, t, _ in list(textos(d)):
                if t in cache:
                    por(d, cam, cache[t])
                else:
                    faltou += 1
            if f.name == "curso.json":
                d["lang"] = HTMLLANG[lang]
                d["url"] = d["url"].rstrip("/") + f"/{lang}/"
            rel = f.relative_to(pt)
            (destino / rel).write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n")
        print(f"[{lang}] gravado em conteudo/{lang}/ ({faltou} textos sem tradução)")
        falhas += faltou
    if falhas:
        print(f"FALHOU: {falhas} textos sem tradução válida — rode de novo (o cache guarda o que já foi)")
        sys.exit(1)
    print("OK: tradução completa")


if __name__ == "__main__":
    main()
