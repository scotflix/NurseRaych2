import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Change this to match your GitHub repo name
const repoName = 'NurseRaych2';

// GitHub Actions sets this env variable automatically
const isGithubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  base: isGithubPages ? `/${repoName}/` : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
