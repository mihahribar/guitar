import { useMemo, useReducer } from 'react';
import type { StringIndex } from '@/shared/types/core';
import type { ModeDegree, NpsScope, ThreeNpsState } from '../types';
import { buildSequence, findNearest, resolveCurrentPattern } from '../utils/threeNps';

export type ThreeNpsAction =
  | { type: 'SET_ROOT'; payload: number }
  | { type: 'NEXT' }
  | { type: 'PREVIOUS' }
  | { type: 'SET_MODE'; payload: ModeDegree }
  | { type: 'SET_STRING_PAIR'; payload: StringIndex }
  | { type: 'PAIR_UP' }
  | { type: 'PAIR_DOWN' }
  | { type: 'TOGGLE_SHOW_ALL_MODES' }
  | { type: 'TOGGLE_ALL_STRINGS' }
  | { type: 'TOGGLE_SHOW_ALL_NOTES' };

/** Lowest pair uses the low E (5); highest pair uses the B string (1) */
const LOWEST_PAIR_STRING = 5;
const HIGHEST_PAIR_STRING = 1;

export function getScope(state: Pick<ThreeNpsState, 'allStrings' | 'lowString'>): NpsScope {
  return state.allStrings ? { kind: 'all' } : { kind: 'pair', lowString: state.lowString };
}

/** Ionian at its lowest position on the neck for the given scope */
function ionianStart(root: number, scope: NpsScope): number {
  return findNearest(buildSequence(root, scope), 0, 0)?.startFret ?? 0;
}

export function createInitialThreeNpsState(root = 0): ThreeNpsState {
  const base = { root, lowString: 5 as StringIndex, allStrings: false };
  return {
    ...base,
    degree: 0,
    anchorFret: ionianStart(root, getScope(base)),
    showAllModes: false,
    showAllNotes: false,
  };
}

function step(state: ThreeNpsState, delta: 1 | -1): ThreeNpsState {
  const sequence = buildSequence(state.root, getScope(state));
  const current = resolveCurrentPattern(sequence, state.degree, state.anchorFret);
  if (!current) return state;
  const index = sequence.indexOf(current);
  const target = sequence[(index + delta + sequence.length) % sequence.length];
  return { ...state, degree: target.degree, anchorFret: target.startFret };
}

/** Re-anchor to the current mode's nearest pattern after the scope changed */
function reanchor(state: ThreeNpsState): ThreeNpsState {
  const nearest = findNearest(
    buildSequence(state.root, getScope(state)),
    state.degree,
    state.anchorFret
  );
  return nearest ? { ...state, anchorFret: nearest.startFret } : state;
}

export function threeNpsReducer(state: ThreeNpsState, action: ThreeNpsAction): ThreeNpsState {
  switch (action.type) {
    case 'SET_ROOT':
      return {
        ...state,
        root: action.payload,
        degree: 0,
        anchorFret: ionianStart(action.payload, getScope(state)),
      };
    case 'NEXT':
      return step(state, 1);
    case 'PREVIOUS':
      return step(state, -1);
    case 'SET_MODE':
      return reanchor({ ...state, degree: action.payload });
    case 'SET_STRING_PAIR':
      return reanchor({ ...state, lowString: action.payload });
    case 'PAIR_UP':
      return state.lowString <= HIGHEST_PAIR_STRING
        ? state
        : reanchor({ ...state, lowString: (state.lowString - 1) as StringIndex });
    case 'PAIR_DOWN':
      return state.lowString >= LOWEST_PAIR_STRING
        ? state
        : reanchor({ ...state, lowString: (state.lowString + 1) as StringIndex });
    case 'TOGGLE_SHOW_ALL_MODES':
      return { ...state, showAllModes: !state.showAllModes };
    case 'TOGGLE_ALL_STRINGS':
      return reanchor({ ...state, allStrings: !state.allStrings });
    case 'TOGGLE_SHOW_ALL_NOTES':
      return { ...state, showAllNotes: !state.showAllNotes };
    default:
      return state;
  }
}

/**
 * State management for the 3NPS visualizer.
 *
 * The current pattern is stored as mode + anchor fret rather than a sequence
 * index, so switching string pairs or scope keeps the same mode near the same
 * spot on the neck.
 */
export function useThreeNpsState() {
  const [state, dispatch] = useReducer(threeNpsReducer, 0, createInitialThreeNpsState);

  const actions = useMemo(
    () => ({
      setRoot: (root: number) => dispatch({ type: 'SET_ROOT', payload: root }),
      next: () => dispatch({ type: 'NEXT' }),
      previous: () => dispatch({ type: 'PREVIOUS' }),
      setMode: (degree: ModeDegree) => dispatch({ type: 'SET_MODE', payload: degree }),
      setStringPair: (lowString: StringIndex) =>
        dispatch({ type: 'SET_STRING_PAIR', payload: lowString }),
      pairUp: () => dispatch({ type: 'PAIR_UP' }),
      pairDown: () => dispatch({ type: 'PAIR_DOWN' }),
      toggleShowAllModes: () => dispatch({ type: 'TOGGLE_SHOW_ALL_MODES' }),
      toggleAllStrings: () => dispatch({ type: 'TOGGLE_ALL_STRINGS' }),
      toggleShowAllNotes: () => dispatch({ type: 'TOGGLE_SHOW_ALL_NOTES' }),
    }),
    []
  );

  return { state, actions };
}
