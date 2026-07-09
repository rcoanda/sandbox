import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/cma': {
        target: 'https://openaccess-cdn.clevelandart.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cma/, ''),
      },
    },
  },
})

