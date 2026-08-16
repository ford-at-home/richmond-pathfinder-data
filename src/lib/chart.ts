import { format } from "d3-format";

export const dollars = format("$,.0f");
export const commas = format(",.0f");
export const signedPct = format("+.2f");
export const signedJobs = format("+,.0f");

/**
 * Axis ticks that carry a sign.
 *
 * Routed through d3-format so ticks use the same typographic minus (U+2212) as the
 * values they sit beside; a hand-built `'-' + n` would emit a hyphen instead.
 */
export const signedTick = format("+d");

/**
 * Rounds a computed coordinate to two decimals.
 *
 * Positions computed through `Math.log` or `Math.sqrt` are not guaranteed to be
 * bit-identical across JavaScript engines, so Node and the browser can disagree in
 * the final digits and React reports a hydration mismatch. Two decimals is finer
 * than a pixel and identical everywhere.
 */
export const px = (v: number) => Math.round(v * 100) / 100;
