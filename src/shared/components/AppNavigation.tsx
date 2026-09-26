import { useNavigation } from '../../hooks/useNavigation';
import ThemeToggle from './ThemeToggle';
import type { AppPage } from '../../types/navigation';

export default function AppNavigation() {
  const { currentPage, navigateTo } = useNavigation();

  const navItems: { page: AppPage; label: string; description: string }[] = [
    { page: 'caged', label: 'CAGED', description: 'Interactive CAGED system explorer' },
    { page: '3nps', label: '3NPS', description: 'Three notes per string scale system' },
    { page: 'triads', label: 'Triads', description: 'Triad inversions on string sets' },
    { page: 'rhythm', label: 'Rhythm', description: 'Practice rhythm patterns' },
  ];

  return (
    <nav
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1 className="hidden sm:block text-xl font-light text-gray-800 dark:text-gray-100">
              Fretboard Lab 🎸
            </h1>
          </div>

          {/* Navigation Links and Theme Toggle */}
          <div className="flex items-center gap-1 sm:gap-3 ml-auto">
            {navItems.map(({ page, label, description }) => (
              <button
                key={page}
                onClick={() => navigateTo(page)}
                className={`
                  px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900
                  ${
                    currentPage === page
                      ? 'bg-blue-600 text-white shadow-sm focus:ring-blue-500'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-400'
                  }
                `}
                aria-label={`Navigate to ${label}: ${description}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {label}
              </button>
            ))}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
