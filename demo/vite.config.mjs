import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vitePlugin } from '../agent/src/plugin';
import Inspect from 'vite-plugin-inspect';

console.log('rerun');

export default defineConfig({
  plugins: [vitePlugin(), react(), Inspect()],
});
