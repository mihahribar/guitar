/**
 * Notation Display Component
 *
 * Renders a rhythm pattern as standard music notation.
 * Handles beaming, rests, and different note durations.
 */

import React, { useMemo } from 'react';
import type { NotationDisplayProps } from '../types';
import type { RhythmNote } from '../types';
import {
  QuarterNote,
  QuarterRest,
  TwoEighthsBeamed,
  EighthNote,
  EighthRest,
  FourSixteenthsBeamed,
  SixteenthNote,
  SixteenthRest,
  TripletNotes,
  NoteHeadFilled,
  NoteStem,
  NoteBeam,
  TripletBracket,
} from './NotationSymbols';

/**
 * Determine the pattern type from notes
 */
const getPatternType = (
  notes: RhythmNote[]
): 'quarter' | 'eighths' | 'sixteenths' | 'triplets' | 'mixed' => {
  if (notes.length === 1) return 'quarter';
  if (notes.length === 3 && notes.every((n) => Math.abs(n.duration - 1 / 3) < 0.01)) {
    return 'triplets';
  }
  if (notes.every((n) => n.duration === 0.25)) return 'sixteenths';
  if (notes.every((n) => n.duration === 0.5)) return 'eighths';
  return 'mixed';
};

/**
 * Render a single note or rest based on duration
 */
const renderSingleNote = (
  note: RhythmNote,
  key: string
): React.ReactElement => {
  if (note.isRest) {
    if (note.duration >= 0.9) return <QuarterRest key={key} />;
    if (note.duration >= 0.4) return <EighthRest key={key} />;
    return <SixteenthRest key={key} />;
  }

  if (note.duration >= 0.9) return <QuarterNote key={key} />;
  if (note.duration >= 0.4) return <EighthNote key={key} />;
  return <SixteenthNote key={key} />;
};

/**
 * Render two eighth notes with proper beaming
 */
const renderTwoEighths = (notes: RhythmNote[]): React.ReactElement => {
  const hasRest = notes.some((n) => n.isRest);

  if (hasRest) {
    // Render individually with spacing
    return (
      <g>
        <g transform="translate(8, 0)">
          {notes[0].isRest ? <EighthRest /> : <EighthNote />}
        </g>
        <g transform="translate(32, 0)">
          {notes[1].isRest ? <EighthRest /> : <EighthNote />}
        </g>
      </g>
    );
  }

  // Beam connected eighth notes
  return (
    <g transform="translate(8, 0)">
      <TwoEighthsBeamed />
    </g>
  );
};

/**
 * Render four sixteenth notes with proper beaming
 */
const renderFourSixteenths = (notes: RhythmNote[]): React.ReactElement => {
  const hasRest = notes.some((n) => n.isRest);

  if (hasRest) {
    // Render individually with spacing
    return (
      <g>
        {notes.map((note, i) => (
          <g key={i} transform={`translate(${i * 15}, 0)`}>
            {note.isRest ? <SixteenthRest /> : <SixteenthNote />}
          </g>
        ))}
      </g>
    );
  }

  // Beam connected sixteenth notes
  return <FourSixteenthsBeamed />;
};

/**
 * Render three triplet notes with bracket
 */
const renderTriplets = (notes: RhythmNote[]): React.ReactElement => {
  const hasRest = notes.some((n) => n.isRest);

  if (hasRest) {
    // Render with bracket but individual notes/rests
    return (
      <g>
        {notes.map((note, i) => (
          <g key={i} transform={`translate(${i * 18}, 0)`}>
            {note.isRest ? <EighthRest /> : (
              <g>
                <NoteHeadFilled />
                <NoteStem />
              </g>
            )}
          </g>
        ))}
        <NoteBeam x1={10.5} x2={46.5} />
        <TripletBracket width={57} />
      </g>
    );
  }

  // All notes, use the preset
  return <TripletNotes />;
};

/**
 * Render mixed patterns (e.g., eighth + two sixteenths)
 */
const renderMixedPattern = (notes: RhythmNote[]): React.ReactElement => {
  let xOffset = 0;
  const elements: React.ReactElement[] = [];

  notes.forEach((note, i) => {
    const width = note.duration * 60; // Scale width by duration

    elements.push(
      <g key={i} transform={`translate(${xOffset}, 0)`}>
        {renderSingleNote(note, `note-${i}`)}
      </g>
    );

    xOffset += Math.max(width, 15); // Minimum spacing
  });

  return <g>{elements}</g>;
};

/**
 * Main notation display component
 */
export const NotationDisplay: React.FC<NotationDisplayProps> = ({
  pattern,
  className = '',
}) => {
  const renderedNotation = useMemo(() => {
    const { notes } = pattern;
    const patternType = getPatternType(notes);

    switch (patternType) {
      case 'quarter':
        return (
          <g transform="translate(25, 0)">
            {notes[0].isRest ? <QuarterRest /> : <QuarterNote />}
          </g>
        );
      case 'eighths':
        return renderTwoEighths(notes);
      case 'sixteenths':
        return renderFourSixteenths(notes);
      case 'triplets':
        return renderTriplets(notes);
      case 'mixed':
      default:
        return renderMixedPattern(notes);
    }
  }, [pattern]);

  return (
    <svg
      viewBox="0 0 70 50"
      className={`w-full h-full ${className}`}
      aria-label={`Rhythm pattern: ${pattern.name}`}
    >
      <g transform="translate(5, 35)">{renderedNotation}</g>
    </svg>
  );
};

export default NotationDisplay;
