// Realm script generator.
// Builds a 26-letter alphabet for English from the letters' ancient origins and writes
// tools/realm-script.json, which zigzag-realms.html embeds.
//
// 1. Each letter is described by a 21-dimensional feature vector:
//    - Latin letter form (6): ascender, descender, curves, closed counter, diagonals, symmetry
//    - Sound in English (8): vowel, voiced, labial, coronal, dorsal, stop, fricative, sonorant
//    - Meaning of the Proto-Sinaitic / Phoenician pictograph the letter descends from, scored on
//      six concept axes found in the basic vocabulary of every language (living thing, body,
//      made thing, nature, action, perception) (6)
//    - Frequency in English text (1)
// 2. The columns are standardised and reduced to three principal components (power iteration).
//    PC1 sets the stroke terminals, PC2 the corner treatment, PC3 suggests a mirrored stance.
// 3. Each glyph is built from a skeleton of the original pictograph (ox head, house, door, hand,
//    water, eye, mouth, head, tooth, mark...). Every letter has a few candidate variants
//    (mirrored, with or without a distinguishing dot).
// 4. Legibility search: glyphs are rasterised at small size and compared pixel by pixel. A
//    coordinate descent picks one variant per letter to minimise
//      Σ_pairs f_i f_j exp(−d_ij / σ)   (frequent letters must not be confused)
//    + λ Σ_i f_i · ink_i               (frequent letters should be light and quick to read)
//    + μ Σ_i [variant disagrees with the PCA stance]
//    where f is English letter frequency and d the pixel distance.
//
// Run: node tools/realm-script.mjs

import fs from "node:fs";
const L = (...p) => ({ t: "L", p });            // polyline, points [x,y] with y up, x-height = 1
const A = (cx, cy, r, a0, a1) => ({ t: "A", cx, cy, r, a0, a1 }); // arc in degrees, counter-clockwise
const D = (cx, cy, r = 0.075) => ({ t: "D", cx, cy, r });          // dot

// Skeletons from the pictographs. Widths are in x-height units.
const LETTERS = {
 a:{o:"ʾalp",m:"ox",w:.8,s:[L([.05,1],[.4,0],[.75,1]),L([.2,.58],[.6,.58])]},
 b:{o:"bayt",m:"house",w:.75,s:[L([.1,0],[.1,1],[.65,1],[.65,0],[.1,0])]},
 c:{o:"gaml",m:"throwstick",w:.8,s:[L([.08,.12],[.42,1],[.75,.55])]},
 d:{o:"dalt",m:"door",w:.72,s:[L([.1,0],[.1,1.32],[.62,1.32],[.62,0])]},
 e:{o:"hillul",m:"rejoicing figure",w:.8,s:[L([.4,0],[.4,.62]),A(.4,.98,.34,180,360),D(.4,1.2,.085)]},
 f:{o:"waw",m:"hook",w:.6,s:[L([.18,0],[.18,1.05]),A(.36,1.05,.18,180,0),L([.54,1.05],[.54,.9])]},
 g:{o:"gaml",m:"throwstick",w:.72,s:[L([.1,1],[.55,.42],[.16,-.42])]},
 h:{o:"ḥasir",m:"courtyard fence",w:.72,s:[L([.1,0],[.1,1.32]),L([.62,0],[.62,1]),L([.1,.5],[.62,.5])]},
 i:{o:"yad",m:"arm",w:.5,s:[L([.15,0],[.15,.72],[.42,1])]},
 j:{o:"yad",m:"arm",w:.55,s:[L([.38,1],[.38,-.18]),A(.2,-.18,.18,0,-180)]},
 k:{o:"kap",m:"palm of the hand",w:.78,s:[L([.1,0],[.1,1.3]),L([.7,1],[.1,.5],[.7,0]),L([.1,.5],[.7,.5])]},
 l:{o:"lamd",m:"ox goad",w:.62,s:[L([.12,1.34],[.12,.3]),A(.32,.3,.2,180,360),L([.52,.3],[.52,.48])]},
 m:{o:"mayim",m:"water",w:.9,s:[L([.02,.66],[.22,.98],[.44,.66],[.66,.98],[.86,.66]),L([.02,.08],[.22,.4],[.44,.08],[.66,.4],[.86,.08])]},
 n:{o:"naḥš",m:"snake",w:.62,s:[A(.31,.75,.24,0,270),A(.31,.27,.24,90,-180)]},
 o:{o:"ʿayn",m:"eye",w:.85,s:[A(.42,.5,.4,0,360),D(.42,.5,.09)]},
 p:{o:"pu",m:"mouth",w:.8,s:[A(.42,.5,.36,45,315),L([.06,.5],[.06,-.42])]},
 q:{o:"qup",m:"eye of a needle",w:.72,s:[A(.36,.55,.28,0,360),L([.36,-.42],[.36,1.18])]},
 r:{o:"raʾs",m:"head",w:.72,s:[L([.12,0],[.12,1]),L([.12,1],[.62,.76],[.12,.5])]},
 s:{o:"šinn",m:"tooth",w:.9,s:[L([.02,1],[.2,0],[.42,.62],[.64,0],[.82,1])]},
 t:{o:"taw",m:"mark",w:.72,s:[L([.36,0],[.36,1.08]),L([.06,.7],[.66,.7])]},
 u:{o:"waw",m:"hook",w:.75,s:[L([.06,1],[.06,.42]),A(.37,.42,.31,180,360),L([.68,.42],[.68,1])]},
 v:{o:"waw",m:"hook",w:.75,s:[L([.06,0],[.37,1],[.68,0])]},
 w:{o:"waw",m:"hook, doubled",w:.9,s:[L([.04,1],[.04,.42]),A(.22,.42,.18,180,360),L([.4,.42],[.4,.75]),A(.58,.42,.18,180,360),L([.76,.42],[.76,1])]},
 x:{o:"samk",m:"support pillar",w:.75,s:[L([.06,0],[.68,1]),L([.06,1],[.68,0])]},
 y:{o:"waw",m:"hook",w:.75,s:[L([.06,1],[.37,.42],[.68,1]),L([.37,.42],[.37,-.42])]},
 z:{o:"zayn",m:"weapon",w:.72,s:[L([.06,1],[.66,1]),L([.36,1],[.36,0]),L([.06,0],[.66,0])]}
};
const FREQ={e:12.7,t:9.1,a:8.2,o:7.5,i:7.0,n:6.7,s:6.3,h:6.1,r:6.0,d:4.3,l:4.0,c:2.8,u:2.8,m:2.4,w:2.4,f:2.2,g:2.0,y:2.0,p:1.9,b:1.5,v:1.0,k:.8,j:.15,x:.15,q:.1,z:.07};
// Latin form: ascender, descender, curves, closed, diagonal, symmetric
const FORM={a:[0,0,1,1,0,0],b:[1,0,1,1,0,0],c:[0,0,1,0,0,0],d:[1,0,1,1,0,0],e:[0,0,1,1,0,0],f:[1,0,1,0,0,0],g:[0,1,1,1,0,0],h:[1,0,1,0,0,0],i:[0,0,0,0,0,1],j:[0,1,1,0,0,0],k:[1,0,0,0,1,0],l:[1,0,0,0,0,1],m:[0,0,1,0,0,1],n:[0,0,1,0,0,0],o:[0,0,1,1,0,1],p:[0,1,1,1,0,0],q:[0,1,1,1,0,0],r:[0,0,1,0,0,0],s:[0,0,1,0,0,0],t:[1,0,1,0,0,0],u:[0,0,1,0,0,0],v:[0,0,0,0,1,1],w:[0,0,0,0,1,1],x:[0,0,0,0,1,1],y:[0,1,0,0,1,0],z:[0,0,0,0,1,0]};
// Sound: vowel, voiced, labial, coronal, dorsal, stop, fricative, sonorant
const SOUND={a:[1,1,0,0,0,0,0,1],b:[0,1,1,0,0,1,0,0],c:[0,0,0,0,1,1,0,0],d:[0,1,0,1,0,1,0,0],e:[1,1,0,0,0,0,0,1],f:[0,0,1,0,0,0,1,0],g:[0,1,0,0,1,1,0,0],h:[0,0,0,0,0,0,1,0],i:[1,1,0,0,0,0,0,1],j:[0,1,0,1,0,1,1,0],k:[0,0,0,0,1,1,0,0],l:[0,1,0,1,0,0,0,1],m:[0,1,1,0,0,0,0,1],n:[0,1,0,1,0,0,0,1],o:[1,1,0,0,0,0,0,1],p:[0,0,1,0,0,1,0,0],q:[0,0,0,0,1,1,0,0],r:[0,1,0,1,0,0,0,1],s:[0,0,0,1,0,0,1,0],t:[0,0,0,1,0,1,0,0],u:[1,1,0,0,0,0,0,1],v:[0,1,1,0,0,0,1,0],w:[0,1,1,0,1,0,0,1],x:[0,0,0,0,1,1,1,0],y:[.5,1,0,0,1,0,0,1],z:[0,1,0,1,0,0,1,0]};
// Meaning of the source pictograph: living, body, made, nature, action, perception
const SENSE={a:[1,0,0,.3,0,0],b:[0,0,1,0,0,0],c:[0,0,.6,0,.8,0],d:[0,0,1,0,.2,0],e:[.3,.6,0,0,.7,.3],f:[0,0,.8,0,0,0],g:[0,0,.6,0,.9,0],h:[0,0,.9,0,0,0],i:[0,1,0,0,.5,0],j:[0,1,0,0,.6,0],k:[0,1,0,0,.3,0],l:[.3,0,.6,0,.8,0],m:[0,0,0,1,0,0],n:[1,0,0,.5,.2,0],o:[0,.6,0,0,0,1],p:[0,1,0,0,.4,.4],q:[0,.4,.4,0,0,.3],r:[0,1,0,0,0,.5],s:[0,.8,0,.3,0,0],t:[0,0,.3,0,.4,.6],u:[0,0,.8,0,0,0],v:[0,0,.8,0,0,0],w:[0,0,.8,0,0,0],x:[0,0,.6,.3,0,0],y:[0,0,.6,.2,0,0],z:[0,0,.7,0,.8,0]};

const keys=Object.keys(LETTERS);
// ---------- PCA ----------
const X=keys.map(k=>[...FORM[k],...SOUND[k],...SENSE[k],Math.log(FREQ[k])]);
const dim=X[0].length,n=X.length;
const mean=Array(dim).fill(0).map((_,j)=>X.reduce((s,r)=>s+r[j],0)/n);
const sd=Array(dim).fill(0).map((_,j)=>Math.sqrt(X.reduce((s,r)=>s+(r[j]-mean[j])**2,0)/n)||1);
const Z=X.map(r=>r.map((v,j)=>(v-mean[j])/sd[j]));
let C=Array(dim).fill(0).map((_,i)=>Array(dim).fill(0).map((_,j)=>Z.reduce((s,r)=>s+r[i]*r[j],0)/n));
const comps=[];
for(let c=0;c<3;c++){
 let v=Array(dim).fill(0).map((_,i)=>Math.sin(i+1+c));
 for(let it=0;it<500;it++){const w=C.map(row=>row.reduce((s,x,j)=>s+x*v[j],0));const norm=Math.hypot(...w);v=w.map(x=>x/norm)}
 const lam=v.reduce((s,x,i)=>s+x*C[i].reduce((t,y,j)=>t+y*v[j],0),0);
 comps.push({v,lam});C=C.map((row,i)=>row.map((x,j)=>x-lam*v[i]*v[j]));
}
const totalVar=dim;
const proj=Z.map(r=>comps.map(c=>r.reduce((s,x,j)=>s+x*c.v[j],0)));
const pmax=[0,1,2].map(c=>Math.max(...proj.map(p=>Math.abs(p[c]))));
const PC=Object.fromEntries(keys.map((k,i)=>[k,proj[i].map((x,c)=>+(x/pmax[c]).toFixed(3))]));

// ---------- geometry ----------
function mirror(s,w){return s.map(p=>p.t==="L"?{t:"L",p:p.p.map(([x,y])=>[w-x,y])}:p.t==="A"?{...p,cx:w-p.cx,a0:180-p.a1,a1:180-p.a0}:{...p,cx:w-p.cx})}
function points(stroke,step=.04){
 if(stroke.t==="L"){const out=[];for(let i=0;i<stroke.p.length-1;i++){const [x0,y0]=stroke.p[i],[x1,y1]=stroke.p[i+1],len=Math.hypot(x1-x0,y1-y0),k=Math.max(1,Math.ceil(len/step));for(let j=0;j<=k;j++)out.push([x0+(x1-x0)*j/k,y0+(y1-y0)*j/k])}return out}
 if(stroke.t==="A"){const out=[],span=stroke.a1-stroke.a0,k=Math.max(2,Math.ceil(Math.abs(span)*Math.PI/180*stroke.r/step));for(let j=0;j<=k;j++){const a=(stroke.a0+span*j/k)*Math.PI/180;out.push([stroke.cx+stroke.r*Math.cos(a),stroke.cy+stroke.r*Math.sin(a)])}return out}
 return[[stroke.cx,stroke.cy]];
}
function inkLength(s){let len=0;for(const st of s){const p=points(st);for(let i=1;i<p.length;i++)len+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);if(st.t==="D")len+=.3}return len}
// Rasterise at small size: 14 px per x-height, stroke ~1.6 px, grid from y=-0.5 to 1.45
const PX=14,GW=16,GH=Math.round(1.95*PX);
function raster(s,w){
 const g=new Uint8Array(GW*GH),off=(GW/PX-w)/2;
 for(const st of s){const pts=points(st,.02),rad=st.t==="D"?Math.max(.11,st.r):.06;
  for(const [x,y] of pts){const cx=(x+off)*PX,cy=(1.45-y)*PX,r=rad*PX;
   for(let yy=Math.floor(cy-r);yy<=Math.ceil(cy+r);yy++)for(let xx=Math.floor(cx-r);xx<=Math.ceil(cx+r);xx++){
    if(xx<0||yy<0||xx>=GW||yy>=GH)continue;if((xx+.5-cx)**2+(yy+.5-cy)**2<=r*r+.35)g[yy*GW+xx]=1}}}
 return g;
}
// Blur slightly so near misses count as similar, then compare
function blur(g){const o=new Float32Array(g.length);for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){let s=0,c=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const X=x+dx,Y=y+dy;if(X<0||Y<0||X>=GW||Y>=GH)continue;const wgt=dx||dy?.5:1;s+=g[Y*GW+X]*wgt;c+=wgt}o[y*GW+x]=s/c}return o}
const dist=(a,b)=>{let s=0;for(let i=0;i<a.length;i++)s+=Math.abs(a[i]-b[i]);return s};

// ---------- variants and search ----------
const variants={};
for(const k of keys){
 const base=LETTERS[k],list=[];
 const add=(name,s,dot)=>{const ss=dot?[...s,D(base.w-.02,-.02,.07)]:s;list.push({name,s:ss,ink:inkLength(ss),r:blur(raster(ss,base.w))})};
 add("origin",base.s);
 const m=mirror(base.s,base.w),same=JSON.stringify(raster(m,base.w))===JSON.stringify(raster(base.s,base.w));
 if(!same)add("mirrored",m);
 const hasDot=base.s.some(st=>st.t==="D"); // a letter that already has a dot never gets a second one
 if(!hasDot)add("origin+dot",base.s,true);
 if(!same&&!hasDot)add("mirrored+dot",m,true);
 variants[k]=list;
}
const f=Object.fromEntries(keys.map(k=>[k,FREQ[k]/100]));
const SIGMA=40,LAMBDA=.004,MU=.0006,DOT=.004; // DOT: an added dot clutters text, so it must buy a lot of legibility
const choice=Object.fromEntries(keys.map(k=>[k,0]));
function cost(){
 let c=0;
 for(let i=0;i<keys.length;i++)for(let j=i+1;j<keys.length;j++){const a=variants[keys[i]][choice[keys[i]]],b=variants[keys[j]][choice[keys[j]]];c+=f[keys[i]]*f[keys[j]]*Math.exp(-dist(a.r,b.r)/SIGMA)}
 for(const k of keys){const v=variants[k][choice[k]];c+=LAMBDA*f[k]*v.ink;const wantMirror=PC[k][2]>.5;if(v.name.startsWith("mirrored")!==wantMirror)c+=MU;if(v.name.endsWith("dot"))c+=DOT}
 return c;
}
let best=cost(),improved=true,rounds=0;
while(improved&&rounds<20){improved=false;rounds++;
 for(const k of keys){const cur=choice[k];for(let v=0;v<variants[k].length;v++){if(v===cur)continue;choice[k]=v;const c=cost();if(c<best-1e-12){best=c;improved=true}else choice[k]=cur;if(choice[k]===v)break}}
}
// Report the closest pairs after the search
const pairs=[];for(let i=0;i<keys.length;i++)for(let j=i+1;j<keys.length;j++){const a=keys[i],b=keys[j];pairs.push([a+b,+dist(variants[a][choice[a]].r,variants[b][choice[b]].r).toFixed(1)])}
pairs.sort((a,b)=>a[1]-b[1]);

// Terminals from PC1, corners from PC2
const glyphs=Object.fromEntries(keys.map(k=>{const v=variants[k][choice[k]],[p1,p2,p3]=PC[k];
 return[k,{origin:LETTERS[k].o,meaning:LETTERS[k].m,w:LETTERS[k].w,variant:v.name,pc:PC[k],terminal:p1>.33?"ball":p1<-.33?"flared":"plain",corner:p2>0?"round":"sharp",strokes:v.s}]}));
const out={version:"0.1",method:"21 features per letter (form, sound, ancestral meaning, frequency) → 3 principal components → pictograph skeletons → frequency-weighted legibility search",
 explained:comps.map(c=>+(c.lam/totalVar).toFixed(3)),cost:+best.toFixed(6),closest:pairs.slice(0,5),glyphs};
fs.writeFileSync(new URL("./realm-script.json",import.meta.url),JSON.stringify(out));
console.log("explained variance",out.explained,"cost",out.cost,"rounds",rounds);
console.log("closest pairs",out.closest);
console.log(keys.map(k=>`${k}:${glyphs[k].variant}/${glyphs[k].terminal}/${glyphs[k].corner}`).join(" "));
