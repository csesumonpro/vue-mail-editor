<script setup lang="ts">
import TopBar from '@/components/layout/TopBar.vue'
import LeftPanel from '@/components/layout/LeftPanel.vue'
import EditorCanvas from '@/components/layout/EditorCanvas.vue'
import RightPanel from '@/components/layout/RightPanel.vue'
import ToastHost from '@/components/common/ToastHost.vue'
import { useEditorStore } from '@/stores/editor'
import { useAutosave, loadAutosave } from '@/composables/useAutosave'
import { useHistoryShortcuts } from '@/composables/useHistory'
import { useToast } from '@/composables/useToast'

const store = useEditorStore()
const { notify } = useToast()

// Restore the last autosaved design (history not recorded for the initial load).
const saved = loadAutosave()
if (saved) store.loadDesign(saved, false)

useAutosave()
useHistoryShortcuts()

function onExport() {
  // Export modal is wired in Phase 9.
  notify('HTML export arrives in Phase 9', 'info')
}
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden bg-slate-100">
    <TopBar @export="onExport" />
    <div class="flex min-h-0 flex-1">
      <LeftPanel v-show="!store.previewMode" />
      <EditorCanvas />
      <RightPanel v-show="!store.previewMode" />
    </div>
    <ToastHost />
  </div>
</template>
