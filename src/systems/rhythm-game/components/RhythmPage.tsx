/**
 * Rhythm Page Component
 *
 * Main entry point for the rhythm game feature.
 * Combines all rhythm game components into a complete page.
 */

import React, { useCallback, useState } from 'react';
import type { PanelIndex } from '../types';
import { SystemHelp } from '@/shared';
import { RHYTHM_HELP } from '../constants';
import { useRhythmGame, useRhythmKeyboard } from '../hooks';
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
    changedPanels,
    isPlaying,
    currentBeat,
    randomChangeMode,
    randomPool,
    playAudio,
    playMetronome,
    bpm,
    togglePlay,
    setPattern,
    randomizeAll,
    setRandomChangeMode,
    updateRandomPool,
    setPlayAudio,
    setPlayMetronome,
    setBpm,
  } = useRhythmGame();

  // Pattern selector state
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectedPanelIndex, setSelectedPanelIndex] = useState<PanelIndex | null>(null);
  const [poolOpen, setPoolOpen] = useState(false);

  const changeBpmBy = useCallback((delta: number) => setBpm(bpm + delta), [bpm, setBpm]);

  useRhythmKeyboard({
    enabled: !selectorOpen && !poolOpen,
    onTogglePlay: togglePlay,
    onRandomize: randomizeAll,
    onBpmChange: changeBpmBy,
  });

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
  const handlePatternSelect = (pattern: (typeof panels)[0]) => {
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

  /**
   * Toggle a pattern in the random pool, or keep only it with Shift
   */
  const handlePoolSelect = (pattern: (typeof panels)[0], event: React.MouseEvent) => {
    updateRandomPool({
      type: event.shiftKey ? 'SOLO_PATTERN' : 'TOGGLE_PATTERN',
      payload: pattern.id,
    });
  };

  return (
    <div className="py-8 px-4">
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
              changedPanels={changedPanels}
              bpm={bpm}
              onPanelClick={handlePanelClick}
            />
          </section>

          {/* Controls */}
          <section aria-label="Controls">
            <RhythmControls
              isPlaying={isPlaying}
              bpm={bpm}
              randomChangeMode={randomChangeMode}
              randomPoolSize={randomPool.length}
              playAudio={playAudio}
              playMetronome={playMetronome}
              onTogglePlay={togglePlay}
              onRandomizeAll={randomizeAll}
              onSetRandomChangeMode={setRandomChangeMode}
              onOpenRandomPool={() => setPoolOpen(true)}
              onSetPlayAudio={setPlayAudio}
              onSetPlayMetronome={setPlayMetronome}
              onSetBpm={setBpm}
            />
          </section>
        </main>

        {/* Instructions */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Set your tempo with the BPM input, then click Start to begin.</p>
          <p className="mt-1">
            Enable "Play Notes" to hear the subdivision notes for each pattern.
          </p>
          <p className="mt-1">Enable "Play Metronome" to hear a click on each beat.</p>
        </footer>

        <SystemHelp content={RHYTHM_HELP} />
      </div>

      {/* Pattern selector modal */}
      <PatternSelector
        isOpen={selectorOpen}
        onClose={handleCloseSelector}
        title="Select Pattern"
        selectedIds={selectedPanelIndex !== null ? [panels[selectedPanelIndex].id] : []}
        onSelect={handlePatternSelect}
      />

      {/* Random pool modal */}
      <PatternSelector
        isOpen={poolOpen}
        onClose={() => setPoolOpen(false)}
        title="Random Patterns"
        description="Randomize and Random Change only use the patterns picked here. Tap a heading for the whole group, or Shift-click a pattern to keep just that one."
        warning={
          randomPool.length === 0
            ? 'Pick at least one pattern. Until then Randomize and Random Change leave the beats as they are.'
            : undefined
        }
        selectedIds={randomPool}
        onSelect={handlePoolSelect}
        onSelectCategory={(category) =>
          updateRandomPool({ type: 'TOGGLE_CATEGORY', payload: category })
        }
        onSelectAll={() => updateRandomPool({ type: 'SELECT_ALL' })}
        onSelectNone={() => updateRandomPool({ type: 'SELECT_NONE' })}
      />
    </div>
  );
};

export default RhythmPage;
