import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react(), tailwind()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        groups: resolve(__dirname, 'groups.html'),
        channels: resolve(__dirname, 'channels.html'),
      },
    },
  },
});
