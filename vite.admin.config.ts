import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// Builds the admin application as the root document of its separate deployment.
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'rename-admin-entry',
      closeBundle() {
        const outputDir = path.resolve('dist')
        const adminEntry = path.join(outputDir, 'admin.html')
        const publicEntry = path.join(outputDir, 'index.html')
        if (!fs.existsSync(adminEntry)) {
          throw new Error(`Expected admin entry was not generated: ${adminEntry}`)
        }
        fs.renameSync(adminEntry, publicEntry)
      },
    },
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      input: 'admin.html',
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
