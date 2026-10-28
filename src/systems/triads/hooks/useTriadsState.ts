import { useMemo, useReducer } from 'react';
import { useUrlSync } from '@/shared/hooks/useUrlSync';
import type { StringIndex } from '@/shared/types/core';
import type { VoicingSelectionAction, VoicingSelectionConfig } from '@/shared/types/voicing';
import { createVoicingSelection, voicingSelectionReducer } from '@/shared/utils/voicingSelection';
import {
  decodeVoicingSelection,
  encodeVoicingSelection,
  type VoicingUrlConfig,
} from '@/shared/utils/voicingUrl';
import { QUALITY_ORDER, STRING_SETS } from '../constants';
import type { Inversion, TriadQuality, TriadsState } from '../types';
import { ALL_INVERSIONS, buildSequence } from '../utils/triads';

export type TriadsAction = VoicingSelectionAction<TriadQuality, Inversion, StringIndex>;

const TRIADS_SELECTION: VoicingSelectionConfig<TriadQuality, Inversion, StringIndex> = {
  inversions: ALL_INVERSIONS,
  stringSets: STRING_SETS.map((set) => set.low),
  buildSequence,
};

export function createInitialTriadsState(root = 0): TriadsState {
  // Root position at its lowest spot on the G-B-E strings
  return createVoicingSelection(TRIADS_SELECTION, {
    root,
    quality: 'major',
    stringSets: [2],
    inversions: [0],
    wholeNeck: false,
    showAllNotes: false,
  });
}

// In a link, string sets go by their chip labels: sets=DGB,GBE
const TRIADS_URL: VoicingUrlConfig<TriadQuality, Inversion, StringIndex> = {
  selection: TRIADS_SELECTION,
  qualities: QUALITY_ORDER,
  stringSetNames: STRING_SETS.map((set) => [set.low, set.label] as const),
  initial: createInitialTriadsState,
};

/** Settings for a link to this page */
export function encodeTriads(state: TriadsState): URLSearchParams {
  return encodeVoicingSelection(TRIADS_URL, state);
}

/** State from a link; anything missing or unrecognised keeps its default */
export function decodeTriads(params: URLSearchParams): TriadsState {
  return decodeVoicingSelection(TRIADS_URL, params);
}

export function triadsReducer(state: TriadsState, action: TriadsAction): TriadsState {
  return voicingSelectionReducer(TRIADS_SELECTION, state, action);
}

/**
 * State management for the triads visualizer.
 *
 * Any number of inversions and string sets can be shown at once. The selection
 * is stored as inversions plus an anchor fret, so changing string sets or
 * quality keeps the same triads near the same spot on the neck.
 */
export function useTriadsState() {
  const [state, dispatch] = useReducer(triadsReducer, window.location.search, (search) =>
    decodeTriads(new URLSearchParams(search))
  );
  useUrlSync(useMemo(() => encodeTriads(state), [state]));

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
