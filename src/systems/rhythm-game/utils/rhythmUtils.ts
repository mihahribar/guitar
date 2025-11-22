/**
 * Rhythm utility functions
 *
 * Helper functions for rhythm pattern validation, randomization,
 * and subdivision calculations.
 */

import type { RhythmPattern, PanelIndex, SubdivisionType } from '../types';
import { ALL_PATTERNS, PATTERNS_BY_CATEGORY } from '../constants';

/**
 * Validate that a pattern's note durations sum to 1.0 (one beat)
 * @param pattern - The pattern to validate
 * @returns true if pattern durations sum to 1.0
 */
export const validatePattern = (pattern: RhythmPattern): boolean => {
  const totalDuration = pattern.notes.reduce(
    (sum, note) => sum + note.duration,
    0
  );
  // Allow small floating point tolerance
  return Math.abs(totalDuration - 1.0) < 0.001;
};

/**
 * Get a random pattern from available patterns
 * @param category - Optional category to filter by
 * @returns A random rhythm pattern
 */
export const getRandomPattern = (
  category?: SubdivisionType
): RhythmPattern => {
  const patterns = category
    ? PATTERNS_BY_CATEGORY[category]
    : ALL_PATTERNS;

  const randomIndex = Math.floor(Math.random() * patterns.length);
  return patterns[randomIndex];
};

/**
 * Get a random panel index (0-3)
 * @returns Random panel index
 */
export const getRandomPanelIndex = (): PanelIndex => {
  return Math.floor(Math.random() * 4) as PanelIndex;
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
export const calculateNoteTimings = (
  pattern: RhythmPattern,
  beatDurationMs: number
): number[] => {
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
  RhythmPattern
] => {
  return [
    getRandomPattern(),
    getRandomPattern(),
    getRandomPattern(),
    getRandomPattern(),
  ];
};
