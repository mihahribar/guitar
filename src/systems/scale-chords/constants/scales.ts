/**
 * Scale Definitions Constants
 *
 * This file contains interval patterns for all supported scale types.
 * Each scale is defined by its semitone intervals from the root note.
 *
 * Interval Pattern Format:
 * - 0 represents the root note
 * - Numbers 1-11 represent semitones above the root
 * - All diatonic scales have 7 notes (including the root)
 *
 * Music Theory Reference:
 * - Whole step (W) = 2 semitones
 * - Half step (H) = 1 semitone
 *
 * Example: Major scale pattern W-W-H-W-W-W-H
 * = [0, 2, 4, 5, 7, 9, 11]
 */

import type { ScaleDefinition } from '../types';

/**
 * Major Scale (Ionian Mode)
 *
 * Interval pattern: W-W-H-W-W-W-H
 * Formula: 1, 2, 3, 4, 5, 6, 7
 * Character: Bright, happy, stable
 *
 * Chord progression: I-ii-iii-IV-V-vi-vii°
 *
 * @example
 * C Major scale: C, D, E, F, G, A, B
 */
export const MAJOR_SCALE: ScaleDefinition = {
  name: 'Major Scale',
  intervals: [0, 2, 4, 5, 7, 9, 11],
  description: 'Happy, bright sounding scale - foundation of Western music theory. The most common scale in popular music.'
};

/**
 * Natural Minor Scale (Aeolian Mode)
 *
 * Interval pattern: W-H-W-W-H-W-W
 * Formula: 1, 2, ♭3, 4, 5, ♭6, ♭7
 * Character: Dark, melancholic, introspective
 *
 * Chord progression: i-ii°-III-iv-v-VI-VII
 *
 * Relative to major: Same notes as major scale starting from the 6th degree
 *
 * @example
 * A Natural Minor scale: A, B, C, D, E, F, G
 * (relative to C Major)
 */
export const NATURAL_MINOR_SCALE: ScaleDefinition = {
  name: 'Natural Minor Scale',
  intervals: [0, 2, 3, 5, 7, 8, 10],
  description: 'Relative minor scale - darker, more melancholic sound. Most common minor scale in popular music.'
};

/**
 * Harmonic Minor Scale
 *
 * Interval pattern: W-H-W-W-H-W+H-H
 * Formula: 1, 2, ♭3, 4, 5, ♭6, 7
 * Character: Exotic, Middle Eastern, dramatic
 *
 * Chord progression: i-ii°-III+-iv-V-VI-vii°
 *
 * Key difference from natural minor: Raised 7th degree
 * - Creates augmented 2nd interval between ♭6 and 7
 * - Strong resolution to tonic (due to leading tone)
 *
 * Common in: Classical music, metal, flamenco
 *
 * @example
 * A Harmonic Minor scale: A, B, C, D, E, F, G#
 */
export const HARMONIC_MINOR_SCALE: ScaleDefinition = {
  name: 'Harmonic Minor Scale',
  intervals: [0, 2, 3, 5, 7, 8, 11],
  description: 'Exotic sound with raised 7th degree - creates strong resolution. Common in classical music and metal.'
};

/**
 * Melodic Minor Scale (Ascending)
 *
 * Interval pattern: W-H-W-W-W-W-H
 * Formula: 1, 2, ♭3, 4, 5, 6, 7
 * Character: Smooth, jazzy, sophisticated
 *
 * Chord progression: i-ii-III+-IV-V-vi°-vii°
 *
 * Key differences from natural minor: Raised 6th and 7th degrees
 * - Eliminates augmented 2nd interval
 * - Smoother ascending motion
 *
 * Note: Traditionally descends as natural minor, but modern usage
 * applies this pattern in both directions
 *
 * Common in: Jazz, modern classical
 *
 * @example
 * A Melodic Minor scale: A, B, C, D, E, F#, G#
 */
export const MELODIC_MINOR_SCALE: ScaleDefinition = {
  name: 'Melodic Minor Scale',
  intervals: [0, 2, 3, 5, 7, 9, 11],
  description: 'Jazz scale with raised 6th and 7th degrees - smooth ascending sound. Popular in jazz and modern music.'
};

/**
 * Scale Definitions Registry
 *
 * Master object containing all scale definitions indexed by key.
 * Use these keys to access scale definitions programmatically.
 *
 * Keys:
 * - 'major': Major scale (Ionian)
 * - 'naturalMinor': Natural minor scale (Aeolian)
 * - 'harmonicMinor': Harmonic minor scale
 * - 'melodicMinor': Melodic minor scale
 *
 * @example
 * ```typescript
 * const majorIntervals = SCALE_DEFINITIONS.major.intervals;
 * // [0, 2, 4, 5, 7, 9, 11]
 * ```
 */
export const SCALE_DEFINITIONS: Record<string, ScaleDefinition> = {
  major: MAJOR_SCALE,
  naturalMinor: NATURAL_MINOR_SCALE,
  harmonicMinor: HARMONIC_MINOR_SCALE,
  melodicMinor: MELODIC_MINOR_SCALE
};

/**
 * Get scale type key from quality and minor type
 *
 * Helper function to convert scale quality and minor type into
 * the appropriate key for SCALE_DEFINITIONS lookup
 *
 * @param scaleQuality - 'major' or 'minor'
 * @param minorScaleType - 'natural', 'harmonic', or 'melodic' (ignored if major)
 * @returns Scale definition key string
 *
 * @example
 * ```typescript
 * getScaleKey('major', 'natural'); // 'major'
 * getScaleKey('minor', 'harmonic'); // 'harmonicMinor'
 * ```
 */
export function getScaleKey(
  scaleQuality: 'major' | 'minor',
  minorScaleType: 'natural' | 'harmonic' | 'melodic' = 'natural'
): string {
  if (scaleQuality === 'major') {
    return 'major';
  }

  // Minor scales
  switch (minorScaleType) {
    case 'natural':
      return 'naturalMinor';
    case 'harmonic':
      return 'harmonicMinor';
    case 'melodic':
      return 'melodicMinor';
    default:
      return 'naturalMinor'; // Fallback to natural minor
  }
}

/**
 * Music Theory Reference: Scale Formulas
 *
 * Quick reference for scale interval formulas:
 *
 * Major:           1  2  3  4  5  6  7
 * Natural Minor:   1  2 ♭3  4  5 ♭6 ♭7
 * Harmonic Minor:  1  2 ♭3  4  5 ♭6  7
 * Melodic Minor:   1  2 ♭3  4  5  6  7
 *
 * Semitone intervals from root:
 * Major:           0  2  4  5  7  9  11
 * Natural Minor:   0  2  3  5  7  8  10
 * Harmonic Minor:  0  2  3  5  7  8  11
 * Melodic Minor:   0  2  3  5  7  9  11
 */
