import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/dist/',
        '**/.github/',
        '**/coverage/',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 50,
        statements: 60,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, './src'),
      '@/shared': resolve(import.meta.dirname, './src/shared'),
      '@/systems/caged': resolve(import.meta.dirname, './src/systems/caged'),
      '@/systems/rhythm-game': resolve(import.meta.dirname, './src/systems/rhythm-game'),
      '@/systems/three-nps': resolve(import.meta.dirname, './src/systems/three-nps'),
    },
  },
});
