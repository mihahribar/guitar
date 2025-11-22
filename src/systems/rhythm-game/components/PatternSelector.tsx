/**
 * Pattern Selector Component
 *
 * Modal/dropdown for selecting rhythm patterns.
 * Groups patterns by category (quarter, eighths, sixteenths, triplets).
 */

import React, { useEffect, useRef } from 'react';
import type { RhythmPattern, SubdivisionType } from '../types';
import { PATTERNS_BY_CATEGORY, CATEGORY_DISPLAY_NAMES } from '../constants';
import { NotationDisplay } from './NotationDisplay';

interface PatternSelectorProps {
  /** Whether the selector is open */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Pattern selection callback */
  onSelect: (pattern: RhythmPattern) => void;
  /** Currently selected pattern (for highlighting) */
  currentPattern?: RhythmPattern;
}

const CATEGORY_ORDER: SubdivisionType[] = [
  'quarter',
  'eighths',
  'sixteenths',
  'triplets',
];

/**
 * Pattern selection modal
 */
export const PatternSelector: React.FC<PatternSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentPattern,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle Escape key to close
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePatternSelect = (pattern: RhythmPattern) => {
    onSelect(pattern);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="
          bg-white dark:bg-gray-800
          rounded-xl shadow-2xl
          max-w-lg w-full mx-4
          max-h-[80vh] overflow-y-auto
          border border-gray-200 dark:border-gray-700
        "
        role="dialog"
        aria-modal="true"
        aria-label="Select a rhythm pattern"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Select Pattern
          </h2>
          <button
            onClick={onClose}
            className="
              p-1 rounded-lg
              text-gray-500 hover:text-gray-700
              dark:text-gray-400 dark:hover:text-gray-200
              hover:bg-gray-100 dark:hover:bg-gray-700
              transition-colors
            "
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Pattern categories */}
        <div className="p-4 space-y-6">
          {CATEGORY_ORDER.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                {CATEGORY_DISPLAY_NAMES[category]}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PATTERNS_BY_CATEGORY[category].map((pattern) => {
                  const isSelected = currentPattern?.id === pattern.id;
                  return (
                    <button
                      key={pattern.id}
                      onClick={() => handlePatternSelect(pattern)}
                      className={`
                        p-3 rounded-lg
                        border-2 transition-all
                        flex flex-col items-center gap-2
                        ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }
                      `}
                      aria-pressed={isSelected}
                    >
                      <div className="w-12 h-12 text-gray-700 dark:text-gray-300">
                        <NotationDisplay pattern={pattern} />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 text-center leading-tight">
                        {pattern.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatternSelector;
