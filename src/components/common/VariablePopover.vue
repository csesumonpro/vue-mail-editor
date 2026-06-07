<script setup lang="ts">
import { ref, watch, computed, nextTick, onBeforeUnmount } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import type { DesignVariable } from '@/types/schema'
import { useVariables } from '@/composables/useVariables'
import { placeAnchored } from '@/utils/popover'
import VariableForm from './VariableForm.vue'

/**
 * Single popover used for BOTH creating and editing a variable, anchored at a
 * fixed position. Rendered by RichTextEditor (outside the editor's
 * contenteditable DOM) so its controls aren't swallowed by ProseMirror.
 *
 * Action buttons fire on `mousedown.prevent` so pressing them never blurs the
 * editor mid-click (which would otherwise eat the click). Outside clicks close
 * the popover via a document listener — no covering backdrop that could sit on
 * top of the buttons.
 */
const props = defineProps<{
  open: boolean
  mode: 'create' | 'edit'
  /** Anchor rect edges (the caret line or the chip) used to place the popover. */
  anchorTop: number
  anchorBottom: number
  left: number
  /** create: the `{{` query as an initial name; edit: the existing variable name. */
  name: string
}>()
const emit = defineEmits<{
  close: []
  submit: [variable: DesignVariable] // create
  delete: [] // edit
}>()

const variables = useVariables()
const popoverEl = ref<HTMLElement | null>(null)

const localName = ref('')
const type = ref<DesignVariable['type']>('string')
const fallback = ref('')

watch(
  () => [props.open, props.mode, props.name] as const,
  ([open]) => {
    if (!open) return
    if (props.mode === 'create') {
      localName.value = (props.name ?? '').trim()
      type.value = 'string'
      fallback.value = ''
    } else {
      const v = variables.get(props.name)
      localName.value = props.name
      type.value = v?.type ?? 'string'
      fallback.value = v?.fallback ?? ''
    }
  },
  { immediate: true },
)

// Resolved on-screen position (flips above the anchor when it would overflow).
const pos = ref({ top: 0, left: 0 })
function place() {
  if (popoverEl.value) {
    pos.value = placeAnchored(props.anchorTop, props.anchorBottom, props.left, popoverEl.value)
  }
}

// Close on outside click / Escape / scroll via document listeners (added after
// the opening click so it doesn't immediately self-close).
function onDocMousedown(e: MouseEvent) {
  if (popoverEl.value && !popoverEl.value.contains(e.target as Node)) emit('close')
}
function onDocKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  } else if (props.mode === 'create' && e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    create()
  }
}
function onScroll() {
  emit('close')
}
function bind() {
  place()
  document.addEventListener('mousedown', onDocMousedown)
  document.addEventListener('keydown', onDocKeydown)
  window.addEventListener('scroll', onScroll, true)
  window.addEventListener('resize', onScroll)
}
function unbind() {
  document.removeEventListener('mousedown', onDocMousedown)
  document.removeEventListener('keydown', onDocKeydown)
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('resize', onScroll)
}
watch(
  () => props.open,
  (open) => {
    if (open) nextTick(bind)
    else unbind()
  },
)
onBeforeUnmount(unbind)

const known = computed(() => props.mode === 'create' || !!variables.get(props.name))

const trimmed = computed(() => localName.value.trim())
const nameError = computed(() => {
  if (props.mode !== 'create' || !trimmed.value) return ''
  if (!/^\w+$/.test(trimmed.value)) return 'Use letters, numbers or underscores only (no dots or spaces).'
  if (variables.exists(trimmed.value)) return 'A variable with this name already exists.'
  return ''
})
const valid = computed(() => !!trimmed.value && !nameError.value)

// Edit mode applies changes live to the shared variable (all instances).
function onType(t: DesignVariable['type']) {
  type.value = t
  if (props.mode === 'edit') variables.update(props.name, { type: t })
}
function onFallback(f: string) {
  fallback.value = f
  if (props.mode === 'edit') variables.update(props.name, { fallback: f })
}

function create() {
  if (!valid.value) return
  emit('submit', { name: trimmed.value, type: type.value, fallback: fallback.value })
  emit('close')
}
</script>

<template>
  <div
    v-if="open"
    ref="popoverEl"
    class="fixed z-[var(--cvee-z-popover)] w-64 rounded-lg border border-line bg-surface p-3 text-left shadow-xl"
    :style="{ top: pos.top + 'px', left: pos.left + 'px' }"
  >
    <p
      v-if="mode === 'create'"
      class="mb-2 text-[11px] font-medium uppercase tracking-wide text-faint"
    >
      Create variable
    </p>
    <p v-else-if="!known" class="mb-2 text-[11px] text-danger">
      This variable was deleted from the template.
    </p>

    <VariableForm
      :name="mode === 'create' ? localName : name"
      :type="type"
      :fallback="fallback"
      :name-editable="mode === 'create'"
      :name-error="nameError"
      @update:name="localName = $event"
      @update:type="onType"
      @update:fallback="onFallback"
    />

    <div v-if="mode === 'create'" class="mt-4 flex items-center gap-2">
      <button
        type="button"
        class="rounded-md bg-black px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
        :disabled="!valid"
        @mousedown.prevent="create"
      >
        Create
      </button>
      <button
        type="button"
        class="rounded-md border border-line px-4 py-1.5 text-xs font-medium text-subtle hover:border-brand hover:text-brand-dark"
        @mousedown.prevent="emit('close')"
      >
        Cancel
      </button>
    </div>
    <button
      v-else
      type="button"
      class="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-danger-soft px-2 py-1.5 text-xs font-semibold text-danger hover:opacity-90"
      @mousedown.prevent="emit('delete')"
    >
      <Trash2 class="h-3.5 w-3.5" />
      Delete variable
    </button>
  </div>
</template>
