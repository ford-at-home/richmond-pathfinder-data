import { useMemo, useState, useEffect } from "react";
import { scaleLinear } from "d3-scale";
import { occupations as ALL, EXPOSURE_THRESHOLD } from "@/content/occupations";
import { commas, signedJobs, signedPct, signedTick, px } from "@/lib/chart";

// Occupations carrying employment in both vintages. The analysis works from this
// population, 482 of the 523, wherever it compares 2023 with 2025.
const comparable = ALL.filter(
  (o): o is typeof o & { emp23: number } => o.emp23 != null && o.emp != null,
);
const exposed = comparable
  .filter((o) => o.exposure >= EXPOSURE_THRESHOLD)
  .sort((a, b) => a.emp - a.emp23 - (b.emp - b.emp23));
const others = comparable.filter((o) => o.exposure < EXPOSURE_THRESHOLD);

function groupChange(set: { emp23: number; emp: number }[]): number {
  const from = set.reduce((s, o) => s + o.emp23, 0);
  const to = set.reduce((s, o) => s + o.emp, 0);
  return from === 0 ? 0 : ((to - from) / from) * 100;
}

const OTHERS_CHANGE = groupChange(others);

const WIDTH = 760;
const TRACK_Y = 54;
const MARGIN = { left: 20, right: 20 };
const TRACK_W = WIDTH - MARGIN.left - MARGIN.right;
const x = scaleLinear().domain([-6, 4]).range([0, TRACK_W]).clamp(true);

export default function LeverageJackknife() {
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [interactive, setInteractive] = useState(false);
  useEffect(() => setInteractive(true), []);

  const kept = useMemo(() => exposed.filter((o) => !removed.has(o.code)), [removed]);
  const change = groupChange(kept);
  const jobsRemoved = exposed
    .filter((o) => removed.has(o.code))
    .reduce((s, o) => s + (o.emp - o.emp23), 0);

  const positive = change > 0;
  const zero = px(x(0));

  return (
    <div className="leverage" data-interactive={interactive || undefined}>
      <svg
        viewBox={`0 0 ${WIDTH} 96`}
        className="leverage__svg"
        role="img"
        aria-label={
          `Employment change for exposed occupations, currently ${change.toFixed(2)} percent, ` +
          `against ${OTHERS_CHANGE.toFixed(2)} percent for every other occupation.`
        }
      >
        <g transform={`translate(${MARGIN.left},0)`}>
          {x.ticks(11).map((t) => (
            <g key={t} transform={`translate(${px(x(t))},0)`}>
              <line y1={TRACK_Y - 16} y2={TRACK_Y + 16} className="lev-grid" />
              <text y={TRACK_Y + 32} className="lev-tick" textAnchor="middle">
                {t === 0 ? "0" : signedTick(t)}
              </text>
            </g>
          ))}

          <line x1={zero} x2={zero} y1={TRACK_Y - 26} y2={TRACK_Y + 20} className="lev-zero" />

          {/* Everything not exposed, as a fixed reference. */}
          <g transform={`translate(${px(x(OTHERS_CHANGE))},0)`}>
            <line y1={TRACK_Y - 22} y2={TRACK_Y + 8} className="lev-reference" />
            <text y={TRACK_Y - 28} className="lev-reference-label" textAnchor="middle">
              all other occupations {signedPct(OTHERS_CHANGE)}%
            </text>
          </g>

          <rect
            className="lev-bar"
            data-positive={positive || undefined}
            x={px(Math.min(zero, x(change)))}
            y={TRACK_Y - 9}
            width={px(Math.abs(x(change) - zero))}
            height={18}
          />
          <circle
            className="lev-head"
            data-positive={positive || undefined}
            cx={px(x(change))}
            cy={TRACK_Y}
            r={7}
          />
        </g>
      </svg>

      <p className="leverage__readout" data-positive={positive || undefined}>
        <strong>{signedPct(change)}%</strong> across {kept.length} exposed occupations
        {removed.size > 0 && (
          <span className="leverage__removed">
            {" "}
            · {removed.size} removed, {signedJobs(jobsRemoved)} jobs set aside
          </span>
        )}
      </p>

      <p className="leverage__verdict">
        {positive
          ? `With those occupations set aside, employment in exposed work grew — faster or slower than the rest of the metro, but not shrinking. The aggregate decline was theirs, not a property of exposed work.`
          : removed.size === 0
            ? `This is the headline figure. Start removing the largest losses below and watch what happens to it.`
            : `Still negative, but the gap against the rest of the metro is closing.`}
      </p>

      <ol className="leverage__list">
        {exposed.slice(0, 14).map((o) => {
          const delta = o.emp - o.emp23;
          const isRemoved = removed.has(o.code);
          return (
            <li key={o.code}>
              <button
                type="button"
                className="lev-row"
                data-removed={isRemoved || undefined}
                aria-pressed={isRemoved}
                onClick={() =>
                  setRemoved((prev) => {
                    const next = new Set(prev);
                    if (next.has(o.code)) next.delete(o.code);
                    else next.add(o.code);
                    return next;
                  })
                }
              >
                <span className="lev-row__title">{o.title}</span>
                <span className="lev-row__jobs">{signedJobs(delta)}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="leverage__actions">
        <button
          type="button"
          className="chip"
          onClick={() => setRemoved(new Set(exposed.slice(0, 3).map((o) => o.code)))}
        >
          Remove the three named declines
        </button>
        <button type="button" className="chip chip--clear" onClick={() => setRemoved(new Set())}>
          Reset
        </button>
      </div>

      <p className="explorer__caveat">
        Exposed means an observed-exposure score of {EXPOSURE_THRESHOLD} or above, which is{" "}
        {exposed.length} occupations holding {commas(exposed.reduce((s, o) => s + o.emp23, 0))} jobs
        in 2023. Removing occupations from an aggregate is not a correction — it is a test of
        whether the aggregate describes a general pattern or a few large cases. Here it is the
        latter, which is why the analysis does not claim that exposed work declined as a class.
      </p>
    </div>
  );
}
