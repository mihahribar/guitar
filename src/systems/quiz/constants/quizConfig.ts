import type { QuizConfig, ChordType, QuizMode } from '../types';

// Default quiz configuration (updated to 10 questions with chord quality support)
export const DEFAULT_QUIZ_CONFIG: QuizConfig = {
  questionCount: 10,
  allowedChords: ['C', 'A', 'G', 'E', 'D'],
  allowedShapes: ['C', 'A', 'G', 'E', 'D'],
  quizMode: 'mixed',
};

// Additional quiz configurations for future extensibility
export const QUIZ_PRESETS = {
  beginner: {
    questionCount: 5,
    allowedChords: ['C', 'G', 'D'] as ChordType[],
    allowedShapes: ['C', 'G', 'D'] as ChordType[],
    quizMode: 'major' as QuizMode,
  },
  intermediate: {
    questionCount: 10,
    allowedChords: ['C', 'A', 'G', 'E', 'D'] as ChordType[],
    allowedShapes: ['C', 'A', 'G', 'E', 'D'] as ChordType[],
    quizMode: 'mixed' as QuizMode,
  },
  advanced: {
    questionCount: 10,
    allowedChords: ['C', 'A', 'G', 'E', 'D'] as ChordType[],
    allowedShapes: ['C', 'A', 'G', 'E', 'D'] as ChordType[],
    quizMode: 'mixed' as QuizMode,
  },
} as const;

// Configuration validation
export function validateQuizConfig(config: QuizConfig): boolean {
  return (
    config.questionCount > 0 &&
    config.allowedChords.length >= 2 && // Need at least 2 chords for multiple choice
    config.allowedShapes.length >= 1 &&
    config.allowedChords.length <= 5 && // Max 5 CAGED chords
    config.allowedShapes.length <= 5 // Max 5 CAGED shapes
  );
}

// Get quiz configuration (returns default, can be overridden with user preferences)
export function getQuizConfig(userConfig?: Partial<QuizConfig>): QuizConfig {
  return {
    ...DEFAULT_QUIZ_CONFIG,
    ...userConfig,
  };
}
