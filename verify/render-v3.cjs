const PW='/home/nmaldaner/.npm/_npx/e41f203b7505f1fb/node_modules/playwright';
const {chromium}=require(PW);
(async()=>{let br;try{br=await chromium.launch({headless:true})}catch(e){br=await chromium.launch({headless:true,executablePath:require('os').homedir()+'/.cache/ms-playwright/chromium-1223/chrome-linux/chrome'})}
const f='file:///home/nmaldaner/projetos/formato-curso-inema/mockups/v3-prototipo.html';
// desktop topo
const c1=await br.newContext({viewport:{width:1280,height:1180},deviceScaleFactor:1.5});const p1=await c1.newPage();
await p1.goto(f,{waitUntil:'networkidle'});await p1.waitForTimeout(1300);
await p1.screenshot({path:'mockups/render-v3-top.png'});
// desktop segunda dobra (rolar pra ver sidenote/secao 1)
await p1.evaluate(()=>window.scrollBy(0,1100));await p1.waitForTimeout(500);
await p1.screenshot({path:'mockups/render-v3-mid.png'});
// mobile
const c2=await br.newContext({viewport:{width:390,height:880},isMobile:true,deviceScaleFactor:2});const p2=await c2.newPage();
await p2.goto(f,{waitUntil:'networkidle'});await p2.waitForTimeout(1300);
const ov=await p2.evaluate(()=>({hs:document.documentElement.scrollWidth>document.documentElement.clientWidth,sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}));
console.log('mobile overflow horizontal?',JSON.stringify(ov));
await p2.screenshot({path:'mockups/render-v3-mobile.png'});
await br.close();console.log('render v3 ok');})().catch(e=>{console.log('ERR',e.stack);process.exit(1)});
