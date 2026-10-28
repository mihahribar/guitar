import { describe, expect, it } from 'vitest';
import { ALL_PATTERNS, DEFAULT_PATTERN } from '../constants';
import type { RhythmPattern } from '../types';
import { DEFAULT_RHYTHM_SETTINGS, decodeRhythm, encodeRhythm } from './urlState';

const decode = (query: string) => decodeRhythm(new URLSearchParams(query));
const pattern = (id: string) => ALL_PATTERNS.find((p) => p.id === id) as RhythmPattern;

describe('rhythm URL settings', () => {
  it('leaves the defaults out of the link', () => {
    expect(encodeRhythm(DEFAULT_RHYTHM_SETTINGS).toString()).toBe('');
    expect(decode('')).toEqual(DEFAULT_RHYTHM_SETTINGS);
  });

  it('round-trips changed settings', () => {
    const settings = {
      bpm: 80,
      panels: [
        pattern('two-eighths'),
        pattern('triplet'),
        pattern('quarter-rest'),
        pattern('four-sixteenths'),
      ] as [RhythmPattern, RhythmPattern, RhythmPattern, RhythmPattern],
      randomChangeMode: true,
      playAudio: true,
      playMetronome: false,
      randomPool: ['triplet', 'quarter'],
    };
    const params = encodeRhythm(settings);
    // The pool is written in pattern order, whatever order it was picked in
    expect(params.get('pool')).toBe('quarter,triplet');
    expect(decodeRhythm(params)).toEqual({ ...settings, randomPool: ['quarter', 'triplet'] });
  });

  it('writes an empty pool as none', () => {
    const params = encodeRhythm({ ...DEFAULT_RHYTHM_SETTINGS, randomPool: [] });
    expect(params.get('pool')).toBe('none');
    expect(decodeRhythm(params).randomPool).toEqual([]);
  });

  it('clamps the tempo', () => {
    expect(decode('bpm=10').bpm).toBe(40);
    expect(decode('bpm=500').bpm).toBe(240);
  });

  it('resets only the panels it cannot read', () => {
    const { panels } = decode('panels=triplet,nope,,two-eighths,extra');
    expect(panels.map((p) => p.id)).toEqual([
      'triplet',
      DEFAULT_PATTERN.id,
      DEFAULT_PATTERN.id,
      'two-eighths',
    ]);
  });

  it('falls back to the defaults for junk', () => {
    expect(decode('bpm=fast&panels=x&pool=y&random=2&audio=on')).toEqual(DEFAULT_RHYTHM_SETTINGS);
  });
});
