import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCAGEDLogic } from '../useCAGEDLogic';
import type { ChordType, ChordQuality } from '@/shared/types/core';

describe('useCAGEDLogic', () => {
  describe('shape positions', () => {
    it('should calculate C major positions correctly', () => {
      const { result } = renderHook(() => useCAGEDLogic('C', 'major', ['C', 'A', 'G', 'E', 'D']));

      // CHROMATIC_VALUES: C=0, A=9, G=7, E=4, D=2
      // For C (target=0): C=0-0=0, A=0-9+12=3, G=0-7+12=5, E=0-4+12=8, D=0-2+12=10
      expect(result.current.shapePositions).toEqual({
        C: 0,
        A: 3,
        G: 5,
        E: 8,
        D: 10,
      });
    });

    it('should calculate A minor positions correctly', () => {
      const { result } = renderHook(() => useCAGEDLogic('A', 'minor', ['C', 'A', 'G', 'E', 'D']));

      // For A (target=9): C=9-0=9, A=9-9=0, G=9-7=2, E=9-4=5, D=9-2=7
      expect(result.current.shapePositions).toEqual({
        C: 9,
        A: 0,
        G: 2,
        E: 5,
        D: 7,
      });
    });

    it('should calculate G major positions correctly', () => {
      const { result } = renderHook(() => useCAGEDLogic('G', 'major', ['C', 'A', 'G', 'E', 'D']));

      // For G (target=7): C=7-0=7, A=7-9+12=10, G=7-7=0, E=7-4=3, D=7-2=5
      expect(result.current.shapePositions).toEqual({
        C: 7,
        A: 10,
        G: 0,
        E: 3,
        D: 5,
      });
    });

    it('should calculate E major positions correctly', () => {
      const { result } = renderHook(() => useCAGEDLogic('E', 'major', ['C', 'A', 'G', 'E', 'D']));

      // For E (target=4): C=4-0=4, A=4-9+12=7, G=4-7+12=9, E=4-4=0, D=4-2=2
      expect(result.current.shapePositions).toEqual({
        C: 4,
        A: 7,
        G: 9,
        E: 0,
        D: 2,
      });
    });

    it('should calculate D minor positions correctly', () => {
      const { result } = renderHook(() => useCAGEDLogic('D', 'minor', ['C', 'A', 'G', 'E', 'D']));

      // For D (target=2): C=2-0=2, A=2-9+12=5, G=2-7+12=7, E=2-4+12=10, D=2-2=0
      expect(result.current.shapePositions).toEqual({
        C: 2,
        A: 5,
        G: 7,
        E: 10,
        D: 0,
      });
    });

    // Test all chords - positions should be in valid range
    const chords: ChordType[] = ['C', 'A', 'G', 'E', 'D'];
    const qualities: ChordQuality[] = ['major', 'minor'];

    chords.forEach((chord) => {
      qualities.forEach((quality) => {
        it(`should calculate valid positions for ${chord} ${quality}`, () => {
          const { result } = renderHook(() =>
            useCAGEDLogic(chord, quality, ['C', 'A', 'G', 'E', 'D'])
          );

          // All positions should be between 0-11 (chromatic scale)
          Object.values(result.current.shapePositions).forEach((pos) => {
            expect(pos).toBeGreaterThanOrEqual(0);
            expect(pos).toBeLessThan(12);
          });
        });
      });
    });
  });

  describe('getShapeFret', () => {
    it('should return valid fret numbers for C shape', () => {
      const { result } = renderHook(() => useCAGEDLogic('C', 'major', ['C']));

      // Test all strings
      for (let string = 0; string < 6; string++) {
        const fret = result.current.getShapeFret('C', string, 0);

        // Fret should be -1 (not played) or 0-15 (valid fret)
        expect(fret).toBeGreaterThanOrEqual(-1);
        expect(fret).toBeLessThanOrEqual(15);
      }
    });

    it('should handle base position offset correctly', () => {
      const { result } = renderHook(() => useCAGEDLogic('C', 'major', ['C']));

      // Get fret at position 0
      const fretAtZero = result.current.getShapeFret('C', 0, 0);

      // If string is played (not -1), check position offset works
      if (fretAtZero !== -1 && fretAtZero > 0) {
        const fretAtFive = result.current.getShapeFret('C', 0, 5);
        expect(fretAtFive).toBe(fretAtZero + 5);
      }
    });

    it('should return -1 for unplayed strings', () => {
      const { result } = renderHook(() => useCAGEDLogic('C', 'major', ['C']));

      // Low E string (string 5) is not played in C shape
      const fret = result.current.getShapeFret('C', 5, 0);
      expect(fret).toBe(-1);
    });

    it('should handle open strings correctly', () => {
      const { result } = renderHook(() => useCAGEDLogic('C', 'major', ['C']));

      // C shape pattern: [0, 1, 0, 2, 3, -1]
      // String 0 (high E) has pattern 0 = open
      // String 2 (G string) has pattern 0 = open
      const highEFret = result.current.getShapeFret('C', 0, 0);
      const gStringFret = result.current.getShapeFret('C', 2, 0);

      // Both should be 0 (open string)
      expect(highEFret).toBe(0);
      expect(gStringFret).toBe(0);
    });

    it('should work with different chord qualities', () => {
      const { result: majorResult } = renderHook(() => useCAGEDLogic('A', 'major', ['A']));
      const { result: minorResult } = renderHook(() => useCAGEDLogic('A', 'minor', ['A']));

      // Get fret for A shape at position 0
      const majorFret = majorResult.current.getShapeFret('A', 0, 0);
      const minorFret = minorResult.current.getShapeFret('A', 0, 0);

      // Both should return valid fret numbers
      expect(majorFret).toBeGreaterThanOrEqual(-1);
      expect(minorFret).toBeGreaterThanOrEqual(-1);
    });
  });

  describe('getShapesAtPosition', () => {
    it('should find shapes at a specific position', () => {
      const { result } = renderHook(() => useCAGEDLogic('C', 'major', ['C', 'A', 'G', 'E', 'D']));

      // Get shapes at a position - this will vary based on actual patterns
      const shapes = result.current.getShapesAtPosition(1, 1);

      // Should return an array
      expect(Array.isArray(shapes)).toBe(true);

      // Each element should be a valid CAGED shape
      shapes.forEach((shape) => {
        expect(['C', 'A', 'G', 'E', 'D']).toContain(shape);
      });
    });

    it('should return empty array when no shapes at position', () => {
      const { result } = renderHook(() => useCAGEDLogic('C', 'major', ['C', 'A', 'G', 'E', 'D']));

      // Fret 0 should not have any shapes (open strings excluded)
      const shapes = result.current.getShapesAtPosition(0, 0);
      expect(shapes).toEqual([]);
    });

    it('should find overlapping shapes', () => {
      const { result } = renderHook(() => useCAGEDLogic('C', 'major', ['C', 'A', 'G', 'E', 'D']));

      // Search across fretboard for overlaps
      let foundOverlap = false;

      for (let string = 0; string < 6; string++) {
        for (let fret = 1; fret <= 15; fret++) {
          const shapes = result.current.getShapesAtPosition(string, fret);
          if (shapes.length > 1) {
            foundOverlap = true;
            // All shapes should be valid
            shapes.forEach((shape) => {
              expect(['C', 'A', 'G', 'E', 'D']).toContain(shape);
            });
          }
        }
      }

      // CAGED system has overlapping shapes, so we should find at least one
      expect(foundOverlap).toBe(true);
    });
  });

  describe('gradient styles', () => {
    it('should return solid color for single shape', () => {
      const { result } = renderHook(() => useCAGEDLogic('C', 'major', ['C']));

      const style = result.current.createGradientStyle(['C']);

      expect(style).toHaveProperty('backgroundColor');
      expect(style?.backgroundColor).toBeTruthy();
    });

    it('should return 50/50 gradient for two shapes', () => {
      const { result } = renderHook(() => useCAGEDLogic('C', 'major', ['C', 'A']));

      const style = result.current.createGradientStyle(['C', 'A']);

      expect(style).toHaveProperty('background');
      expect(style?.background).toContain('linear-gradient');
      expect(style?.background).toContain('50%');
    });

    it('should handle three or more shapes with equal segments', () => {
      const { result } = renderHook(() => useCAGEDLogic('C', 'major', ['C', 'A', 'G']));

      const style = result.current.createGradientStyle(['C', 'A', 'G']);

      expect(style).toHaveProperty('background');
      expect(style?.background).toContain('linear-gradient');
    });

    it('should handle four shapes', () => {
      const { result } = renderHook(() => useCAGEDLogic('C', 'major', ['C', 'A', 'G', 'E']));

      const style = result.current.createGradientStyle(['C', 'A', 'G', 'E']);

      expect(style).toHaveProperty('background');
      expect(style?.background).toContain('linear-gradient');
    });

    it('should handle all five shapes', () => {
      const { result } = renderHook(() => useCAGEDLogic('C', 'major', ['C', 'A', 'G', 'E', 'D']));

      const style = result.current.createGradientStyle(['C', 'A', 'G', 'E', 'D']);

      expect(style).toHaveProperty('background');
      expect(style?.background).toContain('linear-gradient');
    });

    it('should use different colors for different shapes', () => {
      const { result } = renderHook(() => useCAGEDLogic('C', 'major', ['C', 'A']));

      const cStyle = result.current.createGradientStyle(['C']);
      const aStyle = result.current.createGradientStyle(['A']);

      // Colors should be different
      expect(cStyle?.backgroundColor).not.toBe(aStyle?.backgroundColor);
    });
  });

  describe('pentatonic notes', () => {
    it('should identify root note as pentatonic', () => {
      const { result } = renderHook(() => useCAGEDLogic('C', 'major', ['C']));

      // C note at fret 8 on low E string
      const isPentatonic = result.current.isPentatonicNote(5, 8);
      expect(isPentatonic).toBe(true);
    });

    it('should identify pentatonic notes for major scale', () => {
      const { result } = renderHook(() => useCAGEDLogic('C', 'major', ['C']));

      // C major pentatonic: C D E G A
      // These should all be pentatonic
      const isPentatonic = result.current.isPentatonicNote(5, 8); // C
      expect(isPentatonic).toBe(true);
    });

    it('should identify pentatonic notes for minor scale', () => {
      const { result } = renderHook(() => useCAGEDLogic('A', 'minor', ['A']));

      // A minor pentatonic: A C D E G
      // A note at fret 5 on low E string
      const isPentatonic = result.current.isPentatonicNote(5, 5);
      expect(isPentatonic).toBe(true);
    });

    it('should return pentatonic positions array', () => {
      const { result } = renderHook(() => useCAGEDLogic('C', 'major', ['C']));

      const positions = result.current.getPentatonicPositions;

      // Should be an array
      expect(Array.isArray(positions)).toBe(true);

      // Should have positions
      expect(positions.length).toBeGreaterThan(0);

      // Each position should have stringIndex and fretNumber
      positions.forEach((pos) => {
        expect(pos).toHaveProperty('stringIndex');
        expect(pos).toHaveProperty('fretNumber');
        expect(pos.stringIndex).toBeGreaterThanOrEqual(0);
        expect(pos.stringIndex).toBeLessThan(6);
        expect(pos.fretNumber).toBeGreaterThanOrEqual(0);
        expect(pos.fretNumber).toBeLessThanOrEqual(15);
      });
    });
  });

  describe('chord quality changes', () => {
    it('should recalculate when chord quality changes', () => {
      const { result, rerender } = renderHook(
        ({ chord, quality }) => useCAGEDLogic(chord, quality, ['C', 'A']),
        {
          initialProps: {
            chord: 'C' as ChordType,
            quality: 'major' as ChordQuality,
          },
        }
      );

      const majorPositions = result.current.shapePositions;

      // Change to minor
      rerender({ chord: 'C', quality: 'minor' });

      const minorPositions = result.current.shapePositions;

      // Positions should be the same (minor doesn't change positions, just intervals)
      expect(majorPositions).toEqual(minorPositions);
    });

    it('should update pentatonic notes when quality changes', () => {
      const { result, rerender } = renderHook(
        ({ chord, quality }) => useCAGEDLogic(chord, quality, ['A']),
        {
          initialProps: {
            chord: 'A' as ChordType,
            quality: 'major' as ChordQuality,
          },
        }
      );

      const majorPentatonic = result.current.getPentatonicPositions;

      // Change to minor
      rerender({ chord: 'A', quality: 'minor' });

      const minorPentatonic = result.current.getPentatonicPositions;

      // Pentatonic positions should be different for major vs minor
      expect(majorPentatonic).not.toEqual(minorPentatonic);
    });
  });

  describe('note name utilities', () => {
    it('should provide getNoteNameAtFret function', () => {
      const { result } = renderHook(() => useCAGEDLogic('C', 'major', ['C']));

      expect(typeof result.current.getNoteNameAtFret).toBe('function');
    });

    it('should provide shouldShowNoteName function', () => {
      const { result } = renderHook(() => useCAGEDLogic('C', 'major', ['C']));

      expect(typeof result.current.shouldShowNoteName).toBe('function');
    });
  });

  describe('memoization', () => {
    it('should not recalculate when sequence changes but chord stays same', () => {
      const { result, rerender } = renderHook(
        ({ chord, quality, sequence }) => useCAGEDLogic(chord, quality, sequence),
        {
          initialProps: {
            chord: 'C' as ChordType,
            quality: 'major' as ChordQuality,
            sequence: ['C', 'A'],
          },
        }
      );

      const firstPositions = result.current.shapePositions;

      // Change sequence but keep chord and quality same
      rerender({ chord: 'C', quality: 'major', sequence: ['C', 'A', 'G'] });

      const secondPositions = result.current.shapePositions;

      // Positions should be the same object (memoized)
      expect(firstPositions).toBe(secondPositions);
    });

    it('should recalculate when chord changes', () => {
      const { result, rerender } = renderHook(
        ({ chord, quality, sequence }) => useCAGEDLogic(chord, quality, sequence),
        {
          initialProps: {
            chord: 'C' as ChordType,
            quality: 'major' as ChordQuality,
            sequence: ['C', 'A'],
          },
        }
      );

      const cPositions = result.current.shapePositions;

      // Change chord
      rerender({ chord: 'G', quality: 'major', sequence: ['C', 'A'] });

      const gPositions = result.current.shapePositions;

      // Positions should be different
      expect(cPositions).not.toEqual(gPositions);
    });
  });
});
