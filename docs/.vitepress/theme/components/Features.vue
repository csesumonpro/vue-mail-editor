<script setup lang="ts">
import {
  Boxes,
  Blocks,
  Palette,
  Braces,
  Type,
  Server,
  Mail,
  PanelTop,
  SlidersHorizontal,
  Moon,
  Download,
  ShieldCheck,
} from 'lucide-vue-next'
import { withBase } from 'vitepress'
import SiteFooter from './SiteFooter.vue'

const groups = [
  {
    icon: Boxes,
    title: 'Self-contained by design',
    body: 'No Pinia, no global plugin install, no directive registration. Every instance owns its own state, so you can mount multiple independent editors on a single page.',
    link: '/guide/introduction',
  },
  {
    icon: Blocks,
    title: 'Custom blocks',
    body: 'defineBlock() pairs a Vue render component, an inspector schema, and an email-safe HTML exporter. Pass them via :blocks or register at runtime with api.registerBlock().',
    link: '/guide/custom-blocks',
  },
  {
    icon: SlidersHorizontal,
    title: '15 inspector controls',
    body: 'Compose inspector panels from text, number, slider, color, select, align, spacing, border, font, link, image, background, list, and toggle controls.',
    link: '/reference/controls',
  },
  {
    icon: Palette,
    title: 'Token-based theming',
    body: 'A 28-token --cvee-* system, per-instance light/dark via the theme prop, and overrides that survive even hostile host CSS (e.g. WordPress admin).',
    link: '/guide/theming',
  },
  {
    icon: Moon,
    title: 'Light & dark mode',
    body: "colorMode of 'light' | 'dark' | 'auto' (auto follows the OS), two-way via v-model:colorMode, plus a built-in theme toggle in the top bar.",
    link: '/guide/theming',
  },
  {
    icon: Braces,
    title: 'Template variables',
    body: 'Insert {{ merge-tag chips in text, heading, and button blocks. Read/write the registry via the API; export keeps {{{name}}} tokens or bakes in fallbacks.',
    link: '/guide/variables',
  },
  {
    icon: Type,
    title: 'Standalone TextEditor',
    body: 'The same rich-text engine exported on its own — fixed or bubble toolbar, optional variables — with no additional package to install.',
    link: '/guide/text-editor',
  },
  {
    icon: Server,
    title: 'Backend-agnostic persistence',
    body: 'storage="none" hands persistence to you. Wire onLoad / onSave / onImageUpload and listen to change / export. The design is plain JSON — store it in one column.',
    link: '/guide/server-side',
  },
  {
    icon: Mail,
    title: 'Email-safe export',
    body: 'Table-based HTML with inlined styles, Outlook (MSO) conditional comments, and mobile media queries. Columns stack on small screens.',
    link: '/guide/getting-started',
  },
  {
    icon: PanelTop,
    title: 'Customizable top bar',
    body: 'Show/hide actions, rename labels, swap the logo via #header-brand, push buttons via #header-actions, or replace the whole bar with #header.',
    link: '/guide/top-bar',
  },
  {
    icon: Download,
    title: 'Import & export',
    body: 'Export email-safe HTML, download or import design JSON, and get a debounced change event (~300ms) for autosave.',
    link: '/guide/configuration',
  },
  {
    icon: ShieldCheck,
    title: 'Host-CSS hardening',
    body: "Editor styles are marked !important so a host page can't break the layout; tokens flow to portaled UI and pierce a Shadow DOM boundary.",
    link: '/guide/theming',
  },
]
</script>

<template>
  <div class="vee-page">
    <section class="vee-hero" style="padding: 80px 0 64px">
      <div class="vee-hero-grid" />
      <div class="vee-container">
        <span class="vee-eyebrow">Features</span>
        <h1 style="font-size: clamp(32px, 5vw, 50px)">Everything in the box</h1>
        <p class="vee-lede">
          A production-ready email builder with the extensibility, theming, and backend
          control that real apps need.
        </p>
      </div>
    </section>

    <section class="vee-section">
      <div class="vee-container">
        <div class="vee-grid">
          <a v-for="g in groups" :key="g.title" class="vee-card" :href="withBase(g.link)">
            <div class="vee-card-icon"><component :is="g.icon" :size="20" /></div>
            <h3>{{ g.title }}</h3>
            <p>{{ g.body }}</p>
          </a>
        </div>
      </div>
    </section>

    <SiteFooter />
  </div>
</template>
