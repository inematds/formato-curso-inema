const PW='/home/nmaldaner/.npm/_npx/e41f203b7505f1fb/node_modules/playwright';
const {chromium}=require(PW);
const BASE='https://inematds.github.io/formato-curso-v2';
const MOD=BASE+'/demo/curso/trilha1/modulo-1-1.html';
function lum(rgb){const m=rgb.match(/\d+(\.\d+)?/g).map(Number);const f=c=>{c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4)};return 0.2126*f(m[0])+0.7152*f(m[1])+0.0722*f(m[2])}
function ratio(a,b){const L1=lum(a),L2=lum(b);return ((Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05)).toFixed(2)}
(async()=>{let br;try{br=await chromium.launch({headless:true})}catch(e){br=await chromium.launch({headless:true,executablePath:require('os').homedir()+'/.cache/ms-playwright/chromium-1223/chrome-linux/chrome'})}
// DESKTOP measurements
const ctx=await br.newContext({viewport:{width:1280,height:900}});const p=await ctx.newPage();
await p.goto(MOD,{waitUntil:'networkidle'});await p.waitForTimeout(700);
const M=await p.evaluate(()=>{
  const cs=el=>el?getComputedStyle(el):null;
  const prose=document.querySelector('.inema-prose');
  const body=document.body;
  const h1=document.querySelector('h1');const h2=document.querySelector('h2');const para=prose?prose.querySelector('p'):document.querySelector('p');
  const muted=document.querySelector('.text-neutral-400,[class*="text-muted"]')||document.querySelector('p');
  function px(el){const c=cs(el);return c?{fs:c.fontSize,lh:c.lineHeight,col:c.color,mw:c.maxWidth}:null}
  return {
    body:px(body), h1:px(h1), h2:px(h2), para:px(para),
    proseMaxWidth: prose?cs(prose).maxWidth:'(sem .inema-prose)',
    proseFs: prose?cs(prose).fontSize:null,
    bodyBg: cs(body).backgroundColor,
    paraColor: para?cs(para).color:null,
    navH: (document.querySelector('nav')||{}).offsetHeight,
    // contagem de itens no nav (densidade)
    navLinks: document.querySelectorAll('nav a, nav button').length,
  };
});
M.contrast_para_on_bg = ratio(M.paraColor, M.bodyBg);
console.log('=== DESKTOP (1280) modulo ===');
console.log(JSON.stringify(M,null,2));
await p.screenshot({path:'verify/crit-desktop-modulo.png',fullPage:false});
// scroll para o conteudo
await p.evaluate(()=>{const s=document.querySelectorAll('[data-inema-topic]')[0];if(s)s.scrollIntoView();window.scrollBy(0,-80)});
await p.waitForTimeout(400);
await p.screenshot({path:'verify/crit-desktop-conteudo.png'});

// MOBILE
const mctx=await br.newContext({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:2});const mp=await mctx.newPage();
await mp.goto(MOD,{waitUntil:'networkidle'});await mp.waitForTimeout(700);
const MM=await mp.evaluate(()=>{
  const nav=document.querySelector('nav');
  const doc=document.documentElement;
  return {
    horizontalScroll: doc.scrollWidth>doc.clientWidth, scrollW:doc.scrollWidth, clientW:doc.clientWidth,
    navOverflow: nav?nav.scrollWidth>nav.clientWidth:null, navScrollW:nav?nav.scrollWidth:null, navClientW:nav?nav.clientWidth:null,
    tocVisible: !!document.querySelector('[data-inema-toc]') && getComputedStyle(document.querySelector('[data-inema-toc]')).display!=='none',
  };
});
console.log('\n=== MOBILE (390) modulo ===');
console.log(JSON.stringify(MM,null,2));
await mp.screenshot({path:'verify/crit-mobile-modulo.png',fullPage:false});
await mp.goto(BASE+'/demo/index.html',{waitUntil:'networkidle'});await mp.waitForTimeout(500);
await mp.screenshot({path:'verify/crit-mobile-landing.png',fullPage:false});
await br.close();console.log('\nshots ok');})().catch(e=>{console.log('ERR',e.stack);process.exit(1)});
