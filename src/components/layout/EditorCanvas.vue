<script setup lang="ts">
import { computed } from 'vue'
import { useEditor } from "@/core/useEditor"
import { useConfig } from '@/core/useConfig'
import BodyRenderer from '@/components/canvas/BodyRenderer.vue'
import MetaHeader from './MetaHeader.vue'

const store = useEditor()
const config = useConfig()
// Show the metadata header when any field is enabled (and not in preview).
const showMeta = computed(
  () => config.meta.from || config.meta.replyTo || config.meta.subject || config.meta.preview,
)

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

// Exposed to the `#meta` scoped slot. `meta` holds subject/from/replyTo/preview
// (+ any custom keys). The `preview` fallback covers designs authored before
// preview moved into `meta`.
const metaScope = computed(() => ({
  preview: store.design.body.values.preheaderText || undefined,
  ...(store.design.meta ?? {}),
}))

function setMeta(patch: Record<string, string>) {
  store.updateMeta(patch, 'meta:slot')
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
        class="w-full transition-[max-width] duration-200"
        :style="{ maxWidth: frameWidth + 'px' }"
      >
        <!-- Metadata area above the email frame. A host `#meta` slot replaces
             the built-in header entirely (e.g. a domain-validated From). -->
        <div v-if="$slots.meta && !store.previewMode" class="mb-6" @click.stop>
          <slot name="meta" :meta="metaScope" :set-meta="setMeta" />
        </div>
        <MetaHeader
          v-else-if="showMeta && !store.previewMode"
          class="mb-6"
          @click.stop
        />

        <div
          class="h-fit min-h-[400px] w-full shadow-xl ring-1 ring-black/5"
          :style="{ backgroundColor: store.design.body.values.backgroundColor }"
          @click.stop
        >
          <BodyRenderer>
            <template v-if="$slots.empty" #empty><slot name="empty" /></template>
          </BodyRenderer>
        </div>
      </div>
    </div>
  </main>
</template>
