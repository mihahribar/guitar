import { describe, it, expect } from 'vitest';
import { getNoteAtFret } from '@/shared/utils/musicTheory';
import { buildVoicingPositionMap, visibleVoicings } from '@/shared/utils/voicings';
import { QUALITY_ORDER, SEVENTH_QUALITIES, STRING_SETS, STRING_SET_ORDER } from '../constants';
import type { Inversion, SeventhChord, SeventhQuality, StringSetId } from '../types';
import {
  ALL_INVERSIONS,
  buildSequence,
  createInversionStyle,
  mutedStrings,
  toneLabel,
} from './sevenths';
import { createInitialSeventhsState, seventhsReducer } from '../hooks/useSeventhsState';

const C = 0;

/** Frets low string first */
const frets = (chord: SeventhChord) => chord.notes.map((n) => n.fret);
/** Frets relative to the bass note */
const relative = (chord: SeventhChord) => frets(chord).map((f) => f - chord.notes[0].fret);

function shapesOf(quality: SeventhQuality, set: StringSetId, inversion: Inversion) {
  return buildSequence(C, quality, set)
    .filter((chord) => chord.inversion === inversion)
    .map(frets);
}

describe('root position shapes (the reference chart)', () => {
  // Relative frets low string first, root at 0
  const CHART: Record<StringSetId, Record<SeventhQuality, number[]>> = {
    'e-dgb': {
      maj7: [0, 1, 1, 0],
      dom7: [0, 0, 1, 0],
      min7: [0, 0, 0, 0],
      min7b5: [0, 0, 0, -1],
      dim7: [0, -1, 0, -1],
    },
    adgb: {
      maj7: [0, 2, 1, 2],
      dom7: [0, 2, 0, 2],
      min7: [0, 2, 0, 1],
      min7b5: [0, 1, 0, 1],
      dim7: [0, 1, -1, 1],
    },
    dgbe: {
      maj7: [0, 2, 2, 2],
      dom7: [0, 2, 1, 2],
      min7: [0, 2, 1, 1],
      min7b5: [0, 1, 1, 1],
      dim7: [0, 1, 0, 1],
    },
  };

  for (const set of STRING_SET_ORDER) {
    for (const quality of QUALITY_ORDER) {
      it(`matches ${STRING_SETS[set].label} ${SEVENTH_QUALITIES[quality].short}`, () => {
        const root = buildSequence(C, quality, set).find((chord) => chord.inversion === 0);
        expect(root && relative(root)).toEqual(CHART[set][quality]);
      });
    }
  }
});

describe('C major 7 voicings', () => {
  it('builds the known A-D-G-B shapes', () => {
    expect(shapesOf('maj7', 'adgb', 0)).toEqual([
      [3, 5, 4, 5],
      [15, 17, 16, 17],
    ]);
    expect(shapesOf('maj7', 'adgb', 1)[0]).toEqual([7, 9, 5, 8]);
    expect(shapesOf('maj7', 'adgb', 2)[0]).toEqual([10, 10, 9, 12]);
    expect(shapesOf('maj7', 'adgb', 3)[0]).toEqual([2, 2, 0, 1]);
  });

  it('skips the A string on E-D-G-B', () => {
    const [root] = buildSequence(C, 'maj7', 'e-dgb').filter((chord) => chord.inversion === 0);
    expect(root.notes.map((n) => n.stringIndex)).toEqual([5, 3, 2, 1]);
    expect(shapesOf('maj7', 'e-dgb', 0)).toEqual([
      [8, 9, 9, 8],
      [20, 21, 21, 20],
    ]);
    expect(mutedStrings(STRING_SETS['e-dgb'])).toEqual([4]);
    expect(mutedStrings(STRING_SETS.adgb)).toEqual([]);
  });

  it('builds the known D-G-B-E root position', () => {
    expect(shapesOf('maj7', 'dgbe', 0)).toEqual([[10, 12, 12, 12]]);
  });
});

describe('every voicing', () => {
  // Absolute pitch of string s at fret f, low E open = 0
  const OPEN = [24, 19, 15, 10, 5, 0];

  for (const quality of QUALITY_ORDER) {
    it(`is a valid drop voicing for every root and string set (${quality})`, () => {
      const { intervals } = SEVENTH_QUALITIES[quality];
      for (let root = 0; root < 12; root++) {
        for (const set of STRING_SET_ORDER) {
          const sequence = buildSequence(root, quality, set);
          const chordTones = intervals.map((i) => (root + i) % 12);

          for (const inversion of ALL_INVERSIONS) {
            expect(sequence.some((chord) => chord.inversion === inversion)).toBe(true);
          }
          sequence.forEach((chord, i) => {
            if (i > 0) expect(chord.position).toBeGreaterThanOrEqual(sequence[i - 1].position);
            expect(chord.notes.map((n) => n.stringIndex)).toEqual(STRING_SETS[set].strings);
            expect(chord.notes[0].tone).toBe(chord.inversion);
            expect(new Set(chord.notes.map((n) => n.pitchClass))).toEqual(new Set(chordTones));
            for (const n of chord.notes) {
              expect(n.fret).toBeGreaterThanOrEqual(0);
              expect(n.fret).toBeLessThanOrEqual(21);
              expect(getNoteAtFret(n.stringIndex, n.fret)).toBe(n.pitchClass);
            }

            const pitches = chord.notes.map((n) => OPEN[n.stringIndex] + n.fret);
            for (let s = 1; s < pitches.length; s++) {
              expect(pitches[s] - pitches[s - 1]).toBeGreaterThan(0);
              expect(pitches[s] - pitches[s - 1]).toBeLessThan(12);
            }
            expect(Math.max(...frets(chord)) - chord.position).toBeLessThanOrEqual(4);
          });
        }
      }
    });
  }

  it('stacks inversions one chord tone up on each string', () => {
    // Drop 2 on A-D-G-B: R 5 7 3, then 3 7 R 5, 5 R 3 7, 7 3 5 R
    const tones = (set: StringSetId, inversion: Inversion) =>
      buildSequence(C, 'maj7', set)
        .find((chord) => chord.inversion === inversion)
        ?.notes.map((n) => n.tone);
    expect(ALL_INVERSIONS.map((inversion) => tones('adgb', inversion))).toEqual([
      [0, 2, 3, 1],
      [1, 3, 0, 2],
      [2, 0, 1, 3],
      [3, 1, 2, 0],
    ]);
    // Drop 3 on E-D-G-B: R 7 3 5, then 3 R 5 7, 5 3 7 R, 7 5 R 3
    expect(ALL_INVERSIONS.map((inversion) => tones('e-dgb', inversion))).toEqual([
      [0, 3, 1, 2],
      [1, 0, 2, 3],
      [2, 1, 3, 0],
      [3, 2, 0, 1],
    ]);
  });

  it('gives diminished 7th inversions one shape, a minor third apart', () => {
    for (const set of STRING_SET_ORDER) {
      const sequence = buildSequence(C, 'dim7', set);
      const shape = relative(sequence[0]);
      sequence.forEach((chord, i) => {
        expect(relative(chord)).toEqual(shape);
        if (i > 0) expect(chord.position - sequence[i - 1].position).toBe(3);
      });
    }
  });
});

describe('labels and colours', () => {
  it('labels chord tones by quality', () => {
    expect(toneLabel(C, 'maj7', 11)).toBe('7');
    expect(toneLabel(C, 'dom7', 10)).toBe('♭7');
    expect(toneLabel(C, 'min7', 3)).toBe('♭3');
    expect(toneLabel(C, 'min7b5', 6)).toBe('♭5');
    expect(toneLabel(C, 'dim7', 9)).toBe('♭♭7');
    expect(toneLabel(C, 'maj7', 2)).toBeUndefined();
  });

  it('splits colours where inversions on neighbouring sets share a note', () => {
    // A-D-G-B 2nd inversion (10,10,9,12) and D-G-B-E root position (10,12,12,12) share C on the D string
    const chords = (['adgb', 'dgbe'] as const).flatMap((set) =>
      visibleVoicings(buildSequence(C, 'maj7', set), ALL_INVERSIONS, 0, true)
    );
    const map = buildVoicingPositionMap(chords);
    expect(map.get('3-10')).toEqual([0, 2]);
    expect(createInversionStyle(map.get('3-10') ?? [])).toHaveProperty('background');
    expect(createInversionStyle([3])).toHaveProperty('backgroundColor');
  });
});

describe('seventhsReducer', () => {
  const initial = createInitialSeventhsState();

  it('starts on C major 7 root position, lowest on A-D-G-B', () => {
    expect(initial).toMatchObject({
      root: 0,
      quality: 'maj7',
      stringSets: ['adgb'],
      inversions: [0],
      anchorFret: 3,
    });
  });

  it('walks root position to the 1st inversion and back', () => {
    const next = seventhsReducer(initial, { type: 'NEXT' });
    expect(next).toMatchObject({ inversions: [1], anchorFret: 5 });
    expect(seventhsReducer(next, { type: 'PREVIOUS' })).toMatchObject(initial);
  });

  it('walks down to the 3rd inversion at the open G string', () => {
    expect(seventhsReducer(initial, { type: 'PREVIOUS' })).toMatchObject({
      inversions: [3],
      anchorFret: 0,
    });
  });

  it('keeps a stacked selection spaced as it walks', () => {
    const stacked = seventhsReducer(initial, { type: 'TOGGLE_INVERSION', payload: 1 });
    expect(seventhsReducer(stacked, { type: 'NEXT' }).inversions).toEqual([1, 2]);
    const wrapping = seventhsReducer(initial, { type: 'TOGGLE_INVERSION', payload: 3 });
    expect(seventhsReducer(wrapping, { type: 'NEXT' }).inversions).toEqual([0, 1]);
  });

  it('never deselects the last inversion or string set', () => {
    expect(seventhsReducer(initial, { type: 'TOGGLE_INVERSION', payload: 0 })).toBe(initial);
    expect(seventhsReducer(initial, { type: 'TOGGLE_STRING_SET', payload: 'adgb' })).toBe(initial);
  });

  it('selects every inversion, collapses back and solos one', () => {
    const all = seventhsReducer(initial, { type: 'TOGGLE_ALL_INVERSIONS' });
    expect(all.inversions).toEqual([0, 1, 2, 3]);
    expect(seventhsReducer(all, { type: 'TOGGLE_ALL_INVERSIONS' }).inversions).toEqual([0]);
    expect(seventhsReducer(all, { type: 'SOLO_INVERSION', payload: 3 }).inversions).toEqual([3]);
  });

  it('keeps string sets in order and re-anchors to the lowest one', () => {
    const two = seventhsReducer(initial, { type: 'TOGGLE_STRING_SET', payload: 'dgbe' });
    expect(two).toMatchObject({ stringSets: ['adgb', 'dgbe'], anchorFret: 3 });
    const three = seventhsReducer(two, { type: 'TOGGLE_STRING_SET', payload: 'e-dgb' });
    // E-D-G-B root position sits at fret 8 (C on the low E)
    expect(three).toMatchObject({ stringSets: ['e-dgb', 'adgb', 'dgbe'], anchorFret: 8 });
    expect(seventhsReducer(three, { type: 'SOLO_STRING_SET', payload: 'dgbe' })).toMatchObject({
      stringSets: ['dgbe'],
      anchorFret: 10,
    });
  });

  it('shifts the string sets across and stops at the edge', () => {
    const up = seventhsReducer(initial, { type: 'SETS_UP' });
    expect(up).toMatchObject({ stringSets: ['dgbe'], anchorFret: 10 });
    expect(seventhsReducer(up, { type: 'SETS_UP' })).toBe(up);

    const down = seventhsReducer(initial, { type: 'SETS_DOWN' });
    expect(down).toMatchObject({ stringSets: ['e-dgb'], anchorFret: 8 });
    expect(seventhsReducer(down, { type: 'SETS_DOWN' })).toBe(down);

    const pair = seventhsReducer(down, { type: 'TOGGLE_STRING_SET', payload: 'adgb' });
    expect(seventhsReducer(pair, { type: 'SETS_UP' }).stringSets).toEqual(['adgb', 'dgbe']);
    const all = seventhsReducer(pair, { type: 'TOGGLE_STRING_SET', payload: 'dgbe' });
    expect(seventhsReducer(all, { type: 'SETS_UP' })).toBe(all);
  });

  it('keeps the anchor when the quality changes', () => {
    const dim = seventhsReducer(initial, { type: 'SET_QUALITY', payload: 'dim7' });
    expect(dim).toMatchObject({ quality: 'dim7', anchorFret: initial.anchorFret });
  });

  it('re-anchors to the lowest spot when the root changes', () => {
    const walked = seventhsReducer(seventhsReducer(initial, { type: 'NEXT' }), { type: 'NEXT' });
    expect(walked).toMatchObject({ inversions: [2], anchorFret: 9 });
    // D major 7 2nd inversion lowest on A-D-G-B: A at 12, D at 12, F# at 11, C# at 14
    expect(seventhsReducer(walked, { type: 'SET_ROOT', payload: 2 })).toMatchObject({
      root: 2,
      inversions: [2],
      anchorFret: 11,
    });
  });
});
