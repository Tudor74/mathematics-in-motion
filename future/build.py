#!/usr/bin/env python3
"""Assemble index.html from the shared In Motion engine (Electronic Music page), future-data.json and rscenes.js."""
import json,re,subprocess,os
H=os.path.dirname(os.path.abspath(__file__))
src=subprocess.run(['git','show','electronic-music-in-motion:emusic/index.html'],capture_output=True,text=True,cwd=H,check=True).stdout
FD=json.load(open(os.path.join(H,'future-data.json')))
def rep(s,a,b):
    assert a in s,('MISSING',a[:60]); return s.replace(a,b,1)
head=src[:src.index('<script>')]
head=rep(head,'<title>Electronic Music In Motion — v0.1</title>','<title>The Future In Motion — v0.1</title>')
head=re.sub(r'<meta name="description" content="[^"]*">','<meta name="description" content="Twenty-four technologies, from AI and fusion to cultivated meat and satellite internet: where each stands today, with sourced data, and a playful, clearly labelled prediction for 2040.">',head,count=1)
head=rep(head,'<p class="eyebrow">Electronic Music In Motion · v0.1</p><h1 id="stage-title">Sound</h1>','<p class="eyebrow">The Future In Motion · v0.1</p><h1 id="stage-title">How to read the future</h1>')
head=re.sub(r'<div class="counter" id="counter" aria-live="polite">[^<]*</div>','<div class="counter" id="counter" aria-live="polite">1 / 26</div>',head,count=1)
head=re.sub(r'<p class="honest">.*?</p>','<p class="honest"><strong>Fact and fiction, clearly separated:</strong> solid blue points are real figures with sources, checked in November 2026. Dashed purple lines are projections you control. Every 2040 card is playful speculation, labelled likely, plausible or wildcard — not a forecast to bet on.</p>',head,count=1,flags=re.S)
head=rep(head,'\n  <div class="soundbar"><button type="button" class="snd" id="snd" aria-pressed="false">🔊 Sound on</button><span id="snd-note">Turn your volume down first.</span></div>','')
head=re.sub(r'<footer>.*?</footer>','<footer>Part of the In Motion family, built the same way: every diagram is a pure function of time, so Watch can rewind, and Try it hands the same diagram to you. Figures come from public sources such as the IEA, IRENA, BloombergNEF, Our World in Data, the UN, NASA and company reports; each scene links its sources. Keys: ←/→ scenes, space play/pause, T try it. Speed slider: hold left of zero to rewind; release pauses.</footer>',head,count=1,flags=re.S)
s0=src.index('<script>')+8
helpers=src[s0:src.index('/* ---------------- Audio ---------------- */')]
helpers=helpers.replace(src[src.index('/* Design note'):src.index('const $=id=>')],'')
engine=src[src.index('/* ---------- App ---------- */'):src.rindex('</script>')]
engine=rep(engine,"$('snd').onclick=()=>{if(!SCENES[idx].audio)return;if(Sound.on){Sound.stop();render();return}if(mode!=='try'){setRate(0);mode='try';t=DUR;setTry()}Sound.start();render()};\n","")
engine=engine.replace("window.__EM=","window.__FU=")
stub="const Sound={on:false,start(){},stop(){},restart(){},update(){},note(){},time(){return performance.now()/1000}};function soundBar(){}\nlet keyHandler=null;\nconst GLOSSARY={};\n"
out=head+'<script>\n'+helpers+'\nconst FD='+json.dumps(FD,ensure_ascii=False)+';\n'+open(os.path.join(H,'fscenes.js')).read()+'\n'+stub+engine+'</script>\n</body>\n</html>\n'
open(os.path.join(H,'index.html'),'w').write(out);print('index.html',len(out.encode()),'bytes')
