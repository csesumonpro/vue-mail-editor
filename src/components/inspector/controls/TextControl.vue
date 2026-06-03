<script setup lang="ts">
defineOptions({ inheritAttrs: false })
defineProps<{ modelValue: string; placeholder?: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()
</script>

<template>
  <input
    type="text"
    :value="modelValue"
    :placeholder="placeholder"
    class="w-full rounded-md border border-line bg-input px-2 py-1.5 text-xs text-ink outline-none focus:border-brand"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
