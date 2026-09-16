import { useCallback, useMemo } from 'react';
import { getNoteAtFret } from '@/shared/utils/musicTheory';
import { MAJOR_SCALE_STEPS } from '../constants';
import type { ThreeNpsState } from '../types';
import {
  buildPositionMap,
  buildSequence,
  createModeStyle,
  npsPositionKey,
  patternsFretRange,
  visiblePatterns,
} from '../utils/threeNps';
import { getScope } from './useThreeNpsState';

/**
 * Derived 3NPS data and fretboard callbacks for the current state.
 */
export function useThreeNpsLogic(state: ThreeNpsState) {
  const { root, lowString, degrees, anchorFret, wholeNeck, allStrings } = state;

  const sequence = useMemo(
    () => buildSequence(root, getScope({ allStrings, lowString })),
    [root, allStrings, lowString]
  );

  const patterns = useMemo(
    () => visiblePatterns(sequence, degrees, anchorFret, wholeNeck),
    [sequence, degrees, anchorFret, wholeNeck]
  );

  const positionMap = useMemo(() => buildPositionMap(patterns), [patterns]);

  const shouldShowDot = useCallback(
    (stringIndex: number, fret: number) => positionMap.has(npsPositionKey(stringIndex, fret)),
    [positionMap]
  );

  const getDotStyle = useCallback(
    (stringIndex: number, fret: number) =>
      createModeStyle(positionMap.get(npsPositionKey(stringIndex, fret)) ?? []),
    [positionMap]
  );

  /** One mode selected: mark its tonic (M). Several: no single tonic, mark the key root (R). */
  const soloDegree = degrees.length === 1 ? degrees[0] : undefined;

  const markedPitchClass =
    soloDegree === undefined ? root : (root + MAJOR_SCALE_STEPS[soloDegree]) % 12;

  const isKeyNote = useCallback(
    (stringIndex: number, fret: number) =>
      shouldShowDot(stringIndex, fret) && getNoteAtFret(stringIndex, fret) === markedPitchClass,
    [shouldShowDot, markedPitchClass]
  );

  const keyNoteIndicator = soloDegree === undefined ? 'R' : 'M';

  const fretRange = useMemo(() => patternsFretRange(patterns), [patterns]);

  const scrollToFret = useMemo(() => {
    if (wholeNeck || !fretRange) return undefined;
    return (fretRange[0] + fretRange[1]) / 2;
  }, [wholeNeck, fretRange]);

  return {
    sequence,
    patterns,
    soloDegree,
    fretRange,
    shouldShowDot,
    getDotStyle,
    isKeyNote,
    keyNoteIndicator,
    scrollToFret,
  };
}
