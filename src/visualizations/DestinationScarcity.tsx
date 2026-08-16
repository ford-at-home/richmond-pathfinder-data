import { useState, useEffect } from "react";
import { constraints, type Constraint } from "@/content/analysis";
import { commas, dollars } from "@/lib/chart";

const noViable = constraints.filter((c) => c.viable === 0);
const totalLost = constraints.reduce((s, c) => s + c.lost, 0);

function requiredConstraint(): Constraint {
  const row = constraints[0];
  if (!row) throw new Error("constraints.json has no rows");
  return row;
}

export default function DestinationScarcity() {
  const [selected, setSelected] = useState<Constraint>(requiredConstraint);
  const [showAll, setShowAll] = useState(false);
  const [interactive, setInteractive] = useState(false);
  useEffect(() => setInteractive(true), []);

  const rows = showAll ? constraints : constraints.slice(0, 12);

  return (
    <div className="scarcity" data-interactive={interactive || undefined}>
      <p className="scarcity__lede">
        Each row is an occupation that lost employment. The squares are its O*NET-related
        occupations — the work a displaced person is closest to qualified for. Filled squares are
        the ones that are actually present in Richmond at scale, growing, better paid and not
        themselves exposed.
      </p>

      <ul className="scarcity__rows">
        {rows.map((c) => (
          <li key={c.code}>
            <button
              type="button"
              className="scarcity__row"
              data-active={selected.code === c.code || undefined}
              data-none={c.viable === 0 || undefined}
              onClick={() => setSelected(c)}
              onMouseEnter={() => setSelected(c)}
              aria-label={`${c.title}: ${c.viable} viable destinations out of ${c.neighbours}`}
            >
              <span className="scarcity__title">{c.title}</span>
              <span className="scarcity__lost">−{commas(c.lost)}</span>
              <span className="scarcity__waffle" aria-hidden="true">
                {Array.from({ length: c.neighbours }, (_, i) => (
                  <span key={i} className="cell" data-viable={i < c.viable || undefined} />
                ))}
              </span>
              <span className="scarcity__ratio">
                {c.viable}/{c.neighbours}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {constraints.length > 12 && (
        <button type="button" className="chip" onClick={() => setShowAll((v) => !v)}>
          {showAll ? "Show the twelve largest losses" : `Show all ${constraints.length}`}
        </button>
      )}

      <div className="scarcity__detail" aria-live="polite">
        <h3>{selected.title}</h3>
        <p className="detail__meta">
          {commas(selected.lost)} jobs lost · {dollars(selected.wage)} mean wage ·{" "}
          {selected.neighbours} related occupations
        </p>
        <dl>
          <div>
            <dt>Not present in Richmond at scale</dt>
            <dd>{selected.absent}</dd>
          </div>
          <div>
            <dt>Exposed themselves</dt>
            <dd>{selected.exposed}</dd>
          </div>
          <div>
            <dt>Shrinking</dt>
            <dd>{selected.shrinking}</dd>
          </div>
          <div>
            <dt>Pay less</dt>
            <dd>{selected.paysLess}</dd>
          </div>
          <div className="scarcity__viable">
            <dt>Viable destinations</dt>
            <dd>{selected.viable}</dd>
          </div>
        </dl>
        <p className="detail__note">
          A related occupation can fail more than one of these conditions, so the reasons overlap
          and do not sum to {selected.neighbours}.
        </p>
      </div>

      <p className="explorer__caveat">
        Across all {constraints.length} declining occupations — {commas(totalLost)} jobs —{" "}
        {noViable.length} have <strong>no</strong> viable adjacent destination at all. The
        constraint is not that displaced workers are unwilling to move sideways; it is that the work
        beside them is failing at the same time. Adjacency here is O*NET's related-occupation list,
        which describes skill overlap rather than any employer's willingness to hire across it.
      </p>
    </div>
  );
}
