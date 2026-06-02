<script setup lang="ts">
import type { HeadingValues } from '@/types/schema'
import { padding } from '@/utils/style'

defineProps<{ values: HeadingValues }>()
</script>

<template>
  <component
    :is="values.level"
    :style="{
      margin: 0,
      padding: padding(values.padding),
      fontFamily: values.fontFamily.value,
      fontSize: values.fontSize + 'px',
      fontWeight: values.fontWeight,
      color: values.color,
      textAlign: values.align,
      lineHeight: values.lineHeight,
      letterSpacing: values.letterSpacing + 'px',
    }"
    v-html="values.text"
  />
</template>
