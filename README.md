# Mathematics In Motion

Interactive maths page (v0.11). Open `index.html` in a browser.

## Zigzag Realms

`zigzag-realms.html` is a D&D-style exploration game whose map builds itself.
Each step into unexplored ground asks Claude to write the new place from the
one you just left. Every place, item and character stat is a cell in a ZigZag
structure (`d.x` east/west, `d.y` north/south, `d.contain` for stores, `d.stat`
for the character sheet, `d.at` for where you stand), so places persist and you
can walk back to them.

Published as a Claude artifact it uses Claude for narration and saves the world
to your account. Opened as a plain file it falls back to built-in tables and
saves in the browser.
