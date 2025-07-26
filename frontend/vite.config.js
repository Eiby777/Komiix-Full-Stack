import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Chunk específico para ML - carga solo cuando se necesite
          'ml-detection': ['onnxruntime-web'],
          'ocr-processing': ['tesseract.js'],
          'canvas-fabric': ['fabric'],
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-state': ['axios', 'zustand', '@reduxjs/toolkit'],
          'vendor-ui': ['@heroicons/react', 'react-icons', 'lucide-react']
        }
      }
    },
    // Configuración específica para archivos WASM grandes
    chunkSizeWarningLimit: 3000, // Aumentamos el límite temporalmente
    
    // Optimización para producción
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2 // Múltiples pasadas de optimización
      }
    },
    
    // Configuración para assets grandes
    assetsInlineLimit: 0, // No hacer inline de assets grandes
  },
  
  // Configuración mejorada para WASM
  assetsInclude: ['**/*.wasm', '**/*.onnx'],
  
  // Optimización de dependencias
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'zustand'
    ],
    exclude: [
      'onnxruntime-web' // Cargar dinámicamente
    ],
    needsInterop: ['onnxruntime-web']
  },
  
  // Configuración del servidor para desarrollo
  server: {
    https: false,
    fs: {
      allow: ['.', './node_modules'],
    },
    headers: {
      // Headers necesarios para WASM y Web Workers
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    },
    mimeTypes: {
      'application/wasm': ['wasm'],
      'application/javascript': ['js', 'mjs', 'cjs']
    }
  }
})