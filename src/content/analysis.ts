import placeboJson from "./data/placebo.json";
import premiumJson from "./data/wage-premium.json";
import constraintsJson from "./data/constraints.json";
import trajectoriesJson from "./data/trajectories.json";

/** One three-vintage window of the historical placebo screen. */
export interface PlaceboWindow {
  label: string;
  start: number;
  scored: number;
  exposedCount: number;
  fellBoth: number;
  roseBoth: number;
  /** Employment-weighted percentage change for exposed occupations. */
  exposedPct: number;
  othersPct: number;
  /** Exposed minus others, in percentage points. */
  gap: number;
  preGenerativeAI: boolean;
}

/** Employment-weighted wage of exposed occupations against the least exposed. */
export interface PremiumPoint {
  cut: number;
  occs: number;
  meanWage: number;
  /** Percent above the mean wage of occupations scoring 0.05 or below. */
  premium: number;
}

/**
 * For one declining occupation, how many of its O*NET-related occupations fail
 * each screening condition.
 *
 * The counts overlap — a neighbour can be both absent from the metro and
 * shrinking — so they are reasons rather than a partition of `neighbours` and must
 * never be summed or stacked.
 */
export interface Constraint {
  code: string;
  title: string;
  lost: number;
  wage: number;
  neighbours: number;
  absent: number;
  exposed: number;
  shrinking: number;
  paysLess: number;
  viable: number;
}

/** One vintage of an occupation's employment, with its relative standard error. */
export interface TrajectoryPoint {
  v: number;
  e: number;
  p: number | null;
}

export const placebo: PlaceboWindow[] = placeboJson as PlaceboWindow[];
export const wagePremium: PremiumPoint[] = premiumJson as PremiumPoint[];
export const constraints: Constraint[] = constraintsJson as Constraint[];
export const trajectories: Record<string, TrajectoryPoint[]> = trajectoriesJson as Record<
  string,
  TrajectoryPoint[]
>;

/** The three occupations the analysis names as its defensible declines. */
export const NAMED_DECLINES: readonly [string, string, string] = ["43-4051", "43-3031", "43-4171"];
