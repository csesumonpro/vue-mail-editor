<script setup lang="ts">
import { computed } from 'vue'
import { Ban } from 'lucide-vue-next'

const props = defineProps<{ modelValue: string; allowTransparent?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const isTransparent = computed(
  () => !props.modelValue || props.modelValue === 'transparent',
)
// Native <input type=color> needs a hex; fall back to white when transparent.
const pickerValue = computed(() =>
  isTransparent.value ? '#ffffff' : props.modelValue,
)
</script>

<template>
  <div class="flex items-center gap-1.5">
    <div
      class="relative h-7 w-7 shrink-0 overflow-hidden rounded-md border border-line"
      :class="isTransparent ? 'canvas-backdrop' : ''"
      :style="isTransparent ? {} : { backgroundColor: modelValue }"
    >
      <input
        type="color"
        :value="pickerValue"
        class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <input
      type="text"
      :value="isTransparent ? '' : modelValue"
      placeholder="transparent"
      class="w-24 rounded-md border border-line bg-input px-2 py-1.5 text-xs text-ink outline-none focus:border-brand"
      @change="
        emit(
          'update:modelValue',
          ($event.target as HTMLInputElement).value || 'transparent',
        )
      "
    />
    <button
      v-if="allowTransparent"
      type="button"
      title="Transparent"
      class="flex h-7 w-7 items-center justify-center rounded-md border border-line text-faint hover:text-ink"
      @click="emit('update:modelValue', 'transparent')"
    >
      <Ban class="h-3.5 w-3.5" />
    </button>
  </div>
</template>
