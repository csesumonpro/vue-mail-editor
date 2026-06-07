<script setup lang="ts">
import { computed } from 'vue'
import { LayoutTemplate } from 'lucide-vue-next'
import ModalShell from './ModalShell.vue'
import { TEMPLATES } from '@/config/templates'
import type { TemplateDef } from '@/config/templates'
import { useEditor } from '@/core/useEditor'
import { useConfig } from '@/core/useConfig'
import { useToast } from '@/composables/useToast'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const store = useEditor()
const config = useConfig()
const { notify } = useToast()

// Host-provided templates take precedence over the built-ins.
const templates = computed(() => config.templates ?? TEMPLATES)

function pick(t: TemplateDef) {
  store.loadDesign(t.build())
  notify(`Loaded “${t.name}” template`)
  emit('close')
}
</script>

<template>
  <ModalShell :open="open" max-width="max-w-3xl" @close="emit('close')">
    <template #header>
      <LayoutTemplate class="h-4 w-4" />
      Choose a template
    </template>

    <div class="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
      <button
        v-for="t in templates"
        :key="t.id"
        type="button"
        class="group overflow-hidden rounded-lg border border-line text-left transition hover:border-brand hover:shadow-md"
        @click="pick(t)"
      >
        <div
          class="flex h-24 items-center justify-center bg-gradient-to-br text-white/90"
          :class="t.accent"
        >
          <LayoutTemplate class="h-7 w-7" />
        </div>
        <div class="p-3">
          <p class="text-sm font-semibold text-ink">{{ t.name }}</p>
          <p class="mt-0.5 text-[11px] leading-snug text-subtle">
            {{ t.description }}
          </p>
        </div>
      </button>
    </div>
  </ModalShell>
</template>
