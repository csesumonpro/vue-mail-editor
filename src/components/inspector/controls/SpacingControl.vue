<script setup lang="ts">
import { ref } from 'vue'
import { Link, Unlink } from 'lucide-vue-next'
import type { BoxValue } from '@/types/schema'

const props = defineProps<{ modelValue: BoxValue }>()
const emit = defineEmits<{ 'update:modelValue': [BoxValue] }>()

const linked = ref(false)

const sides: { key: keyof BoxValue; label: string }[] = [
  { key: 'top', label: 'T' },
  { key: 'right', label: 'R' },
  { key: 'bottom', label: 'B' },
  { key: 'left', label: 'L' },
]

function update(side: keyof BoxValue, raw: string) {
  let n = Number(raw)
  if (Number.isNaN(n) || n < 0) n = 0
  if (linked.value) {
    emit('update:modelValue', { top: n, right: n, bottom: n, left: n })
  } else {
    emit('update:modelValue', { ...props.modelValue, [side]: n })
  }
}
</script>

<template>
  <div class="flex w-full items-center gap-1.5">
    <div class="grid flex-1 grid-cols-4 gap-1">
      <label
        v-for="s in sides"
        :key="s.key"
        class="flex flex-col items-center gap-0.5"
      >
        <input
          type="number"
          min="0"
          :value="modelValue[s.key]"
          class="w-full rounded-md border border-line bg-input px-1 py-1 text-center text-xs text-ink outline-none focus:border-brand"
          @input="update(s.key, ($event.target as HTMLInputElement).value)"
        />
        <span class="text-[10px] text-faint">{{ s.label }}</span>
      </label>
    </div>
    <button
      type="button"
      :title="linked ? 'Unlink sides' : 'Link sides'"
      class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line"
      :class="linked ? 'bg-brand text-on-accent' : 'text-faint hover:text-ink'"
      @click="linked = !linked"
    >
      <component :is="linked ? Link : Unlink" class="h-3.5 w-3.5" />
    </button>
  </div>
</template>
