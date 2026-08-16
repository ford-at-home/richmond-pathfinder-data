import { createFileRoute } from "@tanstack/react-router";

import { DefinitionCallout, LimitationNote } from "@/components/editorial";
import { PageHeader, PageSection, ProseContainer, SectionIntro } from "@/components/page/PageHeader";
import { SourceList } from "@/components/sources";
import { definitions, methodologyLimitations, sourceHandling } from "@/content/methodology";
import { sources } from "@/content/research";

export const Route = createFileRoute("/methodology")({
  head: () => ({
    meta: [
      { title: "Methodology — Richmond Workforce Transition" },
      {
        name: "description",
        content:
          "Definitions, limitations, and source handling for the Richmond regional workforce transition project.",
      },
      { property: "og:title", content: "Methodology — Richmond Workforce Transition" },
      {
        property: "og:description",
        content: "How terms are defined, how sources are handled, and what this project does not claim.",
      },
    ],
  }),
  component: MethodologyPage,
});

function MethodologyPage() {
  return (
    <ProseContainer>
      <PageHeader
        eyebrow="Reference"
        title="Methodology, definitions, and limitations"
        lead="What the words on this site mean, how evidence is handled, and where the analysis stops."
        meta={[
          { label: "Status", value: "Scaffold — methodology text not migrated" },
          { label: "Last reviewed", value: "Pending migration" },
        ]}
      />

      <PageSection labelledBy="definitions">
        <SectionIntro eyebrow="Definitions" title="Terms used across the site">
          <span id="definitions" className="sr-only">
            Definitions
          </span>
        </SectionIntro>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {definitions.map((d) => (
            <DefinitionCallout
              key={d.term}
              term={d.term}
              definition={d.definition}
              isPlaceholder={d.isPlaceholder}
            />
          ))}
        </div>
      </PageSection>

      <PageSection labelledBy="handling" className="rule-t">
        <SectionIntro
          eyebrow="Source handling"
          title="How evidence is presented"
          lead="These rules apply to every page, chart, map, and table on the site."
        >
          <span id="handling" className="sr-only">
            Source handling
          </span>
        </SectionIntro>
        <ol className="mt-8 grid gap-px bg-rule md:grid-cols-2">
          {sourceHandling.map((rule, i) => (
            <li key={rule.id} className="bg-background p-5">
              <span className="numeric text-xs text-highlight" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-lg text-foreground">{rule.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{rule.body}</p>
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection labelledBy="limits" className="rule-t">
        <SectionIntro eyebrow="Limitations" title="What this site does not claim">
          <span id="limits" className="sr-only">
            Limitations
          </span>
        </SectionIntro>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {methodologyLimitations.map((l) => (
            <LimitationNote key={l.id} title={l.title} tone="caution">
              {l.body}
            </LimitationNote>
          ))}
        </div>
      </PageSection>

      <PageSection labelledBy="sources" className="rule-t">
        <span id="sources" className="sr-only">
          Source register
        </span>
        <SourceList sources={sources} title="Source register" />
      </PageSection>
    </ProseContainer>
  );
}
