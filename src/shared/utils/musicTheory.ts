/**
 * Shared music theory utilities for guitar learning systems
 *
 * This module provides core music theory calculations and utilities
 * that can be used across different guitar learning systems (CAGED, scales, etc.)
 */

import { MUSIC_THEORY_CONSTANTS, FRETBOARD_CONSTANTS } from '../constants/magicNumbers';

// Re-export constants for convenience
export { FRETBOARD_CONSTANTS };

/**
 * Standard guitar tuning (semitones from C)
 * E(4), B(11), G(7), D(2), A(9), E(4)
 */
export const STANDARD_TUNING = [4, 11, 7, 2, 9, 4] as const;

/**
 * Chromatic scale to note names mapping (including sharps)
 */
export const CHROMATIC_TO_NOTE_NAME: readonly string[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const;

/**
 * String names for display purposes
 */
export const STRING_NAMES = ['E', 'B', 'G', 'D', 'A', 'E'] as const;

/**
 * Calculate the chromatic note value at a specific string and fret position
 * @param stringIndex - Guitar string index (0 = low E, 5 = high E)
 * @param fretNumber - Fret number (0 = open, 1 = first fret, etc.)
 * @returns Chromatic value (0-11) representing the note
 */
export function getNoteAtFret(stringIndex: number, fretNumber: number): number {
  if (stringIndex < 0 || stringIndex >= STANDARD_TUNING.length) {
    throw new Error(
      `Invalid string index: ${stringIndex}. Must be 0-${STANDARD_TUNING.length - 1}`
    );
  }
  if (fretNumber < 0 || fretNumber > FRETBOARD_CONSTANTS.MAX_FRET) {
    throw new Error(
      `Invalid fret number: ${fretNumber}. Must be 0-${FRETBOARD_CONSTANTS.MAX_FRET}`
    );
  }

  return (STANDARD_TUNING[stringIndex] + fretNumber) % FRETBOARD_CONSTANTS.CHROMATIC_OCTAVE;
}

/**
 * Get the note name at a specific string and fret position
 * @param stringIndex - Guitar string index (0 = low E, 5 = high E)
 * @param fretNumber - Fret number (0 = open, 1 = first fret, etc.)
 * @returns Note name string with sharp notation
 */
export function getNoteNameAtFret(stringIndex: number, fretNumber: number): string {
  const chromaticValue = getNoteAtFret(stringIndex, fretNumber);
  return CHROMATIC_TO_NOTE_NAME[chromaticValue];
}

/**
 * Check if a note should be displayed (natural notes only)
 * @param stringIndex - Guitar string index
 * @param fretNumber - Fret number
 * @returns True if note should be shown (natural notes only)
 */
export function shouldShowNoteName(stringIndex: number, fretNumber: number): boolean {
  const chromaticValue = getNoteAtFret(stringIndex, fretNumber);
  return MUSIC_THEORY_CONSTANTS.NATURAL_NOTE_POSITIONS.includes(
    chromaticValue as (typeof MUSIC_THEORY_CONSTANTS.NATURAL_NOTE_POSITIONS)[number]
  );
}

/**
 * Calculate if a note at a specific position is part of a pentatonic scale
 * @param stringIndex - Guitar string index
 * @param fretNumber - Fret number
 * @param rootNote - Root note chromatic value (0-11)
 * @param intervals - Pentatonic intervals array
 * @returns True if the note is part of the pentatonic scale
 */
export function isPentatonicNote(
  stringIndex: number,
  fretNumber: number,
  rootNote: number,
  intervals: readonly number[]
): boolean {
  const noteAtFret = getNoteAtFret(stringIndex, fretNumber);
  const pentatonicNotes = intervals.map(
    (interval) => (rootNote + interval) % FRETBOARD_CONSTANTS.CHROMATIC_OCTAVE
  );
  return pentatonicNotes.includes(noteAtFret);
}

/**
 * Get all pentatonic note positions across the fretboard
 * @param rootNote - Root note chromatic value (0-11)
 * @param intervals - Pentatonic intervals array
 * @returns Array of positions containing pentatonic notes
 */
export function getPentatonicPositions(
  rootNote: number,
  intervals: readonly number[]
): Array<{ stringIndex: number; fretNumber: number }> {
  const positions: Array<{ stringIndex: number; fretNumber: number }> = [];

  for (let stringIndex = 0; stringIndex < STANDARD_TUNING.length; stringIndex++) {
    for (let fretNumber = 0; fretNumber <= FRETBOARD_CONSTANTS.MAX_FRET; fretNumber++) {
      if (isPentatonicNote(stringIndex, fretNumber, rootNote, intervals)) {
        positions.push({ stringIndex, fretNumber });
      }
    }
  }

  return positions;
}

/**
 * Calculate chromatic distance between two notes
 * @param fromNote - Starting note chromatic value (0-11)
 * @param toNote - Target note chromatic value (0-11)
 * @returns Chromatic distance in semitones (0-11)
 */
export function calculateChromaticDistance(fromNote: number, toNote: number): number {
  return (
    (toNote - fromNote + FRETBOARD_CONSTANTS.CHROMATIC_OCTAVE) %
    FRETBOARD_CONSTANTS.CHROMATIC_OCTAVE
  );
}

/**
 * Transpose a chord or scale pattern to a new root
 * @param pattern - Array of chromatic intervals
 * @param fromRoot - Original root note (0-11)
 * @param toRoot - Target root note (0-11)
 * @returns Transposed pattern
 */
export function transposePattern(pattern: number[], fromRoot: number, toRoot: number): number[] {
  const distance = calculateChromaticDistance(fromRoot, toRoot);
  return pattern.map((note) => (note + distance) % FRETBOARD_CONSTANTS.CHROMATIC_OCTAVE);
}
