<script setup lang="ts">
import type { ParagraphValues } from '@/types/schema'
import { padding } from '@/utils/style'

defineProps<{ values: ParagraphValues }>()
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
    v-html="values.text"
  />
</template>
