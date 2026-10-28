/** Every page in the app; the build also emits one index.html per page from this list */
export const APP_PAGES = ['caged', '3nps', 'triads', 'sevenths', 'rhythm'] as const;

export type AppPage = (typeof APP_PAGES)[number];

/** Page opened at `/` and for unknown paths */
export const DEFAULT_PAGE: AppPage = 'caged';

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
}: {
  pathname: string;
  search: string;
  hash: string;
}): string {
  return `${pathForPage(pageFromPath(pathname))}${search}${hash}`;
}
