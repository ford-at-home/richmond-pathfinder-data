import type { Claimed } from "@/content/claims";

/**
 * Exposure bands.
 *
 * Origin inclusion on the front door is the report cut (0.25) in four families.
 * These cut points are the generator's: 0.30 is High, 0.10 is already-safe.
 * Reusing them means the word on a job page matches the rule that built the route.
 *
 * The score itself never reaches a screen. A decimal reads as a countdown, and
 * the measurement is of use, not of time remaining. The band picks the sentence.
 */
export const EXPOSED_AT = 0.3;
export const SAFE_BELOW = 0.1;

export type Band = "No signal" | "Low" | "Medium" | "High";

/**
 * Exactly zero means the occupation is absent from the measurement, not that it
 * was measured at nothing.
 */
export function exposureBand(value: number | null | undefined): Band {
  if (value == null || value === 0) return "No signal";
  if (value >= EXPOSED_AT) return "High";
  if (value >= SAFE_BELOW) return "Medium";
  return "Low";
}

export const BAND_MEANING: Record<Band, Claimed> = {
  "No signal": {
    text: "This job is not in the data at all. That means nobody measured it — not that AI leaves the work alone.",
    claim: "aei.no-signal",
  },
  Low: {
    text: "People rarely use AI for this kind of work. That describes how the work is done now, not what happens to the job.",
    claim: "aei.exposure-band",
  },
  Medium: {
    text: "People use AI for some of this work. That describes how the work is done now, not what happens to the job.",
    claim: "aei.exposure-band",
  },
  // No superlative. 31 of the 39 starting jobs land in this band, so "used most"
  // would be printed on almost every card and would be true of at most one.
  High: {
    text: "People already use AI for a lot of the day-to-day work in this job. That describes how the work is done now, and it is not a prediction that the job goes away.",
    claim: "aei.exposure-band",
  },
};

export const hasSignal = (value: number | null | undefined): boolean =>
  value != null && value !== 0;

/** Empty state B. */
export const EMPTY_ROUTES: Claimed = {
  text: "None on this map. That is not a warning. This job is already near the top of its own ladder — this map only lists a next job that pays 5–100% more and uses AI meaningfully less, and no related job here clears that bar. The better-paid work related to it is mostly a different career, not a next step.",
  claim: "map.no-routes",
};

export const DESTINATION_ONLY: Claimed = {
  text: "This job is a destination on the map, not one of the 39 starting jobs.",
  claim: "map.destination-only",
};
