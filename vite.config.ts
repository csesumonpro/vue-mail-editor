import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('tiptap') || id.includes('prosemirror')) return 'editor'
          if (id.includes('sortable') || id.includes('vuedraggable')) return 'dnd'
          if (id.includes('lucide')) return 'icons'
          if (id.includes('@vue') || id.includes('/vue/') || id.includes('pinia'))
            return 'vue'
        },
      },
    },
  },
})
