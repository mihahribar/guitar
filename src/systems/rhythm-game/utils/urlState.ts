/**
 * Rhythm game settings in the URL query string
 *
 * `bpm=80&panels=quarter,two-eighths,triplet,quarter&pool=quarter,triplet&random=1`;
 * settings that match the defaults are left out. Pattern ids are part of the
 * link format, so renaming one breaks links already shared.
 */

import { METRONOME_CONSTANTS } from '@/shared/constants/magicNumbers';
import { parseFlag, parseInteger, parseList, withoutDefaults } from '@/shared/utils/urlParams';
import { ALL_PATTERNS, DEFAULT_PANELS } from '../constants';
import type { RhythmPattern } from '../types';

type Panels = [RhythmPattern, RhythmPattern, RhythmPattern, RhythmPattern];

/** What a link to the rhythm page holds; playback itself always starts stopped */
interface RhythmSettings {
  bpm: number;
  panels: Panels;
  randomChangeMode: boolean;
  playAudio: boolean;
  playMetronome: boolean;
  /** Ids of the patterns Randomize and Random Change pick from */
  randomPool: string[];
}

export const DEFAULT_RHYTHM_SETTINGS: RhythmSettings = {
  bpm: METRONOME_CONSTANTS.DEFAULT_BPM,
  panels: DEFAULT_PANELS,
  randomChangeMode: false,
  playAudio: false,
  playMetronome: true,
  randomPool: ALL_PATTERNS.map((pattern) => pattern.id),
};

const findPattern = (id: string) => ALL_PATTERNS.find((pattern) => pattern.id === id);

/** The pool as a link writes it: `all`, `none`, or its ids in pattern order */
function encodePool(pool: readonly string[]): string {
  const ids = ALL_PATTERNS.map((pattern) => pattern.id).filter((id) => pool.includes(id));
  if (ids.length === ALL_PATTERNS.length) return 'all';
  return ids.length === 0 ? 'none' : ids.join(',');
}

function encodeAll(settings: RhythmSettings): URLSearchParams {
  return new URLSearchParams({
    bpm: String(settings.bpm),
    panels: settings.panels.map((pattern) => pattern.id).join(','),
    pool: encodePool(settings.randomPool),
    random: settings.randomChangeMode ? '1' : '0',
    audio: settings.playAudio ? '1' : '0',
    metronome: settings.playMetronome ? '1' : '0',
  });
}

/** Settings for a link to this page, leaving out the defaults */
export function encodeRhythm(settings: RhythmSettings): URLSearchParams {
  return withoutDefaults(encodeAll(settings), encodeAll(DEFAULT_RHYTHM_SETTINGS));
}

/** Settings from a link; anything missing or unrecognised keeps its default */
export function decodeRhythm(params: URLSearchParams): RhythmSettings {
  const defaults = DEFAULT_RHYTHM_SETTINGS;
  // Panels keep their place, so an unknown id only resets its own panel
  const panelIds = params.get('panels')?.split(',') ?? [];
  const panels = defaults.panels.map(
    (fallback, index) => findPattern(panelIds[index]?.trim() ?? '') ?? fallback
  ) as Panels;
  const pool = params.get('pool');
  const randomPool =
    pool === 'none'
      ? []
      : (parseList(pool, (item) => findPattern(item)?.id) ?? defaults.randomPool);
  return {
    bpm:
      parseInteger(params.get('bpm'), METRONOME_CONSTANTS.MIN_BPM, METRONOME_CONSTANTS.MAX_BPM) ??
      defaults.bpm,
    panels,
    randomChangeMode: parseFlag(params.get('random')) ?? defaults.randomChangeMode,
    playAudio: parseFlag(params.get('audio')) ?? defaults.playAudio,
    playMetronome: parseFlag(params.get('metronome')) ?? defaults.playMetronome,
    randomPool,
  };
}
