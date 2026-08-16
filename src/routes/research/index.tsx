import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { EmptyState, FilterBar, FilterGroup } from "@/components/data";
import { PageHeader, PageSection, ProseContainer } from "@/components/page/PageHeader";
import { ResearchCard } from "@/components/research";
import { researchStories, researchTopics } from "@/content/research";

export const Route = createFileRoute("/research/")({
  head: () => ({
    meta: [
      { title: "Research Library — Richmond Workforce Transition" },
      {
        name: "description",
        content:
          "The published reports on AI exposure, employment change, and transition capacity in the Richmond VA MSA, with sources and limits in view.",
      },
      { property: "og:title", content: "Research Library — Richmond Workforce Transition" },
      {
        property: "og:description",
        content:
          "AI Exposure and Employment Change, Transition Capacity, and the Technical Appendix.",
      },
    ],
  }),
  component: ResearchLibrary,
});

const topicOptions = ["All topics", ...researchTopics] as const;

function ResearchLibrary() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string>("All topics");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return researchStories.filter(
      (s) =>
        (topic === "All topics" || s.topic === topic) &&
        (q === "" || s.title.toLowerCase().includes(q) || s.thesis.toLowerCase().includes(q)),
    );
  }, [query, topic]);

  return (
    <ProseContainer>
      <PageHeader
        eyebrow="Research"
        title="The reports"
        lead="The evidence base, reproduced in full. Where a claim has an interactive figure, the figure sits in the section that makes the claim."
        meta={[
          { label: "Entries", value: String(researchStories.length) },
          { label: "Geography", value: "Richmond VA MSA (BLS 40060)" },
        ]}
      />

      <PageSection labelledBy="library">
        <span id="library" className="sr-only">
          Research entries
        </span>
        <FilterBar
          searchLabel="Search research"
          searchPlaceholder="Search titles"
          value={query}
          onValueChange={setQuery}
          filters={
            <FilterGroup label="Topic" options={topicOptions} value={topic} onChange={setTopic} />
          }
        />

        <p className="mt-4 annotation" role="status" aria-live="polite">
          {results.length} {results.length === 1 ? "entry" : "entries"} shown
        </p>

        {results.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="No entries match"
              body="Clear the search or choose a different topic."
            />
          </div>
        ) : (
          <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {results.map((story) => (
              <li key={story.slug}>
                <ResearchCard story={story} />
              </li>
            ))}
          </ul>
        )}
      </PageSection>
    </ProseContainer>
  );
}
