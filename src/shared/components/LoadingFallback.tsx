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
