import type { CSSProperties } from 'react';

/**
 * Solid colour for one pattern, hard-edged stripes for a position shared by several.
 * Used to show which of the selected patterns cover a fretboard position.
 */
export function createSplitColorStyle(colors: readonly string[]): CSSProperties | undefined {
  if (colors.length === 0) return undefined;
  if (colors.length === 1) return { backgroundColor: colors[0] };

  const stops = colors
    .map(
      (color, i) =>
        `${color} ${(i * 100) / colors.length}%, ${color} ${((i + 1) * 100) / colors.length}%`
    )
    .join(', ');
  return { background: `linear-gradient(90deg, ${stops})` };
}
