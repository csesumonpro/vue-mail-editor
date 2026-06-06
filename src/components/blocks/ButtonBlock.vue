<script setup lang="ts">
import type { ButtonValues } from '@/types/schema'
import { padding, border, justify } from '@/utils/style'
import RichTextEditor from '@/components/common/RichTextEditor.vue'

defineProps<{ values: ButtonValues; editing?: boolean }>()
const emit = defineEmits<{ update: [patch: Partial<ButtonValues>] }>()
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
        cursor: editing ? 'text' : 'pointer',
      }"
    >
      <!-- Plain RTE: single-line label that supports `{{` template variables. -->
      <RichTextEditor
        :model-value="values.text"
        :editable="editing"
        plain
        placeholder="Button"
        @update:model-value="emit('update', { text: $event })"
      />
    </span>
  </div>
</template>
