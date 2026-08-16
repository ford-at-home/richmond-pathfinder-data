import { createFileRoute } from "@tanstack/react-router";

import { DefinitionCallout, LimitationNote } from "@/components/editorial";
import {
  PageHeader,
  PageSection,
  ProseContainer,
  SectionIntro,
} from "@/components/page/PageHeader";
import { SourceList } from "@/components/sources";
import {
  definitions,
  methodologyHtml,
  methodologyLimitations,
  robustnessHtml,
  sourceHandling,
} from "@/content/methodology";
import { sources } from "@/content/research";
import { GEOGRAPHY } from "@/lib/geography";
import { pinShort, pinSynced } from "@/lib/pin";

import "@/visualizations/source-report.css";

export const Route = createFileRoute("/methodology")({
  head: () => ({
    meta: [
      { title: "Methodology — Richmond Workforce Transition" },
      {
        name: "description",
        content:
          "Join, metrics, and limits for the Richmond VA MSA analysis of observed-task exposure and OEWS employment.",
      },
      { property: "og:title", content: "Methodology — Richmond Workforce Transition" },
      {
        property: "og:description",
        content:
          "How exposure is joined to OEWS, what the metrics are, and the limits that travel with any claim.",
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
        lead="The construction, the metrics, and the limits that any use of the data needs to carry. Body text below is the pinned methodology document, not a paraphrase."
        meta={[
          { label: "Geography", value: GEOGRAPHY },
          { label: "Analysis pin", value: pinShort },
          { label: "Synced", value: pinSynced },
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

      <PageSection labelledBy="document" className="rule-t">
        <SectionIntro
          eyebrow="Pinned document"
          title="Methodology"
          lead="Reproduced from data/source/docs/methodology.md."
        >
          <span id="document" className="sr-only">
            Methodology document
          </span>
        </SectionIntro>
        <div
          className="source-report source-figure prose mt-8 max-w-3xl"
          dangerouslySetInnerHTML={{ __html: methodologyHtml }}
        />
      </PageSection>

      <PageSection labelledBy="robustness" className="rule-t">
        <SectionIntro
          eyebrow="Pinned companion"
          title="Robustness"
          lead="The methodology says to run this before making any exposure claim. Reproduced from data/source/docs/robustness.md."
        >
          <span id="robustness" className="sr-only">
            Robustness
          </span>
        </SectionIntro>
        <div
          className="source-report source-figure prose mt-8 max-w-3xl"
          dangerouslySetInnerHTML={{ __html: robustnessHtml }}
        />
      </PageSection>

      <PageSection labelledBy="handling" className="rule-t">
        <SectionIntro
          eyebrow="Source handling"
          title="How evidence is presented"
          lead="These rules apply to every page, chart, and table on the site."
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
