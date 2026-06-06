<script setup lang="ts">
import { withBase } from 'vitepress'
import { REPO } from '../links'
</script>

<template>
  <section class="vee-section">
    <div class="vee-container">
      <div class="vee-cta">
        <h2>Ship an email builder this afternoon</h2>
        <p>Open source, MIT licensed, and Vue 3 native. Install it and you're building.</p>
        <div class="vee-hero-actions" style="justify-content: center">
          <a class="vee-btn vee-btn-primary" :href="withBase('/guide/getting-started')">Get started →</a>
          <a class="vee-btn vee-btn-ghost" :href="REPO" target="_blank" rel="noopener">
            Star on GitHub
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
