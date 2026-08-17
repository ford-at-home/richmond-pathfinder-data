import { createFileRoute } from "@tanstack/react-router";

import { JobSearch } from "@/components/job/JobSearch";
import { PageHeader, PageSection, ProseContainer } from "@/components/page/PageHeader";
import { siteConfig } from "@/config/site";
import { listCounts } from "@/content/listCounts";
import { workforceOccupations } from "@/content/workforce";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Find AI-exposed jobs in Richmond — Richmond Workforce Transition" },
      { name: "description", content: siteConfig.tagline },
      {
        property: "og:title",
        content: "Find AI-exposed jobs in Richmond — Richmond Workforce Transition",
      },
      { property: "og:description", content: siteConfig.tagline },
    ],
  }),
  component: Home,
});

function Home() {
  const n = listCounts();

  return (
    <ProseContainer>
      <PageHeader
        eyebrow="Richmond VA MSA (BLS 40060)"
        title="Find a job"
        lead={siteConfig.tagline}
        meta={[
          { label: "Starting jobs", value: String(workforceOccupations.length) },
          { label: "Job families", value: String(n.families) },
          { label: "Geography", value: "Richmond VA MSA" },
        ]}
      />

      <PageSection labelledBy="job-list">
        <span id="job-list" className="sr-only">
          Exposed jobs
        </span>
        <JobSearch />
        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {n.mapOrigins} starting jobs, not all {n.measured}. Office, sales, business, and computer
          work where people already use AI a lot.
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          This is not a ranking of people, and it is not a list of jobs to cut.
        </p>
      </PageSection>
    </ProseContainer>
  );
}
