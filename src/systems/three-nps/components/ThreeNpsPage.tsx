import { FretboardDisplay } from '@/shared';
import {
  CHROMATIC_TO_NOTE_NAME,
  getNoteNameAtFret,
  shouldShowNoteName,
} from '@/shared/utils/musicTheory';
import { useThreeNpsKeyboard } from '../hooks/useThreeNpsKeyboard';
import { useThreeNpsLogic } from '../hooks/useThreeNpsLogic';
import { useThreeNpsState } from '../hooks/useThreeNpsState';
import { MODES } from '../constants';
import ThreeNpsNavigation from './ThreeNpsNavigation';
import ThreeNpsToggles from './ThreeNpsToggles';

const never = () => false;

/**
 * 3NPS (three notes per string) major scale visualizer
 *
 * Walks the parent major scale up the neck as 2-string "dominoes" (or full
 * 6-string positions), one per mode, each mode with its own colour.
 */
export default function ThreeNpsPage() {
  const { state, actions } = useThreeNpsState();
  const { root, lowString, degree, showAllModes, allStrings, showAllNotes } = state;
  const {
    currentPattern,
    fretRange,
    shouldShowDot,
    getDotStyle,
    isKeyNote,
    keyNoteIndicator,
    scrollToFret,
  } = useThreeNpsLogic(state);

  useThreeNpsKeyboard({
    showAllModes,
    allStrings,
    onNext: actions.next,
    onPrevious: actions.previous,
    onPairUp: actions.pairUp,
    onPairDown: actions.pairDown,
    onSetMode: actions.setMode,
    onToggleShowAllModes: actions.toggleShowAllModes,
    onToggleAllStrings: actions.toggleAllStrings,
    onToggleShowAllNotes: actions.toggleShowAllNotes,
  });

  const rootName = CHROMATIC_TO_NOTE_NAME[root];
  const activeDegree = currentPattern?.degree ?? degree;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <ThreeNpsNavigation
        root={root}
        lowString={lowString}
        degree={activeDegree}
        showAllModes={showAllModes}
        allStrings={allStrings}
        onRootChange={actions.setRoot}
        onStringPairChange={actions.setStringPair}
        onPrevious={actions.previous}
        onNext={actions.next}
        onSetMode={actions.setMode}
      />

      <FretboardDisplay
        selectedRoot={rootName}
        currentPattern={MODES[activeDegree].name}
        showAllPatterns={showAllModes}
        showOverlay={false}
        showNoteNames={showAllNotes}
        shouldShowDot={shouldShowDot}
        getDotStyle={getDotStyle}
        isKeyNote={isKeyNote}
        shouldShowOverlayDot={never}
        shouldShowNoteName={shouldShowNoteName}
        getNoteNameAtFret={getNoteNameAtFret}
        ariaLabel={`Guitar fretboard showing ${rootName} major 3 notes per string ${
          showAllModes ? 'in all modes' : `${MODES[activeDegree].name} pattern`
        }`}
        keyNoteIndicator={keyNoteIndicator}
        scrollToFret={scrollToFret}
      />

      <ThreeNpsToggles
        root={root}
        lowString={lowString}
        degree={activeDegree}
        fretRange={fretRange}
        showAllModes={showAllModes}
        allStrings={allStrings}
        onToggleShowAllModes={actions.toggleShowAllModes}
        showAllNotes={showAllNotes}
        onToggleAllStrings={actions.toggleAllStrings}
        onToggleShowAllNotes={actions.toggleShowAllNotes}
      />
    </div>
  );
}
