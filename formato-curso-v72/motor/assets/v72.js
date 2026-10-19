/* INEMA Learning v7.2 — camada por cima do v71.js (não altera o comportamento dele) */
(function () {
  /* sol/lua: atalho de um clique que usa os mesmos botões de tema do Aa (mesma gravação) */
  var tb = document.querySelector(".tema-btn");
  if (tb) tb.addEventListener("click", function () {
    var claro = document.documentElement.getAttribute("data-tema") === "papel";
    var alvo = document.querySelector('.aa-pop button[data-tema="' + (claro ? "escuro" : "papel") + '"]');
    if (alvo) alvo.click();
  });

  /* pontos de progresso: espelham as aulas concluídas da lista lateral */
  function pontos() {
    document.querySelectorAll(".pontos .pt").forEach(function (p) {
      var l = document.querySelector('.lista-aulas a[data-slug="' + p.getAttribute("data-slug") + '"]');
      p.classList.toggle("feita", !!(l && l.classList.contains("feita")));
    });
    document.querySelectorAll(".ini-aula").forEach(function (p) {
      var l = document.querySelector('.lista-aulas a[data-slug="' + p.getAttribute("data-slug") + '"]');
      p.classList.toggle("feita", !!(l && l.classList.contains("feita")));
    });
  }
  pontos();
  var lista = document.querySelector(".lista-aulas");
  if (lista && window.MutationObserver) new MutationObserver(pontos).observe(lista, { subtree: true, attributes: true, attributeFilter: ["class"] });

  /* título preso do diagrama: aparece quando o título da seção sai pelo alto */
  document.querySelectorAll(".scrolly").forEach(function (sc) {
    var sec = sc.closest(".secao"), h = sec && sec.querySelector(".sec-cab h2");
    if (!h || !sc.querySelector(".sc-tit")) return;
    var topo = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--top"), 10) || 60;
    function confere() { sc.classList.toggle("tit-on", h.getBoundingClientRect().bottom < topo + 4); }
    var pedido = false;
    addEventListener("scroll", function () { if (!pedido) { pedido = true; requestAnimationFrame(function () { pedido = false; confere(); }); } }, { passive: true });
    addEventListener("resize", confere);
    confere();
  });
})();

/* Seu estudo: anotações no texto, desempenho nos testes e cópia dos dados — tudo no navegador (localStorage).
   Nenhum texto visível fica aqui: vem de #estudo-dados (curso.json → ui.estudo). Texto do aluno só por textContent. */
(function () {
  "use strict";
  var fonte = document.getElementById("estudo-dados");
  if (!fonte) return;
  var D; try { D = JSON.parse(fonte.textContent); } catch (e) { return; }
  var T = D.txt;
  var CURSO = document.body.getAttribute("data-curso") || "curso";
  var AULA = document.body.getAttribute("data-aula") || "";
  var P = CURSO + ":";
  function ler(k, p) { try { var v = localStorage.getItem(P + k); return v === null ? p : JSON.parse(v); } catch (e) { return p; } }
  function gravar(k, v) { try { localStorage.setItem(P + k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  var marcaTopo = document.querySelector(".topo .marca");
  var RAIZ = marcaTopo ? marcaTopo.getAttribute("href").replace(/index\.html$/, "") : "";
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function corta(t, n) { t = (t || "").replace(/\s+/g, " ").trim(); return t.length > n ? t.slice(0, n - 1) + "…" : t; }
  function link(slug, hash) { return RAIZ + "aulas/" + slug + "/index.html" + (hash ? "#" + hash : ""); }

  /* ---------- anotações ---------- */
  var SEL = ".aula-hero .lead, .nesta2 li > span,.nesta2 .objetivo, .secao .texto p, .pcorpo p, .exc p, .resumo > div, .q-p, .sc-passo h3, .sc-passo p, .dg-legenda";
  var lista = [];
  function blocoReal(id) {
    var bs = document.querySelectorAll('[data-bloco="' + id + '"]');
    for (var i = 0; i < bs.length; i++) if (!bs[i].closest(".sc-cap")) return bs[i];
    return null;
  }
  function blocosReais() { return Array.prototype.filter.call(document.querySelectorAll("[data-bloco]"), function (b) { return !b.closest(".sc-cap"); }); }
  function offset(b, no, off) { var r = document.createRange(); r.selectNodeContents(b); try { r.setEnd(no, off); } catch (e) { return -1; } return r.toString().length; }
  /* envolve [ini,fim) do texto do bloco em <mark>, pedaço por pedaço (nunca surroundContents, nunca marca dentro de marca) */
  function envolve(b, ini, fim, rec) {
    var w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT), pos = 0, alvos = [], n;
    while ((n = w.nextNode())) {
      var a = pos, z = pos + n.data.length; pos = z;
      if (z <= ini || a >= fim) continue;
      if (n.parentNode.closest("mark.nt, svg")) continue;
      alvos.push([n, Math.max(ini - a, 0), Math.min(fim - a, n.data.length)]);
    }
    alvos.forEach(function (x) {
      if (x[2] <= x[1]) return;
      var meio = x[0].splitText(x[1]); meio.splitText(x[2] - x[1]);
      var m = document.createElement("mark");
      m.className = "nt" + (rec.nota ? " com-nota" : "");
      m.setAttribute("data-nota", rec.id);
      if (rec.nota) m.title = rec.nota;
      meio.parentNode.insertBefore(m, meio); m.appendChild(meio);
    });
    return alvos.length > 0;
  }
  function aplica(rec) {
    var b = blocoReal(rec.bloco);
    if (b && b.textContent.slice(rec.ini, rec.fim) === rec.quote) return envolve(b, rec.ini, rec.fim, rec);
    var cands = (b ? [b] : []).concat(blocosReais());
    for (var i = 0; i < cands.length; i++) {
      var j = cands[i].textContent.indexOf(rec.quote);
      if (j >= 0) { rec.bloco = cands[i].getAttribute("data-bloco"); rec.ini = j; rec.fim = j + rec.quote.length; return envolve(cands[i], rec.ini, rec.fim, rec); }
    }
    return false;
  }
  function salvaNotas() {
    var n = ler("notas", {});
    var limpa = lista.map(function (r) { return { id: r.id, ts: r.ts, bloco: r.bloco, ini: r.ini, fim: r.fim, quote: r.quote, nota: r.nota }; });
    if (limpa.length) n[AULA] = limpa; else delete n[AULA];
    gravar("notas", n);
    pintaNotas();
  }
  /* no desktop o texto da etapa é lido na legenda do painel fixo (cópia da etapa): recopia para mostrar as marcas */
  function refrescaCaps() {
    document.querySelectorAll(".scrolly.fixo").forEach(function (sc) {
      var p = sc.querySelector(".sc-passo.ativo"), cap = sc.querySelector(".sc-cap");
      if (!p || !cap) return;
      var h1 = cap.querySelector("h3"), h2 = p.querySelector("h3");
      if (h1 && h2 && h1.textContent === h2.textContent) cap.innerHTML = p.innerHTML;
    });
  }
  function desfaz(id) {
    document.querySelectorAll('mark.nt[data-nota="' + id + '"]').forEach(function (m) {
      var pai = m.parentNode;
      while (m.firstChild) pai.insertBefore(m.firstChild, m);
      pai.removeChild(m); pai.normalize();
    });
  }

  var barra = el("div", "nt-barra"), bMarca = el("button", "nt-b", T.marcar), bAnota = el("button", "nt-b", T.anotar), bAviso = el("span", "nt-aviso");
  bMarca.type = bAnota.type = "button";
  barra.appendChild(bMarca); barra.appendChild(bAnota); barra.appendChild(bAviso); barra.hidden = true;
  var pop = el("div", "nt-pop"), pq = el("blockquote", "nt-q"), ta = el("textarea", "nt-ta"), pacoes = el("div", "nt-acoes");
  var bSalva = el("button", "nt-b cheio", T.salvar), bApaga = el("button", "nt-b", T.apagar), bFecha = el("button", "nt-b", T.fechar);
  bSalva.type = bApaga.type = bFecha.type = "button";
  ta.placeholder = T.nota_ph; ta.rows = 4; ta.setAttribute("aria-label", T.anotar);
  pop.setAttribute("role", "dialog"); pop.setAttribute("aria-label", T.anotar);
  pacoes.appendChild(bSalva); pacoes.appendChild(bApaga); pacoes.appendChild(bFecha);
  pop.appendChild(pq); pop.appendChild(ta); pop.appendChild(pacoes); pop.hidden = true;
  var selAtual = null, aberto = null;

  function posiciona(caixa, r) {
    caixa.style.left = "0px"; caixa.style.top = "0px";
    var w = caixa.offsetWidth, h = caixa.offsetHeight;
    var x = Math.min(Math.max(r.left + r.width / 2 - w / 2, 8), innerWidth - w - 8);
    var y = r.bottom + 10;
    if (y + h > innerHeight - 8) y = Math.max(r.top - h - 10, 8);
    caixa.style.left = x + "px"; caixa.style.top = y + "px";
  }
  function lerSelecao() {
    var s = getSelection();
    if (!s || s.isCollapsed || !s.rangeCount) return null;
    var r = s.getRangeAt(0);
    if (!r.toString().trim()) return null;
    function blocoDe(no) { var e = no.nodeType === 1 ? no : no.parentNode; return e && e.closest ? e.closest("[data-bloco]") : null; }
    var com = r.commonAncestorContainer, ce = com.nodeType === 1 ? com : com.parentNode;
    if (!ce.closest || !ce.closest(".miolo")) return null;
    var b1 = blocoDe(r.startContainer), b2 = blocoDe(r.endContainer);
    if (!b1 || b1 !== b2) return { erro: b1 && b2 ? T.um_bloco : T.nao_marca, r: r };
    var ini = offset(b1, r.startContainer, r.startOffset), fim = offset(b1, r.endContainer, r.endOffset), txt = b1.textContent;
    if (ini < 0 || fim < 0) return { erro: T.nao_marca, r: r };
    while (ini < fim && /\s/.test(txt[ini])) ini++;
    while (fim > ini && /\s/.test(txt[fim - 1])) fim--;
    if (fim <= ini) return null;
    return { bloco: b1.getAttribute("data-bloco"), ini: ini, fim: fim, quote: txt.slice(ini, fim), r: r };
  }
  function mostraBarra() {
    if (!pop.hidden) return;
    selAtual = lerSelecao();
    if (!selAtual) { barra.hidden = true; return; }
    var erro = !!selAtual.erro;
    bMarca.hidden = bAnota.hidden = erro; bAviso.hidden = !erro; bAviso.textContent = erro ? selAtual.erro : "";
    barra.hidden = false;
    posiciona(barra, selAtual.r.getBoundingClientRect());
  }
  function cria(comNota) {
    var s = selAtual;
    if (!s || s.erro) return;
    var rec = { id: "n" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), ts: Date.now(), bloco: s.bloco, ini: s.ini, fim: s.fim, quote: s.quote, nota: null };
    try { getSelection().removeAllRanges(); } catch (e) {}
    barra.hidden = true; selAtual = null;
    if (!aplica(rec)) return;
    lista.push(rec); salvaNotas(); refrescaCaps();
    if (comNota) abre(rec.id);
  }
  function abre(id, junto) {
    var rec = lista.filter(function (r) { return r.id === id; })[0];
    if (!rec) return;
    aberto = rec; barra.hidden = true;
    pq.textContent = corta(rec.quote, 180); ta.value = rec.nota || "";
    pop.hidden = false;
    var m = junto || document.querySelector('mark.nt[data-nota="' + id + '"]');
    if (innerWidth > 640 && m) posiciona(pop, m.getBoundingClientRect()); else { pop.style.left = ""; pop.style.top = ""; }
    ta.focus();
  }
  function fecha() { pop.hidden = true; aberto = null; }
  bMarca.addEventListener("click", function () { cria(false); });
  bAnota.addEventListener("click", function () { cria(true); });
  barra.addEventListener("mousedown", function (e) { e.preventDefault(); });
  bSalva.addEventListener("click", function () {
    if (!aberto) return;
    aberto.nota = ta.value.trim() || null; aberto.ts = Date.now();
    document.querySelectorAll('mark.nt[data-nota="' + aberto.id + '"]').forEach(function (m) {
      m.classList.toggle("com-nota", !!aberto.nota);
      if (aberto.nota) m.title = aberto.nota; else m.removeAttribute("title");
    });
    salvaNotas(); refrescaCaps(); fecha();
  });
  bApaga.addEventListener("click", function () {
    if (!aberto) return;
    var id = aberto.id;
    desfaz(id);
    lista = lista.filter(function (r) { return r.id !== id; });
    salvaNotas(); refrescaCaps(); fecha();
  });
  bFecha.addEventListener("click", fecha);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { fecha(); barra.hidden = true; } });

  if (AULA) {
    document.body.appendChild(barra); document.body.appendChild(pop);
    var cont = {};
    document.querySelectorAll(SEL).forEach(function (b) {
      if (b.closest(".sc-cap")) return;
      var sec = b.closest(".secao"), base = sec && sec.id ? sec.id : "topo";
      cont[base] = (cont[base] || 0) + 1;
      b.setAttribute("data-bloco", base + "-" + cont[base]);
    });
    lista = (ler("notas", {})[AULA] || []).filter(function (r) { return r && r.id && typeof r.quote === "string"; });
    lista.forEach(function (r) { r.nota = typeof r.nota === "string" && r.nota ? r.nota : null; aplica(r); });
    refrescaCaps();
    /* mouse: mostra ao soltar; toque (alças de seleção do celular): espera a seleção parar de mudar */
    var espera = null;
    document.addEventListener("selectionchange", function () { clearTimeout(espera); espera = setTimeout(mostraBarra, 350); });
    document.addEventListener("mouseup", function (e) { if (barra.contains(e.target) || pop.contains(e.target)) return; setTimeout(mostraBarra, 10); });
    document.addEventListener("click", function (e) {
      if (pop.contains(e.target) || barra.contains(e.target)) return;
      var m = e.target.closest("mark.nt");
      var s = getSelection();
      if (m && (!s || s.isCollapsed)) { e.preventDefault(); abre(m.getAttribute("data-nota"), m); return; }
      if (!pop.hidden) fecha();
    });
    addEventListener("scroll", function () { if (!barra.hidden && selAtual && selAtual.r) posiciona(barra, selAtual.r.getBoundingClientRect()); }, { passive: true });
    /* link da gaveta: aula/#nota-<id> leva até a marca */
    var irNota = function () {
      var h = decodeURIComponent(location.hash || "");
      if (h.indexOf("#nota-") !== 0) return;
      var id = h.slice(6), alvo = null;
      document.querySelectorAll('mark.nt[data-nota="' + id + '"]').forEach(function (m) { if (!alvo && !m.closest(".sc-cap")) alvo = m; });
      if (!alvo) return;
      document.body.classList.remove("lado-aberto");
      alvo.scrollIntoView({ block: "center" });
      setTimeout(function () { refrescaCaps(); document.querySelectorAll('mark.nt[data-nota="' + id + '"]').forEach(function (m) { m.classList.add("piscar"); setTimeout(function () { m.classList.remove("piscar"); }, 2200); }); }, 400);
    };
    addEventListener("hashchange", irNota);
    setTimeout(irNota, 300);
  }

  /* ---------- desempenho nos testes ---------- */
  var qz = AULA && document.querySelector(".quiz");
  if (qz) {
    var itens = Array.prototype.slice.call(qz.querySelectorAll(".q-item"));
    var rodada = { tipo: "completo", res: {} };
    var fechaRodada = function () {
      var ks = Object.keys(rodada.res);
      if (!ks.length) return;
      var a = ks.filter(function (k) { return rodada.res[k]; }).length, n = ks.length;
      var q = ler("quiz", {}), r = q[AULA] || { tent: 0, erradas: [] };
      if (rodada.tipo === "completo") {
        r.tent = (r.tent || 0) + 1;
        r.ultima = { a: a, n: n, ts: Date.now() };
        if (!r.melhor || a / n > r.melhor.a / r.melhor.n) r.melhor = { a: a, n: n };
        r.erradas = ks.filter(function (k) { return !rodada.res[k]; }).map(Number);
      } else {
        r.erradas = (r.erradas || []).filter(function (k) { return rodada.res[k] !== true; });
        r.rev = (r.rev || 0) + 1;
      }
      r.ts = Date.now(); q[AULA] = r; gravar("quiz", q);
      rodada = { tipo: rodada.tipo, res: {} };
      pintaDesempenho();
    };
    /* escuta por delegação: roda depois dos botões do v71.js, que já trataram o clique */
    qz.addEventListener("click", function (e) {
      var op = e.target.closest(".q-op");
      if (op) { var k = itens.indexOf(op.closest(".q-item")); if (k >= 0 && !(k in rodada.res)) rodada.res[k] = op.getAttribute("data-certa") === "1"; return; }
      if (e.target.closest(".q-refazer")) { rodada = { tipo: "completo", res: {} }; return; }
      if (e.target.closest(".q-revisar")) { rodada = { tipo: "revisao", res: {} }; return; }
      if (e.target.closest(".q-prox")) { var rf = qz.querySelector(".q-refazer"); if (rf && !rf.hidden) fechaRodada(); }
    });
  }

  /* ---------- gaveta ---------- */
  function caixa(nome) { return { corpo: document.querySelector('[data-es-corpo="' + nome + '"]'), cont: document.querySelector('[data-es-cont="' + nome + '"]') }; }
  function pintaDesempenho() {
    var c = caixa("desempenho");
    if (!c.corpo) return;
    var q = ler("quiz", {}), feitos = 0, total = 0, ul = el("ul", "es-lista");
    D.aulas.forEach(function (a) {
      if (!a.quiz) return;
      total++;
      var r = q[a.slug], li = el("li", "es-item"), cab = el("a", "es-aula", a.num + ". " + a.t);
      cab.href = link(a.slug, a.quiz.sec); li.appendChild(cab);
      if (!r || !r.ultima) { li.appendChild(el("span", "es-sub", T.nao_fez)); ul.appendChild(li); return; }
      feitos++;
      var melhor = r.melhor || r.ultima;
      li.appendChild(el("span", "es-sub", T.ultimo + " " + r.ultima.a + "/" + r.ultima.n + " · " + T.melhor + " " + melhor.a + "/" + melhor.n + " · " + r.tent + " " + (r.tent === 1 ? T.tentativa : T.tentativas)));
      var err = (r.erradas || []).filter(function (k) { return a.quiz.perguntas[k]; });
      if (!err.length) li.appendChild(el("span", "es-ok", T.tudo_certo));
      else {
        li.appendChild(el("span", "es-rot", T.rever));
        var ol = el("ul", "es-erros");
        err.forEach(function (k) {
          var p = a.quiz.perguntas[k], x = el("li");
          x.appendChild(el("span", "es-p", p.p)); x.appendChild(el("span", "es-r", T.resposta + " " + p.certa));
          ol.appendChild(x);
        });
        li.appendChild(ol);
        var ir = el("a", "es-link", T.ir_teste + " →"); ir.href = link(a.slug, a.quiz.sec); li.appendChild(ir);
      }
      ul.appendChild(li);
    });
    c.corpo.textContent = "";
    if (!feitos) c.corpo.appendChild(el("p", "es-vazio", T.sem_testes));
    c.corpo.appendChild(ul);
    c.cont.textContent = feitos + "/" + total;
  }
  function pintaNotas() {
    var c = caixa("notas");
    if (!c.corpo) return;
    var n = ler("notas", {}), total = 0, ul = el("ul", "es-lista");
    D.aulas.forEach(function (a) {
      var l = n[a.slug];
      if (!Array.isArray(l) || !l.length) return;
      var li = el("li", "es-item"), ol = el("ul", "es-notas");
      li.appendChild(el("b", "es-aula-t", a.num + ". " + a.t));
      l.forEach(function (r) {
        if (!r || typeof r.quote !== "string") return;
        total++;
        var x = el("li"), lk = el("a", "es-nota");
        lk.href = link(a.slug, "nota-" + r.id);
        lk.appendChild(el("q", null, corta(r.quote, 110)));
        x.appendChild(lk);
        x.appendChild(el("span", r.nota ? "es-nt" : "es-sub", r.nota || T.so_marcado));
        ol.appendChild(x);
      });
      li.appendChild(ol); ul.appendChild(li);
    });
    c.corpo.textContent = "";
    c.corpo.appendChild(total ? ul : el("p", "es-vazio", T.sem_notas));
    c.cont.textContent = total ? String(total) : "";
  }
  /* ---------- minha jornada: onde parei + resumo ---------- */
  function aulaDe(slug) { return D.aulas.filter(function (a) { return a.slug === slug; })[0]; }
  function quando(ts) {
    var d0 = new Date(); d0.setHours(0, 0, 0, 0);
    var dias = Math.ceil((d0 - ts) / 864e5);
    return dias <= 0 ? T.hoje : dias === 1 ? T.ontem : T.ha_dias.replace("{n}", dias);
  }
  if (AULA) {
    var ultimoSec = null, jPedido = false;
    var marcaOnde = function () {
      jPedido = false;
      var lim = innerHeight * 0.4, atual = null;
      document.querySelectorAll(".secao[id]").forEach(function (s) { if (s.getBoundingClientRect().top < lim) atual = s; });
      var id = atual ? atual.id : "";
      if (id === ultimoSec) return;
      ultimoSec = id;
      var h = atual && atual.querySelector("h2"), tit = h ? h.textContent.replace(/^\s*\d+\s*·\s*/, "").trim() : "";
      gravar("jornada", { aula: AULA, sec: id, t: tit, ts: Date.now() });
    };
    addEventListener("scroll", function () { if (!jPedido) { jPedido = true; setTimeout(marcaOnde, 800); } }, { passive: true });
    marcaOnde();
  }
  function pintaJornada() {
    var lado = document.querySelector(".lado");
    if (!lado) return;
    var box = lado.querySelector(".es-jornada");
    if (!box) { box = el("div", "es-jornada"); lado.insertBefore(box, lado.querySelector(".ind")); }
    box.textContent = "";
    var j = ler("jornada", null), a = j && aulaDe(j.aula), lk = el("a", "es-cont-link");
    if (a) {
      lk.href = link(a.slug, j.sec);
      lk.appendChild(el("small", null, T.continuar + " · " + quando(j.ts)));
      lk.appendChild(el("b", null, a.num + ". " + a.t + (j.t ? " · " + j.t : "")));
    } else {
      lk.href = link(D.aulas[0].slug);
      lk.appendChild(el("b", null, T.comecar));
    }
    box.appendChild(lk);
    /* página inicial: o botão principal leva para onde parei */
    var cta = document.querySelector("body.inicio .ini-acoes .comecar");
    if (cta && a) {
      cta.href = link(a.slug, j.sec);
      if (cta.firstChild && cta.firstChild.nodeType === 3) cta.firstChild.textContent = T.cta_continuar.replace("{n}", a.num) + " ";
    }
  }
  var pintaTudo = function () { pintaJornada(); pintaDesempenho(); pintaNotas(); };
  pintaTudo();
  /* a gaveta mostra o estado atual sempre que abre */
  var mbtn = document.querySelector(".menu-btn");
  if (mbtn) mbtn.addEventListener("click", function () { if (document.body.classList.contains("lado-aberto")) pintaTudo(); });

  /* ---------- copiar meus dados (.json) ---------- */
  var msg = document.querySelector(".es-msg"), bEx = document.querySelector(".es-exportar"), inp = document.querySelector(".es-importar input");
  function aviso(t) { if (msg) msg.textContent = t; }
  if (bEx) bEx.addEventListener("click", function () {
    var dados = {};
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k.indexOf(P) !== 0) continue;
        var v = localStorage.getItem(k);
        try { dados[k.slice(P.length)] = JSON.parse(v); } catch (e) { dados[k.slice(P.length)] = v; }
      }
    } catch (e) {}
    var obj = { formato: "inema-curso", versao: 1, curso: CURSO, exportado: new Date().toISOString(), dados: dados };
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" }));
    a.download = CURSO + "-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    aviso(T.export_ok);
  });
  /* carregar soma com o que existe (nada é apagado) */
  function mescla(d) {
    var n = 0;
    Object.keys(d).forEach(function (k) {
      var v = d[k], l;
      if (k === "feitas") {
        if (!v || typeof v !== "object") return;
        l = ler("feitas", {});
        Object.keys(v).forEach(function (s) { if (v[s] && !l[s]) { l[s] = 1; n++; } });
        gravar("feitas", l);
      } else if (k.indexOf("ex:") === 0) {
        if (v === true && ler(k, false) !== true) { gravar(k, true); n++; }
      } else if (k === "notas") {
        if (!v || typeof v !== "object") return;
        l = ler("notas", {});
        Object.keys(v).forEach(function (a) {
          if (!Array.isArray(v[a])) return;
          var cur = Array.isArray(l[a]) ? l[a] : [], ids = {};
          cur.forEach(function (r) { ids[r.id] = 1; });
          v[a].forEach(function (r) {
            if (!r || typeof r.id !== "string" || typeof r.quote !== "string" || ids[r.id]) return;
            cur.push({ id: r.id, ts: +r.ts || Date.now(), bloco: String(r.bloco || ""), ini: +r.ini || 0, fim: +r.fim || 0, quote: r.quote, nota: typeof r.nota === "string" && r.nota ? r.nota : null });
            n++;
          });
          l[a] = cur;
        });
        gravar("notas", l);
      } else if (k === "quiz") {
        if (!v || typeof v !== "object") return;
        l = ler("quiz", {});
        Object.keys(v).forEach(function (a) {
          var r = v[a];
          if (!r || typeof r !== "object" || !r.ultima) return;
          if (!l[a] || (+r.ts || 0) > (+l[a].ts || 0)) { l[a] = r; n++; }
        });
        gravar("quiz", l);
      } else if (k === "jornada") {
        var jl = ler("jornada", null);
        if (v && typeof v === "object" && typeof v.aula === "string" && (!jl || (+v.ts || 0) > (+jl.ts || 0))) { gravar("jornada", { aula: v.aula, sec: String(v.sec || ""), t: String(v.t || ""), ts: +v.ts || 0 }); n++; }
      } else if (ler(k, undefined) === undefined) { gravar(k, v); n++; }
    });
    return n;
  }
  if (inp) inp.addEventListener("change", function () {
    var f = inp.files && inp.files[0];
    if (!f) return;
    var rd = new FileReader();
    rd.onload = function () {
      var obj = null;
      try { obj = JSON.parse(rd.result); } catch (e) {}
      inp.value = "";
      if (!obj || obj.formato !== "inema-curso" || !obj.dados || typeof obj.dados !== "object") { aviso(T.import_erro); return; }
      if (obj.curso !== CURSO) { aviso(T.import_outro); return; }
      var n = mescla(obj.dados);
      aviso(T.import_ok.replace("{n}", n));
      setTimeout(function () { location.reload(); }, 1200);
    };
    rd.onerror = function () { aviso(T.import_erro); };
    rd.readAsText(f);
  });
})();
