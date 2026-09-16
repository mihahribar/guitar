import { useMemo, useReducer } from 'react';
import type { ChordType, ChordQuality, ScaleType } from '../types';
import { cagedSequenceLength } from './useCAGEDSequence';

interface CAGEDState {
  selectedChord: ChordType;
  chordQuality: ChordQuality;
  /** Indices into the CAGED sequence that are drawn at once; sorted, never empty */
  selectedPositions: number[];
  /** Selection to restore when "show all shapes" is switched back off */
  collapsedSelection: number[];
  showPentatonic: boolean;
  showAllNotes: boolean;
  showScale: boolean;
  selectedScale: ScaleType;
}

type CAGEDAction =
  | { type: 'SET_CHORD'; payload: ChordType }
  | { type: 'SET_CHORD_QUALITY'; payload: ChordQuality }
  | { type: 'NEXT_POSITION' }
  | { type: 'PREVIOUS_POSITION' }
  | { type: 'TOGGLE_POSITION'; payload: number }
  | { type: 'SOLO_POSITION'; payload: number }
  | { type: 'TOGGLE_ALL_POSITIONS' }
  | { type: 'TOGGLE_SHOW_PENTATONIC' }
  | { type: 'TOGGLE_SHOW_ALL_NOTES' }
  | { type: 'TOGGLE_SHOW_SCALE' }
  | { type: 'SET_SCALE_TYPE'; payload: ScaleType };

/** Positions as a sorted, duplicate-free list */
function sortPositions(positions: readonly number[]): number[] {
  return [...new Set(positions)].sort((a, b) => a - b);
}

/** Indices 0…length-1, i.e. every position on the neck */
function allPositions(length: number): number[] {
  return Array.from({ length }, (_, index) => index);
}

/** Whether the selection already covers the chord's whole walk */
function isEverythingSelected(state: CAGEDState): boolean {
  return state.selectedPositions.length >= cagedSequenceLength(state.selectedChord);
}

/**
 * Walk the whole selection one position up or down the neck. Every selected
 * position moves by the same step, so the group keeps its spacing.
 */
function shiftPositions(state: CAGEDState, delta: 1 | -1): CAGEDState {
  const length = cagedSequenceLength(state.selectedChord);
  if (length === 0) return state;
  return {
    ...state,
    selectedPositions: sortPositions(
      state.selectedPositions.map((position) => (position + delta + length) % length)
    ),
  };
}

function cagedReducer(state: CAGEDState, action: CAGEDAction): CAGEDState {
  switch (action.type) {
    case 'SET_CHORD':
      return {
        ...state,
        selectedChord: action.payload,
        // The sequence is rebuilt for the new chord, so old indices no longer apply.
        // Viewing the whole neck is a view mode, though, so that much carries over.
        selectedPositions: isEverythingSelected(state)
          ? allPositions(cagedSequenceLength(action.payload))
          : [0],
        collapsedSelection: [0],
      };
    case 'SET_CHORD_QUALITY': {
      let selectedScale = state.selectedScale;
      // Auto-switch Major↔Natural Minor when chord quality changes
      if (action.payload === 'minor' && state.selectedScale === 'major') {
        selectedScale = 'naturalMinor';
      } else if (action.payload === 'major' && state.selectedScale === 'naturalMinor') {
        selectedScale = 'major';
      }
      return {
        ...state,
        chordQuality: action.payload,
        selectedScale,
      };
    }
    case 'NEXT_POSITION':
      return shiftPositions(state, 1);
    case 'PREVIOUS_POSITION':
      return shiftPositions(state, -1);
    case 'TOGGLE_POSITION': {
      const selectedPositions = state.selectedPositions.includes(action.payload)
        ? state.selectedPositions.filter((position) => position !== action.payload)
        : sortPositions([...state.selectedPositions, action.payload]);
      // Always leave at least one shape on the fretboard
      return selectedPositions.length > 0 ? { ...state, selectedPositions } : state;
    }
    case 'SOLO_POSITION':
      return { ...state, selectedPositions: [action.payload] };
    case 'TOGGLE_ALL_POSITIONS': {
      if (!isEverythingSelected(state)) {
        return {
          ...state,
          selectedPositions: allPositions(cagedSequenceLength(state.selectedChord)),
          collapsedSelection: state.selectedPositions,
        };
      }
      // Switching back off restores whatever was selected before
      return {
        ...state,
        selectedPositions: state.collapsedSelection.length > 0 ? state.collapsedSelection : [0],
      };
    }
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
    case 'TOGGLE_SHOW_SCALE':
      return {
        ...state,
        showScale: !state.showScale,
      };
    case 'SET_SCALE_TYPE':
      return {
        ...state,
        selectedScale: action.payload,
      };
    default:
      return state;
  }
}

const initialState: CAGEDState = {
  selectedChord: 'C',
  chordQuality: 'major',
  selectedPositions: [0],
  collapsedSelection: [0],
  showPentatonic: false,
  showAllNotes: false,
  showScale: false,
  selectedScale: 'major',
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
 * // Change chord and reset the selection
 * actions.setChord('G');
 *
 * // Stack a second position on the fretboard
 * actions.togglePosition(3);
 *
 * // Walk every selected position up the neck
 * actions.nextPosition();
 * ```
 *
 * @stateManagement
 * Any number of positions can be shown at once. The selection is stored as
 * indices into the CAGED sequence, reset when the chord root changes (the
 * sequence is rebuilt) but kept when switching between major/minor quality.
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
    nextPosition: () => void;
    previousPosition: () => void;
    togglePosition: (position: number) => void;
    soloPosition: (position: number) => void;
    toggleAllPositions: () => void;
    toggleShowPentatonic: () => void;
    toggleShowAllNotes: () => void;
    toggleShowScale: () => void;
    setScaleType: (scaleType: ScaleType) => void;
  };
} {
  const [state, dispatch] = useReducer(cagedReducer, initialState);

  const actions = useMemo(
    () => ({
      setChord: (chord: ChordType) => dispatch({ type: 'SET_CHORD', payload: chord }),
      setChordQuality: (quality: ChordQuality) =>
        dispatch({ type: 'SET_CHORD_QUALITY', payload: quality }),
      nextPosition: () => dispatch({ type: 'NEXT_POSITION' }),
      previousPosition: () => dispatch({ type: 'PREVIOUS_POSITION' }),
      togglePosition: (position: number) =>
        dispatch({ type: 'TOGGLE_POSITION', payload: position }),
      soloPosition: (position: number) => dispatch({ type: 'SOLO_POSITION', payload: position }),
      toggleAllPositions: () => dispatch({ type: 'TOGGLE_ALL_POSITIONS' }),
      toggleShowPentatonic: () => dispatch({ type: 'TOGGLE_SHOW_PENTATONIC' }),
      toggleShowAllNotes: () => dispatch({ type: 'TOGGLE_SHOW_ALL_NOTES' }),
      toggleShowScale: () => dispatch({ type: 'TOGGLE_SHOW_SCALE' }),
      setScaleType: (scaleType: ScaleType) =>
        dispatch({ type: 'SET_SCALE_TYPE', payload: scaleType }),
    }),
    []
  );

  return {
    state,
    actions,
  };
}
