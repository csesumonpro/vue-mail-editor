<script setup lang="ts">
import { computed, provide } from 'vue'
import RichTextEditor from './RichTextEditor.vue'
import { VARIABLES_KEY } from '@/core/keys'
import { createVariablesController } from '@/composables/useVariables'
import type { DesignVariable } from '@/types/schema'

/**
 * Standalone rich-text editor — the same engine the email editor uses, usable
 * on its own (no `<EmailEditor>` required, no extra dependency). Supports a
 * fixed or bubble toolbar and, opt-in, the `{{` template-variable system.
 */
const props = withDefaults(
  defineProps<{
    modelValue?: string
    /** Toolbar style: persistent bar, selection bubble, or none. */
    toolbar?: 'fixed' | 'bubble' | false
    lists?: boolean
    placeholder?: string
    editable?: boolean
    /**
     * Opt-in template variables. Provide an array (even `[]`) to enable the
     * `{{` autocomplete; use with `v-model:variables` to persist the registry.
     */
    variables?: DesignVariable[]
  }>(),
  {
    modelValue: '',
    toolbar: 'fixed',
    lists: true,
    placeholder: 'Type here…',
    editable: true,
  },
)
const emit = defineEmits<{
  'update:modelValue': [string]
  'update:variables': [DesignVariable[]]
}>()

const enableVariables = computed(() => props.variables !== undefined)

// Back the shared variable controller with the `variables` prop.
provide(
  VARIABLES_KEY,
  createVariablesController(
    computed(() => props.variables ?? []),
    (next) => emit('update:variables', next),
  ),
)
</script>

<template>
  <div class="vue-email-editor cvee-text-editor overflow-hidden rounded-md border border-line bg-surface">
    <RichTextEditor
      :model-value="modelValue"
      :editable="editable"
      :lists="lists"
      :toolbar="toolbar"
      :placeholder="placeholder"
      :enable-variables="enableVariables"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>
