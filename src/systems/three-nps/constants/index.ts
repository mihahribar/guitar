import { CHROMATIC_TO_NOTE_NAME } from '@/shared/utils/musicTheory';
import type { ModeInfo, StringPair } from '../types';

/** Semitone offsets of the major scale degrees */
export const MAJOR_SCALE_STEPS = [0, 2, 4, 5, 7, 9, 11] as const;

export const NOTES_PER_STRING = 3;

/** Modes in degree order; each mode keeps the same colour in every view */
export const MODES: readonly ModeInfo[] = [
  { name: 'Ionian', short: 'Ion', color: '#FF6B6B' },
  { name: 'Dorian', short: 'Dor', color: '#FF9F43' },
  { name: 'Phrygian', short: 'Phr', color: '#E1B12C' },
  { name: 'Lydian', short: 'Lyd', color: '#1DD1A1' },
  { name: 'Mixolydian', short: 'Mix', color: '#45B7D1' },
  { name: 'Aeolian', short: 'Aeo', color: '#54A0FF' },
  { name: 'Locrian', short: 'Loc', color: '#A55EEA' },
] as const;

/** Adjacent string pairs from the lowest pair upward (string index 0 = high E) */
export const STRING_PAIRS: readonly StringPair[] = [
  { low: 5, high: 4, label: '6–5' },
  { low: 4, high: 3, label: '5–4' },
  { low: 3, high: 2, label: '4–3' },
  { low: 2, high: 1, label: '3–2' },
  { low: 1, high: 0, label: '2–1' },
] as const;

/** The G–B pair is tuned a major third apart, shifting the upper string one fret */
export const G_B_LOW_STRING = 2;

export const ROOT_OPTIONS = CHROMATIC_TO_NOTE_NAME.map((name, value) => ({ value, label: name }));
