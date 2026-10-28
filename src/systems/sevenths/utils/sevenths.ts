import type { StringIndex } from '@/shared/types/core';
import type { VoicingLayout } from '@/shared/types/voicing';
import { buildVoicingSequence } from '@/shared/utils/voicings';
import { SEVENTH_QUALITIES, STRING_SETS } from '../constants';
import type { Inversion, SeventhChord, SeventhQuality, StringSetId } from '../types';

/** Every inversion, in order */
export const ALL_INVERSIONS: readonly Inversion[] = [0, 1, 2, 3];

/**
 * Every voicing of every inversion that fits on the fretboard on one string
 * set, ordered up the neck (which cycles root → 1st → 2nd → 3rd naturally).
 */
export function buildSequence(
  root: number,
  quality: SeventhQuality,
  stringSet: StringSetId
): SeventhChord[] {
  return buildVoicingSequence(
    root,
    SEVENTH_QUALITIES[quality].intervals,
    STRING_SETS[stringSet],
    ALL_INVERSIONS
  );
}

/** Strings inside a set's span that stay silent (the A string in E·DGB) */
export function mutedStrings({ strings }: VoicingLayout): StringIndex[] {
  const low = strings[0];
  const span = low - strings[strings.length - 1] + 1;
  return Array.from({ length: span }, (_, i) => (low - i) as StringIndex).filter(
    (stringIndex) => !strings.includes(stringIndex)
  );
}
