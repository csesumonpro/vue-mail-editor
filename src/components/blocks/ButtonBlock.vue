<script setup lang="ts">
import type { ButtonValues } from '@/types/schema'
import { padding, border, justify } from '@/utils/style'

defineProps<{ values: ButtonValues }>()
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
        cursor: 'pointer',
      }"
      >{{ values.text }}</span
    >
  </div>
</template>
