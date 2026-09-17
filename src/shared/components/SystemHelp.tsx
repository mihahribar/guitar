import { useState } from 'react';
import type { HelpContent } from '../types/help';
import HelpModal from './HelpModal';

interface SystemHelpProps {
  /** The explanation for the learning system on this page */
  content: HelpContent;
}

/**
 * Quiet "What is this?" footer for a learning system page.
 *
 * Sits under the page controls so it never competes with them, and opens a
 * short plain-language explanation with links to go deeper.
 */
export default function SystemHelp({ content }: SystemHelpProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {content.teaser}{' '}
        <button
          onClick={() => setIsOpen(true)}
          className="font-medium text-blue-600 dark:text-blue-400 hover:underline focus:underline focus:outline-none cursor-pointer"
        >
          What is this? <span aria-hidden="true">&rarr;</span>
        </button>
      </p>

      <HelpModal isOpen={isOpen} onClose={() => setIsOpen(false)} content={content} />
    </div>
  );
}
