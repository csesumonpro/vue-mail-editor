<script setup lang="ts">
import type { HtmlValues } from '@/types/schema'

defineProps<{ values: HtmlValues }>()
</script>

<template>
  <div v-html="values.html" />
</template>
