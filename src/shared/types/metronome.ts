/**
 * Metronome type definitions
 *
 * TypeScript interfaces and types for the metronome feature.
 * Defines state, configuration, and hook return types.
 */

/**
 * Core state for the metronome
 */
export interface MetronomeState {
  /** Whether the metronome is currently playing */
  isPlaying: boolean;
  /** Current tempo in beats per minute */
  bpm: number;
}

/**
 * Audio configuration for metronome click generation
 */
export interface MetronomeAudioConfig {
  /** Frequency of the click sound in Hz */
  clickFrequency: number;
  /** Duration of the click sound in seconds */
  clickDuration: number;
  /** Volume level (0.0 to 1.0) */
  volume: number;
}

/**
 * Return type for the useMetronome hook
 */
export interface MetronomeHookReturn {
  /** Whether the metronome is currently playing */
  isPlaying: boolean;
  /** Current tempo in beats per minute */
  bpm: number;
  /** Toggle metronome play/pause */
  togglePlay: () => void;
  /** Update BPM value */
  setBpm: (bpm: number) => void;
  /** Whether the current BPM is within valid range */
  isValid: boolean;
}
