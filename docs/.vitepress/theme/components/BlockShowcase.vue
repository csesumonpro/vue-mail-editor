<script setup lang="ts">
import {
  Heading,
  Pilcrow,
  MousePointerClick,
  Image,
  Minus,
  MoveVertical,
  Share2,
  Menu,
  Code,
} from 'lucide-vue-next'
import { withBase } from 'vitepress'

const layouts = [
  { label: '1 Column', cols: [1] },
  { label: '2 Columns', cols: [1, 1] },
  { label: '3 Columns', cols: [1, 1, 1] },
  { label: '4 Columns', cols: [1, 1, 1, 1] },
  { label: '1 : 2', cols: [1, 2] },
  { label: '2 : 1', cols: [2, 1] },
]

const blocks = [
  { icon: Heading, label: 'Heading' },
  { icon: Pilcrow, label: 'Text' },
  { icon: MousePointerClick, label: 'Button' },
  { icon: Image, label: 'Image' },
  { icon: Minus, label: 'Divider' },
  { icon: MoveVertical, label: 'Spacer' },
  { icon: Share2, label: 'Social' },
  { icon: Menu, label: 'Menu' },
  { icon: Code, label: 'HTML' },
]
</script>

<template>
  <section class="vee-section vee-band">
    <div class="vee-container">
      <div class="vee-center" style="margin-bottom: 44px">
        <span class="vee-eyebrow">Batteries included</span>
        <h2 class="vee-h2">Six layouts, nine content blocks</h2>
        <p class="vee-sub">
          Responsive column layouts that stack on mobile, plus a full set of content blocks —
          and you can register your own.
        </p>
      </div>

      <div class="vee-layouts" style="margin-bottom: 36px">
        <div v-for="l in layouts" :key="l.label" class="vee-layout">
          <div class="vee-layout-bars">
            <i v-for="(c, i) in l.cols" :key="i" :style="{ flex: c }" />
          </div>
          <span>{{ l.label }}</span>
        </div>
      </div>

      <div class="vee-chips">
        <span v-for="b in blocks" :key="b.label" class="vee-chip">
          <component :is="b.icon" :size="16" />
          {{ b.label }}
        </span>
      </div>

      <div class="vee-center" style="margin-top: 36px">
        <a class="vee-btn vee-btn-ghost" :href="withBase('/reference/blocks')">
          Browse the block reference →
        </a>
      </div>
    </div>
  </section>
</template>
