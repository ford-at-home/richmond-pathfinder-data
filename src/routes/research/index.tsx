import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { EmptyState, FilterBar, FilterGroup } from "@/components/data";
import { PlaceholderBadge } from "@/components/editorial";
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
          "Editorial research pages about workforce transition in the Richmond, Virginia region, each with its sources, date, and limitations in view.",
      },
      { property: "og:title", content: "Research Library — Richmond Workforce Transition" },
      {
        property: "og:description",
        content: "Research pages on transitions, capacity, regional data, and training.",
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
        title="Research Library"
        lead="Each entry answers one question in plain language, shows its evidence, and states what it cannot tell you."
        meta={[
          { label: "Entries", value: `${researchStories.length} placeholder` },
          { label: "Status", value: "Structure only — no research migrated" },
        ]}
      >
        <PlaceholderBadge className="mt-5">
          Demonstration entries — not real research titles
        </PlaceholderBadge>
      </PageHeader>

      <PageSection labelledBy="library">
        <span id="library" className="sr-only">
          Research entries
        </span>
        <FilterBar
          searchLabel="Search research"
          searchPlaceholder="Search titles and theses"
          value={query}
          onValueChange={setQuery}
          filters={
            <FilterGroup label="Topic" options={topicOptions} value={topic} onChange={setTopic} />
          }
          disabledNote="Search and filters run against placeholder entries only."
        />

        <p className="mt-4 annotation" role="status" aria-live="polite">
          {results.length} {results.length === 1 ? "entry" : "entries"} shown
        </p>

        {results.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="No entries match"
              body="Clear the search or choose a different topic. The library fills out as research is migrated."
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
