<script setup lang="ts">
import { computed } from 'vue'
import type { SocialValues } from '@/types/schema'
import { padding, justify } from '@/utils/style'
import { resolveSocial } from '@/config/social'

const props = defineProps<{ values: SocialValues }>()

// Resolve each icon once per render instead of 6× in the template.
const resolved = computed(() =>
  props.values.icons.map((item) => {
    const s = resolveSocial(item)
    return { color: s.color, image: s.image, label: s.label, isCustom: s.isCustom, network: item.network }
  }),
)
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
      v-for="(s, i) in resolved"
      :key="i"
      :style="{
        width: values.size + 'px',
        height: values.size + 'px',
        borderRadius: values.iconStyle === 'rounded' ? '50%' : '6px',
        background: s.color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }"
    >
      <img
        v-if="s.image"
        :src="s.image"
        :alt="s.label"
        :style="{
          width: s.isCustom ? '100%' : values.size * 0.55 + 'px',
          height: s.isCustom ? '100%' : values.size * 0.55 + 'px',
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
        >{{ (s.network[0] || '?').toUpperCase() }}</span
      >
    </span>
  </div>
</template>
