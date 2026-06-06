<script setup lang="ts">
import { withBase } from 'vitepress'
import SiteFooter from './SiteFooter.vue'

// Mirrors the built-in starter templates in src/config/templates.ts.
const templates = [
  { name: 'Welcome', desc: 'Onboarding email with logo, intro and CTA.', grad: 'linear-gradient(135deg,#818cf8,#8b5cf6)' },
  { name: 'Newsletter', desc: 'Weekly digest with a feature and two stories.', grad: 'linear-gradient(135deg,#38bdf8,#06b6d4)' },
  { name: 'Promo', desc: 'Bold dark-mode sale announcement.', grad: 'linear-gradient(135deg,#facc15,#f59e0b)' },
  { name: 'Blank', desc: 'Start from an empty canvas.', grad: 'linear-gradient(135deg,#e2e8f0,#cbd5e1)' },
]

const useCases = [
  'Product launches',
  'Transactional receipts',
  'Weekly newsletters',
  'Onboarding sequences',
  'Event invitations',
  'Account notifications',
]
</script>

<template>
  <div class="vee-page">
    <section class="vee-hero" style="padding: 80px 0 64px">
      <div class="vee-hero-grid" />
      <div class="vee-container">
        <span class="vee-eyebrow">Showcase</span>
        <h1 style="font-size: clamp(32px, 5vw, 50px)">What you can build</h1>
        <p class="vee-lede">
          The editor ships with starter templates and the building blocks for just about any
          email your product needs to send.
        </p>
      </div>
    </section>

    <section class="vee-section">
      <div class="vee-container">
        <div class="vee-center" style="margin-bottom: 40px">
          <span class="vee-eyebrow">Starter templates</span>
          <h2 class="vee-h2">Open one and make it yours</h2>
          <p class="vee-sub">
            Built-in templates you can replace or extend with <code>config.templates</code>.
          </p>
        </div>
        <div class="vee-grid">
          <div v-for="t in templates" :key="t.name" class="vee-card" style="padding: 0; overflow: hidden">
            <div class="vee-thumb" :style="{ background: t.grad }">
              <div class="vee-thumb-card">
                <span /><span /><span class="vee-thumb-btn" />
              </div>
            </div>
            <div style="padding: 18px 20px">
              <h3>{{ t.name }}</h3>
              <p>{{ t.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="vee-section vee-band">
      <div class="vee-container vee-center">
        <span class="vee-eyebrow">Use cases</span>
        <h2 class="vee-h2">One editor, every kind of email</h2>
        <div class="vee-chips" style="margin-top: 26px">
          <span v-for="u in useCases" :key="u" class="vee-chip">{{ u }}</span>
        </div>
        <div style="margin-top: 36px">
          <a class="vee-btn vee-btn-primary" :href="withBase('/guide/getting-started')">Start building →</a>
        </div>
      </div>
    </section>

    <SiteFooter />
  </div>
</template>

<style scoped>
.vee-thumb {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.vee-thumb-card {
  width: 62%;
  height: 70%;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 8px;
  box-shadow: 0 10px 24px -12px rgba(2, 6, 23, 0.4);
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
}
.vee-thumb-card span {
  height: 8px;
  border-radius: 4px;
  background: #cbd5e1;
}
.vee-thumb-card span:nth-child(1) {
  width: 70%;
  height: 12px;
  background: #94a3b8;
}
.vee-thumb-card span:nth-child(2) {
  width: 90%;
}
.vee-thumb-btn {
  width: 38% !important;
  height: 14px !important;
  margin-top: 4px;
  background: #0f172a !important;
}
</style>
