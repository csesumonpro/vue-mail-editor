<script setup lang="ts">
import { ref } from 'vue'
import { BLOCK_LIST } from '@/config/blocks'
import { useEditorStore } from '@/stores/editor'

type Tab = 'content' | 'blocks'
const tab = ref<Tab>('content')
const store = useEditorStore()

const layoutBlocks = [
  { label: '1 Column', cells: [12] },
  { label: '2 Columns', cells: [6, 6] },
  { label: '3 Columns', cells: [4, 4, 4] },
  { label: '4 Columns', cells: [3, 3, 3, 3] },
  { label: '1 : 2', cells: [4, 8] },
  { label: '2 : 1', cells: [8, 4] },
]
</script>

<template>
  <aside class="flex w-64 shrink-0 flex-col border-r border-line bg-rail">
    <!-- Tabs -->
    <div class="flex border-b border-line">
      <button
        type="button"
        class="flex-1 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide transition"
        :class="
          tab === 'content'
            ? 'border-b-2 border-brand text-ink'
            : 'text-slate-400 hover:text-slate-600'
        "
        @click="tab = 'content'"
      >
        Content
      </button>
      <button
        type="button"
        class="flex-1 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide transition"
        :class="
          tab === 'blocks'
            ? 'border-b-2 border-brand text-ink'
            : 'text-slate-400 hover:text-slate-600'
        "
        @click="tab = 'blocks'"
      >
        Blocks
      </button>
    </div>

    <div class="scroll-thin flex-1 overflow-y-auto p-3">
      <!-- Content blocks -->
      <div v-show="tab === 'content'" class="grid grid-cols-2 gap-2">
        <button
          v-for="b in BLOCK_LIST"
          :key="b.type"
          type="button"
          :title="`Add ${b.label}`"
          class="group flex cursor-grab flex-col items-center justify-center gap-1.5 rounded-lg border border-line bg-panel py-4 text-slate-500 shadow-sm transition hover:border-brand hover:text-brand-dark hover:shadow active:scale-95"
          @click="store.addBlock(b.type)"
        >
          <component :is="b.icon" class="h-5 w-5" />
          <span class="text-[11px] font-medium">{{ b.label }}</span>
        </button>
      </div>

      <!-- Layout blocks -->
      <div v-show="tab === 'blocks'" class="space-y-2">
        <button
          v-for="(b, idx) in layoutBlocks"
          :key="idx"
          type="button"
          :title="`Add ${b.label} row`"
          class="flex w-full cursor-grab items-center gap-1 rounded-lg border border-line bg-panel p-2 shadow-sm transition hover:border-brand hover:shadow active:scale-95"
          @click="store.addRow(b.cells)"
        >
          <span
            v-for="(c, i) in b.cells"
            :key="i"
            class="h-8 rounded bg-slate-200"
            :style="{ flexGrow: c }"
          />
          <span class="ml-2 shrink-0 text-[11px] font-medium text-slate-500">{{
            b.label
          }}</span>
        </button>
      </div>
    </div>
  </aside>
</template>
