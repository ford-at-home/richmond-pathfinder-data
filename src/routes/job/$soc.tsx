import { createFileRoute, notFound } from "@tanstack/react-router";

import { DestinationList } from "@/components/job/DestinationList";
import { PageHeader, PageSection, ProseContainer } from "@/components/page/PageHeader";
import { PARTIAL_COURSE_LIST } from "@/content/bridge";
import { occupations as analysisOccupations } from "@/content/occupations";
import {
  occupationBySoc,
  routesOf,
  sortDestinations,
  workforceMeta,
  type WorkforceOccupation,
} from "@/content/workforce";
import {
  BAND_MEANING,
  DESTINATION_ONLY,
  EMPTY_ROUTES,
  exposureBand,
  hasSignal,
} from "@/lib/exposureBand";

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

function percent(exposure: number): string {
  return `${Math.round(exposure * 100)}%`;
}

function JobPage() {
  const data = Route.useLoaderData();

  if (data.kind === "destination") {
    const { job } = data;
    const band = exposureBand(job.exposure);
    return (
      <ProseContainer>
        <PageHeader eyebrow={job.group} title={job.title} lead={DESTINATION_ONLY}>
          {hasSignal(job.exposure) ? (
            <p className="mt-6 numeric text-2xl text-foreground">{percent(job.exposure)}</p>
          ) : null}
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {BAND_MEANING[band]}
          </p>
        </PageHeader>
      </ProseContainer>
    );
  }

  const { job } = data;
  const band = exposureBand(job.exposure);
  const next = sortDestinations(routesOf(job));

  return (
    <ProseContainer>
      <PageHeader
        eyebrow={job.group}
        title={job.title}
        lead={BAND_MEANING[band]}
        meta={[
          ...(hasSignal(job.exposure) ? [{ label: "AI use", value: percent(job.exposure) }] : []),
          { label: "Jobs here", value: job.employment.toLocaleString("en-US") },
          ...(job.wage != null
            ? [
                {
                  label: "Mean pay",
                  value: job.wage.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }),
                },
              ]
            : []),
        ]}
      />

      <PageSection labelledBy="next-jobs">
        {next.length > 0 ? (
          <DestinationList destinations={next} />
        ) : (
          <p id="next-jobs" className="max-w-2xl text-sm leading-relaxed text-foreground">
            {EMPTY_ROUTES}
          </p>
        )}
      </PageSection>

      <PageSection>
        <details className="max-w-2xl border-t border-border pt-6">
          <summary className="cursor-pointer text-sm font-medium text-foreground">
            Where these numbers come from
          </summary>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="label-sm">AI exposure</dt>
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
            <li>Mean pay is the regional midpoint. Half the people doing the job earn less.</li>
            <li>{PARTIAL_COURSE_LIST}</li>
            <li>
              Check any course with the provider before you commit. Prices and who qualifies change.
            </li>
          </ul>
        </details>
      </PageSection>
    </ProseContainer>
  );
}
