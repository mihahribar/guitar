import { memo, type ReactNode } from 'react';

export type ToggleSwitchColor = 'indigo' | 'green' | 'blue' | 'violet' | 'orange';

// Full class names so Tailwind can detect them at build time
const COLOR_CLASSES: Record<ToggleSwitchColor, { on: string; ring: string }> = {
  indigo: { on: 'bg-indigo-600 dark:bg-indigo-500', ring: 'focus:ring-indigo-500' },
  green: { on: 'bg-green-600 dark:bg-green-500', ring: 'focus:ring-green-500' },
  blue: { on: 'bg-blue-600 dark:bg-blue-500', ring: 'focus:ring-blue-500' },
  violet: { on: 'bg-violet-600 dark:bg-violet-500', ring: 'focus:ring-violet-500' },
  orange: { on: 'bg-orange-500 dark:bg-orange-500', ring: 'focus:ring-orange-500' },
};

interface ToggleSwitchProps {
  /** Visible label rendered left of the switch */
  label: string;
  checked: boolean;
  onToggle: () => void;
  color: ToggleSwitchColor;
  ariaLabel: string;
  /** Rendered in place of the ON caption while checked (e.g. a related select) */
  children?: ReactNode;
}

/**
 * Pill-shaped on/off switch with a label and ON/OFF caption, shared across systems.
 */
function ToggleSwitch({ label, checked, onToggle, color, ariaLabel, children }: ToggleSwitchProps) {
  const classes = COLOR_CLASSES[color];

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 ${classes.ring} focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
          checked ? classes.on : 'bg-gray-200 dark:bg-gray-600'
        }`}
        aria-pressed={checked}
        aria-label={ariaLabel}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      {checked && children ? (
        children
      ) : (
        <span className="text-xs text-gray-500 dark:text-gray-400">{checked ? 'ON' : 'OFF'}</span>
      )}
    </div>
  );
}

export default memo(ToggleSwitch);
