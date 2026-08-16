import type { ReactNode } from "react";

import { KeyFinding } from "@/components/editorial";
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
