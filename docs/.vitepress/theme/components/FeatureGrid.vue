<script setup lang="ts">
import { Boxes, Blocks, Palette, Server, Mail, PanelTop } from 'lucide-vue-next'

const features = [
  {
    icon: Boxes,
    title: 'Fully self-contained',
    body: 'No Pinia, no global setup, no directive registration. Mount several independent editor instances on one page.',
  },
  {
    icon: Blocks,
    title: 'Extensible blocks',
    body: 'Register your own blocks with a render component, an inspector schema, and an email-safe HTML exporter.',
  },
  {
    icon: Palette,
    title: 'Themeable',
    body: 'Per-instance light/dark tokens via props or --cvee-* CSS variables. Multiple themes coexist on one page.',
  },
  {
    icon: Server,
    title: 'Bring your own backend',
    body: 'storage="none" hands persistence to you — onLoad / onSave / onImageUpload plus change & export events.',
  },
  {
    icon: Mail,
    title: 'Email-safe export',
    body: 'Table-based HTML with inlined styles, Outlook (MSO) conditionals, and mobile media queries.',
  },
  {
    icon: PanelTop,
    title: 'Customizable top bar',
    body: 'Show/hide actions, rename labels, swap the logo, push your own buttons, or replace the bar entirely.',
  },
]
</script>

<template>
  <section class="vee-section">
    <div class="vee-container">
      <div class="vee-center" style="margin-bottom: 44px">
        <span class="vee-eyebrow">Why this editor</span>
        <h2 class="vee-h2">Everything you need, nothing you don't</h2>
        <p class="vee-sub">A complete email-building experience that stays out of your app's way.</p>
      </div>
      <div class="vee-grid">
        <div v-for="f in features" :key="f.title" class="vee-card">
          <div class="vee-card-icon"><component :is="f.icon" :size="20" /></div>
          <h3>{{ f.title }}</h3>
          <p>{{ f.body }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
