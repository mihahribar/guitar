import type { Voicing, VoicingLayout, VoicingSelection } from '@/shared/types/voicing';

/**
 * Which chord tone is in the bass: 0 = root position, 1 = 1st inversion (third),
 * 2 = 2nd inversion (fifth), 3 = 3rd inversion (seventh)
 */
export type Inversion = 0 | 1 | 2 | 3;

export type SeventhQuality = 'maj7' | 'dom7' | 'min7' | 'min7b5' | 'dim7';

export interface SeventhQualityInfo {
  name: string;
  /** Chord symbol suffix, e.g. "maj7" in Cmaj7 */
  short: string;
  /** Semitones above the root for root, third, fifth and seventh */
  intervals: readonly [number, number, number, number];
  /** Labels for root, third, fifth and seventh (e.g. R, ♭3, 5, ♭7) */
  toneLabels: readonly [string, string, string, string];
}

export interface InversionInfo {
  name: string;
  short: string;
  color: string;
}

export type StringSetId = 'e-dgb' | 'adgb' | 'dgbe';

/** Four strings with one chord tone each, in a drop 2 or drop 3 voicing */
export interface SeventhStringSet extends VoicingLayout {
  id: StringSetId;
  label: string;
  voicing: 'Drop 2' | 'Drop 3';
}

/** One seventh chord voicing, low string first */
export type SeventhChord = Voicing<Inversion>;

export type SeventhsState = VoicingSelection<SeventhQuality, Inversion, StringSetId>;
