<script setup lang="ts">
import { withBase } from 'vitepress'

const methods = [
  'getDesign()',
  'loadDesign(design)',
  'newDesign()',
  'exportHtml(mode?)',
  'getVariables()',
  'setVariables(vars)',
  'save()',
  'export()',
  'undo()',
  'redo()',
  'registerBlock(def)',
  'selectBody()',
]
</script>

<template>
  <section class="vee-section vee-band">
    <div class="vee-container">
      <div class="vee-center" style="margin-bottom: 36px">
        <span class="vee-eyebrow">Imperative API</span>
        <h2 class="vee-h2">Drive it from your own UI</h2>
        <p class="vee-sub">
          Grab the API from <code>@ready</code> or a template ref and wire up custom toolbars,
          autosave, or server rendering.
        </p>
      </div>
      <div class="vee-api">
        <code v-for="m in methods" :key="m">{{ m }}</code>
      </div>
      <div class="vee-center" style="margin-top: 32px">
        <a class="vee-btn vee-btn-ghost" :href="withBase('/reference/api')">Full API reference →</a>
      </div>
    </div>
  </section>
</template>
