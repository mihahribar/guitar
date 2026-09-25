import { useEffect } from 'react';

interface UseRhythmKeyboardProps {
  /** Shortcuts are ignored while false (e.g. a modal is open) */
  enabled: boolean;
  onTogglePlay: () => void;
  onRandomize: () => void;
  /** Called with the BPM delta to apply */
  onBpmChange: (delta: number) => void;
}

const BPM_STEP = 1;
const BPM_SHIFT_STEP = 10;

/**
 * Keyboard shortcuts for rhythm practice
 *
 * @keyboardShortcuts
 * - Space: start/stop
 * - Arrow Up/Down: raise/lower the tempo by 1 BPM; with Shift, by 10
 * - R: randomize all panels
 */
export function useRhythmKeyboard({
  enabled,
  onTogglePlay,
  onRandomize,
  onBpmChange,
}: UseRhythmKeyboardProps) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const step = event.shiftKey ? BPM_SHIFT_STEP : BPM_STEP;

      switch (event.key) {
        case ' ':
          // Also stops page scroll and a focused button from being clicked as well
          event.preventDefault();
          onTogglePlay();
          break;
        case 'ArrowUp':
          event.preventDefault();
          onBpmChange(step);
          break;
        case 'ArrowDown':
          event.preventDefault();
          onBpmChange(-step);
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          onRandomize();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [enabled, onTogglePlay, onRandomize, onBpmChange]);
}
