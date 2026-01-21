import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    assetsInlineLimit: 0, // Не инлайнить медиа файлы
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
        assetFileNames: (assetInfo) => {
          // Правильная обработка медиа файлов
          const fileName = assetInfo.name ?? '';
          
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac|mov)$/i.test(fileName)) {
            return 'media/[name]-[hash][extname]';
          }
          if (/\.(png|jpe?g|gif|svg|ico|webp)$/i.test(fileName)) {
            return 'images/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.mov', '**/*.mp4', '**/*.webm'],
});
