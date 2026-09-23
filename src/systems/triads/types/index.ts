import type { StringIndex } from '@/shared/types/core';

/** Which chord tone is in the bass: 0 = root position, 1 = 1st inversion, 2 = 2nd inversion */
export type Inversion = 0 | 1 | 2;

export type TriadQuality = 'major' | 'minor' | 'diminished' | 'augmented';

/** Chord tone within the triad: 0 = root, 1 = third, 2 = fifth */
export type ChordTone = 0 | 1 | 2;

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

export interface TriadNote {
  stringIndex: StringIndex;
  fret: number;
  /** Pitch class (0-11) */
  pitchClass: number;
  tone: ChordTone;
}

/** One close-voiced triad on three adjacent strings */
export interface Triad {
  inversion: Inversion;
  /** Low string of the set it sits on */
  lowString: StringIndex;
  /** Lowest fret of the shape */
  position: number;
  /** Low string first */
  notes: TriadNote[];
}

export interface TriadsState {
  /** Pitch class of the triad root (0 = C) */
  root: number;
  quality: TriadQuality;
  /** Low strings of the selected string sets, lowest set first; never empty */
  stringSets: StringIndex[];
  /** Inversions shown at once, in order; never empty */
  inversions: Inversion[];
  /** Fret the selected triads stay near */
  anchorFret: number;
  /** Show every occurrence of the selected inversions instead of the one nearest the anchor */
  wholeNeck: boolean;
  showAllNotes: boolean;
}
