import { useState } from 'react';
import type { ReactNode } from 'react';
import type { AppPage } from '../types/navigation';
import { NavigationContext } from './NavigationContextCore';

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<AppPage>('caged');

  const navigateTo = (page: AppPage) => {
    setCurrentPage(page);
  };

  return (
    <NavigationContext.Provider value={{ currentPage, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  );
}
