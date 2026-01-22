import { defineConfig } from 'vite'
import path from 'path'
import { readFileSync, existsSync } from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    // Plugin to fix framer-motion module resolution
    {
      name: 'fix-framer-motion-resolve',
      resolveId(id, importer) {
        // Handle relative imports from framer-motion
        if (id.startsWith('./') && importer?.includes('framer-motion')) {
          const baseDir = path.dirname(importer)
          const resolvedPath = path.resolve(baseDir, id)
          
          // Try .mjs extension if not already present
          if (!id.endsWith('.mjs') && !id.includes('.')) {
            const mjsPath = resolvedPath + '.mjs'
            if (existsSync(mjsPath)) {
              return mjsPath
            }
          } else if (id.endsWith('.mjs')) {
            if (existsSync(resolvedPath)) {
              return resolvedPath
            }
          }
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
