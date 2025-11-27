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
  EighthTwoSixteenthsBeamed,
  TwoSixteenthsEighthBeamed,
  SixteenthEighthSixteenthBeamed,
  FourEighthsBeamed,
} from './NotationSymbols';

/**
 * Determine the pattern type from notes
 */
const getPatternType = (
  notes: RhythmNote[]
):
  | 'quarter'
  | 'eighths'
  | 'sixteenths'
  | 'triplets'
  | 'eighth-two-sixteenths'
  | 'two-sixteenths-eighth'
  | 'sixteenth-eighth-sixteenth'
  | 'four-eighths'
  | 'mixed' => {
  // Single note
  if (notes.length === 1) return 'quarter';

  // Triplets
  if (notes.length === 3 && notes.every((n) => Math.abs(n.duration - 1 / 3) < 0.01)) {
    return 'triplets';
  }

  // Check for mixed patterns (only if no rests)
  if (notes.length === 3 && !notes.some(n => n.isRest)) {
    const [d1, d2, d3] = notes.map(n => n.duration);

    // Eighth + two sixteenths
    if (Math.abs(d1 - 0.5) < 0.01 && Math.abs(d2 - 0.25) < 0.01 && Math.abs(d3 - 0.25) < 0.01) {
      return 'eighth-two-sixteenths';
    }

    // Two sixteenths + eighth
    if (Math.abs(d1 - 0.25) < 0.01 && Math.abs(d2 - 0.25) < 0.01 && Math.abs(d3 - 0.5) < 0.01) {
      return 'two-sixteenths-eighth';
    }

    // Sixteenth + eighth + sixteenth
    if (Math.abs(d1 - 0.25) < 0.01 && Math.abs(d2 - 0.5) < 0.01 && Math.abs(d3 - 0.25) < 0.01) {
      return 'sixteenth-eighth-sixteenth';
    }
  }

  // Four eighths
  if (notes.length === 4 && notes.every(n => !n.isRest && Math.abs(n.duration - 0.5) < 0.01)) {
    return 'four-eighths';
  }

  // All sixteenths
  if (notes.every((n) => n.duration === 0.25)) return 'sixteenths';

  // All eighths
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
 * Render eighth note followed by two sixteenths
 */
const renderEighthTwoSixteenths = (): React.ReactElement => {
  return (
    <g transform="translate(5, 0)">
      <EighthTwoSixteenthsBeamed />
    </g>
  );
};

/**
 * Render two sixteenths followed by eighth note
 */
const renderTwoSixteenthsEighth = (): React.ReactElement => {
  return (
    <g transform="translate(5, 0)">
      <TwoSixteenthsEighthBeamed />
    </g>
  );
};

/**
 * Render sixteenth, eighth, sixteenth pattern
 */
const renderSixteenthEighthSixteenth = (): React.ReactElement => {
  return (
    <g transform="translate(3, 0)">
      <SixteenthEighthSixteenthBeamed />
    </g>
  );
};

/**
 * Render four eighth notes
 */
const renderFourEighths = (): React.ReactElement => {
  return (
    <g transform="translate(2, 0)">
      <FourEighthsBeamed />
    </g>
  );
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
      case 'four-eighths':
        return renderFourEighths();
      case 'sixteenths':
        return renderFourSixteenths(notes);
      case 'triplets':
        return renderTriplets(notes);
      case 'eighth-two-sixteenths':
        return renderEighthTwoSixteenths();
      case 'two-sixteenths-eighth':
        return renderTwoSixteenthsEighth();
      case 'sixteenth-eighth-sixteenth':
        return renderSixteenthEighthSixteenth();
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
