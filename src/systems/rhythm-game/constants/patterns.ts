/**
 * Rhythm pattern definitions
 *
 * All patterns must have note durations that sum to exactly 1.0 (one beat).
 * Patterns are organized by subdivision category.
 */

import type { RhythmPattern } from '../types';

/**
 * Quarter note patterns (1 subdivision per beat)
 */
export const QUARTER_PATTERNS: RhythmPattern[] = [
  {
    id: 'quarter',
    name: 'Quarter Note',
    notes: [{ duration: 1.0, isRest: false }],
    category: 'quarter',
  },
  {
    id: 'quarter-rest',
    name: 'Quarter Rest',
    notes: [{ duration: 1.0, isRest: true }],
    category: 'quarter',
  },
] as const;

/**
 * Eighth note patterns (2 subdivisions per beat)
 */
export const EIGHTH_PATTERNS: RhythmPattern[] = [
  {
    id: 'two-eighths',
    name: 'Two Eighths',
    notes: [
      { duration: 0.5, isRest: false },
      { duration: 0.5, isRest: false },
    ],
    category: 'eighths',
  },
  {
    id: 'eighth-eighth-rest',
    name: 'Eighth + Rest',
    notes: [
      { duration: 0.5, isRest: false },
      { duration: 0.5, isRest: true },
    ],
    category: 'eighths',
  },
  {
    id: 'eighth-rest-eighth',
    name: 'Rest + Eighth',
    notes: [
      { duration: 0.5, isRest: true },
      { duration: 0.5, isRest: false },
    ],
    category: 'eighths',
  },
] as const;

/**
 * Sixteenth note patterns (4 subdivisions per beat)
 */
export const SIXTEENTH_PATTERNS: RhythmPattern[] = [
  {
    id: 'four-sixteenths',
    name: 'Four Sixteenths',
    notes: [
      { duration: 0.25, isRest: false },
      { duration: 0.25, isRest: false },
      { duration: 0.25, isRest: false },
      { duration: 0.25, isRest: false },
    ],
    category: 'sixteenths',
  },
  {
    id: 'eighth-two-sixteenths',
    name: 'Eighth + 2 Sixteenths',
    notes: [
      { duration: 0.5, isRest: false },
      { duration: 0.25, isRest: false },
      { duration: 0.25, isRest: false },
    ],
    category: 'sixteenths',
  },
  {
    id: 'two-sixteenths-eighth',
    name: '2 Sixteenths + Eighth',
    notes: [
      { duration: 0.25, isRest: false },
      { duration: 0.25, isRest: false },
      { duration: 0.5, isRest: false },
    ],
    category: 'sixteenths',
  },
  {
    id: 'sixteenth-eighth-sixteenth',
    name: 'Sixteenth + Eighth + Sixteenth',
    notes: [
      { duration: 0.25, isRest: false },
      { duration: 0.5, isRest: false },
      { duration: 0.25, isRest: false },
    ],
    category: 'sixteenths',
  },
  {
    id: 'dotted-eighth-sixteenth',
    name: 'Dotted Eighth + Sixteenth',
    notes: [
      { duration: 0.75, isRest: false },
      { duration: 0.25, isRest: false },
    ],
    category: 'sixteenths',
  },
  {
    id: 'sixteenth-dotted-eighth',
    name: 'Sixteenth + Dotted Eighth',
    notes: [
      { duration: 0.25, isRest: false },
      { duration: 0.75, isRest: false },
    ],
    category: 'sixteenths',
  },
  {
    id: 'three-sixteenths-rest',
    name: '3 Sixteenths + Rest',
    notes: [
      { duration: 0.25, isRest: false },
      { duration: 0.25, isRest: false },
      { duration: 0.25, isRest: false },
      { duration: 0.25, isRest: true },
    ],
    category: 'sixteenths',
  },
  {
    id: 'rest-three-sixteenths',
    name: 'Rest + 3 Sixteenths',
    notes: [
      { duration: 0.25, isRest: true },
      { duration: 0.25, isRest: false },
      { duration: 0.25, isRest: false },
      { duration: 0.25, isRest: false },
    ],
    category: 'sixteenths',
  },
] as const;

/**
 * Triplet patterns (3 subdivisions per beat)
 * Note: Triplets divide the beat into 3 equal parts (~0.333 each)
 */
export const TRIPLET_PATTERNS: RhythmPattern[] = [
  {
    id: 'triplet',
    name: 'Triplet',
    notes: [
      { duration: 1 / 3, isRest: false },
      { duration: 1 / 3, isRest: false },
      { duration: 1 / 3, isRest: false },
    ],
    category: 'triplets',
  },
  {
    id: 'triplet-rest-end',
    name: 'Triplet + Rest',
    notes: [
      { duration: 1 / 3, isRest: false },
      { duration: 1 / 3, isRest: false },
      { duration: 1 / 3, isRest: true },
    ],
    category: 'triplets',
  },
  {
    id: 'triplet-rest-start',
    name: 'Rest + Triplet',
    notes: [
      { duration: 1 / 3, isRest: true },
      { duration: 1 / 3, isRest: false },
      { duration: 1 / 3, isRest: false },
    ],
    category: 'triplets',
  },
  {
    id: 'triplet-rest-middle',
    name: 'Triplet (Rest Middle)',
    notes: [
      { duration: 1 / 3, isRest: false },
      { duration: 1 / 3, isRest: true },
      { duration: 1 / 3, isRest: false },
    ],
    category: 'triplets',
  },
] as const;

/**
 * All rhythm patterns combined
 */
export const ALL_PATTERNS: RhythmPattern[] = [
  ...QUARTER_PATTERNS,
  ...EIGHTH_PATTERNS,
  ...SIXTEENTH_PATTERNS,
  ...TRIPLET_PATTERNS,
] as const;

/**
 * Patterns grouped by category for UI display
 */
export const PATTERNS_BY_CATEGORY = {
  quarter: QUARTER_PATTERNS,
  eighths: EIGHTH_PATTERNS,
  sixteenths: SIXTEENTH_PATTERNS,
  triplets: TRIPLET_PATTERNS,
} as const;
