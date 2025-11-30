import { memo } from 'react';
import type { ChordType, ChordQuality } from '../types';
import { CAGED_SHAPES_BY_QUALITY } from '../constants';
import ChordQualityToggle from './ChordQualityToggle';

interface ConsolidatedNavigationProps {
  selectedChord: ChordType;
  chordQuality: ChordQuality;
  currentPosition: number;
  cagedSequence: string[];
  showAllShapes: boolean;
  onChordChange: (chord: ChordType) => void;
  onChordQualityChange: (quality: ChordQuality) => void;
  onPreviousPosition: () => void;
  onNextPosition: () => void;
  onSetPosition: (position: number) => void;
}

const chords: { value: ChordType; label: string }[] = [
  { value: 'C', label: 'C' },
  { value: 'A', label: 'A' },
  { value: 'G', label: 'G' },
  { value: 'E', label: 'E' },
  { value: 'D', label: 'D' },
];

function CAGEDNavigation({
  selectedChord,
  chordQuality,
  currentPosition,
  cagedSequence,
  showAllShapes,
  onChordChange,
  onChordQualityChange,
  onPreviousPosition,
  onNextPosition,
  onSetPosition,
}: ConsolidatedNavigationProps) {
  chords.find((chord) => chord.value === selectedChord);
  return (
    <div className="bg-white dark:bg-gray-900 mb-6">
      <div className="flex flex-col gap-6">
        {/* Root Chord and Quality Selection - Centered at top */}
        <div className="flex flex-col items-center">
          {/* Horizontal layout for chord and quality selectors */}
          <div className="flex items-center gap-6">
            {/* Root Chord Selector */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">Root</span>
              <div className="relative">
                <select
                  value={selectedChord}
                  onChange={(e) => onChordChange(e.target.value as ChordType)}
                  className="appearance-none rounded-lg px-4 py-2 pr-8 text-white font-medium focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:outline-none cursor-pointer border-none shadow-md transition-all duration-200"
                  style={{
                    backgroundColor: CAGED_SHAPES_BY_QUALITY[chordQuality][selectedChord].color,
                  }}
                  aria-label="Select root chord"
                >
                  {chords.map(({ value, label }) => (
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

            {/* Chord Quality Toggle */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">Quality</span>
              <ChordQualityToggle chordQuality={chordQuality} onToggle={onChordQualityChange} />
            </div>
          </div>
        </div>

        {/* CAGED Position Navigation - Only show in single shape mode */}
        {!showAllShapes && (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3">
              {/* Previous Button */}
              <button
                onClick={onPreviousPosition}
                className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 transition-colors focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:outline-none cursor-pointer"
                aria-label="Previous chord shape"
                title="Previous shape (←)"
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

              {/* Shape Position Selector */}
              <div className="flex gap-1.5" role="tablist" aria-label="CAGED shape selector">
                {cagedSequence.map((shape, index) => (
                  <button
                    key={shape}
                    onClick={() => onSetPosition(index)}
                    className={`relative w-10 h-10 rounded-md text-white text-sm font-bold transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none cursor-pointer ${
                      index === currentPosition
                        ? 'scale-110 shadow-lg focus:ring-white ring-2 ring-white ring-opacity-30'
                        : 'opacity-50 hover:opacity-75 focus:ring-gray-400'
                    }`}
                    style={{ backgroundColor: CAGED_SHAPES_BY_QUALITY[chordQuality][shape].color }}
                    role="tab"
                    aria-selected={index === currentPosition}
                    aria-label={`${shape} shape position ${index + 1} of ${cagedSequence.length}`}
                    title={`${shape} shape (${index + 1})`}
                  >
                    <div className="text-sm">{shape}</div>
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={onNextPosition}
                className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 transition-colors focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:outline-none cursor-pointer"
                aria-label="Next chord shape"
                title="Next shape (→)"
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
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mt-4">
              <span>CAGED positions - use</span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">←→</kbd>
              <span>or</span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">1-5</kbd>
            </div>
          </div>
        )}

        {/* All Shapes Mode Indicator */}
        {showAllShapes && (
          <div className="flex flex-col items-center">
            <div className="text-center">
              <div className="px-4 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white font-semibold text-base shadow-sm">
                <div className="text-center">
                  <div className="text-base opacity-90">All Shapes</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(CAGEDNavigation);
