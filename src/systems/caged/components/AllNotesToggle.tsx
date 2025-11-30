interface AllNotesToggleProps {
  showAllNotes: boolean;
  onToggle: () => void;
}

export default function AllNotesToggle({ showAllNotes, onToggle }: AllNotesToggleProps) {
  return (
    <div className="flex justify-center mb-8">
      <button
        onClick={onToggle}
        className={`px-6 py-2 rounded-full text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:outline-none cursor-pointer ${
          showAllNotes
            ? 'bg-blue-600 dark:bg-blue-500 text-white dark:text-white focus:ring-blue-400 dark:focus:ring-blue-300'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-400 dark:focus:ring-gray-500'
        }`}
        aria-pressed={showAllNotes}
        aria-label={showAllNotes ? 'Hide note names on fretboard' : 'Show note names on fretboard'}
        title={
          showAllNotes
            ? 'Hide natural note names (E,F,G,A,B,C,D)'
            : 'Show natural note names on all fret positions'
        }
      >
        {showAllNotes ? 'Hide All Notes' : 'Show All Notes'}
      </button>
    </div>
  );
}
