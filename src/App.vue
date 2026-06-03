<script setup lang="ts">
import TopBar from '@/components/layout/TopBar.vue'
import LeftPanel from '@/components/layout/LeftPanel.vue'
import EditorCanvas from '@/components/layout/EditorCanvas.vue'
import RightPanel from '@/components/layout/RightPanel.vue'
import ToastHost from '@/components/common/ToastHost.vue'
import ExportModal from '@/components/common/ExportModal.vue'
import TemplatesModal from '@/components/common/TemplatesModal.vue'
import { SlidersHorizontal } from 'lucide-vue-next'
import { ref } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useAutosave, loadAutosave } from '@/composables/useAutosave'
import { useHistoryShortcuts } from '@/composables/useHistory'
import { useTheme } from '@/composables/useTheme'

const store = useEditorStore()
const showExport = ref(false)
const showTemplates = ref(false)

useTheme().init()

// Restore the last autosaved design (history not recorded for the initial load).
const saved = loadAutosave()
if (saved) store.loadDesign(saved, false)

useAutosave()
useHistoryShortcuts()
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden bg-app">
    <TopBar @export="showExport = true" @templates="showTemplates = true" />
    <div class="relative flex min-h-0 flex-1">
      <LeftPanel v-show="!store.previewMode" />
      <EditorCanvas />

      <!-- Floating settings toggle, top-right of the editing area -->
      <button
        v-show="!store.previewMode && !store.inspectorOpen"
        type="button"
        title="Settings"
        class="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-subtle shadow-md transition hover:border-ink hover:text-ink"
        @click="store.openInspector()"
      >
        <SlidersHorizontal class="h-4 w-4" />
      </button>

      <RightPanel v-show="!store.previewMode && store.inspectorOpen" />
    </div>
    <ExportModal :open="showExport" @close="showExport = false" />
    <TemplatesModal :open="showTemplates" @close="showTemplates = false" />
    <ToastHost />
  </div>
</template>
