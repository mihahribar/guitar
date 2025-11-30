import { createContext } from 'react';
import type { AppPage } from '../types/navigation';

interface NavigationContextType {
  currentPage: AppPage;
  navigateTo: (page: AppPage) => void;
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);
