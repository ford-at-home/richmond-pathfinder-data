import type { ReactNode } from "react";

import { KeyFinding } from "@/components/editorial";
import { countSteps, listCounts } from "@/content/listCounts";
import { findingHtml } from "@/lib/reports";
import { cn } from "@/lib/utils";

/** Reading-depth label. Not a claim. */
export function DepthLabel({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function SkipToDocument({
  href = "#document",
  children = "Skip to the full document",
}: {
  href?: string | undefined;
  children?: ReactNode | undefined;
}) {
  return (
    <p className="mt-6">
      <a href={href} className="editorial-link text-sm">
        {children}
      </a>
    </p>
  );
}

/**
 * Numbered summary items from a pinned report. HTML is inline markdown only
 * (emphasis). Wording is not rewritten.
 */
export function FindingList({
  findings,
  className,
}: {
  findings: string[];
  className?: string | undefined;
}) {
  if (findings.length === 0) return null;
  return (
    <ol className={cn("max-w-3xl", className)}>
      {findings.map((finding, i) => (
        <KeyFinding key={i} index={i + 1}>
          <span dangerouslySetInnerHTML={{ __html: findingHtml(finding) }} />
        </KeyFinding>
      ))}
    </ol>
  );
}

/** Collapsed band for reserved scaffold that must stay empty. */
export function ReservedDisclosure({
  title,
  summary,
  children,
}: {
  title: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <details className="border border-border bg-inset">
      <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-foreground">
        {title}
        <span className="mt-1 block font-normal annotation">{summary}</span>
      </summary>
      <div className="border-t border-border px-4 py-4">{children}</div>
    </details>
  );
}

/**
 * One explanation of 523 / 71 / 39 / 28 so Evidence and the appendix cannot
 * silently disagree with Find a job. Numbers come from listCounts().
 */
export function HowTheNumbersRelate({ variant }: { variant: "evidence" | "appendix" }) {
  const n = listCounts();
  const steps = countSteps(n);

  if (variant === "appendix") {
    return (
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        The 25% table has {n.exposed} rows. Find a job starts from {n.mapOrigins} of them. The other
        rows stay in this document. They are not on the starting list.
      </p>
    );
  }

  return (
    <div>
      <p className="max-w-2xl text-sm leading-relaxed text-foreground">
        Pick a job. See a next job that pays more and uses AI less. These documents are how we know.
      </p>
      <dl className="mt-6 grid grid-cols-2 border-t border-border md:grid-cols-4">
        {steps.map((step) => (
          <div key={step.label} className="border-r border-border px-4 py-3 last:border-r-0">
            <dt className="label-sm">{step.label}</dt>
            <dd className="mt-1.5 font-serif text-2xl leading-none text-foreground">
              {step.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Find a job is the {n.mapOrigins}, not the {n.measured}. The {n.publishedPairs} pairs are for
        jobs that already shrank — a different cut, not a second map.
      </p>
    </div>
  );
}
