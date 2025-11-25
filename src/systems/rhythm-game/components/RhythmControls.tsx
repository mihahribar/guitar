/**
 * Rhythm Controls Component
 *
 * Control panel with BPM input, Start/Stop, Randomize, and toggle switches.
 */

import React, { useState, useEffect } from 'react';
import { METRONOME_CONSTANTS } from '@/shared/constants/magicNumbers';

interface RhythmControlsProps {
  /** Whether the game is currently playing */
  isPlaying: boolean;
  /** Current BPM */
  bpm: number;
  /** Whether random change mode is enabled */
  randomChangeMode: boolean;
  /** Whether audio playback is enabled */
  playAudio: boolean;
  /** Whether metronome playback is enabled */
  playMetronome: boolean;
  /** Toggle play/pause */
  onTogglePlay: () => void;
  /** Randomize all patterns */
  onRandomizeAll: () => void;
  /** Set random change mode */
  onSetRandomChangeMode: (enabled: boolean) => void;
  /** Set audio playback */
  onSetPlayAudio: (enabled: boolean) => void;
  /** Set metronome playback */
  onSetPlayMetronome: (enabled: boolean) => void;
  /** Set BPM */
  onSetBpm: (bpm: number) => void;
}

/**
 * Toggle switch component
 */
const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id: string;
}> = ({ checked, onChange, label, id }) => (
  <div className="flex items-center gap-2">
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        ${checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white shadow-sm
          transition-transform duration-200 ease-in-out
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
    <label
      htmlFor={id}
      className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
    >
      {label}
    </label>
  </div>
);

/**
 * Control panel for the rhythm game
 */
export const RhythmControls: React.FC<RhythmControlsProps> = ({
  isPlaying,
  bpm,
  randomChangeMode,
  playAudio,
  playMetronome,
  onTogglePlay,
  onRandomizeAll,
  onSetRandomChangeMode,
  onSetPlayAudio,
  onSetPlayMetronome,
  onSetBpm,
}) => {
  // Local state for BPM input to allow typing without immediate clamping
  const [inputValue, setInputValue] = useState(String(bpm));

  // Sync local state when bpm prop changes (e.g., from external source)
  useEffect(() => {
    setInputValue(String(bpm));
  }, [bpm]);

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const applyBpmValue = () => {
    const value = parseInt(inputValue, 10);
    if (!isNaN(value)) {
      // Clamp and apply
      const clampedValue = Math.max(
        METRONOME_CONSTANTS.MIN_BPM,
        Math.min(METRONOME_CONSTANTS.MAX_BPM, value)
      );
      onSetBpm(clampedValue);
      setInputValue(String(clampedValue));
    } else {
      // Reset to current bpm if invalid
      setInputValue(String(bpm));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      applyBpmValue();
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Main action buttons */}
      <div className="flex gap-3 items-center">
        {/* BPM input with inline label */}
        <div className="flex items-center rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
          <input
            type="number"
            value={inputValue}
            onChange={handleBpmChange}
            onBlur={applyBpmValue}
            onKeyDown={handleKeyDown}
            min={METRONOME_CONSTANTS.MIN_BPM}
            max={METRONOME_CONSTANTS.MAX_BPM}
            className="
              w-16 px-3 py-3
              text-right font-semibold
              bg-transparent
              text-gray-900 dark:text-gray-100
              focus:outline-none
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
            "
            aria-label="Tempo in beats per minute"
          />
          <span className="pr-3 text-sm text-gray-500 dark:text-gray-400 font-medium select-none">
            BPM
          </span>
        </div>

        {/* Start/Stop button */}
        <button
          onClick={onTogglePlay}
          className={`
            flex-1 px-6 py-3 rounded-lg
            font-semibold text-white
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2
            dark:focus:ring-offset-gray-900
            ${
              isPlaying
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }
          `}
          aria-label={isPlaying ? 'Stop rhythm practice' : 'Start rhythm practice'}
        >
          <span className="flex items-center justify-center gap-2">
            {isPlaying ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
                Stop
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Start
              </>
            )}
          </span>
        </button>

        {/* Randomize button */}
        <button
          onClick={onRandomizeAll}
          className="
            px-4 py-3 rounded-lg
            font-medium
            bg-gray-100 dark:bg-gray-700
            text-gray-700 dark:text-gray-200
            hover:bg-gray-200 dark:hover:bg-gray-600
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
            dark:focus:ring-offset-gray-900
          "
          aria-label="Randomize all patterns"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Randomize
          </span>
        </button>
      </div>

      {/* Toggle switches */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center">
        <ToggleSwitch
          id="random-change-mode"
          checked={randomChangeMode}
          onChange={onSetRandomChangeMode}
          label="Random Change"
        />
        <ToggleSwitch
          id="play-audio"
          checked={playAudio}
          onChange={onSetPlayAudio}
          label="Play Notes"
        />
        <ToggleSwitch
          id="play-metronome"
          checked={playMetronome}
          onChange={onSetPlayMetronome}
          label="Play Metronome"
        />
      </div>
    </div>
  );
};

export default RhythmControls;
