import type { StringIndex } from '@/shared/types/core';
import type { VoicingSelection, VoicingSystem, VoicingUrlConfig } from '@/shared/types/voicing';
import { CHROMATIC_TO_NOTE_NAME } from '@/shared/utils/musicTheory';
import { createVoicingSelection } from '@/shared/utils/voicingSelection';
import { INVERSIONS, QUALITY_ORDER, STRING_SETS, TRIAD_QUALITIES, TRIADS_HELP } from './constants';
import type { Inversion, TriadQuality } from './types';
import { ALL_INVERSIONS, buildSequence } from './utils/triads';

/** The G-B pair is tuned a major third apart; sets starting on D or G cross it */
const CROSSES_G_B: readonly number[] = [3, 2];

// In a link, string sets go by their chip labels: sets=DGB,GBE
const TRIADS_URL: VoicingUrlConfig<TriadQuality, Inversion, StringIndex> = {
  selection: {
    inversions: ALL_INVERSIONS,
    stringSets: STRING_SETS.map((set) => set.low),
    buildSequence,
  },
  qualities: QUALITY_ORDER,
  stringSetNames: STRING_SETS.map((set) => [set.low, set.label] as const),
  initial: (root): VoicingSelection<TriadQuality, Inversion, StringIndex> =>
    // Root position at its lowest spot on the G-B-E strings
    createVoicingSelection(TRIADS_URL.selection, {
      root,
      quality: 'major',
      stringSets: [2],
      inversions: [0],
      wholeNeck: false,
      showAllNotes: false,
    }),
};

/** Close-voiced triads on three-string sets, identified by their low string */
export const TRIADS: VoicingSystem<TriadQuality, Inversion, StringIndex> = {
  url: TRIADS_URL,
  qualities: TRIAD_QUALITIES,
  inversions: INVERSIONS,
  stringSets: STRING_SETS.map((set) => ({
    id: set.low,
    label: set.label,
    title: `Strings ${set.label}`,
    ariaLabel: `Strings ${set.label.split('').join(' ')}`,
    summary: set.label,
  })),
  stringSetNotes: (selected) =>
    selected.some((low) => CROSSES_G_B.includes(low))
      ? ['G-B strings are a major third apart: shapes crossing them shift up one fret']
      : [],
  chordName: (root, quality) =>
    `${CHROMATIC_TO_NOTE_NAME[root]} ${TRIAD_QUALITIES[quality].name.toLowerCase()}`,
  nouns: { chord: 'triad', shape: 'triad', qualityGroup: 'Triad quality selector' },
  help: TRIADS_HELP,
};
