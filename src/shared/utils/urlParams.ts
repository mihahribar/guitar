/**
 * Parsers for settings read from the URL query string
 *
 * A shared link is untrusted input: every parser returns `undefined` for
 * anything it doesn't recognise, so the caller falls back to its default.
 */

import { CHROMATIC_TO_NOTE_NAME } from './musicTheory';

const NATURAL_PITCH: Record<string, number> = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
const ACCIDENTAL_SHIFT: Record<string, number> = { '': 0, '#': 1, s: 1, '♯': 1, b: -1, '♭': -1 };

/** Root note as written in a link, e.g. `C#` */
export function encodeRoot(root: number): string {
  return CHROMATIC_TO_NOTE_NAME[root];
}

/** Note name to pitch class; accepts `C#`, `Cs`, `C♯` and flats such as `Db`, any case */
export function parseRoot(value: string | null): number | undefined {
  const match = value?.trim().match(/^([a-g])(#|s|♯|b|♭)?$/i);
  if (!match) return undefined;
  const natural = NATURAL_PITCH[match[1].toLowerCase()];
  const shift = ACCIDENTAL_SHIFT[(match[2] ?? '').toLowerCase()];
  return (natural + shift + 12) % 12;
}

/** One of `allowed`, matched by its text form */
export function parseEnum<T extends string | number>(
  value: string | null,
  allowed: readonly T[]
): T | undefined {
  return allowed.find((option) => String(option) === value);
}

/** Comma-separated list; unknown entries are dropped and an empty result is `undefined` */
export function parseList<T>(
  value: string | null,
  parseItem: (item: string) => T | undefined
): T[] | undefined {
  if (!value) return undefined;
  const items = [...new Set(value.split(',').map((item) => parseItem(item.trim())))].filter(
    (item): item is T => item !== undefined
  );
  return items.length > 0 ? items : undefined;
}

/** `1` is on, `0` is off */
export function parseFlag(value: string | null): boolean | undefined {
  if (value === '1') return true;
  if (value === '0') return false;
  return undefined;
}

/** Whole number, clamped to `min`-`max` */
export function parseInteger(value: string | null, min: number, max: number): number | undefined {
  if (!value || !/^-?\d+$/.test(value)) return undefined;
  return Math.min(max, Math.max(min, Number(value)));
}

/** Only the params whose value differs from the defaults, so untouched settings keep the URL short */
export function withoutDefaults(
  params: URLSearchParams,
  defaults: URLSearchParams
): URLSearchParams {
  return new URLSearchParams([...params].filter(([key, value]) => defaults.get(key) !== value));
}
