<script setup lang="ts">
import { defineAsyncComponent, h, ref } from 'vue'

// Skeleton shown during SSR (ClientOnly fallback) and while the chunk loads.
const Skeleton = () => h('div', { class: 'vee-demo-skeleton' }, 'Loading the editor…')

const LiveEditor = defineAsyncComponent({
  loader: () => import('./LiveEditor.vue'),
  loadingComponent: Skeleton,
})

// Tabs live here — above the editor frame — so they read as part of the page,
// not the editor chrome. The active tab is passed into the (client-only) editor.
type Tab = 'email' | 'text'
const tab = ref<Tab>('email')
const tabs: { id: Tab; label: string }[] = [
  { id: 'email', label: 'Email' },
  { id: 'text', label: 'Text' },
]
</script>

<template>
  <div class="vee-demo">
    <div class="vee-demo-tabs" role="tablist" aria-label="Editor demo">
      <button
        v-for="t in tabs"
        :key="t.id"
        type="button"
        role="tab"
        :aria-selected="tab === t.id"
        class="vee-demo-tab"
        :class="{ 'is-active': tab === t.id }"
        @click="tab = t.id"
      >
        {{ t.label }}
      </button>
    </div>

    <div class="vee-demo-frame">
      <ClientOnly>
        <LiveEditor :tab="tab" />
        <template #fallback>
          <div class="vee-demo-skeleton">Loading the editor…</div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
.vee-demo-tabs {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 14px;
}
.vee-demo-tab {
  padding: 0.45rem 1.1rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  border-radius: 10px;
  border: 1px solid transparent;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
}
.vee-demo-tab:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}
.vee-demo-tab.is-active {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}
</style>
