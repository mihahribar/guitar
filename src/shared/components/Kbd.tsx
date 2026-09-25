import type { ReactNode } from 'react';

/**
 * Keycap badge for the keyboard hint line under each system's controls.
 */
function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">{children}</kbd>
  );
}

export default Kbd;
