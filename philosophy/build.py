#!/usr/bin/env python3
"""Assemble index.html from the shared In Motion engine (Electronic Music page), glossary.js and scenes.js."""
import re,subprocess,os
H=os.path.dirname(os.path.abspath(__file__))
src=subprocess.run(['git','show','electronic-music-in-motion:emusic/index.html'],capture_output=True,text=True,cwd=H,check=True).stdout
def rep(s,a,b):
    assert a in s,('MISSING',a[:60]); return s.replace(a,b,1)
n=open(os.path.join(H,'scenes.js')).read().count("thinker:")
head=src[:src.index('<script>')]
head=rep(head,'<title>Electronic Music In Motion — v0.1</title>','<title>Philosophy In Motion — v0.2</title>')
head=re.sub(r'<meta name="description" content="[^"]*">','<meta name="description" content="Famous thinkers from Thales to today, one idea each, as animated diagrams you can play, rewind and try.">',head,count=1)
head=rep(head,'<p class="eyebrow">Electronic Music In Motion · v0.1</p><h1 id="stage-title">Sound</h1>','<p class="eyebrow">Philosophy In Motion · v0.2</p><h1 id="stage-title">Ancient worlds</h1>')
head=re.sub(r'<div class="counter" id="counter" aria-live="polite">[^<]*</div>',f'<div class="counter" id="counter" aria-live="polite">1 / {n}</div>',head,count=1)
head=re.sub(r'<p class="honest">.*?</p>','<p class="honest"><strong>How to read this:</strong> each scene gives one famous idea from one thinker, from ancient Greece, China and India to debates of the 2020s. Ideas are simplified so they can be drawn; quotations are in English translation; dates before about 300 BCE are approximate. Every scene ends with Try it: change the picture and see what follows.</p>',head,count=1,flags=re.S)
head=rep(head,'\n  <div class="soundbar"><button type="button" class="snd" id="snd" aria-pressed="false">🔊 Sound on</button><span id="snd-note">Turn your volume down first.</span></div>','')
head=re.sub(r'<footer>.*?</footer>','<footer>Part of the In Motion family, built the same way: every diagram is a pure function of time, so Watch can rewind, and Try it hands the same diagram to you. Each scene names the thinker, the work and its date. A sample of thinkers, not a canon. Keys: ←/→ scenes, space play/pause, T try it. Speed slider: hold left of zero to rewind; release pauses.</footer>',head,count=1,flags=re.S)
s0=src.index('<script>')+8
helpers=src[s0:src.index('/* ---------------- Audio ---------------- */')]
helpers=helpers.replace(src[src.index('/* Design note'):src.index('const $=id=>')],'')
engine=src[src.index('/* ---------- App ---------- */'):src.rindex('</script>')]
engine=rep(engine,"$('snd').onclick=()=>{if(!SCENES[idx].audio)return;if(Sound.on){Sound.stop();render();return}if(mode!=='try'){setRate(0);mode='try';t=DUR;setTry()}Sound.start();render()};\n","")
engine=engine.replace("window.__EM=","window.__PH=")
stub="const Sound={on:false,start(){},stop(){},restart(){},update(){},note(){},time(){return performance.now()/1000}};function soundBar(){}\nlet keyHandler=null;\n"
out=head+'<script>\n'+helpers+'\n'+open(os.path.join(H,'glossary.js')).read()+'\n'+open(os.path.join(H,'scenes.js')).read()+'\n'+stub+engine+'</script>\n</body>\n</html>\n'
open(os.path.join(H,'index.html'),'w').write(out);print('index.html',len(out.encode()),'bytes,',n,'scenes')
