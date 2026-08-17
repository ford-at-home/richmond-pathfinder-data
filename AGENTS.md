<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

The public door is **Find a job** (`/`): 39 exposed starting jobs in the four
families that hold three-quarters of Richmond's measured AI use. `/job/$soc`
shows the next jobs that pay more and use AI less.

Do not restore six equal research peers as primary nav. Evidence lives at
`/research`. `/transition-map` is the 28-row published pair table, not the
front-door engine. Do not fill the capacity calculator or invent occupation ×
locality rows. Do not copy mock destinations. Refresh the route slice with
`node scripts/pin-workforce.mjs` until phase C lands.

Job-screen sentences are built in `src/content/screen/card.ts`, not written into
JSX, and each one names a claim in `src/content/claims.ts`. A sentence added to a
component is invisible to `scripts/build-appendix.ts` and has no audit row.
`tests/screen-copy.test.ts` runs the pre-publish checklist over all 39 cards:
never print the exposure score, every number gets a noun, every pay figure says
it is an average, every empty is a written empty state. Regenerate the appendix
with `bun run appendix` after any copy change.

