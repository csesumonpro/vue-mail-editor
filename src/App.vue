<script setup lang="ts">
import TopBar from '@/components/layout/TopBar.vue'
import LeftPanel from '@/components/layout/LeftPanel.vue'
import EditorCanvas from '@/components/layout/EditorCanvas.vue'
import RightPanel from '@/components/layout/RightPanel.vue'
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
