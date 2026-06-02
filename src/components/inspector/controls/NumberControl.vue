<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  min?: number
  max?: number
  step?: number
  unit?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [number] }>()

function onInput(e: Event) {
  let n = Number((e.target as HTMLInputElement).value)
  if (Number.isNaN(n)) n = 0
  if (props.min != null) n = Math.max(props.min, n)
  if (props.max != null) n = Math.min(props.max, n)
  emit('update:modelValue', n)
}
</script>

<template>
  <div class="flex items-center gap-1">
    <input
      type="number"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step ?? 1"
      class="w-20 rounded-md border border-line bg-white px-2 py-1.5 text-xs text-ink outline-none focus:border-brand"
      @input="onInput"
    />
    <span v-if="unit" class="text-[11px] text-slate-400">{{ unit }}</span>
  </div>
</template>
