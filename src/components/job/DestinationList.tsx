import { Link } from "@tanstack/react-router";

import { programById, sortDestinations, type Destination } from "@/content/workforce";
import { BAND_MEANING, exposureBand, hasSignal } from "@/lib/exposureBand";

function usd(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function percent(exposure: number): string {
  return `${Math.round(exposure * 100)}%`;
}

export function DestinationList({ destinations }: { destinations: Destination[] }) {
  const rows = sortDestinations(destinations);

  return (
    <section aria-labelledby="next-jobs">
      <h2 id="next-jobs" className="font-display text-lg font-semibold text-foreground">
        Next jobs that pay more and use AI less
      </h2>
      <ul className="mt-6 grid grid-cols-1">
        {rows.map((d) => {
          const band = exposureBand(d.exposure);
          const course = programById(d.leadProgramId);
          const skills = d.build.map((s) => s.name);
          return (
            <li key={d.soc} className="border-t border-border py-5">
              <Link
                to="/job/$soc"
                params={{ soc: d.soc }}
                className="font-medium text-foreground no-underline hover:underline"
              >
                {d.title}
              </Link>
              <p className="mt-2 text-sm text-muted-foreground">
                {usd(d.wage)}
                {d.wageGain > 0 ? ` · +${usd(d.wageGain)}` : ""}
                {hasSignal(d.exposure) ? ` · ${percent(d.exposure)} AI use` : ""}
                {d.timeBand ? ` · ${d.timeBand}` : ""}
              </p>
              {hasSignal(d.exposure) ? (
                <p className="mt-1 annotation">{BAND_MEANING[band]}</p>
              ) : null}
              {skills.length > 0 ? (
                <p className="mt-2 text-sm text-foreground">To build: {skills.join(", ")}</p>
              ) : null}
              {course ? (
                <p className="mt-2 text-sm text-foreground">
                  {course.name} · {course.provider}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
