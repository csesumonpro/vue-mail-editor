<script setup lang="ts">
import TopBar from '@/components/layout/TopBar.vue'
import LeftPanel from '@/components/layout/LeftPanel.vue'
import EditorCanvas from '@/components/layout/EditorCanvas.vue'
import RightPanel from '@/components/layout/RightPanel.vue'
import ToastHost from '@/components/common/ToastHost.vue'
import ExportModal from '@/components/common/ExportModal.vue'
import TemplatesModal from '@/components/common/TemplatesModal.vue'
import { SlidersHorizontal } from 'lucide-vue-next'
import { ref, provide, computed, watch, watchEffect, onBeforeUnmount } from 'vue'
import { createEditor } from '@/core/createEditor'
import { createRegistry } from '@/core/registry'
import { EDITOR_KEY, BLOCKS_KEY, CONFIG_KEY } from '@/core/keys'
import type { AnyBlockDefinition } from '@/api/types'
import type { ThemeTokens } from '@/api/theme'
import { themeToCss } from '@/api/theme'
import type { EditorConfig } from '@/api/config'
import { resolveConfig } from '@/api/config'
import { vTooltip } from '@/directives/tooltip'
import { useAutosave, loadAutosave } from '@/composables/useAutosave'
import { useHistoryShortcuts } from '@/composables/useHistory'
import { uid } from '@/utils/id'

const props = withDefaults(
  defineProps<{
    blocks?: AnyBlockDefinition[]
    disabledBlocks?: string[]
    theme?: ThemeTokens
    colorMode?: 'light' | 'dark' | 'auto'
    config?: EditorConfig
  }>(),
  { colorMode: 'light' },
)

// Per-instance registry, config + editor state.
const registry = createRegistry({ blocks: props.blocks, disabled: props.disabledBlocks })
provide(BLOCKS_KEY, registry)
const config = resolveConfig(props.config)
provide(CONFIG_KEY, config)
const store = createEditor({ createContent: (type) => registry.create(type) })
provide(EDITOR_KEY, store)

const showExport = ref(false)
const showTemplates = ref(false)

/* Color mode -------------------------------------------------------- */
function resolveDark(mode: string): boolean {
  if (mode === 'dark') return true
  if (mode === 'light') return false
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}
watch(
  () => props.colorMode,
  (mode) => store.setDark(resolveDark(mode)),
  { immediate: true },
)

/* Theme overrides: a scoped <style> tag, instance-classed -------------- */
const instanceClass = uid('vee')
let styleEl: HTMLStyleElement | null = null
watchEffect(() => {
  const css = themeToCss(instanceClass, props.theme)
  if (!css && !styleEl) return
  if (!styleEl) {
    styleEl = document.createElement('style')
    document.head.appendChild(styleEl)
  }
  styleEl.textContent = css
})
onBeforeUnmount(() => {
  styleEl?.remove()
  styleEl = null
})

const rootClass = computed(() => [instanceClass, { dark: store.isDark }])

/* Lifecycle --------------------------------------------------------- */
const saved = loadAutosave()
if (saved) {
  store.loadDesign(saved, false)
} else if (config.contentWidth) {
  store.design.body.values.contentWidth = config.contentWidth
}
useAutosave(store, config.autosaveMs)
useHistoryShortcuts(store)
</script>

<template>
  <div
    class="vue-email-editor flex h-full flex-col overflow-hidden bg-app"
    :class="rootClass"
  >
    <slot v-if="$slots.header" name="header" />
    <TopBar v-else @export="showExport = true" @templates="showTemplates = true">
      <template v-if="$slots['header-brand']" #brand><slot name="header-brand" /></template>
      <template v-if="$slots['header-actions']" #actions><slot name="header-actions" /></template>
    </TopBar>
    <div class="relative flex min-h-0 flex-1">
      <LeftPanel v-show="!store.previewMode" />
      <EditorCanvas>
        <template v-if="$slots.empty" #empty><slot name="empty" /></template>
      </EditorCanvas>

      <button
        v-show="!store.previewMode && !store.inspectorOpen"
        type="button"
        v-tooltip:left="'Settings'"
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
