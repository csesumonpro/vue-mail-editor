<script setup lang="ts">
import { ref } from 'vue'
import { Upload } from 'lucide-vue-next'

defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const fileInput = ref<HTMLInputElement | null>(null)

function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => emit('update:modelValue', String(reader.result))
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="w-full space-y-1.5">
    <div
      class="flex aspect-video w-full items-center justify-center overflow-hidden rounded-md border border-line bg-muted"
    >
      <img
        v-if="modelValue"
        :src="modelValue"
        alt=""
        class="max-h-full max-w-full object-contain"
      />
      <span v-else class="text-[11px] text-faint">No image</span>
    </div>
    <input
      type="text"
      :value="modelValue"
      placeholder="Image URL"
      class="w-full rounded-md border border-line bg-input px-2 py-1.5 text-xs text-ink outline-none focus:border-brand"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <button
      type="button"
      class="flex w-full items-center justify-center gap-1.5 rounded-md border border-line bg-input py-1.5 text-xs font-medium text-subtle hover:border-brand hover:text-brand-dark"
      @click="fileInput?.click()"
    >
      <Upload class="h-3.5 w-3.5" />
      Upload image
    </button>
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onFile"
    />
  </div>
</template>
