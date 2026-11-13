import { defineConfig } from 'vite';

// Dev: web chạy ở :5173, /api được chuyển tiếp sang máy chủ Java (:8080)
export default defineConfig({
  base: './',
  server: { proxy: { '/api': 'http://localhost:8080' } },
  build: { outDir: 'dist', emptyOutDir: true },
});
