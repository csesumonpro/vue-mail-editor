<script setup lang="ts">
import type { HeadingValues } from '@/types/schema'
import { padding } from '@/utils/style'
import RichTextEditor from '@/components/common/RichTextEditor.vue'

defineProps<{ values: HeadingValues; editing?: boolean }>()
const emit = defineEmits<{ update: [patch: Partial<HeadingValues>] }>()
</script>

<template>
  <div
    :style="{
      padding: padding(values.padding),
      fontFamily: values.fontFamily.value,
      fontSize: values.fontSize + 'px',
      fontWeight: values.fontWeight,
      color: values.color,
      textAlign: values.align,
      lineHeight: values.lineHeight,
      letterSpacing: values.letterSpacing + 'px',
    }"
  >
    <RichTextEditor
      :model-value="values.text"
      :editable="editing"
      placeholder="Heading"
      @update:model-value="emit('update', { text: $event })"
    />
  </div>
</template>
