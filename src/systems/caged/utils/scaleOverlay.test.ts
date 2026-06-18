import { describe, it, expect } from 'vitest';
import { absoluteOpenPitches, dedupeUnisonsByLowestFret, positionKey } from './scaleOverlay';
import { STANDARD_TUNING } from '@/shared/utils/musicTheory';

// String indices: 0 = high E, 1 = B, 2 = G, 3 = D, 4 = A, 5 = low E
describe('absoluteOpenPitches', () => {
  it('produces octave-aware ascending pitches (low string lowest)', () => {
    const abs = absoluteOpenPitches(STANDARD_TUNING);
    expect(abs).toHaveLength(6);
    // High E (index 0) is the highest open string, low E (index 5) the lowest.
    expect(abs[0]).toBeGreaterThan(abs[5]);
    // Each thinner string is strictly higher than the next thicker one.
    for (let i = 0; i < abs.length - 1; i++) {
      expect(abs[i]).toBeGreaterThan(abs[i + 1]);
    }
  });

  it('spaces the two E strings exactly two octaves apart', () => {
    const abs = absoluteOpenPitches(STANDARD_TUNING);
    expect(abs[0] - abs[5]).toBe(24);
  });

  it('encodes real string intervals (perfect fourths with a G→B major third)', () => {
    const abs = absoluteOpenPitches(STANDARD_TUNING);
    // From low E up: E-A, A-D, D-G are perfect fourths (5), G-B is a third (4),
    // B-E is a perfect fourth (5).
    expect(abs[4] - abs[5]).toBe(5); // low E -> A
    expect(abs[3] - abs[4]).toBe(5); // A -> D
    expect(abs[2] - abs[3]).toBe(5); // D -> G
    expect(abs[1] - abs[2]).toBe(4); // G -> B
    expect(abs[0] - abs[1]).toBe(5); // B -> high E
  });
});

describe('dedupeUnisonsByLowestFret', () => {
  it('drops the higher-fret member of a unison pair (G fret 13 == B fret 9)', () => {
    const gString13 = { stringIndex: 2, fretNumber: 13 };
    const bString9 = { stringIndex: 1, fretNumber: 9 };
    const result = dedupeUnisonsByLowestFret([gString13, bString9]);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(bString9);
  });

  it('keeps distinct pitches (octaves are not unisons)', () => {
    // Both E strings, same fret -> two octaves apart, both retained.
    const highE5 = { stringIndex: 0, fretNumber: 5 };
    const lowE5 = { stringIndex: 5, fretNumber: 5 };
    const result = dedupeUnisonsByLowestFret([highE5, lowE5]);
    expect(result).toHaveLength(2);
  });

  it('handles the high-E / B boundary correctly (no false unison)', () => {
    // high E fret 0 (E) and B fret 0 (B) are different pitches -> both kept.
    const highE0 = { stringIndex: 0, fretNumber: 0 };
    const bString0 = { stringIndex: 1, fretNumber: 0 };
    const result = dedupeUnisonsByLowestFret([highE0, bString0]);
    expect(result).toHaveLength(2);
    // high E fret 0 (E) == B fret 5 (E) -> real unison, keep the lower fret (0).
    const bString5 = { stringIndex: 1, fretNumber: 5 };
    const unison = dedupeUnisonsByLowestFret([highE0, bString5]);
    expect(unison).toHaveLength(1);
    expect(unison[0]).toEqual(highE0);
  });

  it('returns positions unchanged when there are no unisons', () => {
    const positions = [
      { stringIndex: 4, fretNumber: 7 },
      { stringIndex: 3, fretNumber: 9 },
    ];
    const result = dedupeUnisonsByLowestFret(positions);
    expect(result).toHaveLength(2);
  });
});

describe('positionKey', () => {
  it('builds a stable string-fret key', () => {
    expect(positionKey(2, 13)).toBe('2-13');
  });
});
