<script setup lang="ts">
// Loaded ONLY on the client, in an async chunk (see LiveDemo.vue). Imports the
// BUILT library so its Tailwind-compiled CSS comes along. The active tab is
// owned by LiveDemo and passed in; this component renders the two demos.
import { ref } from 'vue'
import { EmailEditor, TextEditor, TEMPLATES } from 'vue-mail-editor'
import type { DesignVariable } from 'vue-mail-editor'
import 'vue-mail-editor/style.css'

defineProps<{ tab: 'email' | 'text' }>()

// Open on the Welcome template so the editor shows real content, not a blank
// canvas / the template picker.
const welcome = TEMPLATES.find((t) => t.id === 'welcome')
const design = ref(welcome ? welcome.build() : undefined)

// Text tab: several standalone TextEditor variants, one per toolbar mode.
const fixedText = ref('<p>The toolbar stays <strong>fixed</strong> above the editor — the default.</p>')
const bubbleText = ref('<p><strong>Select</strong> any text to reveal the floating bubble toolbar.</p>')
const plainText = ref('<p>No toolbar at all — a clean editable surface via <code>:toolbar="false"</code>.</p>')
const varText = ref('<p>Type “{{” to insert a variable. Restricted to just the variable button.</p>')
const variables = ref<DesignVariable[]>([
  { name: 'firstName', type: 'string', fallback: 'there' },
  { name: 'company', type: 'string', fallback: 'Acme' },
])
</script>

<template>
  <!-- Both stay mounted (v-show) so switching tabs keeps each editor's state. -->
  <div class="vee-live">
    <div v-show="tab === 'email'" class="vee-live-panel">
      <EmailEditor v-model="design" />
    </div>

    <div v-show="tab === 'text'" class="vee-live-panel vee-live-panel--text">
      <div class="vee-te-grid">
        <section class="vee-te-item">
          <h4 class="vee-te-label">Fixed toolbar</h4>
          <p class="vee-te-hint">A persistent toolbar above the editor (the default).</p>
          <TextEditor v-model="fixedText" toolbar="fixed" />
        </section>

        <section class="vee-te-item">
          <h4 class="vee-te-label">Bubble toolbar</h4>
          <p class="vee-te-hint">Select text to reveal a floating toolbar.</p>
          <TextEditor v-model="bubbleText" toolbar="bubble" />
        </section>

        <section class="vee-te-item">
          <h4 class="vee-te-label">No toolbar</h4>
          <p class="vee-te-hint">A plain editable surface — <code>:toolbar="false"</code>.</p>
          <TextEditor v-model="plainText" :toolbar="false" />
        </section>

        <section class="vee-te-item">
          <h4 class="vee-te-label">Variable-only toolbar</h4>
          <p class="vee-te-hint">
            Restrict buttons with <code>toolbarItems</code> — here, just the variable inserter.
          </p>
          <TextEditor v-model="varText" :toolbar-items="['variable']" :variables="variables" />
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vee-live {
  height: 100%;
}
.vee-live-panel {
  height: 100%;
  overflow: hidden;
}
.vee-live-panel--text {
  overflow: auto;
  padding: 1.75rem 1.5rem;
  background: var(--vp-c-bg-soft);
}
.vee-te-grid {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  max-width: 720px;
  margin: 0 auto;
}
.vee-te-label {
  margin: 0 0 2px;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.vee-te-hint {
  margin: 0 0 0.6rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}
</style>
