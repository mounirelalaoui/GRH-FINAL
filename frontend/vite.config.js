import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: {
    port: 5173,
    proxy: {
      '/api':     { target: 'http://localhost:8000', changeOrigin: true },
      '/storage': { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react','react-dom','react-router-dom'],
          'vendor-ui':    ['lucide-react','sweetalert2','react-hot-toast'],
          'vendor-data':  ['axios','react-query','recharts'],
          'vendor-forms': ['react-hook-form','@hookform/resolvers','zod'],
        },
      },
    },
  },
  test: { globals: true, environment: 'jsdom', setupFiles: './src/test/setup.js' },
}))
