import Kbd from '../Kbd';
import type { VoicingSystem } from '../../types/voicing';
import { ROOT_OPTIONS } from '../../utils/musicTheory';

interface VoicingNavigationProps<Q extends string, I extends number, S extends string | number> {
  system: VoicingSystem<Q, I, S>;
  root: number;
  quality: Q;
  stringSets: S[];
  inversions: I[];
  onRootChange: (root: number) => void;
  onQualityChange: (quality: Q) => void;
  onToggleStringSet: (set: S) => void;
  onSoloStringSet: (set: S) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleInversion: (inversion: I) => void;
  onSoloInversion: (inversion: I) => void;
  onToggleAllInversions: () => void;
}

const navButtonClass =
  'p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 transition-colors focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:outline-none cursor-pointer';

const inversionButtonClass =
  'relative w-11 h-11 rounded-md text-white text-xs font-bold transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none cursor-pointer';

const segmentButtonClass =
  'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 dark:focus:ring-offset-gray-700';

const segmentActiveClass = 'bg-blue-600 text-white shadow-sm focus:ring-blue-500';
const segmentIdleClass =
  'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-400';

export default function VoicingNavigation<
  Q extends string,
  I extends number,
  S extends string | number,
>({
  system,
  root,
  quality,
  stringSets,
  inversions,
  onRootChange,
  onQualityChange,
  onToggleStringSet,
  onSoloStringSet,
  onPrevious,
  onNext,
  onToggleInversion,
  onSoloInversion,
  onToggleAllInversions,
}: VoicingNavigationProps<Q, I, S>) {
  const { inversions: INVERSIONS, qualities, nouns } = system;
  const allSelected = inversions.length === INVERSIONS.length;
  const isLastInversion = (inversion: I) => inversions.length === 1 && inversions[0] === inversion;

  return (
    <div className="bg-white dark:bg-gray-900 mb-6">
      <div className="flex flex-col gap-6">
        {/* Root, quality and string set selection */}
        <div className="flex flex-wrap items-start justify-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">Root</span>
            <div className="relative">
              <select
                value={root}
                onChange={(e) => onRootChange(Number(e.target.value))}
                className="appearance-none rounded-lg px-4 py-2 pr-8 text-white font-medium focus:ring-2 focus:ring-white focus:outline-none cursor-pointer border-none shadow-md transition-all duration-200"
                style={{ backgroundColor: INVERSIONS[0].color }}
                aria-label={`Select ${nouns.chord} root`}
              >
                {ROOT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value} className="bg-gray-800 text-white">
                    {label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">Quality</span>
            <div
              className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1"
              role="group"
              aria-label={nouns.qualityGroup}
            >
              {system.url.qualities.map((q) => (
                <button
                  key={q}
                  onClick={() => onQualityChange(q)}
                  className={`${segmentButtonClass} ${q === quality ? segmentActiveClass : segmentIdleClass}`}
                  aria-pressed={q === quality}
                  aria-label={qualities[q].name}
                  title={qualities[q].name}
                >
                  {qualities[q].short}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">Strings</span>
            <div
              className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1"
              role="group"
              aria-label="String set selector"
            >
              {system.stringSets.map((set) => {
                const isActive = stringSets.includes(set.id);
                return (
                  <button
                    key={set.id}
                    onClick={(event) =>
                      event.shiftKey ? onSoloStringSet(set.id) : onToggleStringSet(set.id)
                    }
                    className={`${segmentButtonClass} ${isActive ? segmentActiveClass : segmentIdleClass}`}
                    aria-pressed={isActive}
                    aria-label={set.ariaLabel}
                    title={`${set.title} (⇧ for this set only)`}
                  >
                    {set.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Inversion selection: any number can be shown at once */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={onPrevious}
              className={navButtonClass}
              aria-label="Move selection down the neck"
              title="Move selection down the neck (←)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div
              className="flex flex-wrap justify-center gap-1.5"
              role="group"
              aria-label="Inversion selector"
            >
              {INVERSIONS.map((info, index) => {
                const inversion = index as I;
                const isActive = inversions.includes(inversion);
                return (
                  <button
                    key={info.name}
                    onClick={(event) =>
                      event.shiftKey ? onSoloInversion(inversion) : onToggleInversion(inversion)
                    }
                    className={`${inversionButtonClass} ${
                      isActive
                        ? 'scale-110 shadow-lg focus:ring-white ring-2 ring-white'
                        : 'opacity-40 hover:opacity-75 focus:ring-gray-400'
                    } ${isLastInversion(inversion) ? 'cursor-default' : ''}`}
                    style={{ backgroundColor: info.color }}
                    aria-pressed={isActive}
                    aria-label={info.name}
                    title={`${info.name} (${index + 1}, ⇧ for this inversion only)`}
                  >
                    {info.short}
                  </button>
                );
              })}

              <button
                onClick={onToggleAllInversions}
                className={`${inversionButtonClass} ${
                  allSelected
                    ? 'bg-indigo-600 dark:bg-indigo-500 scale-110 shadow-lg focus:ring-white ring-2 ring-white'
                    : 'bg-gray-400 dark:bg-gray-600 opacity-70 hover:opacity-100 focus:ring-gray-400'
                }`}
                aria-pressed={allSelected}
                aria-label={allSelected ? 'Show one inversion only' : 'Show all inversions'}
                title={allSelected ? 'Show one inversion only (0)' : 'Show all inversions (0)'}
              >
                All
              </button>
            </div>

            <button
              onClick={onNext}
              className={navButtonClass}
              aria-label="Move selection up the neck"
              title="Move selection up the neck (→)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-4">
            <span>Tap inversions and string sets to stack them •</span>
            <Kbd>1-{INVERSIONS.length}</Kbd>
            <span>to toggle,</span>
            <Kbd>⇧1-{INVERSIONS.length}</Kbd>
            <span>for one •</span>
            <span>walk the neck with</span>
            <Kbd>←→</Kbd>
            <span>• shift strings with</span>
            <Kbd>↑↓</Kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
