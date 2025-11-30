import type { ChordQuality } from '../types';

interface ChordQualityToggleProps {
  chordQuality: ChordQuality;
  onToggle: (quality: ChordQuality) => void;
}

export default function ChordQualityToggle({ chordQuality, onToggle }: ChordQualityToggleProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap justify-center">
      <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => onToggle('major')}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 dark:focus:ring-offset-gray-700 ${
            chordQuality === 'major'
              ? 'bg-orange-500 text-white shadow-sm focus:ring-orange-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-400'
          }`}
          aria-pressed={chordQuality === 'major'}
          aria-label="Select major chord quality"
        >
          Major
        </button>
        <button
          onClick={() => onToggle('minor')}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 dark:focus:ring-offset-gray-700 ${
            chordQuality === 'minor'
              ? 'bg-purple-500 text-white shadow-sm focus:ring-purple-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-400'
          }`}
          aria-pressed={chordQuality === 'minor'}
          aria-label="Select minor chord quality"
        >
          Minor
        </button>
      </div>
    </div>
  );
}
