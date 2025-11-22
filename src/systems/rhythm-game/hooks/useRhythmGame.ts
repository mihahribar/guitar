/**
 * Main orchestration hook for the rhythm game
 *
 * Combines beat cycling, audio playback, and pattern management
 * into a single unified interface.
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { METRONOME_CONSTANTS } from '@/shared/constants/magicNumbers';
import type {
  RhythmPattern,
  UseRhythmGameReturn,
  PanelIndex,
} from '../types';
import { DEFAULT_PANELS } from '../constants';
import { useRhythmCycler } from './useRhythmCycler';
import { useSubdivisionAudio } from './useSubdivisionAudio';
import { getRandomPattern, getRandomPanelIndex } from '../utils/rhythmUtils';

/**
 * Main hook for the rhythm game feature
 *
 * Manages:
 * - Panel patterns (4 patterns, one per beat)
 * - Beat cycling synchronized with BPM
 * - Audio playback for subdivisions
 * - Random change mode
 * - Own BPM state (independent of site metronome)
 */
export const useRhythmGame = (): UseRhythmGameReturn => {
  // Own BPM state (independent of site-wide metronome)
  const [bpm, setBpmState] = useState<number>(METRONOME_CONSTANTS.DEFAULT_BPM);

  // Panel patterns state
  const [panels, setPanels] = useState<
    [RhythmPattern, RhythmPattern, RhythmPattern, RhythmPattern]
  >(DEFAULT_PANELS);

  // Game mode states
  const [randomChangeMode, setRandomChangeModeState] = useState(false);
  const [playAudio, setPlayAudioState] = useState(false);

  /**
   * Handle cycle completion - randomize one panel if in random change mode
   */
  const handleCycleComplete = useCallback(() => {
    if (randomChangeMode) {
      const panelIndex = getRandomPanelIndex();
      const newPattern = getRandomPattern();

      setPanels((prev) => {
        const updated = [...prev] as [
          RhythmPattern,
          RhythmPattern,
          RhythmPattern,
          RhythmPattern
        ];
        updated[panelIndex] = newPattern;
        return updated;
      });
    }
  }, [randomChangeMode]);

  // Beat cycling hook
  const {
    currentBeat,
    isPlaying,
    start: startCycling,
    stop: stopCycling,
  } = useRhythmCycler({
    bpm,
    onCycleComplete: handleCycleComplete,
  });

  // Audio playback hook
  const { playPatternClicks, playBeatClick, stopClicks } = useSubdivisionAudio({
    enabled: playAudio,
    bpm,
  });

  /**
   * Play audio when beat changes:
   * - Always play beat click (for panel changes)
   * - If playAudio is enabled, also play subdivision notes
   */
  useEffect(() => {
    if (currentBeat !== null && isPlaying) {
      // Always play beat click on panel change
      playBeatClick();

      // If "Play Notes" is enabled, also play the pattern subdivisions
      if (playAudio) {
        const currentPattern = panels[currentBeat];
        playPatternClicks(currentPattern);
      }
    }
  }, [currentBeat, panels, playAudio, isPlaying, playBeatClick, playPatternClicks]);

  /**
   * Stop audio when playback is disabled or game stops
   */
  useEffect(() => {
    if (!playAudio || !isPlaying) {
      stopClicks();
    }
  }, [playAudio, isPlaying, stopClicks]);

  /**
   * Start the rhythm game
   */
  const start = useCallback(() => {
    startCycling();
  }, [startCycling]);

  /**
   * Stop the rhythm game
   */
  const stop = useCallback(() => {
    stopCycling();
    stopClicks();
  }, [stopCycling, stopClicks]);

  /**
   * Toggle play/pause
   */
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  }, [isPlaying, start, stop]);

  /**
   * Set pattern for a specific panel
   */
  const setPattern = useCallback(
    (panelIndex: PanelIndex, pattern: RhythmPattern) => {
      setPanels((prev) => {
        const updated = [...prev] as [
          RhythmPattern,
          RhythmPattern,
          RhythmPattern,
          RhythmPattern
        ];
        updated[panelIndex] = pattern;
        return updated;
      });
    },
    []
  );

  /**
   * Randomize all panel patterns
   */
  const randomizeAll = useCallback(() => {
    setPanels([
      getRandomPattern(),
      getRandomPattern(),
      getRandomPattern(),
      getRandomPattern(),
    ]);
  }, []);

  /**
   * Set random change mode
   */
  const setRandomChangeMode = useCallback((enabled: boolean) => {
    setRandomChangeModeState(enabled);
  }, []);

  /**
   * Set audio playback enabled
   */
  const setPlayAudio = useCallback((enabled: boolean) => {
    setPlayAudioState(enabled);
  }, []);

  /**
   * Set BPM with validation
   */
  const setBpm = useCallback((newBpm: number) => {
    const clampedBpm = Math.max(
      METRONOME_CONSTANTS.MIN_BPM,
      Math.min(METRONOME_CONSTANTS.MAX_BPM, newBpm)
    );
    setBpmState(clampedBpm);
  }, []);

  // Memoized return value
  return useMemo(
    () => ({
      // State
      panels,
      isPlaying,
      currentBeat,
      randomChangeMode,
      playAudio,
      bpm,
      // Actions
      start,
      stop,
      togglePlay,
      setPattern,
      randomizeAll,
      setRandomChangeMode,
      setPlayAudio,
      setBpm,
    }),
    [
      panels,
      isPlaying,
      currentBeat,
      randomChangeMode,
      playAudio,
      bpm,
      start,
      stop,
      togglePlay,
      setPattern,
      randomizeAll,
      setRandomChangeMode,
      setPlayAudio,
      setBpm,
    ]
  );
};
