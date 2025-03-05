/**
 * Vite Configuration for a React and Tailwind CSS project.
 * 
 * - Uses the `@vitejs/plugin-react` plugin to enable React support.
 * - Integrates Tailwind CSS via `@tailwindcss/vite`.
 * - Configures the build output directory to `dist`.
 * 
 * @requires vite - Vite's configuration API.
 * @requires @vitejs/plugin-react - Enables support for React in Vite.
 * @requires @tailwindcss/vite - Tailwind CSS integration for Vite.
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist'
  }
})
