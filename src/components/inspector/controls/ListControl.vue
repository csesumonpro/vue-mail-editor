<script setup lang="ts">
// Placeholder — the full list editor (add/remove/reorder social, menu and
// carousel items) is implemented in Phase 7.
defineProps<{ modelValue: unknown; itemKind?: string }>()
</script>

<template>
  <div class="rounded-md border border-dashed border-line p-2 text-[11px] text-slate-400">
    List editor ({{ itemKind }}) — coming in Phase 7.
  </div>
</template>
