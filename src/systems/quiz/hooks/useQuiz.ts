import { useQuizState } from './useQuizState';
import { useQuizLogic } from './useQuizLogic';
import { useQuizPreferences } from './useQuizPreferences';
import { getQuizConfig } from '../constants/quizConfig';
import type { ChordType, QuizAnswer } from '../types';

/**
 * Main quiz hook that combines state management and quiz logic
 *
 * Primary interface for the CAGED chord identification quiz functionality.
 * Orchestrates quiz state, question generation, answer validation, and user preferences.
 * Provides a complete quiz experience with automatic progression and scoring.
 *
 * @returns Object containing:
 *   - quiz: Current quiz state (questions, scores, status)
 *   - currentQuestion: Active question with shape patterns
 *   - progress: Completion percentage (0-100)
 *   - scorePercentage: Current score as percentage
 *   - config: Quiz configuration based on user preferences
 *   - preferences: User quiz preferences (difficulty, quantities, etc.)
 *   - isLoaded: Whether preferences have loaded from localStorage
 *   - startNewQuiz: Function to begin a new quiz session
 *   - submitAnswer: Function to submit chord identification answer
 *   - resetQuiz: Function to reset current quiz state
 *   - getCurrentQuestionDescription: Get description of current question
 *   - getResults: Get final quiz results if completed
 *   - Status flags: isIdle, isActive, isCompleted
 *
 * @example
 * ```typescript
 * const { startNewQuiz, submitAnswer, currentQuestion, isActive } = useQuiz();
 *
 * // Start a new quiz
 * startNewQuiz();
 *
 * // Answer a question
 * if (currentQuestion) {
 *   submitAnswer('C'); // User thinks the displayed pattern is C shape
 * }
 * ```
 *
 * @quizFlow
 * 1. User preferences loaded from localStorage
 * 2. Quiz questions generated based on preferences
 * 3. User answers questions with automatic progression
 * 4. Results calculated and displayed upon completion
 * 5. Option to start new quiz or modify preferences
 *
 * @performance
 * Combines multiple specialized hooks for separation of concerns while
 * providing a unified interface. Uses memoization in sub-hooks for efficiency.
 */
export function useQuiz() {
  const {
    preferences,
    isLoaded,
    getQuizConfig: getUserConfig,
    ...preferenceActions
  } = useQuizPreferences();
  const config = getQuizConfig(getUserConfig());
  const { state, actions, currentQuestion, progress, scorePercentage } = useQuizState();
  const { generateQuestions, validateAnswer, getQuestionDescription } = useQuizLogic(config);

  const startNewQuiz = () => {
    const questions = generateQuestions();
    actions.startQuiz(questions, config);
  };

  const submitAnswer = (selectedAnswer: ChordType) => {
    if (!currentQuestion) return;

    const isCorrect = validateAnswer(currentQuestion, selectedAnswer);
    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
    };

    actions.answerQuestion(answer);

    // Auto-advance to next question or finish quiz
    setTimeout(() => {
      if (state.currentQuestionIndex + 1 >= state.totalQuestions) {
        actions.finishQuiz();
      } else {
        actions.nextQuestion();
      }
    }, 1000); // Brief delay to show correct/incorrect feedback
  };

  const resetQuiz = () => {
    actions.resetQuiz();
  };

  // Helper methods
  const getCurrentQuestionDescription = () => {
    return currentQuestion ? getQuestionDescription(currentQuestion) : '';
  };

  const getResults = () => {
    if (!state.isCompleted) return null;

    return {
      totalQuestions: state.totalQuestions,
      correctAnswers: state.score,
      percentage: scorePercentage,
      answers: state.answers,
      questions: state.questions,
    };
  };

  return {
    // State
    quiz: state,
    currentQuestion,
    progress,
    scorePercentage,
    config,
    preferences,
    isLoaded,

    // Actions
    startNewQuiz,
    submitAnswer,
    resetQuiz,

    // Preference actions
    ...preferenceActions,

    // Helpers
    getCurrentQuestionDescription,
    getResults,

    // Status flags
    isIdle: !state.isActive && !state.isCompleted,
    isActive: state.isActive,
    isCompleted: state.isCompleted,
  };
}
