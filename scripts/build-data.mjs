// Reshapes the synced analysis tables into the JSON the site renders.
//
// Where the reports state a figure in prose or a text table, this recomputes it
// from the same source data rather than parsing the report, and checks the result
// against the published value. A chart that disagrees with the report it sits
// beside is worse than no chart, so a mismatch fails the build.
//
// Two conventions from the analysis carry through: a suppressed BLS cell is null
// rather than zero, and an employment change is reported alongside the sampling
// error it has to clear before it means anything.

import { csvParse } from "d3-dsv";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const VENDOR = join(ROOT, "data", "source");
const OUT = join(ROOT, "src", "content", "data");

const readOutput = (f) => csvParse(readFileSync(join(VENDOR, "output", f), "utf8"));

// BLS withholds estimates that would disclose an individual establishment. An
// empty cell means "not published", which is not a quantity and must never be
// coerced to 0.
const num = (v) => (v === "" || v == null ? null : Number(v));
const round = (v, places) => (v == null ? null : Number(v.toFixed(places)));

const EXPOSED = 0.25;

const failures = [];
function check(label, actual, expected, tolerance) {
  if (actual == null || Math.abs(actual - expected) > tolerance) {
    failures.push(`${label}: computed ${actual}, published ${expected}`);
  }
}

// ---------------------------------------------------------------- occupations

const base = readOutput("richmond_exposure_2025.csv");
const threePoint = readOutput("richmond_three_point.csv");
const panel = readOutput("richmond_panel_2010_2025.csv");
const binding = readOutput("binding_constraints.csv");

const changeByCode = new Map(threePoint.map((r) => [r.occ_code, r]));

// vintage -> occ_code -> { emp, prse, wage }
const byVintage = new Map();
for (const row of panel) {
  if (row.o_group !== "detailed") continue;
  const vintage = Number(row.vintage);
  if (!byVintage.has(vintage)) byVintage.set(vintage, new Map());
  byVintage.get(vintage).set(row.occ_code, {
    emp: num(row.tot_emp),
    prse: num(row.emp_prse),
    wage: num(row.a_mean),
  });
}

const prseFor = (code, vintage) => byVintage.get(vintage)?.get(code)?.prse ?? null;

// Standard error of a difference between two independent estimates. OEWS
// publishes the relative standard error as a percentage of the estimate.
function changeZScore(emp23, emp25, prse23, prse25) {
  if ([emp23, emp25, prse23, prse25].some((v) => v == null)) return null;
  const combined = Math.hypot((emp23 * prse23) / 100, (emp25 * prse25) / 100);
  return combined === 0 ? null : (emp25 - emp23) / combined;
}

const occupations = base.map((row) => {
  const change = changeByCode.get(row.occ_code);
  const emp23 = change ? num(change.emp_23) : null;
  const emp25 = num(row.employment);
  const prse23 = prseFor(row.occ_code, 2023);
  const prse25 = prseFor(row.occ_code, 2025);

  return {
    code: row.occ_code,
    title: row.bls_title,
    group: row.group,
    emp: emp25,
    lq: num(row.loc_quotient),
    lq23: change ? num(change.lq_23) : null,
    wage: num(row.annual_mean),
    exposure: num(row.observed_exposure),
    emp23,
    pct: change ? num(change.pct) : null,
    prse23,
    prse25,
    z: round(changeZScore(emp23, emp25, prse23, prse25), 2),
  };
});

// ------------------------------------------------------- wage premium by cut

// thresholds.txt section 4: the employment-weighted mean wage of exposed
// occupations against the least exposed, at each cut point. The report calls this
// the strongest finding in the analysis, so its stability is worth showing rather
// than asserting.
const wageable = occupations.filter((o) => o.wage != null);
const weightedMeanWage = (set) =>
  set.reduce((s, o) => s + o.emp * o.wage, 0) / set.reduce((s, o) => s + o.emp, 0);

const reference = wageable.filter((o) => o.exposure <= 0.05);
const referenceWage = weightedMeanWage(reference);

check("wage premium reference occupations", reference.length, 316, 0);
check("wage premium reference wage", Math.round(referenceWage), 55_419, 1);

const PREMIUM_CUTS = [0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6];
const PUBLISHED_PREMIUM = {
  0.1: [149, 83_790, 51],
  0.15: [121, 81_047, 46],
  0.2: [101, 78_062, 41],
  0.25: [71, 76_905, 39],
  0.3: [56, 73_050, 32],
  0.4: [28, 68_802, 24],
  0.5: [9, 71_145, 28],
  0.6: [6, 65_346, 18],
};

const wagePremium = PREMIUM_CUTS.map((cut) => {
  const set = wageable.filter((o) => o.exposure >= cut);
  const meanWage = weightedMeanWage(set);
  const premium = (meanWage / referenceWage - 1) * 100;

  const [pOccs, pWage, pPremium] = PUBLISHED_PREMIUM[cut];
  check(`premium ${cut} occupations`, set.length, pOccs, 0);
  check(`premium ${cut} mean wage`, Math.round(meanWage), pWage, 1);
  check(`premium ${cut} premium`, Math.round(premium), pPremium, 1);

  return { cut, occs: set.length, meanWage: Math.round(meanWage), premium: round(premium, 1) };
});

// ------------------------------------------------------------------ leverage

// robustness.txt section 1: the aggregate decline in exposed work, and what is
// left of it after its largest contributors are removed one at a time. The site
// lets a reader do the removing, so the arithmetic behind that is checked here.
const comparable = occupations.filter((o) => o.emp23 != null && o.emp != null);
const groupChange = (set) => {
  const from = set.reduce((s, o) => s + o.emp23, 0);
  const to = set.reduce((s, o) => s + o.emp, 0);
  return from === 0 ? null : ((to - from) / from) * 100;
};

const exposedSet = comparable.filter((o) => o.exposure >= EXPOSED);
check("leverage exposed baseline", groupChange(exposedSet), -4.37, 0.01);
check(
  "leverage others baseline",
  groupChange(comparable.filter((o) => o.exposure < EXPOSED)),
  2.91,
  0.01,
);

// Dropping the largest losses in order should walk the aggregate across zero.
const byLoss = [...exposedSet].sort((a, b) => a.emp - a.emp23 - (b.emp - b.emp23));
for (const [n, expected] of [
  [1, -1.92],
  [2, -0.24],
  [3, 0.84],
  [4, 1.99],
]) {
  check(
    `leverage minus ${n}`,
    groupChange(exposedSet.filter((o) => !byLoss.slice(0, n).includes(o))),
    expected,
    0.01,
  );
}

// ----------------------------------------------------------- placebo windows

// robustness.txt section 8: run the same screen on three-vintage windows going
// back to 2013. Occupations keep their current exposure score throughout, so this
// asks whether work that scores high today was already declining before a language
// model could have touched it.
// "Scored" is narrower than the 523-occupation base: the robustness battery works
// from occupations carrying employment in both 2023 and 2025, which is 482 of them,
// and the historical windows inherit that population. Using the full base instead
// pulls in occupations the published table excludes.
const scoreAll = new Map(
  occupations.filter((o) => o.emp23 != null && o.emp != null).map((o) => [o.code, o.exposure]),
);

const WINDOWS = [2013, 2015, 2017, 2019, 2021, 2023];
const PUBLISHED_WINDOWS = {
  2013: [362, 47, 9, 12, 1.56, 2.68],
  2015: [348, 47, 6, 15, 2.39, 3.36],
  2017: [343, 46, 8, 13, -1.44, 3.63],
  2019: [367, 49, 15, 3, -2.53, -8.26],
  2021: [448, 63, 12, 18, 1.17, 6.14],
  2023: [479, 66, 13, 15, -4.37, 2.85],
};

const placebo = WINDOWS.map((start) => {
  const [a, b, c] = [start, start + 1, start + 2];
  const rows = [];

  for (const [code, exposure] of scoreAll) {
    const first = byVintage.get(a)?.get(code);
    const mid = byVintage.get(b)?.get(code);
    const last = byVintage.get(c)?.get(code);
    if (!first?.emp || !mid?.emp || !last?.emp) continue;
    rows.push({ exposure, a: first.emp, b: mid.emp, c: last.emp });
  }

  const change = (set) => {
    const from = set.reduce((s, r) => s + r.a, 0);
    const to = set.reduce((s, r) => s + r.c, 0);
    return from === 0 ? null : ((to - from) / from) * 100;
  };

  const exposed = rows.filter((r) => r.exposure >= EXPOSED);
  const others = rows.filter((r) => r.exposure < EXPOSED);
  const exposedPct = change(exposed);
  const othersPct = change(others);

  const [pScored, pExposed, pFell, pRose, pExposedPct, pOthersPct] = PUBLISHED_WINDOWS[start];
  check(`window ${start} scored`, rows.length, pScored, 0);
  check(`window ${start} exposed count`, exposed.length, pExposed, 0);
  check(`window ${start} exposed change`, exposedPct, pExposedPct, 0.02);
  check(`window ${start} others change`, othersPct, pOthersPct, 0.02);
  check(
    `window ${start} fell both`,
    exposed.filter((r) => r.b < r.a && r.c < r.b).length,
    pFell,
    0,
  );
  check(
    `window ${start} rose both`,
    exposed.filter((r) => r.b > r.a && r.c > r.b).length,
    pRose,
    0,
  );

  return {
    label: `${a}–${c}`,
    start,
    scored: rows.length,
    exposedCount: exposed.length,
    fellBoth: exposed.filter((r) => r.b < r.a && r.c < r.b).length,
    roseBoth: exposed.filter((r) => r.b > r.a && r.c > r.b).length,
    exposedPct: round(exposedPct, 2),
    othersPct: round(othersPct, 2),
    gap: round(exposedPct - othersPct, 2),
    // Generative AI was not publicly available across windows ending before 2020.
    preGenerativeAI: c < 2020,
  };
});

// ------------------------------------------------------- destination scarcity

// binding_constraints.csv counts, for each declining occupation, how many of its
// O*NET-related occupations fail each screening condition. The counts overlap — a
// neighbour can be both absent and shrinking — so they describe reasons, not a
// partition, and must not be drawn as a stacked total.
const constraints = binding
  .map((r) => ({
    code: r.occ,
    title: r.title,
    lost: num(r.lost),
    wage: num(r.wage),
    neighbours: num(r.neighbours),
    absent: num(r.absent),
    exposed: num(r.exposed),
    shrinking: num(r.shrinking),
    paysLess: num(r.pays_less),
    viable: num(r.viable),
  }))
  .sort((x, y) => y.lost - x.lost);

// ------------------------------------------------------------- trajectories

// Sixteen vintages for the occupations the reports discuss, so a decline can be
// read against its own history rather than a two-year window. Restricted to
// exposed and declining occupations to keep the payload small.
const trajectoryCodes = new Set([
  ...occupations.filter((o) => o.exposure >= EXPOSED).map((o) => o.code),
  ...constraints.map((c) => c.code),
]);

const trajectories = {};
for (const code of trajectoryCodes) {
  const series = [];
  for (const [vintage, rows] of [...byVintage].sort(([m], [n]) => m - n)) {
    const row = rows.get(code);
    if (!row?.emp) continue;
    series.push({ v: vintage, e: row.emp, p: row.prse });
  }
  if (series.length >= 2) trajectories[code] = series;
}

// robustness.txt section 7 prints the sixteen-year series for the three named
// occupations; spot-check the ends of one of them.
const csr = trajectories["43-4051"];
check("customer service 2010", csr?.at(0)?.e, 9_460, 0);
check("customer service 2025", csr?.at(-1)?.e, 10_960, 0);
check("customer service vintages", csr?.length, 16, 0);

// ------------------------------------------------------------------- write

if (failures.length) {
  console.error("\nComputed figures disagree with the published analysis:\n");
  for (const f of failures) console.error(`  ${f}`);
  console.error("\nResolve before building.\n");
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
const write = (name, value) => {
  writeFileSync(join(OUT, name), JSON.stringify(value));
  return `${name} ${(JSON.stringify(value).length / 1024).toFixed(0)} KB`;
};

console.log(write("occupations.json", occupations));
console.log(write("wage-premium.json", wagePremium));
console.log(write("placebo.json", placebo));
console.log(write("constraints.json", constraints));
console.log(write("trajectories.json", trajectories));

const withChange = occupations.filter((o) => o.pct != null);
console.log(
  `\n${occupations.length} occupations · ${withChange.length} with a 2023-2025 change · ` +
    `${withChange.filter((o) => o.z != null && Math.abs(o.z) >= 1.96).length} clearing sampling error`,
);
console.log(
  `${Object.keys(trajectories).length} trajectories · ${constraints.length} declining occupations · ` +
    `every published figure recomputed and matched`,
);
