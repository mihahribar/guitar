import { memo } from 'react';
import type { StringIndex } from '@/shared/types/core';
import { CHROMATIC_TO_NOTE_NAME } from '@/shared/utils/musicTheory';
import { MAJOR_SCALE_STEPS, MODES, ROOT_OPTIONS, STRING_PAIRS } from '../constants';
import type { ModeDegree } from '../types';

interface ThreeNpsNavigationProps {
  root: number;
  lowString: StringIndex;
  degrees: ModeDegree[];
  allStrings: boolean;
  onRootChange: (root: number) => void;
  onStringPairChange: (lowString: StringIndex) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleMode: (degree: ModeDegree) => void;
  onSoloMode: (degree: ModeDegree) => void;
  onToggleAllModes: () => void;
}

const navButtonClass =
  'p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 transition-colors focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:outline-none cursor-pointer';

const modeButtonClass =
  'relative w-11 h-11 rounded-md text-white text-xs font-bold transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none cursor-pointer';

const kbdClass = 'px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs';

function ThreeNpsNavigation({
  root,
  lowString,
  degrees,
  allStrings,
  onRootChange,
  onStringPairChange,
  onPrevious,
  onNext,
  onToggleMode,
  onSoloMode,
  onToggleAllModes,
}: ThreeNpsNavigationProps) {
  const allSelected = degrees.length === MODES.length;
  const isLastSelected = (degree: ModeDegree) => degrees.length === 1 && degrees[0] === degree;

  return (
    <div className="bg-white dark:bg-gray-900 mb-6">
      <div className="flex flex-col gap-6">
        {/* Root and string pair selection */}
        <div className="flex flex-wrap items-start justify-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">Root</span>
            <div className="relative">
              <select
                value={root}
                onChange={(e) => onRootChange(Number(e.target.value))}
                className="appearance-none rounded-lg px-4 py-2 pr-8 text-white font-medium focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:outline-none cursor-pointer border-none shadow-md transition-all duration-200"
                style={{ backgroundColor: MODES[0].color }}
                aria-label="Select major scale root"
              >
                {ROOT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value} className="bg-gray-800 text-white">
                    {label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-white text-opacity-80"
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
            <span className="text-xs text-gray-600 dark:text-gray-400">Strings</span>
            {allStrings ? (
              <div className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium shadow-sm">
                All Strings
              </div>
            ) : (
              <div
                className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1"
                role="group"
                aria-label="String pair selector"
              >
                {STRING_PAIRS.map((pair) => (
                  <button
                    key={pair.low}
                    onClick={() => onStringPairChange(pair.low)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 dark:focus:ring-offset-gray-700 ${
                      pair.low === lowString
                        ? 'bg-blue-600 text-white shadow-sm focus:ring-blue-500'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-400'
                    }`}
                    aria-pressed={pair.low === lowString}
                    aria-label={`Strings ${pair.label}`}
                  >
                    {pair.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mode selection — any number of modes can be shown at once */}
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
              aria-label="Mode selector"
            >
              {MODES.map((mode, index) => {
                const modeDegree = index as ModeDegree;
                const isActive = degrees.includes(modeDegree);
                const startNote = CHROMATIC_TO_NOTE_NAME[(root + MAJOR_SCALE_STEPS[index]) % 12];
                return (
                  <button
                    key={mode.name}
                    onClick={(event) =>
                      event.shiftKey ? onSoloMode(modeDegree) : onToggleMode(modeDegree)
                    }
                    className={`${modeButtonClass} ${
                      isActive
                        ? 'scale-110 shadow-lg focus:ring-white ring-2 ring-white ring-opacity-30'
                        : 'opacity-40 hover:opacity-75 focus:ring-gray-400'
                    } ${isLastSelected(modeDegree) ? 'cursor-default' : ''}`}
                    style={{ backgroundColor: mode.color }}
                    aria-pressed={isActive}
                    aria-label={`${startNote} ${mode.name}`}
                    title={`${startNote} ${mode.name} (${index + 1}, ⇧ for this mode only)`}
                  >
                    <div className="leading-none">{mode.short}</div>
                    <div className="absolute bottom-0.5 right-1 text-[9px] leading-none opacity-90 font-mono">
                      {startNote}
                    </div>
                  </button>
                );
              })}

              <button
                onClick={onToggleAllModes}
                className={`${modeButtonClass} ${
                  allSelected
                    ? 'bg-indigo-600 dark:bg-indigo-500 scale-110 shadow-lg focus:ring-white ring-2 ring-white ring-opacity-30'
                    : 'bg-gray-400 dark:bg-gray-600 opacity-70 hover:opacity-100 focus:ring-gray-400'
                }`}
                aria-pressed={allSelected}
                aria-label={allSelected ? 'Show one mode only' : 'Show all modes'}
                title={allSelected ? 'Show one mode only (0)' : 'Show all modes (0)'}
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
            <span>Tap modes to stack them •</span>
            <kbd className={kbdClass}>1-7</kbd>
            <span>to toggle,</span>
            <kbd className={kbdClass}>⇧1-7</kbd>
            <span>for one •</span>
            <span>walk the neck with</span>
            <kbd className={kbdClass}>←→</kbd>
            {!allStrings && (
              <>
                <span>• change strings with</span>
                <kbd className={kbdClass}>↑↓</kbd>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ThreeNpsNavigation);
