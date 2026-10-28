/**
 * Fretboard, music theory and display constants shared by every system
 */

/**
 * Fretboard dimensions and musical constants
 */
export const FRETBOARD_CONSTANTS = {
  /** Highest fret on the neck (a standard 21-fret electric) */
  MAX_FRET: 21,

  /** Number of semitones in an octave */
  CHROMATIC_OCTAVE: 12,
} as const;

/**
 * Music theory intervals and scales
 */
export const MUSIC_THEORY_CONSTANTS = {
  /** Major pentatonic scale intervals (semitones from root) */
  MAJOR_PENTATONIC_INTERVALS: [0, 2, 4, 7, 9] as const,

  /** Minor pentatonic scale intervals (semitones from root) */
  MINOR_PENTATONIC_INTERVALS: [0, 3, 5, 7, 10] as const,

  /** Major triad intervals (Root, Major Third, Perfect Fifth) */
  MAJOR_TRIAD_INTERVALS: [0, 4, 7] as const,

  /** Minor triad intervals (Root, Minor Third, Perfect Fifth) */
  MINOR_TRIAD_INTERVALS: [0, 3, 7] as const,

  /** Chromatic scale positions for natural notes only (no sharps/flats) */
  NATURAL_NOTE_POSITIONS: [0, 2, 4, 5, 7, 9, 11] as const,
} as const;

/**
 * Visual and UI constants
 */
export const UI_CONSTANTS = {
  /** Fret positions that should show position markers */
  FRET_MARKERS: [3, 5, 7, 9, 12, 15, 17, 19, 21] as const,
} as const;
