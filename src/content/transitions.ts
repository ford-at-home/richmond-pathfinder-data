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
