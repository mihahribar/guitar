/**
 * Loading fallback component for async operations and component loading
 *
 * Provides consistent loading UI across the application with accessibility
 * features and customizable content.
 */

/**
 * Props for LoadingFallback component
 */
interface LoadingFallbackProps {
  /** Custom loading message */
  message?: string;
  /** Size variant for the loading spinner */
  size?: 'small' | 'medium' | 'large';
  /** Whether to show the spinner */
  showSpinner?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Loading fallback component with accessible spinner and message
 *
 * @param props - LoadingFallback configuration
 * @returns JSX element with loading state UI
 *
 * @accessibility
 * - Uses aria-live for screen reader announcements
 * - Includes role="status" for assistive technology
 * - Provides meaningful loading messages
 *
 * @example
 * ```tsx
 * <LoadingFallback
 *   message="Loading CAGED visualizer..."
 *   size="large"
 * />
 * ```
 */
export function LoadingFallback({
  message = 'Loading...',
  size = 'medium',
  showSpinner = true,
  className = '',
}: LoadingFallbackProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  };

  const containerClasses = {
    small: 'p-2',
    medium: 'p-4',
    large: 'p-6',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${containerClasses[size]} ${className}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {showSpinner && (
        <div
          className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400 ${sizeClasses[size]}`}
          aria-hidden="true"
        />
      )}
      <span className={`text-gray-600 dark:text-gray-300 ${showSpinner ? 'mt-2' : ''} text-sm`}>
        {message}
      </span>
    </div>
  );
}

/**
 * Skeleton loader for fretboard display
 */
export function FretboardSkeleton() {
  return (
    <div className="bg-amber-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm animate-pulse">
      <div className="space-y-3">
        {/* Header row */}
        <div className="flex space-x-2">
          <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          {Array.from({ length: 15 }, (_, i) => (
            <div key={i} className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
        {/* String rows */}
        {Array.from({ length: 6 }, (_, stringIndex) => (
          <div key={stringIndex} className="flex space-x-2">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
            {Array.from({ length: 15 }, (_, fretIndex) => (
              <div
                key={fretIndex}
                className="w-8 h-8 bg-gray-100 dark:bg-gray-750 rounded border border-gray-200 dark:border-gray-600"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton loader for navigation controls
 */
export function NavigationSkeleton() {
  return (
    <div className="flex flex-wrap gap-2 animate-pulse">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="w-12 h-10 bg-gray-200 dark:bg-gray-700 rounded" />
      ))}
    </div>
  );
}

/**
 * Skeleton loader for quiz question
 */
export function QuizSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
        <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full w-1/3" />
      </div>

      {/* Question area */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        <FretboardSkeleton />
      </div>

      {/* Answer choices */}
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
        ))}
      </div>
    </div>
  );
}

/**
 * Generic content skeleton
 */
export function ContentSkeleton({
  lines = 3,
  className = '',
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${
            i === lines - 1 ? 'w-2/3' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}
