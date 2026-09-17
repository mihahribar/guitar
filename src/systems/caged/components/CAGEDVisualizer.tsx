import { useCallback, useMemo } from 'react';
import { useCAGEDLogic } from '../hooks/useCAGEDLogic';
import { useCAGEDSequence } from '../hooks/useCAGEDSequence';
import { useCAGEDState } from '../hooks/useCAGEDState';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import CAGEDNavigation from './CAGEDNavigation';
import ViewModeToggles from './ViewModeToggles';
import { FretboardDisplay, SystemHelp } from '@/shared';
import { STANDARD_TUNING, getNoteAtFret } from '@/shared/utils/musicTheory';
import {
  CAGED_SHAPES_BY_QUALITY,
  PENTATONIC_BOX_PATTERNS,
  CAGED_TO_PENTATONIC_BOX,
  CHROMATIC_VALUES,
  CAGED_HELP,
} from '../constants';
import { dedupeUnisonsByLowestFret, positionKey } from '../utils/scaleOverlay';

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
    selectedPositions,
    showPentatonic,
    showAllNotes,
    showScale,
    selectedScale,
  } = state;

  // Use custom hooks for music theory logic and calculations
  const cagedSequence = useCAGEDSequence(selectedChord);

  // Entries of the (extended) CAGED walk that are currently drawn. The shape letter
  // and the actual base fret both come from the tuple — the same shape can appear
  // multiple times across the neck so we can't look base position up by shape letter.
  const selectedEntries = useMemo(() => {
    const entries = selectedPositions
      .map((position) => cagedSequence[position])
      .filter((entry) => entry !== undefined);
    return entries.length > 0 ? entries : cagedSequence.slice(0, 1);
  }, [selectedPositions, cagedSequence]);

  // Every position selected = the full-neck view, where the overlays cover the
  // whole fretboard instead of boxing themselves around the selected shapes.
  const showAllShapes = selectedPositions.length >= cagedSequence.length;

  const {
    getShapesAtPosition,
    createGradientStyle,
    isPentatonicNote,
    isScaleNote,
    getNoteNameAtFret,
    shouldShowNoteName,
  } = useCAGEDLogic(selectedChord, chordQuality, selectedEntries, selectedScale);

  // Check if a dot should be shown at this position
  const shouldShowDot = useCallback(
    (stringIndex: number, fretNumber: number) =>
      getShapesAtPosition(stringIndex, fretNumber).length > 0,
    [getShapesAtPosition]
  );

  // Get color/style for a dot at this position. A single shape gets its solid
  // colour; notes shared by several selected shapes are split between them.
  const getDotStyle = useCallback(
    (stringIndex: number, fretNumber: number) =>
      createGradientStyle(getShapesAtPosition(stringIndex, fretNumber)),
    [getShapesAtPosition, createGradientStyle]
  );

  // Check if this is a root note. Any shown note whose pitch class matches the
  // chord root is a root — this marks every octave of the root within a shape
  // (e.g. the C shape carries the root on two strings), not just one.
  const isRootNote = useCallback(
    (stringIndex: number, fretNumber: number) => {
      if (!shouldShowDot(stringIndex, fretNumber)) {
        return false;
      }
      return getNoteAtFret(stringIndex, fretNumber) === CHROMATIC_VALUES[selectedChord];
    },
    [shouldShowDot, selectedChord]
  );

  // Fret window of the pentatonic box belonging to each selected shape. The
  // overlay shows the union, so stacking shapes stacks their boxes too.
  const pentatonicBoxRanges = useMemo(() => {
    if (showAllShapes) return null;

    return selectedEntries.flatMap(({ shape, basePosition }) => {
      const boxPattern = PENTATONIC_BOX_PATTERNS[chordQuality][CAGED_TO_PENTATONIC_BOX[shape]];
      if (!boxPattern) return [];
      return [
        {
          start: Math.max(0, basePosition + boxPattern.startFret),
          end: basePosition + boxPattern.endFret,
        },
      ];
    });
  }, [showAllShapes, selectedEntries, chordQuality]);

  // Check if a pentatonic dot should be shown at this position
  const shouldShowPentatonicDot = useCallback(
    (stringIndex: number, fretNumber: number) => {
      if (!isPentatonicNote(stringIndex, fretNumber)) {
        return false;
      }

      // Full-neck view: every pentatonic note
      if (!pentatonicBoxRanges) {
        return true;
      }

      return pentatonicBoxRanges.some(({ start, end }) => fretNumber >= start && fretNumber <= end);
    },
    [isPentatonicNote, pentatonicBoxRanges]
  );

  // Pre-compute which scale dots the selected boxes should render. Scale notes
  // are collected within each shape's fret range ±1, then unison duplicates
  // (same pitch reachable on two strings, e.g. G fret 13 == B fret 9) are
  // removed per box, keeping the lowest-fret occurrence so the box stays tight.
  // Returns null in the full-neck view, where the whole map is intended.
  const scaleDotKeys = useMemo(() => {
    if (showAllShapes) return null;

    const keys = new Set<string>();
    for (const { shape, basePosition } of selectedEntries) {
      const shapeFrets = expandShapeFrets(
        CAGED_SHAPES_BY_QUALITY[chordQuality][shape].pattern,
        basePosition
      );
      if (shapeFrets.length === 0) continue;

      const minFret = Math.max(0, Math.min(...shapeFrets) - 1);
      const maxFret = Math.max(...shapeFrets) + 1;

      const candidates: { stringIndex: number; fretNumber: number }[] = [];
      for (let stringIndex = 0; stringIndex < STANDARD_TUNING.length; stringIndex++) {
        for (let fretNumber = minFret; fretNumber <= maxFret; fretNumber++) {
          if (isScaleNote(stringIndex, fretNumber)) {
            candidates.push({ stringIndex, fretNumber });
          }
        }
      }

      for (const { stringIndex, fretNumber } of dedupeUnisonsByLowestFret(candidates)) {
        keys.add(positionKey(stringIndex, fretNumber));
      }
    }

    return keys;
  }, [showAllShapes, chordQuality, selectedEntries, isScaleNote]);

  // Check if a scale dot should be shown at this position
  const shouldShowScaleDot = useCallback(
    (stringIndex: number, fretNumber: number) => {
      if (!isScaleNote(stringIndex, fretNumber)) {
        return false;
      }

      // Full-neck view: all scale notes across the entire fretboard
      if (!scaleDotKeys) {
        return true;
      }

      return scaleDotKeys.has(positionKey(stringIndex, fretNumber));
    },
    [isScaleNote, scaleDotKeys]
  );

  // Horizontal scroll target for the fretboard: the center of the frets spanned by
  // the selected shapes. Skipped in the full-neck view, which has nothing to follow.
  const activeCenterFret = useMemo(() => {
    if (showAllShapes) return undefined;
    const frets = selectedEntries.flatMap(({ shape, basePosition }) =>
      expandShapeFrets(CAGED_SHAPES_BY_QUALITY[chordQuality][shape].pattern, basePosition)
    );
    if (frets.length === 0) return undefined;
    return (Math.min(...frets) + Math.max(...frets)) / 2;
  }, [showAllShapes, selectedEntries, chordQuality]);

  // Add keyboard navigation
  useKeyboardNavigation({
    cagedSequenceLength: cagedSequence.length,
    onPreviousPosition: actions.previousPosition,
    onNextPosition: actions.nextPosition,
    onTogglePosition: actions.togglePosition,
    onSoloPosition: actions.soloPosition,
    onToggleAllPositions: actions.toggleAllPositions,
    onToggleShowPentatonic: actions.toggleShowPentatonic,
    onToggleShowAllNotes: actions.toggleShowAllNotes,
    onToggleShowScale: actions.toggleShowScale,
  });

  const selectionLabel = showAllShapes
    ? 'all CAGED positions'
    : selectedEntries
        .map(({ shape, basePosition }) => `${shape} shape at fret ${basePosition}`)
        .join(', ');

  return (
    <div className="max-w-6xl mx-auto p-8">
      <CAGEDNavigation
        selectedChord={selectedChord}
        chordQuality={chordQuality}
        selectedPositions={selectedPositions}
        cagedSequence={cagedSequence}
        onChordChange={actions.setChord}
        onChordQualityChange={actions.setChordQuality}
        onPreviousPosition={actions.previousPosition}
        onNextPosition={actions.nextPosition}
        onTogglePosition={actions.togglePosition}
        onSoloPosition={actions.soloPosition}
      />

      <FretboardDisplay
        selectedRoot={selectedChord}
        currentPattern={selectionLabel}
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
        ariaLabel={`Guitar fretboard showing ${selectedChord} ${chordQuality} chord — ${selectionLabel}`}
        keyNoteIndicator="R"
        scrollToFret={activeCenterFret}
      />

      <ViewModeToggles
        selectedChord={selectedChord}
        chordQuality={chordQuality}
        selectedCount={selectedEntries.length}
        showAllShapes={showAllShapes}
        showPentatonic={showPentatonic}
        showAllNotes={showAllNotes}
        showScale={showScale}
        selectedScale={selectedScale}
        onToggleShowAllShapes={actions.toggleAllPositions}
        onToggleShowPentatonic={actions.toggleShowPentatonic}
        onToggleShowAllNotes={actions.toggleShowAllNotes}
        onToggleShowScale={actions.toggleShowScale}
        onSetScaleType={actions.setScaleType}
      />

      <SystemHelp content={CAGED_HELP} />
    </div>
  );
}
