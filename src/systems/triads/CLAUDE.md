# Triads

- **Triad**: root, third and fifth, one note per string on three adjacent strings (close voicing)
- **String sets**: EAD, ADG, DGB, GBE, identified by their low string (5 = low E … 2 = G); multi-select
- **Inversions**: root position (root in the bass), 1st (third in the bass), 2nd (fifth in the bass); one colour each
- **Qualities**: major, minor, diminished, augmented; dots are labelled by chord tone (R, 3/♭3, 5/♭5/♯5)
- **Generated from pitch**: each higher string takes the lowest pitch above the previous note (`absoluteOpenPitches`), so the G-B shift is automatic
- **Walk**: one shared `anchorFret`; `←`/`→` step the lead triad on the lowest selected set, and every other set shows its triads nearest the anchor
- **Shared with 7ths**: the builder (`src/shared/utils/voicings.ts`) and the selection reducer (`src/shared/utils/voicingSelection.ts`) are shared; `utils/triads.ts` and `hooks/useTriadsState.ts` are thin wrappers over them
- **String index 0 is the high E** (matches `STANDARD_TUNING`/`STRING_NAMES`)

When changing `utils/triads.ts` or the shared voicing code, update the tests of both systems and check every root, quality and string set.
