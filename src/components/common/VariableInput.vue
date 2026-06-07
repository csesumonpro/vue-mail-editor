<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { Plus } from 'lucide-vue-next'
import type { DesignVariable } from '@/types/schema'
import { useVariables } from '@/composables/useVariables'
import { placeAnchored } from '@/utils/popover'
import { formatToken } from '@/utils/variableToken'
import VariablePopover from './VariablePopover.vue'

/**
 * A plain text input that supports `{{` template-variable autocomplete, inserting
 * the literal `{{{name}}}` token at the caret (not a styled chip) — for plain
 * fields like the subject and preview text. The stored value stays plain text.
 */
defineProps<{ modelValue: string; placeholder?: string; inputClass?: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const variables = useVariables()
const inputEl = ref<HTMLInputElement | null>(null)

const menuOpen = ref(false)
const menuTop = ref(0)
const menuLeft = ref(0)
const menuEl = ref<HTMLElement | null>(null)
const query = ref('')
const active = ref(0)
const triggerStart = ref(0)
const caretPos = ref(0)

const createOpen = ref(false)
const createName = ref('')
const anchorTop = ref(0)
const anchorBottom = ref(0)
const anchorLeft = ref(0)

const filtered = computed<DesignVariable[]>(() => {
  const q = query.value.toLowerCase()
  return variables.list.value.filter((v) => v.name.toLowerCase().includes(q))
})

function onInput(e: Event) {
  const el = e.target as HTMLInputElement
  emit('update:modelValue', el.value)
  detect(el)
}

function detect(el: HTMLInputElement) {
  const caret = el.selectionStart ?? el.value.length
  const before = el.value.slice(0, caret)
  const m = /\{\{(\w*)$/.exec(before)
  if (!m) {
    menuOpen.value = false
    return
  }
  // Triple-brace guard — don't trigger inside a literal `{{{token}}}`.
  const start = before.length - m[0].length
  if (before[start - 1] === '{') {
    menuOpen.value = false
    return
  }
  query.value = m[1]
  triggerStart.value = start
  caretPos.value = caret
  active.value = 0
  position(el)
  menuOpen.value = true
}

function position(el: HTMLInputElement) {
  const r = el.getBoundingClientRect()
  menuTop.value = r.bottom + 4
  menuLeft.value = r.left
  anchorTop.value = r.top
  anchorBottom.value = r.bottom
  anchorLeft.value = r.left
  nextTick(() => {
    if (!menuEl.value) return
    const p = placeAnchored(r.top, r.bottom, r.left, menuEl.value)
    menuTop.value = p.top
    menuLeft.value = p.left
  })
}

function pick(name: string) {
  const el = inputEl.value
  if (!el) return
  const before = el.value.slice(0, triggerStart.value)
  const after = el.value.slice(caretPos.value)
  const next = before + formatToken(name) + after
  emit('update:modelValue', next)
  menuOpen.value = false
  nextTick(() => {
    el.focus()
    const pos = (before + formatToken(name)).length
    el.setSelectionRange(pos, pos)
  })
}

function chooseActive() {
  if (active.value < filtered.value.length) pick(filtered.value[active.value].name)
  else openCreate()
}

function openCreate() {
  createName.value = query.value
  menuOpen.value = false
  createOpen.value = true
}

function onCreateSubmit(variable: DesignVariable) {
  variables.create(variable)
  pick(variable.name)
  createOpen.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (!menuOpen.value) return
  if (e.key === 'Escape') {
    menuOpen.value = false
    e.preventDefault()
  } else if (e.key === 'ArrowDown') {
    active.value = Math.min(active.value + 1, filtered.value.length)
    e.preventDefault()
  } else if (e.key === 'ArrowUp') {
    active.value = Math.max(active.value - 1, 0)
    e.preventDefault()
  } else if (e.key === 'Enter') {
    chooseActive()
    e.preventDefault()
  }
}
</script>

<template>
  <input
    ref="inputEl"
    :value="modelValue"
    :placeholder="placeholder"
    :class="inputClass"
    @input="onInput"
    @keydown="onKeydown"
    @blur="menuOpen = false"
  />

  <!-- `{{` list (same look as the rich-text autocomplete) -->
  <div
    v-if="menuOpen"
    ref="menuEl"
    class="fixed z-[var(--cvee-z-overlay)] w-60 overflow-hidden rounded-lg border border-line bg-surface p-1 text-xs shadow-xl"
    :style="{ top: menuTop + 'px', left: menuLeft + 'px' }"
    @mousedown.prevent
  >
    <div class="px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-faint">
      Template variables
    </div>
    <div class="scroll-thin max-h-48 overflow-y-auto">
      <button
        v-for="(v, i) in filtered"
        :key="v.name"
        type="button"
        class="block w-full truncate rounded-md px-2 py-1.5 text-left font-mono text-ink"
        :class="i === active ? 'bg-hover' : ''"
        @click="pick(v.name)"
        @mouseenter="active = i"
      >{{ formatToken(v.name) }}</button>
    </div>
    <button
      type="button"
      class="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-ink"
      :class="active === filtered.length ? 'bg-hover' : ''"
      @click="openCreate"
      @mouseenter="active = filtered.length"
    >
      <Plus class="h-3.5 w-3.5" />
      Create Variable
    </button>
  </div>

  <VariablePopover
    :open="createOpen"
    mode="create"
    :anchor-top="anchorTop"
    :anchor-bottom="anchorBottom"
    :left="anchorLeft"
    :name="createName"
    @submit="onCreateSubmit"
    @close="createOpen = false"
  />
</template>
