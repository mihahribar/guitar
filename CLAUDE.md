# CAGED Visualizer

React + TypeScript app for learning guitar: CAGED chord shapes (major and minor), three-notes-per-string
scales, triads and rhythm practice. Live at [caged.hribar.org](https://caged.hribar.org); every push to `main`
deploys to GitHub Pages.

System-specific notes live in `src/systems/<system>/CLAUDE.md`.

## TypeScript is held at 6, not 7

TypeScript 7 type-checks this project cleanly, but `typescript-eslint` refuses
to load under it (peer range `<6.1.0`), which breaks `npm run lint` and the
pre-commit hook. Revisit once typescript-eslint#10940 ships TS 7 support.
Note that TS 7 also removed `baseUrl`, which is why `tsconfig.app.json` uses
relative `paths` entries instead.

## System isolation

Each learning system in `src/systems/` is self-contained. Systems may import from `@/shared`
but never from each other; anything two systems need goes in `src/shared/`.

## Pattern Selection (shared by CAGED, 3NPS and Triads)

All three visualizers use the same interaction, and it is the thing to preserve when
changing either one:

- **Multi-select chips**: tapping a chip toggles that pattern on the fretboard; at least one always stays selected. Shift-click (or `⇧` + the number key) reduces the selection to just that one.
- **Group walk**: `←`/`→` move _every_ selected entry one step along the sequence, so a stacked selection keeps its spacing as it travels up the neck. With one selected this is plain next/previous.
- **Selection is state, "show all" is derived**: CAGED stores `selectedPositions: number[]` (indices into the walk) and derives `showAllShapes` from "every position selected". 3NPS stores `degrees: ModeDegree[]` plus an `anchorFret`, with `wholeNeck` as a separate toggle; Triads follows 3NPS with `inversions` and `stringSets`.
- **Overlapping notes split their colour**: `createGradientStyle` (CAGED) and the shared `createSplitColorStyle` (3NPS, Triads) render hard-edged segments, one per pattern covering that position.
- **Overlays follow the selection**: CAGED's pentatonic and scale overlays box themselves around the union of the selected shapes, falling back to full-neck maps when everything is selected.

## Constraints

- **Music theory accuracy**: calculations must be mathematically correct; verify against a real guitar.
- **Fretboard**: 21 frets (`FRETBOARD_CONSTANTS.MAX_FRET`), standard tuning (E-A-D-G-B-E).
- **Accessibility**: keyboard navigation and ARIA labels; mobile layout matters.

## Common Gotchas

- **Fret calculations**: off-by-one errors are the usual bug.
- **TailwindCSS 4.x**: uses different syntax than v3.x.
- **Mobile layout**: the fretboard display needs special mobile considerations.

## Testing

- Run `npm run lint` and `npm run test:run` before committing.
- Pure logic is tested: pattern builders and reducers are pure functions kept outside components so they can be tested directly.
- Components are not: UI is verified by hand, in desktop and mobile layouts.
