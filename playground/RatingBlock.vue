<script setup lang="ts">
// A custom block authored entirely against the public render contract.
defineProps<{ values: { stars: number; color: string }; editing?: boolean }>()
</script>

<template>
  <div :style="{ padding: '10px', textAlign: 'center', fontSize: '26px', color: values.color }">
    <span v-for="n in values.stars" :key="n">★</span>
  </div>
</template>
