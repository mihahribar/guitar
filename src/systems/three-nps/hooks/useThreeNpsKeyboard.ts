import { useEffect } from 'react';
import type { ModeDegree } from '../types';

interface UseThreeNpsKeyboardProps {
  showAllModes: boolean;
  allStrings: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onPairUp: () => void;
  onPairDown: () => void;
  onSetMode: (degree: ModeDegree) => void;
  onToggleShowAllModes: () => void;
  onToggleAllStrings: () => void;
  onToggleShowAllNotes: () => void;
}

/**
 * Keyboard shortcuts for the 3NPS visualizer
 *
 * @keyboardShortcuts
 * - Arrow Left/Right: previous/next pattern up the neck (single mode view)
 * - Arrow Up/Down: move to the higher/lower string pair (two-string view)
 * - 1-7: jump to a mode near the current position
 * - Space: toggle all modes
 * - A: toggle all strings
 * - N: toggle note names on the whole fretboard
 */
export function useThreeNpsKeyboard({
  showAllModes,
  allStrings,
  onNext,
  onPrevious,
  onPairUp,
  onPairDown,
  onSetMode,
  onToggleShowAllModes,
  onToggleAllStrings,
  onToggleShowAllNotes,
}: UseThreeNpsKeyboardProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      switch (event.key) {
        case 'ArrowLeft':
          if (!showAllModes) {
            event.preventDefault();
            onPrevious();
          }
          break;
        case 'ArrowRight':
          if (!showAllModes) {
            event.preventDefault();
            onNext();
          }
          break;
        case 'ArrowUp':
          if (!allStrings) {
            event.preventDefault();
            onPairUp();
          }
          break;
        case 'ArrowDown':
          if (!allStrings) {
            event.preventDefault();
            onPairDown();
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
          if (!showAllModes) {
            event.preventDefault();
            onSetMode((parseInt(event.key) - 1) as ModeDegree);
          }
          break;
        case ' ':
          event.preventDefault();
          onToggleShowAllModes();
          break;
        case 'a':
        case 'A':
          event.preventDefault();
          onToggleAllStrings();
          break;
        case 'n':
        case 'N':
          event.preventDefault();
          onToggleShowAllNotes();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    showAllModes,
    allStrings,
    onNext,
    onPrevious,
    onPairUp,
    onPairDown,
    onSetMode,
    onToggleShowAllModes,
    onToggleAllStrings,
    onToggleShowAllNotes,
  ]);
}
