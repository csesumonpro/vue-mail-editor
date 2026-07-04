<script setup lang="ts">
import { withBase } from 'vitepress'

const code = `<script setup lang="ts">
import { ref } from 'vue'
import { EmailEditor } from 'vue-mail-editor'
import 'vue-mail-editor/style.css'
import type { Design } from 'vue-mail-editor'

const design = ref<Design>()
<\/script>

<template>
  <div style="height: 100vh">
    <EmailEditor v-model="design" />
  </div>
</template>`
</script>

<template>
  <section class="vee-section">
    <div class="vee-container">
      <div class="vee-split">
        <div>
          <span class="vee-eyebrow">Quickstart</span>
          <h2 class="vee-h2">Up and running in a minute</h2>
          <p class="vee-sub">
            Install the package, drop in the component, and bind a <code>v-model</code>.
            That's a working email editor — drag, drop, style, and export.
          </p>
          <ul class="vee-steps">
            <li><b>1.</b> <code>npm i vue-mail-editor</code></li>
            <li><b>2.</b> Import the component and its stylesheet</li>
            <li><b>3.</b> Give it a sized container — it fills 100% height</li>
          </ul>
          <a class="vee-btn vee-btn-primary" :href="withBase('/guide/getting-started')">
            Read the guide →
          </a>
        </div>
        <div class="vee-code">
          <div class="vee-code-bar">
            <span /><span /><span />
            <em>App.vue</em>
          </div>
          <pre><code>{{ code }}</code></pre>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.vee-steps {
  list-style: none;
  padding: 0;
  margin: 0 0 26px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.vee-steps li {
  color: var(--vp-c-text-2);
  font-size: 15px;
}
.vee-steps b {
  color: var(--vee-accent);
  margin-right: 6px;
}
.vee-steps code {
  font-size: 13px;
}
.vee-code {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background: #0b0f1a;
  box-shadow: 0 24px 60px -30px rgba(2, 6, 23, 0.6);
}
.vee-code-bar {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
}
.vee-code-bar span {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #334155;
}
.vee-code-bar em {
  margin-left: 8px;
  color: #64748b;
  font-style: normal;
  font-size: 12.5px;
  font-family: var(--vp-font-family-mono);
}
.vee-code pre {
  margin: 0;
  padding: 18px 20px;
  overflow-x: auto;
}
.vee-code code {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.7;
  color: #cbd5e1;
  white-space: pre;
}
</style>
