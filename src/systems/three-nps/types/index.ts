import type { StringIndex } from '@/shared/types/core';

/** Scale degree a pattern starts on: 0 = Ionian … 6 = Locrian */
export type ModeDegree = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface ModeInfo {
  name: string;
  short: string;
  color: string;
}

export interface StringPair {
  /** Thicker string of the pair (index 0 = high E) */
  low: StringIndex;
  /** Thinner string of the pair */
  high: StringIndex;
  label: string;
}

export interface NpsNote {
  stringIndex: StringIndex;
  fret: number;
  /** Pitch class (0-11) */
  pitchClass: number;
}

/** A 3-notes-per-string pattern: a 2-string "domino" or a full 6-string position */
export interface NpsPattern {
  degree: ModeDegree;
  /** Fret of the first note on the lowest string of the pattern */
  startFret: number;
  notes: NpsNote[];
}

export type NpsScope = { kind: 'pair'; lowString: StringIndex } | { kind: 'all' };

export interface ThreeNpsState {
  /** Pitch class of the parent major scale root (0 = C) */
  root: number;
  /** Low string of the selected pair (5 = low E … 1 = B) */
  lowString: StringIndex;
  /** Modes shown at once, in degree order; never empty */
  degrees: ModeDegree[];
  /** Fret the selected patterns should stay near when the scope changes */
  anchorFret: number;
  /** Show every occurrence of the selected modes instead of the one nearest the anchor */
  wholeNeck: boolean;
  allStrings: boolean;
  showAllNotes: boolean;
}
