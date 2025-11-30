/**
 * Error logging utilities for the CAGED Visualizer
 *
 * Provides centralized error logging with different severity levels
 * and optional integration with external error reporting services.
 */

import type { AppError, AppErrorType } from '../types/errors';

/**
 * Error severity levels
 */
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Error log entry structure
 */
export interface ErrorLogEntry {
  /** Unique identifier for this error occurrence */
  id: string;
  /** The error that occurred */
  error: AppError;
  /** Severity level */
  severity: ErrorSeverity;
  /** User agent string */
  userAgent: string;
  /** Current URL where error occurred */
  url: string;
  /** Additional context from the application */
  context?: Record<string, unknown>;
  /** Whether this error was handled gracefully */
  handled: boolean;
}

/**
 * Error logging configuration
 */
interface ErrorLoggerConfig {
  /** Whether to log to console */
  consoleLogging: boolean;
  /** Whether to store errors locally */
  localStorageLogging: boolean;
  /** Maximum number of errors to store locally */
  maxLocalErrors: number;
  /** Whether to attempt external reporting */
  externalReporting: boolean;
  /** External reporting URL */
  reportingUrl?: string;
}

/**
 * Default error logger configuration
 */
const DEFAULT_CONFIG: ErrorLoggerConfig = {
  consoleLogging: true,
  localStorageLogging: true,
  maxLocalErrors: 50,
  externalReporting: false,
};

/**
 * Error logger class for centralized error handling
 */
export class ErrorLogger {
  private config: ErrorLoggerConfig;
  private readonly storageKey = 'caged-error-logs';

  constructor(config: Partial<ErrorLoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Log an error with specified severity
   * @param error - The error to log
   * @param severity - Error severity level
   * @param context - Additional context information
   * @param handled - Whether the error was handled gracefully
   */
  public logError(
    error: AppErrorType,
    severity: ErrorSeverity = 'medium',
    context?: Record<string, unknown>,
    handled: boolean = true
  ): void {
    const logEntry: ErrorLogEntry = {
      id: this.generateErrorId(),
      error,
      severity,
      userAgent: navigator.userAgent,
      url: window.location.href,
      context,
      handled,
    };

    // Console logging
    if (this.config.consoleLogging) {
      this.logToConsole(logEntry);
    }

    // Local storage logging
    if (this.config.localStorageLogging) {
      this.logToLocalStorage(logEntry);
    }

    // External reporting (if configured)
    if (this.config.externalReporting && this.config.reportingUrl) {
      this.reportToExternal(logEntry);
    }
  }

  /**
   * Get error logs from local storage
   * @param limit - Maximum number of logs to retrieve
   * @returns Array of error log entries
   */
  public getErrorLogs(limit?: number): ErrorLogEntry[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];

      const logs: ErrorLogEntry[] = JSON.parse(stored);
      return limit ? logs.slice(-limit) : logs;
    } catch (error) {
      console.warn('Failed to retrieve error logs from localStorage:', error);
      return [];
    }
  }

  /**
   * Clear error logs from local storage
   */
  public clearErrorLogs(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('Failed to clear error logs from localStorage:', error);
    }
  }

  /**
   * Get error statistics
   */
  public getErrorStats(): {
    total: number;
    bySeverity: Record<ErrorSeverity, number>;
    byType: Record<string, number>;
    recent: number; // Last 24 hours
  } {
    const logs = this.getErrorLogs();
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const stats = {
      total: logs.length,
      bySeverity: { low: 0, medium: 0, high: 0, critical: 0 } as Record<ErrorSeverity, number>,
      byType: {} as Record<string, number>,
      recent: 0,
    };

    logs.forEach((log) => {
      // Count by severity
      stats.bySeverity[log.severity]++;

      // Count by error type
      const errorType = log.error.code;
      stats.byType[errorType] = (stats.byType[errorType] || 0) + 1;

      // Count recent errors
      const errorTime = new Date(log.error.timestamp).getTime();
      if (errorTime > oneDayAgo) {
        stats.recent++;
      }
    });

    return stats;
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log error to console with appropriate level
   */
  private logToConsole(logEntry: ErrorLogEntry): void {
    const prefix = `[${logEntry.severity.toUpperCase()}]`;
    const message = `${prefix} ${logEntry.error.code}: ${logEntry.error.message}`;

    switch (logEntry.severity) {
      case 'low':
        console.info(message, logEntry);
        break;
      case 'medium':
        console.warn(message, logEntry);
        break;
      case 'high':
      case 'critical':
        console.error(message, logEntry);
        break;
    }
  }

  /**
   * Store error log in localStorage
   */
  private logToLocalStorage(logEntry: ErrorLogEntry): void {
    try {
      const existing = this.getErrorLogs();
      const updated = [...existing, logEntry].slice(-this.config.maxLocalErrors);
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to store error log in localStorage:', error);
    }
  }

  /**
   * Report error to external service
   */
  private reportToExternal(logEntry: ErrorLogEntry): void {
    if (!this.config.reportingUrl) return;

    // Only report unhandled errors or high/critical severity
    if (logEntry.handled && !['high', 'critical'].includes(logEntry.severity)) {
      return;
    }

    // Use fetch with timeout to avoid blocking
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    fetch(this.config.reportingUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logEntry),
      signal: controller.signal,
    })
      .catch((error) => {
        console.warn('Failed to report error to external service:', error);
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });
  }
}

/**
 * Default error logger instance
 */
export const errorLogger = new ErrorLogger();

/**
 * Convenience functions for different error types
 */
export const logValidationError = (error: AppErrorType, context?: Record<string, unknown>) =>
  errorLogger.logError(error, 'low', context);

export const logStorageError = (error: AppErrorType, context?: Record<string, unknown>) =>
  errorLogger.logError(error, 'medium', context);

export const logMusicTheoryError = (error: AppErrorType, context?: Record<string, unknown>) =>
  errorLogger.logError(error, 'high', context);

export const logQuizError = (error: AppErrorType, context?: Record<string, unknown>) =>
  errorLogger.logError(error, 'medium', context);

export const logComponentError = (error: AppErrorType, context?: Record<string, unknown>) =>
  errorLogger.logError(error, 'high', context, false);

/**
 * Global error handler for unhandled JavaScript errors
 */
export const setupGlobalErrorHandler = (): void => {
  window.addEventListener('error', (event) => {
    const error = {
      code: 'UNHANDLED_ERROR' as const,
      message: event.message,
      timestamp: new Date(),
      context: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      },
    };

    errorLogger.logError(error as unknown as AppErrorType, 'critical', undefined, false);
  });

  window.addEventListener('unhandledrejection', (event) => {
    const error = {
      code: 'UNHANDLED_PROMISE_REJECTION' as const,
      message: event.reason?.message || 'Unhandled promise rejection',
      timestamp: new Date(),
      context: {
        reason: event.reason,
        stack: event.reason?.stack,
      },
    };

    errorLogger.logError(error as unknown as AppErrorType, 'critical', undefined, false);
  });
};
