import { useState, useEffect } from 'react';
import type {
  QuizPreferences,
  QuizMode,
  ChordType,
  ValidationResult,
  ValidationError,
} from '../types';
import { DEFAULT_QUIZ_CONFIG } from '../constants';
// Simple error creation for quiz preferences
function createStorageError(message: string): ValidationError {
  return {
    field: 'storage',
    message,
    received: 'localStorage operation',
    expected: 'successful operation',
  };
}

const QUIZ_PREFERENCES_KEY = 'caged-quiz-preferences';

// Default preferences based on updated quiz config
const DEFAULT_PREFERENCES: QuizPreferences = {
  quizMode: DEFAULT_QUIZ_CONFIG.quizMode,
  questionCount: DEFAULT_QUIZ_CONFIG.questionCount,
  allowedChords: DEFAULT_QUIZ_CONFIG.allowedChords,
  allowedShapes: DEFAULT_QUIZ_CONFIG.allowedShapes,
};

/**
 * Hook for managing quiz preferences with localStorage persistence
 * Provides CRUD operations for user quiz preferences
 *
 * @returns Object containing preference state and update functions
 */
export function useQuizPreferences(): {
  preferences: QuizPreferences;
  isLoaded: boolean;
  updateQuizMode: (quizMode: QuizMode) => void;
  updateQuestionCount: (questionCount: number) => void;
  updateAllowedChords: (allowedChords: ChordType[]) => void;
  updateAllowedShapes: (allowedShapes: ChordType[]) => void;
  resetToDefaults: () => void;
  getQuizConfig: () => {
    questionCount: number;
    allowedChords: ChordType[];
    allowedShapes: ChordType[];
    quizMode: QuizMode;
  };
} {
  const [preferences, setPreferences] = useState<QuizPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(QUIZ_PREFERENCES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as QuizPreferences;
        // Validate parsed preferences against current schema
        if (isValidPreferences(parsed)) {
          setPreferences(parsed);
        } else {
          // If invalid, save defaults to localStorage
          savePreferences(DEFAULT_PREFERENCES);
        }
      } else {
        // No stored preferences, save defaults
        savePreferences(DEFAULT_PREFERENCES);
      }
    } catch (error) {
      const storageError = createStorageError(
        `Failed to read quiz preferences from localStorage: ${error instanceof Error ? error.message : String(error)}`
      );
      console.warn('Quiz preferences storage error:', storageError.message);
      savePreferences(DEFAULT_PREFERENCES);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = (newPreferences: QuizPreferences) => {
    try {
      localStorage.setItem(QUIZ_PREFERENCES_KEY, JSON.stringify(newPreferences));
      setPreferences(newPreferences);
    } catch (error) {
      const storageError = createStorageError(
        `Failed to write quiz preferences to localStorage: ${error instanceof Error ? error.message : String(error)}`
      );
      console.warn('Quiz preferences storage error:', storageError.message);
    }
  };

  // Update quiz mode
  const updateQuizMode = (quizMode: QuizMode) => {
    const updated = { ...preferences, quizMode };
    savePreferences(updated);
  };

  // Update question count
  const updateQuestionCount = (questionCount: number) => {
    const updated = { ...preferences, questionCount };
    savePreferences(updated);
  };

  // Update allowed chords
  const updateAllowedChords = (allowedChords: ChordType[]) => {
    const updated = { ...preferences, allowedChords };
    savePreferences(updated);
  };

  // Update allowed shapes
  const updateAllowedShapes = (allowedShapes: ChordType[]) => {
    const updated = { ...preferences, allowedShapes };
    savePreferences(updated);
  };

  // Reset to defaults
  const resetToDefaults = () => {
    savePreferences(DEFAULT_PREFERENCES);
  };

  // Get current preferences as QuizConfig
  const getQuizConfig = () => ({
    questionCount: preferences.questionCount,
    allowedChords: preferences.allowedChords,
    allowedShapes: preferences.allowedShapes,
    quizMode: preferences.quizMode,
  });

  return {
    preferences,
    isLoaded,
    updateQuizMode,
    updateQuestionCount,
    updateAllowedChords,
    updateAllowedShapes,
    resetToDefaults,
    getQuizConfig,
  };
}

/**
 * Comprehensive validation for quiz preferences with detailed error reporting
 * @param data - Unknown data to validate as QuizPreferences
 * @returns ValidationResult with typed data or detailed errors
 */
function validateQuizPreferences(data: unknown): ValidationResult<QuizPreferences> {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== 'object') {
    return {
      success: false,
      errors: [
        {
          field: 'root',
          message: 'Quiz preferences must be an object',
          received: data,
          expected: 'object',
        },
      ],
    };
  }

  const obj = data as Record<string, unknown>;

  // Validate quizMode
  if (typeof obj.quizMode !== 'string' || !['major', 'minor', 'mixed'].includes(obj.quizMode)) {
    errors.push({
      field: 'quizMode',
      message: 'Quiz mode must be "major", "minor", or "mixed"',
      received: obj.quizMode,
      expected: '"major" | "minor" | "mixed"',
    });
  }

  // Validate questionCount
  if (
    typeof obj.questionCount !== 'number' ||
    obj.questionCount <= 0 ||
    !Number.isInteger(obj.questionCount)
  ) {
    errors.push({
      field: 'questionCount',
      message: 'Question count must be a positive integer',
      received: obj.questionCount,
      expected: 'positive integer',
    });
  }

  // Validate allowedChords
  if (!Array.isArray(obj.allowedChords) || obj.allowedChords.length === 0) {
    errors.push({
      field: 'allowedChords',
      message: 'Allowed chords must be a non-empty array',
      received: obj.allowedChords,
      expected: 'ChordType[]',
    });
  } else {
    const validChords = ['C', 'A', 'G', 'E', 'D'];
    const invalidChords = obj.allowedChords.filter(
      (chord) => !validChords.includes(chord as string)
    );
    if (invalidChords.length > 0) {
      errors.push({
        field: 'allowedChords',
        message: `Invalid chord types: ${invalidChords.join(', ')}`,
        received: invalidChords,
        expected: 'C | A | G | E | D',
      });
    }
  }

  // Validate allowedShapes
  if (!Array.isArray(obj.allowedShapes) || obj.allowedShapes.length === 0) {
    errors.push({
      field: 'allowedShapes',
      message: 'Allowed shapes must be a non-empty array',
      received: obj.allowedShapes,
      expected: 'ChordType[]',
    });
  } else {
    const validShapes = ['C', 'A', 'G', 'E', 'D'];
    const invalidShapes = obj.allowedShapes.filter(
      (shape) => !validShapes.includes(shape as string)
    );
    if (invalidShapes.length > 0) {
      errors.push({
        field: 'allowedShapes',
        message: `Invalid shape types: ${invalidShapes.join(', ')}`,
        received: invalidShapes,
        expected: 'C | A | G | E | D',
      });
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  // At this point, all validations passed, safe to cast
  return {
    success: true,
    data: obj as unknown as QuizPreferences,
  };
}

/**
 * Simple boolean check for backward compatibility
 * @param prefs - Data to validate
 * @returns Type predicate for QuizPreferences
 */
function isValidPreferences(prefs: unknown): prefs is QuizPreferences {
  const result = validateQuizPreferences(prefs);
  return result.success;
}
