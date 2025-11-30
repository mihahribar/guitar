import { useState } from 'react';
import type { QuizQuestion as QuizQuestionType, ChordType } from '../types';
import { CAGED_SHAPES_BY_QUALITY } from '@/systems/caged/constants';
import { STRING_NAMES, FRETBOARD_CONSTANTS } from '@/shared/utils/musicTheory';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onSubmitAnswer: (answer: ChordType) => void;
}

export default function QuizQuestion({ question, onSubmitAnswer }: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<ChordType | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    setShowFeedback(true);
    onSubmitAnswer(selectedAnswer);

    // Reset for next question
    setTimeout(() => {
      setSelectedAnswer(null);
      setShowFeedback(false);
    }, 1200);
  };

  // Get the correct shape data based on chord quality
  const getShapeData = () => {
    return CAGED_SHAPES_BY_QUALITY[question.quality][question.shapeUsed];
  };

  // Calculate which frets should show dots for this question
  const shouldShowDot = (stringIndex: number, fretNumber: number): boolean => {
    const shape = getShapeData();
    const patternFret = shape.pattern[stringIndex];
    const basePosition = question.position;

    if (patternFret === -1) return false; // Not played
    if (patternFret === 0 && basePosition === 0) return fretNumber === 0; // Open string
    if (patternFret === 0 && basePosition > 0) return fretNumber === basePosition; // Barre

    return fretNumber === patternFret + basePosition;
  };

  const getDotStyle = (): React.CSSProperties => {
    return { backgroundColor: getShapeData().color };
  };

  const isCorrectAnswer = selectedAnswer === question.correctAnswer;

  return (
    <div className="space-y-8">
      {/* Question Header */}
      <div className="text-center">
        <h2 className="text-2xl font-light text-gray-800 dark:text-gray-100 mb-2">
          Question {question.id}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          What <span className="font-medium">{question.quality}</span> chord is being played using
          the <span className="font-medium">{question.shapeUsed} shape</span> at position{' '}
          {question.position}?
        </p>
      </div>

      {/* Fretboard Display */}
      <section
        className="bg-amber-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm"
        aria-label="Guitar fretboard"
      >
        <table
          className="fretboard-grid w-full border-collapse"
          role="grid"
          aria-label={`Guitar fretboard showing chord pattern using ${question.shapeUsed} shape`}
        >
          <thead>
            <tr>
              <th className="w-8"></th>
              {Array.from({ length: FRETBOARD_CONSTANTS.TOTAL_FRETS }, (_, i) => (
                <th key={i} className="text-center pb-2 relative">
                  {[3, 5, 7, 9, 12].includes(i + 1) && (
                    <div className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                      {i + 1}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STRING_NAMES.map((stringName, stringIndex) => (
              <tr key={stringIndex} className="string-row">
                <th
                  className="w-8 text-right pr-2 text-sm font-mono text-gray-600 dark:text-gray-300 font-medium"
                  scope="row"
                  aria-label={`${stringName} string`}
                >
                  {stringName}
                </th>

                {Array.from({ length: FRETBOARD_CONSTANTS.TOTAL_FRETS }, (_, fretIndex) => (
                  <td
                    key={fretIndex}
                    className="fret-cell relative h-8 border-l border-gray-300 dark:border-gray-600 first:border-l-0"
                    role="gridcell"
                    aria-label={`${stringName} string, fret ${fretIndex + 1}`}
                  >
                    {/* String line */}
                    <div
                      className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 border-t border-gray-400 dark:border-gray-500 pointer-events-none"
                      aria-hidden="true"
                    />

                    {/* Chord dot */}
                    {shouldShowDot(stringIndex, fretIndex + 1) && (
                      <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-sm"
                        style={getDotStyle()}
                        aria-label={`Chord note on ${stringName} string, fret ${fretIndex + 1}`}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Multiple Choice Options */}
      <div className="text-center">
        <label className="block text-gray-600 dark:text-gray-300 text-sm mb-4">
          Select the root chord:
        </label>
        <div className="flex justify-center gap-3 flex-wrap mb-6">
          {question.choices.map((choice) => (
            <button
              key={choice}
              onClick={() => setSelectedAnswer(choice)}
              disabled={showFeedback}
              className={`
                px-6 py-3 rounded-lg font-medium text-sm text-white transition-all duration-200
                min-w-[100px] focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:outline-none
                ${
                  selectedAnswer === choice
                    ? showFeedback
                      ? isCorrectAnswer
                        ? 'shadow-lg transform scale-105 ring-2 ring-green-400'
                        : 'shadow-lg transform scale-105 ring-2 ring-red-400'
                      : 'shadow-lg transform scale-105 focus:ring-white'
                    : showFeedback
                      ? 'opacity-30 cursor-not-allowed'
                      : 'opacity-60 hover:opacity-80 focus:ring-gray-400 cursor-pointer'
                }
                ${
                  showFeedback && choice === question.correctAnswer && selectedAnswer !== choice
                    ? 'ring-2 ring-green-400 opacity-90'
                    : ''
                }
              `}
              style={{
                backgroundColor: CAGED_SHAPES_BY_QUALITY[question.quality][choice].color,
              }}
              aria-label={`Select ${choice} ${question.quality}`}
              aria-pressed={selectedAnswer === choice}
            >
              {choice} {question.quality === 'major' ? 'Major' : 'Minor'}
            </button>
          ))}
        </div>

        {/* Submit Button */}
        {selectedAnswer && !showFeedback && (
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 cursor-pointer"
          >
            Submit Answer
          </button>
        )}

        {/* Feedback */}
        {showFeedback && (
          <div
            className={`text-lg font-medium ${isCorrectAnswer ? 'text-green-600' : 'text-red-600'}`}
          >
            {isCorrectAnswer
              ? '✓ Correct!'
              : `✗ Incorrect. The answer was ${question.correctAnswer} ${question.quality === 'major' ? 'Major' : 'Minor'}`}
          </div>
        )}
      </div>
    </div>
  );
}
