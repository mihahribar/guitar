import type { CSSProperties } from 'react';
import type { StringIndex } from '@/shared/types/core';
import {
  FRETBOARD_CONSTANTS,
  STANDARD_TUNING,
  absoluteOpenPitches,
} from '@/shared/utils/musicTheory';
import { MAJOR_SCALE_STEPS, MODES, NOTES_PER_STRING } from '../constants';
import type { ModeDegree, NpsNote, NpsPattern, NpsScope } from '../types';

const OCTAVE = FRETBOARD_CONSTANTS.CHROMATIC_OCTAVE;
const OPEN_PITCHES = absoluteOpenPitches(STANDARD_TUNING);
/** Every mode degree, in scale order */
export const ALL_DEGREES: readonly ModeDegree[] = [0, 1, 2, 3, 4, 5, 6];
const DEGREE_COUNT = ALL_DEGREES.length;

/** Semitones from degree `degree` of the major scale to the next scale note */
function stepAfter(degree: number): number {
  const d = degree % 7;
  return d === 6 ? OCTAVE - MAJOR_SCALE_STEPS[6] : MAJOR_SCALE_STEPS[d + 1] - MAJOR_SCALE_STEPS[d];
}

function scopeStrings(scope: NpsScope): { lowString: StringIndex; stringCount: number } {
  return scope.kind === 'all'
    ? { lowString: 5, stringCount: 6 }
    : { lowString: scope.lowString, stringCount: 2 };
}

/**
 * Build a 3-notes-per-string pattern by walking consecutive major-scale notes,
 * three per string, from `lowString` toward the high E string.
 *
 * Frets are derived from real pitches, so the G–B major-third shift appears
 * automatically.
 *
 * @param root - Pitch class of the parent major scale
 * @param degree - Scale degree the pattern starts on (mode)
 * @param lowString - Thickest string of the pattern
 * @param stringCount - Number of strings (2 for a domino, 6 for a full position)
 * @param startFret - Fret of the first note on `lowString` (must hold that degree)
 */
export function buildPattern(
  root: number,
  degree: ModeDegree,
  lowString: StringIndex,
  stringCount: number,
  startFret: number
): NpsPattern {
  const notes: NpsNote[] = [];
  let pitch = OPEN_PITCHES[lowString] + startFret;
  let currentDegree: number = degree;

  for (let s = 0; s < stringCount; s++) {
    const stringIndex = (lowString - s) as StringIndex;
    for (let n = 0; n < NOTES_PER_STRING; n++) {
      notes.push({
        stringIndex,
        fret: pitch - OPEN_PITCHES[stringIndex],
        pitchClass: (root + MAJOR_SCALE_STEPS[currentDegree % 7]) % OCTAVE,
      });
      pitch += stepAfter(currentDegree);
      currentDegree++;
    }
  }

  return { degree, startFret, notes };
}

/**
 * All patterns of every mode that fit on the fretboard for the given scope,
 * ordered up the neck (which cycles Ionian → Dorian → … naturally).
 */
export function buildSequence(root: number, scope: NpsScope): NpsPattern[] {
  const { lowString, stringCount } = scopeStrings(scope);
  const patterns: NpsPattern[] = [];

  for (const degree of ALL_DEGREES) {
    const pitchClass = (root + MAJOR_SCALE_STEPS[degree]) % OCTAVE;
    const firstFret = (pitchClass - STANDARD_TUNING[lowString] + OCTAVE) % OCTAVE;

    for (
      let startFret = firstFret;
      startFret <= FRETBOARD_CONSTANTS.MAX_FRET;
      startFret += OCTAVE
    ) {
      const pattern = buildPattern(root, degree, lowString, stringCount, startFret);
      const fits = pattern.notes.every(
        ({ fret }) => fret >= 0 && fret <= FRETBOARD_CONSTANTS.MAX_FRET
      );
      if (fits) patterns.push(pattern);
    }
  }

  return patterns.sort((a, b) => a.startFret - b.startFret || a.degree - b.degree);
}

/** The pattern of `degree` whose start fret is closest to `anchorFret` */
export function findNearest(
  sequence: readonly NpsPattern[],
  degree: ModeDegree,
  anchorFret: number
): NpsPattern | undefined {
  let best: NpsPattern | undefined;
  for (const pattern of sequence) {
    if (pattern.degree !== degree) continue;
    if (!best || Math.abs(pattern.startFret - anchorFret) < Math.abs(best.startFret - anchorFret)) {
      best = pattern;
    }
  }
  return best;
}

/** Move a mode degree `steps` scale degrees along, wrapping Locrian back to Ionian */
export function rotateDegree(degree: ModeDegree, steps: number): ModeDegree {
  return ((((degree + steps) % DEGREE_COUNT) + DEGREE_COUNT) % DEGREE_COUNT) as ModeDegree;
}

/** Selected degrees as a sorted, duplicate-free list */
export function sortDegrees(degrees: readonly ModeDegree[]): ModeDegree[] {
  return [...new Set(degrees)].sort((a, b) => a - b);
}

/** One pattern per selected mode — the occurrence nearest `anchorFret` — ordered up the neck */
export function anchoredPatterns(
  sequence: readonly NpsPattern[],
  degrees: readonly ModeDegree[],
  anchorFret: number
): NpsPattern[] {
  return degrees
    .map((degree) => findNearest(sequence, degree, anchorFret))
    .filter((pattern): pattern is NpsPattern => pattern !== undefined)
    .sort((a, b) => a.startFret - b.startFret);
}

/** Every occurrence of the selected modes along the whole neck */
export function patternsOfDegrees(
  sequence: readonly NpsPattern[],
  degrees: readonly ModeDegree[]
): NpsPattern[] {
  return sequence.filter((pattern) => degrees.includes(pattern.degree));
}

/**
 * The patterns to draw: every occurrence of the selected modes when `wholeNeck`
 * is on, otherwise just the one of each mode nearest the anchor.
 */
export function visiblePatterns(
  sequence: readonly NpsPattern[],
  degrees: readonly ModeDegree[],
  anchorFret: number,
  wholeNeck: boolean
): NpsPattern[] {
  const patterns = wholeNeck
    ? patternsOfDegrees(sequence, degrees)
    : anchoredPatterns(sequence, degrees, anchorFret);
  return patterns.length > 0 ? patterns : sequence.slice(0, 1);
}

/** Stable string-fret key for membership lookups */
export function npsPositionKey(stringIndex: number, fret: number): string {
  return `${stringIndex}-${fret}`;
}

/** Map each fretboard position to the modes (degrees) of the patterns covering it */
export function buildPositionMap(patterns: readonly NpsPattern[]): Map<string, ModeDegree[]> {
  const map = new Map<string, ModeDegree[]>();
  for (const pattern of patterns) {
    for (const { stringIndex, fret } of pattern.notes) {
      const key = npsPositionKey(stringIndex, fret);
      const degrees = map.get(key);
      if (!degrees) {
        map.set(key, [pattern.degree]);
      } else if (!degrees.includes(pattern.degree)) {
        degrees.push(pattern.degree);
      }
    }
  }
  for (const degrees of map.values()) degrees.sort((a, b) => a - b);
  return map;
}

/** Solid colour for one mode, hard-edged stripes for positions shared by several */
export function createModeStyle(degrees: readonly ModeDegree[]): CSSProperties | undefined {
  if (degrees.length === 0) return undefined;
  if (degrees.length === 1) return { backgroundColor: MODES[degrees[0]].color };

  const stops = degrees
    .map((degree, i) => {
      const color = MODES[degree].color;
      return `${color} ${(i * 100) / degrees.length}%, ${color} ${((i + 1) * 100) / degrees.length}%`;
    })
    .join(', ');
  return { background: `linear-gradient(90deg, ${stops})` };
}

/** Lowest and highest fret used by the given patterns */
export function patternsFretRange(patterns: readonly NpsPattern[]): [number, number] | undefined {
  const frets = patterns.flatMap((pattern) => pattern.notes.map((n) => n.fret));
  return frets.length > 0 ? [Math.min(...frets), Math.max(...frets)] : undefined;
}
