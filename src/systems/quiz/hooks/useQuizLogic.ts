import { useMemo } from 'react';
import type { QuizQuestion, QuizConfig, ChordType, ChordQuality } from '../types';
import { CHROMATIC_VALUES } from '@/systems/caged/constants';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateAllChoices(allChords: ChordType[]): ChordType[] {
  // Return all available chords in random order
  return shuffleArray([...allChords]);
}

function generateQualityDistribution(quizMode: string, totalQuestions: number): ChordQuality[] {
  if (quizMode === 'major') return Array(totalQuestions).fill('major');
  if (quizMode === 'minor') return Array(totalQuestions).fill('minor');

  // For 'mixed' mode, create balanced distribution and shuffle
  const majorCount = Math.ceil(totalQuestions / 2);
  const minorCount = totalQuestions - majorCount;

  const qualities: ChordQuality[] = [
    ...Array(majorCount).fill('major'),
    ...Array(minorCount).fill('minor'),
  ];

  return shuffleArray(qualities);
}

export function useQuizLogic(config: QuizConfig) {
  const generateQuestions = useMemo(() => {
    return (): QuizQuestion[] => {
      const questions: QuizQuestion[] = [];

      // Generate balanced quality distribution for all questions
      const qualityDistribution = generateQualityDistribution(
        config.quizMode,
        config.questionCount
      );

      for (let i = 0; i < config.questionCount; i++) {
        // Use pre-determined quality for balanced distribution
        const quality = qualityDistribution[i];

        // Randomly select a root chord for the question
        const rootChord =
          config.allowedChords[Math.floor(Math.random() * config.allowedChords.length)];

        // Randomly select a shape to use for displaying the chord
        const shapeUsed =
          config.allowedShapes[Math.floor(Math.random() * config.allowedShapes.length)];

        // Calculate the position where this shape needs to be played for the root chord
        const targetValue = CHROMATIC_VALUES[rootChord];
        const shapeValue = CHROMATIC_VALUES[shapeUsed];
        const position = (targetValue - shapeValue + 12) % 12;

        // Generate multiple choice options - all 5 chords in random order
        const allChoices = generateAllChoices(config.allowedChords);

        questions.push({
          id: i + 1,
          rootChord,
          shapeUsed,
          position,
          choices: allChoices,
          correctAnswer: rootChord,
          quality,
        });
      }

      return questions;
    };
  }, [config]);

  const validateAnswer = useMemo(() => {
    return (question: QuizQuestion, selectedAnswer: ChordType): boolean => {
      return question.correctAnswer === selectedAnswer;
    };
  }, []);

  const getQuestionDescription = useMemo(() => {
    return (question: QuizQuestion): string => {
      const qualityText = question.quality === 'major' ? 'major' : 'minor';
      return `What ${qualityText} chord is being played using the ${question.shapeUsed} shape at position ${question.position}?`;
    };
  }, []);

  return {
    generateQuestions,
    validateAnswer,
    getQuestionDescription,
  };
}
