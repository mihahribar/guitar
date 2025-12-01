import { lazy, Suspense } from 'react';
import CAGEDVisualizer from '@/systems/caged/components/CAGEDVisualizer';
import { AppNavigation, LoadingFallback } from '@/shared/components';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { useNavigation } from './hooks/useNavigation';

// Lazy load Quiz and Rhythm components for better initial bundle size
const QuizPage = lazy(() => import('@/systems/quiz/components/QuizPage'));
const RhythmPage = lazy(() => import('@/systems/rhythm-game/components/RhythmPage'));

function AppContent() {
  const { currentPage } = useNavigation();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation Bar */}
      <header>
        <AppNavigation />
      </header>

      {/* Main Content */}
      <main>
        {currentPage === 'caged' && (
          <ErrorBoundary componentName="CAGEDVisualizer">
            <CAGEDVisualizer />
          </ErrorBoundary>
        )}
        {currentPage === 'quiz' && (
          <ErrorBoundary componentName="QuizPage">
            <Suspense fallback={<LoadingFallback message="Loading quiz..." size="large" />}>
              <QuizPage />
            </Suspense>
          </ErrorBoundary>
        )}
        {currentPage === 'rhythm' && (
          <ErrorBoundary componentName="RhythmPage">
            <Suspense fallback={<LoadingFallback message="Loading rhythm game..." size="large" />}>
              <RhythmPage />
            </Suspense>
          </ErrorBoundary>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </ThemeProvider>
  );
}

export default App;
