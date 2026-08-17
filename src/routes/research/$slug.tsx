import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { PageHeader, PageSection, ProseContainer } from "@/components/page/PageHeader";
import { RelatedResearch } from "@/components/research";
import { ReportDocument } from "@/components/research/ReportDocument";
import { SourceList } from "@/components/sources";
import { DepthLabel, FindingList, HowTheNumbersRelate, SkipToDocument } from "@/components/story";
import { getSources, getStory, researchStories } from "@/content/research";
import { GEOGRAPHY_SHORT } from "@/lib/geography";
import { pinShort, pinSynced } from "@/lib/pin";

export const Route = createFileRoute("/research/$slug")({
  loader: ({ params }) => {
    const story = getStory(params.slug);
    if (!story) throw notFound();
    return { story };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Research not found — Richmond Workforce Transition" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { story } = loaderData;
    return {
      meta: [
        { title: `${story.title} — Richmond Workforce Transition` },
        { name: "description", content: story.thesis },
        { property: "og:title", content: story.title },
        { property: "og:description", content: story.thesis },
        { property: "og:type", content: "article" },
      ],
    };
  },
  notFoundComponent: StoryNotFound,
  component: ResearchStoryPage,
});

function StoryNotFound() {
  return (
    <ProseContainer width="narrow">
      <PageHeader
        eyebrow="Research"
        title="That research page doesn't exist"
        lead="The entry may have been renamed. Source URLs under /report/:slug redirect here."
      />
      <PageSection>
        <Link to="/research" className="editorial-link text-sm">
          Back to the research library
        </Link>
      </PageSection>
    </ProseContainer>
  );
}

function ResearchStoryPage() {
  const { story } = Route.useLoaderData();
  const storySources = getSources(story.sourceIds);
  const related = story.relatedSlugs
    .map((slug) => researchStories.find((s) => s.slug === slug))
    .filter((s): s is (typeof researchStories)[number] => Boolean(s));
  const hasFindings = story.keyFindings.length > 0;

  return (
    <ProseContainer width="wide">
      <PageHeader
        eyebrow={`${story.topic} · ${GEOGRAPHY_SHORT}`}
        title={story.title}
        lead={story.thesis}
        meta={[
          { label: "Published", value: story.publishedAt },
          { label: "Analysis pin", value: pinShort },
          { label: "Synced", value: pinSynced },
          { label: "Reading time", value: `${story.readingMinutes} min` },
        ]}
      />

      {hasFindings ? (
        <PageSection labelledBy="findings">
          <DepthLabel>In two minutes</DepthLabel>
          <h2 id="findings" className="mt-2 section-lead">
            Summary of findings
          </h2>
          <p className="mt-2 max-w-2xl annotation">
            Numbered items are the report&apos;s own summary, not a rewrite. Interactive figures sit
            in the sections that make the claims.
          </p>
          <FindingList findings={story.keyFindings} className="mt-6" />
          {story.slug === "ai-exposure-and-employment-change" ? (
            <HowTheNumbersRelate variant="appendix" />
          ) : null}
          {story.slug === "transition-capacity" ? (
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              The pair table in this report is jobs that already shrank. Find a job is a different
              starting list.
            </p>
          ) : null}
          <SkipToDocument />
        </PageSection>
      ) : (
        <PageSection labelledBy="orientation">
          <DepthLabel>Companion document</DepthLabel>
          <h2 id="orientation" className="mt-2 section-lead">
            Same tables. Different starting list.
          </h2>
          <HowTheNumbersRelate variant="appendix" />
          <SkipToDocument />
        </PageSection>
      )}

      <PageSection labelledBy="document" className="rule-t">
        <DepthLabel>The document</DepthLabel>
        <h2 id="document" className="mt-2 section-lead">
          Full report
        </h2>
        <div className="mt-8">
          <ReportDocument story={story} />
        </div>
      </PageSection>

      <PageSection labelledBy="provenance" className="rule-t">
        <h2 id="provenance" className="sr-only">
          Sources
        </h2>
        <SourceList sources={storySources} title="Sources and provenance" />
      </PageSection>

      <PageSection>
        <RelatedResearch stories={related} />
      </PageSection>
    </ProseContainer>
  );
}
