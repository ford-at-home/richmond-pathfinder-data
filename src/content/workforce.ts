import generated from "./data/workforce.json";

export type RelatednessTier = "Primary-Short" | "Primary-Long" | "Supplemental";

export type SkillGap = {
  name: string;
  have: number;
  need: number;
  gap: number;
};

export type Destination = {
  soc: string;
  title: string;
  group: string;
  tier: RelatednessTier | null;
  wage: number;
  exposure: number;
  wageGain: number;
  zone: number | null;
  build: SkillGap[];
  programIds: string[];
  leadProgramId: string | null;
  timeBand: string | null;
  timeSource: "program" | "zone" | "open" | "none";
  openDoor: boolean;
};

export type WorkforceOccupation = {
  soc: string;
  title: string;
  group: string;
  exposure: number;
  employment: number;
  wage: number | null;
  zone: number | null;
  aligned: Destination[];
  adjacent: Destination[];
};

export type WorkforceProgram = {
  id: string;
  name: string;
  provider: string;
  costFastForward: number | null;
  costFull: number | null;
  timeBand: string | null;
  source: string;
  provenance: string;
};

export type WorkforceSlice = {
  meta: {
    generated: string;
    exposureDefinition: string;
    exposureSource: string;
    wageSource: string;
    adjacencySource: string;
    trainingSource: string;
    aiProgramsPending: boolean;
  };
  programs: WorkforceProgram[];
  occupations: WorkforceOccupation[];
};

export const ORIGIN_FAMILIES = [
  "Office & Administrative Support",
  "Sales",
  "Business & Financial",
  "Computer & Mathematical",
] as const;

const TIER_RANK: Record<string, number> = {
  "Primary-Short": 0,
  "Primary-Long": 1,
  Supplemental: 2,
};

export const workforce = generated as WorkforceSlice;
export const workforceOccupations = workforce.occupations;
export const workforcePrograms = workforce.programs;
export const workforceMeta = workforce.meta;

const bySoc = new Map(workforceOccupations.map((o) => [o.soc, o]));
const programMap = new Map(workforcePrograms.map((p) => [p.id, p]));

export function occupationBySoc(soc: string): WorkforceOccupation | undefined {
  return bySoc.get(soc);
}

export function programById(id: string | null): WorkforceProgram | undefined {
  return id ? programMap.get(id) : undefined;
}

export function routesOf(o: WorkforceOccupation): Destination[] {
  return [...o.aligned, ...o.adjacent];
}

export function sortDestinations(list: Destination[]): Destination[] {
  return [...list].sort((a, b) => {
    const ta = TIER_RANK[a.tier ?? ""] ?? 3;
    const tb = TIER_RANK[b.tier ?? ""] ?? 3;
    if (ta !== tb) return ta - tb;
    return b.wageGain - a.wageGain;
  });
}

export function exposedJobs(o: { employment: number; exposure: number }): number {
  return o.employment * o.exposure;
}

const WORD_CHAR = /[a-z0-9]/;

function coverage(title: string, at: number, length: number): number {
  let start = at;
  while (start > 0 && WORD_CHAR.test(title[start - 1]!)) start -= 1;
  let end = at + length;
  while (end < title.length && WORD_CHAR.test(title[end]!)) end += 1;
  return length / (end - start);
}

/**
 * Title search over in-scope origins. Prefix and word-start beat a mid-title
 * hit; at equal rank, bigger employment wins.
 */
export function searchOccupations(query: string, limit = 12): WorkforceOccupation[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return workforceOccupations
    .map((o) => {
      const title = o.title.toLowerCase();
      const at = title.indexOf(q);
      if (at === -1) return null;
      const startsWord = at === 0 || !WORD_CHAR.test(title[at - 1]!);
      return {
        o,
        rank: at === 0 ? 0 : startsWord ? 1 : 2,
        fit: coverage(title, at, q.length),
      };
    })
    .filter((m): m is { o: WorkforceOccupation; rank: number; fit: number } => m !== null)
    .sort((a, b) => a.rank - b.rank || b.fit - a.fit || b.o.employment - a.o.employment)
    .slice(0, limit)
    .map((m) => m.o);
}

export function originsByFamily(): { family: string; jobs: WorkforceOccupation[] }[] {
  return ORIGIN_FAMILIES.map((family) => ({
    family,
    jobs: workforceOccupations
      .filter((o) => o.group === family)
      .sort((a, b) => exposedJobs(b) - exposedJobs(a)),
  })).filter((g) => g.jobs.length > 0);
}
