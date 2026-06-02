<script setup lang="ts">
import { ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { CarouselValues } from '@/types/schema'
import { padding } from '@/utils/style'

const props = defineProps<{ values: CarouselValues }>()
const active = ref(0)

function step(delta: number) {
  const n = props.values.slides.length
  if (!n) return
  active.value = (active.value + delta + n) % n
}
</script>

<template>
  <div :style="{ padding: padding(values.padding) }" class="relative">
    <img
      v-if="values.slides.length"
      :src="values.slides[active]?.src"
      :alt="values.slides[active]?.alt"
      style="display: block; width: 100%; max-width: 100%"
    />

    <template v-if="values.slides.length > 1">
      <button
        type="button"
        class="absolute top-1/2 left-1 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
        @click.stop="step(-1)"
      >
        <ChevronLeft class="h-4 w-4" />
      </button>
      <button
        type="button"
        class="absolute top-1/2 right-1 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
        @click.stop="step(1)"
      >
        <ChevronRight class="h-4 w-4" />
      </button>
      <div class="mt-1 flex justify-center gap-1">
        <span
          v-for="(_, i) in values.slides"
          :key="i"
          class="h-1.5 w-1.5 rounded-full"
          :class="i === active ? 'bg-slate-600' : 'bg-slate-300'"
        />
      </div>
    </template>
  </div>
</template>
