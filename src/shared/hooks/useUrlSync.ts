import { useEffect } from 'react';

/**
 * Keep the query string in step with a page's settings, so the address bar is
 * always a link to the current setup. Uses `replaceState`, so changing a
 * setting doesn't add a history entry.
 */
export function useUrlSync(params: URLSearchParams): void {
  const query = params.toString();

  useEffect(() => {
    const search = query ? `?${query}` : '';
    const { pathname, hash } = window.location;
    if (window.location.search !== search) {
      window.history.replaceState(window.history.state, '', `${pathname}${search}${hash}`);
    }
  }, [query]);
}
