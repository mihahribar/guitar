import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext, type Theme } from './themeContext';

declare global {
  interface Window {
    __INITIAL_THEME__?: Theme;
  }
}

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = 'guitar-app-theme';

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // First priority: Check localStorage for saved preference
    // Storage throws in private windows and when site data is blocked
    let storedTheme: string | null = null;
    try {
      storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      // Fall through to the detected theme
    }
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    // Second priority: Use the theme already detected in index.html to prevent flash
    if (typeof window !== 'undefined' && window.__INITIAL_THEME__) {
      return window.__INITIAL_THEME__;
    }

    // Fallback to system preference detection
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    // Persist theme to localStorage
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Could not save the theme', error);
    }

    // Apply theme to document root
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
