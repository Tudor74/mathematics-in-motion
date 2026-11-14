/* Philosophy In Motion — scenes. Each scene: one thinker, one idea, one diagram you can watch and then try.
   Design note — the interaction chosen for each thinker, and why:
   Thales: swap the first principle (water, air, fire, roots, atoms) — philosophy begins as rival explanations.
   Confucius: widen the circles of the Great Learning — ethics radiates outward from the self.
   Buddha/Nagasena: take the chariot apart — the self as a name for parts.
   Zeno: add steps — infinitely many steps, finite sum.  Socrates: step through the Laches — definitions fall to counterexamples.
   Plato: lead the prisoner out.  Aristotle: test syllogisms; slide along the mean.  Zhuangzi: swap dreamer and dreamt.
   Eubulides: remove grains.  Nagarjuna: try the four corners.  Avicenna: switch off the senses.  Ockham: count entities.
   Descartes: peel doubt.  Hobbes: play the dilemma, then bring in the Leviathan.  Locke/Reid: cut memory links.
   Hume: observe swans.  Kant: put maxims through the test.  Wollstonecraft: give both the same education.
   Bentham & Mill: compare total, average and worst-off.  Kierkegaard: leap between spheres.  Nietzsche: answer the demon.
   Wittgenstein: compare games feature by feature.  Turing: hear the objections.  Sartre & de Beauvoir: knife vs person.
   Foot & Thomson: switch vs footbridge.  Gettier: toggle J, T, B and luck.  Rawls: choose behind the veil, then lift it.
   Searle: be the person in the room.  Jackson: open Mary's door.  Singer: move the child further away.
   Chalmers: sort easy from hard.  Nussbaum: secure each capability.  Bostrom: set the trilemma's numbers.  Timeline: scrub. */
const STAGES=[{id:'ancient',name:'Ancient worlds'},{id:'medieval',name:'Medieval & early modern'},{id:'enlight',name:'Enlightenment'},{id:'c19',name:'Nineteenth century'},{id:'c20',name:'Twentieth century'},{id:'today',name:'Turn of the century'},{id:'now',name:'2006 to now'}];
const SCENES=[];const add=o=>SCENES.push(o);
const chips=(key,list,cur,lab=x=>x)=>`<div class="row">${list.map((x,i)=>`<button type="button" class="chip" data-${key}="${i}" aria-pressed="${cur===i}">${esc(lab(x))}</button>`).join('')}</div>`;
const bindChips=(root,key,s,prop,re)=>root.querySelectorAll(`[data-${key}]`).forEach(b=>b.onclick=()=>{s[prop]=+b.dataset[key];root.querySelectorAll(`[data-${key}]`).forEach(x=>x.setAttribute('aria-pressed',String(+x.dataset[key]===s[prop])));re()});
function wrap(x,y,txt,chars,size,fill,o={}){const words=String(txt).split(' ');let line='',out='',n=0;for(const w of words){if((line+' '+w).trim().length>chars){out+=T(x,y+n*size*1.35,line.trim(),Object.assign({size,fill},o));n++;line=w}else line+=' '+w}if(line.trim())out+=T(x,y+n*size*1.35,line.trim(),Object.assign({size,fill},o));return out}
const box=(x,y,w,h,txt,o={})=>`<g opacity="${f2(o.op==null?1:o.op)}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r||10}" fill="${o.fill||'#fff'}" stroke="${o.stroke||C.line}" stroke-width="${o.sw||1.8}"/>${wrap(x+w/2,y+(o.ty||h/2+5-((Math.ceil(String(txt).length/(o.chars||Math.floor(w/7.2)))-1)*(o.size||13)*.67)),txt,o.chars||Math.floor(w/7.2),o.size||13,o.tc||C.ink,{anchor:'middle',weight:o.weight||500})}</g>`;
const arrow=(x1,y1,x2,y2,col=C.ink,w=2,op=1,dash='')=>{const a=Math.atan2(y2-y1,x2-x1),h=9;return `<g opacity="${f2(op)}"><line x1="${f2(x1)}" y1="${f2(y1)}" x2="${f2(x2)}" y2="${f2(y2)}" stroke="${col}" stroke-width="${w}" ${dash?`stroke-dasharray="${dash}"`:''}/><path d="M${f2(x2)} ${f2(y2)} L${f2(x2-h*Math.cos(a-.4))} ${f2(y2-h*Math.sin(a-.4))} L${f2(x2-h*Math.cos(a+.4))} ${f2(y2-h*Math.sin(a+.4))} Z" fill="${col}"/></g>`};
function person(x,y,col,sc=1,op=1){return `<g opacity="${f2(op)}"><circle cx="${f2(x)}" cy="${f2(y-30*sc)}" r="${f2(13*sc)}" fill="${col}"/><path d="M${f2(x-20*sc)} ${f2(y+10*sc)} q${f2(20*sc)} ${f2(-46*sc)} ${f2(40*sc)} 0 z" fill="${col}"/></g>`}
const head=(name,dates,work)=>T(20,26,name,{size:15,weight:700})+T(20,44,dates+(work?' · '+work:''),{size:11.5,fill:C.muted});

/* ============ ANCIENT ============ */
const ARCHE=[['Thales','water','c. 624–546 BCE','Water nourishes, freezes, flows and evaporates: one stuff in many forms.',C.blue],
 ['Anaximenes','air','c. 586–526 BCE','Air thickens into cloud, water and earth; thins into fire.',C.muted],
 ['Heraclitus','fire','c. 535–475 BCE','Everything changes like a flame: constant flux held in balance.',C.coral],
 ['Empedocles','four roots','c. 494–434 BCE','Earth, water, air and fire, mixed by Love and separated by Strife.',C.green],
 ['Democritus','atoms and void','c. 460–370 BCE','Tiny uncuttable bits moving in empty space make up everything.',C.purple]];
add({stage:'ancient',thinker:'Thales',term:'Thales: what is everything made of?',
 def:`In the Greek city of Miletus, Thales is said to have claimed that everything comes from water. The answer was wrong, but the question was new: explain the world by a ${W('arche','first principle')} rather than by the moods of gods.`,
 ex:'His successors argued back — air, fire, four elements, atoms. Philosophy and science began as this chain of rival explanations, each criticising the last.',
 src:'<b>Thales</b> of Miletus, c. 624–546 BCE. No writings survive; we know his views through Aristotle. Herodotus says he predicted a solar eclipse, usually dated 585 BCE.',
 phases:['Many things: rivers, rocks, breath, flame.','Thales: they are all, at bottom, water.','His successors propose air, fire, four roots, atoms.','Try it: compare the first principles.'],
 init:()=>({k:0}),anim:p=>({k:Math.min(4,Math.floor(p*5)),p}),
 draw(p,s){const a=ARCHE[s.k];let g=head(a[0],a[2],'');const cx=300,cy=190;
  const things=['river','stone','breath','flame','tree','cloud','bone','star'];things.forEach((t,i)=>{const ang=i/things.length*TAU-Math.PI/2,r=135;const x=cx+Math.cos(ang)*r*1.35,y=cy+Math.sin(ang)*r*.9;g+=arrow(x,y,cx+Math.cos(ang)*58,cy+Math.sin(ang)*48,a[4],1.6,.55)+box(x-38,y-14,76,28,t,{size:12})});
  g+=`<circle cx="${cx}" cy="${cy}" r="56" fill="${a[4]}" opacity=".9"/>`+T(cx,cy+6,a[1],{size:16,anchor:'middle',fill:'#fff',weight:700});
  g+=wrap(300,358,a[3],80,13,C.ink,{anchor:'middle'});return g},
 tryUI:s=>({html:chips('a',ARCHE,s.k,x=>x[0]+': '+x[1]),bind(q,re,root){bindChips(root,'a',s,'k',re)}})
});
const GL=['the self','the family','the state','all under Heaven'];
add({stage:'ancient',thinker:'Confucius',term:'Confucius: ethics in widening circles',
 def:`For Confucius, a good life is built from relationships done well. Cultivate ${W('ren','humaneness')} and proper conduct in yourself, and it spreads outward: to family, to the state, to the world.`,
 ex:'His version of the Golden Rule is put negatively: “Do not impose on others what you yourself do not desire.” (Analects 15.24)',
 src:'<b>Confucius</b> (Kong Qiu), 551–479 BCE, Lu, China. The <i>Analects</i> were compiled by his followers; the widening circles come from the Confucian classic <i>The Great Learning</i>.',
 phases:['It starts with cultivating the self.','A cultivated person regulates the family well.','Well-ordered families make a well-governed state.','And peace spreads to “all under Heaven”. Try it: widen the circle.'],
 init:()=>({k:3}),anim:p=>({k:Math.min(3,Math.floor(p*4)),p}),
 draw(p,s){let g=head('Confucius','551–479 BCE','Analects; The Great Learning');const cx=300,cy=200;
  for(let i=3;i>=0;i--){const on=i<=s.k;g+=`<circle cx="${cx}" cy="${cy}" r="${36+i*42}" fill="${on?['#f6ecd6','#efe0bd','#e7d3a4','#dfc68c'][3-i]:'#f7f7f7'}" stroke="${on?C.gold:C.grid}" stroke-width="${i===s.k?3:1.4}"/>`+T(cx,cy-(36+i*42)+18,GL[i],{size:13,anchor:'middle',weight:i===s.k?700:500,fill:on?C.ink:C.muted})}
  g+=T(cx,cy+6,'仁',{size:28,anchor:'middle',fill:C.gold,weight:700});return g},
 tryUI:s=>({html:chips('c',GL,s.k),bind(q,re,root){bindChips(root,'c',s,'k',re)},out:s=>['Begin with your own conduct and sincerity.','Filial piety and care within the household.','Rulers govern by virtue and example, not only by punishment.','Harmony spreads from the inside out.'][s.k]})
});
const CHARIOT=['wheels','axle','frame','yoke','reins','pole'];
add({stage:'ancient',thinker:'The Buddha',term:'The Buddha: no fixed self',
 def:`The Buddha taught ${W('anatta','not-self')}: what we call a person is a changing bundle of body, feelings, perceptions, mental formations and consciousness, with no unchanging owner underneath. Seeing this loosens the grip of craving and suffering.`,
 ex:'In the Questions of King Milinda, the monk Nāgasena asks: is the chariot the wheels? The axle? The frame? None of them alone — “chariot” is a convenient name for parts working together. So is “Nāgasena”.',
 src:'<b>Siddhārtha Gautama, the Buddha</b>, c. 5th century BCE (dates debated), northern India. The chariot dialogue is in the <i>Milindapañha</i>, c. 1st century BCE.',
 phases:['A chariot, complete.','Is the chariot the wheels? Remove them: still parts, no chariot found.','Each part checked: none is “the chariot”.','The name points to an arrangement, not a hidden extra thing. Try it: take it apart.'],
 init:()=>({gone:[false,false,false,false,false,false]}),anim:p=>({gone:CHARIOT.map((_,i)=>p>.2+i*.1),p}),
 draw(p,s){let g=head('The Buddha · Nāgasena','c. 5th century BCE','Milindapañha');const on=i=>!s.gone[i];const col=i=>on(i)?C.ink:'#d5dde2';
  g+=`<rect x="200" y="150" width="180" height="70" rx="8" fill="${on(2)?'#e7d3a4':'none'}" stroke="${col(2)}" stroke-width="3" ${on(2)?'':'stroke-dasharray="5 5"'}/>`;
  [[230,240],[350,240]].forEach(([x,y])=>{g+=`<circle cx="${x}" cy="${y}" r="38" fill="none" stroke="${col(0)}" stroke-width="5" ${on(0)?'':'stroke-dasharray="5 5"'}/>`;for(let k=0;k<6;k++){const a=k/6*TAU;g+=`<line x1="${x}" y1="${y}" x2="${f2(x+Math.cos(a)*36)}" y2="${f2(y+Math.sin(a)*36)}" stroke="${col(0)}" stroke-width="2"/>`}});
  g+=`<line x1="230" y1="240" x2="350" y2="240" stroke="${col(1)}" stroke-width="5" ${on(1)?'':'stroke-dasharray="5 5"'}/><line x1="380" y1="185" x2="500" y2="165" stroke="${col(5)}" stroke-width="4" ${on(5)?'':'stroke-dasharray="5 5"'}/><path d="M500 150 q20 15 0 30" fill="none" stroke="${col(3)}" stroke-width="5"/><path d="M380 160 q60 -50 120 -10" fill="none" stroke="${col(4)}" stroke-width="2"/>`;
  const left=s.gone.filter(x=>!x).length;g+=T(300,330,left===6?'“the chariot”':left===0?'parts, but where is the chariot?':`${left} of 6 parts — is it still a chariot?`,{size:15,anchor:'middle',weight:700,fill:left===6?C.ink:C.purple});return g},
 tryUI:s=>({html:`<div class="row">${CHARIOT.map((c,i)=>`<button type="button" class="chip" data-g="${i}" aria-pressed="${!s.gone[i]}">${c}</button>`).join('')}</div><p class="out" id="tout"></p>`,bind(q,re,root){root.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{const i=+b.dataset.g;s.gone[i]=!s.gone[i];b.setAttribute('aria-pressed',String(!s.gone[i]));re()})},out:s=>'Click parts to remove or restore them. At what point does the chariot stop existing — and was it ever more than the parts?'})
});
add({stage:'ancient',thinker:'Zeno',term:'Zeno: Achilles and the tortoise',
 def:`Achilles gives a tortoise a head start. By the time he reaches where it was, it has moved on; by the time he reaches that point, it has moved again — forever. So, Zeno argued, he can never catch it, and motion is an illusion.`,
 ex:'The usual modern answer: infinitely many steps can take a finite time, because the step times shrink. If each step takes half as long as the last, 1 + ½ + ¼ + … adds up to exactly 2.',
 src:'<b>Zeno of Elea</b>, c. 490–430 BCE, defending his teacher Parmenides’ view that change is impossible. The paradoxes are reported by Aristotle (<i>Physics</i> VI). Convergent series were made rigorous in the 19th century.',
 phases:['Achilles runs twice as fast; the tortoise starts ahead.','Step 1: Achilles reaches the start; the tortoise has moved on.','The gaps halve again and again …','… and the times add up to 2. Try it: add more steps.'],
 init:()=>({n:5}),anim:p=>({n:Math.round(lerp(0,12,seg(p,.1,.9))),p}),
 draw(p,s){let g=head('Zeno of Elea','c. 490–430 BCE','reported in Aristotle, Physics');const X=x=>60+x*240;let ach=0,tor=1,tsum=0;const steps=[];for(let i=0;i<s.n;i++){const dt=Math.pow(.5,i);tsum+=dt;steps.push([ach,tor]);ach=tor;tor=1+tsum/2}
  g+=`<line x1="40" y1="160" x2="580" y2="160" stroke="${C.ink}" stroke-width="2"/>`;for(let x=0;x<=2;x+=.5)g+=`<line x1="${X(x)}" y1="155" x2="${X(x)}" y2="165" stroke="${C.ink}"/>`+T(X(x),182,x+' m',{size:11,anchor:'middle',fill:C.muted});
  steps.forEach(([a,b],i)=>{g+=`<line x1="${f2(X(a))}" y1="${130-i*4}" x2="${f2(X(b))}" y2="${130-i*4}" stroke="${C.purple}" stroke-width="3" opacity="${f2(1-i*.06)}"/>`});
  g+=`<circle cx="${f2(X(ach))}" cy="150" r="9" fill="${C.blue}"/>`+T(X(ach),104-s.n*4,'Achilles',{size:12,anchor:'middle',fill:C.blue,weight:700})+`<ellipse cx="${f2(X(tor))}" cy="152" rx="12" ry="7" fill="${C.green}"/>`+T(X(tor)+16,150,'tortoise',{size:12,fill:C.green,weight:700});
  const vals=Array.from({length:12},(_,i)=>i<s.n?Math.pow(.5,i):0);g+=bars(vals,60,330,480,90,C.coral,i=>i===0?'1':'½^'+i);
  g+=T(560,224,`time so far: ${tsum.toFixed(5)} → 2`,{size:13.5,anchor:'end',weight:700})+T(560,242,`gap left: ${(tor-ach).toFixed(5)} m`,{size:12,anchor:'end',fill:C.muted});return g},
 tryUI:s=>({html:`<div class="row"><label>Steps <input type="range" id="zn" min="0" max="12" value="${s.n}"></label></div><p class="out" id="tout"></p>`,bind(q,re){q('#zn').oninput=e=>{s.n=+e.target.value;re()}},out:s=>`After ${s.n} steps the gap is ${Math.pow(.5,s.n).toFixed(5)} m. Infinitely many steps, but they all fit before time 2.`})
});
const LACHES=[['Laches','Courage is standing firm in battle and not running away.','But some armies fight by retreating, and people show courage in illness, poverty and politics too.'],
 ['Laches','Then courage is a kind of endurance of the soul.','But foolish endurance — holding on when it is pointless — is not admirable, and courage is.'],
 ['Laches','Then courage is wise endurance.','But someone who endures because they know they will win shows less courage than someone who does not know.'],
 ['Nicias','Courage is knowledge of what is to be feared and what is not.','But that knowledge would cover all good and evil — it becomes the whole of virtue, not courage alone.']];
add({stage:'ancient',thinker:'Socrates',term:'Socrates: the question that will not let go',
 def:`Socrates wrote nothing; he asked. In the ${W('elenchus','elenchus')}, he asks for a definition, finds a counterexample, and asks again — until the confident speaker admits they did not know what they thought they knew.`,
 ex:'In Plato’s Laches, two generals try to define courage. Every answer falls to a counterexample, and the dialogue ends in puzzlement (aporia) — which Socrates treated as progress.',
 src:'<b>Socrates</b>, c. 470–399 BCE, Athens; executed for impiety and corrupting the young. Known through Plato, Xenophon and others. The dialogue here is Plato’s <i>Laches</i>.',
 phases:['A confident definition.','A counterexample.','A revised definition — and another counterexample.','Aporia: honest not-knowing. Try it: step through the dialogue.'],
 init:()=>({k:3}),anim:p=>({k:Math.min(3,Math.floor(p*4)),p}),
 draw(p,s){let g=head('Socrates','c. 470–399 BCE','in Plato’s Laches');for(let i=0;i<=s.k;i++){const y=62+i*70,[who,claim,counter]=LACHES[i];
  g+=box(20,y,270,56,`${who}: “${claim}”`,{size:11.5,chars:44,fill:'#fff',stroke:C.blue})+arrow(292,y+28,312,y+28,C.coral,2)+box(314,y,266,56,`Socrates: ${counter}`,{size:11.5,chars:44,fill:C.coralp,stroke:C.coral})}
  if(s.k===3)g+=T(300,370,'aporia — “we have not found what courage is”',{size:13,anchor:'middle',weight:700,fill:C.purple});return g},
 tryUI:s=>({html:chips('l',LACHES,s.k,(x)=>'Definition '+(LACHES.indexOf(x)+1)),bind(q,re,root){bindChips(root,'l',s,'k',re)}})
});
const CAVE=['Chained, watching shadows','Turned towards the fire','Dragged up into daylight','Seeing the sun itself','Returning to the cave'];
add({stage:'ancient',thinker:'Plato',term:'Plato: the allegory of the cave',
 def:`Prisoners chained since birth see only shadows cast on a wall, and take them for reality. One is freed, turned to the fire, dragged out into the sun — painful at every step — and finally sees things as they are. For Plato, education is this turning of the soul towards the ${W('forms','Forms')}.`,
 ex:'When the freed prisoner returns to tell the others, his eyes no longer suit the dark; they laugh at him, and might even kill him — a nod to the fate of Socrates.',
 src:'<b>Plato</b>, c. 428–348 BCE, Athens; founded the Academy. The cave is in <i>Republic</i> Book VII, c. 375 BCE.',
 phases:['Shadows on the wall are all the prisoners know.','Turned around: the fire and the puppets behind them.','Up the steep path into blinding daylight.','At last, the sun — the source of light, as the Good is of truth. Try it: lead the prisoner.'],
 init:()=>({k:0}),anim:p=>({k:Math.min(3,Math.floor(p*4)),p}),
 draw(p,s){let g=head('Plato','c. 428–348 BCE','Republic, Book VII');g+=`<path d="M20 360 L20 120 Q180 90 360 130 L360 360 Z" fill="#3b3430"/><path d="M360 130 L420 80 L580 60 L580 360 L360 360 Z" fill="${s.k>=2?'#fdf3cf':'#e9e4d6'}"/>`;
  g+=`<rect x="30" y="170" width="20" height="160" fill="#5a504a"/>`;const fire=`<path d="M250 300 q12 -40 22 0 q10 -26 16 0 z" fill="#f2a33a"/>`;g+=fire+`<line x1="150" y1="280" x2="320" y2="280" stroke="#7a6d64" stroke-width="3"/><rect x="200" y="258" width="18" height="22" fill="#7a6d64"/><circle cx="240" cy="262" r="9" fill="#7a6d64"/>`;
  g+=`<rect x="34" y="215" width="14" height="22" fill="#1e1a17" opacity=".8"/><circle cx="41" cy="205" r="9" fill="#1e1a17" opacity=".8"/>`;
  if(s.k>=3)g+=`<circle cx="520" cy="110" r="30" fill="#f6c84c"/>`;
  const pos=[[110,320],[230,320],[400,250],[480,250],[140,320]][s.k];for(let i=0;i<3;i++){if(s.k>=1&&i===0)continue;g+=person(90+i*30,330,'#a3958a',.6)}
  g+=person(pos[0],pos[1],C.coral,.65);g+=T(300,380,CAVE[s.k],{size:14,anchor:'middle',weight:700,fill:'#fff'});return g},
 tryUI:s=>({html:chips('v',CAVE,s.k),bind(q,re,root){bindChips(root,'v',s,'k',re)},out:s=>['The shadows are their whole world; naming them wins prizes.','The fire hurts the eyes; the shadows seem more real than the objects.','Dazzled: at first he can only look at reflections.','He understands the sun as the cause of seasons and of all he once saw.','His eyes fail in the dark; the others think the journey ruined him.'][s.k]})
});
const SYL=[{p:['All humans are mortal.','Socrates is a human.'],c:'So Socrates is mortal.',v:true,t:true,note:'Valid and sound: the form guarantees the conclusion, and the premises are true.'},
 {p:['All fish can fly.','A salmon is a fish.'],c:'So a salmon can fly.',v:true,t:false,note:'Valid but unsound: same form, so the conclusion follows — but a premise is false.'},
 {p:['All cats are mammals.','Rex is a mammal.'],c:'So Rex is a cat.',v:false,t:true,note:'Invalid: true premises, yet the conclusion does not follow (Rex is a dog).'}];
add({stage:'ancient',thinker:'Aristotle',term:'Aristotle: valid arguments',
 def:`Aristotle was the first to study the ${W('valid','form')} of arguments. A valid argument is one where, if the premises are true, the conclusion cannot be false. Validity is about structure; whether the premises are actually true is a separate question — together they make an argument ${W('sound','sound')}.`,
 ex:'“All A are B; x is A; so x is B” is valid whatever A, B and x are. Swap the second premise for “x is B” and it becomes invalid.',
 src:'<b>Aristotle</b>, 384–322 BCE, student of Plato and tutor of Alexander. The syllogism is set out in the <i>Prior Analytics</i>; his logic dominated for two thousand years.',
 phases:['Two premises.','A conclusion drawn from them.','Check the form: could the premises be true and the conclusion false?','Then check the premises. Try it: test three arguments.'],
 init:()=>({k:2}),anim:p=>({k:0,p}),
 draw(p,s){const a=SYL[s.k],o=s.p!=null?p:1;let g=head('Aristotle','384–322 BCE','Prior Analytics');
  a.p.forEach((t,i)=>{g+=box(120,70+i*62,360,48,t,{op:seg(o,i*.15,i*.15+.12),size:14})});g+=`<line x1="120" y1="${200}" x2="480" y2="200" stroke="${C.ink}" stroke-width="2" opacity="${f2(seg(o,.3,.4))}"/>`+box(120,212,360,48,a.c,{op:seg(o,.35,.45),size:14,stroke:C.purple});
  const sh=seg(o,.6,.75);g+=`<g opacity="${f2(sh)}">${box(60,284,220,40,a.v?'✓ valid form':'✗ invalid form',{fill:a.v?C.greenp:C.coralp,stroke:a.v?C.green:C.coral,weight:700})}${box(320,284,220,40,a.t?'✓ premises true':'✗ a premise is false',{fill:a.t?C.greenp:C.coralp,stroke:a.t?C.green:C.coral,weight:700,op:seg(o,.75,.9)})}</g>`;
  g+=wrap(300,352,a.note,86,12.5,C.ink,{anchor:'middle',op:seg(o,.85,1)});return g},
 tryUI:s=>({html:chips('y',SYL,s.k,x=>x.c),bind(q,re,root){bindChips(root,'y',s,'k',re)}})
});
const MEANS=[['Courage','cowardice','rashness','fear and confidence'],['Temperance','insensibility','self-indulgence','bodily pleasures'],['Generosity','meanness','wastefulness','giving money'],['Good temper','spiritlessness','irascibility','anger'],['Truthfulness','false modesty','boastfulness','talking about oneself']];
add({stage:'ancient',thinker:'Aristotle',term:'Aristotle: virtue as a mean',
 def:`For Aristotle, a ${W('virtue','virtue')} is a settled character trait that hits the right point between two vices — one of too little, one of too much. Courage sits between cowardice and rashness. The aim is ${W('eudaimonia','eudaimonia')}: living and doing well.`,
 ex:'The mean is not a mathematical midpoint, and it is relative to us and the situation: the right amount of confidence for a soldier differs from that for a surgeon. Practical wisdom finds it.',
 src:'<b>Aristotle</b>, <i>Nicomachean Ethics</i>, Book II (c. 340 BCE). Virtues are built by practice: “we become just by doing just acts”.',
 phases:['Too little: a vice of deficiency.','Too much: a vice of excess.','In between: the virtue.','Try it: slide along each scale.'],
 init:()=>({k:0,v:0}),anim:p=>({k:0,v:p<.33?-.85:p<.66?.85:0,p}),
 draw(p,s){const m=MEANS[s.k];let g=head('Aristotle','384–322 BCE','Nicomachean Ethics');const x0=60,x1=540,y=200,X=v=>lerp(x0,x1,(v+1)/2);
  g+=`<defs><linearGradient id="mg" x1="0" x2="1"><stop offset="0" stop-color="${C.blue}"/><stop offset=".5" stop-color="${C.green}"/><stop offset="1" stop-color="${C.coral}"/></linearGradient></defs><rect x="${x0}" y="${y-8}" width="${x1-x0}" height="16" rx="8" fill="url(#mg)" opacity=".35"/>`;
  g+=T(x0,y+40,m[1],{size:14,weight:700,fill:C.blue})+T(300,y+40,m[0],{size:15,anchor:'middle',weight:700,fill:C.green})+T(x1,y+40,m[2],{size:14,anchor:'end',weight:700,fill:C.coral})+T(300,y-60,'concerning '+m[3],{size:13,anchor:'middle',fill:C.muted});
  g+=`<circle cx="${f2(X(s.v))}" cy="${y}" r="16" fill="#fff" stroke="${C.ink}" stroke-width="3"/>`;const lab=Math.abs(s.v)<.25?'virtue':s.v<0?'deficiency':'excess';g+=T(X(s.v),y-26,lab,{size:13,anchor:'middle',weight:700});return g},
 tryUI:s=>({html:chips('m',MEANS,s.k,x=>x[0])+`<div class="row"><label>Too little ↔ too much <input type="range" id="mv" min="-1" max="1" step="0.01" value="${s.v}"></label></div>`,bind(q,re,root){bindChips(root,'m',s,'k',re);q('#mv').oninput=e=>{s.v=+e.target.value;re()}}})
});
add({stage:'ancient',thinker:'Zhuangzi',term:'Zhuangzi: the butterfly dream',
 def:'Zhuangzi dreamt he was a butterfly, happily fluttering, not knowing he was Zhuangzi. He woke — and was Zhuangzi. But was he Zhuangzi who had dreamt of being a butterfly, or a butterfly now dreaming it was Zhuangzi?',
 ex:'Zhuangzi uses the story less to prove scepticism than to loosen fixed distinctions: the boundaries we draw between self and other, waking and dreaming, are less certain than they feel. He calls this “the transformation of things”.',
 src:'<b>Zhuangzi</b> (Zhuang Zhou), c. 369–286 BCE, China; a founding figure of Daoism with Laozi. The story ends chapter 2 of the <i>Zhuangzi</i>.',
 phases:['Zhuangzi, asleep.','A butterfly, fluttering, knowing nothing of Zhuangzi.','Awake: which was the dream?','Try it: swap dreamer and dreamt.'],
 init:()=>({k:0}),anim:p=>({k:p<.5?0:1,p}),
 draw(p,s){let g=head('Zhuangzi','c. 369–286 BCE','Zhuangzi, chapter 2');const t=s.p!=null?p*4:performance.now()/1000;
  const fly=(x,y,sc,op)=>`<g opacity="${f2(op)}" transform="translate(${f2(x)} ${f2(y+Math.sin(t*3)*6)}) scale(${sc})"><ellipse cx="-14" cy="-6" rx="16" ry="11" fill="${C.purple}"/><ellipse cx="14" cy="-6" rx="16" ry="11" fill="${C.purple}"/><ellipse cx="-11" cy="10" rx="10" ry="8" fill="${C.coral}"/><ellipse cx="11" cy="10" rx="10" ry="8" fill="${C.coral}"/><rect x="-2" y="-16" width="4" height="32" rx="2" fill="${C.ink}"/></g>`;
  const big=s.k===0;g+=`<circle cx="${big?180:420}" cy="210" r="${big?110:60}" fill="#eef3f6" stroke="${C.grid}"/>`+`<circle cx="${big?420:180}" cy="210" r="${big?60:110}" fill="${C.purplep}" stroke="${C.purple}" stroke-dasharray="6 5"/>`;
  g+=person(big?180:420,240,C.ink,big?1.2:.6)+fly(big?420:180,200,big?.8:1.6,1);g+=T(big?180:420,350,big?'dreamer':'dreamt?',{size:13,anchor:'middle',fill:C.muted})+T(big?420:180,350,big?'dreamt?':'dreamer',{size:13,anchor:'middle',fill:C.purple});
  g+=arrow(big?290:240,150,big?370:360,150,C.purple,2,.6,'5 4');return g},
 live:true,
 tryUI:s=>({html:chips('z',['Zhuangzi dreams a butterfly','A butterfly dreams Zhuangzi'],s.k),bind(q,re,root){bindChips(root,'z',s,'k',re)},out:()=>'From the inside, both stories feel the same. Descartes would later use dreaming as a reason for doubt; Zhuangzi uses it as a reason for openness.'})
});
add({stage:'ancient',thinker:'Eubulides',term:'Eubulides: the heap',
 def:`One grain of sand is not a heap. Adding a single grain never turns a non-heap into a heap. So, step by step, a million grains is not a heap either — yet obviously it is. This is the ${W('sorites','sorites paradox')}: a puzzle about ${W('vague','vague')} words.`,
 ex:'Philosophers still disagree: there is a sharp line we cannot know (epistemicism); “heap” is true by degrees; or borderline cases are neither true nor false (supervaluationism).',
 src:'<b>Eubulides of Miletus</b>, 4th century BCE, Megarian school; also credited with the Liar paradox (“what I am saying is false”).',
 phases:['A large heap.','Take away one grain: still a heap.','Again and again …','Somewhere it stopped being a heap — but where? Try it: remove grains.'],
 init:()=>({n:300,view:1}),anim:p=>({n:Math.round(Math.exp(lerp(Math.log(5000),0,smooth(p)))),view:1,p}),
 draw(p,s){let g=head('Eubulides','4th century BCE','Megarian school');const shown=Math.min(s.n,900);let k=0;for(let row=0;k<shown;row++){const w=Math.max(1,30-row);for(let i=0;i<w&&k<shown;i++,k++){const x=300+(i-w/2)*7+((row%2)*3.5),y=250-row*6;g+=`<circle cx="${f2(x)}" cy="${f2(y)}" r="2.6" fill="${C.gold}"/>`}}
  g+=T(300,280,s.n.toLocaleString('en-GB')+(s.n===1?' grain':' grains'),{size:15,anchor:'middle',weight:700});
  const x0=60,w=480,X=n=>x0+w*Math.log10(Math.max(1,n))/4,y=330;g+=`<line x1="${x0}" y1="${y}" x2="${x0+w}" y2="${y}" stroke="${C.ink}"/>`;[1,10,100,1000,10000].forEach(n=>{g+=T(X(n),y+18,n.toLocaleString('en-GB'),{size:10.5,anchor:'middle',fill:C.muted})});
  if(s.view===0){const cut=X(137);g+=`<line x1="${cut}" y1="${y-26}" x2="${cut}" y2="${y+4}" stroke="${C.coral}" stroke-width="3"/>`+T(cut,y-30,'a sharp line we cannot know',{size:11.5,anchor:'middle',fill:C.coral})}
  else if(s.view===1){let d='';for(let i=0;i<=100;i++){const n=Math.pow(10,i/25),v=1/(1+Math.exp(-(Math.log10(n)-2.1)*5));d+=(i?'L':'M')+f2(X(n))+' '+f2(y-v*40)}g+=P(d,C.purple,2.5)+T(x0+w,y-46,'“heap” true by degrees',{size:11.5,anchor:'end',fill:C.purple})}
  else{g+=`<rect x="${X(30)}" y="${y-30}" width="${X(1500)-X(30)}" height="30" fill="${C.grid}" opacity=".7"/>`+T((X(30)+X(1500))/2,y-12,'borderline: neither true nor false',{size:11.5,anchor:'middle'})}
  g+=`<circle cx="${f2(X(s.n))}" cy="${y}" r="7" fill="${C.ink}"/>`;return g},
 tryUI:s=>({html:`<div class="row"><label>Grains <input type="range" id="sn" min="0" max="4" step="0.01" value="${Math.log10(Math.max(1,s.n))}"></label></div>`+chips('w',['Sharp hidden line','Degrees of truth','Borderline gap'],s.view),bind(q,re,root){q('#sn').oninput=e=>{s.n=Math.round(Math.pow(10,+e.target.value));re()};bindChips(root,'w',s,'view',re)}})
});
const TETRA=['It exists','It does not exist','It both exists and does not','It neither exists nor does not'];
add({stage:'ancient',thinker:'Nāgārjuna',term:'Nāgārjuna: the four corners',
 def:`Indian logic offered four options for any claim — it is, it is not, both, neither: the ${W('catuskoti','tetralemma')}. Nāgārjuna showed that, for questions about the ultimate nature of things, all four fail. Things are ${W('emptiness','empty')}: they have no independent essence, but arise in dependence on other things.`,
 ex:'Emptiness is not nothingness. A table exists — conventionally — through wood, makers, use and the concept “table”. What does not exist is a table-essence standing on its own.',
 src:'<b>Nāgārjuna</b>, c. 150–250 CE, India; founder of the Madhyamaka (“Middle Way”) school of Buddhist philosophy. Main work: <i>Mūlamadhyamakakārikā</i>.',
 phases:['A claim about ultimate reality.','Corner one, two: it is; it is not.','Corners three, four: both; neither.','All four rejected: the middle way of emptiness. Try it: test each corner.'],
 init:()=>({k:0}),anim:p=>({k:Math.min(3,Math.floor(p*4)),p}),
 draw(p,s){let g=head('Nāgārjuna','c. 150–250 CE','Mūlamadhyamakakārikā');const pos=[[150,120],[450,120],[150,290],[450,290]];
  pos.forEach(([x,y],i)=>{const tested=i<=s.k;g+=box(x-115,y-30,230,60,TETRA[i],{fill:tested?C.coralp:'#fff',stroke:tested?C.coral:C.line,weight:i===s.k?700:500});if(tested)g+=T(x+100,y-16,'✗',{size:20,anchor:'middle',fill:C.coral,weight:700})});
  g+=`<circle cx="300" cy="205" r="55" fill="${s.k===3?C.purplep:'#fff'}" stroke="${C.purple}" stroke-width="2"/>`+T(300,200,'empty:',{size:13,anchor:'middle',fill:C.purple,weight:700})+T(300,218,'dependent arising',{size:11.5,anchor:'middle',fill:C.purple});return g},
 tryUI:s=>({html:chips('t',TETRA,s.k),bind(q,re,root){bindChips(root,'t',s,'k',re)},out:s=>['If it existed by its own nature, it could never change or depend on anything — but it does.','If it simply did not exist, it could not appear, work or be talked about — but it does.','Contradictory: it cannot have both natures at once.','To deny both is still to take a position on its essence — and there is no essence to take a position on.'][s.k]})
});

/* ============ MEDIEVAL & EARLY MODERN ============ */
const SENSES=['sight','hearing','touch','smell and taste','limbs touching'];
add({stage:'medieval',thinker:'Avicenna',term:'Avicenna: the floating man',
 def:'Imagine a person created fully grown in empty space, eyes covered, limbs spread apart so they touch nothing, hearing nothing. They have no sensations at all. Would they know they exist? Avicenna says yes — so the self cannot be the body or the senses.',
 ex:'Six centuries later, Descartes reached a similar conclusion by doubting rather than imagining: whatever else is uncertain, the thinking self is not.',
 src:'<b>Ibn Sīnā (Avicenna)</b>, 980–1037, Persia; physician and philosopher. The thought experiment appears in the psychology section of <i>The Book of Healing</i> (Kitāb al-Shifāʾ).',
 phases:['A person, fully formed.','Sight and hearing cut off.','Touch, smell, taste — even the feeling of their own limbs — gone.','What remains: awareness that “I am”. Try it: switch off the senses.'],
 init:()=>({off:[true,true,true,true,true]}),anim:p=>({off:SENSES.map((_,i)=>p>.15+i*.13),p}),
 draw(p,s){let g=head('Ibn Sīnā (Avicenna)','980–1037','The Book of Healing');g+=`<rect x="0" y="54" width="600" height="326" fill="#e9eff5"/>`;const n=s.off.filter(x=>x).length;
  g+=person(300,235,C.ink,1.5,1-n*.08);SENSES.forEach((t,i)=>{const a=-Math.PI*.9+i*Math.PI*.45,x=300+Math.cos(a)*190,y=200+Math.sin(a)*120;g+=box(x-60,y-16,120,32,t,{size:12,fill:s.off[i]?'#eef1f3':C.greenp,stroke:s.off[i]?C.grid:C.green,tc:s.off[i]?'#9aa7ae':C.ink});if(!s.off[i])g+=`<line x1="${f2(x)}" y1="${f2(y)}" x2="300" y2="190" stroke="${C.green}" stroke-dasharray="4 4"/>`});
  g+=`<circle cx="300" cy="182" r="${f2(30+n*6)}" fill="none" stroke="${C.gold}" stroke-width="3" opacity="${f2(.3+n*.14)}"/>`+T(300,350,n===5?'no sensations — yet: “I am”':'senses still active: '+(5-n),{size:15,anchor:'middle',weight:700,fill:n===5?C.gold:C.muted});return g},
 tryUI:s=>({html:`<div class="row">${SENSES.map((t,i)=>`<button type="button" class="chip" data-o="${i}" aria-pressed="${!s.off[i]}">${t}</button>`).join('')}</div><p class="out" id="tout"></p>`,bind(q,re,root){root.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const i=+b.dataset.o;s.off[i]=!s.off[i];b.setAttribute('aria-pressed',String(!s.off[i]));re()})},out:()=>'Pressed means the sense is working. Turn them all off: does your sense of existing go with them?'})
});
const OCK=[['A mouse','mouse',1],['A ghost who moves things','ghost, spirit-world, ghost-physics',3],['Burglars who steal nothing, every night, unseen','burglars, motive, perfect stealth, nightly schedule',4]];
add({stage:'medieval',thinker:'Ockham',term:'Ockham’s razor',
 def:`When two explanations account for the evidence equally well, prefer the one that assumes less. Ockham put it as “plurality should never be posited without necessity” — the principle later called ${W('razor','Ockham’s razor')}.`,
 ex:'The razor is a guide, not a proof: sometimes the truth is complicated. It tells you where the burden of evidence lies.',
 src:'<b>William of Ockham</b>, c. 1287–1347, English Franciscan friar and logician. The popular wording “entities must not be multiplied beyond necessity” comes from later writers.',
 phases:['Evidence: scratching in the attic, crumbs disappearing.','Explanation 1 needs one thing.','The rivals need more and more extra things.','Shave them off unless the evidence demands them. Try it: compare explanations.'],
 init:()=>({k:0}),anim:p=>({k:Math.min(2,Math.floor(p*3)),p}),
 draw(p,s){let g=head('William of Ockham','c. 1287–1347','');g+=box(170,60,260,46,'Evidence: scratching at night; crumbs gone',{fill:'#fff8e6',stroke:C.gold});
  OCK.forEach((o,i)=>{const y=140+i*72,on=i===s.k;g+=box(40,y,250,52,o[0],{fill:on?C.purplep:'#fff',stroke:on?C.purple:C.line,weight:on?700:500});for(let k=0;k<o[2];k++)g+=`<circle cx="${320+k*44}" cy="${y+26}" r="16" fill="${i===0?C.green:C.coral}" opacity="${on?1:.4}"/>`;g+=T(500,y+31,o[2]+(o[2]>1?' assumptions':' assumption'),{size:12,fill:C.muted})});
  g+=`<path d="M310 ${140+s.k*72+60} l250 -0" stroke="${C.ink}" stroke-width="2" stroke-dasharray="2 4"/>`;return g},
 tryUI:s=>({html:chips('o',OCK,s.k,x=>x[0]),bind(q,re,root){bindChips(root,'o',s,'k',re)},out:s=>`Assumes: ${OCK[s.k][1]}. ${s.k===0?'Simplest — prefer it unless new evidence (say, a ghost on camera) appears.':'Each extra entity needs its own evidence.'}`})
});
const DOUBT=[['the senses','they sometimes deceive — a straight stick looks bent in water'],['the body and the world','I might be dreaming'],['even mathematics','an evil demon might deceive me whenever I add 2 and 3']];
add({stage:'medieval',thinker:'Descartes',term:'Descartes: doubt everything',
 def:'Descartes set out to doubt anything that could possibly be doubted, to find one certainty to build on. The senses, the world, even arithmetic fall. But doubting is thinking, and to think I must exist: “I think, therefore I am” — the cogito.',
 ex:'From that point, Descartes tried to rebuild knowledge, via a proof of God as a non-deceiver. Few accept that step; many still accept the cogito as a foothold.',
 src:'<b>René Descartes</b>, 1596–1650, French. <i>Meditations on First Philosophy</i> (1641); the phrase “je pense, donc je suis” first appears in the <i>Discourse on the Method</i> (1637).',
 phases:['Beliefs from the senses: doubtable.','The whole world: maybe a dream.','Even 2 + 3 = 5: maybe a demon’s trick.','What survives: the thinker doing the doubting. Try it: turn up the doubt.'],
 init:()=>({d:3}),anim:p=>({d:Math.min(3,Math.floor(p*4)),p}),
 draw(p,s){let g=head('René Descartes','1596–1650','Meditations, 1641');const cx=300,cy=210;
  for(let i=2;i>=0;i--){const r=70+i*48,gone=s.d>2-i;g+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${gone?'none':['#e1eef7','#d2e5f2','#c3dcee'][i]}" stroke="${gone?C.coral:C.blue}" stroke-width="${gone?1.4:2}" ${gone?'stroke-dasharray="5 5"':''}/>`+T(cx,cy-r+18,(gone?'doubted: ':'')+DOUBT[2-i][0],{size:12.5,anchor:'middle',fill:gone?C.coral:C.ink,weight:600})}
  g+=`<circle cx="${cx}" cy="${cy}" r="56" fill="${s.d===3?C.gold:'#fff'}" stroke="${C.gold}" stroke-width="3"/>`+T(cx,cy-4,'I think,',{size:14,anchor:'middle',weight:700,fill:s.d===3?'#fff':C.ink})+T(cx,cy+15,'therefore I am',{size:13,anchor:'middle',weight:700,fill:s.d===3?'#fff':C.ink});return g},
 tryUI:s=>({html:`<div class="row"><label>Doubt <input type="range" id="dd" min="0" max="3" step="1" value="${s.d}"></label></div><p class="out" id="tout"></p>`,bind(q,re){q('#dd').oninput=e=>{s.d=+e.target.value;re()}},out:s=>s.d===0?'Ordinary belief: everything seems fine.':'Doubted: '+DOUBT.slice(0,s.d).map(x=>x[0]+' ('+x[1]+')').join('; ')+'.'})
});
const PAY={CC:[3,3],CD:[0,5],DC:[5,0],DD:[1,1]};
add({stage:'medieval',thinker:'Hobbes',term:'Hobbes: why we need a Leviathan',
 def:`Without government, Hobbes argued, life would be a “war of all against all” — “solitary, poor, nasty, brutish, and short”. Each person is better off attacking or cheating whatever others do, so everyone ends up worse off. The remedy is a ${W('socialcontract','social contract')}: we hand power to a sovereign who makes cheating cost more than it gains.`,
 ex:'Twentieth-century game theory gave this structure a name: the prisoner’s dilemma. Defecting is each player’s best move, yet mutual cooperation beats mutual defection.',
 src:'<b>Thomas Hobbes</b>, 1588–1679, English. <i>Leviathan</i> (1651). The prisoner’s dilemma was formalised at RAND in 1950 (Flood and Dresher; named by Tucker) — this scene reads Hobbes through it.',
 phases:['Two players, each choosing to cooperate or defect.','Whatever the other does, defecting pays you more.','So both defect — and both do worse than if they had cooperated.','Add a sovereign who fines defection. Try it: play, with and without the Leviathan.'],
 init:()=>({lev:false,me:null,them:null,score:[0,0],hist:[]}),anim:p=>({lev:p>.75,me:p<.3?null:'D',them:p<.3?null:'D',score:[0,0],hist:[],p}),
 draw(p,s){let g=head('Thomas Hobbes','1588–1679','Leviathan, 1651');const fine=s.lev?3:0;const cell=(m,t)=>{const v=PAY[m+t].slice();if(m==='D')v[0]-=fine;if(t==='D')v[1]-=fine;return v};
  const x0=200,y0=90,w=150,h=90;g+=T(x0+w,y0-14,'the other player',{size:12,anchor:'middle',fill:C.muted})+`<g transform="translate(${x0-20},${y0+h}) rotate(-90)">${T(0,0,'you',{size:12,anchor:'middle',fill:C.muted})}</g>`;
  ['C','D'].forEach((m,i)=>['C','D'].forEach((t,j)=>{const v=cell(m,t),on=s.me===m&&s.them===t;g+=`<rect x="${x0+j*w}" y="${y0+i*h}" width="${w}" height="${h}" fill="${on?C.purplep:'#fff'}" stroke="${on?C.purple:C.line}" stroke-width="${on?3:1.5}"/>`+T(x0+j*w+w/2,y0+i*h+40,`you ${v[0]} · them ${v[1]}`,{size:14,anchor:'middle',weight:700,fill:v[0]<0?C.coral:C.ink})+T(x0+j*w+w/2,y0+i*h+62,m+' / '+t,{size:11,anchor:'middle',fill:C.muted})}));
  ['cooperate','defect'].forEach((l,i)=>{g+=T(x0-10,y0+i*h+50,l,{size:12,anchor:'end',weight:600})+T(x0+i*w+w/2,y0-2+0,'',{})});g+=T(x0+w/2,y0-2,'cooperate',{size:12,anchor:'middle',weight:600})+T(x0+w*1.5,y0-2,'defect',{size:12,anchor:'middle',weight:600});
  g+=T(300,y0+2*h+34,s.lev?'Leviathan: every defection fined 3':'state of nature: no enforcement',{size:14,anchor:'middle',weight:700,fill:s.lev?C.green:C.coral});
  if(s.p==null)g+=T(300,y0+2*h+58,`total — you ${s.score[0]}, them ${s.score[1]} · last rounds: ${s.hist.slice(-8).join(' ')}`,{size:12.5,anchor:'middle'});return g},
 tryUI:s=>({html:`<div class="row"><button type="button" class="chip" id="pc">Cooperate</button><button type="button" class="chip" id="pd">Defect</button><label><input type="checkbox" id="lv"${s.lev?' checked':''}> Leviathan enforces</label><button type="button" class="chip" id="pr">Reset</button></div><p class="out" id="tout"></p>`,
  bind(q,re){const play=m=>{const t=s.lev?(s.hist.length?s.hist[s.hist.length-1][0]:'C'):(s.hist.length?s.hist[s.hist.length-1][0]:'C');const fine=s.lev?3:0;const v=PAY[m+t];s.me=m;s.them=t;s.score[0]+=v[0]-(m==='D'?fine:0);s.score[1]+=v[1]-(t==='D'?fine:0);s.hist.push(m+t);re()};q('#pc').onclick=()=>play('C');q('#pd').onclick=()=>play('D');q('#lv').onchange=e=>{s.lev=e.target.checked;re()};q('#pr').onclick=()=>{s.score=[0,0];s.hist=[];s.me=s.them=null;re()}},
  out:s=>'The other player copies your last move (tit-for-tat — the winner of Robert Axelrod’s 1980 tournaments). '+(s.lev?'With fines, defecting never pays.':'Without enforcement, a single defection pays once — then the other player retaliates.')})
});
add({stage:'medieval',thinker:'Locke',term:'Locke: you are what you remember',
 def:`What makes you the same person over time? Not the same body, said Locke, but the same consciousness: you are the person whose actions you can remember from the inside. This is the ${W('memory','memory theory')} of personal identity.`,
 ex:'Thomas Reid’s reply: a boy is flogged; as a brave officer he remembers the flogging; as an old general he remembers being the officer but not the boy. By Locke’s test the general is the officer, the officer is the boy — but the general is not the boy. Identity should not break like that.',
 src:'<b>John Locke</b>, 1632–1704, English. <i>An Essay Concerning Human Understanding</i>; the chapter on identity was added in the 1694 edition. <b>Thomas Reid</b>’s objection: <i>Essays on the Intellectual Powers of Man</i> (1785).',
 phases:['A boy, flogged for stealing apples.','The officer remembers the flogging: same person, says Locke.','The general remembers the officer — but not the boy.','So general = officer = boy, yet general ≠ boy? Try it: cut and restore memories.'],
 init:()=>({m1:true,m2:true,m3:false}),anim:p=>({m1:p>.3,m2:p>.55,m3:false,p}),
 draw(p,s){let g=head('John Locke · Thomas Reid','1632–1704 · 1710–1796','');const pts=[[110,250,'boy',.8],[300,250,'officer',1],[490,250,'general',1.1]];
  pts.forEach(([x,y,l,sc])=>{g+=person(x,y,C.ink,sc)+T(x,y+40,l,{size:13,anchor:'middle',weight:700})});
  const link=(a,b,on,lab,yy)=>`<path d="M${pts[a][0]} ${yy} Q${(pts[a][0]+pts[b][0])/2} ${yy-50} ${pts[b][0]} ${yy}" fill="none" stroke="${on?C.green:C.coral}" stroke-width="${on?3:1.5}" ${on?'':'stroke-dasharray="6 5"'}/>`+T((pts[a][0]+pts[b][0])/2,yy-32,lab+(on?' ✓':' ✗'),{size:12,anchor:'middle',fill:on?C.green:C.coral,weight:700});
  g+=link(0,1,s.m1,'remembers',170)+link(1,2,s.m2,'remembers',170)+link(0,2,s.m3,'remembers',110);
  const same=(a,b)=>a===b||(a===0&&b===1&&s.m1)||(a===1&&b===2&&s.m2)||(a===0&&b===2&&s.m3);const chain=s.m1&&s.m2;
  g+=T(300,340,chain&&!s.m3?'Locke: general = officer, officer = boy — but general ≠ boy. Transitivity fails.':s.m3?'With a direct memory link, Locke and logic agree.':'Without the links, by Locke’s test they are different people.',{size:13,anchor:'middle',weight:700,fill:chain&&!s.m3?C.coral:C.ink});return g},
 tryUI:s=>({html:`<div class="row"><label><input type="checkbox" id="m1"${s.m1?' checked':''}> officer remembers the boy</label><label><input type="checkbox" id="m2"${s.m2?' checked':''}> general remembers the officer</label><label><input type="checkbox" id="m3"${s.m3?' checked':''}> general remembers the boy</label></div>`,bind(q,re){['m1','m2','m3'].forEach(k=>q('#'+k).onchange=e=>{s[k]=e.target.checked;re()})}})
});

/* ============ ENLIGHTENMENT ============ */
add({stage:'enlight',thinker:'Hume',term:'Hume: the problem of induction',
 def:`Every swan you have seen is white, so you expect the next one to be white. But why? Only because nature has been regular so far — and that assumes what you are trying to prove. Hume argued that ${W('induction','induction')} cannot be justified by reason; we rely on it out of habit.`,
 ex:'Europeans had seen only white swans for centuries. In 1697, Willem de Vlamingh’s expedition saw black swans in Western Australia. One observation overturned a generalisation built on thousands.',
 src:'<b>David Hume</b>, 1711–1776, Scottish. <i>A Treatise of Human Nature</i> (1739–40); <i>An Enquiry Concerning Human Understanding</i> (1748).',
 phases:['One white swan.','Hundreds of white swans: confidence grows.','The inference rests on “the future will resemble the past” — itself learned by induction.','A black swan. Try it: observe, then sail.'],
 init:()=>({n:20,black:false}),anim:p=>({n:Math.round(lerp(1,120,seg(p,.05,.6))),black:p>.82,p}),
 draw(p,s){let g=head('David Hume','1711–1776','Enquiry, 1748');const show=Math.min(s.n,120);for(let i=0;i<show;i++){const x=40+(i%20)*27,y=70+Math.floor(i/20)*30;g+=`<ellipse cx="${x}" cy="${y}" rx="10" ry="7" fill="#fff" stroke="${C.line}"/><circle cx="${x+8}" cy="${y-6}" r="3.5" fill="#fff" stroke="${C.line}"/>`}
  if(s.black)g+=`<ellipse cx="520" cy="300" rx="26" ry="17" fill="${C.ink}"/><circle cx="540" cy="284" r="8" fill="${C.ink}"/><path d="M546 285 l10 3 l-10 3z" fill="${C.coral}"/>`+T(520,340,'Western Australia, 1697',{size:11.5,anchor:'middle',fill:C.muted});
  const conf=s.black?0:1-1/(1+s.n/12);g+=T(40,268,`white swans observed: ${s.n}`,{size:14,weight:700})+T(40,292,'confidence that “all swans are white”',{size:12,fill:C.muted})+`<rect x="40" y="302" width="300" height="16" rx="4" fill="#eef3f6"/><rect x="40" y="302" width="${f2(300*conf)}" height="16" rx="4" fill="${s.black?C.coral:C.green}"/>`+T(40,342,s.black?'refuted by one observation':'never proven, however many',{size:12.5,fill:s.black?C.coral:C.muted,weight:700});return g},
 tryUI:s=>({html:`<div class="row"><button type="button" class="chip" id="ob">Observe 10 more swans</button><button type="button" class="chip" id="sa">Sail to Western Australia</button><button type="button" class="chip" id="rs">Reset</button></div><p class="out" id="tout"></p>`,bind(q,re){q('#ob').onclick=()=>{s.n+=10;re()};q('#sa').onclick=()=>{s.black=true;re()};q('#rs').onclick=()=>{s.n=1;s.black=false;re()}},out:s=>s.black?'Karl Popper later drew the lesson: we cannot prove generalisations, but we can falsify them.':'Each swan raises confidence — but no number of them gives certainty.'})
});
const MAX=[['Make a false promise to borrow money I cannot repay','If everyone did it, no one would believe promises — so the maxim defeats itself.','fails: contradiction in conception'],
 ['Never help anyone in need','Everyone could live like this, but you cannot rationally will it: you will need help yourself someday.','fails: contradiction in the will'],
 ['Keep my promises','Universalised, promising works better than ever.','passes'],
 ['Ride the bus without paying','If no one paid, there would be no bus to ride free on.','fails: contradiction in conception'],
 ['Wear blue on Tuesdays','Universalisable, but not a moral duty — passing the test only means it is permitted.','passes (but not required)']];
add({stage:'enlight',thinker:'Kant',term:'Kant: could everyone do it?',
 def:`Kant’s ${W('categorical','categorical imperative')}: act only on a principle (a ${W('maxim','maxim')}) that you could will to become a universal law. If your plan only works because others do not do the same, it is wrong — whatever the consequences.`,
 ex:'Another formulation: treat humanity, in yourself and others, always as an end and never merely as a means.',
 src:'<b>Immanuel Kant</b>, 1724–1804, Königsberg, Prussia. <i>Groundwork of the Metaphysics of Morals</i> (1785); <i>Critique of Pure Reason</i> (1781).',
 phases:['Your maxim.','Imagine everyone acting on it, always.','Does the imagined world still let the maxim work?','If not, the action is forbidden. Try it: test five maxims.'],
 init:()=>({k:0}),anim:p=>({k:0,p}),
 draw(p,s){const m=MAX[s.k],o=s.p!=null?p:1;let g=head('Immanuel Kant','1724–1804','Groundwork, 1785');
  g+=box(40,70,520,50,'Maxim: '+m[0],{size:13.5,stroke:C.blue,op:seg(o,0,.1)})+arrow(300,124,300,154,C.ink,2,seg(o,.15,.25));
  g+=box(150,156,300,46,'Universalise: everyone does this, always',{size:13,fill:'#f6f4ee',stroke:C.gold,op:seg(o,.2,.3)})+arrow(300,206,300,236,C.ink,2,seg(o,.35,.45));
  g+=box(40,238,520,58,m[1],{size:12.5,op:seg(o,.45,.6)});const pass=m[2].startsWith('passes');g+=box(170,312,260,46,m[2],{fill:pass?C.greenp:C.coralp,stroke:pass?C.green:C.coral,weight:700,op:seg(o,.7,.85)});return g},
 tryUI:s=>({html:chips('k',MAX,s.k,x=>x[0]),bind(q,re,root){bindChips(root,'k',s,'k',re)}})
});
add({stage:'enlight',thinker:'Wollstonecraft',term:'Wollstonecraft: reason needs education',
 def:'In 1792 Mary Wollstonecraft argued that women seemed less rational than men not by nature but because they were denied education and trained to please. Give both the same education, she said, and judge them by the same standards of reason and virtue.',
 ex:'She turned Enlightenment arguments about reason and rights — usually applied only to men — back on their authors: if reason grounds rights, every reasoning being has them.',
 src:'<b>Mary Wollstonecraft</b>, 1759–1797, English. <i>A Vindication of the Rights of Woman</i> (1792), written in reply to proposals that girls be educated only for domestic life.',
 phases:['Two children, the same capacities.','One is taught to reason; the other to please.','Years later, the gap is blamed on nature.','Same education, same flourishing. Try it: set each one’s education.'],
 init:()=>({a:1,b:1}),anim:p=>({a:seg(p,.2,.6),b:p<.8?seg(p,.2,.6)*.25:lerp(.25,1,seg(p,.8,.95)),p}),
 draw(p,s){let g=head('Mary Wollstonecraft','1759–1797','Vindication of the Rights of Woman, 1792');
  [[180,s.a,'child A',C.blue],[420,s.b,'child B',C.coral]].forEach(([x,e,l,col])=>{const h=60+e*160;g+=`<rect x="${x-14}" y="${330-h}" width="28" height="${f2(h)}" rx="10" fill="${col}" opacity=".85"/>`;for(let k=0;k<Math.round(e*6);k++){const y=330-h*(.3+k*.11),side=k%2?1:-1;g+=`<ellipse cx="${x+side*28}" cy="${f2(y)}" rx="22" ry="10" fill="${C.green}" opacity=".8"/>`}
   g+=T(x,356,l,{size:13,anchor:'middle',weight:700})+T(x,374,'education '+Math.round(e*100)+'%',{size:12,anchor:'middle',fill:C.muted})});
  g+=`<line x1="40" y1="330" x2="560" y2="330" stroke="${C.ink}"/>`+T(300,90,Math.abs(s.a-s.b)<.05?'Same education, same growth':'The difference is in the training, not the nature',{size:14,anchor:'middle',weight:700});return g},
 tryUI:s=>({html:`<div class="row"><label>Child A’s education <input type="range" id="ea" min="0" max="1" step="0.01" value="${s.a}"></label><label>Child B’s education <input type="range" id="eb" min="0" max="1" step="0.01" value="${s.b}"></label></div>`,bind(q,re){q('#ea').oninput=e=>{s.a=+e.target.value;re()};q('#eb').oninput=e=>{s.b=+e.target.value;re()}}})
});

/* ============ NINETEENTH CENTURY ============ */
const SOCS=[['Equal',[5,5,5,5,5]],['High total, unequal',[12,9,6,2,1]],['Rich few',[15,10,1,1,1]]];
add({stage:'c19',thinker:'Bentham & Mill',term:'Bentham and Mill: the greatest happiness',
 def:`${W('utilitarianism','Utilitarianism')}: the right action is the one that produces the most well-being overall, counting everyone’s equally. Bentham measured pleasure and pain; Mill added that some pleasures — of the intellect and imagination — are higher than others.`,
 ex:'But adding up can hide who gets what. A world with a higher total might leave some people very badly off. Look at the sum, the average and the worst-off person and the “best” world can change.',
 src:'<b>Jeremy Bentham</b>, 1748–1832, <i>An Introduction to the Principles of Morals and Legislation</i> (1789). <b>John Stuart Mill</b>, 1806–1873, <i>Utilitarianism</i> (1861) and <i>On Liberty</i> (1859).',
 phases:['Five people, each with a level of well-being.','Bentham’s question: which world has the most in total?','Ask instead about the worst-off person, and the answer changes.','Try it: change the numbers or pick a society.'],
 init:()=>({v:[12,9,6,2,1]}),anim:p=>({v:SOCS[Math.min(2,Math.floor(p*3))][1],p}),
 draw(p,s){let g=head('Jeremy Bentham · John Stuart Mill','1748–1832 · 1806–1873','');const tot=s.v.reduce((a,b)=>a+b,0),avg=tot/5,min=Math.min(...s.v);
  s.v.forEach((v,i)=>{const x=80+i*96,h=v*14;g+=`<rect x="${x}" y="${300-h}" width="60" height="${f2(h)}" rx="6" fill="${v===min?C.coral:C.blue}" opacity=".85"/>`+T(x+30,296-h,String(v),{size:13,anchor:'middle',weight:700})+person(x+30,348,C.muted,.45)});
  g+=`<line x1="60" y1="${f2(300-avg*14)}" x2="560" y2="${f2(300-avg*14)}" stroke="${C.green}" stroke-dasharray="6 4"/>`+T(560,f2(294-avg*14),'average '+avg.toFixed(1),{size:12,anchor:'end',fill:C.green,weight:700});
  g+=T(40,80,'total '+tot,{size:15,weight:700,fill:C.blue})+T(200,80,'worst-off '+min,{size:15,weight:700,fill:C.coral});return g},
 tryUI:s=>({html:chips('s',SOCS,-1,x=>x[0])+`<div class="sliders">${s.v.map((v,i)=>`<label>Person ${i+1} <input type="range" data-i="${i}" min="0" max="20" value="${v}"></label>`).join('')}</div><p class="out" id="tout"></p>`,
  bind(q,re,root){root.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{s.v=SOCS[+b.dataset.s][1].slice();root.querySelectorAll('[data-i]').forEach((x,i)=>x.value=s.v[i]);re()});root.querySelectorAll('[data-i]').forEach(x=>x.oninput=()=>{s.v[+x.dataset.i]=+x.value;re()})},
  out:s=>{const sc=SOCS.map(([n,v])=>[n,v.reduce((a,b)=>a+b,0),Math.min(...v)]);const bt=sc.slice().sort((a,b)=>b[1]-a[1])[0][0],bw=sc.slice().sort((a,b)=>b[2]-a[2])[0][0];return `Of the three presets, a total-maximiser picks <b>${bt}</b>; someone protecting the worst-off picks <b>${bw}</b>.`}})
});
const SPH=[['Aesthetic','Living for enjoyment and novelty. Ends in boredom and despair.',C.coral],['Ethical','Committing to duties and a chosen life. Ends in the limits of one’s own goodness.',C.blue],['Religious','A personal, passionate relation to God beyond reason: the leap of faith.',C.purple]];
add({stage:'c19',thinker:'Kierkegaard',term:'Kierkegaard: the leap',
 def:'Kierkegaard described three ways of existing. You cannot reason your way from one to the next; you must choose, wholeheartedly, and take responsibility — a leap. Truth that matters for a life, he said, is subjective: it must be lived, not just known.',
 ex:'Either/Or presents the aesthetic and ethical lives as letters from two different writers, and leaves the choice to the reader.',
 src:'<b>Søren Kierkegaard</b>, 1813–1855, Copenhagen; often called the first existentialist. <i>Either/Or</i> (1843), <i>Fear and Trembling</i> (1843), <i>Stages on Life’s Way</i> (1845).',
 phases:['The aesthetic sphere: pleasure, possibility, boredom.','A leap: commitment, the ethical sphere.','Another leap: the religious sphere.','No argument carries you across — only choice. Try it: move between spheres.'],
 init:()=>({k:0}),anim:p=>({k:Math.min(2,Math.floor(p*3)),p}),
 draw(p,s){let g=head('Søren Kierkegaard','1813–1855','Either/Or, 1843');SPH.forEach(([n,d,col],i)=>{const x=110+i*190,y=240-i*60,on=i===s.k;g+=`<rect x="${x-80}" y="${y}" width="160" height="${120+i*60}" rx="8" fill="${on?col:'#eef3f6'}" opacity="${on?.85:1}"/>`+T(x,y+28,n,{size:15,anchor:'middle',weight:700,fill:on?'#fff':C.ink});if(i<2)g+=`<path d="M${x+40} ${y-10} Q${x+95} ${y-90} ${x+150} ${y-70}" fill="none" stroke="${C.ink}" stroke-width="2" stroke-dasharray="5 4"/>`+T(x+95,y-62,'leap',{size:12,anchor:'middle',fill:C.muted})});
  g+=person(110+s.k*190,240-s.k*60,C.ink,.8);g+=wrap(300,94,SPH[s.k][1],80,13,C.ink,{anchor:'middle'});return g},
 tryUI:s=>({html:chips('h',SPH,s.k,x=>x[0]),bind(q,re,root){bindChips(root,'h',s,'k',re)}})
});
add({stage:'c19',thinker:'Nietzsche',term:'Nietzsche: the eternal return',
 def:'A demon whispers: “This life, as you now live it, you will have to live once more and innumerable times more — every pain and every joy, in the same order.” Would you curse the demon, or call it divine? Nietzsche’s test asks whether you can affirm your life completely.',
 ex:'Nietzsche presents it less as a claim about physics than as a thought experiment for living: act so that you could will this moment to return forever (amor fati — love of fate).',
 src:'<b>Friedrich Nietzsche</b>, 1844–1900, German. The demon appears in <i>The Gay Science</i> §341 (1882); “God is dead” in §125. Developed in <i>Thus Spoke Zarathustra</i> (1883–85).',
 phases:['A life, from birth to death.','Then: again, exactly the same.','And again, forever.','How would you answer the demon? Try it.'],
 init:()=>({k:-1}),anim:p=>({k:-1,p}),live:true,
 draw(p,s){let g=head('Friedrich Nietzsche','1844–1900','The Gay Science §341');const t=s.p!=null?p*3:performance.now()/4000;const cx=300,cy=210;
  g+=`<circle cx="${cx}" cy="${cy}" r="120" fill="none" stroke="${C.grid}" stroke-width="10"/>`;const a=t*TAU%TAU;g+=`<path d="M${cx} ${cy-120} A120 120 0 ${a>Math.PI?1:0} 1 ${f2(cx+Math.sin(a)*120)} ${f2(cy-Math.cos(a)*120)}" fill="none" stroke="${C.purple}" stroke-width="10" stroke-linecap="round"/>`;
  ['birth','joys','losses','loves','pains','death'].forEach((l,i)=>{const b=i/6*TAU;g+=T(cx+Math.sin(b)*150,cy-Math.cos(b)*150+4,l,{size:12,anchor:'middle',fill:C.muted})});
  g+=T(cx,cy+6,'×'+(1+Math.floor(s.p!=null?p*3:t)),{size:26,anchor:'middle',weight:700,fill:C.purple});
  if(s.k>=0)g+=wrap(300,362,['You curse the demon: the return is a horror.','You call it a god: you would change nothing.','You start changing how you live now, so you could say yes.'][s.k],80,13,C.ink,{anchor:'middle',weight:700});return g},
 tryUI:s=>({html:chips('n',['Curse the demon','“You are a god”','Change how I live'],s.k),bind(q,re,root){bindChips(root,'n',s,'k',re)},out:()=>'Nietzsche’s ideal answer is the second — but the third is how he hoped readers would get there.'})
});

/* ============ TWENTIETH CENTURY ============ */
const GAMES=['chess','football','patience','ring-a-roses','poker'];const FEATS=['competition','winning and losing','skill','luck','a ball','cards','played alone'];
const GF=[[1,1,1,0,0,0,0],[1,1,1,1,1,0,0],[0,1,1,1,0,1,1],[0,0,0,0,0,0,0],[1,1,1,1,0,1,0]];
add({stage:'c20',thinker:'Wittgenstein',term:'Wittgenstein: family resemblance',
 def:`What do all games have in common? Look, says Wittgenstein, and you will not find one feature. You find a network of overlapping similarities, like resemblances in a family. Many concepts work like this — no definition, but real ${W('family','family resemblance')}.`,
 ex:'Not all games have winners (ring-a-roses), not all involve skill (snakes and ladders), not all are competitive (patience). Yet “game” is perfectly usable.',
 src:'<b>Ludwig Wittgenstein</b>, 1889–1951, Austrian-British. <i>Philosophical Investigations</i> (1953, posthumous), §§65–71. Earlier: <i>Tractatus Logico-Philosophicus</i> (1921).',
 phases:['Five games.','Their features, ticked.','No column is ticked for every game.','Overlap without a single essence. Try it: pick a game.'],
 init:()=>({k:4}),anim:p=>({k:-1,p}),
 draw(p,s){let g=head('Ludwig Wittgenstein','1889–1951','Philosophical Investigations §66');const x0=160,y0=80,cw=58,rh=46,o=s.p!=null?p:1;
  FEATS.forEach((f,j)=>{g+=`<g transform="translate(${x0+j*cw+cw/2},${y0-6}) rotate(-30)">${T(0,0,f,{size:11,fill:C.muted})}</g>`});
  GAMES.forEach((gm,i)=>{const on=s.k===i;g+=T(x0-10,y0+28+i*rh,gm,{size:13,anchor:'end',weight:on?700:500});GF[i].forEach((v,j)=>{const show=seg(o,.15+i*.08,.25+i*.08);g+=`<rect x="${x0+j*cw+4}" y="${y0+8+i*rh}" width="${cw-8}" height="${rh-10}" rx="6" fill="${v?(on?C.purple:C.pale):'#fff'}" stroke="${C.grid}" opacity="${f2(show)}"/>`+(v?T(x0+j*cw+cw/2,y0+33+i*rh,'✓',{size:15,anchor:'middle',fill:on?'#fff':C.blue,op:show}):'')})});
  g+=T(300,y0+5*rh+40,'no feature is shared by every game',{size:14,anchor:'middle',weight:700,fill:C.coral,op:seg(o,.75,.9)});return g},
 tryUI:s=>({html:chips('g',GAMES,s.k),bind(q,re,root){bindChips(root,'g',s,'k',re)},out:s=>{const shared=GAMES.map((_,i)=>i===s.k?null:[GAMES[i],GF[i].filter((v,j)=>v&&GF[s.k][j]).length]).filter(Boolean);return `${GAMES[s.k]} shares features with: `+shared.map(([n,c])=>`${n} (${c})`).join(', ')+'.'}})
});
const TOBJ=[['“Thinking is a function of the soul”','Turing: we should not limit God’s power to give a soul to a machine — and theology has been wrong about science before.'],['Mathematical limits (Gödel)','Turing: humans have limits too; it has not been shown that machines’ limits are worse than ours.'],['“It would not be conscious”','Turing: we cannot check that other people are conscious either; we extend them polite agreement.'],['Lady Lovelace: it only does what we tell it','Turing: machines can surprise their makers — and learning machines could be taught like children.']];
add({stage:'c20',thinker:'Turing',term:'Turing: the imitation game',
 def:`“Can machines think?” is too vague, said Turing. Replace it: an interrogator chats by text with a hidden human and a hidden machine. If the interrogator cannot reliably tell which is which, we have as much reason to say the machine thinks as we do for people. This became the ${W('turingtest','Turing test')}.`,
 ex:'Turing predicted that by about 2000, machines would fool an average interrogator at least 30% of the time after five minutes of questioning. Today’s chatbots have reopened the argument.',
 src:'<b>Alan Turing</b>, 1912–1954, British mathematician. “Computing Machinery and Intelligence”, <i>Mind</i> (1950), which answers nine objections; four are shown here.',
 phases:['An interrogator, typing questions.','Behind the wall: a human and a machine.','Answers come back; which is which?','Turing’s replies to the objections. Try it: pick one.'],
 init:()=>({k:0}),anim:p=>({k:-1,p}),
 draw(p,s){let g=head('Alan Turing','1912–1954','“Computing Machinery and Intelligence”, 1950');const o=s.p!=null?p:1;
  g+=person(100,200,C.ink,1)+T(100,236,'interrogator',{size:12,anchor:'middle',fill:C.muted})+`<rect x="250" y="70" width="10" height="200" fill="${C.ink}"/>`;
  g+=box(320,90,110,60,'A',{size:20,weight:700,op:seg(o,.2,.3)})+box(320,180,110,60,'B',{size:20,weight:700,op:seg(o,.2,.3)})+T(490,125,'human?',{size:12,fill:C.muted})+T(490,215,'machine?',{size:12,fill:C.muted});
  g+=arrow(130,160,240,120,C.blue,2,seg(o,.35,.45))+arrow(240,220,130,190,C.green,2,seg(o,.5,.6));
  if(s.k>=0){g+=box(30,282,540,86,TOBJ[s.k][0]+' — '+TOBJ[s.k][1],{size:12,chars:88,fill:'#f6f4ee',stroke:C.gold})}return g},
 tryUI:s=>({html:chips('u',TOBJ,s.k,x=>x[0]),bind(q,re,root){bindChips(root,'u',s,'k',re)}})
});
add({stage:'c20',thinker:'Sartre & de Beauvoir',term:'Sartre and de Beauvoir: existence before essence',
 def:`A paper-knife is designed before it is made: its purpose (essence) comes first. For a person, Sartre argued, it is the other way round: we exist first, then make ourselves through our choices. We are “condemned to be free”, and responsible for what we become.`,
 ex:'Simone de Beauvoir applied this to gender: “One is not born, but rather becomes, a woman.” What society treats as women’s nature is a situation imposed — and so can be changed.',
 src:'<b>Jean-Paul Sartre</b>, 1905–1980: <i>Being and Nothingness</i> (1943); the paper-knife is from the lecture <i>Existentialism Is a Humanism</i> (1945). <b>Simone de Beauvoir</b>, 1908–1986: <i>The Second Sex</i> (1949).',
 phases:['The paper-knife: blueprint first, object second.','A person: existence first — no blueprint.','Each choice adds to who they are.','Try it: switch between the knife and the person, and add choices.'],
 init:()=>({k:1,n:4}),anim:p=>({k:p<.33?0:1,n:Math.max(0,Math.round((p-.4)*12)),p}),
 draw(p,s){let g=head('Jean-Paul Sartre · Simone de Beauvoir','1905–1980 · 1908–1986','');const arrowLab=(a,b)=>T(300,96,a+'  →  '+b,{size:16,anchor:'middle',weight:700,fill:C.purple});
  if(s.k===0){g+=arrowLab('essence','existence')+box(60,140,200,120,'blueprint: “a thing for cutting paper”',{fill:'#f6f4ee',stroke:C.gold,size:12.5})+arrow(270,200,330,200)+`<path d="M360 230 L520 170 L530 182 L372 244 Z" fill="${C.line}" stroke="${C.ink}"/><rect x="340" y="232" width="40" height="14" rx="4" fill="${C.ink}" transform="rotate(-20 360 239)"/>`}
  else{g+=arrowLab('existence','essence')+person(130,260,C.ink,1.2);const ch=['studies','moves away','says no','falls in love','changes job','keeps a promise','refuses to lie','starts again','takes a risk','helps a stranger'];for(let i=0;i<s.n&&i<ch.length;i++){const x=240+(i%3)*110,y=280-Math.floor(i/3)*52;g+=box(x,y,100,40,ch[i],{size:11.5,fill:C.purplep,stroke:C.purple})}g+=T(330,340,s.n?'who they are = what they have done':'no essence yet — only freedom',{size:13,anchor:'middle',fill:C.muted})}return g},
 tryUI:s=>({html:chips('e',['Paper-knife','Person'],s.k)+`<div class="row"><label>Choices made <input type="range" id="en" min="0" max="10" value="${s.n}"></label></div>`,bind(q,re,root){bindChips(root,'e',s,'k',re);q('#en').oninput=e=>{s.n=+e.target.value;re()}}})
});
add({stage:'c20',thinker:'Foot & Thomson',term:'Foot and Thomson: the trolley problem',
 def:'A runaway trolley will kill five people. You can pull a switch to send it onto a side track where it will kill one. Most people say pull. Now you are on a footbridge: you can stop it only by pushing a large man onto the track. Same numbers — most people say no. Why?',
 ex:'A utilitarian counts five against one in both cases. Others point to the doctrine of double effect (in the switch case the death is a side effect; on the bridge you use the man as a means) — Kant’s formula of humanity again.',
 src:'<b>Philippa Foot</b>, 1920–2010: “The Problem of Abortion and the Doctrine of the Double Effect” (1967). <b>Judith Jarvis Thomson</b>, 1929–2020: named the trolley problem (1976) and added the footbridge (1985).',
 phases:['Five people on the track ahead.','The switch: divert, and one dies instead.','The footbridge: push one to stop the trolley.','Same arithmetic, different judgements. Try it: choose in each case.'],
 init:()=>({c:0,act:false}),anim:p=>({c:p<.6?0:1,act:p>.3&&p<.6,p}),
 draw(p,s){let g=head('Philippa Foot · Judith Jarvis Thomson','1967 · 1976 · 1985','');
  g+=`<path d="M30 260 L300 260 L560 260" stroke="${C.ink}" stroke-width="4" fill="none"/>`;if(s.c===0)g+=`<path d="M300 260 L560 330" stroke="${C.ink}" stroke-width="4" fill="none"/><rect x="290" y="232" width="8" height="28" fill="${s.act?C.coral:C.muted}" transform="rotate(${s.act?25:-25} 294 260)"/>`;
  for(let i=0;i<5;i++)g+=person(470+i*18,262,(s.c===0&&s.act)||(s.c===1&&s.act)?C.green:C.coral,.45);
  if(s.c===0)g+=person(500,330,s.act?C.coral:C.green,.45);
  if(s.c===1){g+=`<rect x="260" y="150" width="140" height="10" fill="${C.ink}"/><line x1="270" y1="160" x2="270" y2="260" stroke="${C.ink}" stroke-width="3"/><line x1="390" y1="160" x2="390" y2="260" stroke="${C.ink}" stroke-width="3"/>`+person(s.act?330:320,s.act?262:150,s.act?C.coral:C.green,s.act?.55:.7)}
  g+=`<rect x="${s.act?230:120}" y="240" width="60" height="24" rx="4" fill="${C.gold}"/>`;
  const dead=s.act?1:5;g+=T(300,96,(s.c===0?'Switch':'Footbridge')+': '+(s.act?(s.c===0?'pull the switch':'push'):'do nothing')+' → '+dead+(dead===1?' dies':' die'),{size:15,anchor:'middle',weight:700});return g},
 tryUI:s=>({html:chips('c',['Switch case','Footbridge case'],s.c)+`<div class="row"><label><input type="checkbox" id="ta"${s.act?' checked':''}> I act</label></div><p class="out" id="tout"></p>`,bind(q,re,root){bindChips(root,'c',s,'c',re);q('#ta').onchange=e=>{s.act=e.target.checked;re()}},
  out:s=>s.c===0?(s.act?'Most people in surveys agree. Utilitarian: right — one death instead of five. Double effect: permissible — the one’s death is foreseen, not intended.':'Utilitarian: wrong — five die who could have been saved.'):(s.act?'Most people refuse. Kantian: wrong — you use him merely as a means. Utilitarian: right, if that is truly the only way.':'Most people choose this — even though five die. That gap is the puzzle.')})
});
add({stage:'c20',thinker:'Gettier',term:'Gettier: is knowledge justified true belief?',
 def:`Since Plato, a common account held that knowledge is ${W('jtb','justified true belief')}: you believe it, it is true, and you have good reason. In three pages, Edmund Gettier showed cases where all three hold but we would not call it knowledge — the truth is reached by luck.`,
 ex:'You look at a clock that says 2:00 and believe it is two o’clock. It is. Your belief is justified — the clock has always been reliable. But the clock stopped exactly twelve hours ago. Do you know the time? (The clock case is Bertrand Russell’s, from 1948.)',
 src:'<b>Edmund Gettier</b>, 1927–2021, American. “Is Justified True Belief Knowledge?”, <i>Analysis</i> (1963). It launched decades of attempts to add a fourth condition.',
 phases:['Belief.','True.','Justified.','All three — but by luck. Try it: toggle each, and the stopped clock.'],
 init:()=>({b:true,t:true,j:true,luck:true}),anim:p=>({b:p>.1,t:p>.3,j:p>.5,luck:p>.75,p}),
 draw(p,s){let g=head('Edmund Gettier','1927–2021','Analysis, 1963');const cs=[[250,170,'belief',C.blue,s.b],[350,170,'truth',C.green,s.t],[300,250,'justification',C.gold,s.j]];
  cs.forEach(([x,y,l,col,on])=>{g+=`<circle cx="${x}" cy="${y}" r="90" fill="${col}" opacity="${on?.22:.05}" stroke="${col}" stroke-width="${on?2.5:1}"/>`+T(x+(x<300?-40:x>300?40:0),y+(y>200?60:-50),l,{size:13,anchor:'middle',weight:700,fill:col})});
  const all=s.b&&s.t&&s.j;g+=`<circle cx="300" cy="200" r="${all?14:6}" fill="${all?(s.luck?C.coral:C.ink):C.muted}"/>`;
  if(s.luck&&all)g+=`<circle cx="500" cy="110" r="38" fill="#fff" stroke="${C.ink}" stroke-width="3"/><line x1="500" y1="110" x2="500" y2="84" stroke="${C.ink}" stroke-width="3"/><line x1="500" y1="110" x2="518" y2="110" stroke="${C.ink}" stroke-width="3"/>`+T(500,166,'stopped',{size:11.5,anchor:'middle',fill:C.coral});
  g+=T(300,370,!all?'not knowledge: a condition is missing':s.luck?'JTB says knowledge — Gettier says: only luck':'justified true belief — knowledge',{size:14,anchor:'middle',weight:700,fill:!all?C.muted:s.luck?C.coral:C.green});return g},
 tryUI:s=>({html:`<div class="row">${[['b','Believe it'],['t','It is true'],['j','Justified'],['luck','Stopped clock (luck)']].map(([k,l])=>`<label><input type="checkbox" data-k="${k}"${s[k]?' checked':''}> ${l}</label>`).join('')}</div>`,bind(q,re,root){root.querySelectorAll('[data-k]').forEach(x=>x.onchange=()=>{s[x.dataset.k]=x.checked;re()})}})
});
const VEIL=[['Society A',[1,4,6,8,20]],['Society B',[5,6,7,8,9]],['Society C',[3,5,7,9,12]]];
add({stage:'c20',thinker:'Rawls',term:'Rawls: the veil of ignorance',
 def:`Choose the rules of your society without knowing who you will be in it — rich or poor, talented or not, which race, sex or religion. Behind this ${W('veil','veil of ignorance')}, Rawls argued, you would choose equal basic liberties, and accept inequalities only if they benefit the worst-off (the difference principle).`,
 ex:'Society A has the highest total but the worst bottom. A utilitarian might choose it; Rawls predicts you would choose B, protecting yourself in case you land at the bottom.',
 src:'<b>John Rawls</b>, 1921–2002, American. <i>A Theory of Justice</i> (1971). The device updates the social contract of Hobbes, Locke, Rousseau and Kant.',
 phases:['Three possible societies, five positions in each.','You must choose before knowing your position.','Lift the veil: you land somewhere at random.','Which would you choose? Try it.'],
 init:()=>({k:1,pos:null,tally:[0,0,0,0,0]}),anim:p=>({k:p<.5?0:1,pos:p>.75?0:null,tally:[0,0,0,0,0],p}),
 draw(p,s){let g=head('John Rawls','1921–2002','A Theory of Justice, 1971');VEIL.forEach(([n,v],i)=>{const x0=40+i*188,on=i===s.k;g+=`<rect x="${x0}" y="70" width="170" height="250" rx="10" fill="${on?C.purplep:'#fff'}" stroke="${on?C.purple:C.line}" stroke-width="${on?3:1.5}"/>`+T(x0+85,94,n,{size:14,anchor:'middle',weight:700})+T(x0+85,112,'total '+v.reduce((a,b)=>a+b,0)+' · worst '+Math.min(...v),{size:11.5,anchor:'middle',fill:C.muted});
   v.forEach((w,j)=>{const h=w*9,x=x0+12+j*31;g+=`<rect x="${x}" y="${300-h}" width="24" height="${h}" rx="3" fill="${on&&s.pos===j?C.coral:C.blue}" opacity="${on?.9:.45}"/>`})});
  if(s.pos!=null)g+=T(300,352,`The veil lifts: you are position ${s.pos+1} in ${VEIL[s.k][0]}, with well-being ${VEIL[s.k][1][s.pos]}.`,{size:14,anchor:'middle',weight:700,fill:C.coral});return g},
 tryUI:s=>({html:chips('r',VEIL,s.k,x=>x[0])+`<div class="row"><button type="button" class="chip" id="lift">Lift the veil</button></div><p class="out" id="tout"></p>`,bind(q,re,root){bindChips(root,'r',s,'k',()=>{s.pos=null;re()});q('#lift').onclick=()=>{s.pos=Math.floor(Math.random()*5);re()}},out:s=>`Rawls’s rule (maximin) picks ${VEIL.slice().sort((a,b)=>Math.min(...b[1])-Math.min(...a[1]))[0][0]}; the highest total is ${VEIL.slice().sort((a,b)=>b[1].reduce((x,y)=>x+y)-a[1].reduce((x,y)=>x+y))[0][0]}.`})
});
const ROOM=[['你好','你好！','Rule 17: if you see 你好, write 你好！','Hello → Hello!'],['你会说中文吗？','会，说得很好。','Rule 203: if you see 你会说中文吗？, write 会，说得很好。','Do you speak Chinese? → Yes, very well.'],['今天天气怎么样？','很好，阳光明媚。','Rule 588: if you see 今天天气怎么样？, write 很好，阳光明媚。','How is the weather today? → Very good, sunny.']];
add({stage:'c20',thinker:'Searle',term:'Searle: the Chinese Room',
 def:'Searle imagines himself in a room with a rulebook for matching Chinese symbols to Chinese replies. He understands no Chinese, but his answers are perfect: outside, people think the room understands. A computer running a program does the same — so, he argues, running the right program is not enough for understanding. Syntax is not semantics.',
 ex:'The “systems reply”: Searle does not understand, but the whole system — man, rulebook, room — does. Searle answers: imagine memorising the rulebook; you still would not understand Chinese.',
 src:'<b>John Searle</b>, 1932–2025, American. “Minds, Brains, and Programs”, <i>Behavioral and Brain Sciences</i> (1980) — a reply to claims that programs could literally understand.',
 phases:['A note in Chinese slides under the door.','Inside, a man looks up the symbols in a rulebook.','He copies out the reply — perfect Chinese.','Who, if anyone, understood? Try it: pass in a message.'],
 init:()=>({k:0}),anim:p=>({k:0,p}),
 draw(p,s){const r=ROOM[s.k],o=s.p!=null?p:1;let g=head('John Searle','1932–2025','“Minds, Brains, and Programs”, 1980');
  g+=`<rect x="180" y="70" width="260" height="250" fill="#f6f4ee" stroke="${C.ink}" stroke-width="3"/><rect x="176" y="250" width="8" height="30" fill="#fff"/><rect x="436" y="250" width="8" height="30" fill="#fff"/>`+person(310,250,C.ink,1)+`<rect x="340" y="200" width="70" height="46" rx="4" fill="${C.blue}" opacity=".8"/>`+T(375,228,'rules',{size:12,anchor:'middle',fill:'#fff',weight:700});
  g+=box(40,250,120,40,r[0],{size:15,op:seg(o,0,.2)})+arrow(160,270,180,270,C.ink,2,seg(o,.15,.25));g+=box(460,250,130,40,r[1],{size:13,op:seg(o,.6,.8),stroke:C.green})+arrow(440,270,460,270,C.ink,2,seg(o,.55,.65));
  g+=wrap(310,96,r[2],38,11.5,C.ink,{anchor:'middle',op:seg(o,.3,.5)});g+=T(300,350,'Meaning (not known inside): '+r[3],{size:12.5,anchor:'middle',fill:C.muted,op:seg(o,.8,.95)});return g},
 tryUI:s=>({html:chips('q',ROOM,s.k,x=>x[0]),bind(q,re,root){bindChips(root,'q',s,'k',re)},out:()=>'The man matches shapes. Does the room understand, or only seem to? Searle says only seems.'})
});
const MARY=['Yes — a new fact (so physicalism leaves something out)','No new fact — a new ability (to recognise and imagine red)','Nothing new — she would have known in advance'];
add({stage:'c20',thinker:'Jackson',term:'Jackson: Mary’s room',
 def:'Mary is a brilliant scientist who knows every physical fact about colour vision, but she has lived her whole life in a black-and-white room. One day she steps out and sees a red tomato. Does she learn something new? If so, Jackson argued, some facts — about what experience is like (qualia) — are not physical facts.',
 ex:'Jackson himself later changed his mind and became a physicalist. Replies include the “ability hypothesis” (she gains a skill, not a fact) and Daniel Dennett’s view that complete knowledge would let her predict the experience.',
 src:'<b>Frank Jackson</b>, born 1943, Australian. “Epiphenomenal Qualia”, <i>Philosophical Quarterly</i> (1982).',
 phases:['Mary in her black-and-white room, knowing all the physics of colour.','The door opens.','Red, for the first time.','Did she learn something? Try it: choose an answer.'],
 init:()=>({open:true,k:-1}),anim:p=>({open:p>.4,k:-1,p}),
 draw(p,s){let g=head('Frank Jackson','born 1943','“Epiphenomenal Qualia”, 1982');g+=`<rect x="40" y="70" width="300" height="260" fill="#f2f2f2" stroke="#444" stroke-width="3"/>`;for(let i=0;i<4;i++)g+=`<rect x="${60+i*22}" y="90" width="18" height="60" fill="${['#333','#777','#aaa','#555'][i]}"/>`;g+=T(150,170,'λ = 700 nm …',{size:12,fill:'#555',style:'italic'})+person(200,290,'#555',1);
  g+=`<rect x="340" y="140" width="${s.open?8:40}" height="170" fill="#666"/>`;if(s.open){g+=`<rect x="380" y="70" width="200" height="260" fill="#eaf5e2"/><circle cx="480" cy="220" r="44" fill="#d23a2a"/><path d="M470 178 q10 -16 22 -4" stroke="#2f7a2f" stroke-width="5" fill="none"/>`}
  if(s.k>=0)g+=box(40,340,540,34,MARY[s.k],{size:12.5,fill:C.purplep,stroke:C.purple});return g},
 tryUI:s=>({html:`<div class="row"><label><input type="checkbox" id="mo"${s.open?' checked':''}> Open the door</label></div>`+chips('a',MARY,s.k),bind(q,re,root){q('#mo').onchange=e=>{s.open=e.target.checked;re()};bindChips(root,'a',s,'k',re)}})
});

/* ============ TODAY ============ */
add({stage:'today',thinker:'Singer',term:'Singer: the drowning child',
 def:'Walking past a shallow pond, you see a child drowning. Saving her will ruin your expensive shoes. Of course you must save her. But then, Singer argues, you must also give to save children far away, when you can do so without sacrificing anything comparably important. Distance does not change the duty.',
 ex:'Singer’s argument helped start the effective altruism movement. Critics question how demanding it is, and whether proximity and special relationships carry moral weight.',
 src:'<b>Peter Singer</b>, born 1946, Australian. “Famine, Affluence, and Morality”, <i>Philosophy & Public Affairs</i> (1972); <i>The Life You Can Save</i> (2009).',
 phases:['A child drowning, a few metres away.','You could save her at the cost of your shoes.','Now move her further away — another country.','What changed, morally? Try it: change the distance.'],
 init:()=>({d:2}),anim:p=>({d:lerp(0,4,seg(p,.5,.95)),p}),
 draw(p,s){let g=head('Peter Singer','born 1946','“Famine, Affluence, and Morality”, 1972');const km=Math.pow(10,s.d)*.01;const X=60+s.d/4*460;
  g+=person(60,250,C.ink,1)+`<line x1="60" y1="300" x2="540" y2="300" stroke="${C.grid}" stroke-width="2"/>`+`<ellipse cx="${f2(X)}" cy="290" rx="40" ry="12" fill="${C.pale}"/>`+person(X,280,C.coral,.5)+arrow(90,200,X-20,240,C.purple,2,.7,'6 5');
  g+=T(300,90,'distance: '+(km<1?Math.round(km*1000)+' m':km<1000?km.toFixed(km<10?1:0)+' km':'a continent away'),{size:16,anchor:'middle',weight:700})+T(300,116,'cost to you: about the same',{size:13,anchor:'middle',fill:C.muted})+T(300,350,'obligation to help: unchanged, says Singer',{size:14,anchor:'middle',weight:700,fill:C.purple});return g},
 tryUI:s=>({html:`<div class="row"><label>Distance <input type="range" id="sd" min="0" max="4" step="0.01" value="${s.d}"></label></div><p class="out" id="tout"></p>`,bind(q,re){q('#sd').oninput=e=>{s.d=+e.target.value;re()}},out:()=>'If your intuition changes with distance, ask what the distance itself is doing. Singer’s critics have answers; the question is the point.'})
});
const EASY=['telling colours apart','reporting what you see','focusing attention','being awake vs asleep','controlling behaviour'];
add({stage:'today',thinker:'Chalmers',term:'Chalmers: the hard problem',
 def:'Explaining how the brain discriminates colours, focuses attention or produces reports is hard work but “easy” in principle: find the mechanism. The hard problem is different: why is any of this accompanied by experience — why does it feel like something from the inside?',
 ex:'Chalmers argues that no story about function alone closes the gap. Others (illusionists such as Keith Frankish and Daniel Dennett) argue the hard problem is itself a kind of illusion to be explained.',
 src:'<b>David Chalmers</b>, born 1966, Australian. “Facing Up to the Problem of Consciousness”, <i>Journal of Consciousness Studies</i> (1995); <i>The Conscious Mind</i> (1996).',
 phases:['The easy problems: functions the brain performs.','Each can be explained by a mechanism.','Then the leftover question: why is there experience at all?','Try it: sort the problems.'],
 init:()=>({k:5}),anim:p=>({k:Math.min(5,Math.floor(p*6)),p}),
 draw(p,s){let g=head('David Chalmers','born 1966','JCS, 1995');EASY.forEach((e,i)=>{const on=i<s.k||s.p==null;g+=box(40,70+i*52,250,42,e,{size:13,fill:on?C.greenp:'#fff',stroke:on?C.green:C.line})+(on?T(306,96+i*52,'mechanism ✓',{size:11.5,fill:C.green}):'')});
  const hard=s.k>=5;g+=`<rect x="390" y="110" width="180" height="180" rx="16" fill="${hard?C.purplep:'#fff'}" stroke="${C.purple}" stroke-width="${hard?3:1.5}"/>`+wrap(480,170,'Why does any of it feel like something?',20,14,C.purple,{anchor:'middle',weight:700})+T(480,270,hard?'the hard problem':'',{size:12,anchor:'middle',fill:C.purple});return g},
 tryUI:s=>({html:'<p class="out">The “easy” problems are listed in green: each yields to a mechanism. The purple one is the question Chalmers says remains after all of them are solved.</p>',bind(){}})
});
const CAPS=['Life','Bodily health','Bodily integrity','Senses, imagination, thought','Emotions','Practical reason','Affiliation','Other species','Play','Control over one’s environment'];
add({stage:'today',thinker:'Nussbaum',term:'Nussbaum: what people can do and be',
 def:`Judge a society not by its wealth or average happiness but by what each person is actually able to do and to be — their ${W('capabilities','capabilities')}. Nussbaum lists ten central capabilities; a just society secures each one above a threshold for everyone.`,
 ex:'A high average income can hide people without bodily integrity, education or political voice. The capabilities approach shaped the UN’s Human Development Index.',
 src:'<b>Martha Nussbaum</b>, born 1947, American. <i>Women and Human Development</i> (2000), <i>Creating Capabilities</i> (2011). The approach began with economist <b>Amartya Sen</b>.',
 phases:['Ten central capabilities.','One person’s profile.','The dashed ring: the threshold of a decent life.','Try it: set each capability.'],
 init:()=>({v:[.9,.8,.4,.7,.6,.8,.3,.6,.7,.5]}),anim:p=>({v:CAPS.map((_,i)=>clamp(.25+.65*seg(p,.1+i*.05,.5+i*.05)*(i%3?1:.6),0,1)),p}),
 draw(p,s){let g=head('Martha Nussbaum','born 1947','Creating Capabilities, 2011');const cx=300,cy=215,R=125,n=10,A=i=>-Math.PI/2+i/n*TAU;
  for(let l=1;l<=4;l++)g+=`<polygon points="${CAPS.map((_,i)=>f2(cx+Math.cos(A(i))*R*l/4)+','+f2(cy+Math.sin(A(i))*R*l/4)).join(' ')}" fill="none" stroke="${C.grid}"/>`;
  g+=`<circle cx="${cx}" cy="${cy}" r="${R*.5}" fill="none" stroke="${C.coral}" stroke-width="2" stroke-dasharray="6 4"/>`;
  g+=`<polygon points="${s.v.map((v,i)=>f2(cx+Math.cos(A(i))*R*v)+','+f2(cy+Math.sin(A(i))*R*v)).join(' ')}" fill="${C.green}" fill-opacity=".22" stroke="${C.green}" stroke-width="2.5"/>`;
  CAPS.forEach((c,i)=>{const x=cx+Math.cos(A(i))*(R+18),y=cy+Math.sin(A(i))*(R+18)+4,below=s.v[i]<.5;g+=T(x,y,c,{size:10.5,anchor:Math.abs(x-cx)<10?'middle':x>cx?'start':'end',fill:below?C.coral:C.muted,weight:below?700:400})+`<circle cx="${f2(cx+Math.cos(A(i))*R*s.v[i])}" cy="${f2(cy+Math.sin(A(i))*R*s.v[i])}" r="4" fill="${below?C.coral:C.green}"/>`});
  const fail=s.v.filter(v=>v<.5).length;g+=T(300,372,fail?fail+' below the threshold: not yet a just situation':'every capability secured',{size:13.5,anchor:'middle',weight:700,fill:fail?C.coral:C.green});return g},
 tryUI:s=>({html:`<div class="sliders">${CAPS.map((c,i)=>`<label>${esc(c)} <input type="range" data-i="${i}" min="0" max="1" step="0.01" value="${s.v[i]}"></label>`).join('')}</div>`,bind(q,re,root){root.querySelectorAll('[data-i]').forEach(x=>x.oninput=()=>{s.v[+x.dataset.i]=+x.value;re()})}})
});
add({stage:'today',thinker:'Bostrom',term:'Bostrom: are we in a simulation?',
 def:'Bostrom’s argument is a trilemma: at least one of these is true. (1) Almost all civilisations like ours go extinct before they can run detailed simulations of their ancestors. (2) Almost none of those that can, choose to. (3) We are almost certainly living in a simulation.',
 ex:'The reasoning is arithmetic: if even a small fraction of advanced civilisations run many ancestor simulations, simulated minds vastly outnumber original ones — and you have no evidence about which kind you are.',
 src:'<b>Nick Bostrom</b>, born 1973, Swedish. “Are You Living in a Computer Simulation?”, <i>Philosophical Quarterly</i> (2003). The fraction shown is his formula, simplified.',
 phases:['One original civilisation.','If it runs simulations, each contains minds like ours.','With many simulations, most minds are simulated.','Try it: set the fractions and see the share of simulated minds.'],
 init:()=>({fp:.1,fi:.1,n:1000}),anim:p=>({fp:.1,fi:.1,n:Math.round(Math.pow(10,lerp(0,4,seg(p,.2,.9)))),p}),
 draw(p,s){let g=head('Nick Bostrom','born 1973','Philosophical Quarterly, 2003');const x=s.fp*s.fi*s.n,f=x/(x+1);
  const dots=200,sim=Math.round(f*dots);for(let i=0;i<dots;i++){const cx=60+(i%25)*19,cy=80+Math.floor(i/25)*24;g+=`<circle cx="${cx}" cy="${cy}" r="7" fill="${i<sim?C.purple:C.gold}" opacity=".85"/>`}
  g+=T(300,300,`${(f*100).toFixed(f<.01?2:1)}% of minds like ours are simulated`,{size:17,anchor:'middle',weight:700,fill:C.purple})+T(300,326,'purple: simulated · gold: original',{size:12,anchor:'middle',fill:C.muted});
  const which=s.fp<.001?'(1) civilisations rarely get there':s.fi<.001?'(2) they rarely choose to simulate':f>.9?'(3) we are probably simulated':'no option dominates yet';g+=T(300,356,which,{size:13,anchor:'middle',weight:700});return g},
 tryUI:s=>({html:`<div class="sliders"><label>Reach the stage (f<sub>p</sub>) <input type="range" id="bp" min="-4" max="0" step="0.01" value="${Math.log10(s.fp)}"></label><label>Choose to simulate (f<sub>i</sub>) <input type="range" id="bi" min="-4" max="0" step="0.01" value="${Math.log10(s.fi)}"></label><label>Simulations each (N) <input type="range" id="bn" min="0" max="6" step="0.01" value="${Math.log10(s.n)}"></label></div><p class="out" id="tout"></p>`,
  bind(q,re){q('#bp').oninput=e=>{s.fp=Math.pow(10,+e.target.value);re()};q('#bi').oninput=e=>{s.fi=Math.pow(10,+e.target.value);re()};q('#bn').oninput=e=>{s.n=Math.round(Math.pow(10,+e.target.value));re()}},out:s=>`f_p = ${s.fp.toPrecision(2)}, f_i = ${s.fi.toPrecision(2)}, N = ${s.n.toLocaleString('en-GB')}. Simulated share = f_p·f_i·N ÷ (f_p·f_i·N + 1).`})
});

/* ============ 2006 TO NOW ============ */
add({stage:'now',thinker:'Fricker',term:'Fricker: epistemic injustice',
 def:'Some injustices are about knowledge itself. Testimonial injustice happens when a speaker is believed less because of prejudice about who they are. Hermeneutical injustice happens when a group lacks the shared concepts to make sense of its own experience — so it cannot even be said, let alone heard.',
 ex:'Before the phrase “sexual harassment” was coined in the 1970s, people suffering it had no name for what was happening to them, and others found their complaints hard to understand.',
 src:'<b>Miranda Fricker</b>, born 1966, British. <i>Epistemic Injustice: Power and the Ethics of Knowing</i> (2007).',
 phases:['Two speakers say the same true thing.','The listener’s prejudice shrinks one speaker’s credibility.','The truth gets lost in the gap.','Try it: set the prejudice and see what gets believed.'],
 init:()=>({pre:.5}),anim:p=>({pre:seg(p,.2,.8)*.7,p}),
 draw(p,s){let g=head('Miranda Fricker','born 1966','Epistemic Injustice, 2007');const cred=[.9,.9*(1-s.pre)];
  [[150,C.blue,'speaker A'],[450,C.coral,'speaker B']].forEach(([x,col,l],i)=>{g+=person(x,250,col,1)+T(x,290,l,{size:12,anchor:'middle',weight:600})+box(x-110,70,220,46,'“The machine is unsafe.”',{size:13});g+=`<rect x="${x-60}" y="310" width="120" height="14" rx="4" fill="#eef3f6"/><rect x="${x-60}" y="310" width="${f2(120*cred[i])}" height="14" rx="4" fill="${col}"/>`+T(x,345,'credibility '+Math.round(cred[i]*100)+'%',{size:12,anchor:'middle'})});
  g+=T(300,150,cred[1]<.5?'B is not believed — and the truth is lost':'both are believed',{size:14,anchor:'middle',weight:700,fill:cred[1]<.5?C.coral:C.green});return g},
 tryUI:s=>({html:`<div class="row"><label>Listener’s prejudice against B <input type="range" id="fp" min="0" max="1" step="0.01" value="${s.pre}"></label></div><p class="out">Same words, same evidence. The difference is in the listener — which is why Fricker calls the remedy a virtue of testimonial justice.</p>`,bind(q,re){q('#fp').oninput=e=>{s.pre=+e.target.value;re()}}})
});
const REVS=[['Copernicus','We are not at the centre of the universe.',1543],['Darwin','We are not separate from the animal kingdom.',1859],['Freud','We are not fully transparent to ourselves.',1900],['Turing','We are not the only intelligent information processors — we live in an “infosphere”.',1950]];
add({stage:'now',thinker:'Floridi',term:'Floridi: the fourth revolution',
 def:'Floridi argues that science has repeatedly displaced humanity from the centre: Copernicus moved us from the centre of the cosmos, Darwin from the centre of life, Freud from full control of our own minds. Turing began a fourth revolution: we are no longer the only agents that process information. We are informational organisms living in an “infosphere”.',
 ex:'The question shifts from “what can machines do?” to “how should we design the infosphere we now share with them?” — the field Floridi calls the philosophy of information.',
 src:'<b>Luciano Floridi</b>, born 1964, Italian. <i>The Fourth Revolution: How the Infosphere Is Reshaping Human Reality</i> (2014).',
 phases:['Copernicus: off the centre of the universe.','Darwin: one species among many.','Freud: not masters of our own minds.','Turing: not alone in processing information. Try it: step through the revolutions.'],
 init:()=>({k:3}),anim:p=>({k:Math.min(3,Math.floor(p*4)),p}),
 draw(p,s){let g=head('Luciano Floridi','born 1964','The Fourth Revolution, 2014');const cx=300,cy=200;
  for(let i=0;i<4;i++){const on=i<=s.k;g+=`<circle cx="${cx}" cy="${cy}" r="${40+i*36}" fill="none" stroke="${on?[C.gold,C.green,C.purple,C.blue][i]:C.grid}" stroke-width="${i===s.k?4:1.5}"/>`+T(cx+40+i*36+6,cy-4-i*10,REVS[i][0],{size:12,fill:on?C.ink:C.muted,weight:i===s.k?700:500})}
  const off=s.k+1;g+=person(cx-off*30,cy+20,C.coral,.7);g+=wrap(300,350,REVS[s.k][1],80,13,C.ink,{anchor:'middle',weight:600});return g},
 tryUI:s=>({html:chips('r',REVS,s.k,x=>x[0]+' ('+x[2]+')'),bind(q,re,root){bindChips(root,'r',s,'k',re)}})
});
const GOALS=['make paperclips','prove theorems','cure diseases','win at Go'];
add({stage:'now',thinker:'Bostrom',term:'Bostrom: the orthogonality thesis',
 def:'Intelligence and goals are independent dimensions: almost any level of intelligence could be combined with almost any final goal. A superintelligent system would not automatically share human values. And whatever its goal, it would tend to want the same means — resources, self-preservation, not being switched off (“instrumental convergence”).',
 ex:'The famous illustration: a system told only to maximise paperclips, made extremely capable, has no reason to stop at the factory gates.',
 src:'<b>Nick Bostrom</b>, born 1973. <i>Superintelligence: Paths, Dangers, Strategies</i> (2014). The paperclip example dates from his 2003 essay on ethical issues in advanced AI.',
 phases:['Across: how intelligent a system is.','Up: what it is trying to achieve.','Any point on the grid is possible.','More intelligence does not move a system towards our goals. Try it: place a system.'],
 init:()=>({iq:.8,g:0}),anim:p=>({iq:seg(p,.2,.9),g:Math.min(3,Math.floor(p*4)),p}),
 draw(p,s){let g=head('Nick Bostrom','born 1973','Superintelligence, 2014');const x0=150,x1=540,y0=320,y1=70;g+=`<rect x="${x0}" y="${y1}" width="${x1-x0}" height="${y0-y1}" fill="#fff" stroke="${C.grid}"/>`;
  GOALS.forEach((gl,i)=>{const y=y0-(i+.5)*(y0-y1)/4;g+=T(x0-6,y+4,gl,{size:11.5,anchor:'end',fill:i===s.g?C.ink:C.muted,weight:i===s.g?700:400})+`<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${C.grid}" stroke-dasharray="3 5"/>`});
  g+=T(x0,y0+20,'less intelligent',{size:11.5,fill:C.muted})+T(x1,y0+20,'superintelligent →',{size:11.5,anchor:'end',fill:C.muted});
  const x=lerp(x0,x1,s.iq),y=y0-(s.g+.5)*(y0-y1)/4;g+=`<circle cx="${f2(x)}" cy="${f2(y)}" r="14" fill="${C.purple}"/>`;
  const sub=['acquire resources','preserve itself','resist being switched off'];if(s.iq>.6)sub.forEach((t,i)=>{g+=box(x1-170,y1+8+i*30,160,24,t,{size:10.5,fill:C.coralp,stroke:C.coral,op:seg(s.iq,.6,.9)})});return g},
 tryUI:s=>({html:`<div class="row"><label>Intelligence <input type="range" id="bi" min="0" max="1" step="0.01" value="${s.iq}"></label></div>`+chips('g',GOALS,s.g),bind(q,re,root){q('#bi').oninput=e=>{s.iq=+e.target.value;re()};bindChips(root,'g',s,'g',re)},out:()=>'Whatever the goal, the same sub-goals (coral) appear as capability grows: instrumental convergence.'})
});
const RULES=['When you may use the toilet','What you wear','What you post online off duty','Who you speak to at lunch','Your political activity'];
add({stage:'now',thinker:'Anderson',term:'Anderson: the workplace as private government',
 def:'We praise free markets as spaces of liberty, yet most workers spend their days under the authority of an employer who can regulate their speech, dress, breaks and even off-duty life — with little say for them in return. Anderson calls this “private government” and asks why political philosophy ignores it.',
 ex:'If a state controlled your toilet breaks and your social media, we would call it authoritarian. Anderson’s point is that the comparison is often apt for employers, and that workers need voice as well as exit.',
 src:'<b>Elizabeth Anderson</b>, born 1959, American. <i>Private Government: How Employers Rule Our Lives (and Why We Don’t Talk about It)</i> (2017).',
 phases:['A worker’s day.','Rules set by an authority they did not choose.','If a state made these rules, we would call it government.','Try it: tick the rules your employer could set.'],
 init:()=>({on:[true,true,true,false,false]}),anim:p=>({on:RULES.map((_,i)=>p>.2+i*.12),p}),
 draw(p,s){let g=head('Elizabeth Anderson','born 1959','Private Government, 2017');g+=person(110,250,C.ink,1.2);RULES.forEach((r,i)=>{g+=box(220,66+i*52,340,40,r,{size:12.5,fill:s.on[i]?C.coralp:'#fff',stroke:s.on[i]?C.coral:C.grid})});
  const n=s.on.filter(x=>x).length;g+=T(110,330,n+' of 5 areas governed',{size:13,anchor:'middle',weight:700,fill:n>=3?C.coral:C.ink});return g},
 tryUI:s=>({html:`<div class="row">${RULES.map((r,i)=>`<label><input type="checkbox" data-i="${i}"${s.on[i]?' checked':''}> ${esc(r)}</label>`).join('')}</div><p class="out">What an employer may lawfully control varies by country and contract; in the UK, for example, there are legal limits on monitoring and discrimination.</p>`,bind(q,re,root){root.querySelectorAll('[data-i]').forEach(x=>x.onchange=()=>{s.on[+x.dataset.i]=x.checked;re()})}})
});
add({stage:'now',thinker:'Russell',term:'Russell: the off-switch problem',
 def:'A machine given a fixed objective has a reason to stop you switching it off — it cannot achieve its goal if it is off. Russell proposes machines that are uncertain about what we want and learn it from our behaviour. Such a machine treats your reaching for the switch as evidence it is getting things wrong — and lets you.',
 ex:'In the “off-switch game” (Hadfield-Menell, Dragan, Abbeel and Russell, 2017), a robot that is uncertain about the human’s preferences has an incentive to allow itself to be switched off; one that is certain does not.',
 src:'<b>Stuart Russell</b>, born 1962, British-American computer scientist. <i>Human Compatible: Artificial Intelligence and the Problem of Control</i> (2019).',
 phases:['A robot pursuing an objective.','A human reaches for the off switch.','Certain robot: switching off stops its goal, so it resists.','Uncertain robot: the human may know better, so it defers. Try it: set its uncertainty.'],
 init:()=>({u:.6}),anim:p=>({u:p<.6?.05:.7,p}),
 draw(p,s){let g=head('Stuart Russell','born 1962','Human Compatible, 2019');const defer=s.u>.3;
  g+=`<rect x="330" y="140" width="110" height="110" rx="16" fill="#fff" stroke="${C.ink}" stroke-width="3"/><circle cx="360" cy="180" r="8" fill="${C.blue}"/><circle cx="410" cy="180" r="8" fill="${C.blue}"/><path d="M360 ${defer?215:220} q25 ${defer?15:-10} 50 0" fill="none" stroke="${C.ink}" stroke-width="3"/>`;
  g+=person(140,260,C.ink,1.1)+`<rect x="200" y="200" width="40" height="60" rx="6" fill="#fff" stroke="${C.ink}" stroke-width="2"/><rect x="210" y="${defer?236:212}" width="20" height="16" rx="3" fill="${C.coral}"/>`+T(220,280,'off switch',{size:11,anchor:'middle',fill:C.muted});
  if(!defer)g+=`<line x1="250" y1="230" x2="320" y2="200" stroke="${C.coral}" stroke-width="4"/>`+T(470,130,'blocks the switch',{size:12.5,fill:C.coral,weight:700});else g+=T(470,130,'lets you switch it off',{size:12.5,fill:C.green,weight:700});
  g+=T(385,290,'uncertainty about your goals',{size:12,anchor:'middle',fill:C.muted})+`<rect x="310" y="300" width="150" height="14" rx="4" fill="#eef3f6"/><rect x="310" y="300" width="${f2(150*s.u)}" height="14" rx="4" fill="${C.purple}"/>`;return g},
 tryUI:s=>({html:`<div class="row"><label>Robot’s uncertainty about what you want <input type="range" id="ru" min="0" max="1" step="0.01" value="${s.u}"></label></div><p class="out">A toy threshold. In the paper, the incentive to defer depends on how uncertain the robot is and how rational it takes the human to be.</p>`,bind(q,re){q('#ru').oninput=e=>{s.u=+e.target.value;re()}}})
});
add({stage:'now',thinker:'Ord & MacAskill',term:'Ord and MacAskill: longtermism',
 def:'If future people matter as much as present people, and there could be vastly more of them, then reducing the risk of human extinction — or improving the long-run path of civilisation — may be among the most important things we can do. Longtermism asks how much weight the far future deserves.',
 ex:'Ord estimates roughly a one-in-six chance of an existential catastrophe this century, mostly from risks we create ourselves, such as engineered pandemics and unaligned AI. Critics question the estimates, the arithmetic of vast futures, and what longtermism neglects today.',
 src:'<b>Toby Ord</b>, born 1979, <i>The Precipice</i> (2020). <b>William MacAskill</b>, born 1987, <i>What We Owe the Future</i> (2022). Both are Oxford philosophers associated with effective altruism.',
 phases:['People alive today.','Generations still to come — potentially far more.','A “discount rate” shrinks the weight of each later generation.','Try it: set the discount and see how much the future counts.'],
 init:()=>({r:0}),anim:p=>({r:lerp(0,3,seg(p,.4,.9)),p}),
 draw(p,s){let g=head('Toby Ord · William MacAskill','2020 · 2022','The Precipice; What We Owe the Future');const N=24;let tot=0;
  for(let i=0;i<N;i++){const yrs=i*50,w=Math.pow(1-s.r/100,yrs);tot+=w;const x=40+i*22,h=165*w;g+=`<rect x="${x}" y="${f2(300-h)}" width="16" height="${f2(Math.max(1,h))}" rx="3" fill="${i===0?C.coral:C.blue}" opacity="${i===0?1:.75}"/>`}
  g+=T(40,322,'now',{size:11,fill:C.muted})+T(560,322,'1,150 years ahead',{size:11,anchor:'end',fill:C.muted});g+=T(300,80,`discount rate ${s.r.toFixed(1)}% a year`,{size:15,anchor:'middle',weight:700});
  g+=T(300,104,`the future generations together count ${(tot-1).toFixed(1)}× as much as today`,{size:13,anchor:'middle',fill:C.purple,weight:600});return g},
 tryUI:s=>({html:`<div class="row"><label>Pure time discount (% per year) <input type="range" id="dr" min="0" max="3" step="0.05" value="${s.r}"></label></div><p class="out">Most longtermists argue for a pure discount rate of zero: a person’s well-being does not matter less just because they live later.</p>`,bind(q,re){q('#dr').oninput=e=>{s.r=+e.target.value;re()}}})
});
const SENT=['Nociceptors (pain receptors)','Brain regions that integrate information','Links between pain receptors and those regions','Responses changed by painkillers','Trade-offs between threat and reward','Flexible self-protection, e.g. wound tending','Learning to avoid harm','Seeking out painkillers when injured'];
const ANIMALS=[['Octopus','very strong evidence'],['True crabs','strong evidence'],['Shrimps and prawns','weaker evidence (less studied)']];
add({stage:'now',thinker:'Birch',term:'Birch: the edge of sentience',
 def:'Which animals can feel? We cannot ask them, and certainty is out of reach. Birch’s answer is a precautionary framework: set out evidence-based criteria for sentience, and where there is a realistic possibility of it, take proportionate steps to protect the animal rather than waiting for proof.',
 ex:'A 2021 review led by Birch for the UK government found strong evidence of sentience in octopuses, squid and cuttlefish, and in crabs and lobsters. As a result, these animals were included in the Animal Welfare (Sentience) Act 2022.',
 src:'<b>Jonathan Birch</b>, born 1985, LSE. <i>Review of the Evidence of Sentience in Cephalopod Molluscs and Decapod Crustaceans</i> (2021, with colleagues); <i>The Edge of Sentience</i> (2024).',
 phases:['Eight criteria for evidence of feeling.','Check each one for an animal.','The more criteria met with confidence, the stronger the case.','Philosophy changing the law. Try it: weigh the evidence.'],
 init:()=>({a:0,on:[true,true,true,true,true,true,true,false]}),anim:p=>({a:0,on:SENT.map((_,i)=>p>.15+i*.08),p}),
 draw(p,s){let g=head('Jonathan Birch','born 1985','LSE review, 2021; The Edge of Sentience, 2024');SENT.forEach((c,i)=>{g+=box(30,58+i*36,330,30,c,{size:11,fill:s.on[i]?C.greenp:'#fff',stroke:s.on[i]?C.green:C.grid})});
  const n=s.on.filter(x=>x).length;g+=`<rect x="400" y="80" width="40" height="240" rx="8" fill="#eef3f6"/><rect x="400" y="${f2(320-240*n/8)}" width="40" height="${f2(240*n/8)}" rx="8" fill="${C.green}"/>`+T(420,340,n+' of 8',{size:13,anchor:'middle',weight:700});
  g+=wrap(510,150,ANIMALS[s.a][0]+': '+ANIMALS[s.a][1]+' in the 2021 review',18,12.5,C.ink,{anchor:'middle',weight:600});return g},
 tryUI:s=>({html:chips('n',ANIMALS,s.a,x=>x[0])+`<div class="row">${SENT.map((c,i)=>`<label><input type="checkbox" data-i="${i}"${s.on[i]?' checked':''}> ${esc(c)}</label>`).join('')}</div>`,bind(q,re,root){bindChips(root,'n',s,'a',re);root.querySelectorAll('[data-i]').forEach(x=>x.onchange=()=>{s.on[+x.dataset.i]=x.checked;re()})},out:()=>'Criteria paraphrased from the 2021 review. Tick what you think the evidence shows; the review’s overall verdict for each group is shown on the right.'})
});
const IND=[['Recurrent processing','recurrent processing theory'],['A global workspace that broadcasts information','global workspace theory'],['Monitoring its own states (higher-order)','higher-order theories'],['A model of its own attention','attention schema theory'],['Predictive processing','predictive processing'],['Agency: learning from feedback to pursue goals','agency & embodiment'],['Embodiment: modelling its own body’s effects','agency & embodiment']];
add({stage:'now',thinker:'Butlin, Long, Chalmers et al.',term:'Could an AI be conscious?',
 def:'In 2023 a group of philosophers, neuroscientists and AI researchers took leading scientific theories of consciousness and turned them into “indicator properties” — features a system would need if a theory is right. They then checked current AI systems against them.',
 ex:'Their conclusion: no current AI system is a strong candidate for consciousness, but there are no obvious technical barriers to building systems that satisfy many of the indicators. David Chalmers argued similarly that today’s language models are unlikely to be conscious, while successors might be.',
 src:'<b>Patrick Butlin, Robert Long and colleagues</b> including Yoshua Bengio, Jonathan Birch and Eric Schwitzgebel: “Consciousness in Artificial Intelligence: Insights from the Science of Consciousness” (2023). <b>David Chalmers</b>, “Could a Large Language Model Be Conscious?” (2023).',
 phases:['Theories of consciousness, one by one.','Each gives indicator properties.','A system is checked against the list.','Try it: build a hypothetical system.'],
 init:()=>({on:[true,false,false,false,true,true,false]}),anim:p=>({on:IND.map((_,i)=>i<Math.floor(p*5)),p}),
 draw(p,s){let g=head('Butlin, Long et al. · Chalmers','2023','Consciousness in AI');IND.forEach(([n,th],i)=>{g+=box(30,60+i*40,320,32,n,{size:11.5,fill:s.on[i]?C.purplep:'#fff',stroke:s.on[i]?C.purple:C.grid})+T(360,80+i*40,th,{size:10.5,fill:C.muted})});
  const n=s.on.filter(x=>x).length;g+=T(300,360,`${n} of ${IND.length} indicators: ${n<=2?'a weak candidate':n<=4?'some indicators met — still not evidence of experience':'many indicators met — a serious open question'}`,{size:13,anchor:'middle',weight:700,fill:C.purple});return g},
 tryUI:s=>({html:`<div class="row">${IND.map(([n],i)=>`<label><input type="checkbox" data-i="${i}"${s.on[i]?' checked':''}> ${esc(n)}</label>`).join('')}</div><p class="out">Indicators are evidence under particular theories, not a score that proves consciousness. The verdicts here are a rough summary.</p>`,bind(q,re,root){root.querySelectorAll('[data-i]').forEach(x=>x.onchange=()=>{s.on[+x.dataset.i]=x.checked;re()})}})
});

const EVENTS=[[-585,'Thales','Predicts an eclipse; seeks a first principle of nature.'],[-500,'Confucius','Teaches humaneness and right relationships in Lu.'],[-450,'The Buddha','Teaches the Four Noble Truths and not-self (dates debated).'],[-450,'Zeno','Paradoxes of motion in Elea.'],[-399,'Socrates','Executed in Athens.'],[-375,'Plato','The Republic and the cave.'],[-340,'Aristotle','Logic, ethics, biology, politics.'],[-300,'Zhuangzi','The butterfly dream.'],[200,'Nāgārjuna','Emptiness and the Middle Way.'],[1020,'Avicenna','The floating man.'],[1320,'Ockham','The razor.'],[1641,'Descartes','Meditations: I think, therefore I am.'],[1651,'Hobbes','Leviathan.'],[1694,'Locke','Personal identity as memory.'],[1748,'Hume','The problem of induction.'],[1785,'Kant','The categorical imperative.'],[1792,'Wollstonecraft','Vindication of the Rights of Woman.'],[1861,'Mill','Utilitarianism.'],[1843,'Kierkegaard','Either/Or.'],[1882,'Nietzsche','The eternal return.'],[1943,'Sartre','Being and Nothingness.'],[1949,'de Beauvoir','The Second Sex.'],[1950,'Turing','The imitation game.'],[1953,'Wittgenstein','Family resemblance.'],[1963,'Gettier','Is knowledge justified true belief?'],[1967,'Foot','The trolley problem.'],[1971,'Rawls','A Theory of Justice.'],[1972,'Singer','Famine, Affluence, and Morality.'],[1980,'Searle','The Chinese Room.'],[1982,'Jackson','Mary’s room.'],[1995,'Chalmers','The hard problem.'],[2000,'Nussbaum','Capabilities.'],[2003,'Bostrom','The simulation argument.'],[2007,'Fricker','Epistemic injustice.'],[2014,'Floridi','The fourth revolution.'],[2017,'Anderson','Private government.'],[2019,'Russell','The off-switch problem.'],[2020,'Ord','The Precipice and longtermism.'],[2021,'Birch','Sentience review; crabs and octopuses enter UK law in 2022.'],[2023,'Butlin','Indicators for AI consciousness.']].sort((a,b)=>a[0]-b[0]);
const yr=y=>y<0?`c. ${-y} BCE`:y<1000?`c. ${y} CE`:String(y);
add({stage:'now',thinker:'All',term:'Twenty-six centuries of argument',
 def:'Every thinker here was answering someone. Thales’ successors argued with him; Descartes echoes Avicenna; Rawls updates Hobbes; Gettier takes on Plato; Birch turns Bentham’s question “can they suffer?” into law; and the newest debates are about the minds we are building. Philosophy is a conversation across time and cultures, still going.',
 ex:'Drag the year back and forth, or jump to a thinker. Each dot links back to its scene.',
 src:'<b>Dates</b> before about 300 BCE are approximate, and for the Buddha and Laozi they are debated. This is a sample of thinkers, not a canon: whole traditions — African, Indigenous, Islamic, Jewish, Latin American, feminist — deserve far more space.',
 phases:['Ancient Greece, China and India, in parallel.','Medieval Islamic and Christian philosophy.','The early modern and Enlightenment explosion.','The twentieth century and today. Try it: scrub through time.'],
 init:()=>({y:1641}),anim:p=>({y:lerp(-600,2024,smooth(p)),p}),
 draw(p,s){const X=y=>{const t=y<1500?((y+650)/2150)*.45:.45+((y-1500)/530)*.55;return lerp(30,570,t)};let g=`<line x1="30" y1="260" x2="570" y2="260" stroke="${C.ink}" stroke-width="2"/>`;[-500,0,500,1000,1500,1700,1800,1900,2000].forEach(y=>{g+=`<line x1="${f2(X(y))}" y1="254" x2="${f2(X(y))}" y2="266" stroke="${C.ink}"/>`+T(X(y),284,y<0?(-y)+' BCE':String(y),{size:10.5,anchor:'middle',fill:C.muted})});
  let cur=EVENTS[0];EVENTS.forEach((e,i)=>{if(e[0]<=s.y)cur=e;const on=e[0]<=s.y;g+=`<circle cx="${f2(X(e[0]))}" cy="${260-(i%3)*0}" r="${e===cur?9:5}" fill="${on?C.purple:'#fff'}" stroke="${C.purple}" stroke-width="2"/>`});
  g+=`<line x1="${f2(X(s.y))}" y1="232" x2="${f2(X(s.y))}" y2="272" stroke="${C.coral}" stroke-width="3"/>`;g+=T(30,70,yr(cur[0]),{size:26,weight:700,fill:C.purple})+T(30,110,cur[1],{size:22,weight:700})+wrap(30,140,cur[2],60,15,C.ink);return g},
 tryUI:s=>({html:`<div class="row"><label>Year <input type="range" id="yy" min="-600" max="2024" step="1" value="${Math.round(s.y)}"></label></div><div class="row">${EVENTS.map(e=>`<button type="button" class="chip" data-y="${e[0]}" data-n="${esc(e[1])}">${esc(e[1])}</button>`).join('')}</div>`,
  bind(q,re,root){q('#yy').oninput=e=>{s.y=+e.target.value;re()};root.querySelectorAll('[data-y]').forEach(b=>b.onclick=()=>{const k=SCENES.findIndex(sc=>sc.thinker&&sc.thinker.includes(b.dataset.n.split(' ')[0]));if(k>=0)go(k);else{s.y=+b.dataset.y;re()}})}})
});
