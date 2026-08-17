import { Link } from "@tanstack/react-router";

import {
  bridgeFor,
  bridgeSummary,
  EVIDENCE_LABEL,
  SELF_STUDY_CAVEAT,
  type SelfStudyOption,
} from "@/content/bridge";
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

function FreeToStart({ options }: { options: SelfStudyOption[] }) {
  return (
    <div className="mt-3">
      <p className="label-sm">Free, and you can start today</p>
      <ul className="mt-2 space-y-2">
        {options.map((o) => (
          <li key={o.name}>
            {/* Name and provider are one target so the tap area clears 24px. */}
            <a
              href={o.url}
              target="_blank"
              rel="noreferrer"
              className="inline-block py-1 text-sm font-medium text-foreground"
            >
              {o.name}
              <span className="font-normal text-muted-foreground"> — {o.provider}</span>
            </a>
            <span className="block annotation">
              {o.access}. {o.covers}.
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 annotation">{SELF_STUDY_CAVEAT}</p>
    </div>
  );
}

function WhatItTakes({ destination }: { destination: Destination }) {
  const bridge = bridgeFor(destination);
  const skillCount = destination.build.length;

  return (
    <details className="mt-3">
      <summary className="cursor-pointer text-sm font-medium text-foreground">
        What it takes
        <span className="mt-1 block font-normal annotation">
          {bridgeSummary(bridge, skillCount)}
        </span>
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
            {training.selfStudy.length > 0 ? <FreeToStart options={training.selfStudy} /> : null}
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
