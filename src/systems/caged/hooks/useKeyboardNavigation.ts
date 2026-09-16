import { useEffect } from 'react';

interface UseKeyboardNavigationProps {
  cagedSequenceLength: number;
  onPreviousPosition: () => void;
  onNextPosition: () => void;
  onTogglePosition: (position: number) => void;
  onSoloPosition: (position: number) => void;
  onToggleAllPositions: () => void;
  onToggleShowPentatonic: () => void;
  onToggleShowAllNotes: () => void;
  onToggleShowScale: () => void;
}

/** Physical number-row keys, so the shortcuts survive Shift turning "1" into "!" */
const POSITION_KEY_CODES = [
  'Digit1',
  'Digit2',
  'Digit3',
  'Digit4',
  'Digit5',
  'Digit6',
  'Digit7',
  'Digit8',
  'Digit9',
];

function positionFromKey(event: KeyboardEvent): number | undefined {
  const codeIndex = POSITION_KEY_CODES.indexOf(event.code);
  if (codeIndex >= 0) return codeIndex;
  const digit = Number(event.key);
  return digit >= 1 && digit <= POSITION_KEY_CODES.length ? digit - 1 : undefined;
}

/**
 * Custom hook for keyboard navigation and shortcuts in the CAGED visualizer
 *
 * Provides keyboard controls for selecting CAGED positions and toggling display
 * options. Respects user input context and avoids interfering with form inputs.
 * Includes accessibility-friendly shortcuts for efficient visualizer operation.
 *
 * @param props Configuration object containing:
 *   - cagedSequenceLength: Number of positions in the current sequence
 *   - onPreviousPosition: Callback to walk the selection down the neck
 *   - onNextPosition: Callback to walk the selection up the neck
 *   - onTogglePosition: Callback to add/remove a position from the selection
 *   - onSoloPosition: Callback to show a single position on its own
 *   - onToggleAllPositions: Callback to select every position, or collapse back
 *   - onToggleShowPentatonic: Callback to toggle pentatonic overlay
 *   - onToggleShowAllNotes: Callback to toggle all notes display
 *   - onToggleShowScale: Callback to toggle the scale overlay
 *
 * @keyboardShortcuts
 * - Arrow Left/Right: walk every selected position down/up the neck
 * - 1-9: add or remove a CAGED position; Shift+1-9 shows that position on its own
 * - Space: select every position, or collapse back to the previous selection
 * - S: Toggle pentatonic scale overlay
 * - N: Toggle all notes display
 * - M: Toggle the scale overlay
 *
 * @accessibility
 * - Respects form input focus (doesn't interfere with typing)
 * - Prevents conflicts with browser shortcuts (Ctrl+S, Cmd+N, etc.)
 * - Uses preventDefault() to avoid unwanted browser behavior
 * - Provides alternative to mouse interaction for motor accessibility
 *
 * @example
 * ```typescript
 * useKeyboardNavigation({
 *   cagedSequenceLength: 11,
 *   onPreviousPosition: () => actions.previousPosition(11),
 *   onNextPosition: () => actions.nextPosition(11),
 *   onTogglePosition: actions.togglePosition,
 *   onSoloPosition: actions.soloPosition,
 *   onToggleAllPositions: () => actions.toggleAllPositions(11),
 *   onToggleShowPentatonic: actions.toggleShowPentatonic,
 *   onToggleShowAllNotes: actions.toggleShowAllNotes,
 *   onToggleShowScale: actions.toggleShowScale
 * });
 * ```
 */
export function useKeyboardNavigation({
  cagedSequenceLength,
  onPreviousPosition,
  onNextPosition,
  onTogglePosition,
  onSoloPosition,
  onToggleAllPositions,
  onToggleShowPentatonic,
  onToggleShowAllNotes,
  onToggleShowScale,
}: UseKeyboardNavigationProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't interfere with input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const position = positionFromKey(event);
      if (position !== undefined) {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        event.preventDefault();
        if (position < cagedSequenceLength) {
          if (event.shiftKey) {
            onSoloPosition(position);
          } else {
            onTogglePosition(position);
          }
        }
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          onPreviousPosition();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onNextPosition();
          break;
        case ' ':
          event.preventDefault();
          onToggleAllPositions();
          break;
        case 's':
        case 'S':
          if (event.ctrlKey || event.metaKey) return; // Don't interfere with save
          event.preventDefault();
          onToggleShowPentatonic();
          break;
        case 'n':
        case 'N':
          if (event.ctrlKey || event.metaKey) return; // Don't interfere with new file, etc.
          event.preventDefault();
          onToggleShowAllNotes();
          break;
        case 'm':
        case 'M':
          if (event.ctrlKey || event.metaKey) return;
          event.preventDefault();
          onToggleShowScale();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    cagedSequenceLength,
    onPreviousPosition,
    onNextPosition,
    onTogglePosition,
    onSoloPosition,
    onToggleAllPositions,
    onToggleShowPentatonic,
    onToggleShowAllNotes,
    onToggleShowScale,
  ]);
}
