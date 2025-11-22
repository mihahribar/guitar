/**
 * Rhythm Game system constants
 *
 * Centralized constants for the rhythm game feature.
 */

import type { RhythmPattern } from '../types';
import { QUARTER_PATTERNS, ALL_PATTERNS } from './patterns';

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
export const DEFAULT_PANELS: [
  RhythmPattern,
  RhythmPattern,
  RhythmPattern,
  RhythmPattern
] = [DEFAULT_PATTERN, DEFAULT_PATTERN, DEFAULT_PATTERN, DEFAULT_PATTERN];

/**
 * Visual state constants for panels
 */
export const PANEL_VISUAL_CONSTANTS = {
  /** CSS classes for inactive panel */
  INACTIVE_BG: 'bg-gray-100 dark:bg-gray-800',
  INACTIVE_BORDER: 'border-gray-300 dark:border-gray-600',
  /** CSS classes for active panel */
  ACTIVE_BG: 'bg-blue-100 dark:bg-blue-900',
  ACTIVE_BORDER: 'border-blue-500 dark:border-blue-400',
  /** Transition duration in ms */
  TRANSITION_DURATION: 150,
} as const;

/**
 * Get all available patterns for selection
 */
export const getAvailablePatterns = (): RhythmPattern[] => ALL_PATTERNS;

/**
 * Category display names for UI
 */
export const CATEGORY_DISPLAY_NAMES = {
  quarter: 'Quarter Notes',
  eighths: 'Eighth Notes',
  sixteenths: 'Sixteenth Notes',
  triplets: 'Triplets',
} as const;
