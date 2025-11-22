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

    // Resume AudioContext if suspended (browser autoplay policy)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch((error) => {
        console.error('Failed to resume AudioContext:', error);
      });
    }

    return audioContextRef.current;
  }, []);

  /**
   * Play a single click sound at a specific time
   */
  const scheduleClick = useCallback(
    (audioContext: AudioContext, startTime: number): OscillatorNode | null => {
      try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = METRONOME_CONSTANTS.CLICK_FREQUENCY;
        oscillator.type = 'sine';

        // Set volume with envelope to prevent pops
        gainNode.gain.setValueAtTime(METRONOME_CONSTANTS.CLICK_VOLUME, startTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          startTime + METRONOME_CONSTANTS.CLICK_DURATION
        );

        oscillator.start(startTime);
        oscillator.stop(startTime + METRONOME_CONSTANTS.CLICK_DURATION);

        return oscillator;
      } catch (error) {
        console.error('Failed to schedule click:', error);
        return null;
      }
    },
    []
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
   * Play a single beat click (for panel changes)
   */
  const playBeatClick = useCallback(() => {
    const audioContext = initAudioContext();
    if (!audioContext) return;

    const now = audioContext.currentTime;
    scheduleClick(audioContext, now);
  }, [initAudioContext, scheduleClick]);

  /**
   * Play clicks for all notes in a pattern
   */
  const playPatternClicks = useCallback(
    (pattern: RhythmPattern) => {
      if (!enabled) return;

      const audioContext = initAudioContext();
      if (!audioContext) return;

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
          const oscillator = scheduleClick(audioContext, startTime);
          if (oscillator) {
            scheduledNodesRef.current.push(oscillator);
          }
        }
      });
    },
    [enabled, bpm, initAudioContext, scheduleClick, stopClicks]
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
  };
};
