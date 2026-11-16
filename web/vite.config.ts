import { defineConfig } from 'vite';

// Chỉ có giao diện (không có máy chủ), build ra web/dist rồi GitHub Actions đưa lên GitHub Pages
export default defineConfig({
  base: './',
  build: { outDir: 'dist', emptyOutDir: true },
});
