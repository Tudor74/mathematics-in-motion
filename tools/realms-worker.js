// Zigzag Realms shared-realm worker (Puter Worker).
// Deploy: put this file in Puter and create a worker from it. All shared state lives in the
// owner's KV (me.puter.kv) under the "zrmp:" prefix. Callers are identified by their Puter
// sign-in (user.puter), never by anything in the request body.
const P = "zrmp:";
const CHUNK = 4;                 // squares are stored in 4×4 chunks, one KV key each
const ONLINE_TTL = 180e3;        // a player counts as online for 3 minutes after their last ping
const LIST_EVERY = 4e3;          // the online list is rebuilt from player keys at most every 4 s
const SNAP_PART = 300e3;         // bytes per snapshot part (KV values are capped near 400 KB)
const who = new Map();           // auth token -> username, cached per worker instance

const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "Content-Type": "application/json" } });
const bad = (msg, status = 400) => json({ error: msg }, status);
const str = (v, n) => typeof v === "string" ? v.replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n) : "";
const num = (v, lo, hi, d = 0) => Number.isFinite(+v) ? Math.max(lo, Math.min(hi, +v)) : d;
const dice = v => typeof v === "string" && /^\d{1,2}d\d{1,3}([+-]\d{1,2})?$/.test(v) ? v : "";
const sqKey = (x, y, z) => `${x|0},${y|0},${z|0}`;
const chunkOf = (x, y, z) => `${P}ch:${Math.floor(x / CHUNK)},${Math.floor(y / CHUNK)},${z|0}`;

async function identify(request, user) {
  if (!user || !user.puter) return null;
  const tok = request.headers.get("puter-auth") || "";
  if (tok && who.has(tok)) return who.get(tok);
  let u = null;
  try { u = await user.puter.auth.getUser() } catch (e) { try { u = await user.puter.getUser() } catch (e2) {} }
  const name = u && (u.username || u.uuid);
  if (!name) return null;
  if (tok) { if (who.size > 5000) who.clear(); who.set(tok, name) }
  return name;
}
async function body(request) { try { return await request.json() } catch (e) { return {} } }
async function guard(request, user) {
  const me_ = await identify(request, user);
  if (!me_) return [null, bad("Sign in with Puter to join the shared realm.", 401)];
  return [me_, null];
}

// ---------- the realm: one world snapshot, written once by the first player ----------
router.get("/realm", async () => {
  const meta = await me.puter.kv.get(P + "snap:meta");
  const online = await me.puter.kv.get(P + "online");
  const n = online ? Object.values(online.players || {}).filter(p => Date.now() - p.t < ONLINE_TTL).length : 0;
  return { ready: !!meta, meta: meta || null, online: n };
});
router.post("/realm/claim", async ({ request, user }) => {
  const [u, err] = await guard(request, user); if (err) return err;
  if (await me.puter.kv.get(P + "snap:meta")) return { granted: false, ready: true };
  const c = await me.puter.kv.get(P + "snap:claim");
  if (c && c.by !== u && Date.now() - c.at < 5 * 60e3) return { granted: false, ready: false, by: c.by };
  await me.puter.kv.set(P + "snap:claim", { by: u, at: Date.now() });
  const again = await me.puter.kv.get(P + "snap:claim");
  return { granted: !!again && again.by === u, ready: false };
});
router.post("/realm/part/:i", async ({ request, user, params }) => {
  const [u, err] = await guard(request, user); if (err) return err;
  const c = await me.puter.kv.get(P + "snap:claim");
  if (!c || c.by !== u) return bad("Only the player founding the realm can write it.", 403);
  if (await me.puter.kv.get(P + "snap:meta")) return bad("The realm already exists.", 409);
  const i = num(params.i, 0, 40);
  const text = await request.text();
  if (text.length > SNAP_PART + 1000) return bad("Part too large.", 413);
  await me.puter.kv.set(P + "snap:" + i, text);
  return { ok: true };
});
router.post("/realm/done", async ({ request, user }) => {
  const [u, err] = await guard(request, user); if (err) return err;
  const c = await me.puter.kv.get(P + "snap:claim");
  if (!c || c.by !== u) return bad("Only the founder can finish the realm.", 403);
  const b = await body(request);
  const meta = { parts: num(b.parts, 1, 40, 1), by: u, at: Date.now(), name: str(b.name, 80), id: "r" + Date.now().toString(36) };
  await me.puter.kv.set(P + "snap:meta", meta);
  return { ok: true, meta };
});
router.get("/realm/part/:i", async ({ params }) => {
  const t = await me.puter.kv.get(P + "snap:" + num(params.i, 0, 40));
  return t == null ? bad("No such part.", 404) : new Response(t, { headers: { "Content-Type": "application/json" } });
});

// ---------- squares discovered by anyone, first writer wins ----------
function cleanSquare(s) {
  if (!s || typeof s !== "object") return null;
  const o = { name: str(s.name, 80), desc: str(s.desc, 1200), glimpse: str(s.glimpse, 100), terrain: str(s.terrain, 20),
    exits: str(s.exits, 6), walls: s.walls && typeof s.walls === "object" ? Object.fromEntries(Object.entries(s.walls).filter(([d]) => ["north", "south", "east", "west", "up", "down"].includes(d)).map(([d, w]) => [d, str(w, 80)])) : null,
    planned: !!s.planned, by: str(s.by, 40), at: Date.now() };
  if (!o.desc) return null;
  if (s.hazard && typeof s.hazard === "object") o.hazard = { name: str(s.hazard.name, 60), text: str(s.hazard.text, 200), stat: str(s.hazard.stat, 3), dc: num(s.hazard.dc, 5, 20, 10), damage: dice(s.hazard.damage) || "1d4" };
  return o;
}
router.post("/squares/get", async ({ request }) => {
  const b = await body(request), keys = Array.isArray(b.keys) ? b.keys.slice(0, 24) : [];
  const chunks = {}, out = {};
  for (const k of keys) { const [x, y, z] = String(k).split(",").map(Number); if ([x, y, z].some(Number.isNaN)) continue; (chunks[chunkOf(x, y, z)] ||= []).push(sqKey(x, y, z)) }
  for (const [ck, ks] of Object.entries(chunks)) { const c = await me.puter.kv.get(ck) || {}; for (const k of ks) if (c[k]) out[k] = c[k] }
  return { squares: out };
});
router.post("/squares/put", async ({ request, user }) => {
  const [u, err] = await guard(request, user); if (err) return err;
  const b = await body(request), sq = b.squares && typeof b.squares === "object" ? Object.entries(b.squares).slice(0, 12) : [];
  const chunks = {}, kept = {};
  for (const [k, s] of sq) { const [x, y, z] = String(k).split(",").map(Number); const c = cleanSquare(Object.assign({}, s, { by: u })); if (!c || [x, y, z].some(Number.isNaN)) continue; (chunks[chunkOf(x, y, z)] ||= {})[sqKey(x, y, z)] = c }
  for (const [ck, add] of Object.entries(chunks)) {
    const cur = await me.puter.kv.get(ck) || {};
    let changed = false;
    for (const [k, s] of Object.entries(add)) { if (cur[k]) { kept[k] = cur[k]; continue } cur[k] = s; kept[k] = s; changed = true }
    if (changed) await me.puter.kv.set(ck, cur);
  }
  return { squares: kept };   // what is now true for each key (yours, or the earlier writer's)
});

// ---------- presence: each player writes only their own key; the list is rebuilt now and then ----------
router.post("/presence", async ({ request, user }) => {
  const [u, err] = await guard(request, user); if (err) return err;
  const b = await body(request), now = Date.now();
  const prev = await me.puter.kv.get(P + "pl:" + u);
  if (prev && now - prev.t < 1500) return json({ error: "Too fast." }, 429);
  const x = num(b.x, -99, 99) | 0, y = num(b.y, -99, 99) | 0, z = num(b.z, -9, 9) | 0;
  const trail = ((prev && prev.trail) || []).filter(p => p.t > now - 6 * 3600e3);
  const last = trail[trail.length - 1];
  if (!last || last.x !== x || last.y !== y || last.z !== z) trail.push({ x, y, z, t: now });
  const me_ = { u, name: str(b.name, 40) || u, cls: str(b.cls, 20), lvl: num(b.lvl, 1, 30, 1) | 0, x, y, z, t: now, trail: trail.slice(-8),
    say: prev && prev.say || null, exp: prev && prev.exp || 0 };
  const refresh = now - me_.exp > 300e3; if (refresh) me_.exp = now;
  const said = str(b.say, 160);
  if (said) me_.say = { text: said, t: now, x, y, z };
  await me.puter.kv.set(P + "pl:" + u, me_);
  if (refresh) { try { await me.puter.kv.expire(P + "pl:" + u, 3600) } catch (e) {} }   // forgotten players fall out of the list
  let online = await me.puter.kv.get(P + "online");
  if (!online || now - online.at > LIST_EVERY) {
    const players = {};
    let cursor;
    do {
      const page = await me.puter.kv.list({ pattern: P + "pl:", returnValues: true, limit: 1000, cursor });
      const items = Array.isArray(page) ? page : page.items || [];
      for (const it of items) { const v = it.value; if (v && now - v.t < ONLINE_TTL) players[v.u] = v }
      cursor = Array.isArray(page) ? null : page.cursor;
    } while (cursor);
    online = { at: now, players };
    await me.puter.kv.set(P + "online", online);
  }
  online.players[u] = me_;
  const ground = await me.puter.kv.get(P + "gi:" + sqKey(x, y, z)) || [];
  return { you: u, now, players: Object.values(online.players).filter(p => now - p.t < ONLINE_TTL), ground };
});

// ---------- items left on the ground for other players ----------
function cleanItem(it) {
  if (!it || typeof it !== "object") return null;
  const kinds = ["weapon", "armor", "potion", "treasure", "tool", "food", "junk"];
  const o = { name: str(it.name, 60), desc: str(it.desc, 240), kind: kinds.includes(it.kind) ? it.kind : "junk",
    weight: num(it.weight, 0, 60, 1), value: num(it.value, 0, 500, 1) | 0, heal: dice(it.heal), ac: num(it.ac, 0, 5) | 0,
    dmg: dice(it.dmg || it.damage), finesse: !!it.finesse, light: !!it.light, magic: !!it.magic };
  return o.name ? o : null;
}
router.post("/ground/drop", async ({ request, user }) => {
  const [u, err] = await guard(request, user); if (err) return err;
  const b = await body(request), item = cleanItem(b.item);
  if (!item) return bad("That item cannot be left here.");
  const k = P + "gi:" + sqKey(b.x, b.y, b.z);
  const list = (await me.puter.kv.get(k) || []).filter(g => Date.now() - g.at < 7 * 86400e3);
  if (list.length >= 12) return bad("There is no room left on the ground here.", 409);
  const g = { id: "g" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), by: u, at: Date.now(), item };
  list.push(g);
  await me.puter.kv.set(k, list);
  return { ok: true, ground: list };
});
router.post("/ground/take", async ({ request, user }) => {
  const [u, err] = await guard(request, user); if (err) return err;
  const b = await body(request), id = str(b.id, 40);
  const k = P + "gi:" + sqKey(b.x, b.y, b.z);
  const list = await me.puter.kv.get(k) || [];
  const g = list.find(g => g.id === id);
  if (!g) return json({ ok: false, error: "Someone else has already taken it.", ground: list }, 409);
  // incr is atomic, so only the first taker gets 1 even if two arrive together
  const n = await me.puter.kv.incr(P + "tk:" + id);
  if (n !== 1) return json({ ok: false, error: "Someone else has already taken it.", ground: list.filter(x => x.id !== id) }, 409);
  const fresh = (await me.puter.kv.get(k) || []).filter(x => x.id !== id);
  await me.puter.kv.set(k, fresh);
  try { await me.puter.kv.expire(P + "tk:" + id, 86400) } catch (e) {}
  return { ok: true, item: g.item, by: g.by, ground: fresh };
});

router.get("/health", async () => ({ ok: true, at: Date.now() }));
router.get("/*page", async ({ params }) => bad("Not found: " + params.page, 404));
