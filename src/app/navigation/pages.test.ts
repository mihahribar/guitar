import { describe, expect, it } from 'vitest';
import { APP_PAGES, DEFAULT_PAGE, canonicalUrl, pageFromPath, pathForPage } from './pages';

describe('navigation paths', () => {
  it('round-trips every page', () => {
    for (const page of APP_PAGES) {
      expect(pageFromPath(pathForPage(page))).toBe(page);
    }
  });

  it('gives every page its own path with a trailing slash', () => {
    expect(pathForPage('caged')).toBe('/caged/');
    expect(pathForPage('triads')).toBe('/triads/');
  });

  it('opens the default page at the root', () => {
    expect(pageFromPath('/')).toBe(DEFAULT_PAGE);
  });

  it('accepts a path without the trailing slash', () => {
    expect(pageFromPath('/triads')).toBe('triads');
  });

  it('reads only the first segment', () => {
    expect(pageFromPath('/triads/foo')).toBe('triads');
  });

  it('falls back to the default page for unknown paths', () => {
    expect(pageFromPath('/nonsense/')).toBe(DEFAULT_PAGE);
    expect(pageFromPath('')).toBe(DEFAULT_PAGE);
  });
});

describe('canonicalUrl', () => {
  it('rewrites the root to the default page', () => {
    expect(canonicalUrl({ pathname: '/', search: '', hash: '' })).toBe('/caged/');
  });

  it('keeps the query string and hash', () => {
    expect(canonicalUrl({ pathname: '/', search: '?key=G&q=minor', hash: '#top' })).toBe(
      '/caged/?key=G&q=minor#top'
    );
  });

  it('leaves a page path as it is', () => {
    expect(canonicalUrl({ pathname: '/triads/', search: '?inv=1', hash: '' })).toBe(
      '/triads/?inv=1'
    );
  });

  it('drops junk after the page segment', () => {
    expect(canonicalUrl({ pathname: '/triads/foo', search: '', hash: '' })).toBe('/triads/');
  });
});
