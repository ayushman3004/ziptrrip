import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

/**
 * Vite MPA (Multi-Page Application) configuration.
 * Each HTML entry gets its own separate JS bundle.
 * No client-side router is used — the browser navigates between real pages.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // Page 1 — Todo List  (served at /)
        main: resolve(__dirname, 'index.html'),
        // Page 2 — Todo Detail (served at /todo.html or /todo)
        todo: resolve(__dirname, 'todo.html'),
      },
    },
  },
  server: {
    port: 5173,
  },
});
