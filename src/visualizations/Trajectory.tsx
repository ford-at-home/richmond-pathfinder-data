import { useState, useEffect, useMemo } from "react";
import { scaleLinear } from "d3-scale";
import { trajectories, NAMED_DECLINES, type TrajectoryPoint } from "@/content/analysis";
import { occupations } from "@/content/occupations";
import { commas, px } from "@/lib/chart";

const WIDTH = 760;
const HEIGHT = 330;
const MARGIN = { top: 30, right: 22, bottom: 52, left: 62 };
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom;

const titleFor = new Map(occupations.map((o) => [o.code, o.title]));
const available = Object.keys(trajectories)
  .filter((c) => titleFor.has(c))
  .sort((a, b) => (titleFor.get(a) ?? "").localeCompare(titleFor.get(b) ?? ""));

// A 95% interval from the relative standard error OEWS publishes with each estimate.
const bounds = (e: number, p: number | null) =>
  p == null ? null : { lo: e * (1 - (1.96 * p) / 100), hi: e * (1 + (1.96 * p) / 100) };

export default function Trajectory() {
  const [code, setCode] = useState(NAMED_DECLINES[0]);
  const [interactive, setInteractive] = useState(false);
  useEffect(() => setInteractive(true), []);

  const series: TrajectoryPoint[] = useMemo(() => trajectories[code] ?? [], [code]);

  const { x, y, band, line, peak, latest } = useMemo(() => {
    const withBands = series.map((d) => ({ ...d, b: bounds(d.e, d.p) }));
    const highs = withBands.map((d) => d.b?.hi ?? d.e);
    const lows = withBands.map((d) => d.b?.lo ?? d.e);

    const xs = scaleLinear()
      .domain([series[0]?.v ?? 2010, series.at(-1)?.v ?? 2025])
      .range([0, PLOT_W]);
    const ys = scaleLinear()
      .domain([Math.min(...lows) * 0.92, Math.max(...highs) * 1.04])
      .range([PLOT_H, 0]);

    const top = withBands.map((d) => `${px(xs(d.v))},${px(ys(d.b?.hi ?? d.e))}`);
    const bottom = [...withBands].reverse().map((d) => `${px(xs(d.v))},${px(ys(d.b?.lo ?? d.e))}`);

    return {
      x: xs,
      y: ys,
      band: `M${top.join("L")}L${bottom.join("L")}Z`,
      line: withBands.map((d) => `${px(xs(d.v))},${px(ys(d.e))}`).join(" "),
      peak: series.reduce((a, b) => (a.e > b.e ? a : b)),
      latest: series.at(-1)!,
    };
  }, [series]);

  const belowEverySince = series.filter((d) => d.v < 2023 && d.e <= latest.e).length === 0;

  return (
    <div className="trajectory" data-interactive={interactive || undefined}>
      <div className="trajectory__controls">
        {NAMED_DECLINES.filter((c) => trajectories[c]).map((c) => (
          <button
            key={c}
            type="button"
            className="chip"
            data-off={code !== c || undefined}
            aria-pressed={code === c}
            onClick={() => setCode(c)}
          >
            {titleFor.get(c)}
          </button>
        ))}
        <select
          className="trajectory__select"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          aria-label="Choose any exposed or declining occupation"
        >
          {available.map((c) => (
            <option key={c} value={c}>
              {titleFor.get(c)}
            </option>
          ))}
        </select>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="trajectory__svg"
        role="img"
        aria-label={
          `${titleFor.get(code) ?? code} employment from ${series[0]?.v} to ${latest.v}, with a ` +
          `95 percent interval from the survey's published standard error. Peak ` +
          `${commas(peak.e)} in ${peak.v}, latest ${commas(latest.e)}.`
        }
      >
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {y.ticks(5).map((t) => (
            <g key={t} transform={`translate(0,${px(y(t))})`}>
              <line x2={PLOT_W} className="grid" />
              <text x={-10} dy="0.32em" className="axis-label" textAnchor="end">
                {commas(t)}
              </text>
            </g>
          ))}

          {series
            .filter((d) => d.v % 3 === 1 || d.v === 2025)
            .map((d) => (
              <text
                key={d.v}
                x={px(x(d.v))}
                y={PLOT_H + 18}
                className="axis-label"
                textAnchor="middle"
              >
                {d.v}
              </text>
            ))}

          {/* The metro lost Caroline County and gained King and Queen between the
              May 2023 and May 2024 releases, so levels either side are not the
              same geography. */}
          <g transform={`translate(${px(x(2023.5))},0)`}>
            <line y2={PLOT_H} className="threshold" />
            <text y={-8} className="threshold-label" textAnchor="middle">
              boundary change
            </text>
          </g>

          <path d={band} className="traj-band" />
          <polyline points={line} className="traj-line" />

          {series.map((d) => (
            <circle key={d.v} cx={px(x(d.v))} cy={px(y(d.e))} r={2.6} className="traj-dot">
              <desc>{`${d.v}: ${commas(d.e)}`}</desc>
            </circle>
          ))}

          <text
            transform={`translate(${-MARGIN.left + 12},${PLOT_H / 2}) rotate(-90)`}
            className="axis-title"
            textAnchor="middle"
          >
            Employment
          </text>
        </g>
      </svg>

      <p className="trajectory__readout">
        Peaked at <strong>{commas(peak.e)}</strong> in {peak.v}, now{" "}
        <strong>{commas(latest.e)}</strong>
        {belowEverySince
          ? ` — lower than in any year since ${series[0]?.v}.`
          : ` — back to its ${series.filter((d) => d.v < 2023 && d.e <= latest.e).at(-1)?.v} level.`}
      </p>

      <p className="explorer__caveat">
        The shaded band is a 95% interval built from the relative standard error BLS publishes with
        every estimate, drawn by default because a movement narrower than its own band is not a
        finding. Two cautions on reading the line across years: consecutive releases share four of
        their six survey panels, so one event propagates through three vintages and monotonic
        movement is not three independent observations; and the metropolitan boundary changed
        between the 2023 and 2024 releases, so levels either side describe slightly different
        geography.
      </p>
    </div>
  );
}
