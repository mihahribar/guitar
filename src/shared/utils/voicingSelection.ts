/**
 * Selection reducer shared by the voicing visualizers (Triads, 7ths)
 *
 * Any number of inversions and string sets can be shown at once. The selection
 * is stored as inversions plus an anchor fret, so changing string sets or
 * quality keeps the same voicings near the same spot on the neck.
 */

import type {
  Voicing,
  VoicingSelection,
  VoicingSelectionAction,
  VoicingSelectionConfig,
} from '../types/voicing';
import { rotateInversion, sortInversions, visibleVoicings } from './voicings';

/** Selected string sets as a duplicate-free list, in the config's order (lowest set first) */
function sortStringSets<S>(stringSets: readonly S[], order: readonly S[]): S[] {
  return [...new Set(stringSets)].sort((a, b) => order.indexOf(a) - order.indexOf(b));
}

/**
 * The selected voicing on the lowest selected string set sitting closest to
 * the anchor. It leads the group: arrows walk it along its set's sequence, set
 * changes re-anchor to it and collapsing the inversions keeps it.
 */
function leadVoicing<Q extends string, I extends number, S>(
  config: VoicingSelectionConfig<Q, I, S>,
  state: VoicingSelection<Q, I, S>,
  anchorFret = state.anchorFret
) {
  const sequence = config.buildSequence(state.root, state.quality, state.stringSets[0]);
  let lead: Voicing<I> | undefined;
  for (const voicing of visibleVoicings(sequence, state.inversions, anchorFret, false)) {
    if (!lead || Math.abs(voicing.position - anchorFret) < Math.abs(lead.position - anchorFret)) {
      lead = voicing;
    }
  }
  return { sequence, lead };
}

/** A selection anchored at its lead voicing's lowest spot on the neck */
export function createVoicingSelection<Q extends string, I extends number, S>(
  config: VoicingSelectionConfig<Q, I, S>,
  base: NoInfer<Omit<VoicingSelection<Q, I, S>, 'anchorFret'>>
): VoicingSelection<Q, I, S> {
  const state = { ...base, anchorFret: 0 };
  return { ...state, anchorFret: leadVoicing(config, state, 0).lead?.position ?? 0 };
}

/**
 * Walk the whole selection one voicing up or down the neck: the lead voicing
 * moves to its neighbour on its string set and every other selected inversion
 * shifts by the same amount, so the group keeps its shape. Other string sets
 * follow the anchor to their nearest voicings.
 */
function step<Q extends string, I extends number, S>(
  config: VoicingSelectionConfig<Q, I, S>,
  state: VoicingSelection<Q, I, S>,
  delta: 1 | -1
): VoicingSelection<Q, I, S> {
  const { sequence, lead } = leadVoicing(config, state);
  if (!lead) return state;
  const count = config.inversions.length;
  const index = sequence.indexOf(lead);
  const target = sequence[(index + delta + sequence.length) % sequence.length];
  const shift = rotateInversion(target.inversion, -lead.inversion, count);
  return {
    ...state,
    inversions: sortInversions(
      state.inversions.map((inversion) => rotateInversion(inversion, shift, count))
    ),
    anchorFret: target.position,
  };
}

/** Re-anchor to the lead voicing's new home after the string sets changed */
function reanchor<Q extends string, I extends number, S>(
  config: VoicingSelectionConfig<Q, I, S>,
  state: VoicingSelection<Q, I, S>
): VoicingSelection<Q, I, S> {
  const { lead } = leadVoicing(config, state);
  return lead ? { ...state, anchorFret: lead.position } : state;
}

/** Move every selected string set `delta` sets along, unless one would fall off the end */
function shiftSets<Q extends string, I extends number, S>(
  config: VoicingSelectionConfig<Q, I, S>,
  state: VoicingSelection<Q, I, S>,
  delta: 1 | -1
): VoicingSelection<Q, I, S> {
  const shifted = state.stringSets.map((set) => config.stringSets.indexOf(set) + delta);
  const fits = shifted.every((index) => index >= 0 && index < config.stringSets.length);
  return fits
    ? reanchor(config, { ...state, stringSets: shifted.map((index) => config.stringSets[index]) })
    : state;
}

export function voicingSelectionReducer<Q extends string, I extends number, S>(
  config: VoicingSelectionConfig<Q, I, S>,
  state: VoicingSelection<Q, I, S>,
  action: VoicingSelectionAction<Q, I, S>
): VoicingSelection<Q, I, S> {
  switch (action.type) {
    case 'SET_ROOT': {
      // Keep the selection, re-anchoring to its lowest spot in the new key
      const next = { ...state, root: action.payload };
      return { ...next, anchorFret: leadVoicing(config, next, 0).lead?.position ?? 0 };
    }
    case 'SET_QUALITY':
      // Same inversions near the same fret; only some chord tones move
      return { ...state, quality: action.payload };
    case 'NEXT':
      return step(config, state, 1);
    case 'PREVIOUS':
      return step(config, state, -1);
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
      if (state.inversions.length < config.inversions.length) {
        return { ...state, inversions: [...config.inversions] };
      }
      // Collapse back to the inversion leading the group
      const { lead } = leadVoicing(config, state);
      return lead ? { ...state, inversions: [lead.inversion] } : state;
    }
    case 'TOGGLE_STRING_SET': {
      const stringSets = state.stringSets.includes(action.payload)
        ? state.stringSets.filter((set) => set !== action.payload)
        : sortStringSets([...state.stringSets, action.payload], config.stringSets);
      // Always leave at least one string set on the fretboard
      return stringSets.length > 0 ? reanchor(config, { ...state, stringSets }) : state;
    }
    case 'SOLO_STRING_SET':
      return reanchor(config, { ...state, stringSets: [action.payload] });
    case 'SETS_UP':
      return shiftSets(config, state, 1);
    case 'SETS_DOWN':
      return shiftSets(config, state, -1);
    case 'TOGGLE_WHOLE_NECK':
      return { ...state, wholeNeck: !state.wholeNeck };
    case 'TOGGLE_SHOW_ALL_NOTES':
      return { ...state, showAllNotes: !state.showAllNotes };
    default:
      return state;
  }
}
