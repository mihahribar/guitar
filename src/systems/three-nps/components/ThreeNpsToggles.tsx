import { memo } from 'react';
import ToggleSwitch from '@/shared/components/ToggleSwitch';
import type { StringIndex } from '@/shared/types/core';
import { CHROMATIC_TO_NOTE_NAME, STRING_NAMES } from '@/shared/utils/musicTheory';
import { G_B_LOW_STRING, MAJOR_SCALE_STEPS, MODES, STRING_PAIRS } from '../constants';
import type { ModeDegree } from '../types';

interface ThreeNpsTogglesProps {
  root: number;
  lowString: StringIndex;
  degrees: ModeDegree[];
  fretRange?: [number, number];
  wholeNeck: boolean;
  allStrings: boolean;
  showAllNotes: boolean;
  onToggleWholeNeck: () => void;
  onToggleAllStrings: () => void;
  onToggleShowAllNotes: () => void;
}

function ThreeNpsToggles({
  root,
  lowString,
  degrees,
  fretRange,
  wholeNeck,
  allStrings,
  showAllNotes,
  onToggleWholeNeck,
  onToggleAllStrings,
  onToggleShowAllNotes,
}: ThreeNpsTogglesProps) {
  const rootName = CHROMATIC_TO_NOTE_NAME[root];
  const pair = STRING_PAIRS.find((p) => p.low === lowString) ?? STRING_PAIRS[0];
  const stringsLabel = allStrings
    ? 'all strings'
    : `strings ${pair.label} (${STRING_NAMES[pair.low]}–${STRING_NAMES[pair.high]})`;
  const crossesGB = allStrings || lowString === G_B_LOW_STRING;
  const modeRootName = (degree: ModeDegree) =>
    CHROMATIC_TO_NOTE_NAME[(root + MAJOR_SCALE_STEPS[degree]) % 12];

  const soloDegree = degrees.length === 1 ? degrees[0] : undefined;
  const allSelected = degrees.length === MODES.length;
  const shapeNoun = allStrings ? 'position' : 'domino';

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
                ? 'Show the selected modes once, near the current position'
                : 'Show the selected modes everywhere on the neck'
            }
          />
          <ToggleSwitch
            label="All Strings"
            checked={allStrings}
            onToggle={onToggleAllStrings}
            color="orange"
            ariaLabel={allStrings ? 'Show two strings' : 'Show all strings'}
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
            {soloDegree !== undefined ? (
              <span>
                <span
                  className="inline-block w-3 h-3 rounded-full mr-1.5 align-middle"
                  style={{ backgroundColor: MODES[soloDegree].color }}
                  aria-hidden="true"
                />
                {modeRootName(soloDegree)} {MODES[soloDegree].name} — {stringsLabel}
              </span>
            ) : (
              <span className="text-indigo-600 dark:text-indigo-400">
                {allSelected ? 'All modes' : `${degrees.length} modes`} of {rootName} major —{' '}
                {stringsLabel}
              </span>
            )}
            {!wholeNeck && fretRange && `, frets ${fretRange[0]}–${fretRange[1]}`}
          </p>
          <p>
            {allStrings
              ? 'Full 3-notes-per-string position, named after the mode it starts on the low E string'
              : 'Domino: 6 consecutive scale notes, 3 per string'}
          </p>
          {crossesGB && (
            <p className="text-xs">
              G–B strings are a major third apart: the upper string shifts up one fret
            </p>
          )}
          <p className="text-xs">
            {wholeNeck
              ? `Every ${shapeNoun} of the selected modes, all the way up the neck`
              : `One ${shapeNoun} per selected mode — ←→ walks them along the neck together`}
          </p>
          <p className="text-xs">
            {soloDegree !== undefined
              ? `M marks the ${modeRootName(soloDegree)} tonic`
              : `R marks the ${rootName} root`}{' '}
            • Press 0 for all modes • Space for whole neck • A for all strings • N for notes
          </p>
        </div>

        {degrees.length > 1 && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
            <ul
              className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs"
              aria-label="Selected mode colours"
            >
              {degrees.map((degree) => (
                <li key={degree} className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: MODES[degree].color }}
                  />
                  {modeRootName(degree)} {MODES[degree].name}
                </li>
              ))}
            </ul>
            <p className="text-xs mt-1">Split colours: notes shared by the selected patterns</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ThreeNpsToggles);
