# 3NPS (Three Notes Per String)

- **Dominoes**: 6 consecutive notes of the parent major scale, 3 on each of two adjacent strings, named after the starting degree (Ionian … Locrian)
- **Full positions**: 18 notes across all 6 strings, named after the starting degree on the low E string
- **Generated from pitch**: frets come from absolute open-string pitches (`absoluteOpenPitches`), so the G-B major-third shift (+1 fret on the upper string) is automatic
- **String index 0 is the high E** (matches `STANDARD_TUNING`/`STRING_NAMES`)
- **Whole Neck**: off shows one pattern per selected mode near the anchor fret; on shows every occurrence of those modes up the neck

When changing pattern logic in `utils/threeNps.ts`, update its tests and check every root, mode and string pair.
