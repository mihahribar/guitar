import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import type { ComponentError } from '../types/errors';
import { createComponentError } from '../types/errors';

/**
 * Props for ErrorBoundary component
 */
interface ErrorBoundaryProps {
  /** Child components to wrap with error boundary */
  children: ReactNode;
  /** Optional fallback component to render on error */
  fallback?: ReactNode;
  /** Optional callback when error occurs */
  onError?: (error: ComponentError) => void;
  /** Name of the component being wrapped for debugging */
  componentName?: string;
}

/**
 * State for ErrorBoundary component
 */
interface ErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error that occurred */
  error: ComponentError | null;
}

/**
 * React Error Boundary for graceful error handling
 *
 * Catches JavaScript errors anywhere in the child component tree and displays
 * a fallback UI instead of crashing the entire application. Provides detailed
 * error information for debugging while maintaining user experience.
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   componentName="CAGEDVisualizer"
 *   fallback={<div>Something went wrong with the visualizer</div>}
 *   onError={(error) => console.error('CAGED error:', error)}
 * >
 *   <CAGEDVisualizer />
 * </ErrorBoundary>
 * ```
 *
 * @accessibility
 * - Provides screen reader accessible error messages
 * - Maintains keyboard navigation when errors occur
 * - Includes retry functionality for temporary errors
 *
 * @errorHandling
 * - Logs detailed error information for debugging
 * - Prevents application crashes from component errors
 * - Provides user-friendly fallback UI
 * - Supports error reporting to external services
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * Static method called when an error occurs
   * Updates state to trigger fallback UI rendering
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error: createComponentError('Unknown Component', 'update', undefined, error.message, error),
    };
  }

  /**
   * Called when an error occurs during rendering
   * Logs error information and triggers error callback
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const componentError = createComponentError(
      this.props.componentName || 'Unknown Component',
      'update',
      undefined,
      error.message,
      error
    );

    // Add React error info to context
    componentError.context = {
      ...componentError.context,
      componentStack: errorInfo.componentStack,
      errorBoundary: this.constructor.name,
    };

    // Log error for debugging
    console.error('ErrorBoundary caught an error:', componentError);

    // Update state with detailed error
    this.setState({ error: componentError });

    // Call error callback if provided
    if (this.props.onError) {
      this.props.onError(componentError);
    }
  }

  /**
   * Reset error state to retry rendering
   */
  private handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  /**
   * Reload the entire page as last resort
   */
  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 m-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Something went wrong
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>
                  {this.props.componentName
                    ? `There was an error in the ${this.props.componentName} component.`
                    : 'An unexpected error occurred.'}{' '}
                  Please try again.
                </p>
                {this.state.error && (
                  <details className="mt-2">
                    <summary className="cursor-pointer font-medium hover:text-red-600 dark:hover:text-red-200">
                      Error details
                    </summary>
                    <div className="mt-1 text-xs font-mono bg-red-100 dark:bg-red-900/40 p-2 rounded border">
                      <p>
                        <strong>Message:</strong> {this.state.error.message}
                      </p>
                      <p>
                        <strong>Component:</strong> {this.state.error.componentName}
                      </p>
                      <p>
                        <strong>Time:</strong> {this.state.error.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </details>
                )}
              </div>
              <div className="mt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={this.handleRetry}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-sm rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Try again
                </button>
                <button
                  type="button"
                  onClick={this.handleReload}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 text-sm rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Reload page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
