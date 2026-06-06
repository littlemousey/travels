import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/travels/',
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    })
  ],
  build: {
    // maplibre-gl is ~1 MB minified and cannot be split further; raise the limit to suppress the warning
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        // Split vendors into separate chunks so the browser can cache them independently across deploys
        manualChunks: {
          maplibre: ['maplibre-gl'],
          react: ['react', 'react-dom'],
        }
      }
    }
  }
})
