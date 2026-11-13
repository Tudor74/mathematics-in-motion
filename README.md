# Mathematics In Motion

Interactive maths page (v0.12). Open `index.html` in a browser.

46 lessons in 9 stages, from sets and proof to relativity and climate models,
covering every top-level MSC2020 subject area apart from general (00), history (01)
and education (97).

## Research panel (v0.13)

Lessons listed in `RESEARCH_LESSONS` (currently lesson 1) show a **Research** button.
It calls the Puter worker in `workers/research.js` (deployed as
`https://mim-research.puter.work`), which returns the six newest arXiv submissions,
yearly and monthly submission counts, and a cached AI-written impact paragraph.
To add a lesson, add a topic to `TOPICS` in the worker and its id to `RESEARCH_LESSONS`.
