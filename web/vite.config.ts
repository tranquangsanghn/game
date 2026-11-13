import { defineConfig } from 'vite';

// Dev: web chạy ở :5173, /api được chuyển tiếp sang máy chủ Java (:8091)
export default defineConfig({
  base: './',
  server: { proxy: { '/api': 'http://localhost:8091' } },
  build: { outDir: 'dist', emptyOutDir: true },
});
