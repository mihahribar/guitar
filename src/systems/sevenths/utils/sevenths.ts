import type { CSSProperties } from 'react';
import type { StringIndex } from '@/shared/types/core';
import type { VoicingLayout } from '@/shared/types/voicing';
import { createSplitColorStyle } from '@/shared/utils/splitColor';
import { buildVoicingSequence, chordToneLabel } from '@/shared/utils/voicings';
import { INVERSIONS, SEVENTH_QUALITIES, STRING_SETS } from '../constants';
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

/** Solid colour for one inversion, hard-edged stripes for positions shared by several */
export function createInversionStyle(inversions: readonly Inversion[]): CSSProperties | undefined {
  return createSplitColorStyle(inversions.map((inversion) => INVERSIONS[inversion].color));
}

/** Chord-tone label (R, 3, ♭3, 5, ♭5, 7, ♭7, ♭♭7) for a pitch class, or undefined if it isn't in the chord */
export function toneLabel(
  root: number,
  quality: SeventhQuality,
  pitchClass: number
): string | undefined {
  return chordToneLabel(SEVENTH_QUALITIES[quality], root, pitchClass);
}

/** Strings inside a set's span that stay silent (the A string in E·DGB) */
export function mutedStrings({ strings }: VoicingLayout): StringIndex[] {
  const low = strings[0];
  const span = low - strings[strings.length - 1] + 1;
  return Array.from({ length: span }, (_, i) => (low - i) as StringIndex).filter(
    (stringIndex) => !strings.includes(stringIndex)
  );
}
