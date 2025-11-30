import { useMemo } from 'react';
import type { ChordType } from '../types';
import { FULL_CAGED_SEQUENCE, NATURAL_STARTING_SHAPES } from '../constants';

export function useCAGEDSequence(selectedChord: ChordType) {
  return useMemo(() => {
    const startShape = NATURAL_STARTING_SHAPES[selectedChord];
    const startIndex = FULL_CAGED_SEQUENCE.indexOf(startShape);

    // Rotate the sequence to start with the natural shape
    return [...FULL_CAGED_SEQUENCE.slice(startIndex), ...FULL_CAGED_SEQUENCE.slice(0, startIndex)];
  }, [selectedChord]);
}
