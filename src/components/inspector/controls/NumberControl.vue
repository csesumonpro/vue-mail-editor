<script setup lang="ts">
defineOptions({ inheritAttrs: false })
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: number
  min?: number
  max?: number
  step?: number
  unit?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [number] }>()

// Local buffer so the user can freely type multi-digit values. If we clamped to
// `min` on every keystroke, typing e.g. "24" (min 8) would snap "2" → 8 and the
// size could never be entered. We clamp `max` live (avoids exploding the canvas)
// and enforce `min` only on blur.
const local = ref(String(props.modelValue ?? ''))

watch(
  () => props.modelValue,
  (v) => {
    if (Number(local.value) !== v) local.value = v == null ? '' : String(v)
  },
)

function onInput(e: Event) {
  local.value = (e.target as HTMLInputElement).value
  if (local.value === '' || local.value === '-') return
  let n = Number(local.value)
  if (Number.isNaN(n)) return
  if (props.max != null && n > props.max) {
    n = props.max
    local.value = String(n)
  }
  emit('update:modelValue', n)
}

function onBlur() {
  let n = Number(local.value)
  if (local.value === '' || Number.isNaN(n)) n = props.min ?? 0
  if (props.min != null) n = Math.max(props.min, n)
  if (props.max != null) n = Math.min(props.max, n)
  local.value = String(n)
  emit('update:modelValue', n)
}
</script>

<template>
  <div class="flex items-center gap-1">
    <input
      type="number"
      :value="local"
      :min="min"
      :max="max"
      :step="step ?? 1"
      class="w-20 rounded-md border border-line bg-input px-2 py-1.5 text-xs text-ink outline-none focus:border-brand"
      @input="onInput"
      @blur="onBlur"
    />
    <span v-if="unit" class="text-[11px] text-faint">{{ unit }}</span>
  </div>
</template>
