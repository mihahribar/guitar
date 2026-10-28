import { useMemo, useReducer } from 'react';
import { useUrlSync } from '@/shared/hooks/useUrlSync';
import type { VoicingSelectionAction, VoicingSelectionConfig } from '@/shared/types/voicing';
import { createVoicingSelection, voicingSelectionReducer } from '@/shared/utils/voicingSelection';
import {
  decodeVoicingSelection,
  encodeVoicingSelection,
  type VoicingUrlConfig,
} from '@/shared/utils/voicingUrl';
import { QUALITY_ORDER, STRING_SET_ORDER } from '../constants';
import type { Inversion, SeventhQuality, SeventhsState, StringSetId } from '../types';
import { ALL_INVERSIONS, buildSequence } from '../utils/sevenths';

export type SeventhsAction = VoicingSelectionAction<SeventhQuality, Inversion, StringSetId>;

const SEVENTHS_SELECTION: VoicingSelectionConfig<SeventhQuality, Inversion, StringSetId> = {
  inversions: ALL_INVERSIONS,
  stringSets: STRING_SET_ORDER,
  buildSequence,
};

export function createInitialSeventhsState(root = 0): SeventhsState {
  // Root position at its lowest spot on the A-D-G-B strings
  return createVoicingSelection(SEVENTHS_SELECTION, {
    root,
    quality: 'maj7',
    stringSets: ['adgb'],
    inversions: [0],
    wholeNeck: false,
    showAllNotes: false,
  });
}

// In a link, string sets go by their ids: sets=adgb,dgbe
const SEVENTHS_URL: VoicingUrlConfig<SeventhQuality, Inversion, StringSetId> = {
  selection: SEVENTHS_SELECTION,
  qualities: QUALITY_ORDER,
  stringSetNames: STRING_SET_ORDER.map((id) => [id, id] as const),
  initial: createInitialSeventhsState,
};

/** Settings for a link to this page */
export function encodeSevenths(state: SeventhsState): URLSearchParams {
  return encodeVoicingSelection(SEVENTHS_URL, state);
}

/** State from a link; anything missing or unrecognised keeps its default */
export function decodeSevenths(params: URLSearchParams): SeventhsState {
  return decodeVoicingSelection(SEVENTHS_URL, params);
}

export function seventhsReducer(state: SeventhsState, action: SeventhsAction): SeventhsState {
  return voicingSelectionReducer(SEVENTHS_SELECTION, state, action);
}

/**
 * State management for the seventh chords visualizer.
 *
 * Any number of inversions and string sets can be shown at once. The selection
 * is stored as inversions plus an anchor fret, so changing string sets or
 * quality keeps the same voicings near the same spot on the neck.
 */
export function useSeventhsState() {
  const [state, dispatch] = useReducer(seventhsReducer, window.location.search, (search) =>
    decodeSevenths(new URLSearchParams(search))
  );
  useUrlSync(useMemo(() => encodeSevenths(state), [state]));

  const actions = useMemo(
    () => ({
      setRoot: (root: number) => dispatch({ type: 'SET_ROOT', payload: root }),
      setQuality: (quality: SeventhQuality) => dispatch({ type: 'SET_QUALITY', payload: quality }),
      next: () => dispatch({ type: 'NEXT' }),
      previous: () => dispatch({ type: 'PREVIOUS' }),
      toggleInversion: (inversion: Inversion) =>
        dispatch({ type: 'TOGGLE_INVERSION', payload: inversion }),
      soloInversion: (inversion: Inversion) =>
        dispatch({ type: 'SOLO_INVERSION', payload: inversion }),
      toggleAllInversions: () => dispatch({ type: 'TOGGLE_ALL_INVERSIONS' }),
      toggleStringSet: (id: StringSetId) => dispatch({ type: 'TOGGLE_STRING_SET', payload: id }),
      soloStringSet: (id: StringSetId) => dispatch({ type: 'SOLO_STRING_SET', payload: id }),
      setsUp: () => dispatch({ type: 'SETS_UP' }),
      setsDown: () => dispatch({ type: 'SETS_DOWN' }),
      toggleWholeNeck: () => dispatch({ type: 'TOGGLE_WHOLE_NECK' }),
      toggleShowAllNotes: () => dispatch({ type: 'TOGGLE_SHOW_ALL_NOTES' }),
    }),
    []
  );

  return { state, actions };
}
