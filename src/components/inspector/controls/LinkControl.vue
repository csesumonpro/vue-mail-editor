<script setup lang="ts">
import { Link2 } from 'lucide-vue-next'

defineProps<{ modelValue: string; placeholder?: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()
</script>

<template>
  <div
    class="flex w-full items-center gap-1.5 rounded-md border border-line bg-white px-2 focus-within:border-brand"
  >
    <Link2 class="h-3.5 w-3.5 shrink-0 text-slate-400" />
    <input
      type="url"
      :value="modelValue"
      :placeholder="placeholder ?? 'https://'"
      class="w-full bg-transparent py-1.5 text-xs text-ink outline-none"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
