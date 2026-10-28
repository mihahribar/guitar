import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { NavigationContext } from './navigationContext';
import { canonicalUrl, pageFromPath, pathForPage, type AppPage } from './pages';

declare global {
  interface Window {
    /** Set in index.html; `count` only exists once GoatCounter's script has loaded */
    goatcounter?: { count?: (vars: { path: string }) => void };
  }
}

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
      const path = pathForPage(page);
      window.history.pushState(null, '', path);
      // GoatCounter only counts the first load by itself; missing when blocked
      window.goatcounter?.count?.({ path });
    }
    setCurrentPage(page);
  };

  return (
    <NavigationContext.Provider value={{ currentPage, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  );
}
