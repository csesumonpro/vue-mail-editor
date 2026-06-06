<script setup lang="ts">
import { ref } from 'vue'
import { withBase } from 'vitepress'
import { REPO } from '../links'

const cmd = 'npm i @csesumonpro/vue-email-editor'
const copied = ref(false)

function copy() {
  navigator.clipboard?.writeText(cmd).then(() => {
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  })
}
</script>

<template>
  <section class="vee-hero">
    <div class="vee-hero-grid" />
    <div class="vee-container">
      <span class="vee-eyebrow">Vue 3 · TypeScript · MIT</span>
      <h1>
        The drag-and-drop <span class="vee-grad">email builder</span> for Vue
      </h1>
      <p class="vee-lede">
        Theme it, register your own blocks and inspector panels, and delegate every
        save and upload to your backend — all in one self-contained component.
      </p>

      <div class="vee-hero-actions">
        <a class="vee-btn vee-btn-primary" :href="withBase('/guide/getting-started')">
          Get started →
        </a>
        <a class="vee-btn vee-btn-ghost" :href="REPO" target="_blank" rel="noopener">
          View on GitHub
        </a>
      </div>

      <div class="vee-install">
        <span class="vee-prompt">$</span>
        <code>{{ cmd }}</code>
        <button class="vee-copy" type="button" @click="copy">
          {{ copied ? 'copied!' : 'copy' }}
        </button>
      </div>

      <div class="vee-pill-badges">
        <span><b>9</b> content blocks</span>
        <span><b>6</b> column layouts</span>
        <span><b>Light + dark</b> theming</span>
        <span><b>Backend-agnostic</b> persistence</span>
      </div>
    </div>
  </section>
</template>
