import { useMemo, useState, useEffect } from "react";
import { scaleLinear, scaleSqrt, scaleLog } from "d3-scale";
import { format } from "d3-format";
import {
  occupations as ALL,
  groups as ALL_GROUPS,
  movement,
  MOVEMENT_MARK,
  MOVEMENT_LABEL,
  EXPOSURE_THRESHOLD,
  type Movement,
  type Occupation,
} from "@/content/occupations";

const dollars = format("$,.0f");
const commas = format(",.0f");
const pct = format("+.1%");

const WIDTH = 900;
const HEIGHT = 560;
const MARGIN = { top: 28, right: 28, bottom: 60, left: 96 };

const PLOT_W = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom;

const withWage = ALL.filter((o): o is Occupation & { wage: number } => o.wage != null);
const suppressedWageCount = ALL.length - withWage.length;
const zeroCount = withWage.filter((o) => o.exposure === 0).length;

// Nearly half of these occupations score exactly zero, meaning their tasks were
// absent from the sampled interactions rather than sitting just below the lowest
// positive score. Stacking them on the axis at 0 hides them behind one another and
// implies a continuity with 0.01 that the measure does not have, so they get a
// separate band.
const GUTTER_W = 78;
const GUTTER_GAP = 22;

const x = scaleLinear()
  .domain([0, 0.8])
  .range([GUTTER_W + GUTTER_GAP, PLOT_W]);

/**
 * A stable horizontal position inside the zero band.
 *
 * Spreading these points needs to be reproducible: random jitter would differ
 * between the server and client renders and break hydration. Integer arithmetic
 * over the SOC code gives the same answer in every engine.
 */
function gutterX(code: string): number {
  let h = 0;
  for (let i = 0; i < code.length; i += 1) h = (h * 31 + code.charCodeAt(i)) % 997;
  return 14 + (h / 997) * (GUTTER_W - 28);
}

const positionX = (o: Occupation) => (o.exposure === 0 ? gutterX(o.code) : x(o.exposure));
const y = scaleLog().domain([25_000, 260_000]).range([PLOT_H, 0]).clamp(true);
const r = scaleSqrt()
  .domain([0, Math.max(...withWage.map((o) => o.emp))])
  .range([2, 34]);

/**
 * Rounds a computed coordinate to two decimals.
 *
 * The wage axis is logarithmic, so positions run through `Math.log`, whose exact
 * result is not guaranteed to be identical across JavaScript engines. Node and
 * Chrome disagree in the final digits, which React reports as a hydration
 * mismatch. Two decimals is far finer than a pixel and identical everywhere.
 */
const px = (v: number) => Math.round(v * 100) / 100;

const MOVEMENTS: Movement[] = ["fell", "grew", "indeterminate", "unknown"];

// Chosen rather than generated: a log scale's automatic ticks land on values
// that read badly as salaries.
const WAGE_TICKS = [30_000, 50_000, 75_000, 100_000, 150_000, 250_000];

export default function OccupationExplorer() {
  const [activeGroups, setActiveGroups] = useState<Set<string>>(new Set());
  const [hidden, setHidden] = useState<Set<Movement>>(new Set());
  const [significantOnly, setSignificantOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [hovered, setHovered] = useState<Occupation | null>(null);
  const [selected, setSelected] = useState<Occupation | null>(null);

  // The chart is server-rendered, so it looks finished before React takes over and
  // the controls do nothing until it does. Marking the boundary makes that state
  // observable — Astro's own hydration attribute exists only in development.
  const [interactive, setInteractive] = useState(false);
  useEffect(() => setInteractive(true), []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return withWage.filter((o) => {
      if (activeGroups.size && !activeGroups.has(o.group)) return false;
      if (hidden.has(movement(o))) return false;
      if (significantOnly && movement(o) !== "grew" && movement(o) !== "fell") return false;
      if (q && !o.title.toLowerCase().includes(q) && !o.code.includes(q)) return false;
      return true;
    });
  }, [activeGroups, hidden, significantOnly, query]);

  // Largest circles first so small occupations stay clickable on top of them.
  const drawOrder = useMemo(() => [...visible].sort((a, b) => b.emp - a.emp), [visible]);

  const jobsShown = visible.reduce((sum, o) => sum + o.emp, 0);
  const detail = hovered ?? selected;

  function toggle<T>(set: Set<T>, value: T): Set<T> {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  }

  return (
    <div className="explorer" data-interactive={interactive || undefined}>
      <div className="explorer__controls">
        <input
          className="explorer__search"
          type="search"
          placeholder="Search occupation or SOC code"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search occupations"
        />

        <div className="explorer__legend" role="group" aria-label="Filter by employment change">
          {MOVEMENTS.map((m) => (
            <button
              key={m}
              type="button"
              className="chip"
              data-off={hidden.has(m) || undefined}
              onClick={() => setHidden(toggle(hidden, m))}
              aria-pressed={!hidden.has(m)}
            >
              <span
                className="chip__dot"
                style={{
                  background: MOVEMENT_MARK[m].fill,
                  borderColor: MOVEMENT_MARK[m].edge,
                  borderStyle: MOVEMENT_MARK[m].dash ? "dashed" : "solid",
                }}
              />
              {MOVEMENT_LABEL[m]}
            </button>
          ))}
        </div>

        <label className="explorer__toggle">
          <input
            type="checkbox"
            checked={significantOnly}
            onChange={(e) => setSignificantOnly(e.target.checked)}
          />
          Only changes larger than their sampling error
        </label>
      </div>

      <details className="explorer__groups">
        <summary>
          Occupational group
          {activeGroups.size > 0 && <span className="badge">{activeGroups.size}</span>}
        </summary>
        <div className="explorer__grouplist">
          {ALL_GROUPS.map((g) => (
            <button
              key={g}
              type="button"
              className="chip"
              data-off={activeGroups.size > 0 && !activeGroups.has(g) ? true : undefined}
              onClick={() => setActiveGroups(toggle(activeGroups, g))}
              aria-pressed={activeGroups.has(g)}
            >
              {g}
            </button>
          ))}
          {activeGroups.size > 0 && (
            <button
              type="button"
              className="chip chip--clear"
              onClick={() => setActiveGroups(new Set())}
            >
              Clear
            </button>
          )}
        </div>
      </details>

      <p className="explorer__count">
        Showing <strong>{visible.length}</strong> of {withWage.length} occupations ·{" "}
        <strong>{commas(jobsShown)}</strong> jobs
      </p>

      <div className="explorer__stage">
        {/* React 19 treats <title> as document metadata and hoists it, so the chart
            and its points describe themselves with aria-label instead. */}
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="explorer__svg"
          role="img"
          aria-label={
            `Mean annual wage plotted against AI task exposure for ${visible.length} ` +
            `Richmond occupations, sized by employment and marked by whether employment ` +
            `changed by more than its own sampling error.`
          }
          onMouseLeave={() => setHovered(null)}
        >
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            <rect width={GUTTER_W} height={PLOT_H} className="gutter" />
            <text x={GUTTER_W / 2} y={PLOT_H + 22} className="axis-label" textAnchor="middle">
              0
            </text>
            <text x={GUTTER_W / 2} y={PLOT_H + 38} className="gutter-label" textAnchor="middle">
              none observed
            </text>

            {WAGE_TICKS.map((t) => (
              <g key={t} transform={`translate(0,${px(y(t))})`}>
                <line x2={PLOT_W} className="grid" />
                <text x={-12} dy="0.32em" className="axis-label" textAnchor="end">
                  {dollars(t)}
                </text>
              </g>
            ))}

            {/* Zero is labelled under its own band, so the continuous axis starts above it. */}
            {x
              .ticks(9)
              .filter((t) => t > 0)
              .map((t) => (
                <g key={t} transform={`translate(${px(x(t))},${PLOT_H})`}>
                  <line y2={6} className="axis-tick" />
                  <text y={22} className="axis-label" textAnchor="middle">
                    {t.toFixed(1)}
                  </text>
                </g>
              ))}

            <g transform={`translate(${px(x(EXPOSURE_THRESHOLD))},0)`}>
              <line y2={PLOT_H} className="threshold" />
              <text y={-8} className="threshold-label" textAnchor="middle">
                0.25 cut point
              </text>
            </g>

            {drawOrder.map((o) => {
              const m = movement(o);
              const isDetail = detail?.code === o.code;
              return (
                <circle
                  key={o.code}
                  cx={px(positionX(o))}
                  cy={px(y(o.wage))}
                  r={px(r(o.emp))}
                  style={{
                    fill: MOVEMENT_MARK[m].fill,
                    stroke: MOVEMENT_MARK[m].edge,
                    strokeDasharray: MOVEMENT_MARK[m].dash,
                  }}
                  className="dot"
                  data-active={isDetail || undefined}
                  onMouseEnter={() => setHovered(o)}
                  onClick={() => setSelected(o)}
                  tabIndex={0}
                  onFocus={() => setHovered(o)}
                  onKeyDown={(e) => e.key === "Enter" && setSelected(o)}
                  aria-label={`${o.title}. ${commas(o.emp)} jobs, exposure ${o.exposure.toFixed(2)}.`}
                />
              );
            })}

            <text
              transform={`translate(${-MARGIN.left + 12},${PLOT_H / 2}) rotate(-90)`}
              className="axis-title"
              textAnchor="middle"
            >
              Mean annual wage
            </text>
            <text x={PLOT_W / 2} y={PLOT_H + 54} className="axis-title" textAnchor="middle">
              Observed task exposure — share of tasks appearing in model interactions
            </text>
          </g>
        </svg>

        <aside className="explorer__detail" aria-live="polite">
          {detail ? (
            <>
              <h3>{detail.title}</h3>
              <p className="detail__meta">
                {detail.code} · {detail.group}
              </p>

              <dl>
                <div>
                  <dt>Employment, May 2025</dt>
                  <dd>{commas(detail.emp)}</dd>
                </div>
                <div>
                  <dt>Mean annual wage</dt>
                  <dd>{detail.wage == null ? "Not published" : dollars(detail.wage)}</dd>
                </div>
                <div>
                  <dt>Observed exposure</dt>
                  <dd>{detail.exposure.toFixed(3)}</dd>
                </div>
                <div>
                  <dt>Location quotient</dt>
                  <dd>{detail.lq.toFixed(2)}</dd>
                </div>
                <div>
                  <dt>Change since 2023</dt>
                  <dd>
                    {detail.pct == null ? (
                      "No comparable estimate"
                    ) : (
                      <>
                        {pct(detail.pct / 100)}
                        {detail.emp23 != null && (
                          <span className="detail__from"> from {commas(detail.emp23)}</span>
                        )}
                      </>
                    )}
                  </dd>
                </div>
              </dl>

              <p className="detail__verdict" data-movement={movement(detail)}>
                {movement(detail) === "indeterminate"
                  ? `This change is smaller than the survey's own sampling error, so its direction is not established.`
                  : movement(detail) === "unknown"
                    ? "This occupation has no comparable 2023 estimate."
                    : `This change is ${Math.abs(detail.z ?? 0).toFixed(1)} times its combined standard error.`}
              </p>

              {detail.exposure === 0 && (
                <p className="detail__note">
                  A zero score means this occupation's tasks did not appear in the sampled
                  interactions. That is absence of evidence, not evidence of no exposure.
                </p>
              )}
            </>
          ) : (
            <div className="detail__empty">
              <p>Hover or select an occupation.</p>
              <p className="detail__hint">
                Circle area is employment. A filled circle fell, a hollow one grew, and a broken
                outline means there is no comparable 2023 estimate. Whether the 2023–2025 change
                exceeds the sampling error published with it decides which of those a circle gets —
                and most changes do not.
              </p>
            </div>
          )}
        </aside>
      </div>

      <p className="explorer__caveat">
        Exposure measures where an occupation's tasks appear in Anthropic model interactions. It is
        not a measure of automation risk, job loss, or capability, and the analysis finds it does{" "}
        <strong>not</strong> predict which occupations decline. The {zeroCount} occupations in the
        shaded band scored exactly zero, meaning their tasks did not appear in the sampled
        interactions at all — absence of evidence rather than evidence of safety, which is why they
        sit apart from the scale rather than at the bottom of it. Wages are suppressed by BLS for{" "}
        {suppressedWageCount} occupations, which are omitted here because this chart plots wage on
        an axis.
      </p>
    </div>
  );
}
