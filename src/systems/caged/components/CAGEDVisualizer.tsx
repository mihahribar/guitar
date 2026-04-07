import { useCallback, useMemo } from 'react';
import { useCAGEDLogic } from '../hooks/useCAGEDLogic';
import { useCAGEDSequence } from '../hooks/useCAGEDSequence';
import { useCAGEDState } from '../hooks/useCAGEDState';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import CAGEDNavigation from './CAGEDNavigation';
import ViewModeToggles from './ViewModeToggles';
import { FretboardDisplay } from '@/shared';
import {
  CAGED_SHAPES_BY_QUALITY,
  PENTATONIC_BOX_PATTERNS,
  CAGED_TO_PENTATONIC_BOX,
} from '../constants';

/**
 * Expand a CAGED shape pattern into its absolute fret numbers.
 * Returns only the playable (non-muted) frets, with the same offset semantics
 * used throughout the visualizer (open string when basePosition === 0, otherwise
 * the barre falls on basePosition).
 */
function expandShapeFrets(pattern: readonly number[], basePosition: number): number[] {
  return pattern
    .map((fret) => {
      if (fret === -1) return -1;
      if (fret === 0 && basePosition === 0) return 0;
      if (fret === 0 && basePosition > 0) return basePosition;
      return fret + basePosition;
    })
    .filter((f) => f >= 0);
}

/**
 * Main CAGED chord system visualizer component
 *
 * Orchestrates the complete CAGED visualization experience by combining state management,
 * music theory calculations, and user interaction. Provides interactive fretboard display
 * with multiple viewing modes, keyboard navigation, and educational overlays.
 *
 * @returns JSX component with complete CAGED visualizer interface
 *
 * @features
 * - Interactive fretboard with CAGED chord shapes
 * - Major and minor chord quality support
 * - Multiple display modes (single shape, all shapes, pentatonic overlay)
 * - Keyboard navigation and accessibility features
 * - Responsive design for mobile and desktop
 * - Real-time visual feedback and educational information
 *
 * @stateManagement
 * Uses multiple custom hooks for separation of concerns:
 * - useCAGEDState: Global visualizer state (selected chord, mode toggles)
 * - useCAGEDLogic: Music theory calculations and fretboard positioning
 * - useCAGEDSequence: Dynamic chord sequence generation
 * - useKeyboardNavigation: Accessibility and keyboard shortcuts
 *
 * @musicTheory
 * Implements complete CAGED system with:
 * - 5 moveable chord shapes (C, A, G, E, D)
 * - Major and minor chord variations
 * - Pentatonic scale overlays
 * - Root note identification and highlighting
 * - Gradient blending for overlapping shapes
 */
export default function CAGEDVisualizer() {
  const { state, actions } = useCAGEDState();
  const {
    selectedChord,
    chordQuality,
    currentPosition,
    showAllShapes,
    showPentatonic,
    showAllNotes,
    showScale,
    selectedScale,
  } = state;

  // Use custom hooks for music theory logic and calculations
  const cagedSequence = useCAGEDSequence(selectedChord);
  const {
    getShapeFret,
    getShapesAtPosition,
    createGradientStyle,
    isPentatonicNote,
    isScaleNote,
    getNoteNameAtFret,
    shouldShowNoteName,
  } = useCAGEDLogic(selectedChord, chordQuality, cagedSequence, selectedScale);

  // Active entry in the (extended) CAGED walk. The shape letter and the actual base
  // fret both come from the tuple — the same shape can appear multiple times across
  // the neck so we can't look base position up by shape letter alone.
  const currentEntry = cagedSequence[currentPosition] ?? cagedSequence[0];
  const currentShape = currentEntry.shape;
  const currentBasePosition = currentEntry.basePosition;

  // Check if a dot should be shown at this position
  const shouldShowDot = useCallback(
    (stringIndex: number, fretNumber: number) => {
      if (showAllShapes) {
        return getShapesAtPosition(stringIndex, fretNumber).length > 0;
      } else {
        // Show only current shape
        const shapeFret = getShapeFret(currentShape, stringIndex, currentBasePosition);
        return shapeFret === fretNumber && shapeFret > 0;
      }
    },
    [showAllShapes, getShapesAtPosition, currentShape, currentBasePosition, getShapeFret]
  );

  // Get color/style for a dot at this position
  const getDotStyle = useCallback(
    (stringIndex: number, fretNumber: number) => {
      if (showAllShapes) {
        const shapesHere = getShapesAtPosition(stringIndex, fretNumber);
        return createGradientStyle(shapesHere);
      } else {
        return { backgroundColor: CAGED_SHAPES_BY_QUALITY[chordQuality][currentShape].color };
      }
    },
    [showAllShapes, getShapesAtPosition, createGradientStyle, chordQuality, currentShape]
  );

  // Check if this is a root note for the current shape
  const isRootNote = useCallback(
    (stringIndex: number, fretNumber: number) => {
      if (showAllShapes) {
        // When showing all shapes, check if any shape has a root note at this position
        const shapesHere = getShapesAtPosition(stringIndex, fretNumber);
        return shapesHere.some((shapeKey) => {
          const shape = CAGED_SHAPES_BY_QUALITY[chordQuality][shapeKey];
          return shape.rootNotes.includes(stringIndex);
        });
      } else {
        // For single shape view, check if current shape has root note here
        const shape = CAGED_SHAPES_BY_QUALITY[chordQuality][currentShape];
        return shape.rootNotes.includes(stringIndex) && shouldShowDot(stringIndex, fretNumber);
      }
    },
    [showAllShapes, getShapesAtPosition, chordQuality, currentShape, shouldShowDot]
  );

  // Check if a pentatonic dot should be shown at this position
  const shouldShowPentatonicDot = useCallback(
    (stringIndex: number, fretNumber: number) => {
      if (!isPentatonicNote(stringIndex, fretNumber)) {
        return false;
      }

      // If showing all shapes, show all pentatonic notes (current behavior)
      if (showAllShapes) {
        return true;
      }

      // When showing single shape, use the specific pentatonic box pattern
      // that corresponds to the current CAGED shape
      const boxNumber = CAGED_TO_PENTATONIC_BOX[currentShape];
      const boxPattern = PENTATONIC_BOX_PATTERNS[chordQuality][boxNumber];

      if (!boxPattern) {
        return false;
      }

      // Calculate the actual fret range for this pentatonic box
      const boxStartFret = Math.max(0, currentBasePosition + boxPattern.startFret);
      const boxEndFret = currentBasePosition + boxPattern.endFret;

      return fretNumber >= boxStartFret && fretNumber <= boxEndFret;
    },
    [isPentatonicNote, showAllShapes, currentShape, currentBasePosition, chordQuality]
  );

  // Check if a scale dot should be shown at this position
  const shouldShowScaleDot = useCallback(
    (stringIndex: number, fretNumber: number) => {
      if (!isScaleNote(stringIndex, fretNumber)) {
        return false;
      }

      // If showing all shapes, show all scale notes across entire fretboard
      if (showAllShapes) {
        return true;
      }

      // When showing single shape, scope to shape's fret range ±2 frets
      const shape = CAGED_SHAPES_BY_QUALITY[chordQuality][currentShape];
      const shapeFrets = expandShapeFrets(shape.pattern, currentBasePosition);

      if (shapeFrets.length === 0) return false;

      const minFret = Math.max(0, Math.min(...shapeFrets) - 2);
      const maxFret = Math.max(...shapeFrets) + 2;

      return fretNumber >= minFret && fretNumber <= maxFret;
    },
    [isScaleNote, showAllShapes, currentShape, currentBasePosition, chordQuality]
  );

  // Compute the horizontal scroll target for the fretboard: the center fret of the
  // currently active CAGED shape. Skipped when "show all shapes" is on, since there is
  // no single active shape to follow.
  const activeCenterFret = useMemo(() => {
    if (showAllShapes) return undefined;
    const shape = CAGED_SHAPES_BY_QUALITY[chordQuality][currentShape];
    const frets = expandShapeFrets(shape.pattern, currentBasePosition);
    if (frets.length === 0) return undefined;
    return (Math.min(...frets) + Math.max(...frets)) / 2;
  }, [showAllShapes, currentShape, currentBasePosition, chordQuality]);

  const nextPosition = useCallback(() => {
    actions.nextPosition(cagedSequence.length);
  }, [actions, cagedSequence.length]);

  const previousPosition = useCallback(() => {
    actions.previousPosition(cagedSequence.length);
  }, [actions, cagedSequence.length]);

  // Add keyboard navigation
  useKeyboardNavigation({
    showAllShapes,
    cagedSequenceLength: cagedSequence.length,
    onPreviousPosition: previousPosition,
    onNextPosition: nextPosition,
    onSetPosition: actions.setPosition,
    onToggleShowAllShapes: actions.toggleShowAllShapes,
    onToggleShowPentatonic: actions.toggleShowPentatonic,
    onToggleShowAllNotes: actions.toggleShowAllNotes,
    onToggleShowScale: actions.toggleShowScale,
  });

  return (
    <div className="max-w-6xl mx-auto p-8">
      <CAGEDNavigation
        selectedChord={selectedChord}
        chordQuality={chordQuality}
        currentPosition={currentPosition}
        cagedSequence={cagedSequence}
        showAllShapes={showAllShapes}
        onChordChange={actions.setChord}
        onChordQualityChange={actions.setChordQuality}
        onPreviousPosition={previousPosition}
        onNextPosition={nextPosition}
        onSetPosition={actions.setPosition}
      />

      <FretboardDisplay
        selectedRoot={selectedChord}
        currentPattern={currentShape}
        showAllPatterns={showAllShapes}
        showOverlay={showPentatonic}
        showNoteNames={showAllNotes}
        shouldShowDot={shouldShowDot}
        getDotStyle={getDotStyle}
        isKeyNote={isRootNote}
        shouldShowOverlayDot={shouldShowPentatonicDot}
        shouldShowNoteName={shouldShowNoteName}
        getNoteNameAtFret={getNoteNameAtFret}
        showScaleOverlay={showScale}
        shouldShowScaleDot={shouldShowScaleDot}
        ariaLabel={`Guitar fretboard showing ${selectedChord} ${chordQuality} chord${showAllShapes ? ' in all CAGED positions' : ''}`}
        keyNoteIndicator="R"
        scrollToFret={activeCenterFret}
      />

      <ViewModeToggles
        selectedChord={selectedChord}
        chordQuality={chordQuality}
        showAllShapes={showAllShapes}
        showPentatonic={showPentatonic}
        showAllNotes={showAllNotes}
        showScale={showScale}
        selectedScale={selectedScale}
        onToggleShowAllShapes={actions.toggleShowAllShapes}
        onToggleShowPentatonic={actions.toggleShowPentatonic}
        onToggleShowAllNotes={actions.toggleShowAllNotes}
        onToggleShowScale={actions.toggleShowScale}
        onSetScaleType={actions.setScaleType}
      />
    </div>
  );
}
