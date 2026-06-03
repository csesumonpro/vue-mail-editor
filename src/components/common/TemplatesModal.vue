<script setup lang="ts">
import { X, LayoutTemplate } from 'lucide-vue-next'
import { TEMPLATES } from '@/config/templates'
import type { TemplateDef } from '@/config/templates'
import { useEditorStore } from '@/stores/editor'
import { useToast } from '@/composables/useToast'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const store = useEditorStore()
const { notify } = useToast()

function pick(t: TemplateDef) {
  store.loadDesign(t.build())
  notify(`Loaded “${t.name}” template`)
  emit('close')
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-6"
      @click.self="emit('close')"
    >
      <div class="w-full max-w-3xl overflow-hidden rounded-xl bg-surface shadow-2xl">
        <div class="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 class="flex items-center gap-2 text-sm font-semibold text-ink">
            <LayoutTemplate class="h-4 w-4" />
            Choose a template
          </h2>
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-md text-faint hover:bg-hover hover:text-ink"
            @click="emit('close')"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <div class="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
          <button
            v-for="t in TEMPLATES"
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
