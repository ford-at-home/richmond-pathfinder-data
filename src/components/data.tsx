import { Download, Loader2, Search, Table2, TriangleAlert } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

import { PlaceholderBadge } from "@/components/editorial";
import { DataProvenance } from "@/components/sources";
import type { Provenance } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Frame around any current or future visualization.
 * Reserves visible space for title, unit, geography, period and source, and
 * always offers a "view data as table" affordance plus an export slot.
 */
export function VisualizationFrame({
  title,
  description,
  provenance,
  height = "tall",
  toolbar,
  legend,
  tableView,
  children,
}: {
  title: string;
  description?: string | undefined;
  provenance: Provenance;
  height?: "short" | "tall" | undefined;
  toolbar?: ReactNode | undefined;
  legend?: ReactNode | undefined;
  tableView?: ReactNode | undefined;
  children?: ReactNode | undefined;
}) {
  const [showTable, setShowTable] = useState(false);
  const regionId = useId();

  return (
    <figure className="border border-rule bg-surface">
      <figcaption className="border-b border-border px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-base text-foreground">{title}</h3>
            {description ? <p className="mt-1 annotation max-w-2xl">{description}</p> : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {tableView ? (
              <button
                type="button"
                onClick={() => setShowTable((v) => !v)}
                aria-expanded={showTable}
                aria-controls={regionId}
                className="inline-flex items-center gap-1.5 border border-input px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-inset"
              >
                <Table2 className="size-3.5" aria-hidden="true" />
                {showTable ? "Hide data table" : "View data as table"}
              </button>
            ) : null}
            <button
              type="button"
              disabled
              title="Export becomes available when data is migrated"
              className="inline-flex items-center gap-1.5 border border-input px-2.5 py-1.5 text-xs font-medium text-muted-foreground disabled:cursor-not-allowed"
            >
              <Download className="size-3.5" aria-hidden="true" />
              Export data
            </button>
          </div>
        </div>
        <p className="mt-2 annotation">
          {provenance.geography}
          {provenance.unit ? ` · ${provenance.unit}` : ""}
          {provenance.period ? ` · ${provenance.period}` : ""} · Source: {provenance.source}
        </p>
        {toolbar ? <div className="mt-3">{toolbar}</div> : null}
      </figcaption>

      <div
        className={cn(
          "relative flex items-center justify-center hatch",
          height === "tall" ? "min-h-[22rem] md:min-h-[30rem]" : "min-h-[14rem]",
        )}
      >
        {children ?? (
          <p className="mx-auto max-w-sm px-6 py-10 text-center text-sm text-muted-foreground">
            Visualization stage reserved.
          </p>
        )}
      </div>

      {legend ? <div className="border-t border-border px-4 py-3">{legend}</div> : null}

      {tableView ? (
        <div id={regionId} hidden={!showTable} className="border-t border-border p-4">
          {tableView}
        </div>
      ) : null}

      <DataProvenance provenance={provenance} />
    </figure>
  );
}

export function VisualizationStagePlaceholder({
  library,
  purpose,
}: {
  library: string;
  purpose: string;
}) {
  return (
    <div className="mx-auto max-w-md px-6 py-14 text-center">
      <PlaceholderBadge>Visualization not yet built</PlaceholderBadge>
      <p className="mt-4 font-display text-lg text-foreground">Reserved for {library}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{purpose}</p>
      <p className="mt-4 annotation">
        The table fallback below carries the same information for readers who cannot use the graphic.
      </p>
    </div>
  );
}

export function VisualizationLegend({
  items,
  note,
}: {
  items: { label: string; shape: string; note?: string | undefined; colorClass?: string | undefined }[];
  note?: string | undefined;
}) {
  return (
    <div>
      <p className="label-sm">Legend</p>
      <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-xs text-foreground">
            <span
              aria-hidden="true"
              className={cn(
                "inline-block size-2.5 border border-foreground/40",
                item.colorClass ?? "bg-muted",
                item.shape === "circle" && "rounded-full",
                item.shape === "diamond" && "rotate-45",
              )}
            />
            <span>
              {item.label}
              <span className="text-muted-foreground"> ({item.shape})</span>
            </span>
          </li>
        ))}
      </ul>
      {note ? <p className="mt-2 annotation">{note}</p> : null}
    </div>
  );
}

export function FilterBar({
  searchLabel = "Search",
  searchPlaceholder = "Search",
  value,
  onValueChange,
  filters,
  disabledNote,
}: {
  searchLabel?: string | undefined;
  searchPlaceholder?: string | undefined;
  value?: string | undefined;
  onValueChange?: ((v: string) => void) | undefined;
  filters?: ReactNode | undefined;
  disabledNote?: string | undefined;
}) {
  const inputId = useId();
  return (
    <div className="border border-border bg-surface p-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-56 flex-1">
          <label htmlFor={inputId} className="label-sm">
            {searchLabel}
          </label>
          <div className="mt-1 flex items-center gap-2 border border-input bg-background px-2.5 py-1.5">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              id={inputId}
              type="search"
              value={value}
              placeholder={searchPlaceholder}
              onChange={(e) => onValueChange?.(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        {filters}
      </div>
      {disabledNote ? <p className="mt-2 annotation">{disabledNote}</p> : null}
    </div>
  );
}

export function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="label-sm">{label}</legend>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(opt)}
              className={cn(
                "border px-2.5 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function DataTable({
  caption,
  columns,
  rows,
  emptyLabel = "Not yet migrated",
}: {
  caption: string;
  columns: { key: string; label: string; numeric?: boolean | undefined }[];
  rows: Record<string, string | null>[];
  emptyLabel?: string | undefined;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <caption className="mb-2 text-left annotation">{caption}</caption>
        <thead>
          <tr className="border-b border-rule">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={cn("label-sm px-3 py-2", c.numeric ? "text-right" : "text-left")}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-b-0">
              {columns.map((c, ci) => {
                const content = row[c.key] ?? (
                  <span className="text-muted-foreground">{emptyLabel}</span>
                );
                return ci === 0 ? (
                  <th key={c.key} scope="row" className="px-3 py-2.5 text-left font-medium text-foreground">
                    {content}
                  </th>
                ) : (
                  <td
                    key={c.key}
                    className={cn("px-3 py-2.5 text-foreground", c.numeric && "numeric text-right")}
                  >
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode | undefined;
}) {
  return (
    <div className="border border-dashed border-rule bg-inset px-6 py-12 text-center">
      <p className="font-display text-lg text-foreground">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ label = "Loading" }: { label?: string | undefined }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-3 border border-border bg-inset px-4 py-6">
      <Loader2 className="size-4 animate-spin text-muted-foreground" aria-hidden="true" />
      <span className="text-sm text-muted-foreground">{label}…</span>
    </div>
  );
}

export function ErrorState({
  title = "This section didn't load",
  body = "Try again. If the problem continues, the underlying data source may be unavailable.",
  onRetry,
}: {
  title?: string | undefined;
  body?: string | undefined;
  onRetry?: (() => void) | undefined;
}) {
  return (
    <div role="alert" className="border border-destructive/40 bg-destructive/8 px-4 py-5">
      <div className="flex gap-3">
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{body}</p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 border border-input px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-inset"
            >
              Try again
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
