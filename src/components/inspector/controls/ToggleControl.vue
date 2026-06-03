<script setup lang="ts">
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
    <span
      class="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition"
      :class="props.modelValue ? 'translate-x-4' : ''"
    />
  </button>
</template>
