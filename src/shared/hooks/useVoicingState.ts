import { useMemo, useReducer } from 'react';
import type { VoicingSelection, VoicingSelectionAction, VoicingSystem } from '../types/voicing';
import { voicingSelectionReducer } from '../utils/voicingSelection';
import { decodeVoicingSelection, encodeVoicingSelection } from '../utils/voicingUrl';
import { useUrlSync } from './useUrlSync';

/**
 * State management for a voicing visualizer (Triads, 7ths).
 *
 * Any number of inversions and string sets can be shown at once. The selection
 * is stored as inversions plus an anchor fret, so changing string sets or
 * quality keeps the same voicings near the same spot on the neck.
 */
export function useVoicingState<Q extends string, I extends number, S extends string | number>(
  system: VoicingSystem<Q, I, S>
) {
  const { url } = system;
  const [state, dispatch] = useReducer(
    (state: VoicingSelection<Q, I, S>, action: VoicingSelectionAction<Q, I, S>) =>
      voicingSelectionReducer(url.selection, state, action),
    window.location.search,
    (search) => decodeVoicingSelection(url, new URLSearchParams(search))
  );
  useUrlSync(useMemo(() => encodeVoicingSelection(url, state), [url, state]));

  const actions = useMemo(
    () => ({
      setRoot: (root: number) => dispatch({ type: 'SET_ROOT', payload: root }),
      setQuality: (quality: Q) => dispatch({ type: 'SET_QUALITY', payload: quality }),
      next: () => dispatch({ type: 'NEXT' }),
      previous: () => dispatch({ type: 'PREVIOUS' }),
      toggleInversion: (inversion: I) => dispatch({ type: 'TOGGLE_INVERSION', payload: inversion }),
      soloInversion: (inversion: I) => dispatch({ type: 'SOLO_INVERSION', payload: inversion }),
      toggleAllInversions: () => dispatch({ type: 'TOGGLE_ALL_INVERSIONS' }),
      toggleStringSet: (set: S) => dispatch({ type: 'TOGGLE_STRING_SET', payload: set }),
      soloStringSet: (set: S) => dispatch({ type: 'SOLO_STRING_SET', payload: set }),
      setsUp: () => dispatch({ type: 'SETS_UP' }),
      setsDown: () => dispatch({ type: 'SETS_DOWN' }),
      toggleWholeNeck: () => dispatch({ type: 'TOGGLE_WHOLE_NECK' }),
      toggleShowAllNotes: () => dispatch({ type: 'TOGGLE_SHOW_ALL_NOTES' }),
    }),
    []
  );

  return { state, actions };
}
