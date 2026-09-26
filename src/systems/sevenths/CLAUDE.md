# 7ths (seventh chords)

- **Seventh chord**: root, third, fifth and seventh, one note per string on four strings
- **Qualities**: maj7, 7, m7, m7♭5, °7; each lowers one chord tone of the previous by a semitone. Dots are labelled by chord tone (R, 3/♭3, 5/♭5, 7/♭7/♭♭7)
- **String sets**: `e-dgb` (drop 3, A string muted), `adgb` and `dgbe` (drop 2), in that order; `↑`/`↓` step one set along it. Only these three, matching the 6th-, 5th- and 4th-string-root chart the tab is based on
- **Tone order**: each set stores its root-position tones low string first (drop 3: R 7 3 5, drop 2: R 5 7 3); inversion `k` moves every tone up `k` chord tones
- **Inversions**: root position, 1st, 2nd, 3rd; one colour each (the first three match Triads)
- **Generated from pitch**: each higher string takes the lowest pitch above the previous note (`absoluteOpenPitches`), so the G-B shift is automatic
- **Shared with Triads**: the builder (`src/shared/utils/voicings.ts`) and the selection reducer (`src/shared/utils/voicingSelection.ts`)
- **String index 0 is the high E** (matches `STANDARD_TUNING`/`STRING_NAMES`)

When changing `utils/sevenths.ts` or the shared voicing code, update the tests of both systems and check every root, quality and string set against a real guitar.
