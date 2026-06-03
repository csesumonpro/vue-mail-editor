<script setup lang="ts">
import { computed } from 'vue'
import type { Content } from '@/types/schema'
import { useEditor } from '@/core/useEditor'
import { useBlocks } from '@/core/registry'

const props = defineProps<{ content: Content }>()
const store = useEditor()
const blocks = useBlocks()

const def = computed(() => blocks.get(props.content.type))

const selected = computed(
  () =>
    store.selection.kind === 'content' && store.selection.id === props.content.id,
)
const editing = computed(() => selected.value && !store.previewMode)

function onUpdate(patch: Record<string, unknown>) {
  const key = `content:${props.content.id}:${Object.keys(patch).join(',')}`
  store.updateContentValues(props.content.id, patch, key)
}
</script>

<template>
  <component
    v-if="def"
    :is="def.render"
    :values="content.values"
    :selected="selected"
    :editing="editing"
    @update="onUpdate"
  />
</template>
