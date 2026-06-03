<script setup lang="ts">
import { ref } from 'vue'
import {
  Mail,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  EyeOff,
  Undo2,
  Redo2,
  Save,
  Code2,
  FilePlus2,
  FolderOpen,
  LayoutTemplate,
  Sun,
  Moon,
} from 'lucide-vue-next'
import { useEditorStore } from '@/stores/editor'
import { useToast } from '@/composables/useToast'
import { useTheme } from '@/composables/useTheme'
import { downloadDesign, readDesignFile } from '@/utils/designIO'
import type { Device } from '@/types/schema'

const store = useEditorStore()
const { notify } = useToast()
const { isDark, toggle: toggleTheme } = useTheme()
const fileInput = ref<HTMLInputElement | null>(null)

const emit = defineEmits<{ export: []; templates: [] }>()

const devices: { id: Device; icon: typeof Monitor; label: string }[] = [
  { id: 'desktop', icon: Monitor, label: 'Desktop' },
  { id: 'tablet', icon: Tablet, label: 'Tablet' },
  { id: 'mobile', icon: Smartphone, label: 'Mobile' },
]

function onSave() {
  downloadDesign(store.design)
  notify('Design saved')
}

function onNew() {
  if (confirm('Start a new design? Unsaved changes will be lost.')) {
    store.resetDesign()
    notify('New design created', 'info')
  }
}

async function onImport(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    const design = await readDesignFile(file)
    store.loadDesign(design)
    notify('Design loaded')
  } catch (err) {
    notify(err instanceof Error ? err.message : 'Import failed', 'error')
  } finally {
    if (fileInput.value) fileInput.value.value = ''
  }
}
</script>

<template>
  <header
    class="flex h-14 shrink-0 items-center justify-between border-b border-line bg-header px-4 text-header-fg"
  >
    <!-- Brand -->
    <div class="flex items-center gap-2">
      <Mail class="h-5 w-5" />
      <span class="text-sm font-semibold tracking-tight">Vue Email Editor</span>
    </div>

    <!-- Device toggles -->
    <div class="flex items-center gap-1 rounded-lg bg-ink/5 p-1">
      <button
        v-for="d in devices"
        :key="d.id"
        type="button"
        v-tooltip="d.label"
        class="flex h-8 w-8 items-center justify-center rounded-md transition"
        :class="
          store.device === d.id
            ? 'bg-brand text-on-accent shadow-sm'
            : 'text-faint hover:bg-ink/10 hover:text-header-fg'
        "
        @click="store.setDevice(d.id)"
      >
        <component :is="d.icon" class="h-4 w-4" />
      </button>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-1.5">
      <button
        type="button"
        v-tooltip="'Undo'"
        class="flex h-8 w-8 items-center justify-center rounded-md text-faint transition hover:bg-ink/10 hover:text-header-fg disabled:opacity-40 disabled:hover:bg-transparent"
        :disabled="!store.canUndo"
        @click="store.undo()"
      >
        <Undo2 class="h-4 w-4" />
      </button>
      <button
        type="button"
        v-tooltip="'Redo'"
        class="flex h-8 w-8 items-center justify-center rounded-md text-faint transition hover:bg-ink/10 hover:text-header-fg disabled:opacity-40 disabled:hover:bg-transparent"
        :disabled="!store.canRedo"
        @click="store.redo()"
      >
        <Redo2 class="h-4 w-4" />
      </button>
      <button
        type="button"
        v-tooltip="store.previewMode ? 'Exit preview' : 'Preview'"
        class="flex h-8 w-8 items-center justify-center rounded-md transition"
        :class="
          store.previewMode
            ? 'bg-brand text-on-accent'
            : 'text-faint hover:bg-ink/10 hover:text-header-fg'
        "
        @click="store.togglePreview()"
      >
        <component :is="store.previewMode ? EyeOff : Eye" class="h-4 w-4" />
      </button>
      <button
        type="button"
        v-tooltip="isDark ? 'Light mode' : 'Dark mode'"
        class="flex h-8 w-8 items-center justify-center rounded-md text-faint transition hover:bg-ink/10 hover:text-header-fg"
        @click="toggleTheme"
      >
        <component :is="isDark ? Sun : Moon" class="h-4 w-4" />
      </button>

      <div class="mx-1 h-6 w-px bg-line" />

      <button
        type="button"
        v-tooltip="'Templates'"
        class="flex h-8 w-8 items-center justify-center rounded-md text-faint transition hover:bg-ink/10 hover:text-header-fg"
        @click="emit('templates')"
      >
        <LayoutTemplate class="h-4 w-4" />
      </button>
      <button
        type="button"
        v-tooltip="'New design'"
        class="flex h-8 w-8 items-center justify-center rounded-md text-faint transition hover:bg-ink/10 hover:text-header-fg"
        @click="onNew"
      >
        <FilePlus2 class="h-4 w-4" />
      </button>
      <button
        type="button"
        v-tooltip="'Import design JSON'"
        class="flex h-8 w-8 items-center justify-center rounded-md text-faint transition hover:bg-ink/10 hover:text-header-fg"
        @click="fileInput?.click()"
      >
        <FolderOpen class="h-4 w-4" />
      </button>
      <input
        ref="fileInput"
        type="file"
        accept="application/json,.json"
        class="hidden"
        @change="onImport"
      />

      <div class="mx-1 h-6 w-px bg-line" />

      <button
        type="button"
        class="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary transition hover:opacity-90"
        @click="onSave"
      >
        <Save class="h-4 w-4" />
        Save Design
      </button>
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary transition hover:opacity-90"
        @click="emit('export')"
      >
        <Code2 class="h-4 w-4" />
        Export HTML
      </button>
    </div>
  </header>
</template>
