import { describe, expect, it } from 'vitest';
import { ALL_PATTERNS, PATTERNS_BY_CATEGORY } from '.';
import type { RhythmNote } from '../types';
import { getPlayedSlots } from '../utils/rhythmUtils';

const onsets = (notes: RhythmNote[], slotCount: number) =>
  getPlayedSlots(notes, slotCount)
    .map((played) => (played ? 'x' : '-'))
    .join('');

describe('rhythm patterns', () => {
  it('fill exactly one beat and have unique ids', () => {
    for (const pattern of ALL_PATTERNS) {
      const total = pattern.notes.reduce((sum, note) => sum + note.duration, 0);
      expect(total, pattern.id).toBeCloseTo(1);
    }
    expect(new Set(ALL_PATTERNS.map((p) => p.id)).size).toBe(ALL_PATTERNS.length);
  });

  it('cover every way to play on the sixteenth slots of a beat', () => {
    const grid = [
      ...PATTERNS_BY_CATEGORY.quarter,
      ...PATTERNS_BY_CATEGORY.eighths,
      ...PATTERNS_BY_CATEGORY.sixteenths,
    ];
    const covered = new Set(grid.map((pattern) => onsets(pattern.notes, 4)));
    expect(covered.size).toBe(16);
  });

  it('draw each sixteenth pattern differently', () => {
    const drawn = PATTERNS_BY_CATEGORY.sixteenths.map((pattern) => onsets(pattern.notes, 4));
    expect(new Set(drawn).size).toBe(drawn.length);
  });

  it('cover every way to play on the three triplet slots of a beat', () => {
    const grid = [...PATTERNS_BY_CATEGORY.quarter, ...PATTERNS_BY_CATEGORY.triplets];
    const covered = new Set(grid.map((pattern) => onsets(pattern.notes, 3)));
    expect(covered.size).toBe(8);
  });
});
