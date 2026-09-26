/**
 * Shared module barrel exports
 *
 * This file re-exports all shared modules for easy importing
 * across different learning systems.
 */

// Type exports
export type * from './types/core';
export type * from './types/fretboard';
export type * from './types/help';
export type * from './types/voicing';

// Utility exports
export * from './utils/musicTheory';
export * from './utils/chordUtils';
export * from './utils/splitColor';
export * from './utils/voicings';
export * from './utils/voicingSelection';

// Hook exports - currently no shared hooks, system-specific hooks in their modules

// Constant exports
export * from './constants/magicNumbers';

// Component exports
export { default as FretboardDisplay } from './components/FretboardDisplay';
export { default as SystemHelp } from './components/SystemHelp';
export { default as Kbd } from './components/Kbd';
