import { memo } from 'react';
import ToggleSwitch from '@/shared/components/ToggleSwitch';
import { CHROMATIC_TO_NOTE_NAME, STRING_NAMES } from '@/shared/utils/musicTheory';
import { INVERSIONS, SEVENTH_QUALITIES, STRING_SETS, STRING_SET_ORDER } from '../constants';
import type { Inversion, SeventhQuality, StringSetId } from '../types';
import { mutedStrings } from '../utils/sevenths';

interface SeventhsTogglesProps {
  root: number;
  quality: SeventhQuality;
  stringSets: StringSetId[];
  inversions: Inversion[];
  fretRange?: [number, number];
  wholeNeck: boolean;
  showAllNotes: boolean;
  onToggleWholeNeck: () => void;
  onToggleShowAllNotes: () => void;
}

function SeventhsToggles({
  root,
  quality,
  stringSets,
  inversions,
  fretRange,
  wholeNeck,
  showAllNotes,
  onToggleWholeNeck,
  onToggleShowAllNotes,
}: SeventhsTogglesProps) {
  const { short, toneLabels } = SEVENTH_QUALITIES[quality];
  const chordName = `${CHROMATIC_TO_NOTE_NAME[root]}${short}`;
  const selectedSets = STRING_SET_ORDER.filter((id) => stringSets.includes(id)).map(
    (id) => STRING_SETS[id]
  );
  const setLabels = selectedSets.map((set) => `${set.label} (${set.voicing.toLowerCase()})`);
  const stringsLabel = `${setLabels.length === 1 ? 'strings' : 'string sets'} ${setLabels.join(', ')}`;
  const soloInversion = inversions.length === 1 ? inversions[0] : undefined;
  const skippingSets = selectedSets.filter((set) => mutedStrings(set).length > 0);

  return (
    <div className="mt-6">
      <section className="mb-4" aria-label="View mode controls">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <ToggleSwitch
            label="Whole Neck"
            checked={wholeNeck}
            onToggle={onToggleWholeNeck}
            color="indigo"
            ariaLabel={
              wholeNeck
                ? 'Show the selected inversions once, near the current position'
                : 'Show the selected inversions everywhere on the neck'
            }
          />
          <ToggleSwitch
            label="All Notes"
            checked={showAllNotes}
            onToggle={onToggleShowAllNotes}
            color="blue"
            ariaLabel={
              showAllNotes ? 'Hide note names on fretboard' : 'Show note names on fretboard'
            }
          />
        </div>
      </section>

      <div className="text-center text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        <div className="space-y-1">
          <p className="font-medium">
            {soloInversion !== undefined ? (
              <span>
                <span
                  className="inline-block w-3 h-3 rounded-full mr-1.5 align-middle"
                  style={{ backgroundColor: INVERSIONS[soloInversion].color }}
                  aria-hidden="true"
                />
                {chordName}, {INVERSIONS[soloInversion].name.toLowerCase()} on {stringsLabel}
              </span>
            ) : (
              <span className="text-indigo-600 dark:text-indigo-400">
                {inversions.length === INVERSIONS.length
                  ? 'All inversions'
                  : `${inversions.length} inversions`}{' '}
                of {chordName} on {stringsLabel}
              </span>
            )}
            {!wholeNeck && fretRange && `, frets ${fretRange[0]}-${fretRange[1]}`}
          </p>
          <p>
            Dots show the chord tone: R is the root, then the {toneLabels[1]}, {toneLabels[2]} and{' '}
            {toneLabels[3]}
          </p>
          {skippingSets.map((set) => (
            <p key={set.id} className="text-xs">
              {set.label} skips the{' '}
              {mutedStrings(set)
                .map((s) => STRING_NAMES[s])
                .join(', ')}{' '}
              string: mute it with the finger fretting the low {STRING_NAMES[set.strings[0]]}
            </p>
          ))}
          <p className="text-xs">
            {wholeNeck
              ? 'Every voicing of the selected inversions, all the way up the neck'
              : 'One voicing per inversion and string set, ←→ walks them along the neck together'}
          </p>
          <p className="text-xs">Press 0 for all inversions • Space for whole neck • N for notes</p>
        </div>

        {inversions.length > 1 && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
            <ul
              className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs"
              aria-label="Selected inversion colours"
            >
              {inversions.map((inversion) => (
                <li key={inversion} className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: INVERSIONS[inversion].color }}
                  />
                  {INVERSIONS[inversion].name}
                </li>
              ))}
            </ul>
            <p className="text-xs mt-1">Split colours: notes shared by the selected voicings</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(SeventhsToggles);
