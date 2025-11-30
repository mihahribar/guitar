/**
 * Shared chord utilities for guitar learning systems
 *
 * This module provides common chord-related calculations and utilities
 * that can be used across different guitar learning systems
 */

import { MUSIC_THEORY_CONSTANTS, FRETBOARD_CONSTANTS } from '../constants/magicNumbers';
import { getNoteAtFret } from './musicTheory';
import type { ChordQuality } from '../types/core';

/**
 * Get chord intervals based on quality
 * @param quality - Chord quality (major or minor)
 * @returns Array of intervals in semitones
 */
export function getChordIntervals(quality: ChordQuality): readonly number[] {
  return quality === 'major'
    ? MUSIC_THEORY_CONSTANTS.MAJOR_TRIAD_INTERVALS
    : MUSIC_THEORY_CONSTANTS.MINOR_TRIAD_INTERVALS;
}

/**
 * Get pentatonic intervals based on chord quality
 * @param quality - Chord quality (major or minor)
 * @returns Array of pentatonic intervals in semitones
 */
export function getPentatonicIntervals(quality: ChordQuality): readonly number[] {
  return quality === 'major'
    ? MUSIC_THEORY_CONSTANTS.MAJOR_PENTATONIC_INTERVALS
    : MUSIC_THEORY_CONSTANTS.MINOR_PENTATONIC_INTERVALS;
}

/**
 * Check if a note at a position is part of a chord
 * @param stringIndex - Guitar string index
 * @param fretNumber - Fret number
 * @param rootNote - Root note chromatic value (0-11)
 * @param quality - Chord quality
 * @returns True if the note is part of the chord
 */
export function isChordNote(
  stringIndex: number,
  fretNumber: number,
  rootNote: number,
  quality: ChordQuality
): boolean {
  const noteAtFret = getNoteAtFret(stringIndex, fretNumber);
  const intervals = getChordIntervals(quality);
  const chordNotes = intervals.map(
    (interval) => (rootNote + interval) % FRETBOARD_CONSTANTS.CHROMATIC_OCTAVE
  );
  return chordNotes.includes(noteAtFret);
}

/**
 * Calculate fret position for a chord shape
 * @param shapePattern - Array representing the shape pattern (-1 = not played, 0+ = fret offset)
 * @param stringIndex - Guitar string index
 * @param basePosition - Base fret position for the shape
 * @returns Actual fret number to play, or -1 if string not played
 */
export function calculateShapeFret(
  shapePattern: readonly number[],
  stringIndex: number,
  basePosition: number
): number {
  if (stringIndex < 0 || stringIndex >= shapePattern.length) {
    return -1;
  }

  const patternFret = shapePattern[stringIndex];

  // Handle special cases in chord patterns:
  if (patternFret === -1) return -1; // String not played in this shape
  if (patternFret === 0 && basePosition === 0) return 0; // Open string (absolute position 0)
  if (patternFret === 0 && basePosition > 0) return basePosition; // Barre at base position

  // Standard case: add pattern offset to base position
  return patternFret + basePosition;
}

/**
 * Check if a chord shape should show a dot at a specific position
 * @param shapePattern - Array representing the shape pattern
 * @param stringIndex - Guitar string index
 * @param fretNumber - Fret number to check
 * @param basePosition - Base fret position for the shape
 * @returns True if a chord dot should be displayed
 */
export function shouldShowChordDot(
  shapePattern: readonly number[],
  stringIndex: number,
  fretNumber: number,
  basePosition: number
): boolean {
  const shapeFret = calculateShapeFret(shapePattern, stringIndex, basePosition);
  return shapeFret === fretNumber && shapeFret > 0;
}
