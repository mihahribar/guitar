/**
 * Fretboard-specific types for guitar learning systems
 *
 * These types define the structure for fretboard display and interaction
 * components that can be shared across different learning systems.
 */

import type { FretboardPosition, StringIndex, FretNumber } from './core';

/**
 * Props for fretboard display components
 */
export interface FretboardDisplayProps {
  /** Currently selected root note */
  selectedRoot: string;
  /** Current pattern/shape being displayed */
  currentPattern?: string;
  /** Whether to show all patterns simultaneously */
  showAllPatterns: boolean;
  /** Whether to overlay additional information */
  showOverlay: boolean;
  /** Whether to display note names */
  showNoteNames: boolean;
  /** Function to determine if a dot should be shown at position */
  shouldShowDot: (stringIndex: StringIndex, fretNumber: FretNumber) => boolean;
  /** Function to get CSS styling for dots */
  getDotStyle: (
    stringIndex: StringIndex,
    fretNumber: FretNumber
  ) => React.CSSProperties | undefined;
  /** Function to check if position contains important notes */
  isKeyNote: (stringIndex: StringIndex, fretNumber: FretNumber) => boolean;
  /** Function to determine if overlay dot should be shown */
  shouldShowOverlayDot: (stringIndex: StringIndex, fretNumber: FretNumber) => boolean;
  /** Function to determine if note name should be displayed */
  shouldShowNoteName: (stringIndex: StringIndex, fretNumber: FretNumber) => boolean;
  /** Function to get note name string for position */
  getNoteNameAtFret: (stringIndex: StringIndex, fretNumber: FretNumber) => string;
}

/**
 * Fretboard interaction callbacks
 */
export interface FretboardCallbacks {
  /** Called when a fretboard position is clicked */
  onPositionClick?: (position: FretboardPosition) => void;
  /** Called when hovering over a position */
  onPositionHover?: (position: FretboardPosition | null) => void;
  /** Called when a string is selected */
  onStringSelect?: (stringIndex: StringIndex) => void;
}

/**
 * Fretboard display configuration
 */
export interface FretboardConfig {
  /** Number of frets to display */
  fretCount: number;
  /** Whether to show fret markers */
  showFretMarkers: boolean;
  /** Whether to show string labels */
  showStringLabels: boolean;
  /** Whether fretboard is interactive */
  interactive: boolean;
  /** Custom CSS classes for styling */
  className?: string;
}

/**
 * Visual styling options for fretboard elements
 */
export interface FretboardStyling {
  /** Colors for different pattern types */
  patternColors: Record<string, string>;
  /** Color for overlay elements */
  overlayColor: string;
  /** Color for key notes (roots, etc.) */
  keyNoteColor: string;
  /** Background color scheme */
  backgroundColor: string;
  /** String line color */
  stringColor: string;
  /** Fret line color */
  fretColor: string;
}

/**
 * Dot display information
 */
export interface DotInfo {
  /** Whether the dot should be displayed */
  show: boolean;
  /** CSS style for the dot */
  style?: React.CSSProperties;
  /** Whether this is a key note */
  isKeyNote: boolean;
  /** Whether this has overlay information */
  hasOverlay: boolean;
  /** Display text/label for the dot */
  label?: string;
  /** Accessibility label */
  ariaLabel?: string;
}

/**
 * Fretboard state for managing display
 */
export interface FretboardState {
  /** Current hover position */
  hoverPosition: FretboardPosition | null;
  /** Selected positions */
  selectedPositions: FretboardPosition[];
  /** Highlighted positions */
  highlightedPositions: FretboardPosition[];
}

/**
 * Pattern overlay information
 */
export interface PatternOverlay {
  /** Overlay type identifier */
  type: string;
  /** Positions to highlight */
  positions: FretboardPosition[];
  /** Visual style for overlay */
  style: React.CSSProperties;
  /** Whether overlay is currently active */
  active: boolean;
}

/**
 * Fretboard rendering context
 */
export interface FretboardRenderContext {
  /** Display configuration */
  config: FretboardConfig;
  /** Visual styling */
  styling: FretboardStyling;
  /** Current state */
  state: FretboardState;
  /** Active overlays */
  overlays: PatternOverlay[];
  /** Interaction callbacks */
  callbacks: FretboardCallbacks;
}
