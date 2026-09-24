/* formato-curso v6 — motor do curso em página única (trilha + aulas, um só estado).
   Diferenças para o v5: tema papel por padrão; barra com 3 controles (← trilha · Aa · menu);
   progresso automático por rolagem; cartões só entram na revisão quando a aula é concluída;
   sem modal de boas-vindas (uma dica de 1 linha); termos abrem definição inline;
   telas simuladas com alternância vago × bom; textos do motor em L (traduzíveis). */
(function(){
  "use strict";
  var L={
    lido:'lido', concluida:'concluída ✓', andamento:'em andamento', comecar:'começar →',
    continuar:'Continuar de onde parou', comecarCurso:'Começar pela aula 1', revisao:'Revisar',
    revisarN:function(n){ return 'revisar '+n; },
    aulasConcluidas:'aulas concluídas', faltam:'para terminar',
    dica:'Dica: o botão <b>Aa</b> aumenta a letra. Seu progresso fica salvo sozinho neste navegador.', entendi:'entendi',
    fechoTit:'Fechar a aula', fechoTxt:'Em uma frase: o que desta aula você vai usar primeiro no seu trabalho? (opcional, fica só com você)',
    concluir:'concluir aula', concluidaTit:'Aula concluída.',
    concluidaTxt:function(n){ return n? (n+' perguntas desta aula foram para o <b>revisar</b>. Elas voltam sozinhas nos próximos dias, na hora certa de lembrar.') : 'Seu progresso foi salvo.'; },
    revisarAgora:'revisar agora', refazer:'refazer a prática',
    mostrar:'mostrar resposta', deNovo:'errei', bom:'lembrei', facil:'fácil',
    nadaRevisar:'Nada para revisar agora. As perguntas voltam sozinhas nos próximos dias.',
    menu:'Menu', jornada:'Minha jornada', exercicios:'Práticas do curso', tema:'Tema', temas:{papel:'papel',escuro:'escuro',sepia:'sépia'},
    tamanho:'Tamanho da letra', entrelinha:'Espaço entre linhas', restaurar:'restaurar padrão',
    jProg:'Progresso', jCap:'O que você já consegue fazer', jCapVazio:'Ainda nenhuma aula concluída — tudo bem, uma de cada vez.',
    jTempo:'Tempo', investido:'investido', restante:'restante', jGrifos:'Seus grifos', jSemGrifo:'Nenhum grifo ainda. Selecione um trecho do texto para grifar.',
    jPend:function(n){ return n? ('sem pressa — '+n+' perguntas esperando por você') : 'nada esperando por você agora'; },
    jFim:'Você concluiu a trilha inteira. O que estava no papel agora está no seu trabalho.',
    exportar:'salvar meu progresso (.json)', importar:'trazer progresso salvo', zerar:'zerar tudo',
    zerarQ:'Apagar todo o seu progresso deste curso?', arqInv:'Arquivo inválido.',
    irAte:'ir até ela', resetar:'refazer', feito:'feita', pendente:'pendente',
    grifar:'grifar', grifarCartao:'grifar + pergunta', novoCartao:'Nova pergunta de revisão', frente:'Pergunta', verso:'Resposta',
    ceHint:'Escreva como <b>pergunta</b>: lembrar sozinho fixa mais do que reler.', salvar:'salvar', cancelar:'cancelar',
    copiar:'copiar', copiado:'copiado ✓', certo:'Certo.', quase:'Quase.', aCerta:'A certa está marcada.',
    exemplo:'Na prática', compare:'Toque para comparar os dois casos:'
  };
  var CK=((document.querySelector('meta[name="curso"]')||{}).content)||'v6:curso';
  var today=Math.floor(Date.now()/86400000);
  function $(id){ return document.getElementById(id); }
  function el(t,c,h){ var e=document.createElement(t); if(c) e.className=c; if(h!=null) e.innerHTML=h; return e; }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  // ---------- cromo injetado ----------
  document.body.insertAdjacentHTML('afterbegin','<div class="prog" id="prog"></div>'+
    '<div class="seltb" id="seltb"><button data-a="hl">'+L.grifar+'</button><button data-a="card">'+L.grifarCartao+'</button></div>');
  document.body.insertAdjacentHTML('beforeend',
    '<div class="scrim" id="scrim"></div>'+
    '<aside class="panel" id="menu" role="dialog" aria-modal="true" aria-label="'+L.menu+'"><button class="close" data-close aria-label="fechar">&#10005;</button><h3>'+L.menu+'</h3>'+
      '<div class="menu-list"><button id="m-rev">'+L.revisao+' <small id="m-revn"></small></button><button id="m-jor">'+L.jornada+'</button><button id="m-ex">'+L.exercicios+'</button><button id="m-tema">'+L.tema+' <small id="m-temal"></small></button></div></aside>'+
    '<aside class="panel" id="jornada" role="dialog" aria-modal="true" aria-label="'+L.jornada+'"><button class="close" data-close aria-label="fechar">&#10005;</button><h3>'+L.jornada+'</h3>'+
      '<div class="block"><p class="lbl">'+L.jProg+'</p><div class="pbar"><i id="jpbar"></i></div><p class="stat"><span id="jdone">0</span><small>/ <span id="jtot">0</span> '+L.aulasConcluidas+'</small></p><p class="muted" id="jpend"></p></div>'+
      '<div class="block"><p class="lbl">'+L.jCap+'</p><ul class="capacidades" id="jcap"></ul></div>'+
      '<div class="block"><p class="lbl">'+L.jTempo+'</p><p class="stat"><span id="jtinv">0</span><small>min '+L.investido+'</small></p><p class="stat"><span id="jtres">0</span><small>min '+L.restante+'</small></p></div>'+
      '<div class="block"><p class="lbl">'+L.jGrifos+'</p><div id="jmarks"></div></div>'+
      '<p class="block" id="jfim" hidden>'+L.jFim+'</p>'+
      '<div class="btnrow"><button id="expbtn">'+L.exportar+'</button><button id="impbtn">'+L.importar+'</button><button id="resetbtn">'+L.zerar+'</button></div>'+
      '<input type="file" id="impfile" accept="application/json" hidden></aside>'+
    '<aside class="panel" id="revisar" role="dialog" aria-modal="true" aria-label="'+L.revisao+'"><button class="close" data-close aria-label="fechar">&#10005;</button><h3>'+L.revisao+'</h3><div id="revbody"></div></aside>'+
    '<aside class="panel" id="exercicios" role="dialog" aria-modal="true" aria-label="'+L.exercicios+'"><button class="close" data-close aria-label="fechar">&#10005;</button><h3>'+L.exercicios+'</h3><div id="exlist"></div></aside>'+
    '<div class="prefs" id="prefs" role="dialog" aria-label="'+L.tamanho+'">'+
      '<div class="prow"><span>'+L.tamanho+'</span><span><button data-pf="size" data-d="-1" aria-label="menor">A&minus;</button> <button data-pf="size" data-d="1" aria-label="maior">A+</button></span></div>'+
      '<div class="prow"><span>'+L.entrelinha+'</span><span><button data-pf="leading" data-d="-1" aria-label="menos">&minus;</button> <button data-pf="leading" data-d="1" aria-label="mais">+</button></span></div>'+
      '<div class="prow"><span>'+L.tema+'</span><span><button data-th="papel">'+L.temas.papel+'</button> <button data-th="escuro">'+L.temas.escuro+'</button> <button data-th="sepia">'+L.temas.sepia+'</button></span></div>'+
      '<div class="prow"><button data-pf="reset" style="width:100%">'+L.restaurar+'</button></div></div>'+
    '<div class="cedit" id="cedit" role="dialog" aria-modal="true" aria-label="'+L.novoCartao+'"><button class="close" data-close aria-label="fechar">&#10005;</button><h3>'+L.novoCartao+'</h3>'+
      '<label for="cefront">'+L.frente+'</label><textarea id="cefront"></textarea><label for="ceback">'+L.verso+'</label><textarea id="ceback"></textarea>'+
      '<p class="cehint">'+L.ceHint+'</p><div class="row"><button class="big" id="cesave">'+L.salvar+'</button><button class="big sec" id="cecancel">'+L.cancelar+'</button></div></div>'+
    '<div id="routestatus" class="sronly" role="status" aria-live="polite"></div>');

  var aulaEls={};
  document.querySelectorAll('.view[data-aula]').forEach(function(v){ aulaEls[v.getAttribute('data-aula')]=v; });
  var KEYS=Object.keys(aulaEls).sort(function(a,b){ return a-b; });

  // ---------- estado ----------
  var state=load();
  function load(){ try{ var s=JSON.parse(localStorage.getItem(CK)); if(s&&typeof s==='object') return norm(s); }catch(e){} return norm({}); }
  function norm(s){
    s.v=6; s.prefs=s.prefs||{}; if(!s.prefs.theme) s.prefs.theme='papel'; if(!s.prefs.read) s.prefs.read={size:2,leading:2}; s.aulas=s.aulas||{};
    KEYS.forEach(function(k){ var a=s.aulas[k]=s.aulas[k]||{}; a.read=a.read||{}; a.cards=a.cards||{}; a.tasks=a.tasks||{}; a.marks=a.marks||[]; if(typeof a.reflect!=='string') a.reflect=''; a.done=!!a.done; });
    return s;
  }
  function save(){ try{ localStorage.setItem(CK,JSON.stringify(state)); }catch(e){} }
  function steps(k){ return [].slice.call(aulaEls[k].querySelectorAll('.step')); }
  function readCount(k){ var a=state.aulas[k],n=0; for(var s in a.read) if(a.read[s]) n++; return n; }
  function tempoMin(k){ var m=/([0-9]+)/.exec(aulaEls[k].getAttribute('data-tempo')||''); return m?parseInt(m[1],10):0; }

  // ---------- tema e leitura ----------
  var SIZES=[16,17,18,20,22,24], LEADS=[1.55,1.62,1.7,1.8,1.9];
  function clamp(i,max){ i=parseInt(i,10); if(isNaN(i)) i=2; return Math.max(0,Math.min(max,i)); }
  function applyPrefs(){ var r=state.prefs.read, d=document.documentElement; r.size=clamp(r.size,SIZES.length-1); r.leading=clamp(r.leading,LEADS.length-1);
    d.style.setProperty('--prose-size',SIZES[r.size]+'px'); d.style.setProperty('--prose-lh',LEADS[r.leading]); d.setAttribute('data-theme',state.prefs.theme);
    if($('m-temal')) $('m-temal').textContent=L.temas[state.prefs.theme]||'';
    document.querySelectorAll('#prefs [data-th]').forEach(function(b){ b.setAttribute('aria-pressed',b.getAttribute('data-th')===state.prefs.theme?'true':'false'); }); }
  applyPrefs();
  document.querySelectorAll('#prefs [data-pf]').forEach(function(b){ b.addEventListener('click',function(){ var pf=b.getAttribute('data-pf'); if(pf==='reset') state.prefs.read={size:2,leading:2}; else state.prefs.read[pf]+=parseInt(b.getAttribute('data-d'),10); save(); applyPrefs(); }); });
  document.querySelectorAll('#prefs [data-th]').forEach(function(b){ b.addEventListener('click',function(){ state.prefs.theme=b.getAttribute('data-th'); save(); applyPrefs(); }); });
  var prefsBtn=$('prefsbtn');
  if(prefsBtn) prefsBtn.addEventListener('click',function(e){ e.stopPropagation(); $('prefs').classList.toggle('on'); });
  document.addEventListener('click',function(e){ var p=$('prefs'); if(p.classList.contains('on')&&!p.contains(e.target)&&e.target!==prefsBtn) p.classList.remove('on'); });

  // ---------- painéis (foco preso e devolvido) ----------
  var scrim=$('scrim'), lastFocus=null;
  function openPanel(id){ closePanels(true); lastFocus=document.activeElement; var p=$(id); p.classList.add('on'); scrim.classList.add('on'); var c=p.querySelector('.close'); if(c) setTimeout(function(){ c.focus(); },30); }
  function closePanels(keep){ document.querySelectorAll('.panel.on,.cedit.on').forEach(function(p){ p.classList.remove('on'); }); $('prefs').classList.remove('on'); scrim.classList.remove('on'); if(!keep&&lastFocus&&lastFocus.focus){ try{ lastFocus.focus(); }catch(e){} } }
  scrim.addEventListener('click',function(){ closePanels(); });
  document.querySelectorAll('[data-close]').forEach(function(b){ b.addEventListener('click',function(){ closePanels(); }); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ closePanels(); hideTB(); } });
  if($('menubtn')) $('menubtn').addEventListener('click',function(){ refreshRevn(); openPanel('menu'); });
  $('m-rev').addEventListener('click',openReview);
  $('m-jor').addEventListener('click',function(){ renderJornada(); openPanel('jornada'); });
  $('m-ex').addEventListener('click',function(){ renderExercicios(); openPanel('exercicios'); });
  $('m-tema').addEventListener('click',function(){ var t=['papel','escuro','sepia'], i=t.indexOf(state.prefs.theme); state.prefs.theme=t[(i+1)%3]; save(); applyPrefs(); });

  // ---------- roteador ----------
  var active=null;
  function show(route){
    if(!/^(trilha|aula-[0-9]+)$/.test(route)||(route!=='trilha'&&!aulaEls[route.split('-')[1]])) route='trilha';
    document.querySelectorAll('.view').forEach(function(v){ v.classList.remove('active'); });
    var view=$(route==='trilha'?'v-trilha':'v-'+route); view.classList.add('active'); window.scrollTo(0,0);
    var h=view.querySelector('h1'); if(h){ h.setAttribute('tabindex','-1'); try{ h.focus({preventScroll:true}); }catch(e){} $('routestatus').textContent=h.textContent.replace(/\s+/g,' ').trim(); }
    var back=document.querySelector('.bar .back');
    if(route==='trilha'){ active=null; if(back) back.hidden=true; renderTrilha(); }
    else { active=route.split('-')[1]; if(back) back.hidden=false; showTip(active); state.last=active; save(); }
    refreshRevn(); onScroll();
  }
  window.addEventListener('hashchange',function(){ show((location.hash||'#trilha').slice(1)); });

  // ---------- trilha ----------
  function renderTrilha(){
    var done=0, rest=0;
    KEYS.forEach(function(k){ var a=state.aulas[k], n=readCount(k), tot=steps(k).length||1, card=document.querySelector('.au[data-aula="'+k+'"]');
      if(a.done) done++; else rest+=Math.round(tempoMin(k)*(1-Math.min(1,n/tot)));
      if(!card) return; var bar=card.querySelector('.bar2 i'), meta=card.querySelector('.meta'), t=tempoMin(k);
      if(bar) bar.style.transform='scaleX('+(a.done?1:Math.min(1,n/tot))+')';
      if(meta) meta.innerHTML=(t?t+' min · ':'')+(a.done?'<span class="ok">'+L.concluida+'</span>':(n>0?L.andamento:L.comecar));
    });
    var sc=document.querySelector('#v-trilha .statcards');
    if(sc) sc.innerHTML='<div class="statcard"><span class="sc-num">'+done+'/'+KEYS.length+'</span><span class="sc-lbl">'+L.aulasConcluidas+'</span></div><div class="statcard"><span class="sc-num">~'+rest+' min</span><span class="sc-lbl">'+L.faltam+'</span></div>';
    var cont=document.querySelector('#v-trilha .continuar');
    if(cont){ var nxt=KEYS.filter(function(k){ return !state.aulas[k].done; })[0];
      if(!nxt){ cont.hidden=true; } else { cont.hidden=false; var h=aulaEls[nxt].querySelector('h1'), started=KEYS.some(function(k){ return readCount(k)>0||state.aulas[k].done; });
        cont.href='#aula-'+nxt; cont.innerHTML='<span>'+(started?L.continuar:L.comecarCurso)+'<small>Aula '+nxt+' · '+esc(h?h.textContent.replace(/\s+/g,' ').trim():'')+'</small></span><span aria-hidden="true">→</span>'; } }
  }

  // ---------- dica de 1 linha (substitui o modal de boas-vindas) ----------
  function showTip(k){ if(state.prefs.tip) return; var v=aulaEls[k], hero=v.querySelector('.a-hero'); if(!hero||hero.querySelector('.dica')) return;
    var d=el('div','dica','<span>'+L.dica+'</span>'), b=el('button','',L.entendi); b.type='button'; d.appendChild(b);
    b.addEventListener('click',function(){ state.prefs.tip=true; save(); document.querySelectorAll('.dica').forEach(function(x){ x.remove(); }); });
    var kick=hero.querySelector('.kicker'); if(kick) kick.after(d); else hero.prepend(d); }

  // ---------- aula: kicker com tempo, rótulo dos exemplos ----------
  KEYS.forEach(function(k){ var v=aulaEls[k], kick=v.querySelector('.a-hero .kicker'), t=tempoMin(k);
    if(kick&&t&&!kick.querySelector('.tempo')) kick.insertAdjacentHTML('beforeend','<span class="tempo"> · '+t+' min</span>');
    v.querySelectorAll('p[data-ex]').forEach(function(p){ if(!p.getAttribute('data-exlbl')){ var w=p.getAttribute('data-ex'); p.setAttribute('data-exlbl',L.exemplo+' · '+w.charAt(0).toUpperCase()+w.slice(1)); } });
  });

  // ---------- progresso automático: o fim de cada step visto = lido ----------
  // (checagem direta na rolagem, sem IntersectionObserver: funciona mesmo onde o navegador não gera quadros)
  KEYS.forEach(function(k){ steps(k).forEach(function(s,i){ if(!s.getAttribute('data-read')&&!s.id) s.setAttribute('data-read','s'+(i+1)); var sent=el('span','sentinel'); sent.setAttribute('aria-hidden','true'); s.appendChild(sent); }); });
  var readTimer=null;
  function checkRead(){ readTimer=null; if(!active) return; var a=state.aulas[active], changed=false, h=window.innerHeight;
    steps(active).forEach(function(s){ var id=s.getAttribute('data-read')||s.id; if(a.read[id]) return; var sn=s.querySelector('.sentinel'); if(sn&&sn.getBoundingClientRect().top<h){ a.read[id]=true; changed=true; } });
    if(changed) save(); }
  function queueRead(){ if(!readTimer) readTimer=setTimeout(checkRead,150); }
  function aulaOf(n){ var v=n.closest&&n.closest('.view[data-aula]'); return v?v.getAttribute('data-aula'):null; }

  // ---------- termos: toque abre a definição inline ----------
  document.querySelectorAll('.gterm').forEach(function(g,i){ g.setAttribute('role','button'); g.setAttribute('tabindex','0'); g.setAttribute('aria-expanded','false');
    function tog(){ var p=g.closest('p,li')||g.parentNode, id='def-'+i, box=$(id);
      if(box){ box.remove(); g.setAttribute('aria-expanded','false'); return; }
      box=el('div','defbox','<b>'+esc(g.textContent)+':</b> '+esc(g.getAttribute('data-def')||'')); box.id=id; p.after(box); g.setAttribute('aria-expanded','true'); g.setAttribute('aria-controls',id); }
    g.addEventListener('click',tog); g.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); tog(); } });
  });

  // ---------- tela simulada: alternar casos (ex.: pedido vago × pedido completo) ----------
  document.querySelectorAll('.tela').forEach(function(t){ var casos=[].slice.call(t.querySelectorAll('.tela-caso')); if(casos.length<2) return;
    var bar=el('div','alterna'); bar.setAttribute('role','group'); bar.setAttribute('aria-label',L.compare); bar.appendChild(el('p','dica-alt',L.compare));
    casos.forEach(function(c,i){ var b=el('button','',esc(c.getAttribute('data-rotulo')||('caso '+(i+1)))); b.type='button'; b.setAttribute('aria-pressed',i===0?'true':'false'); if(i>0) c.hidden=true;
      b.addEventListener('click',function(){ casos.forEach(function(x,j){ x.hidden=j!==i; }); [].forEach.call(bar.querySelectorAll('button'),function(x,j){ x.setAttribute('aria-pressed',j===i?'true':'false'); }); });
      bar.appendChild(b); });
    var top=t.querySelector('.tela-top'); if(top) top.after(bar); else t.prepend(bar);
  });

  // ---------- teste-se ----------
  document.querySelectorAll('.quiz').forEach(function(q){ var ans=q.getAttribute('data-answer'), fb=q.querySelector('.qfb'), done=false;
    q.querySelectorAll('.opt').forEach(function(o){ o.addEventListener('click',function(){ if(done) return; done=true; var right=q.querySelector('.opt[data-k="'+ans+'"]'), rfb=right?(right.getAttribute('data-fb')||''):'';
      if(right) right.classList.add('right');
      if(o===right) fb.innerHTML='<b>'+L.certo+'</b> '+rfb; else { o.classList.add('wrong'); fb.innerHTML='<b>'+L.quase+'</b> '+(o.getAttribute('data-fb')?o.getAttribute('data-fb')+' ':'')+L.aCerta+(rfb?' '+rfb:''); }
      fb.classList.add('on'); }); }); });

  // ---------- copiar ----------
  function flash(b,m){ var o=b.getAttribute('data-o'); if(o===null){ o=b.textContent; b.setAttribute('data-o',o); } b.textContent=m; setTimeout(function(){ b.textContent=b.getAttribute('data-o'); },1400); }
  function copyText(t,b){ function fb(){ var ta=el('textarea'); ta.value=t; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); flash(b,L.copiado); }catch(e){} ta.remove(); }
    try{ if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(t).then(function(){ flash(b,L.copiado); },fb); return; } }catch(e){} fb(); }
  document.querySelectorAll('.view[data-aula] pre').forEach(function(pre){ if(pre.closest('.pcodewrap')) return; var w=el('div','codewrap'); pre.before(w); w.appendChild(pre); var b=el('button','pcopy',L.copiar); b.type='button'; w.prepend(b); b.addEventListener('click',function(){ copyText(pre.textContent,b); }); });

  // ---------- prática ----------
  var practiceRefresh={};
  document.querySelectorAll('.practice').forEach(function(pr){ var k=aulaOf(pr); if(!k) return; var tasks=state.aulas[k].tasks, boxes=[].slice.call(pr.querySelectorAll('input[data-ptask]')), cnt=pr.querySelector('.pcount');
    function refresh(){ var d=0; boxes.forEach(function(b){ var id=b.getAttribute('data-ptask'); b.checked=!!tasks[id]; if(tasks[id]) d++; }); if(cnt) cnt.textContent=d+'/'+boxes.length; pr.classList.toggle('done',boxes.length>0&&d===boxes.length); }
    boxes.forEach(function(b){ b.addEventListener('change',function(){ tasks[b.getAttribute('data-ptask')]=b.checked; save(); refresh(); }); });
    var cp=pr.querySelector('.pcopy'), code=pr.querySelector('.pcode'); if(cp&&code){ cp.textContent=L.copiar; cp.addEventListener('click',function(){ copyText(code.textContent,cp); }); }
    practiceRefresh[k]=refresh; refresh(); });
  function praticaDone(k){ var pr=aulaEls[k].querySelector('.practice'); if(!pr) return false; var bx=[].slice.call(pr.querySelectorAll('input[data-ptask]')); return bx.length>0&&bx.every(function(b){ return !!state.aulas[k].tasks[b.getAttribute('data-ptask')]; }); }
  function resetPractice(k,scroll){ var t=state.aulas[k].tasks; Object.keys(t).forEach(function(i){ t[i]=false; }); save(); if(practiceRefresh[k]) practiceRefresh[k](); if(scroll){ var pr=aulaEls[k].querySelector('.practice'); if(pr) pr.scrollIntoView({behavior:'smooth',block:'start'}); } }

  // ---------- fecho: 1 reflexão + concluir (semeia os cartões) ----------
  function authorCards(k){ var n=$('cards-'+k); if(!n) return []; try{ return JSON.parse(n.textContent)||[]; }catch(e){ return []; } }
  function seedCards(k){ var cs=state.aulas[k].cards, n=0; authorCards(k).forEach(function(c,i){ var id='a'+i; if(!cs[id]){ cs[id]={front:c.front,back:c.back,due:today,interval:0,ease:2.5,reps:0,src:'autor'}; } n++; }); return n; }
  KEYS.forEach(function(k){ var v=aulaEls[k], host=v.querySelector('.fecho')||v.querySelector('.aula'); if(!host) return;
    var box=el('section','fecho-motor'); box.setAttribute('aria-label',L.fechoTit); host.appendChild(box);
    function render(){ var a=state.aulas[k];
      if(!a.done){ box.innerHTML='<h3>'+L.fechoTit+'</h3><p>'+L.fechoTxt+'</p>'; var ta=el('textarea'); ta.value=a.reflect; ta.setAttribute('aria-label',L.fechoTxt); ta.addEventListener('input',function(){ a.reflect=ta.value; save(); }); box.appendChild(ta);
        var b=el('button','big',L.concluir); b.type='button'; b.addEventListener('click',function(){ steps(k).forEach(function(s){ a.read[s.getAttribute('data-read')||s.id]=true; }); a.done=true; seedCards(k); save(); refreshRevn(); render(); }); box.appendChild(b); }
      else { var n=authorCards(k).length; box.innerHTML='<h3 class="concluida">'+L.concluidaTit+'</h3><p>'+L.concluidaTxt(n)+'</p>'; var row=el('div','row');
        if(n){ var r=el('button','big',L.revisarAgora); r.type='button'; r.addEventListener('click',function(){ reviewAula(k); }); row.appendChild(r); }
        if(v.querySelector('.practice')){ var p=el('button','big sec',L.refazer); p.type='button'; p.addEventListener('click',function(){ resetPractice(k,true); }); row.appendChild(p); }
        box.appendChild(row); } }
    render(); });

  // ---------- grifo -> pergunta ----------
  var tb=$('seltb'), pending=null;
  function hideTB(){ tb.classList.remove('on'); }
  function onSel(){ setTimeout(function(){ var sel=window.getSelection(); if(!sel||!sel.rangeCount){ hideTB(); return; } var text=sel.toString().trim(); if(text.length<4||text.length>200){ hideTB(); return; }
    var r=sel.getRangeAt(0), sc=r.startContainer, scEl=sc.nodeType===1?sc:sc.parentNode, col=scEl&&scEl.closest('.aula'); if(!col){ hideTB(); return; }
    var k=aulaOf(col), block=scEl.closest('p,li,h2'); if(!k||!block){ hideTB(); return; }
    pending={text:text,blockText:block.textContent,aula:k,col:col}; var rc=r.getBoundingClientRect();
    tb.style.left=Math.max(8,window.scrollX+rc.left+rc.width/2-110)+'px'; tb.style.top=(window.scrollY+rc.top-54)+'px'; tb.classList.add('on'); },20); }
  document.addEventListener('mouseup',onSel); document.addEventListener('touchend',onSel);
  tb.querySelectorAll('button').forEach(function(b){ b.addEventListener('click',function(){ if(!pending) return; var p=pending; wrapFirst(p.col,p.text); state.aulas[p.aula].marks.push({id:'m'+Date.now(),text:p.text}); save(); hideTB(); window.getSelection().removeAllRanges(); if(b.getAttribute('data-a')==='card') openCardEditor(p); }); });
  function wrapFirst(col,text){ var w=document.createTreeWalker(col,NodeFilter.SHOW_TEXT,null), n;
    while((n=w.nextNode())){ if(n.parentNode.closest('.hl,.fecho-motor,script')) continue; var i=n.nodeValue.indexOf(text); if(i>=0){ var r=document.createRange(); r.setStart(n,i); r.setEnd(n,i+text.length); var m=el('mark','hl'); try{ r.surroundContents(m); }catch(e){ m.appendChild(r.extractContents()); r.insertNode(m); } return; } } }
  KEYS.forEach(function(k){ var col=aulaEls[k].querySelector('.aula'); if(col) state.aulas[k].marks.forEach(function(m){ wrapFirst(col,m.text); }); });
  var ceP=null;
  function openCardEditor(p){ ceP=p; $('cefront').value=(p.blockText||'').replace(p.text,'________'); $('ceback').value=p.text; openPanel('cedit'); }
  $('cesave').addEventListener('click',function(){ if(!ceP) return; var f=$('cefront').value.trim(), b=$('ceback').value.trim(); if(!f||!b) return; state.aulas[ceP.aula].cards['h'+Date.now()]={front:f,back:b,due:today+1,interval:1,ease:2.5,reps:0,src:'grifo'}; save(); ceP=null; closePanels(); refreshRevn(); });
  $('cecancel').addEventListener('click',function(){ closePanels(); });

  // ---------- revisão espaçada (só cartões de aulas concluídas ou criados pelo aluno) ----------
  function allDue(){ var arr=[]; KEYS.forEach(function(k){ var cs=state.aulas[k].cards; for(var id in cs) if(cs[id].due<=today) arr.push({k:k,id:id}); }); return arr; }
  function refreshRevn(){ var n=allDue().length, b=$('revbtn'); if(b){ b.hidden=n===0; b.textContent=L.revisarN(n>9?'9+':n); } if($('m-revn')) $('m-revn').textContent=n?(n>9?'9+':n):''; }
  if($('revbtn')) $('revbtn').addEventListener('click',openReview);
  function grade(c,g){ if(g==='again'){ c.reps=0; c.interval=0; c.due=today; } else { c.reps=(c.reps||0)+1; c.interval=c.reps===1?1:(c.reps===2?3:Math.round((c.interval||1)*(c.ease||2.5))); if(g==='easy'){ c.interval=Math.max(1,Math.round(c.interval*1.3)); c.ease=(c.ease||2.5)+0.15; } c.due=today+c.interval; } }
  var rq=[], ri=0;
  function openReview(){ rq=allDue(); ri=0; renderReview(); openPanel('revisar'); }
  function reviewAula(k){ rq=Object.keys(state.aulas[k].cards).map(function(id){ return {k:k,id:id}; }); ri=0; renderReview(); openPanel('revisar'); }
  function renderReview(){ var body=$('revbody'); if(ri>=rq.length){ body.innerHTML='<p class="muted">'+L.nadaRevisar+'</p>'; refreshRevn(); return; }
    var ref=rq[ri], c=state.aulas[ref.k].cards[ref.id]; body.innerHTML='';
    var card=el('div','card'), fr=el('div','side'); fr.textContent=c.front; card.appendChild(fr); var bk=el('div','side back'); bk.textContent=c.back; bk.hidden=true; card.appendChild(bk); body.appendChild(card);
    var sb=el('button','big',L.mostrar); sb.type='button'; body.appendChild(sb); var gr=el('div','grade'); gr.hidden=true;
    [['again',L.deNovo],['good',L.bom],['easy',L.facil]].forEach(function(g){ var b=el('button','',g[1]); b.type='button'; b.addEventListener('click',function(){ grade(c,g[0]); save(); ri++; renderReview(); }); gr.appendChild(b); });
    body.appendChild(gr); sb.addEventListener('click',function(){ bk.hidden=false; sb.hidden=true; gr.hidden=false; gr.querySelector('button').focus(); });
    body.appendChild(el('p','revpos',(ri+1)+' / '+rq.length)); }

  // ---------- jornada ----------
  function renderJornada(){ var done=KEYS.filter(function(k){ return state.aulas[k].done; });
    $('jdone').textContent=done.length; $('jtot').textContent=KEYS.length; $('jpbar').style.transform='scaleX('+(KEYS.length?done.length/KEYS.length:0)+')';
    var n=allDue().length; $('jpend').textContent=L.jPend(n>9?'9+':n);
    var cap=$('jcap'); cap.innerHTML=''; if(!done.length) cap.innerHTML='<li class="muted" style="list-style:none;margin-left:-20px">'+L.jCapVazio+'</li>';
    done.forEach(function(k){ var p=aulaEls[k].querySelector('.promise'); if(p){ var li=el('li'); li.textContent=p.textContent.trim().replace(/^(ao fim desta aula,? )?você (consegue|tem) /i,''); cap.appendChild(li); } });
    var inv=0,tot=0; KEYS.forEach(function(k){ var t=tempoMin(k), a=state.aulas[k], f=a.done?1:Math.min(1,readCount(k)/(steps(k).length||1)); tot+=t; inv+=Math.round(t*f); });
    $('jtinv').textContent='~'+inv; $('jtres').textContent='~'+Math.max(0,tot-inv); $('jfim').hidden=done.length!==KEYS.length;
    var mk=$('jmarks'), all=[]; KEYS.forEach(function(k){ state.aulas[k].marks.forEach(function(m){ all.push(m); }); });
    mk.innerHTML=all.length?'':'<p class="muted">'+L.jSemGrifo+'</p>'; all.slice().reverse().forEach(function(m){ var d=el('div','mk'); d.textContent='“'+m.text+'”'; mk.appendChild(d); }); }
  $('expbtn').addEventListener('click',function(){ var b=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}), a=el('a'); a.href=URL.createObjectURL(b); a.download='progresso-'+String(CK).replace(/[^a-z0-9-]+/gi,'-').toLowerCase()+'.json'; a.click(); });
  $('impbtn').addEventListener('click',function(){ $('impfile').click(); });
  $('impfile').addEventListener('change',function(e){ var f=e.target.files[0]; if(!f) return; var r=new FileReader(); r.onload=function(){ try{ var p=JSON.parse(r.result); if(!p||typeof p.aulas!=='object') throw 0; state=merge(state,p); save(); location.reload(); }catch(err){ alert(L.arqInv); } }; r.readAsText(f); });
  function merge(o,i){ var out=norm(JSON.parse(JSON.stringify(o))), imp=norm(JSON.parse(JSON.stringify(i)));
    KEYS.forEach(function(k){ var a=out.aulas[k], b=imp.aulas[k]; Object.keys(b.read).forEach(function(s){ if(b.read[s]) a.read[s]=true; }); if(b.done) a.done=true;
      b.marks.forEach(function(m){ if(!a.marks.some(function(x){ return x.id===m.id; })) a.marks.push(m); });
      Object.keys(b.cards).forEach(function(id){ if(!a.cards[id]||(b.cards[id].reps||0)>(a.cards[id].reps||0)) a.cards[id]=b.cards[id]; });
      Object.keys(b.tasks).forEach(function(id){ if(b.tasks[id]) a.tasks[id]=true; }); if(b.reflect&&!a.reflect) a.reflect=b.reflect; });
    return out; }
  $('resetbtn').addEventListener('click',function(){ if(!confirm(L.zerarQ)) return; try{ localStorage.removeItem(CK); }catch(e){} location.reload(); });

  // ---------- práticas do curso ----------
  function renderExercicios(){ var box=$('exlist'); box.innerHTML='';
    KEYS.forEach(function(k){ var pr=aulaEls[k].querySelector('.practice'); if(!pr) return; var h=pr.querySelector('.ph'), d=praticaDone(k), row=el('div','exrow');
      row.innerHTML='<div><b>Aula '+k+'</b> — '+esc(h?h.textContent.trim():'')+'<br><span class="'+(d?'done':'muted')+'">'+(d?L.feito:L.pendente)+'</span></div>';
      var act=el('div','btnrow'), go=el('button','',L.irAte), rs=el('button','',L.resetar); go.type=rs.type='button';
      go.addEventListener('click',function(){ closePanels(true); location.hash='aula-'+k; setTimeout(function(){ pr.scrollIntoView({block:'start'}); },60); });
      rs.addEventListener('click',function(){ resetPractice(k,false); renderExercicios(); }); act.appendChild(go); act.appendChild(rs); row.appendChild(act); box.appendChild(row); }); }

  // ---------- barra de progresso de leitura ----------
  var prog=$('prog'), topbar=document.querySelector('.bar');
  function onScroll(){ var h=document.documentElement, max=h.scrollHeight-h.clientHeight; prog.style.transform='scaleX('+(active&&max>0?h.scrollTop/max:0)+')'; if(topbar) topbar.classList.toggle('scrolled',h.scrollTop>20); hideTB(); queueRead(); }
  document.addEventListener('scroll',onScroll,{passive:true});

  show((location.hash||'#trilha').slice(1));
})();
