/**
 * Pattern Selector Component
 *
 * Modal for selecting rhythm patterns, either one for a panel or several for the
 * random pool. Groups patterns by category (quarter, eighths, sixteenths, triplets).
 */

import React from 'react';
import { Modal } from '@/shared/components';
import type { RhythmPattern, SubdivisionType } from '../types';
import { ALL_PATTERNS, PATTERNS_BY_CATEGORY, CATEGORY_DISPLAY_NAMES } from '../constants';
import { NotationDisplay } from './NotationDisplay';

interface PatternSelectorProps {
  /** Whether the selector is open */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Modal heading */
  title: string;
  /** Short instructions shown above the patterns */
  description?: string;
  /** Notice shown below the instructions, e.g. when nothing is selected */
  warning?: string;
  /** Ids of the patterns shown as selected */
  selectedIds: string[];
  /** Pattern click; the event tells whether Shift was held */
  onSelect: (pattern: RhythmPattern, event: React.MouseEvent) => void;
  /** Category heading click; without it the headings are plain text */
  onSelectCategory?: (category: SubdivisionType) => void;
  /** Select every pattern; shows Select all and Select none buttons with onSelectNone */
  onSelectAll?: () => void;
  /** Clear the selection */
  onSelectNone?: () => void;
}

const SELECT_BUTTON_CLASSES = `
  px-2.5 py-1 rounded-full
  text-xs font-medium
  bg-gray-100 dark:bg-gray-700
  text-gray-700 dark:text-gray-200
  hover:bg-gray-200 dark:hover:bg-gray-600
  disabled:opacity-50 disabled:pointer-events-none
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-gray-500
`;

const CATEGORY_ORDER: SubdivisionType[] = ['quarter', 'eighths', 'sixteenths', 'triplets'];

/**
 * Pattern selection modal
 */
export const PatternSelector: React.FC<PatternSelectorProps> = ({
  isOpen,
  onClose,
  title,
  description,
  warning,
  selectedIds,
  onSelect,
  onSelectCategory,
  onSelectAll,
  onSelectNone,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="p-4 space-y-6">
        {(description || warning || onSelectAll) && (
          <div className="space-y-3">
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
            )}
            {onSelectAll && onSelectNone && (
              <div className="flex gap-2">
                <button
                  onClick={onSelectAll}
                  disabled={selectedIds.length === ALL_PATTERNS.length}
                  className={SELECT_BUTTON_CLASSES}
                >
                  Select all
                </button>
                <button
                  onClick={onSelectNone}
                  disabled={selectedIds.length === 0}
                  className={SELECT_BUTTON_CLASSES}
                >
                  Select none
                </button>
              </div>
            )}
            {warning && (
              <p role="status" className="text-sm font-medium text-amber-700 dark:text-amber-400">
                {warning}
              </p>
            )}
          </div>
        )}
        {CATEGORY_ORDER.map((category) => {
          const patterns = PATTERNS_BY_CATEGORY[category];
          const selectedCount = patterns.filter((pattern) =>
            selectedIds.includes(pattern.id)
          ).length;

          return (
            <div key={category}>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                {onSelectCategory ? (
                  <button
                    onClick={() => onSelectCategory(category)}
                    className="
                      -mx-1 px-1 rounded
                      hover:text-gray-900 dark:hover:text-gray-100
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    "
                    aria-pressed={
                      selectedCount === patterns.length ? true : selectedCount > 0 ? 'mixed' : false
                    }
                  >
                    {CATEGORY_DISPLAY_NAMES[category]}{' '}
                    <span className="font-normal">
                      {selectedCount}/{patterns.length}
                    </span>
                  </button>
                ) : (
                  CATEGORY_DISPLAY_NAMES[category]
                )}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {patterns.map((pattern) => {
                  const isSelected = selectedIds.includes(pattern.id);
                  return (
                    <button
                      key={pattern.id}
                      onClick={(event) => onSelect(pattern, event)}
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
          );
        })}
      </div>
    </Modal>
  );
};

export default PatternSelector;
