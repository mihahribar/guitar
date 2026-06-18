import { STANDARD_TUNING } from '@/shared/utils/musicTheory';

export interface FretPosition {
  stringIndex: number;
  fretNumber: number;
}

/**
 * Absolute (octave-aware) open-string semitone values derived from a tuning
 * supplied as pitch classes.
 *
 * `STANDARD_TUNING` stores pitch classes (mod 12), so a naive `tuning[s] + fret`
 * conflates octaves on the high-E/B and A/D string boundaries — two notes an
 * octave apart would look identical, while a genuine unison would be missed.
 * We walk from the lowest string upward, adding the minimal positive interval to
 * reach the next pitch class, which reproduces standard tuning's real octave
 * layout (perfect-fourth gaps with the major-third G→B exception).
 *
 * @param tuning - Open-string pitch classes (0-11), low string last
 * @returns Absolute open-string semitone values (arbitrary but consistent base)
 */
export function absoluteOpenPitches(tuning: readonly number[] = STANDARD_TUNING): number[] {
  const last = tuning.length - 1;
  const abs: number[] = [];
  abs[last] = tuning[last];
  for (let i = last - 1; i >= 0; i--) {
    const interval = (tuning[i] - tuning[i + 1] + 12) % 12;
    abs[i] = abs[i + 1] + interval;
  }
  return abs;
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
