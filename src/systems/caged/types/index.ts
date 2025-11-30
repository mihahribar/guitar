/**
 * CAGED system specific types
 *
 * These types are specific to the CAGED chord system implementation
 * and extend the shared core types for CAGED-specific functionality.
 */

import type { ChordType, ChordQuality, MusicShape, ShapesByQuality } from '@/shared/types/core';

// Re-export shared types for CAGED system use
export type { ChordType, ChordQuality };

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
 * CAGED shape with explicit chord quality information
 */
export interface CAGEDShapeWithQuality extends CAGEDShape {
  /** Chord quality (major or minor) for this shape variant */
  quality: ChordQuality;
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
 * CAGED visualizer state
 */
export interface CAGEDState {
  /** Currently selected root chord */
  selectedChord: ChordType;
  /** Current chord quality (major/minor) */
  chordQuality: ChordQuality;
  /** Current position in CAGED sequence */
  currentPosition: number;
  /** Whether to show all CAGED shapes simultaneously */
  showAllShapes: boolean;
  /** Whether to show pentatonic scale overlay */
  showPentatonic: boolean;
  /** Whether to show all note names */
  showAllNotes: boolean;
}

/**
 * CAGED navigation props
 */
export interface CAGEDNavigationProps {
  selectedChord: ChordType;
  chordQuality: ChordQuality;
  currentPosition: number;
  cagedSequence: string[];
  showAllShapes: boolean;
  onChordChange: (chord: ChordType) => void;
  onChordQualityChange: (quality: ChordQuality) => void;
  onPreviousPosition: () => void;
  onNextPosition: () => void;
  onSetPosition: (position: number) => void;
}

/**
 * CAGED view mode toggles props
 */
export interface CAGEDViewModeProps {
  selectedChord: ChordType;
  chordQuality: ChordQuality;
  showAllShapes: boolean;
  showPentatonic: boolean;
  showAllNotes: boolean;
  onToggleShowAllShapes: () => void;
  onToggleShowPentatonic: () => void;
  onToggleShowAllNotes: () => void;
}

/**
 * Shape position calculations
 */
export interface ShapePositions {
  [key: string]: number;
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
