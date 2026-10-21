/**
 * Rhythm Grid Component
 *
 * 2x2 grid container for rhythm panels.
 * Manages which panel is currently active based on beat.
 */

import React from 'react';
import type { RhythmPattern, PanelIndex, BeatIndex } from '../types';
import { RhythmPanel } from './RhythmPanel';

interface RhythmGridProps {
  /** Patterns for each panel */
  panels: [RhythmPattern, RhythmPattern, RhythmPattern, RhythmPattern];
  /** Current active beat (0-3) or null */
  currentBeat: BeatIndex | null;
  /** Panels random change swapped that have not been played yet */
  changedPanels: PanelIndex[];
  /** Tempo, so changed panels flash once per beat */
  bpm: number;
  /** Callback when a panel is clicked for pattern selection */
  onPanelClick: (panelIndex: PanelIndex) => void;
}

/**
 * 2x2 grid of rhythm panels
 */
export const RhythmGrid: React.FC<RhythmGridProps> = ({
  panels,
  currentBeat,
  changedPanels,
  bpm,
  onPanelClick,
}) => {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md mx-auto"
      style={{ '--beat': `${60 / bpm}s` } as React.CSSProperties}
      role="group"
      aria-label="Rhythm pattern grid - 4 beats"
    >
      {panels.map((pattern, index) => (
        <RhythmPanel
          key={index}
          pattern={pattern}
          isActive={currentBeat === index}
          isChanged={changedPanels.includes(index as PanelIndex)}
          panelIndex={index as PanelIndex}
          onSelectPattern={() => onPanelClick(index as PanelIndex)}
        />
      ))}
    </div>
  );
};

export default RhythmGrid;
