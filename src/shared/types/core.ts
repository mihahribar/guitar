/**
 * Core shared types for guitar learning systems
 *
 * These types provide the foundation for all guitar learning systems
 * and can be extended by specific implementations (CAGED, scales, etc.)
 */

/**
 * Chord quality affecting interval patterns
 */
export type ChordQuality = 'major' | 'minor';

/**
 * Basic chord types in the chromatic system
 */
export type ChordType = 'C' | 'A' | 'G' | 'E' | 'D';

/**
 * Guitar string index (0-based from low E to high E)
 */
export type StringIndex = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Fret number on guitar neck (0 = open string)
 */
export type FretNumber = number;

/**
 * Chromatic note values mapping (0-11 representing semitones)
 */
export interface ChromaticValues {
  readonly [key: string]: number;
}

/**
 * Basic musical shape definition for any learning system
 */
export interface MusicShape {
  /** Display name of the shape */
  name: string;
  /** CSS color value for visual representation */
  color: string;
  /** Fret pattern for each string (0-based, -1 = not played) */
  pattern: readonly number[];
  /** String indices that contain important notes (roots, etc.) */
  keyNotes: readonly number[];
}

/**
 * Collection of shapes indexed by identifier
 */
export interface ShapeData {
  [key: string]: MusicShape;
}

/**
 * Shapes organized by quality
 */
export interface ShapesByQuality {
  /** Major quality shapes */
  major: ShapeData;
  /** Minor quality shapes */
  minor: ShapeData;
}
