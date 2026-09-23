import { useCallback, useMemo } from 'react';
import { getNoteAtFret } from '@/shared/utils/musicTheory';
import type { TriadsState } from '../types';
import {
  buildPositionMap,
  buildSequence,
  createInversionStyle,
  toneLabel,
  triadPositionKey,
  triadsFretRange,
  visibleTriads,
} from '../utils/triads';

/**
 * Derived triad data and fretboard callbacks for the current state.
 */
export function useTriadsLogic(state: TriadsState) {
  const { root, quality, stringSets, inversions, anchorFret, wholeNeck } = state;

  const sequences = useMemo(
    () => stringSets.map((low) => buildSequence(root, quality, low)),
    [root, quality, stringSets]
  );

  const triads = useMemo(
    () =>
      sequences.flatMap((sequence) => visibleTriads(sequence, inversions, anchorFret, wholeNeck)),
    [sequences, inversions, anchorFret, wholeNeck]
  );

  const positionMap = useMemo(() => buildPositionMap(triads), [triads]);

  const shouldShowDot = useCallback(
    (stringIndex: number, fret: number) => positionMap.has(triadPositionKey(stringIndex, fret)),
    [positionMap]
  );

  const getDotStyle = useCallback(
    (stringIndex: number, fret: number) =>
      createInversionStyle(positionMap.get(triadPositionKey(stringIndex, fret)) ?? []),
    [positionMap]
  );

  const getDotLabel = useCallback(
    (stringIndex: number, fret: number) =>
      shouldShowDot(stringIndex, fret)
        ? toneLabel(root, quality, getNoteAtFret(stringIndex, fret))
        : undefined,
    [shouldShowDot, root, quality]
  );

  const isKeyNote = useCallback(
    (stringIndex: number, fret: number) =>
      shouldShowDot(stringIndex, fret) && getNoteAtFret(stringIndex, fret) === root,
    [shouldShowDot, root]
  );

  const fretRange = useMemo(() => triadsFretRange(triads), [triads]);

  const scrollToFret = useMemo(() => {
    if (wholeNeck || !fretRange) return undefined;
    return (fretRange[0] + fretRange[1]) / 2;
  }, [wholeNeck, fretRange]);

  return {
    triads,
    fretRange,
    shouldShowDot,
    getDotStyle,
    getDotLabel,
    isKeyNote,
    scrollToFret,
  };
}
