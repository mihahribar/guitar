import { STANDARD_TUNING, absoluteOpenPitches } from '@/shared/utils/musicTheory';

// Re-exported for existing CAGED consumers; the implementation lives in shared.
export { absoluteOpenPitches };

export interface FretPosition {
  stringIndex: number;
  fretNumber: number;
}

/**
 * Remove unison duplicates — the same absolute pitch reachable on two different
 * strings — keeping only the lowest-fret occurrence of each pitch.
 *
 * Adjacent strings are 4–5 semitones apart, so a unison always surfaces as a
 * higher fret on the thicker string and a lower fret on the next thinner string
 * (e.g. G string fret 13 == B string fret 9). Keeping the lowest fret keeps the
 * playing position tight and drops the redundant edge note.
 *
 * @param positions - Candidate fret positions to de-duplicate
 * @param tuning - Open-string pitch classes used to compute absolute pitch
 * @returns Positions with unison duplicates removed (lowest fret kept)
 */
export function dedupeUnisonsByLowestFret(
  positions: readonly FretPosition[],
  tuning: readonly number[] = STANDARD_TUNING
): FretPosition[] {
  const openAbs = absoluteOpenPitches(tuning);
  const lowestByPitch = new Map<number, FretPosition>();

  for (const pos of positions) {
    const pitch = openAbs[pos.stringIndex] + pos.fretNumber;
    const existing = lowestByPitch.get(pitch);
    if (!existing || pos.fretNumber < existing.fretNumber) {
      lowestByPitch.set(pitch, pos);
    }
  }

  return [...lowestByPitch.values()];
}

/** Stable string-fret key for membership lookups. */
export function positionKey(stringIndex: number, fretNumber: number): string {
  return `${stringIndex}-${fretNumber}`;
}
