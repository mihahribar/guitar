/**
 * CAGED system specific types
 *
 * These types are specific to the CAGED chord system implementation
 * and extend the shared core types for CAGED-specific functionality.
 */

import type { ChordType, ChordQuality, MusicShape, ShapesByQuality } from '@/shared/types/core';
import type { ScaleType } from '../constants/scales';

// Re-export shared types for CAGED system use
export type { ChordType, ChordQuality, ScaleType };

/**
 * Individual CAGED chord shape definition
 */
export interface CAGEDShape extends MusicShape {
  /** Finger positions for playing the shape (0 = open, 1-4 = fingers) */
  fingers: readonly number[];
  /** String indices that contain the root note of the chord */
  rootNotes: readonly number[];
}

/**
 * Collection of CAGED shapes indexed by shape letter
 */
export interface CAGEDShapeData {
  [key: string]: CAGEDShape;
}

/**
 * CAGED shapes organized by chord quality (major/minor)
 */
export interface CAGEDShapesByQuality extends ShapesByQuality {
  /** Major chord shape patterns */
  major: CAGEDShapeData;
  /** Minor chord shape patterns */
  minor: CAGEDShapeData;
}

/**
 * A single playable position in the CAGED sequence: a chord shape together with the
 * fret it's anchored at. The same shape can appear at multiple positions on a 21-fret
 * neck (e.g. G shape at fret 0 and again at fret 12).
 */
export interface CAGEDPosition {
  /** Which CAGED shape (C/A/G/E/D) */
  shape: ChordType;
  /** Base fret the shape is anchored at (0 = open form) */
  basePosition: number;
}

/**
 * Pentatonic box pattern definition
 * Each box covers a specific fret range and has defined note positions
 */
export interface PentatonicBoxPattern {
  /** Starting fret for this box pattern (relative to root position) */
  startFret: number;
  /** Ending fret for this box pattern (relative to root position) */
  endFret: number;
  /** Description of the box pattern */
  name: string;
}

/**
 * Pentatonic box patterns organized by quality and position
 */
export interface PentatonicBoxPatterns {
  major: {
    [position: number]: PentatonicBoxPattern;
  };
  minor: {
    [position: number]: PentatonicBoxPattern;
  };
}
