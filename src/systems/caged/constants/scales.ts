/**
 * Scale definitions for the CAGED system scale overlay
 *
 * Provides interval patterns for major, minor, and modal scales
 * used to overlay scale notes on the fretboard alongside CAGED chord shapes.
 */

/**
 * Scale type identifier - 9 supported scale types
 */
export type ScaleType =
  | 'major'
  | 'naturalMinor'
  | 'harmonicMinor'
  | 'melodicMinor'
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'locrian';

/**
 * Scale definition with display name, intervals, and category grouping
 */
export interface ScaleDefinition {
  /** Display name for the scale */
  name: string;
  /** Chromatic intervals from root (semitones) */
  intervals: readonly number[];
  /** Category for grouped dropdown display */
  category: 'major' | 'minor' | 'mode';
}

/**
 * All supported scale definitions keyed by ScaleType
 *
 * Intervals are expressed as semitones from the root note:
 * - Major (Ionian): W-W-H-W-W-W-H = [0, 2, 4, 5, 7, 9, 11]
 * - Natural Minor (Aeolian): W-H-W-W-H-W-W = [0, 2, 3, 5, 7, 8, 10]
 * - Modes are rotations of the major scale
 */
export const SCALE_DEFINITIONS: Record<ScaleType, ScaleDefinition> = {
  major: { name: 'Major (Ionian)', intervals: [0, 2, 4, 5, 7, 9, 11], category: 'major' },
  naturalMinor: { name: 'Natural Minor', intervals: [0, 2, 3, 5, 7, 8, 10], category: 'minor' },
  harmonicMinor: { name: 'Harmonic Minor', intervals: [0, 2, 3, 5, 7, 8, 11], category: 'minor' },
  melodicMinor: { name: 'Melodic Minor', intervals: [0, 2, 3, 5, 7, 9, 11], category: 'minor' },
  dorian: { name: 'Dorian', intervals: [0, 2, 3, 5, 7, 9, 10], category: 'mode' },
  phrygian: { name: 'Phrygian', intervals: [0, 1, 3, 5, 7, 8, 10], category: 'mode' },
  lydian: { name: 'Lydian', intervals: [0, 2, 4, 6, 7, 9, 11], category: 'mode' },
  mixolydian: { name: 'Mixolydian', intervals: [0, 2, 4, 5, 7, 9, 10], category: 'mode' },
  locrian: { name: 'Locrian', intervals: [0, 1, 3, 5, 6, 8, 10], category: 'mode' },
};
