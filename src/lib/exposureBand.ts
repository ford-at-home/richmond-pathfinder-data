/**
 * Exposure bands.
 *
 * Origin inclusion on the front door is the report cut (0.25) in four families.
 * These cut points are the generator's: 0.30 is High, 0.10 is already-safe.
 * Reusing them means the word on a job page matches the rule that built the route.
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

export const BAND_MEANING: Record<Band, string> = {
  "No signal":
    "This job is not in the data at all. That means nobody measured it — not that AI leaves the work alone.",
  Low: "People rarely use AI for this kind of work.",
  Medium: "People use AI for some of this work.",
  High: "People already use AI for a lot of this work.",
};

export const hasSignal = (value: number | null | undefined): boolean =>
  value != null && value !== 0;

export const EMPTY_ROUTES =
  "This map only lists a next job that pays 5–100% more and is meaningfully less exposed. No such neighbour is in the data. That usually means this job is already near the top of its ladder, or that the only safer, better-paid related work is a second career. It does not mean the job is at risk.";

export const DESTINATION_ONLY =
  "This job is a destination on the map, not one of the 39 starting jobs.";
