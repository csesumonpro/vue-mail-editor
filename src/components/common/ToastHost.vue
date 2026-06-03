<script setup lang="ts">
import { CheckCircle2, Info, AlertCircle } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const { state } = useToast()

const icons = {
  success: CheckCircle2,
  info: Info,
  error: AlertCircle,
}
const tones = {
  success: 'text-success',
  info: 'text-info',
  error: 'text-danger',
}
</script>

<template>
  <div class="pointer-events-none fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
    <TransitionGroup name="toast">
      <div
        v-for="t in state.items"
        :key="t.id"
        class="pointer-events-auto flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink shadow-lg"
      >
        <component :is="icons[t.type]" class="h-4 w-4" :class="tones[t.type]" />
        {{ t.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
