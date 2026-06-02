<script setup lang="ts">
import TopBar from '@/components/layout/TopBar.vue'
import LeftPanel from '@/components/layout/LeftPanel.vue'
import EditorCanvas from '@/components/layout/EditorCanvas.vue'
import RightPanel from '@/components/layout/RightPanel.vue'
import ToastHost from '@/components/common/ToastHost.vue'
import ExportModal from '@/components/common/ExportModal.vue'
import { ref } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { useAutosave, loadAutosave } from '@/composables/useAutosave'
import { useHistoryShortcuts } from '@/composables/useHistory'

const store = useEditorStore()
const showExport = ref(false)

// Restore the last autosaved design (history not recorded for the initial load).
const saved = loadAutosave()
if (saved) store.loadDesign(saved, false)

useAutosave()
useHistoryShortcuts()
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden bg-slate-100">
    <TopBar @export="showExport = true" />
    <div class="flex min-h-0 flex-1">
      <LeftPanel v-show="!store.previewMode" />
      <EditorCanvas />
      <RightPanel v-show="!store.previewMode" />
    </div>
    <ExportModal :open="showExport" @close="showExport = false" />
    <ToastHost />
  </div>
</template>
