<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Copy, Download, Check } from 'lucide-vue-next'
import ModalShell from './ModalShell.vue'
import { useEditor } from '@/core/useEditor'
import { useBlocks } from '@/core/registry'
import { useToast } from '@/composables/useToast'
import { exportHtml } from '@/export/htmlExporter'
import { downloadText } from '@/utils/designIO'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const store = useEditor()
const blocks = useBlocks()
const { notify } = useToast()

type Tab = 'preview' | 'code'
const tab = ref<Tab>('preview')
const copied = ref(false)

// Whether the design defines any template variables (gates the fallback toggle).
const hasVariables = computed(() => (store.design.variables?.length ?? 0) > 0)
// When on, `{{{name}}}` tokens are replaced with each variable's fallback value.
const useFallback = ref(false)

// Raw, email-safe HTML — used for copy/download (compact keeps inline-block
// social icons / menu links from gaining whitespace gaps).
const html = computed(() =>
  props.open ? exportHtml(store.design, blocks, useFallback.value ? 'fallback' : 'token') : '',
)

// Pretty-printed version, lazily beautified, shown only in the Code tab.
const formatted = ref('')
watch(
  [() => props.open, tab, html],
  async () => {
    if (!props.open || tab.value !== 'code') return
    try {
      const { html: beautify } = await import('js-beautify')
      formatted.value = beautify(html.value, {
        indent_size: 2,
        wrap_line_length: 0,
        preserve_newlines: false,
        end_with_newline: false,
      })
    } catch {
      formatted.value = html.value
    }
  },
  { immediate: true },
)

async function copy() {
  try {
    await navigator.clipboard.writeText(html.value)
    copied.value = true
    notify('HTML copied to clipboard')
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    notify('Copy failed', 'error')
  }
}

function download() {
  downloadText(html.value, 'email.html', 'text/html')
  notify('HTML downloaded')
}
</script>

<template>
  <ModalShell :open="open" max-width="max-w-5xl" fill @close="emit('close')">
    <template #header>Export HTML</template>
    <template #header-actions>
      <label
        v-if="hasVariables"
        class="flex cursor-pointer items-center gap-1.5 text-xs text-subtle"
      >
        <input v-model="useFallback" type="checkbox" class="accent-black" />
        Show fallback values
      </label>
      <div class="flex rounded-md border border-line p-0.5 text-xs">
        <button
          type="button"
          class="rounded px-3 py-1 font-medium transition"
          :class="tab === 'preview' ? 'bg-brand text-on-accent' : 'text-subtle'"
          @click="tab = 'preview'"
        >
          Preview
        </button>
        <button
          type="button"
          class="rounded px-3 py-1 font-medium transition"
          :class="tab === 'code' ? 'bg-brand text-on-accent' : 'text-subtle'"
          @click="tab = 'code'"
        >
          Code
        </button>
      </div>
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-xs font-medium text-subtle hover:border-brand hover:text-brand-dark"
        @click="copy"
      >
        <component :is="copied ? Check : Copy" class="h-3.5 w-3.5" />
        Copy
      </button>
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-md bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-black/85"
        @click="download"
      >
        <Download class="h-3.5 w-3.5" />
        Download
      </button>
    </template>

    <div class="h-full overflow-hidden bg-muted">
      <iframe
        v-if="tab === 'preview'"
        :srcdoc="html"
        class="h-full w-full border-0 bg-surface"
        title="Email preview"
      />
      <pre
        v-else
        class="scroll-thin h-full overflow-auto bg-slate-900 p-4 text-xs leading-relaxed text-slate-100"
      ><code>{{ formatted || html }}</code></pre>
    </div>
  </ModalShell>
</template>
