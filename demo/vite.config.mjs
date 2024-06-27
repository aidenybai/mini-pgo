import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vitePlugin } from '../agent/src/server.js';
import Inspect from 'vite-plugin-inspect';

export default defineConfig({
  plugins: [vitePlugin(), react(), Inspect()],
});
