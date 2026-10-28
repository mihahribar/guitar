import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { APP_PAGES } from './src/app/navigation/pages.ts';

/**
 * GitHub Pages has no SPA fallback, so `/triads/` would 404. Emit a copy of
 * index.html for every page so each path is a real file.
 */
function pageEntries(): Plugin {
  return {
    name: 'page-entries',
    apply: 'build',
    // After Vite's own HTML plugin has put index.html in the bundle
    enforce: 'post',
    generateBundle(_, bundle) {
      const index = bundle['index.html'];
      if (!index || index.type !== 'asset') {
        this.error('index.html is missing from the bundle');
      }
      for (const page of APP_PAGES) {
        this.emitFile({ type: 'asset', fileName: `${page}/index.html`, source: index.source });
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), pageEntries()],
  resolve: {
    alias: { '@': '/src' },
  },
});
