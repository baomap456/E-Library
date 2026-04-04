import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return
          }
          if (id.includes('react-router-dom')) {
            return 'router'
          }
          if (id.includes('@mui') || id.includes('@emotion')) {
            return 'mui'
          }
          if (id.includes('react') || id.includes('scheduler')) {
            return 'react-vendor'
          }
          return 'vendor'
        },
      },
    },
  },
})
