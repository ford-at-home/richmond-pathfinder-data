import { useState, useEffect } from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import { wagePremium } from "@/content/analysis";
import { dollars, commas, px } from "@/lib/chart";

const WIDTH = 760;
const HEIGHT = 260;
const MARGIN = { top: 28, right: 20, bottom: 56, left: 46 };
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom;

const y = scaleLinear()
  .domain([0, Math.max(...wagePremium.map((p) => p.premium)) + 8])
  .range([PLOT_H, 0]);
const band = scaleBand<string>()
  .domain(wagePremium.map((p) => String(p.cut)))
  .range([0, PLOT_W])
  .padding(0.34);

export default function WagePremium() {
  const [active, setActive] = useState<number | null>(null);
  const [interactive, setInteractive] = useState(false);
  useEffect(() => setInteractive(true), []);

  const shown =
    wagePremium.find((p) => p.cut === active) ?? wagePremium.find((p) => p.cut === 0.25)!;

  return (
    <div className="premium" data-interactive={interactive || undefined}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="premium__svg"
        role="img"
        aria-label={
          `Wage premium of exposed occupations over the least exposed, at eight exposure cut ` +
          `points from 0.10 to 0.60. The premium stays positive at every one, ranging from ` +
          `${Math.min(...wagePremium.map((p) => p.premium))} to ` +
          `${Math.max(...wagePremium.map((p) => p.premium))} percent.`
        }
        onMouseLeave={() => setActive(null)}
      >
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {y.ticks(5).map((t) => (
            <g key={t} transform={`translate(0,${px(y(t))})`}>
              <line x2={PLOT_W} className="grid" />
              <text x={-10} dy="0.32em" className="axis-label" textAnchor="end">
                {t}%
              </text>
            </g>
          ))}

          {wagePremium.map((p) => {
            const bx = band(String(p.cut)) ?? 0;
            return (
              <g key={p.cut} transform={`translate(${px(bx)},0)`}>
                <rect
                  className="premium__bar"
                  data-active={shown.cut === p.cut || undefined}
                  x={0}
                  y={px(y(p.premium))}
                  width={px(band.bandwidth())}
                  height={px(PLOT_H - y(p.premium))}
                  onMouseEnter={() => setActive(p.cut)}
                  tabIndex={0}
                  onFocus={() => setActive(p.cut)}
                  aria-label={`Cut point ${p.cut}: ${p.premium} percent premium`}
                />
                <text
                  x={px(band.bandwidth() / 2)}
                  y={px(y(p.premium) - 7)}
                  className="premium__value"
                  textAnchor="middle"
                >
                  {p.premium.toFixed(0)}%
                </text>
                <text
                  x={px(band.bandwidth() / 2)}
                  y={PLOT_H + 18}
                  className="axis-label"
                  textAnchor="middle"
                >
                  {p.cut.toFixed(2)}
                </text>
              </g>
            );
          })}

          <text x={PLOT_W / 2} y={PLOT_H + 42} className="axis-title" textAnchor="middle">
            Exposure cut point defining “exposed”
          </text>
        </g>
      </svg>

      <p className="premium__readout">
        At a cut point of <strong>{shown.cut.toFixed(2)}</strong>, the {shown.occs} exposed
        occupations average <strong>{dollars(shown.meanWage)}</strong> —{" "}
        <strong>{shown.premium.toFixed(0)}%</strong> above the {dollars(55_419)} averaged by the
        least exposed occupations.
      </p>

      <p className="explorer__caveat">
        The 0.25 cut point used throughout the analysis is not designated as meaningful by the
        source data or by prior research, which makes any result resting on it worth testing against
        the alternatives. This one holds at all eight: exposed work pays more than the least exposed
        work at every threshold, against a reference group of {commas(316)} occupations scoring 0.05
        or below. It is the most transportable finding in the analysis — and note that it runs
        opposite to the intuition that AI-exposed work is low-wage work.
      </p>
    </div>
  );
}
