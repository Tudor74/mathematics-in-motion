# Mathematics In Motion

Interactive maths page (v0.12). Open `index.html` in a browser.

46 lessons in 9 stages, from sets and proof to relativity and climate models,
covering every top-level MSC2020 subject area apart from general (00), history (01)
and education (97).

## Research panel (v0.13)

Lessons listed in `RESEARCH_LESSONS` (currently lesson 1) show a research panel below
the lesson, loaded when it scrolls into view. It calls the Puter worker in `workers/research.js` (deployed as
`https://mim-research.puter.work`), which returns the six newest arXiv submissions,
yearly and monthly submission counts, and a cached AI-written impact paragraph.
To add a lesson, add a topic to `TOPICS` in the worker and its id to `RESEARCH_LESSONS`.

## Who's who panel (v0.14)

Below the research panel, the same lessons show six researchers in the area. The roster
is curated in the worker (`TOPICS.<lesson>.people`); `/people/:id` enriches it live with the
Wikipedia summary and photo, and the arXiv paper count and newest paper (refreshed weekly).
LinkedIn has no public API, so cards link to a LinkedIn people search for the name.

## Open questions panels (v0.15)

Two panels follow the who's who. **Leading open questions** is curated in the page
(`OPEN_QUESTIONS`) so it works offline; review it when the field moves. **Open questions in
the latest papers** calls the worker's `/open/:id`, which takes the six newest abstracts
matching the lesson's `openQuery` and AI-extracts the question and the paper's claim about it.
