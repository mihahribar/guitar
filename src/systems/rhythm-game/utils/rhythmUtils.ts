/**
 * Rhythm utility functions
 *
 * Helper functions for rhythm pattern validation, randomization,
 * and subdivision calculations.
 */

import type { RhythmPattern, PanelIndex, BeatIndex, RandomPoolAction } from '../types';
import { ALL_PATTERNS, PATTERNS_BY_CATEGORY, RHYTHM_GAME_CONSTANTS } from '../constants';

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
 * Ids of the patterns Randomize and Random Change pick from. It may be empty,
 * which leaves the panels as they are until something is picked again
 */
export const randomPoolReducer = (pool: string[], action: RandomPoolAction): string[] => {
  switch (action.type) {
    case 'TOGGLE_PATTERN':
      return pool.includes(action.payload)
        ? pool.filter((id) => id !== action.payload)
        : [...pool, action.payload];
    case 'SOLO_PATTERN':
      return [action.payload];
    case 'TOGGLE_CATEGORY': {
      const ids = PATTERNS_BY_CATEGORY[action.payload].map((pattern) => pattern.id);
      // A partly selected group fills up first, and clears once it is full
      return ids.every((id) => pool.includes(id))
        ? pool.filter((id) => !ids.includes(id))
        : [...pool, ...ids.filter((id) => !pool.includes(id))];
    }
    case 'SELECT_ALL':
      return ALL_PATTERNS.map((pattern) => pattern.id);
    case 'SELECT_NONE':
      return [];
  }
};

/**
 * Get a random panel index (0-3)
 * @returns Random panel index
 */
const getRandomPanelIndex = (): PanelIndex => {
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
