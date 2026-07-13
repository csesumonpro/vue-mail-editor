<script setup lang="ts">
import { computed } from 'vue'
import type { DesignVariable } from '@/types/schema'
import { formatToken } from '@/utils/variableToken'
import { useConfig } from '@/core/useConfig'

const props = withDefaults(
  defineProps<{
    name: string
    type: DesignVariable['type']
    fallback: string
    /** Name is editable only when creating (locked once a variable exists). */
    nameEditable?: boolean
    /**
     * Locked registry: the host owns name and type, so show the fallback field
     * alone (the only thing the user may still change).
     */
    fallbackOnly?: boolean
    nameError?: string
  }>(),
  { nameEditable: true, fallbackOnly: false, nameError: '' },
)
const emit = defineEmits<{
  'update:name': [string]
  'update:type': [DesignVariable['type']]
  'update:fallback': [string]
}>()

const config = useConfig()
// Merge-token literals built in script (a template interpolation can't hold one).
const display = computed(() => formatToken(props.name, config.variableSyntax))
const placeholder = computed(() =>
  config.variableSyntax === 'double' ? '{{ YOUR_VARIABLE }}' : '{{{ YOUR_VARIABLE }}}',
)
</script>

<template>
  <div class="flex flex-col gap-3">
    <label v-if="!fallbackOnly" class="flex flex-col gap-1">
      <span class="text-xs font-medium text-subtle">Name</span>
      <input
        v-if="nameEditable"
        :value="name"
        :placeholder="placeholder"
        class="w-full rounded-md border bg-input px-2 py-1.5 font-mono text-xs text-ink outline-none focus:border-brand"
        :class="nameError ? 'border-danger' : 'border-line'"
        @input="emit('update:name', ($event.target as HTMLInputElement).value)"
      />
      <span
        v-else
        class="w-full rounded-md border border-line bg-muted px-2 py-1.5 font-mono text-xs text-subtle"
      >{{ display }}</span>
      <span v-if="nameError" class="text-[11px] text-danger">{{ nameError }}</span>
    </label>

    <label v-if="!fallbackOnly" class="flex flex-col gap-1">
      <span class="text-xs font-medium text-subtle">Type</span>
      <select
        :value="type"
        class="w-full rounded-md border border-line bg-input px-2 py-1.5 text-xs text-ink outline-none focus:border-brand"
        @change="emit('update:type', ($event.target as HTMLSelectElement).value as DesignVariable['type'])"
      >
        <option value="string">String</option>
        <option value="number">Number</option>
      </select>
    </label>

    <label class="flex flex-col gap-1">
      <span class="text-xs font-medium text-subtle">Fallback value</span>
      <input
        :value="fallback"
        placeholder="Value that appears if the variable is empty"
        class="w-full rounded-md border border-line bg-input px-2 py-1.5 text-xs text-ink outline-none focus:border-brand"
        @input="emit('update:fallback', ($event.target as HTMLInputElement).value)"
      />
    </label>
  </div>
</template>
