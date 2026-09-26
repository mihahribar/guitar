import { FretboardDisplay, SystemHelp } from '@/shared';
import {
  CHROMATIC_TO_NOTE_NAME,
  getNoteNameAtFret,
  shouldShowNoteName,
} from '@/shared/utils/musicTheory';
import { useSeventhsKeyboard } from '../hooks/useSeventhsKeyboard';
import { useSeventhsLogic } from '../hooks/useSeventhsLogic';
import { useSeventhsState } from '../hooks/useSeventhsState';
import { INVERSIONS, SEVENTH_QUALITIES, SEVENTHS_HELP } from '../constants';
import SeventhsNavigation from './SeventhsNavigation';
import SeventhsToggles from './SeventhsToggles';

const never = () => false;

/**
 * Seventh chords visualizer
 *
 * Walks drop 2 and drop 3 seventh chords up the neck on four-string sets, one
 * colour per inversion, with each dot labelled by its chord tone. Any number
 * of inversions and string sets can be stacked on the fretboard at once.
 */
export default function SeventhsPage() {
  const { state, actions } = useSeventhsState();
  const { root, quality, stringSets, inversions, wholeNeck, showAllNotes } = state;
  const { fretRange, shouldShowDot, getDotStyle, getDotLabel, isKeyNote, scrollToFret } =
    useSeventhsLogic(state);

  useSeventhsKeyboard({
    onNext: actions.next,
    onPrevious: actions.previous,
    onSetsUp: actions.setsUp,
    onSetsDown: actions.setsDown,
    onToggleInversion: actions.toggleInversion,
    onSoloInversion: actions.soloInversion,
    onToggleAllInversions: actions.toggleAllInversions,
    onToggleWholeNeck: actions.toggleWholeNeck,
    onToggleShowAllNotes: actions.toggleShowAllNotes,
  });

  const rootName = CHROMATIC_TO_NOTE_NAME[root];
  const qualityName = SEVENTH_QUALITIES[quality].name.toLowerCase();
  const selectionLabel = `${qualityName} chord, ${inversions
    .map((inversion) => INVERSIONS[inversion].name)
    .join(', ')}`;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <SeventhsNavigation
        root={root}
        quality={quality}
        stringSets={stringSets}
        inversions={inversions}
        onRootChange={actions.setRoot}
        onQualityChange={actions.setQuality}
        onToggleStringSet={actions.toggleStringSet}
        onSoloStringSet={actions.soloStringSet}
        onPrevious={actions.previous}
        onNext={actions.next}
        onToggleInversion={actions.toggleInversion}
        onSoloInversion={actions.soloInversion}
        onToggleAllInversions={actions.toggleAllInversions}
      />

      <FretboardDisplay
        selectedRoot={rootName}
        currentPattern={selectionLabel}
        showAllPatterns={wholeNeck}
        showOverlay={false}
        showNoteNames={showAllNotes}
        shouldShowDot={shouldShowDot}
        getDotStyle={getDotStyle}
        getDotLabel={getDotLabel}
        isKeyNote={isKeyNote}
        shouldShowOverlayDot={never}
        shouldShowNoteName={shouldShowNoteName}
        getNoteNameAtFret={getNoteNameAtFret}
        ariaLabel={`Guitar fretboard showing ${rootName} ${selectionLabel}${
          wholeNeck ? ' along the whole neck' : ''
        }`}
        scrollToFret={scrollToFret}
      />

      <SeventhsToggles
        root={root}
        quality={quality}
        stringSets={stringSets}
        inversions={inversions}
        fretRange={fretRange}
        wholeNeck={wholeNeck}
        showAllNotes={showAllNotes}
        onToggleWholeNeck={actions.toggleWholeNeck}
        onToggleShowAllNotes={actions.toggleShowAllNotes}
      />

      <SystemHelp content={SEVENTHS_HELP} />
    </div>
  );
}
