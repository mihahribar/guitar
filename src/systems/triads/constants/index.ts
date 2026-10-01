import type { InversionInfo, StringSet, TriadQuality, TriadQualityInfo } from '../types';

export const TRIAD_QUALITIES: Record<TriadQuality, TriadQualityInfo> = {
  major: { name: 'Major', short: 'Maj', intervals: [0, 4, 7], toneLabels: ['R', '3', '5'] },
  minor: { name: 'Minor', short: 'Min', intervals: [0, 3, 7], toneLabels: ['R', '♭3', '5'] },
  diminished: {
    name: 'Diminished',
    short: 'Dim',
    intervals: [0, 3, 6],
    toneLabels: ['R', '♭3', '♭5'],
  },
  augmented: {
    name: 'Augmented',
    short: 'Aug',
    intervals: [0, 4, 8],
    toneLabels: ['R', '3', '♯5'],
  },
};

export const QUALITY_ORDER: readonly TriadQuality[] = ['major', 'minor', 'diminished', 'augmented'];

/** Inversions in order; each keeps the same colour in every view */
export const INVERSIONS: readonly InversionInfo[] = [
  { name: 'Root position', short: 'Root', color: '#54A0FF' },
  { name: '1st inversion', short: '1st', color: '#1DD1A1' },
  { name: '2nd inversion', short: '2nd', color: '#E1B12C' },
] as const;

/** Three-string sets from the lowest upward (string index 0 = high E) */
export const STRING_SETS: readonly StringSet[] = [
  { low: 5, label: 'EAD' },
  { low: 4, label: 'ADG' },
  { low: 3, label: 'DGB' },
  { low: 2, label: 'GBE' },
] as const;

export const STRINGS_PER_TRIAD = 3;

export * from './help';
