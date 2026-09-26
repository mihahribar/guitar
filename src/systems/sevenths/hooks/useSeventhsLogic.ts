import { useCallback, useMemo } from 'react';
import { getNoteAtFret } from '@/shared/utils/musicTheory';
import {
  buildVoicingPositionMap,
  visibleVoicings,
  voicingPositionKey,
  voicingsFretRange,
} from '@/shared/utils/voicings';
import type { SeventhsState } from '../types';
import { buildSequence, createInversionStyle, toneLabel } from '../utils/sevenths';

/**
 * Derived seventh chord data and fretboard callbacks for the current state.
 */
export function useSeventhsLogic(state: SeventhsState) {
  const { root, quality, stringSets, inversions, anchorFret, wholeNeck } = state;

  const sequences = useMemo(
    () => stringSets.map((id) => buildSequence(root, quality, id)),
    [root, quality, stringSets]
  );

  const chords = useMemo(
    () =>
      sequences.flatMap((sequence) => visibleVoicings(sequence, inversions, anchorFret, wholeNeck)),
    [sequences, inversions, anchorFret, wholeNeck]
  );

  const positionMap = useMemo(() => buildVoicingPositionMap(chords), [chords]);

  const shouldShowDot = useCallback(
    (stringIndex: number, fret: number) => positionMap.has(voicingPositionKey(stringIndex, fret)),
    [positionMap]
  );

  const getDotStyle = useCallback(
    (stringIndex: number, fret: number) =>
      createInversionStyle(positionMap.get(voicingPositionKey(stringIndex, fret)) ?? []),
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

  const fretRange = useMemo(() => voicingsFretRange(chords), [chords]);

  const scrollToFret = useMemo(() => {
    if (wholeNeck || !fretRange) return undefined;
    return (fretRange[0] + fretRange[1]) / 2;
  }, [wholeNeck, fretRange]);

  return {
    chords,
    fretRange,
    shouldShowDot,
    getDotStyle,
    getDotLabel,
    isKeyNote,
    scrollToFret,
  };
}
