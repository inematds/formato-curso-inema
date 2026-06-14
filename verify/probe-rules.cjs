const PW='/home/nmaldaner/.npm/_npx/e41f203b7505f1fb/node_modules/playwright';
const {chromium}=require(PW);
(async()=>{let b;try{b=await chromium.launch({headless:true})}catch(e){b=await chromium.launch({headless:true,executablePath:require('os').homedir()+'/.cache/ms-playwright/chromium-1223/chrome-linux/chrome'})}
const p=await(await b.newContext()).newPage();
await p.goto('http://127.0.0.1:8137/curso/trilha1/modulo-1-1.html',{waitUntil:'networkidle'});
await p.waitForTimeout(400);
const rules=await p.evaluate(()=>{
  const hits=[];
  for(const ss of document.styleSheets){ let rs; try{rs=ss.cssRules}catch(e){hits.push({err:'CORS '+ss.href}); continue;} if(!rs)continue;
    for(const r of rs){ if(r.selectorText && /bg-dark-900(?![\\d\\\\])/.test(r.selectorText) && !r.selectorText.includes('/')){ hits.push({sel:r.selectorText, css:r.style.backgroundColor||r.cssText.slice(0,120), href:ss.href||'inline'}); } }
  }
  return hits;
});
console.log(JSON.stringify(rules,null,2));
await b.close();})();
