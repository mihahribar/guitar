/**
 * Rhythm utility functions
 *
 * Helper functions for rhythm pattern validation, randomization,
 * and subdivision calculations.
 */

import type { RhythmPattern, PanelIndex, BeatIndex, RandomPoolAction } from '../types';
import { ALL_PATTERNS, PATTERNS_BY_CATEGORY, RHYTHM_GAME_CONSTANTS } from '../constants';

/**
 * Validate that a pattern's note durations sum to 1.0 (one beat)
 * @param pattern - The pattern to validate
 * @returns true if pattern durations sum to 1.0
 */
export const validatePattern = (pattern: RhythmPattern): boolean => {
  const totalDuration = pattern.notes.reduce((sum, note) => sum + note.duration, 0);
  // Allow small floating point tolerance
  return Math.abs(totalDuration - 1.0) < 0.001;
};

/**
 * Get a random pattern from a pool
 * @param pool - Patterns to pick from
 * @returns A random rhythm pattern
 */
export const getRandomPattern = (pool: RhythmPattern[] = ALL_PATTERNS): RhythmPattern => {
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
};

/**
 * Get a random pattern that differs from the current one, so a swap is always visible
 * @param current - The pattern being replaced
 * @param pool - Patterns to pick from
 * @returns A different rhythm pattern, or undefined when the pool has none
 */
export const getRandomPatternExcept = (
  current: RhythmPattern,
  pool: RhythmPattern[] = ALL_PATTERNS
): RhythmPattern | undefined => {
  const others = pool.filter((pattern) => pattern.id !== current.id);
  return others[Math.floor(Math.random() * others.length)];
};

/**
 * Ids of the patterns Randomize and Random Change pick from. As with the pattern
 * chips in the other tabs, at least one always stays selected
 */
export const randomPoolReducer = (pool: string[], action: RandomPoolAction): string[] => {
  switch (action.type) {
    case 'TOGGLE_PATTERN': {
      const next = pool.includes(action.payload)
        ? pool.filter((id) => id !== action.payload)
        : [...pool, action.payload];
      return next.length > 0 ? next : pool;
    }
    case 'SOLO_PATTERN':
      return [action.payload];
    case 'TOGGLE_CATEGORY': {
      const ids = PATTERNS_BY_CATEGORY[action.payload].map((pattern) => pattern.id);
      // A partly selected group fills up first, and clears once it is full
      const next = ids.every((id) => pool.includes(id))
        ? pool.filter((id) => !ids.includes(id))
        : [...pool, ...ids.filter((id) => !pool.includes(id))];
      return next.length > 0 ? next : pool;
    }
  }
};

/**
 * Get a random panel index (0-3)
 * @returns Random panel index
 */
export const getRandomPanelIndex = (): PanelIndex => {
  return Math.floor(Math.random() * 4) as PanelIndex;
};

/**
 * Beat on which random change swaps a panel, so the player sees the new pattern
 * RANDOM_CHANGE_LEAD_BEATS beats before playing it
 * @param panel - The panel being swapped
 * @returns The beat to swap it on
 */
export const getRandomChangeBeat = (panel: PanelIndex): BeatIndex => {
  const { BEATS_PER_MEASURE, RANDOM_CHANGE_LEAD_BEATS } = RHYTHM_GAME_CONSTANTS;
  return ((panel - RANDOM_CHANGE_LEAD_BEATS + BEATS_PER_MEASURE) % BEATS_PER_MEASURE) as BeatIndex;
};

/**
 * One beat of random change. The panel for the next bar is picked on panel 1's swap
 * beat, which opens the swap window for that bar, so every bar played differs from
 * the one before in exactly one panel
 * @param beat - The beat just reached
 * @param pending - Panel picked but not yet swapped, if any
 * @param pickPanel - Picks the panel to swap
 * @returns The panel still waiting, and the panel to swap on this beat
 */
export const stepRandomChange = (
  beat: BeatIndex,
  pending: PanelIndex | null,
  pickPanel: () => PanelIndex = getRandomPanelIndex
): { pending: PanelIndex | null; swap: PanelIndex | null } => {
  const target = beat === getRandomChangeBeat(0) ? pickPanel() : pending;
  return target !== null && getRandomChangeBeat(target) === beat
    ? { pending: null, swap: target }
    : { pending: target, swap: null };
};

/**
 * Count the number of notes (subdivisions) in a pattern
 * Used for audio playback scheduling
 * @param pattern - The pattern to count
 * @returns Number of notes (excluding rests for audio purposes)
 */
export const getSubdivisionCount = (pattern: RhythmPattern): number => {
  return pattern.notes.length;
};

/**
 * Count the number of audible notes (non-rests) in a pattern
 * @param pattern - The pattern to count
 * @returns Number of non-rest notes
 */
export const getAudibleNoteCount = (pattern: RhythmPattern): number => {
  return pattern.notes.filter((note) => !note.isRest).length;
};

/**
 * Calculate timing offsets for each note within a beat
 * @param pattern - The pattern to calculate timings for
 * @param beatDurationMs - Duration of one beat in milliseconds
 * @returns Array of timing offsets in milliseconds for each note
 */
export const calculateNoteTimings = (pattern: RhythmPattern, beatDurationMs: number): number[] => {
  const timings: number[] = [];
  let currentOffset = 0;

  for (const note of pattern.notes) {
    timings.push(currentOffset);
    currentOffset += note.duration * beatDurationMs;
  }

  return timings;
};

/**
 * Get pattern by ID
 * @param id - Pattern ID to find
 * @returns Pattern if found, undefined otherwise
 */
export const getPatternById = (id: string): RhythmPattern | undefined => {
  return ALL_PATTERNS.find((pattern) => pattern.id === id);
};

/**
 * Generate random patterns for all 4 panels
 * @returns Tuple of 4 random patterns
 */
export const generateRandomPanels = (): [
  RhythmPattern,
  RhythmPattern,
  RhythmPattern,
  RhythmPattern,
] => {
  return [getRandomPattern(), getRandomPattern(), getRandomPattern(), getRandomPattern()];
};
