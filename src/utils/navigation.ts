import { APP_PAGES, DEFAULT_PAGE, type AppPage } from '../types/navigation';

/** URL path for a page, with a trailing slash so GitHub Pages serves it without a redirect */
export function pathForPage(page: AppPage): string {
  return `/${page}/`;
}

/** Page for a URL path; anything unknown, including `/`, falls back to the default page */
export function pageFromPath(pathname: string): AppPage {
  const segment = pathname.split('/').filter(Boolean)[0];
  return APP_PAGES.find((page) => page === segment) ?? DEFAULT_PAGE;
}

/** The URL with its path rewritten to the page's own path, keeping the query and hash */
export function canonicalUrl({
  pathname,
  search,
  hash,
}: Pick<Location, 'pathname' | 'search' | 'hash'>): string {
  return `${pathForPage(pageFromPath(pathname))}${search}${hash}`;
}
