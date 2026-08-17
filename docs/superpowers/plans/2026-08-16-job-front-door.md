# Job front door (phase B) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Do not start phase C** (`docs/superpowers/plans/2026-08-16-transition-generator.md`) until this plan is on `main`.
>
> Spec: `docs/superpowers/specs/2026-08-16-job-front-door-design.md`

**Goal:** Pathfinder’s home page is the 39 exposed jobs in the four Richmond families that hold three-quarters of measured AI use; opening one shows next jobs that pay more and are less exposed.

**Architecture:** A pin script copies those 39 origin rows (and their destinations) from the frozen Nuxt `workforce.json`. Home lists them grouped by family, with search as a filter. `/job/$soc` is the one-job page. Out-of-scope codes that appear only as destinations get a thin page, no hop list. Research stays; primary nav shrinks to Find a job + Evidence.

**Tech Stack:** TanStack Start file routes, Vitest (node), existing Instrument Editorial chrome. No new dependencies. Do not edit `career-transition-map`.

## Global Constraints

- Do not modify, delete, or generate files in `career-transition-map`.
- Do not rewrite `data/source/reports/*.md`.
- Do not fill capacity-stage values or invent occupation × locality rows.
- Front-door High cut is `0.30`. Research charts keep `EXPOSURE_THRESHOLD = 0.25`.
- Exposure `=== 0` is No signal: no percentage, no destination.
- “No next job” copy must not say or imply at risk.
- Headings: under 48 characters; no occupation / credential / feeder / adjacency / provenance / cohort.
- Instrument Editorial only: no second palette, radius 0, no shadow, no `CommandDialog` for search.
- Do not force-push; Lovable syncs on ordinary pushes.
- Do not start the O\*NET generator (phase C).

## File map

| File | Responsibility |
|---|---|
| `scripts/pin-workforce.mjs` | Read Nuxt `workforce.json`, slim it, fail on mismatch, write JSON + lock |
| `data/workforce/PROVENANCE.md` | What was copied, from where, what was dropped |
| `src/content/data/workforce.json` | Slim generated artifact (committed) |
| `src/content/data/workforce.lock.json` | sha256, source generated date, sibling path |
| `src/content/workforce.ts` | Types, load, search, occupationBySoc, programsFor, routesOf |
| `src/lib/exposureBand.ts` | `EXPOSED_AT`, `SAFE_BELOW`, `exposureBand`, `BAND_MEANING`, `hasSignal`, `EMPTY_ROUTES` |
| `src/config/site.ts` | Two-item `primaryNav`, ELI18 tagline |
| `src/routes/index.tsx` | Search home |
| `src/routes/job/$soc.tsx` | One-job page |
| `src/components/job/JobSearch.tsx` | Input + ranked hits |
| `src/components/job/DestinationList.tsx` | Flattened next-job list |
| `src/routes/research/index.tsx` | Add links to map / capacity / region / methodology |
| `tests/workforce.test.ts` | Slice invariants, search, bands, join with analysis occupations |
| `tests/navigation.test.ts` | Nav is two items; research stories still exist |

---

### Task 1: Pin the slim workforce slice

**Files:**
- Create: `scripts/pin-workforce.mjs`
- Create: `data/workforce/PROVENANCE.md`
- Create: `src/content/data/workforce.json` (script output)
- Create: `src/content/data/workforce.lock.json` (script output)
- Test: `tests/workforce.test.ts` (first assertions only)

**Interfaces:**
- Consumes: `../career-transition-map/app/data/workforce.json` or `$CAREER_TRANSITION_MAP/app/data/workforce.json`; `src/content/data/occupations.json`
- Produces: slim JSON with `{ meta, programs, occupations }`; lock `{ sourceGenerated, sourceSha256, pinnedAt, occupationCount, programCount }`

- [ ] **Step 1: Write the failing join test**

Create `tests/workforce.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { occupations as analysisOccupations } from "@/content/occupations";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("pinned workforce slice", () => {
  it("exists and has 39 in-scope origins", () => {
    const raw = JSON.parse(
      readFileSync(join(ROOT, "src/content/data/workforce.json"), "utf8"),
    );
    expect(raw.occupations).toHaveLength(39);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- tests/workforce.test.ts`

Expected: FAIL — `ENOENT` for `src/content/data/workforce.json`

- [ ] **Step 3: Write `scripts/pin-workforce.mjs`**

```js
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const sibling =
  process.env.CAREER_TRANSITION_MAP ??
  join(ROOT, "..", "career-transition-map");
const sourcePath = join(sibling, "app", "data", "workforce.json");
const analysisPath = join(ROOT, "src", "content", "data", "occupations.json");
const outDir = join(ROOT, "src", "content", "data");

if (!existsSync(sourcePath)) {
  throw new Error(
    `Missing ${sourcePath}\nSet CAREER_TRANSITION_MAP to the Nuxt repo root. This script has no fallback.`,
  );
}

const sourceBuf = readFileSync(sourcePath);
const source = JSON.parse(sourceBuf.toString("utf8"));
const analysis = JSON.parse(readFileSync(analysisPath, "utf8"));
const analysisByCode = new Map(analysis.map((o) => [o.code, o]));

const FAMILIES = new Set([
  "Office & Administrative Support",
  "Sales",
  "Business & Financial",
  "Computer & Mathematical",
]);
const analysisInScope = analysis.filter(
  (o) => FAMILIES.has(o.group) && o.exposure >= 0.25,
);
if (analysisInScope.length !== 39) {
  throw new Error(
    `Expected 39 in-scope origins from occupations.json, got ${analysisInScope.length}`,
  );
}

const slimDest = (d) => ({
  soc: d.soc,
  title: d.title,
  group: d.group,
  tier: d.tier,
  wage: d.wage,
  exposure: d.exposure,
  wageGain: d.wageGain,
  zone: d.zone,
  build: d.build ?? [],
  programIds: d.programIds ?? [],
  leadProgramId: d.leadProgramId ?? null,
  timeBand: d.timeBand,
  timeSource: d.timeSource,
  openDoor: Boolean(d.openDoor),
});

const failures = [];
const usedPrograms = new Set();

const inScopeCodes = new Set(analysisInScope.map((o) => o.code));
const occupations = source.occupations
  .filter((o) => inScopeCodes.has(o.soc))
  .map((o) => {
  const analysisOcc = analysisByCode.get(o.soc);
  if (!analysisOcc) {
    failures.push(`${o.soc} ${o.title}: not in occupations.json`);
  } else if (analysisOcc.exposure !== o.exposure) {
    failures.push(
      `${o.soc}: workforce exposure ${o.exposure} !== analysis ${analysisOcc.exposure}`,
    );
  }
  const aligned = (o.aligned ?? []).map(slimDest);
  const adjacent = (o.adjacent ?? []).map(slimDest);
  for (const d of [...aligned, ...adjacent]) {
    if (d.exposure === 0) {
      failures.push(`${o.soc} → ${d.soc}: destination exposure is 0 (unmeasured)`);
    }
    for (const id of d.programIds) usedPrograms.add(id);
  }
  return {
    soc: o.soc,
    title: o.title,
    group: o.group,
    exposure: o.exposure,
    employment: o.employment,
    wage: o.wage,
    zone: o.zone,
    aligned,
    adjacent,
  };
});

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

const programs = (source.programs ?? [])
  .filter((p) => usedPrograms.has(p.id))
  .map((p) => ({
    id: p.id,
    name: p.name,
    provider: p.provider,
    costFastForward: p.costFastForward,
    costFull: p.costFull,
    timeBand: p.timeBand,
    source: p.source,
    provenance: p.provenance,
  }));

const slim = { meta: source.meta, programs, occupations };
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "workforce.json"), JSON.stringify(slim));
writeFileSync(
  join(outDir, "workforce.lock.json"),
  JSON.stringify(
    {
      sourcePath: resolve(sourcePath),
      sourceGenerated: source.meta.generated,
      sourceSha256: createHash("sha256").update(sourceBuf).digest("hex"),
      pinnedAt: new Date().toISOString(),
      occupationCount: occupations.length,
      programCount: programs.length,
    },
    null,
    2,
  ),
);
if (occupations.length !== 39) {
  throw new Error(`Expected 39 pinned origins, got ${occupations.length}`);
}
console.log(
  `pinned ${occupations.length} origins, ${programs.length} programs`,
);
```

- [ ] **Step 4: Write `data/workforce/PROVENANCE.md`**

```md
# Workforce slice (front-door routes)

Copied from the frozen Career Transition Map generator output, not recomputed here.

- Source: `career-transition-map/app/data/workforce.json`
- Generator: `career-transition-map/scripts/build-workforce.mjs`
- Generated: see `src/content/data/workforce.lock.json` `sourceGenerated`

A destination is an O*NET-related occupation that pays 5–100% more and is
meaningfully less AI-exposed. Destinations with exposure exactly 0 are not in
this file. Origins are the 39 jobs in the four families that hold 75.6% of
regional exposure, at the report’s ≥ 0.25 cut. This is not the 28-row
`pathways_reachable.csv` table and not all 523 occupations.

Refresh: `node scripts/pin-workforce.mjs`
Do not hand-edit `src/content/data/workforce.json`.
```

- [ ] **Step 5: Run the pin script and re-run the test**

Run:

```bash
node scripts/pin-workforce.mjs
npm test -- tests/workforce.test.ts
```

Expected: script prints `pinned 39 origins, N programs`; test PASS.

If the exposure join fails, stop and report the mismatched SOC codes. Do not coerce zeros or skip rows.

- [ ] **Step 6: Commit**

```bash
git add scripts/pin-workforce.mjs data/workforce/PROVENANCE.md \
  src/content/data/workforce.json src/content/data/workforce.lock.json \
  tests/workforce.test.ts
git commit -m "$(cat <<'EOF'
feat: pin slim workforce routes for the job front door

Copy the generated occupation-to-destination slice for the 39 in-scope origins
so the front door matches the exposure report’s four families.
EOF
)"
```

---

### Task 2: Accessors, search, and exposure bands

**Files:**
- Create: `src/lib/exposureBand.ts`
- Create: `src/content/workforce.ts`
- Modify: `tests/workforce.test.ts`

**Interfaces:**
- Consumes: `src/content/data/workforce.json`
- Produces:
  - `exposureBand(value: number | null | undefined): "No signal" | "Low" | "Medium" | "High"`
  - `hasSignal(value: number | null | undefined): boolean`
  - `EXPOSED_AT = 0.30`, `SAFE_BELOW = 0.10`
  - `BAND_MEANING`, `EMPTY_ROUTES` (verbatim from the spec)
  - `searchOccupations(query: string, limit?: number): WorkforceOccupation[]`
  - `occupationBySoc(soc: string): WorkforceOccupation | undefined`
  - `routesOf(o: WorkforceOccupation): Destination[]` — aligned then adjacent, unsorted
  - `programById(id: string): WorkforceProgram | undefined`

- [ ] **Step 1: Add failing band and search tests** to `tests/workforce.test.ts`

```ts
import {
  BAND_MEANING,
  EXPOSED_AT,
  exposureBand,
  hasSignal,
  EMPTY_ROUTES,
} from "@/lib/exposureBand";
import {
  occupationBySoc,
  routesOf,
  searchOccupations,
  workforceOccupations,
} from "@/content/workforce";

describe("exposureBand", () => {
  it("treats exact 0 as No signal, not Low", () => {
    expect(exposureBand(0)).toBe("No signal");
    expect(exposureBand(null)).toBe("No signal");
    expect(hasSignal(0)).toBe(false);
    expect(exposureBand(0.0001)).toBe("Low");
    expect(exposureBand(EXPOSED_AT)).toBe("High");
  });

  it("keeps BAND_MEANING and EMPTY_ROUTES as full sentences", () => {
    for (const text of [...Object.values(BAND_MEANING), EMPTY_ROUTES]) {
      expect(text.endsWith(".")).toBe(true);
      expect(text.length).toBeGreaterThan(20);
    }
    expect(EMPTY_ROUTES.toLowerCase()).not.toContain("at risk");
  });
});

describe("searchOccupations", () => {
  it("with a short query still returns the in-scope list for the home grouped view", () => {
    expect(workforceOccupations).toHaveLength(39);
  });

  it("finds Customer Service Representatives and does not find nurses", () => {
    const titles = searchOccupations("customer").map((o) => o.title);
    expect(titles).toContain("Customer Service Representatives");
    expect(searchOccupations("nurse").map((o) => o.title)).not.toContain(
      "Registered Nurses",
    );
  });
});

describe("routes", () => {
  it("gives Customer Service Representatives at least one destination", () => {
    const csr = occupationBySoc("43-4051");
    expect(csr).toBeTruthy();
    expect(routesOf(csr!).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- tests/workforce.test.ts`

Expected: FAIL — cannot resolve `@/content/workforce` / `@/lib/exposureBand`

- [ ] **Step 3: Implement `src/lib/exposureBand.ts`**

Copy cut points and strings from the spec. `EMPTY_ROUTES` is the exact empty-route paragraph. `hasSignal` is `value != null && value !== 0`. `searchOccupations` still returns `[]` for queries shorter than 2 characters; the home page shows all 39 grouped when the query is that short.

- [ ] **Step 4: Implement `src/content/workforce.ts`**

Port ranking from `career-transition-map/app/data/workforce.ts` (`coverage`, word-prefix rank, employment tie-break). Types live in this file (do not import from the Nuxt repo).

`routesOf` concatenates `aligned` and `adjacent` and does not sort — sorting belongs to the list component in Task 5.

- [ ] **Step 5: Run tests**

Run: `npm test -- tests/workforce.test.ts`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/exposureBand.ts src/content/workforce.ts tests/workforce.test.ts
git commit -m "$(cat <<'EOF'
feat: add workforce search and exposure bands

Front-door High is 30%, and exact-zero exposure stays No signal rather than a
measured low.
EOF
)"
```

---

### Task 3: Route invariants

**Files:**
- Modify: `tests/workforce.test.ts`
- Modify: `tests/parity.test.ts` (add a one-line note test that `EXPOSURE_THRESHOLD` is still 0.25)

**Interfaces:**
- Consumes: `workforceOccupations`, `routesOf`, `exposureBand`
- Produces: none (tests only)

- [ ] **Step 1: Add failing invariant tests**

```ts
import { EXPOSURE_THRESHOLD } from "@/content/occupations";

it("never offers an unmeasured or more-exposed destination", () => {
  for (const o of workforceOccupations) {
    for (const d of routesOf(o)) {
      expect(d.exposure, `${o.soc}→${d.soc}`).toBeGreaterThan(0);
      expect(d.exposure).toBeLessThan(o.exposure);
      if (o.wage != null) expect(d.wage).toBeGreaterThan(o.wage);
    }
  }
});

it("every origin is in the four families and at least 0.25 exposed", () => {
  const families = new Set([
    "Office & Administrative Support",
    "Sales",
    "Business & Financial",
    "Computer & Mathematical",
  ]);
  expect(workforceOccupations).toHaveLength(39);
  for (const o of workforceOccupations) {
    expect(families.has(o.group), o.title).toBe(true);
    expect(o.exposure).toBeGreaterThanOrEqual(0.25);
  }
});

it("covers 36 of 39 origins with at least one route", () => {
  const withRoutes = workforceOccupations.filter((o) => routesOf(o).length > 0);
  expect(withRoutes).toHaveLength(36);
  expect(
    workforceOccupations.filter((o) => routesOf(o).length === 0).map((o) => o.soc).sort(),
  ).toEqual(["13-1151", "13-2052", "13-2054"]);
});

it("leaves the analysis exposure cut at 0.25", () => {
  expect(EXPOSURE_THRESHOLD).toBe(0.25);
  expect(EXPOSED_AT).toBe(0.30);
});
```

If any assertion fails against the pinned file, stop. Do not weaken the test to match a bad slice — re-run Task 1.

- [ ] **Step 2: Run tests**

Run: `npm test -- tests/workforce.test.ts tests/parity.test.ts`

Expected: PASS (invariants describe the file Task 1 already pinned)

- [ ] **Step 3: Commit**

```bash
git add tests/workforce.test.ts tests/parity.test.ts
git commit -m "$(cat <<'EOF'
test: pin front-door route invariants and the 0.25 research cut

Keep the analysis threshold and the job-map High cut as two named numbers so
they cannot be silently merged.
EOF
)"
```

---

### Task 4: Home is the job search

**Files:**
- Create: `src/components/job/JobSearch.tsx`
- Modify: `src/routes/index.tsx`
- Modify: `src/config/site.ts` (tagline only in this task; nav in Task 6)
- Modify: `tests/navigation.test.ts`

**Interfaces:**
- Consumes: `searchOccupations`, `exposureBand`, `hasSignal`, `BAND_MEANING`
- Produces: links to `/job/$soc` (route file lands in Task 5; use `to="/job/$soc"` with `params={{ soc }}` — TypeScript may complain until Task 5 adds the route; add the route file as a stub in this task if the router plugin requires it)

- [ ] **Step 1: Add a failing nav-copy test**

In `tests/navigation.test.ts`:

```ts
import { siteConfig } from "@/config/site";

it("states the four-family exposed-job question in the tagline", () => {
  expect(siteConfig.tagline.toLowerCase()).toContain("job");
  expect(siteConfig.tagline.toLowerCase()).toContain("ai");
  expect(siteConfig.tagline).not.toMatch(/occupation-level evidence/i);
});
```

- [ ] **Step 2: Run it**

Run: `npm test -- tests/navigation.test.ts`

Expected: FAIL on the old research tagline

- [ ] **Step 3: Set the tagline** in `src/config/site.ts`

```ts
tagline:
  "These are the Greater Richmond jobs where people already use AI a lot. Pick one to see nearby jobs that pay more and use AI less.",
```

Leave `primaryNav` unchanged until Task 6 so this task is only the home page.

- [ ] **Step 4: Implement `JobSearch`**

Always-visible `<input type="search">` (autofocus), `aria-label="Search jobs"`. Below it, the 39 jobs grouped by the four families (office, sales, business/financial, computer), each family ordered by `employment * exposure` descending. Filter with `searchOccupations(query, 39)` when the query is at least 2 characters; otherwise show all 39 grouped. Each row is a `Link` to `/job/$soc` showing title and `Math.round(exposure * 100) + "%"`. Empty filter: “No jobs on this list match that name.” `grid-cols-1`. Do not `truncate` the title. Do not paginate.

- [ ] **Step 5: Replace `src/routes/index.tsx`**

Remove the reports-first home. Use `PageHeader` + grouped `JobSearch`. Title: `Find a job`. Lead: `siteConfig.tagline`. Eyebrow: `Richmond VA MSA (BLS 40060)`. Under the list: `Four job families hold three-quarters of the region’s measured AI use. This list is those families, at the report’s 25% exposure cut. It is not every job in Richmond.` Then: `This is not a ranking of people, and it is not a list of jobs to cut.`

Add a stub `src/routes/job/$soc.tsx` if the typechecker cannot see the Link target yet — a heading “Job” is enough; Task 5 replaces it.

- [ ] **Step 6: Typecheck and test**

Run:

```bash
npm test
npx tsc --noEmit
```

Expected: tests PASS; typecheck clean

- [ ] **Step 7: Commit**

```bash
git add src/components/job/JobSearch.tsx src/routes/index.tsx src/config/site.ts \
  src/routes/job/\$soc.tsx tests/navigation.test.ts
git commit -m "$(cat <<'EOF'
feat: make home the 39 exposed jobs in four Richmond families

The public door is now one field, not a library of peer sections.
EOF
)"
```

---

### Task 5: Job page

**Files:**
- Modify: `src/routes/job/$soc.tsx`
- Create: `src/components/job/DestinationList.tsx`
- Modify: `tests/workforce.test.ts` (sort helper if extracted)

**Interfaces:**
- Consumes: `occupationBySoc`, `routesOf`, `programById`, `exposureBand`, `BAND_MEANING`, `EMPTY_ROUTES`, `hasSignal`, analysis `occupations` for out-of-scope destination pages
- Produces: `sortDestinations(list: Destination[]): Destination[]` — tier rank `Primary-Short=0, Primary-Long=1, Supplemental=2, else=3`, then `wageGain` descending

- [ ] **Step 1: Add a failing sort test**

```ts
import { sortDestinations } from "@/components/job/DestinationList";

it("orders Primary-Short before Supplemental at equal wage gain", () => {
  const a = { soc: "1", title: "A", group: "G", tier: "Supplemental", wage: 2, exposure: 0.1, wageGain: 100, zone: 2, build: [], programIds: [], leadProgramId: null, timeBand: null, timeSource: "none", openDoor: false };
  const b = { soc: "2", title: "B", group: "G", tier: "Primary-Short", wage: 2, exposure: 0.1, wageGain: 100, zone: 2, build: [], programIds: [], leadProgramId: null, timeBand: null, timeSource: "none", openDoor: false };
  expect(sortDestinations([a, b]).map((d) => d.soc)).toEqual(["2", "1"]);
});
```

(Adjust the fixture to the real `Destination` type from `workforce.ts`.)

- [ ] **Step 2: Run to verify fail**

Run: `npm test -- tests/workforce.test.ts`

Expected: FAIL — `sortDestinations` not exported

- [ ] **Step 3: Implement `DestinationList`**

One list. Row: title (link to `/job/$soc` of the destination), wage and wageGain as USD with no cents, destination band + percent if `hasSignal`, `timeBand` if present, `build.map(s => s.name)` joined with commas if non-empty, course `programById(leadProgramId)?.name` only when it resolves.

Do not render “no course,” “none needed,” or skill 0–7 numbers.

Section heading: `Next jobs that pay more and use AI less`

- [ ] **Step 4: Implement the job route**

```ts
export const Route = createFileRoute("/job/$soc")({
  loader: ({ params }) => {
    const origin = occupationBySoc(params.soc);
    if (origin) return { kind: "origin" as const, job: origin };
    const dest = occupations.find((o) => o.code === params.soc);
    if (dest) return { kind: "destination" as const, job: dest };
    throw notFound();
  },
  component: JobPage,
});
```

Origin: title, group, percent, `BAND_MEANING[band]`. If `sortDestinations(routesOf(job)).length > 0`, render `DestinationList`. Else render `<p>{EMPTY_ROUTES}</p>`.

Destination-only: title, percent if `hasSignal`, No-signal sentence if exposure is 0, and `This job is a destination on the map, not one of the 39 starting jobs.` No hop list.

Collapsed `<details>` “Where these numbers come from” on origin pages only, listing `workforce.meta` and the spec limits.

- [ ] **Step 5: Run tests and typecheck**

Run:

```bash
npm test
npx tsc --noEmit
npm run lint
```

Expected: all green. If lint flags pre-existing `ui/` warnings only, do not “fix” those files.

- [ ] **Step 6: Commit**

```bash
git add src/routes/job/\$soc.tsx src/components/job/DestinationList.tsx tests/workforce.test.ts
git commit -m "$(cat <<'EOF'
feat: show exposure and next jobs on one job page

Empty High jobs keep the ladder/second-career copy instead of reading as a
missing lookup or a risk flag.
EOF
)"
```

---

### Task 6: Demote Evidence; keep old URLs

**Files:**
- Modify: `src/config/site.ts`
- Modify: `src/routes/research/index.tsx`
- Modify: `tests/navigation.test.ts`
- Modify: `src/components/site/SiteFooter.tsx` only if it needs a second “Library” list beyond `primaryNav`

**Interfaces:**
- Consumes: existing research stories
- Produces: `primaryNav` length 2; `evidenceNav` for the research index (map, capacity, region, methodology, reports)

- [ ] **Step 1: Replace the nav test** in `tests/navigation.test.ts`

```ts
import { primaryNav } from "@/config/site";

it("puts one product door and one evidence door in primary nav", () => {
  expect(primaryNav.map((i) => [i.label, i.to])).toEqual([
    ["Find a job", "/"],
    ["Evidence", "/research"],
  ]);
});
```

Remove any assertion that required six peers. Keep the tests that the three reports still exist and that capacity stages stay null.

- [ ] **Step 2: Run to verify fail**

Run: `npm test -- tests/navigation.test.ts`

Expected: FAIL — six nav items

- [ ] **Step 3: Change `primaryNav`**

```ts
export const primaryNav: NavItem[] = [
  {
    label: "Find a job",
    to: "/",
    description: "See whether AI is already in a job, and which nearby jobs pay more and use it less.",
  },
  {
    label: "Evidence",
    to: "/research",
    description: "Reports, the published pair table, geography, and method.",
  },
];
```

- [ ] **Step 4: On `/research`, add a “Also here” list** (plain links, not a second primary nav):

- Transition map (28 published pairs) → `/transition-map`
- Transition capacity → `/transition-capacity`
- Richmond region → `/richmond-region`
- Methodology → `/methodology`

Lead sentence on that page: `These reports are the evidence behind the job map, not a second product.`

Do not change `/transition-map` copy to claim it is the 39-job engine. Optionally add one sentence at the top of that page: `This table is the analysis screen for declining jobs. To look up an exposed starting job, use Find a job.`

- [ ] **Step 5: Run tests, typecheck, lint**

Run:

```bash
npm test
npx tsc --noEmit
npm run lint
```

Expected: PASS / 0 errors (existing `ui/` warnings allowed)

- [ ] **Step 6: Commit**

```bash
git add src/config/site.ts src/routes/research/index.tsx src/routes/transition-map.tsx \
  tests/navigation.test.ts
git commit -m "$(cat <<'EOF'
feat: shrink primary nav to the job map and evidence

Old research URLs stay; they stop competing with the one question the site
exists to answer.
EOF
)"
```

---

### Task 7: Docs in this repo

**Files:**
- Modify: `docs/visual-system.md` (add a “Front door” paragraph pointing at `/` and `/job/$soc`)
- Modify: `AGENTS.md` (after the Lovable history warning: front door is the job search; do not re-peer the six nav items; do not fill the 28-pair table from workforce routes)

**Interfaces:** none

- [ ] **Step 1: Update those two files** with the facts in the spec. Do not copy the Nuxt `AGENTS.md`. Do not mention employer/worker doors.

- [ ] **Step 2: Commit**

```bash
git add docs/visual-system.md AGENTS.md
git commit -m "$(cat <<'EOF'
docs: record that Pathfinder’s public door is the job map

Stop agents from restoring six equal research peers as the home.
EOF
)"
```

---

## Manual check (after Task 6, before calling B done)

No Playwright in this repo. In a browser at 390px and desktop:

1. `/` — four family headings, 39 jobs, no report cards as the first screen
2. Type `customer` — Customer Service Representatives; open it — destinations listed, pay up, exposure down
3. Type `nurse` — no Registered Nurses (out of scope)
4. Open Personal Financial Advisors (`13-2052`) — `EMPTY_ROUTES` visible, no “at risk”
5. Follow a destination that is not one of the 39 — thin page, no hop list
6. `/research` still lists three reports; `/transition-map` still has 28 pairs
7. Print is not in scope for B

---

## Self-review

- Spec coverage: pin, bands, search, home, job page, empty High, No signal, nav, 28-pair demotion, 0.25 vs 0.30, no CTM edits — each has a task.
- Phase C generator is not in this plan.
- Training: course name only when `leadProgramId` resolves; no empty “none needed.”
- Stay-in-role AI margin is not in this plan.
