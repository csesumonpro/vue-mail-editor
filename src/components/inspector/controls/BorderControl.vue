<script setup lang="ts">
import type { BorderValue } from '@/types/schema'
import ColorControl from './ColorControl.vue'

const props = defineProps<{ modelValue: BorderValue }>()
const emit = defineEmits<{ 'update:modelValue': [BorderValue] }>()

function patch(p: Partial<BorderValue>) {
  emit('update:modelValue', { ...props.modelValue, ...p })
}
</script>

<template>
  <div class="w-full space-y-1.5">
    <div class="flex items-center gap-1.5">
      <input
        type="number"
        min="0"
        :value="modelValue.width"
        title="Width"
        class="w-16 rounded-md border border-line bg-input px-2 py-1.5 text-xs text-ink outline-none focus:border-brand"
        @input="patch({ width: Math.max(0, Number(($event.target as HTMLInputElement).value)) })"
      />
      <select
        :value="modelValue.style"
        class="flex-1 rounded-md border border-line bg-input px-2 py-1.5 text-xs text-ink outline-none focus:border-brand"
        @change="patch({ style: ($event.target as HTMLSelectElement).value as BorderValue['style'] })"
      >
        <option value="solid">Solid</option>
        <option value="dashed">Dashed</option>
        <option value="dotted">Dotted</option>
      </select>
    </div>
    <ColorControl
      :model-value="modelValue.color"
      @update:model-value="patch({ color: $event })"
    />
  </div>
</template>
