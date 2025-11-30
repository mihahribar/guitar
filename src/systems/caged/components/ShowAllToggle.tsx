interface ShowAllToggleProps {
  showAllShapes: boolean;
  onToggle: () => void;
}

export default function ShowAllToggle({ showAllShapes, onToggle }: ShowAllToggleProps) {
  return (
    <div className="flex justify-center mb-8">
      <button
        onClick={onToggle}
        className={`px-6 py-2 rounded-full text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:outline-none cursor-pointer ${
          showAllShapes
            ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 focus:ring-gray-600 dark:focus:ring-gray-400'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-400 dark:focus:ring-gray-500'
        }`}
        aria-pressed={showAllShapes}
        aria-label={showAllShapes ? 'Show single CAGED shape' : 'Show all CAGED shapes'}
        title={showAllShapes ? 'Switch to single shape view' : 'View all shapes at once'}
      >
        {showAllShapes ? 'Show Single Shape' : 'Show All CAGED Shapes'}
      </button>
    </div>
  );
}
