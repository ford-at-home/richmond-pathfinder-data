import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useHydrated, useRouter } from "@tanstack/react-router";
import { csvFormatRows } from "d3-dsv";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Download, RotateCcw } from "lucide-react";
import { useMemo } from "react";

import { PageHeader, ProseContainer } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  datasetById,
  datasets,
  defaultFilters,
  filterRows,
  type DataColumn,
} from "@/content/explorer";
import { deliverFile } from "@/lib/download";
import { getExplorerDataset } from "@/lib/explorer.functions";
import { pinRepoUrl, pinShort, pinSynced } from "@/lib/pin";

const datasetQuery = (dataset: string) =>
  queryOptions({
    queryKey: ["public-dataset", dataset],
    queryFn: () => getExplorerDataset({ data: { dataset } }),
    staleTime: Infinity,
  });
const description =
  "Explore the published Richmond workforce and AI exposure datasets. Filter occupations, compare employment and average pay, and download source or filtered CSV data.";

export const Route = createFileRoute("/data")({
  validateSearch: (search: Record<string, unknown>) => ({
    dataset: typeof search["dataset"] === "string" ? search["dataset"] : "exposure",
    q: typeof search["q"] === "string" ? search["q"] : "",
    family: typeof search["family"] === "string" ? search["family"] : "",
    year: typeof search["year"] === "string" ? search["year"] : "",
    rowType: typeof search["rowType"] === "string" ? search["rowType"] : "",
    minExposure: typeof search["minExposure"] === "string" ? search["minExposure"] : "",
    maxExposure: typeof search["maxExposure"] === "string" ? search["maxExposure"] : "",
    minPay: typeof search["minPay"] === "string" ? search["minPay"] : "",
    sort: typeof search["sort"] === "string" ? search["sort"] : "",
    order: typeof search["order"] === "string" ? search["order"] : "asc",
    page: Number.isFinite(Number(search["page"])) ? Number(search["page"]) : 1,
  }),
  loaderDeps: ({ search }) => ({ dataset: datasetById(search.dataset).id }),
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(datasetQuery(deps.dataset)),
  head: () => ({
    meta: [
      { title: "Data explorer — Richmond Workforce Transition" },
      { name: "description", content: description },
      { property: "og:title", content: "Data explorer — Richmond Workforce Transition" },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DataExplorer,
  errorComponent: () => <DatasetError />,
  notFoundComponent: () => (
    <ProseContainer>
      <h1 className="py-12 text-2xl">Dataset not found</h1>
    </ProseContainer>
  ),
});

function DatasetError() {
  const router = useRouter();
  return (
    <ProseContainer>
      <div role="alert" className="py-12">
        <h1 className="text-2xl">The dataset could not be loaded</h1>
        <Button className="mt-4" onClick={() => void router.invalidate()}>
          Try again
        </Button>
      </div>
    </ProseContainer>
  );
}

const selectClass = "h-10 w-full min-w-0 border border-input bg-background px-3 text-sm";
const numbers = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
function display(value: string, column: DataColumn) {
  if (value === "") return "Not published";
  if (column.key === "vintage") return value;
  if (column.kind === "exposure") return `${(Number(value) * 100).toFixed(2)}%`;
  if (column.kind === "money") return money.format(Number(value));
  if (column.kind === "number") return numbers.format(Number(value));
  return value;
}

function DataExplorer() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const hydrated = useHydrated();
  const dataset = datasetById(search.dataset);
  const { data } = useSuspenseQuery(datasetQuery(dataset.id));
  const filtered = useMemo(
    () => filterRows(data.rows, dataset, search),
    [data.rows, dataset, search],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / 25));
  const page = Math.max(1, Math.min(pageCount, Math.floor(search.page)));
  const visible = filtered.slice((page - 1) * 25, page * 25);
  const families = dataset.group
    ? [...new Set(data.rows.map((row) => row[dataset.group ?? ""] ?? ""))].sort()
    : [];
  const years = dataset.year
    ? [...new Set(data.rows.map((row) => row[dataset.year ?? ""] ?? ""))].sort().reverse()
    : [];
  const update = (key: string, value: string | number) =>
    void navigate({
      search: (prev) => ({ ...prev, [key]: value, page: key === "page" ? Number(value) : 1 }),
      replace: true,
      resetScroll: false,
    });
  const exportBlob = useMemo(
    () =>
      new Blob(
        [
          csvFormatRows([
            data.columns,
            ...filtered.map((row) => data.columns.map((column) => row[column] ?? "")),
          ]),
        ],
        { type: "text/csv;charset=utf-8" },
      ),
    [data.columns, filtered],
  );

  return (
    <ProseContainer className="pb-14">
      <PageHeader
        eyebrow="Evidence / Open data"
        title="Data explorer"
        lead="The published data behind Richmond’s workforce and AI exposure analysis."
      />
      <section aria-label="Dataset and filters" className="border-b border-rule py-7">
        <div className="grid gap-5 lg:grid-cols-[2fr_3fr]">
          <label className="min-w-0 text-sm font-medium">
            Dataset
            <select
              aria-label="Dataset"
              className={`${selectClass} mt-2`}
              value={dataset.id}
              onChange={(e) =>
                void navigate({
                  search: { ...defaultFilters, dataset: e.target.value },
                  resetScroll: false,
                })
              }
            >
              {datasets.map((d) => (
                <option value={d.id} key={d.id}>
                  {d.title}
                </option>
              ))}
            </select>
          </label>
          <p className="self-end text-sm leading-6 text-muted-foreground">{dataset.description}</p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm font-medium">
            Occupation or SOC code
            <Input
              type="search"
              className="mt-2 h-10"
              placeholder="Search occupations"
              value={search.q}
              onChange={(e) => update("q", e.target.value)}
            />
          </label>
          {dataset.group && (
            <label className="min-w-0 text-sm font-medium">
              Occupational family
              <select
                className={`${selectClass} mt-2`}
                value={search.family}
                onChange={(e) => update("family", e.target.value)}
              >
                <option value="">All families</option>
                {families.map((family) => (
                  <option key={family}>{family}</option>
                ))}
              </select>
            </label>
          )}
          {dataset.year && (
            <label className="text-sm font-medium">
              Year
              <select
                aria-label="Year"
                className={`${selectClass} mt-2`}
                value={search.year}
                onChange={(e) => update("year", e.target.value)}
              >
                <option value="">All years</option>
                {years.map((year) => (
                  <option key={year}>{year}</option>
                ))}
              </select>
            </label>
          )}
          {dataset.id === "history" && (
            <label className="text-sm font-medium">
              Row type
              <select
                aria-label="Row type"
                className={`${selectClass} mt-2`}
                value={search.rowType}
                onChange={(e) => update("rowType", e.target.value)}
              >
                <option value="">All row types</option>
                <option value="detailed">Detailed occupations</option>
                <option value="major">Major groups</option>
                <option value="total">Total employment</option>
              </select>
            </label>
          )}
          {dataset.exposure && (
            <fieldset className="min-w-0">
              <legend className="text-sm font-medium">AI exposure (%)</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Input
                  aria-label="Minimum AI exposure (%)"
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  placeholder="Min"
                  value={search.minExposure}
                  onChange={(e) => update("minExposure", e.target.value)}
                  className="h-10"
                />
                <Input
                  aria-label="Maximum AI exposure (%)"
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  placeholder="Max"
                  value={search.maxExposure}
                  onChange={(e) => update("maxExposure", e.target.value)}
                  className="h-10"
                />
              </div>
            </fieldset>
          )}
          {dataset.wage && (
            <label className="text-sm font-medium">
              Minimum average annual pay ($)
              <Input
                type="number"
                min="0"
                step="any"
                placeholder="Any pay"
                className="mt-2 h-10"
                value={search.minPay}
                onChange={(e) => update("minPay", e.target.value)}
              />
            </label>
          )}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={() =>
              void navigate({
                search: { ...defaultFilters, dataset: dataset.id },
                resetScroll: false,
              })
            }
          >
            <RotateCcw />
            Reset filters
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <a href={`/downloads/${dataset.filename}`} download={dataset.filename}>
                <Download />
                Source CSV
              </a>
            </Button>
            <Button
              disabled={!hydrated || filtered.length === 0}
              onClick={() =>
                void deliverFile(exportBlob, `${dataset.filename.replace(".csv", "")}-filtered.csv`)
              }
            >
              <Download />
              Filtered CSV
            </Button>
          </div>
        </div>
      </section>
      <div className="flex flex-wrap items-center justify-between gap-3 py-5">
        <p role="status" aria-live="polite" className="text-sm">
          <strong>{numbers.format(filtered.length)}</strong> of {numbers.format(data.rows.length)}{" "}
          rows ·{" "}
          {filtered.length
            ? `${(page - 1) * 25 + 1}–${Math.min(page * 25, filtered.length)} shown`
            : "No rows shown"}
        </p>
        <label className="flex items-center gap-2 text-sm">
          Sort by
          <select
            aria-label="Sort by"
            className="h-9 max-w-48 border border-input bg-background px-2"
            value={search.sort}
            onChange={(e) => update("sort", e.target.value)}
          >
            <option value="">Source order</option>
            {dataset.columns.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="icon"
            aria-label={search.order === "desc" ? "Sort ascending" : "Sort descending"}
            title={search.order === "desc" ? "Sort ascending" : "Sort descending"}
            onClick={() => update("order", search.order === "desc" ? "asc" : "desc")}
          >
            {search.order === "desc" ? <ArrowDown /> : <ArrowUp />}
          </Button>
        </label>
      </div>
      {filtered.length === 0 ? (
        <div className="border-y border-border py-12">
          <h2 className="text-xl">No rows match these filters</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No matching observations are available. Try another occupation or reset the filters.
          </p>
        </div>
      ) : (
        <div
          className="max-w-full overflow-x-auto border-y border-rule"
          role="region"
          aria-label="Dataset table"
          tabIndex={0}
        >
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">{dataset.title}; filtered published observations</caption>
            <thead className="bg-muted">
              <tr>
                {dataset.columns.map((c) => (
                  <th
                    key={c.key}
                    scope="col"
                    className={`whitespace-nowrap px-4 py-3 text-left font-medium ${c.kind ? "text-right" : ""}`}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((row, i) => (
                <tr
                  key={`${row[dataset.code]}-${row["vintage"] ?? i}`}
                  className="border-t border-border hover:bg-surface"
                >
                  {dataset.columns.map((c) => (
                    <td
                      key={c.key}
                      className={`px-4 py-3 ${c.key === dataset.occupation ? "min-w-64 max-w-80 font-medium" : "whitespace-nowrap"} ${c.kind ? "text-right font-mono text-xs" : ""} ${row[c.key] === "" ? "text-muted-foreground" : ""}`}
                    >
                      {display(row[c.key] ?? "", c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center justify-between py-5">
        <p className="text-sm text-muted-foreground">
          Page {page} of {pageCount}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous page"
            title="Previous page"
            disabled={page <= 1}
            onClick={() => update("page", page - 1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next page"
            title="Next page"
            disabled={page >= pageCount}
            onClick={() => update("page", page + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <section aria-labelledby="provenance" className="border-t border-rule pt-7">
        <h2 id="provenance" className="text-xl">
          Data provenance & limitations
        </h2>
        <p className="mt-3 annotation">Source snapshot {pinShort} · synced {pinSynced} · Richmond, VA MSA (BLS 40060)</p>
        <div className="mt-4 grid gap-5 text-sm leading-6 md:grid-cols-2">
          <p>
            BLS Occupational Employment and Wage Statistics provide employment and average annual
            pay. Anthropic observed task exposure is a single national measure, not a
            Richmond-specific measurement or a prediction of job loss. Zero exposure means no tasks
            were observed in the sample, not proven safety from AI.
          </p>
          <p>
            Blank source cells remain blank in downloads and appear as “Not published” in the table.
            Historical wages are nominal, not inflation-adjusted. Richmond’s geography changed
            between the 2023 and 2024 releases; SOC revisions and overlapping survey panels limit
            comparisons across years.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-5 text-sm">
          <a className="editorial-link" href={pinRepoUrl} target="_blank" rel="noreferrer">
            hack4rva/richmond-ai-impact-analysis
          </a>
          <a className="editorial-link" href="/downloads/CODEBOOK.md" download>
            Download codebook
          </a>
          <Link className="editorial-link" to="/methodology">
            Methodology
          </Link>
        </div>
        <details className="mt-6 border-t border-border py-4">
          <summary className="cursor-pointer font-medium">Column definitions</summary>
          <dl className="mt-4 grid gap-4 md:grid-cols-2">
            {dataset.columns.map((c) => (
              <div key={c.key}>
                <dt className="text-sm font-medium">
                  {c.label}{" "}
                  <span className="font-mono text-xs text-muted-foreground">({c.key})</span>
                </dt>
                <dd className="mt-1 text-sm text-muted-foreground">{c.description}</dd>
              </div>
            ))}
          </dl>
        </details>
      </section>
    </ProseContainer>
  );
}
