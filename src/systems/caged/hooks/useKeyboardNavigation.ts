import { useEffect } from 'react';

interface UseKeyboardNavigationProps {
  showAllShapes: boolean;
  cagedSequenceLength: number;
  onPreviousPosition: () => void;
  onNextPosition: () => void;
  onSetPosition: (position: number) => void;
  onToggleShowAllShapes: () => void;
  onToggleShowPentatonic: () => void;
  onToggleShowAllNotes: () => void;
}

/**
 * Custom hook for keyboard navigation and shortcuts in the CAGED visualizer
 *
 * Provides keyboard controls for navigating CAGED shapes and toggling display options.
 * Respects user input context and avoids interfering with form inputs.
 * Includes accessibility-friendly shortcuts for efficient visualizer operation.
 *
 * @param props Configuration object containing:
 *   - showAllShapes: Whether all shapes are currently displayed
 *   - cagedSequenceLength: Number of shapes in current sequence
 *   - onPreviousPosition: Callback to navigate to previous shape
 *   - onNextPosition: Callback to navigate to next shape
 *   - onSetPosition: Callback to jump to specific position
 *   - onToggleShowAllShapes: Callback to toggle all shapes display
 *   - onToggleShowPentatonic: Callback to toggle pentatonic overlay
 *   - onToggleShowAllNotes: Callback to toggle all notes display
 *
 * @keyboardShortcuts
 * - Arrow Left/Right: Navigate between CAGED shapes (when not showing all)
 * - 1-5: Jump directly to CAGED shape position (when not showing all)
 * - Space: Toggle show all shapes mode
 * - S: Toggle pentatonic scale overlay
 * - N: Toggle all notes display
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
 *   showAllShapes: false,
 *   cagedSequenceLength: 5,
 *   onPreviousPosition: () => actions.previousPosition(5),
 *   onNextPosition: () => actions.nextPosition(5),
 *   onSetPosition: (pos) => actions.setPosition(pos),
 *   onToggleShowAllShapes: actions.toggleShowAllShapes,
 *   onToggleShowPentatonic: actions.toggleShowPentatonic,
 *   onToggleShowAllNotes: actions.toggleShowAllNotes
 * });
 * ```
 */
export function useKeyboardNavigation({
  showAllShapes,
  cagedSequenceLength,
  onPreviousPosition,
  onNextPosition,
  onSetPosition,
  onToggleShowAllShapes,
  onToggleShowPentatonic,
  onToggleShowAllNotes,
}: UseKeyboardNavigationProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't interfere with input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          if (!showAllShapes) {
            event.preventDefault();
            onPreviousPosition();
          }
          break;
        case 'ArrowRight':
          if (!showAllShapes) {
            event.preventDefault();
            onNextPosition();
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5': {
          if (!showAllShapes) {
            event.preventDefault();
            const position = parseInt(event.key) - 1;
            if (position < cagedSequenceLength) {
              onSetPosition(position);
            }
          }
          break;
        }
        case ' ':
          event.preventDefault();
          onToggleShowAllShapes();
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
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    showAllShapes,
    onPreviousPosition,
    onNextPosition,
    onSetPosition,
    cagedSequenceLength,
    onToggleShowAllShapes,
    onToggleShowPentatonic,
    onToggleShowAllNotes,
  ]);
}
