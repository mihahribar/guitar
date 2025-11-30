import { useReducer } from 'react';
import type { QuizSession, QuizQuestion, QuizAnswer, QuizConfig } from '../types';
import { DEFAULT_QUIZ_CONFIG } from '../constants/quizConfig';

type QuizAction =
  | { type: 'START_QUIZ'; payload: { questions: QuizQuestion[]; config: QuizConfig } }
  | { type: 'ANSWER_QUESTION'; payload: QuizAnswer }
  | { type: 'NEXT_QUESTION' }
  | { type: 'FINISH_QUIZ' }
  | { type: 'RESET_QUIZ' };

function quizReducer(state: QuizSession, action: QuizAction): QuizSession {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...state,
        questions: action.payload.questions,
        totalQuestions: action.payload.config.questionCount,
        currentQuestionIndex: 0,
        answers: [],
        score: 0,
        isActive: true,
        isCompleted: false,
      };
    case 'ANSWER_QUESTION': {
      const newAnswers = [...state.answers, action.payload];
      const newScore = action.payload.isCorrect ? state.score + 1 : state.score;
      return {
        ...state,
        answers: newAnswers,
        score: newScore,
      };
    }
    case 'NEXT_QUESTION': {
      const nextIndex = state.currentQuestionIndex + 1;
      if (nextIndex >= state.totalQuestions) {
        return {
          ...state,
          currentQuestionIndex: nextIndex,
          isActive: false,
          isCompleted: true,
        };
      }
      return {
        ...state,
        currentQuestionIndex: nextIndex,
      };
    }
    case 'FINISH_QUIZ':
      return {
        ...state,
        isActive: false,
        isCompleted: true,
      };
    case 'RESET_QUIZ':
      return initialState;
    default:
      return state;
  }
}

const initialState: QuizSession = {
  questions: [],
  answers: [],
  currentQuestionIndex: 0,
  score: 0,
  totalQuestions: 0,
  isActive: false,
  isCompleted: false,
};

// Use centralized default configuration
const defaultConfig: QuizConfig = DEFAULT_QUIZ_CONFIG;

export function useQuizState() {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const actions = {
    startQuiz: (questions: QuizQuestion[], config: QuizConfig = defaultConfig) =>
      dispatch({ type: 'START_QUIZ', payload: { questions, config } }),
    answerQuestion: (answer: QuizAnswer) => dispatch({ type: 'ANSWER_QUESTION', payload: answer }),
    nextQuestion: () => dispatch({ type: 'NEXT_QUESTION' }),
    finishQuiz: () => dispatch({ type: 'FINISH_QUIZ' }),
    resetQuiz: () => dispatch({ type: 'RESET_QUIZ' }),
  };

  // Derived state
  const currentQuestion = state.questions[state.currentQuestionIndex];
  const progress = state.totalQuestions > 0 ? state.currentQuestionIndex / state.totalQuestions : 0;
  const scorePercentage = state.totalQuestions > 0 ? (state.score / state.totalQuestions) * 100 : 0;

  return {
    state,
    actions,
    currentQuestion,
    progress,
    scorePercentage,
    config: defaultConfig,
  };
}
