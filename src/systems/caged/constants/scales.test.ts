import { describe, it, expect } from 'vitest';
import { SCALE_DEFINITIONS } from './scales';
import type { ScaleType } from './scales';

describe('SCALE_DEFINITIONS', () => {
  it('should define all 9 scale types', () => {
    const expectedTypes: ScaleType[] = [
      'major',
      'naturalMinor',
      'harmonicMinor',
      'melodicMinor',
      'dorian',
      'phrygian',
      'lydian',
      'mixolydian',
      'locrian',
    ];
    expect(Object.keys(SCALE_DEFINITIONS)).toEqual(expect.arrayContaining(expectedTypes));
    expect(Object.keys(SCALE_DEFINITIONS)).toHaveLength(9);
  });

  it('should have 7 intervals per scale (heptatonic)', () => {
    for (const [key, def] of Object.entries(SCALE_DEFINITIONS)) {
      expect(def.intervals).toHaveLength(7);
      expect(def.intervals[0]).toBe(0); // All scales start on root
      // All intervals must be 0-11
      for (const interval of def.intervals) {
        expect(interval).toBeGreaterThanOrEqual(0);
        expect(interval).toBeLessThanOrEqual(11);
      }
      // Intervals must be strictly ascending
      for (let i = 1; i < def.intervals.length; i++) {
        expect(def.intervals[i]).toBeGreaterThan(def.intervals[i - 1]);
      }
      // Each scale must have a name and category
      expect(def.name).toBeTruthy();
      expect(['major', 'minor', 'mode']).toContain(def.category);
      // Suppress unused variable warning
      void key;
    }
  });

  it('should have musically correct Major scale intervals (W-W-H-W-W-W-H)', () => {
    expect([...SCALE_DEFINITIONS.major.intervals]).toEqual([0, 2, 4, 5, 7, 9, 11]);
  });

  it('should have musically correct Natural Minor intervals (W-H-W-W-H-W-W)', () => {
    expect([...SCALE_DEFINITIONS.naturalMinor.intervals]).toEqual([0, 2, 3, 5, 7, 8, 10]);
  });

  it('should have musically correct Harmonic Minor intervals (raised 7th)', () => {
    expect([...SCALE_DEFINITIONS.harmonicMinor.intervals]).toEqual([0, 2, 3, 5, 7, 8, 11]);
  });

  it('should have musically correct Melodic Minor intervals (raised 6th & 7th)', () => {
    expect([...SCALE_DEFINITIONS.melodicMinor.intervals]).toEqual([0, 2, 3, 5, 7, 9, 11]);
  });

  it('should have musically correct Dorian intervals (minor with raised 6th)', () => {
    expect([...SCALE_DEFINITIONS.dorian.intervals]).toEqual([0, 2, 3, 5, 7, 9, 10]);
  });

  it('should have musically correct Phrygian intervals (minor with flat 2nd)', () => {
    expect([...SCALE_DEFINITIONS.phrygian.intervals]).toEqual([0, 1, 3, 5, 7, 8, 10]);
  });

  it('should have musically correct Lydian intervals (major with raised 4th)', () => {
    expect([...SCALE_DEFINITIONS.lydian.intervals]).toEqual([0, 2, 4, 6, 7, 9, 11]);
  });

  it('should have musically correct Mixolydian intervals (major with flat 7th)', () => {
    expect([...SCALE_DEFINITIONS.mixolydian.intervals]).toEqual([0, 2, 4, 5, 7, 9, 10]);
  });

  it('should have musically correct Locrian intervals (minor with flat 2nd & 5th)', () => {
    expect([...SCALE_DEFINITIONS.locrian.intervals]).toEqual([0, 1, 3, 5, 6, 8, 10]);
  });

  it('should group scales into correct categories', () => {
    expect(SCALE_DEFINITIONS.major.category).toBe('major');

    expect(SCALE_DEFINITIONS.naturalMinor.category).toBe('minor');
    expect(SCALE_DEFINITIONS.harmonicMinor.category).toBe('minor');
    expect(SCALE_DEFINITIONS.melodicMinor.category).toBe('minor');

    expect(SCALE_DEFINITIONS.dorian.category).toBe('mode');
    expect(SCALE_DEFINITIONS.phrygian.category).toBe('mode');
    expect(SCALE_DEFINITIONS.lydian.category).toBe('mode');
    expect(SCALE_DEFINITIONS.mixolydian.category).toBe('mode');
    expect(SCALE_DEFINITIONS.locrian.category).toBe('mode');
  });
});
