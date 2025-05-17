import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.wasm'],
  optimizeDeps: {
    needsInterop: ['onnxruntime-web']
  },
  server: {
    https: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    fs: {
      allow: ['.', './node_modules'],
    },
    mimeTypes: {
      'application/wasm': ['wasm'],
      'application/javascript': ['js', 'mjs', 'cjs']
    }
  }
});
