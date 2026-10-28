import type { VoicingSelection, VoicingSystem, VoicingUrlConfig } from '@/shared/types/voicing';
import { CHROMATIC_TO_NOTE_NAME, STRING_NAMES } from '@/shared/utils/musicTheory';
import { createVoicingSelection } from '@/shared/utils/voicingSelection';
import {
  INVERSIONS,
  QUALITY_ORDER,
  SEVENTH_QUALITIES,
  SEVENTHS_HELP,
  STRING_SETS,
  STRING_SET_ORDER,
} from './constants';
import type { Inversion, SeventhQuality, StringSetId } from './types';
import { ALL_INVERSIONS, buildSequence, mutedStrings } from './utils/sevenths';

/** The muted strings of a set by name, e.g. ["A"] */
const mutedNames = (id: StringSetId) => mutedStrings(STRING_SETS[id]).map((s) => STRING_NAMES[s]);

// In a link, string sets go by their ids: sets=adgb,dgbe
const SEVENTHS_URL: VoicingUrlConfig<SeventhQuality, Inversion, StringSetId> = {
  selection: {
    inversions: ALL_INVERSIONS,
    stringSets: STRING_SET_ORDER,
    buildSequence,
  },
  qualities: QUALITY_ORDER,
  stringSetNames: STRING_SET_ORDER.map((id) => [id, id] as const),
  initial: (root): VoicingSelection<SeventhQuality, Inversion, StringSetId> =>
    // Root position at its lowest spot on the A-D-G-B strings
    createVoicingSelection(SEVENTHS_URL.selection, {
      root,
      quality: 'maj7',
      stringSets: ['adgb'],
      inversions: [0],
      wholeNeck: false,
      showAllNotes: false,
    }),
};

/** Drop 2 and drop 3 seventh chords on four-string sets */
export const SEVENTHS: VoicingSystem<SeventhQuality, Inversion, StringSetId> = {
  url: SEVENTHS_URL,
  qualities: SEVENTH_QUALITIES,
  inversions: INVERSIONS,
  stringSets: STRING_SET_ORDER.map((id) => {
    const set = STRING_SETS[id];
    const voicing = set.voicing.toLowerCase();
    const names = set.strings.map((s) => STRING_NAMES[s]).join(' ');
    const muted = mutedNames(id).map((name) => `${name} string muted, `);
    return {
      id,
      label: set.label,
      title: `Strings ${set.label}, ${voicing}`,
      // e.g. "Strings E D G B, A string muted, drop 3"
      ariaLabel: `Strings ${names}, ${muted.join('')}${voicing}`,
      summary: `${set.label} (${voicing})`,
    };
  }),
  stringSetNotes: (selected) =>
    STRING_SET_ORDER.filter((id) => selected.includes(id) && mutedNames(id).length > 0).map(
      (id) =>
        `${STRING_SETS[id].label} skips the ${mutedNames(id).join(', ')} string: mute it with the finger fretting the low ${STRING_NAMES[STRING_SETS[id].strings[0]]}`
    ),
  chordName: (root, quality) =>
    `${CHROMATIC_TO_NOTE_NAME[root]}${SEVENTH_QUALITIES[quality].short}`,
  nouns: { chord: 'chord', shape: 'voicing', qualityGroup: 'Seventh chord quality selector' },
  help: SEVENTHS_HELP,
};
