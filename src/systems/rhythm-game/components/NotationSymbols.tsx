/**
 * SVG Music Notation Symbol Components
 *
 * Reusable SVG components for rendering standard music notation symbols.
 * All components use currentColor for dark mode compatibility.
 */

import React from 'react';

interface SymbolProps {
  className?: string;
}

/**
 * Filled note head (quarter, eighth, sixteenth)
 */
export const NoteHeadFilled: React.FC<SymbolProps> = ({ className = '' }) => (
  <ellipse
    cx="6"
    cy="12"
    rx="5"
    ry="4"
    fill="currentColor"
    transform="rotate(-20, 6, 12)"
    className={className}
  />
);

/**
 * Note stem (vertical line)
 */
export const NoteStem: React.FC<SymbolProps & { x?: number; height?: number }> = ({
  className = '',
  x = 10.5,
  height = 28,
}) => (
  <line
    x1={x}
    y1="12"
    x2={x}
    y2={12 - height}
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  />
);

/**
 * Single flag for eighth notes
 */
export const SingleFlag: React.FC<SymbolProps & { x?: number }> = ({
  className = '',
  x = 10.5,
}) => (
  <path
    d={`M ${x} -16 Q ${x + 8} -10 ${x + 6} 0`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  />
);

/**
 * Double flag for sixteenth notes
 */
export const DoubleFlag: React.FC<SymbolProps & { x?: number }> = ({
  className = '',
  x = 10.5,
}) => (
  <g className={className}>
    <path
      d={`M ${x} -16 Q ${x + 8} -10 ${x + 6} 0`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d={`M ${x} -10 Q ${x + 8} -4 ${x + 6} 6`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </g>
);

/**
 * Horizontal beam for grouped notes
 */
export const NoteBeam: React.FC<
  SymbolProps & { x1: number; x2: number; y?: number; double?: boolean }
> = ({ className = '', x1, x2, y = -16, double = false }) => (
  <g className={className}>
    <rect x={x1} y={y} width={x2 - x1} height="4" fill="currentColor" />
    {double && (
      <rect x={x1} y={y + 6} width={x2 - x1} height="4" fill="currentColor" />
    )}
  </g>
);

/**
 * Triplet bracket with "3" marking
 */
export const TripletBracket: React.FC<SymbolProps & { width?: number }> = ({
  className = '',
  width = 60,
}) => (
  <g className={className}>
    <path
      d={`M 5 -22 L 5 -26 L ${width - 5} -26 L ${width - 5} -22`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <text
      x={width / 2}
      y="-28"
      textAnchor="middle"
      fontSize="10"
      fill="currentColor"
      fontWeight="bold"
    >
      3
    </text>
  </g>
);

/**
 * Quarter rest symbol
 */
export const QuarterRest: React.FC<SymbolProps> = ({ className = '' }) => (
  <g className={className}>
    <path
      d="M 8 -8 L 4 -2 L 8 4 Q 2 8 6 14 Q 10 10 8 6 L 12 0 L 8 -8"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1"
    />
  </g>
);

/**
 * Eighth rest symbol
 */
export const EighthRest: React.FC<SymbolProps> = ({ className = '' }) => (
  <g className={className}>
    <circle cx="8" cy="-4" r="3" fill="currentColor" />
    <path
      d="M 10 -4 Q 14 4 8 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </g>
);

/**
 * Sixteenth rest symbol
 */
export const SixteenthRest: React.FC<SymbolProps> = ({ className = '' }) => (
  <g className={className}>
    <circle cx="8" cy="-8" r="2.5" fill="currentColor" />
    <circle cx="10" cy="-2" r="2.5" fill="currentColor" />
    <path
      d="M 9 -8 Q 16 2 8 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </g>
);

/**
 * Complete quarter note (head + stem)
 */
export const QuarterNote: React.FC<SymbolProps> = ({ className = '' }) => (
  <g className={className}>
    <NoteHeadFilled />
    <NoteStem />
  </g>
);

/**
 * Complete eighth note (head + stem + flag)
 */
export const EighthNote: React.FC<SymbolProps> = ({ className = '' }) => (
  <g className={className}>
    <NoteHeadFilled />
    <NoteStem />
    <SingleFlag />
  </g>
);

/**
 * Complete sixteenth note (head + stem + double flag)
 */
export const SixteenthNote: React.FC<SymbolProps> = ({ className = '' }) => (
  <g className={className}>
    <NoteHeadFilled />
    <NoteStem />
    <DoubleFlag />
  </g>
);

/**
 * Two beamed eighth notes
 */
export const TwoEighthsBeamed: React.FC<SymbolProps> = ({ className = '' }) => (
  <g className={className}>
    <g transform="translate(0, 0)">
      <NoteHeadFilled />
      <NoteStem />
    </g>
    <g transform="translate(24, 0)">
      <NoteHeadFilled />
      <NoteStem x={10.5} />
    </g>
    <NoteBeam x1={10.5} x2={34.5} />
  </g>
);

/**
 * Four beamed sixteenth notes
 */
export const FourSixteenthsBeamed: React.FC<SymbolProps> = ({ className = '' }) => (
  <g className={className}>
    {[0, 14, 28, 42].map((offset, i) => (
      <g key={i} transform={`translate(${offset}, 0)`}>
        <NoteHeadFilled />
        <NoteStem />
      </g>
    ))}
    <NoteBeam x1={10.5} x2={52.5} double />
  </g>
);

/**
 * Three triplet notes
 */
export const TripletNotes: React.FC<SymbolProps> = ({ className = '' }) => (
  <g className={className}>
    {[0, 18, 36].map((offset, i) => (
      <g key={i} transform={`translate(${offset}, 0)`}>
        <NoteHeadFilled />
        <NoteStem />
      </g>
    ))}
    <NoteBeam x1={10.5} x2={46.5} />
    <TripletBracket width={57} />
  </g>
);

/**
 * Eighth note followed by two sixteenth notes (beamed)
 */
export const EighthTwoSixteenthsBeamed: React.FC<SymbolProps> = ({ className = '' }) => (
  <g className={className}>
    {/* Eighth note */}
    <g transform="translate(0, 0)">
      <NoteHeadFilled />
      <NoteStem />
    </g>
    {/* First sixteenth */}
    <g transform="translate(24, 0)">
      <NoteHeadFilled />
      <NoteStem />
    </g>
    {/* Second sixteenth */}
    <g transform="translate(38, 0)">
      <NoteHeadFilled />
      <NoteStem />
    </g>
    {/* Primary beam connecting all three notes */}
    <NoteBeam x1={10.5} x2={48.5} />
    {/* Secondary beam only for the two sixteenths */}
    <rect x={34.5} y={-10} width={14} height="4" fill="currentColor" />
  </g>
);

/**
 * Two sixteenth notes followed by eighth note (beamed)
 */
export const TwoSixteenthsEighthBeamed: React.FC<SymbolProps> = ({ className = '' }) => (
  <g className={className}>
    {/* First sixteenth */}
    <g transform="translate(0, 0)">
      <NoteHeadFilled />
      <NoteStem />
    </g>
    {/* Second sixteenth */}
    <g transform="translate(14, 0)">
      <NoteHeadFilled />
      <NoteStem />
    </g>
    {/* Eighth note */}
    <g transform="translate(38, 0)">
      <NoteHeadFilled />
      <NoteStem />
    </g>
    {/* Primary beam connecting all three notes */}
    <NoteBeam x1={10.5} x2={48.5} />
    {/* Secondary beam only for the two sixteenths */}
    <rect x={10.5} y={-10} width={14} height="4" fill="currentColor" />
  </g>
);

/**
 * Sixteenth, eighth, sixteenth (beamed)
 */
export const SixteenthEighthSixteenthBeamed: React.FC<SymbolProps> = ({ className = '' }) => (
  <g className={className}>
    {/* First sixteenth */}
    <g transform="translate(0, 0)">
      <NoteHeadFilled />
      <NoteStem />
    </g>
    {/* Eighth note */}
    <g transform="translate(28, 0)">
      <NoteHeadFilled />
      <NoteStem />
    </g>
    {/* Second sixteenth */}
    <g transform="translate(42, 0)">
      <NoteHeadFilled />
      <NoteStem />
    </g>
    {/* Primary beam connecting all three notes */}
    <NoteBeam x1={10.5} x2={52.5} />
    {/* Partial secondary beams (flags) for first and last sixteenths */}
    <rect x={10.5} y={-10} width={8} height="4" fill="currentColor" />
    <rect x={44.5} y={-10} width={8} height="4" fill="currentColor" />
  </g>
);

/**
 * Four beamed eighth notes
 */
export const FourEighthsBeamed: React.FC<SymbolProps> = ({ className = '' }) => (
  <g className={className}>
    {[0, 16, 32, 48].map((offset, i) => (
      <g key={i} transform={`translate(${offset}, 0)`}>
        <NoteHeadFilled />
        <NoteStem />
      </g>
    ))}
    {/* Single beam connecting all four notes */}
    <NoteBeam x1={10.5} x2={58.5} />
  </g>
);

/**
 * Dotted eighth note followed by sixteenth note (beamed)
 */
export const DottedEighthSixteenthBeamed: React.FC<SymbolProps> = ({ className = '' }) => (
  <g className={className}>
    {/* Dotted eighth note */}
    <g transform="translate(0, 0)">
      <NoteHeadFilled />
      <NoteStem />
      {/* Dot for dotted note */}
      <circle cx="14" cy="12" r="2" fill="currentColor" />
    </g>
    {/* Sixteenth note */}
    <g transform="translate(42, 0)">
      <NoteHeadFilled />
      <NoteStem />
    </g>
    {/* Primary beam connecting both notes */}
    <NoteBeam x1={10.5} x2={52.5} />
    {/* Secondary beam only for the sixteenth */}
    <rect x={44.5} y={-10} width={8} height="4" fill="currentColor" />
  </g>
);

/**
 * Sixteenth note followed by dotted eighth note (beamed)
 */
export const SixteenthDottedEighthBeamed: React.FC<SymbolProps> = ({ className = '' }) => (
  <g className={className}>
    {/* Sixteenth note */}
    <g transform="translate(0, 0)">
      <NoteHeadFilled />
      <NoteStem />
    </g>
    {/* Dotted eighth note */}
    <g transform="translate(28, 0)">
      <NoteHeadFilled />
      <NoteStem />
      {/* Dot for dotted note */}
      <circle cx="14" cy="12" r="2" fill="currentColor" />
    </g>
    {/* Primary beam connecting both notes */}
    <NoteBeam x1={10.5} x2={38.5} />
    {/* Secondary beam only for the sixteenth */}
    <rect x={10.5} y={-10} width={8} height="4" fill="currentColor" />
  </g>
);

/**
 * Sixteenth rest followed by three beamed sixteenth notes
 */
export const RestThreeSixteenthsBeamed: React.FC<SymbolProps> = ({ className = '' }) => (
  <g className={className}>
    {/* Sixteenth rest */}
    <g transform="translate(0, 0)">
      <SixteenthRest />
    </g>
    {/* Three beamed sixteenth notes */}
    <g transform="translate(14, 0)">
      <NoteHeadFilled />
      <NoteStem />
    </g>
    <g transform="translate(28, 0)">
      <NoteHeadFilled />
      <NoteStem />
    </g>
    <g transform="translate(42, 0)">
      <NoteHeadFilled />
      <NoteStem />
    </g>
    {/* Double beam connecting the three notes */}
    <NoteBeam x1={24.5} x2={52.5} double />
  </g>
);

/**
 * Three beamed sixteenth notes followed by sixteenth rest
 */
export const ThreeSixteenthsRestBeamed: React.FC<SymbolProps> = ({ className = '' }) => (
  <g className={className}>
    {/* Three beamed sixteenth notes */}
    <g transform="translate(0, 0)">
      <NoteHeadFilled />
      <NoteStem />
    </g>
    <g transform="translate(14, 0)">
      <NoteHeadFilled />
      <NoteStem />
    </g>
    <g transform="translate(28, 0)">
      <NoteHeadFilled />
      <NoteStem />
    </g>
    {/* Sixteenth rest */}
    <g transform="translate(42, 0)">
      <SixteenthRest />
    </g>
    {/* Double beam connecting the three notes */}
    <NoteBeam x1={10.5} x2={38.5} double />
  </g>
);
