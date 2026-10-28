import type { StringIndex } from '@/shared/types/core';
import type { VoicingLayout } from '@/shared/types/voicing';
import { buildVoicingSequence } from '@/shared/utils/voicings';
import { STRINGS_PER_TRIAD, TRIAD_QUALITIES } from '../constants';
import type { Inversion, Triad, TriadQuality } from '../types';

/** Every inversion, in order */
export const ALL_INVERSIONS: readonly Inversion[] = [0, 1, 2];

/** Close voicing on three adjacent strings: root, third, fifth from `lowString` up */
function closeVoicing(lowString: StringIndex): VoicingLayout {
  const steps = Array.from({ length: STRINGS_PER_TRIAD }, (_, s) => s);
  return { strings: steps.map((s) => (lowString - s) as StringIndex), toneOrder: steps };
}

/**
 * Every close-voiced triad of every inversion that fits on the fretboard on
 * one string set, ordered up the neck (which cycles root → 1st → 2nd naturally).
 */
export function buildSequence(
  root: number,
  quality: TriadQuality,
  lowString: StringIndex
): Triad[] {
  return buildVoicingSequence(
    root,
    TRIAD_QUALITIES[quality].intervals,
    closeVoicing(lowString),
    ALL_INVERSIONS
  );
}
