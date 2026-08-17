import { Link } from "@tanstack/react-router";

import { SELF_STUDY_CAVEAT, type SelfStudyOption } from "@/content/bridge";
import { claimFor, LABEL_ON_SCREEN, type Claimed } from "@/content/claims";
import type { RouteCard } from "@/content/screen/card";

/** The reader-facing weight of a claim. OPEN has none: the empty state carries its own reason. */
function Weight({ of }: { of: Claimed }) {
  const label = LABEL_ON_SCREEN[claimFor(of.claim).label];
  return label ? <p className="mt-1 annotation">{label}</p> : null;
}

function sentences(list: Claimed[]): string {
  return list.map((c) => c.text).join(" ");
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
      <p className="mt-2 annotation">{SELF_STUDY_CAVEAT.text}</p>
    </div>
  );
}

function WhatItTakes({ route }: { route: RouteCard }) {
  const { bridge } = route;

  return (
    <details className="mt-3">
      <summary className="cursor-pointer text-sm font-medium text-foreground">
        What it takes
        <span className="mt-1 block font-normal annotation">
          {route.summary.map((c) => c.text).join(" · ")}
        </span>
      </summary>

      <div className="mt-4 border-l-2 border-border pl-4">
        {bridge.gate.need.map((block) => (
          <div key={block.text} className="mt-3 first:mt-0">
            <p className="text-sm leading-relaxed text-foreground">{block.text}</p>
            <Weight of={block} />
          </div>
        ))}

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
            <Weight of={{ text: training.detail, claim: training.claim }} />
            {training.selfStudy.length > 0 ? <FreeToStart options={training.selfStudy} /> : null}
          </div>
        ))}
      </div>
    </details>
  );
}

export function DestinationList({ routes }: { routes: RouteCard[] }) {
  return (
    <section aria-labelledby="next-jobs">
      <h2 id="next-jobs" className="font-display text-lg font-semibold text-foreground">
        Next jobs from here
      </h2>
      <ul className="mt-6 grid grid-cols-1">
        {routes.map((r) => (
          <li key={r.soc} className="border-t border-border py-5">
            <Link
              to="/job/$soc"
              params={{ soc: r.soc }}
              className="font-medium text-foreground no-underline hover:underline"
            >
              {r.title}
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">{sentences(r.line)}</p>
            {r.different ? (
              <p className="mt-1 text-sm text-foreground">{r.different.text}</p>
            ) : null}
            {r.aiUse ? <p className="mt-1 annotation">{r.aiUse.text}</p> : null}
            <WhatItTakes route={r} />
          </li>
        ))}
      </ul>
    </section>
  );
}
