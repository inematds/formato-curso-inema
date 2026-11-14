/* INEMA Learning 7.13.16 — conferidor: o aluno cola (ou carrega) o arquivo que escreveu e a página confere.
   Mesmas regras e mensagens do conferir.py (opção de terminal). Regras: campos, planos, cada_plano, duracao, termos;
   7.12.15: video {min, max, proporcao?, largura_min?} — lê duração e tamanho do arquivo escolhido (loadedmetadata).
   Tudo no navegador: nada é enviado. Rascunho guardado em localStorage "<data-curso>:conf:<id>:txt"; a última
   conferência certa em "<data-curso>:conf:<id>" ({ok, data}). Todo texto vem do JSON (ui do curso e da seção). */
(function () {
  var CURSO = document.body.getAttribute("data-curso") || "curso";
  var LANG = (document.documentElement.getAttribute("lang") || "pt").slice(0, 2);
  function ler(k) { try { return localStorage.getItem(CURSO + ":" + k); } catch (e) { return null; } }
  function gravar(k, v) { try { localStorage.setItem(CURSO + ":" + k, v); } catch (e) {} }
  var PLANO = /^\s*\d{1,2}\s*[|.)\-–—]/;
  var DURACAO = /(\d+(?:[.,]\d+)?)\s*(?:s|seg|segundos?|seconds?|sec)\b/;
  function norm(t) { return String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  function fmt(t, k) { t = String(t); Object.keys(k).forEach(function (a) { t = t.split("{" + a + "}").join(String(k[a])); }); return t; }
  function num(v) { var s = (v === Math.round(v)) ? String(v) : String(Math.round(v * 10) / 10); return LANG === "en" ? s : s.replace(".", ","); }
  function familias(g) {
    return (g.termos || []).map(function (fam) {
      return (fam.indexOf(" / ") >= 0 ? fam.split(" / ") : fam.split("/")).map(function (x) { return norm(x).trim(); }).filter(function (x) { return x; });  // 7.13.16
    });
  }
  // para cada grupo, as famílias citadas na linha; termo dentro de termo maior (de qualquer grupo) não conta
  // 7.14.22: no aviso de termo proibido, cita a forma que a pessoa escreveu (não o 1º sinônimo, que pode ser de outro idioma)
  function citado(texto, familia) {
    var ln = norm(texto), alts = familia.split(" / ").map(function (a) { return a.trim(); }).filter(Boolean);
    var ord = alts.slice().sort(function (a, b) { return b.length - a.length; });
    for (var i = 0; i < ord.length; i++) {
      if (new RegExp("(?<![a-z0-9])" + escRe(norm(ord[i])) + "(?![a-z0-9])").test(ln)) return ord[i];
    }
    return alts[0] || familia;
  }
  function achados(linha, grupos) {
    var ln = norm(linha), cand = [];
    grupos.forEach(function (g, gi) {
      familias(g).forEach(function (fam, fi) {
        fam.forEach(function (termo) {
          var re = new RegExp("(?<![a-z0-9])" + escRe(termo) + "(?![a-z0-9])", "g"), m;
          while ((m = re.exec(ln))) { cand.push([m.index, m.index + m[0].length, gi, fi]); if (!m[0].length) re.lastIndex++; }
        });
      });
    });
    cand.sort(function (a, b) { return (b[1] - b[0]) - (a[1] - a[0]); });
    var aceitos = [], out = grupos.map(function () { return {}; });
    cand.forEach(function (c) {
      if (aceitos.some(function (a) { return c[0] < a[1] && a[0] < c[1]; })) return;
      aceitos.push(c); out[c[2]][c[3]] = 1;
    });
    return out.map(function (o) { return Object.keys(o).length; }).map(function (n, i) { return { n: n, fams: out[i] }; });
  }

  // 7.11.14: grupo-rótulo com "min" ("som:") só conta com >= min letras depois dele, até o próximo |
  function preenchido(linha, g) {
    var ln = norm(linha);
    return familias(g).some(function (fam) {
      return fam.some(function (termo) {
        var re = new RegExp("(?<![a-z0-9])" + escRe(termo) + "(?![a-z0-9])", "g"), m;
        while ((m = re.exec(ln))) {
          if (ln.slice(m.index + m[0].length).split("|")[0].replace(/[^a-z0-9]/g, "").length >= g.min) return true;
          if (!m[0].length) re.lastIndex++;
        }
        return false;
      });
    });
  }
  // 7.11.14: a coluna que é só a duração ("4 s") vale primeiro; senão, a primeira menção "N s" da linha
  function duracaoDoPlano(linha) {
    var cols = norm(linha).split("|").slice(1);
    for (var k = 0; k < cols.length; k++) {
      var m = /^\s*(\d+(?:[.,]\d+)?)\s*(?:s|seg|segundos?|seconds?|sec)\s*$/.exec(cols[k]);
      if (m) return m;
    }
    return DURACAO.exec(norm(linha));
  }

  function conferir(texto, D) {
    var T = D.txt, linhas = String(texto || "").split(/\r?\n/);
    if (!linhas.join("").trim()) return { ok: false, msg: T.conf_vazio, faltas: [] };
    var faltas = [], planos = linhas.filter(function (l) { return PLANO.test(l); }), segs = 0;
    (D.regras || []).forEach(function (r) {
      if (r.tipo === "campos") {
        var mn = r.min == null ? 3 : r.min;
        r.campos.forEach(function (c) {
          var pad = new RegExp("^\\s*[-*•]?\\s*" + escRe(norm(c)) + "\\s*:\\s*(.*)$");
          var ok = linhas.some(function (l) { var m = pad.exec(norm(l)); return m && m[1].replace(/[^a-z0-9]/g, "").length >= mn; });
          if (!ok) faltas.push(fmt(T.conf_campo, { c: c, x: mn }));
        });
      } else if (r.tipo === "planos") {
        var mi = r.min == null ? 1 : r.min, ma = r.max == null ? 99 : r.max;
        if (planos.length < mi || planos.length > ma) faltas.push(fmt(T.conf_planos, { n: planos.length, x: mi, y: ma }));
      } else if (r.tipo === "cada_plano") {
        var gs = r.grupos, uso = gs.map(function () { return {}; });
        planos.forEach(function (l, i) {
          var ach = achados(l, gs);
          gs.forEach(function (g, gi) {
            Object.keys(ach[gi].fams).forEach(function (f) { uso[gi][f] = 1; });
            if (!ach[gi].n || (g.min && !preenchido(l, g))) faltas.push(fmt(T.conf_no_plano, { i: i + 1, g: g.rot }));
            else if (g.um_so && ach[gi].n > 1) faltas.push(fmt(T.conf_um_so, { i: i + 1, n: ach[gi].n, g: g.rot }));
          });
        });
        gs.forEach(function (g, gi) {
          var n = Object.keys(uso[gi]).length;
          if (planos.length && g.variar && n < g.variar) faltas.push(fmt(T.conf_variedade, { n: n, g: g.rot, x: g.variar }));
        });
      } else if (r.tipo === "duracao") {
        segs = 0;
        planos.forEach(function (l, i) {
          var m = duracaoDoPlano(l);
          if (!m) { faltas.push(fmt(T.conf_sem_duracao, { i: i + 1 })); return; }
          segs += parseFloat(m[1].replace(",", "."));
        });
        if (planos.length && (segs < r.min || segs > r.max)) faltas.push(fmt(T.conf_duracao, { s: num(segs), x: r.min, y: r.max }));
      } else if (r.tipo === "termos") {
        var tudo = linhas.join("\n");
        r.grupos.forEach(function (g, gi) {
          // 7.13.16: "campo" limita a busca à linha "Campo: …" (o aviso tem de estar no Rótulo, não numa fala)
          var alvo = tudo;
          if (g.campo) {
            var pc = new RegExp("^\\s*[-*•]?\\s*" + escRe(norm(g.campo)) + "\\s*:(.*)$");
            alvo = linhas.map(function (l) { var m = pc.exec(norm(l)); return m ? m[1] : ""; }).join("\n");
          }
          var ach = achados(alvo, r.grupos)[gi];
          if (g.proibe) {  // 7.14.21: grupo de termos proibidos (vazio, adjetivo sem teste): citar reprova
            if (ach.n) faltas.push(fmt(T.conf_proibe, { g: g.rot, c: citado(alvo, g.termos[Math.min.apply(null, Object.keys(ach.fams).map(Number))]) }));
          } else if (!ach.n) faltas.push(fmt(T.conf_termo, { g: g.rot }));
        });
      }
    });
    if (faltas.length) return { ok: false, msg: T.conf_falta, faltas: faltas };
    var n = planos.length || (D.regras || []).reduce(function (s, r) { return s + (r.tipo === "campos" ? r.campos.length : 0); }, 0);
    return { ok: true, msg: fmt(D.ok, { n: n, s: num(segs) }), faltas: [] };
  }
  window.INEMAConferir = conferir;  // para testes (conferir-tela.cjs)

  // 7.12.15: modo vídeo — mesmas regras e mensagens de conferir_video() do conferir.py
  var PROP = { "16:9": 16 / 9, "9:16": 9 / 16, "1:1": 1, "4:5": 4 / 5, "4:3": 4 / 3, "2.39:1": 2.39, "1.85:1": 1.85 };
  function gcd(a, b) { return b ? gcd(b, a % b) : a; }
  function nomeProp(w, h) {
    if (!w || !h) return "?";
    for (var k in PROP) if (Math.abs(w / h - PROP[k]) / PROP[k] <= 0.03) return k;
    var g = gcd(w, h) || 1; return (w / g) + ":" + (h / g);
  }
  function seg1(v) { var s = (Math.round(v * 10) / 10).toFixed(1); return LANG === "en" ? s : s.replace(".", ","); }
  function conferirVideo(info, D) {
    var T = D.txt, r = (D.regras || []).filter(function (x) { return x.tipo === "video"; })[0] || {};
    if (!info || !info.d || !isFinite(info.d) || !info.w) return { ok: false, msg: T.conf_falta, faltas: [T.conf_video_ler] };
    var f = [], p = nomeProp(info.w, info.h), d1 = Math.round(info.d * 10) / 10;
    var mi = r.min == null ? 0 : r.min, ma = r.max == null ? 1e6 : r.max;
    if (d1 < mi || d1 > ma) f.push(fmt(T.conf_video_dur, { s: seg1(info.d), x: mi, y: r.max == null ? "∞" : ma }));
    var props = !r.proporcao ? [] : (typeof r.proporcao === "string" ? [r.proporcao] : r.proporcao);
    if (props.length && props.indexOf(p) < 0) f.push(fmt(T.conf_video_prop, { w: info.w, h: info.h, p: p, q: props.join(" / ") }));
    if (r.largura_min && info.w < r.largura_min) f.push(fmt(T.conf_video_larg, { w: info.w, x: r.largura_min }));
    if (f.length) return { ok: false, msg: T.conf_falta, faltas: f };
    return { ok: true, msg: fmt(D.ok, { s: seg1(info.d), w: info.w, h: info.h, p: p }), faltas: [] };
  }
  window.INEMAConferirVideo = conferirVideo;
  function sonda(url, pronto) {
    var v = document.createElement("video"), feito = false;
    function fim(x) { if (feito) return; feito = true; v.removeAttribute("src"); v.load(); pronto(x); }
    v.preload = "metadata"; v.muted = true;
    v.onloadedmetadata = function () {
      if (isFinite(v.duration)) return fim({ d: v.duration, w: v.videoWidth, h: v.videoHeight });
      // WebM sem duração no cabeçalho: pular para o fim força o navegador a medir
      v.ondurationchange = function () { if (isFinite(v.duration)) fim({ d: v.duration, w: v.videoWidth, h: v.videoHeight }); };
      v.currentTime = 1e7;
    };
    v.onerror = function () { fim(null); };
    setTimeout(function () { fim(null); }, 20000);
    v.src = url;
  }

  function mostrar(res, r, D, id) {
    res.hidden = false;
    res.className = "cf-res " + (r.ok ? "ok" : "falha");
    res.innerHTML = "";
    var p = document.createElement("p"); p.className = "cf-msg"; p.textContent = r.msg; res.appendChild(p);
    if (r.faltas.length) {
      var ul = document.createElement("ul");
      r.faltas.forEach(function (x) { var li = document.createElement("li"); li.textContent = x; ul.appendChild(li); });
      res.appendChild(ul);
    }
    if (r.ok) gravar("conf:" + id, JSON.stringify({ ok: true, data: new Date().toISOString() }));
  }
  function videoBox(box, D, id, res) {
    function roda(url, revoga) {
      res.hidden = false; res.className = "cf-res carregando"; res.innerHTML = "";
      var p = document.createElement("p"); p.className = "cf-msg"; p.textContent = D.txt.conf_video_lendo; res.appendChild(p);
      sonda(url, function (info) { if (revoga) URL.revokeObjectURL(url); mostrar(res, conferirVideo(info, D), D, id); });
    }
    box.querySelectorAll("[data-cf-ex]").forEach(function (b) {
      b.addEventListener("click", function () { roda(b.getAttribute("data-cf-ex") === "ok" ? D.video_ok : D.video_erro, false); });
    });
    var arq = box.querySelector(".cf-arq");
    if (arq) arq.addEventListener("change", function () {
      var f = arq.files && arq.files[0]; if (!f) return;
      roda(URL.createObjectURL(f), true); arq.value = "";
    });
  }

  document.querySelectorAll(".confer").forEach(function (box) {
    var D; try { D = JSON.parse(box.querySelector(".cf-dados").textContent); } catch (e) { return; }
    var id = box.getAttribute("data-conf"), ta = box.querySelector("textarea"), res = box.querySelector(".cf-res");
    if (D.video) return videoBox(box, D, id, res);
    var rascunho = ler("conf:" + id + ":txt"); if (rascunho) ta.value = rascunho;
    function mostra(r) {
      res.hidden = false;
      res.className = "cf-res " + (r.ok ? "ok" : "falha");
      res.innerHTML = "";
      var p = document.createElement("p"); p.className = "cf-msg"; p.textContent = r.msg; res.appendChild(p);
      if (r.faltas.length) {
        var ul = document.createElement("ul"), max = 8;
        r.faltas.slice(0, max).forEach(function (f) { var li = document.createElement("li"); li.textContent = f; ul.appendChild(li); });
        if (r.faltas.length > max) { var li = document.createElement("li"); li.textContent = fmt(D.txt.conf_mais, { n: r.faltas.length - max }); ul.appendChild(li); }
        res.appendChild(ul);
      }
      if (r.ok) gravar("conf:" + id, JSON.stringify({ ok: true, data: new Date().toISOString() }));
    }
    function confere() { mostra(conferir(ta.value, D)); }
    ta.addEventListener("input", function () { gravar("conf:" + id + ":txt", ta.value); });
    box.querySelector(".cf-ir").addEventListener("click", confere);
    box.querySelectorAll("[data-cf-ex]").forEach(function (b) {
      b.addEventListener("click", function () {
        ta.value = b.getAttribute("data-cf-ex") === "ok" ? D.exemplo : D.exemplo_errado;
        confere();
      });
    });
    var lim = box.querySelector(".cf-limpar");
    if (lim) lim.addEventListener("click", function () { ta.value = ""; gravar("conf:" + id + ":txt", ""); res.hidden = true; ta.focus(); });
    var arq = box.querySelector(".cf-arq");
    if (arq) arq.addEventListener("change", function () {
      var f = arq.files && arq.files[0]; if (!f) return;
      var rd = new FileReader();
      rd.onload = function () { ta.value = String(rd.result || ""); gravar("conf:" + id + ":txt", ta.value); confere(); arq.value = ""; };
      rd.readAsText(f);
    });
    var bx = box.querySelector(".cf-baixar");
    if (bx) bx.addEventListener("click", function () {
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([ta.value], { type: "text/plain;charset=utf-8" }));
      a.download = D.arquivo || "arquivo.txt"; document.body.appendChild(a); a.click(); a.remove();
    });
  });
})();
