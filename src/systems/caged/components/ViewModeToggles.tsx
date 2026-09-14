import { memo } from 'react';
import type { ChordType, ChordQuality, ScaleType } from '../types';
import { SCALE_DEFINITIONS } from '../constants/scales';
import ToggleSwitch from '@/shared/components/ToggleSwitch';

interface ViewModeTogglesProps {
  selectedChord: ChordType;
  chordQuality: ChordQuality;
  showAllShapes: boolean;
  showPentatonic: boolean;
  showAllNotes: boolean;
  showScale: boolean;
  selectedScale: ScaleType;
  onToggleShowAllShapes: () => void;
  onToggleShowPentatonic: () => void;
  onToggleShowAllNotes: () => void;
  onToggleShowScale: () => void;
  onSetScaleType: (scaleType: ScaleType) => void;
}

function ViewModeToggles({
  selectedChord,
  chordQuality,
  showAllShapes,
  showPentatonic,
  showAllNotes,
  showScale,
  selectedScale,
  onToggleShowAllShapes,
  onToggleShowPentatonic,
  onToggleShowAllNotes,
  onToggleShowScale,
  onSetScaleType,
}: ViewModeTogglesProps) {
  return (
    <div className="mt-6">
      {/* View Mode Toggle Controls */}
      <section className="mb-4" aria-label="View mode controls">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <ToggleSwitch
            label="Show All Shapes"
            checked={showAllShapes}
            onToggle={onToggleShowAllShapes}
            color="indigo"
            ariaLabel={showAllShapes ? 'Switch to single CAGED shape' : 'Show all CAGED shapes'}
          />
          <ToggleSwitch
            label="Pentatonic Scale"
            checked={showPentatonic}
            onToggle={onToggleShowPentatonic}
            color="green"
            ariaLabel={
              showPentatonic ? 'Hide pentatonic scale overlay' : 'Show pentatonic scale overlay'
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
          <ToggleSwitch
            label="Scale"
            checked={showScale}
            onToggle={onToggleShowScale}
            color="violet"
            ariaLabel={
              showScale ? 'Hide scale overlay on fretboard' : 'Show scale overlay on fretboard'
            }
          >
            <select
              value={selectedScale}
              onChange={(e) => onSetScaleType(e.target.value as ScaleType)}
              className="text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
              aria-label="Select scale type"
            >
              <optgroup label="Major">
                {Object.entries(SCALE_DEFINITIONS)
                  .filter(([, def]) => def.category === 'major')
                  .map(([key, def]) => (
                    <option key={key} value={key}>
                      {def.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Minor">
                {Object.entries(SCALE_DEFINITIONS)
                  .filter(([, def]) => def.category === 'minor')
                  .map(([key, def]) => (
                    <option key={key} value={key}>
                      {def.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Modes">
                {Object.entries(SCALE_DEFINITIONS)
                  .filter(([, def]) => def.category === 'mode')
                  .map(([key, def]) => (
                    <option key={key} value={key}>
                      {def.name}
                    </option>
                  ))}
              </optgroup>
            </select>
          </ToggleSwitch>
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

        {showScale && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
            <p className="font-medium text-violet-600 dark:text-violet-400 text-sm">
              {selectedChord} {SCALE_DEFINITIONS[selectedScale].name} Scale Active
            </p>
            <p className="text-xs">
              Purple dots: scale notes • Split colors: chord + scale overlap
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ViewModeToggles);
