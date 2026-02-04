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
    include: ['react', 'react-dom', 'framer-motion', 'react-router', 'react-router-dom'],
    esbuildOptions: {
      conditions: ['import', 'module', 'browser', 'default'],
    },
  },
  ssr: {
    noExternal: ['react', 'react-dom', 'framer-motion', 'react-router', 'react-router-dom'],
  },
  build: {
    commonjsOptions: {
      include: [/framer-motion/, /react-router/, /node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-router': ['react-router', 'react-router-dom'],
        },
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
    'import.meta.env.VITE_APP_TITLE': JSON.stringify('NeoSell'),
  },
})
