import { useCallback, useMemo } from 'react';
import type { VoicingSelection, VoicingSystem } from '../types/voicing';
import { getNoteAtFret } from '../utils/musicTheory';
import { createSplitColorStyle } from '../utils/splitColor';
import {
  buildVoicingPositionMap,
  chordToneLabel,
  visibleVoicings,
  voicingPositionKey,
  voicingsFretRange,
} from '../utils/voicings';

/**
 * Derived voicing data and fretboard callbacks for the current state.
 */
export function useVoicingLogic<Q extends string, I extends number, S extends string | number>(
  system: VoicingSystem<Q, I, S>,
  state: VoicingSelection<Q, I, S>
) {
  const { root, quality, stringSets, inversions, anchorFret, wholeNeck } = state;
  const { buildSequence } = system.url.selection;

  const sequences = useMemo(
    () => stringSets.map((set) => buildSequence(root, quality, set)),
    [buildSequence, root, quality, stringSets]
  );

  const voicings = useMemo(
    () =>
      sequences.flatMap((sequence) => visibleVoicings(sequence, inversions, anchorFret, wholeNeck)),
    [sequences, inversions, anchorFret, wholeNeck]
  );

  const positionMap = useMemo(() => buildVoicingPositionMap(voicings), [voicings]);

  const shouldShowDot = useCallback(
    (stringIndex: number, fret: number) => positionMap.has(voicingPositionKey(stringIndex, fret)),
    [positionMap]
  );

  const getDotStyle = useCallback(
    (stringIndex: number, fret: number) =>
      createSplitColorStyle(
        (positionMap.get(voicingPositionKey(stringIndex, fret)) ?? []).map(
          (inversion) => system.inversions[inversion].color
        )
      ),
    [positionMap, system.inversions]
  );

  const getDotLabel = useCallback(
    (stringIndex: number, fret: number) =>
      shouldShowDot(stringIndex, fret)
        ? chordToneLabel(system.qualities[quality], root, getNoteAtFret(stringIndex, fret))
        : undefined,
    [shouldShowDot, system.qualities, root, quality]
  );

  const isKeyNote = useCallback(
    (stringIndex: number, fret: number) =>
      shouldShowDot(stringIndex, fret) && getNoteAtFret(stringIndex, fret) === root,
    [shouldShowDot, root]
  );

  const fretRange = useMemo(() => voicingsFretRange(voicings), [voicings]);

  const scrollToFret = useMemo(() => {
    if (wholeNeck || !fretRange) return undefined;
    return (fretRange[0] + fretRange[1]) / 2;
  }, [wholeNeck, fretRange]);

  return {
    voicings,
    fretRange,
    shouldShowDot,
    getDotStyle,
    getDotLabel,
    isKeyNote,
    scrollToFret,
  };
}
