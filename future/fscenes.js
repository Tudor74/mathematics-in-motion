/* The Future In Motion — data-driven scenes.
   Real data points (sourced, up to 2026) are solid; anything after the last data point is a projection you control in Try it.
   Each 2040 card is playful speculation, labelled likely / plausible / wildcard. */
const STAGES=FD.stages.map(s=>({id:s.id,name:s.name})).concat([{id:'2040',name:'2040'}]);
STAGES.unshift({id:'intro',name:'How to read the future'});
const SCENES=[];const add=o=>SCENES.push(o);
const CONF={likely:[C.green,'Likely'],plausible:[C.blue,'Plausible'],wildcard:[C.purple,'Wildcard']};
const chips=(key,list,cur,lab=x=>x)=>`<div class="row">${list.map((x,i)=>`<button type="button" class="chip" data-${key}="${i}" aria-pressed="${cur===i}">${esc(lab(x))}</button>`).join('')}</div>`;
const bindChips=(root,key,s,prop,re)=>root.querySelectorAll(`[data-${key}]`).forEach(b=>b.onclick=()=>{s[prop]=+b.dataset[key];root.querySelectorAll(`[data-${key}]`).forEach(x=>x.setAttribute('aria-pressed',String(+x.dataset[key]===s[prop])));re()});
function wrap(x,y,txt,chars,size,fill,o={}){const words=String(txt).split(' ');let line='',out='',n=0;for(const w of words){if((line+' '+w).trim().length>chars){out+=T(x,y+n*size*1.35,line.trim(),Object.assign({size,fill},o));n++;line=w}else line+=' '+w}if(line.trim())out+=T(x,y+n*size*1.35,line.trim(),Object.assign({size,fill},o));return out}
const fmtN=v=>{const a=Math.abs(v);if(a>=1e9)return (v/1e9).toFixed(1)+' bn';if(a>=1e6)return (v/1e6).toFixed(1)+' m';if(a>=1e4)return Math.round(v/1e3)+'k';if(a>=100)return Math.round(v).toLocaleString('en-GB');if(a>=10)return v.toFixed(1);return v.toFixed(2)};

/* Choose a projection model for each curve */
function model(t){const c=t.curve,pts=c.points.slice().sort((a,b)=>a[0]-b[0]),last=pts[pts.length-1],first=pts[0];const unit=(c.unit||'').toLowerCase();
 if(c.kind==='milestones'||pts.length<2&&c.kind!=='s-curve')return {type:'milestones',pts};
 if(t.id==='longevity'){const rate=(last[1]-first[1])/((last[0]-first[0])/10);return {type:'linear',pts,last,def:+rate.toFixed(2),min:0,max:5,step:.05,label:'Years gained per decade',fmt:v=>v.toFixed(2)+' years'}}
 const cap=/^%|% of/.test(unit)?100:unit.includes('countr')?195:null;
 if(cap){return {type:'logistic',pts,last,cap,def:last[1]>cap/2?Math.round(last[0]-3):2032,min:2010,max:2045,step:.5,label:'Year it reaches half of the maximum',fmt:v=>String(v)}}
 if(c.kind==='cost-decline'){const span=Math.max(1,last[0]-first[0]);const r=1-Math.pow(last[1]/first[1],1/span);return {type:'decline',pts,last,def:+clamp(r*100,0,25).toFixed(1),min:0,max:25,step:.5,label:'Price fall per year (%)',fmt:v=>v+'%'}}
 const span=Math.max(.5,last[0]-first[0]);let r=pts.length>1?Math.pow(last[1]/first[1],1/span)-1:.15;r=clamp(r,0,3);
 return {type:'growth',pts,last,def:+Math.min(r*100,150).toFixed(0),min:0,max:150,step:1,label:'Growth per year (%)',fmt:v=>v+'%'}}
function project(m,v,y){if(m.type==='growth')return m.last[1]*Math.pow(1+v/100,y-m.last[0]);if(m.type==='decline')return m.last[1]*Math.pow(1-v/100,y-m.last[0]);
 if(m.type==='linear')return m.last[1]+v*(y-m.last[0])/10;
 if(m.type==='logistic'){const L=m.cap,a=L/m.last[1]-1;const k=Math.log(a)/(v-m.last[0]);if(isFinite(k)&&k>0)return L/(1+Math.exp(-k*(y-v)));return L/(1+a*Math.exp(-.3*(y-m.last[0])))}return null}

function chart(t,m,v,o){const x0=70,x1=560,y0=212,y1=66;const ys=m.pts.map(p=>p[0]);const ya=Math.min(2010,Math.floor(Math.min(...ys))),yb=2040;const X=y=>x0+(y-ya)/(yb-ya)*(x1-x0);let g='';
 g+=`<rect x="${X(m.pts[m.pts.length-1][0])}" y="${y1-14}" width="${f2(x1-X(m.pts[m.pts.length-1][0]))}" height="${y0-y1+14}" fill="${C.purplep}" opacity=".45"/>`+T(X(2040)-6,y0-6,'projection',{size:10.5,anchor:'end',fill:C.purple});
 for(let y=Math.ceil(ya/5)*5;y<=2040;y+=5)g+=`<line x1="${f2(X(y))}" y1="${y0}" x2="${f2(X(y))}" y2="${y0+5}" stroke="${C.ink}"/>`+T(X(y),y0+18,String(y),{size:10.5,anchor:'middle',fill:C.muted});
 g+=`<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" stroke="${C.ink}"/>`;
 if(m.type==='milestones'){m.pts.forEach((p,i)=>{const x=X(p[0]);g+=`<line x1="${f2(x)}" y1="${y0}" x2="${f2(x)}" y2="${y0-30-i*30}" stroke="${C.blue}" stroke-width="2" opacity="${f2(o)}"/><circle cx="${f2(x)}" cy="${y0-30-i*30}" r="7" fill="${C.blue}" opacity="${f2(o)}"/>`+T(x>380?x-10:x+10,y0-26-i*30,t.curve.unit==='milestone number'?'milestone '+Math.round(p[1]):fmtN(p[1])+' '+t.curve.unit,{size:11,fill:C.ink,op:o,anchor:x>380?'end':'start'})});
  const [col]=CONF[t.confidence]||[C.purple];g+=`<circle cx="${X(2040)}" cy="${y1+20}" r="11" fill="${col}"/>`+T(X(2040)-14,y1+24,'2040 →',{size:11.5,anchor:'end',fill:col,weight:700});return g}
 const vals=m.pts.map(p=>p[1]);let proj=[];for(let y=m.last[0];y<=2040.01;y+=.25)proj.push([y,project(m,v,y)]);const all=vals.concat(proj.map(p=>p[1])).filter(x=>isFinite(x)&&x>0);
 const logScale=(m.type==='growth'||m.type==='decline')&&Math.max(...all)/Math.max(1e-9,Math.min(...all))>50;let lo=logScale?Math.min(...all)*.7:0,hi=Math.max(...all)*1.08;if(m.type==='logistic')hi=m.cap;if(m.type==='linear'){lo=Math.min(...all)-3;hi=Math.max(...all)+3}
 const Y=v=>logScale?y0-(Math.log(v/lo)/Math.log(hi/lo))*(y0-y1):y0-(v-lo)/(hi-lo)*(y0-y1);
 [lo+(hi-lo)*0,lo+(hi-lo)*.5,hi].forEach((tv,i)=>{const val=logScale?lo*Math.pow(hi/lo,i/2):tv;g+=T(x0-6,Y(val)+4,fmtN(val),{size:10.5,anchor:'end',fill:C.muted})+`<line x1="${x0}" y1="${f2(Y(val))}" x2="${x1}" y2="${f2(Y(val))}" stroke="${C.grid}" stroke-dasharray="2 4"/>`});
 if(logScale)g+=T(x0,y1-20,'log scale',{size:10,fill:C.muted});
 g+=`<path d="${m.pts.map((p,i)=>(i?'L':'M')+f2(X(p[0]))+' '+f2(Y(p[1]))).join('')}" fill="none" stroke="${C.blue}" stroke-width="3"/>`;m.pts.forEach(p=>{g+=`<circle cx="${f2(X(p[0]))}" cy="${f2(Y(p[1]))}" r="5" fill="${C.blue}"/>`});
 const shown=proj.filter(p=>p[0]<=m.last[0]+(2040-m.last[0])*o);if(shown.length>1)g+=`<path d="${shown.map((p,i)=>(i?'L':'M')+f2(X(p[0]))+' '+f2(Y(clamp(p[1],lo||1e-9,hi*5)))).join('')}" fill="none" stroke="${C.purple}" stroke-width="3" stroke-dasharray="7 5"/>`;
 if(o>=1){const v40=project(m,v,2040);g+=`<circle cx="${X(2040)}" cy="${f2(Y(clamp(v40,lo||1e-9,hi)))}" r="7" fill="${C.purple}"/>`+T(X(2040)-10,Y(clamp(v40,lo||1e-9,hi))-12,'2040: '+fmtN(v40),{size:12.5,anchor:'end',weight:700,fill:C.purple})}
 g+=T(x0,y1-30,t.curve.unit,{size:11.5,fill:C.muted,weight:600});return g}

/* Intro scene: exponential vs S-curve vs decline */
add({stage:'intro',term:'How to read the future',
 def:'Most technologies follow a few shapes. Early on, growth looks exponential — doubling and doubling again. Then it bends into an S-curve as the market fills. Prices often fall along a learning curve: a steady percentage cheaper each year. Spotting the shape, and where we are on it, is most of the art of forecasting.',
 ex:'In every scene, solid blue points are real data with a source. The dashed purple line is a projection, and in Try it you set the assumption that drives it. The 2040 card is a story, not a promise.',
 src:`<b>About this course:</b> figures checked against public sources as of ${esc(FD.meta.asOf)}. ${esc(FD.meta.disclaimer)}`,
 phases:['Exponential: the same percentage growth every year.','S-curve: fast in the middle, flat at the top.','Learning curve: prices fall a steady share each year.','Try it: compare the shapes.'],
 init:()=>({k:1}),anim:p=>({k:Math.min(2,Math.floor(p*3)),p}),
 draw(p,s){const x0=60,x1=560,y0=320,y1=70;let g=`<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" stroke="${C.ink}"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" stroke="${C.ink}"/>`+T(x1,y0+20,'time →',{size:11,anchor:'end',fill:C.muted});
  const fns=[[t=>Math.pow(2,t*6)/64,'exponential',C.coral],[t=>1/(1+Math.exp(-12*(t-.5))),'S-curve',C.blue],[t=>Math.pow(.82,t*10),'learning curve (price)',C.green]];
  fns.forEach(([f,n,col],i)=>{const on=i===s.k;let d='';for(let k=0;k<=100;k++){const t=k/100;d+=(k?'L':'M')+f2(x0+t*(x1-x0))+' '+f2(y0-clamp(f(t),0,1.02)*(y0-y1))}g+=`<path d="${d}" fill="none" stroke="${col}" stroke-width="${on?4:1.5}" opacity="${on?1:.35}"/>`+T([440,470,470][i],[110,160,290][i],n,{size:12,anchor:'end',fill:col,weight:on?700:400})});
  g+=wrap(300,40,['Doubling hides how fast the end arrives: half the growth happens in the last step.','Most adoption looks like this: slow, sudden, then saturated.','Solar panels and batteries have followed this shape for decades.'][s.k],80,12.5,C.ink,{anchor:'middle'});return g},
 tryUI:s=>({html:chips('k',['Exponential','S-curve','Learning curve'],s.k),bind(q,re,root){bindChips(root,'k',s,'k',re)}})
});

FD.techs.forEach(t=>{const m=model(t);const [col,lab]=CONF[t.confidence]||[C.purple,t.confidence];
 const nums=(t.numbers||[]).slice(0,3).map(n=>`${esc(n.label)}: <b>${esc(fmtN(n.value))}${n.unit?' '+esc(n.unit):''}</b> (${n.year}${n.source?`, <a href="${esc(n.source)}" rel="noopener">source</a>`:''})`).join('; ');
 add({stage:t.stage,term:t.name,
  def:t.today,ex:t.trend,
  src:(nums?nums+'. ':'')+(t.curve.note?esc(t.curve.note)+' ':'')+`<b>2040 call:</b> ${lab.toLowerCase()}.`,
  phases:['Where it stands today: the real data.','The shape of the trend so far.','Projected forward to 2040.','And a story of 2040. Try it: change the assumption, or flip to the wildcard.'],
  init:()=>({v:m.def,wild:false}),anim:p=>({v:m.def,wild:false,o:seg(p,.35,.75),card:seg(p,.75,.9),p}),
  draw(p,s){const o=s.o!=null?s.o:1,card=s.card!=null?s.card:1;let g=chart(t,m,s.v,o);
   if(card>0){const txt=s.wild?t.wildcard:t.prediction2040;const lines=Math.ceil(txt.length/88)+1;const h=36+lines*16;const c2=s.wild?C.purple:col;g+=`<g opacity="${f2(card)}"><rect x="20" y="246" width="560" height="${h}" rx="12" fill="#fff" stroke="${c2}" stroke-width="2.5"/>`+`<rect x="20" y="246" width="${s.wild?96:130}" height="24" rx="10" fill="${c2}"/>`+T(s.wild?68:85,263,s.wild?'WILDCARD':'2040 · '+lab,{size:11,anchor:'middle',fill:'#fff',weight:700})+wrap(34,290,txt,88,12,C.ink)+'</g>'}
   return g},
  tryUI:s=>({html:(m.type!=='milestones'?`<div class="row"><label>${esc(m.label)} <input type="range" id="pv" min="${m.min}" max="${m.max}" step="${m.step}" value="${s.v}"></label></div>`:'')+`<div class="row"><label><input type="checkbox" id="wd"${s.wild?' checked':''}> Show the wildcard scenario</label></div><p class="out" id="tout"></p>`,
   bind(q,re){const pv=q('#pv');if(pv)pv.oninput=e=>{s.v=+e.target.value;re()};q('#wd').onchange=e=>{s.wild=e.target.checked;re()}},
   out:s=>m.type==='milestones'?'Milestone points are events, not a smooth trend, so there is no curve to project. Flip to the wildcard to see another future.':`Your assumption: ${m.fmt(s.v)}. In 2040 that gives about ${fmtN(project(m,s.v,2040))} ${t.curve.unit}. The default was fitted to the real data.`})
 })});

/* Finale */
add({stage:'2040',term:'A day in 2040',
 def:'Put the predictions together and you get one possible day in 2040. Some of it is very likely; some is a wild guess. The point is not to be right, but to notice which changes are already under way, which depend on a breakthrough, and which depend on choices people have not made yet.',
 ex:'Filter by confidence. The “likely” future is mostly about energy, chips and electrification; the wildcards are about bodies, food and fusion.',
 src:`${esc(FD.meta.disclaimer)}`,
 phases:['Morning: energy and getting around.','Midday: work, machines and money.','Evening: health, food and the planet.','Try it: filter the day by confidence.'],
 init:()=>({f:0}),anim:p=>({f:0,n:Math.floor(p*FD.techs.length),p}),
 draw(p,s){const keys=['all','likely','plausible','wildcard'];const list=FD.techs.filter(t=>s.f===0||t.confidence===keys[s.f]);const n=s.n!=null?s.n:list.length;let g=T(20,30,'2040 — '+(s.f===0?'every prediction':keys[s.f]+' predictions only'),{size:15,weight:700});
  list.slice(0,Math.min(n,list.length)).slice(0,12).forEach((t,i)=>{const x=20+(i%2)*290,y=48+Math.floor(i/2)*54;const [col]=CONF[t.confidence];g+=`<rect x="${x}" y="${y}" width="280" height="48" rx="8" fill="#fff" stroke="${col}" stroke-width="1.6"/><rect x="${x}" y="${y}" width="6" height="48" rx="3" fill="${col}"/>`+T(x+14,y+17,t.name,{size:11.5,weight:700})+T(x+14,y+35,(t.prediction2040.split(/[.;]/)[0]).slice(0,52)+(t.prediction2040.length>52?'…':''),{size:10.5,fill:C.muted})});
  if(list.length>12)g+=T(300,376,`+ ${list.length-12} more`,{size:11,anchor:'middle',fill:C.muted});return g},
 tryUI:s=>({html:chips('f',['All','Likely','Plausible','Wildcard'],s.f),bind(q,re,root){bindChips(root,'f',s,'f',re)},out:s=>{const keys=['all','likely','plausible','wildcard'];return `${FD.techs.filter(t=>s.f===0||t.confidence===keys[s.f]).length} predictions shown.`}})
});
