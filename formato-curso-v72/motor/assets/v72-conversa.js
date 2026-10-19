/* INEMA Learning 7.5.1 — simconversa: conversa com cliente simulado.
   O cliente fala, o aluno escolhe uma de 2–4 respostas, vê o comentário e o caminho segue conforme a escolha.
   No fim: placar (pontos do caminho / melhor caminho possível), lição e "recomeçar".
   Grava a conclusão em localStorage "<data-curso>:conv:<slug>-s<N>". Todo texto vem do JSON (ui do curso). */
(function () {
  var CURSO = document.body.getAttribute("data-curso") || "curso";
  function ler(k) { try { var v = localStorage.getItem(CURSO + ":" + k); return v === null ? null : JSON.parse(v); } catch (e) { return null; } }
  function gravar(k, v) { try { localStorage.setItem(CURSO + ":" + k, JSON.stringify(v)); } catch (e) {} }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function fmt(s, p, m) { return String(s).replace("{p}", p).replace("{m}", m); }
  var ICO = {
    ok: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><polyline points="22 4 12 14 9 11"/></svg>',
    meio: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
    ruim: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    volta: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.5 15a9 9 0 1 0 2.1-9.4L1 10"/></svg>'
  };

  document.querySelectorAll(".conv").forEach(function (box) {
    var D; try { D = JSON.parse(box.querySelector(".conv-dados").textContent); } catch (e) { return; }
    var T = D.txt, F = D.falas, id = box.getAttribute("data-conv");
    var log = box.querySelector(".conv-log"), ops = box.querySelector(".conv-ops"), fim = box.querySelector(".conv-fim");
    var pts = box.querySelector(".conv-pts");

    // melhor pontuação possível a partir de cada fala (o validador garante que não há laço)
    var memo = {};
    function melhor(fid) {
      if (memo[fid] != null) return memo[fid];
      var f = F[fid]; if (!f || f.fim) return (memo[fid] = 0);
      memo[fid] = 0;
      var m = 0; f.opcoes.forEach(function (o) { m = Math.max(m, (o.nota || 0) + melhor(o.vai)); });
      return (memo[fid] = m);
    }
    var MAX = melhor(D.inicio), pontos = 0;

    function placarSalvo() {
      var s = ler("conv:" + id);
      pts.textContent = s && s.feito ? fmt(T.conv_feita, s.pontos, s.max) : "";
      box.classList.toggle("feita", !!(s && s.feito));
    }

    function bolha(cls, quem, texto) {
      var li = el("li", "conv-msg " + cls);
      if (quem) li.appendChild(el("span", "conv-rot", quem));
      li.appendChild(el("span", "conv-txt", texto));
      log.appendChild(li); return li;
    }

    function mostra(fid, foco) {
      var f = F[fid]; if (!f) return;
      if (f.fim) return termina(f);
      var li = bolha("cliente", D.nome, f.cliente);
      ops.innerHTML = "";
      var maior = 0; f.opcoes.forEach(function (o) { maior = Math.max(maior, o.nota || 0); });
      f.opcoes.forEach(function (o) {
        var b = el("button", "conv-op", null); b.type = "button";
        b.appendChild(el("span", "conv-op-t", o.t));
        b.addEventListener("click", function () { escolhe(o, maior); });
        ops.appendChild(b);
      });
      if (foco) {
        li.scrollIntoView({ block: "nearest", behavior: "smooth" });
        var p = ops.querySelector("button"); if (p) p.focus({ preventScroll: true });
      }
    }

    function escolhe(o, maior) {
      ops.innerHTML = "";
      bolha("voce", T.conv_voce, o.t);
      var n = o.nota || 0; pontos += n;
      var nivel = n >= maior ? "ok" : (n <= 0 ? "ruim" : "meio");
      var rot = nivel === "ok" ? T.conv_boa : nivel === "ruim" ? T.conv_ruim : T.conv_meio;
      var c = el("li", "conv-msg comenta " + nivel);
      c.appendChild(el("span", "conv-nivel", ICO[nivel] + "<b>" + rot + "</b>"));
      c.appendChild(el("span", "conv-txt", o.comenta || ""));
      log.appendChild(c);
      mostra(o.vai, true);
    }

    function termina(f) {
      ops.innerHTML = "";
      fim.innerHTML = "";
      fim.appendChild(el("p", "conv-fim-t", "<b>" + (f.titulo || T.conv_fim) + "</b>"));
      fim.appendChild(el("p", "conv-fim-txt", f.texto || ""));
      fim.appendChild(el("p", "conv-placar", fmt(T.conv_placar, pontos, MAX)));
      if (D.licao) fim.appendChild(el("p", "conv-licao", "<b>" + T.conv_licao + "</b> " + D.licao));
      var b = el("button", "btn neutro conv-recomecar", ICO.volta + T.conv_recomecar); b.type = "button";
      b.addEventListener("click", function () { comeca(true); });
      fim.appendChild(b);
      fim.hidden = false;
      var antes = ler("conv:" + id);
      var melhorAntes = antes && antes.feito ? antes.pontos : -1;
      gravar("conv:" + id, { feito: true, pontos: Math.max(pontos, melhorAntes), max: MAX, ultimo: pontos, data: new Date().toISOString().slice(0, 10) });
      placarSalvo();
      fim.scrollIntoView({ block: "nearest", behavior: "smooth" });
      b.focus({ preventScroll: true });
    }

    function comeca(foco) {
      pontos = 0; log.innerHTML = ""; fim.hidden = true; fim.innerHTML = "";
      mostra(D.inicio, foco);
    }
    placarSalvo();
    comeca(false);
  });
})();
