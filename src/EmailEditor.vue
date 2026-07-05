<script setup lang="ts">
import TopBar from '@/components/layout/TopBar.vue'
import LeftPanel from '@/components/layout/LeftPanel.vue'
import EditorCanvas from '@/components/layout/EditorCanvas.vue'
import RightPanel from '@/components/layout/RightPanel.vue'
import ToastHost from '@/components/common/ToastHost.vue'
import ExportModal from '@/components/common/ExportModal.vue'
import TemplatesModal from '@/components/common/TemplatesModal.vue'
import { SlidersHorizontal } from 'lucide-vue-next'
import { ref, provide, computed, watch, watchEffect, onMounted, onBeforeUnmount } from 'vue'
import { createEditor } from '@/core/createEditor'
import { createRegistry } from '@/core/registry'
import { EDITOR_KEY, BLOCKS_KEY, CONFIG_KEY, ACTIONS_KEY } from '@/core/keys'
import { base64Upload } from '@/core/useActions'
import type {
  AnyBlockDefinition,
  Design,
  TemplatePayload,
  StorageMode,
  EditorApi,
} from '@/api/types'
import type { Selection } from '@/types/schema'
import { deepClone } from '@/utils/clone'
import type { ThemeTokens } from '@/api/theme'
import { themeToCss } from '@/api/theme'
import type { EditorConfig } from '@/api/config'
import { resolveConfig } from '@/api/config'
import { vTooltip } from '@/directives/tooltip'
import { useAutosave, loadAutosave } from '@/composables/useAutosave'
import { useHistoryShortcuts } from '@/composables/useHistory'
import { exportHtml } from '@/export/htmlExporter'
import { downloadDesign } from '@/utils/designIO'
import { uid } from '@/utils/id'

const props = withDefaults(
  defineProps<{
    modelValue?: Design
    blocks?: AnyBlockDefinition[]
    disabledBlocks?: string[]
    theme?: ThemeTokens
    colorMode?: 'light' | 'dark' | 'auto'
    /** Two-way preview state (use with `v-model:preview`). */
    preview?: boolean
    config?: EditorConfig
    storage?: StorageMode
    onImageUpload?: (file: File) => Promise<string>
    onSave?: (design: Design) => void | Promise<void>
    onSaveTemplate?: (payload: TemplatePayload) => void | Promise<void>
    onExport?: (html: string, design: Design) => void | Promise<void>
    onLoad?: () => Design | Promise<Design>
  }>(),
  { colorMode: 'light', storage: 'local' },
)

const emit = defineEmits<{
  'update:modelValue': [design: Design]
  'update:colorMode': [mode: 'light' | 'dark']
  'update:preview': [preview: boolean]
  change: [design: Design]
  save: [design: Design]
  'save-template': [payload: TemplatePayload]
  export: [html: string, design: Design]
  select: [selection: Selection]
  ready: [api: EditorApi]
}>()

const controlled = props.modelValue != null

// Per-instance registry, config + editor state.
const registry = createRegistry({ blocks: props.blocks, disabled: props.disabledBlocks })
provide(BLOCKS_KEY, registry)
const config = resolveConfig(props.config)
provide(CONFIG_KEY, config)
const store = createEditor({ createContent: (type) => registry.create(type) })
provide(EDITOR_KEY, store)

const showExport = ref(false)
const showTemplates = ref(false)

/* Action hooks (host-delegated; built-in fallbacks) ----------------- */
// NOTE: `onSave`/`onSaveTemplate`/`onExport` are declared props, so Vue maps a
// `@save` listener onto the `onSave` prop. We therefore call the prop only —
// emitting the event too would invoke the handler twice.
async function doSave() {
  if (props.onSave) await props.onSave(store.design)
  else downloadDesign(store.design)
}
async function doSaveTemplate() {
  const name = window.prompt('Template name')
  if (!name) return
  const payload: TemplatePayload = { name, design: store.design }
  if (props.onSaveTemplate) await props.onSaveTemplate(payload)
}
function doUpload(file: File) {
  return props.onImageUpload ? props.onImageUpload(file) : base64Upload(file)
}
provide(ACTIONS_KEY, {
  uploadImage: doUpload,
  save: doSave,
  saveTemplate: doSaveTemplate,
  canSaveTemplate: !!props.onSaveTemplate,
})

async function onExportClick() {
  showExport.value = true
  if (props.onExport) await props.onExport(exportHtml(store.design, registry), store.design)
}

/* Color mode (two-way via v-model:colorMode) ------------------------ */
function resolveDark(mode: string): boolean {
  if (mode === 'dark') return true
  if (mode === 'light') return false
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}
// Prop drives the store…
watch(
  () => props.colorMode,
  (mode) => store.setDark(resolveDark(mode)),
  { immediate: true },
)
// …and a user toggle (built-in theme button) syncs back to the prop. We only
// emit when the store diverges from what the prop resolves to, so the
// prop-driven sync above never causes a spurious emit (single source of truth).
watch(
  () => store.isDark,
  (dark) => {
    if (dark === resolveDark(props.colorMode)) return
    emit('update:colorMode', dark ? 'dark' : 'light')
  },
)

/* Preview (two-way via v-model:preview) ----------------------------- */
watch(
  () => props.preview,
  (v) => {
    if (v != null && v !== store.previewMode) store.togglePreview(v)
  },
  { immediate: true },
)
watch(
  () => store.previewMode,
  (v) => {
    if (v !== props.preview) emit('update:preview', v)
  },
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

// When fullscreen, the root becomes a fixed overlay covering the whole window
// (100% viewport width/height), above host content — like a lightbox. The
// `.cvee-fullscreen` rule (style.css) uses !important so it wins over any inline
// dimensions the host set on the editor root.
const rootClass = computed(() => [
  instanceClass,
  { dark: store.isDark, 'cvee-fullscreen': store.fullscreen },
])

// Escape exits fullscreen.
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && store.fullscreen) store.toggleFullscreen(false)
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

/* Lifecycle --------------------------------------------------------- */
function applyContentWidth() {
  if (config.contentWidth) store.design.body.values.contentWidth = config.contentWidth
  // Seed predefined variables only into a fresh design (never clobber a loaded one).
  if (config.variables.length && !store.design.variables?.length) {
    store.design.variables = config.variables
  }
}

if (controlled) {
  // v-model controlled mode — design comes from the parent.
  store.loadDesign(props.modelValue as Design, false)
} else if (props.storage === 'local') {
  const saved = loadAutosave()
  if (saved) store.loadDesign(saved, false)
  else applyContentWidth()
  useAutosave(store, config.autosaveMs)
} else {
  // 'none' — host owns persistence (server/database).
  applyContentWidth()
}

useHistoryShortcuts(store)

// External v-model updates → load into the editor (reference-guarded to avoid loops).
watch(
  () => props.modelValue,
  (val) => {
    if (val && val !== store.design) store.loadDesign(val, false)
  },
)

// Host-driven initial load (server fetch) — skipped in controlled mode.
onMounted(async () => {
  if (!controlled && props.onLoad) {
    const d = await props.onLoad()
    if (d) store.loadDesign(d, false)
  }
})

// Notify the host of design + selection changes.
let changeTimer: ReturnType<typeof setTimeout> | undefined
watch(
  () => store.design,
  () => {
    emit('update:modelValue', store.design)
    clearTimeout(changeTimer)
    changeTimer = setTimeout(() => emit('change', store.design), 300)
  },
  { deep: true },
)
watch(
  () => store.selection,
  (s) => emit('select', s),
  { deep: true },
)

/* Imperative API ---------------------------------------------------- */
const api: EditorApi = {
  getDesign: () => deepClone(store.design),
  loadDesign: (d) => store.loadDesign(d),
  newDesign: () => store.resetDesign(),
  exportHtml: (mode) => exportHtml(store.design, registry, mode),
  getVariables: () => deepClone(store.design.variables ?? []),
  setVariables: (vars) => store.updateVariables(vars),
  save: () => doSave(),
  export: () => onExportClick(),
  undo: () => store.undo(),
  redo: () => store.redo(),
  registerBlock: (def) => registry.register(def),
  selectBody: () => store.selectBody(),
}
defineExpose(api)
onMounted(() => emit('ready', api))
</script>

<template>
  <div
    class="vue-email-editor flex h-full flex-col overflow-hidden bg-app"
    :class="rootClass"
  >
    <slot v-if="$slots.header" name="header" />
    <TopBar v-else @export="onExportClick" @templates="showTemplates = true">
      <template v-if="$slots['header-brand']" #brand><slot name="header-brand" /></template>
      <template v-if="$slots['header-actions']" #actions><slot name="header-actions" /></template>
    </TopBar>
    <div class="relative flex min-h-0 flex-1">
      <LeftPanel v-show="!store.previewMode" />
      <EditorCanvas>
        <template v-if="$slots.empty" #empty><slot name="empty" /></template>
        <template v-if="$slots.meta" #meta="scope"><slot name="meta" v-bind="scope" /></template>
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
