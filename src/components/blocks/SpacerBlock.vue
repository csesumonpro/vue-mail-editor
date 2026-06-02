<script setup lang="ts">
import type { SpacerValues } from '@/types/schema'

defineProps<{ values: SpacerValues }>()
</script>

<template>
  <div
    :style="{ height: values.height + 'px' }"
    class="bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,rgba(0,0,0,0.03)_6px,rgba(0,0,0,0.03)_12px)]"
  />
</template>
