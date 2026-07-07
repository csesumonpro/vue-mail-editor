<script setup lang="ts">
import { computed, ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { useEditor } from "@/core/useEditor"
import { useConfig } from '@/core/useConfig'
import { useBlocks } from '@/core/registry'
import { exportHtml } from '@/export/htmlExporter'
import BodyRenderer from '@/components/canvas/BodyRenderer.vue'
import MetaHeader from './MetaHeader.vue'

const store = useEditor()
const config = useConfig()
const blocks = useBlocks()
// Show the metadata header when any field is enabled (and not in preview).
const showMeta = computed(
  () => config.meta.from || config.meta.replyTo || config.meta.subject || config.meta.preview,
)

// Canvas frame width per device. Widths come from config (host-overridable);
// desktop falls back to the design's own content width when unset.
const frameWidth = computed(() => {
  const dw = config.deviceWidths
  if (store.device === 'mobile') return dw.mobile
  if (store.device === 'tablet') return dw.tablet
  return dw.desktop ?? store.design.body.values.contentWidth
})

// Viewport width for the real-preview iframe. The exported email stacks columns
// at `@media (max-width:600px)`, so a desktop preview rendered at exactly the
// 600px content width would (wrongly) collapse multi-column containers. Render
// desktop wider than that breakpoint — the email still caps at contentWidth and
// centers, matching the Export dialog and real desktop clients. Mobile/tablet
// keep their true device widths so responsive stacking previews faithfully.
const previewWidth = computed(() => {
  const dw = config.deviceWidths
  if (store.device === 'mobile') return dw.mobile
  if (store.device === 'tablet') return dw.tablet
  const desktop = dw.desktop ?? store.design.body.values.contentWidth
  return Math.max(desktop + 80, 680)
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

/* Real preview -------------------------------------------------------- */
// In preview mode we render the actual exported email in an isolated iframe
// (same as the export dialog) — no editing chrome, spacers, or selection
// borders. `fallback` resolves variables to their fallback values so it reads
// like a real email.
const previewHtml = computed(() =>
  store.previewMode ? exportHtml(store.design, blocks, 'fallback', config.variableSyntax) : '',
)

const previewFrame = ref<HTMLIFrameElement | null>(null)
const frameHeight = ref(400)
let ro: ResizeObserver | null = null

// Size the iframe to its content so the whole email shows and the canvas (not
// the iframe) scrolls. A ResizeObserver keeps it correct as images load / the
// width changes.
function fitFrame() {
  const win = previewFrame.value?.contentWindow
  const doc = win?.document
  if (!win || !doc) return
  const measure = () => {
    frameHeight.value = doc.documentElement.scrollHeight
  }
  measure()
  ro?.disconnect()
  ro = new win.ResizeObserver(measure)
  ro.observe(doc.documentElement)
}

// Device switch changes the iframe width without reloading srcdoc — re-measure.
watch(previewWidth, () => nextTick(fitFrame))
onBeforeUnmount(() => ro?.disconnect())
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
        :style="{ maxWidth: (store.previewMode ? previewWidth : frameWidth) + 'px' }"
      >
        <!-- Preview mode: the real exported email in an isolated iframe. -->
        <iframe
          v-if="store.previewMode"
          ref="previewFrame"
          :srcdoc="previewHtml"
          class="block w-full border-0 bg-white shadow-xl ring-1 ring-black/5"
          :style="{ height: frameHeight + 'px' }"
          title="Email preview"
          @load="fitFrame"
        />

        <!-- Edit mode: metadata header + editable canvas. A host `#meta` slot
             replaces the built-in header entirely (e.g. a domain-validated From). -->
        <template v-else>
          <div v-if="$slots.meta" class="mb-6" @click.stop>
            <slot name="meta" :meta="metaScope" :set-meta="setMeta" />
          </div>
          <MetaHeader v-else-if="showMeta" class="mb-6" @click.stop />

          <div
            class="h-fit min-h-[400px] w-full shadow-xl ring-1 ring-black/5"
            :style="{ backgroundColor: store.design.body.values.backgroundColor }"
            @click.stop
          >
            <BodyRenderer>
              <template v-if="$slots.empty" #empty><slot name="empty" /></template>
            </BodyRenderer>
          </div>
        </template>
      </div>
    </div>
  </main>
</template>
