# Workforce slice (front-door routes)

Copied from the frozen Career Transition Map generator output, not recomputed here.

- Source: `career-transition-map/app/data/workforce.json`
- Generator: `career-transition-map/scripts/build-workforce.mjs`
- Generated: see `src/content/data/workforce.lock.json` `sourceGenerated`

Origins are the 39 jobs in the four families that hold 75.6% of regional
exposure (Office & Administrative Support, Sales, Business & Financial,
Computer & Mathematical), at the report’s ≥ 0.25 cut. A destination is an
O*NET-related occupation that pays 5–100% more and is meaningfully less
AI-exposed. Destinations with exposure exactly 0 are not in this file.

This is not the 28-row `pathways_reachable.csv` table and not all 523 occupations.

Refresh: `node scripts/pin-workforce.mjs`

Do not hand-edit `src/content/data/workforce.json`.
