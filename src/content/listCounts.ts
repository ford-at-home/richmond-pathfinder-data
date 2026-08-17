import { occupations, EXPOSURE_THRESHOLD } from "@/content/occupations";
import { transitions } from "@/content/transitions";
import { ORIGIN_FAMILIES, workforceOccupations } from "@/content/workforce";

/**
 * The four public counts. Computed, not typed in, so the Evidence note cannot
 * drift from the files the map and reports actually read.
 */
export function listCounts() {
  return {
    measured: occupations.length,
    exposed: occupations.filter((o) => o.exposure >= EXPOSURE_THRESHOLD).length,
    mapOrigins: workforceOccupations.length,
    families: ORIGIN_FAMILIES.length,
    publishedPairs: transitions.length,
  };
}

export type CountStep = { value: string; label: string };

/** One ladder. Every public screen that mentions these totals should use this. */
export function countSteps(n = listCounts()): CountStep[] {
  return [
    { value: String(n.measured), label: "Jobs in the region" },
    { value: String(n.exposed), label: "Already use AI a lot" },
    { value: String(n.mapOrigins), label: "Start Find a job" },
    { value: String(n.publishedPairs), label: "Shrinking-job pairs" },
  ];
}
