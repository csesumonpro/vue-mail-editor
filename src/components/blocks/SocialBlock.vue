<script setup lang="ts">
import type { SocialValues } from '@/types/schema'
import { padding, justify } from '@/utils/style'

defineProps<{ values: SocialValues }>()
</script>

<template>
  <div
    :style="{
      padding: padding(values.padding),
      display: 'flex',
      gap: values.spacing + 'px',
      justifyContent: justify(values.align),
    }"
  >
    <span
      v-for="(icon, i) in values.icons"
      :key="i"
      :style="{
        width: values.size + 'px',
        height: values.size + 'px',
        borderRadius: values.iconStyle === 'rounded' ? '50%' : '4px',
        background: values.iconStyle === 'outline' ? 'transparent' : '#1f2937',
        border: values.iconStyle === 'outline' ? '1px solid #1f2937' : 'none',
        color: values.iconStyle === 'outline' ? '#1f2937' : '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: values.size * 0.4 + 'px',
        textTransform: 'capitalize',
      }"
      >{{ icon.network.charAt(0) }}</span
    >
  </div>
</template>
