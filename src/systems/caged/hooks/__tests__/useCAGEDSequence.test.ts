import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCAGEDSequence } from '../useCAGEDSequence';
import { FRETBOARD_CONSTANTS } from '@/shared/constants/magicNumbers';
import { getNoteAtFret } from '@/shared/utils/musicTheory';
import { CAGED_SHAPE_DATA, CAGED_SHAPES_BY_QUALITY, CHROMATIC_VALUES } from '../../constants';
import type { ChordQuality, ChordType } from '@/shared/types/core';

describe('useCAGEDSequence', () => {
  const cagedChords: ChordType[] = ['C', 'A', 'G', 'E', 'D'];
  const allRoots = Array.from({ length: 12 }, (_, root) => root);

  it('starts with the natural open form for each CAGED chord', () => {
    for (const chord of cagedChords) {
      const { result } = renderHook(() => useCAGEDSequence(CHROMATIC_VALUES[chord]));
      // The lowest entry should be the chord's own shape at fret 0 (open form).
      expect(result.current[0]).toEqual({ shape: chord, basePosition: 0 });
    }
  });

  it('starts every other root within two frets of the nut', () => {
    // C# opens with the C shape at fret 1, F with the E shape at fret 1
    expect(renderHook(() => useCAGEDSequence(1)).result.current[0]).toEqual({
      shape: 'C',
      basePosition: 1,
    });
    expect(renderHook(() => useCAGEDSequence(5)).result.current[0]).toEqual({
      shape: 'E',
      basePosition: 1,
    });
    for (const root of allRoots) {
      const { result } = renderHook(() => useCAGEDSequence(root));
      expect(result.current[0].basePosition).toBeLessThanOrEqual(2);
    }
  });

  it('returns entries sorted by basePosition ascending', () => {
    for (const root of allRoots) {
      const { result } = renderHook(() => useCAGEDSequence(root));
      const positions = result.current.map((entry) => entry.basePosition);
      const sorted = [...positions].sort((a, b) => a - b);
      expect(positions).toEqual(sorted);
    }
  });

  it('only includes shapes that fit within MAX_FRET', () => {
    for (const root of allRoots) {
      const { result } = renderHook(() => useCAGEDSequence(root));
      for (const { shape, basePosition } of result.current) {
        const maxPatternFret = Math.max(...CAGED_SHAPE_DATA[shape].pattern.filter((f) => f !== -1));
        expect(basePosition + maxPatternFret).toBeLessThanOrEqual(FRETBOARD_CONSTANTS.MAX_FRET);
      }
    }
  });

  it('plays only chord tones, with the root on every root string, for all 12 roots', () => {
    const intervals: Record<ChordQuality, number[]> = { major: [0, 4, 7], minor: [0, 3, 7] };
    for (const quality of ['major', 'minor'] as const) {
      for (const root of allRoots) {
        const chordTones = intervals[quality].map((interval) => (root + interval) % 12);
        const { result } = renderHook(() => useCAGEDSequence(root));
        for (const { shape, basePosition } of result.current) {
          const { pattern, rootNotes } = CAGED_SHAPES_BY_QUALITY[quality][shape];
          pattern.forEach((fret, stringIndex) => {
            if (fret === -1) return;
            const note = getNoteAtFret(stringIndex, fret + basePosition);
            expect(chordTones).toContain(note);
            if (rootNotes.includes(stringIndex)) expect(note).toBe(root);
          });
        }
      }
    }
  });

  it('includes octave-up repeats when they fit on the neck', () => {
    // For chord G, the G shape itself (max pattern fret = 3) sits at fret 0 and again
    // at fret 12 — both fit within 21 frets, so it should appear twice.
    const { result } = renderHook(() => useCAGEDSequence(CHROMATIC_VALUES.G));
    const gEntries = result.current.filter((e) => e.shape === 'G');
    expect(gEntries).toEqual([
      { shape: 'G', basePosition: 0 },
      { shape: 'G', basePosition: 12 },
    ]);
  });

  it('produces a sequence longer than 5 (now walks the full neck)', () => {
    for (const root of allRoots) {
      const { result } = renderHook(() => useCAGEDSequence(root));
      // Each root includes its 5 natural shapes plus at least a few octave-ups.
      expect(result.current.length).toBeGreaterThan(5);
    }
  });

  it('memoizes by root: stable identity across rerenders', () => {
    const { result, rerender } = renderHook(({ root }) => useCAGEDSequence(root), {
      initialProps: { root: 0 },
    });
    const first = result.current;
    rerender({ root: 0 });
    expect(result.current).toBe(first);
  });
});
