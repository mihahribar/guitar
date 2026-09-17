/**
 * Pattern Selector Component
 *
 * Modal for selecting rhythm patterns.
 * Groups patterns by category (quarter, eighths, sixteenths, triplets).
 */

import React from 'react';
import { Modal } from '@/shared/components';
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

const CATEGORY_ORDER: SubdivisionType[] = ['quarter', 'eighths', 'sixteenths', 'triplets'];

/**
 * Pattern selection modal
 */
export const PatternSelector: React.FC<PatternSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentPattern,
}) => {
  const handlePatternSelect = (pattern: RhythmPattern) => {
    onSelect(pattern);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Pattern">
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
    </Modal>
  );
};

export default PatternSelector;
