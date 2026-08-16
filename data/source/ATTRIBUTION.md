# Attribution

Where the data, the findings and the product ideas on this site came from.

This file exists because the site mixes four kinds of thing — measured data, sourced
figures, simulated detail and asserted claims — and because some of the product concepts
it demonstrates were designed by other people. Provenance labelling in the UI covers the
first problem. This file covers the second.

## Data

**Occupational evidence** is synced from
[hack4rva/richmond-ai-impact-analysis](https://github.com/hack4rva/richmond-ai-impact-analysis),
pinned by commit and SHA-256 in `analysis.lock.json`. Nothing here reanalyses that data;
every figure is recomputed from the published tables at build time and checked against the
value the reports print. The upstream repository carries its own `LICENSE-DATA` and
`ATTRIBUTION.md`, which govern the data regardless of this repository's licence.

That analysis in turn draws on:

- **Bureau of Labor Statistics**, Occupational Employment and Wage Statistics, Richmond
  VA metropolitan area. Employment counts, wages, and the relative standard errors used
  to decide whether a change clears sampling error.
- **Anthropic**, observed task-exposure scores by occupation.

**O*NET** is vendored directly under `vendor/onet/`, extracted from release
`db_29_0_text` on 2026-07-31 and reduced to the 185 occupations the demonstrator reads.
Adjacency, skills, job zones, task statements and education distributions come from
there. Published by the U.S. Department of Labor, Employment and Training Administration
under CC BY 4.0; O*NET is a trademark of USDOL/ETA. See `vendor/onet/PROVENANCE.md`.

**Funding and tuition rules** in `scripts/demo/training.mjs` are hand-curated from
published Virginia sources — FastForward, G3, and IRC §127 — with a source URL recorded
in a comment beside each figure. These are sourced, not measured: nothing checks that the
cited page still says what it said. Where no price is published the value is `null` and
is reported as unpriced, never as free.

## Prior work: career-transition-map

[GKjohns/career-transition-map](https://github.com/GKjohns/career-transition-map) is a
clickable demo of the AI Ready RVA Career Transition Map, built by Kyle Johnson with the
AI Ready RVA working group for the Senator Warner workforce challenge. It is MIT licensed.

It is a demonstration of a *mechanism* — employers author a skills checklist, a pathway
moves through review to publication, and only published pathways reach workers — over
deliberately fictional data. This site began as a demonstration of a *finding*, over real
occupational data.

That description of the difference is now only half true, and the half that has changed is
this site's. The product this repo is being built toward is a mechanism too: research a
company, verify what was inferred, take private workforce context, and return a crosswalk
and a budget. The finding is what the mechanism runs on rather than what it exists to
present. So the two are converging on the same question, and the earlier framing — that they
answer different ones — should not be used to argue against porting something.

Where this site adopts one of those mechanisms, the concept is Kyle's and the working
group's, not ours. Ported files carry a header comment naming the original, and the
list below is maintained as work lands.

Concepts and code adopted from that repository:

- _None yet. Entries are added here in the same commit that ports them._

The following working-group documents shaped that demo and, through it, the concepts
adopted here: the Workforce Transformation PRFAQ, the Employer PRD, the Worker PRD, and
the Shared Contract for the Published Pathway.

## What is ours

The analysis pipeline, the report presentation, the interactive figures, the occupational
screen and its reproduction check, the cost and funding model, the employer and worker
demonstrators, and the model-agreement gate that holds the two of them to the same
population.
