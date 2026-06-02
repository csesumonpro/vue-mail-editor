<script setup lang="ts">
import { computed } from 'vue'
import draggable from 'vuedraggable'
import { useEditorStore } from '@/stores/editor'
import { padding, bgImage } from '@/utils/style'
import RowRenderer from './RowRenderer.vue'

const store = useEditorStore()
const body = computed(() => store.design.body)

const selected = computed(() => store.selection.kind === 'body')

function selectBody() {
  if (store.previewMode) return
  store.selectBody()
}

const rowGroup = { name: 'rows', pull: true, put: ['rows'] }
</script>

<template>
  <div
    class="relative outline-offset-[-2px] transition-[outline]"
    :class="
      selected && !store.previewMode
        ? 'outline outline-2 outline-brand'
        : 'outline outline-2 outline-transparent'
    "
    :style="{
      backgroundColor: body.values.contentBackground,
      ...bgImage(body.values.backgroundImage),
      fontFamily: body.values.fontFamily.value,
      color: body.values.textColor,
      padding: padding(body.values.padding),
      direction: body.values.direction,
    }"
    @click="selectBody"
  >
    <draggable
      :list="body.rows"
      :group="rowGroup"
      item-key="id"
      handle=".row-drag-handle"
      :animation="150"
      ghost-class="drop-ghost"
      drag-class="dragging"
      class="min-h-[40px]"
      :disabled="store.previewMode"
      @start="store.beginDrag()"
      @end="store.endDrag()"
    >
      <template #item="{ element }">
        <RowRenderer :row="element" />
      </template>
    </draggable>

    <div
      v-if="!body.rows.length"
      class="pointer-events-none flex min-h-40 flex-col items-center justify-center gap-1 text-center text-slate-400"
    >
      <p class="text-sm font-medium">Empty email</p>
      <p class="text-xs">Drag a block from the left to get started.</p>
    </div>
  </div>
</template>
