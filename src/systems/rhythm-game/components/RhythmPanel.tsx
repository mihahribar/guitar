/**
 * Rhythm Panel Component
 *
 * Displays a single beat panel with music notation.
 * Highlights when the beat is active.
 */

import React from 'react';
import type { RhythmPanelProps } from '../types';
import { NotationDisplay } from './NotationDisplay';

/**
 * Individual rhythm panel showing one beat's pattern
 */
export const RhythmPanel: React.FC<RhythmPanelProps> = ({
  pattern,
  isActive,
  panelIndex,
  onSelectPattern,
}) => {
  // Panel beat number (1-indexed for display)
  const beatNumber = panelIndex + 1;

  return (
    <button
      onClick={onSelectPattern}
      className={`
        relative
        w-full aspect-square
        rounded-xl
        border-2
        transition-all duration-150
        flex items-center justify-center
        cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        ${
          isActive
            ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 dark:border-blue-400 shadow-lg scale-[1.02]'
            : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
        }
      `}
      aria-label={`Beat ${beatNumber}: ${pattern.name}. Click to change pattern.`}
      aria-pressed={isActive}
    >
      {/* Beat number indicator */}
      <span
        className={`
          absolute top-2 left-2
          text-xs font-bold
          ${isActive ? 'text-blue-600 dark:text-blue-300' : 'text-gray-400 dark:text-gray-500'}
        `}
      >
        {beatNumber}
      </span>

      {/* Notation display */}
      <div
        className={`
          w-20 h-20 sm:w-24 sm:h-24
          ${isActive ? 'text-blue-700 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300'}
        `}
      >
        <NotationDisplay pattern={pattern} />
      </div>

      {/* Pattern name tooltip on hover */}
      <span
        className={`
          absolute bottom-2 left-1/2 -translate-x-1/2
          text-[10px] sm:text-xs
          truncate max-w-[90%]
          ${isActive ? 'text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}
        `}
      >
        {pattern.name}
      </span>
    </button>
  );
};

export default RhythmPanel;
