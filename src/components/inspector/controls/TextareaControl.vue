<script setup lang="ts">
defineProps<{ modelValue: string; placeholder?: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()
</script>

<template>
  <textarea
    :value="modelValue"
    :placeholder="placeholder"
    rows="4"
    class="scroll-thin w-full resize-y rounded-md border border-line bg-input px-2 py-1.5 font-mono text-xs text-ink outline-none focus:border-brand"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
