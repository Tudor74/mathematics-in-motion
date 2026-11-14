# Therapies In Motion: review of the source framework

Source: *The Therapeutic Landscape in 2025* (Tudor Watson, Substack, 14 Aug 2025). The full text is in `source-therapeutic-landscape-2025.txt`, and the 15 category profiles are in `categories.json`.

The question this review answers: **is the framework useful as a diagram that maps the aspects of each therapy?** Short answer: **yes, it's a strong skeleton**, as long as it's presented honestly as a map of how therapies *differ in approach*, not as measured evidence of what works.

## What works well for a diagram

1. **Six plain-language dimensions, each on a 0–1 scale.** Time structure, directiveness, somatic focus, symbolic depth, evidence base and experiential level. Each one has a clear low pole and high pole with familiar examples, which makes them easy to draw and to explain.
2. **Every therapy gets a "fingerprint".** Six values per therapy fit naturally into a six-spoke shape. Morphing one shape into another (CBT into Somatic Experiencing, for example) shows the difference instantly.
3. **The space has a real shape.** The dimensions form two clusters: structure, directiveness and evidence on one side, and body, symbol and action on the other. That gives an honest 2D map, with a clear divide down the middle.
4. **Bridges and pathways are things you can animate.** IFS, Gestalt, Person-Centred and EMDR as hubs; DBT, then EMDR, then IFS/SE as a sequence of care. These are exactly the kind of "motion" the maths page does well.
5. **Eras give the map a timeline.** Historical, contemporary and emerging therapies can fade in by decade.

## Problems to fix before drawing it

1. **The scores are ratings, not data.** The 0–1 values were assigned, not measured. So the correlations (r = 0.763 and so on), the clusters and the distances describe *the ratings*, not the field. The page needs to say so on screen ("illustrative ratings"). The post's claims like "data-driven" and "proves", and the 2025 t-SNE email ("visual proof that consciousness has geometric structure"), shouldn't be carried over. t-SNE applied to hand-assigned scores can only show back the structure that was put into them.
2. **Evidence base is a different kind of axis.** The other five describe *what happens in the room*. Evidence describes *how much research exists*, and it depends on the condition: EMDR is strongly supported for PTSD and much less so for other conditions. Mixing it into the distance makes "distance" a blend of method and research history. **Recommendation:** use the five process dimensions for the map and the distances. Show evidence as a separate layer, per condition where possible: a badge, opacity, or a "for what?" panel.
3. **The six dimensions are really about three.** Structure and directiveness correlate at 0.76; somatic focus and experiential level at 0.83. This is useful for drawing: a 2D map with *structured/therapist-led ↔ emergent/client-led* across and *talk/thought ↔ body/action* up, plus symbolic depth as colour, carries most of the information without pretending to more precision.
4. **The pathway maths doesn't support "recommended".** CBT → EMDR → SE totals 1.268, which is longer than the direct 1.245. A detour can never be shorter than the direct distance, so the route isn't chosen *by* distance. What it does do is make the **biggest single step smaller**. Show it that way: the size of each step, labelled as clinical reasoning, not as an optimal path.
5. **One internal contradiction.** Person-Centred ↔ ACT is called a "short distance" at 0.800, yet 0.8 is larger than many cross-school gaps. Either drop the example or recheck the value.
6. **Categories are fuzzy.** Cohesion ranges from 0.37 to 0.89, "Other" is the biggest group (19), and the six "additional" categories (mindfulness, energy, cultural/indigenous, psychedelic, digital) were added later. Draw categories as soft regions, not boxes, and avoid labelling "Other" as a place.
7. **Retired and unsupported practices sit next to current treatments.** Psychosurgery, insulin shock and phrenology are valuable as history and contrast, and crystal or pranic healing as cultural context. But on one map they can look like options. Put retired practices on a separate history layer that is off by default, and mark low-evidence practices clearly.
8. **The business framing doesn't belong on a learning page.** "Blue-chip", "venture capital" and portfolio language suits an organisation's planning document, not someone trying to understand therapies. Keep the quadrants but rename them by what they mean, e.g. "manualised and well tested", "embodied and symbolic".
9. **What a person choosing a therapy actually needs is missing:** what a session looks like, typical length, individual or group, what it is commonly used for, and how to access it (e.g. NHS Talking Therapies in the UK). Also, the relationship with the therapist predicts outcome across *all* schools, and that common factor doesn't appear on any axis. It deserves its own scene.
10. **Data gap.** The post gives category averages for all 15 groups, but only about 90 individual scores, scattered through the text as examples. The full table of 130 modalities (possibly in the NotebookLM notebook linked at the end of the post) is needed to plot individual therapies. Otherwise the map starts at category level.

## Proposed diagram design (following the Mathematics In Motion method)

- **Curriculum stages:**
  1. The six dimensions, one scene each
  2. The two continents and the divide
  3. Category tours, one fingerprint each
  4. Bridges
  5. Pathways
  6. Eras
  7. Evidence: for what, for whom
  8. What all therapies share: the relationship and common factors
- **Main map:** 2D plane as in point 3. Therapies are dots, categories are soft regions, and symbolic depth is shown as colour. Evidence is a toggle layer. History is a toggle layer, off by default.
- **Fingerprint scene:** six spokes; play morphs between therapies; the phase captions explain which spoke moved and why.
- **Try it:**
  - *Compare*: pick two therapies and see the distance broken down by dimension as stacked bars, so you can see *where* they differ.
  - *What fits me*: set the five process sliders to what you'd prefer and the nearest therapies light up. This is framed as "approaches that work this way", never as a recommendation.
  - *Walk a pathway*: step through DBT, then EMDR, then IFS/SE and watch the step sizes.
  - *Era scrubber*: drag through the decades and watch the map fill in.
- **Wording:** a fixed line on every screen saying ratings are illustrative and this is not clinical advice; choosing a therapy is a conversation with a GP or therapist.

## Verdict

As a **diagram of how therapies differ in approach**, the framework is useful and well suited to motion. As **evidence about which therapies work or how minds are shaped**, it isn't, and the page should not present it that way. Separating "process" from "evidence" and labelling the scores honestly turns the weak points into teaching moments.

## Addendum: the USF report (14 Aug 2025)

The underlying analysis output is now in `source-usf-report-2025-08-14.txt`. It adds data the essay left out, and it confirms several points above.

**Now used on the page (v0.2):**
- Fuller member lists for the categories. IFS sits in *trauma-specialised*, and shamanic healing in *energy & alternative*; v0.1 had both wrong.
- All twelve reported correlations. Three pairs are not reported at all: directiveness–evidence, somatic–symbolic and symbolic–experiential.
- The bridge lists: ten therapies, each said to connect 7 categories, with 5 named. The essay said Gestalt connects four categories, including somatic; the report says seven, and its list doesn't include somatic.
- Full six-dimension profiles for the three eras, plus the era sizes: 10 historical, 113 contemporary and 7 emerging therapies, so the historical and emerging averages are fragile.
- All nine "optimal pathways", in a new scene.

**What the report confirms or reveals:**
1. **Pathways are never shortest.** In all nine pathways, the route via the stop is longer than the direct one: from +1% up to +116% (Psychodynamic → IFS: 0.245 direct, 0.529 via narrative therapy). So the algorithm picks a *stop*, not a shortest path. Only the total via the stop is reported, not each leg, so "the biggest step gets smaller" cannot be checked from the report.
2. **Bug in the summary code.** The top/bottom lists print Python source text (`1.000 if len(top_5) > 1 else ''`), and several lists repeat a therapy (Forest Bathing, Person-Centered, Somatic Experiencing, Behavioral Activation, Psychoanalysis). That looks like an f-string or slicing bug in the report generator, so the top-3 lists shouldn't be relied on.
3. **Only 10 of the 15 categories are profiled.** They total 101 therapies. The essay adds five more categories totalling 27, which makes 128, not 130.
4. **Categories and clusters disagree.** Nine of the ten most similar pairs are *cross-category* (e.g. DBT ↔ TF-CBT at 0.050), and the hierarchical clusters mix families (e.g. ACT, schema therapy and brief psychodynamic together). This supports drawing categories as soft regions, not boxes.
5. **Still missing: the 130 × 6 score table itself.** The report never prints it. It probably lives in the script that generated the report (a dictionary or CSV of therapy → six scores). With it, every therapy could be plotted from its own scores instead of its category average.
