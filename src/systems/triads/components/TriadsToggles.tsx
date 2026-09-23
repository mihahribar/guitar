import { memo } from 'react';
import ToggleSwitch from '@/shared/components/ToggleSwitch';
import type { StringIndex } from '@/shared/types/core';
import { CHROMATIC_TO_NOTE_NAME } from '@/shared/utils/musicTheory';
import { INVERSIONS, STRING_SETS, TRIAD_QUALITIES } from '../constants';
import type { Inversion, TriadQuality } from '../types';

interface TriadsTogglesProps {
  root: number;
  quality: TriadQuality;
  stringSets: StringIndex[];
  inversions: Inversion[];
  fretRange?: [number, number];
  wholeNeck: boolean;
  showAllNotes: boolean;
  onToggleWholeNeck: () => void;
  onToggleShowAllNotes: () => void;
}

/** The G-B pair is tuned a major third apart; sets starting on D or G cross it */
const CROSSES_G_B: readonly number[] = [3, 2];

function TriadsToggles({
  root,
  quality,
  stringSets,
  inversions,
  fretRange,
  wholeNeck,
  showAllNotes,
  onToggleWholeNeck,
  onToggleShowAllNotes,
}: TriadsTogglesProps) {
  const chordName = `${CHROMATIC_TO_NOTE_NAME[root]} ${TRIAD_QUALITIES[quality].name.toLowerCase()}`;
  const setLabels = STRING_SETS.filter((set) => stringSets.includes(set.low)).map(
    (set) => set.label
  );
  const stringsLabel = `${setLabels.length === 1 ? 'strings' : 'string sets'} ${setLabels.join(', ')}`;
  const soloInversion = inversions.length === 1 ? inversions[0] : undefined;
  const crossesGB = stringSets.some((low) => CROSSES_G_B.includes(low));

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
            Dots show the chord tone: R is the root, then the{' '}
            {TRIAD_QUALITIES[quality].toneLabels[1]} and {TRIAD_QUALITIES[quality].toneLabels[2]}
          </p>
          {crossesGB && (
            <p className="text-xs">
              G-B strings are a major third apart: shapes crossing them shift up one fret
            </p>
          )}
          <p className="text-xs">
            {wholeNeck
              ? 'Every triad of the selected inversions, all the way up the neck'
              : 'One triad per inversion and string set, ←→ walks them along the neck together'}
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
            <p className="text-xs mt-1">Split colours: notes shared by the selected triads</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(TriadsToggles);
