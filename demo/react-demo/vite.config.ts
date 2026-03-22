import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use subdirectory base for production (GitHub Pages)
  base: command === 'build' ? '/cloudimage-360-view/react-demo/' : '/',
  server: {
    port: 5176,
  },
  build: {
    outDir: '../../dist/react-demo',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@cloudimage/360-view/react': resolve(__dirname, '../../src/react/index.ts'),
      '@cloudimage/360-view': resolve(__dirname, '../../src/index.js'),
    },
  },
  css: {
    preprocessorOptions: {},
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
}));
