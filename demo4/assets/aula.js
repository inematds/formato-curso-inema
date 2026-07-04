/* formato-curso v4 — motor da aula (leitura viva + retenção), self-contained.
   Cada aula fornece: body[data-lesson], o hero, .layout (.col com .step + .rail),
   a barra .bar (com brand/back/botões) e um <script id="authored-cards"> JSON. */
(function(){
  "use strict";
  var LS = document.body.getAttribute('data-lesson') || "v4:lesson";
  var today = Math.floor(Date.now()/86400000);

  // ---- injeta a mobília comum ----
  document.body.insertAdjacentHTML('afterbegin',
    '<div class="grain"></div><div class="prog" id="prog"></div>'+
    '<div class="seltb" id="seltb"><button data-a="hl">grifar</button><button data-a="card">grifar + cartão</button></div>');
  document.body.insertAdjacentHTML('beforeend',
    '<div class="scrim" id="scrim"></div>'+
    '<aside class="panel" id="jornada"><button class="close" data-close>&#10005;</button><h3>Minha jornada</h3><div class="body">'+
      '<div class="block"><p class="lbl">Progresso da aula</p><div class="pbar"><i id="jpbar"></i></div>'+
      '<p class="stat"><span id="jpct">0</span><small>% lido &middot; <span id="jread">0</span>/<span id="jtotal">0</span> se&ccedil;&otilde;es</small></p></div>'+
      '<div class="block"><p class="lbl">Cart&otilde;es</p><p class="stat"><span id="jcards">0</span><small>cart&otilde;es &middot; <span id="jdue">0</span> para revisar hoje</small></p></div>'+
      '<div class="block"><p class="lbl">Meus grifos</p><div id="jmarks"></div></div>'+
      '<div class="btnrow"><button id="expbtn">exportar .json</button><button id="impbtn">importar</button><button id="resetbtn">zerar</button></div>'+
      '<input type="file" id="impfile" accept="application/json" style="display:none"></div></aside>'+
    '<aside class="panel" id="revisar"><button class="close" data-close>&#10005;</button><h3>Revisar</h3><div class="rev" id="revbody"></div></aside>');

  function $(id){ return document.getElementById(id); }
  function el(tag,cls){ var e=document.createElement(tag); if(cls) e.className=cls; return e; }

  // ---- seções ----
  var SECTIONS = [].slice.call(document.querySelectorAll('.step')).map(function(s){ return s.id; });
  var N = SECTIONS.length || 1;

  // ---- estado ----
  var state = load();
  function load(){ try{ var s=JSON.parse(localStorage.getItem(LS)); if(s&&typeof s==="object") return normalize(s); }catch(e){} return normalize({}); }
  function normalize(s){ s.prefs=s.prefs||{}; if(!s.prefs.theme) s.prefs.theme="dark"; s.read=s.read||{}; s.marks=s.marks||[]; s.cards=s.cards||{}; s.total=N; return s; }
  function save(){ state.total=N; try{ localStorage.setItem(LS, JSON.stringify(state)); }catch(e){} }

  // seed dos cartões do autor
  (function seed(){
    try{ var arr=JSON.parse(($('authored-cards')||{textContent:"[]"}).textContent);
      arr.forEach(function(c,i){ var id="a"+i; if(!state.cards[id]) state.cards[id]={front:c.front,back:c.back,due:today,interval:0,ease:2.5,reps:0,src:"autor"}; });
    }catch(e){}
    save();
  })();

  // ---- tema ----
  var THEMES=[["dark","escuro"],["papel","papel"],["sepia","sépia"]];
  var themeBtn=$('themebtn');
  function applyTheme(t){ document.documentElement.setAttribute('data-theme',t);
    var lbl=(THEMES.filter(function(x){return x[0]===t})[0]||THEMES[0])[1];
    if(themeBtn) themeBtn.textContent="tema: "+lbl; state.prefs.theme=t; save();
    try{ localStorage.setItem("v4:theme",t); }catch(e){}
  }
  if(themeBtn) themeBtn.addEventListener('click',function(){
    var i=0; for(var k=0;k<THEMES.length;k++){ if(THEMES[k][0]===state.prefs.theme){ i=k; break; } }
    applyTheme(THEMES[(i+1)%THEMES.length][0]);
  });
  var initTheme; try{ initTheme=localStorage.getItem("v4:theme"); }catch(e){}
  applyTheme(initTheme||state.prefs.theme||"dark");

  // ---- progresso + barra que ganha fundo ----
  var prog=$('prog'), topbar=document.querySelector('.bar');
  function onScroll(){ var h=document.documentElement, max=h.scrollHeight-h.clientHeight; prog.style.width=(max>0?(h.scrollTop/max*100):0)+"%"; if(topbar) topbar.classList.toggle('scrolled', h.scrollTop>40); }
  document.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // ---- trilho vivo ----
  var caps={};
  var figs=[].slice.call(document.querySelectorAll('.figstage .fig'));
  figs.forEach(function(f){ caps[f.getAttribute('data-fig')]=f.getAttribute('data-cap')||""; });
  var indWrap=$('ind'), inds=[];
  if(indWrap){ indWrap.innerHTML=''; figs.forEach(function(_,i){ var ii=el('i'); if(i===0) ii.className='on'; indWrap.appendChild(ii); }); inds=[].slice.call(indWrap.children); }
  var cap=$('cap'), curFig=null;
  function activate(n){ if(n===curFig) return; curFig=n;
    figs.forEach(function(f){ f.classList.toggle('on', f.getAttribute('data-fig')===n); });
    inds.forEach(function(i,ix){ i.classList.toggle('on', String(ix+1)===n); });
    if(cap) cap.innerHTML=caps[n]||""; }
  if(figs.length){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var f=e.target.getAttribute('data-fig'); if(f) activate(f); } }); },{rootMargin:"-45% 0px -45% 0px",threshold:0});
    document.querySelectorAll('.step').forEach(function(s){ io.observe(s); });
    if(caps["1"]&&cap) cap.innerHTML=caps["1"];
  }
  // clona figs do trilho para os slots mobile
  document.querySelectorAll('.mobfig').forEach(function(m){ var n=m.getAttribute('data-mobfig'); var src=document.querySelector('.figstage .fig[data-fig="'+n+'"] svg'); if(src) m.appendChild(src.cloneNode(true)); });

  // ---- marcar lido ----
  var pill=$('pill');
  function refreshRead(){
    var n=0; SECTIONS.forEach(function(id){ if(state.read[id]) n++; });
    if(pill) pill.textContent=n+"/"+N+" lido";
    document.querySelectorAll('.readbtn').forEach(function(b){ var id=b.getAttribute('data-read'); var done=!!state.read[id]; b.classList.toggle('done',done); b.textContent=done?"✓ lido":"marcar como lido"; });
  }
  document.querySelectorAll('.readbtn').forEach(function(b){ b.addEventListener('click',function(){ var id=b.getAttribute('data-read'); state.read[id]=!state.read[id]; save(); refreshRead(); }); });
  refreshRead();

  // ---- teste-se ----
  document.querySelectorAll('.quiz').forEach(function(q){
    var ans=q.getAttribute('data-answer'), fb=q.querySelector('.qfb'), done=false;
    q.querySelectorAll('.opt').forEach(function(o){ o.addEventListener('click',function(){
      if(done) return; done=true; var k=o.getAttribute('data-k');
      q.querySelectorAll('.opt').forEach(function(x){ if(x.getAttribute('data-k')===ans) x.classList.add('right'); });
      if(k===ans){ fb.textContent="Certo."; } else { o.classList.add('wrong'); fb.textContent="Quase. A resposta certa está destacada."; }
      fb.classList.add('on');
    }); });
  });

  // ---- grifo + flashcard ----
  var col=document.querySelector('.col'), tb=$('seltb'), pending=null;
  function closestBlock(node){ while(node && node!==col){ if(node.nodeType===1 && /^(P|LI|H2)$/.test(node.tagName)) return node; node=node.parentNode; } return null; }
  if(col){
    col.addEventListener('mouseup', function(){ setTimeout(function(){
      var sel=window.getSelection(); if(!sel || sel.rangeCount===0){ hideTB(); return; }
      var text=sel.toString().trim(); if(text.length<4 || text.length>160){ hideTB(); return; }
      var range=sel.getRangeAt(0), block=closestBlock(range.startContainer); if(!block){ hideTB(); return; }
      pending={ text:text, blockText:block.textContent };
      var r=range.getBoundingClientRect();
      tb.style.left=(window.scrollX + r.left + r.width/2 - 70)+"px";
      tb.style.top=(window.scrollY + r.top - 46)+"px"; tb.classList.add('on');
    },10); });
  }
  function hideTB(){ tb.classList.remove('on'); }
  document.addEventListener('scroll',hideTB,{passive:true});
  tb.querySelectorAll('button').forEach(function(b){ b.addEventListener('click',function(){
    if(!pending) return; var makeCard=b.getAttribute('data-a')==='card';
    wrapFirst(pending.text);
    state.marks.push({ id:"m"+Date.now(), text:pending.text, note:"" });
    if(makeCard){ var front=pending.blockText.replace(pending.text,"________"); state.cards["h"+Date.now()]={ front:"Complete: "+front, back:pending.text, due:today, interval:0, ease:2.5, reps:0, src:"grifo" }; }
    save(); hideTB(); window.getSelection().removeAllRanges(); refreshRail(); renderJornada();
  }); });
  function wrapFirst(text){
    if(!col) return false;
    var walker=document.createTreeWalker(col, NodeFilter.SHOW_TEXT, null), node;
    while((node=walker.nextNode())){
      if(node.parentNode && node.parentNode.classList && node.parentNode.classList.contains('hl')) continue;
      var idx=node.nodeValue.indexOf(text);
      if(idx>=0){ var range=document.createRange(); range.setStart(node,idx); range.setEnd(node,idx+text.length);
        var m=el('mark'); m.className='hl'; try{ range.surroundContents(m); }catch(e){ m.appendChild(range.extractContents()); range.insertNode(m); } return true; }
    }
    return false;
  }
  state.marks.forEach(function(m){ wrapFirst(m.text); });

  // ---- revisão espaçada ----
  function dueCount(){ var n=0; for(var id in state.cards){ if(state.cards[id].due<=today) n++; } return n; }
  function refreshRail(){ var r=$('revn'); if(r) r.textContent=dueCount(); }
  function grade(c,g){
    if(g==='again'){ c.reps=0; c.interval=0; c.due=today; }
    else { c.reps=(c.reps||0)+1;
      if(c.reps===1) c.interval=1; else if(c.reps===2) c.interval=3; else c.interval=Math.round((c.interval||1)*(c.ease||2.5));
      if(g==='easy'){ c.interval=Math.max(1,Math.round(c.interval*1.3)); c.ease=(c.ease||2.5)+0.15; }
      c.due=today+c.interval; }
  }
  var revQueue=[], revIdx=0;
  function openReview(){ revQueue=[]; for(var id in state.cards){ if(state.cards[id].due<=today) revQueue.push(id); } revIdx=0; renderReview(); openPanel('revisar'); }
  function renderReview(){
    var body=$('revbody');
    if(revIdx>=revQueue.length){ body.innerHTML='<p class="revempty">Nada para revisar agora. Volte amanhã &mdash; ou grife mais trechos.</p>'; refreshRail(); return; }
    var id=revQueue[revIdx], c=state.cards[id]; body.innerHTML='';
    var card=el('div','card'); var front=el('div','side'); front.textContent=c.front; card.appendChild(front);
    var back=el('div','side back'); back.textContent=c.back; back.style.display='none'; card.appendChild(back); body.appendChild(card);
    var showBtn=el('button','big'); showBtn.textContent='mostrar resposta'; body.appendChild(showBtn);
    var grades=el('div','grade'); grades.style.display='none';
    [['again','de novo'],['good','bom'],['easy','fácil']].forEach(function(g){ var gb=el('button',''); gb.textContent=g[1];
      gb.addEventListener('click',function(){ grade(c,g[0]); save(); revIdx++; renderReview(); renderJornada(); }); grades.appendChild(gb); });
    body.appendChild(grades);
    showBtn.addEventListener('click',function(){ back.style.display='block'; showBtn.style.display='none'; grades.style.display='grid'; });
    var pos=el('p',''); pos.style.cssText='text-align:center;color:var(--faint);font-family:var(--mono);font-size:11px;margin-top:14px'; pos.textContent=(revIdx+1)+' / '+revQueue.length; body.appendChild(pos);
  }

  // ---- jornada ----
  function renderJornada(){
    var n=0; SECTIONS.forEach(function(id){ if(state.read[id]) n++; });
    var pct=Math.round(n/N*100);
    $('jpbar').style.width=pct+"%"; $('jpct').textContent=pct; $('jread').textContent=n; $('jtotal').textContent=N;
    var total=0; for(var id in state.cards) total++;
    $('jcards').textContent=total; $('jdue').textContent=dueCount();
    var mk=$('jmarks');
    if(!state.marks.length){ mk.innerHTML='<p style="color:var(--muted);font-size:14px">Nenhum grifo ainda. Selecione um trecho no texto.</p>'; }
    else { mk.innerHTML=''; state.marks.slice().reverse().forEach(function(m){ var d=el('div','mk'); d.textContent='“'+m.text+'”'; mk.appendChild(d); }); }
    refreshRail();
  }

  // ---- painéis ----
  var scrim=$('scrim');
  function openPanel(id){ $(id).classList.add('on'); scrim.classList.add('on'); }
  function closePanels(){ document.querySelectorAll('.panel').forEach(function(p){ p.classList.remove('on'); }); scrim.classList.remove('on'); }
  scrim.addEventListener('click',closePanels);
  document.querySelectorAll('[data-close]').forEach(function(b){ b.addEventListener('click',closePanels); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ closePanels(); hideTB(); } });
  if($('jorbtn')) $('jorbtn').addEventListener('click',function(){ renderJornada(); openPanel('jornada'); });
  if($('revbtn')) $('revbtn').addEventListener('click',openReview);

  // ---- export / import / reset ----
  if($('expbtn')) $('expbtn').addEventListener('click',function(){ var blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); var a=el('a'); a.href=URL.createObjectURL(blob); a.download=(LS.replace(/[:\/]/g,'-'))+'.json'; a.click(); });
  if($('impbtn')) $('impbtn').addEventListener('click',function(){ $('impfile').click(); });
  if($('impfile')) $('impfile').addEventListener('change',function(e){ var f=e.target.files[0]; if(!f) return; var r=new FileReader();
    r.onload=function(){ try{ state=normalize(JSON.parse(r.result)); save(); location.reload(); }catch(err){ alert('Arquivo inválido.'); } }; r.readAsText(f); });
  if($('resetbtn')) $('resetbtn').addEventListener('click',function(){ if(!confirm('Zerar progresso, grifos e cartões desta aula?')) return; try{ localStorage.removeItem(LS); }catch(e){} location.reload(); });

  refreshRail();
})();
