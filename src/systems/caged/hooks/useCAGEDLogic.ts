import { useMemo } from 'react';
import type { ChordType, ChordQuality } from '@/shared/types/core';
import { CHROMATIC_VALUES, CAGED_SHAPES_BY_QUALITY } from '../constants';
import {
  getNoteNameAtFret,
  shouldShowNoteName,
  isPentatonicNote,
  getPentatonicPositions,
} from '@/shared/utils/musicTheory';
import { getPentatonicIntervals } from '@/shared/utils/chordUtils';

/**
 * Custom hook for managing CAGED chord system logic and calculations
 *
 * Provides fretboard positioning, shape calculations, and visual styling
 * for guitar chord patterns. Handles both major and minor chord qualities
 * with support for pentatonic scale overlays and gradient blending for
 * overlapping chord shapes.
 *
 * @param selectedChord - The root chord (C, A, G, E, D) to build patterns from
 * @param chordQuality - Major or minor chord quality affecting interval patterns
 * @param cagedSequence - Array of shapes in CAGED sequence order for display
 *
 * @returns Object containing:
 *   - shapePositions: Calculated fret positions for each CAGED shape
 *   - getShapeFret: Function to get fret number for specific shape at string
 *   - getShapesAtPosition: Function to get overlapping shapes at fret position
 *   - createGradientStyle: Function to generate CSS for multiple overlapping shapes
 *   - isPentatonicNote: Function to check pentatonic scale membership
 *   - getPentatonicPositions: Array of all pentatonic note positions on fretboard
 *   - getNoteNameAtFret: Function to get note name at specific string/fret
 *   - shouldShowNoteName: Function to check if note should be displayed (naturals only)
 *
 * @example
 * ```typescript
 * const { shapePositions, getShapeFret, createGradientStyle } = useCAGEDLogic('C', 'major', ['C', 'A', 'G', 'E', 'D']);
 *
 * // Get C shape fret position on low E string (string 0)
 * const fret = getShapeFret('C', 0, shapePositions['C']);
 *
 * // Create gradient style for overlapping shapes
 * const style = createGradientStyle(['C', 'A']);
 * ```
 *
 * @performance Expensive calculations are memoized based on chord and quality changes.
 * Shape position calculations and pentatonic note filtering use useMemo for optimization.
 *
 * @musicTheory
 * The CAGED system uses 5 moveable chord shapes that can be positioned anywhere on the neck.
 * - Major chord intervals: Root(0), Major Third(4), Perfect Fifth(7)
 * - Minor chord intervals: Root(0), Minor Third(3), Perfect Fifth(7)
 * - Pentatonic scales: Major (0,2,4,7,9) and Minor (0,3,5,7,10) intervals from root
 * - Shape transposition: Each shape pattern is offset by the chromatic distance to target chord
 */
export function useCAGEDLogic(
  selectedChord: ChordType,
  chordQuality: ChordQuality,
  cagedSequence: string[]
) {
  // Get the appropriate shape data based on chord quality (major vs minor patterns)
  const shapeData = useMemo(() => CAGED_SHAPES_BY_QUALITY[chordQuality], [chordQuality]);

  // Calculate fret positions for each CAGED shape relative to the selected chord
  const shapePositions = useMemo(() => {
    const targetValue = CHROMATIC_VALUES[selectedChord]; // Target chord's chromatic value (0-11)
    const positions: { [key: string]: number } = {};

    // For each CAGED shape, calculate how many frets to move from its natural position
    // to match the selected chord. Uses modular arithmetic to handle octave wrapping.
    for (const [shapeKey, shapeRoot] of Object.entries(CHROMATIC_VALUES)) {
      // Calculate chromatic distance: (target - origin + 12) % 12
      // +12 ensures positive result, %12 wraps to single octave
      positions[shapeKey] = (targetValue - shapeRoot + 12) % 12;
    }

    return positions;
  }, [selectedChord]);

  /**
   * Calculate the actual fret number for a CAGED shape at a specific string
   * @param shapeKey - CAGED shape letter (C, A, G, E, D)
   * @param stringIndex - Guitar string index (0 = low E, 5 = high E)
   * @param basePosition - Base fret position for this shape
   * @returns Fret number to play, or -1 if string not played
   */
  const getShapeFret = useMemo(
    () => (shapeKey: string, stringIndex: number, basePosition: number) => {
      const shape = shapeData[shapeKey];
      const patternFret = shape.pattern[stringIndex]; // Relative fret from shape pattern

      // Handle special cases in CAGED patterns:
      if (patternFret === -1) return -1; // String not played in this shape
      if (patternFret === 0 && basePosition === 0) return 0; // Open string (absolute position 0)
      if (patternFret === 0 && basePosition > 0) return basePosition; // Barre at base position

      // Standard case: add pattern offset to base position
      return patternFret + basePosition;
    },
    [shapeData]
  );

  const getShapesAtPosition = useMemo(
    () => (stringIndex: number, fretNumber: number) => {
      const shapesHere: string[] = [];
      for (const shapeKey of cagedSequence) {
        const basePosition = shapePositions[shapeKey];
        const shapeFret = getShapeFret(shapeKey, stringIndex, basePosition);
        if (shapeFret === fretNumber && shapeFret > 0) {
          shapesHere.push(shapeKey);
        }
      }
      return shapesHere;
    },
    [cagedSequence, shapePositions, getShapeFret]
  );

  /**
   * Generate CSS styling for overlapping CAGED shapes using gradients
   * @param shapes - Array of shape keys that overlap at this position
   * @returns CSS style object with appropriate background
   */
  const createGradientStyle = useMemo(
    () => (shapes: string[]) => {
      // Single shape: solid color background
      if (shapes.length === 1) {
        return { backgroundColor: shapeData[shapes[0]].color };
      }
      // Two shapes: split 50/50 with hard edge
      else if (shapes.length === 2) {
        const color1 = shapeData[shapes[0]].color;
        const color2 = shapeData[shapes[1]].color;
        return {
          background: `linear-gradient(90deg, ${color1} 50%, ${color2} 50%)`,
        };
      }
      // Multiple shapes: equal segments across width
      else if (shapes.length > 2) {
        const colors = shapes.map((shape) => shapeData[shape].color);
        // Create equal-width segments with hard transitions between colors
        const gradientStops = colors
          .map(
            (color, i) =>
              `${color} ${(i * 100) / colors.length}%, ${color} ${((i + 1) * 100) / colors.length}%`
          )
          .join(', ');
        return {
          background: `linear-gradient(90deg, ${gradientStops})`,
        };
      }
    },
    [shapeData]
  );

  // Use shared pentatonic logic
  const isPentatonicNoteAtPosition = useMemo(() => {
    const rootNote = CHROMATIC_VALUES[selectedChord];
    const intervals = getPentatonicIntervals(chordQuality);

    return (stringIndex: number, fretNumber: number) => {
      return isPentatonicNote(stringIndex, fretNumber, rootNote, intervals);
    };
  }, [selectedChord, chordQuality]);

  // Use shared pentatonic positions utility
  const allPentatonicPositions = useMemo(() => {
    const rootNote = CHROMATIC_VALUES[selectedChord];
    const intervals = getPentatonicIntervals(chordQuality);
    return getPentatonicPositions(rootNote, intervals);
  }, [selectedChord, chordQuality]);

  return {
    shapePositions,
    getShapeFret,
    getShapesAtPosition,
    createGradientStyle,
    isPentatonicNote: isPentatonicNoteAtPosition,
    getPentatonicPositions: allPentatonicPositions,
    getNoteNameAtFret,
    shouldShowNoteName,
  };
}
