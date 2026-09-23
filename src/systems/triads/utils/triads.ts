import type { CSSProperties } from 'react';
import type { StringIndex } from '@/shared/types/core';
import {
  FRETBOARD_CONSTANTS,
  STANDARD_TUNING,
  absoluteOpenPitches,
} from '@/shared/utils/musicTheory';
import { createSplitColorStyle } from '@/shared/utils/splitColor';
import { INVERSIONS, STRINGS_PER_TRIAD, TRIAD_QUALITIES } from '../constants';
import type { ChordTone, Inversion, Triad, TriadNote, TriadQuality } from '../types';

const OCTAVE = FRETBOARD_CONSTANTS.CHROMATIC_OCTAVE;
const OPEN_PITCHES = absoluteOpenPitches(STANDARD_TUNING);
/** Every inversion, in order */
export const ALL_INVERSIONS: readonly Inversion[] = [0, 1, 2];
const INVERSION_COUNT = ALL_INVERSIONS.length;

/** Pitch class of a chord tone */
function tonePitchClass(root: number, quality: TriadQuality, tone: ChordTone): number {
  return (root + TRIAD_QUALITIES[quality].intervals[tone]) % OCTAVE;
}

/**
 * Build a close-voiced triad on three adjacent strings.
 *
 * The inversion's bass tone sits on `lowString` at `bassFret`; each higher
 * string takes the next chord tone at the lowest pitch above the previous note.
 * Frets are derived from real pitches, so the G–B major-third shift appears
 * automatically.
 *
 * @param root - Pitch class of the triad root
 * @param quality - Triad quality
 * @param inversion - Which chord tone is in the bass
 * @param lowString - Thickest string of the set
 * @param bassFret - Fret of the bass note on `lowString` (must hold the bass tone)
 */
export function buildTriad(
  root: number,
  quality: TriadQuality,
  inversion: Inversion,
  lowString: StringIndex,
  bassFret: number
): Triad {
  const notes: TriadNote[] = [];
  let pitch = OPEN_PITCHES[lowString] + bassFret;

  for (let s = 0; s < STRINGS_PER_TRIAD; s++) {
    const stringIndex = (lowString - s) as StringIndex;
    const tone = ((inversion + s) % INVERSION_COUNT) as ChordTone;
    const pitchClass = tonePitchClass(root, quality, tone);
    if (s > 0) {
      // Lowest pitch strictly above the previous note with this pitch class
      pitch += (((pitchClass - pitch) % OCTAVE) + OCTAVE) % OCTAVE || OCTAVE;
    }
    notes.push({ stringIndex, fret: pitch - OPEN_PITCHES[stringIndex], pitchClass, tone });
  }

  return {
    inversion,
    lowString,
    position: Math.min(...notes.map((n) => n.fret)),
    notes,
  };
}

/**
 * Every triad of every inversion that fits on the fretboard on one string set,
 * ordered up the neck (which cycles root → 1st → 2nd naturally).
 */
export function buildSequence(
  root: number,
  quality: TriadQuality,
  lowString: StringIndex
): Triad[] {
  const triads: Triad[] = [];

  for (const inversion of ALL_INVERSIONS) {
    const bassPitchClass = tonePitchClass(root, quality, inversion);
    const firstFret = (bassPitchClass - STANDARD_TUNING[lowString] + OCTAVE) % OCTAVE;

    for (let bassFret = firstFret; bassFret <= FRETBOARD_CONSTANTS.MAX_FRET; bassFret += OCTAVE) {
      const triad = buildTriad(root, quality, inversion, lowString, bassFret);
      const fits = triad.notes.every(
        ({ fret }) => fret >= 0 && fret <= FRETBOARD_CONSTANTS.MAX_FRET
      );
      if (fits) triads.push(triad);
    }
  }

  return triads.sort((a, b) => a.position - b.position || a.inversion - b.inversion);
}

/** The triad of `inversion` whose position is closest to `anchorFret` */
export function findNearest(
  sequence: readonly Triad[],
  inversion: Inversion,
  anchorFret: number
): Triad | undefined {
  let best: Triad | undefined;
  for (const triad of sequence) {
    if (triad.inversion !== inversion) continue;
    if (!best || Math.abs(triad.position - anchorFret) < Math.abs(best.position - anchorFret)) {
      best = triad;
    }
  }
  return best;
}

/** Move an inversion `steps` along, wrapping 2nd back to root position */
export function rotateInversion(inversion: Inversion, steps: number): Inversion {
  return ((((inversion + steps) % INVERSION_COUNT) + INVERSION_COUNT) %
    INVERSION_COUNT) as Inversion;
}

/** Selected inversions as a sorted, duplicate-free list */
export function sortInversions(inversions: readonly Inversion[]): Inversion[] {
  return [...new Set(inversions)].sort((a, b) => a - b);
}

/**
 * The triads to draw on one string set: every occurrence of the selected
 * inversions when `wholeNeck` is on, otherwise the one of each nearest the anchor.
 */
export function visibleTriads(
  sequence: readonly Triad[],
  inversions: readonly Inversion[],
  anchorFret: number,
  wholeNeck: boolean
): Triad[] {
  if (wholeNeck) return sequence.filter((triad) => inversions.includes(triad.inversion));
  return inversions
    .map((inversion) => findNearest(sequence, inversion, anchorFret))
    .filter((triad): triad is Triad => triad !== undefined)
    .sort((a, b) => a.position - b.position);
}

/** Stable string-fret key for membership lookups */
export function triadPositionKey(stringIndex: number, fret: number): string {
  return `${stringIndex}-${fret}`;
}

/** Map each fretboard position to the inversions of the triads covering it */
export function buildPositionMap(triads: readonly Triad[]): Map<string, Inversion[]> {
  const map = new Map<string, Inversion[]>();
  for (const triad of triads) {
    for (const { stringIndex, fret } of triad.notes) {
      const key = triadPositionKey(stringIndex, fret);
      const inversions = map.get(key);
      if (!inversions) {
        map.set(key, [triad.inversion]);
      } else if (!inversions.includes(triad.inversion)) {
        inversions.push(triad.inversion);
      }
    }
  }
  for (const inversions of map.values()) inversions.sort((a, b) => a - b);
  return map;
}

/** Solid colour for one inversion, hard-edged stripes for positions shared by several */
export function createInversionStyle(inversions: readonly Inversion[]): CSSProperties | undefined {
  return createSplitColorStyle(inversions.map((inversion) => INVERSIONS[inversion].color));
}

/** Chord-tone label (R, 3, ♭3, 5, ♭5, ♯5) for a pitch class, or undefined if it isn't in the triad */
export function toneLabel(
  root: number,
  quality: TriadQuality,
  pitchClass: number
): string | undefined {
  const { intervals, toneLabels } = TRIAD_QUALITIES[quality];
  const index = intervals.indexOf((pitchClass - root + OCTAVE) % OCTAVE);
  return index >= 0 ? toneLabels[index] : undefined;
}

/** Lowest and highest fret used by the given triads */
export function triadsFretRange(triads: readonly Triad[]): [number, number] | undefined {
  const frets = triads.flatMap((triad) => triad.notes.map((n) => n.fret));
  return frets.length > 0 ? [Math.min(...frets), Math.max(...frets)] : undefined;
}
