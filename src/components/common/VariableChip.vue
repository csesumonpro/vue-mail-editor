<script setup lang="ts">
import { computed } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import type { DesignVariable } from '@/types/schema'
import { formatToken } from '@/utils/variableToken'
import type { VariableOptions } from './VariableNode'

const props = defineProps(nodeViewProps)

const opts = computed(() => props.extension.options as VariableOptions)
const name = computed<string>(() => props.node.attrs.name ?? '')
const variable = computed<DesignVariable | undefined>(() => opts.value.getVariable(name.value))
const isPreview = computed(() => opts.value.isPreview())
const known = computed(() => !!variable.value)
// Merge-token literal built in script (a template interpolation can't hold one).
const display = computed(() => formatToken(name.value, opts.value.syntax))

// Defer the edit UI to RichTextEditor (rendered outside the contenteditable DOM
// so its buttons aren't swallowed by ProseMirror). Pass our position + doc pos.
function onClick(e: MouseEvent) {
  if (isPreview.value) return
  const pos = typeof props.getPos === 'function' ? props.getPos() : null
  if (pos == null) return
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  opts.value.onEdit({ name: name.value, pos, rect })
}
</script>

<template>
  <!-- Preview mode: render the fallback value as plain text, no chip. -->
  <NodeViewWrapper v-if="isPreview" as="span">{{ variable?.fallback ?? '' }}</NodeViewWrapper>

  <NodeViewWrapper v-else as="span" class="cvee-var" contenteditable="false">
    <span
      class="cvee-var-chip"
      :class="known ? '' : 'cvee-var-chip--unknown'"
      :data-selected="props.selected ? 'true' : undefined"
      @click="onClick"
    >{{ display }}</span>
  </NodeViewWrapper>
</template>
