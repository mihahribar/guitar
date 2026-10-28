/**
 * Rhythm Game system constants
 *
 * Centralized constants for the rhythm game feature.
 */

import type { RhythmPattern } from '../types';
import { QUARTER_PATTERNS } from './patterns';

// Re-export pattern definitions
export * from './patterns';

/**
 * Core rhythm game constants
 */
export const RHYTHM_GAME_CONSTANTS = {
  /** Number of panels in the grid */
  PANEL_COUNT: 4,
  /** Beats per measure (4/4 time) */
  BEATS_PER_MEASURE: 4,
  /** Beats of warning random change gives before the swapped panel plays */
  RANDOM_CHANGE_LEAD_BEATS: 2,
  /** Grid dimensions */
  GRID_COLS: 2,
  GRID_ROWS: 2,
} as const;

/**
 * Default pattern for new panels (quarter note)
 */
export const DEFAULT_PATTERN: RhythmPattern = QUARTER_PATTERNS[0];

/**
 * Default patterns for initial state
 * Each panel starts with a quarter note
 */
export const DEFAULT_PANELS: [RhythmPattern, RhythmPattern, RhythmPattern, RhythmPattern] = [
  DEFAULT_PATTERN,
  DEFAULT_PATTERN,
  DEFAULT_PATTERN,
  DEFAULT_PATTERN,
];

/**
 * Category display names for UI
 */
export const CATEGORY_DISPLAY_NAMES = {
  quarter: 'Quarter Notes',
  eighths: 'Eighth Notes',
  sixteenths: 'Sixteenth Notes',
  triplets: 'Triplets',
} as const;

export * from './help';
