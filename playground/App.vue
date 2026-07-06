<script setup lang="ts">
import { ref } from 'vue'
import { Star } from 'lucide-vue-next'
import { EmailEditor, TextEditor, defineBlock } from '@/index'
import type { EditorConfig, DesignVariable } from '@/index'
import RatingBlock from './RatingBlock.vue'

// A custom block built with the public API (render + inspector + toHtml).
const ratingBlock = defineBlock<{ stars: number; color: string }>({
  type: 'rating',
  label: 'Rating',
  icon: Star,
  defaultValues: () => ({ stars: 5, color: '#f59e0b' }),
  render: RatingBlock,
  inspector: [
    {
      title: 'Rating',
      controls: [
        { type: 'number', key: 'stars', label: 'Stars', min: 1, max: 5 },
        { type: 'color', key: 'color', label: 'Color' },
      ],
    },
  ],
  toHtml: (v) =>
    `<div style="text-align:center;font-size:26px;color:${v.color}">${'★'.repeat(v.stars)}</div>`,
})

const config: EditorConfig = { contentWidth: 600 }

function publish() {
  // eslint-disable-next-line no-alert
  alert('Host "Publish" action — wire to your backend.')
}

// --- Standalone TextEditor demo ---------------------------------------
const view = ref<'email' | 'text'>('email')
// Toolbar mode applied to every TextEditor demo below.
const toolbarMode = ref<'fixed' | 'bubble' | false>('fixed')

const htmlDefault = ref('<p>Edit me — the full default toolbar.</p>')
const htmlVarOnly = ref('')
const htmlSubset = ref('<p>Bold / italic / link / variable only.</p>')

// A shared variable registry (seeded so the {{ autocomplete has entries).
const vars = ref<DesignVariable[]>([
  { name: 'first_name', type: 'text', fallback: 'there' },
  { name: 'company', type: 'text', fallback: 'Acme' },
])

// Built as a JS string so the literal braces aren't parsed as Vue interpolation.
const varHint = 'Type {{ (or use the {} button) to insert a variable…'

function tabStyle(active: boolean) {
  return {
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid #e2e8f0',
    background: active ? '#0f172a' : '#fff',
    color: active ? '#fff' : '#334155',
  }
}
</script>

<template>
  <div style="height: 100vh; display: flex; flex-direction: column">
    <!-- Demo switcher -->
    <div
      style="
        display: flex;
        gap: 8px;
        padding: 10px 16px;
        border-bottom: 1px solid #e2e8f0;
        background: #fff;
      "
    >
      <button type="button" :style="tabStyle(view === 'email')" @click="view = 'email'">
        Email Editor
      </button>
      <button type="button" :style="tabStyle(view === 'text')" @click="view = 'text'">
        Text Editor
      </button>
    </div>

    <div style="flex: 1; min-height: 0">
      <!-- Full email editor -->
      <EmailEditor
        v-if="view === 'email'"
        :blocks="[ratingBlock]"
        :config="config"
        color-mode="light"
      >
        <template #header-actions>
          <button
            type="button"
            class="rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-header-fg hover:bg-ink/10"
            @click="publish"
          >
            Publish
          </button>
        </template>
      </EmailEditor>

      <!-- Standalone TextEditor variants -->
      <div v-else style="height: 100%; overflow: auto; background: #f8fafc; padding: 32px">
        <div
          style="
            max-width: 720px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 28px;
          "
        >
          <!-- Toolbar-mode switcher -->
          <div style="display: flex; align-items: center; gap: 8px">
            <span style="font-size: 12px; color: #64748b">Toolbar:</span>
            <button type="button" :style="tabStyle(toolbarMode === 'fixed')" @click="toolbarMode = 'fixed'">
              Fixed
            </button>
            <button type="button" :style="tabStyle(toolbarMode === 'bubble')" @click="toolbarMode = 'bubble'">
              Bubble
            </button>
            <button type="button" :style="tabStyle(toolbarMode === false)" @click="toolbarMode = false">
              None
            </button>
            <span v-if="toolbarMode === 'bubble'" style="font-size: 11px; color: #94a3b8">
              select text to reveal it
            </span>
          </div>

          <section>
            <h3 style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 8px">
              Default toolbar
            </h3>
            <TextEditor v-model="htmlDefault" :toolbar="toolbarMode" />
          </section>

          <section>
            <h3 style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 8px">
              Variable only — <code>:toolbar-items="['variable']"</code>
            </h3>
            <TextEditor
              v-model="htmlVarOnly"
              v-model:variables="vars"
              :variables="vars"
              :toolbar="toolbarMode"
              :toolbar-items="['variable']"
              :placeholder="varHint"
            />
            <pre
              style="
                margin-top: 8px;
                font-size: 11px;
                color: #64748b;
                white-space: pre-wrap;
                word-break: break-all;
              "
            >{{ htmlVarOnly }}</pre>
          </section>

          <section>
            <h3 style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 8px">
              Subset — <code>['bold', 'italic', 'link', 'variable']</code>
            </h3>
            <TextEditor
              v-model="htmlSubset"
              v-model:variables="vars"
              :variables="vars"
              :toolbar="toolbarMode"
              :toolbar-items="['bold', 'italic', 'link', 'variable']"
            />
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
