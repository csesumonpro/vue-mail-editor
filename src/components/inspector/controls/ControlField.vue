<script setup lang="ts">
defineProps<{ label?: string; stack?: boolean }>()
</script>

<template>
  <div
    class="py-1.5"
    :class="stack ? 'space-y-1.5' : 'flex items-center justify-between gap-3'"
  >
    <span v-if="label" class="shrink-0 text-xs font-medium text-slate-600">{{
      label
    }}</span>
    <div :class="stack ? 'w-full' : 'flex max-w-[58%] flex-1 justify-end'">
      <slot />
    </div>
  </div>
</template>
