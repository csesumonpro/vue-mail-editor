<script setup lang="ts">
import { ref } from 'vue'
import {
  Columns3,
  Heading,
  Pilcrow,
  RectangleHorizontal,
  Image,
  Minus,
  MoveVertical,
  Users,
  Menu as MenuIcon,
  GalleryHorizontal,
  Code,
} from 'lucide-vue-next'

type Tab = 'content' | 'blocks'
const tab = ref<Tab>('content')

// Static palette for Phase 0 — wired to drag & drop in Phase 4.
const contentBlocks = [
  { type: 'columns', label: 'Columns', icon: Columns3 },
  { type: 'heading', label: 'Heading', icon: Heading },
  { type: 'paragraph', label: 'Text', icon: Pilcrow },
  { type: 'button', label: 'Button', icon: RectangleHorizontal },
  { type: 'image', label: 'Image', icon: Image },
  { type: 'divider', label: 'Divider', icon: Minus },
  { type: 'spacer', label: 'Spacer', icon: MoveVertical },
  { type: 'social', label: 'Social', icon: Users },
  { type: 'menu', label: 'Menu', icon: MenuIcon },
  { type: 'carousel', label: 'Carousel', icon: GalleryHorizontal },
  { type: 'html', label: 'HTML', icon: Code },
]

const layoutBlocks = [
  { type: '1col', label: '1 Column', cells: [12] },
  { type: '2col', label: '2 Columns', cells: [6, 6] },
  { type: '3col', label: '3 Columns', cells: [4, 4, 4] },
  { type: '4col', label: '4 Columns', cells: [3, 3, 3, 3] },
  { type: '1-2', label: '1 : 2', cells: [4, 8] },
  { type: '2-1', label: '2 : 1', cells: [8, 4] },
]
</script>

<template>
  <aside
    class="flex w-64 shrink-0 flex-col border-r border-line bg-rail"
  >
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
          v-for="b in contentBlocks"
          :key="b.type"
          type="button"
          class="group flex cursor-grab flex-col items-center justify-center gap-1.5 rounded-lg border border-line bg-panel py-4 text-slate-500 shadow-sm transition hover:border-brand hover:text-brand-dark hover:shadow"
        >
          <component :is="b.icon" class="h-5 w-5" />
          <span class="text-[11px] font-medium">{{ b.label }}</span>
        </button>
      </div>

      <!-- Layout blocks -->
      <div v-show="tab === 'blocks'" class="space-y-2">
        <button
          v-for="b in layoutBlocks"
          :key="b.type"
          type="button"
          class="flex w-full cursor-grab items-center gap-1 rounded-lg border border-line bg-panel p-2 shadow-sm transition hover:border-brand hover:shadow"
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
