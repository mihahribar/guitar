import { useMemo, useReducer } from 'react';
import type { StringIndex } from '@/shared/types/core';
import { HIGHEST_SET_STRING, LOWEST_SET_STRING } from '../constants';
import type { Inversion, Triad, TriadQuality, TriadsState } from '../types';
import {
  ALL_INVERSIONS,
  buildSequence,
  rotateInversion,
  sortInversions,
  visibleTriads,
} from '../utils/triads';

export type TriadsAction =
  | { type: 'SET_ROOT'; payload: number }
  | { type: 'SET_QUALITY'; payload: TriadQuality }
  | { type: 'NEXT' }
  | { type: 'PREVIOUS' }
  | { type: 'TOGGLE_INVERSION'; payload: Inversion }
  | { type: 'SOLO_INVERSION'; payload: Inversion }
  | { type: 'TOGGLE_ALL_INVERSIONS' }
  | { type: 'TOGGLE_STRING_SET'; payload: StringIndex }
  | { type: 'SOLO_STRING_SET'; payload: StringIndex }
  | { type: 'SETS_UP' }
  | { type: 'SETS_DOWN' }
  | { type: 'TOGGLE_WHOLE_NECK' }
  | { type: 'TOGGLE_SHOW_ALL_NOTES' };

/** Selected string sets as a duplicate-free list, lowest set (thickest string) first */
export function sortStringSets(stringSets: readonly StringIndex[]): StringIndex[] {
  return [...new Set(stringSets)].sort((a, b) => b - a);
}

/**
 * The selected triad on the lowest selected string set sitting closest to the
 * anchor. It leads the group: arrows walk it along its set's sequence, set
 * changes re-anchor to it and collapsing the inversions keeps it.
 */
function leadTriad(state: TriadsState, anchorFret = state.anchorFret) {
  const sequence = buildSequence(state.root, state.quality, state.stringSets[0]);
  let lead: Triad | undefined;
  for (const triad of visibleTriads(sequence, state.inversions, anchorFret, false)) {
    if (!lead || Math.abs(triad.position - anchorFret) < Math.abs(lead.position - anchorFret)) {
      lead = triad;
    }
  }
  return { sequence, lead };
}

export function createInitialTriadsState(root = 0): TriadsState {
  const base: TriadsState = {
    root,
    quality: 'major',
    stringSets: [2 as StringIndex],
    inversions: [0],
    anchorFret: 0,
    wholeNeck: false,
    showAllNotes: false,
  };
  // Root position at its lowest spot on the G-B-E strings
  return { ...base, anchorFret: leadTriad(base, 0).lead?.position ?? 0 };
}

/**
 * Walk the whole selection one triad up or down the neck: the lead triad moves
 * to its neighbour on its string set and every other selected inversion shifts
 * by the same amount, so the group keeps its shape. Other string sets follow
 * the anchor to their nearest triads.
 */
function step(state: TriadsState, delta: 1 | -1): TriadsState {
  const { sequence, lead } = leadTriad(state);
  if (!lead) return state;
  const index = sequence.indexOf(lead);
  const target = sequence[(index + delta + sequence.length) % sequence.length];
  const shift = rotateInversion(target.inversion, -lead.inversion);
  return {
    ...state,
    inversions: sortInversions(
      state.inversions.map((inversion) => rotateInversion(inversion, shift))
    ),
    anchorFret: target.position,
  };
}

/** Re-anchor to the lead triad's new home after the string sets changed */
function reanchor(state: TriadsState): TriadsState {
  const { lead } = leadTriad(state);
  return lead ? { ...state, anchorFret: lead.position } : state;
}

/** Move every selected string set `delta` sets across, unless one would fall off the neck */
function shiftSets(state: TriadsState, delta: 1 | -1): TriadsState {
  const shifted = state.stringSets.map((low) => low + delta);
  const fits = shifted.every((low) => low >= HIGHEST_SET_STRING && low <= LOWEST_SET_STRING);
  return fits
    ? reanchor({ ...state, stringSets: sortStringSets(shifted as StringIndex[]) })
    : state;
}

export function triadsReducer(state: TriadsState, action: TriadsAction): TriadsState {
  switch (action.type) {
    case 'SET_ROOT': {
      // Keep the selection, re-anchoring to its lowest spot in the new key
      const next = { ...state, root: action.payload };
      return { ...next, anchorFret: leadTriad(next, 0).lead?.position ?? 0 };
    }
    case 'SET_QUALITY':
      // Same inversions near the same fret; only the third or fifth moves
      return { ...state, quality: action.payload };
    case 'NEXT':
      return step(state, 1);
    case 'PREVIOUS':
      return step(state, -1);
    case 'TOGGLE_INVERSION': {
      const inversions = state.inversions.includes(action.payload)
        ? state.inversions.filter((inversion) => inversion !== action.payload)
        : sortInversions([...state.inversions, action.payload]);
      // Always leave at least one inversion on the fretboard
      return inversions.length > 0 ? { ...state, inversions } : state;
    }
    case 'SOLO_INVERSION':
      return { ...state, inversions: [action.payload] };
    case 'TOGGLE_ALL_INVERSIONS': {
      if (state.inversions.length < ALL_INVERSIONS.length) {
        return { ...state, inversions: [...ALL_INVERSIONS] };
      }
      // Collapse back to the inversion leading the group
      const { lead } = leadTriad(state);
      return lead ? { ...state, inversions: [lead.inversion] } : state;
    }
    case 'TOGGLE_STRING_SET': {
      const stringSets = state.stringSets.includes(action.payload)
        ? state.stringSets.filter((low) => low !== action.payload)
        : sortStringSets([...state.stringSets, action.payload]);
      // Always leave at least one string set on the fretboard
      return stringSets.length > 0 ? reanchor({ ...state, stringSets }) : state;
    }
    case 'SOLO_STRING_SET':
      return reanchor({ ...state, stringSets: [action.payload] });
    case 'SETS_UP':
      return shiftSets(state, -1);
    case 'SETS_DOWN':
      return shiftSets(state, 1);
    case 'TOGGLE_WHOLE_NECK':
      return { ...state, wholeNeck: !state.wholeNeck };
    case 'TOGGLE_SHOW_ALL_NOTES':
      return { ...state, showAllNotes: !state.showAllNotes };
    default:
      return state;
  }
}

/**
 * State management for the triads visualizer.
 *
 * Any number of inversions and string sets can be shown at once. The selection
 * is stored as inversions plus an anchor fret, so changing string sets or
 * quality keeps the same triads near the same spot on the neck.
 */
export function useTriadsState() {
  const [state, dispatch] = useReducer(triadsReducer, 0, createInitialTriadsState);

  const actions = useMemo(
    () => ({
      setRoot: (root: number) => dispatch({ type: 'SET_ROOT', payload: root }),
      setQuality: (quality: TriadQuality) => dispatch({ type: 'SET_QUALITY', payload: quality }),
      next: () => dispatch({ type: 'NEXT' }),
      previous: () => dispatch({ type: 'PREVIOUS' }),
      toggleInversion: (inversion: Inversion) =>
        dispatch({ type: 'TOGGLE_INVERSION', payload: inversion }),
      soloInversion: (inversion: Inversion) =>
        dispatch({ type: 'SOLO_INVERSION', payload: inversion }),
      toggleAllInversions: () => dispatch({ type: 'TOGGLE_ALL_INVERSIONS' }),
      toggleStringSet: (low: StringIndex) => dispatch({ type: 'TOGGLE_STRING_SET', payload: low }),
      soloStringSet: (low: StringIndex) => dispatch({ type: 'SOLO_STRING_SET', payload: low }),
      setsUp: () => dispatch({ type: 'SETS_UP' }),
      setsDown: () => dispatch({ type: 'SETS_DOWN' }),
      toggleWholeNeck: () => dispatch({ type: 'TOGGLE_WHOLE_NECK' }),
      toggleShowAllNotes: () => dispatch({ type: 'TOGGLE_SHOW_ALL_NOTES' }),
    }),
    []
  );

  return { state, actions };
}
