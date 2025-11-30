import { describe, it, expect } from 'vitest';
import {
  getNoteAtFret,
  getNoteNameAtFret,
  shouldShowNoteName,
  isPentatonicNote,
  calculateChromaticDistance,
  transposePattern,
  CHROMATIC_TO_NOTE_NAME,
  STANDARD_TUNING,
} from './musicTheory';

describe('musicTheory utilities', () => {
  describe('getNoteAtFret', () => {
    it('should return correct note for open strings', () => {
      // STANDARD_TUNING is [4, 11, 7, 2, 9, 4] = [E, B, G, D, A, E] from high to low
      expect(getNoteAtFret(0, 0)).toBe(4); // High E (string 0)
      expect(getNoteAtFret(1, 0)).toBe(11); // B (string 1)
      expect(getNoteAtFret(2, 0)).toBe(7); // G (string 2)
      expect(getNoteAtFret(3, 0)).toBe(2); // D (string 3)
      expect(getNoteAtFret(4, 0)).toBe(9); // A (string 4)
      expect(getNoteAtFret(5, 0)).toBe(4); // Low E (string 5)
    });

    it('should calculate chromatic values correctly', () => {
      // High E string (0), 5th fret = A (4 + 5 = 9)
      expect(getNoteAtFret(0, 5)).toBe(9);

      // B string (1), 2nd fret = C# (11 + 2 = 13 % 12 = 1)
      expect(getNoteAtFret(1, 2)).toBe(1);

      // G string (2), 5th fret = C (7 + 5 = 12 % 12 = 0)
      expect(getNoteAtFret(2, 5)).toBe(0);
    });

    it('should wrap around chromatic octave correctly', () => {
      // High E string (4), 12th fret should be same as open (4)
      expect(getNoteAtFret(5, 12)).toBe(4);

      // Low E string (4), 8th fret = C (0)
      expect(getNoteAtFret(0, 8)).toBe(0);
    });

    it('should throw error for invalid string index', () => {
      expect(() => getNoteAtFret(-1, 0)).toThrow('Invalid string index');
      expect(() => getNoteAtFret(6, 0)).toThrow('Invalid string index');
    });

    it('should throw error for invalid fret number', () => {
      expect(() => getNoteAtFret(0, -1)).toThrow('Invalid fret number');
      expect(() => getNoteAtFret(0, 16)).toThrow('Invalid fret number');
    });
  });

  describe('getNoteNameAtFret', () => {
    it('should return correct note names for open strings', () => {
      expect(getNoteNameAtFret(0, 0)).toBe('E'); // High E
      expect(getNoteNameAtFret(1, 0)).toBe('B'); // B
      expect(getNoteNameAtFret(2, 0)).toBe('G'); // G
      expect(getNoteNameAtFret(3, 0)).toBe('D'); // D
      expect(getNoteNameAtFret(4, 0)).toBe('A'); // A
      expect(getNoteNameAtFret(5, 0)).toBe('E'); // Low E
    });

    it('should return correct note names with sharps', () => {
      expect(getNoteNameAtFret(0, 1)).toBe('F'); // Low E, 1st fret
      expect(getNoteNameAtFret(0, 3)).toBe('G'); // Low E, 3rd fret
      expect(getNoteNameAtFret(0, 6)).toBe('A#'); // Low E, 6th fret
    });
  });

  describe('shouldShowNoteName', () => {
    it('should return true for natural notes', () => {
      // C (0), D (2), E (4), F (5), G (7), A (9), B (11)
      expect(shouldShowNoteName(0, 8)).toBe(true); // C on low E string, 8th fret
      expect(shouldShowNoteName(0, 0)).toBe(true); // E on low E string, open
      expect(shouldShowNoteName(2, 0)).toBe(true); // D on D string, open
    });

    it('should return false for sharp notes', () => {
      // F# on high E string (4 + 2 = 6, which is F#, a sharp)
      expect(shouldShowNoteName(0, 2)).toBe(false);
      // D# on B string (11 + 4 = 15 % 12 = 3, which is D#, a sharp)
      expect(shouldShowNoteName(1, 4)).toBe(false);
    });
  });

  describe('isPentatonicNote', () => {
    it('should identify pentatonic notes correctly', () => {
      const majorPentatonicIntervals = [0, 2, 4, 7, 9];
      const rootNote = 0; // C

      // C major pentatonic: C, D, E, G, A
      expect(isPentatonicNote(0, 8, rootNote, majorPentatonicIntervals)).toBe(true); // C
      expect(isPentatonicNote(0, 10, rootNote, majorPentatonicIntervals)).toBe(true); // D
      expect(isPentatonicNote(0, 12, rootNote, majorPentatonicIntervals)).toBe(true); // E
    });

    it('should return false for non-pentatonic notes', () => {
      const majorPentatonicIntervals = [0, 2, 4, 7, 9];
      const rootNote = 0; // C

      // F is not in C major pentatonic
      expect(isPentatonicNote(0, 1, rootNote, majorPentatonicIntervals)).toBe(false);
    });
  });

  describe('calculateChromaticDistance', () => {
    it('should calculate forward distances correctly', () => {
      expect(calculateChromaticDistance(0, 5)).toBe(5); // C to F
      expect(calculateChromaticDistance(0, 7)).toBe(7); // C to G
    });

    it('should calculate backward distances with wraparound', () => {
      expect(calculateChromaticDistance(5, 0)).toBe(7); // F to C (wraps around)
      expect(calculateChromaticDistance(7, 0)).toBe(5); // G to C (wraps around)
    });

    it('should return 0 for same note', () => {
      expect(calculateChromaticDistance(0, 0)).toBe(0);
      expect(calculateChromaticDistance(7, 7)).toBe(0);
    });
  });

  describe('transposePattern', () => {
    it('should transpose pattern correctly', () => {
      const pattern = [0, 4, 7]; // C major chord (C, E, G)
      const fromRoot = 0; // C
      const toRoot = 2; // D

      const transposed = transposePattern(pattern, fromRoot, toRoot);
      expect(transposed).toEqual([2, 6, 9]); // D major chord (D, F#, A)
    });

    it('should handle wraparound correctly', () => {
      const pattern = [10, 2, 5]; // Pattern with notes near octave boundary
      const fromRoot = 0;
      const toRoot = 3;

      const transposed = transposePattern(pattern, fromRoot, toRoot);
      expect(transposed).toEqual([1, 5, 8]); // All notes wrapped correctly
    });

    it('should return same pattern when transposing to same root', () => {
      const pattern = [0, 4, 7];
      const transposed = transposePattern(pattern, 0, 0);
      expect(transposed).toEqual(pattern);
    });
  });

  describe('CHROMATIC_TO_NOTE_NAME', () => {
    it('should have 12 chromatic notes', () => {
      expect(CHROMATIC_TO_NOTE_NAME).toHaveLength(12);
    });

    it('should start with C and end with B', () => {
      expect(CHROMATIC_TO_NOTE_NAME[0]).toBe('C');
      expect(CHROMATIC_TO_NOTE_NAME[11]).toBe('B');
    });
  });

  describe('STANDARD_TUNING', () => {
    it('should have 6 strings', () => {
      expect(STANDARD_TUNING).toHaveLength(6);
    });

    it('should have correct tuning values', () => {
      // High E to Low E: E(4), B(11), G(7), D(2), A(9), E(4)
      expect(STANDARD_TUNING).toEqual([4, 11, 7, 2, 9, 4]);
    });
  });
});
