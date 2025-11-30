import { useContext } from 'react';
import { ThemeContext } from '../contexts/theme';

/**
 * Custom hook for accessing theme context and theme switching functionality
 *
 * Provides access to current theme state (light/dark) and theme toggle function.
 * Must be used within a ThemeProvider component tree to access theme context.
 * Throws error if used outside of provider to ensure proper usage.
 *
 * @returns Object containing:
 *   - theme: Current theme value ('light' | 'dark')
 *   - toggleTheme: Function to switch between light and dark themes
 *
 * @example
 * ```typescript
 * const { theme, toggleTheme } = useTheme();
 *
 * // Check current theme
 * const isDark = theme === 'dark';
 *
 * // Toggle theme
 * toggleTheme();
 * ```
 *
 * @throws {Error} When used outside of ThemeProvider context
 *
 * @accessibility
 * Theme changes are automatically applied to document root for CSS custom properties.
 * Respects user's system theme preference on initial load.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
