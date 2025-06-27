import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  base: '/accessibility-checker/',
  build: {
    lib: {
      entry: 'src/main.tsx',
      name: 'AccessibilityChecker',
      formats: ['umd'],
      fileName: 'accessibility-checker'
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    outDir: 'dist',
    assetsDir: 'assets',
  },
})