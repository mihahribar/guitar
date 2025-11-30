import { useReducer } from 'react';
import type { ChordType, ChordQuality } from '../types';

interface CAGEDState {
  selectedChord: ChordType;
  chordQuality: ChordQuality;
  currentPosition: number;
  showAllShapes: boolean;
  showPentatonic: boolean;
  showAllNotes: boolean;
}

type CAGEDAction =
  | { type: 'SET_CHORD'; payload: ChordType }
  | { type: 'SET_CHORD_QUALITY'; payload: ChordQuality }
  | { type: 'NEXT_POSITION'; payload: { sequenceLength: number } }
  | { type: 'PREVIOUS_POSITION'; payload: { sequenceLength: number } }
  | { type: 'SET_POSITION'; payload: number }
  | { type: 'TOGGLE_SHOW_ALL_SHAPES' }
  | { type: 'TOGGLE_SHOW_PENTATONIC' }
  | { type: 'TOGGLE_SHOW_ALL_NOTES' };

function cagedReducer(state: CAGEDState, action: CAGEDAction): CAGEDState {
  switch (action.type) {
    case 'SET_CHORD':
      return {
        ...state,
        selectedChord: action.payload,
        currentPosition: 0, // Reset to first position when changing chord
      };
    case 'SET_CHORD_QUALITY':
      return {
        ...state,
        chordQuality: action.payload,
        // Maintain current position when switching between major/minor
      };
    case 'NEXT_POSITION':
      return {
        ...state,
        currentPosition: (state.currentPosition + 1) % action.payload.sequenceLength,
      };
    case 'PREVIOUS_POSITION':
      return {
        ...state,
        currentPosition:
          (state.currentPosition - 1 + action.payload.sequenceLength) %
          action.payload.sequenceLength,
      };
    case 'SET_POSITION':
      return {
        ...state,
        currentPosition: action.payload,
      };
    case 'TOGGLE_SHOW_ALL_SHAPES':
      return {
        ...state,
        showAllShapes: !state.showAllShapes,
      };
    case 'TOGGLE_SHOW_PENTATONIC':
      return {
        ...state,
        showPentatonic: !state.showPentatonic,
      };
    case 'TOGGLE_SHOW_ALL_NOTES':
      return {
        ...state,
        showAllNotes: !state.showAllNotes,
      };
    default:
      return state;
  }
}

const initialState: CAGEDState = {
  selectedChord: 'C',
  chordQuality: 'major',
  currentPosition: 0,
  showAllShapes: false,
  showPentatonic: false,
  showAllNotes: false,
};

/**
 * Custom hook for managing CAGED visualizer state using useReducer pattern
 *
 * Provides centralized state management for the CAGED chord system visualizer,
 * including chord selection, quality toggles, position navigation, and display options.
 * Uses reducer pattern for predictable state updates and complex state logic.
 *
 * @returns Object containing:
 *   - state: Current CAGEDState with all visualizer settings
 *   - actions: Object with action creator functions for state updates
 *
 * @example
 * ```typescript
 * const { state, actions } = useCAGEDState();
 *
 * // Change chord and reset position
 * actions.setChord('G');
 *
 * // Toggle between major and minor
 * actions.setChordQuality('minor');
 *
 * // Navigate through CAGED sequence
 * actions.nextPosition(5); // 5 shapes in sequence
 * ```
 *
 * @stateManagement
 * State updates follow immutable patterns with automatic position reset when
 * changing chord root (for consistency), but maintains position when switching
 * between major/minor quality for better user experience.
 *
 * @performance
 * Uses useReducer for complex state logic instead of multiple useState hooks,
 * reducing re-renders and improving predictability of state changes.
 */
export function useCAGEDState(): {
  state: CAGEDState;
  actions: {
    setChord: (chord: ChordType) => void;
    setChordQuality: (quality: ChordQuality) => void;
    nextPosition: (sequenceLength: number) => void;
    previousPosition: (sequenceLength: number) => void;
    setPosition: (position: number) => void;
    toggleShowAllShapes: () => void;
    toggleShowPentatonic: () => void;
    toggleShowAllNotes: () => void;
  };
} {
  const [state, dispatch] = useReducer(cagedReducer, initialState);

  const actions = {
    setChord: (chord: ChordType) => dispatch({ type: 'SET_CHORD', payload: chord }),
    setChordQuality: (quality: ChordQuality) =>
      dispatch({ type: 'SET_CHORD_QUALITY', payload: quality }),
    nextPosition: (sequenceLength: number) =>
      dispatch({ type: 'NEXT_POSITION', payload: { sequenceLength } }),
    previousPosition: (sequenceLength: number) =>
      dispatch({ type: 'PREVIOUS_POSITION', payload: { sequenceLength } }),
    setPosition: (position: number) => dispatch({ type: 'SET_POSITION', payload: position }),
    toggleShowAllShapes: () => dispatch({ type: 'TOGGLE_SHOW_ALL_SHAPES' }),
    toggleShowPentatonic: () => dispatch({ type: 'TOGGLE_SHOW_PENTATONIC' }),
    toggleShowAllNotes: () => dispatch({ type: 'TOGGLE_SHOW_ALL_NOTES' }),
  };

  return {
    state,
    actions,
  };
}
