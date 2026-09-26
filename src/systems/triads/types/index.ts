import type { StringIndex } from '@/shared/types/core';
import type { Voicing, VoicingSelection } from '@/shared/types/voicing';

/** Which chord tone is in the bass: 0 = root position, 1 = 1st inversion, 2 = 2nd inversion */
export type Inversion = 0 | 1 | 2;

export type TriadQuality = 'major' | 'minor' | 'diminished' | 'augmented';

export interface TriadQualityInfo {
  name: string;
  short: string;
  /** Semitones above the root for root, third and fifth */
  intervals: readonly [number, number, number];
  /** Labels for root, third and fifth (e.g. R, ♭3, 5) */
  toneLabels: readonly [string, string, string];
}

export interface InversionInfo {
  name: string;
  short: string;
  color: string;
}

export interface StringSet {
  /** Thickest string of the set (index 0 = high E); the set is low, low-1, low-2 */
  low: StringIndex;
  label: string;
}

/** One close-voiced triad on three adjacent strings, low string first */
export type Triad = Voicing<Inversion>;

/** String sets are identified by their low string */
export type TriadsState = VoicingSelection<TriadQuality, Inversion, StringIndex>;
