import { useMemo } from 'react';
import type { ChordType } from '@/shared/types/core';
import type { CAGEDPosition } from '../types';
import { CAGED_SHAPE_DATA, CHROMATIC_VALUES, FULL_CAGED_SEQUENCE } from '../constants';
import { FRETBOARD_CONSTANTS } from '@/shared/constants/magicNumbers';

/**
 * Build the full CAGED walk for a chord across the entire fretboard.
 *
 * For each of the five CAGED shapes (C/A/G/E/D) we compute its natural base fret
 * for the selected chord using chromatic distance, then add octave-up repetitions
 * (basePosition + 12, +24, ...) for as long as the shape still fits within
 * `FRETBOARD_CONSTANTS.MAX_FRET`. The combined list is sorted by basePosition so the
 * sequence walks left-to-right up the neck.
 *
 * Position 0 is always the lowest-fret shape, which is the chord's natural starting
 * shape at fret 0 (e.g. open C for chord C, open G for chord G), preserving the
 * original "press chord → start at the open form" UX.
 *
 * Major and minor variants of each shape share the same maximum pattern offset, so
 * the major patterns are used to compute fret extents — the result is identical for
 * the minor variants.
 */
export function useCAGEDSequence(selectedChord: ChordType): CAGEDPosition[] {
  return useMemo(() => {
    const targetValue = CHROMATIC_VALUES[selectedChord];
    const positions: CAGEDPosition[] = [];

    for (const shape of FULL_CAGED_SEQUENCE) {
      const shapeRoot = CHROMATIC_VALUES[shape];
      const naturalPosition = (targetValue - shapeRoot + 12) % 12;
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
  }, [selectedChord]);
}
