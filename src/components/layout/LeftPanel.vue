<script setup lang="ts">
import { ref } from 'vue'
import draggable from 'vuedraggable'
import { LayoutGrid, X } from 'lucide-vue-next'
import { BLOCK_LIST } from '@/config/blocks'
import type { BlockDef } from '@/config/blocks'
import { createContent } from '@/config/blockDefaults'
import { createRow } from '@/config/defaults'
import { useEditor } from "@/core/useEditor"

const store = useEditor()
const containerOpen = ref(false)

const layoutBlocks = [
  { label: '1 Column', cells: [12] },
  { label: '2 Columns', cells: [6, 6] },
  { label: '3 Columns', cells: [4, 4, 4] },
  { label: '4 Columns', cells: [3, 3, 3, 3] },
  { label: '1 : 2', cells: [4, 8] },
  { label: '2 : 1', cells: [8, 4] },
]

// Clone palette items into real design nodes when dragged onto the canvas.
const contentGroup = { name: 'content', pull: 'clone', put: false }
const rowGroup = { name: 'rows', pull: 'clone', put: false }

const cloneBlock = (b: BlockDef) => createContent(b.type)
const cloneLayout = (l: { cells: number[] }) => createRow(l.cells)
</script>

<template>
  <aside class="flex shrink-0">
    <!-- Narrow icon rail (follows theme) -->
    <div
      class="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-line bg-rail py-3"
    >
      <!-- Container (layouts) toggle -->
      <button
        type="button"
        v-tooltip:right="'Container'"
        class="flex h-10 w-10 items-center justify-center rounded-lg transition"
        :class="
          containerOpen
            ? 'bg-brand text-on-accent'
            : 'text-subtle hover:bg-hover hover:text-ink'
        "
        @click="containerOpen = !containerOpen"
      >
        <LayoutGrid class="h-5 w-5" />
      </button>

      <div class="my-1 h-px w-7 bg-line" />

      <!-- Content blocks (drag onto canvas, or click to add) -->
      <draggable
        :list="BLOCK_LIST"
        :group="contentGroup"
        :clone="cloneBlock"
        :sort="false"
        item-key="type"
        class="flex flex-col items-center gap-1"
        @start="store.beginDrag()"
        @end="store.endDrag()"
      >
        <template #item="{ element }">
          <button
            type="button"
            v-tooltip:right="element.label"
            class="flex h-10 w-10 cursor-grab items-center justify-center rounded-lg text-subtle transition hover:bg-hover hover:text-ink active:scale-95"
            @click="store.addBlock(element.type)"
          >
            <component :is="element.icon" class="h-5 w-5" />
          </button>
        </template>
      </draggable>
    </div>

    <!-- Container panel (pushes the canvas) -->
    <div
      v-show="containerOpen"
      class="flex w-56 shrink-0 flex-col border-r border-line bg-rail"
    >
      <div class="flex items-center justify-between border-b border-line px-3 py-2.5">
        <span class="text-xs font-semibold uppercase tracking-wide text-subtle">
          Container
        </span>
        <button
          type="button"
          title="Close"
          class="flex h-6 w-6 items-center justify-center rounded text-faint transition hover:bg-hover hover:text-ink"
          @click="containerOpen = false"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <draggable
        :list="layoutBlocks"
        :group="rowGroup"
        :clone="cloneLayout"
        :sort="false"
        item-key="label"
        class="scroll-thin flex-1 space-y-2 overflow-y-auto p-3"
        @start="store.beginDrag()"
        @end="store.endDrag()"
      >
        <template #item="{ element }">
          <button
            type="button"
            :title="`Add ${element.label} row`"
            class="flex w-full cursor-grab items-center gap-1 rounded-lg border border-line bg-panel p-2 shadow-sm transition hover:border-brand hover:shadow active:scale-95"
            @click="store.addRow(element.cells)"
          >
            <span
              v-for="(c, i) in element.cells"
              :key="i"
              class="h-8 rounded bg-active"
              :style="{ flexGrow: c }"
            />
            <span class="ml-2 shrink-0 text-[11px] font-medium text-subtle">{{
              element.label
            }}</span>
          </button>
        </template>
      </draggable>
    </div>
  </aside>
</template>
