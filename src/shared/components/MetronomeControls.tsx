import { useState, useCallback } from 'react';
import { useMetronome } from '@/shared/hooks';
import { METRONOME_CONSTANTS } from '@/shared/constants/magicNumbers';

/**
 * Metronome controls component
 *
 * Provides a simple inline UI for controlling the metronome with play/pause
 * button and numeric BPM input. Integrates with the useMetronome hook for
 * Web Audio API functionality.
 *
 * @component
 * @example
 * ```tsx
 * <MetronomeControls />
 * ```
 */
export default function MetronomeControls() {
  const { isPlaying, bpm, togglePlay, setBpm, isValid } = useMetronome();
  const [inputValue, setInputValue] = useState(bpm.toString());

  /**
   * Handle BPM input change
   */
  const handleBpmChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      // Parse and validate
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        setBpm(numValue);
      }
    },
    [setBpm]
  );

  /**
   * Handle BPM input blur - clamp to valid range
   */
  const handleBpmBlur = useCallback(() => {
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue)) {
      // Reset to current BPM if invalid
      setInputValue(bpm.toString());
    } else {
      // Clamp to valid range
      const clampedValue = Math.max(
        METRONOME_CONSTANTS.MIN_BPM,
        Math.min(METRONOME_CONSTANTS.MAX_BPM, numValue)
      );
      setBpm(clampedValue);
      setInputValue(clampedValue.toString());
    }
  }, [inputValue, bpm, setBpm]);

  /**
   * Determine input border color based on validity
   */
  const inputBorderClass = isValid
    ? 'border-gray-300 dark:border-gray-600'
    : 'border-red-500 dark:border-red-500';

  return (
    <div className="flex items-center space-x-2">
      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className={`
          px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900
          ${
            isPlaying
              ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus:ring-blue-500'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-400'
          }
        `}
        aria-label={isPlaying ? 'Stop metronome' : 'Start metronome'}
      >
        {isPlaying ? (
          // Pause icon
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          // Play icon
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* BPM Input */}
      <div className="flex items-center space-x-1">
        <input
          type="number"
          min={METRONOME_CONSTANTS.MIN_BPM}
          max={METRONOME_CONSTANTS.MAX_BPM}
          value={inputValue}
          onChange={handleBpmChange}
          onBlur={handleBpmBlur}
          className={`
            w-16 px-2 py-1 text-sm text-center rounded border ${inputBorderClass}
            bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
            transition-colors duration-200
          `}
          aria-label="Metronome tempo in beats per minute"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">BPM</span>
      </div>
    </div>
  );
}
