import { useEffect, useId, useRef, type ReactNode } from 'react';

interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Heading shown in the sticky header */
  title: string;
  /** Modal body */
  children: ReactNode;
}

/**
 * Shared modal shell.
 *
 * Owns the overlay, the panel chrome and the sticky header with its close
 * button, so every dialog in the app looks and behaves the same. Closes on
 * Escape or a click outside, and hands focus to the close button on open so
 * keyboard users land inside the dialog, restoring it on close.
 */
export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
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
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center gap-4">
          <h2
            id={titleId}
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight"
          >
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="
              shrink-0 p-1 rounded-lg
              text-gray-500 hover:text-gray-700
              dark:text-gray-400 dark:hover:text-gray-200
              hover:bg-gray-100 dark:hover:bg-gray-700
              transition-colors cursor-pointer
              focus:ring-2 focus:ring-gray-400 focus:outline-none
            "
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

        {children}
      </div>
    </div>
  );
}
