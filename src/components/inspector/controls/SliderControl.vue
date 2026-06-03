<script setup lang="ts">
defineOptions({ inheritAttrs: false })
defineProps<{
  modelValue: number
  min?: number
  max?: number
  step?: number
  unit?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [number] }>()
</script>

<template>
  <div class="flex w-full items-center gap-2">
    <input
      type="range"
      :value="modelValue"
      :min="min ?? 0"
      :max="max ?? 100"
      :step="step ?? 1"
      class="h-1.5 flex-1 cursor-pointer accent-brand"
      @input="emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
    />
    <span class="w-12 text-right text-[11px] tabular-nums text-subtle"
      >{{ modelValue }}{{ unit }}</span
    >
  </div>
</template>
