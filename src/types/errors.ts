/**
 * Error handling types and utilities for the CAGED Visualizer
 *
 * Provides structured error handling with detailed context and type safety
 * for better debugging and user experience.
 */

/**
 * Base error interface for all application errors
 */
export interface AppError {
  /** Error code for programmatic handling */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Additional context or metadata */
  context?: Record<string, unknown>;
  /** Original error that caused this error */
  cause?: Error;
  /** Timestamp when error occurred */
  timestamp: Date;
}

/**
 * Specific error types for different application domains
 */
export type AppErrorType =
  | ValidationError
  | StorageError
  | MusicTheoryError
  | QuizError
  | ComponentError;

/**
 * Validation errors with field-specific information
 */
export interface ValidationError extends AppError {
  code: 'VALIDATION_ERROR';
  /** Field that failed validation */
  field: string;
  /** Value that was received */
  received: unknown;
  /** Expected type or format */
  expected: string;
  /** Validation rule that failed */
  rule: string;
}

/**
 * Storage-related errors (localStorage, sessionStorage)
 */
export interface StorageError extends AppError {
  code: 'STORAGE_ERROR';
  /** Storage operation that failed */
  operation: 'read' | 'write' | 'delete' | 'clear';
  /** Storage key that was involved */
  key?: string;
  /** Storage type */
  storageType: 'localStorage' | 'sessionStorage';
}

/**
 * Music theory calculation errors
 */
export interface MusicTheoryError extends AppError {
  code: 'MUSIC_THEORY_ERROR';
  /** Type of calculation that failed */
  calculationType: 'fret_position' | 'chord_interval' | 'scale_interval' | 'note_mapping';
  /** Input values that caused the error */
  inputs: Record<string, unknown>;
}

/**
 * Quiz-related errors
 */
export interface QuizError extends AppError {
  code: 'QUIZ_ERROR';
  /** Phase of quiz that failed */
  phase: 'generation' | 'validation' | 'scoring' | 'persistence';
  /** Question index if applicable */
  questionIndex?: number;
}

/**
 * Component rendering or prop errors
 */
export interface ComponentError extends AppError {
  code: 'COMPONENT_ERROR';
  /** Component name where error occurred */
  componentName: string;
  /** Prop that caused the error */
  prop?: string;
  /** Rendering phase */
  phase: 'mount' | 'update' | 'unmount';
}

/**
 * Result type for operations that may fail
 */
export type Result<T, E extends AppError = AppError> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Safe operation wrapper type
 */
export type SafeOperation<T> = () => Result<T>;

/**
 * Error factory functions for creating typed errors
 */
export const createValidationError = (
  field: string,
  received: unknown,
  expected: string,
  rule: string,
  message?: string
): ValidationError => ({
  code: 'VALIDATION_ERROR',
  message:
    message ||
    `Validation failed for field '${field}': expected ${expected}, received ${typeof received}`,
  field,
  received,
  expected,
  rule,
  timestamp: new Date(),
});

export const createStorageError = (
  operation: StorageError['operation'],
  storageType: StorageError['storageType'],
  key?: string,
  cause?: Error
): StorageError => ({
  code: 'STORAGE_ERROR',
  message: `Storage ${operation} operation failed${key ? ` for key '${key}'` : ''}`,
  operation,
  storageType,
  key,
  cause,
  timestamp: new Date(),
});

export const createMusicTheoryError = (
  calculationType: MusicTheoryError['calculationType'],
  inputs: Record<string, unknown>,
  message?: string
): MusicTheoryError => ({
  code: 'MUSIC_THEORY_ERROR',
  message: message || `Music theory calculation failed: ${calculationType}`,
  calculationType,
  inputs,
  timestamp: new Date(),
});

export const createQuizError = (
  phase: QuizError['phase'],
  questionIndex?: number,
  message?: string,
  cause?: Error
): QuizError => ({
  code: 'QUIZ_ERROR',
  message: message || `Quiz error in ${phase} phase`,
  phase,
  questionIndex,
  cause,
  timestamp: new Date(),
});

export const createComponentError = (
  componentName: string,
  phase: ComponentError['phase'],
  prop?: string,
  message?: string,
  cause?: Error
): ComponentError => ({
  code: 'COMPONENT_ERROR',
  message: message || `Component error in ${componentName} during ${phase}`,
  componentName,
  phase,
  prop,
  cause,
  timestamp: new Date(),
});

/**
 * Utility type guards for error handling
 */
export const isValidationError = (error: AppError): error is ValidationError =>
  error.code === 'VALIDATION_ERROR';

export const isStorageError = (error: AppError): error is StorageError =>
  error.code === 'STORAGE_ERROR';

export const isMusicTheoryError = (error: AppError): error is MusicTheoryError =>
  error.code === 'MUSIC_THEORY_ERROR';

export const isQuizError = (error: AppError): error is QuizError => error.code === 'QUIZ_ERROR';

export const isComponentError = (error: AppError): error is ComponentError =>
  error.code === 'COMPONENT_ERROR';
