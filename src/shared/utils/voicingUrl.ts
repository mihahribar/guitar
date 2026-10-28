/**
 * Voicing selections (Triads, 7ths) in the URL query string
 *
 * `key=G&q=minor&inv=0,2&sets=DGB,GBE&at=7&neck=1&notes=1`; settings that
 * match the defaults for that key are left out.
 */

import { FRETBOARD_CONSTANTS } from '../constants/fretboard';
import type { VoicingSelection, VoicingUrlConfig } from '../types/voicing';
import {
  encodeRoot,
  parseEnum,
  parseFlag,
  parseInteger,
  parseList,
  parseRoot,
  withoutDefaults,
} from './urlParams';
import { createVoicingSelection, sortStringSets } from './voicingSelection';
import { sortInversions } from './voicings';

function encodeAll<Q extends string, I extends number, S>(
  config: VoicingUrlConfig<Q, I, S>,
  state: VoicingSelection<Q, I, S>
): URLSearchParams {
  const setName = (set: S) => config.stringSetNames.find(([id]) => id === set)?.[1] ?? '';
  return new URLSearchParams({
    key: encodeRoot(state.root),
    q: state.quality,
    inv: state.inversions.join(','),
    sets: state.stringSets.map(setName).join(','),
    at: String(state.anchorFret),
    neck: state.wholeNeck ? '1' : '0',
    notes: state.showAllNotes ? '1' : '0',
  });
}

export function encodeVoicingSelection<Q extends string, I extends number, S>(
  config: VoicingUrlConfig<Q, I, S>,
  state: VoicingSelection<Q, I, S>
): URLSearchParams {
  // Compare against the defaults for the same key, so a changed key on its own
  // doesn't drag its starting position along as `at`
  const defaults = encodeAll(config, config.initial(state.root));
  defaults.set('key', encodeRoot(config.initial(0).root));
  return withoutDefaults(encodeAll(config, state), defaults);
}

/** Settings from a link; anything missing or unrecognised keeps its default */
export function decodeVoicingSelection<Q extends string, I extends number, S>(
  config: VoicingUrlConfig<Q, I, S>,
  params: URLSearchParams
): VoicingSelection<Q, I, S> {
  const root = parseRoot(params.get('key')) ?? config.initial(0).root;
  const defaults = config.initial(root);
  const inversions = parseList(params.get('inv'), (item) =>
    parseEnum(item, config.selection.inversions)
  );
  const stringSets = parseList(
    params.get('sets'),
    (item) =>
      config.stringSetNames.find(([, name]) => name.toLowerCase() === item.toLowerCase())?.[0]
  );
  return createVoicingSelection(
    config.selection,
    {
      root,
      quality: parseEnum(params.get('q'), config.qualities) ?? defaults.quality,
      inversions: inversions ? sortInversions(inversions) : defaults.inversions,
      stringSets: stringSets
        ? sortStringSets(stringSets, config.selection.stringSets)
        : defaults.stringSets,
      wholeNeck: parseFlag(params.get('neck')) ?? defaults.wholeNeck,
      showAllNotes: parseFlag(params.get('notes')) ?? defaults.showAllNotes,
    },
    // Never trusted as given: snaps to the nearest real voicing
    parseInteger(params.get('at'), 0, FRETBOARD_CONSTANTS.MAX_FRET) ?? defaults.anchorFret
  );
}
