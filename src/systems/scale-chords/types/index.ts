/**
 * Scale Chords System - Types
 *
 * TypeScript type definitions for the scale chord visualization system
 *
 * This file contains all type definitions specific to the scale chords system,
 * including scale types, chord types, and state interfaces.
 */

/**
 * Scale quality type
 *
 * Represents the major or minor quality of a scale
 */
export type ScaleQuality = 'major' | 'minor';

/**
 * Minor scale variation types
 *
 * Three types of minor scales with different interval patterns:
 * - natural: Relative minor with natural intervals
 * - harmonic: Raised 7th degree for strong resolution
 * - melodic: Raised 6th and 7th degrees ascending
 */
export type MinorScaleType = 'natural' | 'harmonic' | 'melodic';

/**
 * Scale degree (Roman numeral representation)
 *
 * Roman numerals I-VII representing scale degrees.
 * Uppercase indicates major, lowercase indicates minor/diminished.
 * Special symbols: ° (diminished), + (augmented)
 */
export type ScaleDegree = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII' |
                          'i' | 'ii' | 'iii' | 'iv' | 'v' | 'vi' | 'vii' |
                          'ii°' | 'vi°' | 'vii°' | 'III+';

/**
 * Chord quality within a scale
 *
 * Four basic chord qualities used in diatonic harmony:
 * - major: Bright, happy sound (1-3-5)
 * - minor: Dark, melancholic sound (1-♭3-5)
 * - diminished: Tense, unstable sound (1-♭3-♭5)
 * - augmented: Mysterious, floating sound (1-3-♯5)
 */
export type ChordQuality = 'major' | 'minor' | 'diminished' | 'augmented';

/**
 * Scale definition with intervals
 *
 * Defines a scale by its name, semitone intervals from root, and description
 *
 * @example
 * ```typescript
 * const majorScale: ScaleDefinition = {
 *   name: 'Major Scale',
 *   intervals: [0, 2, 4, 5, 7, 9, 11],
 *   description: 'Happy, bright sounding scale'
 * };
 * ```
 */
export interface ScaleDefinition {
  /** Human-readable name (e.g., "Major Scale", "Harmonic Minor Scale") */
  name: string;
  /** Semitone intervals from root note (0-11), always 7 notes for diatonic scales */
  intervals: readonly number[];
  /** Optional educational description explaining the scale's character */
  description?: string;
}

/**
 * Chord within a scale context
 *
 * Complete information about a chord including its position in the scale,
 * quality, note names, and theoretical analysis
 *
 * @example
 * ```typescript
 * const dmInCMajor: ChordInScale = {
 *   degree: 2,
 *   romanNumeral: 'ii',
 *   quality: 'minor',
 *   rootNote: 2,
 *   rootNoteName: 'D',
 *   chordName: 'D minor',
 *   formula: '1-♭3-5',
 *   scaleDegrees: [1, 3, 5],
 *   chordIntervals: [0, 3, 7],
 *   intervalNames: ['Root', 'Minor 3rd', 'Perfect 5th']
 * };
 * ```
 */
export interface ChordInScale {
  /** Scale degree (1-7, corresponds to I-VII) */
  degree: number;
  /** Roman numeral notation (e.g., 'I', 'ii', 'vii°') */
  romanNumeral: ScaleDegree;
  /** Chord quality (major, minor, diminished, augmented) */
  quality: ChordQuality;
  /** Root note chromatic value (0-11, where 0=C, 1=C#, etc.) */
  rootNote: number;
  /** Root note name string (e.g., "C", "D#", "F") */
  rootNoteName: string;
  /** Full chord name for display (e.g., "D minor", "G major") */
  chordName: string;
  /** Chord formula using music notation (e.g., "1-3-5", "1-♭3-5") */
  formula: string;
  /** Scale degrees used in chord construction (typically [1, 3, 5] for triads) */
  scaleDegrees: readonly number[];
  /** Chromatic intervals for the chord tones from root (e.g., [0, 3, 7] for minor) */
  chordIntervals: readonly number[];
  /** Descriptive interval names (e.g., ["Root", "Minor 3rd", "Perfect 5th"]) */
  intervalNames: readonly string[];
}

/**
 * Chord voicing on fretboard
 *
 * Represents a specific way to play a chord on the guitar with fret positions
 * and optional fingering information
 *
 * @example
 * ```typescript
 * const openCMajor: ChordVoicing = {
 *   frets: [-1, 3, 2, 0, 1, 0],
 *   baseFret: 0,
 *   fingers: [-1, 3, 2, 0, 1, 0],
 *   difficulty: 2,
 *   description: 'Open C major'
 * };
 * ```
 */
export interface ChordVoicing {
  /** Fret positions for each string, low E to high E (-1 = muted, 0 = open, 1+ = fret number) */
  frets: readonly number[];
  /** Starting fret position for barre chords (0 for open position chords) */
  baseFret: number;
  /** Optional finger positions (0 = open, 1-4 = fingers, -1 = muted) */
  fingers?: readonly number[];
  /** Optional difficulty rating from 1 (easy) to 5 (very difficult) */
  difficulty?: number;
  /** Optional description of the voicing (e.g., "Open position", "Barre chord at 5th fret") */
  description?: string;
}

/**
 * Scale chord system state
 *
 * Complete state for the scale chord visualizer including scale selection,
 * current chord position, and display options
 *
 * @example
 * ```typescript
 * const initialState: ScaleChordsState = {
 *   selectedKey: 0, // C
 *   scaleQuality: 'major',
 *   minorScaleType: 'natural',
 *   currentChordIndex: 0,
 *   showScaleDegrees: true,
 *   showAllNotes: false
 * };
 * ```
 */
export interface ScaleChordsState {
  /** Selected root key as chromatic value (0=C, 1=C#, 2=D, ..., 11=B) */
  selectedKey: number;
  /** Scale quality (major or minor) */
  scaleQuality: ScaleQuality;
  /** Minor scale variation (only relevant when scaleQuality is 'minor') */
  minorScaleType: MinorScaleType;
  /** Current chord index in progression (0-6 for 7 chords) */
  currentChordIndex: number;
  /** Whether to show scale degree labels (1, 3, 5) on fretboard dots */
  showScaleDegrees: boolean;
  /** Whether to show all note names on the fretboard */
  showAllNotes: boolean;
}

/**
 * Scale selector component props
 */
export interface ScaleSelectorProps {
  /** Selected root key (chromatic value 0-11) */
  selectedKey: number;
  /** Scale quality (major or minor) */
  scaleQuality: ScaleQuality;
  /** Minor scale type (natural, harmonic, melodic) */
  minorScaleType: MinorScaleType;
  /** Callback when key changes */
  onKeyChange: (key: number) => void;
  /** Callback when quality changes */
  onQualityChange: (quality: ScaleQuality) => void;
  /** Callback when minor scale type changes */
  onMinorTypeChange: (type: MinorScaleType) => void;
}

/**
 * Chord progression navigation component props
 */
export interface ChordProgressionNavProps {
  /** Array of all chords in the progression */
  chordProgression: ChordInScale[];
  /** Current chord index (0-6) */
  currentChordIndex: number;
  /** Callback for previous chord button */
  onPrevious: () => void;
  /** Callback for next chord button */
  onNext: () => void;
  /** Callback for jumping to specific chord by index */
  onJumpTo: (index: number) => void;
}

/**
 * Chord info display component props
 */
export interface ChordInfoDisplayProps {
  /** Current chord to display information about */
  chord: ChordInScale;
  /** Scale quality context */
  scaleQuality: ScaleQuality;
  /** Scale root note name */
  scaleRootName: string;
}

/**
 * Scale tone overlay component props
 */
export interface ScaleToneOverlayProps {
  /** Current chord being displayed */
  currentChord: ChordInScale;
  /** Scale information context */
  scaleInfo: {
    /** Scale name (e.g., "Major Scale") */
    name: string;
    /** Root note name (e.g., "C") */
    rootName: string;
  };
}
