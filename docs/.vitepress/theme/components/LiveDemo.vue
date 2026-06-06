<script setup lang="ts">
import { defineAsyncComponent, h } from 'vue'

// Skeleton shown during SSR (ClientOnly fallback) and while the chunk loads.
const Skeleton = () => h('div', { class: 'vee-demo-skeleton' }, 'Loading the editor…')

const LiveEditor = defineAsyncComponent({
  loader: () => import('./LiveEditor.vue'),
  loadingComponent: Skeleton,
})
</script>

<template>
  <div class="vee-demo-frame">
    <ClientOnly>
      <LiveEditor />
      <template #fallback>
        <div class="vee-demo-skeleton">Loading the editor…</div>
      </template>
    </ClientOnly>
  </div>
</template>
