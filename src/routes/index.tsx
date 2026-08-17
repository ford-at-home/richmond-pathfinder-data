import { createFileRoute } from "@tanstack/react-router";

import { JobSearch } from "@/components/job/JobSearch";
import { PageHeader, PageSection, ProseContainer } from "@/components/page/PageHeader";
import { siteConfig } from "@/config/site";
import { workforceOccupations } from "@/content/workforce";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Find a job — Richmond Workforce Transition" },
      { name: "description", content: siteConfig.tagline },
      { property: "og:title", content: "Find a job — Richmond Workforce Transition" },
      { property: "og:description", content: siteConfig.tagline },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <ProseContainer>
      <PageHeader
        eyebrow="Richmond VA MSA (BLS 40060)"
        title="Find a job"
        lead={siteConfig.tagline}
        meta={[
          { label: "Starting jobs", value: String(workforceOccupations.length) },
          { label: "Job families", value: "4" },
          { label: "Geography", value: "Richmond VA MSA" },
        ]}
      />

      <PageSection labelledBy="job-list">
        <span id="job-list" className="sr-only">
          Exposed jobs
        </span>
        <JobSearch />
        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Four job families hold three-quarters of the region’s measured AI use. This list is those
          families, at the report’s 25% exposure cut. It is not every job in Richmond.
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          This is not a ranking of people, and it is not a list of jobs to cut.
        </p>
      </PageSection>
    </ProseContainer>
  );
}
