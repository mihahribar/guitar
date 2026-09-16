import { describe, it, expect } from 'vitest';
import { getNoteAtFret } from '@/shared/utils/musicTheory';
import type { StringIndex } from '@/shared/types/core';
import { MAJOR_SCALE_STEPS } from '../constants';
import type { ModeDegree, NpsPattern } from '../types';
import {
  buildPattern,
  buildPositionMap,
  buildSequence,
  createModeStyle,
  findNearest,
  visiblePatterns,
} from './threeNps';
import { createInitialThreeNpsState, threeNpsReducer } from '../hooks/useThreeNpsState';

const C = 0;
const C_MAJOR = MAJOR_SCALE_STEPS.map((s) => (C + s) % 12);

/** Frets per string relative to the pattern's lowest fret, low string first */
function relativeShape(pattern: NpsPattern): number[][] {
  const min = Math.min(...pattern.notes.map((n) => n.fret));
  const byString = new Map<number, number[]>();
  for (const n of pattern.notes) {
    byString.set(n.stringIndex, [...(byString.get(n.stringIndex) ?? []), n.fret - min]);
  }
  return [...byString.entries()].sort((a, b) => b[0] - a[0]).map(([, frets]) => frets);
}

function dominoOnPair(degree: ModeDegree, lowString: StringIndex): NpsPattern {
  const pattern = findNearest(buildSequence(C, { kind: 'pair', lowString }), degree, 0);
  if (!pattern) throw new Error('no pattern');
  return pattern;
}

describe('3NPS dominoes (handout shapes)', () => {
  // [low string, high string] fret offsets, as drawn on the handout
  const expected: Record<ModeDegree, number[][]> = {
    0: [
      [0, 2, 4],
      [0, 2, 4],
    ], // Ionian
    1: [
      [0, 2, 3],
      [0, 2, 4],
    ], // Dorian
    2: [
      [0, 1, 3],
      [0, 2, 3],
    ], // Phrygian
    3: [
      [0, 2, 4],
      [1, 2, 4],
    ], // Lydian
    4: [
      [0, 2, 4],
      [0, 2, 4],
    ], // Mixolydian
    5: [
      [0, 2, 3],
      [0, 2, 3],
    ], // Aeolian
    6: [
      [0, 1, 3],
      [0, 1, 3],
    ], // Locrian
  };

  it.each(Object.entries(expected))('mode %s matches the handout on strings 6–5', (d, shape) => {
    expect(relativeShape(dominoOnPair(Number(d) as ModeDegree, 5))).toEqual(shape);
  });

  it('shifts the upper string up one fret on the G–B pair', () => {
    const shape = relativeShape(dominoOnPair(0, 2));
    expect(shape).toEqual([
      [0, 2, 4],
      [1, 3, 5],
    ]);
  });

  it('places C Ionian on strings 6–5 at fret 8', () => {
    const ionian = dominoOnPair(0, 5);
    expect(ionian.startFret).toBe(8);
    expect(ionian.notes.map((n) => [n.stringIndex, n.fret])).toEqual([
      [5, 8],
      [5, 10],
      [5, 12],
      [4, 8],
      [4, 10],
      [4, 12],
    ]);
  });
});

describe('buildPattern', () => {
  it('builds a full 6-string position with 3 in-scale notes per string', () => {
    const pattern = buildPattern(C, 0, 5, 6, 8);
    expect(pattern.notes).toHaveLength(18);
    for (let s = 0; s <= 5; s++) {
      expect(pattern.notes.filter((n) => n.stringIndex === s)).toHaveLength(3);
    }
    for (const n of pattern.notes) {
      expect(C_MAJOR).toContain(getNoteAtFret(n.stringIndex, n.fret));
      expect(getNoteAtFret(n.stringIndex, n.fret)).toBe(n.pitchClass);
    }
  });
});

describe('buildSequence', () => {
  it.each([
    { kind: 'pair', lowString: 5 },
    { kind: 'pair', lowString: 2 },
    { kind: 'all' },
  ] as const)('is sorted, in range and cycles modes in order (%o)', (scope) => {
    for (let root = 0; root < 12; root++) {
      const sequence = buildSequence(root, scope);
      expect(sequence.length).toBeGreaterThanOrEqual(7);
      for (let i = 1; i < sequence.length; i++) {
        expect(sequence[i].startFret).toBeGreaterThan(sequence[i - 1].startFret);
        expect(sequence[i].degree).toBe((sequence[i - 1].degree + 1) % 7);
      }
      for (const pattern of sequence) {
        for (const n of pattern.notes) {
          expect(n.fret).toBeGreaterThanOrEqual(0);
          expect(n.fret).toBeLessThanOrEqual(21);
        }
      }
    }
  });
});

describe('buildPositionMap / createModeStyle', () => {
  it('collects every mode covering a position', () => {
    const map = buildPositionMap(buildSequence(C, { kind: 'pair', lowString: 5 }));
    // E on low E string fret 12 belongs to Ionian (3rd), Dorian (2nd), Phrygian (1st)
    expect(map.get('5-12')).toEqual([0, 1, 2]);
    expect(createModeStyle([0])).toHaveProperty('backgroundColor');
    expect(createModeStyle([0, 1, 2])).toHaveProperty('background');
  });
});

describe('visiblePatterns', () => {
  const sequence = buildSequence(C, { kind: 'pair', lowString: 5 });
  const starts = (patterns: NpsPattern[]) => patterns.map((p) => [p.degree, p.startFret]);

  it('shows the nearest pattern of every selected mode', () => {
    // C Ionian sits at fret 8, D Dorian right above it at fret 10
    expect(starts(visiblePatterns(sequence, [0, 1], 8, false))).toEqual([
      [0, 8],
      [1, 10],
    ]);
  });

  it('shows every occurrence of the selected modes on the whole neck', () => {
    expect(starts(visiblePatterns(sequence, [2], 0, true))).toEqual([
      [2, 0],
      [2, 12],
    ]);
  });

  it('draws each selected mode in its own colour, splitting shared notes', () => {
    const map = buildPositionMap(visiblePatterns(sequence, [0, 1], 8, false));
    // Ionian-only note on the low E at fret 8
    expect(map.get('5-8')).toEqual([0]);
    // Fret 10 belongs to both dominoes
    expect(map.get('5-10')).toEqual([0, 1]);
    expect(createModeStyle(map.get('5-10') ?? [])).toHaveProperty('background');
  });
});

describe('threeNpsReducer', () => {
  it('starts on Ionian alone at its lowest position', () => {
    const state = createInitialThreeNpsState(C);
    expect(state.degrees).toEqual([0]);
    expect(state.anchorFret).toBe(8);
  });

  it('steps up the neck and wraps around', () => {
    let state = createInitialThreeNpsState(C);
    state = threeNpsReducer(state, { type: 'NEXT' });
    expect([state.degrees, state.anchorFret]).toEqual([[1], 10]);

    const sequence = buildSequence(C, { kind: 'pair', lowString: 5 });
    for (let i = 0; i < sequence.length; i++) state = threeNpsReducer(state, { type: 'NEXT' });
    expect([state.degrees, state.anchorFret]).toEqual([[1], 10]);

    state = threeNpsReducer(createInitialThreeNpsState(C), { type: 'PREVIOUS' });
    expect([state.degrees, state.anchorFret]).toEqual([[6], 7]);
  });

  it('adds and removes modes, never emptying the selection', () => {
    let state = threeNpsReducer(createInitialThreeNpsState(C), {
      type: 'TOGGLE_MODE',
      payload: 3,
    });
    expect(state.degrees).toEqual([0, 3]);

    state = threeNpsReducer(state, { type: 'TOGGLE_MODE', payload: 0 });
    expect(state.degrees).toEqual([3]);

    // The last remaining mode stays put
    expect(threeNpsReducer(state, { type: 'TOGGLE_MODE', payload: 3 })).toBe(state);
  });

  it('walks a multi-mode selection up the neck as a group', () => {
    let state = threeNpsReducer(createInitialThreeNpsState(C), {
      type: 'TOGGLE_MODE',
      payload: 1,
    });
    expect([state.degrees, state.anchorFret]).toEqual([[0, 1], 8]);

    state = threeNpsReducer(state, { type: 'NEXT' });
    expect([state.degrees, state.anchorFret]).toEqual([[1, 2], 10]);

    state = threeNpsReducer(state, { type: 'PREVIOUS' });
    expect([state.degrees, state.anchorFret]).toEqual([[0, 1], 8]);
  });

  it('selects every mode and collapses back to the one at the anchor', () => {
    const single = createInitialThreeNpsState(C);
    const all = threeNpsReducer(single, { type: 'TOGGLE_ALL_MODES' });
    expect(all.degrees).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(threeNpsReducer(all, { type: 'TOGGLE_ALL_MODES' }).degrees).toEqual([0]);
  });

  it('shows one mode on its own', () => {
    const all = threeNpsReducer(createInitialThreeNpsState(C), { type: 'TOGGLE_ALL_MODES' });
    const solo = threeNpsReducer(all, { type: 'SOLO_MODE', payload: 4 });
    expect(solo.degrees).toEqual([4]);
    // G Mixolydian on the low E: fret 3 or 15 — fret 3 is closer to the anchor at 8
    expect(solo.anchorFret).toBe(3);
  });

  it('keeps the selection near the same fret when changing string pair', () => {
    const state = threeNpsReducer(createInitialThreeNpsState(C), { type: 'PAIR_UP' });
    expect(state.lowString).toBe(4);
    expect(state.degrees).toEqual([0]);
    // C on the A string: fret 3 or 15 — fret 3 is closer to 8
    expect(state.anchorFret).toBe(3);
  });

  it('clamps string pair changes at the edges', () => {
    const lowest = createInitialThreeNpsState(C);
    expect(threeNpsReducer(lowest, { type: 'PAIR_DOWN' })).toBe(lowest);
  });

  it('keeps the selected modes when the root changes', () => {
    let state = threeNpsReducer(createInitialThreeNpsState(C), { type: 'NEXT' });
    state = threeNpsReducer(state, { type: 'SET_ROOT', payload: 7 });
    expect(state.degrees).toEqual([1]);
    // A Dorian, the second degree of G major, on the low E string
    expect(state.anchorFret).toBe(5);
  });
});
