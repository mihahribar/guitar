/**
 * Input validation utilities for user interactions
 *
 * Provides comprehensive validation for user inputs with detailed error
 * messages and type safety for the CAGED Visualizer application.
 */

import type { ChordType, ChordQuality } from '@/shared/types/core';
import type { QuizMode, ValidationResult, ValidationError } from '@/systems/quiz/types';
import { VALIDATION_CONSTANTS, UI_CONSTANTS } from '@/shared/constants';

/**
 * Validation rule function type
 */
type ValidationRule<T> = (value: T) => ValidationResult<T>;

/**
 * Create a validation error with details
 */
const createValidationError = (
  field: string,
  message: string,
  received: unknown,
  expected: string
): ValidationError => ({
  field,
  message,
  received,
  expected,
});

/**
 * Combine multiple validation results
 */
export const combineValidationResults = <T>(
  value: T,
  results: ValidationResult<T>[]
): ValidationResult<T> => {
  const errors = results
    .filter((result): result is { success: false; errors: ValidationError[] } => !result.success)
    .flatMap((result) => result.errors);

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: value };
};

/**
 * Chord type validation
 */
export const validateChordType = (value: unknown): ValidationResult<ChordType> => {
  if (typeof value !== 'string') {
    return {
      success: false,
      errors: [createValidationError('chordType', 'Chord type must be a string', value, 'string')],
    };
  }

  if (!VALIDATION_CONSTANTS.VALID_CHORD_TYPES.includes(value as ChordType)) {
    return {
      success: false,
      errors: [
        createValidationError(
          'chordType',
          `Invalid chord type. Must be one of: ${VALIDATION_CONSTANTS.VALID_CHORD_TYPES.join(', ')}`,
          value,
          VALIDATION_CONSTANTS.VALID_CHORD_TYPES.join(' | ')
        ),
      ],
    };
  }

  return { success: true, data: value as ChordType };
};

/**
 * Chord quality validation
 */
export const validateChordQuality = (value: unknown): ValidationResult<ChordQuality> => {
  if (typeof value !== 'string') {
    return {
      success: false,
      errors: [
        createValidationError('chordQuality', 'Chord quality must be a string', value, 'string'),
      ],
    };
  }

  if (!VALIDATION_CONSTANTS.VALID_CHORD_QUALITIES.includes(value as ChordQuality)) {
    return {
      success: false,
      errors: [
        createValidationError(
          'chordQuality',
          `Invalid chord quality. Must be one of: ${VALIDATION_CONSTANTS.VALID_CHORD_QUALITIES.join(', ')}`,
          value,
          VALIDATION_CONSTANTS.VALID_CHORD_QUALITIES.join(' | ')
        ),
      ],
    };
  }

  return { success: true, data: value as ChordQuality };
};

/**
 * Quiz mode validation
 */
export const validateQuizMode = (value: unknown): ValidationResult<QuizMode> => {
  if (typeof value !== 'string') {
    return {
      success: false,
      errors: [createValidationError('quizMode', 'Quiz mode must be a string', value, 'string')],
    };
  }

  if (!VALIDATION_CONSTANTS.VALID_QUIZ_MODES.includes(value as QuizMode)) {
    return {
      success: false,
      errors: [
        createValidationError(
          'quizMode',
          `Invalid quiz mode. Must be one of: ${VALIDATION_CONSTANTS.VALID_QUIZ_MODES.join(', ')}`,
          value,
          VALIDATION_CONSTANTS.VALID_QUIZ_MODES.join(' | ')
        ),
      ],
    };
  }

  return { success: true, data: value as QuizMode };
};

/**
 * Position index validation (for CAGED sequence navigation)
 */
export const validatePosition = (value: unknown, maxPosition: number): ValidationResult<number> => {
  if (typeof value !== 'number') {
    return {
      success: false,
      errors: [createValidationError('position', 'Position must be a number', value, 'number')],
    };
  }

  if (!Number.isInteger(value)) {
    return {
      success: false,
      errors: [createValidationError('position', 'Position must be an integer', value, 'integer')],
    };
  }

  if (value < 0 || value >= maxPosition) {
    return {
      success: false,
      errors: [
        createValidationError(
          'position',
          `Position must be between 0 and ${maxPosition - 1}`,
          value,
          `0 <= position < ${maxPosition}`
        ),
      ],
    };
  }

  return { success: true, data: value };
};

/**
 * Fret number validation
 */
export const validateFretNumber = (value: unknown): ValidationResult<number> => {
  if (typeof value !== 'number') {
    return {
      success: false,
      errors: [
        createValidationError('fretNumber', 'Fret number must be a number', value, 'number'),
      ],
    };
  }

  if (!Number.isInteger(value)) {
    return {
      success: false,
      errors: [
        createValidationError('fretNumber', 'Fret number must be an integer', value, 'integer'),
      ],
    };
  }

  const { MIN, MAX } = VALIDATION_CONSTANTS.FRET_NUMBER_BOUNDS;
  if (value < MIN || value > MAX) {
    return {
      success: false,
      errors: [
        createValidationError(
          'fretNumber',
          `Fret number must be between ${MIN} and ${MAX}`,
          value,
          `${MIN} <= fret <= ${MAX}`
        ),
      ],
    };
  }

  return { success: true, data: value };
};

/**
 * String index validation
 */
export const validateStringIndex = (value: unknown): ValidationResult<number> => {
  if (typeof value !== 'number') {
    return {
      success: false,
      errors: [
        createValidationError('stringIndex', 'String index must be a number', value, 'number'),
      ],
    };
  }

  if (!Number.isInteger(value)) {
    return {
      success: false,
      errors: [
        createValidationError('stringIndex', 'String index must be an integer', value, 'integer'),
      ],
    };
  }

  const { MIN, MAX } = VALIDATION_CONSTANTS.STRING_INDEX_BOUNDS;
  if (value < MIN || value > MAX) {
    return {
      success: false,
      errors: [
        createValidationError(
          'stringIndex',
          `String index must be between ${MIN} and ${MAX}`,
          value,
          `${MIN} <= string <= ${MAX}`
        ),
      ],
    };
  }

  return { success: true, data: value };
};

/**
 * Question count validation for quiz settings
 */
export const validateQuestionCount = (value: unknown): ValidationResult<number> => {
  if (typeof value !== 'number') {
    return {
      success: false,
      errors: [
        createValidationError('questionCount', 'Question count must be a number', value, 'number'),
      ],
    };
  }

  if (!Number.isInteger(value)) {
    return {
      success: false,
      errors: [
        createValidationError(
          'questionCount',
          'Question count must be an integer',
          value,
          'integer'
        ),
      ],
    };
  }

  const { MIN_QUESTION_COUNT, MAX_QUESTION_COUNT } = UI_CONSTANTS;
  if (value < MIN_QUESTION_COUNT || value > MAX_QUESTION_COUNT) {
    return {
      success: false,
      errors: [
        createValidationError(
          'questionCount',
          `Question count must be between ${MIN_QUESTION_COUNT} and ${MAX_QUESTION_COUNT}`,
          value,
          `${MIN_QUESTION_COUNT} <= count <= ${MAX_QUESTION_COUNT}`
        ),
      ],
    };
  }

  return { success: true, data: value };
};

/**
 * Array validation with element validation
 */
export const validateArray = <T>(
  value: unknown,
  elementValidator: (item: unknown) => ValidationResult<T>,
  fieldName: string,
  minLength: number = 0,
  maxLength?: number
): ValidationResult<T[]> => {
  if (!Array.isArray(value)) {
    return {
      success: false,
      errors: [createValidationError(fieldName, `${fieldName} must be an array`, value, 'array')],
    };
  }

  if (value.length < minLength) {
    return {
      success: false,
      errors: [
        createValidationError(
          fieldName,
          `${fieldName} must have at least ${minLength} items`,
          value,
          `length >= ${minLength}`
        ),
      ],
    };
  }

  if (maxLength !== undefined && value.length > maxLength) {
    return {
      success: false,
      errors: [
        createValidationError(
          fieldName,
          `${fieldName} must have at most ${maxLength} items`,
          value,
          `length <= ${maxLength}`
        ),
      ],
    };
  }

  const validatedItems: T[] = [];
  const errors: ValidationError[] = [];

  value.forEach((item, index) => {
    const result = elementValidator(item);
    if (result.success) {
      validatedItems.push(result.data);
    } else {
      // Prefix field names with array index
      result.errors.forEach((error) => {
        errors.push({
          ...error,
          field: `${fieldName}[${index}].${error.field}`,
        });
      });
    }
  });

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: validatedItems };
};

/**
 * Validate chord type array (for quiz preferences)
 */
export const validateChordTypeArray = (value: unknown): ValidationResult<ChordType[]> => {
  return validateArray(value, validateChordType, 'chords', 1, 5);
};

/**
 * Validate shape type array (for quiz preferences)
 */
export const validateShapeTypeArray = (value: unknown): ValidationResult<ChordType[]> => {
  return validateArray(value, validateChordType, 'shapes', 1, 5);
};

/**
 * Composite validation for complex objects
 */
export const createValidator = <T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validators: Record<keyof T, ValidationRule<any>>
) => {
  return (value: unknown): ValidationResult<T> => {
    if (!value || typeof value !== 'object') {
      return {
        success: false,
        errors: [createValidationError('root', 'Value must be an object', value, 'object')],
      };
    }

    const obj = value as Record<string, unknown>;
    const validatedData: Partial<T> = {};
    const errors: ValidationError[] = [];

    Object.entries(validators).forEach(([field, validatorFn]) => {
      const fieldValue = obj[field];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = (validatorFn as ValidationRule<any>)(fieldValue);

      if (result.success) {
        validatedData[field as keyof T] = result.data;
      } else {
        errors.push(...result.errors);
      }
    });

    if (errors.length > 0) {
      return { success: false, errors };
    }

    return { success: true, data: validatedData as T };
  };
};

/**
 * Format validation errors for user display
 */
export const formatValidationErrors = (errors: ValidationError[]): string => {
  if (errors.length === 0) return '';

  if (errors.length === 1) {
    return errors[0].message;
  }

  return `Multiple validation errors:\n${errors
    .map((error) => `• ${error.field}: ${error.message}`)
    .join('\n')}`;
};

/**
 * Sanitize string input to prevent XSS
 */
export const sanitizeString = (value: string): string => {
  return value
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};
