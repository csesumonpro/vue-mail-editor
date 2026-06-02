<script setup lang="ts">
import draggable from 'vuedraggable'
import type { Column, Content } from '@/types/schema'
import { padding, border } from '@/utils/style'
import { useEditorStore } from '@/stores/editor'
import SelectableWrapper from './SelectableWrapper.vue'
import ContentRenderer from './ContentRenderer.vue'

defineProps<{ column: Column }>()
const store = useEditorStore()

const valign: Record<string, string> = {
  top: 'flex-start',
  middle: 'center',
  bottom: 'flex-end',
}

const contentGroup = { name: 'content', pull: true, put: ['content'] }

// Select a block right after it is dropped in.
function onChange(evt: { added?: { element: Content } }) {
  if (evt.added) store.select('content', evt.added.element.id)
}
</script>

<template>
  <SelectableWrapper kind="column" :id="column.id" label="Column" class="h-full">
    <div
      class="relative flex h-full flex-col"
      :style="{
        backgroundColor:
          column.values.backgroundColor === 'transparent'
            ? undefined
            : column.values.backgroundColor,
        padding: padding(column.values.padding),
        border: border(column.values.border),
        borderRadius: column.values.borderRadius + 'px',
        justifyContent: valign[column.values.verticalAlign],
      }"
    >
      <draggable
        :list="column.contents"
        :group="contentGroup"
        item-key="id"
        handle=".content-drag-handle"
        :animation="150"
        ghost-class="drop-ghost"
        class="flex min-h-[40px] flex-1 flex-col"
        :disabled="store.previewMode"
        @start="store.beginDrag()"
        @end="store.endDrag()"
        @change="onChange"
      >
        <template #item="{ element }">
          <SelectableWrapper kind="content" :id="element.id" :label="element.type">
            <ContentRenderer :content="element" />
          </SelectableWrapper>
        </template>
      </draggable>

      <div
        v-if="!column.contents.length"
        class="pointer-events-none absolute inset-1 flex items-center justify-center rounded border border-dashed border-slate-300 text-[11px] text-slate-400"
      >
        Drop content here
      </div>
    </div>
  </SelectableWrapper>
</template>
