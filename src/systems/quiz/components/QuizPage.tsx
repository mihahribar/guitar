import { useQuiz } from '../hooks/useQuiz';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import QuizProgress from './QuizProgress';
import QuizModeToggle from './QuizModeToggle';

export default function QuizPage() {
  const {
    isIdle,
    isActive,
    isCompleted,
    currentQuestion,
    progress,
    preferences,
    startNewQuiz,
    submitAnswer,
    getResults,
    updateQuizMode,
  } = useQuiz();

  if (isIdle) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4">
              How it works:
            </h2>
            <ul className="text-left text-gray-600 dark:text-gray-300 space-y-2">
              <li>• You'll see a chord pattern on the fretboard</li>
              <li>• Identify which root chord is being played</li>
              <li>• Choose from multiple choice answers</li>
              <li>• Complete {preferences.questionCount} questions to see your score</li>
            </ul>
          </div>

          {/* Quiz Configuration */}
          <div className="mb-8 max-w-sm mx-auto">
            <QuizModeToggle value={preferences.quizMode} onChange={updateQuizMode} />
          </div>

          <div className="flex justify-center">
            <button
              onClick={startNewQuiz}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-lg cursor-pointer"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isActive && currentQuestion) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-6">
          <QuizProgress
            progress={progress}
            currentQuestion={currentQuestion?.id}
            totalQuestions={preferences.questionCount}
          />
        </div>

        <QuizQuestion question={currentQuestion} onSubmitAnswer={submitAnswer} />
      </div>
    );
  }

  if (isCompleted) {
    const results = getResults();
    return (
      <div className="max-w-4xl mx-auto p-8">
        <QuizResults results={results} onStartNewQuiz={startNewQuiz} />
      </div>
    );
  }

  return null;
}
