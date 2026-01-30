import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    conditions: ['import', 'module', 'browser', 'default'],
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    dedupe: ['framer-motion'],
  },
  optimizeDeps: {
    include: ['framer-motion', 'framer-motion/value'],
    esbuildOptions: {
      conditions: ['import', 'module', 'browser', 'default'],
    },
  },
  build: {
    commonjsOptions: {
      include: [/framer-motion/, /node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    minify: 'esbuild',
    cssMinify: true,
    chunkSizeWarningLimit: 1000,
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    host: true,
  },
  define: {
    'import.meta.env.VITE_APP_TITLE': JSON.stringify('GripX'),
  },
})
