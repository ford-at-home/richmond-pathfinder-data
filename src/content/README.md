# Content modules

Typed placeholder data for the scaffold. Presentation never hardcodes content; it imports from here.

- `types.ts` — the content model. Extend rather than replace.
- `research.ts` — research stories and the source register.
- `transitions.ts` — occupations, transition edges, legend bands (Cytoscape.js input).
- `capacity.ts` — capacity progression stages, evidence sections, scenario controls.
- `region.ts` — regional measures, localities, limitations (MapLibre + table input).
- `methodology.ts` — definitions, limitations, source-handling rules.

## Migration rules

1. Every record has `isPlaceholder`. Set it to `false` only when the content is genuinely sourced.
2. Numeric fields stay `null` until a sourced value with a documented method exists.
3. Every value that reaches the UI must be able to supply `Provenance`: source, geography, unit,
   and reference period.
4. Larger datasets should live in `src/content/data/*.json` (or be fetched) and be adapted to these
   types inside the modules above, so component code never changes shape.
5. Geographic files belong in `public/geo/`; imagery in `public/` or `src/assets/`.
