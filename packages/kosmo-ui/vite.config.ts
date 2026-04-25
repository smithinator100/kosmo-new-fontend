import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'tokens/index': resolve(__dirname, 'src/tokens/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const ext = format === 'es' ? 'js' : 'cjs';
        if (entryName === 'index') return `kosmo-ui.${ext}`;
        return `${entryName}.${ext}`;
      },
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ['lucide'],
      output: {
        assetFileNames: (asset) => {
          if (asset.names?.[0]?.endsWith('.css')) return 'kosmo-ui.css';
          return 'assets/[name][extname]';
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  test: {
    environment: 'happy-dom',
    globals: false,
    include: ['src/**/*.test.ts'],
    exclude: ['src/**/*.types.test.ts'],
    setupFiles: ['./src/test-setup.ts'],
  },
});
