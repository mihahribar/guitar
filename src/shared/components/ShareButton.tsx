import { useEffect, useRef, useState } from 'react';

const MESSAGE_DURATION_MS = 2000;

/**
 * Shares the current page with its settings. The address bar always holds
 * them, so the link is simply the current URL. Phones get the share sheet,
 * everything else copies to the clipboard.
 */
export default function ShareButton() {
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const showMessage = (text: string) => {
    setMessage(text);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setMessage(''), MESSAGE_DURATION_MS);
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
      try {
        await navigator.share({ title: document.title, url });
      } catch {
        // Closing the share sheet rejects too; nothing to report
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      showMessage('Link copied');
    } catch {
      showMessage('Could not copy the link');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={share}
        className="p-2 sm:px-4 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
        aria-label="Share a link to this page with its current settings"
        title="Share link"
      >
        <svg
          className="w-5 h-5 text-gray-800 dark:text-gray-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      </button>
      <span
        role="status"
        className={`absolute right-0 top-full mt-2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white dark:bg-gray-100 dark:text-gray-900 ${message ? '' : 'sr-only'}`}
      >
        {message}
      </span>
    </div>
  );
}
