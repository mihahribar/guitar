import { useEffect } from 'react';

interface UseVoicingKeyboardProps<I extends number> {
  /** Number of inversions; digits 1 to this select them */
  inversionCount: number;
  onNext: () => void;
  onPrevious: () => void;
  onSetsUp: () => void;
  onSetsDown: () => void;
  onToggleInversion: (inversion: I) => void;
  onSoloInversion: (inversion: I) => void;
  onToggleAllInversions: () => void;
  onToggleWholeNeck: () => void;
  onToggleShowAllNotes: () => void;
}

/**
 * The inversion a number key selects, if any. Reads the physical key first, so
 * the shortcut survives Shift turning "1" into "!".
 */
export function inversionFromKey<I extends number>(
  event: Pick<KeyboardEvent, 'code' | 'key'>,
  inversionCount: number
): I | undefined {
  const digit = /^Digit\d$/.test(event.code) ? Number(event.code.slice(5)) : Number(event.key);
  return digit >= 1 && digit <= inversionCount ? ((digit - 1) as I) : undefined;
}

/**
 * Keyboard shortcuts for a voicing visualizer (Triads, 7ths)
 *
 * @keyboardShortcuts
 * - Arrow Left/Right: walk the whole selection down/up the neck
 * - Arrow Up/Down: move the selected string sets one set toward the high/low strings
 * - 1-N: add or remove an inversion; Shift+1-N shows that inversion on its own
 * - 0: select every inversion, or collapse back to the leading one
 * - Space: toggle whole neck
 * - N: toggle note names on the whole fretboard
 */
export function useVoicingKeyboard<I extends number>({
  inversionCount,
  onNext,
  onPrevious,
  onSetsUp,
  onSetsDown,
  onToggleInversion,
  onSoloInversion,
  onToggleAllInversions,
  onToggleWholeNeck,
  onToggleShowAllNotes,
}: UseVoicingKeyboardProps<I>) {
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

      const inversion = inversionFromKey<I>(event, inversionCount);
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
    inversionCount,
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
