import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// Library build config: bundles src/index.ts into dist/ as an ESM package.
// `vue` is externalized (peer dependency). Declaration files are emitted in P8.
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'VueEmailEditor',
      formats: ['es'],
      fileName: () => 'vue-email-editor.js',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        assetFileNames: (asset) =>
          asset.names?.[0]?.endsWith('.css') ? 'style.css' : '[name][extname]',
      },
    },
  },
})
