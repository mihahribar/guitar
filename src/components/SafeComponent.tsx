/**
 * Higher-order component for safe component rendering with error boundaries
 *
 * Provides a reusable pattern for wrapping components with error boundaries,
 * loading states, and fallback UI components.
 */

import React, { Suspense } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingFallback } from '@/shared/components';
import type { ComponentError, AppErrorType } from '../types/errors';
import { errorLogger } from '../utils/errorLogger';

/**
 * Configuration for safe component wrapper
 */
interface SafeComponentConfig {
  /** Component name for error reporting */
  componentName: string;
  /** Custom loading fallback */
  loadingFallback?: ReactNode;
  /** Custom error fallback */
  errorFallback?: ReactNode;
  /** Loading message */
  loadingMessage?: string;
  /** Whether to log errors */
  logErrors?: boolean;
  /** Custom error handler */
  onError?: (error: ComponentError) => void;
}

/**
 * Props for the SafeComponent wrapper
 */
interface SafeComponentProps {
  /** Child components to render safely */
  children: ReactNode;
  /** Configuration for safe rendering */
  config: SafeComponentConfig;
}

/**
 * Safe component wrapper with error boundary and suspense
 *
 * Provides comprehensive error handling, loading states, and graceful
 * degradation for React components. Logs errors and provides fallback UI
 * when components fail to render or load.
 *
 * @param props - SafeComponent configuration and children
 * @returns JSX element with safe rendering
 *
 * @example
 * ```tsx
 * <SafeComponent config={{
 *   componentName: 'CAGEDVisualizer',
 *   loadingMessage: 'Loading guitar visualizer...',
 *   logErrors: true
 * }}>
 *   <CAGEDVisualizer />
 * </SafeComponent>
 * ```
 */
export function SafeComponent({ children, config }: SafeComponentProps) {
  const {
    componentName,
    loadingFallback,
    errorFallback,
    loadingMessage = 'Loading...',
    logErrors = true,
    onError,
  } = config;

  const handleError = (error: ComponentError) => {
    if (logErrors) {
      errorLogger.logError(error, 'high', {
        componentName,
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    }

    if (onError) {
      onError(error);
    }
  };

  const defaultLoadingFallback = <LoadingFallback message={loadingMessage} size="medium" />;

  return (
    <ErrorBoundary componentName={componentName} fallback={errorFallback} onError={handleError}>
      <Suspense fallback={loadingFallback || defaultLoadingFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

/**
 * Higher-order component factory for creating safe components
 *
 * Creates a wrapped version of a component with built-in error handling
 * and loading states.
 *
 * @param Component - React component to wrap
 * @param config - Safety configuration
 * @returns Wrapped component with safety features
 *
 * @example
 * ```tsx
 * const SafeCAGEDVisualizer = withSafeComponent(CAGEDVisualizer, {
 *   componentName: 'CAGEDVisualizer',
 *   loadingMessage: 'Loading guitar visualizer...'
 * });
 * ```
 */
// eslint-disable-next-line react-refresh/only-export-components
export function withSafeComponent<P extends object>(
  Component: ComponentType<P>,
  config: SafeComponentConfig
) {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <SafeComponent config={config}>
        <Component {...props} />
      </SafeComponent>
    );
  };

  WrappedComponent.displayName = `Safe(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

/**
 * Hook for creating safe async operations
 *
 * Provides error handling and loading states for async operations
 * within components.
 *
 * @param operation - Async operation to perform
 * @param deps - Dependencies for the operation
 * @returns State object with data, loading, and error states
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useSafeAsync<T>(operation: () => Promise<T>, deps: React.DependencyList = []) {
  const [state, setState] = React.useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  React.useEffect(() => {
    let cancelled = false;

    const runOperation = async () => {
      if (cancelled) return;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await operation();
        if (!cancelled) {
          setState({ data: result, loading: false, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          const errorInstance = error instanceof Error ? error : new Error(String(error));
          setState((prev) => ({ ...prev, loading: false, error: errorInstance }));

          // Log the error
          errorLogger.logError(
            {
              code: 'ASYNC_OPERATION_ERROR',
              message: errorInstance.message,
              timestamp: new Date(),
              context: { operation: operation.toString() },
            } as unknown as AppErrorType,
            'medium'
          );
        }
      }
    };

    runOperation();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const retry = React.useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    retry,
  };
}

/**
 * Predefined safe component configurations
 */
// eslint-disable-next-line react-refresh/only-export-components
export const SAFE_COMPONENT_CONFIGS = {
  fretboard: {
    componentName: 'FretboardDisplay',
    loadingMessage: 'Loading fretboard...',
    logErrors: true,
  },
  navigation: {
    componentName: 'CAGEDNavigation',
    loadingMessage: 'Loading navigation...',
    logErrors: true,
  },
  quiz: {
    componentName: 'QuizComponents',
    loadingMessage: 'Loading quiz...',
    logErrors: true,
  },
  visualizer: {
    componentName: 'CAGEDVisualizer',
    loadingMessage: 'Loading CAGED visualizer...',
    logErrors: true,
  },
} as const;
