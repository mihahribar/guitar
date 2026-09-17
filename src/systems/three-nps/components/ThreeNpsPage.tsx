import { FretboardDisplay, SystemHelp } from '@/shared';
import {
  CHROMATIC_TO_NOTE_NAME,
  getNoteNameAtFret,
  shouldShowNoteName,
} from '@/shared/utils/musicTheory';
import { useThreeNpsKeyboard } from '../hooks/useThreeNpsKeyboard';
import { useThreeNpsLogic } from '../hooks/useThreeNpsLogic';
import { useThreeNpsState } from '../hooks/useThreeNpsState';
import { MODES, THREE_NPS_HELP } from '../constants';
import ThreeNpsNavigation from './ThreeNpsNavigation';
import ThreeNpsToggles from './ThreeNpsToggles';

const never = () => false;

/**
 * 3NPS (three notes per string) major scale visualizer
 *
 * Walks the parent major scale up the neck as 2-string "dominoes" (or full
 * 6-string positions), one per mode, each mode with its own colour. Any number
 * of modes can be stacked on the fretboard at once.
 */
export default function ThreeNpsPage() {
  const { state, actions } = useThreeNpsState();
  const { root, lowString, degrees, wholeNeck, allStrings, showAllNotes } = state;
  const {
    soloDegree,
    fretRange,
    shouldShowDot,
    getDotStyle,
    isKeyNote,
    keyNoteIndicator,
    scrollToFret,
  } = useThreeNpsLogic(state);

  useThreeNpsKeyboard({
    allStrings,
    onNext: actions.next,
    onPrevious: actions.previous,
    onPairUp: actions.pairUp,
    onPairDown: actions.pairDown,
    onToggleMode: actions.toggleMode,
    onSoloMode: actions.soloMode,
    onToggleAllModes: actions.toggleAllModes,
    onToggleWholeNeck: actions.toggleWholeNeck,
    onToggleAllStrings: actions.toggleAllStrings,
    onToggleShowAllNotes: actions.toggleShowAllNotes,
  });

  const rootName = CHROMATIC_TO_NOTE_NAME[root];
  const selectionLabel =
    soloDegree !== undefined
      ? `${MODES[soloDegree].name} pattern`
      : `${degrees.map((degree) => MODES[degree].name).join(', ')} patterns`;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <ThreeNpsNavigation
        root={root}
        lowString={lowString}
        degrees={degrees}
        allStrings={allStrings}
        onRootChange={actions.setRoot}
        onStringPairChange={actions.setStringPair}
        onPrevious={actions.previous}
        onNext={actions.next}
        onToggleMode={actions.toggleMode}
        onSoloMode={actions.soloMode}
        onToggleAllModes={actions.toggleAllModes}
      />

      <FretboardDisplay
        selectedRoot={rootName}
        currentPattern={selectionLabel}
        showAllPatterns={wholeNeck}
        showOverlay={false}
        showNoteNames={showAllNotes}
        shouldShowDot={shouldShowDot}
        getDotStyle={getDotStyle}
        isKeyNote={isKeyNote}
        shouldShowOverlayDot={never}
        shouldShowNoteName={shouldShowNoteName}
        getNoteNameAtFret={getNoteNameAtFret}
        ariaLabel={`Guitar fretboard showing ${rootName} major 3 notes per string ${selectionLabel}${
          wholeNeck ? ' along the whole neck' : ''
        }`}
        keyNoteIndicator={keyNoteIndicator}
        scrollToFret={scrollToFret}
      />

      <ThreeNpsToggles
        root={root}
        lowString={lowString}
        degrees={degrees}
        fretRange={fretRange}
        wholeNeck={wholeNeck}
        allStrings={allStrings}
        showAllNotes={showAllNotes}
        onToggleWholeNeck={actions.toggleWholeNeck}
        onToggleAllStrings={actions.toggleAllStrings}
        onToggleShowAllNotes={actions.toggleShowAllNotes}
      />

      <SystemHelp content={THREE_NPS_HELP} />
    </div>
  );
}
