<script setup lang="ts">
import { ref, watch, onMounted, nextTick, toRef } from 'vue'
import type { ButtonValues } from '@/types/schema'
import { padding, border, justify } from '@/utils/style'

const props = defineProps<{ values: ButtonValues; editing?: boolean }>()
const emit = defineEmits<{ update: [patch: Partial<ButtonValues>] }>()

const label = ref<HTMLElement | null>(null)
const editing = toRef(props, 'editing')

function onInput() {
  emit('update', { text: label.value?.innerText ?? '' })
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
watch(editing, (v) => {
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
      :contenteditable="editing"
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
        cursor: editing ? 'text' : 'pointer',
      }"
      @input="onInput"
      @keydown.enter.prevent
    />
  </div>
</template>
