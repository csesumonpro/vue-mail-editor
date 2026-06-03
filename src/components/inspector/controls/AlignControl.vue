<script setup lang="ts">
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-vue-next'
import type { TextAlign } from '@/types/schema'

defineProps<{ modelValue: TextAlign }>()
const emit = defineEmits<{ 'update:modelValue': [TextAlign] }>()

const opts: { value: TextAlign; icon: typeof AlignLeft }[] = [
  { value: 'left', icon: AlignLeft },
  { value: 'center', icon: AlignCenter },
  { value: 'right', icon: AlignRight },
]
</script>

<template>
  <div class="flex rounded-md border border-line p-0.5">
    <button
      v-for="o in opts"
      :key="o.value"
      type="button"
      class="flex h-6 w-8 items-center justify-center rounded transition"
      :class="
        modelValue === o.value
          ? 'bg-brand text-on-accent'
          : 'text-subtle hover:bg-hover'
      "
      @click="emit('update:modelValue', o.value)"
    >
      <component :is="o.icon" class="h-3.5 w-3.5" />
    </button>
  </div>
</template>
