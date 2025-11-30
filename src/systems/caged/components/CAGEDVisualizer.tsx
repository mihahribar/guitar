import { useCallback } from 'react';
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
  } = state;

  // Use custom hooks for music theory logic and calculations
  const cagedSequence = useCAGEDSequence(selectedChord);
  const {
    shapePositions,
    getShapeFret,
    getShapesAtPosition,
    createGradientStyle,
    isPentatonicNote,
    getNoteNameAtFret,
    shouldShowNoteName,
  } = useCAGEDLogic(selectedChord, chordQuality, cagedSequence);
  const currentShape = cagedSequence[currentPosition];

  // Check if a dot should be shown at this position
  const shouldShowDot = useCallback(
    (stringIndex: number, fretNumber: number) => {
      if (showAllShapes) {
        return getShapesAtPosition(stringIndex, fretNumber).length > 0;
      } else {
        // Show only current shape
        const basePosition = shapePositions[currentShape];
        const shapeFret = getShapeFret(currentShape, stringIndex, basePosition);
        return shapeFret === fretNumber && shapeFret > 0;
      }
    },
    [showAllShapes, getShapesAtPosition, shapePositions, currentShape, getShapeFret]
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
      const basePosition = shapePositions[currentShape];
      const boxNumber = CAGED_TO_PENTATONIC_BOX[currentShape];
      const boxPattern = PENTATONIC_BOX_PATTERNS[chordQuality][boxNumber];

      if (!boxPattern) {
        return false;
      }

      // Calculate the actual fret range for this pentatonic box
      const boxStartFret = Math.max(0, basePosition + boxPattern.startFret);
      const boxEndFret = basePosition + boxPattern.endFret;

      return fretNumber >= boxStartFret && fretNumber <= boxEndFret;
    },
    [isPentatonicNote, showAllShapes, shapePositions, currentShape, chordQuality]
  );

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
        ariaLabel={`Guitar fretboard showing ${selectedChord} ${chordQuality} chord${showAllShapes ? ' in all CAGED positions' : ''}`}
        keyNoteIndicator="R"
      />

      <ViewModeToggles
        selectedChord={selectedChord}
        chordQuality={chordQuality}
        showAllShapes={showAllShapes}
        showPentatonic={showPentatonic}
        showAllNotes={showAllNotes}
        onToggleShowAllShapes={actions.toggleShowAllShapes}
        onToggleShowPentatonic={actions.toggleShowPentatonic}
        onToggleShowAllNotes={actions.toggleShowAllNotes}
      />
    </div>
  );
}
