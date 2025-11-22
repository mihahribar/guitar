/**
 * Hook for managing beat cycling in the rhythm game
 *
 * Handles the timing logic for cycling through beats 0-1-2-3
 * synchronized with the metronome BPM.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type { BeatIndex } from '../types';

interface UseRhythmCyclerProps {
  /** Beats per minute from the metronome */
  bpm: number;
  /** Callback when a cycle completes (after beat 3, before beat 0) */
  onCycleComplete?: () => void;
}

interface UseRhythmCyclerReturn {
  /** Current beat index (0-3) or null when not playing */
  currentBeat: BeatIndex | null;
  /** Whether the cycler is currently running */
  isPlaying: boolean;
  /** Start cycling */
  start: () => void;
  /** Stop cycling */
  stop: () => void;
  /** Reset to beat 0 */
  reset: () => void;
}

/**
 * Hook for beat cycling synchronized with BPM
 */
export const useRhythmCycler = ({
  bpm,
  onCycleComplete,
}: UseRhythmCyclerProps): UseRhythmCyclerReturn => {
  const [currentBeat, setCurrentBeat] = useState<BeatIndex | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const intervalIdRef = useRef<number | null>(null);
  const onCycleCompleteRef = useRef(onCycleComplete);

  // Keep callback ref updated
  useEffect(() => {
    onCycleCompleteRef.current = onCycleComplete;
  }, [onCycleComplete]);

  /**
   * Clear the interval timer
   */
  const clearTimer = useCallback(() => {
    if (intervalIdRef.current !== null) {
      window.clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }, []);

  /**
   * Advance to the next beat
   */
  const advanceBeat = useCallback(() => {
    setCurrentBeat((prev) => {
      const nextBeat = ((prev ?? -1) + 1) % 4 as BeatIndex;

      // If completing a cycle (going from beat 3 to 0), call the callback
      if (nextBeat === 0 && prev === 3) {
        onCycleCompleteRef.current?.();
      }

      return nextBeat;
    });
  }, []);

  /**
   * Start the beat cycling
   */
  const start = useCallback(() => {
    setIsPlaying(true);
    setCurrentBeat(0);
  }, []);

  /**
   * Stop the beat cycling
   */
  const stop = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
    setCurrentBeat(null);
  }, [clearTimer]);

  /**
   * Reset to beat 0 without stopping
   */
  const reset = useCallback(() => {
    setCurrentBeat(0);
  }, []);

  /**
   * Effect: Manage the interval timer when playing state or BPM changes
   */
  useEffect(() => {
    if (isPlaying) {
      // Clear any existing interval
      clearTimer();

      // Calculate interval in milliseconds
      const intervalMs = (60 / bpm) * 1000;

      // Start interval for beat advancement
      intervalIdRef.current = window.setInterval(() => {
        advanceBeat();
      }, intervalMs);
    } else {
      clearTimer();
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      clearTimer();
    };
  }, [isPlaying, bpm, clearTimer, advanceBeat]);

  return {
    currentBeat,
    isPlaying,
    start,
    stop,
    reset,
  };
};
