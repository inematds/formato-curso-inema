/* formato-curso v4 — curso em PÁGINA ÚNICA (trilha + aulas, um só estado).
   Robusto a preview que isola localStorage por página: aqui é tudo um documento. */
(function(){
  "use strict";
  var CK="v4hooks:curso";
  var today=Math.floor(Date.now()/86400000);

  document.body.insertAdjacentHTML('afterbegin',
    '<div class="grain"></div><div class="prog" id="prog"></div>'+
    '<div class="seltb" id="seltb"><button data-a="hl">grifar</button><button data-a="card">grifar + cartão</button></div>');
  document.body.insertAdjacentHTML('beforeend',
    '<div class="scrim" id="scrim"></div>'+
    '<aside class="panel" id="jornada"><button class="close" data-close>&#10005;</button><h3>Minha jornada</h3><div class="body">'+
      '<div class="block"><p class="lbl">Progresso do curso</p><div class="pbar"><i id="jpbar"></i></div>'+
      '<p class="stat"><span id="jpct">0</span><small>% lido &middot; <span id="jread">0</span>/<span id="jtotal">0</span> se&ccedil;&otilde;es</small></p></div>'+
      '<div class="block"><p class="lbl">Cart&otilde;es</p><p class="stat"><span id="jcards">0</span><small>cart&otilde;es &middot; <span id="jdue">0</span> para revisar hoje</small></p></div>'+
      '<div class="block"><p class="lbl">Meus grifos</p><div id="jmarks"></div></div>'+
      '<div class="btnrow"><button id="expbtn">exportar .json</button><button id="impbtn">importar</button><button id="resetbtn">zerar</button></div>'+
      '<input type="file" id="impfile" accept="application/json" style="display:none"></div></aside>'+
    '<aside class="panel" id="revisar"><button class="close" data-close>&#10005;</button><h3>Revisar</h3><div class="rev" id="revbody"></div></aside>'+
    '<div class="cedit" id="cedit"><button class="close" data-close>&#10005;</button><h3>Novo cart&atilde;o</h3>'+
      '<label>Frente (pergunta)</label><textarea id="cefront"></textarea>'+
      '<label>Verso (resposta)</label><textarea id="ceback"></textarea>'+
      '<p class="cehint">Reformule a frente como uma <b>pergunta</b> &mdash; recordar fixa mais do que reconhecer.</p>'+
      '<div class="cerow"><button id="cesave" class="big">salvar cart&atilde;o</button><button id="cecancel">cancelar</button></div></div>');

  function $(id){ return document.getElementById(id); }
  function el(t,c){ var e=document.createElement(t); if(c) e.className=c; return e; }

  var aulaEls={};
  document.querySelectorAll('.view[data-aula]').forEach(function(v){ aulaEls[v.getAttribute('data-aula')]=v; });
  var KEYS=Object.keys(aulaEls).sort();

  // ---- estado ----
  var state=load();
  function load(){ try{ var s=JSON.parse(localStorage.getItem(CK)); if(s&&typeof s==='object') return norm(s); }catch(e){} return norm({}); }
  function norm(s){
    s.prefs=s.prefs||{}; if(!s.prefs.theme) s.prefs.theme='dark'; s.aulas=s.aulas||{};
    KEYS.forEach(function(k){ var total=aulaEls[k].querySelectorAll('.step').length; var a=s.aulas[k]=s.aulas[k]||{}; a.read=a.read||{}; a.marks=a.marks||[]; a.cards=a.cards||{}; a.tasks=a.tasks||{}; a.total=total; });
    return s;
  }
  function save(){ try{ localStorage.setItem(CK, JSON.stringify(state)); }catch(e){} }

  KEYS.forEach(function(k){ var node=$('cards-'+k); if(!node) return;
    try{ JSON.parse(node.textContent).forEach(function(c,i){ var cs=state.aulas[k].cards, id='a'+i; if(!cs[id]) cs[id]={front:c.front,back:c.back,due:today,interval:0,ease:2.5,reps:0,src:'autor'}; }); }catch(e){}
  });
  save();

  // ---- tema ----
  var THEMES=[['dark','escuro'],['papel','papel'],['sepia','sépia']];
  var themeBtn=$('themebtn');
  function applyTheme(t){ document.documentElement.setAttribute('data-theme',t); var l=(THEMES.filter(function(x){return x[0]===t})[0]||THEMES[0])[1]; if(themeBtn) themeBtn.textContent='tema: '+l; state.prefs.theme=t; save(); }
  if(themeBtn) themeBtn.addEventListener('click',function(){ var i=0; for(var j=0;j<THEMES.length;j++){ if(THEMES[j][0]===state.prefs.theme){ i=j; break; } } applyTheme(THEMES[(i+1)%THEMES.length][0]); });
  applyTheme(state.prefs.theme);

  // ---- roteador ----
  var active=null;
  function show(route){
    if(!/^(trilha|aula-[1-9])$/.test(route)) route='trilha';
    document.querySelectorAll('.view').forEach(function(v){ v.classList.remove('active'); });
    var view=$(route==='trilha'?'v-trilha':'v-'+route); if(view) view.classList.add('active');
    window.scrollTo(0,0);
    var back=document.querySelector('.bar .back');
    if(route==='trilha'){ active='trilha'; renderTrilha(); if($('pill')) $('pill').style.display='none'; if(back) back.style.display='none'; }
    else { active=route.split('-')[1]; if($('pill')) $('pill').style.display=''; if(back) back.style.display=''; updatePill(); }
    document.querySelectorAll('.subnav a').forEach(function(a){});
    refreshRevn();
  }
  window.addEventListener('hashchange',function(){ show((location.hash||'#trilha').slice(1)); });

  // ---- trilha ----
  function readCount(k){ var a=state.aulas[k], n=0; for(var s in a.read){ if(a.read[s]) n++; } return n; }
  function renderTrilha(){
    KEYS.forEach(function(k){ var a=state.aulas[k], n=readCount(k), total=a.total||1;
      var bar=document.querySelector('.au[data-aula="'+k+'"] .prog i'), meta=document.querySelector('.au[data-aula="'+k+'"] .meta');
      if(bar) bar.style.transform='scaleX('+(total?n/total:0)+')';
      if(meta) meta.textContent = n>=total ? 'concluída ✓' : (n>0 ? 'em andamento · '+n+'/'+total : total+' seções · abrir →');
    });
  }

  function updatePill(){ if(active==='trilha'||!active) return; if($('pill')) $('pill').textContent=readCount(active)+'/'+state.aulas[active].total+' lido'; }

  // ---- marcar lido ----
  function aulaOf(node){ var v=node.closest('.view[data-aula]'); return v?v.getAttribute('data-aula'):null; }
  document.querySelectorAll('.readbtn').forEach(function(b){ b.addEventListener('click',function(){ var k=aulaOf(b); if(!k) return; var sec=b.getAttribute('data-read'); state.aulas[k].read[sec]=!state.aulas[k].read[sec]; save(); refreshReadBtns(); updatePill(); }); });
  function refreshReadBtns(){ document.querySelectorAll('.readbtn').forEach(function(b){ var k=aulaOf(b), sec=b.getAttribute('data-read'), done=k&&state.aulas[k].read[sec]; b.classList.toggle('done',!!done); b.textContent=done?'✓ lido':'marcar como lido'; }); }
  refreshReadBtns();

  // ---- pratique agora (checklist com estado + copiar código) ----
  function flashBtn(btn,msg){ var o=btn.getAttribute('data-o'); if(o===null){ o=btn.textContent; btn.setAttribute('data-o',o); } btn.textContent=msg; setTimeout(function(){ btn.textContent=btn.getAttribute('data-o'); },1400); }
  function execCopy(t,btn){ var ta=document.createElement('textarea'); ta.value=t; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); flashBtn(btn,'copiado ✓'); }catch(e){} document.body.removeChild(ta); }
  function copyText(t,btn){ try{ if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(t).then(function(){ flashBtn(btn,'copiado ✓'); },function(){ execCopy(t,btn); }); return; } }catch(e){} execCopy(t,btn); }
  document.querySelectorAll('.practice').forEach(function(pr){ var k=aulaOf(pr); if(!k) return; var tasks=state.aulas[k].tasks, boxes=[].slice.call(pr.querySelectorAll('input[data-ptask]')), cnt=pr.querySelector('.pcount');
    function refresh(){ var done=0; boxes.forEach(function(b){ var id=b.getAttribute('data-ptask'); b.checked=!!tasks[id]; if(tasks[id]) done++; }); if(cnt) cnt.textContent=done+'/'+boxes.length+' feito'; pr.classList.toggle('done', boxes.length>0&&done===boxes.length); }
    boxes.forEach(function(b){ b.addEventListener('change',function(){ tasks[b.getAttribute('data-ptask')]=b.checked; save(); refresh(); }); });
    var cp=pr.querySelector('.pcopy'), code=pr.querySelector('.pcode'); if(cp&&code) cp.addEventListener('click',function(){ copyText(code.textContent,cp); });
    refresh();
  });

  // ---- teste-se ----
  document.querySelectorAll('.quiz').forEach(function(q){ var ans=q.getAttribute('data-answer'), fb=q.querySelector('.qfb'), done=false;
    q.querySelectorAll('.opt').forEach(function(o){ o.addEventListener('click',function(){ if(done) return; done=true; var kk=o.getAttribute('data-k');
      q.querySelectorAll('.opt').forEach(function(x){ if(x.getAttribute('data-k')===ans) x.classList.add('right'); });
      if(kk===ans) fb.textContent='Certo.'; else { o.classList.add('wrong'); fb.textContent='Quase. A resposta certa está destacada.'; } fb.classList.add('on');
    }); }); });

  // ---- trilho vivo (IO global, escopo por view) ----
  document.querySelectorAll('.view[data-aula]').forEach(function(v){
    var figs=v.querySelectorAll('.figstage .fig'), ind=v.querySelector('.steps-ind');
    if(ind){ ind.innerHTML=''; figs.forEach(function(_,i){ var ii=el('i'); if(i===0) ii.className='on'; ind.appendChild(ii); }); }
    var cap=v.querySelector('.railcap'), f1=v.querySelector('.figstage .fig[data-fig="1"]'); if(cap&&f1) cap.innerHTML=f1.getAttribute('data-cap')||'';
    v.querySelectorAll('.mobfig').forEach(function(m){ var n=m.getAttribute('data-mobfig'); var src=v.querySelector('.figstage .fig[data-fig="'+n+'"] svg'); if(src&&!m.firstChild) m.appendChild(src.cloneNode(true)); });
  });
  function activateFor(step){ var v=step.closest('.view'); if(!v) return; var fign=step.getAttribute('data-fig'); if(!fign) return;
    v.querySelectorAll('.figstage .fig').forEach(function(f){ f.classList.toggle('on', f.getAttribute('data-fig')===fign); });
    var ind=v.querySelector('.steps-ind'); if(ind){ [].slice.call(ind.children).forEach(function(i,ix){ i.classList.toggle('on', String(ix+1)===fign); }); }
    var cap=v.querySelector('.railcap'); if(cap){ var fig=v.querySelector('.figstage .fig[data-fig="'+fign+'"]'); cap.innerHTML=fig?(fig.getAttribute('data-cap')||''):''; }
  }
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) activateFor(e.target); }); },{rootMargin:'-45% 0px -45% 0px',threshold:0});
  document.querySelectorAll('.view[data-aula] .step').forEach(function(s){ io.observe(s); });

  // ---- grifo + flashcard ----
  var tb=$('seltb'), pending=null;
  function closestBlock(node,col){ while(node&&node!==col){ if(node.nodeType===1&&/^(P|LI|H2)$/.test(node.tagName)) return node; node=node.parentNode; } return null; }
  document.addEventListener('mouseup',function(){ setTimeout(function(){
    var sel=window.getSelection(); if(!sel||sel.rangeCount===0){ hideTB(); return; }
    var text=sel.toString().trim(); if(text.length<4||text.length>160){ hideTB(); return; }
    var range=sel.getRangeAt(0), sc=range.startContainer, scEl=sc.nodeType===1?sc:sc.parentNode, col=scEl?scEl.closest('.col'):null;
    if(!col){ hideTB(); return; }
    var k=aulaOf(col), block=closestBlock(sc,col); if(!k||!block){ hideTB(); return; }
    pending={ text:text, blockText:block.textContent, aula:k, col:col };
    var r=range.getBoundingClientRect(); tb.style.left=(window.scrollX+r.left+r.width/2-70)+'px'; tb.style.top=(window.scrollY+r.top-46)+'px'; tb.classList.add('on');
  },10); });
  function hideTB(){ tb.classList.remove('on'); }
  document.addEventListener('scroll',hideTB,{passive:true});
  tb.querySelectorAll('button').forEach(function(b){ b.addEventListener('click',function(){ if(!pending) return; var makeCard=b.getAttribute('data-a')==='card', pend=pending;
    wrapFirst(pending.col,pending.text); state.aulas[pending.aula].marks.push({ id:'m'+Date.now(), text:pending.text });
    save(); hideTB(); window.getSelection().removeAllRanges(); refreshRevn();
    if(makeCard) openCardEditor(pend);
  }); });
  function wrapFirst(col,text){ var w=document.createTreeWalker(col,NodeFilter.SHOW_TEXT,null), node;
    while((node=w.nextNode())){ if(node.parentNode&&node.parentNode.classList&&node.parentNode.classList.contains('hl')) continue;
      var idx=node.nodeValue.indexOf(text); if(idx>=0){ var range=document.createRange(); range.setStart(node,idx); range.setEnd(node,idx+text.length);
        var m=el('mark'); m.className='hl'; try{ range.surroundContents(m); }catch(e){ m.appendChild(range.extractContents()); range.insertNode(m); } return; } } }
  KEYS.forEach(function(k){ var col=aulaEls[k].querySelector('.col'); if(col) state.aulas[k].marks.forEach(function(mk){ wrapFirst(col,mk.text); }); });

  // ---- revisão espaçada (todo o curso) ----
  function allDue(){ var arr=[]; KEYS.forEach(function(k){ var cs=state.aulas[k].cards; for(var id in cs){ if(cs[id].due<=today) arr.push({k:k,id:id}); } }); return arr; }
  function dueCount(){ return allDue().length; }
  function refreshRevn(){ if($('revn')) $('revn').textContent=dueCount(); }
  function grade(c,g){ if(g==='again'){ c.reps=0; c.interval=0; c.due=today; } else { c.reps=(c.reps||0)+1; if(c.reps===1) c.interval=1; else if(c.reps===2) c.interval=3; else c.interval=Math.round((c.interval||1)*(c.ease||2.5)); if(g==='easy'){ c.interval=Math.max(1,Math.round(c.interval*1.3)); c.ease=(c.ease||2.5)+0.15; } c.due=today+c.interval; } }
  var rq=[], ri=0;
  function openReview(){ rq=allDue(); ri=0; renderReview(); openPanel('revisar'); }
  function renderReview(){ var body=$('revbody'); if(ri>=rq.length){ body.innerHTML='<p class="revempty">Nada para revisar agora. Volte amanhã &mdash; ou grife mais trechos.</p>'; refreshRevn(); return; }
    var ref=rq[ri], c=state.aulas[ref.k].cards[ref.id]; body.innerHTML='';
    var card=el('div','card'), fr=el('div','side'); fr.textContent=c.front; card.appendChild(fr);
    var bk=el('div','side back'); bk.textContent=c.back; bk.style.display='none'; card.appendChild(bk); body.appendChild(card);
    var sb=el('button','big'); sb.textContent='mostrar resposta'; body.appendChild(sb);
    var gr=el('div','grade'); gr.style.display='none';
    [['again','de novo'],['good','bom'],['easy','fácil']].forEach(function(g){ var gb=el('button',''); gb.textContent=g[1]; gb.addEventListener('click',function(){ grade(c,g[0]); save(); ri++; renderReview(); }); gr.appendChild(gb); });
    body.appendChild(gr); sb.addEventListener('click',function(){ bk.style.display='block'; sb.style.display='none'; gr.style.display='grid'; });
    var pos=el('p',''); pos.style.cssText='text-align:center;color:var(--faint);font-family:var(--mono);font-size:11px;margin-top:14px'; pos.textContent=(ri+1)+' / '+rq.length; body.appendChild(pos);
  }

  // ---- jornada (curso) ----
  function renderJornada(){ var rd=0,tt=0,cards=0; KEYS.forEach(function(k){ rd+=readCount(k); tt+=state.aulas[k].total; var cs=state.aulas[k].cards; for(var id in cs) cards++; });
    var pct=tt?Math.round(rd/tt*100):0; $('jpbar').style.transform='scaleX('+(tt?rd/tt:0)+')'; $('jpct').textContent=pct; $('jread').textContent=rd; $('jtotal').textContent=tt; $('jcards').textContent=cards; $('jdue').textContent=dueCount();
    var mk=$('jmarks'), all=[]; KEYS.forEach(function(k){ state.aulas[k].marks.forEach(function(m){ all.push(m); }); });
    if(!all.length) mk.innerHTML='<p style="color:var(--muted);font-size:14px">Nenhum grifo ainda.</p>'; else { mk.innerHTML=''; all.slice().reverse().forEach(function(m){ var d=el('div','mk'); d.textContent='“'+m.text+'”'; mk.appendChild(d); }); }
  }

  // ---- painéis ----
  var scrim=$('scrim');
  function openPanel(id){ $(id).classList.add('on'); scrim.classList.add('on'); }
  function closePanels(){ document.querySelectorAll('.panel').forEach(function(p){ p.classList.remove('on'); }); if($('cedit')) $('cedit').classList.remove('on'); scrim.classList.remove('on'); }
  scrim.addEventListener('click',closePanels);
  document.querySelectorAll('[data-close]').forEach(function(b){ b.addEventListener('click',closePanels); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ closePanels(); hideTB(); } });
  if($('jorbtn')) $('jorbtn').addEventListener('click',function(){ renderJornada(); openPanel('jornada'); });
  if($('revbtn')) $('revbtn').addEventListener('click',openReview);

  // ---- editor de cartão (reformular o grifo em pergunta antes de salvar) ----
  var cePending=null;
  function openCardEditor(p){ cePending=p; var sug=(p.blockText||'').replace(p.text,'________'); if($('cefront')) $('cefront').value=sug; if($('ceback')) $('ceback').value=p.text; if($('cedit')){ $('cedit').classList.add('on'); scrim.classList.add('on'); } var cf=$('cefront'); if(cf) setTimeout(function(){ cf.focus(); },30); }
  if($('cesave')) $('cesave').addEventListener('click',function(){ if(!cePending) return; var f=($('cefront').value||'').trim(), bk=($('ceback').value||'').trim(); if(!f||!bk) return; state.aulas[cePending.aula].cards['h'+Date.now()]={ front:f, back:bk, due:today, interval:0, ease:2.5, reps:0, src:'grifo' }; save(); cePending=null; closePanels(); refreshRevn(); });
  if($('cecancel')) $('cecancel').addEventListener('click',closePanels);

  if($('expbtn')) $('expbtn').addEventListener('click',function(){ var b=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); var a=el('a'); a.href=URL.createObjectURL(b); a.download='curso-hooks.json'; a.click(); });
  if($('impbtn')) $('impbtn').addEventListener('click',function(){ $('impfile').click(); });
  if($('impfile')) $('impfile').addEventListener('change',function(e){ var f=e.target.files[0]; if(!f) return; var r=new FileReader(); r.onload=function(){ try{ state=norm(JSON.parse(r.result)); save(); location.reload(); }catch(err){ alert('Arquivo inválido.'); } }; r.readAsText(f); });
  if($('resetbtn')) $('resetbtn').addEventListener('click',function(){ if(!confirm('Zerar todo o progresso do curso?')) return; try{ localStorage.removeItem(CK); }catch(e){} location.reload(); });

  // ---- barra de progresso + fundo ----
  var prog=$('prog'), topbar=document.querySelector('.bar');
  function onScroll(){ var h=document.documentElement, max=h.scrollHeight-h.clientHeight; prog.style.transform='scaleX('+(max>0?(h.scrollTop/max):0)+')'; if(topbar) topbar.classList.toggle('scrolled', h.scrollTop>40); }
  document.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  show((location.hash||'#trilha').slice(1));
})();
