// Mathematics In Motion · research worker (Puter Workers runtime).
// GET /lesson/:id  →  { lesson, label, query, papers[≤6], summary, years[], months[], complete, updated }
//
// • Topics are whitelisted below, so the endpoint can only run the lessons' own arXiv queries.
// • arXiv asks API clients for at most one request every three seconds; every call here is
//   spaced by WAIT ms and each request does a bounded amount of work. Missing counts are filled
//   on later calls (the page polls while `complete` is false), then cached.
// • The impact paragraph is written once per distinct set of six papers and cached, so the
//   owner's AI usage is at most a few calls per lesson per day.

const TOPICS = {
  foundations: {
    name: 'Sets, functions & proof',
    label: 'arXiv math.LO · Logic (MSC 03)',
    query: 'cat:math.LO',
    field: 'mathematical logic and the foundations of mathematics: set theory, proof theory, model theory, computability and their applications'
  }
};

const FIRST_YEAR = 2010;          // yearly volume from here to the current year
const MONTHS = 12;                // monthly frequency for the last twelve months
const WAIT = 3100;                // ms between arXiv requests
const BUDGET = 21000;             // ms of arXiv work per incoming request
const PAPERS_TTL = 6 * 3600e3;    // re-check the newest submissions every six hours
const OPEN_TTL = 24 * 3600e3;     // counts for the current year/month refresh daily
const MODEL = 'claude-sonnet-4-6';
const API = 'https://export.arxiv.org/api/query';
const K = (...parts) => 'mimr:' + parts.join(':');

const sleep = ms => new Promise(r => setTimeout(r, ms));
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
});

let lastCall = 0;
async function arxiv(params) {
  const gap = lastCall + WAIT - Date.now();
  if (gap > 0) await sleep(gap);
  lastCall = Date.now();
  const qs = Object.entries(params).map(([k, v]) => k + '=' + encodeURIComponent(v)).join('&');
  const res = await fetch(API + '?' + qs, { headers: { 'User-Agent': 'MathematicsInMotion/0.13 (educational; puter.site)' } });
  if (!res.ok) throw new Error('arXiv responded ' + res.status);
  return res.text();
}

const decode = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&amp;/g, '&');
const clean = s => decode(String(s || '')).replace(/\s+/g, ' ').trim();
const tag = (xml, name) => { const m = xml.match(new RegExp('<' + name + '(?:\\s[^>]*)?>([\\s\\S]*?)</' + name + '>')); return m ? m[1] : ''; };

function parseEntries(xml) {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => {
    const abs = clean(tag(e, 'id'));
    const pc = e.match(/<arxiv:primary_category[^>]*term="([^"]+)"/);
    return {
      id: abs.replace(/^https?:\/\/arxiv\.org\/abs\//, ''),
      url: abs.replace(/^http:/, 'https:'),
      title: clean(tag(e, 'title')),
      authors: [...e.matchAll(/<author>\s*<name>([\s\S]*?)<\/name>/g)].map(m => clean(m[1])),
      published: clean(tag(e, 'published')).slice(0, 10),
      category: pc ? pc[1] : '',
      abstract: clean(tag(e, 'summary'))
    };
  });
}
const total = xml => { const m = xml.match(/totalResults[^>]*>\s*(\d+)\s*</); if (!m) throw new Error('No total in arXiv reply'); return +m[1]; };

const pad = n => String(n).padStart(2, '0');
function periods(now) {
  const y = now.getUTCFullYear(), m = now.getUTCMonth();
  const years = [];
  for (let k = FIRST_YEAR; k <= y; k++) years.push({ key: String(k), from: k + '01010000', to: k + '12312359', open: k === y });
  const months = [];
  for (let i = MONTHS - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(y, m - i, 1)), yy = d.getUTCFullYear(), mm = d.getUTCMonth() + 1;
    const last = new Date(Date.UTC(yy, mm, 0)).getUTCDate();
    months.push({ key: yy + '-' + pad(mm), from: '' + yy + pad(mm) + '010000', to: '' + yy + pad(mm) + pad(last) + '2359', open: i === 0 });
  }
  return { years, months };
}

function text(r) {
  if (typeof r === 'string') return r;
  const c = r && r.message && r.message.content;
  if (typeof c === 'string') return c;
  if (Array.isArray(c)) return c.map(x => x.text || '').join('');
  return String(r || '');
}

async function summarise(topic, papers) {
  const list = papers.map((p, i) => `[${i + 1}] "${p.title}" (${p.published}, ${p.category})\n${p.abstract.slice(0, 1400)}`).join('\n\n');
  const prompt = `You write for an educational mathematics site. Field: ${topic.field}.
Below are the six most recent arXiv submissions in this area. Write ONE paragraph of 110–150 words for a curious undergraduate on what these submissions, taken together, suggest about where the field is moving and what impact they could have on it.
Rules: British English; plain prose, no lists, no headings, no markdown; refer to papers by a short form of their title; these are preprints that have not been peer reviewed, so describe potential impact cautiously and do not invent results, citations or significance beyond the abstracts; if the papers are unrelated, say the batch spans several separate directions and characterise them briefly.

${list}`;
  const r = await me.puter.ai.chat(prompt, { model: MODEL, max_tokens: 400, temperature: 0.3 });
  return text(r).replace(/\s+/g, ' ').trim();
}

async function build(id, topic) {
  const start = Date.now(), now = new Date(), kv = me.puter.kv;
  const left = () => BUDGET - (Date.now() - start);

  // 1 · Newest six submissions.
  let papers = await kv.get(K(id, 'papers'));
  if (!papers || Date.now() - papers.at > PAPERS_TTL) {
    const xml = await arxiv({ search_query: topic.query, sortBy: 'submittedDate', sortOrder: 'descending', start: 0, max_results: 6 });
    papers = { at: Date.now(), list: parseEntries(xml) };
    await kv.set(K(id, 'papers'), papers);
  }

  // 2 · Impact paragraph, once per distinct set of papers.
  const sig = papers.list.map(p => p.id).join(',');
  let summary = await kv.get(K(id, 'summary'));
  if ((!summary || summary.sig !== sig) && papers.list.length) {
    summary = { sig, at: Date.now(), model: MODEL, text: await summarise(topic, papers.list) };
    await kv.set(K(id, 'summary'), summary);
  }

  // 3 · Counts: fill what the remaining budget allows, newest periods first.
  const { years, months } = periods(now);
  const counts = (await kv.get(K(id, 'counts'))) || {};
  const fresh = (key, open) => counts[key] && (!open || Date.now() - counts[key].at < OPEN_TTL);
  const todo = [...months.slice().reverse(), ...years.slice().reverse()].filter(p => !fresh(p.key, p.open));
  for (const p of todo) {
    if (left() < WAIT + 2500) break;
    const xml = await arxiv({ search_query: `${topic.query} AND submittedDate:[${p.from} TO ${p.to}]`, start: 0, max_results: 1 });
    counts[p.key] = { n: total(xml), at: Date.now() };
    await kv.set(K(id, 'counts'), counts);
  }
  const row = p => ({ key: p.key, n: counts[p.key] ? counts[p.key].n : null, partial: p.open });

  return {
    lesson: id, name: topic.name, label: topic.label, query: topic.query,
    papers: papers.list, papersAt: new Date(papers.at).toISOString(),
    summary: summary ? { text: summary.text, model: summary.model, at: new Date(summary.at).toISOString() } : null,
    years: years.map(row), months: months.map(row),
    complete: [...years, ...months].every(p => counts[p.key]),
    updated: now.toISOString()
  };
}

router.get('/health', async () => ({ ok: true, lessons: Object.keys(TOPICS) }));

router.get('/lesson/:id', async ({ params }) => {
  const topic = TOPICS[params.id];
  if (!topic) return json({ error: 'No research feed for this lesson yet', lesson: params.id }, 404);
  try { return json(await build(params.id, topic)); }
  catch (e) { return json({ error: 'Research feed failed', message: String(e && e.message || e) }, 502); }
});

router.get('/*rest', async ({ params }) => json({ error: 'Not found', path: params.rest, endpoints: ['/health', '/lesson/:id'] }, 404));
