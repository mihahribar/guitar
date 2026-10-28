import FretboardDisplay from '../FretboardDisplay';
import SystemHelp from '../SystemHelp';
import { useVoicingKeyboard } from '../../hooks/useVoicingKeyboard';
import { useVoicingLogic } from '../../hooks/useVoicingLogic';
import { useVoicingState } from '../../hooks/useVoicingState';
import type { VoicingSystem } from '../../types/voicing';
import {
  CHROMATIC_TO_NOTE_NAME,
  getNoteNameAtFret,
  shouldShowNoteName,
} from '../../utils/musicTheory';
import VoicingNavigation from './VoicingNavigation';
import VoicingToggles from './VoicingToggles';

const never = () => false;

/**
 * Voicing visualizer shared by Triads and 7ths
 *
 * Walks chord voicings up the neck on string sets, one colour per inversion,
 * with each dot labelled by its chord tone. Any number of inversions and
 * string sets can be stacked on the fretboard at once.
 */
export default function VoicingPage<Q extends string, I extends number, S extends string | number>({
  system,
}: {
  system: VoicingSystem<Q, I, S>;
}) {
  const { state, actions } = useVoicingState(system);
  const { root, quality, stringSets, inversions, wholeNeck, showAllNotes } = state;
  const { fretRange, shouldShowDot, getDotStyle, getDotLabel, isKeyNote, scrollToFret } =
    useVoicingLogic(system, state);

  useVoicingKeyboard({
    inversionCount: system.inversions.length,
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
  const qualityName = system.qualities[quality].name.toLowerCase();
  const selectionLabel = `${qualityName} ${system.nouns.chord}, ${inversions
    .map((inversion) => system.inversions[inversion].name)
    .join(', ')}`;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <VoicingNavigation
        system={system}
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

      <VoicingToggles
        system={system}
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

      <SystemHelp content={system.help} />
    </div>
  );
}
