/* 7.14.19: portão humano simulado (tipo simportao, sec_simportao em gerar.py). Ilustrativa: nada é gerado nem publicado. */
(function () {
  document.querySelectorAll(".simportao").forEach(function (sim) {
    var d; try { d = JSON.parse(sim.getAttribute("data-sim")); } catch (e) { return; }
    var fases = [].slice.call(sim.querySelectorAll(".sp-fase"));
    var caixa = sim.querySelector(".sp-texto"), corpo = sim.querySelector(".sp-corpo"), log = sim.querySelector(".sim-log");
    var bt = {}; sim.querySelectorAll("[data-acao]").forEach(function (b) { bt[b.getAttribute("data-acao")] = b; });
    var timers = [], corrigido = false, PORTAO = 1, PASSO = 650;
    function msg(t) { log.textContent = t; }
    function limpa() { timers.forEach(clearTimeout); timers = []; }
    function depois(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function estado(i, cls) { fases[i].classList.remove("rodando", "feita", "parada", "erro"); if (cls) fases[i].classList.add(cls); }
    function botoes(rodar, aprovar, reprovar, sempor) { bt.rodar.disabled = !rodar; bt.aprovar.disabled = !aprovar; bt.reprovar.disabled = !reprovar; bt.sempor.disabled = !sempor; }
    function texto(t, bom) { caixa.hidden = false; corpo.textContent = t; caixa.classList.toggle("bom", !!bom); caixa.classList.toggle("ruim", !bom); }
    function zera() { limpa(); corrigido = false; fases.forEach(function (_, i) { estado(i, ""); }); caixa.hidden = true; botoes(true, false, false, true); msg(d.msg.inicio); }
    function escreve(t, bom, fim) {
      estado(0, "rodando");
      depois(PASSO, function () { estado(0, "feita"); texto(t, bom); estado(PORTAO, "parada"); fim(); });
    }
    function segue(fim) {
      var i = PORTAO + 1;
      (function prox() {
        if (i >= fases.length) { fim(); return; }
        var k = i++; estado(k, "rodando");
        depois(PASSO, function () { estado(k, "feita"); prox(); });
      })();
    }
    bt.rodar.addEventListener("click", function () {
      zera(); botoes(false, false, false, false);
      escreve(d.rascunho, false, function () { botoes(false, true, true, false); msg(d.msg.portao); });
    });
    bt.reprovar.addEventListener("click", function () {
      botoes(false, false, false, false); estado(PORTAO, "");
      escreve(d.corrigido, true, function () { corrigido = true; botoes(false, true, false, false); msg(d.msg.reprovado); });
    });
    bt.aprovar.addEventListener("click", function () {
      botoes(false, false, false, false); estado(PORTAO, "feita");
      segue(function () {
        if (!corrigido) estado(fases.length - 1, "erro");
        msg(corrigido ? d.msg.aprovado_bom : d.msg.aprovado_ruim); botoes(true, false, false, true);
      });
    });
    bt.sempor.addEventListener("click", function () {
      zera(); botoes(false, false, false, false); estado(0, "rodando");
      depois(PASSO, function () {
        estado(0, "feita"); estado(PORTAO, "feita");
        segue(function () { texto(d.rascunho, false); estado(fases.length - 1, "erro"); msg(d.msg.sem_portao); botoes(true, false, false, true); });
      });
    });
    bt.zerar.addEventListener("click", zera);
    zera();
  });
})();
