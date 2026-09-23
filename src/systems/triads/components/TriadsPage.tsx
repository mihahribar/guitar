import { FretboardDisplay, SystemHelp } from '@/shared';
import {
  CHROMATIC_TO_NOTE_NAME,
  getNoteNameAtFret,
  shouldShowNoteName,
} from '@/shared/utils/musicTheory';
import { useTriadsKeyboard } from '../hooks/useTriadsKeyboard';
import { useTriadsLogic } from '../hooks/useTriadsLogic';
import { useTriadsState } from '../hooks/useTriadsState';
import { INVERSIONS, TRIAD_QUALITIES, TRIADS_HELP } from '../constants';
import TriadsNavigation from './TriadsNavigation';
import TriadsToggles from './TriadsToggles';

const never = () => false;

/**
 * Triads visualizer
 *
 * Walks close-voiced triads up the neck on three-string sets, one colour per
 * inversion, with each dot labelled by its chord tone. Any number of
 * inversions and string sets can be stacked on the fretboard at once.
 */
export default function TriadsPage() {
  const { state, actions } = useTriadsState();
  const { root, quality, stringSets, inversions, wholeNeck, showAllNotes } = state;
  const { fretRange, shouldShowDot, getDotStyle, getDotLabel, isKeyNote, scrollToFret } =
    useTriadsLogic(state);

  useTriadsKeyboard({
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
  const qualityName = TRIAD_QUALITIES[quality].name.toLowerCase();
  const selectionLabel = `${qualityName} triad, ${inversions
    .map((inversion) => INVERSIONS[inversion].name)
    .join(', ')}`;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <TriadsNavigation
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

      <TriadsToggles
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

      <SystemHelp content={TRIADS_HELP} />
    </div>
  );
}
