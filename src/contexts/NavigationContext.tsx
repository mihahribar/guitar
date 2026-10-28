import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AppPage } from '../types/navigation';
import { canonicalUrl, pageFromPath, pathForPage } from '../utils/navigation';
import { NavigationContext } from './NavigationContextCore';

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<AppPage>(() => {
    // Show the page's own path, e.g. `/` becomes `/caged/`, without adding a history entry
    window.history.replaceState(null, '', canonicalUrl(window.location));
    return pageFromPath(window.location.pathname);
  });

  // Browser back and forward move between pages
  useEffect(() => {
    const handlePopState = () => setCurrentPage(pageFromPath(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: AppPage) => {
    if (page !== currentPage) {
      window.history.pushState(null, '', pathForPage(page));
    }
    setCurrentPage(page);
  };

  return (
    <NavigationContext.Provider value={{ currentPage, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  );
}
