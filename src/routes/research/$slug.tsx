import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { PageHeader, PageSection, ProseContainer } from "@/components/page/PageHeader";
import { RelatedResearch } from "@/components/research";
import { ReportDocument } from "@/components/research/ReportDocument";
import { SourceList } from "@/components/sources";
import { getSources, getStory, researchStories } from "@/content/research";
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
        <Link to="/research" className="text-sm text-primary underline-offset-4 hover:underline">
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

  return (
    <ProseContainer width="wide">
      <PageHeader
        eyebrow={story.topic}
        title={story.title}
        meta={[
          { label: "Published", value: story.publishedAt },
          { label: "Analysis pin", value: pinShort },
          { label: "Synced", value: pinSynced },
          { label: "Reading time", value: `${story.readingMinutes} min` },
        ]}
      />

      <PageSection labelledBy="report">
        <h2 id="report" className="sr-only">
          Report
        </h2>
        <ReportDocument story={story} />
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
