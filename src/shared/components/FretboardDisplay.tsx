import { memo, useEffect, useRef } from 'react';
import type { StringIndex, FretNumber } from '../types/core';
import { STRING_NAMES } from '../utils/musicTheory';
import { FRETBOARD_CONSTANTS, UI_CONSTANTS } from '../constants/magicNumbers';

/** Pixel width of the string-label column (Tailwind w-8 / 2rem). */
const LABEL_COLUMN_WIDTH = 32;

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
  /** Whether to show scale overlay dots */
  showScaleOverlay?: boolean;
  /** Function to determine if scale dot should be shown at position */
  shouldShowScaleDot?: (stringIndex: StringIndex, fretNumber: FretNumber) => boolean;
  /** Optional custom aria label for the fretboard */
  ariaLabel?: string;
  /** Optional key note indicator text */
  keyNoteIndicator?: string;
  /**
   * Fret number (1-based, may be fractional for "between two frets") to smooth-scroll
   * into the horizontal center of the viewport whenever this value changes.
   * No-op when undefined or when the table already fits the container.
   */
  scrollToFret?: number;
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
 * - Efficient iteration over fixed fretboard dimensions (6 strings × 21 frets)
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
  showScaleOverlay = false,
  shouldShowScaleDot,
  ariaLabel,
  keyNoteIndicator = 'R',
  scrollToFret,
}: FretboardDisplayProps) {
  const defaultAriaLabel =
    ariaLabel ||
    `Guitar fretboard showing ${selectedRoot} ${currentPattern || 'pattern'}${showAllPatterns ? ' in all positions' : ''}`;

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Smooth-scroll the active fret into the horizontal center of the viewport when
  // `scrollToFret` changes. No-op if the table already fits inside the container, so
  // desktop users (where the whole neck is visible) never see a jump.
  useEffect(() => {
    if (scrollToFret == null) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const { clientWidth, scrollWidth } = container;
    const overflow = scrollWidth - clientWidth;
    if (overflow <= 0) return; // already fully visible

    const fretAreaWidth = scrollWidth - LABEL_COLUMN_WIDTH;
    const fretWidth = fretAreaWidth / FRETBOARD_CONSTANTS.TOTAL_FRETS;
    // Center of fret N (1-based) sits at LABEL_COLUMN_WIDTH + (N - 0.5) * fretWidth.
    const fretCenterX = LABEL_COLUMN_WIDTH + (scrollToFret - 0.5) * fretWidth;
    const target = Math.max(0, Math.min(overflow, fretCenterX - clientWidth / 2));

    container.scrollTo({ left: target, behavior: 'smooth' });
  }, [scrollToFret]);

  // Build stacked rings via box-shadow (each ring +2px wider than previous).
  // Order: innermost = key note, then pentatonic, then scale.
  const buildRings = (isKey: boolean, isPent: boolean, isScale: boolean, startOffset = 0) => {
    const shadows: string[] = [];
    let offset = startOffset;
    if (isKey) {
      shadows.push(`0 0 0 2px var(--ring-key)`);
      offset += 2;
    }
    if (isPent) {
      shadows.push(`0 0 0 ${offset + 2}px var(--ring-pent)`);
      offset += 2;
    }
    if (isScale) {
      shadows.push(`0 0 0 ${offset + 2}px var(--ring-scale)`);
      offset += 2;
    }
    return shadows.join(', ');
  };

  // Render a string-name label (E A D G B E). When the open string (fret 0) is
  // played by the current shape — or carries a pentatonic/scale overlay note —
  // the letter is wrapped in a circle styled like the fret dot it represents,
  // instead of adding a separate fret-0 column to the neck.
  const renderStringLabel = (si: StringIndex, stringName: string) => {
    const hasMain = shouldShowDot(si, 0);
    const isKey = isKeyNote(si, 0);
    const isPent = showOverlay && shouldShowOverlayDot(si, 0);
    const isScale = showScaleOverlay && !!shouldShowScaleDot?.(si, 0);

    // Always render the letter inside the same fixed-size centered box, so the
    // label sits in the exact same spot whether or not it gets circled.
    const layout = 'inline-flex items-center justify-center w-6 h-6 rounded-full';

    if (!hasMain && !isPent && !isScale) {
      return <span className={layout}>{stringName}</span>;
    }

    const badgeBase = `${layout} text-xs font-medium shadow-sm fretboard-rings`;
    const openLabel = `${stringName} string played open`;

    // Chord-shape note: solid body color, rings stacked for any overlays.
    if (hasMain) {
      const baseStyle = getDotStyle(si, 0) || {};
      const ringShadow = buildRings(isKey, isPent, isScale, 0);
      return (
        <span
          className={`${badgeBase} text-white`}
          style={ringShadow ? { ...baseStyle, boxShadow: ringShadow } : baseStyle}
          aria-label={`${openLabel}${isKey ? ' (root note)' : ''}`}
        >
          {stringName}
        </span>
      );
    }

    // Pentatonic note (no chord-shape dot): green circle, violet ring if scale too.
    if (isPent) {
      const ringShadow = isScale ? `0 0 0 2px var(--ring-scale)` : undefined;
      return (
        <span
          className={`${badgeBase} border-2 border-green-600 dark:border-green-500 bg-green-600/30 dark:bg-green-500/30 text-green-900 dark:text-green-100`}
          style={ringShadow ? { boxShadow: ringShadow } : undefined}
          aria-label={`${openLabel} (overlay note)`}
        >
          {stringName}
        </span>
      );
    }

    // Scale note only: violet circle.
    return (
      <span
        className={`${badgeBase} border-2 border-violet-600 dark:border-violet-500 bg-violet-500/30 dark:bg-violet-500/30 text-violet-900 dark:text-violet-100`}
        aria-label={`${openLabel} (scale note)`}
      >
        {stringName}
      </span>
    );
  };

  // Render the contents of a single fret cell (string line, dot/overlays, note
  // name).
  const renderCellInner = (si: StringIndex, fi: FretNumber, stringName: string) => {
    const fretLabel = `fret ${fi}`;
    const hasMain = shouldShowDot(si, fi);
    const isKey = isKeyNote(si, fi);
    const isPent = showOverlay && shouldShowOverlayDot(si, fi);
    const isScale = showScaleOverlay && !!shouldShowScaleDot?.(si, fi);

    let dot: React.ReactNode = null;
    if (hasMain) {
      const baseStyle = getDotStyle(si, fi) || {};
      const ringShadow = buildRings(isKey, isPent, isScale, 0);
      dot = (
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-sm fretboard-rings"
          style={ringShadow ? { ...baseStyle, boxShadow: ringShadow } : baseStyle}
          aria-label={`${isKey ? 'Key note' : 'Pattern note'}${isPent ? ' (also overlay note)' : ''}${isScale ? ' (also scale note)' : ''} on ${stringName} string, ${fretLabel}`}
        >
          {isKey ? keyNoteIndicator : ''}
        </div>
      );
    } else if (isPent) {
      // Standalone dot: pentatonic takes precedence as the visible body color.
      // If scale is also present, add a violet ring around it.
      const ringShadow = isScale ? `0 0 0 2px var(--ring-scale)` : undefined;
      dot = (
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-green-600 dark:border-green-500 bg-green-600/30 dark:bg-green-500/30 fretboard-rings"
          style={ringShadow ? { boxShadow: ringShadow } : undefined}
          aria-label={`Overlay note${isScale ? ' (also scale note)' : ''} on ${stringName} string, ${fretLabel}`}
        />
      );
    } else if (isScale) {
      dot = (
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-violet-600 dark:border-violet-500 bg-violet-500/30 dark:bg-violet-500/30"
          aria-label={`Scale note on ${stringName} string, ${fretLabel}`}
        />
      );
    }

    return (
      <>
        {/* String line */}
        <div
          className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 border-t border-gray-400 dark:border-gray-500 pointer-events-none"
          aria-hidden="true"
        />

        {dot}

        {/* Note name overlay */}
        {showNoteNames && shouldShowNoteName(si, fi) && (
          <div
            className="absolute top-0.5 left-0.5 text-xs font-semibold text-gray-600 dark:text-gray-300
                       bg-white/90 dark:bg-gray-800/90 rounded px-1 border border-gray-300 dark:border-gray-600
                       pointer-events-none z-20 leading-tight min-w-[1rem] text-center
                       sm:top-1 sm:left-1"
            aria-label={`Note ${getNoteNameAtFret(si, fi)} on ${stringName} string, ${fretLabel}`}
          >
            {getNoteNameAtFret(si, fi)}
          </div>
        )}
      </>
    );
  };

  return (
    <section
      className="bg-amber-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm"
      aria-label="Guitar fretboard"
    >
      <div ref={scrollContainerRef} className="overflow-x-auto">
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
                  {(UI_CONSTANTS.FRET_MARKERS as readonly number[]).includes(i + 1) && (
                    <div className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                      {i + 1}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STRING_NAMES.map((stringName, stringIndex) => {
              const si = stringIndex as StringIndex;
              return (
                <tr key={stringIndex} className="string-row">
                  <th
                    className="w-8 pr-2 text-center text-sm font-mono text-gray-600 dark:text-gray-300 font-medium"
                    scope="row"
                    aria-label={`${stringName} string`}
                  >
                    {renderStringLabel(si, stringName)}
                  </th>

                  {Array.from({ length: FRETBOARD_CONSTANTS.TOTAL_FRETS }, (_, fretIndex) => (
                    <td
                      key={fretIndex}
                      className="fret-cell relative h-8 border-l border-gray-300 dark:border-gray-600 first:border-l-0"
                      role="gridcell"
                      aria-label={`${stringName} string, fret ${fretIndex + 1}`}
                    >
                      {renderCellInner(si, (fretIndex + 1) as FretNumber, stringName)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// Memoize FretboardDisplay to prevent unnecessary re-renders when props haven't changed
// This is especially important since the component renders 126 cells (6 strings × 21 frets)
export default memo(FretboardDisplay);
