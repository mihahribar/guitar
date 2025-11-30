/**
 * Quiz system specific types
 *
 * These types are specific to the quiz learning system implementation
 * and extend the shared core types for quiz-specific functionality.
 */

import type { ChordType, ChordQuality } from '@/shared/types/core';

// Re-export shared types for quiz system use
export type { ChordType, ChordQuality };

/**
 * Quiz mode for chord identification practice
 */
export type QuizMode = 'major' | 'minor' | 'mixed';

/**
 * Quiz question data structure
 */
export interface QuizQuestion {
  /** Unique question identifier */
  id: number;
  /** Root chord for the question */
  rootChord: ChordType;
  /** CAGED shape used in the question */
  shapeUsed: ChordType;
  /** Position on the fretboard */
  position: number;
  /** Available answer choices */
  choices: ChordType[];
  /** Correct answer */
  correctAnswer: ChordType;
  /** Chord quality (major/minor) */
  quality: ChordQuality;
}

/**
 * Quiz answer tracking
 */
export interface QuizAnswer {
  /** Question ID this answer relates to */
  questionId: number;
  /** User's selected answer */
  selectedAnswer: ChordType;
  /** The correct answer */
  correctAnswer: ChordType;
  /** Whether the answer was correct */
  isCorrect: boolean;
  /** Time spent on this question (optional) */
  timeSpent?: number;
}

/**
 * Complete quiz session state
 */
export interface QuizSession {
  /** All questions in this session */
  questions: QuizQuestion[];
  /** All answers provided so far */
  answers: QuizAnswer[];
  /** Current question index */
  currentQuestionIndex: number;
  /** Current score */
  score: number;
  /** Total number of questions */
  totalQuestions: number;
  /** Whether the quiz is currently active */
  isActive: boolean;
  /** Whether the quiz has been completed */
  isCompleted: boolean;
}

/**
 * Quiz configuration settings
 */
export interface QuizConfig {
  /** Number of questions to include */
  questionCount: number;
  /** Allowed chord types for questions */
  allowedChords: ChordType[];
  /** Allowed CAGED shapes for questions */
  allowedShapes: ChordType[];
  /** Quiz mode (major, minor, or mixed) */
  quizMode: QuizMode;
}

/**
 * User preferences for quiz setup
 */
export interface QuizPreferences {
  /** Preferred quiz mode */
  quizMode: QuizMode;
  /** Preferred number of questions */
  questionCount: number;
  /** Preferred chord types to include */
  allowedChords: ChordType[];
  /** Preferred CAGED shapes to include */
  allowedShapes: ChordType[];
}

/**
 * Quiz progress tracking
 */
export interface QuizProgress {
  /** Current question number (1-based) */
  currentQuestion: number;
  /** Total number of questions */
  totalQuestions: number;
  /** Current score */
  score: number;
  /** Percentage completed */
  percentComplete: number;
}

/**
 * Quiz results summary
 */
export interface QuizResults {
  /** Final score */
  finalScore: number;
  /** Total number of questions */
  totalQuestions: number;
  /** Percentage score */
  percentageScore: number;
  /** All answers provided */
  answers: QuizAnswer[];
  /** Time taken for entire quiz */
  totalTime?: number;
  /** Performance by chord type */
  performanceByChord?: Record<ChordType, { correct: number; total: number }>;
}

/**
 * Validation result type for safe type checking operations
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] };

/**
 * Detailed validation error information
 */
export interface ValidationError {
  /** Field name that failed validation */
  field: string;
  /** Human-readable error message */
  message: string;
  /** The value that was received */
  received: unknown;
  /** Expected type or format */
  expected?: string;
}
