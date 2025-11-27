/**
 * Magic numbers and constants extracted for better maintainability
 *
 * This file centralizes all magic numbers used throughout the CAGED visualizer
 * to improve code readability and make changes easier to manage.
 */

/**
 * Fretboard dimensions and musical constants
 */
export const FRETBOARD_CONSTANTS = {
  /** Total number of frets displayed on the fretboard (0-based, so 0-15 = 16 positions) */
  TOTAL_FRETS: 15,

  /** Number of strings on a standard guitar */
  STRING_COUNT: 6,

  /** Maximum fret number for calculations */
  MAX_FRET: 15,

  /** Number of semitones in an octave */
  CHROMATIC_OCTAVE: 12,

  /** Number of shapes in the CAGED system */
  CAGED_SHAPE_COUNT: 5,
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
  FRET_MARKERS: [3, 5, 7, 9, 12] as const,

  /** Delay in milliseconds for quiz auto-progression */
  QUIZ_AUTO_ADVANCE_DELAY: 1000,

  /** Default question count for quiz sessions */
  DEFAULT_QUESTION_COUNT: 10,

  /** Maximum question count allowed */
  MAX_QUESTION_COUNT: 50,

  /** Minimum question count allowed */
  MIN_QUESTION_COUNT: 5,
} as const;

/**
 * Storage and persistence constants
 */
export const STORAGE_CONSTANTS = {
  /** LocalStorage key for quiz preferences */
  QUIZ_PREFERENCES_KEY: 'caged-quiz-preferences',

  /** LocalStorage key for theme preferences */
  THEME_PREFERENCES_KEY: 'caged-theme-preferences',

  /** LocalStorage key for last session data */
  LAST_SESSION_KEY: 'caged-last-session',
} as const;

/**
 * Animation and timing constants
 */
export const ANIMATION_CONSTANTS = {
  /** Duration for theme transition animations (ms) */
  THEME_TRANSITION_DURATION: 200,

  /** Duration for shape change animations (ms) */
  SHAPE_TRANSITION_DURATION: 300,

  /** Debounce delay for keyboard navigation (ms) */
  KEYBOARD_DEBOUNCE_DELAY: 50,
} as const;

/**
 * Validation constants
 */
export const VALIDATION_CONSTANTS = {
  /** Valid chord types in the CAGED system */
  VALID_CHORD_TYPES: ['C', 'A', 'G', 'E', 'D'] as const,

  /** Valid chord qualities */
  VALID_CHORD_QUALITIES: ['major', 'minor'] as const,

  /** Valid quiz modes */
  VALID_QUIZ_MODES: ['major', 'minor', 'mixed'] as const,

  /** String index bounds (0-based) */
  STRING_INDEX_BOUNDS: { MIN: 0, MAX: 5 } as const,

  /** Fret number bounds */
  FRET_NUMBER_BOUNDS: { MIN: 0, MAX: 15 } as const,
} as const;

/**
 * Metronome constants
 */
export const METRONOME_CONSTANTS = {
  /** Default tempo in beats per minute */
  DEFAULT_BPM: 120,

  /** Minimum allowed BPM */
  MIN_BPM: 40,

  /** Maximum allowed BPM */
  MAX_BPM: 240,

  /** Frequency of subdivision note click sound in Hz */
  NOTE_CLICK_FREQUENCY: 1000,

  /** Frequency of metronome beat click in Hz */
  METRONOME_CLICK_FREQUENCY: 800,

  /** Duration of subdivision note click sound in seconds */
  NOTE_CLICK_DURATION: 0.01,

  /** Duration of metronome click sound in seconds */
  METRONOME_CLICK_DURATION: 0.02,

  /** Time signature (beats per measure) - for future extension */
  TIME_SIGNATURE: 4,

  /** Volume level for subdivision note clicks (0.0 to 1.0) */
  NOTE_CLICK_VOLUME: 0.3,

  /** Volume level for metronome clicks (0.0 to 1.0) */
  METRONOME_CLICK_VOLUME: 0.4,
} as const;