<script setup lang="ts">
defineOptions({ inheritAttrs: false })
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [boolean] }>()
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    class="relative h-5 w-9 shrink-0 rounded-full transition"
    :class="props.modelValue ? 'bg-brand' : 'bg-active'"
    @click="emit('update:modelValue', !props.modelValue)"
  >
    <!-- Knob: when ON it sits on the accent track, so use `on-accent` (white in
         light, dark in dark) for contrast in BOTH themes — a plain white knob
         was invisible on the near-white accent track in dark mode. -->
    <span
      class="absolute top-0.5 left-0.5 h-4 w-4 rounded-full shadow transition"
      :class="props.modelValue ? 'translate-x-4 bg-on-accent' : 'bg-white'"
    />
  </button>
</template>
