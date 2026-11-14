# Mathematics In Motion

Interactive maths page (v0.11). Open `index.html` in a browser.

## Zigzag Realms

`zigzag-realms.html` is a D&D-style exploration game whose map builds itself.
Every place, item, person, creature, anomaly and stat is a cell in a ZigZag
structure (`d.x` east/west, `d.y` north/south, `d.z` up/down, `d.river` the
river's flow, `d.residents` a town's people, `d.contain` stores, `d.stat` the
character sheet, `d.occupant` an anomaly at a place, `d.at` where you stand).

- A prepopulated region: a river that rises at the mountain and ends in a
  bottomless hole, three towns (with shops and inns), a ford, a stone bridge
  and a magical bridge that comes and goes, a woodland with a magical grove, a
  mountain path to the peak, two lakes, a waterfall, caves under the mountain,
  a desert, and twelve monuments that each reveal one of the game's real rules.
- Places beyond are written one step ahead by the AI narrator (or built-in
  tables), with explicit exits, so each direction shows what you can see.
- 20 townsfolk and 10 creatures move, forage, fight or flee, go home at night,
  and form a social graph from a small dynamical model of ties.
- A world clock at 4× speed, weather driven by a mountain storm engine and a
  desert heat engine, lightning, and forest fires.
- d20 combat against original SCP-style anomalies; a lantern is needed at
  night and underground; death offers waking at the start or a paid resurrection.
- A generated soundtrack (noise beds, birds, crickets, drips, crackle, thunder).
- The world is 65 squares across and wraps round at the veil of golden mist.

As a Claude artifact it narrates with Claude and saves to the viewer's Claude
account. Hosted on puter.site (wrap the file in a doctype/html/body shell as
`index.html`) it uses Puter sign-in, a cheap model through `puter.ai.chat`, and
Puter KV storage. Opened as a plain file it uses built-in tables and saves in
the browser.
