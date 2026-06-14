import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

// Vite configuration for the React frontend with Tailwindcss.
// Use a relative base for production so GitHub Pages can serve the app from a repo subpath.
export default defineConfig({
  plugins: [react(), tailwind()],
  base: process.env.NODE_ENV === 'production' ? './' : '/',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
