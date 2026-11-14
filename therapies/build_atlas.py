#!/usr/bin/env python3
"""Build atlas.html: one page per therapy.

Inputs
  atlas-entries.json                 reviewed entries (what / origin / evidence / practice / ...)
  categories.json                    15 family averages (from the essay)
  source-usf-report-2025-08-14.txt   the USF report, mined for facts about each therapy
  atlas.template.html                page template with /*__DATA__*/ placeholder

Placement rule: a therapy sits at its family's average, and any score the
sources state for that therapy individually replaces the average on that
dimension. The page labels which scores are stated and which are inherited.
"""
import json, re, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
P = lambda f: os.path.join(HERE, f)

entries = json.load(open(P('atlas-entries.json')))
cats_raw = json.load(open(P('categories.json')))
report = open(P('source-usf-report-2025-08-14.txt'), encoding='utf-8').read()

NAME2ID = {'Cognitive & Behavioral': 'cb', 'Psychodynamic & Analytic': 'pd', 'Humanistic & Existential': 'hu',
           'Systemic & Family': 'sy', 'Somatic & Body-Based': 'so', 'Animal & Nature': 'an', 'Creative & Expressive': 'cr',
           'Mindfulness & Meditation': 'mi', 'Trauma-Specialized': 'tr', 'Psychedelic-Assisted': 'ps',
           'Digital & Technology': 'di', 'Other': 'ot', 'Energy & Alternative': 'en', 'Cultural & Indigenous': 'cu',
           'Historical & Retired': 'hi'}
LABEL = {'cb': 'Cognitive & behavioural', 'pd': 'Psychodynamic & analytic', 'hu': 'Humanistic & existential',
         'sy': 'Systemic & family', 'so': 'Somatic & body-based', 'an': 'Animal & nature', 'cr': 'Creative & expressive',
         'mi': 'Mindfulness & meditation', 'tr': 'Trauma-specialised', 'ps': 'Psychedelic-assisted',
         'di': 'Digital & technology', 'ot': 'Mixed / other', 'en': 'Energy & alternative', 'cu': 'Cultural & indigenous',
         'hi': 'Historical & retired'}
cats = {}
for c in cats_raw['categories']:
    cid = {k.lower(): v for k, v in NAME2ID.items()}[c['name'].strip().lower()]
    cats[cid] = {'name': LABEL[cid], 'n': c['members'], 'coh': c['cohesion'], 's': c['scores']}
assert len(cats) == 15, sorted(cats)

# Scores the sources state for individual therapies: {name: {dimension index: value}}
STATED = {
 'CBT': {0: .9, 4: 1}, 'DBT': {4: .95}, 'Exposure Therapy': {4: .95}, 'Behavioral Activation': {3: 0},
 'App-Based CBT': {2: .1}, 'Psychoanalysis': {5: .1}, 'Lacanian Analysis': {5: .1}, 'Jungian Analysis': {3: 1},
 'Person-Centered': {1: .1}, 'Bowenian': {2: .1}, 'Somatic Experiencing': {2: 1}, 'Feldenkrais': {2: .95},
 'Rolfing': {5: 1}, 'Equine Therapy': {5: 1}, 'Adventure Therapy': {5: 1}, 'Forest Bathing': {0: .1},
 'Shamanic Healing': {0: .1}, 'Peer Support': {1: .1}, 'Pranic Healing': {4: .1}, 'Chakra Balancing': {4: .1},
 'Psychosurgery': {0: 1, 1: 1, 2: 0}, 'Insulin Shock': {0: 1, 1: 1, 3: 0}, 'Hydrotherapy': {1: .9},
 'Phrenology-Based': {4: 0}, 'Art Therapy': {3: 1}, 'Native American Healing': {3: 1},
}

def facts_for(name):
    """Collect what the USF report says about one therapy."""
    out = []
    n = re.escape(name)
    for m in re.finditer(r'^\d+\. (.+?) ↔ (.+?): ([\d.]+)', report, re.M):
        a, b, d = m.groups()
        if name in (a, b.split(' (')[0]):
            other = b.split(' (')[0] if a == name else a
            out.append(('pair', f'Distance to {other}: {d}', float(d), other))
    for m in re.finditer(r'^\d+\. (.+?): connects (\d+) categories\nCategories: (.*)$', report, re.M):
        if m.group(1) == name:
            out.append(('bridge', f'A bridge therapy: connects {m.group(2)} categories, including {m.group(3)}.', None, None))
    for m in re.finditer(r'^(.+?) → (.+?):\nDirect distance: ([\d.]+)\nVia (.+?): ([\d.]+)', report, re.M):
        a, b, d, via, v = m.groups()
        if name in (a, b, via):
            role = 'stop on' if name == via else 'end of'
            out.append(('path', f'{role.capitalize()} the reported pathway {a} → {via} → {b} (direct {d}, via {v}).', None, None))
    for m in re.finditer(r'^(High [^\n]+|Low [^\n]+):\n-+\nCount: \d+ therapies\nMembers: (.*)$', report, re.M):
        if name in [x.strip() for x in m.group(2).replace('...', '').split(',')]:
            out.append(('quad', f'In the “{m.group(1).rstrip(":")}” quadrant.', None, None))
    sec = report.split('Most Isolated Therapies')[1].split('SUMMARY STATISTICS')[0]
    iso, cen = sec.split('Most Central Therapies')
    for m in re.finditer(r'^(\d+)\. (.+?) \(mean distance: ([\d.]+)', iso, re.M):
        if m.group(2) == name:
            out.append(('outlier', f'One of the most isolated approaches: #{m.group(1)}, mean distance {m.group(3)} to all others.', None, None))
    for m in re.finditer(r'^(\d+)\. (.+?) \(mean distance: ([\d.]+)', cen, re.M):
        if m.group(2) == name:
            out.append(('central', f'One of the most central, balanced approaches: #{m.group(1)}, mean distance {m.group(3)}.', None, None))
    for era in ('HISTORICAL', 'EMERGING'):
        blk = report.split(era + ' ERA')[1].split('Examples:')[1].split('\n')[0]
        if name in [x.strip() for x in blk.replace('...', '').split(',')]:
            out.append(('era', f'Listed in the {era.lower()} era.', None, None))
    for m in re.finditer(r'(Highest|Lowest) Scoring \(([^)]+)\):\n1\. ([^\n(]+) \(([\d.]+)\)', report):
        if m.group(3).strip() == name:
            out.append(('top', f'Top of the list for {m.group(2).lower()} ({m.group(4)}).', None, None))
    seen, res = set(), []
    for f in out:
        if f[1] not in seen:
            seen.add(f[1]); res.append({'k': f[0], 't': f[1]})
    return res

def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

items = []
for e in entries:
    fam = e['family']
    s = list(cats[fam]['s'])
    st = STATED.get(e['name'], {})
    for k, v in st.items():
        s[k] = v
    e2 = dict(e)
    e2['slug'] = slug(e['name'])
    e2['s'] = s
    e2['stated'] = sorted(st)
    e2['facts'] = facts_for(e['name'])
    items.append(e2)

names = {e['name'] for e in items}
for e in items:
    e['related'] = [r for r in e.get('related', []) if r in names and r != e['name']]

data = {'cats': cats, 'items': items, 'built': __import__('datetime').date.today().isoformat()}
tpl = open(P('atlas.template.html'), encoding='utf-8').read()
html = tpl.replace('/*__DATA__*/', 'const DATA=' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';')
open(P('atlas.html'), 'w', encoding='utf-8').write(html)
print(f'atlas.html: {len(items)} therapies, {os.path.getsize(P("atlas.html"))} bytes')
missing = [e['name'] for e in items if not e['facts']]
print('therapies with no report facts:', len(missing))
