<script setup lang="ts">
import { Star } from 'lucide-vue-next'
import { EmailEditor, defineBlock } from '@/index'
import type { EditorConfig } from '@/index'
import RatingBlock from './RatingBlock.vue'

// A custom block built with the public API (render + inspector + toHtml).
const ratingBlock = defineBlock<{ stars: number; color: string }>({
  type: 'rating',
  label: 'Rating',
  icon: Star,
  defaultValues: () => ({ stars: 5, color: '#f59e0b' }),
  render: RatingBlock,
  inspector: [
    {
      title: 'Rating',
      controls: [
        { type: 'number', key: 'stars', label: 'Stars', min: 1, max: 5 },
        { type: 'color', key: 'color', label: 'Color' },
      ],
    },
  ],
  toHtml: (v) =>
    `<div style="text-align:center;font-size:26px;color:${v.color}">${'★'.repeat(v.stars)}</div>`,
})

const config: EditorConfig = { contentWidth: 600 }

function publish() {
  // eslint-disable-next-line no-alert
  alert('Host "Publish" action — wire to your backend.')
}
</script>

<template>
  <EmailEditor :blocks="[ratingBlock]" :config="config" color-mode="light">
    <template #header-actions>
      <button
        type="button"
        class="rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-header-fg hover:bg-ink/10"
        @click="publish"
      >
        Publish
      </button>
    </template>
  </EmailEditor>
</template>
