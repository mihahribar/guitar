/**
 * Core shared types for guitar learning systems
 *
 * These types provide the foundation for all guitar learning systems
 * and can be extended by specific implementations (CAGED, scales, etc.)
 */

/**
 * Chord quality affecting interval patterns
 */
export type ChordQuality = 'major' | 'minor';

/**
 * Basic chord types in the chromatic system
 */
export type ChordType = 'C' | 'A' | 'G' | 'E' | 'D';

/**
 * Guitar string index (0-based from low E to high E)
 */
export type StringIndex = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Fret number on guitar neck (0 = open string)
 */
export type FretNumber = number;

/**
 * Chromatic note values mapping (0-11 representing semitones)
 */
export interface ChromaticValues {
  readonly [key: string]: number;
}

/**
 * Position on the fretboard
 */
export interface FretboardPosition {
  /** Guitar string index (0 = low E, 5 = high E) */
  stringIndex: StringIndex;
  /** Fret number (0 = open, 1+ = fret positions) */
  fretNumber: FretNumber;
}

/**
 * Basic musical shape definition for any learning system
 */
export interface MusicShape {
  /** Display name of the shape */
  name: string;
  /** CSS color value for visual representation */
  color: string;
  /** Fret pattern for each string (0-based, -1 = not played) */
  pattern: readonly number[];
  /** String indices that contain important notes (roots, etc.) */
  keyNotes: readonly number[];
}

/**
 * Extended shape with quality information
 */
export interface ShapeWithQuality extends MusicShape {
  /** Chord/scale quality for this shape variant */
  quality: ChordQuality;
}

/**
 * Collection of shapes indexed by identifier
 */
export interface ShapeData {
  [key: string]: MusicShape;
}

/**
 * Shapes organized by quality
 */
export interface ShapesByQuality {
  /** Major quality shapes */
  major: ShapeData;
  /** Minor quality shapes */
  minor: ShapeData;
}

/**
 * Generic learning system state
 */
export interface LearningSystemState {
  /** Currently selected root note */
  selectedRoot: ChordType;
  /** Current quality (major/minor) */
  quality: ChordQuality;
  /** Current position in sequence */
  currentPosition: number;
  /** Whether to show all patterns simultaneously */
  showAllPatterns: boolean;
  /** Whether to show additional overlays */
  showOverlays: boolean;
  /** Whether to show note names */
  showNoteNames: boolean;
}

/**
 * Validation result type for safe operations
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] };

/**
 * Validation error information
 */
export interface ValidationError {
  /** Field name that failed validation */
  field: string;
  /** Human-readable error message */
  message: string;
  /** The value that was received */
  received: unknown;
  /** Expected type or format */
  expected?: string;
}

/**
 * Theme preference type
 */
export type ThemePreference = 'light' | 'dark';

/**
 * Navigation page type
 */
export type NavigationPage = 'caged' | 'quiz';

/**
 * App-wide navigation state
 */
export interface NavigationState {
  /** Current active page */
  currentPage: NavigationPage;
  /** Previous page for back navigation */
  previousPage?: NavigationPage;
}

/**
 * Local storage data structure
 */
export interface LocalStorageData {
  /** Theme preferences */
  theme?: ThemePreference;
  /** Last updated timestamp */
  lastUpdated?: number;
  /** System-specific preferences */
  preferences?: Record<string, unknown>;
}
