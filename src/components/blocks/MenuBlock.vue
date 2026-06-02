<script setup lang="ts">
import type { MenuValues } from '@/types/schema'
import { padding, justify } from '@/utils/style'

defineProps<{ values: MenuValues }>()
</script>

<template>
  <div
    :style="{
      padding: padding(values.padding),
      display: 'flex',
      flexDirection: values.layout === 'vertical' ? 'column' : 'row',
      gap: values.spacing + 'px',
      justifyContent: justify(values.align),
      alignItems: 'center',
      fontFamily: values.fontFamily.value,
      fontSize: values.fontSize + 'px',
      color: values.color,
    }"
  >
    <template v-for="(item, i) in values.items" :key="i">
      <span>{{ item.text }}</span>
      <span
        v-if="values.layout === 'horizontal' && i < values.items.length - 1"
        :style="{ opacity: 0.4 }"
        >{{ values.separator }}</span
      >
    </template>
  </div>
</template>
