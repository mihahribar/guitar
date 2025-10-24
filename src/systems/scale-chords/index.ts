/**
 * Scale Chords System - Main Module Export
 *
 * This module provides a complete guitar learning system for understanding
 * how chords are constructed from scales. Users can explore all diatonic
 * chords within major and minor scales, visualizing chord construction
 * from scale degrees.
 *
 * @module scale-chords
 */

// Main component (primary export)
export { default as ScaleChordsVisualizer } from './components/ScaleChordsVisualizer';

// Export types for external use
export type {
  ScaleQuality,
  MinorScaleType,
  ScaleDegree,
  ChordQuality,
  ScaleDefinition,
  ChordInScale,
  ChordVoicing,
  ScaleChordsState
} from './types';

// Export hooks for advanced usage
export {
  useScaleChordsState,
  useScaleChordsLogic,
  useScaleKeyboardNav
} from './hooks';

// Export constants for reference
export {
  SCALE_DEFINITIONS,
  CHORD_QUALITIES_BY_SCALE,
  CHORD_INTERVALS,
  CHORD_FORMULAS
} from './constants';
