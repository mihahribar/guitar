import { describe, it, expect } from 'vitest';
import {
  getPentatonicIntervals,
  getChordIntervals,
  isChordNote,
  calculateShapeFret,
  shouldShowChordDot,
} from './chordUtils';

describe('chordUtils', () => {
  describe('getPentatonicIntervals', () => {
    it('should return major pentatonic intervals', () => {
      const result = getPentatonicIntervals('major');
      expect(result).toEqual([0, 2, 4, 7, 9]);
    });

    it('should return minor pentatonic intervals', () => {
      const result = getPentatonicIntervals('minor');
      expect(result).toEqual([0, 3, 5, 7, 10]);
    });

    it('should return array of 5 numbers for major', () => {
      const result = getPentatonicIntervals('major');
      expect(result).toHaveLength(5);
      expect(result.every((n) => typeof n === 'number')).toBe(true);
    });

    it('should return array of 5 numbers for minor', () => {
      const result = getPentatonicIntervals('minor');
      expect(result).toHaveLength(5);
      expect(result.every((n) => typeof n === 'number')).toBe(true);
    });

    it('should return intervals between 0 and 11', () => {
      const major = getPentatonicIntervals('major');
      const minor = getPentatonicIntervals('minor');

      [...major, ...minor].forEach((interval) => {
        expect(interval).toBeGreaterThanOrEqual(0);
        expect(interval).toBeLessThan(12);
      });
    });
  });

  describe('getChordIntervals', () => {
    it('should return major chord intervals [0, 4, 7]', () => {
      const result = getChordIntervals('major');
      expect(result).toEqual([0, 4, 7]);
    });

    it('should return minor chord intervals [0, 3, 7]', () => {
      const result = getChordIntervals('minor');
      expect(result).toEqual([0, 3, 7]);
    });

    it('should return array of 3 numbers for major', () => {
      const result = getChordIntervals('major');
      expect(result).toHaveLength(3);
      expect(result.every((n) => typeof n === 'number')).toBe(true);
    });

    it('should return array of 3 numbers for minor', () => {
      const result = getChordIntervals('minor');
      expect(result).toHaveLength(3);
      expect(result.every((n) => typeof n === 'number')).toBe(true);
    });

    it('should return intervals between 0 and 11', () => {
      const major = getChordIntervals('major');
      const minor = getChordIntervals('minor');

      [...major, ...minor].forEach((interval) => {
        expect(interval).toBeGreaterThanOrEqual(0);
        expect(interval).toBeLessThan(12);
      });
    });

    it('should start with root note (0) for both qualities', () => {
      expect(getChordIntervals('major')[0]).toBe(0);
      expect(getChordIntervals('minor')[0]).toBe(0);
    });
  });

  describe('isChordNote', () => {
    it('should identify C major chord notes', () => {
      const rootNote = 0; // C
      const quality = 'major';

      // C note at fret 8 on low E string (string 5)
      expect(isChordNote(5, 8, rootNote, quality)).toBe(true);

      // E note at fret 7 on A string (string 4)
      expect(isChordNote(4, 7, rootNote, quality)).toBe(true);

      // G note at fret 10 on A string (string 4)
      expect(isChordNote(4, 10, rootNote, quality)).toBe(true);
    });

    it('should identify A minor chord notes', () => {
      const rootNote = 9; // A
      const quality = 'minor';

      // A note at fret 0 on A string (string 4)
      expect(isChordNote(4, 0, rootNote, quality)).toBe(true);

      // C note at fret 3 on A string (string 4)
      expect(isChordNote(4, 3, rootNote, quality)).toBe(true);

      // E note at fret 7 on A string (string 4)
      expect(isChordNote(4, 7, rootNote, quality)).toBe(true);
    });

    it('should reject notes not in the chord', () => {
      const rootNote = 0; // C major
      const quality = 'major';

      // D note (not in C major) at fret 10 on low E string
      expect(isChordNote(5, 10, rootNote, quality)).toBe(false);

      // F note (not in C major) at fret 1 on low E string
      expect(isChordNote(5, 1, rootNote, quality)).toBe(false);
    });

    it('should handle wrap-around for octaves', () => {
      const rootNote = 0; // C
      const quality = 'major';

      // C note at different octaves should all be chord notes
      expect(isChordNote(5, 8, rootNote, quality)).toBe(true); // C at fret 8
      expect(isChordNote(4, 3, rootNote, quality)).toBe(true); // C at fret 3
    });
  });

  describe('calculateShapeFret', () => {
    it('should return -1 for unplayed strings', () => {
      const shapePattern = [0, 1, 0, 2, 3, -1]; // Actual C shape pattern
      expect(calculateShapeFret(shapePattern, 5, 0)).toBe(-1);
    });

    it('should return 0 for open strings at position 0', () => {
      const shapePattern = [0, 1, 0, 2, 3, -1]; // Actual C shape pattern
      expect(calculateShapeFret(shapePattern, 2, 0)).toBe(0); // String 2 (G string) has pattern 0
      expect(calculateShapeFret(shapePattern, 0, 0)).toBe(0); // String 0 (high E) has pattern 0
    });

    it('should return base position for barre (pattern 0) when position > 0', () => {
      const shapePattern = [0, 0, 0, 0, 0, 0]; // Full barre
      expect(calculateShapeFret(shapePattern, 0, 5)).toBe(5);
      expect(calculateShapeFret(shapePattern, 3, 7)).toBe(7);
    });

    it('should add pattern offset to base position', () => {
      const shapePattern = [0, 1, 0, 2, 3, -1]; // Actual C shape pattern
      // String 4 has pattern 3, at position 5 = fret 8
      expect(calculateShapeFret(shapePattern, 4, 5)).toBe(8);
      // String 3 has pattern 2, at position 5 = fret 7
      expect(calculateShapeFret(shapePattern, 3, 5)).toBe(7);
    });

    it('should return -1 for invalid string index', () => {
      const shapePattern = [-1, 3, 2, 0, 1, 0];
      expect(calculateShapeFret(shapePattern, -1, 0)).toBe(-1);
      expect(calculateShapeFret(shapePattern, 6, 0)).toBe(-1);
      expect(calculateShapeFret(shapePattern, 10, 0)).toBe(-1);
    });

    it('should handle different base positions correctly', () => {
      const shapePattern = [2, 4, 4, 3, 2, 2]; // Example pattern
      expect(calculateShapeFret(shapePattern, 0, 0)).toBe(2); // Pattern 2 + position 0
      expect(calculateShapeFret(shapePattern, 0, 3)).toBe(5); // Pattern 2 + position 3
      expect(calculateShapeFret(shapePattern, 0, 7)).toBe(9); // Pattern 2 + position 7
    });
  });

  describe('shouldShowChordDot', () => {
    const shapePattern = [0, 1, 0, 2, 3, -1]; // Actual C shape pattern

    it('should return true when fret matches calculated shape fret', () => {
      // String 4, pattern 3, position 5 = fret 8
      expect(shouldShowChordDot(shapePattern, 4, 8, 5)).toBe(true);
      // String 3, pattern 2, position 5 = fret 7
      expect(shouldShowChordDot(shapePattern, 3, 7, 5)).toBe(true);
    });

    it('should return false when fret does not match calculated shape fret', () => {
      // String 4, pattern 3, position 5 = fret 8, checking fret 7
      expect(shouldShowChordDot(shapePattern, 4, 7, 5)).toBe(false);
      // String 4, pattern 3, position 5 = fret 8, checking fret 9
      expect(shouldShowChordDot(shapePattern, 4, 9, 5)).toBe(false);
    });

    it('should return false for open strings (fret 0)', () => {
      // Even if pattern calculates to 0, we don't show dots at fret 0
      expect(shouldShowChordDot(shapePattern, 2, 0, 0)).toBe(false);
      expect(shouldShowChordDot(shapePattern, 0, 0, 0)).toBe(false);
    });

    it('should return false for unplayed strings', () => {
      // String 5 has pattern -1 (not played)
      expect(shouldShowChordDot(shapePattern, 5, 5, 5)).toBe(false);
      expect(shouldShowChordDot(shapePattern, 5, 0, 0)).toBe(false);
    });

    it('should return true only when both string index and fret match', () => {
      const basePosition = 3;
      // String 4, pattern 3 = fret 6
      expect(shouldShowChordDot(shapePattern, 4, 6, basePosition)).toBe(true);
      // Same fret but different string
      expect(shouldShowChordDot(shapePattern, 3, 6, basePosition)).toBe(false);
      // Same string but different fret
      expect(shouldShowChordDot(shapePattern, 4, 7, basePosition)).toBe(false);
    });

    it('should handle base position changes', () => {
      // String 1 has pattern 1
      expect(shouldShowChordDot(shapePattern, 1, 1, 0)).toBe(true); // Position 0
      expect(shouldShowChordDot(shapePattern, 1, 6, 5)).toBe(true); // Position 5
      expect(shouldShowChordDot(shapePattern, 1, 11, 10)).toBe(true); // Position 10
    });
  });
});
