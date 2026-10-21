import { describe, it, expect } from 'vitest';
import { ALL_PATTERNS, EIGHTH_PATTERNS } from '../constants';
import type { BeatIndex, PanelIndex } from '../types';
import {
  getRandomChangeBeat,
  getRandomPatternExcept,
  randomPoolReducer,
  stepRandomChange,
} from './rhythmUtils';

describe('random change', () => {
  it('swaps each panel two beats before it plays', () => {
    const panels: PanelIndex[] = [0, 1, 2, 3];
    expect(panels.map(getRandomChangeBeat)).toEqual([2, 3, 0, 1]);
  });

  it('changes exactly one panel from one bar played to the next', () => {
    // Back-to-back picks that land close together, or far apart, within the bar
    const picks: PanelIndex[] = [3, 0, 0, 2, 1, 3, 1, 2];
    let pickCount = 0;
    const versions = [0, 0, 0, 0];
    let pending: PanelIndex | null = null;
    const bars: number[][] = [];

    for (let n = 0; n < 4 * picks.length; n++) {
      const beat = (n % 4) as BeatIndex;
      // The cycler does not report the first beat after start
      if (n > 0) {
        const step = stepRandomChange(beat, pending, () => picks[pickCount++]);
        pending = step.pending;
        if (step.swap !== null) versions[step.swap]++;
      }
      if (beat === 0) bars.push([]);
      bars[bars.length - 1].push(versions[beat]);
    }

    for (let bar = 1; bar < bars.length; bar++) {
      const changed = bars[bar].filter((version, panel) => version !== bars[bar - 1][panel]);
      expect(changed).toHaveLength(1);
    }
  });

  it('never swaps a panel for the pattern it already shows', () => {
    for (const pattern of ALL_PATTERNS) {
      expect(getRandomPatternExcept(pattern)?.id).not.toBe(pattern.id);
    }
  });

  it('only swaps in patterns from the pool, and skips when there is nothing new', () => {
    const [quarter] = ALL_PATTERNS;
    for (let i = 0; i < 20; i++) {
      expect(EIGHTH_PATTERNS).toContain(getRandomPatternExcept(quarter, EIGHTH_PATTERNS));
    }
    expect(getRandomPatternExcept(quarter, [quarter])).toBeUndefined();
  });
});

describe('random pool', () => {
  const eighths = EIGHTH_PATTERNS.map((pattern) => pattern.id);

  it('toggles patterns, down to none', () => {
    const pool = randomPoolReducer(['quarter'], { type: 'TOGGLE_PATTERN', payload: 'triplet' });
    expect(pool).toEqual(['quarter', 'triplet']);
    expect(randomPoolReducer(pool, { type: 'TOGGLE_PATTERN', payload: 'quarter' })).toEqual([
      'triplet',
    ]);
    expect(randomPoolReducer(['triplet'], { type: 'TOGGLE_PATTERN', payload: 'triplet' })).toEqual(
      []
    );
  });

  it('selects all and none', () => {
    expect(randomPoolReducer(eighths, { type: 'SELECT_ALL' })).toEqual(
      ALL_PATTERNS.map((pattern) => pattern.id)
    );
    expect(randomPoolReducer(eighths, { type: 'SELECT_NONE' })).toEqual([]);
  });

  it('solos a pattern', () => {
    expect(randomPoolReducer(eighths, { type: 'SOLO_PATTERN', payload: 'quarter' })).toEqual([
      'quarter',
    ]);
  });

  it('fills a partly selected category, then clears it', () => {
    const filled = randomPoolReducer(['quarter', eighths[0]], {
      type: 'TOGGLE_CATEGORY',
      payload: 'eighths',
    });
    expect(filled).toEqual(['quarter', ...eighths]);
    expect(randomPoolReducer(filled, { type: 'TOGGLE_CATEGORY', payload: 'eighths' })).toEqual([
      'quarter',
    ]);
  });
});
