<script setup lang="ts">
import { computed } from 'vue'
import type { ParagraphValues } from '@/types/schema'
import { padding } from '@/utils/style'
import { useEditor } from "@/core/useEditor"
import RichTextEditor from '@/components/common/RichTextEditor.vue'

const props = defineProps<{ values: ParagraphValues; contentId?: string }>()
const store = useEditor()

const editable = computed(
  () =>
    !store.previewMode &&
    store.selection.kind === 'content' &&
    store.selection.id === props.contentId,
)

function onUpdate(html: string) {
  if (props.contentId) {
    store.updateContentValues(props.contentId, { text: html }, `content:${props.contentId}:text`)
  }
}
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
      :editable="editable"
      lists
      placeholder="Write something…"
      @update:model-value="onUpdate"
    />
  </div>
</template>
