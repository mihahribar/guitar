/**
 * Notation Display Component
 *
 * Renders a rhythm pattern as music notation. Quarters, eighths and triplets
 * use standard notation; sixteenths are drawn as four sixteenth slots, a note
 * where the beat is played and a rest where it is not, so every sixteenth
 * pattern reads the same way as "1 e & a".
 */

import React, { useMemo } from 'react';
import type { NotationDisplayProps } from '../types';
import type { RhythmNote } from '../types';
import { getPlayedSlots } from '../utils/rhythmUtils';
import {
  QuarterNote,
  QuarterRest,
  TwoEighthsBeamed,
  EighthNote,
  EighthRest,
  SixteenthNote,
  SixteenthRest,
  TripletNotes,
  NoteHeadFilled,
  NoteStem,
  NoteBeam,
  TripletBracket,
} from './NotationSymbols';

/**
 * Render two eighth notes with proper beaming
 */
const renderTwoEighths = (notes: RhythmNote[]): React.ReactElement => {
  const hasRest = notes.some((n) => n.isRest);

  if (hasRest) {
    // Render individually with spacing
    return (
      <g>
        <g transform="translate(8, 0)">{notes[0].isRest ? <EighthRest /> : <EighthNote />}</g>
        <g transform="translate(32, 0)">{notes[1].isRest ? <EighthRest /> : <EighthNote />}</g>
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
 * Render three triplet notes with bracket
 */
const renderTriplets = (notes: RhythmNote[]): React.ReactElement => {
  const hasRest = notes.some((n) => n.isRest);

  if (hasRest) {
    // The beam joins only the played notes; a lone note gets a flag instead
    const played = notes.flatMap((note, i) => (note.isRest ? [] : [i]));
    const beamed = played.length > 1;
    return (
      <g>
        {notes.map((note, i) => (
          <g key={i} transform={`translate(${i * 18}, 0)`}>
            {note.isRest ? (
              <EighthRest />
            ) : beamed ? (
              <g>
                <NoteHeadFilled />
                <NoteStem />
              </g>
            ) : (
              <EighthNote />
            )}
          </g>
        ))}
        {beamed && (
          <NoteBeam x1={played[0] * 18 + 10.5} x2={played[played.length - 1] * 18 + 10.5} />
        )}
        <TripletBracket width={57} />
      </g>
    );
  }

  // All notes, use the preset
  return <TripletNotes />;
};

/** Width of one sixteenth slot */
const SLOT_WIDTH = 15;
/** Stem position inside a note group, matching `NoteStem` */
const STEM_X = 10.5;
/** Rests sit a little left of their slot and below the beams, clear of both */
const REST_OFFSET = { x: -3, y: 6 };
/** A rest after a lone flagged note moves right to clear the flags */
const REST_AFTER_FLAG_X = 4;

/**
 * Render a sixteenth pattern as four sixteenth slots. Two or more notes share
 * a double beam that runs over any rests between them; a lone note gets flags.
 */
const renderSixteenthGrid = (notes: RhythmNote[]): React.ReactElement => {
  const slots = getPlayedSlots(notes, 4);
  const played = slots.flatMap((isPlayed, i) => (isPlayed ? [i] : []));
  const beamed = played.length > 1;

  return (
    <g>
      {slots.map((isPlayed, i) => {
        const x = i * SLOT_WIDTH;
        if (!isPlayed) {
          return (
            <g
              key={i}
              transform={`translate(${x + (!beamed && i > played[0] ? REST_AFTER_FLAG_X : REST_OFFSET.x)}, ${REST_OFFSET.y})`}
            >
              <SixteenthRest />
            </g>
          );
        }
        return (
          <g key={i} transform={`translate(${x}, 0)`}>
            {beamed ? (
              <>
                <NoteHeadFilled />
                <NoteStem />
              </>
            ) : (
              <SixteenthNote />
            )}
          </g>
        );
      })}
      {beamed && (
        <NoteBeam
          x1={played[0] * SLOT_WIDTH + STEM_X}
          x2={played[played.length - 1] * SLOT_WIDTH + STEM_X}
          double
        />
      )}
    </g>
  );
};

/**
 * Main notation display component
 */
export const NotationDisplay: React.FC<NotationDisplayProps> = ({ pattern, className = '' }) => {
  const renderedNotation = useMemo(() => {
    const { notes } = pattern;

    switch (pattern.category) {
      case 'quarter':
        return (
          <g transform="translate(25, 0)">{notes[0].isRest ? <QuarterRest /> : <QuarterNote />}</g>
        );
      case 'eighths':
        return renderTwoEighths(notes);
      case 'triplets':
        return renderTriplets(notes);
      case 'sixteenths':
        return renderSixteenthGrid(notes);
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
