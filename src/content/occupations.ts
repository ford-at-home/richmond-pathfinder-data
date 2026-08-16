import generated from "./data/occupations.json";

export interface Occupation {
  code: string;
  title: string;
  group: string;
  /** Richmond MSA employment, May 2025. */
  emp: number;
  /** Location quotient against the national employment share. */
  lq: number;
  /** Mean annual wage. Null where BLS suppressed the estimate. */
  wage: number | null;
  /** Anthropic observed task exposure, 0-1. Not a measure of displacement risk. */
  exposure: number;
  emp23: number | null;
  pct: number | null;
  prse23: number | null;
  prse25: number | null;
  /** Employment change in units of its own combined standard error. */
  z: number | null;
}

export const occupations: Occupation[] = generated as Occupation[];

export const groups: string[] = [...new Set(occupations.map((o) => o.group))].sort();

/**
 * How an occupation's employment change should be read.
 *
 * OEWS estimates carry a published relative standard error, and most
 * occupation-level movement between two vintages does not clear it. Rendering
 * every change as a gain or a loss would invent precision the survey does not
 * have, so anything inside sampling error is reported as indeterminate rather
 * than being coloured as a direction.
 */
export type Movement = "grew" | "fell" | "indeterminate" | "unknown";

export function movement(o: Occupation): Movement {
  if (o.pct == null) return "unknown";
  if (o.z == null || Math.abs(o.z) < 1.96) return "indeterminate";
  return o.z > 0 ? "grew" : "fell";
}

export const MOVEMENT_LABEL: Record<Movement, string> = {
  grew: "Grew",
  fell: "Fell",
  indeterminate: "Within sampling error",
  unknown: "No comparable 2023 estimate",
};

/**
 * How each movement is drawn.
 *
 * These four states are two opposed directions and two kinds of not-knowing.
 * Shading them along one scale would assert that growth and decline are the ends
 * of a single quantity with indeterminacy in the middle, which is not what the
 * categories mean. So direction is carried by fill against outline, and the
 * absence of an established direction by a broken outline, rather than by hue.
 *
 * Values resolve from src/styles/tokens.css. Nothing here is a colour decision.
 */
export const MOVEMENT_MARK: Record<Movement, { fill: string; edge: string; dash?: string }> = {
  grew: { fill: "var(--dir-grew-fill)", edge: "var(--dir-grew-edge)" },
  fell: { fill: "var(--dir-fell-fill)", edge: "var(--dir-fell-edge)" },
  indeterminate: { fill: "var(--dir-indeterminate-fill)", edge: "var(--dir-indeterminate-edge)" },
  unknown: { fill: "var(--dir-unknown-fill)", edge: "var(--dir-unknown-edge)", dash: "2 2" },
};

/** The exposure cut point used throughout the analysis. Not a designated threshold. */
export const EXPOSURE_THRESHOLD = 0.25;
