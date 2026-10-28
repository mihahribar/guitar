/** Every page in the app; the build also emits one index.html per page from this list */
export const APP_PAGES = ['caged', '3nps', 'triads', 'sevenths', 'rhythm'] as const;

export type AppPage = (typeof APP_PAGES)[number];

/** Page opened at `/` and for unknown paths */
export const DEFAULT_PAGE: AppPage = 'caged';
