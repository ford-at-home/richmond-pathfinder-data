import { useState, useEffect } from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import { placebo } from "@/content/analysis";
import { signedPct, signedTick, px } from "@/lib/chart";

const WIDTH = 760;
const HEIGHT = 300;
const MARGIN = { top: 34, right: 20, bottom: 62, left: 54 };
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom;

const gaps = placebo.map((w) => w.gap);
const y = scaleLinear()
  .domain([Math.min(...gaps) - 1.5, Math.max(...gaps) + 1.5])
  .range([PLOT_H, 0]);
const band = scaleBand<string>()
  .domain(placebo.map((w) => w.label))
  .range([0, PLOT_W])
  .padding(0.32);

const currentWindow = placebo.at(-1);
if (!currentWindow) {
  throw new Error("placebo.json has no windows");
}
const current = currentWindow;
const worstPrior = placebo
  .filter((w) => w.preGenerativeAI)
  .reduce((a, b) => (a.gap < b.gap ? a : b));

export default function PlaceboWindows() {
  const [active, setActive] = useState<string | null>(null);
  const [interactive, setInteractive] = useState(false);
  useEffect(() => setInteractive(true), []);

  const shown = placebo.find((w) => w.label === active) ?? current;
  const zero = px(y(0));

  return (
    <div className="placebo" data-interactive={interactive || undefined}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="placebo__svg"
        role="img"
        aria-label={
          `Gap in employment change between exposed occupations and all others, for ` +
          `six three-year windows from 2013 to 2025. The gap is ${current.gap} points in ` +
          `${current.label} and ${worstPrior.gap} points in ${worstPrior.label}, before ` +
          `generative AI was publicly available.`
        }
        onMouseLeave={() => setActive(null)}
      >
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {y.ticks(6).map((t) => (
            <g key={t} transform={`translate(0,${px(y(t))})`}>
              <line x2={PLOT_W} className="grid" />
              <text x={-10} dy="0.32em" className="axis-label" textAnchor="end">
                {t === 0 ? "0" : signedTick(t)}
              </text>
            </g>
          ))}
          <line y1={zero} y2={zero} x2={PLOT_W} className="lev-zero" />

          {placebo.map((w) => {
            const bx = band(w.label) ?? 0;
            const top = Math.min(zero, y(w.gap));
            const isActive = shown.label === w.label;
            return (
              <g key={w.label} transform={`translate(${px(bx)},0)`}>
                <rect
                  className="placebo__bar"
                  data-pre={w.preGenerativeAI || undefined}
                  data-active={isActive || undefined}
                  x={0}
                  y={px(top)}
                  width={px(band.bandwidth())}
                  height={px(Math.abs(y(w.gap) - zero))}
                  onMouseEnter={() => setActive(w.label)}
                  tabIndex={0}
                  onFocus={() => setActive(w.label)}
                  aria-label={`${w.label}: gap ${w.gap} points`}
                />
                <text
                  x={px(band.bandwidth() / 2)}
                  y={px(w.gap < 0 ? y(w.gap) + 15 : y(w.gap) - 7)}
                  className="placebo__value"
                  textAnchor="middle"
                >
                  {signedPct(w.gap)}
                </text>
                <text
                  x={px(band.bandwidth() / 2)}
                  y={PLOT_H + 18}
                  className="axis-label"
                  textAnchor="middle"
                >
                  {w.label}
                </text>
                {w.preGenerativeAI && (
                  <text
                    x={px(band.bandwidth() / 2)}
                    y={PLOT_H + 34}
                    className="gutter-label"
                    textAnchor="middle"
                  >
                    pre-LLM
                  </text>
                )}
              </g>
            );
          })}

          <text
            transform={`translate(${-MARGIN.left + 14},${PLOT_H / 2}) rotate(-90)`}
            className="axis-title"
            textAnchor="middle"
          >
            Gap, percentage points
          </text>
        </g>
      </svg>

      <dl className="placebo__detail" aria-live="polite">
        <div>
          <dt>Window</dt>
          <dd>{shown.label}</dd>
        </div>
        <div>
          <dt>Exposed occupations</dt>
          <dd>{signedPct(shown.exposedPct)}%</dd>
        </div>
        <div>
          <dt>All others</dt>
          <dd>{signedPct(shown.othersPct)}%</dd>
        </div>
        <div>
          <dt>Fell in both intervals</dt>
          <dd>
            {shown.fellBoth} of {shown.exposedCount}
          </dd>
        </div>
        <div>
          <dt>Rose in both intervals</dt>
          <dd>
            {shown.roseBoth} of {shown.exposedCount}
          </dd>
        </div>
      </dl>

      <p className="explorer__caveat">
        Occupations keep their <em>current</em> exposure score in every window, so this asks whether
        work that scores high today was already declining before a language model could have touched
        it. The {current.label} gap of {signedPct(current.gap)} points is the largest in the series,
        but a gap of {signedPct(worstPrior.gap)} appears in {worstPrior.label}, before generative AI
        was publicly available. The count of exposed occupations falling across both intervals is
        ordinary: {current.fellBoth} now against {placebo.find((w) => w.start === 2019)?.fellBoth}{" "}
        in 2019–2021.
      </p>
    </div>
  );
}
