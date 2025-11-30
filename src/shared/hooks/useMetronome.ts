import { useState, useEffect, useRef, useCallback } from 'react';
import { METRONOME_CONSTANTS } from '@/shared/constants/magicNumbers';
import type { MetronomeHookReturn } from '@/shared/types/metronome';

/**
 * Custom hook for metronome functionality using Web Audio API
 *
 * Provides precise metronome timing with Web Audio API for guitar practice.
 * Handles audio context lifecycle, beat scheduling, and BPM management.
 *
 * @returns Object containing:
 *   - isPlaying: Whether the metronome is currently playing
 *   - bpm: Current tempo in beats per minute
 *   - togglePlay: Function to start/stop the metronome
 *   - setBpm: Function to update the tempo
 *   - isValid: Whether the current BPM is within valid range
 *
 * @example
 * ```typescript
 * const { isPlaying, bpm, togglePlay, setBpm, isValid } = useMetronome();
 *
 * // Start/stop metronome
 * togglePlay();
 *
 * // Update tempo
 * setBpm(140);
 * ```
 *
 * @technical
 * - Uses Web Audio API with OscillatorNode + GainNode for click generation
 * - 1000Hz oscillator with 10ms duration for percussive click sound
 * - Proper cleanup to prevent memory leaks
 * - Handles browser autoplay policies gracefully
 */
export const useMetronome = (): MetronomeHookReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpmState] = useState<number>(METRONOME_CONSTANTS.DEFAULT_BPM);

  // Refs for Web Audio API
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalIdRef = useRef<number | null>(null);

  /**
   * Initialize AudioContext on first play
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
   * Generate a single click sound
   */
  const playClick = useCallback(() => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    try {
      // Create oscillator for click sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configure click sound
      oscillator.frequency.value = METRONOME_CONSTANTS.METRONOME_CLICK_FREQUENCY;
      oscillator.type = 'triangle'; // Triangle wave for percussive metronome sound

      // Set volume with envelope to prevent pops
      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(METRONOME_CONSTANTS.METRONOME_CLICK_VOLUME, now);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        now + METRONOME_CONSTANTS.METRONOME_CLICK_DURATION
      );

      // Play click
      oscillator.start(now);
      oscillator.stop(now + METRONOME_CONSTANTS.METRONOME_CLICK_DURATION);
    } catch (error) {
      console.error('Failed to play click:', error);
    }
  }, []);

  /**
   * Start metronome
   */
  const startMetronome = useCallback(() => {
    const audioContext = initAudioContext();
    if (!audioContext) {
      console.error('Cannot start metronome: AudioContext not available');
      return;
    }

    // Play first click immediately
    playClick();

    // Calculate interval in milliseconds
    const intervalMs = (60 / bpm) * 1000;

    // Schedule subsequent clicks
    intervalIdRef.current = window.setInterval(() => {
      playClick();
    }, intervalMs);
  }, [bpm, initAudioContext, playClick]);

  /**
   * Stop metronome
   */
  const stopMetronome = useCallback(() => {
    if (intervalIdRef.current !== null) {
      window.clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }, []);

  /**
   * Toggle play/pause
   */
  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  /**
   * Update BPM with validation
   */
  const setBpm = useCallback((newBpm: number) => {
    // Clamp to valid range
    const clampedBpm = Math.max(
      METRONOME_CONSTANTS.MIN_BPM,
      Math.min(METRONOME_CONSTANTS.MAX_BPM, newBpm)
    );
    setBpmState(clampedBpm);
  }, []);

  /**
   * Check if BPM is valid
   */
  const isValid = bpm >= METRONOME_CONSTANTS.MIN_BPM && bpm <= METRONOME_CONSTANTS.MAX_BPM;

  /**
   * Effect: Handle play/pause state changes
   */
  useEffect(() => {
    if (isPlaying) {
      startMetronome();
    } else {
      stopMetronome();
    }

    // Cleanup on unmount or when stopping
    return () => {
      stopMetronome();
    };
  }, [isPlaying, bpm, startMetronome, stopMetronome]);

  /**
   * Effect: Cleanup AudioContext on unmount
   */
  useEffect(() => {
    return () => {
      stopMetronome();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch((error) => {
          console.error('Failed to close AudioContext:', error);
        });
        audioContextRef.current = null;
      }
    };
  }, [stopMetronome]);

  return {
    isPlaying,
    bpm,
    togglePlay,
    setBpm,
    isValid,
  };
};
