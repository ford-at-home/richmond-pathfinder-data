/**
 * Copies a slim occupation→destination slice from the frozen Nuxt generator
 * output. Origins are the 39 jobs in the four families that hold 75.6% of
 * Richmond's measured exposure, at the report's ≥ 0.25 cut.
 *
 * Run: node scripts/pin-workforce.mjs
 * Override source: CAREER_TRANSITION_MAP=/path/to/career-transition-map
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const sibling = process.env.CAREER_TRANSITION_MAP ?? join(ROOT, "..", "career-transition-map");
const sourcePath = join(sibling, "app", "data", "workforce.json");
const analysisPath = join(ROOT, "src", "content", "data", "occupations.json");
const outDir = join(ROOT, "src", "content", "data");

const FAMILIES = new Set([
  "Office & Administrative Support",
  "Sales",
  "Business & Financial",
  "Computer & Mathematical",
]);

if (!existsSync(sourcePath)) {
  throw new Error(
    `Missing ${sourcePath}\nSet CAREER_TRANSITION_MAP to the Nuxt repo root. This script has no fallback.`,
  );
}

const sourceBuf = readFileSync(sourcePath);
const source = JSON.parse(sourceBuf.toString("utf8"));
const analysis = JSON.parse(readFileSync(analysisPath, "utf8"));
const analysisByCode = new Map(analysis.map((o) => [o.code, o]));

const analysisInScope = analysis.filter((o) => FAMILIES.has(o.group) && o.exposure >= 0.25);
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
  timeBand: d.timeBand ?? null,
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
    if (!FAMILIES.has(o.group) || o.exposure < 0.25) {
      failures.push(`${o.soc} ${o.title}: not in four families at ≥ 0.25`);
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

if (occupations.length !== 39) {
  failures.push(`Expected 39 pinned origins, got ${occupations.length}`);
}

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
  `${JSON.stringify(
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
  )}\n`,
);
console.log(`pinned ${occupations.length} origins, ${programs.length} programs`);
