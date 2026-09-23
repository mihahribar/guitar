/**
 * Triads system barrel export
 */

// Default export for lazy loading
export { default as TriadsPage } from './components/TriadsPage';
export { default as TriadsNavigation } from './components/TriadsNavigation';
export { default as TriadsToggles } from './components/TriadsToggles';

export { useTriadsState, triadsReducer } from './hooks/useTriadsState';
export { useTriadsLogic } from './hooks/useTriadsLogic';
export { useTriadsKeyboard } from './hooks/useTriadsKeyboard';

export type * from './types';
export * from './constants';
export * from './utils/triads';
