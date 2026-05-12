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
    include: ['react', 'react-dom', 'framer-motion', 'react-router-dom'],
    esbuildOptions: {
      conditions: ['import', 'module', 'browser', 'default'],
    },
  },
  ssr: {
    noExternal: ['react', 'react-dom', 'framer-motion', 'react-router-dom'],
  },
  build: {
    commonjsOptions: {
      include: [/framer-motion/, /react-router-dom/, /node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          'animation': ['framer-motion'],
          'ui-components': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          'query': ['@tanstack/react-query'],
        },
        // Optimize chunk size
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    minify: 'esbuild',
    cssMinify: true,
    chunkSizeWarningLimit: 500,
    target: 'es2020', // Modern target for smaller bundles
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    reportCompressedSize: false,
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
      },
      output: {
        comments: false,
      },
    },
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
  },
  server: {
    port: 5173,
    host: true,
  },
  define: {
    'import.meta.env.VITE_APP_TITLE': JSON.stringify('NeoSell'),
  },
})
