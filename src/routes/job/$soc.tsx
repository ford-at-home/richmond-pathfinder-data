import { createFileRoute, notFound } from "@tanstack/react-router";

import { DestinationList } from "@/components/job/DestinationList";
import { PageHeader, PageSection, ProseContainer } from "@/components/page/PageHeader";
import { FREE_LOCAL_HELP, PARTIAL_COURSE_LIST } from "@/content/bridge";
import type { Claimed } from "@/content/claims";
import { occupations as analysisOccupations } from "@/content/occupations";
import { cardFor, destinationCardFor, type Card } from "@/content/screen/card";
import { occupationBySoc, workforceMeta, type WorkforceOccupation } from "@/content/workforce";

type OriginPage = { kind: "origin"; job: WorkforceOccupation };
type DestinationPage = {
  kind: "destination";
  job: { code: string; title: string; group: string; exposure: number };
};
type JobLoader = OriginPage | DestinationPage;

export const Route = createFileRoute("/job/$soc")({
  loader: ({ params }): JobLoader => {
    const origin = occupationBySoc(params.soc);
    if (origin) return { kind: "origin", job: origin };
    const dest = analysisOccupations.find((o) => o.code === params.soc);
    if (dest) {
      return {
        kind: "destination",
        job: { code: dest.code, title: dest.title, group: dest.group, exposure: dest.exposure },
      };
    }
    throw notFound();
  },
  head: ({ loaderData }) => {
    const title = loaderData?.job.title ?? "Job";
    return {
      meta: [
        { title: `${title} — Richmond Workforce Transition` },
        {
          name: "description",
          content:
            "How much of this work people in Greater Richmond already do with AI, and nearby jobs that pay more and use it less.",
        },
      ],
    };
  },
  component: JobPage,
});

/** The SOC code belongs under the title in small type, or in the URL. Never mid-sentence. */
function SocCode({ soc }: { soc: string }) {
  return <p className="mt-2 annotation">{soc}</p>;
}

function Staying({ stay }: { stay: Card["stay"] }) {
  const slots: [string, Claimed | undefined][] = [
    ["What this job already does", stay.does],
    ["Using AI in this job", stay.evidence],
    ["What a person still has to check", stay.mustCheck],
    ["Who decides", stay.whoDecides],
  ];

  return (
    <PageSection labelledBy="staying">
      <h2 id="staying" className="font-display text-lg font-semibold text-foreground">
        Staying in this job
      </h2>
      <dl className="mt-4 max-w-2xl space-y-4 text-sm">
        {slots
          .filter((s): s is [string, Claimed] => s[1] !== undefined)
          .map(([label, claimed]) => (
            <div key={label}>
              <dt className="label-sm">{label}</dt>
              <dd className="mt-1 leading-relaxed text-foreground">{claimed.text}</dd>
            </div>
          ))}
      </dl>
    </PageSection>
  );
}

function JobPage() {
  const data = Route.useLoaderData();

  if (data.kind === "destination") {
    const card = destinationCardFor(data.job);
    return (
      <ProseContainer>
        <PageHeader eyebrow={card.group} title={card.title} lead={card.lead.text}>
          <SocCode soc={card.soc} />
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {card.aiUse.text}
          </p>
        </PageHeader>
      </ProseContainer>
    );
  }

  const card = cardFor(data.job);

  return (
    <ProseContainer>
      <PageHeader eyebrow={card.group} title={card.title} lead={card.aiUse.text}>
        <SocCode soc={card.soc} />
        <div className="mt-6 max-w-2xl space-y-1">
          <p className="label-sm">This job in Greater Richmond</p>
          <p className="text-sm leading-relaxed text-foreground">
            {card.scale.map((c) => c.text).join(" ")}
          </p>
        </div>
      </PageHeader>

      <PageSection labelledBy="next-jobs">
        {card.noRoutes ? (
          <>
            <h2 id="next-jobs" className="font-display text-lg font-semibold text-foreground">
              Next jobs from here
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground">
              {card.noRoutes.text}
            </p>
          </>
        ) : (
          <>
            {card.routesIntro ? (
              <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {card.routesIntro.text}
              </p>
            ) : null}
            <DestinationList routes={card.routes} />
          </>
        )}
      </PageSection>

      <Staying stay={card.stay} />

      <PageSection labelledBy="free-help">
        <h2 id="free-help" className="font-display text-lg font-semibold text-foreground">
          Free help in Greater Richmond
        </h2>
        <dl className="mt-4 max-w-2xl space-y-4 text-sm">
          {[FREE_LOCAL_HELP.card, FREE_LOCAL_HELP.board].map((item) => (
            <div key={item.text}>
              <dt className="leading-relaxed text-foreground">{item.text}</dt>
              <dd className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                {item.links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block py-1 annotation text-foreground"
                  >
                    {l.label}
                  </a>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </PageSection>

      <PageSection>
        <details className="max-w-2xl border-t border-border pt-6">
          <summary className="cursor-pointer text-sm font-medium text-foreground">
            Where these numbers come from
          </summary>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="label-sm">AI use</dt>
              <dd className="mt-1 text-muted-foreground">
                {workforceMeta.exposureSource}. {workforceMeta.exposureDefinition}
              </dd>
            </div>
            <div>
              <dt className="label-sm">Pay and jobs</dt>
              <dd className="mt-1 text-muted-foreground">{workforceMeta.wageSource}</dd>
            </div>
            <div>
              <dt className="label-sm">Related work</dt>
              <dd className="mt-1 text-muted-foreground">{workforceMeta.adjacencySource}</dd>
            </div>
            <div>
              <dt className="label-sm">Training</dt>
              <dd className="mt-1 text-muted-foreground">{workforceMeta.trainingSource}</dd>
            </div>
          </dl>
          <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>
              Skill ratings describe jobs on average, from national surveys. They are not a
              judgement about any person.
            </li>
            <li>Similar jobs come from national judgements of similarity.</li>
            <li>
              Pay is an annual average across everyone doing the job in this region. Most people
              earn less than the average.
            </li>
            <li>{PARTIAL_COURSE_LIST.text}</li>
            <li>
              Check any course with the provider before you commit. Prices and who qualifies change.
            </li>
          </ul>
        </details>
      </PageSection>
    </ProseContainer>
  );
}
