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

### The realm script

`tools/realm-script.mjs` generates a new 26-letter alphabet for English and writes
`tools/realm-script.json`, which the game embeds and turns into a font in the
browser (toggle "Script" in the header). Each letter is described by 21
features (Latin form, English sound, the meaning of the Proto-Sinaitic
pictograph it descends from, frequency), reduced to three principal components
that set terminals and corners. Glyphs are drawn from the source pictographs,
and a frequency-weighted search over variants keeps frequent letters light and
hard to confuse. Run `node tools/realm-script.mjs` to regenerate.

### v0.2: the garden, encounters and reputation

- **The garden**: a canvas of flowers grown from the social graph. One flower per
  group held together by friendly ties; petals from group size, layers from
  clustering, petal length from tie strength, seed spirals from overall bloom.
  Flowers droop, shed petals and grow thorns as the fabric sours.
- **Conversation**: a back-and-forth chat with each townsperson, written by the
  narrator in character and remembered.
- **Trade**: buy rations from townsfolk and sell them your things; friends give
  better prices.
- **Quests**: slay an anomaly, deliver food to a friend, or read a monument.
- **Fighting townsfolk and creatures**: once each, never to the death. The
  beaten are carried to one of four sanctuaries to recover, and from then on
  flee two squares for each one you take toward them.
- **Allies**: friends and following creatures strike anomalies beside you.
- **Reputation** (the mean of everyone's tie to you) decides who gives work, how
  well it pays, quest rewards of magic items, and which magic items shops offer.
- **The paladin** (v0.2.1): your standing is ranked against every townsperson's
  and creature's standing in the social graph. At the 5th percentile or below,
  with a negative reputation, a paladin rides out from a sanctuary and pursues
  you at two squares per half hour (twice your speed), routing around the river.
  On catching you they defeat you, take your magic items, restore your standing
  to a random point between the 5th and 20th percentile, and leave seven days of
  rations. They do not ride out again for two days.
- **Layout** (v0.2.4): every panel except "You are at", the survey map and the
  character sheet can be rolled up and dragged to any column (or moved with the
  arrow keys from its grip). Desktop and phone layouts are saved separately.
- **Town voices and sanctuaries** (v0.2.5): towns murmur with talk, carts and
  song, scaled by size (talk by day, carts by day, singing mostly at night).
  Sanctuaries are hushed. Resting at one heals fully, with a 4% chance of a boon
  of +1 or +2 to one ability for 7 to 30 days.
- **Night** (v0.2.8): the clock runs at 4× real time by day and 30× at night, so
  night (20:00 to 06:00) lasts about twenty real minutes and a full day about
  3 hours 50 minutes. At nightfall a friendly overlay suggests a break: stretch,
  pet the cat (or dog, or imaginary friend), and get some water. It can be
  switched off.
- **Lantern limit** (v0.2.9): a lantern gives two game hours (four steps) of
  night travel; then you must make camp or take a room. Resting or dawn refills it.

### v0.3

- **Seasons**: a 28-day year of four seven-day seasons. Dawn and dusk move with
  the season (winter nights are longest), but every night still lasts about
  twenty real minutes. Winter freezes the river so it can be walked across, and
  snow closes unexplored high mountain paths. Temperature, snow and foraging
  follow the season.
- **Hunger**: after about a day without food you are hungry (−1 STR, −1 CON, half
  healing when you camp). Later you are starving and lose 1 HP every six hours.
  Eating, or resting at an inn or your cottage, fixes it.
- **Rumours that come true**: friendly townsfolk sometimes pass on a rumour (a
  cache, a lost item, a lurking creature). It is planted in the world and marked
  ★ on the map until you find it.
- **Cottage**: rent one in a town for 30 gp. Sleeping there is free and comes
  with supper. Its chest is safe from paladins and falls.
- **Companion gifts**: allies who travel with you help. The wisp gives light,
  the pony carries 60 lb, the raven scouts, the fox finds things, the otter and
  heron fish at dawn, the badger heals you fully at camp, and the deer adds an
  hour of night travel.
- **Maps and notes**: towns sell maps of sanctuaries, springs, caves and
  monuments. About one in five is wrong and adds a false mark. You can also
  leave your own note on any place; a pencil mark shows it on the map.
- **Town factions**: the towns have rivalries. Helping one town raises your
  standing there and lowers it with its rivals. Standing affects magic stock.
- **Anomalies**: some stay put, some roam across the land, and some spread
  (capped at six offspring).
- **Crafting**: potions, a draught of vigour, a charm of warding, pitch torches,
  hearty stew, and a smith's lantern, made from what you carry.
