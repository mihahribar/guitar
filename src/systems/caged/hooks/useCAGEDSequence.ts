import { useMemo } from 'react';
import type { CAGEDPosition } from '../types';
import { CAGED_SHAPE_DATA, CHROMATIC_VALUES, FULL_CAGED_SEQUENCE } from '../constants';
import { FRETBOARD_CONSTANTS } from '@/shared/constants/magicNumbers';

/**
 * Build the full CAGED walk for a chord across the entire fretboard.
 *
 * For each of the five CAGED shapes (C/A/G/E/D) we compute its natural base fret
 * for the selected root using chromatic distance, then add octave-up repetitions
 * (basePosition + 12, +24, ...) for as long as the shape still fits within
 * `FRETBOARD_CONSTANTS.MAX_FRET`. The combined list is sorted by basePosition so the
 * sequence walks left-to-right up the neck.
 *
 * Position 0 is always the lowest-fret shape. For the five CAGED roots that is the
 * open form at fret 0 (open C for chord C, open G for chord G); any other root
 * starts one or two frets up (C# opens with the C shape at fret 1).
 *
 * Major and minor variants of each shape share the same maximum pattern offset, so
 * the major patterns are used to compute fret extents — the result is identical for
 * the minor variants.
 *
 * @param root - Pitch class of the chord root (0 = C … 11 = B)
 */
export function buildCAGEDSequence(root: number): CAGEDPosition[] {
  const positions: CAGEDPosition[] = [];

  for (const shape of FULL_CAGED_SEQUENCE) {
    const shapeRoot = CHROMATIC_VALUES[shape];
    const naturalPosition = (root - shapeRoot + 12) % 12;
    const maxPatternFret = Math.max(...CAGED_SHAPE_DATA[shape].pattern.filter((f) => f !== -1));

    // Walk this shape up the neck in octave steps until it no longer fits.
    for (
      let basePosition = naturalPosition;
      basePosition + maxPatternFret <= FRETBOARD_CONSTANTS.MAX_FRET;
      basePosition += FRETBOARD_CONSTANTS.CHROMATIC_OCTAVE
    ) {
      positions.push({ shape, basePosition });
    }
  }

  return positions.sort((a, b) => a.basePosition - b.basePosition);
}

/** How many playable positions the walk holds for a root */
export function cagedSequenceLength(root: number): number {
  return buildCAGEDSequence(root).length;
}

export function useCAGEDSequence(root: number): CAGEDPosition[] {
  return useMemo(() => buildCAGEDSequence(root), [root]);
}
