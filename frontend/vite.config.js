import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

// Vite configuration for the React frontend with Tailwindcss.
export default defineConfig({
  plugins: [react(), tailwind()],
  base: process.env.NODE_ENV === 'production' ? '/campus-lost-found-frontend/' : '/',
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
