/**
 * 3NPS (three notes per string) system barrel export
 */

// Default export for lazy loading
export { default as ThreeNpsPage } from './components/ThreeNpsPage';
export { default as ThreeNpsNavigation } from './components/ThreeNpsNavigation';
export { default as ThreeNpsToggles } from './components/ThreeNpsToggles';

export { useThreeNpsState, threeNpsReducer } from './hooks/useThreeNpsState';
export { useThreeNpsLogic } from './hooks/useThreeNpsLogic';
export { useThreeNpsKeyboard } from './hooks/useThreeNpsKeyboard';

export type * from './types';
export * from './constants';
export * from './utils/threeNps';
