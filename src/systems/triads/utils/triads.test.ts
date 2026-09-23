import { describe, it, expect } from 'vitest';
import { getNoteAtFret } from '@/shared/utils/musicTheory';
import type { StringIndex } from '@/shared/types/core';
import { QUALITY_ORDER, STRING_SETS, TRIAD_QUALITIES } from '../constants';
import type { Inversion, Triad, TriadQuality } from '../types';
import {
  ALL_INVERSIONS,
  buildPositionMap,
  buildSequence,
  createInversionStyle,
  toneLabel,
  visibleTriads,
} from './triads';
import { createInitialTriadsState, triadsReducer } from '../hooks/useTriadsState';

const C = 0;
const GBE = 2 as StringIndex;
const EAD = 5 as StringIndex;

/** Frets low string first */
const frets = (triad: Triad) => triad.notes.map((n) => n.fret);

function shapesOf(quality: TriadQuality, lowString: StringIndex, inversion: Inversion) {
  return buildSequence(C, quality, lowString)
    .filter((t) => t.inversion === inversion)
    .map(frets);
}

describe('triad shapes (C major)', () => {
  it('builds the known G-B-E shapes', () => {
    expect(shapesOf('major', GBE, 0)).toEqual([
      [5, 5, 3],
      [17, 17, 15],
    ]);
    expect(shapesOf('major', GBE, 1)).toEqual([
      [9, 8, 8],
      [21, 20, 20],
    ]);
    expect(shapesOf('major', GBE, 2)).toEqual([
      [0, 1, 0],
      [12, 13, 12],
    ]);
  });

  it('builds the known E-A-D root position', () => {
    expect(shapesOf('major', EAD, 0)).toEqual([
      [8, 7, 5],
      [20, 19, 17],
    ]);
  });

  it('flattens only the third for minor', () => {
    expect(shapesOf('minor', GBE, 0)[0]).toEqual([5, 4, 3]);
  });
});

describe('every triad', () => {
  for (const quality of QUALITY_ORDER) {
    it(`is a valid close voicing for every root and string set (${quality})`, () => {
      const { intervals } = TRIAD_QUALITIES[quality];
      for (let root = 0; root < 12; root++) {
        for (const { low } of STRING_SETS) {
          const sequence = buildSequence(root, quality, low);
          const chordTones = intervals.map((i) => (root + i) % 12);

          expect(sequence.length).toBeGreaterThanOrEqual(ALL_INVERSIONS.length);
          for (const inversion of ALL_INVERSIONS) {
            expect(sequence.some((t) => t.inversion === inversion)).toBe(true);
          }
          sequence.forEach((triad, i) => {
            if (i > 0) expect(triad.position).toBeGreaterThanOrEqual(sequence[i - 1].position);
            expect(triad.notes.map((n) => n.stringIndex)).toEqual([low, low - 1, low - 2]);
            expect(triad.notes[0].tone).toBe(triad.inversion);
            expect(new Set(triad.notes.map((n) => n.pitchClass))).toEqual(new Set(chordTones));
            for (const n of triad.notes) {
              expect(n.fret).toBeGreaterThanOrEqual(0);
              expect(n.fret).toBeLessThanOrEqual(21);
              expect(getNoteAtFret(n.stringIndex, n.fret)).toBe(n.pitchClass);
            }
          });
        }
      }
    });
  }

  it('stacks notes upward within an octave', () => {
    // Absolute pitch of string s at fret f, low E open = 0
    const OPEN = [24, 19, 15, 10, 5, 0];
    for (const quality of QUALITY_ORDER) {
      for (let root = 0; root < 12; root++) {
        for (const { low } of STRING_SETS) {
          for (const triad of buildSequence(root, quality, low)) {
            const pitches = triad.notes.map((n) => OPEN[n.stringIndex] + n.fret);
            expect(pitches[1]).toBeGreaterThan(pitches[0]);
            expect(pitches[2]).toBeGreaterThan(pitches[1]);
            expect(pitches[2] - pitches[0]).toBeLessThan(12);
          }
        }
      }
    }
  });

  it('gives augmented inversions one shape, a major third apart', () => {
    const relative = (t: Triad) => frets(t).map((f) => f - t.position);
    for (const { low } of STRING_SETS) {
      const sequence = buildSequence(C, 'augmented', low);
      const shape = relative(sequence[0]);
      for (const triad of sequence) expect(relative(triad)).toEqual(shape);
    }
  });
});

describe('labels and colours', () => {
  it('labels chord tones by quality', () => {
    expect(toneLabel(C, 'major', 4)).toBe('3');
    expect(toneLabel(C, 'minor', 3)).toBe('♭3');
    expect(toneLabel(C, 'diminished', 6)).toBe('♭5');
    expect(toneLabel(C, 'augmented', 8)).toBe('♯5');
    expect(toneLabel(C, 'major', 2)).toBeUndefined();
  });

  it('splits colours where inversions on neighbouring sets share a note', () => {
    // D-G-B 2nd inversion (5,5,5) and G-B-E root position (5,5,3) share G and B at fret 5
    const triads = [3, 2].flatMap((low) =>
      visibleTriads(buildSequence(C, 'major', low as StringIndex), ALL_INVERSIONS, 0, true)
    );
    const map = buildPositionMap(triads);
    expect(map.get('2-5')).toEqual([0, 2]);
    expect(createInversionStyle(map.get('2-5') ?? [])).toHaveProperty('background');
    expect(createInversionStyle([0])).toHaveProperty('backgroundColor');
  });
});

describe('triadsReducer', () => {
  const initial = createInitialTriadsState();

  it('starts on C major root position, lowest on G-B-E', () => {
    expect(initial).toMatchObject({ stringSets: [2], inversions: [0], anchorFret: 3 });
  });

  it('walks root position to 1st inversion and back', () => {
    const next = triadsReducer(initial, { type: 'NEXT' });
    expect(next).toMatchObject({ inversions: [1], anchorFret: 8 });
    expect(triadsReducer(next, { type: 'PREVIOUS' })).toMatchObject(initial);
  });

  it('keeps a stacked selection spaced as it walks', () => {
    const stacked = triadsReducer(initial, { type: 'TOGGLE_INVERSION', payload: 1 });
    expect(triadsReducer(stacked, { type: 'NEXT' }).inversions).toEqual([1, 2]);
  });

  it('never deselects the last inversion or string set', () => {
    expect(triadsReducer(initial, { type: 'TOGGLE_INVERSION', payload: 0 })).toBe(initial);
    expect(triadsReducer(initial, { type: 'TOGGLE_STRING_SET', payload: 2 })).toBe(initial);
  });

  it('solos an inversion and a string set', () => {
    const all = triadsReducer(initial, { type: 'TOGGLE_ALL_INVERSIONS' });
    expect(all.inversions).toEqual([0, 1, 2]);
    expect(triadsReducer(all, { type: 'SOLO_INVERSION', payload: 2 }).inversions).toEqual([2]);
    const two = triadsReducer(initial, { type: 'TOGGLE_STRING_SET', payload: 3 });
    expect(two.stringSets).toEqual([3, 2]);
    expect(triadsReducer(two, { type: 'SOLO_STRING_SET', payload: 3 }).stringSets).toEqual([3]);
  });

  it('shifts the string sets across and stops at the edge', () => {
    const low = triadsReducer(triadsReducer(initial, { type: 'SOLO_STRING_SET', payload: 5 }), {
      type: 'TOGGLE_STRING_SET',
      payload: 4,
    });
    expect(low.stringSets).toEqual([5, 4]);
    expect(triadsReducer(low, { type: 'SETS_UP' }).stringSets).toEqual([4, 3]);
    expect(triadsReducer(low, { type: 'SETS_DOWN' })).toBe(low);
    expect(triadsReducer(initial, { type: 'SETS_UP' })).toBe(initial);
  });

  it('keeps the anchor when the quality changes', () => {
    const minor = triadsReducer(initial, { type: 'SET_QUALITY', payload: 'minor' });
    expect(minor).toMatchObject({ quality: 'minor', anchorFret: initial.anchorFret });
  });

  it('re-anchors to the lowest spot when the root changes', () => {
    const walked = triadsReducer(triadsReducer(initial, { type: 'NEXT' }), { type: 'NEXT' });
    expect(walked.inversions).toEqual([2]);
    // D 2nd inversion lowest on G-B-E: A at 2, D at 3, F# at 2
    expect(triadsReducer(walked, { type: 'SET_ROOT', payload: 2 })).toMatchObject({
      root: 2,
      inversions: [2],
      anchorFret: 2,
    });
  });
});
