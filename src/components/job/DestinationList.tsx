import { Link } from "@tanstack/react-router";

import { bridgeFor, EVIDENCE_LABEL, type Bridge } from "@/content/bridge";
import { sortDestinations, type Destination } from "@/content/workforce";
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

/** Says how much is inside, so the row can be skipped without being opened. */
function summary(bridge: Bridge, skillCount: number): string {
  const skills =
    skillCount === 0
      ? "No skill gap measured"
      : `${skillCount} skill${skillCount === 1 ? "" : "s"} to build`;
  return `${skills} · ${bridge.course ? "a course names this job" : "no local course"}`;
}

function WhatItTakes({ destination }: { destination: Destination }) {
  const bridge = bridgeFor(destination);
  const skillCount = destination.build.length;

  return (
    <details className="mt-3">
      <summary className="cursor-pointer text-sm font-medium text-foreground">
        What it takes
        <span className="mt-1 block font-normal annotation">{summary(bridge, skillCount)}</span>
      </summary>

      <div className="mt-4 border-l-2 border-border pl-4">
        <p className="text-sm leading-relaxed text-foreground">{bridge.gate.need}</p>
        <p className="mt-1 annotation">{EVIDENCE_LABEL[bridge.gate.evidence]}</p>

        {bridge.course ? (
          <div className="mt-5">
            <p className="label-sm">A course names this job</p>
            <p className="mt-1 text-sm text-foreground">
              {bridge.course.name} · {bridge.course.provider}
            </p>
            {bridge.courseIsNotTheSkills ? (
              <p className="mt-1 annotation">
                This course teaches the subject matter of the job. The skills below are measured
                separately, and the course does not cover them.
              </p>
            ) : null}
          </div>
        ) : null}

        {bridge.training.map(({ training, skills }) => (
          <div key={training.group} className="mt-5">
            <p className="label-sm">{training.group}</p>
            <p className="mt-1 text-sm text-foreground">{skills.join(", ")}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{training.detail}</p>
            {training.options.length > 0 ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 annotation">
                {training.options.map((o) => (
                  <li key={o.name}>
                    {o.name} — {o.provider} · {o.cost} · {o.scope}
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-1 annotation">{EVIDENCE_LABEL[training.evidence]}</p>
          </div>
        ))}
      </div>
    </details>
  );
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
              <WhatItTakes destination={d} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
