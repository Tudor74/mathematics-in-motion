/* Awais Rashid In Motion — one scene per paper, earliest to latest.
   Paper facts (titles, venues, years, co-authors, summaries) come from RD, verified against publisher and repository records.
   Diagrams and Try it interactions are illustrations of each paper's core idea, not reproductions of its data. */
const STAGES=[{id:'s1',name:'2000–2005 · Evolving databases, crosscutting aspects'},{id:'s2',name:'2009–2011 · Product lines'},{id:'s3',name:'2013–2016 · Cybercrime, privacy, requirements'},{id:'s4',name:'2017–2019 · Security in the real world'},{id:'s5',name:'2020–2023 · Developers, risk and harms'},{id:'s6',name:'2024–2026 · Today'}];
const ERA_COL={objdb:'#1772b7',aosd:'#2c776c',spl:'#7156a6',cybercrime:'#ad472a',humans:'#9a6200',devsec:'#b3367a',cps:'#3f6f8f',cybok:'#5a7d2a',harms:'#c45238'};
const SCENES=[];const add=o=>SCENES.push(o);
const chips=(key,list,cur,lab=x=>x)=>`<div class="row">${list.map((x,i)=>`<button type="button" class="chip" data-${key}="${i}" aria-pressed="${cur===i}">${esc(lab(x))}</button>`).join('')}</div>`;
const bindChips=(root,key,s,prop,re)=>root.querySelectorAll(`[data-${key}]`).forEach(b=>b.onclick=()=>{s[prop]=+b.dataset[key];root.querySelectorAll(`[data-${key}]`).forEach(x=>x.setAttribute('aria-pressed',String(+x.dataset[key]===s[prop])));re()});
function wrap(x,y,txt,chars,size,fill,o={}){const words=String(txt).split(' ');let line='',out='',n=0;for(const w of words){if((line+' '+w).trim().length>chars){out+=T(x,y+n*size*1.35,line.trim(),Object.assign({size,fill},o));n++;line=w}else line+=' '+w}if(line.trim())out+=T(x,y+n*size*1.35,line.trim(),Object.assign({size,fill},o));return out}
const box=(x,y,w,h,txt,o={})=>{const chars=o.chars||Math.max(6,Math.floor(w/((o.size||13)*.56)));const lines=Math.ceil(String(txt).length/chars);return `<g opacity="${f2(o.op==null?1:o.op)}"><rect x="${f2(x)}" y="${f2(y)}" width="${f2(w)}" height="${f2(h)}" rx="${o.r||9}" fill="${o.fill||'#fff'}" stroke="${o.stroke||C.line}" stroke-width="${o.sw||1.6}"/>${wrap(x+w/2,y+h/2+(o.size||13)*.36-(lines-1)*(o.size||13)*.67,txt,chars,o.size||13,o.tc||C.ink,{anchor:'middle',weight:o.weight||500})}</g>`};
const arrow=(x1,y1,x2,y2,col=C.ink,w=2,op=1,dash='')=>{const a=Math.atan2(y2-y1,x2-x1),h=8;return `<g opacity="${f2(op)}"><line x1="${f2(x1)}" y1="${f2(y1)}" x2="${f2(x2)}" y2="${f2(y2)}" stroke="${col}" stroke-width="${w}" ${dash?`stroke-dasharray="${dash}"`:''}/><path d="M${f2(x2)} ${f2(y2)} L${f2(x2-h*Math.cos(a-.4))} ${f2(y2-h*Math.sin(a-.4))} L${f2(x2-h*Math.cos(a+.4))} ${f2(y2-h*Math.sin(a+.4))} Z" fill="${col}"/></g>`};
function person(x,y,col,sc=1,op=1){return `<g opacity="${f2(op)}"><circle cx="${f2(x)}" cy="${f2(y-30*sc)}" r="${f2(13*sc)}" fill="${col}"/><path d="M${f2(x-20*sc)} ${f2(y+10*sc)} q${f2(20*sc)} ${f2(-46*sc)} ${f2(40*sc)} 0 z" fill="${col}"/></g>`}
const cyl=(x,y,w,h,col,lab)=>`<g><path d="M${x} ${y+10} v${h-20} a${w/2} 10 0 0 0 ${w} 0 v${-(h-20)}" fill="#fff" stroke="${col}" stroke-width="2"/><ellipse cx="${x+w/2}" cy="${y+10}" rx="${w/2}" ry="10" fill="#fff" stroke="${col}" stroke-width="2"/>${lab?T(x+w/2,y+h/2+10,lab,{size:12,anchor:'middle',weight:600}):''}</g>`;
function career(year,era){let g=`<line x1="30" y1="366" x2="570" y2="366" stroke="${C.grid}" stroke-width="6" stroke-linecap="round"/>`;const X=y=>30+(y-2000)/26*540;
 RD.eras.forEach(e=>{const m=String(e.years).match(/(\d{4})\D+(\d{4})/);if(!m)return;g+=`<line x1="${f2(X(+m[1]))}" y1="366" x2="${f2(X(+m[2])+3)}" y2="366" stroke="${ERA_COL[e.id]||C.muted}" stroke-width="${e.id===era?6:3}" opacity="${e.id===era?1:.35}"/>`});
 g+=`<circle cx="${f2(X(year))}" cy="366" r="7" fill="${ERA_COL[era]||C.ink}" stroke="#fff" stroke-width="2"/>`+T(30,356,'2000',{size:10,fill:C.muted})+T(570,356,'2026',{size:10,fill:C.muted,anchor:'end'});return g}
function paper(i,stage,short,cfg){const p=RD.papers[i];add(Object.assign({stage,term:short,
 def:p.summary,ex:'In the diagram: '+p.diagram,
 src:`<b>${esc(p.title)}</b>. ${esc(p.venue)}, ${p.year}. Awais Rashid ${esc(p.coauthors)}. <a href="${esc(p.source)}" rel="noopener">Source</a>.`,
 draw(pr,s){return T(20,24,String(p.year),{size:18,weight:700,fill:ERA_COL[p.era]})+T(70,24,p.venue.length>70?p.venue.slice(0,68)+'…':p.venue,{size:11.5,fill:C.muted})+cfg.d(pr,s)+career(p.year,p.era)}},cfg))}

/* 0 — the journey */
add({stage:'s1',term:'A research journey',
 def:()=>'',
 def:`Awais Rashid’s research runs from how software and databases are built to how people and societies are kept safe. It began with object databases that could evolve without breaking, moved through aspect-oriented software and product lines, then turned to cybercrime, critical infrastructure, developers, privacy and online harms.`,
 ex:'Each coloured band is a strand of work. The scenes that follow take one paper at a time, in date order, so you can watch the questions change.',
 src:`<b>${esc(RD.profile.name)}</b> — ${esc(RD.profile.current_role)} Previously: ${esc(RD.profile.previous)} Papers in this course were checked against repository and publisher records; see each scene’s source link.`,
 phases:['2000s: databases and aspects.','2009–2011: software product lines.','2013 onwards: cybercrime, critical infrastructure, humans and developers.','CyBOK and online harms, to 2026. Try it: pick a strand.'],
 init:()=>({k:-1}),anim:p=>({k:-1,p}),
 draw(p,s){const o=s.p!=null?p:1;const X=y=>200+(y-2000)/26*375;let g=T(20,30,'Awais Rashid: strands of research, 2000–2026',{size:15,weight:700});
  for(let y=2000;y<=2026;y+=5)g+=`<line x1="${f2(X(y))}" y1="46" x2="${f2(X(y))}" y2="336" stroke="${C.grid}" stroke-dasharray="2 4"/>`+T(X(y),350,String(y),{size:10.5,anchor:'middle',fill:C.muted});
  RD.eras.forEach((e,i)=>{const m=String(e.years).match(/(\d{4})\D+(\d{4})/);const y=58+i*31,a=+m[1],b=+m[2];const show=seg(o,i*.08,i*.08+.15),on=s.k<0||s.k===i;
   g+=T(192,y+16,e.name.length>30?e.name.slice(0,29)+'…':e.name,{size:11.5,anchor:'end',fill:on?C.ink:C.muted,weight:on?600:400,op:show})+`<rect x="${f2(X(a))}" y="${y+4}" width="${f2((X(b+1)-X(a))*show)}" height="18" rx="5" fill="${ERA_COL[e.id]}" opacity="${on?.85:.2}"/>`;
   RD.papers.forEach(pp=>{if(pp.era===e.id)g+=`<circle cx="${f2(X(pp.year)+5)}" cy="${y+13}" r="3.5" fill="#fff" opacity="${f2(show*(on?1:.3))}"/>`})});
  if(s.k>=0)g+=wrap(300,374,RD.eras[s.k].summary,90,11.5,C.ink,{anchor:'middle'});return g},
 tryUI:s=>({html:chips('e',RD.eras,s.k,e=>e.name),bind(q,re,root){bindChips(root,'e',s,'k',re)},out:s=>s.k<0?'':`${RD.papers.filter(p=>p.era===RD.eras[s.k].id).length} papers in this course from this strand.`})
});

/* 1 — object database evolution */
paper(0,'s1','Evolving object databases with aspects',{
 phases:['A class, Person v1, with stored objects.','The class evolves: Person v2 adds a field.','Without help, old objects no longer fit.','An adapter aspect reshapes them on the fly. Try it: switch the aspect.'],
 init:()=>({asp:true,change:0}),anim:p=>({asp:p>.65,change:0,p}),
 d(p,s){const o=s.p!=null?p:1;const ch=[['email','added'],['fullName','renamed from name']][s.change];
  let g=box(40,60,150,70,'Person v1: name, age',{stroke:C.blue})+box(410,60,150,70,`Person v2: ${s.change?'fullName':'name'}, age${s.change?'':', email'}`,{stroke:C.green,op:seg(o,.15,.3)})+arrow(195,95,405,95,C.ink,2,seg(o,.15,.3))+T(300,86,'schema evolves: '+ch[0]+' '+ch[1],{size:11.5,anchor:'middle',fill:C.muted,op:seg(o,.15,.3)});
  g+=cyl(60,190,110,110,C.blue,'stored v1 objects');const ok=s.asp;
  if(ok)g+=box(240,205,120,60,'adapter aspect',{fill:C.greenp,stroke:C.green,weight:700,op:seg(o,.6,.7)});
  for(let k=0;k<4;k++){const t=s.p!=null?clamp((p-.35)*2.5-k*.12,0,1):1;const x=lerp(170,ok?470:330,t),y=230+k*14-(ok?0:0);g+=`<circle cx="${f2(x)}" cy="${y}" r="7" fill="${t<1?C.blue:ok?C.green:C.coral}"/>`;if(!ok&&t>=1)g+=T(x+12,y+4,'✗ does not fit',{size:11,fill:C.coral})}
  if(ok)g+=box(440,200,120,70,'v2 objects, as needed',{stroke:C.green,op:seg(o,.75,.9)});return g},
 tryUI:s=>({html:`<div class="row"><label><input type="checkbox" id="as"${s.asp?' checked':''}> Adapter aspect on</label></div>`+chips('c',['Add a field','Rename a field'],s.change),bind(q,re,root){q('#as').onchange=e=>{s.asp=e.target.checked;re()};bindChips(root,'c',s,'change',re)}})
});
/* 2 — early aspects grid */
const REQ=['Pay toll','Register vehicle','Issue fine','Top up account'],CON=['Security','Response time','Compatibility'];
paper(1,'s1','Early aspects in requirements',{
 phases:['Requirements for a road-toll system.','Concerns such as security and response time.','One concern touches many requirements: it is crosscutting.','It is pulled out as a single aspect. Try it: tick the cells.'],
 init:()=>({m:[[1,1,0],[1,0,1],[1,1,0],[1,1,0]]}),anim:p=>({m:[[1,p>.4?1:0,0],[p>.3?1:0,0,1],[p>.35?1:0,p>.45?1:0,0],[p>.4?1:0,p>.5?1:0,0]],p}),
 d(p,s){let g='';const x0=170,y0=70,cw=95,rh=46;CON.forEach((c,j)=>{g+=T(x0+j*cw+cw/2,y0-8,c,{size:12,anchor:'middle',weight:700})});
  REQ.forEach((r,i)=>{g+=T(x0-10,y0+28+i*rh,r,{size:12.5,anchor:'end'});CON.forEach((c,j)=>{const on=s.m[i][j];g+=`<rect x="${x0+j*cw+4}" y="${y0+6+i*rh}" width="${cw-8}" height="${rh-10}" rx="6" fill="${on?C.greenp:'#fff'}" stroke="${on?C.green:C.grid}"/>`+(on?T(x0+j*cw+cw/2,y0+31+i*rh,'✓',{size:15,anchor:'middle',fill:C.green}):'')})});
  const cross=CON.map((c,j)=>s.m.filter(r=>r[j]).length>=2);let y=80;cross.forEach((c,j)=>{if(c){g+=box(470,y,110,44,CON[j]+' aspect',{fill:C.greenp,stroke:C.green,weight:700,size:12});y+=56}});
  g+=T(525,y+10,cross.some(x=>x)?'crosscutting → aspects':'no crosscutting concerns',{size:11,anchor:'middle',fill:C.muted});return g},
 tryUI:s=>({html:`<div class="row">${REQ.map((r,i)=>CON.map((c,j)=>`<label><input type="checkbox" data-c="${i},${j}"${s.m[i][j]?' checked':''}> ${esc(r)} × ${esc(c)}</label>`).join('')).join('')}</div>`,bind(q,re,root){root.querySelectorAll('[data-c]').forEach(x=>x.onchange=()=>{const [i,j]=x.dataset.c.split(',').map(Number);s.m[i][j]=x.checked?1:0;re()})},out:()=>'A concern that affects two or more requirements is crosscutting, and becomes an aspect.'})
});
/* 3 — composition and conflicts */
paper(2,'s1','Composing aspectual requirements',{
 phases:['Viewpoints, aspects and composition rules.','Two aspects claim the same requirement.','Conflict! Which concern wins?','Priorities resolve it. Try it: set the priorities.'],
 init:()=>({a:3,b:3}),anim:p=>({a:3,b:p<.7?3:5,p}),
 d(p,s){let g=box(40,70,150,60,'Viewpoints: driver, toll operator',{size:12})+box(225,70,150,60,'Aspects: security, response time',{size:12})+box(410,70,150,60,'Composition rules',{size:12});
  g+=box(200,180,200,60,'Requirement: vehicle passes the toll gate',{size:12.5,stroke:C.ink,weight:600});g+=arrow(110,135,230,180,C.blue)+arrow(490,135,370,180,C.coral);
  const conflict=s.a===s.b;g+=T(110,170,'Security: check every tag',{size:11.5,anchor:'middle',fill:C.blue})+T(490,170,'Response time: under 1 s',{size:11.5,anchor:'middle',fill:C.coral});
  g+=`<rect x="80" y="${330-s.a*14}" width="40" height="${s.a*14}" fill="${C.blue}"/><rect x="480" y="${330-s.b*14}" width="40" height="${s.b*14}" fill="${C.coral}"/>`+T(100,346,'priority '+s.a,{size:11,anchor:'middle'})+T(500,346,'priority '+s.b,{size:11,anchor:'middle'});
  g+=box(200,270,200,50,conflict?'⚠ conflict: equal priority':(s.a>s.b?'Security takes precedence':'Response time takes precedence'),{fill:conflict?C.coralp:C.greenp,stroke:conflict?C.coral:C.green,weight:700,size:12.5});return g},
 tryUI:s=>({html:`<div class="row"><label>Security priority <input type="range" id="pa" min="1" max="5" value="${s.a}"></label><label>Response-time priority <input type="range" id="pb" min="1" max="5" value="${s.b}"></label></div>`,bind(q,re){q('#pa').oninput=e=>{s.a=+e.target.value;re()};q('#pb').oninput=e=>{s.b=+e.target.value;re()}}})
});
/* 4 — persistence as an aspect */
paper(3,'s1','Persistence as an aspect',{
 phases:['An application with database calls scattered through it.','Every red dot is persistence code tangled with other logic.','Lift them all into one persistence aspect …','… woven back in at save and load. Try it: restart the app.'],
 init:()=>({asp:true,entries:3,restarted:false}),anim:p=>({asp:p>.5,entries:3,restarted:false,lift:seg(p,.45,.75),p}),
 d(p,s){let g='';const lift=s.lift!=null?s.lift:(s.asp?1:0);for(let i=0;i<4;i++){g+=`<rect x="${40+i*130}" y="80" width="110" height="150" rx="8" fill="#fff" stroke="${C.line}"/>`+T(95+i*130,100,['UI','Library','Search','Export'][i],{size:12,anchor:'middle',weight:600});for(let k=0;k<5;k++)g+=`<rect x="${52+i*130}" y="${112+k*22}" width="86" height="8" rx="3" fill="${C.grid}"/>`;
   [[0,1],[2,3],[1,4]].slice(0,2+(i%2)).forEach(([a,b],k)=>{const x=60+i*130+k*28,y0=116+a*22+k*18,y=lerp(y0,270,lift);g+=`<circle cx="${x}" cy="${f2(y)}" r="6" fill="${C.coral}"/>`})}
  if(lift>.9)g+=box(40,255,500,36,'persistence aspect — woven in at save and load',{fill:C.greenp,stroke:C.green,weight:700,size:12.5});
  if(s.p==null)g+=T(300,320,s.restarted?(s.asp?`after restart: ${s.entries} entries survive`:'after restart: entries lost — nothing persisted'):`${s.entries} bibliography entries in memory`,{size:13,anchor:'middle',weight:700,fill:s.restarted&&!s.asp?C.coral:C.ink});return g},
 tryUI:s=>({html:`<div class="row"><label><input type="checkbox" id="pa"${s.asp?' checked':''}> Persistence aspect woven in</label><button type="button" class="chip" id="add">Add an entry</button><button type="button" class="chip" id="rs">Simulate restart</button></div>`,bind(q,re){q('#pa').onchange=e=>{s.asp=e.target.checked;s.restarted=false;re()};q('#add').onclick=()=>{s.entries++;s.restarted=false;re()};q('#rs').onclick=()=>{s.restarted=true;if(!s.asp)s.entries=0;re()}}})
});
/* 5 — aspect-oriented database systems */
const DBF=['versioning','schema evolution','indexing','access control','persistent aspects'];
paper(4,'s1','Aspect-oriented database systems',{
 phases:['A database engine at the core.','Aspects inside the database: evolution, versioning.','Aspects stored by the database: persistent aspects.','The core stays small. Try it: plug features in.'],
 init:()=>({on:[true,true,false,false,true]}),anim:p=>({on:DBF.map((_,i)=>p>.2+i*.12),p}),
 d(p,s){let g=cyl(240,130,120,140,C.blue,'core engine');DBF.forEach((f,i)=>{const a=-Math.PI/2+i/DBF.length*TAU,x=300+Math.cos(a)*200,y=200+Math.sin(a)*120;const on=s.on[i];g+=box(x-62,y-20,124,40,f,{size:12,fill:on?C.greenp:'#fff',stroke:on?C.green:C.grid});if(on)g+=arrow(x-Math.cos(a)*62,y-Math.sin(a)*22,300+Math.cos(a)*75,200+Math.sin(a)*58,C.green,1.8)});
  g+=T(300,338,`${s.on.filter(x=>x).length} aspects plugged in · core code unchanged`,{size:13,anchor:'middle',weight:700,fill:C.green});return g},
 tryUI:s=>({html:`<div class="row">${DBF.map((f,i)=>`<button type="button" class="chip" data-f="${i}" aria-pressed="${s.on[i]}">${f}</button>`).join('')}</div>`,bind(q,re,root){root.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const i=+b.dataset.f;s.on[i]=!s.on[i];b.setAttribute('aria-pressed',String(s.on[i]));re()})}})
});
/* 6 — EA-Miner */
const CONCERN_WORDS={security:['secure','security','encrypt','authenticate','authorised','password'],logging:['log','logged','audit','record'],performance:['fast','quickly','second','seconds','response'],availability:['available','24/7','uptime','backup']};
const DEF_REQ='The driver registers a vehicle and the details are logged. Every payment must be secure and processed within one second. Fines are issued automatically and logged for audit. The system must be available 24/7 and staff must authenticate with a password.';
paper(5,'s1','EA-Miner: mining requirements for aspects',{
 phases:['A paragraph of requirements.','Words are tagged and compared.','Words for the same concern recur across sentences.','Candidate aspects emerge. Try it: paste your own requirements.'],
 init:()=>({txt:DEF_REQ}),anim:p=>({txt:DEF_REQ,p}),
 d(p,s){const o=s.p!=null?p:1;const sents=s.txt.split(/(?<=[.!?])\s+/).filter(x=>x.trim()).slice(0,6);let g='';const hits={};
  sents.forEach((st,i)=>{const y=70+i*34;let x=24;g+=`<rect x="20" y="${y-18}" width="560" height="28" rx="5" fill="#fff" stroke="${C.grid}"/>`;st.split(/\s+/).forEach(w=>{const lw=w.toLowerCase().replace(/[^a-z0-9/]/g,'');let c=null;for(const k in CONCERN_WORDS)if(CONCERN_WORDS[k].includes(lw))c=k;if(c){(hits[c]=hits[c]||new Set()).add(i)}const wl=w.length*6.4+4;if(x+wl<575){if(c&&o>.3)g+=`<rect x="${f2(x-2)}" y="${y-13}" width="${f2(wl)}" height="18" rx="3" fill="${{security:C.coralp,logging:C.purplep,performance:C.pale,availability:C.greenp}[c]}"/>`;g+=T(x,y,w,{size:11.5});x+=wl}})});
  let y=290;g+=T(20,y-6,'candidate crosscutting concerns:',{size:12,fill:C.muted,op:seg(o,.6,.7)});let x=20;Object.entries(hits).forEach(([k,set])=>{if(set.size>=2&&o>.7){g+=box(x,y,130,32,`${k} (${set.size} sentences)`,{size:11.5,fill:'#fff',stroke:C.green,weight:600});x+=140}});return g},
 tryUI:s=>({html:`<div class="row" style="width:100%"><textarea id="rq" rows="4" style="width:100%;font:inherit;padding:8px;border:1px solid #aec3cf;border-radius:8px">${esc(s.txt)}</textarea></div><p class="out">A toy keyword miner, far simpler than EA-Miner’s natural-language processing: it only flags security, logging, performance and availability words that recur across sentences.</p>`,bind(q,re){q('#rq').oninput=e=>{s.txt=e.target.value;re()}}})
});
/* 7 — VML* */
const PHONE=[['Calls',true,true],['Camera',false,true],['GPS',false,false],['Music player',false,true]];
paper(6,'s2','VML*: languages for variability',{
 phases:['A feature tree for a family of phones.','Calls are mandatory; camera, GPS and music are optional.','Each choice triggers actions that edit the architecture model.','One concrete product results. Try it: choose features.'],
 init:()=>({f:PHONE.map(x=>x[2])}),anim:p=>({f:PHONE.map((x,i)=>x[1]||p>.3+i*.15),p}),
 d(p,s){let g=box(90,60,120,36,'Phone',{weight:700});PHONE.forEach(([n,mand],i)=>{const x=20+i*72,on=s.f[i];g+=`<line x1="150" y1="96" x2="${x+30}" y2="150" stroke="${C.ink}"/><circle cx="${x+30}" cy="150" r="5" fill="${mand?C.ink:'#fff'}" stroke="${C.ink}"/>`+box(x,156,64,34,n,{size:10.5,fill:on?C.purplep:'#fff',stroke:on?C.purple:C.grid})});
  g+=T(150,210,'● mandatory  ○ optional',{size:11,anchor:'middle',fill:C.muted});g+=`<rect x="320" y="60" width="260" height="270" rx="10" fill="#fff" stroke="${C.purple}" stroke-width="2"/>`+T(450,82,'architecture model',{size:12,anchor:'middle',weight:700});
  const comps=[['Telephony core',0],['Camera driver',1],['Image store',1],['GPS module',2],['Maps',2],['Audio codec',3],['Playlist manager',3]];let y=96;comps.forEach(([c,k])=>{if(s.f[k]){g+=box(340,y,220,26,c,{size:11.5,fill:C.purplep,stroke:C.purple});y+=32}});
  g+=arrow(220,175,315,175,C.purple,2);return g},
 tryUI:s=>({html:`<div class="row">${PHONE.map(([n,m],i)=>`<label><input type="checkbox" data-i="${i}"${s.f[i]?' checked':''}${m?' disabled':''}> ${n}${m?' (mandatory)':''}</label>`).join('')}</div>`,bind(q,re,root){root.querySelectorAll('[data-i]').forEach(x=>x.onchange=()=>{s.f[+x.dataset.i]=x.checked;re()})},out:s=>`This product line can make ${Math.pow(2,PHONE.filter(x=>!x[1]).length)} different phones; you picked one.`})
});
/* 8 — AMPLE */
const STAGES_A=['Requirements','Architecture','Design models','Code'];const FEAT=[['Camera',C.blue],['GPS',C.green],['Music',C.coral]];
paper(7,'s2','AMPLE: product lines end to end',{
 phases:['Stages from requirements to code.','Variation points at every stage.','Trace links thread each feature through all of them.','Try it: follow one feature end to end.'],
 init:()=>({k:0}),anim:p=>({k:Math.min(2,Math.floor(p*3)),p}),
 d(p,s){let g='';STAGES_A.forEach((st,i)=>{const x=30+i*140;g+=`<rect x="${x}" y="60" width="120" height="260" rx="10" fill="#fff" stroke="${C.line}"/>`+T(x+60,82,st,{size:12,anchor:'middle',weight:700})});
  FEAT.forEach(([f,col],k)=>{const on=k===s.k;let prev=null;STAGES_A.forEach((st,i)=>{const x=90+i*140,y=120+k*70+(i%2)*14;g+=`<rect x="${x-44}" y="${y-14}" width="88" height="28" rx="6" fill="${on?col:'#fff'}" stroke="${col}" opacity="${on?1:.45}"/>`+T(x,y+4,f,{size:11,anchor:'middle',fill:on?'#fff':col});if(prev)g+=`<line x1="${prev[0]+44}" y1="${prev[1]}" x2="${x-44}" y2="${y}" stroke="${col}" stroke-width="${on?3:1}" opacity="${on?1:.4}" ${on?'':'stroke-dasharray="4 4"'}/>`;prev=[x,y]})});return g},
 tryUI:s=>({html:chips('a',FEAT,s.k,x=>x[0]),bind(q,re,root){bindChips(root,'a',s,'k',re)}})
});
/* 9 — digital personas */
const MSGS=[['user_a','hey!! u coming 2nite?? lol'],['DarkStar','Good evening. I would prefer to meet on Thursday.'],['kitty22','omg!! u r so funny lol'],['m.jones','Good evening — I would prefer Friday, if possible.']];
const feat=m=>[(m.match(/!/g)||[]).length,(m.match(/\bu\b|\br\b|2nite|lol|omg/gi)||[]).length,m===m.toLowerCase()?1:0,(m.match(/\bwould prefer\b|Good evening/g)||[]).length,(m.match(/[.,—]/g)||[]).length];
const cos=(a,b)=>{const d=a.reduce((m,x,i)=>m+x*b[i],0),n=Math.sqrt(a.reduce((m,x)=>m+x*x,0)*b.reduce((m,x)=>m+x*x,0));return n?d/n:0};
paper(8,'s3','Who am I? Digital personas',{
 phases:['Four online personas, chatting.','Each message leaves a style fingerprint: punctuation, spelling, phrasing.','Fingerprints are compared.','Personas with matching styles link to one hidden author. Try it: guess, then reveal.'],
 init:()=>({guess:-1,reveal:false}),anim:p=>({guess:-1,reveal:p>.6,p}),
 d(p,s){let g='';MSGS.forEach(([n,m],i)=>{const y=62+i*62;g+=person(46,y+38,[C.blue,C.green,C.coral,C.purple][i],.55)+box(80,y+4,300,44,m,{size:11.5,chars:48})+T(80,y,n,{size:11,fill:C.muted,weight:600})});
  if(s.reveal){const F=MSGS.map(([n,m])=>feat(m));for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){const c=cos(F[i],F[j]);if(c>.8)g+=`<path d="M380 ${88+i*62} Q${440+((j-i)*20)} ${(88+i*62+88+j*62)/2} 380 ${88+j*62}" fill="none" stroke="${C.coral}" stroke-width="3"/>`+T(470,(88+i*62+88+j*62)/2+4,'similarity '+c.toFixed(2),{size:11.5,fill:C.coral,weight:700})}}
  g+=T(400,330,'Illustrative messages; the Isis toolkit used much richer language analysis.',{size:10.5,anchor:'middle',fill:C.muted});return g},
 tryUI:s=>({html:chips('g',['user_a + kitty22','DarkStar + m.jones','user_a + DarkStar','kitty22 + m.jones'],s.guess)+`<div class="row"><button type="button" class="chip" id="rv">Reveal similarity</button></div><p class="out" id="tout"></p>`,bind(q,re,root){bindChips(root,'g',s,'guess',re);q('#rv').onclick=()=>{s.reveal=true;re()}},out:s=>s.guess<0?'Which two personas might be the same author?':s.reveal?([0,1].includes(s.guess)?'Your guess matches a high-similarity pair.':'Those two styles differ.'):'Now reveal the similarity scores.'})
});
/* 10 — social network privacy */
const POL=[['We let you control who sees your posts',1],['We may share data with partners',0],['You can download your data',1],['We use your activity to personalise ads',0],['Third-party apps may access your profile',0],['We keep data as long as necessary',0]];
paper(9,'s3','Privacy: from policy to controls',{
 phases:['Privacy-policy statements on the left.','Privacy controls on the right.','Draw the links: which promises can users act on?','Most statements have no matching control. Try it: check each one.'],
 init:()=>({k:-1}),anim:p=>({k:-1,p}),
 d(p,s){const o=s.p!=null?p:1;let g='';POL.forEach(([t,m],i)=>{const y=62+i*44;g+=box(20,y,280,36,t,{size:11.5,stroke:i===s.k?C.ink:C.line,weight:i===s.k?700:500})});['Post audience','Download my data','Ad preferences (limited)'].forEach((c,j)=>{g+=box(420,90+j*80,160,40,c,{size:11.5,fill:C.pale,stroke:C.blue})});
  POL.forEach(([t,m],i)=>{const y=80+i*44;const show=seg(o,.4+i*.06,.5+i*.06);if(m)g+=`<line x1="300" y1="${y}" x2="420" y2="${i===0?110:190}" stroke="${C.green}" stroke-width="2.5" opacity="${f2(show)}"/>`;else g+=T(318,y+4,'— no control',{size:11,fill:C.coral,op:show})});
  g+=T(300,340,`${POL.filter(x=>x[1]).length} of ${POL.length} statements map to a control (illustrative policy)`,{size:12.5,anchor:'middle',weight:700});return g},
 tryUI:s=>({html:chips('p',POL,s.k,x=>x[0].slice(0,32)+'…'),bind(q,re,root){bindChips(root,'p',s,'k',re)},out:s=>s.k<0?'':POL[s.k][1]?'A user can act on this one.':'Nothing in the settings lets a user act on this statement.'})
});
/* 11 — iCOP */
paper(10,'s3','iCOP: finding new material, live',{
 phases:['Files stream across a peer-to-peer network.','Hash matching catches only files already known.','New material slips through.','A second, pattern-based filter flags it for human review. Try it: set the threshold.'],
 init:()=>({th:.6,cls:true}),anim:p=>({th:.6,cls:p>.6,p}),
 d(p,s){const files=[];for(let i=0;i<24;i++){const r=(Math.sin(i*12.9898)*43758.5453)%1,rr=Math.abs(r);files.push({kind:i%6===0?'known':i%5===0?'new':'benign',score:i%6===0?.95:i%5===0?.55+rr*.4:rr*.7})}
  let g=T(30,62,'network stream (abstract dummy files)',{size:11.5,fill:C.muted});let hashC=0,clsC=0,miss=0,fp=0;
  files.forEach((f,i)=>{const x=30+(i%12)*45,y=74+Math.floor(i/12)*44;const byHash=f.kind==='known',byCls=s.cls&&!byHash&&f.score>=s.th;if(byHash)hashC++;if(byCls){clsC++;if(f.kind==='benign')fp++}if(f.kind==='new'&&!byCls)miss++;
   g+=`<rect x="${x}" y="${y}" width="36" height="34" rx="5" fill="${f.kind==='benign'?'#fff':f.kind==='known'?C.purplep:C.coralp}" stroke="${byHash?C.purple:byCls?C.coral:C.grid}" stroke-width="${byHash||byCls?3:1}"/>`});
  g+=box(30,190,250,50,`hash match: ${hashC} known files caught`,{fill:C.purplep,stroke:C.purple,size:12})+box(320,190,250,50,s.cls?`classifier: ${clsC} flagged for review`:'classifier off',{fill:C.coralp,stroke:C.coral,size:12});
  g+=T(300,280,`new files missed: ${miss} · harmless files flagged: ${fp}`,{size:13.5,anchor:'middle',weight:700})+T(300,302,'purple = already known · coral = new · white = harmless',{size:11,anchor:'middle',fill:C.muted});return g},
 tryUI:s=>({html:`<div class="row"><label><input type="checkbox" id="cl"${s.cls?' checked':''}> Pattern-based filter on</label><label>Threshold <input type="range" id="th" min="0.3" max="0.95" step="0.01" value="${s.th}"></label></div><p class="out">Lower the threshold: fewer misses, more harmless files sent for review. That trade-off is why iCOP kept a human in the loop.</p>`,bind(q,re){q('#cl').onchange=e=>{s.cls=e.target.checked;re()};q('#th').oninput=e=>{s.th=+e.target.value;re()}}})
});
/* 12 — unknown knowns */
const INC=[['Incident 1',['unpatched remote access','weak supplier controls','no monitoring']],['Incident 2',['weak supplier controls','reused credentials','no monitoring']],['Incident 3',['phishing','no monitoring','weak supplier controls']]];
paper(11,'s3','Unknown known security requirements',{
 phases:['Several incidents, each with its own fault tree.','Causes repeat across incidents.','Shared causes are lessons the field already “knows” but has not written down.','They become new requirements. Try it: tag the causes.'],
 init:()=>({sel:new Set()}),anim:p=>({sel:new Set(p>.5?['no monitoring','weak supplier controls']:[]),p}),
 d(p,s){let g='';const counts={};INC.forEach(([n,cs])=>cs.forEach(c=>counts[c]=(counts[c]||0)+1));INC.forEach(([n,cs],i)=>{const x=30+i*190;g+=box(x,60,170,34,n,{weight:700,size:12.5});cs.forEach((c,k)=>{const shared=counts[c]>1,sel=s.sel.has(c);g+=`<line x1="${x+85}" y1="94" x2="${x+85}" y2="${110+k*46}" stroke="${C.grid}"/>`+box(x,110+k*46,170,36,c,{size:11.5,fill:sel?C.greenp:'#fff',stroke:sel?C.green:shared?C.gold:C.line})})});
  const promoted=[...s.sel].filter(c=>counts[c]>1);g+=T(300,280,'new requirements:',{size:12,anchor:'middle',fill:C.muted});promoted.forEach((c,i)=>{g+=box(120+i*190,290,170,34,'Require: fix “'+c+'”',{size:11,fill:C.greenp,stroke:C.green,weight:600})});return g},
 tryUI:s=>({html:`<div class="row">${[...new Set(INC.flatMap(x=>x[1]))].map(c=>`<button type="button" class="chip" data-c="${esc(c)}" aria-pressed="${s.sel.has(c)}">${esc(c)}</button>`).join('')}</div><p class="out">Illustrative incidents. The study analysed 11 major real incidents.</p>`,bind(q,re,root){root.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{const c=b.dataset.c;s.sel.has(c)?s.sel.delete(c):s.sel.add(c);b.setAttribute('aria-pressed',String(s.sel.has(c)));re()})}})
});
/* 13 — ICS testbed */
const LAYERS=['Enterprise network','Control network','HMI / SCADA','PLCs and RTUs','Field devices: pumps, valves, sensors'];
paper(12,'s4','Ten lessons from building an ICS testbed',{
 phases:['A layered industrial plant.','Each layer needs real hardware to be realistic.','More vendors and layers: more realism, more cost and complexity.','Try it: design a lab on a budget.'],
 init:()=>({v:2,lay:1}),anim:p=>({v:Math.round(lerp(1,4,seg(p,.3,.8))),lay:1,p}),
 d(p,s){let g='';LAYERS.forEach((l,i)=>{const y=60+i*44,on=i>=(s.lay===0?2:0);g+=box(40,y,300,36,l,{size:12,fill:on?['#eef3f6','#e1eef7','#d7e8f3','#cfe3ef','#c3dcee'][i]:'#fafafa',stroke:on?C.blue:C.grid,tc:on?C.ink:'#9aa7ae'})});
  for(let k=0;k<s.v;k++)g+=`<rect x="${262+k*18}" y="202" width="14" height="16" rx="3" fill="${[C.blue,C.green,C.coral,C.purple][k]}" opacity=".85"/>`;
  const real=clamp(.2+s.v*.15+s.lay*.2,0,1),cost=clamp(.15+s.v*.18+s.lay*.15,0,1),comp=clamp(.1+s.v*.2+s.lay*.12,0,1);[['realism',real,C.green],['cost',cost,C.coral],['complexity',comp,C.purple]].forEach(([l,v,col],i)=>{const y=90+i*60;g+=T(380,y,l,{size:12,weight:600})+`<rect x="380" y="${y+8}" width="190" height="16" rx="4" fill="#eef3f6"/><rect x="380" y="${y+8}" width="${f2(190*v)}" height="16" rx="4" fill="${col}"/>`});
  g+=T(475,290,'illustrative scores',{size:10.5,anchor:'middle',fill:C.muted});return g},
 tryUI:s=>({html:`<div class="row"><label>PLC vendors <input type="range" id="vv" min="1" max="4" value="${s.v}"></label></div>`+chips('l',['Process layers only','Full layered network'],s.lay),bind(q,re,root){q('#vv').oninput=e=>{s.v=+e.target.value;re()};bindChips(root,'l',s,'lay',re)},out:()=>'The paper’s lessons are about exactly this balance of diversity, scalability and complexity.'})
});
/* CyBOK knowledge areas (version 1.0: 19 KAs in 5 categories) */
const KA=[['Human, organisational & regulatory',['Risk management & governance','Law & regulation','Human factors','Privacy & online rights']],['Attacks & defences',['Malware & attack technologies','Adversarial behaviours','Security operations & incident management','Forensics']],['Systems security',['Cryptography','Operating systems & virtualisation','Distributed systems security','Authentication, authorisation & accountability']],['Software & platform security',['Software security','Web & mobile security','Secure software lifecycle']],['Infrastructure security',['Network security','Hardware security','Cyber-physical systems security','Physical layer & telecommunications security']]];
const KA_FLAT=KA.flatMap(([c,ks],ci)=>ks.map(k=>[k,ci]));const KACOL=[C.coral,C.purple,C.blue,C.green,C.gold];
function kaWheel(cx,cy,R,hi,heat){let g='';const n=KA_FLAT.length;KA_FLAT.forEach(([k,ci],i)=>{const a0=i/n*TAU-Math.PI/2,a1=(i+1)/n*TAU-Math.PI/2;const r0=R*.45;const pt=(a,r)=>[cx+Math.cos(a)*r,cy+Math.sin(a)*r];const [x1,y1]=pt(a0,R),[x2,y2]=pt(a1,R),[x3,y3]=pt(a1,r0),[x4,y4]=pt(a0,r0);const op=heat?heat[i]:(hi==null||hi===i?.9:.35);
 g+=`<path d="M${f2(x1)} ${f2(y1)} A${R} ${R} 0 0 1 ${f2(x2)} ${f2(y2)} L${f2(x3)} ${f2(y3)} A${r0} ${r0} 0 0 0 ${f2(x4)} ${f2(y4)} Z" fill="${KACOL[ci]}" opacity="${f2(op)}" stroke="#fff" stroke-width="2"/>`});return g}
paper(13,'s4','Scoping the Cyber Security Body of Knowledge',{
 phases:['Thousands of topics from curricula, textbooks and job adverts.','They drift and cluster.','Nineteen Knowledge Areas emerge, in five broad categories.','Try it: place a topic.'],
 init:()=>({t:0,ans:-1}),anim:p=>({t:0,ans:-1,cl:seg(p,.2,.8),p}),
 d(p,s){let g='';const cl=s.cl!=null?s.cl:1;for(let i=0;i<120;i++){const r1=Math.abs(Math.sin(i*7.1)),r2=Math.abs(Math.cos(i*3.3));const ka=i%19,a=(ka+.5)/19*TAU-Math.PI/2;const tx=300+Math.cos(a)*120,ty=200+Math.sin(a)*120;const x=lerp(40+r1*520,tx+(r2-.5)*20,cl),y=lerp(60+r2*280,ty+(r1-.5)*20,cl);g+=`<circle cx="${f2(x)}" cy="${f2(y)}" r="3" fill="${KACOL[KA_FLAT[ka][1]]}" opacity=".7"/>`}
  if(cl>.95&&s.p!=null)g+=T(300,205,'19 Knowledge Areas',{size:15,anchor:'middle',weight:700});
  if(s.p==null){const T0=QUIZ[s.t];g+=box(170,170,260,60,T0[0],{weight:700,size:14,stroke:C.ink});if(s.ans>=0)g+=T(300,260,s.ans===T0[1]?'✓ CyBOK puts it in '+KA_FLAT[T0[1]][0]:'CyBOK puts it in '+KA_FLAT[T0[1]][0],{size:12.5,anchor:'middle',weight:700,fill:s.ans===T0[1]?C.green:C.coral})}return g},
 tryUI:s=>({html:chips('t',QUIZ,s.t,x=>x[0])+`<div id="opts"></div>`,bind(q,re,root){const draw=()=>{const T0=QUIZ[s.t];q('#opts').innerHTML=`<div class="row">${T0[2].map(k=>`<button type="button" class="chip" data-o="${k}" aria-pressed="${s.ans===k}">${esc(KA_FLAT[k][0])}</button>`).join('')}</div>`;q('#opts').querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{s.ans=+b.dataset.o;draw();re()})};bindChips(root,'t',s,'t',()=>{s.ans=-1;draw();re()});draw()}})
});
const QUIZ=[['Ransomware',4,[4,8,12]],['GDPR',1,[0,1,3]],['Phishing awareness',2,[2,5,13]],['Disk images in court',7,[7,1,6]],['TLS certificates',15,[15,8,11]],['Programmable logic controllers',17,[17,16,14]]];
/* 14 — good, bad, ugly game */
const DEF=['Firewall','Staff training','Monitoring','Patching'];
paper(14,'s4','A game of security decisions',{
 phases:['A small utility with a limited budget.','Each round, players buy defences.','Attacks arrive; some defences help, some do not.','Try it: spend the budget, then face the attacks.'],
 init:()=>({b:[3,3,2,2],played:false}),anim:p=>({b:[4,1,3,2],played:p>.6,p}),
 d(p,s){let g=box(30,60,240,140,'',{fill:'#f6f9fb'});[['Plant',60,110],['Office',150,90],['Control room',150,150],['Website',230,120]].forEach(([n,x,y])=>{g+=`<rect x="${x-26}" y="${y-14}" width="70" height="28" rx="5" fill="#fff" stroke="${C.blue}"/>`+T(x+9,y+4,n,{size:10.5,anchor:'middle'})});
  const tot=s.b.reduce((a,b)=>a+b,0);DEF.forEach((d,i)=>{const y=70+i*34;g+=T(300,y+12,d,{size:12})+`<rect x="400" y="${y}" width="160" height="16" rx="4" fill="#eef3f6"/><rect x="400" y="${y}" width="${f2(16*s.b[i])}" height="16" rx="4" fill="${C.gold}"/>`});g+=T(560,220,`spent ${tot} of 10`,{size:12,anchor:'end',fill:tot>10?C.coral:C.muted,weight:700});
  if(s.played){const atk=[['Phishing email',1],['Exposed remote access',0],['Malware on a laptop',3],['Unpatched controller',3]];atk.forEach(([a,d],i)=>{const ok=s.b[d]>=3;g+=box(30+i*140,250,130,56,`${a}: ${ok?'stopped':'got through'}`,{size:11,fill:ok?C.greenp:C.coralp,stroke:ok?C.green:C.coral})})}
  g+=T(300,330,'illustrative game; the study used the Decisions & Disruptions tabletop game',{size:10.5,anchor:'middle',fill:C.muted});return g},
 tryUI:s=>({html:`<div class="sliders">${DEF.map((d,i)=>`<label>${d} <input type="range" data-i="${i}" min="0" max="5" value="${s.b[i]}"></label>`).join('')}</div><div class="row"><button type="button" class="chip" id="go">Face the attacks</button></div><p class="out" id="tout"></p>`,bind(q,re,root){root.querySelectorAll('[data-i]').forEach(x=>x.oninput=()=>{s.b[+x.dataset.i]=+x.value;s.played=false;re()});q('#go').onclick=()=>{s.played=true;re()}},out:s=>s.b.reduce((a,b)=>a+b,0)>10?'Over budget — cut something.':'In the study, experts were more confident but not automatically better; managers and experts favoured technical fixes, computer scientists favoured training.'})
});
/* 15 — usability smells */
const SMELLS=['Needs a super sleuth','Confusion reigns','Needs an easier interface','Prepare for the unexpected'];
const QS=[['Which mode should I use with AES? The docs list six.',1],['Where is the function to derive a key from a password? Can’t find it in the docs.',0],['Why do I need 40 lines just to sign a message?',2],['Decrypt suddenly throws an exception on Android only.',3],['Is ECB safe if I only encrypt short strings?',1]];
paper(15,'s4','Usability smells in crypto libraries',{
 phases:['Developers post questions about crypto libraries.','Each question reveals a usability problem.','They fall into bins by usability principle.','Four bins overflow: the usability smells. Try it: sort a question.'],
 init:()=>({q:0,a:-1}),anim:p=>({q:-1,a:-1,p}),
 d(p,s){const o=s.p!=null?p:1;let g='';SMELLS.forEach((sm,i)=>{const x=20+i*145;g+=`<rect x="${x}" y="230" width="130" height="90" rx="8" fill="#fff" stroke="${C.coral}" stroke-width="2"/>`+wrap(x+65,250,sm,18,11.5,C.coral,{anchor:'middle',weight:700})});
  if(s.p!=null){for(let k=0;k<20;k++){const t=clamp(o*1.4-k*.04,0,1),bin=k%4;const x=lerp(40+((k*53)%520),35+bin*145+((k*13)%90),t),y=lerp(60,280-Math.floor(k/4)*8,t);g+=`<rect x="${f2(x)}" y="${f2(y)}" width="22" height="14" rx="3" fill="${C.blue}" opacity=".7"/>`}}
  else{const Q=QS[s.q];g+=box(60,70,480,60,Q[0],{size:13,stroke:C.blue});if(s.a>=0)g+=T(300,170,s.a===Q[1]?'✓ matches our reading':'We would put it under “'+SMELLS[Q[1]]+'”',{size:13,anchor:'middle',weight:700,fill:s.a===Q[1]?C.green:C.coral})}
  g+=T(300,342,'Example questions are illustrative; the study analysed over 2,400 real ones.',{size:10.5,anchor:'middle',fill:C.muted});return g},
 tryUI:s=>({html:chips('q',QS,s.q,(x)=>'Question '+(QS.indexOf(x)+1))+chips('a',SMELLS,s.a),bind(q,re,root){bindChips(root,'q',s,'q',()=>{s.a=-1;root.querySelectorAll('[data-a]').forEach(x=>x.setAttribute('aria-pressed','false'));re()});bindChips(root,'a',s,'a',re)}})
});
/* 16 — interventions */
const PRAC=[['Threat modelling','design flaws'],['Security code review','injection bugs'],['Dependency checks','vulnerable libraries'],['Incident drill','slow response']];
paper(16,'s4','Lightweight security interventions',{
 phases:['A team’s sprints, with no security specialist.','A short workshop introduces a few lightweight practices.','They become recurring blocks in the sprint.','Try it: pick two practices and see what they catch.'],
 init:()=>({on:[true,true,false,false]}),anim:p=>({on:[p>.5,p>.6,false,false],p}),
 d(p,s){let g='';for(let w=0;w<6;w++){const x=30+w*92;g+=`<rect x="${x}" y="70" width="84" height="160" rx="6" fill="#fff" stroke="${C.line}"/>`+T(x+42,88,'sprint '+(w+1),{size:11,anchor:'middle',fill:C.muted});for(let k=0;k<3;k++)g+=`<rect x="${x+8}" y="${100+k*22}" width="68" height="14" rx="3" fill="${C.grid}"/>`;let k=0;PRAC.forEach(([n],i)=>{if(s.on[i]&&w>=1){g+=`<rect x="${x+8}" y="${170+k*22}" width="68" height="14" rx="3" fill="${C.green}"/>`;k++}})}
  let y=258;PRAC.forEach(([n,c],i)=>{if(s.on[i]){g+=T(40,y,'✓ '+n+' catches '+c,{size:12,fill:C.green,weight:600});y+=20}});PRAC.forEach(([n,c],i)=>{if(!s.on[i]){g+=T(330,258+(i%2)*20+(i>1?0:0),'• '+c+' still missed',{size:11.5,fill:C.coral})}});return g},
 tryUI:s=>({html:`<div class="row">${PRAC.map(([n],i)=>`<button type="button" class="chip" data-i="${i}" aria-pressed="${s.on[i]}">${n}</button>`).join('')}</div><p class="out">Illustrative. The paper’s “Developer Security Essentials” were trialled with real teams.</p>`,bind(q,re,root){root.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;s.on[i]=!s.on[i];b.setAttribute('aria-pressed',String(s.on[i]));re()})}})
});
/* 17 — smartphone setup */
const SETUP=[['Location history','location'],['Backup to cloud','photos & messages'],['Personalised ads','activity'],['Voice assistant','voice recordings'],['Usage diagnostics','app usage']];
paper(17,'s4','Skip, skip, skip, accept!!!',{
 phases:['A new phone’s setup wizard.','Tap, tap, tap — “Accept”.','Each quick tap switches on a stream of data.','Try it: set up the phone yourself.'],
 init:()=>({on:SETUP.map(()=>true)}),anim:p=>({on:SETUP.map((_,i)=>p>.2+i*.12),p}),
 d(p,s){let g=`<rect x="40" y="60" width="150" height="270" rx="22" fill="#fff" stroke="${C.ink}" stroke-width="3"/>`;SETUP.forEach(([n],i)=>{const y=86+i*46;g+=T(56,y+10,n,{size:11,fill:C.ink})+`<rect x="140" y="${y}" width="36" height="18" rx="9" fill="${s.on[i]?C.green:C.grid}"/><circle cx="${s.on[i]?167:149}" cy="${y+9}" r="7" fill="#fff"/>`});
  SETUP.forEach(([n,d],i)=>{if(s.on[i]){const y=95+i*46;g+=arrow(196,y,420,y,C.coral,1.6,.8,'5 4')+box(424,y-14,150,28,d,{size:11,fill:C.coralp,stroke:C.coral})}});
  g+=T(300,350,`${s.on.filter(x=>x).length} data streams enabled`,{size:13,anchor:'middle',weight:700});return g},
 tryUI:s=>({html:`<div class="row">${SETUP.map(([n],i)=>`<label><input type="checkbox" data-i="${i}"${s.on[i]?' checked':''}> ${n}</label>`).join('')}</div><p class="out">Illustrative settings. The study found people often skip through setup and leave data-sharing features enabled.</p>`,bind(q,re,root){root.querySelectorAll('[data-i]').forEach(x=>x.onchange=()=>{s.on[+x.dataset.i]=x.checked;re()})}})
});
/* 18 — critical infrastructure risks */
const ENTRY=['Phishing email','Infected USB stick','Remote-access tool'];const NODES=[['Office PC',100,100],['Engineer laptop',100,220],['Control network',280,160],['Power grid',470,90],['Water',470,170],['Rail',470,250]];
paper(18,'s4','Everything is awesome! Or is it?',{
 phases:['A city’s infrastructure, wired to a control room.','An attack enters through one weak point.','It ripples through the control network.','Grid, water and rail dim in turn. Try it: choose an entry point.'],
 init:()=>({e:0,seg:1}),anim:p=>({e:0,seg:1,r:seg(p,.25,.95),p}),
 d(p,s){const r=s.r!=null?s.r:1;const start=[0,1,1][s.e];const order=[start,2,3,4,5];let g='';NODES.forEach(([n,x,y],i)=>{const k=order.indexOf(i),hit=k>=0&&r>k/5;const blocked=s.seg===1&&s.e===0&&i>=3;g+=box(x-62,y-20,124,40,n,{size:12,fill:hit&&!blocked?C.coralp:'#fff',stroke:hit&&!blocked?C.coral:C.line})});
  g+=`<line x1="162" y1="100" x2="218" y2="150" stroke="${C.grid}" stroke-width="2"/><line x1="162" y1="220" x2="218" y2="170" stroke="${C.grid}" stroke-width="2"/>`;[[3],[4],[5]].forEach(([i])=>{g+=`<line x1="342" y1="160" x2="408" y2="${NODES[i][2]}" stroke="${C.grid}" stroke-width="2"/>`});
  if(s.seg===1&&s.e===0)g+=`<rect x="370" y="70" width="8" height="200" fill="${C.green}"/>`+T(374,290,'segmented',{size:11,anchor:'middle',fill:C.green});
  g+=T(300,330,'Illustrative network. The paper discusses how real risks hide behind optimistic assessments.',{size:10.5,anchor:'middle',fill:C.muted});return g},
 tryUI:s=>({html:chips('e',ENTRY,s.e)+chips('g',['Flat network','Segmented (blocks office routes)'],s.seg),bind(q,re,root){bindChips(root,'e',s,'e',re);bindChips(root,'g',s,'seg',re)},out:s=>s.e===0&&s.seg===1?'Segmentation stops the office foothold reaching the plant.':'Engineering laptops and remote access cross straight into the control network — segmentation alone does not stop them.'})
});
/* 19 — CyBOK 1.0 */
paper(19,'s4','CyBOK version 1.0',{
 phases:['The wheel of Knowledge Areas.','Five broad categories.','Nineteen areas, each with a reference chapter.','Try it: pick an area.'],
 init:()=>({k:16}),anim:p=>({k:Math.floor(p*19)%19,p}),
 d(p,s){let g=kaWheel(190,200,140,s.k);const [k,ci]=KA_FLAT[s.k];g+=T(190,206,'CyBOK 1.0',{size:14,anchor:'middle',weight:700});g+=box(360,110,220,60,k,{size:13,weight:700,fill:'#fff',stroke:KACOL[ci]})+T(470,196,KA[ci][0],{size:12,anchor:'middle',fill:KACOL[ci],weight:700});
  KA.forEach(([c],i)=>{g+=`<rect x="360" y="${230+i*20}" width="12" height="12" fill="${KACOL[i]}"/>`+T(378,240+i*20,c,{size:10.5,fill:C.muted})});return g},
 tryUI:s=>({html:`<div class="row"><select id="ka">${KA_FLAT.map(([k],i)=>`<option value="${i}"${i===s.k?' selected':''}>${esc(k)}</option>`).join('')}</select></div><p class="out">Version 1.1 later added further areas; this wheel shows the 19 of version 1.0.</p>`,bind(q,re){q('#ka').onchange=e=>{s.k=+e.target.value;re()}}})
});
/* 20 — Schrödinger's security */
const TASKS=['Writing code','Choosing libraries','Choosing testers','Setting up environments','Deciding release timing','Handling user feedback'];
paper(20,'s5','Schrödinger’s security',{
 phases:['Six everyday developer tasks, each a closed box.','Does a security reason sit inside?','Open them one by one.','Only coding had a genuine security rationale. Try it: guess, then open.'],
 init:()=>({open:TASKS.map(()=>false),guess:TASKS.map(()=>false)}),anim:p=>({open:TASKS.map((_,i)=>p>.2+i*.1),guess:TASKS.map(()=>false),p}),
 d(p,s){let g='';TASKS.forEach((t,i)=>{const x=40+(i%3)*180,y=70+Math.floor(i/3)*130,op=s.open[i];g+=`<rect x="${x}" y="${y+30}" width="160" height="80" rx="6" fill="${op?(i===0?C.greenp:'#f4f4f4'):'#e7d3a4'}" stroke="${C.ink}" stroke-width="2"/>`+(op?`<path d="M${x} ${y+30} L${x+20} ${y+4} L${x+180} ${y+4} L${x+160} ${y+30}" fill="#d6be86" stroke="${C.ink}"/>`:`<rect x="${x-4}" y="${y+22}" width="168" height="12" fill="#d6be86" stroke="${C.ink}"/>`)+T(x+80,y+60,t,{size:12,anchor:'middle',weight:600})+(op?T(x+80,y+86,i===0?'security rationale ✓':'no security rationale',{size:11.5,anchor:'middle',fill:i===0?C.green:C.muted}):'')+(s.guess[i]&&!op?T(x+80,y+86,'you guessed: yes',{size:11,anchor:'middle',fill:C.purple}):'')});
  g+=T(300,342,'Finding from a task study with 44 developers and a survey of 274.',{size:11,anchor:'middle',fill:C.muted});return g},
 tryUI:s=>({html:`<div class="row">${TASKS.map((t,i)=>`<label><input type="checkbox" data-g="${i}"${s.guess[i]?' checked':''}> ${t}</label>`).join('')}</div><div class="row"><button type="button" class="chip" id="op">Open the boxes</button><button type="button" class="chip" id="cl">Close them</button></div><p class="out">Tick the tasks you think developers do for security reasons, then open the boxes.</p>`,bind(q,re,root){root.querySelectorAll('[data-g]').forEach(x=>x.onchange=()=>{s.guess[+x.dataset.g]=x.checked;re()});q('#op').onclick=()=>{s.open=TASKS.map(()=>true);re()};q('#cl').onclick=()=>{s.open=TASKS.map(()=>false);re()}}})
});
/* 21 — Mr Blue Head */
const STEPS=['A new partner wants remote access to the plant','A budget appears for one improvement','An odd login at 3 a.m.','A vendor offers a cheap upgrade'];
paper(21,'s5','“So if Mr Blue Head here clicks the link…”',{
 phases:['A decision point.','Start from risk: what could go wrong?','Or start from opportunity: what could we gain?','Good teams switch flexibly. Try it: choose at each step.'],
 init:()=>({c:[0,1,0,1]}),anim:p=>({c:[0,p>.4?1:0,p>.6?0:1,p>.8?1:0],p}),
 d(p,s){let g='';const y0=90;g+=T(150,y0-26,'risk-first',{size:13,anchor:'middle',weight:700,fill:C.coral})+T(450,y0-26,'opportunity-first',{size:13,anchor:'middle',weight:700,fill:C.green});let prev=null;
  STEPS.forEach((st,i)=>{const y=y0+i*62,x=s.c[i]===0?150:450;g+=box(220,y-18,160,40,st,{size:10.5});const px=x;g+=`<circle cx="${px}" cy="${y+2}" r="10" fill="${s.c[i]===0?C.coral:C.green}"/>`;if(prev)g+=`<line x1="${prev[0]}" y1="${prev[1]}" x2="${px}" y2="${y+2}" stroke="${C.ink}" stroke-width="2.5"/>`;prev=[px,y+2]});
  const sw=s.c.slice(1).filter((v,i)=>v!==s.c[i]).length;g+=T(300,352,sw>=2?`${sw} switches: a flexible, “plastic” pattern`:sw===1?'1 switch':'no switches: a fixed strategy',{size:13,anchor:'middle',weight:700,fill:sw>=2?C.green:C.muted});return g},
 tryUI:s=>({html:STEPS.map((st,i)=>`<div class="row"><span style="font-size:13px;min-width:260px">${esc(st)}</span><button type="button" class="chip" data-s="${i},0" aria-pressed="${s.c[i]===0}">Risk</button><button type="button" class="chip" data-s="${i},1" aria-pressed="${s.c[i]===1}">Opportunity</button></div>`).join('')+'<p class="out">Illustrative scenario. The paper analysed 208 sessions and 948 players of Decisions & Disruptions.</p>',bind(q,re,root){root.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const [i,v]=b.dataset.s.split(',').map(Number);s.c[i]=v;root.querySelectorAll(`[data-s^="${i},"]`).forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.s===i+','+v)));re()})}})
});
/* 22 — do specifications help */
function fnv(str,salt){let h=2166136261;for(const c of salt+str){h^=c.charCodeAt(0);h=Math.imul(h,16777619)>>>0}let out='';for(let k=0;k<4;k++){h^=h>>>13;h=Math.imul(h,1540483477)>>>0;out+=h.toString(16).padStart(8,'0')}return out}
paper(22,'s5','Specify first, store passwords safely?',{
 phases:['A password, about to be stored.','Plain text: readable by anyone who gets the database.','Base64: looks scrambled, reversed in one step — encoding is not hashing.','A salted hash: one-way. Try it: type a password.'],
 init:()=>({pw:'correct horse',m:2}),anim:p=>({pw:'correct horse',m:Math.min(2,Math.floor(p*3)),p}),
 d(p,s){const b64=(()=>{try{return btoa(unescape(encodeURIComponent(s.pw)))}catch(e){return ''}})();const salt='a9f3c1';const h=fnv(s.pw,salt);let g=box(30,70,170,44,'password: '+s.pw,{size:12.5,stroke:C.ink,weight:600});
  [['plain text',s.pw,'attacker reads it',C.coral],['Base64',b64,'attacker decodes it: “'+s.pw+'”',C.coral],['salted hash',salt+':'+h.slice(0,20)+'…','attacker cannot reverse it',C.green]].forEach(([n,v,res,col],i)=>{const y=150+i*64,on=i<=s.m||s.p==null;g+=`<g opacity="${on?1:.25}">`+arrow(200,92,250,y+18,C.ink,1.5)+box(255,y,180,40,n+': '+v,{size:10.5,chars:34,stroke:i===2?C.green:C.coral})+T(445,y+24,res,{size:11,fill:col,weight:700})+'</g>'});
  g+=T(300,350,'The hash shown is a toy for illustration; real systems use slow password hashes such as bcrypt or Argon2.',{size:10.5,anchor:'middle',fill:C.muted});return g},
 tryUI:s=>({html:`<div class="row"><label>Password <input id="pw" value="${esc(s.pw)}" style="min-height:40px;border:1px solid #aec3cf;border-radius:8px;padding:4px 8px"></label></div><p class="out">Freelancers in the study often used Base64, confusing encoding with hashing.</p>`,bind(q,re){q('#pw').oninput=e=>{s.pw=e.target.value;re()}}})
});
/* 23 — utility to capability */
const PERS=[['Fluent, young, no disabilities',[1,1,1]],['Older user, low vision',[1,.4,.6]],['Second-language speaker',[.5,1,.8]],['Shared family phone',[1,1,.3]]];
paper(23,'s5','From utility to capability',{
 phases:['One privacy tool, the same for everyone.','Each person’s circumstances act like a filter.','Language, age, disability, shared devices …','The real protection differs. Try it: change the person.'],
 init:()=>({k:1}),anim:p=>({k:Math.min(3,Math.floor(p*4)),p}),
 d(p,s){const [n,f]=PERS[s.k];let g=box(40,90,130,60,'Privacy tool',{weight:700,stroke:C.purple})+arrow(175,120,235,120,C.purple,2.5);['language','vision / dexterity','private device'].forEach((x,i)=>{const y=70+i*40;g+=`<rect x="240" y="${y}" width="120" height="30" rx="6" fill="${f[i]<.7?C.coralp:C.greenp}" stroke="${f[i]<.7?C.coral:C.green}"/>`+T(300,y+20,x,{size:11,anchor:'middle'})});
  const cap=f.reduce((a,b)=>a*b,1);g+=arrow(365,120,420,120,C.purple,2.5)+T(500,80,'real capability',{size:12,anchor:'middle',weight:700})+`<rect x="440" y="90" width="120" height="180" rx="6" fill="#eef3f6"/><rect x="440" y="${f2(270-180*cap)}" width="120" height="${f2(180*cap)}" rx="6" fill="${C.purple}"/>`+T(500,290,Math.round(cap*100)+'%',{size:14,anchor:'middle',weight:700});
  g+=person(105,300,C.ink,.8)+T(105,330,n,{size:12,anchor:'middle',weight:600});g+=T(300,354,'Illustrative numbers. The paper draws on Amartya Sen’s capability approach.',{size:10.5,anchor:'middle',fill:C.muted});return g},
 tryUI:s=>({html:chips('k',PERS,s.k,x=>x[0]),bind(q,re,root){bindChips(root,'k',s,'k',re)}})
});
/* 24 — permissions */
const APPF=[['Photo filters',['Camera','Photos']],['Find friends',['Contacts']],['Nearby offers',['Location']],['Voice notes',['Microphone']]];
paper(24,'s5','Stuck in the permissions with you',{
 phases:['A developer builds features; each adds permissions.','A feature is removed — its permission stays.','Users grant permissions for features, or out of trust.','Stale permissions pile up. Try it: build and prune.'],
 init:()=>({feat:[true,true,false,true],perm:new Set(['Camera','Photos','Contacts','Microphone','Location'])}),anim:p=>({feat:[true,p<.5,true,true],perm:new Set(['Camera','Photos','Contacts','Location','Microphone']),p}),
 d(p,s){let g=T(130,64,'developer: features',{size:12,anchor:'middle',weight:700})+T(470,64,'user: permissions granted',{size:12,anchor:'middle',weight:700});APPF.forEach(([n],i)=>{g+=box(40,80+i*50,180,38,n,{size:12,fill:s.feat[i]?C.pale:'#fafafa',stroke:s.feat[i]?C.blue:C.grid,tc:s.feat[i]?C.ink:'#9aa7ae'})});
  const needed=new Set(APPF.flatMap(([n,ps],i)=>s.feat[i]?ps:[]));[...s.perm].forEach((pm,i)=>{const stale=!needed.has(pm);g+=box(380,80+i*44,180,34,pm+(stale?' — unused':''),{size:11.5,fill:stale?C.coralp:C.greenp,stroke:stale?C.coral:C.green})});
  g+=T(300,340,`${[...s.perm].filter(x=>!needed.has(x)).length} stale permissions`,{size:13,anchor:'middle',weight:700,fill:C.coral});return g},
 tryUI:s=>({html:`<div class="row">${APPF.map(([n],i)=>`<label><input type="checkbox" data-f="${i}"${s.feat[i]?' checked':''}> ${n}</label>`).join('')}</div><div class="row"><button type="button" class="chip" id="pr">Remove unused permissions</button></div>`,bind(q,re){document.querySelectorAll('#try [data-f]').forEach(x=>x.onchange=()=>{const i=+x.dataset.f;s.feat[i]=x.checked;if(x.checked)APPF[i][1].forEach(pm=>s.perm.add(pm));re()});q('#pr').onclick=()=>{const needed=new Set(APPF.flatMap(([n,ps],i)=>s.feat[i]?ps:[]));s.perm=new Set([...s.perm].filter(x=>needed.has(x)));re()}},out:()=>'The study found developers rarely do this last step.'})
});
/* 25 — harms map */
const HMAP={goods:['Safety','Privacy','Autonomy'],harms:[['Harassment',[0,2]],['Fraud',[0]],['Surveillance',[1,2]],['Misinformation',[2]],['Data leaks',[1,0]]]};
paper(25,'s5','Mapping technology-mediated harms',{
 phases:['Harms, one by one.','Social goods they threaten.','Links grow into a map across disciplines.','Try it: filter by a social good.'],
 init:()=>({g:-1}),anim:p=>({g:-1,grow:seg(p,.1,.9),p}),
 d(p,s){const gr=s.grow!=null?s.grow:1;let g='';HMAP.goods.forEach((gd,j)=>{const x=480,y=110+j*90,on=s.g<0||s.g===j;g+=`<circle cx="${x}" cy="${y}" r="34" fill="${on?C.greenp:'#f4f4f4'}" stroke="${C.green}" stroke-width="2"/>`+T(x,y+4,gd,{size:12,anchor:'middle',weight:700})});
  HMAP.harms.forEach(([h,links],i)=>{const x=120,y=80+i*58,show=gr>i/5;const on=s.g<0||links.includes(s.g);if(!show)return;links.forEach(j=>{g+=`<line x1="${x+60}" y1="${y}" x2="446" y2="${110+j*90}" stroke="${C.coral}" stroke-width="${on?2.4:1}" opacity="${on?.9:.2}"/>`});g+=box(x-60,y-18,120,36,h,{size:12,fill:on?C.coralp:'#fafafa',stroke:on?C.coral:C.grid})});
  g+=T(300,354,'A small illustrative slice; the REPHRAIN map links many more harms, goods, challenges and researchers.',{size:10.5,anchor:'middle',fill:C.muted});return g},
 tryUI:s=>({html:chips('g',['All',...HMAP.goods],s.g+1),bind(q,re,root){root.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{s.g=+b.dataset.g-1;root.querySelectorAll('[data-g]').forEach(x=>x.setAttribute('aria-pressed',String(+x.dataset.g===s.g+1)));re()})}})
});
/* 26 — workforce knowledge profile */
const STAFF=[['Network engineer',[15,18,10]],['Security analyst',[6,4,7,5]],['Developer',[12,13,14]],['Compliance officer',[0,1,3]],['OT engineer',[17,16]]];
paper(26,'s6','Mapping a workforce’s security knowledge',{
 phases:['One person’s qualifications light up a few Knowledge Areas.','Add another person, and another.','The team’s heat map shows strengths and gaps.','Try it: build a team.'],
 init:()=>({on:[true,true,true,false,false]}),anim:p=>({on:STAFF.map((_,i)=>p>.15+i*.15),p}),
 d(p,s){const heat=KA_FLAT.map(()=>.08);STAFF.forEach(([n,ks],i)=>{if(s.on[i])ks.forEach(k=>heat[k]=Math.min(1,heat[k]+.45))});let g=kaWheel(190,200,140,null,heat);g+=T(190,206,'team coverage',{size:12.5,anchor:'middle',weight:700});
  STAFF.forEach(([n],i)=>{g+=box(380,70+i*44,190,34,n,{size:12,fill:s.on[i]?C.greenp:'#fff',stroke:s.on[i]?C.green:C.grid})});const gaps=heat.filter(h=>h<.3).length;g+=T(475,310,`${gaps} of 19 areas uncovered`,{size:13,anchor:'middle',weight:700,fill:gaps>8?C.coral:C.green});return g},
 tryUI:s=>({html:`<div class="row">${STAFF.map(([n],i)=>`<button type="button" class="chip" data-i="${i}" aria-pressed="${s.on[i]}">${n}</button>`).join('')}</div><p class="out">Illustrative profiles. The framework maps qualifications, certifications, training and roles onto CyBOK.</p>`,bind(q,re,root){root.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;s.on[i]=!s.on[i];b.setAttribute('aria-pressed',String(s.on[i]));re()})}})
});
/* 27 — LLMs for code repair */
const FIX=[['Escape the input inside this function','Looks right locally, but another caller already escapes it: double-escaped data breaks the search page.'],['Use a parameterised query','Fixes the injection at its source and works for every caller.'],['Wrap the call in try/catch','Hides the error; the injection is still there.']];
paper(27,'s6','LLMs, code repair and missing context',{
 phases:['A function with a vulnerability.','An AI suggests a patch.','Zoom out: the wider system.','Some patches break assumptions elsewhere. Try it: pick a fix.'],
 init:()=>({k:-1}),anim:p=>({k:p>.5?0:-1,zoom:seg(p,.45,.75),p}),
 d(p,s){const z=s.zoom!=null?s.zoom:1;let g=`<rect x="${f2(lerp(150,40,z))}" y="${f2(lerp(90,60,z))}" width="${f2(lerp(300,520,z))}" height="${f2(lerp(150,250,z))}" rx="8" fill="#fff" stroke="${C.line}"/>`;
  g+=box(200,120,200,90,'search(term): query = "SELECT … WHERE name = \'" + term + "\'"',{size:10.5,chars:34,stroke:C.coral});
  if(z>.5){[['web form',60,90],['admin tool',60,230],['report job',440,230]].forEach(([n,x,y])=>{g+=box(x,y,100,34,n,{size:11,op:z});g+=arrow(x+(x<300?100:0),y+17,x<300?200:400,y<150?150:190,C.muted,1.5,z)})}
  if(s.k>=0){const good=s.k===1;g+=box(60,282,480,50,FIX[s.k][1],{size:11.5,fill:good?C.greenp:C.coralp,stroke:good?C.green:C.coral});if(s.k===0)g+=`<circle cx="110" cy="248" r="20" fill="none" stroke="${C.coral}" stroke-width="3"/>`}return g},
 tryUI:s=>({html:chips('k',FIX,s.k,x=>x[0]),bind(q,re,root){bindChips(root,'k',s,'k',re)},out:()=>'Illustrative example of the paper’s point: repairs need context about the whole application.'})
});
/* 28 — weakening E2EE */
paper(28,'s6','Weakening end-to-end encryption considered harmful',{
 phases:['A locked message travels between two phones.','Only the two ends hold the keys.','Add client-side scanning: a side door.','Doors do not check who walks through. Try it: toggle scanning.'],
 init:()=>({scan:true}),anim:p=>({scan:p>.5,p}),
 d(p,s){let g=`<rect x="40" y="110" width="90" height="160" rx="16" fill="#fff" stroke="${C.ink}" stroke-width="3"/><rect x="470" y="110" width="90" height="160" rx="16" fill="#fff" stroke="${C.ink}" stroke-width="3"/>`;const t=s.p!=null?(p*3)%1:(performance.now()/2000)%1;
  g+=`<line x1="130" y1="190" x2="470" y2="190" stroke="${C.grid}" stroke-width="3" stroke-dasharray="6 5"/><g transform="translate(${f2(lerp(140,440,t))} 176)"><rect width="34" height="26" rx="4" fill="${C.green}"/><path d="M8 0 v-8 a9 9 0 0 1 18 0 v8" fill="none" stroke="${C.green}" stroke-width="3"/></g>`;
  if(s.scan){g+=`<rect x="128" y="132" width="16" height="30" fill="${C.coral}"/>`+arrow(144,147,250,92,C.coral,2)+box(250,70,120,36,'scanner',{size:12,stroke:C.coral});['criminal hackers','hostile states','abusive insiders'].forEach((n,i)=>{g+=arrow(144,155,250+i*0,300+i*0,C.coral,1.2,.7,'4 4')+box(200+i*130,300,120,34,n,{size:11,fill:C.coralp,stroke:C.coral})})}
  g+=T(300,354,s.scan?'A side door for one is a door for others.':'Only the two ends can read the message.',{size:13,anchor:'middle',weight:700,fill:s.scan?C.coral:C.green});return g},
 live:true,
 tryUI:s=>({html:`<div class="row"><label><input type="checkbox" id="sc"${s.scan?' checked':''}> Client-side scanning</label></div><p class="out">The authors, who have long worked on child protection, argue scanning would not tackle root causes of abuse and would compromise everyone’s privacy.</p>`,bind(q,re){q('#sc').onchange=e=>{s.scan=e.target.checked;re()}}})
});
/* 29 — LINICS */
const TACT=[['Discovery',['network scanner','protocol fingerprinting']],['Collection',['traffic capture','historian query']],['Inhibit response function',['PLC stop command','alarm suppression test']],['Impair process control',['register write','setpoint fuzzing']],['Lateral movement',['remote services check','credential testing']]];
paper(29,'s6','LINICS: an open OT pentesting platform',{
 phases:['Tactics from MITRE ATT&CK for ICS.','Tools from the LINICS toolbox drop into place.','The grid fills: a map from IT skills to OT testing.','Try it: pick a tactic.'],
 init:()=>({k:0}),anim:p=>({k:-1,fill:seg(p,.2,.9),p}),
 d(p,s){const fl=s.fill!=null?s.fill:1;let g='';TACT.forEach(([t,tools],i)=>{const x=20+i*114,on=s.k<0||s.k===i;g+=box(x,62,106,50,t,{size:10.5,fill:on?C.pale:'#fafafa',stroke:on?C.blue:C.grid,weight:600});tools.forEach((tl,k)=>{const show=fl>(i*2+k)/10;if(show)g+=box(x,130+k*60,106,46,tl,{size:10.5,fill:on?C.greenp:'#fafafa',stroke:on?C.green:C.grid})})});
  g+=T(300,312,'Tool types are illustrative; LINICS maps real open-source tools onto these tactics.',{size:10.5,anchor:'middle',fill:C.muted})+T(300,334,'Only test systems you are authorised to test.',{size:11,anchor:'middle',weight:700,fill:C.coral});return g},
 tryUI:s=>({html:chips('k',TACT,s.k,x=>x[0]),bind(q,re,root){bindChips(root,'k',s,'k',re)}})
});
