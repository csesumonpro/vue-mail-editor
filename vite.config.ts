import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import { fileURLToPath, URL } from 'node:url'

// Library build config: bundles src/index.ts into dist/ as an ESM package.
// `vue` is externalized (peer dependency); `.d.ts` types are rolled up to one file.
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      include: ['src'],
      exclude: ['playground', 'src/**/*.spec.*'],
      rollupTypes: true,
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // We ship a custom bubble toolbar, so stub out Tiptap's menu plugins to
      // drop tippy.js + @popperjs/core from the bundle (rollup can't tree-shake
      // them via @tiptap/vue-3's barrel). Library build only — dev/playground
      // still uses the real packages.
      '@tiptap/extension-bubble-menu': fileURLToPath(
        new URL('./build/tiptap-menu-stub.js', import.meta.url),
      ),
      '@tiptap/extension-floating-menu': fileURLToPath(
        new URL('./build/tiptap-menu-stub.js', import.meta.url),
      ),
    },
  },
  build: {
    copyPublicDir: false,
    // vuedraggable is CommonJS and `require('vue')`. Treat vue as an ESM external
    // so the build emits a namespace import, not a default import (Vue 3's ESM has
    // no default export). Do NOT set requireReturnsDefault globally — it breaks
    // sortablejs's default export (vuedraggable does `new Sortable`).
    commonjsOptions: {
      esmExternals: ['vue'],
    },
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
