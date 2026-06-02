<script setup lang="ts">
import type { ImageValues } from '@/types/schema'
import { padding } from '@/utils/style'

defineProps<{ values: ImageValues }>()
</script>

<template>
  <div :style="{ padding: padding(values.padding), textAlign: values.align }">
    <img
      :src="values.src"
      :alt="values.alt"
      :style="{
        display: 'inline-block',
        width: values.autoWidth ? '100%' : values.width + 'px',
        maxWidth: '100%',
        borderRadius: values.borderRadius + 'px',
      }"
    />
  </div>
</template>
