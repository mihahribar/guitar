import { useMemo, useReducer } from 'react';
import { FRETBOARD_CONSTANTS } from '@/shared/constants/magicNumbers';
import { useUrlSync } from '@/shared/hooks/useUrlSync';
import type { StringIndex } from '@/shared/types/core';
import {
  encodeRoot,
  parseEnum,
  parseFlag,
  parseInteger,
  parseList,
  parseRoot,
  withoutDefaults,
} from '@/shared/utils/urlParams';
import { MODES, STRING_PAIRS } from '../constants';
import type { ModeDegree, NpsPattern, NpsScope, ThreeNpsState } from '../types';
import {
  ALL_DEGREES,
  anchoredPatterns,
  buildSequence,
  rotateDegree,
  sortDegrees,
} from '../utils/threeNps';

type ThreeNpsAction =
  | { type: 'SET_ROOT'; payload: number }
  | { type: 'NEXT' }
  | { type: 'PREVIOUS' }
  | { type: 'TOGGLE_MODE'; payload: ModeDegree }
  | { type: 'SOLO_MODE'; payload: ModeDegree }
  | { type: 'TOGGLE_ALL_MODES' }
  | { type: 'SET_STRING_PAIR'; payload: StringIndex }
  | { type: 'PAIR_UP' }
  | { type: 'PAIR_DOWN' }
  | { type: 'TOGGLE_WHOLE_NECK' }
  | { type: 'TOGGLE_ALL_STRINGS' }
  | { type: 'TOGGLE_SHOW_ALL_NOTES' };

/** Lowest pair uses the low E (5); highest pair uses the B string (1) */
const LOWEST_PAIR_STRING = 5;
const HIGHEST_PAIR_STRING = 1;

export function getScope(state: Pick<ThreeNpsState, 'allStrings' | 'lowString'>): NpsScope {
  return state.allStrings ? { kind: 'all' } : { kind: 'pair', lowString: state.lowString };
}

/**
 * The selected pattern sitting closest to the anchor. It leads the group:
 * arrows walk it along the sequence, scope changes re-anchor to it and
 * collapsing a multi-mode selection keeps it.
 */
function leadPattern(state: ThreeNpsState, anchorFret = state.anchorFret) {
  const sequence = buildSequence(state.root, getScope(state));
  let lead: NpsPattern | undefined;
  for (const pattern of anchoredPatterns(sequence, state.degrees, anchorFret)) {
    if (!lead || Math.abs(pattern.startFret - anchorFret) < Math.abs(lead.startFret - anchorFret)) {
      lead = pattern;
    }
  }
  return { sequence, lead };
}

/** Anchored at the lead pattern nearest `fret` */
function anchorNear(state: ThreeNpsState, fret: number): ThreeNpsState {
  return { ...state, anchorFret: leadPattern(state, fret).lead?.startFret ?? 0 };
}

export function createInitialThreeNpsState(root = 0): ThreeNpsState {
  // Ionian at its lowest position on the neck
  return anchorNear(
    {
      root,
      lowString: 5 as StringIndex,
      degrees: [0],
      anchorFret: 0,
      wholeNeck: false,
      allStrings: false,
      showAllNotes: false,
    },
    0
  );
}

/** Mode names in a link: modes=ionian,lydian */
const MODE_NAMES = MODES.map((mode) => mode.name.toLowerCase());

/** String pairs in a link go by the low string as guitarists number them: pair=6 is 6-5 */
const PAIR_NUMBERS = STRING_PAIRS.map((pair) => pair.low + 1);

function encodeAll(state: ThreeNpsState): URLSearchParams {
  return new URLSearchParams({
    key: encodeRoot(state.root),
    modes: state.degrees.map((degree) => MODE_NAMES[degree]).join(','),
    pair: String(state.lowString + 1),
    strings: state.allStrings ? 'all' : 'pair',
    at: String(state.anchorFret),
    neck: state.wholeNeck ? '1' : '0',
    notes: state.showAllNotes ? '1' : '0',
  });
}

/** Settings for a link to this page, leaving out the defaults for the key */
export function encodeThreeNps(state: ThreeNpsState): URLSearchParams {
  const defaults = encodeAll(createInitialThreeNpsState(state.root));
  defaults.set('key', encodeRoot(createInitialThreeNpsState().root));
  return withoutDefaults(encodeAll(state), defaults);
}

/** State from a link; anything missing or unrecognised keeps its default */
export function decodeThreeNps(params: URLSearchParams): ThreeNpsState {
  const root = parseRoot(params.get('key')) ?? createInitialThreeNpsState().root;
  const defaults = createInitialThreeNpsState(root);
  const degrees = parseList(params.get('modes'), (item) => {
    const degree = MODE_NAMES.indexOf(item.toLowerCase());
    return degree === -1 ? undefined : (degree as ModeDegree);
  });
  const pair = parseEnum(params.get('pair'), PAIR_NUMBERS);
  const strings = parseEnum(params.get('strings'), ['all', 'pair'] as const);
  return anchorNear(
    {
      root,
      lowString: pair === undefined ? defaults.lowString : ((pair - 1) as StringIndex),
      degrees: degrees ? sortDegrees(degrees) : defaults.degrees,
      anchorFret: 0,
      wholeNeck: parseFlag(params.get('neck')) ?? defaults.wholeNeck,
      allStrings: strings === undefined ? defaults.allStrings : strings === 'all',
      showAllNotes: parseFlag(params.get('notes')) ?? defaults.showAllNotes,
    },
    // Never trusted as given: snaps to the nearest real pattern
    parseInteger(params.get('at'), 0, FRETBOARD_CONSTANTS.MAX_FRET) ?? defaults.anchorFret
  );
}

/**
 * Walk the whole selection one pattern up or down the neck: the lead pattern
 * moves to its neighbour in the sequence and every other selected mode shifts
 * by the same number of scale degrees, so the group keeps its shape.
 */
function step(state: ThreeNpsState, delta: 1 | -1): ThreeNpsState {
  const { sequence, lead } = leadPattern(state);
  if (!lead) return state;
  const index = sequence.indexOf(lead);
  const target = sequence[(index + delta + sequence.length) % sequence.length];
  const shift = rotateDegree(target.degree, -lead.degree);
  return {
    ...state,
    degrees: sortDegrees(state.degrees.map((degree) => rotateDegree(degree, shift))),
    anchorFret: target.startFret,
  };
}

/** Re-anchor to the lead pattern's new home after the scope changed */
function reanchor(state: ThreeNpsState): ThreeNpsState {
  const { lead } = leadPattern(state);
  return lead ? { ...state, anchorFret: lead.startFret } : state;
}

export function threeNpsReducer(state: ThreeNpsState, action: ThreeNpsAction): ThreeNpsState {
  switch (action.type) {
    case 'SET_ROOT': {
      // Keep the selected modes, re-anchoring to their lowest position in the new key
      const next = { ...state, root: action.payload };
      return { ...next, anchorFret: leadPattern(next, 0).lead?.startFret ?? 0 };
    }
    case 'NEXT':
      return step(state, 1);
    case 'PREVIOUS':
      return step(state, -1);
    case 'TOGGLE_MODE': {
      const degrees = state.degrees.includes(action.payload)
        ? state.degrees.filter((degree) => degree !== action.payload)
        : sortDegrees([...state.degrees, action.payload]);
      // Always leave at least one mode on the fretboard
      return degrees.length > 0 ? { ...state, degrees } : state;
    }
    case 'SOLO_MODE':
      return reanchor({ ...state, degrees: [action.payload] });
    case 'TOGGLE_ALL_MODES': {
      if (state.degrees.length < ALL_DEGREES.length) {
        return { ...state, degrees: [...ALL_DEGREES] };
      }
      // Collapse back to the mode leading the group
      const { lead } = leadPattern(state);
      return lead ? { ...state, degrees: [lead.degree] } : state;
    }
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
    case 'TOGGLE_WHOLE_NECK':
      return { ...state, wholeNeck: !state.wholeNeck };
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
 * Any number of modes can be shown at once. The selection is stored as mode
 * degrees plus an anchor fret rather than sequence indices, so switching string
 * pairs or scope keeps the same modes near the same spot on the neck.
 */
export function useThreeNpsState() {
  const [state, dispatch] = useReducer(threeNpsReducer, window.location.search, (search) =>
    decodeThreeNps(new URLSearchParams(search))
  );
  useUrlSync(useMemo(() => encodeThreeNps(state), [state]));

  const actions = useMemo(
    () => ({
      setRoot: (root: number) => dispatch({ type: 'SET_ROOT', payload: root }),
      next: () => dispatch({ type: 'NEXT' }),
      previous: () => dispatch({ type: 'PREVIOUS' }),
      toggleMode: (degree: ModeDegree) => dispatch({ type: 'TOGGLE_MODE', payload: degree }),
      soloMode: (degree: ModeDegree) => dispatch({ type: 'SOLO_MODE', payload: degree }),
      toggleAllModes: () => dispatch({ type: 'TOGGLE_ALL_MODES' }),
      setStringPair: (lowString: StringIndex) =>
        dispatch({ type: 'SET_STRING_PAIR', payload: lowString }),
      pairUp: () => dispatch({ type: 'PAIR_UP' }),
      pairDown: () => dispatch({ type: 'PAIR_DOWN' }),
      toggleWholeNeck: () => dispatch({ type: 'TOGGLE_WHOLE_NECK' }),
      toggleAllStrings: () => dispatch({ type: 'TOGGLE_ALL_STRINGS' }),
      toggleShowAllNotes: () => dispatch({ type: 'TOGGLE_SHOW_ALL_NOTES' }),
    }),
    []
  );

  return { state, actions };
}
