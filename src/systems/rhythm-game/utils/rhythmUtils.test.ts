import { describe, it, expect } from 'vitest';
import { ALL_PATTERNS } from '../constants';
import type { BeatIndex, PanelIndex } from '../types';
import { getRandomChangeBeat, getRandomPatternExcept, stepRandomChange } from './rhythmUtils';

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
      expect(getRandomPatternExcept(pattern).id).not.toBe(pattern.id);
    }
  });
});
