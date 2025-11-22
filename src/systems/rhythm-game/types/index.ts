/**
 * Rhythm Game system specific types
 *
 * These types define the rhythm patterns, game state, and actions
 * for the rhythm practice feature.
 */

/**
 * Subdivision type for rhythm patterns
 * Defines how a beat is divided
 */
export type SubdivisionType = 'quarter' | 'eighths' | 'sixteenths' | 'triplets';

/**
 * Individual note within a rhythm pattern
 */
export interface RhythmNote {
  /** Duration as fraction of a beat (e.g., 0.5 for eighth, 0.25 for sixteenth) */
  duration: number;
  /** Whether this is a rest (silence) */
  isRest: boolean;
}

/**
 * Complete rhythm pattern for one beat
 * Note durations must sum to 1.0
 */
export interface RhythmPattern {
  /** Unique identifier for the pattern */
  id: string;
  /** Human-readable name (e.g., "Two Eighths", "Four Sixteenths") */
  name: string;
  /** Array of notes in the pattern */
  notes: RhythmNote[];
  /** Category for grouping in UI */
  category: SubdivisionType;
}

/**
 * Panel index (0-3) for the 2x2 grid
 */
export type PanelIndex = 0 | 1 | 2 | 3;

/**
 * Beat index representing which beat is currently active (0-3)
 */
export type BeatIndex = 0 | 1 | 2 | 3;

/**
 * Main state for the rhythm game
 */
export interface RhythmGameState {
  /** Patterns for each of the 4 panels */
  panels: [RhythmPattern, RhythmPattern, RhythmPattern, RhythmPattern];
  /** Whether the beat cycling is active */
  isPlaying: boolean;
  /** Current beat (0-3), null when not playing */
  currentBeat: BeatIndex | null;
  /** Whether random change mode is enabled */
  randomChangeMode: boolean;
  /** Whether audio playback is enabled */
  playAudio: boolean;
}

/**
 * Actions available for the rhythm game
 */
export interface RhythmGameActions {
  /** Start beat cycling */
  start: () => void;
  /** Stop beat cycling */
  stop: () => void;
  /** Toggle play/pause */
  togglePlay: () => void;
  /** Set pattern for a specific panel */
  setPattern: (panelIndex: PanelIndex, pattern: RhythmPattern) => void;
  /** Randomize all panel patterns */
  randomizeAll: () => void;
  /** Toggle random change mode */
  setRandomChangeMode: (enabled: boolean) => void;
  /** Toggle audio playback */
  setPlayAudio: (enabled: boolean) => void;
  /** Set BPM tempo */
  setBpm: (bpm: number) => void;
}

/**
 * Return type for useRhythmGame hook
 */
export interface UseRhythmGameReturn extends RhythmGameState, RhythmGameActions {
  /** Current BPM from metronome */
  bpm: number;
}

/**
 * Props for pattern selector component
 */
export interface PatternSelectorProps {
  /** Whether the selector is open */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Pattern selection callback */
  onSelect: (pattern: RhythmPattern) => void;
  /** Available patterns to choose from */
  availablePatterns: RhythmPattern[];
}

/**
 * Props for rhythm panel component
 */
export interface RhythmPanelProps {
  /** Pattern to display */
  pattern: RhythmPattern;
  /** Whether this panel is the active beat */
  isActive: boolean;
  /** Panel index (0-3) */
  panelIndex: PanelIndex;
  /** Click handler for pattern selection */
  onSelectPattern: () => void;
}

/**
 * Props for notation display component
 */
export interface NotationDisplayProps {
  /** Pattern to render as music notation */
  pattern: RhythmPattern;
  /** Optional className for styling */
  className?: string;
}
