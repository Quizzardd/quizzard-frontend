import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/context': path.resolve(__dirname, './src/context'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/assets': path.resolve(__dirname, './src/assets'),
      '@/pages': path.resolve(__dirname, './src/pages'),
    },
  },
});
