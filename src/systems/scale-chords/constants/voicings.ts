/**
 * Chord Voicings and Fretboard Positions
 *
 * This file contains recommended chord voicings for displaying chords
 * on the fretboard. Includes open position voicings and barre chord calculations.
 *
 * Note: This is a placeholder file to be populated in Phase 2 (Task 2.3)
 */

import type { ChordVoicing, ChordQuality } from '../types';

/**
 * Open position chord voicings
 *
 * Common open position voicings for major and minor chords.
 * These are the most practical shapes for beginners.
 *
 * Key format: "{rootNote}-{quality}"
 * Example: "C-major", "Am-minor"
 *
 * To be populated in Task 2.3
 */
export const OPEN_POSITION_VOICINGS: Record<string, ChordVoicing> = {
  // Placeholder - will be populated in Phase 2
};

/**
 * Get recommended voicing for a chord
 *
 * Returns the best voicing to display on the fretboard for a given chord.
 * Falls back to calculated barre chord if no open position is available.
 *
 * @param rootNote - Chromatic value (0-11)
 * @param quality - Chord quality
 * @returns Chord voicing object
 *
 * To be implemented in Task 2.3
 */
export function getRecommendedVoicing(
  rootNote: number,
  quality: ChordQuality
): ChordVoicing | null {
  // Placeholder implementation
  // Will be implemented in Phase 2 (Task 2.3)
  return null;
}

/**
 * Calculate barre chord voicing
 *
 * Fallback function to calculate a moveable barre chord shape
 * when no open position voicing is available.
 *
 * @param rootNote - Chromatic value (0-11)
 * @param quality - Chord quality
 * @returns Barre chord voicing
 *
 * To be implemented in Task 2.3
 */
export function calculateBarreChordVoicing(
  rootNote: number,
  quality: ChordQuality
): ChordVoicing {
  // Placeholder implementation
  // Will be implemented in Phase 2 (Task 2.3)
  return {
    frets: [-1, -1, -1, -1, -1, -1],
    baseFret: 0,
    description: 'Placeholder voicing'
  };
}
