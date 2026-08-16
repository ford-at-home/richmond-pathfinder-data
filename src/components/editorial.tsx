import { AlertTriangle, BookOpen, Info } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Unmistakable marker for scaffold content. */
export function PlaceholderBadge({ children = "Placeholder", className }: { children?: ReactNode; className?: string | undefined }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border border-caution/45 bg-caution/10 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-caution",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-caution" />
      {children}
    </span>
  );
}

export function KeyFinding({
  index,
  children,
  isPlaceholder,
}: {
  index?: number;
  children: ReactNode;
  isPlaceholder?: boolean | undefined;
}) {
  return (
    <li className="flex gap-4 border-t border-border py-4 first:border-t-0">
      {typeof index === "number" ? (
        <span className="numeric mt-1 text-sm text-highlight" aria-hidden="true">
          {String(index).padStart(2, "0")}
        </span>
      ) : null}
      <div>
        <p className="font-display text-[1.05rem] leading-snug text-foreground">{children}</p>
        {isPlaceholder ? <PlaceholderBadge className="mt-2">Placeholder finding</PlaceholderBadge> : null}
      </div>
    </li>
  );
}

export function MetricCallout({
  label,
  value,
  unit,
  note,
  isPlaceholder,
}: {
  label: string;
  value: string | null;
  unit?: string | undefined;
  note?: string | undefined;
  isPlaceholder?: boolean | undefined;
}) {
  return (
    <div className="border-t-2 border-primary/70 bg-surface p-4">
      <p className="label-sm">{label}</p>
      <p className="numeric mt-2 text-2xl text-foreground">
        {value ?? <span className="text-muted-foreground">Not yet migrated</span>}
      </p>
      {unit ? <p className="mt-1 annotation">{unit}</p> : null}
      {note ? <p className="mt-2 annotation">{note}</p> : null}
      {isPlaceholder ? <PlaceholderBadge className="mt-3">No value</PlaceholderBadge> : null}
    </div>
  );
}

export function EvidencePanel({
  title,
  note,
  children,
  className,
}: {
  title: string;
  note?: string | undefined;
  children?: ReactNode;
  className?: string | undefined;
}) {
  return (
    <section className={cn("border border-border bg-surface", className)}>
      <header className="border-b border-border px-4 py-3">
        <h3 className="font-display text-base text-foreground">{title}</h3>
        {note ? <p className="mt-1 annotation">{note}</p> : null}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function ProgressionSteps({
  steps,
}: {
  steps: {
    id: string;
    label: string;
    question: string;
    value: string | null;
    unit?: string | undefined;
    note?: string | undefined;
  }[];
}) {
  return (
    <ol className="grid gap-px bg-rule md:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, i) => (
        <li key={step.id} className="bg-surface p-5">
          <div className="flex items-baseline gap-3">
            <span className="numeric text-xs text-highlight" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-base text-foreground">{step.label}</h3>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.question}</p>
          <p className="numeric mt-4 text-lg text-foreground">
            {step.value ?? <span className="text-sm text-muted-foreground">Not yet migrated</span>}
          </p>
          {step.unit ? <p className="annotation">{step.unit}</p> : null}
          {step.note ? <p className="mt-2 annotation">{step.note}</p> : null}
        </li>
      ))}
    </ol>
  );
}

export function DefinitionCallout({
  term,
  definition,
  isPlaceholder,
}: {
  term: string;
  definition: string;
  isPlaceholder?: boolean | undefined;
}) {
  return (
    <div className="flex gap-3 border-l-2 border-primary bg-inset px-4 py-3">
      <BookOpen className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-foreground">
          {term}
          {isPlaceholder ? <PlaceholderBadge className="ml-2 align-middle">Placeholder</PlaceholderBadge> : null}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{definition}</p>
      </div>
    </div>
  );
}

export function LimitationNote({
  title,
  children,
  tone = "note",
}: {
  title: string;
  children: ReactNode;
  tone?: "note" | "caution";
}) {
  const Icon = tone === "caution" ? AlertTriangle : Info;
  return (
    <div
      className={cn(
        "flex gap-3 border px-4 py-3",
        tone === "caution" ? "border-caution/45 bg-caution/8" : "border-border bg-inset",
      )}
    >
      <Icon
        className={cn("mt-0.5 size-4 shrink-0", tone === "caution" ? "text-caution" : "text-muted-foreground")}
        aria-hidden="true"
      />
      <div>
        <p className="text-sm font-semibold text-foreground">
          <span className="sr-only">{tone === "caution" ? "Caution: " : "Note: "}</span>
          {title}
        </p>
        <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}
