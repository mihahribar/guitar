import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
      '@/shared': '/src/shared',
      '@/systems': '/src/systems',
      '@/components': '/src/components',
      '@/hooks': '/src/hooks',
      '@/types': '/src/types',
      '@/constants': '/src/constants',
      '@/utils': '/src/utils',
      '@/contexts': '/src/contexts',
    },
  },
});
