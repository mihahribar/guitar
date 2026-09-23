import { useEffect } from 'react';
import type { Inversion } from '../types';

interface UseTriadsKeyboardProps {
  onNext: () => void;
  onPrevious: () => void;
  onSetsUp: () => void;
  onSetsDown: () => void;
  onToggleInversion: (inversion: Inversion) => void;
  onSoloInversion: (inversion: Inversion) => void;
  onToggleAllInversions: () => void;
  onToggleWholeNeck: () => void;
  onToggleShowAllNotes: () => void;
}

/** Physical number-row keys, so the shortcuts survive Shift turning "1" into "!" */
const INVERSION_KEY_CODES = ['Digit1', 'Digit2', 'Digit3'];

function inversionFromKey(event: KeyboardEvent): Inversion | undefined {
  const codeIndex = INVERSION_KEY_CODES.indexOf(event.code);
  if (codeIndex >= 0) return codeIndex as Inversion;
  const digit = Number(event.key);
  return digit >= 1 && digit <= INVERSION_KEY_CODES.length ? ((digit - 1) as Inversion) : undefined;
}

/**
 * Keyboard shortcuts for the triads visualizer
 *
 * @keyboardShortcuts
 * - Arrow Left/Right: walk the whole selection down/up the neck
 * - Arrow Up/Down: move the selected string sets one set toward the high/low strings
 * - 1-3: add or remove an inversion; Shift+1-3 shows that inversion on its own
 * - 0: select every inversion, or collapse back to the leading one
 * - Space: toggle whole neck
 * - N: toggle note names on the whole fretboard
 */
export function useTriadsKeyboard({
  onNext,
  onPrevious,
  onSetsUp,
  onSetsDown,
  onToggleInversion,
  onSoloInversion,
  onToggleAllInversions,
  onToggleWholeNeck,
  onToggleShowAllNotes,
}: UseTriadsKeyboardProps) {
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

      const inversion = inversionFromKey(event);
      if (inversion !== undefined) {
        event.preventDefault();
        if (event.shiftKey) {
          onSoloInversion(inversion);
        } else {
          onToggleInversion(inversion);
        }
        return;
      }

      if (event.code === 'Digit0' || event.key === '0') {
        event.preventDefault();
        onToggleAllInversions();
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
          event.preventDefault();
          onSetsUp();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onSetsDown();
          break;
        case ' ':
          event.preventDefault();
          onToggleWholeNeck();
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
    onNext,
    onPrevious,
    onSetsUp,
    onSetsDown,
    onToggleInversion,
    onSoloInversion,
    onToggleAllInversions,
    onToggleWholeNeck,
    onToggleShowAllNotes,
  ]);
}
