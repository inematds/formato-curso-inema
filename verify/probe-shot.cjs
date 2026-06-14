const PW='/home/nmaldaner/.npm/_npx/e41f203b7505f1fb/node_modules/playwright';
const {chromium}=require(PW);
(async()=>{let b;try{b=await chromium.launch({headless:true})}catch(e){b=await chromium.launch({headless:true,executablePath:require('os').homedir()+'/.cache/ms-playwright/chromium-1223/chrome-linux/chrome'})}
const p=await(await b.newContext({viewport:{width:1100,height:800}})).newPage();
await p.goto('http://127.0.0.1:8137/curso/trilha1/modulo-1-1.html',{waitUntil:'networkidle'});
await p.waitForTimeout(500);
async function shot(theme){ await p.evaluate(t=>window.INEMA.setPref('theme',t),theme); await p.waitForTimeout(700); const bg=await p.evaluate(()=>getComputedStyle(document.body).backgroundColor); const tc=await p.evaluate(()=>getComputedStyle(document.querySelector('main')||document.body).color); await p.screenshot({path:`verify/theme-${theme}.png`}); return {theme,bg,tc}; }
const res=[];
for(const t of ['inema-dark','claro','sepia','contraste','foco']) res.push(await shot(t));
console.log(JSON.stringify(res,null,2));
await b.close();})().catch(e=>console.log('ERR',e.message));
