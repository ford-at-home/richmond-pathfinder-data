import { qcewGeographyComparison } from "@/content/region";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function signed(n: number): string {
  const abs = fmt(Math.abs(n));
  return n > 0 ? `+${abs}` : `−${abs}`;
}

export function DelineationSchematic() {
  const latest = [...qcewGeographyComparison]
    .sort((a, b) => a.countySet.localeCompare(b.countySet))
    .at(-1);
  const diff = latest?.difference ?? null;
  const year = latest?.countySet.replace("legacy_vs_current_", "") ?? "";

  return (
    <figure className="border border-border bg-surface">
      <figcaption className="border-b border-border px-4 py-3">
        <h3 className="font-display text-base text-foreground">
          The metro changed between May 2023 and May 2024
        </h3>
        <p className="mt-1 annotation max-w-2xl">
          Caroline County left. King and Queen County entered. QCEW tables hold a 17-county current
          set so industry series can be compared on constant geography. This is not the City of
          Richmond.
        </p>
      </figcaption>
      <div className="grid gap-px bg-rule md:grid-cols-3">
        <div className="bg-surface p-5">
          <p className="label-sm">Left the MSA</p>
          <p className="mt-2 font-display text-xl text-foreground">Caroline County</p>
          <p className="mt-2 annotation">Between the May 2023 and May 2024 OEWS vintages.</p>
        </div>
        <div className="bg-surface p-5">
          <p className="label-sm">Entered the MSA</p>
          <p className="mt-2 font-display text-xl text-foreground">King and Queen County</p>
          <p className="mt-2 annotation">Same vintage break. Not a City of Richmond boundary.</p>
        </div>
        <div className="bg-surface p-5">
          <p className="label-sm">QCEW current vs legacy{year ? `, ${year}` : ""}</p>
          <p className="numeric mt-2 text-[22px] text-foreground">
            {diff == null ? "Not published" : signed(diff)}
          </p>
          <p className="mt-2 annotation">
            Jobs on the current 17-county set minus the legacy set. From qcew_fixed_geography.csv,
            not an occupation total.
          </p>
        </div>
      </div>
    </figure>
  );
}
