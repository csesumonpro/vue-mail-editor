<script setup lang="ts">
import { computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import BodyRenderer from '@/components/canvas/BodyRenderer.vue'

const store = useEditorStore()

// Canvas frame width per device (email content width caps the desktop view).
const frameWidth = computed(() => {
  const cw = store.design.body.values.contentWidth
  if (store.device === 'mobile') return 375
  if (store.device === 'tablet') return 600
  return cw
})

function onBackdropClick() {
  // Clicking the surrounding backdrop selects the body.
  if (!store.previewMode) store.selectBody()
}
</script>

<template>
  <main
    class="canvas-backdrop scroll-thin min-w-0 flex-1 overflow-y-auto"
    :style="{ backgroundColor: store.previewMode ? store.design.body.values.backgroundColor : undefined }"
    @click="onBackdropClick"
  >
    <div class="flex min-h-full justify-center p-8">
      <div
        class="h-fit min-h-[400px] w-full shadow-xl ring-1 ring-black/5 transition-[max-width] duration-200"
        :style="{
          maxWidth: frameWidth + 'px',
          backgroundColor: store.design.body.values.backgroundColor,
        }"
        @click.stop
      >
        <BodyRenderer />
      </div>
    </div>
  </main>
</template>
