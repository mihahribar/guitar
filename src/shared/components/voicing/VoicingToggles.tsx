import ToggleSwitch from '../ToggleSwitch';
import type { VoicingSystem } from '../../types/voicing';

interface VoicingTogglesProps<Q extends string, I extends number, S extends string | number> {
  system: VoicingSystem<Q, I, S>;
  root: number;
  quality: Q;
  stringSets: S[];
  inversions: I[];
  fretRange?: [number, number];
  wholeNeck: boolean;
  showAllNotes: boolean;
  onToggleWholeNeck: () => void;
  onToggleShowAllNotes: () => void;
}

export default function VoicingToggles<
  Q extends string,
  I extends number,
  S extends string | number,
>({
  system,
  root,
  quality,
  stringSets,
  inversions,
  fretRange,
  wholeNeck,
  showAllNotes,
  onToggleWholeNeck,
  onToggleShowAllNotes,
}: VoicingTogglesProps<Q, I, S>) {
  const { inversions: INVERSIONS, nouns } = system;
  const chordName = system.chordName(root, quality);
  const setLabels = system.stringSets
    .filter((set) => stringSets.includes(set.id))
    .map((set) => set.summary);
  const stringsLabel = `${setLabels.length === 1 ? 'strings' : 'string sets'} ${setLabels.join(', ')}`;
  const soloInversion = inversions.length === 1 ? inversions[0] : undefined;
  const otherTones = system.qualities[quality].toneLabels.slice(1);

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
            Dots show the chord tone: R is the root, then the {otherTones.slice(0, -1).join(', ')}{' '}
            and {otherTones[otherTones.length - 1]}
          </p>
          {system.stringSetNotes(stringSets).map((note) => (
            <p key={note} className="text-xs">
              {note}
            </p>
          ))}
          <p className="text-xs">
            {wholeNeck
              ? `Every ${nouns.shape} of the selected inversions, all the way up the neck`
              : `One ${nouns.shape} per inversion and string set, ←→ walks them along the neck together`}
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
            <p className="text-xs mt-1">
              Split colours: notes shared by the selected {nouns.shape}s
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
