const PW='/home/nmaldaner/.npm/_npx/e41f203b7505f1fb/node_modules/playwright';
const {chromium}=require(PW);
(async()=>{let b;try{b=await chromium.launch({headless:true})}catch(e){b=await chromium.launch({headless:true,executablePath:require('os').homedir()+'/.cache/ms-playwright/chromium-1223/chrome-linux/chrome'})}
const ctx=await b.newContext(); const p=await ctx.newPage();
await p.goto('http://127.0.0.1:8137/curso/trilha1/modulo-1-1.html',{waitUntil:'networkidle'});
await p.waitForTimeout(400);
await p.evaluate(()=>document.documentElement.classList.remove('dark'));
const cdp=await ctx.newCDPSession(p);
await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
const {root}=await cdp.send('DOM.getDocument',{depth:-1});
const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId, selector:'body'});
const m=await cdp.send('CSS.getMatchedStylesForNode',{nodeId});
const out=[];
for(const entry of (m.matchedCSSRules||[])){
  const r=entry.rule; const bc=(r.style.cssProperties||[]).find(c=>c.name==='background-color');
  if(bc) out.push({sel:r.selectorText && r.selectorText.text, layer: (r.layers||[]).map(l=>l.text).join('>')||'(none)', origin:r.origin, val:bc.value, important:bc.important||false});
}
console.log('REGRAS QUE SETAM background-color NO BODY (ordem = menos->mais prioritaria):');
console.log(JSON.stringify(out,null,2));
await b.close();})().catch(e=>{console.log('ERR',e.message)});
