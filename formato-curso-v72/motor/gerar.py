#!/usr/bin/env python3
"""INEMA Learning v7.2 — gera o curso a partir de conteudo/ (PT na raiz; EN/ES em en/ e es/).

    python3 gerar.py            # PT (raiz)
    python3 gerar.py --lang en  # quando existir conteudo/en/

Cada aula é um JSON em conteudo/<lang>/aulas/. Textos de interface ficam em conteudo/<lang>/curso.json → "ui".
Campos de texto aceitam <b>, <code>, <a> e <br>; o resto é escapado na origem (blocos de código).
"""
import argparse, html, json, pathlib, re, sys

VERSAO = "7.14.19"    # versão do motor (CHANGELOG.md da skill formato-curso-v72)
RAIZ = pathlib.Path(__file__).resolve().parent
PREFIXO = "../../"  # caminho até a raiz a partir da página em geração (v7.2: foto do "Você" no diagrama)
FOTO_VOCE = "assets/img/voce.jpg"
LANG = "pt"          # idioma em geração; PT fica na raiz, os outros em <lang>/ (definido em main)
IDIOMAS = ["pt"]     # idiomas com conteudo/<lang>/curso.json (seletor e hreflang)
URL_RAIZ = ""        # URL publicada da raiz (versão PT)
ROT_IDIOMA = {"pt": "PT", "en": "EN", "es": "ES"}
HREFLANG = {"pt": "pt-BR", "en": "en", "es": "es"}


def ativo(prefixo):
    """Caminho até a RAIZ do repo (assets/), a partir da página: em en/ e es/ sobe um nível a mais."""
    return prefixo + ("" if LANG == "pt" else "../")


def href_lang(o):
    """7.14.19: link com versão por idioma — {"href": PT, "href_en": …, "href_es": …}; sem a chave do idioma, o href PT."""
    return o.get(f"href_{LANG}") or o["href"]


def img_idioma(rel):
    """assets/img/capa.jpg → assets/img/capa-en.jpg quando existir a versão do idioma (imagem com texto)."""
    if LANG != "pt":
        alt = re.sub(r"(\.\w+)$", f"-{LANG}\\1", rel)
        if (RAIZ / alt).exists():
            return alt
    return rel


def url_idioma(lg, pag=""):
    return URL_RAIZ + ("" if lg == "pt" else f"{lg}/") + pag


def id_curso(curso):
    """Progresso separado por idioma."""
    return curso["id"] if LANG == "pt" else f'{curso["id"]}-{LANG}'

ICONES = {  # traço fino estilo Lucide (MIT)
    "chat": '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    "terminal": '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
    "pasta": '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
    "arquivo": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/>',
    "git": '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="9" r="2.5"/><path d="M6 8.5v7"/><path d="M18 11.5c0 3-3 4.5-9.5 5"/>',
    "cadeado": '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    "cerebro": '<path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 1 5 3 3 0 0 0 4 4V3z"/><path d="M15 3a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-1 5 3 3 0 0 1-4 4V3z"/>',
    "robo": '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4"/><circle cx="12" cy="3" r="1"/><circle cx="9" cy="14" r="1.2"/><circle cx="15" cy="14" r="1.2"/>',
    "enviar": '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
    "nuvem": '<path d="M18 10h-1.3A7 7 0 1 0 9 19h9a5 5 0 0 0 0-10z"/>',
    "chip": '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    "memoria": '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    "fila": '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
    "check": '<path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><polyline points="22 4 12 14 9 11"/>',
    "x": '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
    "portao": '<rect x="5" y="4" width="4" height="16" rx="1"/><rect x="15" y="4" width="4" height="16" rx="1"/>',
    "relogio": '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    "video": '<rect x="2" y="6" width="14" height="12" rx="2"/><polygon points="22 8 16 12 22 16 22 8"/>',
    "lupa": '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.6" y2="16.6"/>',
    "escudo": '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    "grafico": '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
    "calendario": '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    "usuario": '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    "alvo": '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    "camadas": '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    "play": '<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>',
    "lista": '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    "copiar": '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    "seta": '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    "voltar": '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
    "menu": '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
    "compartilhar": '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/>',
    "sol": '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    "lua": '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    "megafone": '<path d="M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M17 8a5 5 0 0 1 0 8"/>',
    "caneta": '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    "marca": '<path d="M9 11l-6 6v3h9l3-3"/><path d="M22 12l-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>',
    "baixar": '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    "carregar": '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
}


def ic(nome, cls="ico"):
    return f'<svg class="{cls}" viewBox="0 0 24 24" aria-hidden="true">{ICONES.get(nome, ICONES["alvo"])}</svg>'


def esc(s):
    return html.escape(s, quote=True)


def attr(s):
    return html.escape(s, quote=True)


# ---------- seções ----------
# conexão desenhada entre blocos; o ponto de luz corre quando o bloco seguinte está em foco
CONECTOR = ('<span class="dg-seta" aria-hidden="true"><svg viewBox="0 0 48 14"><line x1="2" y1="7" x2="40" y2="7"/>'
            '<path d="M36 2 L45 7 L36 12"/></svg><i class="pulso"></i></span>')


def sec_diagrama(s, ui):
    estilo = s.get("estilo", "fluxo")
    partes = []
    for i, n in enumerate(s["nos"]):
        if i:
            partes.append(CONECTOR)
        itens = ""
        if n.get("itens"):
            lis = []
            for it in n["itens"]:
                sub_it = f'<small>{it["sub"]}</small>' if it.get("sub") else ""
                lis.append(f'<li>{ic(it.get("icone", "alvo"))}<span>{it["t"]}{sub_it}</span></li>')
            itens = "<ul>" + "".join(lis) + "</ul>"
        sub = f'<span class="sub">{n["sub"]}</span>' if n.get("sub") else ""
        # v7.2: número da etapa (se o título já não começa com número) e foto no lugar do ícone de pessoa
        dn = "" if re.match(r"\d", n["titulo"]) else f'<b class="dn">{i + 1}</b>'
        foto = n.get("icone") == "usuario" and (RAIZ / FOTO_VOCE).exists()
        icone = (f'<span class="ic foto"><img src="{PREFIXO}{FOTO_VOCE}" alt="" width="160" height="160" loading="lazy"/></span>'
                 if foto else f'<span class="ic">{ic(n.get("icone", "alvo"))}</span>')
        partes.append(
            f'<button type="button" class="dg-no{" forte" if n.get("forte") else ""}{" com-foto" if foto else ""}" aria-pressed="false">'
            f'<span class="cab">{dn}{icone}<span class="nome">{n["titulo"]}</span></span>{sub}{itens}'
            f'<template><b>{n["titulo"]}.</b> {n["detalhe"]}</template></button>'
        )
    volta = f'<div class="dg-volta" aria-hidden="true"><span>{s["volta"]}</span></div>' if s.get("volta") else ""
    leg = f'<p class="dg-legenda">{s["legenda"]}</p>' if s.get("legenda") else ""
    if not s.get("rolagem"):
        return (f'<div class="painel dg-bloco"><div class="dg {estilo}">{"".join(partes)}</div>{volta}'
                f'<div class="dg-detalhe" aria-live="polite">{s.get("dica", ui["dg_dica"])}</div>{leg}</div>')
    passos = [{"foco": [i], "titulo": n["titulo"], "texto": n["detalhe"]} for i, n in enumerate(s["nos"])]
    if s.get("rolagem_fim"):
        passos.append({"foco": list(range(len(s["nos"]))), **s["rolagem_fim"]})
    return figura_rolagem(f'<div class="dg {estilo}">{"".join(partes)}</div>{volta}', passos, leg, ui)


def figura_rolagem(figura, passos, leg, ui, dica=True):
    """Infográfico fixo no alto; cada etapa da explicação acende os blocos correspondentes."""
    dica_html = f'<p class="sc-dica">{ic("seta")}{ui["role_dica"]}</p>' if dica else ""
    lis = "".join(f'<li class="sc-passo" data-foco="{",".join(map(str, p["foco"]))}"><span class="sc-n">{i + 1}/{len(passos)}</span>'
                  f'<h3>{p["titulo"]}</h3><p>{p["texto"]}</p></li>' for i, p in enumerate(passos))
    p0 = passos[0]
    nav = "".join(f'<button type="button" class="sc-ir" data-ir="{i}" title="{attr(re.sub("<[^>]+>", "", p["titulo"]))}">'
                  f'<b>{i + 1}</b><span>{re.sub(rf"^{i + 1}\s*·\s*", "", p.get("curto", p["titulo"]))}</span></button>' for i, p in enumerate(passos))
    cap = (f'<div class="sc-cap" aria-hidden="true"><span class="sc-n">1/{len(passos)}</span>'
           f'<h3>{p0["titulo"]}</h3><p>{p0["texto"]}</p></div>')
    return (f'<div class="scrolly dg-bloco"><div class="sc-fig"><div class="painel">{figura}'
            f'<nav class="sc-nav" aria-label="{attr(ui["etapas"])}">{nav}</nav>{cap}'
            f'{dica_html}</div></div>'
            f'<ol class="sc-passos">{lis}</ol>{leg}</div>')


def sec_mapa(s, ui, aulas):
    """Mapa da formação: degraus em colunas, exercícios de cada aula de prática, dependências e resultado."""
    cols = []
    for i, d in enumerate(s["degraus"]):
        aula = next(a for a in aulas if a["slug"] == d["aula"])
        prat = next(x for x in aula["secoes"] if x["tipo"] == "pratica")
        exs = "".join(f'<li><button type="button" class="mp-ex" data-ex="{d["aula"]}-{e["id"]}"><b>{e["titulo"].split(" · ")[0]}</b><span>{e["titulo"].split(" · ", 1)[-1]}</span>'
                      f'<template><b>{e["titulo"]}</b> · {e.get("min", "")}<br/>{e["texto"]}<br/><span class="pq">{ui["pronto_quando"]}</span> {e["pronto"]}</template></button></li>'
                      for e in prat["exercicios"])
        n_ex = len(prat["exercicios"])
        seta = f'<span class="mp-dep" aria-hidden="true">{ic("seta")}<small>{ui["pre_requisito"]}</small></span>' if i else ""
        cols.append(f'{seta}<div class="mp-col dg-no{" forte" if i == 0 else ""}" data-no="{i}"><div class="mp-cab"><span class="ic">{ic(d["icone"])}</span>'
                    f'<span><small>{d["quando"]}</small><b>{d["titulo"]}</b></span></div><p class="mp-sub">{d["sub"]}</p>'
                    f'<p class="mp-cont"><span>{n_ex} {ui["exercicios"]}</span><span class="mp-feitos" data-aula="{d["aula"]}" data-n="{n_ex}"></span></p>'
                    f'<ol class="mp-exs">{exs}</ol><p class="mp-saida">{ic("check")}{d["saida"]}</p>'
                    f'<a class="mp-aula" href="../{d["aula"]}/index.html">{ui["ver_aula"]} {ic("seta")}</a></div>')
    fim = (f'<div class="mp-fim">{ic("alvo")}<div><b>{s["resultado"]["titulo"]}</b>{s["resultado"]["texto"]}</div>'
           f'<span class="mp-total">{s["resultado"]["total"]}</span></div>')
    figura = (f'<div class="mapa-f">{"".join(cols)}</div>{fim}'
              f'<div class="mp-det dg-detalhe" aria-live="polite">{ui["mapa_dica"]}</div>')
    passos = [{"foco": [i], "titulo": d["titulo"], "texto": d["passo"]} for i, d in enumerate(s["degraus"])]
    if s.get("rolagem_fim"):
        passos.append({"foco": list(range(len(s["degraus"]))), **s["rolagem_fim"]})
    leg = f'<p class="dg-legenda">{s["legenda"]}</p>' if s.get("legenda") else ""
    return figura_rolagem(figura, passos, leg, ui, dica=False)


def sec_passos(s, ui):
    n = len(s["passos"])
    tabs, corpos = [], []
    for i, p in enumerate(s["passos"]):
        alvo = f"p{i}"
        tabs.append(f'<button type="button" class="ptab" role="tab" data-alvo="{alvo}" aria-selected="{"true" if i == 0 else "false"}">'
                    f'<span class="pn">{i + 1}</span><span><b>{p["titulo"]}</b><small>{p.get("sub", "")}</small></span></button>')
        texto = "".join(f"<p>{t}</p>" for t in p["texto"])
        ex = ""
        if p.get("exemplo"):
            ex = f'<div class="ex"><span class="rot">{p["exemplo"]["rot"]}</span><q>{p["exemplo"]["texto"]}</q></div>'
        corpos.append(f'<div class="pcorpo" data-painel="{alvo}"{"" if i == 0 else " hidden"}><div><h3>{i + 1}. {p["titulo"]}</h3>{texto}</div>{ex}</div>')
    return f'<div class="passos"><div class="passos-tabs" role="tablist" style="--n:{min(n, 4)}">{"".join(tabs)}</div>{"".join(corpos)}</div>'


def bloco_codigo(b, ui):
    return (f'<div class="cod"><div class="cod-cab">{ic(b.get("icone", "terminal"))}<b>{b["rot"]}</b>'
            f'<button type="button" class="copiar" data-rot="{attr(ui["copiar"])}" data-ok="{attr(ui["copiado"])}">{ic("copiar")}<span>{ui["copiar"]}</span></button></div>'
            f'<pre>{esc(b["conteudo"])}</pre></div>')


def sec_codigo(s, ui):
    cods = "".join(bloco_codigo(b, ui) for b in s["blocos"])
    if not s.get("saida"):
        return f'<div class="cods um"><div>{cods}</div></div>'
    sa = s["saida"]
    tabs = "".join(f'<button type="button" data-alvo="s{i}" aria-selected="{"true" if i == 0 else "false"}">{a["rot"]}</button>' for i, a in enumerate(sa["abas"]))
    selo = f'<span class="selo{" real" if sa.get("selo") == "real" else ""}">{ui["selo_" + sa.get("selo", "simulacao")]}</span>'
    corpo = "".join(f'<div class="saida-corpo" data-painel="s{i}"{"" if i == 0 else " hidden"}>{selo if i == 0 else ""}{a["html"]}</div>' for i, a in enumerate(sa["abas"]))
    return f'<div class="cods"><div>{cods}</div><div class="saida"><div class="saida-tabs" role="tablist">{tabs}</div>{corpo}</div></div>'


def sec_pratica(s, ui, slug):
    cards = []
    for e in s["exercicios"]:
        cards.append(f'<article class="exc"><div class="t"><h3>{e["titulo"]}</h3><span class="min">{e.get("min", "")}</span></div>'
                     f'<p>{e["texto"]}</p><p class="pronto"><b>{ui["pronto_quando"]}</b> {e["pronto"]}</p>'
                     f'<label><input type="checkbox" data-id="{slug}-{e["id"]}"/>{ui["fiz"]}</label></article>')
    fonte = ""
    if s.get("fonte"):
        fonte = f'<p class="dg-legenda">{s["fonte"]}</p>'
    return f'<div class="exs">{"".join(cards)}</div>{fonte}'


def sec_video(s, ui, curso, prefixo):
    v = curso["videos"][s["chave"]]
    # 7.6.7: versão do vídeo por idioma — videos.<chave>.idiomas.<lang>.{mp4, vtt}; sem ela, o vídeo PT com legenda PT
    loc = v.get("idiomas", {}).get(LANG, {})
    lg = LANG if loc.get("vtt") else "pt"
    rot_leg = {"pt": "Português", "en": "English", "es": "Español"}.get(lg, lg)
    # 7.10.12: vídeo vertical (short/reel) com "formato": "9:16" — player estreito e centrado, não pillarbox 16:9
    vert = " vertical" if v.get("formato") == "9:16" else ""
    return (f'<div class="video{vert}"><video controls preload="metadata" playsinline poster="{ativo(prefixo)}{img_idioma(v["poster"])}">'
            f'<source src="{loc.get("mp4", v["mp4"])}" type="video/mp4"/>'
            f'<track kind="subtitles" srclang="{lg}" label="{rot_leg}" src="{ativo(prefixo)}{loc.get("vtt", v["vtt"])}" default/></video>'
            f'<div class="video-leg"><span><b>{v["titulo"]}</b> · {loc.get("duracao", v["duracao"])}</span><a href="{loc.get("pagina", v["pagina"])}" target="_blank" rel="noopener">{ui["video_pagina"]} →</a></div></div>')


def sec_simfila(s, ui):
    r = s["rot"]
    cols = "".join(f'<div class="col" data-col="{c}"><h3>{ic(i)}{r[c]}</h3><div class="itens"></div></div>'
                   for c, i in (("entrada", "fila"), ("rodando", "relogio"), ("feito", "check"), ("falhou", "x")))
    acoes = (f'<button type="button" class="btn cheio" data-acao="rodar">{ic("play")}{r["rodar"]}</button>'
             f'<button type="button" class="btn neutro" data-acao="parar">{r["parar"]}</button>'
             f'<button type="button" class="btn neutro" data-acao="zerar">{r["zerar"]}</button>')
    return (f'<div class="painel simfila" data-tarefas="{attr(json.dumps(s["tarefas"], ensure_ascii=False))}" data-falha="{s["falha"]}" '
            f'data-msg="{attr(json.dumps(s["msg"], ensure_ascii=False))}"><div class="sim-cols">{cols}</div>'
            f'<div class="sim-acoes">{acoes}</div><div class="sim-log" aria-live="polite"></div>'
            f'<p class="dg-legenda">{s["legenda"]}</p></div>')


ST_UI = {  # 7.14.19: textos do simterm; ficam em curso.json → ui e podem ser trocados/traduzidos lá
    "st_missoes": "Missões", "st_digite": "Digite o comando e tecle Enter", "st_dica": "Mostrar o comando",
    "st_zerar": "Recomeçar", "st_missao": "Missão {n} de {t}:", "st_cumpridas": "Missões cumpridas.", "st_pronto": "Pronto.",
    "st_onde": "Isso mostrou onde você está. Agora faça o que a missão {n} pede.",
    "st_errado": "Esse não é o comando da missão {n}. Releia o pedido ou toque em <b>{dica}</b>."}
PT_AULAS = {}  # slug → aula PT: no simterm, comandos e saídas vêm SEMPRE do PT (o aluno digita o mesmo comando em qualquer idioma)


def sec_simterm(s, ui, pt):
    """7.14.19 (vindo do curso do-chat-ao-agente-terminal-v72): terminal simulado. O aluno digita o comando de cada
    missão e vê a resposta, sem risco. Comportamento em assets/v72-simterm.js. Texto visível vem do JSON/ui (traduzível);
    `pt` é a mesma seção no PT: dela saem inicio, sufixo, sistema e, por missão, aceita, vai e mostra."""
    u = {k: ui.get(k, v) for k, v in ST_UI.items()}
    dados = {k: s.get(k) for k in ("erro", "fim")}
    dados.update({k: pt.get(k) for k in ("inicio", "sistema")})
    dados["sufixo"] = pt.get("sufixo", ">")
    missoes = []
    for m, mp in zip(s["missoes"], pt["missoes"]):
        m = dict(m)
        for k in ("aceita", "vai", "mostra"):
            if k in mp: m[k] = mp[k]
            else: m.pop(k, None)
        missoes.append(m)
    dados["missoes"] = missoes
    dados["txt"] = {k: u[k] for k in ("st_missao", "st_cumpridas", "st_pronto", "st_onde", "st_errado", "st_dica")}
    lis = "".join(f'<li data-i="{i}"><span class="st-n">{i + 1}</span><span>{m["pede"]}</span></li>' for i, m in enumerate(missoes))
    return (f'<div class="painel simterm" data-term="{attr(json.dumps(dados, ensure_ascii=False))}">'
            f'<div class="st-grade"><div class="st-missoes"><p class="st-tit">{ic("alvo")}{u["st_missoes"]}</p><ol>{lis}</ol>'
            f'</div>'
            f'<div class="st-janela"><div class="st-barra"><i></i><i></i><i></i><span>{s.get("janela", "Terminal")}</span></div>'
            f'<pre class="st-tela" aria-live="polite"></pre><p class="st-agora"></p>'
            f'<form class="st-linha"><label class="st-prompt"></label><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" '
            f'aria-label="{attr(u["st_digite"])}" placeholder="{attr(u["st_digite"])}"/></form></div></div>'
            f'<div class="st-fb" aria-live="polite"></div>'
            f'<div class="sim-acoes"><button type="button" class="btn neutro st-dica">{ic("lupa")}{u["st_dica"]}</button>'
            f'<button type="button" class="btn neutro st-zerar">{u["st_zerar"]}</button></div>'
            f'<p class="dg-legenda">{s["legenda"]}</p></div>')


def sec_simportao(s, ui):
    """7.14.19 (vindo do curso do-chat-ao-agente-filas-v72): fluxo de várias fases que para no portão humano
    (aprovar, reprovar com correção ou rodar sem portão). Comportamento em assets/v72-simportao.js. O portão é a fase 2
    (índice 1). Texto visível vem do JSON: fases, rot, rascunho, corrigido, msg; `arquivo` = rótulo do texto gerado."""
    r = s["rot"]
    fases = "".join(f'<li class="sp-fase" data-i="{i}">{ic("portao" if i == 1 else "alvo")}<span>{f}</span></li>'
                    for i, f in enumerate(s["fases"]))
    acoes = (f'<button type="button" class="btn cheio" data-acao="rodar">{ic("play")}{r["rodar"]}</button>'
             f'<button type="button" class="btn neutro" data-acao="aprovar" disabled>{ic("check")}{r["aprovar"]}</button>'
             f'<button type="button" class="btn neutro" data-acao="reprovar" disabled>{ic("caneta")}{r["reprovar"]}</button>'
             f'<button type="button" class="btn neutro" data-acao="sempor">{r["sempor"]}</button>'
             f'<button type="button" class="btn neutro" data-acao="zerar">{r["zerar"]}</button>')
    dados = attr(json.dumps({"rascunho": s["rascunho"], "corrigido": s["corrigido"], "msg": s["msg"]}, ensure_ascii=False))
    return (f'<div class="painel simportao" data-sim="{dados}"><ol class="sp-fases">{fases}</ol>'
            f'<div class="sp-texto" hidden><span class="sp-rot">{ic("arquivo")}{s.get("arquivo", "rascunho.md")}</span><p class="sp-corpo"></p></div>'
            f'<div class="sim-acoes">{acoes}</div><div class="sim-log" aria-live="polite"></div>'
            f'<p class="dg-legenda">{s["legenda"]}</p></div>')


CONV_UI = {  # 7.5.1: textos da simconversa; ficam em curso.json → ui e podem ser trocados/traduzidos lá
    "conv_dica": "Escolha a sua resposta. O comentário aparece logo depois e a conversa segue conforme a escolha.",
    "conv_voce": "Você", "conv_escolha": "Sua resposta", "conv_boa": "Boa escolha", "conv_meio": "Dá para melhorar",
    "conv_ruim": "Escolha fraca", "conv_fim": "Fim da conversa", "conv_placar": "Você fez {p} de {m} pontos possíveis.",
    "conv_licao": "Lição:", "conv_recomecar": "Recomeçar a conversa", "conv_feita": "Seu melhor placar: {p} de {m} pontos.",
}


def sec_simconversa(s, ui, conv_id):
    """7.5.1: conversa com cliente simulado. O cliente fala, o aluno escolhe 1 de 2–4 respostas, vê o comentário,
    o caminho segue conforme a escolha e termina com placar e lição. Comportamento em assets/v72-conversa.js."""
    txt = {k: ui.get(k, v) for k, v in CONV_UI.items()}
    p = s["personagem"]
    dados = json.dumps({"inicio": s["inicio"], "falas": s["falas"], "licao": s.get("licao", ""), "nome": p["nome"], "txt": txt},
                       ensure_ascii=False).replace("</", "<\\/")
    papel = f'<small>{p["papel"]}</small>' if p.get("papel") else ""
    return (f'<div class="conv" data-conv="{attr(conv_id)}"><div class="conv-cab"><span class="conv-av">{ic("usuario")}</span>'
            f'<span class="conv-quem"><b>{p["nome"]}</b>{papel}</span><span class="conv-pts" aria-hidden="true"></span></div>'
            f'<p class="conv-dica">{txt["conv_dica"]}</p><ol class="conv-log" aria-live="polite"></ol>'
            f'<div class="conv-ops" role="group" aria-label="{attr(txt["conv_escolha"])}"></div><div class="conv-fim" hidden></div>'
            f'<script type="application/json" class="conv-dados">{dados}</script></div>')


CONF_UI = {  # 7.9.12: textos do conferidor; ficam em curso.json → ui (mesmos padrões de UI em conferir.py)
    "conf_vazio": "Cole o texto ou carregue o arquivo antes de conferir.",
    "conf_falta": "Ainda não. O que falta:",
    "conf_campo": "Falta a linha {c}: com a descrição (pelo menos {x} letras).",
    "conf_planos": "Achei {n} planos numerados; o pedido é de {x} a {y}. Comece cada plano pelo número (1 | ...).",
    "conf_no_plano": "Plano {i}: falta {g}.",
    "conf_um_so": "Plano {i}: {n} escolhas de {g}; fique com uma só.",
    "conf_variedade": "Só {n} tipo(s) diferente(s) de {g} nos planos; varie para pelo menos {x}.",
    "conf_sem_duracao": "Plano {i}: falta a duração em segundos (ex.: 4 s).",
    "conf_duracao": "Os planos somam {s} s; o pedido é de {x} a {y} s.",
    "conf_termo": "Falta citar {g}.",
    "conf_mais": "… e mais {n}.",
    "conf_rot": "Cole aqui o seu arquivo (ou carregue o .txt):",
    "conf_conferir": "Conferir", "conf_exemplo": "Exemplo que passa", "conf_errado": "Exemplo com erro",
    "conf_carregar": "Carregar .txt", "conf_baixar": "Baixar o arquivo", "conf_limpar": "Limpar",
    # 7.12.15: modo vídeo (regra "video"): o navegador lê duração e tamanho do arquivo, sem enviar nada
    "conf_video_dur": "O vídeo tem {s} s; o pedido é de {x} a {y} s.",
    "conf_video_prop": "O vídeo é {w}×{h} ({p}); o pedido é {q}.",
    "conf_video_larg": "O vídeo tem {w} px de largura; o mínimo é {x} px.",
    "conf_video_ler": "Não consegui ler este vídeo. Exporte em MP4 (H.264) ou WebM e tente de novo.",
    "conf_video_rot": "Escolha o seu vídeo. Ele é lido aqui no navegador: nada é enviado.",
    "conf_video_escolher": "Escolher o vídeo", "conf_video_lendo": "Lendo o vídeo…",
}


def sec_conferidor_video(s, ui, conf_id, prefixo, txt):
    """7.12.15: modo vídeo — o aluno escolhe o arquivo (input file) e a página lê duração, largura e altura
    (loadedmetadata), sem enviar nada. Os exemplos são clipes do repo (video_ok, video_erro), em WebM para
    tocar também no Chromium sem codecs proprietários. "pronto quando" cita a resposta (ex.: "OK: 8,0 s · 1920×1080 · 16:9")."""
    dados = json.dumps({"regras": s["regras"], "ok": s["ok"], "video": True,
                        "video_ok": ativo(prefixo) + s["video_ok"], "video_erro": ativo(prefixo) + s["video_erro"],
                        "txt": txt}, ensure_ascii=False).replace("</", "<\\/")
    tid = f"cf-{conf_id}"
    return (f'<div class="confer cf-video" data-conf="{attr(conf_id)}" data-ok-prefixo="{attr(re.split(r"[{:]", s["ok"])[0])}">'
            f'<div class="cf-cab"><span class="cf-arquivo">{ic("video")}{esc(s.get("arquivo", "video.mp4"))}</span>'
            f'<span class="cf-exs"><button type="button" class="btn neutro" data-cf-ex="ok">{ic("check")}{txt["conf_exemplo"]}</button>'
            f'<button type="button" class="btn neutro" data-cf-ex="errado">{ic("x")}{txt["conf_errado"]}</button></span></div>'
            f'<p class="cf-rot">{s.get("rot", txt["conf_video_rot"])}</p>'
            f'<div class="cf-acoes"><label class="btn cheio cf-arq-rot" for="{tid}">{ic("carregar")}{txt["conf_video_escolher"]}</label>'
            f'<input type="file" id="{tid}" class="sr cf-arq" accept="video/*,.mp4,.webm,.mov,.mkv"/></div>'
            f'<div class="cf-res" aria-live="polite" hidden></div>'
            f'<script type="application/json" class="cf-dados">{dados}</script></div>')


def sec_conferidor(s, ui, conf_id, prefixo=""):
    """7.9.12: o aluno cola (ou carrega) o arquivo que escreveu e a página confere pelas regras da seção
    (campos, planos, cada_plano, duracao, termos). "pronto quando" cita a resposta literal ("OK: ...").
    Comportamento em assets/v72-conferidor.js; o mesmo motor em Python no conferir.py (opção de terminal)."""
    txt = {k: ui.get(k, v) for k, v in CONF_UI.items()}
    if any(r.get("tipo") == "video" for r in s["regras"]):
        return sec_conferidor_video(s, ui, conf_id, prefixo, txt)
    dados = json.dumps({"regras": s["regras"], "ok": s["ok"], "exemplo": s["exemplo"], "exemplo_errado": s["exemplo_errado"],
                        "arquivo": s.get("arquivo", "arquivo.txt"), "txt": txt}, ensure_ascii=False).replace("</", "<\\/")
    tid = f"cf-{conf_id}"
    return (f'<div class="confer" data-conf="{attr(conf_id)}" data-ok-prefixo="{attr(re.split(r"[{:]", s["ok"])[0])}">'
            f'<div class="cf-cab"><span class="cf-arquivo">{ic("arquivo")}{esc(s.get("arquivo", "arquivo.txt"))}</span>'
            f'<span class="cf-exs"><button type="button" class="btn neutro" data-cf-ex="ok">{ic("check")}{txt["conf_exemplo"]}</button>'
            f'<button type="button" class="btn neutro" data-cf-ex="errado">{ic("x")}{txt["conf_errado"]}</button></span></div>'
            f'<label class="cf-rot" for="{tid}">{s.get("rot", txt["conf_rot"])}</label>'
            f'<textarea id="{tid}" spellcheck="false" autocomplete="off" rows="10" placeholder="{attr(s.get("modelo", ""))}"></textarea>'
            f'<div class="cf-acoes"><button type="button" class="btn cheio cf-ir">{ic("check")}{txt["conf_conferir"]}</button>'
            f'<label class="btn neutro cf-arq-rot">{ic("carregar")}{txt["conf_carregar"]}<input type="file" class="sr cf-arq" accept=".txt,.md,text/plain"/></label>'
            f'<button type="button" class="btn neutro cf-baixar">{ic("baixar")}{txt["conf_baixar"]}</button>'
            f'<button type="button" class="btn neutro cf-limpar">{txt["conf_limpar"]}</button></div>'
            f'<div class="cf-res" aria-live="polite" hidden></div>'
            f'<script type="application/json" class="cf-dados">{dados}</script></div>')


def sec_quiz(s, ui, refs):
    """refs: tipo de seção → (id, título), para o link "rever o conceito" de cada pergunta."""
    itens = []
    letras = "ABCDE"
    n = len(s["perguntas"])
    for k, q in enumerate(s["perguntas"]):
        ops = "".join(f'<button type="button" class="q-op" data-certa="{1 if j == q["certa"] else 0}"><span class="l">{letras[j]}</span>{o}</button>'
                      for j, o in enumerate(q["opcoes"]))
        cert = f'<span class="cert-tag">{ic("escudo", "ico")}{ui["cert_tag"]}</span>' if q.get("cert") else ""
        ref = refs.get(q.get("ref", "diagrama")) or refs.get("diagrama") or refs.get("mapa")
        rever = f'<a class="q-ref" href="#{ref[0]}">{ic("seta")}{ui["rever"]} {ref[1]}</a>' if ref else ""
        itens.append(f'<div class="q-item"{"" if k == 0 else " hidden"}><p class="q-cont">{ui["pergunta"]} {k + 1} {ui["de"]} {n}</p>'
                     f'<p class="q-p">{q["p"]}{cert}</p><div class="q-ops">{ops}</div>'
                     f'<template class="ok"><div class="r ok">{ic("check")}{ui["correto"]}</div>{q["explica"]}</template>'
                     f'<template class="no"><div class="r no">{ic("x")}{ui["errado"]}</div>{q["explica"]}{rever}</template></div>')
    total = f'<template class="total"><div class="r ok">{ic("check")}{ui["quiz_fim"]}</div>{ui["quiz_total"]}</template>'
    aguarda = f'<template class="q-aguarda"><p class="aguarda">{ui["quiz_aguarda"]}</p></template>'
    return (f'<div class="quiz"><div>{"".join(itens)}<div class="q-nav">'
            f'<button type="button" class="btn neutro q-revisar" hidden>{ui["revisar_erradas"]}</button>'
            f'<button type="button" class="btn neutro q-refazer" hidden>{ui["refazer"]}</button>'
            f'<button type="button" class="btn cheio q-prox" hidden data-fim="{attr(ui["quiz_ver"])}">{ui["proxima_pergunta"]} {ic("seta")}</button></div></div>'
            f'<div class="q-fb" aria-live="polite"></div>{total}{aguarda}</div>')


def minutos(txt):
    """'10 min' → 10; '1 h' → 60; dias/noite/semana contam 30 min de trabalho (o resto é tempo de calendário)."""
    m = re.match(r"(\d+)\s*(min|h)", txt or "")
    if m:
        return int(m.group(1)) * (60 if m.group(2) == "h" else 1)
    return 30


def sec_gerador(s, ui, aulas):
    """Gera o plano com datas a partir da data de início e das horas por semana (plano.md + .ics)."""
    degraus = []
    for d in s["degraus"]:
        aula = next(a for a in aulas if a["slug"] == d["aula"])
        prat = next(x for x in aula["secoes"] if x["tipo"] == "pratica")
        degraus.append({"t": d["titulo"], "aula": d["aula"], "ex": [
            {"id": e["id"], "t": e["titulo"], "min": minutos(e.get("min")), "dias": e.get("dias", 1), "rot": e.get("min", ""), "pronto": re.sub("<[^>]+>", "", e["pronto"])}
            for e in prat["exercicios"]]})
    horas = "".join(f'<option value="{h}"{" selected" if h == s.get("horas_padrao", 5) else ""}>{h} {ui["h_semana"]}</option>' for h in (2, 3, 5, 8, 12))
    dados = attr(json.dumps({"degraus": degraus, "curso": s["curso"], "txt": s["txt"]}, ensure_ascii=False))
    return (f'<div class="gerador" data-plano="{dados}"><div class="ger-form painel">'
            f'<label>{ui["data_inicio"]}<input type="date" class="ger-ini"/></label>'
            f'<label>{ui["ritmo"]}<select class="ger-h">{horas}</select></label>'
            f'<button type="button" class="btn cheio ger-ir">{ic("calendario")}{ui["gerar_plano"]}</button></div>'
            f'<div class="ger-res" hidden><div class="ger-resumo"></div><ol class="ger-semanas"></ol>'
            f'<div class="cod"><div class="cod-cab">{ic("arquivo")}<b>plano.md</b>'
            f'<button type="button" class="copiar" data-rot="{attr(ui["copiar"])}" data-ok="{attr(ui["copiado"])}">{ic("copiar")}<span>{ui["copiar"]}</span></button></div><pre class="ger-md"></pre></div>'
            f'<div class="ger-acoes"><button type="button" class="btn neutro ger-baixa-md">{ic("arquivo")}{ui["baixar_md"]}</button>'
            f'<button type="button" class="btn neutro ger-baixa-ics">{ic("calendario")}{ui["baixar_ics"]}</button></div></div></div>')


def sec_texto(s, ui):
    return '<div class="painel texto">' + "".join(f"<p>{p}</p>" for p in s["paragrafos"]) + "</div>"


def sec_resumo(s, ui):
    return '<div class="resumo">' + "".join(f'<div><b>{i["t"]}</b>{i["texto"]}</div>' for i in s["itens"]) + "</div>"


def sec_links(s, ui):
    return '<div class="links">' + "".join(f'<a href="{l["href"]}" target="_blank" rel="noopener">{ic(l.get("icone", "seta"))}{l["t"]}</a>' for l in s["links"]) + "</div>"


# ---------- página ----------
def cabeca(titulo, desc, prefixo, lang, canon, curso_id, pag="", extra_css=()):
    at = ativo(prefixo)
    extra = "".join(f'\n<link rel="stylesheet" href="{at}assets/{c}"/>' for c in extra_css)
    alternos = "".join(f'<link rel="alternate" hreflang="{HREFLANG[l]}" href="{url_idioma(l, pag)}"/>' for l in IDIOMAS) if len(IDIOMAS) > 1 else ""
    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>{esc(titulo)}</title>
<meta name="description" content="{attr(desc)}"/>
<meta property="og:title" content="{attr(titulo)}"/>
<meta property="og:description" content="{attr(desc)}"/>
<meta property="og:image" content="{URL_RAIZ}{img_idioma("assets/img/capa.jpg")}"/>
<meta name="theme-color" content="#0c0c10"/>
<link rel="icon" href="{at}assets/img/favicon.svg" type="image/svg+xml"/>
<link rel="canonical" href="{canon}"/>{alternos}
<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Sora:wght@600;700;800&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="{at}assets/v71.css"/>
<link rel="stylesheet" href="{at}assets/v72.css"/>{extra}
<meta name="generator" content="INEMA Learning {VERSAO}"/>
<script>try{{if(JSON.parse(localStorage.getItem("{curso_id}:tema"))==="papel")document.documentElement.setAttribute("data-tema","papel")}}catch(e){{}}</script>
</head>"""


def topo(curso, aulas, ui, prefixo, atual=""):
    """Menu do topo no padrão dos cursos INEMA (v2): curso | INEMA.CLUB - PRO à esquerda; uma entrada por aula e Aa à direita."""
    links = "".join(
        f'<a href="{prefixo}aulas/{a["slug"]}/index.html" class="tlink{" on" if a["slug"] == atual else ""}"'
        f'{" aria-current=\"page\"" if a["slug"] == atual else ""} title="{attr(a["titulo"])}">'
        f'<span class="curto">A{a["num"]}</span><span class="longo">{a["menu"]}</span></a>' for a in aulas)
    aa = (f'<div class="aa"><button type="button" class="aa-btn" aria-expanded="false" aria-controls="aparencia" title="{attr(ui["aparencia"])}">Aa</button>'
          f'<div class="aa-pop" id="aparencia" hidden><p>{ui["tema"]}</p><div class="aa-seg">'
          f'<button type="button" data-tema="escuro">{ui["tema_escuro"]}</button><button type="button" data-tema="papel">{ui["tema_papel"]}</button></div>'
          f'<p style="margin-top:12px">{ui["tamanho_texto"]}</p><div class="aa-seg">'
          f'<button type="button" data-escala="0.9">A−</button><button type="button" data-escala="1">A</button><button type="button" data-escala="1.12">A+</button>'
          f'</div></div></div>')
    sol_lua = (f'<button type="button" class="tema-btn" title="{attr(ui.get("trocar_tema", "Trocar tema claro/escuro"))}">'
               f'{ic("sol", "ico sol")}{ic("lua", "ico lua")}<span class="sr">{ui.get("trocar_tema", "Trocar tema claro/escuro")}</span></button>')
    pag = f"aulas/{atual}/" if atual else ""
    idiomas = ""
    if len(IDIOMAS) > 1:
        idiomas = '<span class="idiomas" aria-label="Idioma / Language">' + "".join(
            f'<a href="{url_idioma(l, pag)}" hreflang="{HREFLANG[l]}" lang="{HREFLANG[l]}"' + (' class="on" aria-current="true"' if l == LANG else "") + f'>{ROT_IDIOMA[l]}</a>'
            for l in IDIOMAS) + "</span>"
    return (f'<a class="skip" href="#conteudo">{ui["pular"]}</a><header class="topo"><div class="esq">'
            f'<button type="button" class="menu-btn" aria-expanded="false" aria-controls="lado">{ic("menu")}<span class="sr">{ui["aulas"]}</span></button>'
            f'<a class="marca" href="{prefixo}index.html">{ic(curso["icone"])}<span>{curso["nome"]}</span></a>'
            f'<span class="sep">|</span><a class="club" href="https://inema.club" target="_blank" rel="noopener">INEMA.CLUB</a>'
            f'<span class="tr">-</span><a class="pro" href="https://inema.pro" target="_blank" rel="noopener">PRO</a></div>'
            f'<nav class="dir" aria-label="{attr(ui["aulas"])}">{links}{idiomas}{sol_lua}{aa}</nav></header>')


def total_ex(aulas):
    return sum(len(x["exercicios"]) for a in aulas for x in a["secoes"] if x["tipo"] == "pratica")


def sem_tags(t):
    return html.unescape(re.sub("<[^>]+>", "", t or "")).strip()


def estudo(aulas, ui):
    """v7.2: gaveta com desempenho nos testes, anotações e cópia dos dados (tudo no navegador).
    Embute os testes de todas as aulas para a gaveta mostrar o que errou em qualquer página."""
    T = ui["estudo"]
    dados = []
    for a in aulas:
        num, quiz = 0, None
        for s in a["secoes"]:
            if s["tipo"] == "links": continue
            num += 1
            if s["tipo"] == "quiz" and not quiz:
                quiz = {"sec": f"s{num}", "perguntas": [{"p": sem_tags(q["p"]), "certa": sem_tags(q["opcoes"][q["certa"]])} for q in s["perguntas"]]}
        dados.append({"slug": a["slug"], "num": a["num"], "t": sem_tags(a["titulo_curto"]), "quiz": quiz})
    js = json.dumps({"txt": T, "aulas": dados}, ensure_ascii=False).replace("</", "<\\/")
    def bloco(chave, icone, corpo=""):
        return (f'<details class="es-bloco" data-es="{chave}"><summary>{ic(icone)}<span>{T[chave]}</span><span class="es-cont" data-es-cont="{chave}"></span></summary>'
                f'<div class="es-corpo" data-es-corpo="{chave}">{corpo}</div></details>')
    dados_html = (f'<p class="es-exp">{T["dados_exp"]}</p><div class="es-acoes">'
                  f'<button type="button" class="es-btn es-exportar">{ic("baixar")}{T["exportar"]}</button>'
                  f'<label class="es-btn es-importar">{ic("carregar")}{T["importar"]}<input type="file" class="sr" accept=".json,application/json"/></label></div>'
                  f'<p class="es-msg" aria-live="polite"></p>')
    return (f'<div class="estudo"><p class="es-tit">{T["titulo"]}</p>{bloco("desempenho", "grafico")}{bloco("notas", "caneta")}{bloco("dados", "memoria", dados_html)}</div>'
            f'<script type="application/json" id="estudo-dados">{js}</script>')


def lado(curso, aulas, ui, prefixo, atual):
    itens = []
    for a in aulas:
        cls = " atual" if a["slug"] == atual else ""
        cur = ' aria-current="page"' if a["slug"] == atual else ""
        itens.append(f'<li><a href="{prefixo}aulas/{a["slug"]}/index.html" data-slug="{a["slug"]}" class="{cls.strip()}"{cur}><span class="st" aria-hidden="true"></span>'
                     f'<span>{a["num"]}. {a["titulo_curto"]}<small>{a["minutos"]} min</small></span></a></li>')
    card = curso["lado_card"]
    return (f'<aside class="lado" id="lado" aria-label="{attr(ui["aulas"])}"><a class="voltar" href="{href_lang(curso["volta"])}">{ic("voltar")}{curso["volta"]["t"]}</a>'
            f'<p class="curso-nome">{curso["nome"]}</p><p class="curso-sub">{curso["sub"]}</p>'
            f'<div class="ind"><span class="ind-rot">{ui["ind_estudo"]}</span><span class="prog-txt"><span data-pct>0</span>%</span></div>'
            f'<div class="prog" aria-hidden="true"><i></i></div>'
            f'<div class="ind"><span class="ind-rot">{ui["ind_pratica"]}</span><span class="prog-txt"><span data-prat>0</span>/{total_ex(aulas)}</span></div>'
            f'<div class="prog pratica" aria-hidden="true"><i></i></div><p class="ind-nota">{ui["ind_nota"]}</p>'
            f'<ol class="lista-aulas">{"".join(itens)}</ol>{estudo(aulas, ui)}'
            f'<div class="lado-card">{card["rot"]}<b>{card["t"]}</b>{card["texto"]}<br/><a href="{href_lang(card)}" target="_blank" rel="noopener">{card["link"]} →</a></div></aside>')


def rodape(curso):
    return f'<footer class="rodape">{curso["rodape"]}</footer>'


def pagina_aula(curso, aulas, a, idx, ui, lang):
    global PREFIXO
    prefixo = "../../"
    PREFIXO = ativo(prefixo)
    secs = []
    refs, k = {}, 0
    for x in a["secoes"]:
        if x["tipo"] == "links": continue
        k += 1
        refs.setdefault(x["tipo"], (f"s{k}", re.sub("<[^>]+>", "", x["titulo"])))
    num = 0
    pt_terms = [x for x in PT_AULAS.get(a["slug"], a)["secoes"] if x["tipo"] == "simterm"]  # 7.14.19
    n_term = 0
    for s in a["secoes"]:
        t = s["tipo"]
        if t == "links":
            secs.append(f'<section class="secao extra"><h2 class="extra-t">{s["titulo"]}</h2>{sec_links(s, ui)}</section>')
            continue
        num += 1
        if t == "diagrama": corpo = sec_diagrama(s, ui)
        elif t == "mapa": corpo = sec_mapa(s, ui, aulas)
        elif t == "passos": corpo = sec_passos(s, ui)
        elif t == "codigo": corpo = sec_codigo(s, ui)
        elif t == "pratica": corpo = sec_pratica(s, ui, a["slug"])
        elif t == "video": corpo = sec_video(s, ui, curso, prefixo)
        elif t == "simfila": corpo = sec_simfila(s, ui)
        elif t == "simconversa": corpo = sec_simconversa(s, ui, f'{a["slug"]}-s{num}')
        elif t == "simterm": corpo = sec_simterm(s, ui, pt_terms[n_term]); n_term += 1
        elif t == "simportao": corpo = sec_simportao(s, ui)
        elif t == "conferidor": corpo = sec_conferidor(s, ui, f'{a["slug"]}-s{num}', prefixo)
        elif t == "quiz": corpo = sec_quiz(s, ui, refs)
        elif t == "gerador": corpo = sec_gerador(s, ui, aulas)
        elif t == "texto": corpo = sec_texto(s, ui)
        elif t == "resumo": corpo = sec_resumo(s, ui)
        elif t == "links": corpo = sec_links(s, ui)
        else: raise SystemExit(f"tipo de seção desconhecido: {t} ({a['slug']})")
        sub = f'<p>{s["sub"]}</p>' if s.get("sub") else ""
        # diagrama preso no topo leva o título da seção junto (aparece quando o título original sobe)
        corpo = corpo.replace('<div class="sc-fig">', f'<div class="sc-fig"><p class="sc-tit" aria-hidden="true"><span class="sc-aula">{ui.get("aula", "Aula")} {idx + 1}</span><span class="sn">{num:02d}</span><span class="sp"> · </span><span class="sc-t">{s["titulo"]}</span>' + (f'<span class="sc-sub">{s["sub"]}</span>' if s.get("sub") else '') + '</p>', 1)
        secs.append(f'<section class="secao" id="s{num}"><div class="sec-cab"><div><h2><span class="sn">{num:02d}</span><span class="sp" aria-hidden="true"> · </span>{s["titulo"]}</h2>{sub}</div></div>{corpo}</section>')
    prox = aulas[idx + 1] if idx + 1 < len(aulas) else None
    ant = aulas[idx - 1] if idx > 0 else None
    btn_prox = (f'<a class="btn" href="{prefixo}aulas/{prox["slug"]}/index.html">{ui["proxima_aula"]} {ic("seta")}</a>' if prox
                else f'<a class="btn" href="{prefixo}index.html">{ui["voltar_inicio"]} {ic("seta")}</a>')
    aprende = "".join(f'<li><b class="dn">{i + 1}</b><span>{x["t"]}</span></li>' for i, x in enumerate(a["aprende"]))
    pontos = "".join(f'<a href="{prefixo}aulas/{x["slug"]}/index.html" class="pt{" on" if x["slug"] == a["slug"] else ""}" data-slug="{x["slug"]}" title="{attr(x["titulo"])}"><span class="sr">{x["titulo"]}</span></a>' for x in aulas)
    hero_img = img_idioma(f'assets/img/hero/{a["slug"]}.jpg')
    fig = (f'<figure class="ah-img"><img src="{ativo(prefixo)}{hero_img}" alt="{attr(a.get("hero_alt", ""))}" width="1536" height="1024"/></figure>'
           if (RAIZ / hero_img).exists() else "")
    btn_prox_cheio = btn_prox.replace('class="btn"', 'class="btn cheio"')
    btn_ant = (f'<a class="btn neutro" href="{prefixo}aulas/{ant["slug"]}/index.html">{ic("voltar")}{ui["aula_anterior"]}</a>' if ant else "<span></span>")
    nav_fim = (f'<div class="fim-aula">{btn_ant}'
               f'<button type="button" class="btn neutro concluir" aria-pressed="false">{ic("check")}{ui["marcar_concluida"]}</button>{btn_prox_cheio}</div>')
    canon = f'{curso["url"]}aulas/{a["slug"]}/'
    titulo = f'{a["titulo"]} · {curso["nome"]} · INEMA'
    # 7.5.1: arquivos de tipos opcionais entram só na aula que usa o tipo (curso antigo não precisa deles)
    tipos = {x["tipo"] for x in a["secoes"]}
    extra = [n for t, n in (("simconversa", "v72-conversa"), ("conferidor", "v72-conferidor"),
                            ("simterm", "v72-simterm"), ("simportao", "v72-simportao")) if t in tipos]
    css_extra = [f"{n}.css" for n in extra]
    js_extra = "".join(f'<script src="{ativo(prefixo)}assets/{n}.js"></script>' for n in extra)
    return (cabeca(titulo, a["lead"], prefixo, lang, canon, id_curso(curso), f'aulas/{a["slug"]}/', css_extra)
            + f'<body data-curso="{id_curso(curso)}" data-aula="{a["slug"]}" data-total="{len(aulas)}" data-total-ex="{total_ex(aulas)}">'
            + topo(curso, aulas, ui, prefixo, a["slug"])
            + '<div class="casca">' + lado(curso, aulas, ui, prefixo, a["slug"])
            + f'<main class="principal" id="conteudo"><div class="miolo" data-competencias="{attr(";".join(a["competencias"]))}">'
            + f'<div class="aula-hero{" com-img" if fig else ""}"><div class="ah-txt"><nav class="pontos" aria-label="{attr(ui["aulas"])}">{pontos}</nav>'
            + f'<p class="kicker">{ui["aula"]} {a["num"]} · {a["minutos"]} min</p><h1>{a["titulo"]}</h1><p class="lead">{a["lead"]}</p>'
            + f'<a class="comecar" href="#s1">{ui.get("comecar", "Começar a aula")} {ic("seta")}</a></div>{fig}</div>'
            + f'<div class="nesta2"><h2>{ui.get("nesta_vai", "Nesta aula você vai")}</h2><ol>{aprende}</ol><p class="objetivo"><b>{ui["objetivo"]}</b> {a["objetivo"]}</p></div>'
            + "".join(secs) + nav_fim + rodape(curso)
            + f'</div></main></div><script src="{ativo(prefixo)}assets/v71.js"></script><script src="{ativo(prefixo)}assets/v72.js"></script>{js_extra}</body></html>\n')


def pagina_inicio(curso, aulas, ui, lang):
    p = curso["inicio"]
    prefixo = ""
    # v7.2: mesma direção das aulas — abertura com foto que funde no fundo, aulas como lista editorial com foto
    lista = "".join(f'<li><a class="ini-aula" data-slug="{a["slug"]}" href="aulas/{a["slug"]}/index.html">'
                    f'<span class="ia-img"><img src="{ativo(prefixo)}{img_idioma(f'assets/img/hero/{a["slug"]}.jpg')}" alt="" loading="lazy" width="1536" height="1024"/></span>'
                    f'<span class="ia-txt"><span class="kicker">{ui["aula"]} {a["num"]} · {a["minutos"]} min<span class="ia-ok" aria-hidden="true">{ic("check")}</span></span>'
                    f'<span class="ia-t">{a["titulo"]}</span><span class="ia-l">{a["lead"]}</span></span></a></li>' for a in aulas)
    numeros = "".join(f'<li><b>{n["v"]}</b><span>{n["t"]}</span></li>' for n in p["numeros"])
    duas = "".join(f'<div><h2>{b["t"]}</h2><ol>{"".join(f"<li><span class=dn>{i + 1}</span><span>{x}</span></li>" for i, x in enumerate(b["itens"]))}</ol></div>' for b in p["blocos"])
    pontos = "".join(f'<a href="aulas/{x["slug"]}/index.html" class="pt" data-slug="{x["slug"]}" title="{attr(x["titulo"])}"><span class="sr">{x["titulo"]}</span></a>' for x in aulas)
    # 7.5.4: inicio.cursos (opcional) — cartões para os cursos completos de uma formação, logo depois dos números.
    # href_idioma: true → em en/ e es/ o link vai para <href><lang>/ (curso irmão também traduzido)
    cursos = ""
    if p.get("cursos"):
        cs = p["cursos"]
        def href(c):
            # 7.8.12: idempotente — o traduzir.py 7.8.11 já grava <href><lang>/ em conteudo/<lang>/
            if LANG == "pt" or not c.get("href_idioma") or c["href"].endswith(f"/{LANG}/"):
                return c["href"]
            return c["href"] + f"{LANG}/"
        cursos = (f'<section class="secao" id="cursos"><div class="sec-cab"><div><h2>{cs["titulo"]}</h2><p>{cs["sub"]}</p></div></div><ol class="ini-cursos">'
                  + "".join(f'<li><a class="ini-curso" href="{attr(href(c))}">'
                            f'<span class="ia-img"><img src="{ativo(prefixo)}{img_idioma(c["img"])}" alt="" loading="lazy" width="1400" height="788"/></span>'
                            f'<span class="ia-txt"><span class="kicker">{c["rot"]}</span><span class="ia-t">{c["t"]}</span><span class="ia-l">{c["l"]}</span>'
                            f'<span class="ic-ir">{cs["abrir"]} {ic("seta")}</span></span></a></li>' for c in cs["itens"])
                  + '</ol></section>')
    return (cabeca(f'{curso["nome"]} · INEMA', p["lead"], prefixo, lang, curso["url"], id_curso(curso))
            + f'<body class="inicio" data-curso="{id_curso(curso)}" data-total="{len(aulas)}" data-total-ex="{total_ex(aulas)}">' + topo(curso, aulas, ui, prefixo)
            + '<div class="casca">' + lado(curso, aulas, ui, prefixo, "")
            + '<main class="principal" id="conteudo"><div class="miolo">'
            + f'<div class="aula-hero com-img ini-hero"><div class="ah-txt"><nav class="pontos" aria-label="{attr(ui["aulas"])}">{pontos}</nav>'
            + f'<p class="kicker">{p["kicker"]}</p><h1>{p["titulo"]}</h1><p class="lead">{p["lead"]}</p>'
            + f'<div class="ini-acoes"><a class="comecar" href="aulas/{aulas[0]["slug"]}/index.html">{p["cta"]} {ic("seta")}</a>'
            + f'<a class="ini-link" href="{p["cta2"]["href"]}">{p["cta2"]["t"]}</a></div></div>'
            + f'<figure class="ah-img"><img src="{ativo(prefixo)}{img_idioma('assets/img/hero/inicio.jpg')}" alt="{attr(p["capa_alt"])}" width="1536" height="1024"/></figure></div>'
            + f'<ul class="ini-num">{numeros}</ul>' + cursos
            + f'<section class="secao" id="aulas"><div class="sec-cab"><div><h2>{p["aulas_titulo"]}</h2><p>{p["aulas_sub"]}</p></div></div><ol class="ini-aulas">{lista}</ol></section>'
            + f'<section class="secao"><div class="ini-duas">{duas}</div></section>'
            + rodape(curso) + f'</div></main></div><script src="{ativo(prefixo)}assets/v71.js"></script><script src="{ativo(prefixo)}assets/v72.js"></script></body></html>\n')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lang", default="pt")
    args = ap.parse_args()
    global LANG, IDIOMAS, URL_RAIZ
    LANG = args.lang
    IDIOMAS = [l for l in ("pt", "en", "es") if (RAIZ / "conteudo" / l / "curso.json").exists()]
    URL_RAIZ = json.loads((RAIZ / "conteudo" / "pt" / "curso.json").read_text())["url"]
    base = RAIZ / "conteudo" / args.lang
    curso = json.loads((base / "curso.json").read_text())
    ui = curso["ui"]
    aulas = [json.loads(f.read_text()) for f in sorted((base / "aulas").glob("*.json"))]
    for f in sorted((RAIZ / "conteudo" / "pt" / "aulas").glob("*.json")):  # 7.14.19: simterm usa comandos do PT
        x = json.loads(f.read_text()); PT_AULAS[x["slug"]] = x
    saida =RAIZ if args.lang == "pt" else RAIZ / args.lang
    erros = 0
    for i, a in enumerate(aulas):
        d = saida / "aulas" / a["slug"]
        d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text(pagina_aula(curso, aulas, a, i, ui, curso["lang"]))
    (saida / "index.html").write_text(pagina_inicio(curso, aulas, ui, curso["lang"]))
    print(f"{len(aulas)} aulas + index geradas ({args.lang}, motor {VERSAO}), {erros} erros")


if __name__ == "__main__":
    sys.exit(main())
