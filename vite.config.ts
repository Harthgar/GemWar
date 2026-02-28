import { defineConfig } from 'vite';

export default defineConfig({
  base: '/GemWar/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser']
        }
      }
    }
  },
  server: {
    port: 8080
  }
});
