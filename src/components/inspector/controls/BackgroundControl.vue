<script setup lang="ts">
defineOptions({ inheritAttrs: false })
import type { BgImage } from '@/types/schema'
import ImageControl from './ImageControl.vue'

const props = defineProps<{ modelValue: BgImage }>()
const emit = defineEmits<{ 'update:modelValue': [BgImage] }>()

function patch(p: Partial<BgImage>) {
  emit('update:modelValue', { ...props.modelValue, ...p })
}
</script>

<template>
  <div class="w-full space-y-2">
    <ImageControl
      :model-value="modelValue.url"
      @update:model-value="patch({ url: $event })"
    />
    <template v-if="modelValue.url">
      <div class="flex items-center justify-between gap-2">
        <span class="text-[11px] text-subtle">Size</span>
        <select
          :value="modelValue.size"
          class="rounded-md border border-line bg-input px-2 py-1 text-xs outline-none focus:border-brand"
          @change="patch({ size: ($event.target as HTMLSelectElement).value as BgImage['size'] })"
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="auto">Auto</option>
        </select>
      </div>
      <div class="flex items-center justify-between gap-2">
        <span class="text-[11px] text-subtle">Repeat</span>
        <select
          :value="modelValue.repeat"
          class="rounded-md border border-line bg-input px-2 py-1 text-xs outline-none focus:border-brand"
          @change="patch({ repeat: ($event.target as HTMLSelectElement).value as BgImage['repeat'] })"
        >
          <option value="no-repeat">No repeat</option>
          <option value="repeat">Repeat</option>
          <option value="repeat-x">Repeat X</option>
          <option value="repeat-y">Repeat Y</option>
        </select>
      </div>
    </template>
  </div>
</template>
