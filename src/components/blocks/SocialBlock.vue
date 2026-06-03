<script setup lang="ts">
import type { SocialValues } from '@/types/schema'
import { padding, justify } from '@/utils/style'
import { resolveSocial } from '@/config/social'

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
      v-for="(item, i) in values.icons"
      :key="i"
      :style="{
        width: values.size + 'px',
        height: values.size + 'px',
        borderRadius: values.iconStyle === 'rounded' ? '50%' : '6px',
        background: resolveSocial(item).color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }"
    >
      <img
        v-if="resolveSocial(item).image"
        :src="resolveSocial(item).image"
        :alt="resolveSocial(item).label"
        :style="{
          width: resolveSocial(item).isCustom ? '100%' : values.size * 0.55 + 'px',
          height: resolveSocial(item).isCustom ? '100%' : values.size * 0.55 + 'px',
          objectFit: 'cover',
        }"
      />
      <span
        v-else
        :style="{
          color: '#fff',
          fontFamily: 'Arial, sans-serif',
          fontSize: values.size * 0.4 + 'px',
          textTransform: 'capitalize',
        }"
        >{{ (item.network[0] || '?').toUpperCase() }}</span
      >
    </span>
  </div>
</template>
