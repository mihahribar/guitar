/**
 * Main orchestration hook for the rhythm game
 *
 * Combines beat cycling, audio playback, and pattern management
 * into a single unified interface.
 */

import { useState, useCallback, useMemo, useEffect, useRef, useReducer } from 'react';
import { useUrlSync } from '@/shared/hooks/useUrlSync';
import type { RhythmPattern, UseRhythmGameReturn, PanelIndex, BeatIndex } from '../types';
import { ALL_PATTERNS, METRONOME_CONSTANTS } from '../constants';
import { useRhythmCycler } from './useRhythmCycler';
import { useSubdivisionAudio } from './useSubdivisionAudio';
import {
  getRandomPattern,
  getRandomPatternExcept,
  randomPoolReducer,
  stepRandomChange,
} from '../utils/rhythmUtils';
import { decodeRhythm, encodeRhythm } from '../utils/urlState';

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
  // Settings from a shared link, or the defaults
  const [initial] = useState(() => decodeRhythm(new URLSearchParams(window.location.search)));

  // Own BPM state (independent of site-wide metronome)
  const [bpm, setBpmState] = useState<number>(initial.bpm);

  // Panel patterns state
  const [panels, setPanels] = useState(initial.panels);

  // Game mode states
  const [randomChangeMode, setRandomChangeModeState] = useState(initial.randomChangeMode);
  const [playAudio, setPlayAudioState] = useState(initial.playAudio);
  const [playMetronome, setPlayMetronomeState] = useState(initial.playMetronome);

  // Patterns Randomize and Random Change pick from, every pattern unless a link says otherwise
  const [randomPool, updateRandomPool] = useReducer(randomPoolReducer, initial.randomPool);

  useUrlSync(
    useMemo(
      () => encodeRhythm({ bpm, panels, randomChangeMode, playAudio, playMetronome, randomPool }),
      [bpm, panels, randomChangeMode, playAudio, playMetronome, randomPool]
    )
  );
  const poolPatterns = useMemo(
    () => ALL_PATTERNS.filter((pattern) => randomPool.includes(pattern.id)),
    [randomPool]
  );

  // Panels swapped by random change that have not been played yet
  const [changedPanels, setChangedPanels] = useState<PanelIndex[]>([]);
  // Panel picked for the next bar, waiting for its swap beat
  const pendingChangeRef = useRef<PanelIndex | null>(null);

  /**
   * Handle each beat - in random change mode, swap one panel per bar, two beats
   * before it plays, so the player has time to read it
   */
  const handleBeat = useCallback(
    (beat: BeatIndex) => {
      // A swapped panel stops flashing once it is being played
      setChangedPanels((prev) => prev.filter((panel) => panel !== beat));

      if (!randomChangeMode) return;

      const { pending, swap: target } = stepRandomChange(beat, pendingChangeRef.current);
      pendingChangeRef.current = pending;
      if (target === null) return;

      // Nothing to swap to when the pool holds only the pattern already there
      const next = getRandomPatternExcept(panels[target], poolPatterns);
      if (!next) return;

      setPanels((prev) => {
        const updated = [...prev] as [RhythmPattern, RhythmPattern, RhythmPattern, RhythmPattern];
        updated[target] = next;
        return updated;
      });
      setChangedPanels((prev) => [...prev, target]);
    },
    [randomChangeMode, panels, poolPatterns]
  );

  // Beat cycling hook
  const {
    currentBeat,
    isPlaying,
    start: startCycling,
    stop: stopCycling,
  } = useRhythmCycler({
    bpm,
    onBeat: handleBeat,
  });

  // Audio playback hook
  const { playPatternClicks, playBeatClick, stopClicks, initAudio } = useSubdivisionAudio({
    enabled: playAudio,
    bpm,
  });

  /**
   * Play audio when beat changes:
   * - If playMetronome is enabled: play beat click for timing reference
   * - If playAudio is enabled: play pattern subdivisions (respects rests)
   */
  useEffect(() => {
    if (currentBeat !== null && isPlaying) {
      // Play metronome beat click if enabled
      if (playMetronome) {
        playBeatClick();
      }

      // Play pattern subdivisions if enabled (respects rests)
      if (playAudio) {
        const currentPattern = panels[currentBeat];
        playPatternClicks(currentPattern);
      }
    }
  }, [currentBeat, panels, playAudio, playMetronome, isPlaying, playBeatClick, playPatternClicks]);

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
   * Initializes audio context first (requires user gesture for mobile)
   */
  const start = useCallback(async () => {
    // Initialize and resume AudioContext within user gesture for mobile compatibility
    await initAudio();

    // Start the beat cycler
    startCycling();
  }, [startCycling, initAudio]);

  /**
   * Stop the rhythm game
   */
  const stop = useCallback(() => {
    stopCycling();
    stopClicks();
    pendingChangeRef.current = null;
    setChangedPanels([]);
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
  const setPattern = useCallback((panelIndex: PanelIndex, pattern: RhythmPattern) => {
    setPanels((prev) => {
      const updated = [...prev] as [RhythmPattern, RhythmPattern, RhythmPattern, RhythmPattern];
      updated[panelIndex] = pattern;
      return updated;
    });
  }, []);

  /**
   * Randomize all panel patterns
   */
  const randomizeAll = useCallback(() => {
    // An empty pool leaves the panels as they are
    if (poolPatterns.length === 0) return;

    setPanels([
      getRandomPattern(poolPatterns),
      getRandomPattern(poolPatterns),
      getRandomPattern(poolPatterns),
      getRandomPattern(poolPatterns),
    ]);
  }, [poolPatterns]);

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
   * Set metronome playback enabled
   */
  const setPlayMetronome = useCallback((enabled: boolean) => {
    setPlayMetronomeState(enabled);
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
      changedPanels,
      isPlaying,
      currentBeat,
      randomChangeMode,
      playAudio,
      playMetronome,
      randomPool,
      bpm,
      // Actions
      start,
      stop,
      togglePlay,
      setPattern,
      randomizeAll,
      setRandomChangeMode,
      updateRandomPool,
      setPlayAudio,
      setPlayMetronome,
      setBpm,
    }),
    [
      panels,
      changedPanels,
      isPlaying,
      currentBeat,
      randomChangeMode,
      playAudio,
      playMetronome,
      randomPool,
      bpm,
      start,
      stop,
      togglePlay,
      setPattern,
      randomizeAll,
      setRandomChangeMode,
      updateRandomPool,
      setPlayAudio,
      setPlayMetronome,
      setBpm,
    ]
  );
};
