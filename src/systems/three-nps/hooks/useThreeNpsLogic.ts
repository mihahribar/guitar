import { useCallback, useMemo } from 'react';
import { getNoteAtFret } from '@/shared/utils/musicTheory';
import { MAJOR_SCALE_STEPS } from '../constants';
import type { ThreeNpsState } from '../types';
import {
  buildPositionMap,
  buildSequence,
  createModeStyle,
  npsPositionKey,
  patternFretRange,
  resolveCurrentPattern,
} from '../utils/threeNps';
import { getScope } from './useThreeNpsState';

/**
 * Derived 3NPS data and fretboard callbacks for the current state.
 */
export function useThreeNpsLogic(state: ThreeNpsState) {
  const { root, lowString, degree, anchorFret, showAllModes, allStrings } = state;

  const sequence = useMemo(
    () => buildSequence(root, getScope({ allStrings, lowString })),
    [root, allStrings, lowString]
  );

  const currentPattern = useMemo(
    () => resolveCurrentPattern(sequence, degree, anchorFret),
    [sequence, degree, anchorFret]
  );

  const positionMap = useMemo(() => {
    const visible = showAllModes ? sequence : currentPattern ? [currentPattern] : [];
    return buildPositionMap(visible);
  }, [showAllModes, sequence, currentPattern]);

  const shouldShowDot = useCallback(
    (stringIndex: number, fret: number) => positionMap.has(npsPositionKey(stringIndex, fret)),
    [positionMap]
  );

  const getDotStyle = useCallback(
    (stringIndex: number, fret: number) =>
      createModeStyle(positionMap.get(npsPositionKey(stringIndex, fret)) ?? []),
    [positionMap]
  );

  // Single mode: mark the mode's tonic (M). All modes: no single tonic, mark the key root (R).
  const markedPitchClass = useMemo(() => {
    if (showAllModes || !currentPattern) return root;
    return (root + MAJOR_SCALE_STEPS[currentPattern.degree]) % 12;
  }, [showAllModes, currentPattern, root]);

  const isKeyNote = useCallback(
    (stringIndex: number, fret: number) =>
      shouldShowDot(stringIndex, fret) && getNoteAtFret(stringIndex, fret) === markedPitchClass,
    [shouldShowDot, markedPitchClass]
  );

  const keyNoteIndicator = showAllModes ? 'R' : 'M';

  const fretRange = useMemo(
    () => (currentPattern ? patternFretRange(currentPattern) : undefined),
    [currentPattern]
  );

  const scrollToFret = useMemo(() => {
    if (showAllModes || !fretRange) return undefined;
    return (fretRange[0] + fretRange[1]) / 2;
  }, [showAllModes, fretRange]);

  return {
    sequence,
    currentPattern,
    fretRange,
    shouldShowDot,
    getDotStyle,
    isKeyNote,
    keyNoteIndicator,
    scrollToFret,
  };
}
