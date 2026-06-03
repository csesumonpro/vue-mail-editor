<script setup lang="ts">
import type { FontValue } from '@/types/schema'
import { FONTS } from '@/config/fonts'

const props = defineProps<{ modelValue: FontValue }>()
const emit = defineEmits<{ 'update:modelValue': [FontValue] }>()

function onChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value
  const font = FONTS.find((f) => f.value === value)
  if (font) emit('update:modelValue', { ...font })
}
</script>

<template>
  <select
    :value="props.modelValue.value"
    class="w-full rounded-md border border-line bg-input px-2 py-1.5 text-xs text-ink outline-none focus:border-brand"
    @change="onChange"
  >
    <option v-for="f in FONTS" :key="f.label" :value="f.value">
      {{ f.label }}
    </option>
  </select>
</template>
