import { CHROMATIC_TO_NOTE_NAME } from '@/shared/utils/musicTheory';
import type {
  InversionInfo,
  SeventhQuality,
  SeventhQualityInfo,
  SeventhStringSet,
  StringSetId,
} from '../types';

export const SEVENTH_QUALITIES: Record<SeventhQuality, SeventhQualityInfo> = {
  maj7: {
    name: 'Major 7',
    short: 'maj7',
    intervals: [0, 4, 7, 11],
    toneLabels: ['R', '3', '5', '7'],
  },
  dom7: {
    name: 'Dominant 7',
    short: '7',
    intervals: [0, 4, 7, 10],
    toneLabels: ['R', '3', '5', '♭7'],
  },
  min7: {
    name: 'Minor 7',
    short: 'm7',
    intervals: [0, 3, 7, 10],
    toneLabels: ['R', '♭3', '5', '♭7'],
  },
  min7b5: {
    name: 'Minor 7 flat 5',
    short: 'm7♭5',
    intervals: [0, 3, 6, 10],
    toneLabels: ['R', '♭3', '♭5', '♭7'],
  },
  dim7: {
    name: 'Diminished 7',
    short: '°7',
    intervals: [0, 3, 6, 9],
    toneLabels: ['R', '♭3', '♭5', '♭♭7'],
  },
};

/** Each quality lowers one chord tone of the previous one by a semitone */
export const QUALITY_ORDER: readonly SeventhQuality[] = ['maj7', 'dom7', 'min7', 'min7b5', 'dim7'];

/**
 * Inversions in order; each keeps the same colour in every view. The first
 * three match the Triads tab.
 */
export const INVERSIONS: readonly InversionInfo[] = [
  { name: 'Root position', short: 'Root', color: '#54A0FF' },
  { name: '1st inversion', short: '1st', color: '#1DD1A1' },
  { name: '2nd inversion', short: '2nd', color: '#E1B12C' },
  { name: '3rd inversion', short: '3rd', color: '#FF6B6B' },
] as const;

/**
 * Four-string sets (string index 0 = high E). The tone order is root position,
 * low string first: 0 = root, 1 = third, 2 = fifth, 3 = seventh.
 */
export const STRING_SETS: Record<StringSetId, SeventhStringSet> = {
  // R 7 3 5 with the A string muted: drop 3, root on the 6th string
  'e-dgb': {
    id: 'e-dgb',
    label: 'E·DGB',
    voicing: 'Drop 3',
    strings: [5, 3, 2, 1],
    toneOrder: [0, 3, 1, 2],
  },
  // R 5 7 3: drop 2, root on the 5th string
  adgb: {
    id: 'adgb',
    label: 'ADGB',
    voicing: 'Drop 2',
    strings: [4, 3, 2, 1],
    toneOrder: [0, 2, 3, 1],
  },
  // R 5 7 3: drop 2, root on the 4th string
  dgbe: {
    id: 'dgbe',
    label: 'DGBE',
    voicing: 'Drop 2',
    strings: [3, 2, 1, 0],
    toneOrder: [0, 2, 3, 1],
  },
};

/** String sets from the lowest upward; ↑ moves one step along this list */
export const STRING_SET_ORDER: readonly StringSetId[] = ['e-dgb', 'adgb', 'dgbe'];

export const ROOT_OPTIONS = CHROMATIC_TO_NOTE_NAME.map((name, value) => ({ value, label: name }));

export * from './help';
