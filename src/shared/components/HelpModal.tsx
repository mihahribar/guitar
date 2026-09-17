import { useEffect, useId, useRef } from 'react';
import type { HelpContent, HelpResource } from '../types/help';

interface HelpModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** The explanation to render */
  content: HelpContent;
}

const linkClass =
  'text-blue-600 dark:text-blue-400 hover:underline focus:underline focus:outline-none';

function ResourceList({ resources }: { resources: readonly HelpResource[] }) {
  return (
    <ul className="space-y-1.5">
      {resources.map(({ label, url, source }) => (
        <li key={url} className="text-sm">
          <a href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {label}
          </a>{' '}
          <span className="text-gray-500 dark:text-gray-400 text-xs">{source}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Plain-language explanation of a learning system, shown over the page.
 *
 * Closes on Escape or a click outside, and hands focus to the close button on
 * open so keyboard users land inside the dialog.
 */
export default function HelpModal({ isOpen, onClose, content }: HelpModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Move focus into the dialog, and back to whatever opened it on close
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    return () => previouslyFocused?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        ref={modalRef}
        className="
          bg-white dark:bg-gray-800
          rounded-xl shadow-2xl
          max-w-lg w-full
          max-h-[85vh] overflow-y-auto
          border border-gray-200 dark:border-gray-700
          text-left
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex items-start justify-between gap-4 p-5 pb-3">
          <h2
            id={titleId}
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight"
          >
            {content.title}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="shrink-0 p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors focus:ring-2 focus:ring-gray-400 focus:outline-none cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-5 pb-5 space-y-4">
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {content.tips && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                Try it
              </h3>
              <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300 list-disc pl-5">
                {content.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Read more
            </h3>
            <ResourceList resources={content.reading} />
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Watch
            </h3>
            <ResourceList resources={content.videos} />
          </div>
        </div>
      </div>
    </div>
  );
}
