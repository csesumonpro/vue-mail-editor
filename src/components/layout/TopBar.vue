<script setup lang="ts">
import {
  Mail,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Undo2,
  Redo2,
  Save,
  Code2,
} from 'lucide-vue-next'
import { useEditorStore } from '@/stores/editor'
import type { Device } from '@/types/schema'

const store = useEditorStore()

const devices: { id: Device; icon: typeof Monitor; label: string }[] = [
  { id: 'desktop', icon: Monitor, label: 'Desktop' },
  { id: 'tablet', icon: Tablet, label: 'Tablet' },
  { id: 'mobile', icon: Smartphone, label: 'Mobile' },
]
</script>

<template>
  <header
    class="flex h-14 shrink-0 items-center justify-between border-b border-line bg-brand px-4 text-white"
  >
    <!-- Brand -->
    <div class="flex items-center gap-2">
      <Mail class="h-5 w-5" />
      <span class="text-sm font-semibold tracking-tight">Vue Email Editor</span>
    </div>

    <!-- Device toggles -->
    <div class="flex items-center gap-1 rounded-lg bg-white/15 p-1">
      <button
        v-for="d in devices"
        :key="d.id"
        type="button"
        :title="d.label"
        class="flex h-8 w-8 items-center justify-center rounded-md transition"
        :class="
          store.device === d.id
            ? 'bg-white text-brand-dark shadow-sm'
            : 'text-white/80 hover:bg-white/10'
        "
        @click="store.setDevice(d.id)"
      >
        <component :is="d.icon" class="h-4 w-4" />
      </button>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2">
      <button
        type="button"
        title="Undo"
        class="flex h-8 w-8 items-center justify-center rounded-md text-white/80 transition hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-transparent"
        :disabled="!store.canUndo"
        @click="store.undo()"
      >
        <Undo2 class="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Redo"
        class="flex h-8 w-8 items-center justify-center rounded-md text-white/80 transition hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-transparent"
        :disabled="!store.canRedo"
        @click="store.redo()"
      >
        <Redo2 class="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Preview"
        class="flex h-8 w-8 items-center justify-center rounded-md transition"
        :class="
          store.previewMode
            ? 'bg-white text-brand-dark'
            : 'text-white/80 hover:bg-white/15'
        "
        @click="store.togglePreview()"
      >
        <Eye class="h-4 w-4" />
      </button>

      <div class="mx-1 h-6 w-px bg-white/25" />

      <button
        type="button"
        class="flex items-center gap-1.5 rounded-md bg-black/85 px-3 py-1.5 text-xs font-semibold hover:bg-black"
      >
        <Save class="h-4 w-4" />
        Save Design
      </button>
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-md bg-black/85 px-3 py-1.5 text-xs font-semibold hover:bg-black"
      >
        <Code2 class="h-4 w-4" />
        Export HTML
      </button>
    </div>
  </header>
</template>
