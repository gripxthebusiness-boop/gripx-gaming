import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    // Plugin to fix framer-motion module resolution - must run early
    {
      name: 'fix-framer-motion',
      enforce: 'pre',
      resolveId(id, importer) {
        // Fix relative imports from framer-motion
        if (id === './value/use-follow-value.mjs' && importer?.includes('framer-motion')) {
          const baseDir = path.dirname(importer)
          return path.join(baseDir, 'value', 'use-follow-value.mjs')
        }
        return null
      },
    },
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
    conditions: ['import', 'module', 'browser', 'default'],
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    dedupe: ['framer-motion'],
  },
  optimizeDeps: {
    include: ['framer-motion'],
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
  },
})
