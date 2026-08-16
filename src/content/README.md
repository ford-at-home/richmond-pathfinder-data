# Content modules

Presentation imports from here rather than hardcoding copy.

- `types.ts` — the content model.
- `research.ts` — the three pinned reports and the source register.
- `figures.ts` — interactive figure metadata and section placement.
- `occupations.ts` / `analysis.ts` — occupation join and chart tables from `data/*.json`.
- `transitions.ts` — screened pairs from `pathways_reachable.csv`.
- `capacity.ts` — reserved six-stage calculator (values remain null).
- `region.ts` — MSA measures and QCEW series.
- `methodology.ts` — pinned methodology and robustness documents.

## Migration rules

1. Every record has `isPlaceholder`. Set it to `false` only when the content is genuinely sourced.
2. Numeric fields stay `null` until a sourced value with a documented method exists.
3. Every value that reaches the UI must be able to supply `Provenance`: source, geography, unit,
   and reference period.
4. Larger datasets live in `src/content/data/*.json`, rebuilt from `data/source/output/` by
   `node scripts/build-data.mjs`.
5. Pinned markdown and CSV under `data/source/` are not edited.
