interface PentatonicToggleProps {
  showPentatonic: boolean;
  onToggle: () => void;
}

export default function PentatonicToggle({ showPentatonic, onToggle }: PentatonicToggleProps) {
  return (
    <div className="flex justify-center mb-8">
      <button
        onClick={onToggle}
        className={`px-6 py-2 rounded-full text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:outline-none cursor-pointer ${
          showPentatonic
            ? 'bg-green-600 dark:bg-green-500 text-white dark:text-white focus:ring-green-400 dark:focus:ring-green-300'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-400 dark:focus:ring-gray-500'
        }`}
        aria-pressed={showPentatonic}
        aria-label={
          showPentatonic ? 'Hide pentatonic scale overlay' : 'Show pentatonic scale overlay'
        }
        title={
          showPentatonic
            ? 'Hide major pentatonic scale notes'
            : 'Show major pentatonic scale notes over chord shapes'
        }
      >
        {showPentatonic ? 'Hide Pentatonic Scale' : 'Show Pentatonic Scale'}
      </button>
    </div>
  );
}
