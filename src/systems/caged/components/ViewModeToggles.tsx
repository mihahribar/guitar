import { memo } from 'react';
import type { ChordType, ChordQuality } from '../types';

interface ViewModeTogglesProps {
  selectedChord: ChordType;
  chordQuality: ChordQuality;
  showAllShapes: boolean;
  showPentatonic: boolean;
  showAllNotes: boolean;
  onToggleShowAllShapes: () => void;
  onToggleShowPentatonic: () => void;
  onToggleShowAllNotes: () => void;
}

function ViewModeToggles({
  selectedChord,
  chordQuality,
  showAllShapes,
  showPentatonic,
  showAllNotes,
  onToggleShowAllShapes,
  onToggleShowPentatonic,
  onToggleShowAllNotes,
}: ViewModeTogglesProps) {
  return (
    <div className="mt-6">
      {/* View Mode Toggle Controls */}
      <section className="mb-4" aria-label="View mode controls">
        <div className="flex items-center justify-center gap-8">
          {/* Show All Shapes Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 dark:text-gray-300">Show All Shapes</span>
            <button
              onClick={onToggleShowAllShapes}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                showAllShapes ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-gray-600'
              }`}
              aria-pressed={showAllShapes}
              aria-label={showAllShapes ? 'Switch to single CAGED shape' : 'Show all CAGED shapes'}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  showAllShapes ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {showAllShapes ? 'ON' : 'OFF'}
            </span>
          </div>

          {/* Pentatonic Scale Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 dark:text-gray-300">Pentatonic Scale</span>
            <button
              onClick={onToggleShowPentatonic}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                showPentatonic ? 'bg-green-600 dark:bg-green-500' : 'bg-gray-200 dark:bg-gray-600'
              }`}
              aria-pressed={showPentatonic}
              aria-label={
                showPentatonic ? 'Hide pentatonic scale overlay' : 'Show pentatonic scale overlay'
              }
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  showPentatonic ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {showPentatonic ? 'ON' : 'OFF'}
            </span>
          </div>

          {/* All Notes Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 dark:text-gray-300">All Notes</span>
            <button
              onClick={onToggleShowAllNotes}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                showAllNotes ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'
              }`}
              aria-pressed={showAllNotes}
              aria-label={
                showAllNotes ? 'Hide note names on fretboard' : 'Show note names on fretboard'
              }
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  showAllNotes ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {showAllNotes ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </section>

      {/* Status Information */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        <div className="space-y-1">
          <p className="font-medium">
            {showAllShapes ? (
              <span className="text-indigo-600 dark:text-indigo-400">All CAGED Positions Mode</span>
            ) : (
              <span>Single Shape Mode</span>
            )}
          </p>
          <p>
            {showAllShapes
              ? `Viewing all 5 CAGED positions for ${selectedChord} ${chordQuality} simultaneously`
              : `Navigate through different ways to play ${selectedChord} ${chordQuality} using CAGED shapes`}
          </p>
          <p className="text-xs">
            {showAllShapes
              ? 'Overlapping notes show blended colors'
              : 'Use position controls above'}{' '}
            • Press Space to toggle view mode{showPentatonic ? ' • Press S for scale' : ''}
            {showAllNotes ? ' • Press N for notes' : ''}
          </p>
        </div>

        {showPentatonic && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
            <p className="font-medium text-green-600 dark:text-green-400 text-sm">
              {selectedChord} {chordQuality === 'major' ? 'Major' : 'Minor'} Pentatonic Scale Active
            </p>
            <p className="text-xs">Green dots: scale notes • Green rings: chord + scale overlap</p>
          </div>
        )}

        {showAllNotes && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
            <p className="font-medium text-blue-600 dark:text-blue-400 text-sm">
              Natural Note Names Active
            </p>
            <p className="text-xs">
              Letter labels: natural notes (E,F,G,A,B,C,D) on all fret positions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ViewModeToggles);
