import type { TransitionEdge } from "@/content/types";
import type { OriginOption } from "@/content/transitions";
import { cn } from "@/lib/utils";

function zoneDash(gap: number | null): string | undefined {
  if (gap == null || gap === 0) return undefined;
  if (Math.abs(gap) === 1) return "7 5";
  return "2.5 4";
}

function zoneLabel(gap: number | null): string {
  if (gap == null) return "Job-zone gap not published";
  if (gap === 0) return "Same job zone";
  const n = Math.abs(gap);
  return `Job-zone gap ${gap > 0 ? "+" : "−"}${n}`;
}

function replacementLabel(value: number | null): string {
  return value == null ? "Wage replacement not published" : `${value.toFixed(1)}% wage replacement`;
}

export function OriginExplorer({
  origins,
  selectedId,
  onSelect,
  destinations,
}: {
  origins: OriginOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  destinations: TransitionEdge[];
}) {
  const originTitle =
    destinations[0]?.fromTitle ??
    origins.find((o) => o.id === selectedId)?.title ??
    "Selected origin";
  const rowH = 72;
  const padY = 28;
  const height = Math.max(220, padY * 2 + Math.max(destinations.length, 1) * rowH);
  const originY = height / 2;
  const originX = 118;
  const destX = 430;

  return (
    <div className="grid gap-0 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
      <div className="border-b border-border lg:border-b-0 lg:border-r">
        <label className="sr-only" htmlFor="origin-select">
          Origin occupation
        </label>
        <select
          id="origin-select"
          className="w-full border-0 bg-background px-3 py-3 text-sm text-foreground lg:hidden"
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
        >
          {origins.map((o) => (
            <option key={o.id} value={o.id}>
              {o.title}
            </option>
          ))}
        </select>
        <ul className="hidden max-h-[32rem] overflow-y-auto lg:block">
          {origins.map((o) => (
            <li key={o.id}>
              <button
                type="button"
                onClick={() => onSelect(o.id)}
                aria-pressed={o.id === selectedId}
                className={cn(
                  "w-full border-l-2 px-3 py-2.5 text-left text-sm",
                  o.id === selectedId
                    ? "border-signal bg-inset text-foreground"
                    : "border-transparent text-muted-foreground hover:bg-inset hover:text-foreground",
                )}
              >
                {o.title}
                <span className="block annotation">
                  {o.destinationCount} {o.destinationCount === 1 ? "destination" : "destinations"}
                  {o.lost == null ? "" : ` · ${o.lost.toLocaleString("en-US")} jobs lost`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="min-w-0">
        <div className="border-b border-border px-4 py-3">
          <p className="label-sm">From</p>
          <p className="mt-1 font-display text-lg leading-snug text-foreground">{originTitle}</p>
        </div>

        {destinations.length === 0 ? (
          <p className="px-4 py-8 text-sm text-muted-foreground">
            No published outgoing pair for this origin.
          </p>
        ) : (
          <>
            <svg
              viewBox={`0 0 720 ${height}`}
              className="hidden h-auto w-full sm:block"
              aria-hidden="true"
            >
              <rect
                x={originX - 10}
                y={originY - 10}
                width="20"
                height="20"
                fill="var(--paper-0)"
                stroke="var(--signal-500)"
                strokeWidth="1.5"
              />
              <text
                x={originX}
                y={originY - 22}
                textAnchor="middle"
                className="fill-foreground"
                fontSize="11"
                fontFamily="var(--font-family-mono)"
              >
                Origin
              </text>
              {destinations.map((edge, i) => {
                const y = padY + rowH / 2 + i * rowH;
                const dash = zoneDash(edge.zoneGap);
                return (
                  <g key={`${edge.fromId}-${edge.toId}`}>
                    <line
                      x1={originX + 12}
                      y1={originY}
                      x2={destX - 8}
                      y2={y}
                      stroke="var(--ink-900)"
                      strokeWidth="1"
                      strokeDasharray={dash}
                    />
                    <rect
                      x={destX - 7}
                      y={y - 7}
                      width="14"
                      height="14"
                      fill="var(--paper-0)"
                      stroke="var(--ink-900)"
                      strokeWidth="1"
                    />
                    <text
                      x={destX + 16}
                      y={y - 4}
                      fontSize="12"
                      fontFamily="var(--font-family-sans)"
                      className="fill-foreground"
                    >
                      {shortTitle(edge.toTitle)}
                    </text>
                    <text
                      x={destX + 16}
                      y={y + 14}
                      fontSize="11"
                      fontFamily="var(--font-family-mono)"
                      className="fill-muted-foreground"
                    >
                      {edge.replacement == null ? "—" : `${edge.replacement.toFixed(1)}%`}
                      {" · "}
                      {edge.zoneGap == null
                        ? "zone —"
                        : `zone ${edge.zoneGap > 0 ? "+" : ""}${edge.zoneGap}`}
                      {edge.tier ? ` · ${edge.tier}` : ""}
                    </text>
                  </g>
                );
              })}
            </svg>

            <ol className="divide-y divide-border border-t border-border">
              {destinations.map((edge) => (
                <li key={`${edge.fromId}-${edge.toId}`} className="px-4 py-3">
                  <p className="text-sm font-medium text-foreground">{edge.toTitle}</p>
                  <p className="mt-1 annotation">
                    {replacementLabel(edge.replacement)} · {zoneLabel(edge.zoneGap)}
                    {edge.tier ? ` · ${edge.tier}` : ""}
                  </p>
                </li>
              ))}
            </ol>
          </>
        )}

        <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border px-4 py-3 annotation">
          <li className="flex items-center gap-2">
            <span className="inline-block w-8 border-t border-foreground" aria-hidden="true" />
            Same job zone
          </li>
          <li className="flex items-center gap-2">
            <span
              className="inline-block w-8 border-t border-dashed border-foreground"
              aria-hidden="true"
            />
            One-zone gap
          </li>
          <li className="flex items-center gap-2">
            <span
              className="inline-block w-8 border-t border-dotted border-foreground"
              aria-hidden="true"
            />
            Larger zone gap
          </li>
          <li>Labels: destination mean pay as a share of origin pay</li>
        </ul>
      </div>
    </div>
  );
}

function shortTitle(title: string): string {
  return title.length > 42 ? `${title.slice(0, 40)}…` : title;
}
