/**
 * Quiz system specific constants
 *
 * This file contains all constants specific to the quiz learning system,
 * including default settings, limits, and configuration values.
 */

import type { QuizMode, ChordType } from '../types';

// Re-export quiz configuration
export * from './quizConfig';

/**
 * Default quiz configuration values
 */
export const DEFAULT_QUIZ_CONFIG = {
  /** Default number of questions per quiz */
  questionCount: 10,
  /** Default quiz mode */
  quizMode: 'mixed' as QuizMode,
  /** Default allowed chord types */
  allowedChords: ['C', 'A', 'G', 'E', 'D'] as ChordType[],
  /** Default allowed CAGED shapes */
  allowedShapes: ['C', 'A', 'G', 'E', 'D'] as ChordType[],
} as const;

/**
 * Quiz validation limits
 */
export const QUIZ_LIMITS = {
  /** Minimum number of questions */
  MIN_QUESTIONS: 5,
  /** Maximum number of questions */
  MAX_QUESTIONS: 50,
  /** Minimum number of answer choices */
  MIN_CHOICES: 2,
  /** Maximum number of answer choices */
  MAX_CHOICES: 5,
  /** Default number of answer choices */
  DEFAULT_CHOICES: 4,
} as const;

/**
 * Quiz timing constants
 */
export const QUIZ_TIMING = {
  /** Auto-advance delay in milliseconds */
  AUTO_ADVANCE_DELAY: 1000,
  /** Question timeout in milliseconds (optional) */
  QUESTION_TIMEOUT: 30000,
  /** Result display duration in milliseconds */
  RESULT_DISPLAY_DURATION: 2000,
} as const;

/**
 * Quiz scoring constants
 */
export const QUIZ_SCORING = {
  /** Points per correct answer */
  POINTS_PER_CORRECT: 1,
  /** Penalty for incorrect answer */
  POINTS_PER_INCORRECT: 0,
  /** Bonus for perfect score */
  PERFECT_SCORE_BONUS: 0,
} as const;

/**
 * Valid quiz modes
 */
export const VALID_QUIZ_MODES: QuizMode[] = ['major', 'minor', 'mixed'];

/**
 * Storage keys for quiz data
 */
export const QUIZ_STORAGE_KEYS = {
  /** Quiz preferences storage key */
  PREFERENCES: 'caged-quiz-preferences',
  /** Last quiz session storage key */
  LAST_SESSION: 'caged-last-quiz-session',
  /** Quiz statistics storage key */
  STATISTICS: 'caged-quiz-statistics',
} as const;
