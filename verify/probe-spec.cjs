const PW='/home/nmaldaner/.npm/_npx/e41f203b7505f1fb/node_modules/playwright';
const {chromium}=require(PW);
(async()=>{let b;try{b=await chromium.launch({headless:true})}catch(e){b=await chromium.launch({headless:true,executablePath:require('os').homedir()+'/.cache/ms-playwright/chromium-1223/chrome-linux/chrome'})}
const p=await(await b.newContext()).newPage();
await p.goto('http://127.0.0.1:8137/curso/trilha1/modulo-1-1.html',{waitUntil:'networkidle'});
await p.waitForTimeout(400);
const o=await p.evaluate(()=>{
  const body=document.body, h=document.documentElement;
  h.classList.remove('dark');
  const r={ htmlClass:h.className, bodyMatchesOverride: body.matches('html:not(.dark) .bg-dark-900'), bodyClasses: body.className };
  // priority de cada regra
  for(const ss of document.styleSheets){ let rs; try{rs=ss.cssRules}catch(e){continue;} if(!rs)continue;
    for(const rule of rs){ if(rule.selectorText==='.bg-dark-900'){ r.tw_priority=rule.style.getPropertyPriority('background-color'); r.tw_val=rule.style.backgroundColor; }
      if(rule.selectorText==='html:not(.dark) .bg-dark-900'){ r.ov_priority=rule.style.getPropertyPriority('background-color'); r.ov_val=rule.style.backgroundColor; } } }
  r.bodyBgAfterRemove=getComputedStyle(body).backgroundColor;
  // forca: existe style inline no body?
  r.bodyInlineStyle=body.getAttribute('style');
  return r;
});
console.log(JSON.stringify(o,null,2));
await b.close();})();
