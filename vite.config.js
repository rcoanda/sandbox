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
      '/cooper-api': {
        target: 'https://apidocs.cooperhewitt.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cooper-api/, '/graphql-api'),
      },
      '/cooper-img': {
        target: 'https://ciim-static-media.s3.us-east-1.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cooper-img/, ''),
      },
      '/chicago-api': {
        target: 'https://api.artic.edu',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/chicago-api/, ''),
      },
      '/chicago-img': {
        target: 'https://www.artic.edu',
        changeOrigin: true,
        headers: { Referer: 'https://www.artic.edu/' },
        rewrite: (path) => path.replace(/^\/chicago-img/, ''),
      },
      '/roboflow-img': {
        target: 'https://source.roboflow.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/roboflow-img/, ''),
      },
    },
  },
})

