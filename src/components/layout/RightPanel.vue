<script setup lang="ts">
import { ChevronDown, Settings, Link2, Square, Accessibility } from 'lucide-vue-next'

// Phase 0: static inspector preview. Real schema-driven inspector arrives in Phase 5.
const groups = [
  { id: 'general', label: 'General', icon: Settings, open: true },
  { id: 'links', label: 'Links', icon: Link2, open: false },
  { id: 'background', label: 'Background', icon: Square, open: false },
  { id: 'accessibility', label: 'Accessibility', icon: Accessibility, open: false },
]
</script>

<template>
  <aside class="flex w-80 shrink-0 flex-col border-l border-line bg-panel">
    <div class="border-b border-line px-4 py-3">
      <h2 class="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Body Settings
      </h2>
    </div>

    <div class="scroll-thin flex-1 overflow-y-auto">
      <div
        v-for="g in groups"
        :key="g.id"
        class="border-b border-line"
      >
        <button
          type="button"
          class="flex w-full items-center justify-between px-4 py-3.5 text-left hover:bg-slate-50"
        >
          <span class="flex items-center gap-2.5">
            <component :is="g.icon" class="h-4 w-4 text-slate-400" />
            <span class="text-sm font-semibold text-ink">{{ g.label }}</span>
          </span>
          <ChevronDown
            class="h-4 w-4 text-slate-400 transition"
            :class="{ '-rotate-180': g.open }"
          />
        </button>
        <div v-if="g.open" class="px-4 pb-4 text-xs text-slate-400">
          Controls for {{ g.label.toLowerCase() }} appear here in Phase 5.
        </div>
      </div>
    </div>
  </aside>
</template>
