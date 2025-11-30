import type { QuizMode } from '../types';

interface QuizModeToggleProps {
  value: QuizMode;
  onChange: (mode: QuizMode) => void;
  disabled?: boolean;
}

const QUIZ_MODES: { value: QuizMode; label: string; description: string }[] = [
  { value: 'major', label: 'Major', description: 'Practice major chords only' },
  { value: 'minor', label: 'Minor', description: 'Practice minor chords only' },
  { value: 'mixed', label: 'Mixed', description: 'Practice both major and minor chords' },
];

export default function QuizModeToggle({ value, onChange, disabled = false }: QuizModeToggleProps) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Chord Quality</label>

      <div
        className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1"
        role="radiogroup"
        aria-label="Select chord quality mode"
      >
        {QUIZ_MODES.map((mode) => (
          <button
            key={mode.value}
            type="button"
            onClick={() => !disabled && onChange(mode.value)}
            disabled={disabled}
            className={`
              flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${
                value === mode.value
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm focus:ring-blue-500'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-700/50 focus:ring-gray-400'
              }
            `}
            aria-checked={value === mode.value}
            aria-describedby={`${mode.value}-description`}
            role="radio"
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Description text for the selected mode */}
      <p
        id={`${value}-description`}
        className="text-xs text-gray-500 dark:text-gray-400 min-h-[1rem]"
      >
        {QUIZ_MODES.find((mode) => mode.value === value)?.description}
      </p>
    </div>
  );
}
