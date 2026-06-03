<script setup lang="ts">
defineOptions({ inheritAttrs: false })
import { ref } from 'vue'
import { Upload } from 'lucide-vue-next'
import { useActions } from '@/core/useActions'

defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const actions = useActions()
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)

async function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const url = await actions.uploadImage(file)
    emit('update:modelValue', url)
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
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
      :disabled="uploading"
      class="flex w-full items-center justify-center gap-1.5 rounded-md border border-line bg-input py-1.5 text-xs font-medium text-subtle hover:border-brand hover:text-brand-dark disabled:opacity-60"
      @click="fileInput?.click()"
    >
      <Upload class="h-3.5 w-3.5" />
      {{ uploading ? 'Uploading…' : 'Upload image' }}
    </button>
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0"
      @change="onFile"
    />
  </div>
</template>
