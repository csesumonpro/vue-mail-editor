<script setup lang="ts">
import { Palette, Braces, Type } from 'lucide-vue-next'
import { withBase } from 'vitepress'

const items = [
  {
    icon: Palette,
    title: 'Deep theming',
    body: 'A 28-token --cvee-* system with per-instance light/dark. Override from your app and survive hostile host CSS.',
    link: '/guide/theming',
  },
  {
    icon: Braces,
    title: 'Template variables',
    body: 'Type {{ to insert merge-tag chips. Read & write the registry via the API and resolve tokens or fallbacks on export.',
    link: '/guide/variables',
  },
  {
    icon: Type,
    title: 'Standalone TextEditor',
    body: 'The same rich-text engine, exported separately — a lightweight editor with no extra package to install.',
    link: '/guide/text-editor',
  },
]
</script>

<template>
  <section class="vee-section">
    <div class="vee-container">
      <div class="vee-center" style="margin-bottom: 44px">
        <span class="vee-eyebrow">More than a builder</span>
        <h2 class="vee-h2">Built for real products</h2>
        <p class="vee-sub">Theming, merge variables, and a standalone editor — all in the same package.</p>
      </div>
      <div class="vee-grid">
        <a v-for="i in items" :key="i.title" class="vee-card" :href="withBase(i.link)">
          <div class="vee-card-icon"><component :is="i.icon" :size="20" /></div>
          <h3>{{ i.title }}</h3>
          <p>{{ i.body }}</p>
        </a>
      </div>
    </div>
  </section>
</template>
