import { csvParse } from "d3-dsv";

import pathwaysCsv from "../../data/source/output/pathways_reachable.csv?raw";
import { occupations as analysisOccupations } from "./occupations";
import type { Occupation, TransitionEdge } from "./types";

function num(v: string | undefined): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

const rows = csvParse(pathwaysCsv);

/**
 * Screened origin→destination pairs from pathways_reachable.csv.
 * Skill lists and a 0–1 distance are not in that file; they stay empty / null.
 */
export const transitions: TransitionEdge[] = rows.map((row) => {
  const fromId = row["src"] ?? "";
  const toId = row["dst"] ?? "";
  return {
    fromId,
    toId,
    fromTitle: row["src_title"] ?? fromId,
    toTitle: row["dst_title"] ?? toId,
    distance: null,
    band: "unknown",
    zoneGap: num(row["zone_gap"]),
    replacement: num(row["replacement"]),
    tier: row["tier"] ?? "",
    originLost: num(row["src_lost"]),
    transferableSkills: [],
    skillGaps: [],
    steps: [],
    isPlaceholder: false,
  };
});

const nodeIds = new Set<string>();
for (const t of transitions) {
  nodeIds.add(t.fromId);
  nodeIds.add(t.toId);
}

export const occupations: Occupation[] = [...nodeIds].sort().map((id) => {
  const fromEdge = transitions.find((t) => t.fromId === id);
  const toEdge = transitions.find((t) => t.toId === id);
  const title = fromEdge?.fromTitle ?? toEdge?.toTitle ?? id;
  const analysis = analysisOccupations.find((o) => o.code === id);
  return {
    id,
    code: id,
    title,
    cluster: analysis?.group ?? "Not in the 523-occupation join",
    isPlaceholder: false,
  };
});

export const transitionBands = [
  {
    band: "unknown",
    label: "Screened pair (no distance band in source)",
    shape: "diamond",
    note: "pathways_reachable.csv publishes zone_gap and wage replacement, not a near/moderate/far distance band.",
  },
] as const;

export function occupationTitle(id: string): string {
  return occupations.find((o) => o.id === id)?.title ?? id;
}

export type OriginOption = {
  id: string;
  title: string;
  cluster: string;
  lost: number | null;
  destinationCount: number;
};

function uniqueOrigins(): OriginOption[] {
  const byId = new Map<string, OriginOption>();
  for (const t of transitions) {
    const existing = byId.get(t.fromId);
    if (existing) {
      existing.destinationCount += 1;
      continue;
    }
    const node = occupations.find((o) => o.id === t.fromId);
    byId.set(t.fromId, {
      id: t.fromId,
      title: t.fromTitle,
      cluster: node?.cluster ?? "Not in the 523-occupation join",
      lost: t.originLost,
      destinationCount: 1,
    });
  }
  return [...byId.values()].sort((a, b) => {
    const lostA = a.lost ?? Number.NEGATIVE_INFINITY;
    const lostB = b.lost ?? Number.NEGATIVE_INFINITY;
    if (lostA !== lostB) return lostB - lostA;
    return a.title.localeCompare(b.title);
  });
}

/** Occupations that appear as an origin in pathways_reachable.csv. */
export const origins: OriginOption[] = uniqueOrigins();

export function destinationsFrom(fromId: string): TransitionEdge[] {
  return transitions.filter((t) => t.fromId === fromId);
}
