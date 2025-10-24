/**
 * Chord Quality Mappings and Definitions
 *
 * This file contains the diatonic chord qualities for each scale type,
 * chord interval patterns, and chord formula strings.
 *
 * Music Theory Fundamentals:
 * - Diatonic chords: Built from stacking thirds using only scale notes
 * - Each scale degree produces a specific chord quality
 * - Triads consist of root (1), third (3), and fifth (5) scale degrees
 */

import type { ChordQuality } from '../types';

/**
 * Chord quality mappings for each scale type
 *
 * Maps scale degree (index 0-6 for I-VII) to chord quality.
 * Each scale type has a unique pattern of chord qualities.
 *
 * Array indices represent scale degrees:
 * - Index 0 = I (or i)
 * - Index 1 = ii
 * - Index 2 = iii
 * - Index 3 = IV (or iv)
 * - Index 4 = V (or v)
 * - Index 5 = vi (or VI)
 * - Index 6 = vii° (or VII)
 *
 * @example
 * ```typescript
 * // C Major scale chord qualities
 * const cMajorChords = CHORD_QUALITIES_BY_SCALE.major;
 * // ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished']
 * // I-C major, ii-D minor, iii-E minor, IV-F major, V-G major, vi-A minor, vii°-B diminished
 * ```
 */
export const CHORD_QUALITIES_BY_SCALE: Record<string, readonly ChordQuality[]> = {
  /**
   * Major Scale Chord Qualities
   *
   * Pattern: I-ii-iii-IV-V-vi-vii°
   * - I, IV, V are major (strong, stable chords)
   * - ii, iii, vi are minor (softer, more tension)
   * - vii° is diminished (most tension, wants to resolve)
   *
   * Common progressions: I-IV-V, I-vi-IV-V, ii-V-I
   */
  major: [
    'major',      // I   - Tonic (home base, stable)
    'minor',      // ii  - Supertonic (moves to V)
    'minor',      // iii - Mediant (less common, softer)
    'major',      // IV  - Subdominant (strong, stable)
    'major',      // V   - Dominant (creates tension to I)
    'minor',      // vi  - Submediant (relative minor)
    'diminished'  // vii°- Leading tone (strong pull to I)
  ],

  /**
   * Natural Minor Scale Chord Qualities
   *
   * Pattern: i-ii°-III-iv-v-VI-VII
   * - i, iv are minor (tonic, subdominant)
   * - III, VI, VII are major (borrowed from relative major)
   * - ii° is diminished
   * - v is minor (weak resolution compared to major V)
   *
   * Note: Natural minor v chord creates weak cadence
   * (this is why harmonic minor was developed)
   */
  naturalMinor: [
    'minor',      // i   - Tonic (home base)
    'diminished', // ii° - Supertonic diminished
    'major',      // III - Mediant (relative major)
    'minor',      // iv  - Subdominant
    'minor',      // v   - Dominant (weak resolution)
    'major',      // VI  - Submediant
    'major'       // VII - Subtonic (whole step below tonic)
  ],

  /**
   * Harmonic Minor Scale Chord Qualities
   *
   * Pattern: i-ii°-III+-iv-V-VI-vii°
   * - Key difference: Raised 7th creates major V chord
   * - V is now major (strong resolution to i)
   * - vii° is diminished (leading tone function)
   * - III is augmented (unique to harmonic minor)
   *
   * Purpose: Created to give minor keys strong V-i resolution
   * Common in: Classical music, metal, flamenco
   */
  harmonicMinor: [
    'minor',      // i   - Tonic
    'diminished', // ii° - Supertonic diminished
    'augmented',  // III+- Mediant augmented (exotic sound)
    'minor',      // iv  - Subdominant
    'major',      // V   - Dominant (strong resolution!)
    'major',      // VI  - Submediant
    'diminished'  // vii°- Leading tone diminished
  ],

  /**
   * Melodic Minor Scale Chord Qualities
   *
   * Pattern: i-ii-III+-IV-V-vi°-vii°
   * - Raised 6th and 7th degrees
   * - ii is minor (instead of diminished)
   * - IV and V are major (strong functions)
   * - vi° and vii° are both diminished
   * - III is still augmented
   *
   * Purpose: Eliminates augmented 2nd interval of harmonic minor
   * Common in: Jazz, modern classical
   */
  melodicMinor: [
    'minor',      // i   - Tonic
    'minor',      // ii  - Supertonic minor (not diminished)
    'augmented',  // III+- Mediant augmented
    'major',      // IV  - Subdominant major (strong)
    'major',      // V   - Dominant major (strong)
    'diminished', // vi° - Submediant diminished
    'diminished'  // vii°- Leading tone diminished
  ]
};

/**
 * Chord interval patterns by quality
 *
 * Defines the semitone intervals from the root note for each chord quality.
 * All triads consist of 3 notes: root, third, and fifth.
 *
 * Intervals are measured in semitones from the root (0).
 *
 * @example
 * ```typescript
 * // C minor chord (C-Eb-G)
 * const cMinorIntervals = CHORD_INTERVALS.minor; // [0, 3, 7]
 * // 0 semitones = C (root)
 * // 3 semitones = Eb (minor third)
 * // 7 semitones = G (perfect fifth)
 * ```
 */
export const CHORD_INTERVALS: Record<ChordQuality, readonly number[]> = {
  /**
   * Major Triad: Root + Major 3rd + Perfect 5th
   * Semitones: 0 + 4 + 7
   * Sound: Bright, happy, stable
   * Examples: C major (C-E-G), G major (G-B-D)
   */
  major: [0, 4, 7],

  /**
   * Minor Triad: Root + Minor 3rd + Perfect 5th
   * Semitones: 0 + 3 + 7
   * Sound: Dark, sad, introspective
   * Examples: A minor (A-C-E), D minor (D-F-A)
   */
  minor: [0, 3, 7],

  /**
   * Diminished Triad: Root + Minor 3rd + Diminished 5th
   * Semitones: 0 + 3 + 6
   * Sound: Tense, unstable, dissonant (wants to resolve)
   * Examples: B diminished (B-D-F), F# diminished (F#-A-C)
   */
  diminished: [0, 3, 6],

  /**
   * Augmented Triad: Root + Major 3rd + Augmented 5th
   * Semitones: 0 + 4 + 8
   * Sound: Mysterious, floating, ambiguous
   * Examples: C augmented (C-E-G#), E augmented (E-G#-C)
   * Note: Symmetrical - all intervals are major 3rds
   */
  augmented: [0, 4, 8]
};

/**
 * Chord formula strings by quality
 *
 * Human-readable formulas showing scale degree relationships.
 * Uses standard music notation with accidentals (♭ flat, ♯ sharp).
 *
 * These formulas show how the chord tones relate to the major scale:
 * - 1 = root (always present)
 * - 3 = major third
 * - ♭3 = minor third (one semitone lower)
 * - 5 = perfect fifth
 * - ♭5 = diminished fifth (one semitone lower)
 * - ♯5 = augmented fifth (one semitone higher)
 *
 * @example
 * ```typescript
 * // Display chord formula in UI
 * const formula = CHORD_FORMULAS.minor; // '1-♭3-5'
 * // Shows: root, minor third (flatted), perfect fifth
 * ```
 */
export const CHORD_FORMULAS: Record<ChordQuality, string> = {
  /**
   * Major: 1-3-5
   * Root + Major third + Perfect fifth
   */
  major: '1-3-5',

  /**
   * Minor: 1-♭3-5
   * Root + Minor third (flatted) + Perfect fifth
   */
  minor: '1-♭3-5',

  /**
   * Diminished: 1-♭3-♭5
   * Root + Minor third (flatted) + Diminished fifth (flatted)
   */
  diminished: '1-♭3-♭5',

  /**
   * Augmented: 1-3-♯5
   * Root + Major third + Augmented fifth (sharped)
   */
  augmented: '1-3-♯5'
};

/**
 * Interval names for chord tones
 *
 * Maps semitone distances to musical interval names.
 * Used for educational display in the UI.
 *
 * @example
 * ```typescript
 * getIntervalName(0); // 'Root'
 * getIntervalName(3); // 'Minor 3rd'
 * getIntervalName(7); // 'Perfect 5th'
 * ```
 */
export const INTERVAL_NAMES: Record<number, string> = {
  0: 'Root',
  1: 'Minor 2nd',
  2: 'Major 2nd',
  3: 'Minor 3rd',
  4: 'Major 3rd',
  5: 'Perfect 4th',
  6: 'Tritone (Dim 5th)',
  7: 'Perfect 5th',
  8: 'Augmented 5th',
  9: 'Major 6th',
  10: 'Minor 7th',
  11: 'Major 7th'
};

/**
 * Get interval name for a given semitone distance
 *
 * @param semitones - Number of semitones from root (0-11)
 * @returns Interval name string
 */
export function getIntervalName(semitones: number): string {
  return INTERVAL_NAMES[semitones] || 'Unknown';
}

/**
 * Get quality name for display
 *
 * Converts ChordQuality type to human-readable string.
 *
 * @param quality - Chord quality type
 * @returns Capitalized quality name
 *
 * @example
 * ```typescript
 * getQualityName('major'); // 'Major'
 * getQualityName('diminished'); // 'Diminished'
 * ```
 */
export function getQualityName(quality: ChordQuality): string {
  const names: Record<ChordQuality, string> = {
    major: 'Major',
    minor: 'Minor',
    diminished: 'Diminished',
    augmented: 'Augmented'
  };
  return names[quality];
}

/**
 * Music Theory Reference: Chord Quality Summary
 *
 * Quick reference for chord construction:
 *
 * Quality      Intervals    Semitones   Formula    Sound
 * ────────────────────────────────────────────────────────
 * Major        R-M3-P5      0-4-7       1-3-5      Bright
 * Minor        R-m3-P5      0-3-7       1-♭3-5     Dark
 * Diminished   R-m3-d5      0-3-6       1-♭3-♭5    Tense
 * Augmented    R-M3-A5      0-4-8       1-3-♯5     Mysterious
 *
 * Abbreviations:
 * R = Root, M3 = Major 3rd, m3 = Minor 3rd, P5 = Perfect 5th,
 * d5 = Diminished 5th, A5 = Augmented 5th
 */
