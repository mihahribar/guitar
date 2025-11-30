import type { QuizAnswer, QuizQuestion } from '../types';
import { CAGED_SHAPES_BY_QUALITY } from '@/systems/caged/constants';

interface QuizResultsProps {
  results: {
    totalQuestions: number;
    correctAnswers: number;
    percentage: number;
    answers: QuizAnswer[];
    questions: QuizQuestion[];
  } | null;
  onStartNewQuiz: () => void;
}

export default function QuizResults({ results, onStartNewQuiz }: QuizResultsProps) {
  if (!results) return null;

  const { totalQuestions, correctAnswers, percentage, answers, questions } = results;

  const getScoreMessage = (percentage: number): string => {
    if (percentage === 100) return "Perfect! You've mastered the CAGED system!";
    if (percentage >= 80) return 'Excellent work! You have a strong understanding.';
    if (percentage >= 60) return 'Good job! Keep practicing to improve.';
    if (percentage >= 40) return 'Not bad! Review the patterns and try again.';
    return 'Keep studying! The CAGED system takes practice.';
  };

  const getScoreColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="text-center space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-gray-800 dark:text-gray-100 mb-2">
          Quiz Complete!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Here's how you performed on the CAGED chord identification quiz
        </p>
      </div>

      {/* Score Display */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
        <div className="text-6xl font-light text-gray-800 dark:text-gray-100 mb-2">
          {correctAnswers}/{totalQuestions}
        </div>
        <div className={`text-2xl font-medium mb-4 ${getScoreColor(percentage)}`}>
          {Math.round(percentage)}%
        </div>
        <p className="text-gray-600 dark:text-gray-300">{getScoreMessage(percentage)}</p>
      </div>

      {/* Answer Review */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-4">
          Review Your Answers
        </h2>
        <div className="space-y-3">
          {answers.map((answer, index) => {
            const question = questions.find((q) => q.id === answer.questionId);
            const chordQuality = question?.quality || 'major';
            const qualityText = chordQuality === 'major' ? 'Major' : 'Minor';

            return (
              <div
                key={answer.questionId}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  answer.isCorrect
                    ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{answer.isCorrect ? '✓' : '✗'}</span>
                  <span className="text-gray-700 dark:text-gray-200">
                    Question {index + 1} ({qualityText})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Your answer:</span>
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-medium"
                    style={{
                      backgroundColor:
                        CAGED_SHAPES_BY_QUALITY[chordQuality][answer.selectedAnswer].color,
                    }}
                  >
                    {answer.selectedAnswer}
                  </div>
                  {!answer.isCorrect && (
                    <>
                      <span className="text-sm text-gray-500 dark:text-gray-400">→ Correct:</span>
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-medium"
                        style={{
                          backgroundColor:
                            CAGED_SHAPES_BY_QUALITY[chordQuality][answer.correctAnswer].color,
                        }}
                        title={`Correct answer: ${answer.correctAnswer} ${qualityText}`}
                      >
                        {answer.correctAnswer}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center">
        <button
          onClick={onStartNewQuiz}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 cursor-pointer"
        >
          Take Another Quiz
        </button>
      </div>

      {/* Study Tips */}
      {percentage < 80 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-3">
            💡 Study Tips
          </h3>
          <ul className="text-left text-blue-700 dark:text-blue-300 space-y-2">
            <li>• Practice identifying each CAGED shape at different positions</li>
            <li>
              • Remember that the shape name tells you which chord it makes at the nut (position 0)
            </li>
            <li>• Use the position number to calculate which root chord you're playing</li>
            <li>
              • The relationship between shapes and positions is mathematical - learn the pattern!
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
