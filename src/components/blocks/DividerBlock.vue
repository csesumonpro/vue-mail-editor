<script setup lang="ts">
import type { DividerValues } from '@/types/schema'
import { padding } from '@/utils/style'

defineProps<{ values: DividerValues }>()
</script>

<template>
  <div :style="{ padding: padding(values.padding), textAlign: values.align }">
    <div
      :style="{
        display: 'inline-block',
        width: values.width + '%',
        borderTop: `${values.thickness}px ${values.style} ${values.color}`,
      }"
    />
  </div>
</template>
