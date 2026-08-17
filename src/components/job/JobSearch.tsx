import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { originsByFamily, searchOccupations, type WorkforceOccupation } from "@/content/workforce";

function percent(exposure: number): string {
  return `${Math.round(exposure * 100)}%`;
}

function JobRow({ job }: { job: WorkforceOccupation }) {
  return (
    <li className="border-t border-border">
      <Link
        to="/job/$soc"
        params={{ soc: job.soc }}
        className="flex flex-col gap-1 py-3 no-underline sm:flex-row sm:items-baseline sm:justify-between"
      >
        <span className="text-sm text-foreground">{job.title}</span>
        <span className="numeric shrink-0 text-sm text-muted-foreground">
          {percent(job.exposure)}
        </span>
      </Link>
    </li>
  );
}

export function JobSearch() {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const groups = originsByFamily();
    const q = query.trim();
    if (q.length < 2) return groups;
    const hits = new Set(searchOccupations(q, 39).map((o) => o.soc));
    return groups
      .map((g) => ({ ...g, jobs: g.jobs.filter((j) => hits.has(j.soc)) }))
      .filter((g) => g.jobs.length > 0);
  }, [query]);

  const searching = query.trim().length >= 2;
  const empty = searching && visible.length === 0;

  return (
    <div>
      <label className="label-sm" htmlFor="job-search">
        Search jobs
      </label>
      <input
        id="job-search"
        type="search"
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Customer service, bookkeeping, software…"
        autoComplete="off"
        className="mt-2 w-full border border-foreground bg-background px-3 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground"
      />

      {empty ? (
        <p className="mt-6 text-sm text-muted-foreground" role="status">
          No jobs on this list match that name.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-10">
          {visible.map((g) => (
            <section key={g.family} aria-labelledby={`family-${g.family}`}>
              <h2
                id={`family-${g.family}`}
                className="font-display text-lg font-semibold text-foreground"
              >
                {g.family}
              </h2>
              <p className="mt-1 annotation">
                {g.jobs.length} {g.jobs.length === 1 ? "job" : "jobs"}
              </p>
              <div className="mt-4 hidden flex-row items-baseline justify-between border-b border-border pb-2 text-sm text-muted-foreground sm:flex">
                <span className="font-medium">Job</span>
                <span className="numeric shrink-0 font-medium">AI exposure</span>
              </div>
              <ul className="mt-2 grid grid-cols-1 sm:mt-0">
                {g.jobs.map((job) => (
                  <JobRow key={job.soc} job={job} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
