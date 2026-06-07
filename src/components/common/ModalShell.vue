<script setup lang="ts">
import { X } from 'lucide-vue-next'

// Shared modal chrome: fade transition, backdrop (closes on outside click), a
// header row (title slot + optional actions + close button), and the body.
// `fill` makes the card full-height with a scrollable flex body (e.g. the HTML
// export preview); otherwise the card sizes to its content (e.g. templates).
withDefaults(
  defineProps<{ open: boolean; maxWidth?: string; fill?: boolean }>(),
  { maxWidth: 'max-w-3xl', fill: false },
)
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <Transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-6"
      @click.self="emit('close')"
    >
      <div
        class="w-full overflow-hidden rounded-xl bg-surface shadow-2xl"
        :class="[maxWidth, fill ? 'flex h-full max-h-[85vh] flex-col' : '']"
      >
        <div class="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 class="flex items-center gap-2 text-sm font-semibold text-ink">
            <slot name="header" />
          </h2>
          <div class="flex items-center gap-2">
            <slot name="header-actions" />
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-md text-faint hover:bg-hover hover:text-ink"
              @click="emit('close')"
            >
              <X class="h-4 w-4" />
            </button>
          </div>
        </div>

        <div :class="fill ? 'min-h-0 flex-1 overflow-hidden' : ''">
          <slot />
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
