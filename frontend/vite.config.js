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
    fs: {
      allow: ['.', './node_modules'],
    },
    mimeTypes: {
      'application/wasm': ['wasm'],
      'application/javascript': ['js', 'mjs', 'cjs']
    }
  }
});
