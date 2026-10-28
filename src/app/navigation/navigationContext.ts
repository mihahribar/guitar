import { createContext, useContext } from 'react';
import type { AppPage } from './pages';

interface NavigationContextType {
  currentPage: AppPage;
  navigateTo: (page: AppPage) => void;
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
