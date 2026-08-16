import { scaleLinear } from "d3-scale";

import type { QcewRow } from "@/content/region";
import { QCEW_YEARS } from "@/content/region";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function points(row: QcewRow): { year: number; emp: number }[] {
  return row.series.filter(
    (p): p is { year: (typeof QCEW_YEARS)[number]; emp: number } => p.emp != null,
  );
}

function Sparkline({ row, width, height }: { row: QcewRow; width: number; height: number }) {
  const series = points(row);
  if (series.length < 2) {
    return <p className="text-sm text-muted-foreground">Not published for enough years to draw.</p>;
  }
  const pad = { l: 4, r: 4, t: 8, b: 8 };
  const maxEmp = Math.max(...series.map((p) => p.emp));
  const first = series[0];
  const last = series[series.length - 1];
  if (!first || !last) {
    return <p className="text-sm text-muted-foreground">Not published for enough years to draw.</p>;
  }
  const x = scaleLinear()
    .domain([2019, 2025])
    .range([pad.l, width - pad.r]);
  const y = scaleLinear()
    .domain([0, maxEmp])
    .range([height - pad.b, pad.t]);
  const d = series
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.year).toFixed(1)},${y(p.emp).toFixed(1)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={`${row.industry}: ${fmt(first.emp)} in ${first.year} to ${fmt(last.emp)} in ${last.year}`}
    >
      <line
        x1={pad.l}
        x2={width - pad.r}
        y1={y(0)}
        y2={y(0)}
        stroke="var(--color-rule)"
        strokeWidth="1"
      />
      <path d={d} fill="none" stroke="var(--ink-900)" strokeWidth="1.75" />
      <circle cx={x(first.year)} cy={y(first.emp)} r="2.5" fill="var(--ink-900)" />
      <circle cx={x(last.year)} cy={y(last.emp)} r="2.5" fill="var(--ink-900)" />
    </svg>
  );
}

export function QcewSeries({ rows }: { rows: QcewRow[] }) {
  const total = rows.find((r) => r.naics === "10");
  const industries = rows.filter((r) => r.naics !== "10");

  return (
    <div className="p-4 md:p-5">
      {total ? (
        <div className="border-b border-border pb-6">
          <p className="label-sm">{total.industry}</p>
          <p className="mt-1 font-display text-xl text-foreground">
            {total.emp2025 == null ? "Not published" : fmt(total.emp2025)}
            <span className="ml-2 text-base font-normal text-muted-foreground">
              jobs in 2025
              {total.emp2019 == null ? "" : `, from ${fmt(total.emp2019)} in 2019`}
            </span>
          </p>
          <div className="mt-4 max-w-3xl">
            <Sparkline row={total} width={640} height={160} />
          </div>
          <p className="mt-2 annotation">
            Scale starts at zero. The series is annual-average QCEW employment on the current
            17-county set, not OEWS occupational employment.
          </p>
        </div>
      ) : null}

      <ul className="mt-6 grid gap-6 sm:grid-cols-2">
        {industries.map((row) => {
          const series = points(row);
          const first = series[0];
          const last = series[series.length - 1];
          return (
            <li key={`${row.naics}-${row.industry}`}>
              <p className="text-sm font-medium leading-snug text-foreground">{row.industry}</p>
              <p className="mt-1 annotation">
                NAICS {row.naics}
                {first && last
                  ? ` · ${fmt(first.emp)} (${first.year}) → ${fmt(last.emp)} (${last.year})`
                  : ""}
                {row.suppressedCells
                  ? ` · ${row.suppressedCells} suppressed county-year cells`
                  : ""}
              </p>
              <div className="mt-2">
                <Sparkline row={row} width={320} height={72} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
