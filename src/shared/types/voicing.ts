/**
 * Types for chord voicings walked up the neck on string sets (Triads, 7ths)
 */

import type { StringIndex } from './core';

/** Where a voicing sits: its strings and the order its chord tones stack in */
export interface VoicingLayout {
  /** Strings from the thickest up (index 0 = high E); may skip a string */
  strings: readonly StringIndex[];
  /** Chord tone on each string in root position (0 = root, 1 = third, 2 = fifth, 3 = seventh) */
  toneOrder: readonly number[];
}

export interface VoicingNote {
  stringIndex: StringIndex;
  fret: number;
  /** Pitch class (0-11) */
  pitchClass: number;
  /** Chord tone (0 = root, 1 = third, 2 = fifth, 3 = seventh) */
  tone: number;
}

/** One chord voicing, one note per string */
export interface Voicing<I extends number = number> {
  /** Which chord tone is in the bass (0 = root position) */
  inversion: I;
  /** Lowest fret of the shape */
  position: number;
  /** Thickest string first */
  notes: VoicingNote[];
}

/** Selection shared by the voicing visualizers: what is on the fretboard and where */
export interface VoicingSelection<Q extends string, I extends number, S> {
  /** Pitch class of the chord root (0 = C) */
  root: number;
  quality: Q;
  /** Selected string sets, lowest set first; never empty */
  stringSets: S[];
  /** Inversions shown at once, in order; never empty */
  inversions: I[];
  /** Fret the selected voicings stay near */
  anchorFret: number;
  /** Show every occurrence of the selected inversions instead of the one nearest the anchor */
  wholeNeck: boolean;
  showAllNotes: boolean;
}

export type VoicingSelectionAction<Q extends string, I extends number, S> =
  | { type: 'SET_ROOT'; payload: number }
  | { type: 'SET_QUALITY'; payload: Q }
  | { type: 'NEXT' }
  | { type: 'PREVIOUS' }
  | { type: 'TOGGLE_INVERSION'; payload: I }
  | { type: 'SOLO_INVERSION'; payload: I }
  | { type: 'TOGGLE_ALL_INVERSIONS' }
  | { type: 'TOGGLE_STRING_SET'; payload: S }
  | { type: 'SOLO_STRING_SET'; payload: S }
  | { type: 'SETS_UP' }
  | { type: 'SETS_DOWN' }
  | { type: 'TOGGLE_WHOLE_NECK' }
  | { type: 'TOGGLE_SHOW_ALL_NOTES' };

/** What a voicing visualizer plugs into the shared selection reducer */
export interface VoicingSelectionConfig<Q extends string, I extends number, S> {
  /** Every inversion, in order */
  inversions: readonly I[];
  /** Every string set, lowest first; "sets up" moves one step along this list */
  stringSets: readonly S[];
  /** Every voicing of every inversion on one string set, ordered up the neck */
  buildSequence: (root: number, quality: Q, stringSet: S) => Voicing<I>[];
}
