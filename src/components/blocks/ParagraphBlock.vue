<script setup lang="ts">
import type { ParagraphValues } from '@/types/schema'
import { padding } from '@/utils/style'
import RichTextEditor from '@/components/common/RichTextEditor.vue'

defineProps<{ values: ParagraphValues; editing?: boolean }>()
const emit = defineEmits<{ update: [patch: Partial<ParagraphValues>] }>()
</script>

<template>
  <div
    :style="{
      padding: padding(values.padding),
      fontFamily: values.fontFamily.value,
      fontSize: values.fontSize + 'px',
      color: values.color,
      textAlign: values.align,
      lineHeight: values.lineHeight,
    }"
  >
    <RichTextEditor
      :model-value="values.text"
      :editable="editing"
      lists
      placeholder="Write something…"
      @update:model-value="emit('update', { text: $event })"
    />
  </div>
</template>
