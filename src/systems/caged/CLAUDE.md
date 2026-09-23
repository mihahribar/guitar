# CAGED system

- **5 moveable shapes** (C, A, G, E, D) for both major and minor; minor patterns are a parallel set with flattened thirds, kept together in `CAGED_SHAPES_BY_QUALITY` and selected at runtime by `chordQuality`.
- **Major and minor variants share** colours and root note positions for each shape.
- **Intervals**: major chord 0, 4, 7; minor chord 0, 3, 7. Pentatonic: major 0, 2, 4, 7, 9; minor 0, 3, 5, 7, 10.
- **`buildCAGEDSequence`** in `hooks/useCAGEDSequence.ts` is pure and is reused by the reducer in `hooks/useCAGEDState.ts`; changes to the walk affect selection behaviour too.

When changing CAGED logic, update the `useCAGEDState` tests and check all shapes, qualities and positions on the fretboard.
