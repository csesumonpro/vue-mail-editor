<script setup lang="ts">
import type { SelectOption } from '@/config/inspector'

const props = defineProps<{
  modelValue: string | number
  options?: SelectOption[]
}>()
const emit = defineEmits<{ 'update:modelValue': [string | number] }>()

function onChange(e: Event) {
  const raw = (e.target as HTMLSelectElement).value
  // Preserve number-typed values.
  const match = props.options?.find((o) => String(o.value) === raw)
  emit('update:modelValue', match ? match.value : raw)
}
</script>

<template>
  <select
    :value="modelValue"
    class="w-full rounded-md border border-line bg-input px-2 py-1.5 text-xs text-ink outline-none focus:border-brand"
    @change="onChange"
  >
    <option v-for="o in options" :key="o.value" :value="o.value">
      {{ o.label }}
    </option>
  </select>
</template>
