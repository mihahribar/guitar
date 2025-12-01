import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Web Audio API for rhythm game tests
class AudioContextMock {
  currentTime = 0;
  destination = {};
  createOscillator() {
    return {
      connect: () => {},
      start: () => {},
      stop: () => {},
      frequency: { value: 0 },
      type: 'sine',
    };
  }
  createGain() {
    return {
      connect: () => {},
      gain: { value: 1, setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
    };
  }
  resume() {
    return Promise.resolve();
  }
}

globalThis.AudioContext = AudioContextMock as unknown as typeof AudioContext;

// Mock window.matchMedia for theme tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});
