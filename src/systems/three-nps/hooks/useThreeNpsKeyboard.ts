import { useEffect } from 'react';
import type { ModeDegree } from '../types';

interface UseThreeNpsKeyboardProps {
  allStrings: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onPairUp: () => void;
  onPairDown: () => void;
  onToggleMode: (degree: ModeDegree) => void;
  onSoloMode: (degree: ModeDegree) => void;
  onToggleAllModes: () => void;
  onToggleWholeNeck: () => void;
  onToggleAllStrings: () => void;
  onToggleShowAllNotes: () => void;
}

/** Physical number-row keys, so the shortcuts survive Shift turning "1" into "!" */
const MODE_KEY_CODES = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7'];

function modeFromKey(event: KeyboardEvent): ModeDegree | undefined {
  const codeIndex = MODE_KEY_CODES.indexOf(event.code);
  if (codeIndex >= 0) return codeIndex as ModeDegree;
  const digit = Number(event.key);
  return digit >= 1 && digit <= MODE_KEY_CODES.length ? ((digit - 1) as ModeDegree) : undefined;
}

/**
 * Keyboard shortcuts for the 3NPS visualizer
 *
 * @keyboardShortcuts
 * - Arrow Left/Right: walk the whole selection down/up the neck
 * - Arrow Up/Down: move to the higher/lower string pair (two-string view)
 * - 1-7: add or remove a mode; Shift+1-7 shows that mode on its own
 * - 0: select every mode, or collapse back to the leading one
 * - Space: toggle whole neck
 * - A: toggle all strings
 * - N: toggle note names on the whole fretboard
 */
export function useThreeNpsKeyboard({
  allStrings,
  onNext,
  onPrevious,
  onPairUp,
  onPairDown,
  onToggleMode,
  onSoloMode,
  onToggleAllModes,
  onToggleWholeNeck,
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

      const mode = modeFromKey(event);
      if (mode !== undefined) {
        event.preventDefault();
        if (event.shiftKey) {
          onSoloMode(mode);
        } else {
          onToggleMode(mode);
        }
        return;
      }

      if (event.code === 'Digit0' || event.key === '0') {
        event.preventDefault();
        onToggleAllModes();
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          onPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onNext();
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
        case ' ':
          event.preventDefault();
          onToggleWholeNeck();
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
    allStrings,
    onNext,
    onPrevious,
    onPairUp,
    onPairDown,
    onToggleMode,
    onSoloMode,
    onToggleAllModes,
    onToggleWholeNeck,
    onToggleAllStrings,
    onToggleShowAllNotes,
  ]);
}
