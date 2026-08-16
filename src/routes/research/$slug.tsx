import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { VisualizationFrame, VisualizationStagePlaceholder } from "@/components/data";
import { KeyFinding, LimitationNote, PlaceholderBadge } from "@/components/editorial";
import { PageHeader, PageSection, ProseContainer } from "@/components/page/PageHeader";
import { RelatedResearch } from "@/components/research";
import { SourceList } from "@/components/sources";
import { getSources, getStory, researchStories } from "@/content/research";

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
        lead="The entry may have been renamed, or it hasn't been migrated yet."
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
    <ProseContainer width="narrow">
      <PageHeader
        eyebrow={story.topic}
        title={story.title}
        meta={[
          { label: "Published", value: story.publishedAt },
          ...(story.updatedAt ? [{ label: "Updated", value: story.updatedAt }] : []),
          { label: "Reading time", value: `${story.readingMinutes} min` },
          { label: "Sources", value: String(story.sourceIds.length) },
        ]}
      >
        {story.isPlaceholder ? (
          <PlaceholderBadge className="mt-5">
            Placeholder story — not real research
          </PlaceholderBadge>
        ) : null}
      </PageHeader>

      <PageSection labelledBy="thesis">
        <h2 id="thesis" className="label-sm">
          In one sentence
        </h2>
        <p className="mt-3 font-display text-2xl leading-snug text-foreground">{story.thesis}</p>
      </PageSection>

      <PageSection labelledBy="findings" className="rule-t">
        <h2 id="findings" className="font-display text-xl text-foreground">
          Key findings
        </h2>
        <ul className="mt-4">
          {story.keyFindings.map((finding, i) => (
            <KeyFinding key={i} index={i + 1} isPlaceholder={story.isPlaceholder}>
              {finding}
            </KeyFinding>
          ))}
        </ul>
      </PageSection>

      <PageSection labelledBy="evidence" className="rule-t">
        <h2 id="evidence" className="sr-only">
          Visual evidence
        </h2>
        <VisualizationFrame
          title="Visual evidence"
          description="Reserved for the chart or diagram that carries this story's argument."
          height="short"
          provenance={{
            source: "Pending migration",
            geography: "Richmond, Virginia region",
            unit: "Pending migration",
            period: "Pending migration",
          }}
        >
          <VisualizationStagePlaceholder
            library="this story's chart"
            purpose="One figure, labeled with its unit, geography, and period, readable as a table."
          />
        </VisualizationFrame>
      </PageSection>

      <PageSection labelledBy="sections" className="rule-t">
        <h2 id="sections" className="sr-only">
          Story sections
        </h2>
        <div className="space-y-10">
          {story.sections.map((section) => (
            <section key={section.heading}>
              <h3 className="font-display text-xl text-foreground">{section.heading}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </div>
      </PageSection>

      <PageSection labelledBy="provenance" className="rule-t">
        <h2 id="provenance" className="sr-only">
          Sources
        </h2>
        <SourceList sources={storySources} title="Sources and provenance" />
      </PageSection>

      <PageSection labelledBy="limits" className="rule-t">
        <h2 id="limits" className="font-display text-xl text-foreground">
          Limitations
        </h2>
        <div className="mt-4 space-y-4">
          {story.limitations.map((limitation, i) => (
            <LimitationNote key={i} title="Limitation" tone="caution">
              {limitation}
            </LimitationNote>
          ))}
        </div>
        <h3 className="mt-10 font-display text-xl text-foreground">What this means</h3>
        <p className="mt-3 leading-relaxed text-muted-foreground">{story.whatThisMeans}</p>
      </PageSection>

      <PageSection>
        <RelatedResearch stories={related} />
      </PageSection>
    </ProseContainer>
  );
}
