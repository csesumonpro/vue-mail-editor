<script setup lang="ts">
import { computed, ref } from 'vue'
import { X, Copy, Download, Check } from 'lucide-vue-next'
import { useEditorStore } from '@/stores/editor'
import { useToast } from '@/composables/useToast'
import { exportHtml } from '@/export/htmlExporter'
import { downloadText } from '@/utils/designIO'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const store = useEditorStore()
const { notify } = useToast()

type Tab = 'preview' | 'code'
const tab = ref<Tab>('preview')
const copied = ref(false)

const html = computed(() => (props.open ? exportHtml(store.design) : ''))

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
  <Transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-6"
      @click.self="emit('close')"
    >
      <div class="flex h-full max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-surface shadow-2xl">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 class="text-sm font-semibold text-ink">Export HTML</h2>
          <div class="flex items-center gap-2">
            <div class="flex rounded-md border border-line p-0.5 text-xs">
              <button
                type="button"
                class="rounded px-3 py-1 font-medium transition"
                :class="tab === 'preview' ? 'bg-brand text-white' : 'text-subtle'"
                @click="tab = 'preview'"
              >
                Preview
              </button>
              <button
                type="button"
                class="rounded px-3 py-1 font-medium transition"
                :class="tab === 'code' ? 'bg-brand text-white' : 'text-subtle'"
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
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-md text-faint hover:bg-hover hover:text-ink"
              @click="emit('close')"
            >
              <X class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="min-h-0 flex-1 overflow-hidden bg-muted">
          <iframe
            v-if="tab === 'preview'"
            :srcdoc="html"
            class="h-full w-full border-0 bg-surface"
            title="Email preview"
          />
          <pre
            v-else
            class="scroll-thin h-full overflow-auto bg-slate-900 p-4 text-xs leading-relaxed text-slate-100"
          ><code>{{ html }}</code></pre>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
