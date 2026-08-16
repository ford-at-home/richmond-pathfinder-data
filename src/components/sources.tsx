import { ChevronDown } from "lucide-react";

import { PlaceholderBadge } from "@/components/editorial";
import type { Provenance, Source } from "@/content/types";

export function SourceBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-border bg-inset px-2 py-0.5 text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">
      {count} {count === 1 ? "source" : "sources"}
    </span>
  );
}

export function SourceList({
  sources,
  title = "Sources",
}: {
  sources: Source[];
  title?: string | undefined;
}) {
  return (
    <section aria-label={title} className="border border-border bg-surface">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="font-display text-base text-foreground">{title}</h2>
        <SourceBadge count={sources.length} />
      </header>
      <ol className="divide-y divide-border">
        {sources.map((s, i) => (
          <li key={s.id} className="flex gap-3 px-4 py-3">
            <span className="numeric text-xs text-muted-foreground" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm text-foreground">{s.title}</p>
              <p className="mt-0.5 annotation">
                {s.publisher}
                {s.date ? ` · ${s.date}` : ""} · {s.kind}
              </p>
              {s.url ? (
                <p className="mt-1">
                  <a href={s.url} className="editorial-link text-xs">
                    {s.url}
                  </a>
                </p>
              ) : null}
              {s.pages ? <p className="mt-1 annotation">{s.pages}</p> : null}
              {s.accessed ? <p className="mt-1 annotation">Retrieved {s.accessed}</p> : null}
              {s.isPlaceholder ? (
                <PlaceholderBadge className="mt-2">Not a real citation</PlaceholderBadge>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Reusable data-provenance disclosure shown near every figure or visualization. */
export function DataProvenance({ provenance }: { provenance: Provenance }) {
  return (
    <details className="group border-t border-border bg-inset">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ChevronDown
          className="size-3.5 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
        Data provenance
      </summary>
      <dl className="grid gap-x-8 gap-y-2 px-4 pb-4 pt-1 sm:grid-cols-2">
        <ProvenanceItem label="Source" value={provenance.source} />
        <ProvenanceItem label="Geography" value={provenance.geography} />
        <ProvenanceItem label="Unit" value={provenance.unit ?? "Not yet migrated"} />
        <ProvenanceItem label="Reference period" value={provenance.period ?? "Not yet migrated"} />
        {provenance.note ? <ProvenanceItem label="Note" value={provenance.note} span /> : null}
      </dl>
    </details>
  );
}

function ProvenanceItem({
  label,
  value,
  span,
}: {
  label: string;
  value: string;
  span?: boolean | undefined;
}) {
  return (
    <div className={span ? "sm:col-span-2" : undefined}>
      <dt className="label-sm">{label}</dt>
      <dd className="mt-0.5 text-xs leading-relaxed text-foreground">{value}</dd>
    </div>
  );
}
