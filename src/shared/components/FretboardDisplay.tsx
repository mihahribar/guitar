import { memo } from 'react';
import type { StringIndex, FretNumber } from '../types/core';
import { STRING_NAMES } from '../utils/musicTheory';
import { FRETBOARD_CONSTANTS } from '../constants/magicNumbers';

/**
 * Props interface for shared FretboardDisplay component
 */
interface FretboardDisplayProps {
  /** Currently selected root note identifier */
  selectedRoot: string;
  /** Current pattern being displayed (when not showing all) */
  currentPattern?: string;
  /** Whether to show all patterns simultaneously */
  showAllPatterns: boolean;
  /** Whether to overlay additional scale/pattern information */
  showOverlay: boolean;
  /** Whether to display note names on natural notes */
  showNoteNames: boolean;
  /** Function to determine if a main dot should be shown at position */
  shouldShowDot: (stringIndex: StringIndex, fretNumber: FretNumber) => boolean;
  /** Function to get CSS styling for main dots (colors, gradients) */
  getDotStyle: (
    stringIndex: StringIndex,
    fretNumber: FretNumber
  ) => React.CSSProperties | undefined;
  /** Function to check if position contains key notes (roots, etc.) */
  isKeyNote: (stringIndex: StringIndex, fretNumber: FretNumber) => boolean;
  /** Function to determine if overlay dot should be shown at position */
  shouldShowOverlayDot: (stringIndex: StringIndex, fretNumber: FretNumber) => boolean;
  /** Function to determine if note name should be displayed at position */
  shouldShowNoteName: (stringIndex: StringIndex, fretNumber: FretNumber) => boolean;
  /** Function to get note name string for specific position */
  getNoteNameAtFret: (stringIndex: StringIndex, fretNumber: FretNumber) => string;
  /** Optional custom aria label for the fretboard */
  ariaLabel?: string;
  /** Optional key note indicator text */
  keyNoteIndicator?: string;
}

/**
 * Shared guitar fretboard display component for all learning systems
 *
 * Renders an interactive guitar fretboard that can display any guitar learning system
 * patterns including chords, scales, arpeggios, etc. Uses a table-based layout with
 * CSS Grid for precise positioning and supports multiple display modes.
 *
 * @param props - FretboardDisplayProps containing display options and calculation functions
 *
 * @returns JSX table element representing guitar fretboard with appropriate ARIA labels
 *
 * @accessibility
 * - Uses semantic table structure with proper headings
 * - Includes ARIA labels for screen reader navigation
 * - Provides descriptive role and aria-label attributes
 * - Fret markers indicate common position references (3rd, 5th, 7th, 9th, 12th frets)
 *
 * @styling
 * - Responsive design adapting to mobile and desktop layouts
 * - Dark mode support with appropriate color schemes
 * - Visual hierarchy with main dots, overlay dots, and note names
 * - CSS custom properties for precise fretboard spacing
 *
 * @performance
 * - Uses React.memo for props-based re-rendering optimization
 * - Minimal DOM updates through conditional rendering of overlays
 * - Efficient iteration over fixed fretboard dimensions (6 strings × 15 frets)
 */
function FretboardDisplay({
  selectedRoot,
  currentPattern,
  showAllPatterns,
  showOverlay,
  showNoteNames,
  shouldShowDot,
  getDotStyle,
  isKeyNote,
  shouldShowOverlayDot,
  shouldShowNoteName,
  getNoteNameAtFret,
  ariaLabel,
  keyNoteIndicator = 'R',
}: FretboardDisplayProps) {
  const defaultAriaLabel =
    ariaLabel ||
    `Guitar fretboard showing ${selectedRoot} ${currentPattern || 'pattern'}${showAllPatterns ? ' in all positions' : ''}`;

  return (
    <section
      className="bg-amber-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm"
      aria-label="Guitar fretboard"
    >
      <table
        className="fretboard-grid w-full border-collapse"
        role="grid"
        aria-label={defaultAriaLabel}
      >
        <thead>
          <tr>
            <th className="w-8"></th>
            {Array.from({ length: FRETBOARD_CONSTANTS.TOTAL_FRETS }, (_, i) => (
              <th key={i} className="text-center pb-2 relative">
                {[3, 5, 7, 9, 12].includes(i + 1) && (
                  <div className="text-xs text-gray-400 dark:text-gray-500 font-mono">{i + 1}</div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STRING_NAMES.map((stringName, stringIndex) => (
            <tr key={stringIndex} className="string-row">
              <th
                className="w-8 text-right pr-2 text-sm font-mono text-gray-600 dark:text-gray-300 font-medium"
                scope="row"
                aria-label={`${stringName} string`}
              >
                {stringName}
              </th>

              {Array.from({ length: FRETBOARD_CONSTANTS.TOTAL_FRETS }, (_, fretIndex) => (
                <td
                  key={fretIndex}
                  className="fret-cell relative h-8 border-l border-gray-300 dark:border-gray-600 first:border-l-0"
                  role="gridcell"
                  aria-label={`${stringName} string, fret ${fretIndex + 1}`}
                >
                  {/* String line */}
                  <div
                    className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 border-t border-gray-400 dark:border-gray-500 pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Main pattern dot */}
                  {shouldShowDot(stringIndex as StringIndex, fretIndex + 1) && (
                    <div
                      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-sm ${
                        isKeyNote(stringIndex as StringIndex, fretIndex + 1)
                          ? 'ring-2 ring-gray-800 dark:ring-gray-200'
                          : ''
                      } ${
                        showOverlay &&
                        shouldShowOverlayDot(stringIndex as StringIndex, fretIndex + 1)
                          ? 'ring-2 ring-green-600 dark:ring-green-500'
                          : ''
                      }`}
                      style={getDotStyle(stringIndex as StringIndex, fretIndex + 1)}
                      aria-label={`${isKeyNote(stringIndex as StringIndex, fretIndex + 1) ? 'Key note' : 'Pattern note'}${showOverlay && shouldShowOverlayDot(stringIndex as StringIndex, fretIndex + 1) ? ' (also overlay note)' : ''} on ${stringName} string, fret ${fretIndex + 1}`}
                    >
                      {isKeyNote(stringIndex as StringIndex, fretIndex + 1) ? keyNoteIndicator : ''}
                    </div>
                  )}

                  {/* Overlay dot (when not covered by main dot) */}
                  {showOverlay &&
                    shouldShowOverlayDot(stringIndex as StringIndex, fretIndex + 1) &&
                    !shouldShowDot(stringIndex as StringIndex, fretIndex + 1) && (
                      <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-green-600 dark:border-green-500 bg-green-600/30 dark:bg-green-500/30"
                        aria-label={`Overlay note on ${stringName} string, fret ${fretIndex + 1}`}
                      />
                    )}

                  {/* Note name overlay */}
                  {showNoteNames &&
                    shouldShowNoteName(stringIndex as StringIndex, fretIndex + 1) && (
                      <div
                        className="absolute top-0.5 left-0.5 text-xs font-semibold text-gray-600 dark:text-gray-300
                                 bg-white/90 dark:bg-gray-800/90 rounded px-1 border border-gray-300 dark:border-gray-600
                                 pointer-events-none z-20 leading-tight min-w-[1rem] text-center
                                 sm:top-1 sm:left-1"
                        aria-label={`Note ${getNoteNameAtFret(stringIndex as StringIndex, fretIndex + 1)} on ${stringName} string, fret ${fretIndex + 1}`}
                      >
                        {getNoteNameAtFret(stringIndex as StringIndex, fretIndex + 1)}
                      </div>
                    )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

// Memoize FretboardDisplay to prevent unnecessary re-renders when props haven't changed
// This is especially important since the component renders 90 cells (6 strings × 15 frets)
export default memo(FretboardDisplay);
