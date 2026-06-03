<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import type { Component } from 'vue'

const props = withDefaults(
  defineProps<{ title: string; icon?: Component; defaultOpen?: boolean }>(),
  { defaultOpen: true },
)

const open = ref(props.defaultOpen)
</script>

<template>
  <div class="border-b border-line">
    <button
      type="button"
      class="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-hover"
      @click="open = !open"
    >
      <span class="flex items-center gap-2.5">
        <component :is="icon" v-if="icon" class="h-4 w-4 text-faint" />
        <span class="text-sm font-semibold text-ink">{{ title }}</span>
      </span>
      <ChevronDown
        class="h-4 w-4 text-faint transition-transform"
        :class="{ '-rotate-180': open }"
      />
    </button>
    <div v-show="open" class="px-4 pt-1 pb-3">
      <slot />
    </div>
  </div>
</template>
