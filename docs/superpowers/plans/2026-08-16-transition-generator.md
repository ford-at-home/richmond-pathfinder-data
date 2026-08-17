# Transition generator in Pathfinder (phase C) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Do not start this plan until phase B is on `main`.** Spec: `docs/superpowers/specs/2026-08-16-job-front-door-design.md`. UI plan: `docs/superpowers/plans/2026-08-16-job-front-door.md`.
>
> Phase C does not change the job page. It changes which process writes `src/content/data/workforce.json`.

**Goal:** Pathfinder generates its own occupation→destination slice from pinned regional occupations, vendored O\*NET, and the regional course catalog, so it no longer copies `career-transition-map/app/data/workforce.json`.

**Architecture:** Port the destination-building half of `career-transition-map/scripts/build-workforce.mjs` into `scripts/build-workforce.mjs` here. Occupations come from `src/content/data/occupations.json` (already the 523-job join — destinations may sit outside the four families). Relatedness, zones, and skill gaps come from vendored O\*NET files with `PROVENANCE.md`. **Emit only the 39 in-scope origins** (four families, exposure ≥ 0.25). Then delete `scripts/pin-workforce.mjs`.

**Tech Stack:** Node ESM scripts, Vitest, existing Pathfinder occupations JSON. No new runtime dependencies. Do not edit the Nuxt app. Do not vendor `Activities.txt` unless a later plan needs feeders (the front door does not).

## Global Constraints

- Do not start until B’s `/` and `/job/$soc` are shipping.
- Do not change `MIN_LIFT` (0.05), `MAX_LIFT` (1.0), `SAFER_BY` (0.67), `ALREADY_SAFE` (0.10), `EXPOSED_AT` (0.30), or the “destination exposure must be > 0” rule.
- Do not treat analysis `EXPOSURE_THRESHOLD` (0.25) as the route screen.
- Do not offer residual titles matching `/,?\s*All Other$/` as destinations.
- Same-or-lower job zone stays `Same preparation level`, never “no schooling.”
- Fail if an input file is missing. No mock O\*NET. No invented skill gaps.
- Characterization test first: new generator must match B’s destination SOC sets for every origin, or the mismatch list is the review artifact — do not “fix” the UI to hide diffs.
- Do not force-push.

## File map

| File | Responsibility |
|---|---|
| `vendor/onet/PROVENANCE.md` | What was taken, release, licence (CC BY 4.0) |
| `vendor/onet/Skills.txt` | 35 generic skill ratings, 523-occupation slice |
| `vendor/onet/Related Occupations.txt` | O\*NET relatedness |
| `vendor/onet/Job Zones.txt` | Base `.00` zone per occupation |
| `vendor/onet/Job Zone Reference.txt` | Zone names / education / experience / training text |
| `data/catalog/richmond-catalog.json` | Published regional courses (copy, with provenance) |
| `scripts/build-workforce.mjs` | Join occupations + O\*NET + catalog → slim `workforce.json` |
| `scripts/pin-workforce.mjs` | **Delete** after the generator writes the same file |
| `tests/workforce-generate.test.ts` | Pins constants and destination-set parity with the B snapshot |

---

### Task 1: Snapshot the B slice before touching the generator

**Files:**
- Create: `tests/fixtures/workforce-destinations.snapshot.json` (script output: `{ [originSoc]: string[] }` of destination SOCs, aligned then adjacent)
- Create: `scripts/snapshot-workforce-destinations.mjs`
- Test: `tests/workforce-generate.test.ts`

**Interfaces:**
- Consumes: `src/content/data/workforce.json` from phase B
- Produces: snapshot file used as the characterization oracle

- [ ] **Step 1: Write a snapshot script** that reads the pinned slim JSON and writes `{ "43-4051": ["43-4041", ...], ... }` for every **origin** (39 keys). Sort each array. Include empty arrays for the three origins with no routes.

- [ ] **Step 2: Write the failing parity test**

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

it("keeps a destination snapshot to compare the generator against", () => {
  const snap = JSON.parse(
    readFileSync("tests/fixtures/workforce-destinations.snapshot.json", "utf8"),
  );
  expect(Object.keys(snap)).toHaveLength(39);
});
```

- [ ] **Step 3: Run snapshot + test**

```bash
node scripts/snapshot-workforce-destinations.mjs
npm test -- tests/workforce-generate.test.ts
```

Expected: PASS. Commit the snapshot. This file is the contract. Later tasks fail if the generator disagrees.

- [ ] **Step 4: Commit**

```bash
git add scripts/snapshot-workforce-destinations.mjs \
  tests/fixtures/workforce-destinations.snapshot.json \
  tests/workforce-generate.test.ts
git commit -m "$(cat <<'EOF'
test: snapshot front-door destination sets before moving the generator

Characterization first so a ported ruleset cannot silently drop or add routes.
EOF
)"
```

---

### Task 2: Vendor O\*NET files this repo does not yet have

**Files:**
- Create: `vendor/onet/PROVENANCE.md`
- Create: the four text files listed in the file map
- Create: `data/catalog/PROVENANCE.md` and `data/catalog/richmond-catalog.json`

**Interfaces:**
- Consumes: copies from the frozen Nuxt tree (`vendor/onet/Skills.txt`; analysis-repo or Nuxt sibling `Related Occupations.txt`, `Job Zones.txt`, `Job Zone Reference.txt`; `app/data/richmond-catalog.json`)
- Produces: files in *this* repo with hashes recorded in provenance

Pathfinder’s `analysis.lock.json` already names hashes for Job Zones and Related Occupations from `hack4rva/richmond-ai-impact-analysis@b8728fc`. Prefer those files so relatedness matches the analysis pin. `Skills.txt` is only in the Nuxt vendor slice (extracted 2026-08-10, O\*NET 29.0, CC BY 4.0).

- [ ] **Step 1: Copy files. Do not strip different columns than Nuxt `scripts/vendor-onet.mjs` already did.** If a BOM is present, strip it (the Nuxt vendor script documents that a BOM silently renames column 1).

- [ ] **Step 2: Write provenance.** Record source path, date, licence, and that Activities.txt is intentionally absent.

- [ ] **Step 3: Add a test** that the four O\*NET files exist and `Related Occupations.txt` has a header row containing `Related Occupations`.

- [ ] **Step 4: Commit** (explicit paths only; do not `git add -A`)

```bash
git commit -m "$(cat <<'EOF'
chore: vendor O*NET relatedness, zones, and skills for local route generation

Keep Activities.txt out; the front door does not infer what a job cannot do.
EOF
)"
```

---

### Task 3: Port destination generation

**Files:**
- Create: `scripts/build-workforce.mjs`
- Modify: `package.json` (add `"workforce": "node scripts/build-workforce.mjs"`)
- Modify: `tests/workforce-generate.test.ts`

**Interfaces:**
- Consumes: `src/content/data/occupations.json`, `vendor/onet/*`, `data/catalog/richmond-catalog.json`
- Produces: `src/content/data/workforce.json` and updates `workforce.lock.json` to `{ generatedBy: "scripts/build-workforce.mjs", generatedAt, occupationCount, programCount }` — no `sourcePath` into the Nuxt repo

Port these constants **verbatim** from `career-transition-map/scripts/build-workforce.mjs`:

```js
const MAX_ALIGNED = 4
const MAX_ADJACENT = 6
const MIN_LIFT = 0.05
const MAX_LIFT = 1.0
const SAFER_BY = 0.67
const ALREADY_SAFE = 0.10
const TIER_RANK = { "Primary-Short": 0, "Primary-Long": 1, Supplemental: 2 }
const isResidual = (title) => /,?\s*All Other$/.test(title)
```

Port the destination filter (wage lift, exposure drop, unmeasured barred, residual barred, family split into aligned/adjacent, caps). Do **not** port feeder/activity logic, industry mix, or AI-program catalogue UI.

Read occupations from Pathfinder JSON (`code` not `soc` — map `code` → `soc` in the output). Wages and exposure already live on those rows; do not re-join Anthropic or OEWS.

- [ ] **Step 1: Add tests that the generator source contains the constants**

```ts
import { readFileSync } from "node:fs";

const src = readFileSync("scripts/build-workforce.mjs", "utf8");
it("keeps the wage and exposure gates", () => {
  expect(src).toMatch(/const MIN_LIFT = 0\.05/);
  expect(src).toMatch(/const MAX_LIFT = 1\.0/);
  expect(src).toMatch(/const SAFER_BY = 0\.67/);
  expect(src).toMatch(/const ALREADY_SAFE = 0\.10/);
  expect(src).toMatch(/d\.exposure > 0/);
});
```

- [ ] **Step 2: Implement the script. Run it.**

```bash
node scripts/build-workforce.mjs
```

Expected: writes 39 origin occupations; exits 0; no RICHMOND env required.

- [ ] **Step 3: Parity against the snapshot**

```ts
it("emits the same destination SOC sets as the B snapshot", () => {
  const slim = JSON.parse(readFileSync("src/content/data/workforce.json", "utf8"));
  const snap = JSON.parse(
    readFileSync("tests/fixtures/workforce-destinations.snapshot.json", "utf8"),
  );
  const actual = Object.fromEntries(
    slim.occupations.map((o) => [
      o.soc,
      [...o.aligned, ...o.adjacent].map((d) => d.soc).sort(),
    ]),
  );
  expect(actual).toEqual(snap);
});
```

If this fails, **stop**. Print the differing origin SOCs. Do not update the snapshot to make the test pass unless a human accepts a rules change.

- [ ] **Step 4: Re-run phase B invariant tests**

```bash
npm test -- tests/workforce.test.ts tests/workforce-generate.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat: generate front-door routes inside Pathfinder

Occupations stay the pinned 523-job join; relatedness and skill gaps come from
vendored O*NET instead of a JSON copy of the Nuxt app.
EOF
)"
```

---

### Task 4: Retire the Nuxt pin

**Files:**
- Delete: `scripts/pin-workforce.mjs`
- Modify: `data/workforce/PROVENANCE.md` (generator lives here now; Nuxt is historical)
- Modify: `AGENTS.md` (refresh command is `npm run workforce`, not pin-from-sibling)

**Interfaces:**
- Consumes: none
- Produces: docs that no longer mention `CAREER_TRANSITION_MAP` as a required input

- [ ] **Step 1: Delete the pin script. Grep the repo for `pin-workforce` and `CAREER_TRANSITION_MAP` and update those sentences.**

- [ ] **Step 2: Keep `career-transition-map` on disk; do not delete it.** Provenance may still *cite* it as the rules’ origin.

- [ ] **Step 3: Commit**

```bash
git commit -m "$(cat <<'EOF'
chore: stop copying workforce.json from the frozen Nuxt app

The front door now rebuilds from Pathfinder occupations plus vendored O*NET.
EOF
)"
```

---

## Self-review

- B UI is untouched except that `workforce.json` is regenerated in place.
- Activities / feeders / employer doors are not ported.
- Snapshot-before-port is Task 1 so C cannot silently change who can go where.
- Nuxt repo remains; only the copy script goes away.
