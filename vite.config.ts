import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],  
  test: {
    environment: 'jsdom',    
    globals: true
  },
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
  },
  resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  }, 
},
})
