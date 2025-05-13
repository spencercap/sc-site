import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [],
  base: './',
  publicDir: 'public',
  build: {
    outDir: 'docs'
  }
})
