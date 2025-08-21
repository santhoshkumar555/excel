import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This is a simple fix for the 'axios' polyfill issue
      'process/browser': 'process/browser.js',
    },
  },
});