/**
 * Rhythm Page Component
 *
 * Main entry point for the rhythm game feature.
 * Combines all rhythm game components into a complete page.
 */

import React, { useState } from 'react';
import type { PanelIndex } from '../types';
import { useRhythmGame } from '../hooks';
import { RhythmGrid } from './RhythmGrid';
import { RhythmControls } from './RhythmControls';
import { PatternSelector } from './PatternSelector';

/**
 * Main rhythm game page
 */
const RhythmPage: React.FC = () => {
  // Game state and actions from hook
  const {
    panels,
    isPlaying,
    currentBeat,
    randomChangeMode,
    playAudio,
    bpm,
    togglePlay,
    setPattern,
    randomizeAll,
    setRandomChangeMode,
    setPlayAudio,
    setBpm,
  } = useRhythmGame();

  // Pattern selector state
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectedPanelIndex, setSelectedPanelIndex] = useState<PanelIndex | null>(null);

  /**
   * Handle panel click to open pattern selector
   */
  const handlePanelClick = (panelIndex: PanelIndex) => {
    setSelectedPanelIndex(panelIndex);
    setSelectorOpen(true);
  };

  /**
   * Handle pattern selection from modal
   */
  const handlePatternSelect = (pattern: typeof panels[0]) => {
    if (selectedPanelIndex !== null) {
      setPattern(selectedPanelIndex, pattern);
    }
    setSelectorOpen(false);
    setSelectedPanelIndex(null);
  };

  /**
   * Close pattern selector
   */
  const handleCloseSelector = () => {
    setSelectorOpen(false);
    setSelectedPanelIndex(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Rhythm Practice
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Click panels to change patterns, then start to practice
          </p>
        </header>

        {/* Main content */}
        <main className="space-y-8">
          {/* Rhythm grid */}
          <section aria-label="Rhythm grid">
            <RhythmGrid
              panels={panels}
              currentBeat={currentBeat}
              onPanelClick={handlePanelClick}
            />
          </section>

          {/* Controls */}
          <section aria-label="Controls">
            <RhythmControls
              isPlaying={isPlaying}
              bpm={bpm}
              randomChangeMode={randomChangeMode}
              playAudio={playAudio}
              onTogglePlay={togglePlay}
              onRandomizeAll={randomizeAll}
              onSetRandomChangeMode={setRandomChangeMode}
              onSetPlayAudio={setPlayAudio}
              onSetBpm={setBpm}
            />
          </section>
        </main>

        {/* Instructions */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Set your tempo with the BPM input, then click Start to begin.
          </p>
          <p className="mt-1">
            Enable "Play Audio" to hear clicks for each subdivision.
          </p>
        </footer>
      </div>

      {/* Pattern selector modal */}
      <PatternSelector
        isOpen={selectorOpen}
        onClose={handleCloseSelector}
        onSelect={handlePatternSelect}
        currentPattern={
          selectedPanelIndex !== null ? panels[selectedPanelIndex] : undefined
        }
      />
    </div>
  );
};

export default RhythmPage;
