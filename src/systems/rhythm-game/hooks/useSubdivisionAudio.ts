/**
 * Hook for playing subdivision audio clicks
 *
 * Uses Web Audio API to play click sounds for each note
 * in a rhythm pattern, synchronized with the beat timing.
 */

import { useRef, useCallback, useEffect } from 'react';
import { METRONOME_CONSTANTS } from '@/shared/constants/magicNumbers';
import type { RhythmPattern } from '../types';
import { calculateNoteTimings } from '../utils/rhythmUtils';

interface UseSubdivisionAudioProps {
  /** Whether audio playback is enabled */
  enabled: boolean;
  /** Current BPM for timing calculations */
  bpm: number;
}

interface UseSubdivisionAudioReturn {
  /** Play clicks for a specific pattern at the current beat */
  playPatternClicks: (pattern: RhythmPattern) => void;
  /** Play a single beat click (for panel changes) */
  playBeatClick: () => void;
  /** Stop any scheduled clicks */
  stopClicks: () => void;
  /** Initialize and resume AudioContext (must be called from user gesture) */
  initAudio: () => Promise<boolean>;
}

/**
 * Hook for playing subdivision clicks for rhythm patterns
 */
export const useSubdivisionAudio = ({
  enabled,
  bpm,
}: UseSubdivisionAudioProps): UseSubdivisionAudioReturn => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const scheduledNodesRef = useRef<OscillatorNode[]>([]);

  /**
   * Initialize AudioContext on first use
   * This is synchronous for backwards compatibility with existing code
   */
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new AudioContext();
      } catch (error) {
        console.error('Failed to create AudioContext:', error);
        return null;
      }
    }

    return audioContextRef.current;
  }, []);

  /**
   * Initialize and resume AudioContext
   * MUST be called from within a user gesture (e.g., button click) for mobile
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  const initAudio = useCallback(async (): Promise<boolean> => {
    const audioContext = initAudioContext();
    if (!audioContext) {
      return false;
    }

    // Resume AudioContext if suspended (browser autoplay policy)
    if (audioContext.state === 'suspended') {
      try {
        await audioContext.resume();
      } catch (error) {
        console.error('Failed to resume AudioContext:', error);
        return false;
      }
    }

    // Verify AudioContext is now running
    return audioContext.state === 'running';
  }, [initAudioContext]);

  /**
   * Play a single click sound at a specific time
   * Generic function that can create different click sounds based on parameters
   */
  const scheduleClick = useCallback(
    (
      audioContext: AudioContext,
      startTime: number,
      frequency: number,
      duration: number,
      volume: number,
      waveType: OscillatorType = 'sine'
    ): OscillatorNode | null => {
      try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = waveType;

        // Set volume with envelope to prevent pops
        gainNode.gain.setValueAtTime(volume, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);

        return oscillator;
      } catch (error) {
        console.error('Failed to schedule click:', error);
        return null;
      }
    },
    []
  );

  /**
   * Schedule a metronome beat click (more percussive, like a snare)
   */
  const scheduleMetronomeClick = useCallback(
    (audioContext: AudioContext, startTime: number): OscillatorNode | null => {
      return scheduleClick(
        audioContext,
        startTime,
        METRONOME_CONSTANTS.METRONOME_CLICK_FREQUENCY,
        METRONOME_CONSTANTS.METRONOME_CLICK_DURATION,
        METRONOME_CONSTANTS.METRONOME_CLICK_VOLUME,
        'triangle' // Triangle wave for more percussive metronome sound
      );
    },
    [scheduleClick]
  );

  /**
   * Schedule a subdivision note click (smoother, melodic)
   */
  const scheduleNoteClick = useCallback(
    (audioContext: AudioContext, startTime: number): OscillatorNode | null => {
      return scheduleClick(
        audioContext,
        startTime,
        METRONOME_CONSTANTS.NOTE_CLICK_FREQUENCY,
        METRONOME_CONSTANTS.NOTE_CLICK_DURATION,
        METRONOME_CONSTANTS.NOTE_CLICK_VOLUME,
        'sine' // Sine wave for smoother note sound
      );
    },
    [scheduleClick]
  );

  /**
   * Stop all scheduled click nodes
   */
  const stopClicks = useCallback(() => {
    scheduledNodesRef.current.forEach((node) => {
      try {
        node.stop();
      } catch {
        // Node may have already stopped
      }
    });
    scheduledNodesRef.current = [];
  }, []);

  /**
   * Play a single metronome beat click (for beat timing reference)
   */
  const playBeatClick = useCallback(() => {
    const audioContext = initAudioContext();
    if (!audioContext || audioContext.state !== 'running') return;

    const now = audioContext.currentTime;
    scheduleMetronomeClick(audioContext, now);
  }, [initAudioContext, scheduleMetronomeClick]);

  /**
   * Play clicks for all notes in a pattern
   */
  const playPatternClicks = useCallback(
    (pattern: RhythmPattern) => {
      if (!enabled) return;

      const audioContext = initAudioContext();
      if (!audioContext || audioContext.state !== 'running') return;

      // Clear any previously scheduled clicks
      stopClicks();

      // Calculate beat duration in milliseconds
      const beatDurationMs = (60 / bpm) * 1000;

      // Get timing offsets for each note
      const timings = calculateNoteTimings(pattern, beatDurationMs);

      // Get current audio context time
      const now = audioContext.currentTime;

      // Schedule clicks for each non-rest note
      pattern.notes.forEach((note, index) => {
        if (!note.isRest) {
          // Convert milliseconds to seconds for Web Audio API
          const startTime = now + timings[index] / 1000;
          const oscillator = scheduleNoteClick(audioContext, startTime);
          if (oscillator) {
            scheduledNodesRef.current.push(oscillator);
          }
        }
      });
    },
    [enabled, bpm, initAudioContext, scheduleNoteClick, stopClicks]
  );

  /**
   * Cleanup AudioContext on unmount
   */
  useEffect(() => {
    return () => {
      stopClicks();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch((error) => {
          console.error('Failed to close AudioContext:', error);
        });
        audioContextRef.current = null;
      }
    };
  }, [stopClicks]);

  return {
    playPatternClicks,
    playBeatClick,
    stopClicks,
    initAudio,
  };
};
