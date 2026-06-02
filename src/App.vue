<script setup lang="ts">
import TopBar from '@/components/layout/TopBar.vue'
import LeftPanel from '@/components/layout/LeftPanel.vue'
import EditorCanvas from '@/components/layout/EditorCanvas.vue'
import RightPanel from '@/components/layout/RightPanel.vue'
import { useEditorStore } from '@/stores/editor'
import { useAutosave, loadAutosave } from '@/composables/useAutosave'
import { useHistoryShortcuts } from '@/composables/useHistory'

const store = useEditorStore()

// Restore the last autosaved design (history not recorded for the initial load).
const saved = loadAutosave()
if (saved) store.loadDesign(saved, false)

useAutosave()
useHistoryShortcuts()
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden bg-slate-100">
    <TopBar />
    <div class="flex min-h-0 flex-1">
      <LeftPanel />
      <EditorCanvas />
      <RightPanel />
    </div>
  </div>
</template>
