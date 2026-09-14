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

describe('threeNpsReducer', () => {
  it('starts on Ionian at its lowest position', () => {
    const state = createInitialThreeNpsState(C);
    expect(state.degree).toBe(0);
    expect(state.anchorFret).toBe(8);
  });

  it('steps up the neck and wraps around', () => {
    let state = createInitialThreeNpsState(C);
    state = threeNpsReducer(state, { type: 'NEXT' });
    expect([state.degree, state.anchorFret]).toEqual([1, 10]);

    const sequence = buildSequence(C, { kind: 'pair', lowString: 5 });
    for (let i = 0; i < sequence.length; i++) state = threeNpsReducer(state, { type: 'NEXT' });
    expect([state.degree, state.anchorFret]).toEqual([1, 10]);

    state = threeNpsReducer(createInitialThreeNpsState(C), { type: 'PREVIOUS' });
    expect([state.degree, state.anchorFret]).toEqual([6, 7]);
  });

  it('keeps the mode near the same fret when changing string pair', () => {
    const state = threeNpsReducer(createInitialThreeNpsState(C), { type: 'PAIR_UP' });
    expect(state.lowString).toBe(4);
    expect(state.degree).toBe(0);
    // C on the A string: fret 3 or 15 — fret 3 is closer to 8
    expect(state.anchorFret).toBe(3);
  });

  it('clamps string pair changes at the edges', () => {
    const lowest = createInitialThreeNpsState(C);
    expect(threeNpsReducer(lowest, { type: 'PAIR_DOWN' })).toBe(lowest);
  });

  it('resets to Ionian when the root changes', () => {
    let state = threeNpsReducer(createInitialThreeNpsState(C), { type: 'NEXT' });
    state = threeNpsReducer(state, { type: 'SET_ROOT', payload: 7 });
    expect(state.degree).toBe(0);
    expect(state.anchorFret).toBe(3); // G on low E
  });
});
