<script setup lang="ts">
import { computed, ref, watch, onMounted, nextTick } from 'vue'
import type { ButtonValues } from '@/types/schema'
import { padding, border, justify } from '@/utils/style'
import { useEditorStore } from '@/stores/editor'

const props = defineProps<{ values: ButtonValues; contentId?: string }>()
const store = useEditorStore()

const label = ref<HTMLElement | null>(null)

const editable = computed(
  () =>
    !store.previewMode &&
    store.selection.kind === 'content' &&
    store.selection.id === props.contentId,
)

function onInput() {
  if (props.contentId) {
    store.updateContentValues(
      props.contentId,
      { text: label.value?.innerText ?? '' },
      `content:${props.contentId}:text`,
    )
  }
}

// Keep the DOM text in sync with the model when not actively typing.
function syncText() {
  const node = label.value
  if (node && document.activeElement !== node && node.innerText !== props.values.text) {
    node.innerText = props.values.text
  }
}

onMounted(() => {
  if (label.value) label.value.innerText = props.values.text
})
watch(() => props.values.text, syncText)
watch(editable, (v) => {
  if (v) nextTick(() => label.value?.focus())
})
</script>

<template>
  <div
    :style="{
      padding: padding(values.containerPadding),
      display: 'flex',
      justifyContent: justify(values.align),
    }"
  >
    <span
      ref="label"
      :contenteditable="editable"
      :style="{
        display: 'inline-block',
        width: values.fullWidth ? '100%' : 'auto',
        textAlign: 'center',
        backgroundColor: values.backgroundColor,
        color: values.color,
        fontFamily: values.fontFamily.value,
        fontSize: values.fontSize + 'px',
        fontWeight: values.fontWeight,
        border: border(values.border),
        borderRadius: values.borderRadius + 'px',
        padding: padding(values.innerPadding),
        outline: 'none',
        cursor: editable ? 'text' : 'pointer',
      }"
      @input="onInput"
      @keydown.enter.prevent
    />
  </div>
</template>
