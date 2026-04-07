import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCAGEDSequence } from '../useCAGEDSequence';
import { FRETBOARD_CONSTANTS } from '@/shared/constants/magicNumbers';
import { CAGED_SHAPE_DATA } from '../../constants';
import type { ChordType } from '@/shared/types/core';

describe('useCAGEDSequence', () => {
  const allChords: ChordType[] = ['C', 'A', 'G', 'E', 'D'];

  it('starts with the natural open form for each chord', () => {
    for (const chord of allChords) {
      const { result } = renderHook(() => useCAGEDSequence(chord));
      // The lowest entry should be the chord's own shape at fret 0 (open form).
      expect(result.current[0]).toEqual({ shape: chord, basePosition: 0 });
    }
  });

  it('returns entries sorted by basePosition ascending', () => {
    for (const chord of allChords) {
      const { result } = renderHook(() => useCAGEDSequence(chord));
      const positions = result.current.map((entry) => entry.basePosition);
      const sorted = [...positions].sort((a, b) => a - b);
      expect(positions).toEqual(sorted);
    }
  });

  it('only includes shapes that fit within MAX_FRET', () => {
    for (const chord of allChords) {
      const { result } = renderHook(() => useCAGEDSequence(chord));
      for (const { shape, basePosition } of result.current) {
        const maxPatternFret = Math.max(...CAGED_SHAPE_DATA[shape].pattern.filter((f) => f !== -1));
        expect(basePosition + maxPatternFret).toBeLessThanOrEqual(FRETBOARD_CONSTANTS.MAX_FRET);
      }
    }
  });

  it('includes octave-up repeats when they fit on the neck', () => {
    // For chord G, the G shape itself (max pattern fret = 3) sits at fret 0 and again
    // at fret 12 — both fit within 21 frets, so it should appear twice.
    const { result } = renderHook(() => useCAGEDSequence('G'));
    const gEntries = result.current.filter((e) => e.shape === 'G');
    expect(gEntries).toEqual([
      { shape: 'G', basePosition: 0 },
      { shape: 'G', basePosition: 12 },
    ]);
  });

  it('produces a sequence longer than 5 (now walks the full neck)', () => {
    for (const chord of allChords) {
      const { result } = renderHook(() => useCAGEDSequence(chord));
      // Each chord includes its 5 natural shapes plus at least a few octave-ups.
      expect(result.current.length).toBeGreaterThan(5);
    }
  });

  it('memoizes by chord — stable identity across rerenders', () => {
    const { result, rerender } = renderHook(({ chord }) => useCAGEDSequence(chord), {
      initialProps: { chord: 'C' as ChordType },
    });
    const first = result.current;
    rerender({ chord: 'C' });
    expect(result.current).toBe(first);
  });
});
