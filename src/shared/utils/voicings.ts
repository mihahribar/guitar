/**
 * Chord voicings on string sets, shared by the Triads and 7ths systems
 *
 * A voicing puts one chord tone on each string of a set. Frets are derived
 * from real pitches, so the G-B major-third shift appears automatically.
 */

import type { Voicing, VoicingLayout, VoicingNote } from '../types/voicing';
import { FRETBOARD_CONSTANTS, STANDARD_TUNING, absoluteOpenPitches } from './musicTheory';

const OCTAVE = FRETBOARD_CONSTANTS.CHROMATIC_OCTAVE;
const OPEN_PITCHES = absoluteOpenPitches(STANDARD_TUNING);

/**
 * Build one voicing. The inversion's bass tone sits on the thickest string at
 * `bassFret`; each higher string takes its chord tone at the lowest pitch above
 * the previous note. Inverting moves every tone in the layout up one chord tone.
 *
 * @param root - Pitch class of the chord root
 * @param intervals - Semitones above the root for each chord tone
 * @param layout - Strings and root-position tone order
 * @param inversion - Which chord tone is in the bass
 * @param bassFret - Fret of the bass note (must hold the bass tone)
 */
function buildVoicing<I extends number>(
  root: number,
  intervals: readonly number[],
  layout: VoicingLayout,
  inversion: I,
  bassFret: number
): Voicing<I> {
  const notes: VoicingNote[] = [];
  let pitch = OPEN_PITCHES[layout.strings[0]] + bassFret;

  layout.strings.forEach((stringIndex, s) => {
    const tone = (layout.toneOrder[s] + inversion) % intervals.length;
    const pitchClass = (root + intervals[tone]) % OCTAVE;
    if (s > 0) {
      // Lowest pitch strictly above the previous note with this pitch class
      pitch += (((pitchClass - pitch) % OCTAVE) + OCTAVE) % OCTAVE || OCTAVE;
    }
    notes.push({ stringIndex, fret: pitch - OPEN_PITCHES[stringIndex], pitchClass, tone });
  });

  return { inversion, position: Math.min(...notes.map((n) => n.fret)), notes };
}

/**
 * Every voicing of the given inversions that fits on the fretboard, ordered up
 * the neck (which cycles through the inversions naturally).
 */
export function buildVoicingSequence<I extends number>(
  root: number,
  intervals: readonly number[],
  layout: VoicingLayout,
  inversions: readonly I[]
): Voicing<I>[] {
  const voicings: Voicing<I>[] = [];

  for (const inversion of inversions) {
    const bassTone = (layout.toneOrder[0] + inversion) % intervals.length;
    const bassPitchClass = (root + intervals[bassTone]) % OCTAVE;
    const firstFret = (bassPitchClass - STANDARD_TUNING[layout.strings[0]] + OCTAVE) % OCTAVE;

    for (let bassFret = firstFret; bassFret <= FRETBOARD_CONSTANTS.MAX_FRET; bassFret += OCTAVE) {
      const voicing = buildVoicing(root, intervals, layout, inversion, bassFret);
      const fits = voicing.notes.every(
        ({ fret }) => fret >= 0 && fret <= FRETBOARD_CONSTANTS.MAX_FRET
      );
      if (fits) voicings.push(voicing);
    }
  }

  return voicings.sort((a, b) => a.position - b.position || a.inversion - b.inversion);
}

/** The voicing of `inversion` whose position is closest to `anchorFret` */
export function findNearestVoicing<V extends Voicing>(
  sequence: readonly V[],
  inversion: V['inversion'],
  anchorFret: number
): V | undefined {
  let best: V | undefined;
  for (const voicing of sequence) {
    if (voicing.inversion !== inversion) continue;
    if (!best || Math.abs(voicing.position - anchorFret) < Math.abs(best.position - anchorFret)) {
      best = voicing;
    }
  }
  return best;
}

/**
 * The voicings to draw on one string set: every occurrence of the selected
 * inversions when `wholeNeck` is on, otherwise the one of each nearest the anchor.
 */
export function visibleVoicings<V extends Voicing>(
  sequence: readonly V[],
  inversions: readonly V['inversion'][],
  anchorFret: number,
  wholeNeck: boolean
): V[] {
  if (wholeNeck) return sequence.filter((voicing) => inversions.includes(voicing.inversion));
  return inversions
    .map((inversion) => findNearestVoicing(sequence, inversion, anchorFret))
    .filter((voicing): voicing is V => voicing !== undefined)
    .sort((a, b) => a.position - b.position);
}

/** Move an inversion `steps` along, wrapping the last back to root position */
export function rotateInversion<I extends number>(inversion: I, steps: number, count: number): I {
  return ((((inversion + steps) % count) + count) % count) as I;
}

/** Selected inversions as a sorted, duplicate-free list */
export function sortInversions<I extends number>(inversions: readonly I[]): I[] {
  return [...new Set(inversions)].sort((a, b) => a - b);
}

/** Stable string-fret key for membership lookups */
export function voicingPositionKey(stringIndex: number, fret: number): string {
  return `${stringIndex}-${fret}`;
}

/** Map each fretboard position to the inversions of the voicings covering it */
export function buildVoicingPositionMap<I extends number>(
  voicings: readonly Voicing<I>[]
): Map<string, I[]> {
  const map = new Map<string, I[]>();
  for (const voicing of voicings) {
    for (const { stringIndex, fret } of voicing.notes) {
      const key = voicingPositionKey(stringIndex, fret);
      const inversions = map.get(key);
      if (!inversions) {
        map.set(key, [voicing.inversion]);
      } else if (!inversions.includes(voicing.inversion)) {
        inversions.push(voicing.inversion);
      }
    }
  }
  for (const inversions of map.values()) inversions.sort((a, b) => a - b);
  return map;
}

/** Lowest and highest fret used by the given voicings */
export function voicingsFretRange(voicings: readonly Voicing[]): [number, number] | undefined {
  const frets = voicings.flatMap((voicing) => voicing.notes.map((n) => n.fret));
  return frets.length > 0 ? [Math.min(...frets), Math.max(...frets)] : undefined;
}

/** Chord-tone label (R, 3, ♭3, 5, ♭7, ...) for a pitch class, or undefined if it isn't in the chord */
export function chordToneLabel(
  chord: { intervals: readonly number[]; toneLabels: readonly string[] },
  root: number,
  pitchClass: number
): string | undefined {
  const index = chord.intervals.indexOf((pitchClass - root + OCTAVE) % OCTAVE);
  return index >= 0 ? chord.toneLabels[index] : undefined;
}
